// MovCuandoSi.tsx — S11 · UN MOVIMIENTO CONTINUO de 68 s (2040 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 1360,0.
//
// LA ESPINA: los seis casos en los que los paneles SÍ son la respuesta correcta, dichos sin vender
// nada — y el remate del video entero: veintitrés mil dólares para un problema de ciento veintiséis.
// Después de veinte minutos diciendo "no compres todavía", acá se dice cuándo SÍ. Tiene que sonar
// GENEROSO, no a concesión: las seis tarjetas se encienden en VERDE, una por una, con foto real
// adentro y en profundidad. Nadie está tratando de que no compres: se trata de que midas primero.
//
// ⛔⛔ ESTE MOVIMIENTO TAPA LA SEGUNDA COSTURA DEL BUCLE DEL AVATAR (1424,73 s = gFrame 1941).
//     Entre g1790 y g2040 el cuadro está OCUPADO A PANTALLA COMPLETA por la PLACA DE LA PINZA
//     (2280×1290 px, `objectFit: cover`, en un plano con la z de cámara CANCELADA → escala 1:1 en
//     pantalla, con 19% de sobremedida para que ni el `rotateY` ni la deriva abran un margen).
//     Y por debajo de todo, el root es un `AbsoluteFill` opaco (`V.ink0`) + `VoltAtmos`: no hay un
//     solo frame del movimiento en el que se pueda ver lo que hay abajo.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el exitTo del acto N                 ║
// ╠════╦════════════════════════════════════════════╦══════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto             ║ SALE: encuadre + luz + objeto            ║
// ╠════╬════════════════════════════════════════════╬══════════════════════════════════════════╣
// ║ 1  ║ CÁM: frontal y QUIETA, z −110, ry 0 —      ║ CÁM: z −110 → −20, EMPUJANDO hacia la    ║
// ║ g0 ║ exactamente donde la dejó MovDosCaminos.   ║      tarjeta del taller. No frena en la   ║
// ║    ║ LUZ: AMANECER LIMPIO PLENO (keyFrom 0.80,  ║      frontera: la atraviesa.              ║
// ║    ║ tint volt frontal suave, floor 0.42).      ║ LUZ: keyFrom 0.80 → 0.26 (la luz barre    ║
// ║    ║ MAT: el VIDRIO DEL PANEL — las seis        ║      con la cámara), int 0.86 → 0.98.     ║
// ║    ║ tarjetas de vidrio llegan desde abajo.     ║ MAT: LA TARJETA DEL TALLER, que ya está   ║
// ║    ║                                            ║      creciendo; las otras cinco vuelan    ║
// ║    ║                                            ║      POR DELANTE de la cámara.            ║
// ╠════╬════════════════════════════════════════════╬══════════════════════════════════════════╣
// ║ 2  ║ CÁM: z ≈ −20, adentro del taller, misma    ║ CÁM: z −20 → −140, retrocediendo con la  ║
// ║g420║ inercia de empuje.                         ║      misma curva (no corta).              ║
// ║    ║ LUZ: keyFrom 0.26 — la key entra por la    ║ LUZ: keyFrom 0.26 → 0.88: EL SOL CRUZA    ║
// ║    ║ izquierda como el sol de la mañana.        ║      EL CIELO de izquierda a derecha.     ║
// ║    ║ MAT: la ventana del taller (foto + clip    ║ MAT: EL ARCO DEL SOL, dibujado entero,    ║
// ║    ║ del polvo en el haz) + SunField abajo.     ║      con el sol clavado en el extremo.    ║
// ╠════╬════════════════════════════════════════════╬══════════════════════════════════════════╣
// ║ 3  ║ CÁM: z ≈ −140 retrocediendo, ya girando.   ║ CÁM: z −100 → −150, empezando a abrir     ║
// ║g900║ LUZ: keyFrom 0.88, int 1.02 (mediodía).    ║      para el plano del remate.            ║
// ║    ║ MAT: EL MISMO ARCO, que se aplana y se     ║ LUZ: keyFrom 0.88 → 0.60, se enfría un    ║
// ║    ║ vuelve la línea de los once años; el sol   ║      punto: es una cuenta, no una venta.  ║
// ║    ║ se encoge y deja el marcador del año 11.   ║ MAT: UNA TEJA del tejado sano, que se     ║
// ║    ║ Debajo entra el tejado sano desde abajo.   ║      suelta y cruza el cuadro.            ║
// ╠════╬════════════════════════════════════════════╬══════════════════════════════════════════╣
// ║ 4  ║ CÁM: z ≈ −150 abriendo (la teja tapa el    ║ CÁM: z −300 → −210, YA EMPUJANDO otra    ║
// ║g1380║ instante del cambio).                     ║      vez, ahora hacia el ticket.          ║
// ║    ║ LUZ: keyFrom 0.60 → 0.44, int 0.80: la     ║ LUZ: keyFrom 0.44, empezando a calentar   ║
// ║    ║ luz sobria del que hace una cuenta.        ║      (tint hacia ámbar).                  ║
// ║    ║ MAT: el canto de la teja se convierte en   ║ MAT: EL TICKET DE 126 — 168×104 px,       ║
// ║    ║ el canto del PRESUPUESTO de 23.000.        ║      minúsculo debajo del presupuesto.    ║
// ╠════╬════════════════════════════════════════════╬══════════════════════════════════════════╣
// ║ 5  ║ CÁM: z ≈ −210 empujando y BAJANDO a la     ║ CÁM: z −260, panY −34, a la altura de la ║
// ║g1740║ altura de la mano.                        ║      mano, cerrada sobre la pinza.        ║
// ║    ║ LUZ: keyFrom 0.44 → 0.62, tint volt→ámbar. ║ LUZ: CÁLIDA DE CIERRE (no es una alarma). ║
// ║    ║ MAT: el ticket, que se abre hasta ser la   ║ MAT: LA MORDAZA DE LA PINZA sobre la mesa ║
// ║    ║ mesa entera con la pinza encima.           ║      — el encuadre con el que abre        ║
// ║    ║                                            ║      MovCierre.                           ║
// ╚════╩════════════════════════════════════════════╩══════════════════════════════════════════╝
//
// COSTURAS — una distinta por frontera, ninguna es un fundido, ninguna baja un opacity a 0:
//   g420  1→2  MATCH-MOVE   — la cámara NO corta: sigue su empuje (camZ 58→134) y el mundo cambia
//                             debajo. Las cinco tarjetas que no son el taller salen con el MISMO
//                             vector (z hacia +640: pasan POR DELANTE del lente), y la del taller
//                             crece de 380×238 a 1160×652 sin re-encuadrar el material. Nada
//                             aparece ni desaparece: todo entra y sale por geometría.
//   g900  2→3  MATCH-SHAPE  — EL ARCO. La misma curva cuadrática (mismo trazo, mismo `pathLength`)
//                             interpola sus tres puntos de control: la cúpula del sol (250,330 ·
//                             600,20 · 950,330) se APLANA y se ENSANCHA hasta ser la línea de los
//                             once años (70,300 · 600,150 · 1130,300). El sol, que está clavado en
//                             el extremo derecho, se encoge a 0 mientras el disco del año ONCE
//                             crece desde 0 en el mismo punto: un objeto entrega y el otro recibe.
//   g1380 3→4  OCLUSIÓN     — `SeamOcclude` en `V.roof` (luma 91 → el componente lo lleva a 76: ni
//                             flash blanco ni fundido a negro) + MI TEJA en primer plano (z +280),
//                             con su trama y su canto iluminado, cruzando el cuadro. Detrás YA está
//                             el presupuesto subiendo: cuando la teja despeja, el canto de la teja
//                             es el canto del papel.
//   g1740 4→5  MATCH-SHAPE  — EL TICKET. El mismo rectángulo (mismo marco, mismo material adentro)
//                             se abre de 168×104 a 2280×1290 y se vuelve la mesa entera. Es también
//                             lo que garantiza el cuadro lleno sobre la costura del avatar (g1941).
//
// EL OBJETO QUE CRUZA CADA FRONTERA Y EN QUÉ SE TRANSFORMA:
//   F1 la TARJETA DEL TALLER (una de las seis) → la VENTANA del taller a casi pantalla completa.
//   F2 el ARCO DEL SOL (9→16 h)               → el ARCO DE LOS ONCE AÑOS (y el sol → el año 11).
//   F3 la TEJA del tejado sano                → el CANTO DEL PRESUPUESTO de 23.000.
//   F4 el TICKET DE 126                       → la MESA con la PINZA (la placa de cierre).
//
// ⛔ CONTRATO: sin Math.random/Date.now (todo sale de `rnd(k)` y de `g`) · sin `position: fixed` ·
// ⛔ una sola capa con `filter: blur()` · rutas SOLO literales de la ficha · sin `<Sequence>`.
// ⚠️ Los clips duran 153 frames EXACTOS y `MediaCard` los loopea contra el frame LOCAL: por eso
//    toda ventana de clip arranca en un múltiplo de 153 (459, 765, 1836) → el clip entra en su
//    frame 0 (que ES la foto de base) y nunca se rebobina en pantalla.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, SunField, RoofPlane, Layers, Plane, MediaCard, IconPng,
  Readout, SeamOcclude,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 2040;
const A2 = 420;
const A3 = 900;
const A4 = 1380;
const A5 = 1740;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ── MARCO: el vidrio que RECORTA el material. Es la primitiva del movimiento: el mismo marco que
//    era una de las seis tarjetas se abre y se vuelve el taller; el que era el ticket se abre y se
//    vuelve la mesa. Adentro va SIEMPRE material real.
const Marco: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  lit?: number; litColor?: string; opacity?: number; borde?: number;
  children: React.ReactNode;
}> = ({
  x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, radius = 12,
  lit = 1, litColor = V.volt, opacity = 1, borde = 1, children,
}) => {
  const ww = Math.max(8, w);
  const hh = Math.max(8, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      border: `${borde}px solid ${rgba(litColor, 0.30 * lit)}`,
      boxShadow: `0 ${Math.round(hh * 0.15)}px ${Math.round(hh * 0.24)}px ${rgba(V.ink0, 0.78)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.6)}, inset 0 1px 0 ${rgba(V.white, 0.26 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL adentro del marco: la FOTO siempre (con recorte animado = nunca queda quieta) y el
//    CLIP encima sólo en su ventana viva. `k` es el zoom de recorte (≥1: la foto siempre cubre).
const Material: React.FC<{
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

// ── PIE DE CASO: el rótulo que se enciende en VERDE cuando el caso queda validado.
//    Va DENTRO del marco, con su propia cama de degradado (nunca texto suelto sobre la foto).
const PieCaso: React.FC<{ texto: string; on: number; verde: number; size?: number }> = ({
  texto, on, verde, size = 21,
}) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      padding: "30px 12px 11px", opacity: clamp01(on),
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.92) 58%)",
      display: "flex", alignItems: "center", gap: 9,
    }}>
      {/* la marca de validado: un disco que se llena de volt y una tilde dibujada con dos barras */}
      <div style={{
        width: 22, height: 22, borderRadius: 11, flex: "0 0 auto", position: "relative",
        border: `2px solid ${rgba(V.volt, 0.28 + 0.66 * verde)}`,
        background: rgba(V.volt, 0.06 + 0.36 * verde),
        boxShadow: verde > 0.2 ? `0 0 ${Math.round(6 + 16 * verde)}px ${rgba(V.volt, 0.5 * verde)}` : "none",
      }}>
        <div style={{
          position: "absolute", left: 5, top: 11, width: 6, height: 2.4, borderRadius: 2,
          background: rgba(V.ink0, 0.9), transform: `rotate(44deg) scaleX(${clamp01(verde * 1.6)})`,
          transformOrigin: "0% 50%", opacity: verde,
        }} />
        <div style={{
          position: "absolute", left: 8.6, top: 12.4, width: 10, height: 2.4, borderRadius: 2,
          background: rgba(V.ink0, 0.9), transform: `rotate(-48deg) scaleX(${clamp01(verde * 1.6 - 0.4)})`,
          transformOrigin: "0% 50%", opacity: verde,
        }} />
      </div>
      <span style={{
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 1.5, lineHeight: 1.12,
        textTransform: "uppercase",
        color: light(clamp01(verde), "white", "volt"),
        textShadow: "0 3px 14px rgba(0,0,0,0.92)",
      }}>{texto}</span>
    </div>
  );
};

// ── EL ARCO — el objeto que cruza la frontera 2→3 y se transforma.
//    UNA sola curva cuadrática. `m` = 0 es la cúpula del sol (9→16 h); `m` = 1 es la línea larga y
//    baja de los once años. El trazo NO se corta ni se redibuja: interpolan sus puntos de control.
const VB_W = 1200;
const VB_H = 420;
const ARCO_W = 1520;
const ARCO_K = ARCO_W / VB_W;
const bez = (p0: number, c: number, p1: number, t: number) =>
  (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * c + t * t * p1;

const ArcoVivo: React.FC<{
  m: number;        // 0 = arco del sol · 1 = arco de los once años
  dib: number;      // 0..1 cuánto del trazo está dibujado (el sol lo va dibujando al cruzar)
  anios: number;    // 0..1 cuánto del tramo "tus diez años" está marcado
  solT: number;     // posición del sol sobre la curva
  solSize: number;  // el sol se encoge a 0 en la costura
  discoS: number;   // y el disco del año ONCE crece desde 0 en el mismo punto
  y: number; on: number;
}> = ({ m, dib, anios, solT, solSize, discoS, y, on }) => {
  if (on <= 0.01) return null;
  const p0x = lerp(250, 70, m), p0y = lerp(330, 300, m);
  const ccx = 600, ccy = lerp(20, 150, m);
  const p1x = lerp(950, 1130, m), p1y = lerp(330, 300, m);
  const d = `M ${p0x.toFixed(1)} ${p0y.toFixed(1)} Q ${ccx} ${ccy.toFixed(1)} ${p1x.toFixed(1)} ${p1y.toFixed(1)}`;
  const px = (t: number) => bez(p0x, ccx, p1x, t) * ARCO_K;
  const py = (t: number) => bez(p0y, ccy, p1y, t) * ARCO_K;
  const H = VB_H * ARCO_K;
  const marcas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div style={{
      position: "absolute", left: "50%", top: `${y}%`, width: ARCO_W, height: H,
      marginLeft: -ARCO_W / 2, marginTop: -H / 2, opacity: clamp01(on),
    }}>
      {/* cama: el arco vive sobre material real, así que se gana su legibilidad con una sombra */}
      <div style={{
        position: "absolute", inset: "-14% -6%",
        background: `radial-gradient(62% 58% at 50% 46%, rgba(8,9,6,0.62) 0%, rgba(8,9,6,0) 72%)`,
      }} />
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width={ARCO_W} height={H}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* el riel completo: siempre está, apenas insinuado */}
        <path d={d} fill="none" stroke={rgba(V.white, 0.18)} strokeWidth={2} strokeDasharray="7 9" />
        {/* el trazo VIVO: lo dibuja el sol al cruzar, y en el acto 3 sigue ahí sin retraerse */}
        <path d={d} fill="none" pathLength={1000}
          stroke={rgba(V.volt, 0.9)} strokeWidth={5} strokeLinecap="round"
          strokeDasharray={`${(1000 * clamp01(dib)).toFixed(1)} 1000`} />
        {/* el tramo "TUS DIEZ AÑOS": se marca encima, más grueso, sin borrar nada */}
        {anios > 0.004 && (
          <path d={d} fill="none" pathLength={1000}
            stroke={rgba(V.volt, 0.34)} strokeWidth={17} strokeLinecap="round"
            strokeDasharray={`${(1000 * clamp01(anios) * (10 / 11)).toFixed(1)} 1000`} />
        )}
      </svg>
      {/* las once marcas del año: aparecen por ESCALA (nunca por opacidad suelta) */}
      {m > 0.12 && marcas.map((i) => {
        const t = i / 10;
        const s = clamp01((anios * 11 - i) / 0.9);
        if (s <= 0.01) return null;
        const grande = i === 9 || i === 10 || i === 0 || i === 4;
        return (
          <div key={i} style={{
            position: "absolute", left: px(t), top: py(t),
            transform: `translate(-50%,-50%) scale(${s.toFixed(3)})`,
          }}>
            <div style={{
              width: grande ? 13 : 8, height: grande ? 13 : 8, borderRadius: 8, marginLeft: grande ? -6.5 : -4,
              background: rgba(i === 10 ? V.amber : V.volt, 0.9),
              boxShadow: `0 0 ${grande ? 16 : 8}px ${rgba(i === 10 ? V.amber : V.volt, 0.6)}`,
            }} />
            {grande && (
              <div style={{
                position: "absolute", left: 0, top: 17, transform: "translateX(-50%)",
                padding: "2px 8px", borderRadius: 6, background: rgba(V.ink0, 0.82),
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 22, lineHeight: 1.1,
                color: i === 10 ? V.amber : rgba(V.white, 0.86),
                textShadow: "0 3px 12px rgba(0,0,0,0.9)",
              }}>{i + 1}</div>
            )}
          </div>
        );
      })}
      {/* EL SOL sobre la curva — se encoge a 0 en la costura */}
      {solSize > 1 && (
        <div style={{ position: "absolute", left: px(solT), top: py(solT), width: 0, height: 0 }}>
          <div style={{
            position: "absolute", left: 0, top: 0, width: solSize * 2.9, height: solSize * 2.9,
            marginLeft: -solSize * 1.45, marginTop: -solSize * 1.45, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(V.amber, 0.34)} 0%, rgba(0,0,0,0) 68%)`,
          }} />
          <IconPng src="img/cmeurgente/cmeu_ic_sol.png" x={0} y={0} size={solSize} z={0} glow={V.ink0} />
        </div>
      )}
      {/* EL DISCO DEL AÑO ONCE — crece desde 0 en el MISMO punto donde el sol se apagó */}
      {discoS > 0.02 && (
        <div style={{
          position: "absolute", left: px(1), top: py(1),
          transform: `translate(-50%,-50%) scale(${discoS.toFixed(3)})`,
        }}>
          <div style={{
            width: 92, height: 92, borderRadius: 46, marginLeft: -46, marginTop: -46,
            border: `3px solid ${rgba(V.amber, 0.85)}`, background: rgba(V.ink0, 0.72),
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 30px ${rgba(V.amber, 0.34)}`,
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 46, color: V.amber,
          }}>11</div>
        </div>
      )}
    </div>
  );
};

// ── LA TEJA — la materia de la frontera 3→4. Cruza el cuadro en primer plano, con su trama y su
//    canto iluminado; detrás ya está subiendo el presupuesto. No es un cartel: es un objeto.
const Teja: React.FC<{ p: number }> = ({ p }) => {
  if (p <= 0 || p >= 1) return null;
  const env = Math.sin(clamp01(p) * Math.PI);
  return (
    <div style={{
      position: "absolute", left: `${lerp(-128, 128, p).toFixed(1)}%`, top: "-30%",
      width: "168%", height: "170%", marginLeft: "-84%",
      transform: `rotate(${lerp(-13, -6, p).toFixed(2)}deg)`,
      borderRadius: 26, overflow: "hidden",
      background:
        `linear-gradient(97deg, rgba(0,0,0,0) 0%, ${rgba(V.roof, 0.55 * env)} 6%, ` +
        `${rgba(V.roof, 0.30 * env)} 26%, ${rgba(V.ink1, 0.42 * env)} 62%, ${rgba(V.roof, 0.34 * env)} 94%, rgba(0,0,0,0) 100%)`,
      boxShadow: `inset 0 3px 0 ${rgba(V.bone, 0.16 * env)}, inset 0 -8px 40px ${rgba(V.ink0, 0.7 * env)}`,
    }}>
      <AbsoluteFill style={{
        opacity: 0.3 * env, mixBlendMode: "overlay",
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,.34) 0 2px, rgba(0,0,0,0) 2px 46px)," +
          "repeating-linear-gradient(90deg, rgba(0,0,0,.5) 0 2px, rgba(0,0,0,0) 2px 118px)",
      }} />
    </div>
  );
};

// ── LOS SEIS CASOS. Foto real adentro, en PROFUNDIDAD (nunca una grilla plana): cada uno tiene su
//    z, su giro y su hora de encendido. `salida` es el vector del MATCH-MOVE: los cinco que no son
//    el taller se van hacia el lente y pasan POR DELANTE.
type Caso = {
  photo: string; texto: string;
  x: number; y: number; z: number; ry: number; rx: number;
  k: number; cx: number; cy: number;
  entra: number; prende: number;
  sx: number;              // x al que vuela en la salida
  sz: number;              // z al que vuela (positivo = pasa por delante)
};
const CASOS: Caso[] = [
  { photo: "img/cmeurgente/cmeu_tejado_sano.jpg", texto: "El tejado está sano",
    x: 19, y: 29, z: -190, ry: 15, rx: 2, k: 1.5, cx: 44, cy: 42, entra: 34, prende: 112, sx: -52, sz: 700 },
  { photo: "img/cmeurgente/cmeu_bomba_dia.jpg", texto: "Tienes una bomba",
    x: 79, y: 28, z: -168, ry: -15, rx: 2, k: 1.4, cx: 56, cy: 46, entra: 58, prende: 158, sx: 152, sz: 660 },
  { photo: "img/cmeurgente/cmeu_pinza_mesa.jpg", texto: "Ya mediste la casa",
    x: 15, y: 67, z: -74, ry: 12, rx: -3, k: 1.7, cx: 48, cy: 54, entra: 82, prende: 204, sx: -58, sz: 780 },
  { photo: "img/cmeurgente/cmeu_tejado_sano.jpg", texto: "Te quedas diez años",
    x: 83, y: 66, z: -252, ry: -17, rx: -3, k: 2.1, cx: 66, cy: 60, entra: 106, prende: 250, sx: 158, sz: 620 },
  { photo: "img/cmeurgente/cmeu_taller_dia.jpg", texto: "Arreglaste lo barato",
    x: 50, y: 81, z: -392, ry: 3, rx: -5, k: 2.3, cx: 40, cy: 62, entra: 130, prende: 296, sx: 50, sz: 900 },
];

export const MovCuandoSi: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El reloj es CONTINUO. `off` traduce global → local para los componentes del Stage que razonan
  // en frames locales (`at` / `sheenAt`): con una sola Sequence `off` vale 0, y con varias sigue bien.
  const lFrame = useCurrentFrame();
  const off = (gFrame ?? lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame as number)
    ? (gFrame as number)
    : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola, función de g, que NUNCA vuelve a cero ════════════════════════════
  // El viaje: −110 (frontal, quieta, como la dejó MovDosCaminos) → −20 (adentro del taller) →
  // −140 (sale con el sol) → −100 (entra al tejado) → −300 (abre para ver la desproporción) →
  // −260 (cierra sobre la pinza, a la altura de la mano). Un solo viaje, no cinco.
  const camB = gcam(g, { z0: -110, z1: -180, panX: -16, panY: -34, ry: -3.4, rx: 1.3, dur: END });
  const camZ = ip(g,
    [0, 150, 300, 420, 560, 700, 900, 1040, 1200, 1330, 1380, 1470, 1560, 1660, 1740, 1800, 1860, 1950, 2040],
    [0, 16, 58, 134, 118, 84, 31, 52, 76, 44, 27, -58, -122, -84, -32, -44, -58, -70, -80]);
  const camDrop = ip(g, [0, 420, 900, 1380, 1560, 1740, 1900, 2040],
    [0, -2, -6, -14, -22, -42, -52, -58]);
  const camTilt = ip(g, [0, 900, 1380, 1740, 2040], [0, -0.5, -1.1, -2.6, -3.4]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg)`;
  // La z TOTAL de la cámara. La placa de cierre vive en un plano que la CANCELA (escala 1:1 en
  // pantalla) — es lo que garantiza el cuadro lleno sobre la costura del avatar.
  const zTot = camB.z + camZ;
  // la deriva del lente, replicada al 42% para el HUD: el texto no queda pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.42).toFixed(2)}px, ${(by * 0.42).toFixed(2)}px)`;

  // ══ LA LUZ — amanecer limpio pleno → el sol cruza el cielo → cuenta sobria → cálida de cierre ═
  const keyFrom = ip(g, [0, 200, 420, 560, 880, 1060, 1380, 1560, 1740, 1900, 2040],
    [0.80, 0.62, 0.26, 0.34, 0.88, 0.86, 0.60, 0.46, 0.44, 0.54, 0.62]);
  const inten = ip(g, [0, 180, 420, 700, 900, 1200, 1380, 1560, 1740, 2040],
    [0.86, 0.92, 0.98, 1.00, 1.02, 0.96, 0.88, 0.80, 0.86, 0.94]);
  const floor = ip(g, [0, 420, 900, 1380, 1740, 2040], [0.42, 0.46, 0.50, 0.56, 0.58, 0.50]);
  const tintA = light(ip(g, [0, 420, 760, 900, 1200, 1380, 1620, 1800, 2040],
    [0, 0.10, 0.52, 0.44, 0.20, 0.26, 0.34, 0.58, 0.74]), "volt", "amber");
  const tintB = light(ip(g, [0, 420, 900, 1380, 1740, 2040], [0.06, 0.20, 0.46, 0.30, 0.62, 0.86]), "sky", "amber");

  // ══ ACTO 1 · LAS SEIS TARJETAS ═════════════════════════════════════════════════════════════
  // Cada una llega desde abajo y desde el fondo, y se ENCIENDE EN VERDE a su hora. La sexta es la
  // del taller y NO se va: crece hasta ser el acto 2.
  const salida = ip(g, [356, 452], [0, 1]);

  // LA TARJETA DEL TALLER — vive de g0 a g1010 sin desmontarse nunca. Es el objeto de la F1.
  const kT = [0, 26, 150, 300, 360, 420, 470, 700, 860, 916, 1010];
  const wT = ip(g, kT, [380, 380, 380, 380, 452, 900, 1160, 1160, 1160, 1060, 880]);
  const hT = ip(g, kT, [238, 238, 238, 238, 282, 520, 652, 652, 652, 596, 494]);
  const xT = ip(g, kT, [44, 44, 44, 44, 44, 47, 50, 50, 50, 30, -58]);
  const yT = ip(g, kT, [46, 45, 45, 45, 45, 50, 54, 54, 54, 50, 40]);
  const zT = ip(g, kT, [10, 30, 40, 40, 62, 30, -30, -30, -30, -220, -520]);
  const ryT = ip(g, kT, [-6, -1.5, -1.5, -1.5, -1, -0.4, 0, 0, 0, 9, 26]);
  const rxT = ip(g, kT, [4, 0.5, 0.5, 0.5, 0.4, 0.2, 0, 0, 0, 2, 6]);
  const litT = ip(g, kT, [0.34, 0.42, 0.42, 1, 1, 1, 1, 1, 1, 0.86, 0.5]);
  const opT = ip(g, [0, 16], [0, 1]);
  const verdeT = ip(g, [66, 78, 96], [0, 1, 0.66]);
  // el recorte NO se re-encuadra en la costura: por eso el marco crece y el material lo acompaña
  const kbT = Math.max(1.05, ip(g, [0, 300, 360, 420, 470, 860, 1010],
    [560, 560, 640, 1240, 1310, 1256, 1080]) / Math.max(40, wT));
  // ventanas de clip alineadas al múltiplo de 153: el clip entra en su frame 0 (= la foto)
  const vidT = g < 459 ? 0 : (g < 700 ? ip(g, [459, 468, 596, 616], [0, 1, 1, 0]) : ip(g, [765, 774, 884, 906], [0, 1, 1, 0]));

  // ══ ACTO 2 · EL SOL QUE CRUZA ══════════════════════════════════════════════════════════════
  const solT = ip(g, [446, 470, 866], [0, 0, 1]);
  const dibujo = ip(g, [446, 470, 866], [0, 0, 1]);
  const morf = ipe(g, [858, 962], [0, 1], Easing.bezier(0.5, 0, 0.3, 1));
  const solSize = ip(g, [440, 486, 862, 918], [0, 104, 104, 0]);
  const discoS = ip(g, [906, 966], [0, 1]);
  const arcoY = ip(g, [420, 900, 1180, 1340, 1382], [17, 17, 22, 22, -34]);
  const arcoOn = ip(g, [432, 466, 1338, 1372], [0, 1, 1, 0.9]);
  const sunOn = ip(g, [452, 496, 836, 884], [0, 0.94, 0.94, 0]);
  const sunUse = ip(g, [520, 700], [0, 0.62]);

  // ══ ACTO 3 · LOS ONCE AÑOS ═════════════════════════════════════════════════════════════════
  const anios = ip(g, [986, 1194], [0, 1]);
  const anioNum = Math.max(1, Math.round(ip(g, [986, 1194], [1, 11])));
  // el tejado sano entra POR GEOMETRÍA desde abajo, ya cruzando la frontera
  const kR = [846, 900, 986, 1240, 1330, 1380];
  const wR = ip(g, kR, [1040, 1088, 1160, 1160, 1210, 1250]);
  const hR = ip(g, kR, [592, 620, 660, 660, 690, 712]);
  const yR = ip(g, kR, [146, 92, 60, 58, 56, 54]);
  const zR = ip(g, kR, [-330, -180, -60, -50, -14, 26]);
  const litR = ip(g, kR, [0.3, 0.66, 1, 1, 1, 1]);
  const kbR = Math.max(1.05, ip(g, [846, 986, 1240, 1380], [1420, 1290, 1240, 1330]) / Math.max(40, wR));

  // ══ ACTO 4 · EL PRESUPUESTO ENORME Y EL TICKET MINÚSCULO ═══════════════════════════════════
  // El canto de la teja se vuelve el canto del papel: el presupuesto YA está subiendo detrás de
  // la oclusión, así que cuando la teja despeja no aparece nada — ya estaba ahí, en movimiento.
  const kP = [1364, 1400, 1462, 1600, 1700, 1740];
  const wP = ip(g, kP, [980, 1010, 1042, 1042, 1042, 1042]);
  const hP = ip(g, kP, [430, 452, 470, 470, 470, 470]);
  const yP = ip(g, kP, [86, 46, 30, 30, 29, 28]);
  const zP = ip(g, kP, [-260, -120, -40, -40, -30, -20]);
  const litP = ip(g, kP, [0.24, 0.7, 1, 1, 1, 1]);
  const paneles = ip(g, [1424, 1552], [0, 1]);
  const bigNum = ip(g, [1440, 1470, 1494, 1520], [0, 9400, 18600, 23000]);

  // EL TICKET — 168×104. Es lo que se abre en la F4 hasta ser la mesa entera (2280×1290).
  const kK = [1470, 1520, 1600, 1700, 1740, 1770, 1806, 1900, 2040];
  const wK = ip(g, kK, [128, 168, 168, 168, 240, 760, 1640, 2240, 2280]);
  const hK = ip(g, kK, [80, 104, 104, 104, 148, 452, 928, 1266, 1290]);
  const xK = ip(g, kK, [56, 56, 56, 56, 55.4, 53.4, 51, 50, 50]);
  const yK = ip(g, kK, [82, 76, 76, 76, 74.4, 66, 55, 50, 50]);
  const ryK = ip(g, kK, [-8, -5, -4, -3.4, -2.6, -1.4, -0.5, 0, 0]);
  const rotK = ip(g, kK, [2.4, 1.6, 1.4, 1.2, 0.9, 0.4, 0.1, 0, 0]);
  const radK = ip(g, kK, [7, 7, 7, 7, 8, 10, 8, 2, 0]);
  const bordeK = ip(g, [1700, 1806, 1880], [1, 1, 0]);
  const opK = ip(g, [1466, 1482], [0, 1]);
  const kbK = Math.max(1.05, ip(g, kK, [300, 330, 330, 330, 430, 1080, 1900, 2400, 2440]) / Math.max(40, wK));
  const placa = ip(g, [1700, 1806], [0, 1]);          // 0 = ticket en el mundo · 1 = placa a sangre
  const zK = lerp(70, -zTot, placa);                  // al final CANCELA la cámara: escala 1:1
  const litK = ip(g, [1470, 1520, 1740, 1806, 2040], [0.5, 0.88, 1, 1, 1]);
  // el clip de la pinza: arranca en g1836 = 12 × 153 → entra en su frame 0 (que ES la foto)
  const vidK = ip(g, [1836, 1844, 1962, 1988], [0, 1, 1, 0]);

  // ══ TEXTOS — una idea por acto, cada una viva más que su piso de lectura ═══════════════════
  const t1 = ip(g, [66, 92, 366, 392], [0, 1, 1, 0]);        // CÓMPRALOS            (10,9 s)
  const t2 = ip(g, [472, 500, 838, 864], [0, 1, 1, 0]);      // BAJO EL SOL          (13,1 s)
  const t3 = ip(g, [958, 986, 1302, 1330], [0, 1, 1, 0]);    // DIEZ AÑOS            (12,4 s)
  const t4 = ip(g, [1436, 1466, 1686, 1712], [0, 1, 1, 0]);  // 23.000 / 126          (9,2 s)
  const t5 = ip(g, [1798, 1828], [0, 1]);                    // MÍDELO                (8,1 s)
  const capSol = ip(g, [500, 528, 842, 866], [0, 1, 1, 0]);
  const capAnio = ip(g, [1180, 1210, 1300, 1326], [0, 1, 1, 0]);

  // el haz del taller que pasa POR DELANTE del lente (única capa con blur del archivo)
  const hazX = ip(g, [430, 900], [-24, 116]);
  const hazOn = ip(g, [440, 500, 800, 880], [0, 0.5, 0.5, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca; sólo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ EL ESPACIO 3D — planos con parallax propio, bajo UNA sola cámara ═══════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · EL TEJADO del escenario: limpio en el acto 3, y se llena de azul cuando
            llega el presupuesto de 23.000 (lo que TODAVÍA no hay que comprar). ---------------- */}
        {g >= 906 && g < 1740 && (
          <RoofPlane
            y={ip(g, [906, 1060, 1380, 1560, 1740], [104, 88, 86, 92, 108])}
            w={1680} h={340} rx={60}
            lit={ip(g, [906, 1000, 1380, 1700], [0, 0.72, 0.86, 0.4])}
            z={-320}
            panels={ip(g, [1390, 1560], [0, 1])} />
        )}

        {/* PLANO 2 · el aire: la rejilla de profundidad del amanecer -------------------------- */}
        <Plane z={-470}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.8).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [0, 160, 900, 1380, 1700, 1806], [0.06, 0.22, 0.20, 0.14, 0.06, 0]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.09)} 0 1px, rgba(0,0,0,0) 1px 112px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.06)} 0 1px, rgba(0,0,0,0) 1px 112px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO 3 · LOS CINCO CASOS que no son el taller. Llegan desde abajo y desde el fondo,
            se encienden en verde uno por uno, y en la F1 vuelan POR DELANTE del lente. -------- */}
        {g < 470 && (
          <Plane z={0}>
            {CASOS.map((c, i) => {
              const ent = ip(g, [c.entra, c.entra + 30], [0, 1]);
              const sal = ip(g, [356 + i * 7, 452], [0, 1]);
              const easeIn = ipe(g, [c.entra, c.entra + 38], [0, 1], Easing.out(Easing.cubic));
              const xx = lerp(c.x, c.sx, ipe(g, [356 + i * 7, 452], [0, 1], Easing.in(Easing.cubic)));
              const yy = lerp(c.y + 17 * (1 - easeIn), c.y + (c.y > 50 ? 22 : -18), sal);
              const zz = lerp(lerp(c.z - 240, c.z, easeIn), c.sz, ipe(g, [356 + i * 7, 452], [0, 1], Easing.in(Easing.cubic)));
              const verde = ip(g, [c.prende, c.prende + 11, c.prende + 24], [0, 1, 0.66]);
              const lit = ip(g, [c.prende - 6, c.prende + 14], [0.36, 1]);
              return (
                <Marco key={i} x={xx} y={yy} w={380} h={238} z={zz}
                  ry={lerp(c.ry, c.ry * 2.4, sal)} rx={c.rx} radius={12}
                  lit={lit} litColor={verde > 0.2 ? V.volt : V.steel} opacity={ent}>
                  <Material photo={c.photo} w={380} h={238} k={c.k}
                    cx={c.cx + Math.sin(g / (210 + i * 24)) * 2.4}
                    cy={c.cy + Math.cos(g / (250 + i * 21)) * 1.8}
                    lit={lit} litColor={V.volt} sheenAt={L(c.prende - 2)} />
                  <PieCaso texto={c.texto} on={ip(g, [c.prende - 10, c.prende + 6], [0, 1])} verde={verde} />
                  {/* el anillo de validado: la tarjeta entera se ribetea de verde */}
                  <AbsoluteFill style={{
                    boxShadow: `inset 0 0 0 2px ${rgba(V.volt, 0.62 * verde)}, inset 0 0 34px ${rgba(V.volt, 0.24 * verde)}`,
                    borderRadius: 12,
                  }} />
                </Marco>
              );
            })}
          </Plane>
        )}

        {/* PLANO 4 · LA TARJETA DEL TALLER — la que cruza la F1 y se vuelve el acto 2 --------- */}
        {g < 1014 && (
          <Plane z={0}>
            <Marco x={xT} y={yT} w={wT} h={hT} z={zT} ry={ryT} rx={rxT}
              radius={g < 420 ? 12 : 14} lit={litT} litColor={verdeT > 0.2 || g > 300 ? V.volt : V.steel} opacity={opT}>
              <Material photo="img/cmeurgente/cmeu_taller_dia.jpg" clip="broll/cmeurgente/cmeu_taller_mov.mp4"
                vid={vidT} w={wT} h={hT} k={kbT}
                cx={48 + Math.sin(g / 268) * 3.1} cy={50 + Math.cos(g / 312) * 2.3}
                lit={litT} litColor={V.volt} sheenAt={L(64)} />
              <PieCaso texto="Trabajas de día" on={ip(g, [56, 72, 372, 392], [0, 1, 1, 0])} verde={verdeT} size={g < 420 ? 21 : 26} />
              <AbsoluteFill style={{
                boxShadow: `inset 0 0 0 2px ${rgba(V.volt, 0.62 * verdeT * ip(g, [360, 440], [1, 0]))}`,
                borderRadius: 12,
              }} />
              {/* la luz del sol que entra por la persiana, adentro del propio material */}
              <AbsoluteFill style={{
                background: `radial-gradient(64% 74% at ${(18 + 54 * clamp01((g - 430) / 440)).toFixed(1)}% 8%, ` +
                  `${rgba(V.torch, 0.20 * ip(g, [420, 500, 880], [0, 1, 0.7]))} 0%, rgba(0,0,0,0) 62%)`,
              }} />
            </Marco>
          </Plane>
        )}

        {/* PLANO 5 · EL TEJADO SANO — sube desde abajo CRUZANDO la frontera 2→3 -------------- */}
        {g >= 842 && g < 1392 && (
          <Plane z={0}>
            <Marco x={ip(g, [846, 986, 1380], [52, 50, 50])} y={yR} w={wR} h={hR} z={zR}
              ry={ip(g, [846, 986, 1380], [-5, -1.2, 0.6])} rx={ip(g, [846, 986], [7, 0])}
              radius={14} lit={litR} litColor={V.volt}>
              <Material photo="img/cmeurgente/cmeu_tejado_sano.jpg" w={wR} h={hR} k={kbR}
                cx={50 + Math.sin(g / 296) * 3.4} cy={52 + Math.cos(g / 338) * 2.6}
                lit={litR} litColor={V.volt} sheenAt={L(1004)} />
              <PieCaso texto="Tejas nuevas, sin remiendos" on={ip(g, [1030, 1056, 1310, 1338], [0, 1, 1, 0])} verde={1} size={24} />
            </Marco>
          </Plane>
        )}

        {/* PLANO 6 · EL ARCO — objeto de la frontera 2→3, del sol a los once años ------------ */}
        {g >= 428 && g < 1384 && (
          <Plane z={70}>
            <ArcoVivo m={morf} dib={dibujo} anios={g < 906 ? 0 : anios} solT={solT}
              solSize={solSize} discoS={discoS} y={arcoY} on={arcoOn} />
          </Plane>
        )}

        {/* PLANO 7 · EL PRESUPUESTO ENORME — foto real de tejado con los paneles del vendedor
            pintados encima (la casa de la foto NO es la tuya). Sube DETRÁS de la teja. ------- */}
        {g >= 1360 && g < 1806 && (
          <Plane z={0}>
            <Marco x={56} y={yP} w={wP} h={hP} z={zP}
              ry={ip(g, [1364, 1462, 1740], [-7, -2.4, -1.4])} rx={ip(g, [1364, 1462], [9, 0])}
              radius={10} lit={litP} litColor={V.amber} opacity={ip(g, [1360, 1372], [0, 1])}>
              <Material photo="img/cmeurgente/cmeu_tejado_sano.jpg" w={wP} h={hP} k={Math.max(1.06, 1180 / Math.max(40, wP))}
                cx={50 + Math.sin(g / 280) * 2.2} cy={46} lit={litP} litColor={V.amber} sheenAt={L(1470)} />
              {/* el render del vendedor: siete paneles azules que se pintan sobre TU tejado */}
              <div style={{ position: "absolute", left: "9%", right: "9%", top: "26%", height: "44%", display: "flex", gap: 9 }}>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                  const onP = clamp01(paneles * 7 - i);
                  if (onP <= 0.01) return null;
                  return (
                    <div key={i} style={{
                      flex: 1, borderRadius: 2, transformOrigin: "50% 100%",
                      transform: `scaleY(${onP.toFixed(3)})`,
                      background: `linear-gradient(158deg, ${rgba(V.panel, 0.94)} 0%, ${rgba(V.panel, 0.58)} 62%, ${rgba(V.ink1, 0.92)} 100%)`,
                      boxShadow: `inset 0 0 0 1px ${rgba(V.steel, 0.52)}, 0 8px 22px ${rgba(V.ink0, 0.74)}`,
                    }} />
                  );
                })}
              </div>
              {/* el pie del presupuesto: el número enorme vive DENTRO del papel */}
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "56px 26px 16px",
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.93) 54%)",
                display: "flex", alignItems: "flex-end", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 3.4,
                    color: rgba(V.white, 0.7), textTransform: "uppercase",
                  }}>El presupuesto</div>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 0.9, color: V.amber,
                    textShadow: `0 0 48px ${rgba(V.amber, 0.34)}, 0 6px 26px rgba(0,0,0,0.94)`,
                  }}>
                    {Math.round(bigNum) >= 1000
                      ? String(Math.round(bigNum)).slice(0, String(Math.round(bigNum)).length - 3) + "." +
                        String(Math.round(bigNum)).slice(String(Math.round(bigNum)).length - 3)
                      : String(Math.round(bigNum))}
                    <span style={{ fontSize: 46, marginLeft: 12, opacity: 0.82 }}>USD</span>
                  </div>
                </div>
                <IconPng src="img/cmeurgente/cmeu_ic_panelsolar.png" x={92} y={-14}
                  size={ip(g, [1440, 1500], [62, 96])} z={0}
                  opacity={ip(g, [1434, 1470], [0, 0.92])} rot={ip(g, [1440, 1740], [-8, 3])} glow={V.ink0} />
              </div>
            </Marco>
          </Plane>
        )}

        {/* PLANO 8 · la columna que une los dos papeles: el presupuesto arriba, el ticket abajo.
            Es un gráfico (una medida), no un objeto disfrazado. ------------------------------ */}
        {g >= 1490 && g < 1720 && (
          <Plane z={40}>
            <div style={{
              position: "absolute", left: "56%", top: "43%", width: 3, height: ip(g, [1490, 1560], [0, 300]),
              marginLeft: -1.5, transformOrigin: "50% 0%",
              background: `linear-gradient(180deg, ${rgba(V.amber, 0.62)} 0%, ${rgba(V.volt, 0.62)} 100%)`,
              opacity: ip(g, [1490, 1520, 1690, 1716], [0, 0.8, 0.8, 0]),
            }} />
            <IconPng src="img/cmeurgente/cmeu_ic_flecha.png" x={56} y={ip(g, [1520, 1600], [50, 68])}
              size={ip(g, [1520, 1580], [26, 42])} z={0}
              opacity={ip(g, [1516, 1548, 1688, 1714], [0, 0.72, 0.72, 0])} rot={90} glow={V.ink0} />
          </Plane>
        )}

        {/* PLANO 9 · ⭐ EL TICKET → LA PLACA. Vive en un plano que CANCELA la z de la cámara: a
            partir de g1806 mide 2280×1290 en pantalla (19% de sobremedida sobre 1920×1080), así que
            entre g1790 y g2040 NO hay un solo píxel del cuadro sin material. -------------------- */}
        {g >= 1462 && (
          <Plane z={zK}>
            <Marco x={xK} y={yK} w={wK} h={hK} z={0} ry={ryK} rot={rotK}
              radius={radK} lit={litK} litColor={placa > 0.6 ? V.amber : V.volt}
              opacity={opK} borde={bordeK}>
              <Material photo="img/cmeurgente/cmeu_pinza_mesa.jpg" clip="broll/cmeurgente/cmeu_pinza_mesa_mov.mp4"
                vid={vidK} w={wK} h={hK} k={kbK}
                cx={50 + Math.sin(g / 320) * (2.4 - 2 * placa)} cy={52 + Math.cos(g / 366) * (2 - 1.6 * placa)}
                lit={litK} litColor={placa > 0.6 ? V.amber : V.volt} sheenAt={L(1520)} />
              {/* el pie del ticket: el número minúsculo, que se encoge a nada cuando el papel se
                  abre hasta ser la mesa (no se funde: se va de escala con el propio marco) */}
              {placa < 0.42 && (
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 0,
                  padding: `${ip(g, [1470, 1740], [16, 20]).toFixed(0)}px 8px 5px`,
                  background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.92) 50%)",
                  textAlign: "center", transform: `scale(${(1 - placa * 2.2).toFixed(3)})`, transformOrigin: "50% 100%",
                }}>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 11, letterSpacing: 1.6,
                    color: rgba(V.white, 0.66), textTransform: "uppercase",
                  }}>Costó medir</div>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 34, lineHeight: 0.94, color: V.volt,
                    textShadow: `0 0 16px ${rgba(V.volt, 0.4)}, 0 3px 12px rgba(0,0,0,0.92)`,
                  }}>126</div>
                </div>
              )}
              {/* el calor de la mesa entrando por abajo a la derecha: el exitTo del movimiento */}
              {placa > 0.2 && (
                <AbsoluteFill style={{
                  background: `radial-gradient(74% 60% at 72% 106%, ${rgba(V.amber, 0.26 * placa)} 0%, rgba(0,0,0,0) 64%)`,
                }} />
              )}
            </Marco>
          </Plane>
        )}

        {/* PLANO 10 · PRIMER PLANO — el haz del taller pasa POR DELANTE del lente -------------- */}
        {g >= 436 && g < 884 && (
          <Plane z={290}>
            <div style={{
              position: "absolute", left: `${hazX}%`, top: "-24%", width: 330, height: "150%",
              marginLeft: -165, transform: "rotate(11deg)", filter: "blur(22px)",
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.torch, 0.20 * hazOn)} 46%, rgba(0,0,0,0) 100%)`,
            }} />
          </Plane>
        )}

        {/* PLANO 11 · la casa: el objeto del que hablan los diez años, con su parallax ------- */}
        {g >= 1010 && g < 1350 && (
          <Plane z={180}>
            <IconPng src="img/cmeurgente/cmeu_ic_casa.png"
              x={ip(g, [1010, 1340], [13, 17])} y={ip(g, [1010, 1340], [80, 76])}
              size={ip(g, [1010, 1090], [92, 138])} z={0}
              opacity={ip(g, [1010, 1058, 1300, 1344], [0, 0.94, 0.94, 0])}
              rot={ip(g, [1010, 1344], [-6, 4])} glow={V.ink0} />
          </Plane>
        )}
      </Layers>

      {/* ══════ LA FIRMA DEL VIDEO — las 24 horas, y cuánto de tu gasto cae con el sol ═══════ */}
      {sunOn > 0.01 && (
        <SunField sun={7 / 24} from={9} cells={24} on={sunOn} use={sunUse}
          tint={V.volt} night={V.sky} y={ip(g, [452, 700, 884], [93, 91, 90])} w={1180} h={40} cycle={210} />
      )}

      {/* ══════ COSTURA · FRONTERA 3→4 (g1380) — OCLUSIÓN: LA TEJA cruza el cuadro ══════════ */}
      <SeamOcclude at={L(1362)} dur={34} color={V.roof} angle={11} />
      <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
        <Teja p={ip(g, [1356, 1400], [0, 1])} />
      </AbsoluteFill>

      {/* ══════ HUD — texto y cifras en espacio de pantalla (safe area 60 px) ═══════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* ACTO 1 · CÓMPRALOS ------------------------------------------------------------- */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "9%", opacity: t1, transform: `translateY(${((1 - t1) * -24).toFixed(1)}px)` }}>
            <Bed w={640} pad={24}>
              <Kick color={V.volt}>Ahora sí</Kick>
              <div style={{ height: 8 }} />
              <Head size={112}>CÓMPRALOS</Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Los <Em>seis casos</Em> en los que el panel es la respuesta correcta</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · SI TU CONSUMO CAE BAJO EL SOL ----------------------------------------- */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "62%", opacity: t2, transform: `translateY(${((1 - t2) * 26).toFixed(1)}px)` }}>
            <Bed w={690} pad={24}>
              <Kick color={V.volt}>Caso uno</Kick>
              <div style={{ height: 8 }} />
              <Head size={66}>SI TU CONSUMO CAE <Em>BAJO EL SOL</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={29}>Lo que gastas entre las nueve y las cuatro, el panel te lo paga el mismo día</Body>
            </Bed>
          </div>
        )}

        {/* la cifra del sol: siete horas útiles (cama radial para que no se pierda) --------- */}
        {g >= 534 && g < 862 && (
          <div style={{ opacity: ip(g, [534, 560, 830, 858], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "80%", top: "22%", width: 430, height: 250,
              marginLeft: -215, marginTop: -125,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.80), rgba(8,9,6,0))",
            }} />
            <Readout value="7" unit="h" label="DE SOL ÚTIL AL DÍA" at={L(538)}
              x={80} y={22} size={112} color={V.volt} align="center" />
          </div>
        )}

        {/* el rótulo de la tira de las 24 horas -------------------------------------------- */}
        {capSol > 0.01 && (
          <div style={{ position: "absolute", left: "50%", top: "97%", transform: "translate(-50%,-50%)", opacity: capSol }}>
            <Bed pad={9}>
              <div style={{
                fontFamily: F_BODY, fontWeight: 700, fontSize: 20, letterSpacing: 3,
                color: rgba(V.white, 0.78), textTransform: "uppercase",
              }}>Las veinticuatro horas · <span style={{ color: V.amber }}>en ámbar, tu gasto</span></div>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · SI TE VAS A QUEDAR DIEZ AÑOS ------------------------------------------ */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "60%", opacity: t3, transform: `translateY(${((1 - t3) * 26).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.volt}>Caso dos</Kick>
              <div style={{ height: 8 }} />
              <Head size={66}>SI TE VAS A QUEDAR <Em>DIEZ AÑOS</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={29}>El sistema se paga en <Em color={V.amber}>once</Em>. No en cinco.</Body>
            </Bed>
          </div>
        )}

        {/* el contador de los años, pegado al arco --------------------------------------- */}
        {g >= 980 && g < 1310 && (
          <div style={{ opacity: ip(g, [980, 1006, 1280, 1306], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "78%", top: "48%", width: 440, height: 260,
              marginLeft: -220, marginTop: -130,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.78), rgba(8,9,6,0))",
            }} />
            <Readout value={String(anioNum)} unit="años" label="PARA PAGARSE SOLO" at={L(984)}
              x={78} y={48} size={104} color={anioNum >= 11 ? V.amber : V.volt} align="center" />
          </div>
        )}
        {capAnio > 0.01 && (
          <div style={{ position: "absolute", left: "50%", top: "8%", transform: "translate(-50%,-50%)", opacity: capAnio }}>
            <Bed pad={10}>
              <div style={{
                fontFamily: F_BODY, fontWeight: 700, fontSize: 21, letterSpacing: 2.6,
                color: rgba(V.white, 0.8), textTransform: "uppercase",
              }}>Tus diez años <span style={{ color: rgba(V.white, 0.42) }}>·</span> <span style={{ color: V.amber }}>se paga en once</span></div>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · EL REMATE: 23.000 PARA UN PROBLEMA DE 126 ----------------------------- */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "4.5%", top: "58%", opacity: t4, transform: `translateY(${((1 - t4) * 28).toFixed(1)}px)` }}>
            <Bed w={620} pad={24}>
              <Kick color={V.amber}>Y el remate</Kick>
              <div style={{ height: 8 }} />
              <Head size={62}><Em color={V.amber}>23.000</Em> PARA UN PROBLEMA DE <Em>126</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={29}>Los ciento veintiséis se pagaron en cinco semanas</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · MÍDELO --------------------------------------------------------------- */}
        {t5 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "63%", opacity: t5, transform: `translateY(${((1 - t5) * 26).toFixed(1)}px)` }}>
            <Bed w={640} pad={26}>
              <Kick color={V.amber}>Antes de firmar</Kick>
              <div style={{ height: 8 }} />
              <Head size={128}>MÍDELO</Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Treinta días. Una pinza. <Em>Tu casa.</Em></Body>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta: se abre en el remate y se cierra sobre la pinza (nunca llega a negro) */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(126% 106% at 50% 46%, rgba(0,0,0,0) 50%, rgba(6,7,5,${ip(g, [0, 900, 1560, 1806, 2040], [0.26, 0.3, 0.24, 0.34, 0.44]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
