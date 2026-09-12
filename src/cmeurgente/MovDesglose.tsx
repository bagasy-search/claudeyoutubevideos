// MovDesglose.tsx — S3 · video `cmeurgente` (canal "Claudio Mendoza Constructor").
// Tramo 270,0 s → 329,0 s = 59 s = 1770 cuadros a 30 fps. `gFrame` va de 0 a 1770.
//
// LA ESPINA: los veintitrés mil se parten en cinco piezas, y las placas azules — lo único que la
// gente cree que compra — son menos de la cuarta parte. No se dice: SE VE POR TAMAÑO. El bloque
// macizo de dinero se abre como un estuche, las cinco láminas salen con su GROSOR proporcional al
// monto, orbitan como piezas de catálogo y aterrizan en una regla donde la placa mide 25 de 100.
// La mano de obra mide más. Y al final del renglón queda un hueco que nadie contó: los dos mil
// del interés, disfrazados de descuento.
//
/* HANDOFF
 | acto | ENTRA: encuadre + luz + objeto                          | SALE: encuadre + luz + objeto                            | costura hacia el siguiente |
 |  1   | media-baja rotando desde la derecha (z −160, ry +6),     | z ≈ −118, ry ≈ +2,6, la cámara ya orbita; el estuche      | MATCH-MOVE: el bloque se abre en cinco láminas y la    |
 | g0   | blanco frío con el ámbar de cocina asomando (keyFrom     | ámbar se parte en dos mitades que salen de cuadro; las   | cámara orbita. El BLOQUE de los 23.000 se transforma   |
 |      | 0,22 · tint sky). MATERIA: el bloque macizo ámbar de     | cinco láminas quedan al aire con su grosor proporcional; | en LAS CINCO LÁMINAS; la cifra 23.000 se despega y     |
 |      | los veintitrés mil, con la cifra grabada, girando.       | la cifra 23.000 despega hacia el renglón del total.      | viaja al total de la regla, donde vive hasta el final. |
 |  2   | z ≈ −118 orbitando, luz aclarando hacia el ámbar         | z ≈ −196, ry ≈ −2, ámbar de cocina a medio entrar; las   | MATCH-SHAPE: la tarjeta de las PLACAS gira sobre su    |
 | g330 | (keyFrom 0,30). MATERIA: las cinco láminas abiertas,     | cuatro piezas que no son la placa salen de cuadro por    | eje, se pone de canto (se ve el canto de aluminio) y   |
 |      | que suben al anillo y giran con foto real adentro.       | los costados; la tarjeta de las PLACAS queda sola,       | vuelve siendo LA CAJA DEL INVERSOR: misma geometría,   |
 |      | La placa queda al frente y es más chica de lo esperado.  | centrada y grande, empezando a ponerse de canto.         | otro material. Nada se funde: el canto entrega.        |
 |  3   | z ≈ −196, ry ≈ −2, luz de garaje tibia (keyFrom 0,44).   | z ≈ −146, ry ≈ −7, ámbar lateral ya firme; el inversor   | OCLUSIÓN con V.steel: un RIEL DE ALUMINIO barre el     |
 | g720 | MATERIA: la caja gris del inversor atornillada a la      | grande a la izquierda y la tarjeta de los rieles alta a  | cuadro de derecha a izquierda. Detrás ya está el       |
 |      | pared, con su luz verde parpadeando adentro.             | la derecha, ya inclinada como una baranda.               | tejado. El RIEL se vuelve LA BARANDA DEL ANDAMIO.      |
 |  4   | z ≈ −146, ry ≈ −7, luz de tejado (keyFrom 0,58).         | z ≈ −224, ry ≈ −11,6, ámbar de cocina casi pleno; el     | ZOOM-THROUGH: la cámara entra en el CASCO del operario |
 | g1140| MATERIA: dos operarios con arnés y el andamio armado;    | plano de los operarios crece hasta llenar el cuadro y el | (un aro blanco) y sale en EL PAPEL DEL FINANCIAMIENTO. |
 |      | el tejado se va cubriendo de azul debajo.                | aro del casco queda marcado en el centro-izquierda.      | El aro del casco se vuelve EL SELLO REDONDO del papel. |
 |  5   | z ≈ −224 saliendo del casco, ámbar lateral bajo          | órbita completada, mirando el bloque desde el otro lado  | salida: entrega a MovSemilla el billete de los dos mil |
 | g1500| (keyFrom 0,70). MATERIA: la carpeta del financiamiento   | (z −240, ry −14). VENTANA DE LA COCINA plena: ámbar      | del interés cruzando en primer plano, y la regla ya    |
 |      | llenando el cuadro, con el sello redondo entrando.       | lateral bajo. MATERIA: el billete de los dos mil.        | cerrada en 23.000 sobre la mesa.                       |
*/
//
// COSTURAS — una distinta por frontera, ninguna es un fundido:
//   g330  1→2  MATCH-MOVE   — la cámara no corta: sigue su órbita mientras el estuche ámbar se parte
//                             en dos mitades que salen de cuadro por geometría (nunca por opacity) y
//                             las cinco láminas quedan al aire. Un solo vector de velocidad.
//   g722  2→3  MATCH-SHAPE  — la MISMA tarjeta gira de 0° a 90° (se ve el canto de aluminio, con su
//                             filo iluminado) y vuelve a 0° con OTRO material adentro. Ni un frame
//                             de negro: en el instante de canto la materia es el propio canto.
//   g1140 3→4  OCLUSIÓN     — <SeamOcclude color={V.steel}>: el riel de aluminio cruza el cuadro y
//                             detrás ya está el tejado con los operarios. El fondo y el material del
//                             panel principal cambian mientras la materia tapa el 100%.
//   g1483 4→5  ZOOM-THROUGH — zoomThrough() sobre el aro del casco: el mundo de los actos 1-4 se va
//                             hacia la cámara y por detrás ya crece el papel del financiamiento,
//                             anclado al mismo punto de pantalla donde estaba el aro.
//
// ⛔ CONTRATO: sin Math.random/Date.now (todo sale de rnd(k) y de g) · sin backdrop-filter · sin
// position fixed · cero capas con filter blur · rutas SOLO literales de la ficha · UNA Sequence
// (ningún acto envuelto) · imports sólo de react/remotion/VoltStage.
// ⚠️ Todo componente del Stage que recibe `at`/`sheenAt` razona en frames LOCALES → se traduce con L().

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, CLIP_FRAMES, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, RoofPlane, Layers, Plane, MediaCard, Carousel3D, PhotoPlane, IconPng,
  Readout, SeamOcclude, zoomThrough,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

// ── RUTAS (LITERALES — el build escanea el archivo por texto) ────────────────────────────────
const SRC_RIELES = "img/cmeurgente/cmeu_rieles.jpg";
const SRC_INVERSOR = "img/cmeurgente/cmeu_inversor.jpg";
const SRC_PANEL = "img/cmeurgente/cmeu_panel_pila.jpg";
const SRC_OPERARIOS = "img/cmeurgente/cmeu_operarios.jpg";
const SRC_PERMISOS = "img/cmeurgente/cmeu_permisos.jpg";
const CLIP_INVERSOR = "broll/cmeurgente/cmeu_inversor_mov.mp4";
const CLIP_OPERARIOS = "broll/cmeurgente/cmeu_operarios_mov.mp4";

const END = 1770;
const A2 = 330;
const A3 = 720;
const A4 = 1140;
const A5 = 1500;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const miles = (n: number) => {
  const s = String(Math.max(0, Math.round(n)));
  return s.length > 3 ? s.slice(0, s.length - 3) + "." + s.slice(s.length - 3) : s;
};

// ── EL PRESUPUESTO, PIEZA POR PIEZA ─────────────────────────────────────────────────────────
// El orden es el de pantalla (izquierda a derecha) y es el MISMO en el bloque, en el anillo, en
// la fila y en la regla: la lámina que arriba era la tercera abajo sigue siendo la tercera.
const PIEZAS = [
  { nombre: "RIELES Y MONTAJE", monto: 1900, src: SRC_RIELES },
  { nombre: "INVERSOR", monto: 3900, src: SRC_INVERSOR },
  { nombre: "PLACAS SOLARES", monto: 5800, src: SRC_PANEL },
  { nombre: "MANO DE OBRA", monto: 7600, src: SRC_OPERARIOS },
  { nombre: "PERMISOS Y TRÁMITES", monto: 1800, src: SRC_PERMISOS },
];
const HEROE = 2;               // la placa: la pieza que la gente cree que está comprando
const VISIBLE = 21000;         // lo que el vendedor sí desglosa
const OCULTO = 2000;           // el interés disfrazado de descuento
const TOTAL = 23000;

// ── GEOMETRÍA COMPARTIDA POR LOS CUATRO ESTADOS DE LAS PIEZAS ───────────────────────────────
type Lay = { x: number; y: number; w: number; h: number; z: number; ry: number; rx: number; lit: number };
const mixLay = (a: Lay, b: Lay, t: number): Lay => ({
  x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t),
  z: lerp(a.z, b.z, t), ry: lerp(a.ry, b.ry, t), rx: lerp(a.rx, b.rx, t), lit: lerp(a.lit, b.lit, t),
});

// 1 · EL BLOQUE: cinco láminas contiguas, grosor proporcional. 300 px = 21.000 dólares.
const ALTO_LAM = PIEZAS.map((p) => (300 * p.monto) / VISIBLE);
const ACUM: number[] = [];
{
  let a = 0;
  for (let i = 0; i < ALTO_LAM.length; i++) { ACUM.push(a); a += ALTO_LAM[i]; }
}
const TOP_BLOQUE = 1080 * 0.455 - 150;
const bloque = (i: number): Lay => ({
  x: 50, y: ((TOP_BLOQUE + ACUM[i] + ALTO_LAM[i] / 2) / 1080) * 100,
  w: 660, h: ALTO_LAM[i], z: 0, ry: 0, rx: 0, lit: 0.34,
});

// 2 · LA ESCALERA: el mismo bloque, separado. Acá ya se ve que una lámina es cuatro veces la otra.
const GAP_ESC = 27;
const TOP_ESC = 1080 * 0.45 - (300 + GAP_ESC * 4) / 2;
const escalera = (i: number): Lay => ({
  x: 50 + (i - HEROE) * 1.9,
  y: ((TOP_ESC + ACUM[i] + GAP_ESC * i + ALTO_LAM[i] / 2) / 1080) * 100,
  w: 660, h: ALTO_LAM[i], z: (i - HEROE) * 36, ry: (i - HEROE) * 2.6, rx: 0, lit: 0.66,
});

// 3 · EL ANILLO: cilindro real. El tamaño de cada tarjeta es el monto: la placa entra al frente
//     y es visiblemente más chica que la de mano de obra que viene atrás.
const R_ANILLO = 660;
const escalaPieza = (m: number) => 0.55 + 1.05 * (m / 7600);
const anillo = (i: number, spin: number): Lay => {
  const a = (i / PIEZAS.length) * 360 + spin * 360;
  const rad = (a * Math.PI) / 180;
  const zz = Math.cos(rad) * R_ANILLO;
  const xx = Math.sin(rad) * R_ANILLO;
  const depth = (zz + R_ANILLO) / (2 * R_ANILLO);
  const s = escalaPieza(PIEZAS[i].monto);
  return {
    x: 50 + (xx / 1920) * 100, y: 45.5,
    w: 300 * s, h: 186 * s, z: zz, ry: -a, rx: 0,
    lit: 0.30 + 0.70 * depth,
  };
};

// 4 · LA FILA: altura igual para todas, ANCHO proporcional al monto → el área es el dinero.
//     Es la lectura honesta y es donde la placa deja de ser "lo que compras" y pasa a ser 25 de 100.
const GAP_FILA = 18;
const W_FILA = PIEZAS.map((p) => (1500 * p.monto) / VISIBLE);
const X0_FILA = (1920 - (W_FILA.reduce((s, w) => s + w, 0) + GAP_FILA * 4)) / 2;
const XC_FILA: number[] = [];
{
  let a = X0_FILA;
  for (let i = 0; i < W_FILA.length; i++) { XC_FILA.push(a + W_FILA[i] / 2); a += W_FILA[i] + GAP_FILA; }
}
const fila = (i: number): Lay => ({
  x: (XC_FILA[i] / 1920) * 100, y: 51.9,
  w: W_FILA[i], h: 250, z: (i - HEROE) * 18, ry: (i - HEROE) * -2.6, rx: 0, lit: 1,
});
const FILA_HEROE = fila(HEROE);

// 5 · LA SALIDA: las cuatro piezas que no son la placa se van por los costados (geometría, ⛔ no opacity).
const salida = (i: number): Lay => {
  const f = fila(i);
  const izq = i < HEROE;
  return {
    ...f, x: izq ? -26 - (HEROE - 1 - i) * 8 : 126 + (i - HEROE - 1) * 8,
    y: f.y + 2.4, z: -300, ry: izq ? 20 : -20, rx: 0, lit: 0.32,
  };
};

// 6 · LA REGLA (la tira del presupuesto): el mismo reparto a escala de renglón. Vive del acto 2 al
//     final y es el ANCLA que no se mueve cuando la cámara atraviesa el casco.
const W_TIRA = 1340;
const H_TIRA = 42;
const Y_TIRA = 88;
const X_TIRA = 960 - W_TIRA / 2;
const W_SEG = PIEZAS.map((p) => (W_TIRA * p.monto) / TOTAL);
const W_SEG_OCULTO = (W_TIRA * OCULTO) / TOTAL;
const X_SEG: number[] = [];
{
  let a = X_TIRA;
  for (let i = 0; i < W_SEG.length; i++) { X_SEG.push(a); a += W_SEG[i] + 4; }
}
const X_SEG_OCULTO = X_TIRA + W_SEG.reduce((s, w) => s + w, 0) + 4 * W_SEG.length;
const ANCHO_TIRA_REAL = X_SEG_OCULTO + W_SEG_OCULTO - X_TIRA;
const tiraLay = (i: number): Lay => ({
  x: ((X_SEG[i] + W_SEG[i] / 2) / 1920) * 100, y: Y_TIRA,
  w: W_SEG[i], h: H_TIRA, z: -20, ry: 0, rx: 0, lit: 0.92,
});

// ── VENTANA: el marco de vidrio que RECORTA el material. Toda pieza de este movimiento es una
//    Ventana con MATERIAL REAL adentro — nunca una forma con texto.
const Ventana: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; radius?: number; lit?: number; litColor?: string; opacity?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, radius = 12, lit = 1, litColor = V.amber, opacity = 1, children }) => {
  const ww = Math.max(6, w);
  const hh = Math.max(6, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`,
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      border: `1px solid ${rgba(litColor, 0.32 * lit)}`,
      boxShadow: `0 ${Math.round(hh * 0.15)}px ${Math.round(hh * 0.24)}px ${rgba(V.ink0, 0.78)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.62)}, inset 0 1px 0 ${rgba(V.white, 0.28 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL dentro de la Ventana: la FOTO siempre (crop vivo) y el CLIP encima mientras corre.
const Mat: React.FC<{
  photo: string; clip?: string; vid?: number;
  w: number; h: number; k: number; cx?: number; cy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.amber, sheenAt = -999 }) => {
  const kk = Math.max(1.04, k);
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

// ── EL PIE DE LA LÁMINA: el nombre de la pieza y su cifra, pegados a su propia tarjeta.
const PieLamina: React.FC<{ nombre: string; monto: string; on: number; tint?: string; alto: number }> = ({
  nombre, monto, on, tint = V.amber, alto,
}) => {
  if (on <= 0.012 || alto < 96) return null;
  const fs = Math.max(17, Math.min(27, Math.round(alto * 0.11)));
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 12px 9px",
      opacity: clamp01(on),
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.92) 58%)",
      display: "flex", alignItems: "baseline", gap: 10, justifyContent: "space-between",
    }}>
      <span style={{
        fontFamily: F_BODY, fontWeight: 700, fontSize: fs - 3, letterSpacing: 1.6,
        color: rgba(V.white, 0.82), whiteSpace: "nowrap", overflow: "hidden",
      }}>{nombre}</span>
      <span style={{
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: fs + 5, color: tint, lineHeight: 1,
      }}>{monto}</span>
    </div>
  );
};

// ── EL CANTO: cuando la tarjeta se pone a 90° lo que se ve es el filo de aluminio. Esto NO es
//    decoración: es la materia que sostiene la costura MATCH-SHAPE (no hay un solo frame vacío).
const Canto: React.FC<{ x: number; y: number; h: number; z: number; on: number }> = ({ x, y, h, z, on }) => {
  if (on <= 0.02) return null;
  const ww = Math.max(4, 16 * on);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: ww, height: Math.max(8, h),
      marginLeft: -ww / 2, marginTop: -h / 2, transform: `translateZ(${z.toFixed(1)}px)`,
      borderRadius: 2,
      background: `linear-gradient(90deg, ${rgba(V.ink1, 0.9)} 0%, ${rgba(V.steel, 0.96)} 42%, ${rgba(V.white, 0.9)} 55%, ${rgba(V.steel, 0.7)} 72%, ${rgba(V.ink1, 0.9)} 100%)`,
      boxShadow: `0 0 26px ${rgba(V.steel, 0.42 * on)}, 0 10px 26px ${rgba(V.ink0, 0.8)}`,
      opacity: clamp01(on),
    }} />
  );
};

// ── EL ESTUCHE: las dos mitades del bloque macizo. Se abren de verdad (translate), nunca se funden.
const MitadEstuche: React.FC<{ lado: -1 | 1; abre: number; alto: number; g: number }> = ({ lado, abre, alto, g }) => {
  const anchoMitad = 344;
  const desliza = ipe(abre, [0, 1], [0, 1180], Easing.bezier(0.5, 0, 0.72, 1)) * lado;
  const gira = abre * 13 * lado;
  const sube = -abre * 26;
  const brillo = 0.5 + 0.5 * Math.sin(g / 23);
  return (
    <div style={{
      position: "absolute", left: 960 + (lado < 0 ? -anchoMitad - 2 : 2), top: TOP_BLOQUE - 14,
      width: anchoMitad, height: alto + 28, marginLeft: -0,
      transform: `translateZ(${(30 + abre * 190).toFixed(1)}px) translateX(${desliza.toFixed(1)}px) translateY(${sube.toFixed(1)}px) rotateZ(${gira.toFixed(2)}deg) rotateY(${(gira * 0.8).toFixed(2)}deg)`,
      borderRadius: lado < 0 ? "8px 2px 2px 8px" : "2px 8px 8px 2px",
      background: `linear-gradient(${lado < 0 ? 96 : 84}deg, ${rgba(V.amber, 0.30)} 0%, ${rgba(V.amber, 0.72)} 26%, ${rgba(V.copper, 0.62)} 58%, ${rgba(V.ink1, 0.94)} 100%)`,
      boxShadow: `inset 0 2px 0 ${rgba(V.white, 0.42)}, inset 0 -3px 0 ${rgba(V.ink0, 0.85)}, ` +
        `0 26px 60px ${rgba(V.ink0, 0.86)}`,
      overflow: "hidden",
    }}>
      {/* la veta del metal: el lingote no es un rectángulo plano */}
      <AbsoluteFill style={{
        opacity: 0.30, mixBlendMode: "overlay",
        backgroundImage: "repeating-linear-gradient(97deg, rgba(255,255,255,.55) 0 1px, rgba(0,0,0,0) 1px 13px)",
      }} />
      {/* el filo especular que recorre la cara */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, width: "34%",
        left: `${(lerp(-30, 96, brillo)).toFixed(1)}%`,
        background: `linear-gradient(100deg, rgba(255,255,255,0) 0%, ${rgba(V.white, 0.20)} 50%, rgba(255,255,255,0) 100%)`,
      }} />
      {/* la junta central: la línea por donde se va a partir */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, width: 3,
        [lado < 0 ? "right" : "left"]: 0,
        background: `linear-gradient(180deg, ${rgba(V.ink0, 0.2)}, ${rgba(V.ink0, 0.9)}, ${rgba(V.ink0, 0.2)})`,
      } as React.CSSProperties} />
    </div>
  );
};

// ── LA REGLA DEL PRESUPUESTO — el gráfico (esto SÍ es un gráfico: eje y renglón, no un objeto real).
const Regla: React.FC<{
  on: number; encendido: number[]; oculto: number; g: number; totalTxt: string;
}> = ({ on, encendido, oculto, g, totalTxt }) => {
  if (on <= 0.012) return null;
  return (
    <div style={{
      position: "absolute", left: `${((X_TIRA + ANCHO_TIRA_REAL / 2) / 1920) * 100}%`, top: `${Y_TIRA}%`,
      width: ANCHO_TIRA_REAL, height: H_TIRA + 4,
      marginLeft: -ANCHO_TIRA_REAL / 2, marginTop: -(H_TIRA + 4) / 2,
      opacity: clamp01(on),
    }}>
      {/* el canal vacío: se ve el reparto ANTES de que se llene */}
      <div style={{
        position: "absolute", inset: -3, borderRadius: 5,
        border: `1px solid ${rgba(V.white, 0.16)}`,
        background: `linear-gradient(180deg, ${rgba(V.ink1, 0.72)} 0%, ${rgba(V.ink0, 0.62)} 100%)`,
        boxShadow: `0 14px 40px ${rgba(V.ink0, 0.7)}`,
      }} />
      {PIEZAS.map((p, i) => {
        const e = clamp01(encendido[i]);
        const izq = X_SEG[i] - X_TIRA;
        const c = i === HEROE ? V.panel : V.amber;
        return (
          <div key={i} style={{ position: "absolute", left: izq, top: 0, width: W_SEG[i], height: H_TIRA }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: 3,
              border: `1px solid ${rgba(V.white, 0.10 + 0.22 * e)}`,
              background: `linear-gradient(180deg, ${rgba(c, 0.16 + 0.62 * e)} 0%, ${rgba(c, 0.05 + 0.24 * e)} 100%)`,
              boxShadow: e > 0.2 ? `inset 0 1px 0 ${rgba(V.white, 0.34 * e)}, 0 0 ${Math.round(16 * e)}px ${rgba(c, 0.34 * e)}` : "none",
            }} />
            {/* el nombre y la cifra sólo cuando la pieza ya fue nombrada */}
            {e > 0.35 && W_SEG[i] > 100 && (
              <div style={{
                position: "absolute", left: 0, right: 0, top: -25, textAlign: "center",
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 21,
                color: rgba(i === HEROE ? V.white : V.amber, 0.55 + 0.45 * e),
                textShadow: "0 3px 14px rgba(0,0,0,0.94)", opacity: clamp01((e - 0.35) / 0.4),
              }}>{miles(p.monto)}</div>
            )}
          </div>
        );
      })}
      {/* EL HUECO: los dos mil que nadie contó. Late en danger antes de encenderse en ámbar. */}
      <div style={{ position: "absolute", left: X_SEG_OCULTO - X_TIRA, top: 0, width: W_SEG_OCULTO, height: H_TIRA }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: 3,
          border: `1px dashed ${rgba(V.danger, 0.22 + 0.5 * clamp01(oculto) + 0.16 * (1 - clamp01(oculto)) * (0.5 + 0.5 * Math.sin(g / 11)))}`,
          background: `linear-gradient(180deg, ${rgba(V.danger, 0.06 + 0.66 * clamp01(oculto))} 0%, ${rgba(V.danger, 0.02 + 0.26 * clamp01(oculto))} 100%)`,
          boxShadow: oculto > 0.2 ? `0 0 ${Math.round(24 * oculto)}px ${rgba(V.danger, 0.4 * oculto)}` : "none",
        }} />
        {oculto > 0.4 && (
          <div style={{
            position: "absolute", left: -40, right: -40, top: -25, textAlign: "center",
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 21, color: rgba(V.danger, 0.95),
            textShadow: "0 3px 14px rgba(0,0,0,0.94)", opacity: clamp01((oculto - 0.4) / 0.35),
          }}>{miles(OCULTO)}</div>
        )}
      </div>
      {/* el renglón del total, a la derecha del canal */}
      <div style={{
        position: "absolute", left: ANCHO_TIRA_REAL + 26, top: -4, whiteSpace: "nowrap",
      }}>
        <div style={{
          fontFamily: F_BODY, fontWeight: 700, fontSize: 15, letterSpacing: 2.6,
          color: rgba(V.white, 0.5), textShadow: "0 3px 12px rgba(0,0,0,0.9)",
        }}>TOTAL</div>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 40, lineHeight: 1,
          color: rgba(V.amber, 0.94), textShadow: `0 0 20px ${rgba(V.amber, 0.34)}, 0 4px 16px rgba(0,0,0,0.92)`,
        }}>{totalTxt}</div>
      </div>
    </div>
  );
};

// ── EL HAZ: cuando una cifra se resuelve, el dinero CAE de la tarjeta a su renglón de la regla.
const Haz: React.FC<{ xPct: number; yDesde: number; p: number; tint: string }> = ({ xPct, yDesde, p, tint }) => {
  if (p <= 0.01 || p >= 1) return null;
  const env = Math.sin(p * Math.PI);
  const yTop = (yDesde / 100) * 1080;
  const yBot = (Y_TIRA / 100) * 1080;
  const largo = Math.max(10, (yBot - yTop) * clamp01(p * 1.35));
  return (
    <div style={{
      position: "absolute", left: `${xPct}%`, top: yTop, width: 5, height: largo, marginLeft: -2.5,
      background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(tint, 0.7 * env)} 24%, ${rgba(tint, 0.95 * env)} 100%)`,
      boxShadow: `0 0 22px ${rgba(tint, 0.5 * env)}`, borderRadius: 3,
    }} />
  );
};

export const MovDesglose: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El movimiento se monta con UNA sola Sequence; aun así traducimos a frames locales todo lo que
  // adentro llama a useCurrentFrame() (MediaCard, SeamOcclude, Readout, Carousel3D).
  const lFrame = useCurrentFrame();
  const off = (Number.isFinite(gFrame) ? (gFrame as number) : 0) - lFrame;
  const L = (gAt: number) => gAt - off;

  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame) ? (gFrame as number) : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // el primer límite de vuelta de un clip después de `desde`, para devolverle el cuadro a la foto
  // justo antes de que el loop salte (los clips duran 153 cuadros exactos).
  const finDeVuelta = (desde: number, tope: number) =>
    Math.min(tope, off + (Math.floor((desde - off) / CLIP_FRAMES) + 2) * CLIP_FRAMES);

  // ══ LA CÁMARA — un solo viaje: entra en z −160 / ry +6 y sale en z −240 / ry −14 ═══════════
  // gcam aporta la deriva viva (ningún cuadro perfectamente quieto); la órbita la conduzco yo con
  // tramos que se encadenan, para que la rotación no se agote en los primeros segundos.
  const camB = gcam(g, { z0: 0, z1: 0, panX: 0, panY: 0, dur: END });
  const camZ = ip(g,
    [0, 180, 330, 520, 720, 940, 1140, 1330, 1483, 1560, 1650, END],
    [-160, -134, -118, -152, -196, -172, -146, -186, -224, -232, -236, -240]);
  const camRY = ip(g, [0, 180, 330, 520, 720, 940, 1140, 1330, 1483, END],
    [6, 4.2, 2.6, 0.6, -2, -4.6, -7, -9.2, -11.6, -14]);
  const camY = ip(g, [0, 330, 720, 1140, 1483, END], [0, -6, -14, -20, -26, -30]);
  const camRX = ip(g, [0, 720, 1483, END], [2.4, 1.4, 0.5, 0]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) translateY(${camY.toFixed(1)}px) ` +
    `rotateY(${camRY.toFixed(2)}deg) rotateX(${camRX.toFixed(2)}deg)`;
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.42).toFixed(2)}px, ${(by * 0.42).toFixed(2)}px)`;

  // ══ LA LUZ — blanco frío del vendedor → VENTANA DE LA COCINA (ámbar lateral bajo) ═════════
  const keyFrom = ip(g, [0, A2, A3, A4, A5, END], [0.22, 0.30, 0.44, 0.58, 0.70, 0.78]);
  const inten = ip(g, [0, 120, A2, A3, A4, 1400, END], [0.86, 0.96, 1.0, 1.04, 0.98, 0.93, 0.88]);
  const floor = ip(g, [0, A3, 1400, END], [0.58, 0.63, 0.56, 0.50]);
  const tintA = light(ip(g, [0, 300, 900, 1400, END], [0.02, 0.20, 0.52, 0.86, 1]), "sky", "amber");
  const tintB = light(ip(g, [0, 420, A4, END], [0, 0.32, 0.72, 1]), "paper", "amber");

  // ══ LOS CUATRO ESTADOS DE LAS PIEZAS — se encadenan, nunca se reinician ═══════════════════
  const pAbre = ipe(g, [274, 392], [0, 1], Easing.bezier(0.34, 0.02, 0.24, 1));   // bloque → escalera
  const pAnillo = ipe(g, [386, 498], [0, 1], Easing.bezier(0.3, 0.02, 0.2, 1));   // escalera → anillo
  const pFila = ipe(g, [492, 566], [0, 1], Easing.bezier(0.26, 0.04, 0.2, 1));    // anillo → fila
  const pSale = ipe(g, [612, 706], [0, 1], Easing.bezier(0.4, 0, 0.72, 1));       // fila → fuera de cuadro
  const spin = ipe(g, [386, 520], [0, 1.6], Easing.bezier(0.22, 0.6, 0.24, 1));

  const layPieza = (i: number): Lay => {
    let l = mixLay(bloque(i), escalera(i), pAbre);
    l = mixLay(l, anillo(i, spin), pAnillo);
    l = mixLay(l, fila(i), pFila);
    if (i !== HEROE) l = mixLay(l, salida(i), pSale);
    return l;
  };

  // ══ EL PANEL PROTAGONISTA — nace como la lámina de las PLACAS y cruza las cuatro fronteras.
  // Es SIEMPRE la misma tarjeta: gira y vuelve con la caja del inversor; el riel de aluminio la
  // barre y vuelve con los operarios; la cámara la atraviesa por el casco. Un objeto, cuatro vidas.
  const kH = [566, 640, 700, 722, 744, 800, 900, 1060, 1140, 1200, 1330, 1440, 1483];
  const heroLay: Lay = {
    x: ip(g, kH, [FILA_HEROE.x, 45.5, 50, 50, 50, 46, 44.5, 43.5, 47, 48, 49.5, 50, 50]),
    y: ip(g, kH, [FILA_HEROE.y, 50.4, 47.4, 47, 46.8, 46.4, 46, 45.6, 45, 44.6, 43.8, 43.2, 43]),
    w: ip(g, kH, [FILA_HEROE.w, 470, 622, 640, 640, 726, 762, 786, 900, 986, 1180, 1300, 1340]),
    h: ip(g, kH, [FILA_HEROE.h, 284, 374, 386, 386, 436, 458, 472, 520, 570, 664, 730, 752]),
    z: ip(g, kH, [FILA_HEROE.z, 30, 62, 72, 72, 46, 34, 26, 44, 52, 74, 96, 104]),
    ry: ip(g, [700, 722, 744, 800, 1060, 1140, 1483], [0, 90, 0, -5.5, -6.5, -3.5, -1.6]),
    rx: 0,
    lit: ip(g, kH, [1, 1, 1, 0.86, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
  };
  const heroMat = g < 722 ? SRC_PANEL : g < 1140 ? SRC_INVERSOR : SRC_OPERARIOS;
  const heroClip = g < 722 ? undefined : g < 1140 ? CLIP_INVERSOR : CLIP_OPERARIOS;
  const heroTint = g < 722 ? V.panel : g < 1140 ? V.steel : V.amber;
  const finInv = finDeVuelta(762, 1088);
  const finOp = finDeVuelta(1180, 1436);
  const heroVid = g < 762 ? 0
    : g < 1140 ? ip(g, [762, finInv - 20, finInv - 4], [1, 1, 0])
      : ip(g, [1172, 1180, finOp - 20, finOp - 4], [0, 1, 1, 0]);
  const heroCrop = Math.max(1.05, ip(g,
    [566, 700, 744, 900, 1060, 1140, 1330, 1483],
    [520, 700, 900, 880, 840, 1160, 1330, 1420]) / Math.max(60, heroLay.w));
  // el canto de aluminio que sostiene la frontera 2 (visible sólo cuando la tarjeta está de perfil)
  const canto = clamp01(1 - Math.abs(Math.cos((heroLay.ry * Math.PI) / 180)) * 1.9);

  // ══ LA TARJETA DE LOS RIELES — sube de su propio renglón de la regla y se vuelve baranda ═══
  const pRiel = ipe(g, [876, 952], [0, 1], Easing.bezier(0.24, 0.04, 0.2, 1));
  const rielEscena: Lay = { x: 79.5, y: 40, w: 470, h: 300, z: 96, ry: -12, rx: 0, lit: 1 };
  const rielBaranda: Lay = { x: 82, y: 26, w: 560, h: 176, z: 150, ry: -19, rx: 0, lit: 0.95 };
  const layRiel = mixLay(mixLay(tiraLay(0), rielEscena, pRiel), rielBaranda, ipe(g, [1044, 1136], [0, 1], Easing.bezier(0.4, 0, 0.7, 1)));

  // ══ LA TARJETA DEL CLIP DE OBRA — sube del renglón más ancho de todos (mano de obra) ══════
  const pObra = ipe(g, [1218, 1292], [0, 1], Easing.bezier(0.24, 0.04, 0.2, 1));
  const obraEscena: Lay = { x: 19.5, y: 62, w: 452, h: 268, z: 118, ry: 11, rx: 0, lit: 1 };
  const layObra = mixLay(tiraLay(3), obraEscena, pObra);
  const finObra = finDeVuelta(1300, 1452);
  const obraVid = ip(g, [1288, 1300, finObra - 18, finObra - 4], [0, 1, 1, 0]);

  // ══ LA REGLA — se enciende renglón por renglón, en el momento en que cada cifra se resuelve ═
  const reglaOn = ip(g, [418, 470], [0, 1]);
  const enc = [
    ip(g, [962, 998], [0, 1]),      // rieles
    ip(g, [836, 872], [0, 1]),      // inversor
    ip(g, [604, 646], [0, 1]),      // placas
    ip(g, [1246, 1288], [0, 1]),    // mano de obra
    ip(g, [1548, 1584], [0, 1]),    // permisos
  ];
  const ocultoOn = ip(g, [1600, 1664], [0, 1]);
  const totalTxt = miles(ip(g, [1600, 1664], [VISIBLE, TOTAL]));

  // los haces: el dinero cae de la tarjeta al renglón
  const haces = [
    { x: (XC_FILA[HEROE] / 1920) * 100, y: 58, p: ip(g, [600, 656], [0, 1]), tint: V.panel },
    { x: 44.5, y: 60, p: ip(g, [832, 886], [0, 1]), tint: V.amber },
    { x: 79.5, y: 56, p: ip(g, [958, 1012], [0, 1]), tint: V.amber },
    { x: 19.5, y: 76, p: ip(g, [1242, 1300], [0, 1]), tint: V.amber },
  ];

  // ══ LA CIFRA DE LOS VEINTITRÉS MIL — se graba en el bloque y despega hacia el total ═══════
  const totX = ip(g, [0, 274, 340, 430], [50, 50, 66, 88.6]);
  const totY = ip(g, [0, 274, 340, 430], [45.5, 45.5, 62, 81.4]);
  const totS = ip(g, [0, 274, 340, 430], [206, 206, 120, 46]);
  const totOn = ip(g, [26, 44, 412, 436], [0, 1, 1, 0]);

  // ══ COSTURA 4 · ZOOM-THROUGH por el casco ════════════════════════════════════════════════
  const FX = 41.5, FY = 34;                       // el casco del operario, en pantalla
  const zt = zoomThrough(g, 1449, 34, FX, FY);
  const ztOut = zt.out === "none" ? undefined : zt.out;
  const escala5 = ipe(g, [1470, 1584], [2.18, 1], Easing.bezier(0.2, 0.6, 0.22, 1));
  const papelLay: Lay = {
    x: ip(g, [1470, 1584, 1680, END], [FX + 3, 50, 50, 50.5]),
    y: ip(g, [1470, 1584, 1680, END], [FY + 6, 45.5, 45, 44.6]),
    w: ip(g, [1470, 1584, 1680, END], [1180, 1264, 1230, 1204]),
    h: ip(g, [1470, 1584, 1680, END], [664, 712, 692, 678]),
    z: ip(g, [1470, 1584, END], [40, 76, 92]),
    ry: ip(g, [1470, 1584, END], [-2, -4.5, -6]),
    rx: 0, lit: 1,
  };
  // el aro: en el acto 4 es el casco, en el acto 5 es el sello del papel. Mismo círculo.
  const aroCasco = ip(g, [1396, 1424, 1462, 1478], [0, 1, 1, 0.6]);
  const aroSelloX = ip(g, [1478, 1590, 1660], [FX + 3, 66.5, 68]);
  const aroSelloY = ip(g, [1478, 1590, 1660], [FY + 4, 60, 61]);
  const aroSelloS = ip(g, [1478, 1590, 1660], [176, 132, 126]);
  const aroSelloOn = ip(g, [1478, 1510, 1650, 1700], [0.6, 1, 1, 0.35]);

  // ══ EL RENGLÓN TACHADO — "descuento por financiación" que no descuenta nada ═══════════════
  const tachaOn = ip(g, [1618, 1642], [0, 1]);
  const tacha = ipe(g, [1642, 1682], [0, 1], Easing.bezier(0.3, 0.02, 0.3, 1));

  // ══ TEXTOS — UNA idea por acto, siempre sobre <Bed>, titular ≥48 px ═══════════════════════
  const t1 = ip(g, [82, 106, 286, 312], [0, 1, 1, 0]);        // VEINTITRÉS MIL
  const t2 = ip(g, [552, 578, 682, 706], [0, 1, 1, 0]);        // LOS PANELES: 5.800
  const t3 = ip(g, [946, 972, 1090, 1116], [0, 1, 1, 0]);      // EL INVERSOR Y LOS RIELES
  const t4 = ip(g, [1196, 1222, 1408, 1440], [0, 1, 1, 0]);    // 7.600 DE MANO DE OBRA
  const t5 = ip(g, [1554, 1580, 1742, END], [0, 1, 1, 0.92]);  // DOS MIL DISFRAZADOS

  // ══ CIFRAS DE CADA PIEZA (cuentan hasta su valor sobre su propio objeto) ══════════════════
  const nPlacas = ip(g, [576, 596, 612, 630], [0, 4100, 6200, 5800]);
  const nInv = ip(g, [812, 830, 846, 862], [0, 2600, 4300, 3900]);
  const nRiel = ip(g, [934, 952, 968, 984], [0, 1300, 2200, 1900]);
  const nObra = ip(g, [1216, 1238, 1258, 1276], [0, 5200, 8400, 7600]);
  const nInt = ip(g, [1596, 1620, 1640, 1658], [0, 1400, 2300, 2000]);

  // ══ FONDOS: el mostrador de los papeles hasta la oclusión; el tejado después ══════════════
  const fondoTejado = g >= 1142;
  const catalogoOn = ip(g, [356, 434, 900, 1136], [0, 0.32, 0.30, 0.22]);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y sólo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      <Layers cam={camT}>

        {/* PLANO −660 · el fondo lejano */}
        {!fondoTejado && (
          <PhotoPlane src="img/cmeurgente/cmeu_permisos.jpg" kind="photo" z={-660}
            scale={ip(g, [0, 1140], [1.30, 1.19])}
            dim={ip(g, [0, 120, 420, 900, 1140], [0.60, 0.66, 0.74, 0.80, 0.82])} tint={V.sky} />
        )}
        {fondoTejado && g < 1492 && (
          <PhotoPlane src="img/cmeurgente/cmeu_operarios.jpg" kind="photo" z={-640}
            scale={ip(g, [1140, 1483], [1.34, 1.22])}
            dim={ip(g, [1140, 1330, 1483], [0.74, 0.70, 0.68])} tint={V.amber} />
        )}

        {/* PLANO −430 · la rejilla de profundidad: el aire tiene medida */}
        <Plane z={-430}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.6).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [140, 330, 1140, 1483], [0.05, 0.24, 0.24, 0.06]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.amber, 0.09)} 0 1px, rgba(0,0,0,0) 1px 108px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.amber, 0.06)} 0 1px, rgba(0,0,0,0) 1px 108px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO −380 · EL CATÁLOGO DEL VENDEDOR: carrusel 3D lejano con las cinco piezas.
            Gira despacio detrás de todo y se lo lleva la oclusión del riel en la frontera 3. */}
        {g >= 356 && g < 1142 && (
          <Plane z={-380} style={{ opacity: catalogoOn }}>
            <Carousel3D
              items={[
                { src: "img/cmeurgente/cmeu_rieles.jpg", kind: "photo" },
                { src: "img/cmeurgente/cmeu_inversor.jpg", kind: "photo" },
                { src: "img/cmeurgente/cmeu_panel_pila.jpg", kind: "photo" },
                { src: "img/cmeurgente/cmeu_operarios.jpg", kind: "photo" },
                { src: "img/cmeurgente/cmeu_permisos.jpg", kind: "photo" },
              ]}
              spin={g / 1250} radius={1020} cardW={302} cardH={182} y={29}
              focus={HEROE} litColor={V.sky} />
          </Plane>
        )}

        {/* ══════════ EL MUNDO DE LOS ACTOS 1-4 — lo atraviesa el zoom-through ══════════════ */}
        {g < 1492 && (
          <AbsoluteFill style={{
            transformStyle: "preserve-3d", transform: ztOut, opacity: zt.opacity,
            transformOrigin: `${FX}% ${FY}%`,
          }}>

            {/* EL TEJADO: entra por geometría en el acto 3 y se cubre de azul en el acto 4 */}
            {g >= 1024 && (
              <RoofPlane
                y={ip(g, [1024, 1140, 1330, 1483], [122, 84, 78, 76])}
                w={1520} h={340} rx={ip(g, [1024, 1483], [66, 56])}
                lit={ip(g, [1024, 1140, 1483], [0.25, 0.85, 1])}
                z={-190}
                panels={ip(g, [1024, 1140, 1330, 1483], [0.12, 0.25, 0.55, 0.62])} />
            )}

            {/* LAS CINCO LÁMINAS DEL PRESUPUESTO — material real adentro de cada una */}
            {PIEZAS.map((p, i) => {
              if (i === HEROE) return null;
              if (g >= 712) return null;                    // ya salieron de cuadro por geometría
              const l = layPieza(i);
              return (
                <Plane key={i} z={0}>
                  <Ventana x={l.x} y={l.y} w={l.w} h={l.h} z={l.z} ry={l.ry} rx={l.rx}
                    radius={g < 300 ? 3 : 10} lit={l.lit} litColor={V.amber}>
                    <Mat photo={p.src} w={l.w} h={l.h}
                      k={Math.max(1.05, (l.w * 1.3) / Math.max(60, l.w))}
                      cx={50 + Math.sin(g / (220 + i * 31)) * 2.6}
                      cy={50 + Math.cos(g / (260 + i * 27)) * 2.2}
                      lit={l.lit} litColor={V.amber} sheenAt={L(404 + i * 17)} />
                    {/* la cara ámbar del lingote: mientras es bloque, la materia manda sobre la foto */}
                    <AbsoluteFill style={{
                      background: `linear-gradient(174deg, ${rgba(V.amber, 0.72 * (1 - pAbre))} 0%, ${rgba(V.copper, 0.62 * (1 - pAbre))} 60%, ${rgba(V.ink1, 0.8 * (1 - pAbre))} 100%)`,
                      mixBlendMode: "hard-light",
                    }} />
                    <PieLamina nombre={p.nombre} monto={miles(p.monto)}
                      on={ip(g, [430, 470], [0, 1]) * (1 - pSale * 1.3)} tint={V.amber} alto={l.h} />
                  </Ventana>
                </Plane>
              );
            })}

            {/* EL ESTUCHE ÁMBAR — se parte en dos y sale de cuadro: ésa es la frontera 1 */}
            {g < 446 && (
              <Plane z={0}>
                <MitadEstuche lado={-1} abre={pAbre} alto={300} g={g} />
                <MitadEstuche lado={1} abre={pAbre} alto={300} g={g} />
              </Plane>
            )}

            {/* ⭐ EL PANEL PROTAGONISTA — placas → inversor → operarios, siempre la misma tarjeta */}
            <Plane z={0}>
              <Ventana x={heroLay.x} y={heroLay.y} w={heroLay.w} h={heroLay.h} z={heroLay.z}
                ry={heroLay.ry} rx={heroLay.rx} radius={g < 300 ? 3 : 12}
                lit={heroLay.lit} litColor={heroTint}>
                <Mat photo={heroMat} clip={heroClip} vid={heroVid}
                  w={heroLay.w} h={heroLay.h} k={heroCrop}
                  cx={50 + Math.sin(g / 240) * 3.0} cy={50 + Math.cos(g / 290) * 2.4}
                  lit={heroLay.lit} litColor={heroTint} sheenAt={L(g < 760 ? 592 : g < 1150 ? 790 : 1206)} />
                {g < 400 && (
                  <AbsoluteFill style={{
                    background: `linear-gradient(174deg, ${rgba(V.amber, 0.72 * (1 - pAbre))} 0%, ${rgba(V.copper, 0.62 * (1 - pAbre))} 60%, ${rgba(V.ink1, 0.8 * (1 - pAbre))} 100%)`,
                    mixBlendMode: "hard-light",
                  }} />
                )}
                {/* el azul del panel: mientras la tarjeta ES la placa, el objeto tiene su color */}
                {g < 730 && (
                  <AbsoluteFill style={{
                    background: rgba(V.panel, 0.16 * ip(g, [430, 500, 700, 726], [0, 1, 1, 0])),
                    mixBlendMode: "soft-light",
                  }} />
                )}
                <PieLamina
                  nombre={g < 722 ? "PLACAS SOLARES" : g < 1140 ? "INVERSOR" : "MANO DE OBRA"}
                  monto={g < 722 ? miles(5800) : g < 1140 ? miles(3900) : miles(7600)}
                  on={g < 722 ? ip(g, [430, 470, 700, 716], [0, 1, 1, 0])
                    : g < 1140 ? ip(g, [770, 800, 1104, 1128], [0, 1, 1, 0])
                      : ip(g, [1180, 1214, 1400, 1432], [0, 1, 1, 0])}
                  tint={g < 722 ? V.white : V.amber} alto={heroLay.h} />
              </Ventana>
              {/* EL CANTO DE ALUMINIO: la materia que sostiene el match-shape de la frontera 2 */}
              <Canto x={heroLay.x} y={heroLay.y} h={heroLay.h} z={heroLay.z + 2} on={canto} />
            </Plane>

            {/* LA TARJETA DE LOS RIELES — sube de su renglón y se inclina hasta ser baranda */}
            {g >= 872 && g < 1142 && (
              <Plane z={0}>
                <Ventana x={layRiel.x} y={layRiel.y} w={layRiel.w} h={layRiel.h} z={layRiel.z}
                  ry={layRiel.ry} rx={layRiel.rx} radius={10} lit={layRiel.lit} litColor={V.steel}>
                  <Mat photo="img/cmeurgente/cmeu_rieles.jpg" w={layRiel.w} h={layRiel.h}
                    k={Math.max(1.06, ip(g, [872, 952, 1136], [640, 560, 720]) / Math.max(60, layRiel.w))}
                    cx={50 + Math.sin(g / 210) * 2.6} cy={50 + Math.cos(g / 250) * 2.0}
                    lit={layRiel.lit} litColor={V.steel} sheenAt={L(958)} />
                  <PieLamina nombre="RIELES Y MONTAJE" monto={miles(1900)}
                    on={ip(g, [944, 976], [0, 1])} tint={V.amber} alto={layRiel.h} />
                </Ventana>
              </Plane>
            )}

            {/* LA TARJETA DEL CLIP DE OBRA — sube del renglón más ancho de toda la regla */}
            {g >= 1214 && g < 1466 && (
              <Plane z={0}>
                <Ventana x={layObra.x} y={layObra.y} w={layObra.w} h={layObra.h} z={layObra.z}
                  ry={layObra.ry} rx={layObra.rx} radius={10} lit={layObra.lit} litColor={V.amber}>
                  <Mat photo="img/cmeurgente/cmeu_operarios.jpg" clip="broll/cmeurgente/cmeu_operarios_mov.mp4"
                    vid={obraVid} w={layObra.w} h={layObra.h}
                    k={Math.max(1.06, ip(g, [1214, 1292, 1460], [620, 520, 560]) / Math.max(60, layObra.w))}
                    cx={48} cy={50 + Math.cos(g / 230) * 2.2}
                    lit={layObra.lit} litColor={V.amber} sheenAt={L(1300)} />
                </Ventana>
              </Plane>
            )}

            {/* EL ARO DEL CASCO: el círculo por el que la cámara va a entrar */}
            {aroCasco > 0.02 && (
              <Plane z={130}>
                <div style={{
                  position: "absolute", left: `${FX}%`, top: `${FY}%`,
                  width: ip(g, [1396, 1440, 1478], [230, 168, 150]),
                  height: ip(g, [1396, 1440, 1478], [230, 168, 150]),
                  marginLeft: -ip(g, [1396, 1440, 1478], [230, 168, 150]) / 2,
                  marginTop: -ip(g, [1396, 1440, 1478], [230, 168, 150]) / 2,
                  borderRadius: "50%", opacity: aroCasco,
                  border: `3px solid ${rgba(V.white, 0.82)}`,
                  boxShadow: `0 0 34px ${rgba(V.white, 0.4)}, inset 0 0 34px ${rgba(V.white, 0.18)}`,
                }} />
              </Plane>
            )}

            {/* ÍCONOS PNG COMO OBJETOS DE LA ESCENA (con su parallax, no pegados al borde) */}
            {g >= 274 && g < 402 && (
              <Plane z={286}>
                <IconPng src="img/cmeurgente/cmeu_ic_billete.png"
                  x={ip(g, [274, 402], [-14, 116])} y={ip(g, [274, 402], [64, 48])}
                  size={ip(g, [274, 402], [400, 470])} z={0}
                  opacity={ip(g, [274, 296, 372, 400], [0, 0.95, 0.95, 0])}
                  rot={ip(g, [274, 402], [-19, 12])} glow={V.ink0} />
              </Plane>
            )}
            {g >= 792 && g < 928 && (
              <Plane z={168}>
                <IconPng src="img/cmeurgente/cmeu_ic_caja.png"
                  x={ip(g, [792, 928], [70, 66.5])} y={ip(g, [792, 928], [70, 64])}
                  size={ip(g, [792, 928], [96, 138])} z={0}
                  opacity={ip(g, [792, 818, 900, 926], [0, 0.95, 0.95, 0])}
                  rot={ip(g, [792, 928], [-9, 4])} glow={V.ink0} />
              </Plane>
            )}
            {g >= 486 && g < 626 && (
              <Plane z={196}>
                <IconPng src="img/cmeurgente/cmeu_ic_panelsolar.png"
                  x={ip(g, [486, 626], [23, 20])} y={ip(g, [486, 626], [24, 30])}
                  size={ip(g, [486, 626], [104, 146])} z={0}
                  opacity={ip(g, [486, 512, 598, 624], [0, 0.92, 0.92, 0])}
                  rot={ip(g, [486, 626], [11, -4])} glow={V.ink0} />
              </Plane>
            )}

            {/* PRIMER PLANO · el canto del garaje: siempre hay algo entre la cámara y la escena */}
            <Plane z={330}>
              <div style={{
                position: "absolute", top: "-12%", bottom: "-12%",
                left: `${ip(g, [0, 720, 1483], [-13, -7, -16]).toFixed(1)}%`, width: "16%",
                background: `linear-gradient(90deg, ${rgba(V.ink0, 0.94)} 0%, ${rgba(V.ink0, 0.62)} 62%, rgba(0,0,0,0) 100%)`,
                opacity: ip(g, [0, 200, 1100, 1440], [0.85, 0.68, 0.62, 0.4]),
              }} />
            </Plane>
          </AbsoluteFill>
        )}

        {/* ══════════ EL MUNDO DEL ACTO 5 — nace del casco y se abre en el papel ═══════════ */}
        {g >= 1470 && (
          <AbsoluteFill style={{
            transformStyle: "preserve-3d",
            transform: `scale(${escala5.toFixed(4)})`,
            transformOrigin: `${FX}% ${FY}%`,
          }}>
            {/* EL PAPEL DEL FINANCIAMIENTO, a sangre */}
            <Plane z={0}>
              <Ventana x={papelLay.x} y={papelLay.y} w={papelLay.w} h={papelLay.h} z={papelLay.z}
                ry={papelLay.ry} rx={papelLay.rx} radius={10} lit={1} litColor={V.amber}>
                <Mat photo="img/cmeurgente/cmeu_permisos.jpg" w={papelLay.w} h={papelLay.h}
                  k={Math.max(1.05, ip(g, [1470, 1584, END], [1420, 1360, 1300]) / Math.max(60, papelLay.w))}
                  cx={ip(g, [1470, END], [54, 48])} cy={ip(g, [1470, END], [46, 52])}
                  lit={1} litColor={V.amber} sheenAt={L(1596)} />
                {/* el renglón chico: DESCUENTO tachado y el interés que aparece abajo */}
                {tachaOn > 0.02 && (
                  <div style={{
                    position: "absolute", left: "8%", right: "8%", bottom: "16%", opacity: tachaOn,
                  }}>
                    <div style={{
                      position: "relative", display: "inline-block", padding: "2px 8px",
                      background: "linear-gradient(180deg, rgba(8,9,6,0.86), rgba(8,9,6,0.7))", borderRadius: 6,
                    }}>
                      <span style={{
                        fontFamily: F_BODY, fontWeight: 700, fontSize: 30, letterSpacing: 1.4,
                        color: rgba(V.white, 0.62), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
                      }}>DESCUENTO POR FINANCIACIÓN</span>
                      <div style={{
                        position: "absolute", left: 6, right: 6, top: "54%", height: 5,
                        background: rgba(V.danger, 0.94), transformOrigin: "0% 50%",
                        transform: `scaleX(${tacha.toFixed(3)})`,
                        boxShadow: `0 0 16px ${rgba(V.danger, 0.55)}`,
                      }} />
                    </div>
                  </div>
                )}
              </Ventana>
            </Plane>

            {/* EL MACRO DE LA LETRA CHICA: el mismo papel, otro plano (cuarta escala del objeto) */}
            {g >= 1596 && (
              <Plane z={0}>
                <Ventana x={ip(g, [1596, 1668, END], [86, 78.5, 77.5])} y={ip(g, [1596, 1668, END], [80, 71, 70])}
                  w={ip(g, [1596, 1668, END], [300, 452, 462])} h={ip(g, [1596, 1668, END], [178, 268, 274])}
                  z={ip(g, [1596, END], [110, 148])} ry={-15} rx={ip(g, [1596, END], [10, 6])}
                  radius={9} lit={1} litColor={V.danger}>
                  <Mat photo="img/cmeurgente/cmeu_permisos.jpg" w={462} h={274} k={3.4}
                    cx={ip(g, [1596, END], [60, 66])} cy={ip(g, [1596, END], [70, 64])}
                    lit={1} litColor={V.danger} sheenAt={L(1690)} />
                  <PieLamina nombre="INTERÉS" monto={miles(2000)}
                    on={ip(g, [1656, 1690], [0, 1])} tint={V.danger} alto={274} />
                </Ventana>
              </Plane>
            )}

            {/* EL SELLO: el mismo círculo que era el casco, ahora estampado en el papel */}
            {aroSelloOn > 0.02 && (
              <Plane z={170}>
                <div style={{
                  position: "absolute", left: `${aroSelloX}%`, top: `${aroSelloY}%`,
                  width: aroSelloS, height: aroSelloS, marginLeft: -aroSelloS / 2, marginTop: -aroSelloS / 2,
                  borderRadius: "50%", opacity: aroSelloOn,
                  border: `3px solid ${rgba(V.danger, 0.7)}`,
                  boxShadow: `0 0 30px ${rgba(V.danger, 0.34)}`,
                }} />
                <IconPng src="img/cmeurgente/cmeu_ic_sello.png"
                  x={aroSelloX} y={aroSelloY - 0.6} size={aroSelloS * 0.72} z={6}
                  opacity={aroSelloOn * 0.94} rot={ip(g, [1478, 1660], [-16, -6])} glow={V.ink0} />
              </Plane>
            )}

            {/* EL BILLETE DE LOS DOS MIL: cruza en primer plano y queda en cuadro — es lo que
                este movimiento le entrega al siguiente. */}
            {g >= 1666 && (
              <Plane z={304}>
                <IconPng src="img/cmeurgente/cmeu_ic_billete.png"
                  x={ip(g, [1666, 1750, END], [124, 66, 62])} y={ip(g, [1666, 1750, END], [86, 62, 58])}
                  size={ip(g, [1666, 1750, END], [320, 384, 396])} z={0}
                  opacity={ip(g, [1666, 1698], [0, 0.96])}
                  rot={ip(g, [1666, END], [21, -5])} glow={V.ink0} />
              </Plane>
            )}
          </AbsoluteFill>
        )}

        {/* ══════════ LA REGLA — fuera de los dos mundos: es el ancla que no se mueve ═══════ */}
        <Plane z={-16}>
          <Regla on={reglaOn} encendido={enc} oculto={ocultoOn} g={g} totalTxt={totalTxt} />
          {haces.map((h, i) => (
            <Haz key={i} xPct={h.x} yDesde={h.y} p={h.p} tint={h.tint} />
          ))}
        </Plane>
      </Layers>

      {/* ══════════ COSTURA · FRONTERA 3 (g1140) — OCLUSIÓN: el riel de aluminio ═══════════ */}
      <SeamOcclude at={L(1122)} dur={36} color={V.steel} angle={-11} lit={0.34} />
      {g >= 1120 && g < 1160 && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          {[0, 1, 2].map((i) => {
            const p = clamp01((g - 1122 - i * 3) / 36);
            if (p <= 0 || p >= 1) return null;
            const env = Math.sin(p * Math.PI);
            return (
              <div key={i} style={{
                position: "absolute", top: `${-40 + i * 4}%`, height: "180%", width: 3 + i * 2,
                left: `${lerp(-40, 150, p).toFixed(1)}%`,
                transform: "rotate(-11deg)",
                background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.white, 0.5 * env)} 40%, ${rgba(V.steel, 0.7 * env)} 70%, rgba(0,0,0,0))`,
                boxShadow: `0 0 22px ${rgba(V.steel, 0.4 * env)}`,
              }} />
            );
          })}
        </AbsoluteFill>
      )}

      {/* ══════════ HUD — cifras y texto en espacio de pantalla (safe area 60 px) ══════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* LOS VEINTITRÉS MIL: nacen grabados en el bloque y se van a vivir al total de la regla */}
        {totOn > 0.01 && (
          <div style={{ opacity: totOn }}>
            <div style={{
              position: "absolute", left: `${totX}%`, top: `${totY}%`,
              width: totS * 4.4, height: totS * 2.6, marginLeft: -totS * 2.2, marginTop: -totS * 1.3,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.78), rgba(8,9,6,0))",
            }} />
            <Readout value={miles(TOTAL)} label={g < 300 ? "EL PRESUPUESTO" : undefined}
              at={L(26)} x={totX} y={totY} size={totS} color={V.amber} align="center" />
          </div>
        )}

        {/* CIFRA · PLACAS (acto 2) */}
        {g >= 570 && g < 700 && (
          <div style={{ opacity: ip(g, [570, 588, 672, 698], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "45.5%", top: "24%", width: 480, height: 250,
              marginLeft: -240, marginTop: -125,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.80), rgba(8,9,6,0))",
            }} />
            <Readout value={miles(nPlacas)} label="LAS PLACAS" at={L(574)}
              x={45.5} y={24} size={112} color={V.panel === "#33507E" ? V.white : V.white} align="center" />
          </div>
        )}

        {/* CIFRA · INVERSOR (acto 3) */}
        {g >= 806 && g < 926 && (
          <div style={{ opacity: ip(g, [806, 826, 898, 924], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "22.5%", top: "23%", width: 420, height: 220,
              marginLeft: -210, marginTop: -110,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.80), rgba(8,9,6,0))",
            }} />
            <Readout value={miles(nInv)} label="EL INVERSOR" at={L(810)}
              x={22.5} y={23} size={92} color={V.amber} align="center" />
          </div>
        )}

        {/* CIFRA · RIELES (acto 3) */}
        {g >= 928 && g < 1056 && (
          <div style={{ opacity: ip(g, [928, 948, 1028, 1054], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "79.5%", top: "63%", width: 400, height: 210,
              marginLeft: -200, marginTop: -105,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.80), rgba(8,9,6,0))",
            }} />
            <Readout value={miles(nRiel)} label="LOS RIELES" at={L(932)}
              x={79.5} y={63} size={84} color={V.amber} align="center" />
          </div>
        )}

        {/* CIFRA · MANO DE OBRA (acto 4) */}
        {g >= 1210 && g < 1400 && (
          <div style={{ opacity: ip(g, [1210, 1232, 1370, 1398], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "76%", top: "30%", width: 520, height: 270,
              marginLeft: -260, marginTop: -135,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value={miles(nObra)} label="LA MANO DE OBRA" at={L(1214)}
              x={76} y={30} size={118} color={V.amber} align="center" />
          </div>
        )}

        {/* CIFRA · EL INTERÉS (acto 5) */}
        {g >= 1590 && (
          <div style={{ opacity: ip(g, [1590, 1614], [0, 1]) }}>
            <div style={{
              position: "absolute", left: "26%", top: "27%", width: 500, height: 260,
              marginLeft: -250, marginTop: -130,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value={miles(nInt)} label="EL RENGLÓN DE ABAJO" at={L(1594)}
              x={26} y={27} size={112} color={V.danger} align="center" />
          </div>
        )}

        {/* ACTO 1 · VEINTITRÉS MIL */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "70%", opacity: t1, transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.amber}>Lo que hay sobre la mesa</Kick>
              <div style={{ height: 8 }} />
              <Head size={72}>VEINTITRÉS MIL</Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Un solo bloque. <Em color={V.amber}>Un solo número.</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · LOS PANELES: CINCO MIL OCHOCIENTOS */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "13%", opacity: t2, transform: `translateY(${((1 - t2) * -22).toFixed(1)}px)` }}>
            <Bed w={720} pad={24}>
              <Kick color={V.amber}>Lo que crees que compras</Kick>
              <div style={{ height: 8 }} />
              <Head size={64}>LOS PANELES: <Em color={V.white}>CINCO MIL OCHOCIENTOS</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Uno de cada cuatro dólares. <Em color={V.amber}>Nada más.</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · EL INVERSOR Y LOS RIELES */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "64%", opacity: t3, transform: `translateY(${((1 - t3) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.amber}>Lo que no se ve desde la calle</Kick>
              <div style={{ height: 8 }} />
              <Head size={66}>EL INVERSOR Y LOS RIELES</Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Cinco mil ochocientos <Em color={V.amber}>en fierros y una caja</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · SIETE MIL SEISCIENTOS DE MANO DE OBRA */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "12%", opacity: t4, transform: `translateY(${((1 - t4) * -22).toFixed(1)}px)` }}>
            <Bed w={720} pad={24}>
              <Kick color={V.amber}>El renglón más ancho de todos</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>SIETE MIL SEISCIENTOS <Em color={V.amber}>DE MANO DE OBRA</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Más que las placas. Mucho más.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · DOS MIL DISFRAZADOS */}
        {t5 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "62%", opacity: t5, transform: `translateY(${((1 - t5) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.danger}>El que nadie te lee</Kick>
              <div style={{ height: 8 }} />
              <Head size={70}>DOS MIL <Em color={V.danger}>DISFRAZADOS</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Lo llaman descuento. <Em color={V.danger}>Es interés.</Em></Body>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta: la cocina se cierra sobre el papel */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(128% 108% at ${(50 - camRY * 0.8).toFixed(1)}% 46%, rgba(0,0,0,0) 52%, rgba(6,7,5,${(0.30 + 0.16 * ip(g, [1400, END], [0, 1])).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
