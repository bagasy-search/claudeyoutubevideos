// MovCableSuicida.tsx — S9 · UN MOVIMIENTO CONTINUO de 65 s (1950 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 1043,0.
//
// LA ESPINA: la cosa que mata gente. Un cable con una ficha macho en cada punta manda la energia
// del generador HACIA ATRAS: sale por el tomacorriente, se va por el cable de la casa, llega al
// transformador del poste, y arriba hay un tipo con arnes que corto la linea y confia en que no
// hay tension. Todo el movimiento es UN SOLO RECORRIDO FISICO por esa linea, y la camara lo hace
// entero sin cortar. El acto 5 apaga el naranja: la respuesta tranquila es una caja atornillada
// al lado del tablero.
//
// ⛔ Este es el UNICO tramo del video donde el naranja `V.danger` esta permitido. Se enciende en
//    el acto 2 (el estampado), manda en 3 y 4, y se APAGA en el 5 devolviendo el volt sobrio.
// ⛔ Debajo de este movimiento el avatar va EN BUCLE Y MUTEADO: no hay fondo garantizado. Por eso
//    la raiz pinta `V.ink0` y NUNCA hay un instante sin cobertura a pantalla completa.
//
/* HANDOFF
 | acto | ENTRA: encuadre + luz + objeto                       | SALE: encuadre + luz + objeto                        | costura hacia el siguiente |
 |  1   | ALTA SOBRE EL TEJADO (z -60, rx +6) heredada de       | camara ya BAJADA sobre el banco y empujando hacia     | ZOOM-THROUGH: la camara entra en
 | g0   | MovCientoVeintiseis · AMANECER LIMPIO (volt frontal   | la pata derecha de la ficha (zex +58) · AMANECER      | la pata de la ficha (g352, foco
 |      | suave, cielo sky) · MATERIA: el cobre pelado del      | virando a frio · MATERIA: la PATA DE LATON de la      | 61/45) y sale en el macro del
 |      | cable, la teja del tejado hundiendose de cuadro       | ficha macho derecha, sola en el centro del cuadro     | cobre del acto 2
 |  2   | saliendo del tunel: MACRO del cable llenando el       | el cable ya es una linea que se va por la pared y     | MATCH-MOVE: la camara sigue el
 | g390 | cuadro (z ~ -85) · el DANGER se enciende con el       | sale a la calle · danger pleno · MATERIA: LA LINEA    | cable hasta el tomacorriente y
 |      | estampado · MATERIA: el cobre del cable               | VIVA naciendo en el tomacorriente, con la carga       | el mundo se desliza a la calle
 |      |                                                      | ya viajando hacia atras                               | (tx -1998 → -1000)
 |  3   | el mundo entrando por la izquierda con el mismo       | camara CRANEANDO por el poste (drop +72, ty +186)     | MATCH-SHAPE: la lata gris del
 | g810 | vector · danger desde arriba · MATERIA: la linea de   | · danger pleno · MATERIA: LA LATA GRIS del            | transformador se vuelve el casco
 |      | la calle colgando hacia el poste                      | transformador, recortada y ya viajando a la izq.      | del tecnico (g1230, el marco no
 |      |                                                      |                                                       | se corta: se abre 204 → 1080)
 |  4   | la lata convertida en CASCO, abriendose a la ficha    | plano del tecnico con la linea viva pasandole por     | OCLUSION V.copper: un cable
 | g1230| entera del tecnico · danger pleno · MATERIA: el casco  | las manos · danger en su ultimo pico · MATERIA: un    | grueso de cobre cruza el cuadro
 |      | naranja del operario                                  | CABLE GRUESO DE COBRE entrando por la derecha         | (g1552) y detras ya esta la caja
 |  5   | detras del cobre: la caja de transferencia junto al   | MEDIA Y BAJA JUNTO AL TABLERO (z -200, panY -8) ·     | salida: entrega a MovArrendamiento
 | g1590| tablero · el naranja se apaga y vuelve el volt        | VOLT SOBRIO, el naranja apagado · MATERIA: LA CHAPA   | (el papel del contrato)
 |      | · MATERIA: el caño de cobre entrando a la caja        | GRIS de la caja de transferencia, en foco             |
*/
//
// COSTURAS — una distinta por frontera, ninguna es un fundido:
//   g352  1→2  ZOOM-THROUGH   — `zoomThrough(g,352,38,61,45)` sobre el grupo del acto 1: la camara
//                               entra en la pata de laton. El acto 2 YA cubre el cuadro entero
//                               (2900x1700) cuando el acto 1 se apaga: no hay un frame de negro.
//   g810  2→3  MATCH-MOVE     — no se corta nada: `tx` (el mundo entero: fondos, fichas y linea,
//                               cada plano con su parallax por perspectiva) viaja de -1998 a -1000
//                               con la camara siguiendo la MISMA linea. La ficha del cable sale
//                               por la derecha y el poste entra por la izquierda con el mismo
//                               vector de velocidad. ES la linea continua de la direccion.
//   g1230 3→4  MATCH-SHAPE    — el marco de la LATA del transformador (204x196, radio 56) no se
//                               desmonta: sigue moviendose y se ABRE a 1080x700 (radio 12). El
//                               material corta adentro justo cuando la forma va mas rapido, con
//                               el barrido especular encima. La lata se vuelve el casco.
//   g1552 4→5  OCLUSION       — `SeamOcclude` en `V.copper` + mi propio cable grueso de cobre
//                               cruzando en el mismo vector. El contenido cambia con el cuadro
//                               tapado al 100% (g1562) y el cobre se va convirtiendo en el caño
//                               que entra a la caja de transferencia.
//
// ⛔ CONTRATO: sin Math.random ni Date.now (todo sale de `rnd(k)` y de `g`) · sin position fixed ·
// ⛔ una sola capa con blur · rutas SOLO literales de la ficha · ninguna <Sequence> por acto.

import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, RoofPlane, PadPlane, Layers, Plane, MediaCard, IconPng,
  SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1950;
const A2 = 390;
const A3 = 810;
const A4 = 1230;
const A5 = 1590;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// % de pantalla a partir de una coordenada en px del mundo (el mundo mide 1920x1080)
const pcx = (px: number) => (px / 1920) * 100;
const pcy = (py: number) => (py / 1080) * 100;

// ── EL RECORRIDO — la linea unica que la camara sigue del acto 2 al acto 4 ──────────────────
// Coordenadas del MUNDO (no de la pantalla): el contenedor entero se traslada por debajo de una
// camara que no se reinicia. De la casa (x alto, derecha) a la calle (x bajo, izquierda).
const LINEA: [number, number][] = [
  [3180, 742],   // 0 · el tomacorriente de la casa
  [3020, 468],   // 1 · sube por dentro de la pared
  [2760, 396],   // 2 · sale por el alero
  [2320, 494],   // 3 · la acometida cuelga
  [1900, 546],   // 4 · el punto mas bajo del vano
  [1560, 430],   // 5 · sube al poste
  [1330, 316],   // 6 · entra al transformador
  [1180, 236],   // 7 · sale a la cruceta
  [980, 196],    // 8 · el tramo donde trabaja el tecnico
  [520, 232],    // 9 · sigue calle abajo
];
const SEG = LINEA.slice(0, LINEA.length - 1).map((p, i) => {
  const q = LINEA[i + 1];
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const len = Math.sqrt(dx * dx + dy * dy);
  return { x: p[0], y: p[1], len, ang: (Math.atan2(dy, dx) * 180) / Math.PI };
});
const LARGO = SEG.reduce((a, s) => a + s.len, 0);
const puntoEn = (t: number): [number, number] => {
  let d = clamp01(t) * LARGO;
  for (let i = 0; i < SEG.length; i++) {
    const s = SEG[i];
    if (d <= s.len || i === SEG.length - 1) {
      const r = (s.ang * Math.PI) / 180;
      const dd = Math.min(d, s.len);
      return [s.x + Math.cos(r) * dd, s.y + Math.sin(r) * dd];
    }
    d -= s.len;
  }
  return [SEG[0].x, SEG[0].y];
};

// ── FONDO — una foto a sangre anclada en el MUNDO (se desliza con todo lo demas) ────────────
// Los bordes caen a `ink0` para que dos fondos vecinos se pasen la posta sin costura visible.
const Fondo: React.FC<{
  src: string; x: number; y: number; w: number; h: number; dim: number; tinte: string;
}> = ({ src, x, y, w, h, dim, tinte }) => (
  <div style={{
    position: "absolute", left: x, top: y, width: w, height: h,
    marginLeft: -w / 2, marginTop: -h / 2, overflow: "hidden",
  }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: rgba(V.ink0, dim) }} />
    <AbsoluteFill style={{ background: rgba(tinte, 0.06), mixBlendMode: "soft-light" }} />
    <AbsoluteFill style={{
      background: `linear-gradient(90deg, ${V.ink0} 0%, rgba(10,11,8,0) 15%, rgba(10,11,8,0) 85%, ${V.ink0} 100%)`,
    }} />
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${V.ink0} 0%, rgba(10,11,8,0) 17%, rgba(10,11,8,0) 82%, ${V.ink0} 100%)`,
    }} />
  </div>
);

// ── MARCO — la ficha de vidrio, posicionada en PX del mundo (hermana de MediaCard) ──────────
const Marco: React.FC<{
  x: number; y: number; w: number; h: number;
  ry?: number; rx?: number; radius?: number; lit?: number; litColor?: string; opacity?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, ry = 0, rx = 0, radius = 12, lit = 1, litColor = V.volt, opacity = 1, children }) => {
  const ww = Math.max(10, w);
  const hh = Math.max(10, h);
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: ww, height: hh,
      marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`,
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      border: `1px solid ${rgba(litColor, 0.3 * lit)}`,
      boxShadow: `0 ${Math.round(hh * 0.15)}px ${Math.round(hh * 0.24)}px ${rgba(V.ink0, 0.78)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.6)}, inset 0 1px 0 ${rgba(V.white, 0.26 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL dentro del marco: la FOTO siempre, el CLIP encima mientras dura de verdad ──────
// `qx`/`qy` son el punto de la FOTO (0..1) que queda en el centro de la ventana: asi un macro
// cerrado apunta de verdad al objeto y no al centro geometrico de la imagen.
const foco = (k: number, q: number) => 50 + 100 * k * (0.5 - q);
const Mat: React.FC<{
  photo: string; clip?: string; vid?: number;
  w: number; h: number; k: number; qx?: number; qy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, qx = 0.5, qy = 0.5, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.04, k);
  const iw = Math.max(12, w * kk);
  const ih = Math.max(12, h * kk);
  const cx = foco(kk, qx);
  const cy = foco(kk, qy);
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

// ── CUERDA — la primitiva de cable de este movimiento: se usa en cuatro escalas distintas ───
// (el bucle en primer plano del taller, el viento de la calle, el cobre que cruza la costura 4,
//  y el caño sobrio que entra a la caja del acto 5). Un solo objeto, cuatro tamaños.
const Cuerda: React.FC<{
  x: number; y: number; largo: number; ang: number; grosor: number;
  tinte?: string; brillo?: number; op?: number; desenfoque?: number;
}> = ({ x, y, largo, ang, grosor, tinte = V.copper, brillo = 1, op = 1, desenfoque = 0 }) => (
  <div style={{
    position: "absolute", left: x, top: y, width: Math.max(4, largo), height: grosor,
    marginTop: -grosor / 2, transformOrigin: "0% 50%",
    transform: `rotate(${ang.toFixed(2)}deg)`,
    borderRadius: Math.min(grosor / 2, 150), opacity: clamp01(op),
    background:
      `linear-gradient(180deg, ${rgba(V.white, 0.30 * brillo)} 0%, ${rgba(tinte, 0.86 * brillo)} 16%, ` +
      `${rgba(V.ink1, 0.94)} 56%, ${rgba(V.ink0, 0.98)} 100%)`,
    boxShadow: `0 ${Math.round(Math.min(grosor * 0.3, 54))}px ${Math.round(Math.min(grosor * 0.5, 90))}px ${rgba(V.ink0, 0.7)}`,
    filter: desenfoque > 0 ? `blur(${desenfoque}px)` : undefined,
  }}>
    {/* el trenzado del cable: se lee como material, no como una barra */}
    <AbsoluteFill style={{
      opacity: 0.3 * brillo, mixBlendMode: "overlay", borderRadius: Math.min(grosor / 2, 150),
      backgroundImage: `repeating-linear-gradient(74deg, rgba(255,255,255,.5) 0 ${Math.max(2, Math.round(grosor * 0.1))}px, rgba(0,0,0,0) ${Math.max(2, Math.round(grosor * 0.1))}px ${Math.max(5, Math.round(grosor * 0.3))}px)`,
    }} />
  </div>
);

// ── LA LINEA VIVA — el recorrido dibujandose y la carga viajando HACIA ATRAS ────────────────
const LineaViva: React.FC<{ g: number; trazo: number; carga: number; tinte: string }> = ({
  g, trazo, carga, tinte,
}) => {
  if (trazo <= 0.002) return null;
  const total = LARGO * clamp01(trazo);
  let acum = 0;
  const tramos = SEG.map((s, i) => {
    const desde = acum;
    acum += s.len;
    const vis = clamp01((total - desde) / s.len);
    if (vis <= 0) return null;
    return (
      <div key={`s${i}`} style={{
        position: "absolute", left: s.x, top: s.y, width: s.len, height: 11, marginTop: -5.5,
        transformOrigin: "0% 50%",
        transform: `rotate(${s.ang.toFixed(3)}deg) scaleX(${vis.toFixed(4)})`,
        borderRadius: 6,
        background: `linear-gradient(180deg, ${rgba(V.white, 0.22)} 0%, ${rgba(V.copper, 0.8)} 20%, ${rgba(V.ink1, 0.95)} 62%, ${rgba(V.ink0, 0.98)} 100%)`,
        boxShadow: `0 0 ${Math.round(9 + 30 * carga)}px ${rgba(tinte, 0.2 + 0.42 * carga)}`,
      }} />
    );
  });
  const pulsos = Array.from({ length: 11 }, (_, i) => {
    const raw = (g - 520) / 168 + i / 11;
    if (raw < 0) return null;
    const t = raw - Math.floor(raw);
    if (t > clamp01(trazo)) return null;
    const p = puntoEn(t);
    const q = puntoEn(Math.max(0, t - 0.008));
    const ang = (Math.atan2(p[1] - q[1], p[0] - q[0]) * 180) / Math.PI;
    const sz = 13 + 11 * Math.sin(t * Math.PI);
    const a = carga * (0.55 + 0.45 * Math.sin((t + rnd(i * 3.7)) * Math.PI));
    return (
      <div key={`p${i}`} style={{
        position: "absolute", left: p[0], top: p[1], width: sz * 7, height: sz,
        marginLeft: -sz * 6.2, marginTop: -sz / 2, transformOrigin: "88% 50%",
        transform: `rotate(${ang.toFixed(2)}deg)`, borderRadius: sz,
        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(tinte, 0.5 * a)} 62%, ${rgba(V.white, 0.9 * a)} 100%)`,
        boxShadow: `0 0 ${Math.round(24 + sz * 2.4)}px ${rgba(tinte, 0.6 * a)}`,
      }} />
    );
  });
  return <>{tramos}{pulsos}</>;
};

// ── RETICULA — el señalador del acto 1 (esto SI es un grafico, no un objeto disfrazado) ─────
const Reticula: React.FC<{ x: number; y: number; r: number; on: number; texto: string; tinte: string }> = ({
  x, y, r, on, texto, tinte,
}) => {
  if (on <= 0.01) return null;
  const rr = Math.max(8, r);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: clamp01(on) }}>
      <div style={{
        position: "absolute", left: 0, top: 0, width: rr * 2, height: rr * 2,
        marginLeft: -rr, marginTop: -rr, borderRadius: "50%",
        border: `3px solid ${rgba(tinte, 0.85)}`,
        boxShadow: `0 0 26px ${rgba(tinte, 0.42)}, inset 0 0 26px ${rgba(V.ink0, 0.5)}`,
      }} />
      <div style={{
        position: "absolute", left: 0, top: -rr - 26, width: 2, height: 20, marginLeft: -1,
        background: rgba(tinte, 0.7),
      }} />
      <div style={{ position: "absolute", left: 0, top: -rr - 96, transform: "translateX(-50%)" }}>
        <Bed pad={10}><Kick color={tinte}>{texto}</Kick></Bed>
      </div>
    </div>
  );
};

// ── LA PALANCA — el interruptor de transferencia: o la red, o el generador. Nunca los dos ───
const Palanca: React.FC<{ x: number; y: number; on: number; tira: number }> = ({ x, y, on, tira }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: clamp01(on) }}>
      <Bed pad={20} w={332}>
        <Kick color={V.volt}>Una sola posicion</Kick>
        <div style={{ height: 12 }} />
        <div style={{
          position: "relative", height: 92, borderRadius: 10,
          background: `linear-gradient(180deg, ${rgba(V.steel, 0.26)} 0%, ${rgba(V.ink1, 0.9)} 100%)`,
          boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.22)}, inset 0 -12px 24px ${rgba(V.ink0, 0.7)}`,
        }}>
          {/* las dos bornes: RED arriba, GENERADOR abajo */}
          {[0, 1].map((i) => (
            <div key={i} style={{
              position: "absolute", left: 16, top: 14 + i * 42, width: 16, height: 16, borderRadius: 8,
              background: rgba(i === 0 ? V.volt : V.steel, i === 0 ? 0.55 + 0.4 * tira : 0.3),
              boxShadow: i === 0 ? `0 0 ${Math.round(8 + 16 * tira)}px ${rgba(V.volt, 0.55 * tira)}` : "none",
            }} />
          ))}
          {/* la manija: cae a RED y se queda ahi */}
          <div style={{
            position: "absolute", left: 24, top: 22 + (1 - tira) * 42, width: 156, height: 12,
            borderRadius: 6, transformOrigin: "0% 50%",
            transform: `rotate(${lerp(19, 0, tira).toFixed(2)}deg)`,
            background: `linear-gradient(180deg, ${rgba(V.white, 0.4)} 0%, ${rgba(V.steel, 0.85)} 34%, ${rgba(V.ink1, 0.95)} 100%)`,
            boxShadow: `0 6px 14px ${rgba(V.ink0, 0.8)}`,
          }} />
          <div style={{
            position: "absolute", right: 16, top: 12,
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 2.4,
            color: rgba(V.volt, 0.5 + 0.5 * tira),
          }}>RED</div>
          <div style={{
            position: "absolute", right: 16, top: 56,
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 2.4,
            color: rgba(V.white, 0.34),
          }}>GENERADOR</div>
        </div>
      </Bed>
    </div>
  );
};

export const MovCableSuicida: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  const f = useCurrentFrame();
  // reloj CONTINUO del movimiento (una sola Sequence: `g` avanza de 0 a 1950 sin reiniciarse)
  const bruto = gFrame === undefined ? f : gFrame;
  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(bruto) ? bruto : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));
  // los componentes del Stage que reciben `at`/`sheenAt` razonan en frames LOCALES
  const off = (gFrame === undefined ? f : gFrame) - f;
  const L = (gAt: number) => gAt - off;

  // ══ LA CAMARA — UN SOLO VIAJE: alta sobre el tejado (z -60, rx +6) → baja junto al tablero ══
  const camB = gcam(g, { z0: -60, z1: -200, panX: -26, panY: -8, ry: 3.6, rx: 0, dur: END });
  // desviaciones LOCALES que se SUMAN al viaje (empujes dentro de un acto, nunca reemplazos)
  const camZ = ip(g,
    [0, 120, 260, 352, 392, 440, 560, 700, 810, 900, 1080, 1230, 1330, 1450, 1552, 1610, 1760, 1950],
    [-44, -10, 30, 62, 26, -16, 8, 34, 52, 26, -8, 16, 44, 26, 2, -26, -10, 10]);
  const camDrop = ip(g, [0, 200, 390, 810, 1020, 1230, 1420, 1590, 1760, 1950],
    [0, -4, -8, 8, 44, 70, 88, 44, -16, -46]);
  // el rx entra en +6 (heredado, mirando el tejado desde arriba) y se endereza al bajar
  const camRX = ip(g, [0, 300, 810, 1230, 1590, 1950], [6, 3.4, -0.8, -2.6, -3.6, -4.4]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateX(${camRX.toFixed(2)}deg)`;
  // la deriva de la camara replicada (al 42%) para que el HUD no quede pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.42).toFixed(2)}px, ${(by * 0.42).toFixed(2)}px)`;

  // ══ LA LUZ — amanecer limpio → el naranja de peligro → volt sobrio de la solucion ══════════
  const keyFrom = ip(g, [0, 300, 430, 900, 1230, 1560, 1660, 1950],
    [0.50, 0.44, 0.30, 0.26, 0.24, 0.34, 0.56, 0.62]);
  const inten = ip(g, [0, 180, 430, 700, 1100, 1400, 1590, 1700, 1950],
    [0.86, 0.94, 1.06, 1.02, 1.10, 1.14, 1.00, 0.90, 0.92]);
  const floor = ip(g, [0, 390, 830, 1230, 1590, 1950], [0.50, 0.54, 0.46, 0.44, 0.52, 0.58]);
  // ⛔ el naranja SOLO vive aca: nace con el estampado (g430) y se apaga en el acto 5
  const rojo = ip(g, [0, 372, 452, 1500, 1596, 1720, 1950], [0, 0, 1, 1, 0.86, 0.10, 0.04]);
  const tintA = light(rojo, "volt", "danger");
  const tintB = light(ip(g, [0, 300, 830, 1230, 1600, 1950], [0, 0.2, 0.62, 0.72, 0.3, 0.14]), "sky", "amber");
  // el color con el que se dibuja la energia (naranja mientras mata, volt cuando ya no)
  const vivo = light(rojo, "volt", "danger");

  // ══ EL MUNDO QUE SE DESLIZA — el MATCH-MOVE del acto 2 al 4, un solo vector ════════════════
  const tx = ip(g,
    [0, 200, 390, 560, 700, 750, 830, 920, 1020, 1120, 1230, 1330, 1450, 1560],
    [-1900, -1918, -1940, -1966, -1998, -1980, -1660, -1290, -1000, -740, -540, -400, -220, -100]);
  const ty = ip(g, [0, 390, 830, 1020, 1230, 1450, 1560], [40, 46, 58, 118, 186, 242, 268]);
  const mundo = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
  const mundoVivo = g < 1574;

  // ══ ACTO 1 · EL BANCO DEL TALLER — la ficha con dos machos ════════════════════════════════
  const zt = zoomThrough(g, 352, 38, 61, 45);
  const acto1Vivo = g < 396;
  const c1w = ip(g, [24, 90, 200, 352], [1180, 1330, 1420, 1520]);
  const c1h = ip(g, [24, 90, 200, 352], [640, 716, 764, 818]);
  const c1x = ip(g, [24, 200, 352], [944, 962, 986]);
  const c1y = ip(g, [24, 200, 352], [512, 498, 490]);
  const c1lit = ip(g, [16, 70, 300, 352], [0.4, 0.95, 1, 1]);
  const c1vid = ip(g, [18, 128, 148], [1, 1, 0]);
  const c1k = Math.max(1.06, ip(g, [24, 200, 352], [1500, 1620, 1900]) / Math.max(40, c1w));
  const retA = ip(g, [148, 176, 322, 344], [0, 1, 1, 0]);
  const retB = ip(g, [188, 216, 322, 344], [0, 1, 1, 0]);
  const tejado = ip(g, [0, 130, 268], [0.85, 0.44, 0]);

  // ══ ACTO 2 · EL MACRO DEL CABLE — el nombre estampado en naranja ══════════════════════════
  const acto2Vivo = g >= 366 && g < 1170;
  const k2 = [366, 396, 440, 500, 620, 810, 940, 1060, 1170];
  const c2w = ip(g, k2, [2900, 2060, 1420, 1180, 1152, 1120, 1096, 1072, 1060]);
  const c2h = ip(g, k2, [1700, 1210, 834, 692, 674, 656, 642, 628, 620]);
  const c2vid = ip(g, [396, 416, 508, 528], [0, 1, 1, 0]);
  const c2vid2 = g < 640 ? 0 : ip(g, [640, 662, 748, 768], [0, 1, 1, 0]);
  const c2k = Math.max(1.05, ip(g, k2, [3400, 2500, 1760, 1420, 1360, 1300, 1276, 1250, 1240]) / Math.max(40, c2w));
  const c2lit = ip(g, [366, 440, 810, 1060, 1170], [0.5, 1, 1, 0.72, 0.5]);
  // el estampado: cae de golpe sobre el cable (no aparece: golpea)
  const selloP = ipe(g, [446, 470], [0, 1], Easing.out(Easing.cubic));
  const sello = ip(g, [446, 470, 782, 806], [0, 1, 1, 0]);
  // la segunda punta, en otra escala: el mismo material visto de cerca
  const puntaOn = ip(g, [596, 626, 792, 818], [0, 1, 1, 0]);

  // ══ LA LINEA VIVA — nace en el tomacorriente y se dibuja hasta las manos del tecnico ═══════
  const trazo = ip(g, [545, 610, 760, 900, 1060, 1200, 1290], [0, 0.1, 0.24, 0.46, 0.68, 0.88, 1]);
  const carga = ip(g, [545, 640, 900, 1230, 1500, 1600, 1720], [0, 0.5, 0.85, 1, 1, 0.5, 0.2]);
  const enchufeOn = ip(g, [516, 548, 900, 960], [0, 1, 1, 0.34]);

  // ══ ACTO 3 · LA CALLE Y EL TRANSFORMADOR ══════════════════════════════════════════════════
  const acto3Vivo = g >= 796 && g < 1500;
  const c3w = ip(g, [796, 900, 1080, 1230, 1400, 1500], [1000, 960, 930, 910, 890, 880]);
  const c3h = ip(g, [796, 900, 1080, 1230, 1400, 1500], [620, 596, 578, 566, 554, 548]);
  const c3lit = ip(g, [796, 900, 1200, 1330, 1500], [0.4, 1, 1, 0.68, 0.42]);
  const c3k = Math.max(1.05, ip(g, [796, 1080, 1500], [1180, 1120, 1080]) / Math.max(40, c3w));
  const flechaOn = ip(g, [906, 940, 1146, 1176], [0, 1, 1, 0]);

  // ══ FRONTERA 3→4 · MATCH-SHAPE — la lata gris del transformador se vuelve el casco ═════════
  const cascoVivo = g >= 1122 && mundoVivo;
  const kC = [1122, 1200, 1230, 1258, 1330, 1420, 1560];
  const cw = ip(g, kC, [238, 210, 204, 274, 700, 1024, 1080]);
  const ch = ip(g, kC, [238, 202, 196, 240, 472, 662, 700]);
  const cx3 = ip(g, kC, [1332, 1302, 1288, 1240, 1120, 1026, 1000]);
  const cy3 = ip(g, kC, [332, 314, 306, 300, 298, 298, 300]);
  const crad = ip(g, kC, [62, 58, 56, 46, 22, 14, 12]);
  const clit = ip(g, [1122, 1230, 1300, 1560], [0.66, 0.92, 1, 1]);
  // el material corta ADENTRO de la forma, justo cuando la forma va mas rapido
  const esCasco = g >= A4;
  const ck = Math.max(1.05, (esCasco
    ? ip(g, [1230, 1258, 1330, 1420, 1560], [1400, 1430, 1500, 1360, 1244])
    : ip(g, [1122, 1200, 1230], [1560, 1500, 1460])) / Math.max(40, cw));
  const cqy = esCasco ? ip(g, [1230, 1330, 1460, 1560], [0.24, 0.34, 0.46, 0.5]) : 0.36;
  const cqx = esCasco ? ip(g, [1230, 1560], [0.52, 0.5]) : 0.5;
  const cvid = g < 1286 ? 0 : ip(g, [1286, 1306, 1396, 1416], [0, 1, 1, 0]);
  const cvid2 = g < 1452 ? 0 : ip(g, [1452, 1474, 1552, 1572], [0, 1, 1, 0]);
  const rayoOn = ip(g, [1298, 1330, 1520, 1552], [0, 1, 1, 0]);

  // ══ FRONTERA 4→5 · OCLUSION — el cable grueso de cobre cruzando ═══════════════════════════
  const cobreP = clamp01((g - 1524) / 104);
  const cobreVivo = g >= 1524 && g < 1632;

  // ══ ACTO 5 · LA CAJA DE TRANSFERENCIA — el naranja se apaga ═══════════════════════════════
  const acto5Vivo = g >= 1574;
  const k5 = [1574, 1620, 1700, 1820, 1950];
  const c5w = ip(g, k5, [1300, 1180, 1120, 1096, 1080]);
  const c5h = ip(g, k5, [780, 700, 664, 650, 640]);
  const c5x = ip(g, k5, [986, 946, 908, 886, 878]);
  const c5y = ip(g, k5, [524, 528, 536, 542, 546]);
  const c5k = Math.max(1.05, ip(g, k5, [1560, 1380, 1300, 1272, 1258]) / Math.max(40, c5w));
  const c5lit = ip(g, [1574, 1640, 1950], [0.62, 1, 1]);
  const canoOn = ip(g, [1596, 1640], [0, 1]);
  const palancaOn = ip(g, [1742, 1784], [0, 1]);
  const tira = ipe(g, [1806, 1842], [0, 1], Easing.out(Easing.cubic));

  // ══ TEXTOS — UNA idea por acto, todas sobre <Bed> ═════════════════════════════════════════
  const t1 = ip(g, [96, 122, 348, 372], [0, 1, 1, 0]);
  const t2 = ip(g, [500, 528, 758, 782], [0, 1, 1, 0]);
  const t3 = ip(g, [880, 908, 1050, 1078], [0, 1, 1, 0]);
  const t3b = ip(g, [1092, 1120, 1192, 1216], [0, 1, 1, 0]);
  const t4 = ip(g, [1272, 1300, 1430, 1456], [0, 1, 1, 0]);
  const t4b = ip(g, [1470, 1494, 1538, 1562], [0, 1, 1, 0]);
  const t5 = ip(g, [1656, 1686, 1906, 1932], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMOSFERA: se monta UNA vez y solo EVOLUCIONA (nunca se remonta) ───────────── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ EL ESPACIO 3D — todos los planos bajo UNA sola camara ═══════════════════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · LOS FONDOS DEL MUNDO — anclados en px, se deslizan con el match-move --- */}
        {mundoVivo && (
          <Plane z={-620}>
            <div style={{ position: "absolute", inset: 0, transform: mundo, transformStyle: "preserve-3d" }}>
              <Fondo src="img/cmeurgente/cmeu_cable_suicida.jpg" x={2980} y={520} w={3100} h={1820}
                dim={ip(g, [0, 240, 430, 900], [0.6, 0.52, 0.62, 0.74])} tinte={V.volt} />
              <Fondo src="img/cmeurgente/cmeu_transformador.jpg" x={1300} y={400} w={3000} h={1780}
                dim={ip(g, [700, 900, 1230, 1500], [0.72, 0.5, 0.5, 0.66])} tinte={V.danger} />
              <Fondo src="img/cmeurgente/cmeu_tecnico_poste.jpg" x={860} y={300} w={2900} h={1740}
                dim={ip(g, [1100, 1300, 1560], [0.78, 0.52, 0.5])} tinte={V.danger} />
            </div>
          </Plane>
        )}

        {/* PLANO 1b · EL FONDO DEL ACTO 5 — entra con el cuadro tapado por el cobre --------- */}
        {acto5Vivo && (
          <Plane z={-620}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              <Img src={staticFile("img/cmeurgente/cmeu_transferencia.jpg")} style={{
                width: "100%", height: "100%", objectFit: "cover",
                transform: `scale(${ip(g, [1574, 1950], [1.3, 1.19]).toFixed(3)}) translateX(${(Math.sin(g / 121) * 7).toFixed(1)}px)`,
              }} />
              <AbsoluteFill style={{ background: rgba(V.ink0, ip(g, [1574, 1700, 1950], [0.62, 0.56, 0.6])) }} />
              <AbsoluteFill style={{ background: rgba(V.volt, 0.06), mixBlendMode: "soft-light" }} />
            </div>
          </Plane>
        )}

        {/* PLANO 2 · EL TEJADO HEREDADO — se hunde de cuadro por geometria, no por opacidad -- */}
        {g < 300 && (
          <Plane z={-330}>
            <RoofPlane y={ip(g, [0, 150, 300], [74, 98, 146])} w={1520} h={340} rx={58}
              lit={tejado} z={0} panels={0.6} />
          </Plane>
        )}

        {/* PLANO 3 · EL BANCO DEL TALLER — sube a ocupar el lugar del tejado --------------- */}
        {g >= 30 && g < 420 && (
          <Plane z={-190}>
            <PadPlane y={ip(g, [30, 190, 420], [132, 88, 80])} w={1680} h={360} rx={63}
              lit={ip(g, [30, 190, 420], [0, 0.86, 0.94])} z={0} />
          </Plane>
        )}

        {/* PLANO 4 · EL MUNDO — fichas y linea, todo con el MISMO vector de deslizamiento --- */}
        {mundoVivo && (
          <Plane z={0}>
            <div style={{ position: "absolute", inset: 0, transform: mundo, transformStyle: "preserve-3d" }}>

              {/* ACTO 2 · EL MACRO DEL CABLE — nace llenando el cuadro al salir del tunel */}
              {acto2Vivo && (
                <Marco x={2900} y={520} w={c2w} h={c2h} ry={ip(g, [396, 620, 1060], [0, -2.4, -7])}
                  radius={g < 470 ? 6 : 12} lit={c2lit} litColor={g < 452 ? V.copper : V.danger}>
                  <Mat photo="img/cmeurgente/cmeu_cable_suicida.jpg" clip="broll/cmeurgente/cmeu_cable_mov.mp4"
                    vid={Math.max(c2vid, c2vid2)} w={c2w} h={c2h} k={c2k}
                    qx={0.5 + Math.sin(g / 250) * 0.03} qy={0.5 + Math.cos(g / 290) * 0.025}
                    lit={c2lit} litColor={g < 452 ? V.copper : V.danger} sheenAt={L(482)} />
                </Marco>
              )}

              {/* ACTO 2 · LA SEGUNDA PUNTA — el mismo material, otra escala, otra profundidad */}
              {g >= 592 && g < 826 && (
                <Marco x={2470} y={806} w={430} h={286} ry={13} rx={6} radius={10}
                  lit={0.86} litColor={V.copper} opacity={puntaOn}>
                  <Mat photo="img/cmeurgente/cmeu_cable_suicida.jpg" w={430} h={286} k={2.6}
                    qx={0.22} qy={0.56} lit={0.86} litColor={V.copper} sheenAt={L(636)} />
                  <div style={{
                    position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 14px 10px",
                    background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 2.2,
                    color: V.white, textTransform: "uppercase",
                  }}>La otra punta</div>
                </Marco>
              )}

              {/* ACTO 3 · EL TRANSFORMADOR DEL POSTE */}
              {acto3Vivo && (
                <Marco x={1300} y={400} w={c3w} h={c3h} ry={ip(g, [796, 1080, 1500], [7, 0, -8])}
                  radius={12} lit={c3lit} litColor={V.danger}>
                  <Mat photo="img/cmeurgente/cmeu_transformador.jpg" w={c3w} h={c3h} k={c3k}
                    qx={0.5 + Math.sin(g / 270) * 0.025} qy={0.44 + Math.cos(g / 320) * 0.02}
                    lit={c3lit} litColor={V.danger} sheenAt={L(880)} />
                </Marco>
              )}

              {/* FRONTERA 3→4 · LA LATA QUE SE VUELVE CASCO — un solo marco, nunca se desmonta */}
              {cascoVivo && (
                <Marco x={cx3} y={cy3} w={cw} h={ch} ry={ip(g, [1122, 1330, 1560], [4, 1, -2])}
                  radius={crad} lit={clit} litColor={esCasco ? V.danger : V.steel}>
                  {esCasco ? (
                    <Mat photo="img/cmeurgente/cmeu_tecnico_poste.jpg" clip="broll/cmeurgente/cmeu_tecnico_mov.mp4"
                      vid={Math.max(cvid, cvid2)} w={cw} h={ch} k={ck}
                      qx={cqx} qy={cqy + Math.sin(g / 240) * 0.012}
                      lit={clit} litColor={V.danger} sheenAt={L(1230)} />
                  ) : (
                    <Mat photo="img/cmeurgente/cmeu_transformador.jpg" w={cw} h={ch} k={ck}
                      qx={cqx} qy={cqy} lit={clit} litColor={V.steel} sheenAt={L(1140)} />
                  )}
                </Marco>
              )}

              {/* EL TOMACORRIENTE — de ahi sale la energia hacia atras */}
              {g >= 510 && g < 1000 && (
                <IconPng src="img/cmeurgente/cmeu_ic_enchufe.png" x={pcx(3196)} y={pcy(806)}
                  size={ip(g, [510, 560, 900], [70, 132, 118])} z={0}
                  opacity={enchufeOn} rot={ip(g, [510, 900], [-9, 3])} glow={V.ink0} />
              )}

              {/* LAS FLECHAS: la direccion del acto 3, pegadas al vano de la acometida */}
              {g >= 900 && g < 1180 && (
                <>
                  <IconPng src="img/cmeurgente/cmeu_ic_flecha.png" x={pcx(2180)} y={pcy(590)}
                    size={ip(g, [900, 1000], [72, 104])} opacity={flechaOn}
                    rot={ip(g, [900, 1170], [186, 178])} glow={V.ink0} />
                  <IconPng src="img/cmeurgente/cmeu_ic_flecha.png" x={pcx(1760)} y={pcy(620)}
                    size={ip(g, [930, 1030], [72, 104])} opacity={flechaOn * 0.9}
                    rot={ip(g, [930, 1170], [190, 172])} glow={V.ink0} />
                  <IconPng src="img/cmeurgente/cmeu_ic_flecha.png" x={pcx(1400)} y={pcy(494)}
                    size={ip(g, [960, 1060], [72, 104])} opacity={flechaOn * 0.8}
                    rot={ip(g, [960, 1170], [204, 196])} glow={V.ink0} />
                </>
              )}
            </div>
          </Plane>
        )}

        {/* PLANO 5 · LA LINEA VIVA — pasa POR DELANTE de las fichas (es lo que las conecta) -- */}
        {mundoVivo && g >= 540 && (
          <Plane z={46}>
            <div style={{ position: "absolute", inset: 0, transform: mundo, transformStyle: "preserve-3d" }}>
              <LineaViva g={g} trazo={trazo} carga={carga} tinte={vivo} />
            </div>
          </Plane>
        )}

        {/* PLANO 6 · EL ACTO 5 — la caja de transferencia, ya en espacio de pantalla -------- */}
        {acto5Vivo && (
          <Plane z={0}>
            <Marco x={c5x} y={c5y} w={c5w} h={c5h} ry={ip(g, [1574, 1820, 1950], [6, 1, -1])}
              radius={12} lit={c5lit} litColor={V.volt}>
              <Mat photo="img/cmeurgente/cmeu_transferencia.jpg" w={c5w} h={c5h} k={c5k}
                qx={0.5 + Math.sin(g / 260) * 0.02} qy={0.5 + Math.cos(g / 300) * 0.018}
                lit={c5lit} litColor={V.volt} sheenAt={L(1626)} />
            </Marco>
            {/* EL CAÑO: lo que quedo del cobre de la costura, ahora sobrio y TERMINADO en la caja */}
            <Cuerda x={1712} y={92} largo={ip(g, [1596, 1680], [280, 470])} ang={128} grosor={26}
              tinte={V.copper} brillo={0.8} op={canoOn} />
            <div style={{
              position: "absolute", left: 1418, top: 470, width: 22, height: 22, marginLeft: -11,
              marginTop: -11, borderRadius: 11, background: rgba(V.volt, 0.5 + 0.4 * canoOn),
              boxShadow: `0 0 ${Math.round(14 + 26 * canoOn)}px ${rgba(V.volt, 0.5 * canoOn)}`,
              opacity: canoOn,
            }} />
          </Plane>
        )}

        {/* PLANO 7 · EL SUELO DEL TABLERO — el encuadre bajo con el que entrego el movimiento */}
        {g >= 1660 && (
          <Plane z={-140}>
            <PadPlane y={ip(g, [1660, 1840, 1950], [126, 96, 90])} w={1720} h={340} rx={64}
              lit={ip(g, [1660, 1840, 1950], [0, 0.6, 0.78])} z={0} />
          </Plane>
        )}

        {/* PLANO 8 · PRIMER PLANO — siempre hay algo que pasa POR DELANTE de la camara ------ */}
        {g < 372 && (
          <Plane z={252}>
            {/* el bucle del cable colgando del banco, desenfocado, rozando el lente */}
            <Cuerda x={ip(g, [0, 372], [-360, -120])} y={ip(g, [0, 372], [1020, 1160])}
              largo={1500} ang={-17} grosor={92} tinte={V.copper}
              brillo={0.7} op={ip(g, [0, 60, 300, 370], [0.9, 0.86, 0.8, 0.5])} desenfoque={7} />
          </Plane>
        )}
        {g >= 986 && g < 1560 && (
          <Plane z={232}>
            {/* el viento de la calle: un tensor cruzando el cuadro mientras la camara cranea */}
            <Cuerda x={ip(g, [986, 1560], [-620, 420])} y={ip(g, [986, 1560], [1010, 792])}
              largo={1760} ang={-31} grosor={44} tinte={V.ink2}
              brillo={0.5} op={ip(g, [986, 1060, 1440, 1556], [0, 0.72, 0.72, 0.3])} />
          </Plane>
        )}
        {g >= 1690 && (
          <Plane z={214}>
            {/* el canto del tablero, en sombra, entrando por la izquierda al bajar la camara */}
            <div style={{
              position: "absolute", left: ip(g, [1690, 1950], [-330, -190]), top: -60,
              width: 300, height: 1220,
              background: `linear-gradient(90deg, ${rgba(V.ink0, 0.98)} 0%, ${rgba(V.ink1, 0.94)} 62%, ${rgba(V.steel, 0.22)} 100%)`,
              boxShadow: `18px 0 60px ${rgba(V.ink0, 0.8)}`,
              opacity: ip(g, [1690, 1760], [0, 1]),
            }} />
          </Plane>
        )}

        {/* PLANO 9 · EL ACTO 1 — el grupo en el que ENTRA la camara (zoom-through) ---------- */}
        {acto1Vivo && (
          <Plane z={20} style={{
            transform: `translateZ(20px) ${zt.out === "none" ? "" : zt.out}`,
            opacity: zt.opacity,
          }}>
            <Marco x={c1x} y={c1y} w={c1w} h={c1h} ry={ip(g, [24, 352], [3, -1])} rx={ip(g, [24, 352], [5, 1])}
              radius={14} lit={c1lit} litColor={V.volt} opacity={ip(g, [14, 34], [0, 1])}>
              <Mat photo="img/cmeurgente/cmeu_cable_suicida.jpg" clip="broll/cmeurgente/cmeu_cable_mov.mp4"
                vid={c1vid} w={c1w} h={c1h} k={c1k}
                qx={0.5 + Math.sin(g / 210) * 0.02} qy={0.5 + Math.cos(g / 240) * 0.018}
                lit={c1lit} litColor={V.volt} sheenAt={L(58)} />
            </Marco>
            {/* las dos reticulas: DOS machos, uno en cada punta */}
            <Reticula x={c1x - c1w * 0.31} y={c1y - c1h * 0.04} r={ip(g, [148, 190], [30, 62])}
              on={retA} texto="Macho" tinte={V.volt} />
            <Reticula x={c1x + c1w * 0.29} y={c1y + c1h * 0.06} r={ip(g, [188, 230], [30, 62])}
              on={retB} texto="Macho" tinte={V.volt} />
          </Plane>
        )}
      </Layers>

      {/* ══════ COSTURA 4→5 · EL CABLE GRUESO DE COBRE + LA OCLUSION ══════════════════════ */}
      {cobreVivo && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <Cuerda x={lerp(-2760, 2040, cobreP)} y={ip(g, [1524, 1632], [470, 596])}
            largo={2760} ang={-9}
            grosor={ip(g, [1524, 1548, 1562, 1584, 1604, 1632], [180, 340, 1520, 1520, 380, 190])}
            tinte={V.copper} brillo={1} op={1} />
        </AbsoluteFill>
      )}
      <SeamOcclude at={L(1560)} dur={46} color={V.copper} angle={-9} lit={0.34} />
      {/* el golpe del estampado (acento de beat, 6 cuadros): NO es una costura */}
      <SeamFlash at={L(452)} color={V.danger} dur={6} />

      {/* ══════ HUD — texto y rotulos en espacio de pantalla ══════════════════════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* ACTO 1 · DOS MACHOS */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "72%", opacity: t1, transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)` }}>
            <Bed w={690} pad={24}>
              <Kick color={V.volt}>Lo que mata gente</Kick>
              <div style={{ height: 8 }} />
              <Head size={78}>DOS MACHOS</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Un cable con una ficha <Em>en cada punta</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · EL ESTAMPADO — el titular va SOBRE el cable, en el naranja de peligro */}
        {sello > 0.01 && (
          <div style={{
            position: "absolute", left: "52%", top: "40%",
            transform: `translate(-50%,-50%) rotate(-6deg) scale(${lerp(1.42, 1, selloP).toFixed(3)})`,
            opacity: sello,
          }}>
            <Bed pad={22}>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, lineHeight: 0.94,
                letterSpacing: 2, color: V.danger,
                textShadow: `0 0 ${Math.round(44 * selloP)}px ${rgba(V.danger, 0.5)}, 0 6px 26px rgba(0,0,0,0.94)`,
              }}>CABLE SUICIDA</div>
              <div style={{
                height: 5, marginTop: 10, borderRadius: 3,
                background: rgba(V.danger, 0.9), transform: `scaleX(${selloP.toFixed(3)})`, transformOrigin: "0% 50%",
                boxShadow: `0 0 18px ${rgba(V.danger, 0.55)}`,
              }} />
            </Bed>
          </div>
        )}

        {/* ACTO 2 · el pie de la misma idea */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "74%", opacity: t2, transform: `translateY(${((1 - t2) * 20).toFixed(1)}px)` }}>
            <Bed w={700} pad={22}>
              <Kick color={V.danger}>Asi le dicen en el oficio</Kick>
              <div style={{ height: 8 }} />
              <Body size={33}>Los dos extremos dan corriente. <Em color={V.danger}>Los dos.</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · LA ENERGIA VA PARA ATRAS */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "70%", opacity: t3, transform: `translateY(${((1 - t3) * 22).toFixed(1)}px)` }}>
            <Bed w={760} pad={24}>
              <Kick color={V.danger}>Lo que nadie te cuenta</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>LA ENERGIA VA <Em color={V.danger}>PARA ATRAS</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Tu casa deja de recibir y empieza a mandar</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · el remate corto */}
        {t3b > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "76%", opacity: t3b, transform: `translateY(${((1 - t3b) * 18).toFixed(1)}px)` }}>
            <Bed w={640} pad={22}>
              <Head size={58}>SALE POR DONDE <Em color={V.danger}>ENTRO</Em></Head>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · EL TECNICO EN EL POSTE */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "12%", opacity: t4, transform: `translateY(${((1 - t4) * -22).toFixed(1)}px)` }}>
            <Bed w={720} pad={24}>
              <Kick color={V.danger}>Arriba del poste</Kick>
              <div style={{ height: 8 }} />
              <Head size={66}>EL TECNICO EN EL POSTE</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Corto la linea. Trabaja creyendo que no hay tension</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · el remate que cierra el circuito con el espectador */}
        {t4b > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "74%", opacity: t4b, transform: `translateY(${((1 - t4b) * 20).toFixed(1)}px)` }}>
            <Bed w={680} pad={24}>
              <Head size={64} color={V.danger}>Y TU SE LA MANDASTE</Head>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · SE HACE CON UNA CAJA — el naranja ya se apago */}
        {t5 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "68%", opacity: t5, transform: `translateY(${((1 - t5) * 24).toFixed(1)}px)` }}>
            <Bed w={800} pad={24}>
              <Kick color={V.volt}>Se hace bien</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>SE HACE CON <Em>UNA CAJA</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Interruptor de transferencia: o la red, o el generador</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · la palanca, en UNA sola posicion */}
        <Palanca x={1604} y={330} on={palancaOn} tira={tira} />

        {/* EL RAYO — el peligro pegado a las manos del tecnico (objeto de la escena, no adorno) */}
        {g >= 1292 && g < 1560 && (
          <IconPng src="img/cmeurgente/cmeu_ic_rayo.png" x={ip(g, [1292, 1552], [63, 57])} y={ip(g, [1292, 1552], [30, 26])}
            size={ip(g, [1292, 1360, 1552], [78, 128, 116])} z={0}
            opacity={rayoOn * (0.72 + 0.28 * Math.sin(g / 7))} rot={ip(g, [1292, 1552], [-12, 5])} glow={V.ink0} />
        )}
        {/* LA CAJA — el icono de la respuesta, al lado del tablero */}
        {g >= 1690 && (
          <IconPng src="img/cmeurgente/cmeu_ic_caja.png" x={ip(g, [1690, 1950], [22, 25])} y={ip(g, [1690, 1950], [26, 23])}
            size={ip(g, [1690, 1760, 1950], [76, 124, 118])} z={0}
            opacity={ip(g, [1690, 1728, 1920, 1950], [0, 0.95, 0.95, 0.8])}
            rot={ip(g, [1690, 1950], [-8, 3])} glow={V.ink0} />
        )}
        {g >= 1830 && (
          <IconPng src="img/cmeurgente/cmeu_ic_breaker.png" x={ip(g, [1830, 1950], [86, 84])} y={ip(g, [1830, 1950], [72, 69])}
            size={ip(g, [1830, 1890, 1950], [70, 112, 108])} z={0}
            opacity={ip(g, [1830, 1868, 1950], [0, 0.9, 0.9])}
            rot={ip(g, [1830, 1950], [9, -3])} glow={V.ink0} />
        )}
      </AbsoluteFill>

      {/* viñeta: se cierra cuando manda el naranja y se abre cuando vuelve el volt */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(126% 106% at 50% 46%, rgba(0,0,0,0) 50%, rgba(6,7,5,${(0.28 + 0.26 * rojo).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
