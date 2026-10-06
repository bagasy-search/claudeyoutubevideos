// MovTreintaDias.tsx — S1 · UN MOVIMIENTO CONTINUO de 62 s (1872 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 55,6.
//
// LA ESPINA: treinta dias de medicion bajan la casa un cuarenta por ciento y el mismo vendedor
// cotiza nueve mil doscientos menos. Por fuera la casa es la misma. Lo unico que cambio es el
// numero con el que el vendedor hace la cuenta.
//
// ⚠️ EL CORTE DURO DE LA ENTRADA: `MovPresupuesto` termina EXACTAMENTE en mi frame 0 y es OTRO
// archivo. El sale con una oclusion de PAPEL cruzando el cuadro; por eso mis primeros 12 cuadros
// abren DETRAS de esa misma materia (`SeamOcclude` con `V.paper` que arranca en el frame -16 y
// termina de salir en el 12), con la MISMA camara (z -220, ry -5), la MISMA luz (blanco duro con
// el volt del display metido abajo a la izquierda) y la misma materia en macro: papel sobre la
// mesa de la cocina. Nadie puede señalar donde cambio el archivo.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE donde termina el acto N                 ║
// ╠════╦════════════════════════════════════════╦══════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto         ║ SALE: encuadre + luz + objeto                ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 1  ║ CAM: baja y cerca, ladeada, heredada   ║ CAM: z≈-206 y ya abriendo; el ladeo se        ║
// ║ g0 ║      del acto 5 de MovPresupuesto      ║      afloja (ry -5 → -3,4). No frena.         ║
// ║    ║      (z -220, ry -5).                  ║ LUZ: keyFrom 0,20→0,30; el blanco duro cede   ║
// ║    ║ LUZ: MEDIODIA DEL VENDEDOR, blanco     ║      hacia el ambar del anochecer.            ║
// ║    ║      duro arriba-derecha + el volt del ║ MAT: LA CASILLA TREINTA, la ultima tachada,   ║
// ║    ║      display de la pinza abajo-izq.    ║      que se enciende en ambar y empieza a     ║
// ║    ║ MAT: el PAPEL en macro sobre la mesa   ║      CRECER: ya no es una casilla, es una     ║
// ║    ║      (la hoja del calendario).         ║      ventana con luz adentro.                 ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 2  ║ CAM: misma inercia, abriendo (z≈-206). ║ CAM: z≈-120 y EMPUJANDO hacia la ventana      ║
// ║g372║ LUZ: keyFrom 0,30, tint ya en ambar:   ║      (camZ local +128 y subiendo a +196).     ║
// ║    ║      anochece sobre la casa.           ║ LUZ: keyFrom 0,42, intensidad 1,04: el ambar  ║
// ║    ║ MAT: la casilla convertida en VENTANA  ║      de la ventana es lo unico que manda.     ║
// ║    ║      ENCENDIDA, que se abre hasta ser  ║ MAT: LA COLUMNA DE LUZ de esa ventana, que    ║
// ║    ║      la casa entera al anochecer.      ║      crece hasta ocupar el centro del cuadro. ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 3  ║ CAM: entrando por la ventana, z≈+77 en ║ CAM: z≈-28, ya retrocediendo y bajando hacia  ║
// ║g732║      el pico del empuje; sigue su vec- ║      la mesa (camDrop -16 → -26).             ║
// ║    ║      tor, no corta.                    ║ LUZ: keyFrom 0,42→0,34, tint de ambar a VOLT  ║
// ║    ║ LUZ: el ambar de la ventana enfriando  ║      pleno: esto es MEDICION, no dinero.      ║
// ║    ║      a volt (light amber→volt).        ║ MAT: LA COLUMNA ya derrumbada a 580, angosta  ║
// ║    ║ MAT: la columna de luz, que se angosta ║      y corta, con la misma silueta que una    ║
// ║    ║      hasta ser LA BARRA de 960 kWh.    ║      hoja de presupuesto de pie.              ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 4  ║ CAM: z≈-28 retrocediendo y bajando: la ║ CAM: z≈-44, media, abriendo hacia la derecha  ║
// ║g1122║     mesa de la cocina sube al cuadro. ║      (ry +1,0 → +2,8). Deja aire en el medio. ║
// ║    ║ LUZ: keyFrom 0,34, volt duro sobre el  ║ LUZ: keyFrom 0,40→0,52, el volt vuelve a      ║
// ║    ║      papel; el ambar espera abajo-der. ║      ambar: entra el dinero.                  ║
// ║    ║ MAT: la barra convertida en LA HOJA    ║ MAT: LA LINEA DE LA RESTA dibujada entre los  ║
// ║    ║      DELGADA del segundo presupuesto,  ║      dos numeros — y esa linea ES una tira    ║
// ║    ║      que se abre hasta mostrar los dos ║      de billete: tiene el material adentro    ║
// ║    ║      presupuestos sobre la mesa.       ║      desde el primer cuadro.                  ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 5  ║ CAM: z≈-44 abriendo a la derecha,      ║ CAM: MEDIA, retrocediendo (z -80 exacto,      ║
// ║g1482║     misma curva.                      ║      panX +8 cumplido con panX 44 px y ry     ║
// ║    ║ LUZ: keyFrom 0,52 subiendo, tint ambar ║      +4,4): los dos numeros quedan a          ║
// ║    ║      pleno.                            ║      DISTINTA ALTURA con aire entre ellos.    ║
// ║    ║ MAT: la linea de la resta ABRIENDOSE   ║ LUZ: keyFrom 0,74, ambar de las ventanas de   ║
// ║    ║      en la tarjeta de los billetes.    ║      la casa al anochecer (= entrada de       ║
// ║    ║                                        ║      MovEscudo).                              ║
// ║    ║                                        ║ MAT: EL BILLETE / el papel del presupuesto    ║
// ║    ║                                        ║      nuevo, y la casa encendida al fondo.     ║
// ╚════╩════════════════════════════════════════╩══════════════════════════════════════════════╝
//
// COSTURAS — una por frontera, ninguna es un fundido y ninguna baja una opacidad a cero:
//   g372  1→2  MATCH-SHAPE  — la CASILLA 30 de la tira (53×40 px en 72,0% / 46,5%) no se apaga:
//                             deja de dibujarla la tira y la toma `ventCasa`, EXACTAMENTE en esa
//                             geometria, con la foto de la casa adentro a 8× de recorte sobre la
//                             ventana encendida. Despues crece: 53→1680 px. Es literalmente "la
//                             ultima casilla tachada se vuelve la ventana encendida de la casa".
//   g732  2→3  MATCH-MOVE   — la camara no corta: sigue empujando (camZ +128→+196) y el mundo
//                             cambia debajo. `ventCasa` crece y se va por abajo-izquierda del
//                             cuadro mientras LA COLUMNA DE LUZ de su ventana queda, se angosta
//                             y aterriza como la barra de 960 kWh. Nada aparece: todo entra por
//                             geometria. La columna es UN SOLO elemento de g640 a g1123.
//   g1122 3→4  OCLUSION     — `SeamOcclude at 1108 color V.paper`: el presupuesto nuevo cruza por
//                             delante. Cobertura total en g1123: ahi la columna deja de dibujarse
//                             y `ventPresu` la toma con SU MISMA geometria (x 34 / w 150 / h 338)
//                             y el material ya corriendo adentro.
//   g1482 4→5  MATCH-SHAPE  — la LINEA DE LA RESTA se dibuja entre los dos numeros y engorda
//                             hasta ser la tarjeta de los billetes: 4 px → 400 px de alto. El
//                             material real esta adentro desde el primer cuadro de la linea (la
//                             linea es una tira de billete de 4 px), asi que nada "aparece".
//
// ⛔ CONTRATO: sin azar de sistema ni reloj de sistema (todo sale de rnd(k) y de gFrame) · sin
// ⛔ position fixed · sin backdrop-filter · rutas SOLO literales de la ficha · UNA sola Sequence
// ⛔ (la del build): aca no se envuelve ningun acto · un solo reloj `g` de 0 a 1872.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, RoofPlane, SunField, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1872;
const A2 = 372;
const A3 = 732;
const A4 = 1122;
const A5 = 1482;

// frontera 3→4: el papel cruza y tapa el 100% en 1108 + 30/2 = 1123
const OCL = 1108;
const OCL_DUR = 30;
const OCL_FULL = OCL + OCL_DUR / 2;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const miles = (n: number) => {
  const s = String(Math.max(0, Math.round(n)));
  return s.length > 3 ? s.slice(0, s.length - 3) + "." + s.slice(s.length - 3) : s;
};

// ── VENTANA: el marco de vidrio que RECORTA el material. Es la primitiva de este movimiento: la
//    misma Ventana que era una casilla del calendario se abre y se vuelve la casa entera, y mas
//    tarde la barra se vuelve la hoja del presupuesto. Adentro va SIEMPRE material real.
const Ventana: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  lit?: number; litColor?: string; opacity?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, radius = 12, lit = 1, litColor = V.volt, opacity = 1, children }) => {
  const W = Math.max(6, w);
  const H = Math.max(6, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      border: `1px solid ${rgba(litColor, 0.3 * lit)}`,
      boxShadow: `0 ${Math.round(H * 0.14)}px ${Math.round(H * 0.22)}px ${rgba(V.ink0, 0.78)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.62)}, inset 0 1px 0 ${rgba(V.white, 0.26 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL dentro de la Ventana. `k` es el zoom de recorte (≥1: la foto siempre cubre) y
//    `u`/`v` son el PUNTO DE LA FOTO que queda en el centro del marco (0..1). Con eso el recorte
//    puede viajar de un detalle (la ventana encendida, u 0,38 / v 0,46) a la foto entera (0,5 /
//    0,5) sin re-encuadrar a mano: eso ES el match-shape del acto 1 al 2.
const Mat: React.FC<{
  photo: string; clip?: string; vid?: number;
  w: number; h: number; k: number; u?: number; v?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, u = 0.5, v = 0.5, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.03, k);
  const iw = Math.max(10, w * kk);
  const ih = Math.max(10, h * kk);
  const cx = 50 - (u - 0.5) * 100 * kk;
  const cy = 50 - (v - 0.5) * 100 * kk;
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

// ── ROTULO de tarjeta (va DENTRO de la Ventana, sobre una cama que nace del propio marco).
const Rotulo: React.FC<{ txt: string; on: number; tint?: string; size?: number }> = ({ txt, on, tint = V.white, size = 24 }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 14px 10px",
      opacity: clamp01(on),
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 2.2,
      color: tint, textTransform: "uppercase",
    }}>{txt}</div>
  );
};

// ── LA TIRA DE LOS TREINTA DIAS — dos filas de quince casillas que se tachan a mano, una por
//    dia. Esto SI es un grafico (es una cuenta), no un objeto disfrazado: por eso es vectorial.
//    La casilla 30 se le ENTREGA a `ventCasa` en g350: a partir de ahi la tira ya no la dibuja.
const TiraDias: React.FC<{ g: number; on: number; sinUltima: boolean }> = ({ g, on, sinUltima }) => {
  if (on <= 0.01) return null;
  const W = 900, H = 96, CW = 52.5, CH = 40, GAP = 8, ROW = 15;
  return (
    <div style={{
      position: "absolute", left: "50%", top: "44%", width: W, height: H,
      marginLeft: -W / 2, marginTop: -H / 2, opacity: clamp01(on),
    }}>
      {Array.from({ length: 30 }, (_, i) => {
        if (sinUltima && i === 29) return null;
        const col = i % ROW;
        const row = Math.floor(i / ROW);
        const at = 66 + i * 7.2;
        const t1 = clamp01((g - at) / 8);
        const t2 = clamp01((g - at - 4) / 8);
        const viva = clamp01((g - at + 30) / 22);
        const jit = (rnd(i * 3.7) - 0.5) * 2.2;
        const ang = 22 + rnd(i * 5.1) * 8;
        return (
          <div key={i} style={{
            position: "absolute", left: col * (CW + GAP), top: row * (CH + 16),
            width: CW, height: CH, borderRadius: 3,
            border: `1px solid ${rgba(V.sky, 0.16 + 0.2 * viva)}`,
            background: `linear-gradient(180deg, ${rgba(V.bone, 0.05 + 0.07 * viva)} 0%, ${rgba(V.ink0, 0.24)} 100%)`,
            boxShadow: t1 > 0.7 ? `0 0 ${Math.round(8 + 10 * t1)}px ${rgba(V.volt, 0.16 * t1)}` : "none",
            overflow: "hidden",
          }}>
            {/* el numero del dia, chiquito, arriba a la izquierda */}
            <div style={{
              position: "absolute", left: 4, top: 2, fontFamily: F_DISPLAY, fontWeight: 700,
              fontSize: 13, color: rgba(V.white, 0.24 + 0.26 * viva), letterSpacing: 0.4,
            }}>{i + 1}</div>
            {/* las dos plumadas: la tachadura hecha a mano */}
            <div style={{
              position: "absolute", left: -6, top: CH / 2 - 1.5 + jit, width: CW + 12, height: 3,
              background: `linear-gradient(90deg, ${rgba(V.volt, 0.5)}, ${rgba(V.volt, 0.95)})`,
              transform: `rotate(${ang}deg) scaleX(${t1.toFixed(3)})`, transformOrigin: "0% 50%",
              boxShadow: `0 0 10px ${rgba(V.volt, 0.45 * t1)}`, borderRadius: 2,
            }} />
            <div style={{
              position: "absolute", left: -6, top: CH / 2 - 1.5 - jit, width: CW + 12, height: 3,
              background: `linear-gradient(90deg, ${rgba(V.volt, 0.45)}, ${rgba(V.volt, 0.85)})`,
              transform: `rotate(${-ang}deg) scaleX(${t2.toFixed(3)})`, transformOrigin: "0% 50%",
              boxShadow: `0 0 10px ${rgba(V.volt, 0.36 * t2)}`, borderRadius: 2,
            }} />
          </div>
        );
      })}
    </div>
  );
};

// ── LA COLUMNA — el elemento que MAS viaja de este movimiento. Nace como la luz que sale de la
//    ventana encendida (ambar), crece con el empuje de la camara, se angosta y aterriza como LA
//    BARRA de 960 kWh (volt), y se derrumba a 580. Es UN SOLO elemento de g640 a g1123.
const Columna: React.FC<{
  x: number; y: number; w: number; h: number; tint: string; lit: number; halo: number; g: number;
}> = ({ x, y, w, h, tint, lit, halo, g }) => {
  const W = Math.max(4, w);
  const H = Math.max(4, h);
  const pulso = 0.5 + 0.5 * Math.sin(g / 21);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: W, height: H,
      marginLeft: -W / 2, marginTop: -H / 2, borderRadius: Math.min(6, W / 6),
      background: `linear-gradient(180deg, ${rgba(tint, 0.30 + 0.5 * lit)} 0%, ${rgba(tint, 0.14 + 0.30 * lit)} 46%, ${rgba(tint, 0.04 + 0.10 * lit)} 100%)`,
      borderTop: `${Math.max(2, Math.min(5, W / 34))}px solid ${rgba(tint, 0.55 + 0.45 * lit)}`,
      boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.26 * lit)}, 0 0 ${Math.round(30 + 90 * halo)}px ${rgba(tint, (0.18 + 0.20 * pulso) * halo)}`,
      overflow: "hidden",
    }}>
      <AbsoluteFill style={{
        opacity: 0.18 * lit, mixBlendMode: "overlay",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 11px)",
      }} />
      {/* el canto vivo del lado de la key: la columna tiene volumen, no es un rectangulo plano */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: Math.max(2, W * 0.14),
        background: `linear-gradient(90deg, ${rgba(V.white, 0.22 * lit)}, rgba(0,0,0,0))`,
      }} />
    </div>
  );
};

// ── CAMA RADIAL bajo una cifra que va sobre material real (la cifra nunca se pierde en la foto).
const CamaCifra: React.FC<{ x: number; y: number; size: number; on?: number; a?: number }> = ({ x, y, size, on = 1, a = 0.82 }) => {
  if (on <= 0.01) return null;
  const w = size * 4.4;
  const h = size * 2.7;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity: clamp01(on),
      background: `radial-gradient(closest-side, rgba(8,9,6,${a}), rgba(8,9,6,0))`,
    }} />
  );
};

export const MovTreintaDias: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El build monta UN movimiento = UNA Sequence y me pasa el reloj global. Si algun dia lo montara
  // por actos, `off` traduce los `at`/`sheenAt` que razonan en frames LOCALES.
  const lFrame = useCurrentFrame();
  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame as number)
    ? (gFrame as number)
    : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))] + lFrame;
  const g = Math.max(0, Math.min(END, gRaw));
  const off = g - lFrame;
  const L = (gAt: number) => gAt - off;

  // ══ LA CAMARA — UNA sola, funcion de g, que NUNCA vuelve a cero ═══════════════════════════
  // Entra en z -220 / ry -5 (lo que entrega MovPresupuesto) y sale en z -80 / panX +8 (lo que
  // espera MovEscudo). El unico "salto" es el empuje por la ventana en g700-790, y ese empuje
  // ES la costura 2→3: la camara atraviesa la frontera, no la corta.
  const camB = gcam(g, { z0: -220, z1: -36, panX: 44, panY: -22, ry: 0, rx: 0, dur: END });
  const camZ = ip(g,
    [0, 140, 372, 520, 660, 732, 772, 840, 960, 1108, 1180, 1300, 1482, 1600, 1740, 1872],
    [0, -12, -26, 4, 62, 128, 196, 120, 54, 8, 34, 6, -8, -26, -40, -44]);
  const camDrop = ip(g, [0, 372, 732, 900, 1122, 1300, 1482, 1872],
    [0, 10, -4, -16, -26, -30, -34, -48]);
  const camTilt = ip(g, [0, 372, 732, 1122, 1482, 1872], [0, -0.5, 0.7, -1.3, -2.8, -4.1]);
  const camRY = ip(g, [0, 372, 732, 1122, 1482, 1872], [-5, -3.4, -1.1, 1.0, 2.8, 4.4]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg) rotateY(${camRY.toFixed(2)}deg)`;
  // la deriva de la camara replicada (mas floja) para el HUD: el texto no queda pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.4).toFixed(2)}px, ${(by * 0.4).toFixed(2)}px)`;

  // ══ LA LUZ — blanco duro del vendedor → ambar del anochecer → VOLT de la medicion → ambar ══
  // Las dos ramas de `tintA` se tocan EXACTAMENTE en ambar en g640: la luz no salta en el corte
  // de rama (es la misma cuerda, atada en el nudo).
  const keyFrom = ip(g, [0, 200, 372, 560, 732, 900, 1108, 1300, 1482, 1700, 1872],
    [0.20, 0.24, 0.30, 0.36, 0.42, 0.40, 0.34, 0.40, 0.52, 0.66, 0.74]);
  const inten = ip(g, [0, 160, 372, 732, 1000, 1122, 1360, 1482, 1700, 1872],
    [0.88, 0.94, 0.98, 1.04, 1.06, 0.98, 0.94, 0.96, 0.90, 0.86]);
  const floorL = ip(g, [0, 372, 732, 1122, 1482, 1872], [0.50, 0.56, 0.64, 0.62, 0.56, 0.50]);
  const tintA = g < 640
    ? light(ip(g, [0, 200, 372, 520, 640], [0.10, 0.20, 0.42, 0.78, 1]), "white", "amber")
    : light(ip(g, [640, 900, 1108, 1300, 1560, 1872], [0, 0.95, 0.90, 0.50, 0.12, 0.04]), "amber", "volt");
  const tintB = light(ip(g, [0, 372, 732, 1122, 1482, 1872], [0.08, 0.30, 0.60, 0.26, 0.10, 0.02]), "amber", "torch");

  // ══ ACTO 1 · LA HOJA DEL CALENDARIO ═══════════════════════════════════════════════════════
  // Abre en MACRO cerrado (k 1,92 sobre el borde del papel) para que los primeros cuadros sean
  // la MISMA materia que dejo MovPresupuesto: papel, mesa, luz dura. Recien despues se abre.
  const kCal = ip(g, [0, 90, 200, 372, 470], [1.92, 1.62, 1.30, 1.22, 1.20]);
  const uCal = ip(g, [0, 200, 372], [0.41, 0.47, 0.50]);
  const vCal = ip(g, [0, 200, 372], [0.57, 0.52, 0.50]);
  // La hoja NO se desvanece: se HUNDE por abajo-izquierda mientras la casa se come el cuadro.
  // Sale por GEOMETRIA (en g560 su borde de arriba ya paso el 100%), nunca por opacidad.
  const calX = ip(g, [0, 200, 372, 420, 470, 560], [48, 49.5, 50, 48, 42, 28]);
  const calY = ip(g, [0, 200, 372, 420, 470, 560], [53, 52, 51.4, 54, 68, 176]);
  const calW = ip(g, [0, 200, 372, 470, 560], [1500, 1440, 1400, 1380, 1360]);
  const calH = ip(g, [0, 200, 372, 470, 560], [860, 820, 790, 778, 766]);
  const calLit = ip(g, [0, 140, 372, 452, 520], [0.72, 1, 1, 0.62, 0.34]);
  const calOn = ip(g, [0, 6, 540, 566], [0, 1, 1, 0]);
  // el volt del display de la pinza que quedaba encendido abajo-izquierda al final del anterior
  const voltPinza = ip(g, [0, 110, 210], [0.9, 0.62, 0]);
  // la tira se dibuja sobre el papel y se va CON el papel (misma caida, no un fundido)
  const tiraOn = ip(g, [40, 74], [0, 1]);
  const tiraCae = ip(g, [372, 420, 470, 560], [0, 30, 182, 1350]);
  const diasCont = Math.min(30, Math.max(0, Math.floor((g - 60) / 7.2) + 1));

  // ══ FRONTERA 1→2 · MATCH-SHAPE · la casilla 30 se vuelve la ventana encendida ══════════════
  // La casilla 30 vive en 72,0% / 46,5% y mide 53×40. `ventCasa` arranca EXACTAMENTE ahi.
  const kv = [350, 372, 404, 442, 486, 560, 660, 700, 732, 762, 800, 846];
  const casaX = ip(g, kv, [72.0, 70.4, 66.2, 60.4, 55.2, 51.2, 50.0, 49.6, 48.8, 46.4, 42.0, 34.0]);
  const casaY = ip(g, kv, [46.5, 47.0, 48.2, 49.2, 49.8, 50.0, 50.2, 50.8, 53.0, 64.0, 88.0, 128.0]);
  const casaW = ip(g, kv, [53, 128, 420, 860, 1240, 1560, 1660, 1690, 1740, 1880, 2060, 2320]);
  const casaH = ip(g, kv, [40, 96, 300, 580, 740, 878, 924, 940, 966, 1044, 1144, 1290]);
  const casaZ = ip(g, kv, [12, 12, 16, 20, 22, 16, 10, 6, 0, -8, -18, -30]);
  const casaRY = ip(g, kv, [0, 1.2, 2.6, 3.2, 2.4, 1.2, 0.4, 0.2, -0.6, -2.4, -5.0, -8.0]);
  const casaLit = ip(g, kv, [1, 1, 1, 1, 1, 1, 1, 1, 0.96, 0.82, 0.62, 0.4]);
  const casaK = ip(g, kv, [8.2, 7.4, 4.2, 2.2, 1.52, 1.24, 1.18, 1.22, 1.44, 1.86, 2.5, 3.4]);
  const casaU = ip(g, kv, [0.38, 0.385, 0.40, 0.435, 0.468, 0.50, 0.50, 0.50, 0.474, 0.436, 0.40, 0.38]);
  const casaV = ip(g, kv, [0.46, 0.462, 0.468, 0.48, 0.49, 0.50, 0.50, 0.50, 0.494, 0.482, 0.47, 0.46]);
  // el clip de la casa (empuje lento, una luz que se apaga) corre en su ventana de loop limpia
  const casaVid = ip(g, [462, 476, 596, 610], [0, 1, 1, 0]);
  // los dos satelites del acto 2: la MISMA foto dos veces = "por fuera no cambio nada"
  const satY = ipe(g, [498, 552], [122, 76], Easing.out(Easing.cubic));
  const satY2 = ipe(g, [688, 742], [76, 124], Easing.in(Easing.cubic));
  const satYY = g < 690 ? satY : satY2;
  const satOn = g >= 494 && g < 746;

  // ══ FRONTERA 2→3 · MATCH-MOVE · la luz de la ventana se queda y se vuelve la barra ════════
  // `bottomCol` es donde APOYA la columna (en %) y `hCol` su alto en px: con eso el pie de la
  // barra aterriza en el 88% y ya no se mueve, que es lo que la vuelve un grafico creible.
  const kc = [640, 700, 742, 772, 812, 830];
  const colX = ip(g, [640, 700, 742, 772, 812, 830, 1122], [40.6, 40.0, 38.0, 36.0, 34.5, 34.0, 34.0]);
  const colW = ip(g, [640, 700, 742, 772, 812, 830, 900, 1122], [74, 190, 640, 900, 420, 150, 150, 150]);
  const colBottom = ip(g, kc, [49.7, 55.4, 77.1, 94.1, 90.6, 88.0]);
  const kwhVal = ip(g, [830, 902, 946, 1010, 1122], [960, 960, 706, 580, 580]);
  const hColTrack = ip(g, kc, [58, 150, 520, 780, 646, 560]);
  const hCol = g < 830 ? hColTrack : kwhVal * (560 / 960);
  const colY = (g < 830 ? colBottom : 88) - (hCol / 1080) * 50;
  const colTint = light(ip(g, [700, 790, 862], [0, 0.35, 1]), "amber", "volt");
  const colLit = ip(g, [640, 700, 772, 830, 1010, 1122], [0.5, 0.8, 1, 1, 0.94, 0.9]);
  const colHalo = ip(g, [640, 700, 760, 800, 880, 1010, 1122], [1, 1, 0.9, 0.55, 0.34, 0.5, 0.42]);
  const colVive = g >= 636 && g < OCL_FULL + 1;
  // el marco de la ventana pasando POR DELANTE del lente mientras la camara entra
  const parteluzOn = g >= 686 && g < 812;
  const parteluzX = ip(g, [686, 812], [46, -34]);
  const parteluzS = ip(g, [686, 812], [1, 3.4]);

  // ══ ACTO 3 · LA MEDICION ══════════════════════════════════════════════════════════════════
  const macroX = ip(g, [780, 862, 1046, 1104], [120, 72, 72, 124]);
  const macroOn = g >= 776 && g < OCL_FULL;
  const sunOn = ip(g, [770, 830, 1064, 1102], [0, 0.5, 0.5, 0]);
  const flechaOn = ip(g, [896, 930, 1030, 1062], [0, 1, 1, 0]);
  const flechaY = ip(g, [896, 1030], [44, 62]);
  const bajaPct = ip(g, [946, 1012], [0, 40]);
  const pctOn = ip(g, [944, 976, 1074, 1100], [0, 1, 1, 0]);

  // ══ FRONTERA 3→4 · OCLUSION V.paper · la barra se vuelve la hoja del presupuesto ══════════
  // `ventPresu` arranca con la geometria EXACTA que tenia la columna en el cuadro tapado.
  const colYFull = 88 - (580 * (560 / 960) / 1080) * 50;   // 72,35 %
  const kp = [OCL_FULL, 1160, 1210, 1290, 1420, 1560, 1720, 1872];
  const presuX = ip(g, kp, [34.0, 39.0, 44.0, 48.6, 50.4, 47.0, 44.6, 43.0]);
  const presuY = ip(g, kp, [colYFull, 68.0, 61.0, 54.6, 52.4, 51.0, 49.6, 48.4]);
  const presuW = ip(g, kp, [150, 380, 720, 1240, 1520, 1470, 1380, 1320]);
  const presuH = ip(g, kp, [338, 500, 620, 760, 852, 828, 790, 762]);
  const presuRY = ip(g, kp, [0, -4.2, -4.6, -3.2, -1.4, 1.6, 4.2, 5.6]);
  const presuK = ip(g, kp, [4.3, 3.1, 2.15, 1.42, 1.16, 1.14, 1.12, 1.12]);
  const presuU = ip(g, kp, [0.735, 0.70, 0.645, 0.565, 0.505, 0.492, 0.478, 0.47]);
  const presuV = ip(g, kp, [0.545, 0.535, 0.525, 0.512, 0.502, 0.50, 0.494, 0.49]);
  const presuLit = ip(g, kp, [0.86, 0.94, 1, 1, 1, 0.82, 0.62, 0.55]);
  const presuVive = g >= OCL_FULL;
  const mesaOn = ip(g, [1150, 1260, 1872], [0, 0.86, 1]);

  // ══ ACTO 4 · LOS DOS PRESUPUESTOS ═════════════════════════════════════════════════════════
  const n1On = ip(g, [1188, 1214], [0, 1]);
  const n1X = ip(g, [1188, 1420, 1560, 1872], [33.5, 33.5, 24.0, 19.5]);
  const n1Y = ip(g, [1188, 1420, 1560, 1872], [28.0, 28.0, 24.0, 21.0]);
  const n1S = ip(g, [1188, 1420, 1560, 1872], [86, 86, 76, 70]);
  const tacha = ipe(g, [1318, 1356], [0, 1], Easing.out(Easing.cubic));
  const n2On = ip(g, [1256, 1282], [0, 1]);
  const n2X = ip(g, [1256, 1420, 1560, 1872], [67.0, 67.0, 24.0, 19.5]);
  const n2Y = ip(g, [1256, 1420, 1560, 1872], [32.0, 32.0, 42.0, 45.0]);
  const n2S = ip(g, [1256, 1420, 1560, 1872], [104, 104, 92, 86]);
  const cunaOn = g >= 1146 && g < 1400;
  const cunaX = ip(g, [1146, 1290, 1400], [128, 84, 62]);

  // ══ FRONTERA 4→5 · MATCH-SHAPE · la linea de la resta engorda hasta ser el fajo ═══════════
  // La linea se DIBUJA de izquierda a derecha (el borde izquierdo queda clavado en el 33%) y ya
  // lleva el billete adentro: son 4 px de alto de la foto real. Nada aparece despues.
  const kd = [1400, 1418, 1436, 1470, 1500, 1540, 1600, 1740, 1872];
  const dinW = ip(g, kd, [8, 280, 653, 660, 680, 700, 700, 660, 600]);
  const dinX = ip(g, kd, [33.2, 40.3, 50.0, 51.6, 55.4, 62.0, 68.0, 72.4, 74.6]);
  const dinY = ip(g, kd, [62.0, 62.0, 62.0, 61.2, 57.4, 50.6, 45.0, 43.6, 42.4]);
  const dinH = ip(g, kd, [4, 4, 4, 22, 120, 300, 400, 372, 344]);
  const dinRY = ip(g, kd, [0, 0, 0, -1.4, -3.0, -5.2, -6.6, -7.4, -8.0]);
  const dinLuz = ip(dinH, [18, 210], [0.88, 0]);     // la linea "de tinta" se apaga al abrirse
  const dinVive = g >= 1398;
  const dif = ipe(g, [1486, 1512, 1548, 1584], [0, 5400, 8600, 9200], Easing.out(Easing.cubic));
  const difOn = ip(g, [1478, 1502], [0, 1]);
  const difX = ip(g, [1478, 1560, 1740, 1872], [50.0, 66.0, 72.4, 74.6]);
  const difY = ip(g, [1478, 1560, 1740, 1872], [61.0, 47.0, 43.6, 42.4]);
  const difS = ip(g, [1478, 1560, 1740, 1872], [92, 148, 156, 150]);
  const cientoOn = ip(g, [1640, 1672], [0, 1]);
  const casaFinOn = g >= 1688 && g < 1836;
  const casaFinY = ipe(g, [1688, 1748], [104, 76], Easing.out(Easing.cubic));
  const casaFinVid = ip(g, [1696, 1712, 1806, 1822], [0, 1, 1, 0]);
  const techoOn = g >= 1470;
  const techoPan = ip(g, [1500, 1800], [1, 0.6]);
  const bordeOn = g >= 1596 && g < 1764;
  const bordeX = ip(g, [1596, 1764], [124, -26]);

  // ══ TEXTO — UNA idea por acto, cada una viva >= 2,0 s + 0,28 s por palabra arriba de 3 ════
  const t1 = ip(g, [96, 122, 322, 348], [0, 1, 1, 0]);       // 252 frames vivos
  const t2 = ip(g, [430, 456, 676, 702], [0, 1, 1, 0]);      // 220 frames vivos
  const t3 = ip(g, [812, 840, 1062, 1090], [0, 1, 1, 0]);    // 222 frames vivos
  const t4 = ip(g, [1176, 1204, 1414, 1442], [0, 1, 1, 0]);  // 210 frames vivos
  const t5 = ip(g, [1560, 1590, 1846, 1872], [0, 1, 1, 1]);  // 256 frames vivos

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMOSFERA: se monta UNA vez y no se remonta nunca; solo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floorL} />

      {/* ══════ EL ESPACIO 3D — bajo UNA sola camara, del fondo (-680) al lente (+300) ══════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · EL FONDO — la mesa de la cocina de Ernesto. Es LA MISMA de punta a punta:
            no hay ni un cambio de fuente en todo el movimiento, solo el aire que se abre. */}
        <PhotoPlane src="img/cmeurgente/cmeu_ernesto_mesa.jpg" kind="photo" z={-680}
          scale={ip(g, [0, 732, 1122, 1872], [1.40, 1.30, 1.24, 1.16])}
          dim={ip(g, [0, 200, 560, 732, 1000, 1122, 1482, 1872], [0.60, 0.66, 0.78, 0.84, 0.86, 0.72, 0.60, 0.52])}
          tint={V.volt} />

        {/* PLANO 2 · EL TEJADO — en el acto 2 esta VACIO (nada se compro todavia) y en el acto 5
            se descubre cubierto y va bajando a 0,6: el sistema chico que si hacia falta. */}
        {g >= 386 && g < 760 && (
          <Plane z={-560} style={{ opacity: ip(g, [386, 440, 706, 756], [0, 0.7, 0.7, 0]) }}>
            <RoofPlane y={13} w={1500} h={300} rx={57} lit={0.34} z={0} panels={0} />
          </Plane>
        )}
        {techoOn && (
          <Plane z={-590} style={{ opacity: ip(g, [1470, 1546, 1872], [0, 0.62, 0.7]) }}>
            <RoofPlane y={9} w={1560} h={320} rx={56} lit={0.4} z={0} panels={techoPan} />
          </Plane>
        )}

        {/* PLANO 3 · LA FIRMA DEL VIDEO — las 24 horas, con el 22% del consumo dentro del sol.
            Va de textura del laboratorio de la medicion, detras de la barra. */}
        {sunOn > 0.01 && (
          <Plane z={-430}>
            <SunField sun={7 / 24} from={9} use={0.22} on={sunOn} tint={V.volt} night={V.sky}
              y={92} w={1240} h={34} cycle={230} />
            <div style={{
              position: "absolute", left: "50%", top: "95.4%", width: 1240, marginLeft: -620,
              textAlign: "center", opacity: sunOn * 1.5,
              fontFamily: F_BODY, fontWeight: 700, fontSize: 18, letterSpacing: 3.4,
              color: rgba(V.white, 0.44), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
            }}>VEINTICUATRO HORAS DE LA CASA</div>
          </Plane>
        )}

        {/* PLANO 4 · LA REJILLA DEL AIRE — profundidad medida, solo en el tramo del dato */}
        <Plane z={-380}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.4).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [760, 840, 1060, 1108], [0, 0.24, 0.24, 0.04]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.10)} 0 1px, rgba(0,0,0,0) 1px 112px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.06)} 0 1px, rgba(0,0,0,0) 1px 112px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO 5 · LA MESA — sube al cuadro con la camara en el acto 4 y sostiene el acto 5 */}
        {g >= 1140 && (
          <PadPlane y={ip(g, [1140, 1300, 1872], [116, 90, 86])} w={1700} h={380} rx={63}
            lit={mesaOn} z={-160} />
        )}

        {/* PLANO 6 · LA HOJA DEL CALENDARIO (acto 1) — material real, macro cerrado al abrir */}
        {calOn > 0.005 && (
          <Plane z={0}>
            <Ventana x={calX} y={calY} w={calW} h={calH} z={10} ry={ip(g, [0, 372], [3.4, 1.2])}
              rx={ip(g, [0, 372], [1.6, 0.4])} radius={10} lit={calLit} litColor={V.bone}>
              <Mat photo="img/cmeurgente/cmeu_calendario.jpg"
                w={calW} h={calH} k={kCal} u={uCal} v={vCal}
                lit={calLit} litColor={V.bone} sheenAt={L(64)} />
              {/* la luz del papel couche que rebota: baja cuando la casa se lleva la escena */}
              <AbsoluteFill style={{
                background: `linear-gradient(122deg, ${rgba(V.white, 0.10 * calLit)} 0%, rgba(0,0,0,0) 46%)`,
              }} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 7 · LA TIRA DE LOS TREINTA DIAS — se tacha sola, una casilla por dia */}
        {tiraOn > 0.01 && (
          <Plane z={54}>
            <TiraDias g={g} on={tiraOn} sinUltima={g >= 348} />
          </Plane>
        )}

        {/* PLANO 8 · LA CASA — NACE de la casilla 30 (match-shape g372) y se abre hasta ser la
            casa entera al anochecer. En g732 sigue creciendo y se va por abajo-izquierda
            mientras la camara entra: la frontera 2→3 se atraviesa, no se corta. */}
        {g >= 348 && g < 842 && (
          <Plane z={0}>
            <Ventana x={casaX} y={casaY} w={casaW} h={casaH} z={casaZ} ry={casaRY}
              rx={ip(g, [348, 560, 842], [0, 0.6, -2.2])}
              radius={g < 400 ? 3 : 12} lit={casaLit} litColor={V.amber}>
              <Mat photo="img/cmeurgente/cmeu_casa_noche.jpg"
                clip="broll/cmeurgente/cmeu_casa_noche_mov.mp4" vid={casaVid}
                w={casaW} h={casaH} k={casaK} u={casaU} v={casaV}
                lit={casaLit} litColor={V.amber} sheenAt={L(452)} />
              {/* la ventana encendida sigue calentando el marco desde adentro */}
              <AbsoluteFill style={{
                background: `radial-gradient(46% 40% at ${(casaU * 100).toFixed(1)}% ${(casaV * 100).toFixed(1)}%, ${rgba(V.amber, 0.22 * casaLit)} 0%, rgba(0,0,0,0) 68%)`,
              }} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 9 · LOS DOS SATELITES DEL ACTO 2 — la MISMA foto, dos recortes: el chiste
            visual de "por fuera no cambio nada" hecho con material real, no con texto. */}
        {satOn && (
          <Plane z={70}>
            <Ventana x={17.5} y={satYY} w={300} h={186} z={40} ry={11} rx={4} radius={9}
              lit={0.78} litColor={V.sky}>
              <Mat photo="img/cmeurgente/cmeu_casa_noche.jpg" w={300} h={186} k={1.7}
                u={0.42 + Math.sin(g / 210) * 0.006} v={0.5} lit={0.78} litColor={V.sky} sheenAt={L(524)} />
              <Rotulo txt="Dia 1" on={ip(g, [520, 546], [0, 1])} tint={rgba(V.white, 0.9)} />
            </Ventana>
            <Ventana x={82.5} y={satYY} w={300} h={186} z={40} ry={-11} rx={4} radius={9}
              lit={0.78} litColor={V.volt}>
              <Mat photo="img/cmeurgente/cmeu_casa_noche.jpg" w={300} h={186} k={1.7}
                u={0.42 + Math.sin(g / 210) * 0.006} v={0.5} lit={0.78} litColor={V.volt} sheenAt={L(548)} />
              <Rotulo txt="Dia 30" on={ip(g, [544, 570], [0, 1])} tint={V.volt} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 10 · LA COLUMNA — luz de la ventana → barra de 960 kWh → derrumbe a 580.
            UN SOLO elemento de g636 a g1123. Es lo que cruza las fronteras 2→3 y 3→4. */}
        {colVive && (
          <Plane z={24}>
            <Columna x={colX} y={colY} w={colW} h={hCol} tint={colTint} lit={colLit} halo={colHalo} g={g} />
            {/* el pie del grafico: aparece cuando la columna ya es un dato, no antes */}
            <div style={{
              position: "absolute", left: "50%", top: "88%", width: ip(g, [796, 856], [0, 980]),
              marginLeft: -ip(g, [796, 856], [0, 980]) / 2, height: 2,
              background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.white, 0.30)}, rgba(0,0,0,0))`,
              opacity: ip(g, [1064, 1104], [1, 0.2]),
            }} />
          </Plane>
        )}

        {/* PLANO 11 · EL MACRO DEL CUADERNO (acto 3) — la MISMA hoja del acto 1, ahora en otra
            escala y con otra luz: la variedad sale del material, no de amontonar piezas. */}
        {macroOn && (
          <Plane z={40}>
            <Ventana x={macroX} y={41} w={520} h={334} z={54} ry={-9} rx={5} radius={10}
              lit={0.94} litColor={V.volt}>
              <Mat photo="img/cmeurgente/cmeu_calendario.jpg" w={520} h={334} k={2.35}
                u={0.62 + Math.sin(g / 240) * 0.012} v={0.44 + Math.cos(g / 280) * 0.01}
                lit={0.94} litColor={V.volt} sheenAt={L(880)} />
              <Rotulo txt="Medido en casa" on={ip(g, [872, 900], [0, 1])} tint={V.volt} size={22} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 12 · LOS DOS PRESUPUESTOS — la barra convertida en hoja, que se abre hasta la
            mesa entera. Nace con la geometria EXACTA de la columna bajo la oclusion de papel. */}
        {presuVive && (
          <Plane z={0}>
            <Ventana x={presuX} y={presuY} w={presuW} h={presuH} z={ip(g, [OCL_FULL, 1290, 1872], [-20, 8, -14])}
              ry={presuRY} rx={ip(g, [OCL_FULL, 1290, 1872], [0, 1.2, 3.4])}
              radius={11} lit={presuLit} litColor={g < 1440 ? V.volt : V.amber}>
              <Mat photo="img/cmeurgente/cmeu_dos_presu.jpg" w={presuW} h={presuH}
                k={presuK} u={presuU} v={presuV}
                lit={presuLit} litColor={g < 1440 ? V.volt : V.amber} sheenAt={L(1236)} />
              {/* la luz de la ventana de la cocina entrando por abajo a la derecha (el exitTo) */}
              <AbsoluteFill style={{
                background: `radial-gradient(76% 60% at 78% 108%, ${rgba(V.amber, 0.30 * ip(g, [1400, 1640, 1872], [0, 0.6, 0.9]))} 0%, rgba(0,0,0,0) 66%)`,
              }} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 13 · EL FAJO — la linea de la resta abriendose. Lleva el billete adentro desde
            sus 4 px de alto: por eso al engordar no "aparece" nada, solo se ve mas de lo mismo. */}
        {dinVive && (
          <Plane z={90}>
            <Ventana x={dinX} y={dinY} w={dinW} h={dinH} z={70} ry={dinRY}
              rx={ip(g, [1470, 1600, 1872], [0, 3, 5])} radius={dinH < 30 ? 2 : 10}
              lit={1} litColor={V.amber}>
              <Mat photo="img/cmeurgente/cmeu_billetes.jpg" w={dinW} h={Math.max(6, dinH)}
                k={ip(g, [1470, 1600, 1872], [1.9, 1.3, 1.22])}
                u={0.5} v={0.5} lit={1} litColor={V.amber} sheenAt={L(1556)} />
              {/* mientras es LINEA, es tinta ambar; al abrirse deja ver que era papel moneda */}
              <AbsoluteFill style={{ background: rgba(V.amber, dinLuz) }} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 14 · LA CASA ENCENDIDA AL FINAL — el clip, chiquito, abajo a la derecha: de ahi
            entra el ambar con el que le entrego el cuadro a MovEscudo. */}
        {casaFinOn && (
          <Plane z={100}>
            <Ventana x={77} y={casaFinY} w={344} h={210} z={90} ry={-13} rx={7} radius={10}
              lit={0.92} litColor={V.amber}>
              <Mat photo="img/cmeurgente/cmeu_casa_noche.jpg"
                clip="broll/cmeurgente/cmeu_casa_noche_mov.mp4" vid={casaFinVid}
                w={344} h={210} k={1.32} u={0.48} v={0.5}
                lit={0.92} litColor={V.amber} sheenAt={L(1756)} />
              <Rotulo txt="La misma casa" on={ip(g, [1742, 1772], [0, 1])} tint={V.amber} size={21} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 15 · LOS ICONOS COMO OBJETOS DE LA ESCENA (con su parallax, no pegados) */}
        {g >= 44 && g < 236 && (
          <Plane z={120}>
            <IconPng src="img/cmeurgente/cmeu_ic_calendario.png" x={16} y={26}
              size={ip(g, [44, 92], [78, 132])}
              opacity={ip(g, [44, 84, 196, 234], [0, 0.94, 0.94, 0])}
              rot={ip(g, [44, 234], [-9, 4])} glow={V.ink0} />
          </Plane>
        )}
        {flechaOn > 0.01 && (
          <Plane z={130}>
            <IconPng src="img/cmeurgente/cmeu_ic_flechabaja.png" x={44.5} y={flechaY}
              size={ip(g, [896, 960], [86, 128])} opacity={flechaOn * 0.96}
              rot={ip(g, [896, 1030], [-6, 3])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1616 && g < 1790 && (
          <Plane z={140}>
            <IconPng src="img/cmeurgente/cmeu_ic_billete.png" x={39} y={82}
              size={ip(g, [1616, 1672], [72, 112])}
              opacity={ip(g, [1616, 1660, 1750, 1788], [0, 0.9, 0.9, 0])}
              rot={ip(g, [1616, 1788], [7, -4])} glow={V.ink0} />
          </Plane>
        )}

        {/* PLANO 16 · PRIMER PLANO — SIEMPRE hay algo pasando por delante del lente ---------- */}

        {/* acto 1: el canto del papel del presupuesto, fuera de foco, saliendo por abajo */}
        {g < 336 && (
          <Plane z={300}>
            <div style={{
              position: "absolute", left: "-14%", top: `${ip(g, [0, 336], [58, 118]).toFixed(1)}%`,
              width: "88%", height: "72%",
              transform: `rotate(${ip(g, [0, 336], [-6, -13]).toFixed(2)}deg)`,
              background: `linear-gradient(174deg, ${rgba(V.paper, 0.34)} 0%, ${rgba(V.paper, 0.13)} 12%, ${rgba(V.ink0, 0.92)} 46%, ${rgba(V.ink0, 0.98)} 100%)`,
              borderRadius: 6,
              boxShadow: `0 -20px 60px ${rgba(V.ink0, 0.9)}`,
            }} />
          </Plane>
        )}

        {/* frontera 2→3: el parteluz de la ventana barriendo el lente mientras la camara entra */}
        {parteluzOn && (
          <Plane z={286}>
            <div style={{
              position: "absolute", left: `${parteluzX.toFixed(1)}%`, top: "-30%",
              width: 46, height: "160%", marginLeft: -23,
              transform: `scaleX(${parteluzS.toFixed(2)}) rotate(1.6deg)`,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.ink1, 0.94)} 22%, ${rgba(V.ink0, 0.98)} 60%, rgba(0,0,0,0.0) 100%)`,
              boxShadow: `0 0 46px ${rgba(V.ink0, 0.9)}`,
            }} />
            <div style={{
              position: "absolute", left: `${(parteluzX + 21).toFixed(1)}%`, top: "-30%",
              width: 28, height: "160%", marginLeft: -14,
              transform: `scaleX(${(parteluzS * 0.8).toFixed(2)}) rotate(1.6deg)`,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.ink1, 0.7)} 40%, rgba(0,0,0,0) 100%)`,
            }} />
          </Plane>
        )}

        {/* acto 4: la cuña de la mesa entrando por abajo a la derecha, delante de todo */}
        {cunaOn && (
          <Plane z={240}>
            <div style={{
              position: "absolute", left: `${cunaX.toFixed(1)}%`, top: "64%",
              width: "62%", height: "56%", transform: "rotate(-7deg)",
              background: `linear-gradient(160deg, ${rgba(V.concrete, 0.16)} 0%, ${rgba(V.ink0, 0.94)} 40%, ${rgba(V.ink0, 0.99)} 100%)`,
              borderRadius: 10,
              boxShadow: `0 -16px 48px ${rgba(V.ink0, 0.86)}`,
            }} />
          </Plane>
        )}

        {/* acto 5: el borde de un billete cruzando el lente, delante del fajo */}
        {bordeOn && (
          <Plane z={266}>
            <div style={{
              position: "absolute", left: `${bordeX.toFixed(1)}%`, top: "34%",
              width: 420, height: "44%", marginLeft: -210, transform: "rotate(-16deg)",
              background: `linear-gradient(96deg, rgba(0,0,0,0) 0%, ${rgba(V.amber, 0.10)} 18%, ${rgba(V.ink0, 0.9)} 52%, ${rgba(V.ink0, 0.97)} 100%)`,
              borderRadius: 8,
            }} />
          </Plane>
        )}
      </Layers>

      {/* ══════ COSTURA · ENTRADA — la COLA de la oclusion de papel con la que sale
                `MovPresupuesto`. Arranca en el frame -16 y termina de salir en el 12: mis
                primeros cuadros abren DETRAS de esa misma materia. El corte no existe. ═══════ */}
      <SeamOcclude at={L(-16)} dur={28} color={V.paper} angle={7} />

      {/* ══════ COSTURA · FRONTERA 3→4 (g1122) — OCLUSION con V.paper: el presupuesto nuevo
                cruza por delante y detras ya esta la mesa con los dos papeles. ═══════════════ */}
      <SeamOcclude at={L(OCL)} dur={OCL_DUR} color={V.paper} angle={-9} />

      {/* ══════ EL VOLT DEL DISPLAY QUE VENIA ENCENDIDO — se apaga en 7 s, por luz, sin corte */}
      {voltPinza > 0.005 && (
        <AbsoluteFill style={{
          pointerEvents: "none",
          background: `radial-gradient(38% 30% at 9% 96%, ${rgba(V.volt, 0.17 * voltPinza)} 0%, rgba(0,0,0,0) 64%)`,
        }} />
      )}

      {/* ══════ HUD — texto y cifras en espacio de pantalla (margen de seguridad 60 px) ══════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* ACTO 1 · el contador de dias tachados, pegado a la tira */}
        {g >= 58 && g < 424 && (
          <>
            <CamaCifra x={19} y={44} size={ip(g, [58, 300, 400], [96, 108, 96])} on={ip(g, [58, 84, 396, 422], [0, 1, 1, 0])} a={0.7} />
            <Readout value={String(diasCont)} unit="/30" label="DIAS MEDIDOS"
              at={L(58)} x={19} y={44} size={ip(g, [58, 300, 400], [96, 108, 96])} color={V.volt} align="center" />
          </>
        )}

        {/* ACTO 1 · LA IDEA: treinta dias */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "70%", opacity: t1, transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)` }}>
            <Bed w={660} pad={24}>
              <Kick color={V.volt}>Antes de firmar le pedi</Kick>
              <div style={{ height: 8 }} />
              <Head size={82}>TREINTA DIAS</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>No para pensarlo. Para <Em>medirla</Em>.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · LA IDEA: la misma casa */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "11%", opacity: t2, transform: `translateY(${((1 - t2) * -22).toFixed(1)}px)` }}>
            <Bed w={640} pad={24}>
              <Kick color={V.amber}>Treinta dias despues</Kick>
              <div style={{ height: 8 }} />
              <Head size={78}>LA MISMA CASA</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Por fuera <Em color={V.amber}>no cambio nada</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · la cifra de la barra: 960 → 580 kWh, corriendo sobre la columna */}
        {g >= 836 && g < OCL_FULL && (
          <>
            <CamaCifra x={34} y={ip(g, [836, 1010, 1108], [30.5, 41.0, 41.0])} size={104}
              on={ip(g, [836, 862, 1082, 1106], [0, 1, 1, 0])} a={0.78} />
            <Readout value={miles(kwhVal)} unit="kWh"
              label={g < 1064 ? "AL MES" : undefined}
              at={L(838)} x={34} y={ip(g, [836, 1010, 1108], [30.5, 41.0, 41.0])}
              size={104} color={colTint} align="center" />
          </>
        )}

        {/* ACTO 3 · el porcentaje: cuarenta por ciento menos, en ambar (es lo que vale plata) */}
        {pctOn > 0.01 && (
          <div style={{
            position: "absolute", left: "46%", top: "72%", transform: "translate(-50%,-50%)",
            opacity: pctOn, textAlign: "center",
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, lineHeight: 0.9, color: V.amber,
              textShadow: `0 0 40px ${rgba(V.amber, 0.38)}, 0 6px 26px rgba(0,0,0,0.94)`,
            }}>-{Math.round(bajaPct)}<span style={{ fontSize: 46, marginLeft: 4 }}>%</span></div>
            <div style={{
              fontFamily: F_BODY, fontWeight: 700, fontSize: 20, letterSpacing: 2.6, marginTop: 6,
              color: rgba(V.white, 0.6), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
            }}>DE LA CASA ENTERA</div>
          </div>
        )}

        {/* ACTO 3 · LA IDEA: trescientos ochenta menos */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "56%", top: "68%", opacity: t3, transform: `translateY(${((1 - t3) * 22).toFixed(1)}px)` }}>
            <Bed w={640} pad={24}>
              <Kick color={V.volt}>La misma casa, medida</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>TRESCIENTOS OCHENTA MENOS</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Kilovatios hora <Em>cada mes</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 y 5 · LOS DOS NUMEROS — nacen sobre su papel y terminan a DISTINTA ALTURA */}
        {g >= 1184 && (
          <>
            <CamaCifra x={n1X} y={n1Y} size={n1S} on={n1On} a={0.8} />
            <div style={{
              position: "absolute", left: `${n1X}%`, top: `${n1Y}%`, transform: "translate(-50%,-50%)",
              opacity: n1On, textAlign: "center",
            }}>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: Math.round(n1S * 0.21),
                letterSpacing: 3.4, color: rgba(V.white, 0.56), textTransform: "uppercase",
                marginBottom: 6, textShadow: "0 4px 18px rgba(0,0,0,0.92)",
              }}>El de la primera visita</div>
              <div style={{ position: "relative", display: "inline-block", padding: "0 12px" }}>
                <div style={{
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: n1S, lineHeight: 0.9,
                  color: rgba(V.white, 0.58), textShadow: "0 6px 26px rgba(0,0,0,0.94)",
                }}>23.000</div>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: "56%", height: 5,
                  background: rgba(V.amber, 0.92), transform: `scaleX(${tacha.toFixed(3)})`,
                  transformOrigin: "0% 50%", boxShadow: `0 0 16px ${rgba(V.amber, 0.5)}`,
                }} />
              </div>
            </div>
          </>
        )}
        {g >= 1252 && (
          <>
            <CamaCifra x={n2X} y={n2Y} size={n2S} on={n2On} a={0.82} />
            <Readout value="13.800" label="EL MISMO VENDEDOR, TREINTA DIAS DESPUES"
              at={L(1254)} x={n2X} y={n2Y} size={n2S} color={V.amber} align="center" />
          </>
        )}

        {/* ACTO 4 · LA IDEA: trece mil ochocientos */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "70%", opacity: t4, transform: `translateY(${((1 - t4) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.amber}>Volvio y cotizo de nuevo</Kick>
              <div style={{ height: 8 }} />
              <Head size={70}>TRECE MIL OCHOCIENTOS</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Por la <Em color={V.amber}>misma casa</Em>, con menos consumo</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · LA DIFERENCIA — nace sobre la linea de la resta y viaja con el fajo */}
        {difOn > 0.01 && (
          <>
            <CamaCifra x={difX} y={difY} size={difS} on={difOn} a={0.84} />
            <Readout value={miles(dif)} label={g > 1520 ? "LA DIFERENCIA" : undefined}
              at={L(1480)} x={difX} y={difY} size={difS} color={V.amber} align="center" />
          </>
        )}

        {/* ACTO 5 · los ciento veintiseis dolares, minusculos al lado de la diferencia */}
        {cientoOn > 0.01 && (
          <div style={{
            position: "absolute", left: "43%", top: "90%", transform: "translate(-50%,-50%)",
            opacity: cientoOn, textAlign: "center",
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 46, lineHeight: 0.94, color: V.amber,
              textShadow: `0 0 22px ${rgba(V.amber, 0.3)}, 0 5px 20px rgba(0,0,0,0.94)`,
            }}>126</div>
            <div style={{
              fontFamily: F_BODY, fontWeight: 700, fontSize: 17, letterSpacing: 2.4, marginTop: 4,
              color: rgba(V.white, 0.55), textShadow: "0 3px 14px rgba(0,0,0,0.92)",
            }}>ME COSTO BAJARLA</div>
          </div>
        )}

        {/* ACTO 5 · LA IDEA: nueve mil doscientos */}
        {t5 > 0.01 && (
          <div style={{ position: "absolute", left: "5%", top: "66%", opacity: t5, transform: `translateY(${((1 - t5) * 24).toFixed(1)}px)` }}>
            <Bed w={640} pad={24}>
              <Kick color={V.amber}>Lo que bajo el presupuesto</Kick>
              <div style={{ height: 8 }} />
              <Head size={76}>NUEVE MIL DOSCIENTOS</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Sin tocar <Em color={V.amber}>un solo panel</Em></Body>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta: se cierra un poco cuando la escena es dato y se abre al final, con el aire */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(130% 110% at 50% 46%, rgba(0,0,0,0) 50%, rgba(6,7,5,${ip(g, [0, 732, 1122, 1482, 1872], [0.34, 0.46, 0.42, 0.34, 0.28]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
