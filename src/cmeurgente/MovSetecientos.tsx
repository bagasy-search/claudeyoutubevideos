// MovSetecientos.tsx — S4 · UN MOVIMIENTO CONTINUO de 62 s (1860 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 390,0.
//
// LA REGLA QUE EL ESPECTADOR SE LLEVA AUNQUE APAGUE EL VIDEO:
//   un kilovatio hora por día que sacas ANTES de cotizar son SETECIENTOS DÓLARES menos de sistema.
// El acto 1 la pone como una BALANZA FÍSICA DE DOS PLATOS: en el izquierdo el kWh (volt), en el
// derecho los setecientos dólares (ámbar), en equilibrio. Los actos 2, 3 y 4 son tres formas
// domésticas de mover ese plato — la secadora, el temporizador del calentador, el aire — y cada una
// carga el plato volt y EMPUJA HACIA ARRIBA el plato del dinero. La balanza NUNCA desaparece: se
// hace chica, se va al borde del cuadro, se mete en la esquina, pero sigue ahí, INCLINÁNDOSE UN
// POCO MÁS con cada cosa que se saca. Es el objeto que cruza las cuatro fronteras.
//   1,4  (secadora)  +  3,9  (temporizador)  +  7,2  (aire)  =  12,5 kWh/día
//   12,5 × 700  =  8.750 dólares menos de sistema  =  doce billetes y medio.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ HANDOFF — el acto N+1 arranca EXACTAMENTE donde termina el acto N                          ║
// ╠════╦═════════════════════════════════════════╦═════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto          ║ SALE: encuadre + luz + objeto               ║
// ╠════╬═════════════════════════════════════════╬═════════════════════════════════════════════╣
// ║ 1  ║ CÁM: primer plano cerrado sobre la hoja ║ CÁM: z −320→−236, ya retrocediendo y        ║
// ║ g0 ║      rayada (z −320, panY −6) — hereda  ║      subiendo (panY −6→+1). NO frena: la    ║
// ║    ║      de MovSemilla la mano y la goma.   ║      frontera la cruza empujando.           ║
// ║    ║ LUZ: ÁMBAR CONCENTRADO en la hoja, todo ║ LUZ: keyFrom 0,74→0,66 · int 0,50→0,68 ·    ║
// ║    ║      lo demás en sombra (key 0,74, int  ║      el ámbar empieza a abrirse hacia el    ║
// ║    ║      0,50, floor 0,74).                 ║      lavadero.                              ║
// ║    ║ MAT: LA HOJA RAYADA en macro → se       ║ MAT: EL PLATO IZQUIERDO (volt) de la        ║
// ║    ║      convierte en la MESA sobre la que  ║      balanza, que ya está CRECIENDO y cuyo  ║
// ║    ║      se levanta la BALANZA de 2 platos. ║      recorte macro se abre.                 ║
// ╠════╬═════════════════════════════════════════╬═════════════════════════════════════════════╣
// ║ 2  ║ CÁM: z≈−236 retrocediendo, misma        ║ CÁM: z≈−170 y viajando a la DERECHA-abajo   ║
// ║g420║      inercia, subiendo.                 ║      (panX ya positivo): el vector con el   ║
// ║    ║ LUZ: ámbar abriéndose + el sol del      ║      que entra el armario.                  ║
// ║    ║      patio (tint2 hacia `torch`).       ║ LUZ: key 0,66→0,60 · el ámbar se ESTRECHA:  ║
// ║    ║ MAT: EL TAMBOR DE LA SECADORA (era el   ║      entramos a un armario angosto.         ║
// ║    ║      plato: mismo círculo, mismo        ║ MAT: EL TAMBOR se encoge y VUELVE a ser el  ║
// ║    ║      material, el recorte se abrió).    ║      plato, ya cargado con 1,4 kWh.         ║
// ╠════╬═════════════════════════════════════════╬═════════════════════════════════════════════╣
// ║ 3  ║ CÁM: z≈−170 viajando derecha-abajo, sin ║ CÁM: z≈−104, empujando hacia adelante y     ║
// ║g840║      corte (MATCH-MOVE).                ║      empezando a ABRIR el encuadre.         ║
// ║    ║ LUZ: ámbar estrecho + `torch` puntual   ║ LUZ: key 0,60→0,52 · int 0,60→0,84: sale    ║
// ║    ║      (la linterna del armario).         ║      del armario a la pared del pasillo.    ║
// ║    ║ MAT: EL TANQUE DEL CALENTADOR con el    ║ MAT: LA PUERTA DE CHAPA del armario que se  ║
// ║    ║      temporizador atornillado al lado.  ║      cierra y CRUZA el cuadro (V.steel).    ║
// ╠════╬═════════════════════════════════════════╬═════════════════════════════════════════════╣
// ║ 4  ║ CÁM: z≈−104 abriendo, hereda el empuje. ║ CÁM: z≈−62 abierta y SUBIENDO (panY → +7).  ║
// ║g1230║ LUZ: ámbar de pasillo, entra el volt   ║ LUZ: key 0,52→0,42 · int 0,84→0,98: entra   ║
// ║    ║      del display del termostato.        ║      el volt del contador.                  ║
// ║    ║ MAT: EL TERMOSTATO DE PARED y el dedo   ║ MAT: EL ARO DEL BISEL del termostato, que   ║
// ║    ║      subiendo tres grados.              ║      se desprende y viaja.                  ║
// ╠════╬═════════════════════════════════════════╬═════════════════════════════════════════════╣
// ║ 5  ║ CÁM: z≈−62 subiendo y abriendo.         ║ CÁM: ALTA Y ABIERTA (z −40, panY +10) — el  ║
// ║g1560║ LUZ: ámbar abierto + volt del contador.║      encuadre con el que abre MovTresNumeros.║
// ║    ║ MAT: EL ARO, que aterriza como el CERO  ║ LUZ: ÁMBAR ABIERTO A TODA LA ESCENA (key    ║
// ║    ║      de 8.750 y el número se desenrolla ║      0,34, int 1,05, floor 0,40) + volt.    ║
// ║    ║      desde adentro de ese cero.         ║ MAT: LOS BILLETES APILADOS sobre la mesa y  ║
// ║    ║                                         ║      LA HOJA RAYADA EN BLANCO bajo ellos.   ║
// ╚════╩═════════════════════════════════════════╩═════════════════════════════════════════════╝
//
// LAS CUATRO COSTURAS — una distinta por frontera, ninguna es un fundido:
//   g420  1→2  MATCH-SHAPE  — EL PLATO IZQUIERDO SE VUELVE EL TAMBOR DE LA SECADORA. Es el MISMO
//                             círculo y el MISMO material: desde el frame 0 el plato volt tiene
//                             adentro un macro cerradísimo de la secadora (ilegible, sólo textura).
//                             Entre g396 y g470 el disco crece de 104 a 372 px, viaja al centro y
//                             su recorte se ABRE — y recién ahí se ve que el plato ERA el tambor.
//                             Ni un frame de negro: una sola forma entrega y recibe.
//   g840  2→3  MATCH-MOVE   — la cámara no corta: sigue su curva hacia la derecha-abajo (camPush y
//                             camRise no se reinician) y el mundo cambia debajo. El tambor sale por
//                             la izquierda CON el vector de la cámara mientras la columna del
//                             armario entra por la derecha CON el mismo vector. El tambor, ya
//                             encogido a plato, cruza la frontera EN VUELO hacia la balanza.
//   g1222 3→4  OCLUSIÓN     — <SeamOcclude color={V.steel} lit={0.34}>: la PUERTA DE CHAPA del
//                             armario se cierra y cruza el cuadro. Detrás ya está la pared del
//                             pasillo con el termostato. (⛔ nunca V.ink0, nunca lit > 0,45.)
//   g1560 4→5  MATCH-SHAPE  — EL ARO DEL BISEL DEL TERMOSTATO SE VUELVE EL CERO DE 8.750. El mismo
//                             anillo: se desprende del termostato a 132 px, viaja, se achica a 108,
//                             se estrecha a proporción de dígito y cambia de volt a ámbar. El resto
//                             del número (8.75) se DESENROLLA desde detrás de ese cero, revelado
//                             por ancho, no por opacidad.
//
// EL OBJETO QUE CRUZA TODAS LAS FRONTERAS: LA BALANZA.
//   f1: su plato izquierdo se vuelve el tambor de la secadora.
//   f2: el tambor se encoge y vuelve al brazo cargado con 1,4 kWh — la balanza se inclina 6°.
//   f3: la balanza queda pegada al borde izquierdo, cargada con 5,3 kWh — se inclina 13°.
//   f4: la balanza sube a la esquina superior derecha con 12,5 kWh — se inclina 21°.
//   f5: el plato ÁMBAR, ya arriba y colmado, se vuelca y sus doce billetes y medio caen sobre la
//       mesa: el plato SE TRANSFORMA en la pila de billetes real.
//
// ⛔ CONTRATO: ni un solo bloque de tiempo propio envolviendo un acto (reloj único `g`) · nada de
// ⛔ azar ni de reloj de sistema (todo sale de rnd(k) y de gFrame) · rutas de asset SOLO literales y
// ⛔ sólo las de la ficha · todo color por rgba() · light() sólo con nombres de V · nada anclado a
// ⛔ la ventana del navegador · máximo 2 capas con desenfoque.
// ⚠️ Los componentes del Stage que reciben `at`/`sheenAt` razonan en frames LOCALES → L().

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, SunField, RoofPlane, Layers, Plane, MediaCard, Carousel3D, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1860;
const A2 = 420;
const A3 = 840;
const A4 = 1230;
const A5 = 1560;

const SW = 1920;
const SH = 1080;
const pctX = (px: number) => (px / SW) * 100;
const pctY = (px: number) => (px / SH) * 100;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// separador de miles del canal (punto), sin depender de toLocaleString
const miles = (n: number) => {
  const s = String(Math.max(0, Math.round(n)));
  return s.length > 3 ? s.slice(0, s.length - 3) + "." + s.slice(s.length - 3) : s;
};
const coma = (n: number) => n.toFixed(1).replace(".", ",");

// ── VENTANA — el marco de vidrio RECTANGULAR que recorta material real ──────────────────────
const Ventana: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  lit?: number; litColor?: string; opacity?: number; children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, radius = 12, lit = 1, litColor = V.volt, opacity = 1, children }) => {
  const ww = Math.max(10, w);
  const hh = Math.max(10, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      border: `1px solid ${rgba(litColor, 0.3 * lit)}`,
      boxShadow: `0 ${Math.round(hh * 0.15)}px ${Math.round(hh * 0.24)}px ${rgba(V.ink0, 0.78)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.62)}, inset 0 1px 0 ${rgba(V.white, 0.26 * lit)}`,
    }}>{children}</div>
  );
};

// ── DISCO — la MISMA ventana pero REDONDA. Es la primitiva de este movimiento: el plato de la
//    balanza y el tambor de la secadora son EL MISMO disco, con el mismo material adentro, sólo
//    que uno mide 104 px y el otro 372. Ahí vive el match-shape de la frontera 1.
const Disco: React.FC<{
  cx: number; cy: number; r: number; z?: number;
  ry?: number; rx?: number; lit?: number; litColor?: string; opacity?: number;
  aro?: number; children?: React.ReactNode;
}> = ({ cx, cy, r, z = 0, ry = 0, rx = 0, lit = 1, litColor = V.volt, opacity = 1, aro = 1, children }) => {
  const d = Math.max(14, r * 2);
  return (
    <div style={{
      position: "absolute", left: `${cx}%`, top: `${cy}%`,
      width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`,
      borderRadius: "50%", overflow: "hidden", opacity: clamp01(opacity),
      border: `${Math.max(1, Math.round(r * 0.055 * aro))}px solid ${rgba(litColor, 0.44 * lit)}`,
      boxShadow: `0 ${Math.round(r * 0.30)}px ${Math.round(r * 0.42)}px ${rgba(V.ink0, 0.8)}, ` +
        `0 4px 16px ${rgba(V.ink0, 0.62)}, inset 0 2px 0 ${rgba(V.white, 0.24 * lit)}, ` +
        `inset 0 0 ${Math.round(r * 0.5)}px ${rgba(V.ink0, 0.62)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL adentro de la ventana/disco: la FOTO siempre (con recorte animado = nunca queda
//    quieta) y el CLIP encima mientras dura de verdad. `k` es el zoom de recorte (≥1: cubre).
const Mat: React.FC<{
  photo: string; clip?: string; vid?: number;
  w: number; h: number; k: number; cx?: number; cy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.03, k);
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

// ── LA HOJA RAYADA — el material con el que ENTRA y con el que SALE el movimiento. Es la
//    superficie (como PadPlane o RoofPlane), no una tarjeta: papel mate, renglones, bolígrafo.
const Hoja: React.FC<{
  y: number; w: number; h: number; rx: number; lit: number; z: number; escrito: number; g: number;
}> = ({ y, w, h, rx, lit, z, escrito, g }) => {
  const breathe = 1 + Math.sin(g / 101) * 0.003;
  return (
    <div style={{
      position: "absolute", left: "50%", top: `${y}%`, width: w, height: h, marginLeft: -w / 2,
      transform: `translateZ(${z}px) rotateX(${rx}deg) scale(${breathe.toFixed(4)})`,
      transformOrigin: "50% 0%", overflow: "hidden", borderRadius: 3,
      background: `linear-gradient(176deg, ${rgba(V.paper, 0.40 * lit)} 0%, ${rgba(V.paper, 0.19 * lit)} 42%, ${rgba(V.ink0, 0.94)} 100%)`,
      boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.22 * lit)}, 0 -20px 64px ${rgba(V.ink0, 0.84)}`,
    }}>
      {/* los renglones del cuaderno */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.5 * lit,
        backgroundImage: `repeating-linear-gradient(0deg, ${rgba(V.sky, 0.30)} 0 2px, rgba(0,0,0,0) 2px 54px)`,
      }} />
      {/* el margen rojo-tierra del cuaderno */}
      <div style={{
        position: "absolute", left: "13%", top: 0, bottom: 0, width: 2,
        background: rgba(V.copper, 0.34 * lit),
      }} />
      {/* la fibra del papel mate */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.13 * lit, mixBlendMode: "overlay",
        backgroundImage: "repeating-linear-gradient(97deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 6px)",
      }} />
      {/* lo escrito a mano con bolígrafo: trazos que aparecen por LONGITUD, no por opacidad */}
      {escrito > 0.005 && Array.from({ length: 7 }, (_, i) => {
        const q = clamp01(escrito * 2.1 - i * 0.16);
        const yy = 18 + i * 10.5;
        const largo = (22 + rnd(i * 3.7) * 34) * q;
        return (
          <div key={i} style={{
            position: "absolute", left: "17%", top: `${yy}%`, width: `${largo}%`, height: 3,
            background: rgba(V.sky, 0.62 * lit),
            boxShadow: `0 1px 0 ${rgba(V.ink0, 0.4)}`,
          }} />
        );
      })}
    </div>
  );
};

// ── LA BALANZA — fulcro, brazo y cadenas. Los PLATOS se dibujan aparte (son Discos con material
//    real adentro) porque uno de ellos se va a convertir en el tambor de la secadora.
const Brazo: React.FC<{
  fx: number; fy: number; arm: number; tilt: number; lit: number; escala: number;
  lx: number; ly: number; rxp: number; ryp: number;
}> = ({ fx, fy, arm, tilt, lit, escala, lx, ly, rxp, ryp }) => {
  const th = (tilt * Math.PI) / 180;
  const ex1 = fx - arm * Math.cos(th);
  const ey1 = fy + arm * Math.sin(th);
  const ex2 = fx + arm * Math.cos(th);
  const ey2 = fy - arm * Math.sin(th);
  const cadena = (x1: number, y1: number, x2: number, y2: number, key: string) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    return (
      <div key={key} style={{
        position: "absolute", left: x1, top: y1, width: len, height: Math.max(1, 2 * escala),
        transform: `rotate(${ang.toFixed(2)}deg)`, transformOrigin: "0% 50%",
        background: `linear-gradient(180deg, ${rgba(V.steel, 0.66 * lit)} 0%, ${rgba(V.ink1, 0.9)} 100%)`,
      }} />
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* la columna del fulcro, clavada en la mesa */}
      <div style={{
        position: "absolute", left: fx - 9 * escala, top: fy, width: 18 * escala, height: 352 * escala,
        background: `linear-gradient(94deg, ${rgba(V.steel, 0.16)} 0%, ${rgba(V.steel, 0.52 * lit)} 34%, ${rgba(V.ink1, 0.94)} 100%)`,
        boxShadow: `0 ${Math.round(16 * escala)}px ${Math.round(28 * escala)}px ${rgba(V.ink0, 0.8)}`,
      }} />
      {/* la base */}
      <div style={{
        position: "absolute", left: fx - 76 * escala, top: fy + 344 * escala,
        width: 152 * escala, height: 15 * escala, borderRadius: 5 * escala,
        background: `linear-gradient(180deg, ${rgba(V.steel, 0.5 * lit)} 0%, ${rgba(V.ink1, 0.95)} 100%)`,
      }} />
      {/* LAS CADENAS — se dibujan ANTES que los platos: cuando el plato crece, las tapa */}
      {cadena(ex1, ey1, lx - 44 * escala, ly, "l1")}
      {cadena(ex1, ey1, lx + 44 * escala, ly, "l2")}
      {cadena(ex2, ey2, rxp - 44 * escala, ryp, "r1")}
      {cadena(ex2, ey2, rxp + 44 * escala, ryp, "r2")}
      {/* EL BRAZO */}
      <div style={{
        position: "absolute", left: fx - arm, top: fy - 5 * escala,
        width: arm * 2, height: 11 * escala, borderRadius: 6 * escala,
        transform: `rotate(${tilt.toFixed(2)}deg)`, transformOrigin: "50% 50%",
        background: `linear-gradient(180deg, ${rgba(V.white, 0.30 * lit)} 0%, ${rgba(V.steel, 0.60 * lit)} 34%, ${rgba(V.ink1, 0.94)} 100%)`,
        boxShadow: `0 ${Math.round(9 * escala)}px ${Math.round(20 * escala)}px ${rgba(V.ink0, 0.7)}`,
      }} />
      {/* el eje: el punto sobre el que todo bascula */}
      <div style={{
        position: "absolute", left: fx - 13 * escala, top: fy - 13 * escala,
        width: 26 * escala, height: 26 * escala, borderRadius: "50%",
        background: `radial-gradient(circle at 36% 30%, ${rgba(V.white, 0.44 * lit)}, ${rgba(V.steel, 0.34 * lit)} 46%, ${rgba(V.ink0, 0.95)} 100%)`,
        boxShadow: `0 0 ${Math.round(22 * escala)}px ${rgba(V.volt, 0.16 * lit)}`,
      }} />
    </div>
  );
};

// ── LA FICHA DEL PLATO: la cifra pegada al disco (va DENTRO del disco, sobre su propia cama)
const PiePlato: React.FC<{ valor: string; unidad: string; on: number; tint: string; size: number }> = ({
  valor, unidad, on, tint, size,
}) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      padding: `${Math.round(size * 0.5)}px 0 ${Math.round(size * 0.18)}px`,
      opacity: clamp01(on), textAlign: "center",
      background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.9)} 62%)`,
    }}>
      <span style={{
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, color: tint, lineHeight: 1,
        textShadow: `0 0 ${Math.round(size * 0.5)}px ${rgba(tint, 0.4)}, 0 4px 16px rgba(0,0,0,0.92)`,
      }}>{valor}</span>
      <span style={{
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: Math.round(size * 0.46),
        marginLeft: Math.round(size * 0.12), color: rgba(V.white, 0.82),
      }}>{unidad}</span>
    </div>
  );
};

// ── EL BILLETE DE SETECIENTOS — objeto PNG con alfa que se apila en el plato ámbar.
//    Los de arriba llevan su sombra propia (IconPng); los de abajo, sombra barata (van tapados).
const PilaBilletes: React.FC<{ cx: number; cy: number; n: number; escala: number; g: number }> = ({
  cx, cy, n, escala, g,
}) => {
  const enteros = Math.floor(n);
  const medio = n - enteros;
  const paso = 7.4 * escala;
  const anchoB = 128 * escala;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: Math.max(0, enteros) }, (_, i) => {
        const arriba = i >= enteros - 3;
        const dx = (rnd(i * 5.1) - 0.5) * 13 * escala;
        const rot = (rnd(i * 8.9) - 0.5) * 9;
        const yy = cy - i * paso + Math.sin(g / 57 + i) * 0.7;
        if (arriba) {
          return (
            <IconPng key={i} src="img/cmeurgente/cmeu_ic_billete.png"
              x={pctX(cx + dx)} y={pctY(yy)} size={anchoB} z={0} opacity={0.98} rot={rot} glow={V.ink0} />
          );
        }
        return (
          <div key={i} style={{
            position: "absolute", left: cx + dx - anchoB / 2, top: yy,
            width: anchoB, height: anchoB * 0.44, borderRadius: 3 * escala,
            transform: `rotate(${rot.toFixed(2)}deg)`,
            background: `linear-gradient(172deg, ${rgba(V.amber, 0.30)} 0%, ${rgba(V.copper, 0.26)} 60%, ${rgba(V.ink1, 0.88)} 100%)`,
            boxShadow: `0 2px 6px ${rgba(V.ink0, 0.66)}`,
          }} />
        );
      })}
      {/* el MEDIO billete: recortado por ancho, no por opacidad */}
      {medio > 0.02 && (
        <div style={{
          position: "absolute", left: cx - anchoB / 2, top: cy - enteros * paso - paso,
          width: anchoB * medio, height: anchoB * 0.44, overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", left: 0, top: 0, width: anchoB, height: anchoB * 0.44,
            borderRadius: 3 * escala,
            background: `linear-gradient(172deg, ${rgba(V.amber, 0.42)} 0%, ${rgba(V.copper, 0.3)} 60%, ${rgba(V.ink1, 0.86)} 100%)`,
            boxShadow: `0 2px 8px ${rgba(V.ink0, 0.7)}`,
          }} />
        </div>
      )}
    </div>
  );
};

// ── LAS FICHAS DE CARGA — los tokens volt que salen de cada arreglo y caen al plato. Son un
//    GRÁFICO (una cuenta), no un objeto real disfrazado: por eso son geometría y no una foto.
const Ficha: React.FC<{
  x: number; y: number; r: number; on: number; tint: string; halo: number;
}> = ({ x, y, r, on, tint, halo }) => {
  if (on <= 0.01) return null;
  const d = Math.max(6, r * 2);
  return (
    <div style={{
      position: "absolute", left: x - r, top: y - r, width: d, height: d, borderRadius: "50%",
      opacity: clamp01(on),
      background: `radial-gradient(circle at 38% 30%, ${rgba(V.white, 0.5)}, ${rgba(tint, 0.72)} 40%, ${rgba(tint, 0.24)} 100%)`,
      boxShadow: `0 0 ${Math.round(r * (1.6 + 2.4 * halo))}px ${rgba(tint, 0.5)}, 0 3px 10px ${rgba(V.ink0, 0.7)}`,
      border: `1px solid ${rgba(tint, 0.7)}`,
    }} />
  );
};

// ── EL ARCO DE LOS VEINTICINCO MINUTOS — esto SÍ es un gráfico (una fracción de hora).
const ArcoMinutos: React.FC<{ cx: number; cy: number; r: number; frac: number; on: number }> = ({
  cx, cy, r, frac, on,
}) => {
  if (on <= 0.01) return null;
  const d = r * 2;
  const ang = 360 * clamp01(frac);
  return (
    <div style={{
      position: "absolute", left: cx - r, top: cy - r, width: d, height: d,
      borderRadius: "50%", opacity: clamp01(on),
      background: `conic-gradient(${rgba(V.volt, 0.82)} 0deg, ${rgba(V.volt, 0.55)} ${ang.toFixed(1)}deg, ${rgba(V.ink0, 0.62)} ${ang.toFixed(1)}deg 360deg)`,
      boxShadow: `0 0 ${Math.round(r * 0.7)}px ${rgba(V.volt, 0.34)}, 0 6px 20px ${rgba(V.ink0, 0.8)}`,
    }}>
      <div style={{
        position: "absolute", inset: r * 0.30, borderRadius: "50%",
        background: `radial-gradient(circle at 40% 32%, ${rgba(V.ink2, 0.96)}, ${rgba(V.ink0, 0.99)} 70%)`,
        boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.2)}`,
      }} />
    </div>
  );
};

export const MovSetecientos: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El build monta el movimiento entero de una sola pieza, pero los componentes del Stage que reciben
  // `at`/`sheenAt` razonan en frames LOCALES: L() traduce del reloj global al local.
  const lFrame = useCurrentFrame();
  const off = (gFrame ?? lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  // red de seguridad: si el build no manda gFrame, arranco en la cabecera del acto pedido
  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame as number)
    ? (gFrame as number)
    : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola, función de g, que NUNCA vuelve a cero ═══════════════════════════
  //    Un solo viaje: entra cerradísima sobre la hoja (z −320) y sale alta y abierta (z −40).
  const camB = gcam(g, { z0: -320, z1: -40, panX: 26, panY: 0, ry: -3.6, rx: 1.4, dur: END });
  // desviaciones LOCALES que se SUMAN al viaje (nunca lo reemplazan)
  const camPush = ip(g,
    [0, 140, 300, 420, 560, 700, 840, 980, 1120, 1230, 1360, 1470, 1560, 1690, 1860],
    [0, 26, 52, 40, 18, 34, 8, 26, 44, 22, 46, 30, 6, 34, 18]);
  const camRise = ip(g,
    [0, 130, 300, 420, 620, 840, 1040, 1230, 1400, 1560, 1700, 1860],
    [-6, -4, 0, 1, 3, 2, -2, 1, 4, 7, 9, 10]);
  const camTilt = ip(g, [0, 420, 840, 1230, 1560, 1860], [1.8, 1.2, 0.4, -0.6, -1.6, -2.4]);
  const camT = `${camB.transform} translateZ(${camPush.toFixed(1)}px) ` +
    `translateY(${camRise.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg)`;
  // la deriva de la cámara, replicada para el HUD: el texto no queda pegado con cinta al vidrio
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.42).toFixed(2)}px, ${(by * 0.42).toFixed(2)}px)`;

  // ══ LA LUZ — ámbar CONCENTRADO (lo que hereda) → ámbar ABIERTO + volt del contador ════════
  const keyFrom = ip(g, [0, 200, 420, 700, 840, 1100, 1230, 1420, 1560, 1720, 1860],
    [0.74, 0.72, 0.66, 0.62, 0.60, 0.56, 0.52, 0.46, 0.42, 0.36, 0.34]);
  const inten = ip(g, [0, 120, 300, 420, 620, 840, 1000, 1230, 1400, 1560, 1700, 1860],
    [0.50, 0.58, 0.66, 0.68, 0.74, 0.60, 0.66, 0.84, 0.90, 0.94, 1.02, 1.05]);
  const floor = ip(g, [0, 300, 620, 840, 1100, 1230, 1560, 1860],
    [0.74, 0.70, 0.62, 0.70, 0.68, 0.58, 0.48, 0.40]);
  // key: el ámbar de la ventana de la cocina que, al final, deja entrar el VOLT del contador
  const tintA = light(ip(g, [0, 420, 840, 1230, 1440, 1620, 1860], [0.04, 0.10, 0.18, 0.34, 0.52, 0.76, 0.88]), "amber", "volt");
  // contra: el sol del patio (acto 2) y la linterna del armario (acto 3)
  const tintB = light(ip(g, [0, 420, 560, 840, 1000, 1230, 1440, 1860], [0.06, 0.40, 0.58, 0.72, 0.76, 0.40, 0.18, 0.08]), "amber", "torch");

  // ══ LA BALANZA — el objeto que cruza LAS CUATRO FRONTERAS ═════════════════════════════════
  //    Se hace chica, se va al borde, se mete en la esquina, pero NUNCA desaparece: se inclina un
  //    poco más con cada kilovatio hora que se saca.
  const balEsc = ip(g, [0, 130, 300, 396, 470, 840, 900, 1222, 1260, 1560, 1640, 1860],
    [0.30, 0.86, 1.00, 1.00, 0.46, 0.44, 0.38, 0.38, 0.34, 0.34, 0.46, 0.52]);
  const balFX = ip(g, [0, 130, 300, 396, 470, 812, 880, 1180, 1222, 1300, 1560, 1660, 1860],
    [980, 968, 958, 956, 372, 356, 300, 232, 208, 1668, 1652, 1470, 1372]);
  const balFY = ip(g, [0, 130, 300, 396, 470, 812, 880, 1222, 1300, 1560, 1660, 1860],
    [604, 470, 400, 396, 232, 238, 272, 300, 200, 194, 224, 248]);
  const balArm = 336 * balEsc;
  const balZ = ip(g, [0, 300, 470, 840, 1230, 1560, 1860], [10, 0, -66, -78, -86, -62, -34]);
  const balLit = ip(g, [0, 120, 300, 470, 840, 1230, 1560, 1860],
    [0.35, 0.9, 1.0, 0.72, 0.66, 0.70, 0.86, 1.0]);
  // los kilovatios hora que se van cargando en el plato volt (uno por acto)
  const kwh = ip(g, [0, 300, 760, 830, 1120, 1180, 1440, 1512, 1620],
    [0, 1.0, 1.0, 1.4, 1.4, 5.3, 5.3, 12.5, 12.5]);
  const dolares = kwh * 700;
  // LA INCLINACIÓN: crece con cada carga. En el acto 1 oscila y se asienta en el equilibrio.
  const tiltBase = ip(g, [0, 300, 830, 900, 1180, 1250, 1512, 1580, 1700, 1860],
    [0, 0, 0, 6.2, 6.2, 13.4, 13.4, 21.2, 23.4, 24.6]);
  const oscila = Math.sin(g / 17) * ip(g, [140, 300, 830, 880, 1180, 1230, 1512, 1560],
    [5.4, 0.5, 0.5, 2.2, 0.4, 2.0, 0.4, 1.6]) + Math.sin(g / 41) * 0.5;
  const tilt = tiltBase + oscila;
  const th = (tilt * Math.PI) / 180;
  // los extremos del brazo y, colgando de ellos, los platos
  const cuelga = 202 * balEsc;
  const rigLx = balFX - balArm * Math.cos(th);
  const rigLy = balFY + balArm * Math.sin(th) + cuelga;
  const rigRx = balFX + balArm * Math.cos(th);
  const rigRy = balFY - balArm * Math.sin(th) + cuelga;

  // ══ FRONTERA 1 · MATCH-SHAPE — el plato izquierdo SE VUELVE el tambor de la secadora ══════
  //    `morph` 0 = es plato colgando del brazo · 1 = es el tambor, grande y al centro.
  const morph = ipe(g, [396, 470, 762, 830], [0, 1, 1, 0], Easing.bezier(0.3, 0.02, 0.24, 1));
  const tamborX = 1128 + Math.sin(g / 133) * 12;
  const tamborY = 534 + Math.cos(g / 157) * 9;
  const platoLx = lerp(rigLx, tamborX, morph);
  const platoLy = lerp(rigLy, tamborY, morph);
  const platoLr = lerp(104 * balEsc, 372, morph);
  // el RECORTE del material: cerradísimo (ilegible, sólo textura) → abierto (es una secadora)
  const cropSec = ip(g, [0, 396, 470, 700, 762, 830, 1860], [4.6, 4.4, 1.30, 1.22, 1.30, 4.4, 4.4]);
  const vidSec = g < 430 ? 0 : ip(g, [432, 560, 582], [1, 1, 0]);

  // ══ EL PLATO ÁMBAR — el dinero. Nunca se convierte en otra cosa hasta el final: ahí se VUELCA
  const vuelca = ipe(g, [1636, 1760], [0, 1], Easing.bezier(0.4, 0, 0.3, 1));
  const platoRx = lerp(rigRx, 1046, vuelca);
  const platoRy = lerp(rigRy, 470, vuelca);
  const platoRr = lerp(104 * balEsc, 118, vuelca * 0.5) * ip(g, [1560, 1700], [1, 1.34]);
  const platoRrot = ip(g, [1636, 1760], [0, -46]);

  // ══ ACTO 2 · LA SECADORA — cinco cargas, tres se van a la soga del patio ══════════════════
  const cargaOn = ip(g, [498, 532, 792, 826], [0, 1, 1, 0]);
  const vuelo = ipe(g, [612, 706], [0, 1], Easing.bezier(0.32, 0, 0.26, 1));
  const tenderX = ip(g, [420, 840], [1596, 1552]);
  const tenderY = ip(g, [420, 840], [268, 292]);

  // ══ ACTO 3 · EL TEMPORIZADOR — armario angosto, tarjeta VERTICAL (otra forma, otra escala) ═
  const armW = ip(g, [806, 900, 1140, 1222], [120, 566, 590, 640]);
  const armH = ip(g, [806, 900, 1140, 1222], [88, 768, 780, 812]);
  const armX = ip(g, [806, 900, 1140, 1222], [122, 56, 54.5, 52]);
  const armY = ip(g, [806, 900, 1140, 1222], [58, 50, 49, 47]);
  const arcoOn = ip(g, [946, 984, 1150, 1188], [0, 1, 1, 0]);
  const arcoFrac = ipe(g, [956, 1046], [0, 25 / 60], Easing.out(Easing.cubic));

  // ══ ACTO 4 · EL AIRE — tarjeta ANCHA (tercera forma) + los tres grados ════════════════════
  const terW = ip(g, [1216, 1300, 1470, 1560], [180, 940, 968, 1004]);
  const terH = ip(g, [1216, 1300, 1470, 1560], [110, 528, 546, 566]);
  const terX = ip(g, [1216, 1300, 1470, 1560], [-16, 44, 45.5, 47]);
  const terY = ip(g, [1216, 1300, 1470, 1560], [56, 47, 46, 45]);
  const vidTer = g < 1250 ? 0 : ip(g, [1252, 1380, 1402], [1, 1, 0]);
  const gradoOn = ip(g, [1318, 1352, 1494, 1528], [0, 1, 1, 0]);
  const solOn = ip(g, [1286, 1326, 1500, 1540], [0, 1, 1, 0]);

  // ══ FRONTERA 4 · MATCH-SHAPE — el ARO del bisel del termostato se vuelve el CERO de 8.750 ══
  const aroP = ipe(g, [1528, 1608], [0, 1], Easing.bezier(0.34, 0.02, 0.22, 1));
  // el bisel vive sobre la tarjeta del termostato; el cero vive en el número final
  const aroX = lerp(terX + 12.4, 53.6, aroP);
  const aroY = lerp(terY - 3.2, 35.5, aroP);
  const aroH = lerp(132, 108, aroP);
  const aroW = lerp(132, 86, aroP);
  const aroGrosor = lerp(15, 19, aroP);
  const aroTint = light(aroP, "volt", "amber");
  const aroOn = ip(g, [1500, 1524, 1836, 1858], [0, 1, 1, 0.7]);
  // el resto del número se DESENROLLA desde detrás del cero (por ancho, no por opacidad)
  const headW = ipe(g, [1600, 1682], [0, 372], Easing.bezier(0.24, 0.6, 0.24, 1));
  const cuenta = Math.round(ip(g, [1596, 1700, 1782, 1836], [0, 5240, 8180, 8750]) / 10) * 10;
  const cuentaTxt = miles(cuenta);
  const cabeza = cuentaTxt.length > 1 ? cuentaTxt.slice(0, cuentaTxt.length - 1) : "";

  // ══ ACTO 5 · LA MESA — la pila real, el tejado que suelta paneles, la hoja EN BLANCO ══════
  const mesaOn = g >= 1552;
  const pilaW = ip(g, [1552, 1660, 1860], [560, 900, 962]);
  const pilaH = ip(g, [1552, 1660, 1860], [330, 520, 556]);
  const pilaY = ip(g, [1552, 1660, 1860], [96, 74, 71]);
  const billetes = ip(g, [1596, 1700, 1782, 1836], [0, 7.5, 11.7, 12.5]);
  const techoPan = ip(g, [1600, 1790, 1860], [1, 0.68, 0.6]);
  const hojaBlanca = ip(g, [1742, 1846], [128, 84]);
  const spin = ip(g, [1596, 1860], [0.04, 0.42]);

  // ══ TEXTOS — UNA idea por acto, cada una viva ≥ 2,0 s + 0,28 s por palabra arriba de 3 ════
  const t1 = ip(g, [124, 150, 372, 400], [0, 1, 1, 0]);       // 5 palabras → mínimo 77 f · vive 276
  const t2 = ip(g, [500, 528, 786, 816], [0, 1, 1, 0]);       // 6 palabras → mínimo 86 f · vive 286
  const t3 = ip(g, [900, 928, 1168, 1200], [0, 1, 1, 0]);     // 4 palabras → mínimo 69 f · vive 268
  const t4 = ip(g, [1290, 1318, 1500, 1532], [0, 1, 1, 0]);   // 4 palabras → mínimo 69 f · vive 210
  const t5 = ip(g, [1660, 1690, 1860], [0, 1, 1]);            // 4 palabras → mínimo 69 f · vive 200

  // el fondo cambia DURO en la puerta de chapa de la frontera 3 (no hay fundido)
  const fondoPasillo = g >= 1222;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca; sólo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ EL ESPACIO 3D — planos con parallax propio, bajo UNA sola cámara ══════════════ */}
      <Layers cam={camT}>

        {/* PLANO −700 · EL TEJADO donde IRÍAN los paneles: suelta azules mientras corre la cuenta */}
        {g >= 1580 && (
          <Plane z={-40}>
            <RoofPlane y={ip(g, [1580, 1860], [18, 14])} w={1520} h={280} rx={-52}
              lit={ip(g, [1580, 1700, 1860], [0.16, 0.3, 0.38])} z={-700} panels={techoPan} />
          </Plane>
        )}

        {/* PLANO −620 · EL FONDO LEJANO — el patio con la soga al sol / la pared del pasillo */}
        {!fondoPasillo && (
          <PhotoPlane src="img/cmeurgente/cmeu_tender.jpg" kind="photo" z={-620}
            scale={ip(g, [0, 420, 1222], [1.34, 1.26, 1.18])}
            dim={ip(g, [0, 300, 420, 640, 840, 1222], [0.92, 0.9, 0.74, 0.66, 0.8, 0.86])}
            tint={V.amber} />
        )}
        {fondoPasillo && (
          <PhotoPlane src="img/cmeurgente/cmeu_billetes_pila.jpg" kind="photo" z={-640}
            scale={ip(g, [1222, 1860], [1.36, 1.20])}
            dim={ip(g, [1222, 1560, 1860], [0.88, 0.78, 0.66])}
            tint={V.amber} />
        )}

        {/* PLANO −430 · el aire de la cocina: la rejilla de profundidad que respira */}
        <Plane z={-430}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.6).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [180, 340, 1180, 1420, 1860], [0, 0.22, 0.22, 0.10, 0.05]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.amber, 0.09)} 0 1px, rgba(0,0,0,0) 1px 108px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.amber, 0.06)} 0 1px, rgba(0,0,0,0) 1px 108px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO −360 · LA FIRMA DEL VIDEO: las 24 horas. El aire se come las horas de sol. */}
        {g >= 1268 && g < 1556 && (
          <Plane z={-360}>
            <SunField sun={7 / 24} from={9} use={ip(g, [1330, 1470], [0.22, 0.86])}
              on={ip(g, [1268, 1306, 1520, 1554], [0, 0.5, 0.5, 0])}
              tint={V.volt} night={V.sky} y={ip(g, [1268, 1556], [80, 77])} w={1320} h={38} cycle={230} />
          </Plane>
        )}

        {/* PLANO −150 · LA HOJA RAYADA — con la que ENTRA el movimiento (es la mesa) ---------- */}
        <Plane z={-20}>
          <Hoja g={g}
            y={ip(g, [0, 130, 300, 470, 840, 1222], [22, 62, 78, 96, 112, 132])}
            w={ip(g, [0, 130, 300, 470], [3400, 2200, 1720, 1560])}
            h={ip(g, [0, 130, 300, 470], [1900, 900, 520, 440])}
            rx={ip(g, [0, 130, 300, 470], [8, 44, 62, 66])}
            lit={ip(g, [0, 70, 180, 300, 470, 840, 1180], [1.15, 1.1, 0.92, 0.72, 0.5, 0.34, 0.1])}
            z={-150}
            escrito={ip(g, [0, 90, 240], [0.42, 0.72, 1])} />
        </Plane>

        {/* PLANO −140 · LA HOJA EN BLANCO — con la que SALE el movimiento (el handoff siguiente) */}
        {g >= 1730 && (
          <Plane z={-10}>
            <Hoja g={g} y={hojaBlanca} w={1180} h={430} rx={64}
              lit={ip(g, [1730, 1846], [0.4, 1.05])} z={-140} escrito={0} />
          </Plane>
        )}

        {/* PLANO −60 · EL CARRUSEL DE LOS TRES ARREGLOS — orbitando detrás de la cuenta final -- */}
        {g >= 1600 && (
          <Plane z={-60} style={{ opacity: ip(g, [1600, 1650, 1820, 1858], [0, 0.62, 0.62, 0.4]) }}>
            <Carousel3D
              items={[
                { src: "img/cmeurgente/cmeu_secadora.jpg", kind: "photo", label: "Secadora" },
                { src: "img/cmeurgente/cmeu_temporizador.jpg", kind: "photo", label: "Temporizador" },
                { src: "img/cmeurgente/cmeu_termostato.jpg", kind: "photo", label: "Aire" },
                { src: "img/cmeurgente/cmeu_tender.jpg", kind: "photo", label: "Al sol" },
              ]}
              spin={spin} radius={760} cardW={356} cardH={210} y={28} focus={1} litColor={V.amber} />
          </Plane>
        )}

        {/* PLANO −40 · LA COLUMNA DEL ARMARIO (acto 3) — entra por la DERECHA con el vector de
            la cámara mientras el tambor sale por la izquierda: eso ES el match-move de g840 ---- */}
        {g >= 806 && g < 1246 && (
          <Plane z={-40}>
            {/* las jambas del armario angosto: encierran la tarjeta y estrechan la luz */}
            <div style={{
              position: "absolute", left: `${ip(g, [806, 900, 1222], [96, 24, 21])}%`, top: 0, bottom: 0,
              width: ip(g, [806, 900], [40, 150]),
              background: `linear-gradient(90deg, ${rgba(V.ink0, 0.96)} 0%, ${rgba(V.steel, 0.16)} 74%, ${rgba(V.ink0, 0.5)} 100%)`,
              opacity: ip(g, [806, 880, 1200, 1240], [0, 1, 1, 0.5]),
            }} />
            <div style={{
              position: "absolute", left: `${ip(g, [806, 900, 1222], [138, 76, 79])}%`, top: 0, bottom: 0,
              width: ip(g, [806, 900], [40, 150]),
              background: `linear-gradient(270deg, ${rgba(V.ink0, 0.96)} 0%, ${rgba(V.steel, 0.16)} 74%, ${rgba(V.ink0, 0.5)} 100%)`,
              opacity: ip(g, [806, 880, 1200, 1240], [0, 1, 1, 0.5]),
            }} />
            {/* LA TARJETA VERTICAL: el tanque del calentador con el temporizador atornillado */}
            <Ventana x={armX} y={armY} w={armW} h={armH}
              z={ip(g, [806, 900, 1222], [-70, 10, 26])}
              ry={ip(g, [806, 900, 1222], [-16, -3.4, 1.6])}
              rx={ip(g, [806, 1222], [3, -1])} radius={10}
              lit={ip(g, [806, 900, 1180, 1222], [0.3, 0.94, 1, 0.86])} litColor={V.torch}>
              <Mat photo="img/cmeurgente/cmeu_temporizador.jpg"
                w={armW} h={armH}
                k={Math.max(1.05, ip(g, [806, 900, 1140, 1222], [980, 700, 660, 700]) / Math.max(40, armW))}
                cx={50 + Math.sin(g / 214) * 3.2} cy={48 + Math.cos(g / 262) * 2.6}
                lit={ip(g, [806, 900, 1222], [0.3, 0.94, 0.9])} litColor={V.torch} sheenAt={L(916)} />
              {/* la luz de linterna que entra por el hueco de la puerta */}
              <AbsoluteFill style={{
                background: `radial-gradient(62% 46% at 62% 22%, ${rgba(V.torch, 0.26 * ip(g, [880, 980, 1200], [0, 1, 0.7]))} 0%, rgba(0,0,0,0) 66%)`,
              }} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO −20 · LA TARJETA ANCHA DEL TERMOSTATO (acto 4) — la tercera forma -------------- */}
        {g >= 1216 && (
          <Plane z={-20} style={{ opacity: ip(g, [1216, 1252, 1790, 1858], [0, 1, 1, 0.34]) }}>
            <Ventana x={terX} y={terY} w={terW} h={terH}
              z={ip(g, [1216, 1300, 1560, 1860], [-90, 20, 40, -120])}
              ry={ip(g, [1216, 1300, 1560, 1860], [17, 2.2, -1.4, -9])}
              rx={ip(g, [1216, 1560, 1860], [4, -1.2, -7])} radius={12}
              lit={ip(g, [1216, 1300, 1560, 1860], [0.26, 1, 0.94, 0.4])} litColor={V.volt}>
              <Mat photo="img/cmeurgente/cmeu_termostato.jpg" clip="broll/cmeurgente/cmeu_termostato_mov.mp4"
                vid={vidTer} w={terW} h={terH}
                k={Math.max(1.05, ip(g, [1216, 1300, 1470, 1860], [1620, 1120, 1060, 1180]) / Math.max(40, terW))}
                cx={50 + Math.sin(g / 198) * 3.0} cy={49 + Math.cos(g / 246) * 2.2}
                lit={ip(g, [1216, 1300, 1860], [0.26, 1, 0.5])} litColor={V.volt} sheenAt={L(1316)} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO −10 · LA PILA DE BILLETES REAL sobre la mesa (acto 5) ------------------------- */}
        {mesaOn && (
          <Plane z={-10}>
            <Ventana x={ip(g, [1552, 1860], [52, 50.5])} y={pilaY} w={pilaW} h={pilaH}
              z={ip(g, [1552, 1700, 1860], [-40, 26, 44])}
              ry={ip(g, [1552, 1860], [6, 1.4])} rx={ip(g, [1552, 1860], [18, 27])} radius={10}
              lit={ip(g, [1552, 1700, 1860], [0.34, 0.96, 1])} litColor={V.amber}>
              <Mat photo="img/cmeurgente/cmeu_billetes_pila.jpg" w={pilaW} h={pilaH}
                k={Math.max(1.05, ip(g, [1552, 1700, 1860], [820, 1060, 1090]) / Math.max(40, pilaW))}
                cx={50 + Math.sin(g / 236) * 2.6} cy={52 + Math.cos(g / 284) * 2}
                lit={ip(g, [1552, 1700, 1860], [0.34, 0.96, 1])} litColor={V.amber} sheenAt={L(1712)} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 0 · LA BALANZA — brazo, fulcro y cadenas. Plano PLANO a propósito: el orden de
            pintado es el del DOM, así el plato que crece tapa sus propias cadenas. ------------- */}
        <Plane z={balZ}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Brazo fx={balFX} fy={balFY} arm={balArm} tilt={tilt} lit={balLit} escala={balEsc}
              lx={platoLx} ly={platoLy} rxp={platoRx} ryp={platoRy} />

            {/* ── EL PLATO IZQUIERDO (VOLT) = EL TAMBOR DE LA SECADORA. UNA sola forma. ── */}
            <Disco cx={pctX(platoLx)} cy={pctY(platoLy)} r={platoLr}
              z={lerp(0, 46, morph)}
              ry={lerp(0, -3.4, morph) + Math.sin(g / 88) * 0.6}
              rx={lerp(6, 0, morph)}
              lit={ip(g, [0, 130, 300, 470, 840, 1230, 1560, 1860], [0.4, 0.94, 1, 1, 0.8, 0.78, 0.88, 1])}
              litColor={V.volt} aro={lerp(1.5, 0.9, morph)}>
              <Mat photo="img/cmeurgente/cmeu_secadora.jpg" clip="broll/cmeurgente/cmeu_secadora_mov.mp4"
                vid={vidSec} w={platoLr * 2} h={platoLr * 2} k={cropSec}
                cx={lerp(58, 50, morph) + Math.sin(g / 176) * 2.4}
                cy={lerp(44, 50, morph) + Math.cos(g / 208) * 2.0}
                lit={ip(g, [0, 300, 470, 1860], [0.5, 0.9, 1, 0.86])} litColor={V.volt} sheenAt={L(452)} />
              {/* el vidrio bombé del tambor: sólo cuando ES tambor */}
              {morph > 0.02 && (
                <AbsoluteFill style={{
                  background: `radial-gradient(66% 54% at 34% 22%, ${rgba(V.white, 0.16 * morph)} 0%, rgba(0,0,0,0) 62%)`,
                }} />
              )}
              <PiePlato valor={coma(kwh)} unidad="kWh" tint={V.volt}
                size={lerp(30 * balEsc + 14, 54, morph)}
                on={ip(g, [206, 240], [0, 1])} />
            </Disco>

            {/* ── EL PLATO DERECHO (ÁMBAR) = EL DINERO. Al final se VUELCA sobre la mesa. ── */}
            <Disco cx={pctX(platoRx)} cy={pctY(platoRy)} r={platoRr}
              z={lerp(0, 60, vuelca)}
              ry={Math.sin(g / 96) * 0.7 - 8 * vuelca}
              rx={6 - 34 * vuelca}
              lit={ip(g, [0, 130, 300, 840, 1230, 1560, 1860], [0.4, 0.9, 1, 0.74, 0.8, 0.96, 1])}
              litColor={V.amber} aro={1.4}>
              <Mat photo="img/cmeurgente/cmeu_billetes_pila.jpg"
                w={platoRr * 2} h={platoRr * 2}
                k={ip(g, [0, 300, 1560, 1700, 1860], [5.2, 4.8, 3.4, 2.2, 1.9])}
                cx={44 + Math.sin(g / 188) * 3.0} cy={54 + Math.cos(g / 222) * 2.4}
                lit={ip(g, [0, 300, 1560, 1860], [0.5, 0.92, 1, 1])} litColor={V.amber} sheenAt={L(268)} />
              <PiePlato valor={miles(dolares)} unidad="$" tint={V.amber}
                size={lerp(30 * balEsc + 14, 22, vuelca)}
                on={ip(g, [230, 264, 1660, 1700], [0, 1, 1, 0])} />
            </Disco>

            {/* el rótulo del plato ámbar en el acto 1: los SETECIENTOS de la regla */}
            {g >= 240 && g < 470 && (
              <div style={{
                position: "absolute", left: pctX(platoRx) + "%",
                top: `${pctY(platoRy + 132 * balEsc)}%`, transform: "translate(-50%,0)",
                opacity: ip(g, [244, 274, 430, 462], [0, 1, 1, 0]),
              }}>
                <Bed pad={12}>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.2,
                    color: rgba(V.amber, 0.94), textTransform: "uppercase", whiteSpace: "nowrap",
                  }}>Menos de sistema</div>
                </Bed>
              </div>
            )}
          </div>
        </Plane>

        {/* PLANO +10 · LAS CINCO CARGAS DE ROPA (acto 2): tres se van a la soga del patio ------- */}
        {g >= 494 && g < 830 && (
          <Plane z={20}>
            {Array.from({ length: 5 }, (_, i) => {
              const seVa = i >= 2;
              const q = seVa ? clamp01(vuelo * 1.5 - (i - 2) * 0.22) : 0;
              const x0 = tamborX - 236 + i * 118;
              const y0 = tamborY + 300;
              const xx = lerp(x0, tenderX - 150 + (i - 2) * 96, q);
              const yy = lerp(y0, tenderY + 132, q) - Math.sin(q * Math.PI) * 128;
              return (
                <Ficha key={i} x={xx} y={yy} r={ip(g, [494, 532], [10, 25])}
                  on={cargaOn} tint={seVa && q > 0.5 ? V.amber : V.volt}
                  halo={seVa ? Math.sin(clamp01(q) * Math.PI) : 0.2} />
              );
            })}
            {/* el sol del patio, como objeto de la escena (no decoración pegada al borde) */}
            <IconPng src="img/cmeurgente/cmeu_ic_sol.png"
              x={pctX(tenderX + 34)} y={pctY(tenderY - 168)}
              size={ip(g, [560, 660, 830], [76, 138, 128])}
              z={30} opacity={ip(g, [556, 606, 792, 826], [0, 0.94, 0.94, 0])}
              rot={ip(g, [560, 830], [-10, 6])} glow={V.ink0} />
            {/* LA SOGA DEL PATIO: la MISMA foto del fondo, ahora como tarjeta y a otra escala */}
            <Ventana x={pctX(tenderX)} y={pctY(tenderY)}
              w={ip(g, [520, 640, 830], [300, 430, 442])} h={ip(g, [520, 640, 830], [186, 268, 276])}
              z={ip(g, [520, 830], [-40, 22])} ry={-13} rx={2} radius={10}
              lit={ip(g, [520, 640, 792, 830], [0.3, 0.96, 0.96, 0.6])} litColor={V.amber}
              opacity={ip(g, [516, 548], [0, 1])}>
              <Mat photo="img/cmeurgente/cmeu_tender.jpg"
                w={ip(g, [520, 640, 830], [300, 430, 442])} h={ip(g, [520, 640, 830], [186, 268, 276])}
                k={ip(g, [520, 830], [1.5, 1.16])}
                cx={50 + Math.sin(g / 168) * 3.4} cy={48}
                lit={ip(g, [520, 640, 830], [0.3, 0.96, 0.8])} litColor={V.amber} sheenAt={L(648)} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO +30 · EL ARCO DE LOS 25 MINUTOS y el ícono del calentador (acto 3) ------------ */}
        {g >= 940 && g < 1200 && (
          <Plane z={40}>
            <ArcoMinutos cx={ip(g, [940, 1040, 1190], [1408, 1372, 1362])}
              cy={ip(g, [940, 1040, 1190], [386, 418, 424])}
              r={ip(g, [940, 1040, 1190], [78, 116, 112])} frac={arcoFrac} on={arcoOn} />
            <IconPng src="img/cmeurgente/cmeu_ic_reloj.png"
              x={ip(g, [940, 1040, 1190], [73.3, 71.4, 70.9])}
              y={ip(g, [940, 1040, 1190], [35.7, 38.7, 39.3])}
              size={ip(g, [940, 1040], [46, 66])} z={12}
              opacity={ip(g, [956, 1000, 1150, 1188], [0, 0.9, 0.9, 0])}
              rot={ip(g, [940, 1190], [-6, 5])} glow={V.ink0} />
          </Plane>
        )}

        {/* PLANO +40 · LOS TRES GRADOS DEL AIRE (acto 4) --------------------------------------- */}
        {g >= 1310 && g < 1536 && (
          <Plane z={50}>
            {Array.from({ length: 3 }, (_, i) => {
              const q = ipe(g, [1330 + i * 34, 1398 + i * 34], [0, 1], Easing.out(Easing.cubic));
              const xx = lerp(1196 + i * 74, 1408 + i * 62, q) + Math.sin(g / 61 + i) * 3;
              const yy = lerp(676, 372 - i * 44, q);
              return (
                <Ficha key={i} x={xx} y={yy} r={ip(g, [1318, 1360], [12, 27])}
                  on={gradoOn * clamp01(q * 3)} tint={V.amber} halo={Math.sin(clamp01(q) * Math.PI)} />
              );
            })}
            <IconPng src="img/cmeurgente/cmeu_ic_termometro.png"
              x={71.5} y={ip(g, [1310, 1420, 1530], [50, 44, 43])}
              size={ip(g, [1310, 1420], [66, 118])} z={16}
              opacity={solOn} rot={ip(g, [1310, 1530], [8, -4])} glow={V.ink0} />
          </Plane>
        )}

        {/* PLANO +120 · LOS DOCE BILLETES Y MEDIO — caen del plato ámbar a la mesa (acto 5) ---- */}
        {g >= 1596 && (
          <Plane z={120}>
            <PilaBilletes cx={ip(g, [1596, 1700, 1860], [1046, 1006, 986])}
              cy={ip(g, [1596, 1700, 1860], [546, 604, 618])}
              n={billetes} escala={ip(g, [1596, 1860], [0.86, 1.06])} g={g} />
          </Plane>
        )}

        {/* PLANO +240 · ALGO PASA POR DELANTE — la cadena del plato barre el lente (acto 1) y
            el canto de la puerta de chapa entra al cuadro antes de cerrarse (acto 3) ---------- */}
        {g >= 44 && g < 214 && (
          <Plane z={240}>
            <div style={{
              position: "absolute", top: "-30%", height: "160%",
              left: `${ip(g, [44, 214], [-24, 118])}%`, width: 42,
              transform: `rotate(${ip(g, [44, 214], [-13, 6])}deg)`,
              opacity: ip(g, [44, 74, 176, 210], [0, 0.86, 0.86, 0]),
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.steel, 0.5)} 34%, ${rgba(V.ink0, 0.94)} 78%, rgba(0,0,0,0) 100%)`,
              boxShadow: `0 0 60px ${rgba(V.ink0, 0.9)}`,
            }} />
          </Plane>
        )}
        {g >= 1150 && g < 1240 && (
          <Plane z={260}>
            <div style={{
              position: "absolute", top: "-24%", height: "148%",
              left: `${ip(g, [1150, 1240], [104, 62])}%`, width: 210,
              transform: `rotate(${ip(g, [1150, 1240], [4, 1])}deg)`,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.steel, 0.42)} 12%, ${rgba(V.ink1, 0.94)} 60%, ${rgba(V.ink0, 0.98)} 100%)`,
              boxShadow: `-30px 0 90px ${rgba(V.ink0, 0.86)}`,
            }} />
          </Plane>
        )}
        {/* el billete que se cruza delante del lente al caer (acto 5) */}
        {g >= 1706 && g < 1808 && (
          <Plane z={300}>
            <IconPng src="img/cmeurgente/cmeu_ic_billete.png"
              x={ip(g, [1706, 1808], [-8, 44])} y={ip(g, [1706, 1808], [-14, 122])}
              size={ip(g, [1706, 1808], [420, 300])} z={0}
              opacity={ip(g, [1706, 1730, 1780, 1806], [0, 0.9, 0.9, 0])}
              rot={ip(g, [1706, 1808], [-28, 42])} glow={V.ink0} />
          </Plane>
        )}
      </Layers>

      {/* ══════ COSTURA · FRONTERA 3 (g1222) — OCLUSIÓN: la puerta de CHAPA cierra y cruza ════ */}
      <SeamOcclude at={L(1206)} dur={30} color={V.steel} angle={4} lit={0.34} />
      <SeamWipeMatter at={L(1212)} dur={26} tint={V.steel} />

      {/* ══════ HUD — texto y cifras en espacio de pantalla (safe area 60 px) ════════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* ── EL SELLO DE LA REGLA: la balanza como marca sobre la hoja (acto 1) ── */}
        {g >= 96 && g < 388 && (
          <IconPng src="img/cmeurgente/cmeu_ic_balanza.png" x={12.5} y={20.5}
            size={ip(g, [96, 150], [72, 104])} z={0}
            opacity={ip(g, [96, 146, 350, 384], [0, 0.5, 0.5, 0])}
            rot={ip(g, [96, 388], [-7, 3])} glow={V.ink0} />
        )}

        {/* ── LA CIFRA DE LA REGLA: 700 dólares por cada kWh (acto 1) ── */}
        {g >= 260 && g < 412 && (
          <div style={{ opacity: ip(g, [260, 288, 384, 410], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "78%", top: "68%", width: 560, height: 300,
              marginLeft: -280, marginTop: -150,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value="700" unit="$" label="POR CADA KILOVATIO HORA" at={L(264)}
              x={78} y={68} size={118} color={V.amber} align="center" />
          </div>
        )}

        {/* ── EL CONTADOR DEL PLATO VOLT: lo que se va sacando (actos 2, 3 y 4) ── */}
        {g >= 848 && g < 1546 && (
          <div style={{ opacity: ip(g, [848, 880, 1512, 1544], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "20%", top: "16%", width: 520, height: 280,
              marginLeft: -260, marginTop: -140,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.8), rgba(8,9,6,0))",
            }} />
            <Readout value={coma(kwh)} unit="kWh" label="MENOS POR DÍA" at={L(852)}
              x={20} y={16} size={96} color={V.volt} align="center" />
          </div>
        )}

        {/* ══ FRONTERA 4 · EL ARO DEL TERMOSTATO QUE SE VUELVE EL CERO DE 8.750 ═══════════════
            Es UN SOLO anillo: nace como bisel del termostato (132 px, volt, redondo), viaja,
            se estrecha a proporción de dígito y se vuelve ámbar. El resto del número se
            DESENROLLA desde detrás de él — revelado por ANCHO, nunca por opacidad. */}
        {aroOn > 0.01 && (
          <div style={{
            position: "absolute", left: `${aroX}%`, top: `${aroY}%`,
            transform: "translate(-50%,-50%)", opacity: aroOn,
            display: "flex", alignItems: "center", gap: 0,
          }}>
            {/* la cama del número: nace con el aro y crece con él */}
            <div style={{
              position: "absolute", left: "50%", top: "50%", width: 300 + headW * 1.9, height: 330,
              marginLeft: -(300 + headW * 1.9) / 2, marginTop: -165,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.86), rgba(8,9,6,0))",
            }} />
            <div style={{
              width: headW, overflow: "hidden", display: "flex", justifyContent: "flex-end",
              position: "relative",
            }}>
              <span style={{
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 150, lineHeight: 0.9,
                color: V.amber, whiteSpace: "nowrap",
                textShadow: `0 0 58px ${rgba(V.amber, 0.36)}, 0 6px 26px rgba(0,0,0,0.92)`,
              }}>{cabeza}</span>
            </div>
            {/* EL ARO — el mismo objeto que era el bisel del termostato */}
            <div style={{
              width: aroW, height: aroH, borderRadius: "50%", position: "relative",
              border: `${aroGrosor.toFixed(1)}px solid ${aroTint}`,
              boxShadow: `0 0 ${(aroH * 0.42).toFixed(0)}px ${rgba(aroTint, 0.4)}, 0 6px 22px rgba(0,0,0,0.9), ` +
                `inset 0 0 ${(aroH * 0.2).toFixed(0)}px ${rgba(V.ink0, 0.5)}`,
            }} />
          </div>
        )}

        {/* ══ ACTO 1 · UN KILOVATIO HORA POR DÍA ══════════════════════════════════════════════ */}
        {t1 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "68%", opacity: t1,
            transform: `translateY(${((1 - t1) * 24).toFixed(1)}px)`,
          }}>
            <Bed w={700} pad={24}>
              <Kick color={V.volt}>La regla</Kick>
              <div style={{ height: 8 }} />
              <Head size={66}>UN KILOVATIO HORA POR DÍA</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>que sacas <Em>antes de cotizar</Em> son <Em color={V.amber}>setecientos dólares</Em> menos de sistema</Body>
            </Bed>
          </div>
        )}

        {/* ══ ACTO 2 · LA SECADORA: DE CINCO A DOS ════════════════════════════════════════════ */}
        {t2 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "72%", opacity: t2,
            transform: `translateY(${((1 - t2) * 22).toFixed(1)}px)`,
          }}>
            <Bed w={680} pad={24}>
              <Kick color={V.volt}>Forma uno</Kick>
              <div style={{ height: 8 }} />
              <Head size={66}>LA SECADORA: DE <Em>CINCO A DOS</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Tres cargas por semana se van <Em color={V.amber}>a la soga</Em></Body>
            </Bed>
          </div>
        )}

        {/* ══ ACTO 3 · UN TEMPORIZADOR DE VEINTICINCO ═════════════════════════════════════════ */}
        {t3 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "16%", opacity: t3,
            transform: `translateY(${((1 - t3) * -22).toFixed(1)}px)`,
          }}>
            <Bed w={660} pad={24}>
              <Kick color={V.volt}>Forma dos</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>UN TEMPORIZADOR DE <Em>VEINTICINCO</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={30}>El tanque calienta <Em>veinticinco minutos</Em>, no todo el día</Body>
            </Bed>
          </div>
        )}

        {/* ══ ACTO 4 · EL AIRE, TRES GRADOS ═══════════════════════════════════════════════════ */}
        {t4 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "72%", opacity: t4,
            transform: `translateY(${((1 - t4) * 22).toFixed(1)}px)`,
          }}>
            <Bed w={640} pad={24}>
              <Kick color={V.amber}>Forma tres</Kick>
              <div style={{ height: 8 }} />
              <Head size={70}>EL AIRE, <Em color={V.amber}>TRES GRADOS</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Y el compresor deja de comerse <Em>las horas de sol</Em></Body>
            </Bed>
          </div>
        )}

        {/* ══ ACTO 5 · OCHO MIL SETECIENTOS CINCUENTA ═════════════════════════════════════════ */}
        {t5 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "60%", opacity: t5,
            transform: `translateY(${((1 - t5) * 24).toFixed(1)}px)`,
          }}>
            <Bed w={700} pad={24}>
              <Kick color={V.amber}>Doce kilovatios hora y medio</Kick>
              <div style={{ height: 8 }} />
              <Head size={70}>OCHO MIL SETECIENTOS <Em color={V.amber}>CINCUENTA</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={30}>La misma casa. <Em>Un presupuesto más chico.</Em></Body>
            </Bed>
          </div>
        )}

        {/* la multiplicación de Ernesto, escrita como en la hoja: 12,5 × 700 */}
        {g >= 1700 && (
          <div style={{
            position: "absolute", left: "50%", top: "53%", transform: "translate(-50%,-50%)",
            opacity: ip(g, [1700, 1734], [0, 1]), display: "flex", alignItems: "baseline", gap: 16,
          }}>
            <span style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 58, color: V.volt,
              textShadow: "0 4px 20px rgba(0,0,0,0.92)",
            }}>12,5</span>
            <span style={{
              fontFamily: F_BODY, fontWeight: 600, fontSize: 34, color: rgba(V.white, 0.66),
              textShadow: "0 3px 14px rgba(0,0,0,0.9)",
            }}>kWh × 700</span>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta: cerradísima al principio (todo en sombra menos la hoja), abierta al final */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(${ip(g, [0, 420, 1230, 1860], [78, 100, 116, 132]).toFixed(0)}% ` +
          `${ip(g, [0, 420, 1230, 1860], [66, 86, 100, 112]).toFixed(0)}% at 50% 48%, rgba(0,0,0,0) ` +
          `${ip(g, [0, 420, 1230, 1860], [24, 36, 46, 56]).toFixed(0)}%, ` +
          `rgba(6,7,5,${ip(g, [0, 300, 840, 1230, 1860], [0.92, 0.84, 0.7, 0.56, 0.34]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
