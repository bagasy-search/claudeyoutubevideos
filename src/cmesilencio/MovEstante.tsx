// MovEstante.tsx — S8 · 60,1 s (1802 frames @30) · arranca en el segundo 571,60 del video.
//
// ESPINA: la lista de materiales de veinte dólares NO es una lista. Es UN ESTANTE, y la cámara lo
// RECORRE. Un solo travelling que baja y avanza a lo largo del banco del patio: cada acto es un tramo
// del mismo recorrido, cada material se cuelga en el mismo riel, y la cámara NUNCA vuelve atrás.
//
// IDEA RECTORA: hay UN banco, UN riel y SEIS ranuras. El riel vive en coordenadas de MUNDO (cada
// ranura a 520 px de la anterior) y la cámara viaja por él de izquierda a derecha. Cuando hace falta
// que las seis se lean juntas, NO retrocede la cámara: se CONTRAE EL RIEL hacia un punto por delante
// de ella (paso 520 → 210 px), y el estante entero entra en el cuadro sin deshacer el recorrido.
//
// Cada tarjeta lleva MATERIAL REAL adentro (clip o foto) y su precio quemado en el marco inferior.
// La de los dos codos —la pieza clave— es la única con el marco entero en verde-voltio.
//
// ENTREGA: entra sobre el concreto del patio con luz `sky` fría de anochecer (viene de la sección
// anterior) y SALE en plano casi macro sobre el canto laminado de la hoja de contrachapado, con el
// filo verde-voltio del total todavía encendido en el borde. La sierra entra en el plano siguiente.
//
// CONTRATO: una sola <Sequence> (los actos se recortan por rango de `g` y se pisan 20-30 cuadros) ·
// cero Math.random/Date · rutas de asset literales · `light()` sólo con claves de `V` · el `off`
// reconstruye el ancla absoluta de los helpers del Stage que leen useCurrentFrame().

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, zoomThrough,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

// ── utilidades locales ───────────────────────────────────────────────────────────────────────
const EZ = Easing.bezier(0.32, 0.68, 0.28, 1);
const ip = (g: number, ks: number[], vs: number[], ez: (n: number) => number = EZ) =>
  interpolate(g, ks, vs, { easing: ez, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const TOTAL = 1802;
const PASO0 = 520;      // separación de las ranuras del riel, en px de mundo
const PX = 19.2;        // 1920 px = 100 % de pantalla

type Mat = {
  src: string; kind: "video" | "photo";
  nombre: string; precio: string; clave: boolean; t: number;
};

/** LAS SEIS RANURAS DEL ESTANTE, en el orden en el que la cámara las encuentra.
 *  `t` es el frame en el que la pieza se despega del banco y sube a su ranura. */
const MATERIALES: Mat[] = [
  { src: "broll/cmesilencio/cms_s8_canto_contrachapado_cinta.mp4", kind: "video",
    nombre: "CONTRACHAPADO 12 MM", precio: "$6", clave: false, t: 451 },
  { src: "broll/cmesilencio/cms_s8_lana_mineral_espesor.mp4", kind: "video",
    nombre: "LANA MINERAL 5 CM", precio: "$5", clave: false, t: 696 },
  { src: "broll/cmesilencio/cms_s8_codos_galvanizados_banco.mp4", kind: "video",
    nombre: "DOS CODOS GALVANIZADOS", precio: "$3", clave: true, t: 1329 },
  { src: "broll/cmesilencio/cms_s8_tubo_flexible_medido.mp4", kind: "video",
    nombre: "TUBO FLEXIBLE 50 CM", precio: "$3", clave: false, t: 1440 },
  { src: "broll/cmesilencio/cms_s8_cartucho_gota_punta.mp4", kind: "video",
    nombre: "CARTUCHO DE SELLADOR", precio: "$3", clave: false, t: 1520 },
  { src: "img/cmesilencio/cms_s8_punado_tornillos_lata.jpg", kind: "photo",
    nombre: "TACOS DE GOMA Y TORNILLOS", precio: "GRATIS", clave: false, t: 1660 },
];

/** Titular de acto: cama oscura obligatoria, ≤6 palabras, entra y sale deslizando. */
const Titu: React.FC<{
  g: number; a: number; b: number; kick: string; l1: string; l2?: string;
  x?: number; y?: number; w?: number; color?: string;
}> = ({ g, a, b, kick, l1, l2, x = 6.5, y = 11, w = 600, color = V.volt }) => {
  const inP = clamp01((g - a) / 14);
  const outP = clamp01((b - g) / 12);
  const op = Math.min(inP, outP);
  if (op <= 0) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, opacity: op,
      transform: `translateZ(120px) translateY(${((1 - inP) * 32 - (1 - outP) * 18).toFixed(1)}px)`,
    }}>
      <Bed pad={26} w={w}>
        <Kick color={color}>{kick}</Kick>
        <div style={{ height: 10 }} />
        <Head size={58}>{l1}</Head>
        {l2 ? <Head size={58}>{l2}</Head> : null}
      </Bed>
    </div>
  );
};

/** EL PRECIO QUEMADO EN EL MARCO: no es un rótulo suelto, es la franja inferior de la tarjeta.
 *  Va exactamente sobre el canto de abajo del vidrio, con el mismo ancho. */
const Precio: React.FC<{
  x: number; y: number; w: number; h: number; z: number; texto: string;
  encendido: number; clave: boolean;
}> = ({ x, y, w, h, z, texto, encendido, clave }) => {
  // la pieza clave lleva el precio con más cuerpo: el estante distingue con LUZ, no con texto
  const col = V.volt;
  const fuerza = clave ? 1.35 : 1;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: w, height: Math.max(30, h * 0.19), marginLeft: -w / 2, marginTop: h / 2 - Math.max(30, h * 0.19),
      transform: `translateZ(${z + 2}px)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(180deg, ${rgba(V.ink0, 0.2)} 0%, ${rgba(V.ink0, 0.92)} 62%)`,
      borderTop: `${clave ? 3 : 2}px solid ${rgba(col, Math.min(1, (0.28 + 0.62 * encendido) * fuerza))}`,
      boxShadow: `0 0 ${Math.round(26 * encendido * fuerza)}px ${rgba(col, 0.4 * encendido * fuerza)}`,
      opacity: 0.25 + 0.75 * encendido,
      pointerEvents: "none",
    }}>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 800,
        fontSize: Math.max(22, Math.round(h * 0.155)), letterSpacing: 2.4,
        color: col, textShadow: `0 0 ${Math.round(18 * encendido)}px ${rgba(col, 0.6 * encendido)}, 0 3px 12px rgba(0,0,0,0.95)`,
      }}>{texto}</div>
    </div>
  );
};

/** EL MARCO DE LA PIEZA CLAVE: el estante dice cuál importa con la LUZ, no con el texto. */
const MarcoClave: React.FC<{ x: number; y: number; w: number; h: number; z: number; on: number }> = ({
  x, y, w, h, z, on,
}) => {
  if (on <= 0) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: w + 14, height: h + 14, marginLeft: -(w + 14) / 2, marginTop: -(h + 14) / 2,
      transform: `translateZ(${z - 1}px)`, borderRadius: 18,
      border: `3px solid ${rgba(V.volt, 0.9 * on)}`,
      boxShadow: `0 0 ${Math.round(46 * on)}px ${rgba(V.volt, 0.55 * on)}, inset 0 0 ${Math.round(30 * on)}px ${rgba(V.volt, 0.18 * on)}`,
      pointerEvents: "none",
    }} />
  );
};

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovEstante: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  const local = useCurrentFrame();
  const g = Math.max(0, Math.min(TOTAL, gFrame ?? local));
  const off = local - (gFrame ?? local);   // ancla absoluta para SeamOcclude / Readout / sheenAt

  // ── LA CÁMARA: UNA sola llamada que avanza. Ni un reinicio en los seis actos. ──────────────
  const base = gcam(g, { z0: -30, z1: 120, panX: -34, panY: -18, ry: 1.4, rx: 1.1, dur: TOTAL });
  // recorrido por el riel (px de mundo). Estrictamente creciente: la cámara nunca vuelve atrás.
  const camX = ip(
    g,
    [0, 156, 300, 451, 520, 760, 1100, 1395, 1504, 1584, 1724, TOTAL],
    [-360, -330, -300, -180, 0, 520, 780, 1040, 1560, 2080, 2600, 2700],
  );
  // descenso: el contenido sube en cuadro porque la cámara BAJA hacia el nivel del banco.
  const camY = ip(g, [0, 156, 451, 696, 1100, 1329, 1560, 1700, TOTAL],
    [26, 10, -14, -38, -62, -86, -110, -134, -150]);
  // acercamiento: monotónico. El último tramo es la clavada sobre el canto de la hoja.
  const camZ = ip(g, [0, 156, 451, 696, 1100, 1329, 1560, 1700, TOTAL],
    [-30, 18, 52, 84, 116, 152, 196, 262, 402]);
  const camRX = ip(g, [0, 900, TOTAL], [0, 1.6, 3.4]);
  const camRY = ip(g, [0, 520, 1500, TOTAL], [1.8, 0.4, -0.6, -1.4]);
  const cam =
    `${base.transform} translate3d(0px, ${camY.toFixed(1)}px, ${camZ.toFixed(1)}px) ` +
    `rotateY(${camRY.toFixed(2)}deg) rotateX(${camRX.toFixed(2)}deg)`;

  // ── EL RIEL: paso y ancla. Al final el estante se CONTRAE hacia un punto por delante ───────
  const paso = ip(g, [1690, 1748], [PASO0, 210]);
  const ancla = ip(g, [1690, 1748], [5 * PASO0, 3140]);
  const escT = clamp01(paso / PASO0);
  const esc = Math.max(0.38, escT);
  const sx = (wx: number) => 50 + (wx - camX) / PX;

  // ── LA LUZ: `sky` fría de anochecer que va ganando verde-voltio con cada precio ────────────
  const tint = light(ip(g, [0, 451, 1329, 1690, TOTAL], [0, 0.28, 0.62, 0.86, 1]), "sky", "volt");
  const tint2 = light(ip(g, [0, 900, TOTAL], [0, 0.35, 0.6]), "amber", "torch");
  const atInt = ip(g, [0, 300, 1100, 1690, TOTAL], [0.74, 0.86, 0.98, 1.12, 1.24]);
  const atKey = ip(g, [0, 451, 1100, TOTAL], [0.34, 0.4, 0.5, 0.62]);
  const atFloor = ip(g, [0, 451, 1400, TOTAL], [0.66, 0.7, 0.74, 0.84]);
  const padLit = ip(g, [0, 300, 1100, TOTAL], [0.9, 1.05, 0.86, 0.5]);

  // ── ACTO 1 · el billete se despega y es la tarjeta del TOTAL ──────────────────────────────
  const totalNace = clamp01((g - 14) / 72);
  const totalX = sx(-300);
  const totalW = ip(g, [0, 150, 200, 300], [860, 860, 300, 260]);
  const totalH = totalW * (500 / 860);
  const totalY = ip(g, [0, 150, 210], [48, 46, 53]);
  const totalZ = ip(g, [0, 150, 210], [40, 60, 150]);

  // ── ACTO 2 · EL BLOQUE DE FÁBRICA — metamorfosis: el canto inferior de la tarjeta se
  //    despega hacia arriba y se vuelve el bloque. Sube hasta salirse por el techo del cuadro. ─
  const blqH = ip(g, [150, 200, 300, 440], [0.6, 40, 104, 236]);   // % de 1080
  const blqW = ip(g, [150, 200], [880, 1010]);
  const blqBase = 70;                                              // el muro bajo del patio
  const blqX = sx(-300);
  const verBloque = g >= 148 && g < 470;
  // la escala de VEINTE: la altura de la tarjeta repetida por el flanco hasta salirse
  const escalones = Math.round(ip(g, [206, 400], [0, 20]));
  const tagY = blqBase - blqH * 0.42;
  const tagX = blqX + (blqW / 2 - 96) / PX;

  // COSTURA 2→3 · ZOOM-THROUGH: la cámara entra por la etiqueta de precio ilegible del flanco.
  const zt = zoomThrough(g, 430, 28, tagX, tagY);

  // ── EL DUELO DE MATERIALES (el tramo entre la lana y los codos) ────────────────────────────
  const duelo = (t0: number, t1: number, t2: number, t3: number) =>
    Math.min(clamp01((g - t0) / (t1 - t0)), clamp01((t3 - g) / (t3 - t2)));
  const dLana = duelo(880, 940, 1240, 1300);
  const dEspuma = duelo(1000, 1060, 1250, 1306);

  // ── EL CIERRE: el total, el apagado en fila y la clavada sobre el canto ────────────────────
  const totalOn = clamp01((g - 1712) / 30) * clamp01((1834 - g) / 40);
  const filo = clamp01((g - 1700) / 40);              // el filo verde-voltio del canto
  const clavada = clamp01((g - 1744) / 58);           // la hoja de contrachapado sube al cuadro
  const hojaY = ip(g, [1700, 1760, TOTAL], [110, 102, 96]);
  const hojaW = ip(g, [1700, 1760, TOTAL], [1700, 2200, 3400]);
  const hojaBlur = ip(g, [1700, 1780, TOTAL], [7, 3, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez, arriba de todo, y no se remonta nunca ── */}
      <VoltAtmos tint={tint} tint2={tint2} keyFrom={atKey} intensity={atInt} floor={atFloor} />

      <Layers cam={cam}>
        {/* PLANO −560 · EL BANCO DEL PATIO: la cama de foto bajo TODO lo que flota */}
        <Plane z={0} style={{ transform: `translateZ(-560px) translateX(${(-camX * 0.14).toFixed(1)}px)` }}>
          <PhotoPlane src="img/cmesilencio/cms_s8_billete_sobre_contrachapado.jpg" kind="photo"
            z={0} scale={2.05} dim={ip(g, [0, 300, 1400, TOTAL], [0.62, 0.7, 0.76, 0.88])} tint={V.sky} />
        </Plane>

        {/* PLANO −360 · el muro bajo de bloques y la VENTANA AMARILLA del vecino, que se ve
            entre las tarjetas y desaparece cuando el bloque de fábrica la tapa */}
        <Plane z={-360}>
          <div style={{
            position: "absolute", left: "-160%", right: "-160%", top: `${blqBase}%`, height: 300,
            background: `repeating-linear-gradient(90deg, ${rgba(V.ink2, 0.96)} 0 78px, ${rgba(V.ink1, 0.99)} 78px 86px)`,
            opacity: 0.72, boxShadow: `0 -2px 0 ${rgba(V.concrete, 0.2)}`,
            transform: `translateX(${(-camX * 0.34).toFixed(1)}px)`,
          }} />
          <div style={{
            position: "absolute", left: `${(sx(240) - 6).toFixed(2)}%`, top: `${blqBase - 13}%`,
            width: 230, height: 148, borderRadius: 3,
            background: `linear-gradient(178deg, ${rgba(V.amber, 0.5)} 0%, ${rgba(V.amber, 0.24)} 100%)`,
            boxShadow: `0 0 120px ${rgba(V.amber, 0.34)}`,
            opacity: ip(g, [0, 150, 220, 470, 520], [0.9, 0.9, 0, 0, 0.72]) * (1 - clavada * 0.5),
          }} />
        </Plane>

        {/* PLANO −240 · EL CONCRETO DEL PATIO: el suelo que traemos de la sección anterior */}
        <PadPlane y={80} w={5200} h={330} rx={62} lit={padLit} z={-240} />

        {/* ══════ ACTOS 1 y 2 — se van del cuadro por el ZOOM-THROUGH de la etiqueta ══════ */}
        <div style={{
          position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
          transformStyle: "preserve-3d",
          transform: zt.out === "none" ? "none" : zt.out,
          transformOrigin: "50% 50%",
          opacity: zt.out === "none" ? 1 : zt.opacity,
        }}>
          {/* EL BLOQUE DE FÁBRICA: liso, sin costuras, veinte alturas de tarjeta */}
          {verBloque && (
            <Plane z={-80}>
              <div style={{
                position: "absolute", left: `${blqX}%`, top: `${(blqBase - blqH).toFixed(2)}%`,
                width: blqW, height: `${blqH.toFixed(2)}%`, marginLeft: -blqW / 2,
                background: `linear-gradient(96deg, ${rgba(V.steel, 0.34)} 0%, ${rgba(V.steel, 0.19)} 42%, ${rgba(V.ink1, 0.96)} 100%)`,
                boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.2)}, -30px 0 90px ${rgba(V.ink0, 0.9)}`,
                borderRadius: 4,
              }}>
                {/* la escala de VEINTE por el flanco: una raya por cada alto de tarjeta */}
                {Array.from({ length: escalones }, (_, i) => (
                  <div key={i} style={{
                    position: "absolute", right: 16, bottom: `${(i * 5 + 1.4).toFixed(2)}%`,
                    width: 54 + (i % 2) * 22, height: 2,
                    background: rgba(V.volt, 0.24 + 0.4 * clamp01(1 - i / 20)),
                  }} />
                ))}
                <div style={{
                  position: "absolute", right: 22, bottom: "2%", width: 2, height: "96%",
                  background: `linear-gradient(0deg, ${rgba(V.volt, 0.42)} 0%, rgba(0,0,0,0) 92%)`,
                }} />
              </div>
              {/* la etiqueta de precio ILEGIBLE del flanco: por acá entra la cámara */}
              <IconPng src="img/cmesilencio/cms_ic_dolar.png" x={tagX} y={tagY} size={104} z={40}
                opacity={ip(g, [214, 250, 424, 440], [0, 0.94, 0.94, 0.6])} glow={V.ink0} />
              <div style={{
                position: "absolute", left: `${tagX}%`, top: `${tagY}%`,
                width: 150, height: 150, marginLeft: -75, marginTop: -75, borderRadius: "50%",
                border: `2px solid ${rgba(V.volt, ip(g, [356, 428], [0, 0.86]))}`,
                boxShadow: `0 0 40px ${rgba(V.volt, ip(g, [356, 428], [0, 0.5]))}`,
                transform: `translateZ(60px) scale(${ip(g, [356, 430], [1.55, 1]).toFixed(3)})`,
              }} />
            </Plane>
          )}

          {/* LA TARJETA DEL TOTAL: el billete se despegó del contrachapado y se hizo objeto */}
          {totalNace > 0 && g < 470 && (
            <Plane z={0}>
              <MediaCard src="broll/cmesilencio/cms_s8_billete_sobre_contrachapado.mp4" kind="video"
                w={totalW} h={totalH} x={totalX} y={eio(74, totalY, totalNace)} z={totalZ}
                ry={ip(g, [0, 300], [-5, -11])} radius={16}
                lit={ip(g, [0, 90], [0.3, 1])} litColor={V.volt}
                sheenAt={40 + off} opacity={clamp01(totalNace * 1.6)} />
              <Precio x={totalX} y={eio(74, totalY, totalNace)} w={totalW} h={totalH} z={totalZ}
                texto={g < 120 ? "$20" : "$35 – $40"} encendido={clamp01((g - 30) / 40)} clave={false} />
            </Plane>
          )}

          <Plane z={0}>
            <Titu g={g} a={46} b={150} kick="LA LISTA COMPLETA" l1="TODO NUEVO" l2="SON CUARENTA" />
            <Titu g={g} a={206} b={420} kick="LA CAJA DE FÁBRICA" l1="VEINTE VECES" l2="MÁS CARA" />
            {g >= 40 && g < 160 && (
              <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}>
                <Readout value={String(Math.round(ip(g, [46, 130], [20, 40])))} unit="USD"
                  label="SI COMPRAS TODO NUEVO" at={46 + off} x={78} y={30} size={104}
                  color={V.bone} align="center" />
              </div>
            )}
          </Plane>
        </div>

        {/* ══════ EL ESTANTE — las seis ranuras del riel ══════ */}
        <Plane z={0}>
          {MATERIALES.map((m, i) => {
            const nace = clamp01((g - m.t) / 64);
            if (nace <= 0) return null;
            const wx = ancla - (5 - i) * paso;
            const x = sx(wx);
            if (x < -55 || x > 155) return null;
            const w = 480 * esc;
            const h = 300 * esc;
            const y = eio(80, 47, nace);
            const z = -18 + i * 7 + (m.clave ? 34 : 0);
            const ry = Math.max(-15, Math.min(15, (50 - x) * 0.17));
            // el apagado en fila del cierre: de izquierda a derecha, una por una
            const apaga = clamp01((g - 1744 - i * 8) / 22);
            const vivo = 1 - apaga;
            const foco = acto - 2 === i ? 0.12 : 0;
            return (
              <React.Fragment key={i}>
                <MarcoClave x={x} y={y} w={w} h={h} z={z}
                  on={m.clave ? clamp01((g - m.t - 22) / 26) * vivo : 0} />
                <MediaCard src={m.src} kind={m.kind}
                  w={w} h={h} x={x} y={y} z={z} ry={ry} radius={12}
                  lit={clamp01((0.42 + 0.6 * nace + foco) * vivo)}
                  litColor={m.clave ? V.volt : V.bone}
                  label={nace > 0.72 && esc > 0.62 ? m.nombre : undefined}
                  sheenAt={m.t + 52 + off}
                  opacity={clamp01(nace * 1.5) * vivo} />
                <Precio x={x} y={y} w={w} h={h} z={z} texto={m.precio}
                  encendido={clamp01((g - m.t - 30) / 26) * vivo} clave={m.clave} />
              </React.Fragment>
            );
          })}

          {/* el hueco que espera a la pieza siguiente: el estante se lee como una FILA que empieza */}
          {MATERIALES.map((m, i) => {
            const proximo = MATERIALES[i];
            const abierto = clamp01((g - (i === 0 ? 451 : MATERIALES[i - 1].t + 40)) / 26)
              * clamp01((proximo.t + 30 - g) / 24);
            if (abierto <= 0.02 || i === 0) return null;
            const wx = ancla - (5 - i) * paso;
            const x = sx(wx);
            if (x < -30 || x > 130) return null;
            const w = 480 * esc, h = 300 * esc;
            return (
              <div key={`h${i}`} style={{
                position: "absolute", left: `${x}%`, top: "47%",
                width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
                transform: `translateZ(${-24 + i * 7}px)`, borderRadius: 12,
                border: `1px dashed ${rgba(V.white, 0.16 * abierto)}`,
                background: `linear-gradient(180deg, ${rgba(V.white, 0.02 * abierto)} 0%, rgba(0,0,0,0) 70%)`,
                opacity: abierto,
              }} />
            );
          })}
        </Plane>

        {/* ══════ EL DUELO: la lana no arde · la espuma sí ══════ */}
        {dLana > 0 && (
          <Plane z={60}>
            <MediaCard src="broll/cmesilencio/cms_s8_lana_no_arde_prueba.mp4" kind="video"
              w={392} h={236} x={sx(760)} y={ip(g, [880, 950], [32, 26])} z={90} ry={7} radius={11}
              lit={1} litColor={V.volt} label="NO ARDE" sheenAt={926 + off} opacity={dLana} />
          </Plane>
        )}
        {dEspuma > 0 && (
          <Plane z={60}>
            <MediaCard src="broll/cmesilencio/cms_s8_espuma_humo_negro.mp4" kind="video"
              w={392} h={236} x={sx(1210)} y={ip(g, [1000, 1080, 1306], [34, 27, 40])} z={90}
              ry={-7} radius={11} lit={0.86} litColor={V.danger}
              label="ESPUMA · HUMO NEGRO" opacity={dEspuma} />
            <IconPng src="img/cmesilencio/cms_ic_x.png" x={sx(1210)} y={ip(g, [1000, 1080, 1306], [34, 27, 40])}
              size={ip(g, [1074, 1112], [230, 156])} z={140}
              opacity={clamp01((g - 1074) / 22) * dEspuma} glow={V.ink0} />
            <IconPng src="img/cmesilencio/cms_ic_humo.png" x={sx(1210) + 6.5}
              y={ip(g, [1040, 1240], [26, 14])} size={104} z={130}
              opacity={0.7 * dEspuma} glow={V.ink0} />
          </Plane>
        )}
        <Plane z={0}>
          <Titu g={g} a={470} b={660} kick="MATERIAL 01" l1="LA HOJA DE" l2="CONTRACHAPADO" />
          <Titu g={g} a={716} b={870} kick="MATERIAL 02" l1="LANA MINERAL" l2="DE CINCO CENTÍMETROS" />
          <Titu g={g} a={962} b={1288} kick="POR QUÉ NO ESPUMA" l1="LA LANA NO ARDE." l2="LA ESPUMA HUMEA."
            color={V.danger} />
          <Titu g={g} a={1348} b={1600} kick="MATERIAL 03" l1="LOS DOS CODOS" l2="LA PIEZA CLAVE" />
          <Titu g={g} a={1676} b={1780} kick="MATERIAL 06" l1="TACOS DE GOMA" l2="DE UNA LLANTA VIEJA" />
        </Plane>

        {/* los objetos sueltos del banco que acompañan a su tarjeta */}
        <Plane z={100}>
          {g >= 1526 && g < 1700 && (
            <IconPng src="img/cmesilencio/cms_ic_cartucho.png" x={sx(2080) + 7.6} y={62} size={96} z={40}
              opacity={ip(g, [1526, 1560, 1670, 1700], [0, 0.9, 0.9, 0])} glow={V.ink0} />
          )}
          {g >= 1666 && (
            <IconPng src="img/cmesilencio/cms_ic_llanta.png" x={sx(2600) + 7.2} y={62}
              size={ip(g, [1666, 1720], [86, 104])} z={40}
              opacity={ip(g, [1666, 1706, 1770, 1800], [0, 0.92, 0.92, 0])} glow={V.ink0} />
          )}
        </Plane>

        {/* ══════ EL TOTAL: veinte dólares debajo de la fila entera ══════ */}
        {totalOn > 0 && (
          <Plane z={170}>
            <div style={{
              position: "absolute", left: "50%", top: "70%", transform: "translate(-50%,0)",
              display: "flex", alignItems: "baseline", gap: 22, opacity: totalOn,
            }}>
              <Body size={30} color={rgba(V.white, 0.74)}>TODO EL MATERIAL</Body>
              <Num size={ip(g, [1712, 1756], [92, 132])} color={V.volt}>$20</Num>
            </div>
            <div style={{
              position: "absolute", left: "18%", right: "18%", top: "67.4%", height: 2,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.volt, 0.7 * totalOn)} 22%, ${rgba(V.volt, 0.7 * totalOn)} 78%, rgba(0,0,0,0) 100%)`,
            }} />
          </Plane>
        )}

        {/* ══════ LA SALIDA: la HOJA DE CONTRACHAPADO en primer plano se come el cuadro ══════ */}
        <Plane z={90}>
          <div style={{ filter: `blur(${hojaBlur.toFixed(2)}px)` }}>
            <MediaCard src="broll/cmesilencio/cms_s8_canto_contrachapado_cinta.mp4" kind="video"
              w={hojaW} h={hojaW * 0.30} x={50} y={hojaY} z={0} radius={4}
              lit={ip(g, [1700, TOTAL], [0.5, 1.05])} litColor={V.volt}
              grade sheenAt={1766 + off} opacity={1} />
          </div>
          {/* EL FILO VERDE-VOLTIO en el canto laminado: el total sigue encendido en la madera */}
          <div style={{
            position: "absolute", left: "50%", top: `${(hojaY - hojaW * 0.30 / 2 / 10.8).toFixed(2)}%`,
            width: hojaW * 0.94, height: 3, marginLeft: -(hojaW * 0.94) / 2,
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.volt, 0.92 * filo)} 18%, ${rgba(V.volt, 0.92 * filo)} 82%, rgba(0,0,0,0) 100%)`,
            boxShadow: `0 0 ${Math.round(34 * filo)}px ${rgba(V.volt, 0.6 * filo)}`,
            opacity: filo,
          }} />
        </Plane>

        {/* PLANO +250 · LA LUZ del patio y la mota en primer plano (hold VIVO) */}
        <Plane z={250} style={{ pointerEvents: "none" }}>
          <AbsoluteFill style={{
            background: `linear-gradient(180deg, ${rgba(tint, 0.06 + 0.08 * clavada)} 0%, rgba(0,0,0,0) 40%)`,
          }} />
          {Array.from({ length: 10 }, (_, i) => {
            const s = 0.45 + rnd(i * 4.1) * 1.1;
            const yy = ((rnd(i * 2.3) * 132 - (g * s) / 20) % 132 + 132) % 132 - 14;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 7.9) * 104 - 2).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: 4 + rnd(i * 5.7) * 5, height: 4 + rnd(i * 5.7) * 5, borderRadius: "50%",
                background: rgba(V.white, 0.05 + rnd(i * 3.1) * 0.07),
              }} />
            );
          })}
          <AbsoluteFill style={{
            background: `radial-gradient(124% 96% at 50% 52%, rgba(0,0,0,0) 50%, ${rgba(V.ink0, lerp(0.48, 0.7, clamp01(g / TOTAL)))} 100%)`,
          }} />
        </Plane>
      </Layers>

      {/* ── COSTURA 3→4 · OCLUSIÓN con la MATERIA que cruza: la hoja de contrachapado ── */}
      <SeamOcclude at={676 + off} dur={18} color={V.paper} angle={6} lit={0.3} />
    </AbsoluteFill>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────────────────────
   TABLA DE ENTRADA Y SALIDA DE LOS ACTOS  ·  MovEstante · 1802 frames · un solo travelling
   (los rangos se PISAN: cada acto sigue vivo mientras el siguiente ya entró en cuadro)

   ACTO | RANGO g    | ENTRA (encuadre + luz)                     | SALE (encuadre + luz)                        | COSTURA hacia el siguiente
   -----|------------|--------------------------------------------|----------------------------------------------|---------------------------------------------
    1   | 0 – 200    | plano medio sobre el banco, cámara alta,    | la tarjeta del total ya achicada a mano,     | METAMORFOSIS · el canto inferior de la
        | (pisa 44)  | camX −360 · camZ −30 · luz `sky` fría de    | camX −330 · camZ +18 · sky con el ámbar      | tarjeta se despega hacia arriba y se vuelve
        |            | anochecer, ventana ámbar del vecino a la    | de la ventana todavía a la derecha           | el BLOQUE de fábrica, que sube desde el
        |            | derecha; PadPlane de concreto del patio     |                                              | muro bajo (g150-200)
   -----|------------|--------------------------------------------|----------------------------------------------|---------------------------------------------
    2   | 148 – 470  | el bloque gris naciendo del canto de la     | el bloque saturando el cuadro, tapando la    | ZOOM-THROUGH · la cámara entra por la
        | (pisa 26)  | tarjeta, camX −330, luz sky fría            | ventana del vecino; camX −180 · camZ +42;    | ETIQUETA DE PRECIO ilegible del flanco
        |            |                                             | 20 escalones volt encendidos en el flanco    | (zoomThrough g430, dur 28)
   -----|------------|--------------------------------------------|----------------------------------------------|---------------------------------------------
    3   | 444 – 716  | salimos DENTRO del banco: ranura 1 vacía,   | la tarjeta del contrachapado colgada a la    | OCLUSIÓN DE MATERIA · la hoja de
        | (pisa 20)  | camX 0 · camZ +52 · primer filo volt en     | izquierda con su $6 encendido; camX +520 ·   | contrachapado (`V.paper`, lit 0.30) cruza
        |            | el precio                                   | camZ +84 · volt 28 %                         | el cuadro entero (SeamOcclude g676)
   -----|------------|--------------------------------------------|----------------------------------------------|---------------------------------------------
    4   | 696 – 1348 | detrás de la oclusión ya hay dos ranuras;   | dos tarjetas en fila + el duelo lana/espuma  | HERENCIA DE LUZ · el verde-voltio corre por
        | (pisa 20)  | camX +520 · camZ +84                        | apagándose; camX +1040 · camZ +150 · la      | el riel desde el precio de la lana hasta la
        |            |                                             | luz ya es volt 62 %                          | ranura 3 y enciende ahí el marco de los codos
   -----|------------|--------------------------------------------|----------------------------------------------|---------------------------------------------
    5   |1329 – 1676 | la ranura 3 se enciende ENTERA en volt (la  | cinco tarjetas colgadas, la 3 con el marco   | LA CÁMARA SIGUE · el travelling llega a la
        | (pisa 22)  | pieza clave); camX +1040 · camZ +152        | volt duro; camX +2080 · camZ +196 · cámara   | última ranura vacía y la tarjeta de los tacos
        |            |                                             | casi al nivel del banco                      | ya está subiendo dentro del mismo movimiento
   -----|------------|--------------------------------------------|----------------------------------------------|---------------------------------------------
    6   |1660 – 1802 | la sexta tarjeta subiendo (GRATIS);         | PLANO CASI MACRO sobre el canto laminado de  | → entrega a los planos sueltos: la sierra
        |  (cierre)  | camX +2600 · camZ +262                      | la hoja de contrachapado ocupando el ancho   | entra en el plano siguiente sobre ese mismo
        |            | el riel se CONTRAE (paso 520→210) y las     | del cuadro, FILO VERDE-VOLTIO del total      | canto. Luz `sky` fría + filo volt; ámbar
        |            | seis entran juntas: la cámara NO retrocede  | encendido en el borde; camZ +402             | de la ventana desenfocado al fondo
   ───────────────────────────────────────────────────────────────────────────────────────────── */
