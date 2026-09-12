// MovCientoVeintiseis.tsx — S8 · UN MOVIMIENTO CONTINUO de 62 s (1860 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 940,0.
//
// LA ESPINA: las cinco compras que suman ciento veintiseis dolares se hacen UNA vez, se pagan solas
// en cinco semanas — y la compra chica ENCOGE la compra grande: el tejado pasa de diez kilovatios a
// seis. El objeto que cruza LAS CUATRO FRONTERAS es EL TICKET DE LA FERRETERIA: una tira de papel
// termico que entra en blanco, gana una linea por compra (cada linea con la FOTO REAL del material
// adentro), llega a 126 y termina empujando los paneles fuera del tejado.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el exitTo del acto N                 ║
// ╠════╦════════════════════════════════════════╦══════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto         ║ SALE: encuadre + luz + objeto                ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 1  ║ CAM: viene de MovCeroDolares, media,   ║ CAM: z≈-118 y SIGUE acercandose por la        ║
// ║ g0 ║ siguiendo el contador que sube         ║      izquierda. No frena en la frontera.      ║
// ║    ║ (z≈-140, panX -8).                     ║ LUZ: keyFrom 0.44→0.47, int 0.86→0.94: el     ║
// ║    ║ LUZ: AMANECE — primera luz limpia de   ║      amanecer sigue abriendo.                 ║
// ║    ║ volt frontal (keyFrom 0.44, int 0.86). ║ MAT: EL DISCO DEL TEMPORIZADOR (las 24 horas  ║
// ║    ║ MAT: la bolsa de la ferreteria y el    ║      con la ventana de las 11 pm a las 5 am)  ║
// ║    ║ ticket en blanco saliendo de ella.     ║      crece y se vuelve LA TAPA DEL TANQUE.    ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 2  ║ CAM: z≈-118 avanzando, misma inercia.  ║ CAM: z≈-142, retrocediendo un pelo y girando  ║
// ║g200║ LUZ: amanecer abriendo (keyFrom 0.47). ║      hacia la derecha (ry sigue su curva).    ║
// ║    ║ MAT: el disco, ya TAPA DEL TANQUE, con ║ LUZ: keyFrom 0.47→0.50, int 0.94→0.99.        ║
// ║    ║ el aro recoloreado a steel; a su lado  ║ MAT: LA MANTA PLATEADA, que se despega del    ║
// ║    ║ entra el cilindro envuelto en la manta.║      tanque y CRUZA EL CUADRO entera.         ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 3  ║ CAM: z≈-142 con el giro ya empezado.   ║ CAM: z≈-96, subiendo (camDrop empieza a       ║
// ║g430║ LUZ: amanecer pleno de interior        ║      levantar el mundo hacia el techo).       ║
// ║    ║ (keyFrom 0.50, int 0.99).              ║ LUZ: keyFrom 0.50→0.54, int 0.99→1.05.        ║
// ║    ║ MAT: detras de la manta ya estaba el   ║ MAT: EL INTERRUPTOR de la regleta, apagado,   ║
// ║    ║ mueble del televisor con la regleta.   ║      se ESTIRA y se vuelve EL FILAMENTO.      ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 4  ║ CAM: z≈-96 subiendo, misma curva.      ║ CAM: SIGUE SUBIENDO y acelera (camDrop        ║
// ║g770║ LUZ: keyFrom 0.54, int 1.05.           ║      -14→+118, camTilt 0.4→3.6): el tejado.   ║
// ║    ║ MAT: el filamento, ya dentro del foco, ║ LUZ: keyFrom 0.54→0.50, cielo sky subiendo.   ║
// ║    ║ y la caja de los diez LED naciendo a   ║ MAT: la caja de focos SALE POR DELANTE del    ║
// ║    ║ su alrededor.                          ║      lente y EL TICKET, ya en 126, sube con   ║
// ║    ║                                        ║      la camara cruzando la frontera.          ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 5  ║ CAM: subiendo hacia el tejado, misma   ║ CAM: ALTA SOBRE EL TEJADO, el sistema         ║
// ║g1195║ curva (no se reinicia).               ║      encogiendo de diez a seis kilovatios     ║
// ║    ║ LUZ: amanecer, cielo sky entrando.     ║      (z≈-60, rx +6). Es el encuadre con el    ║
// ║    ║ MAT: el ticket completo (126) llegando ║      que abre MovCableSuicida.                ║
// ║    ║ al centro, y el tejado bajando a       ║ LUZ: AMANECER PLENO (volt frontal suave,      ║
// ║    ║ cuadro desde arriba.                   ║      cielo sky subiendo, floor 0.40).         ║
// ║    ║                                        ║ MAT: LA TEJA DEL TEJADO, con la fila de       ║
// ║    ║                                        ║      paneles ya retirada a 0,6.               ║
// ╚════╩════════════════════════════════════════╩══════════════════════════════════════════════╝
//
// COSTURAS — una por frontera, ninguna es un fundido ni un opacity que baja a 0:
//   g200  1→2  MATCH-SHAPE  — EL DISCO. La ventana redonda del temporizador (150 px, aro volt con
//                             sus 24 marcas de hora) NO se corta: crece a 470 px, el aro se
//                             recolorea a steel y las marcas se vuelven las costuras radiales de
//                             la tapa del tanque. El disco nuevo NACE exactamente sobre el disco
//                             viejo (misma x, misma y, mismo radio) con el material de la manta
//                             recortado a tope — a ese tamano son los dos un circulo metalico, y
//                             el relevo no se ve. La tarjeta del temporizador, mientras, se encoge
//                             y se va al riel del ticket.
//   g430  2→3  OCLUSION      — <SeamOcclude color={V.steel} lit={0.34}>: LA MANTA PLATEADA cruza el
//                             cuadro entera. Detras YA esta el mueble del televisor con la regleta
//                             (el fondo se cambia DURO bajo la materia, en el frame de cobertura
//                             total). lit 0.34 < 0.45: la manta llega a camara en sombra, no da
//                             flash blanco.
//   g770  3→4  MATCH-SHAPE  — EL INTERRUPTOR. El rectangulo chico de la regleta (46x20, ambar) se
//                             estira, gira y se vuelve EL FILAMENTO horizontal; sobre el filamento
//                             nace la ventana de la caja de focos, recortada a tope sobre UN bulbo
//                             (a ese tamano es el mismo punto de luz), y crece a 900x540. El
//                             filamento se apaga ambar y vuelve volt: el LED reemplaza al halogeno.
//   g1195 4→5  MATCH-MOVE   — LA CAMARA SUBE DEL FOCO AL TEJADO. gcam no corta: camDrop y camTilt
//                             siguen acelerando, el interior BAJA fuera de cuadro y el tejado ENTRA
//                             desde arriba con el mismo vector. La caja de focos sale por delante
//                             del lente (z +330) y el ticket, ya en 126, cruza la frontera subiendo.
//
// EL OBJETO QUE CRUZA TODAS LAS FRONTERAS: EL TICKET DE LA FERRETERIA. Entra en blanco (g0), gana
// la linea del temporizador (g54), la de la manta (g246), la de las regletas (g508), la de los focos
// (g838) y la del filtro y la cinta (g902) — cada linea con su FOTO REAL adentro —, llega a 126, se
// va al centro en el acto 5 y termina empujando los paneles fuera del tejado.
//
// ⏱ LOS ACTOS ESTAN ANCLADOS A LA LOCUCION REAL (transcript_cmeurgente_timed.txt), no a la
//    estimacion de la ficha: "manta termica" 945,8 s = g176 · "30 dolares" 948,0 s = g240 ·
//    "dos regletas" 954,4 s = g431 · "14 dolares" 956,4 s = g491 · "10 focos led" 965,8 s = g775 ·
//    "22 dolares" 967,1 s = g813 · "35 dolares" 969,1 s = g873 · "126 dolares" 980,1 s = g1202 ·
//    "98 con 80" 989,6 s = g1487 · "5 semanas" 995,8 s = g1673 · "580 en vez de 960" 1000,1 s =
//    g1803. Mismos cinco actos, mismos titulares, mismos objetos y mismas costuras que la ficha;
//    las fronteras caen donde la voz las pide.
//
// ⛔ CONTRATO: ningun acto envuelto en su propia Sequence · sin aleatorio de reloj ni de sistema (todo por rnd(k) y
// ⛔ por g) · sin position:fixed · sin filter:blur · rutas de asset SOLO literales y solo las de la
// ⛔ ficha · todo color por rgba()/light() · todo texto sobre <Bed>.
// ⚠️ El build puede montar el movimiento dentro de una Sequence: useCurrentFrame() es LOCAL. Todo
//    componente del Stage que razona en frames (`at`, `sheenAt`) se traduce con L().

import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, RoofPlane, SunField, Layers, Plane, MediaCard, Carousel3D, IconPng,
  Readout, SeamOcclude, Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1860;
// fronteras de acto — ancladas a la locucion real
const A2 = 200;
const A3 = 430;
const A4 = 770;
const A5 = 1195;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ── VENTANA: el marco de vidrio que RECORTA material real. Es la primitiva del movimiento:
//    la MISMA ventana que era el disco del temporizador se vuelve la tapa del tanque.
const Ventana: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number | string;
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
      border: `1px solid ${rgba(litColor, 0.3 * lit)}`,
      boxShadow: `0 ${Math.round(hh * 0.15)}px ${Math.round(hh * 0.24)}px ${rgba(V.ink0, 0.78)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.6)}, inset 0 1px 0 ${rgba(V.white, 0.26 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL dentro de la Ventana: la FOTO siempre (con recorte animado = nunca queda quieta) y el
//    CLIP encima mientras dura de verdad. `k` es el zoom de recorte (>=1: la foto siempre cubre).
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

// ── FONDO a sangre: la foto lejana del plano 1. Lleva `dy` propio para que en la frontera 4 el
//    interior BAJE fuera de cuadro y el tejado ENTRE desde arriba con el mismo vector (match-move).
const Fondo: React.FC<{ src: string; scale?: number; dim?: number; dy?: number; tint?: string; g: number }> = ({
  src, scale = 1.2, dim = 0.5, dy = 0, tint = V.volt, g,
}) => {
  const px = Math.sin(g / 121) * 8;
  return (
    <AbsoluteFill style={{
      transform: `translate3d(${px.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
      overflow: "hidden",
    }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: rgba(V.ink0, dim) }} />
      <AbsoluteFill style={{ background: rgba(tint, 0.05), mixBlendMode: "soft-light" }} />
    </AbsoluteFill>
  );
};

// ── EL ARO DE LAS 24 HORAS — esto SI es un grafico (el programa del temporizador), no un objeto
//    disfrazado. Va PEGADO al disco: sus marcas son las horas y la ventana apagada son las 11 pm
//    a las 5 am. En la frontera 1 el aro se recolorea a steel y las marcas se vuelven las costuras
//    radiales de la tapa del tanque: la misma geometria cambiando de rol.
const AroHoras: React.FC<{ d: number; volt: number; corte: number; g: number }> = ({ d, volt, corte, g }) => {
  const r = d / 2;
  const tono = light(clamp01(1 - volt), "volt", "steel");
  return (
    <div style={{
      position: "absolute", left: "50%", top: "50%", width: d, height: d,
      marginLeft: -r, marginTop: -r, borderRadius: "50%",
      border: `${(2 + 2 * volt).toFixed(1)}px solid ${rgba(tono, 0.34 + 0.42 * volt)}`,
      boxShadow: `0 0 ${Math.round(16 + 26 * volt)}px ${rgba(tono, 0.28 * volt)}, inset 0 0 ${Math.round(18 + 20 * (1 - volt))}px ${rgba(V.ink0, 0.6)}`,
    }}>
      {Array.from({ length: 24 }, (_, i) => {
        // la ventana apagada del temporizador: de las 23 a las 5
        const apagada = i >= 23 || i < 5;
        const larga = i % 6 === 0;
        const lat = 1 - corte;                       // corte: las marcas se vuelven costuras radiales
        const alto = lerp(larga ? 17 : 10, r * 0.86, corte);
        const ancho = lerp(larga ? 3.4 : 2, 1.1, corte);
        const c = apagada && volt > 0.4 ? V.sky : tono;
        const a = (apagada ? 0.22 : 0.62 + 0.3 * lat) * (0.34 + 0.66 * volt) + corte * 0.16;
        return (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "50%", width: ancho, height: alto,
            marginLeft: -ancho / 2,
            transformOrigin: "50% 0%",
            transform: `rotate(${i * 15}deg) translateY(${(r - alto - lerp(6, 0, corte)).toFixed(1)}px)`,
            background: rgba(c, a),
            boxShadow: !apagada && volt > 0.3 ? `0 0 8px ${rgba(c, 0.5 * volt)}` : "none",
            borderRadius: 1,
          }} />
        );
      })}
      {/* el sector apagado 23h→5h: la orden que le das al calentador */}
      <div style={{
        position: "absolute", inset: 4, borderRadius: "50%", opacity: 0.5 * volt,
        background: `conic-gradient(from ${(23 * 15 - 90).toFixed(0)}deg, ${rgba(V.sky, 0.34)} 0deg, ${rgba(V.sky, 0.34)} 90deg, rgba(0,0,0,0) 90deg)`,
      }} />
      {/* la aguja: recorre las horas y se detiene en la ventana apagada */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: 2.6, height: r * 0.68,
        marginLeft: -1.3, transformOrigin: "50% 100%", opacity: volt,
        transform: `translateY(${(-r * 0.68).toFixed(1)}px) rotate(${(180 + ((g / 3.1) % 360)).toFixed(1)}deg)`,
        background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.volt, 0.85)})`,
        boxShadow: `0 0 10px ${rgba(V.volt, 0.5)}`, borderRadius: 2,
      }} />
    </div>
  );
};

// ── LOS FANTASMAS: los pilotos de standby del mueble del televisor. Grafico puro (son puntos de
//    luz), y por eso van en AMBAR: en este video el ambar es el dinero que se va, no el peligro.
const Fantasmas: React.FC<{ on: number; vivo: number; g: number }> = ({ on, vivo, g }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: clamp01(on) }}>
      {Array.from({ length: 7 }, (_, i) => {
        const px = 28 + rnd(i * 4.3) * 46;
        const py = 52 + rnd(i * 9.7) * 26;
        const pulso = 0.6 + 0.4 * Math.sin(g / (7 + i * 2.1) + i);
        const a = vivo * (0.4 + 0.6 * pulso);
        const s = 7 + rnd(i * 2.2) * 5;
        return (
          <div key={i} style={{
            position: "absolute", left: `${px.toFixed(2)}%`, top: `${py.toFixed(2)}%`,
            width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, borderRadius: "50%",
            background: rgba(V.amber, 0.35 + 0.6 * a),
            boxShadow: `0 0 ${Math.round(8 + 22 * a)}px ${rgba(V.amber, 0.7 * a)}`,
          }} />
        );
      })}
    </div>
  );
};

// ── UNA LINEA DEL TICKET: chip con la FOTO REAL de la compra + concepto + precio.
const LineaTicket: React.FC<{
  photo: string; clip?: string; vid?: number; concepto: string; precio: string;
  dy: number; on: number; k: number; cx: number; cy: number; sheenAt: number;
}> = ({ photo, clip, vid = 0, concepto, precio, dy, on, k, cx, cy, sheenAt }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 11, height: 52, marginBottom: 10,
    opacity: clamp01(on), transform: `translateY(${dy.toFixed(1)}px)`,
  }}>
    <div style={{ position: "relative", width: 62, height: 44, flex: "0 0 auto" }}>
      <Ventana x={50} y={50} w={62} h={44} z={0} radius={3} lit={0.92} litColor={V.ink2}>
        <Mat photo={photo} clip={clip} vid={vid} w={62} h={44} k={k} cx={cx} cy={cy}
          lit={0.94} litColor={V.bone} sheenAt={sheenAt} />
      </Ventana>
    </div>
    <div style={{
      flex: 1, fontFamily: F_BODY, fontWeight: 700, fontSize: 19, lineHeight: 1.12,
      letterSpacing: 0.4, color: "#241F16", textTransform: "uppercase",
    }}>{concepto}</div>
    <div style={{
      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 27, color: "#1B1710", lineHeight: 1,
    }}>{precio}</div>
  </div>
);

// ── EL TICKET DE LA FERRETERIA — el objeto que cruza LAS CUATRO fronteras. Papel termico real:
//    crece hacia abajo, cada linea entra deslizando desde el borde (geometria, no un fundido) y el
//    total sube 25 → 55 → 69 → 91 → 126.
const Ticket: React.FC<{ g: number; x: number; y: number; h: number; s: number; ry: number; total: number; pulso: number }> = ({
  g, x, y, h, s, ry, total, pulso,
}) => {
  const w = 322;
  const deriva = Math.sin(g / 47) * 2.2;
  const linea = (at: number) => ({
    on: ip(g, [at - 2, at + 9], [0, 1]),
    dy: ipe(g, [at, at + 22], [40, 0], Easing.out(Easing.cubic)),
    sheen: at + 16,
  });
  const l1 = linea(54);
  const l2 = linea(246);
  const l3 = linea(508);
  const l4 = linea(838);
  const l5 = linea(902);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2,
      transform: `rotateY(${ry.toFixed(2)}deg) rotate(${(-2.1 + Math.sin(g / 71) * 0.5).toFixed(2)}deg) scale(${s.toFixed(3)}) translateY(${deriva.toFixed(2)}px)`,
      transformStyle: "preserve-3d",
    }}>
      {/* el papel: couche mate, con su sombra de contacto y su reflejo de amanecer */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", borderRadius: 2,
        background: `linear-gradient(172deg, ${rgba(V.paper, 0.99)} 0%, ${rgba(V.paper, 0.94)} 62%, ${rgba(V.bone, 0.88)} 100%)`,
        boxShadow: `0 ${Math.round(h * 0.1)}px ${Math.round(h * 0.16)}px ${rgba(V.ink0, 0.72)}, 0 3px 14px ${rgba(V.ink0, 0.6)}`,
        padding: "16px 16px 0",
      }}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 18, letterSpacing: 3.4,
          color: "#3A342A", textTransform: "uppercase", marginBottom: 4,
        }}>Ferreteria · material</div>
        <div style={{ height: 2, background: "repeating-linear-gradient(90deg, #3A342A 0 6px, rgba(0,0,0,0) 6px 11px)", opacity: 0.5, marginBottom: 12 }} />
        <LineaTicket photo="img/cmeurgente/cmeu_temporizador_caja.jpg" concepto="Temporizador" precio="25"
          dy={l1.dy} on={l1.on} k={1.9} cx={48} cy={46} sheenAt={l1.sheen} />
        <LineaTicket photo="img/cmeurgente/cmeu_manta.jpg" concepto="Manta termica" precio="30"
          dy={l2.dy} on={l2.on} k={2.0} cx={54} cy={48} sheenAt={l2.sheen} />
        <LineaTicket photo="img/cmeurgente/cmeu_regleta.jpg" concepto="2 regletas" precio="14"
          dy={l3.dy} on={l3.on} k={2.1} cx={46} cy={52} sheenAt={l3.sheen} />
        <LineaTicket photo="img/cmeurgente/cmeu_focos_led.jpg" concepto="10 focos led" precio="22"
          dy={l4.dy} on={l4.on} k={1.95} cx={50} cy={48} sheenAt={l4.sheen} />
        <LineaTicket photo="img/cmeurgente/cmeu_manta.jpg" clip="broll/cmeurgente/cmeu_manta_mov.mp4"
          vid={g >= 900 && g < 1040 ? 1 : 0}
          concepto="Filtro + cinta" precio="35"
          dy={l5.dy} on={l5.on} k={2.3} cx={58} cy={44} sheenAt={l5.sheen} />
        {/* el total: lo unico que crece en el papel */}
        <div style={{
          position: "absolute", left: 16, right: 16, bottom: 22,
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          borderTop: "2px solid rgba(40,34,26,0.42)", paddingTop: 9,
          opacity: ip(g, [40, 62], [0, 1]),
        }}>
          <span style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 21, letterSpacing: 2.6, color: "#3A342A" }}>TOTAL</span>
          <span style={{
            fontFamily: F_DISPLAY, fontWeight: 800, lineHeight: 0.9,
            fontSize: Math.round(42 + 26 * pulso), color: "#17130D",
            textShadow: pulso > 0.02 ? `0 0 ${Math.round(30 * pulso)}px ${rgba(V.amber, 0.7 * pulso)}` : "none",
          }}>{Math.round(total)}</span>
        </div>
      </div>
      {/* el borde dentado del papel termico */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: h - 9, height: 12,
        background: `repeating-linear-gradient(135deg, ${rgba(V.bone, 0.95)} 0 7px, rgba(0,0,0,0) 7px 14px)`,
        opacity: 0.9,
      }} />
      {/* el amanecer rebotando en el papel */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 2, pointerEvents: "none",
        background: `linear-gradient(122deg, rgba(255,255,255,0) 34%, ${rgba(V.white, 0.3)} 49%, rgba(255,255,255,0) 63%)`,
        mixBlendMode: "screen", opacity: 0.5 + 0.3 * Math.sin(g / 103),
      }} />
    </div>
  );
};

// ── LA TRAZA: la linea ambar que lleva el precio del objeto al ticket. Grafico puro.
const Traza: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number }> = ({ x1, y1, x2, y2, p }) => {
  if (p <= 0.01 || p >= 0.995) return null;
  const q = Math.sin(clamp01(p) * Math.PI);
  const dx = (x2 - x1) * 19.2;
  const dy = (y2 - y1) * 10.8;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div style={{
      position: "absolute", left: `${x1}%`, top: `${y1}%`, width: len, height: 3,
      transformOrigin: "0% 50%", transform: `rotate(${ang.toFixed(2)}deg) scaleX(${(0.15 + 0.85 * clamp01(p * 1.4)).toFixed(3)})`,
      background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.amber, 0.72 * q)} 55%, ${rgba(V.white, 0.5 * q)})`,
      boxShadow: `0 0 14px ${rgba(V.amber, 0.4 * q)}`, borderRadius: 3,
    }} />
  );
};

// ── LA BARRA DE LAS CINCO SEMANAS: 126 dolares divididos por lo que la casa deja de pagar.
const CincoSemanas: React.FC<{ on: number; llena: number }> = ({ on, llena }) => {
  if (on <= 0.01) return null;
  const w = 660;
  return (
    <div style={{
      position: "absolute", left: "50%", top: "76%", width: w, marginLeft: -w / 2,
      opacity: clamp01(on),
    }}>
      <div style={{ display: "flex", gap: 9 }}>
        {Array.from({ length: 5 }, (_, i) => {
          const q = clamp01(llena * 5 - i);
          return (
            <div key={i} style={{
              flex: 1, height: 34, borderRadius: 4,
              background: `linear-gradient(180deg, ${rgba(V.amber, 0.22 + 0.62 * q)} 0%, ${rgba(V.amber, 0.06 + 0.2 * q)} 100%)`,
              border: `1px solid ${rgba(V.amber, 0.24 + 0.5 * q)}`,
              boxShadow: q > 0.4 ? `0 0 ${Math.round(10 + 24 * q)}px ${rgba(V.amber, 0.3 * q)}` : "none",
            }} />
          );
        })}
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: 8,
        fontFamily: F_BODY, fontWeight: 700, fontSize: 18, letterSpacing: 2.4,
        color: rgba(V.white, 0.6), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
      }}>
        <span>SEMANA 1</span><span>SEMANA 5</span>
      </div>
    </div>
  );
};

export const MovCientoVeintiseis: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // el build puede montar el movimiento dentro de una Sequence: el frame local no es el global.
  const lFrame = useCurrentFrame();
  const off = (gFrame ?? lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  // red de seguridad: si el build no manda un gFrame usable, arranco en la cabecera del acto.
  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame as number)
    ? (gFrame as number)
    : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CAMARA — UNA sola, funcion de g, que NUNCA vuelve a cero ═══════════════════════════
  // entra en z -140 con el pan a la izquierda ya empezado (lo que deja MovCeroDolares) y termina
  // ALTA sobre el tejado (z -60, rx +6), que es con lo que abre MovCableSuicida.
  const camB = gcam(g, { z0: -140, z1: -60, panX: -8, panY: -22, ry: 3.4, rx: 2.2, dur: END });
  const camZ = ip(g,
    [0, 120, 200, 330, 430, 590, 770, 940, 1080, 1195, 1330, 1520, 1700, 1860],
    [0, 14, 22, 6, -2, 18, 44, 26, 8, -34, -6, 26, 34, 6]);
  // la SUBIDA de la frontera 4: el mundo baja porque la camara sube al tejado
  const camDrop = ip(g, [0, 430, 770, 1080, 1195, 1330, 1500, 1700, 1860],
    [0, -3, -8, -14, 26, 118, 138, 146, 150]);
  const camTilt = ip(g, [0, 430, 770, 1080, 1195, 1330, 1560, 1860],
    [0, 0.1, 0.25, 0.4, 1.3, 2.7, 3.4, 3.8]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg)`;
  // la deriva de la camara, replicada floja para el HUD: el texto no queda pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.42).toFixed(2)}px, ${(by * 0.42).toFixed(2)}px)`;

  // ══ LA LUZ — AMANECE: volt frontal suave que se abre y un cielo `sky` que sube ════════════
  const keyFrom = ip(g, [0, 200, 430, 770, 1080, 1195, 1500, 1860],
    [0.44, 0.47, 0.50, 0.54, 0.54, 0.50, 0.46, 0.44]);
  const inten = ip(g, [0, 200, 430, 770, 1195, 1430, 1700, 1860],
    [0.86, 0.94, 0.99, 1.05, 1.02, 1.06, 1.10, 1.12]);
  const floor = ip(g, [0, 430, 1080, 1195, 1500, 1860], [0.58, 0.55, 0.52, 0.48, 0.43, 0.40]);
  const tintA = light(ip(g, [0, 770, 1195, 1500, 1860], [0.04, 0.14, 0.26, 0.38, 0.48]), "volt", "sky");
  const tintB = light(ip(g, [0, 900, 1195, 1500, 1860], [0, 0.16, 0.34, 0.72, 1]), "amber", "sky");

  // ══ EL TICKET — el objeto que cruza las cuatro fronteras ══════════════════════════════════
  const tkTotal = ip(g, [40, 54, 74, 246, 266, 508, 528, 838, 858, 902, 926, 1202, 1226],
    [0, 0, 25, 25, 55, 55, 69, 69, 91, 91, 126, 126, 126]);
  const tkH = ip(g, [0, 54, 76, 246, 268, 508, 530, 838, 860, 902, 924],
    [148, 148, 210, 210, 272, 272, 334, 334, 396, 396, 458]);
  const tkX = ip(g, [0, 200, 430, 770, 1080, 1195, 1330, 1470, 1660, 1860],
    [86.5, 85, 84.5, 85.5, 86, 79, 60, 30, 21, 17.5]);
  const tkY = ip(g, [0, 430, 1080, 1195, 1330, 1470, 1660, 1860],
    [55, 52, 50, 46, 44, 47, 56, 63]);
  const tkS = ip(g, [0, 200, 1080, 1195, 1330, 1470, 1700, 1860],
    [0.86, 0.92, 0.94, 1.0, 1.14, 1.26, 1.08, 0.94]);
  const tkRy = ip(g, [0, 430, 1080, 1330, 1470, 1860], [-15, -13, -14, -8, -4, -7]);
  // el pulso del total: late cuando cae una linea y cuando la voz dice "ciento veintiseis"
  const tkPulso = Math.max(
    ip(g, [70, 82, 104], [0, 1, 0]) * 0.5,
    ip(g, [262, 274, 296], [0, 1, 0]) * 0.5,
    ip(g, [524, 536, 558], [0, 1, 0]) * 0.5,
    ip(g, [854, 866, 888], [0, 1, 0]) * 0.5,
    ip(g, [920, 936, 962], [0, 1, 0]) * 0.7,
    ip(g, [1198, 1224, 1310, 1400], [0, 1, 1, 0.22]),
  );

  // ══ ACTO 1 — EL TEMPORIZADOR. La tarjeta grande y el DISCO que se va a volver la tapa. ════
  const kT = [0, 26, 96, 170, 200, 232, 268, 300];
  const wT = ip(g, kT, [980, 1006, 1010, 940, 560, 300, 190, 176]);
  const hT = ip(g, kT, [590, 604, 606, 566, 336, 182, 116, 108]);
  const xT = ip(g, kT, [44, 43.5, 43, 41, 32, 22, 15.5, 14]);
  const yT = ip(g, kT, [47, 47, 47, 47.5, 50, 55, 60, 62]);
  const zT = ip(g, kT, [10, 14, 16, 20, -40, -110, -170, -180]);
  const ryT = ip(g, kT, [6, 4.6, 3.4, 2.4, 8, 15, 19, 20]);
  const litT = ip(g, kT, [0.62, 1, 1, 1, 0.9, 0.66, 0.44, 0.4]);
  const opT = Math.min(ip(g, [0, 14], [0, 1]), ip(g, [292, 316], [1, 0]));
  const kbT = Math.max(1.05, ip(g, [0, 96, 170, 200, 300], [1180, 1150, 1090, 700, 260]) / Math.max(40, wT));

  // EL DISCO — la ventana redonda. Vive del g44 al g560: NACE como el disco del temporizador y
  // MUERE como la tapa del tanque. Es la costura 1 entera, en una sola forma.
  const kD = [44, 92, 150, 176, 200, 232, 300, 430, 470, 540];
  const dD = ip(g, kD, [150, 152, 152, 154, 296, 404, 470, 452, 420, 300]);
  const xD = ip(g, kD, [63, 63, 63, 63, 60, 55.5, 50.5, 47, 44, 36]);
  const yD = ip(g, kD, [37, 37, 37.2, 37.4, 39, 41.5, 44, 45, 45, 47]);
  const zD = ip(g, kD, [70, 70, 70, 72, 66, 50, 34, 26, 14, -60]);
  const voltD = ip(g, [44, 74, 170, 208, 250], [0, 1, 1, 0.5, 0]);      // aro volt → aro steel
  const corteD = ip(g, [176, 210, 268], [0, 0.35, 1]);                   // marcas → costuras radiales
  const opD = Math.min(ip(g, [40, 56], [0, 1]), ip(g, [510, 552], [1, 0]));
  // el disco NUEVO (la tapa) nace EXACTAMENTE sobre el viejo: mismo centro, mismo radio.
  const tapaOn = g >= 176 ? 1 : 0;
  const kbD = Math.max(1.06, ip(g, [176, 232, 300, 430, 540], [560, 700, 780, 760, 700]) / Math.max(40, dD));

  // ══ ACTO 2 — LA MANTA. El cilindro envuelto entra por geometria a la derecha del disco. ═══
  const kM = [176, 214, 268, 330, 400, 430, 452];
  const wM = ip(g, kM, [120, 620, 880, 900, 900, 880, 700]);
  const hM = ip(g, kM, [420, 470, 520, 528, 528, 520, 470]);
  const xM = ip(g, kM, [76, 74, 71, 70.5, 70, 70, 72]);
  const yM = ip(g, kM, [45, 45, 45.5, 46, 46.5, 47, 48]);
  const zM = ip(g, kM, [-30, -14, 4, 10, 12, 8, -40]);
  const ryM = ip(g, kM, [-16, -12, -8.5, -7.5, -7, -7, -10]);
  const litM = ip(g, kM, [0.4, 0.86, 1, 1, 1, 0.98, 0.7]);
  const opM = Math.min(ip(g, [172, 190], [0, 1]), ip(g, [424, 442], [1, 0]));
  const kbM = Math.max(1.05, ip(g, [176, 268, 400, 452], [1320, 1180, 1120, 1080]) / Math.max(40, wM));
  // la CINTA DE ALUMINIO en primer plano: el clip pasa por DELANTE del lente en el acto 2
  const cintaOn = g >= 296 && g < 432 ? 1 : 0;
  const cintaX = ip(g, [296, 366, 432], [118, 62, 8]);
  const cintaZ = ip(g, [296, 366, 432], [180, 268, 200]);
  const cintaOp = ip(g, [296, 320, 400, 430], [0, 1, 1, 0.55]);

  // ══ ACTO 3 — LAS DOS REGLETAS. Dos encuadres del mismo material = dos regletas. ═══════════
  const kR = [430, 468, 520, 640, 700, 744, 770, 800];
  const wR = ip(g, kR, [1120, 1040, 960, 940, 900, 620, 300, 150]);
  const hR = ip(g, kR, [650, 610, 566, 556, 536, 372, 182, 96]);
  const xR = ip(g, kR, [50, 46, 42, 41, 40, 33, 24, 18]);
  const yR = ip(g, kR, [48, 48, 48.5, 49, 49, 52, 57, 61]);
  const zR = ip(g, kR, [-30, 6, 22, 26, 24, -40, -130, -190]);
  const ryR = ip(g, kR, [-3, 1.4, 3.4, 3.8, 4, 10, 17, 21]);
  const litR = ip(g, kR, [0.5, 0.96, 1, 1, 1, 0.86, 0.56, 0.4]);
  const opR = Math.min(ip(g, [428, 440], [0, 1]), ip(g, [792, 816], [1, 0]));
  const kbR = Math.max(1.05, ip(g, [430, 520, 700, 800], [1360, 1240, 1200, 340]) / Math.max(40, wR));
  // la SEGUNDA regleta (la del escritorio de arriba): mismo material, otro recorte y otra luz
  const r2On = g >= 588 && g < 762 ? 1 : 0;
  const r2X = ip(g, [588, 640, 720, 762], [116, 80, 79, 118]);
  const r2Y = ip(g, [588, 720, 762], [26, 27, 27]);
  const r2Op = ip(g, [588, 616, 736, 760], [0, 1, 1, 0]);
  // los fantasmas: viven hasta que el dedo aprieta el interruptor
  const fanOn = ip(g, [470, 500, 756, 776], [0, 1, 1, 0]);
  const fanVivo = ip(g, [690, 700, 716, 730], [1, 1, 0.16, 0]);

  // EL INTERRUPTOR → EL FILAMENTO (costura 3). Una sola forma que se estira y cambia de rol.
  const kI = [640, 700, 726, 770, 806, 850, 890];
  const wI = ip(g, kI, [46, 46, 52, 132, 168, 150, 118]);
  const hI = ip(g, kI, [20, 20, 17, 8, 5.4, 4.6, 4]);
  const xI = ip(g, kI, [33, 33, 35.5, 44, 49, 50, 50.4]);
  const yI = ip(g, kI, [56, 56, 54, 48, 45, 44.2, 44]);
  const rotI = ip(g, kI, [-6, -6, -4, 3, 6, 4, 2]);
  const calorI = ip(g, [640, 700, 726, 782, 830, 878], [0, 0, 0.4, 1, 0.7, 0]);  // ambar del halogeno
  const ledI = ip(g, [806, 852, 900], [0, 0.7, 1]);                              // volt del LED
  const opI = Math.min(ip(g, [636, 652], [0, 1]), ip(g, [872, 902], [1, 0]));

  // ══ ACTO 4 — LOS DIEZ FOCOS. La caja NACE sobre el filamento y crece. ═════════════════════
  const kF = [744, 770, 812, 880, 1000, 1080, 1140, 1195, 1250];
  const wF = ip(g, kF, [130, 260, 700, 900, 916, 940, 1080, 1340, 1560]);
  const hF = ip(g, kF, [78, 156, 420, 540, 550, 564, 648, 804, 936]);
  const xF = ip(g, kF, [45, 46, 48, 49, 49.5, 50, 51, 54, 60]);
  const yF = ip(g, kF, [47.5, 47, 46.5, 46, 46, 46.5, 52, 78, 128]);
  const zF = ip(g, kF, [30, 34, 30, 24, 22, 26, 90, 250, 330]);
  const ryF = ip(g, kF, [0, -0.6, -1.8, -2.6, -3, -3.4, -5, -9, -13]);
  const rxF = ip(g, kF, [0, 0, 0, 0, 0, 0, -3, -10, -16]);
  const litF = ip(g, kF, [0.5, 0.8, 1, 1, 1, 1, 0.96, 0.72, 0.44]);
  const opF = Math.min(ip(g, [740, 756], [0, 1]), ip(g, [1230, 1268], [1, 0]));
  const kbF = Math.max(1.05, ip(g, [744, 812, 880, 1080, 1250], [1180, 1160, 1120, 1100, 1700]) / Math.max(40, wF));
  const vidF = g < 860 ? 0 : ip(g, [880, 1010, 1032], [1, 1, 0]);
  // los DIEZ focos: se cuentan encendiendose de a uno (grafico puro)
  const diezOn = ip(g, [820, 848, 1130, 1176], [0, 1, 1, 0]);
  const diezN = ip(g, [848, 1000], [0, 10]);

  // ══ ACTO 5 — EL TEJADO ENCOGE. RoofPlane de 1 a 0,6 = de diez kilovatios a seis. ═════════
  const roofDy = ipe(g, [1100, 1330], [-1460, 0], Easing.out(Easing.cubic));
  const interiorDy = ipe(g, [1100, 1330], [0, 1520], Easing.out(Easing.cubic));
  const roofOn = g >= 1096 ? 1 : 0;
  const panels = ip(g, [1660, 1720, 1790, 1856], [1, 1, 0.72, 0.6]);
  const roofLit = ip(g, [1180, 1330, 1560, 1860], [0.24, 0.8, 0.96, 1]);
  const kwSistema = ip(g, [1660, 1720, 1790, 1856], [10, 10, 7.2, 6]);
  // el carrusel de LAS CINCO COMPRAS: cuatro fotos y el clip de la cinta, orbitando detras
  const carOn = g >= 1236 && g < 1580 ? 1 : 0;
  const carSpin = ip(g, [1236, 1580], [0.02, 0.46]);

  // el empujon del ticket contra los paneles: la compra chica encoge la compra grande
  const empuje = ip(g, [1690, 1730, 1800, 1860], [0, 1, 1, 0.7]);

  // ══ FONDOS — el interior se cambia DURO bajo la manta (frontera 2), y en la frontera 4 el
  //    interior BAJA y el tejado ENTRA con el mismo vector (nada se funde) ═══════════════════
  const fondoTaller = g < A3;

  // ══ CIFRAS Y TEXTOS ══════════════════════════════════════════════════════════════════════
  const kwhMes = ip(g, [1262, 1310, 1350], [0, 152, 190]);
  const dolarMes = ip(g, [1490, 1540, 1576], [0, 74.2, 98.8]);
  const semanas = ip(g, [1596, 1700], [0, 1]);

  const t1 = ip(g, [30, 52, 174, 196], [0, 1, 1, 0]);
  const t2 = ip(g, [222, 244, 396, 418], [0, 1, 1, 0]);
  const t3 = ip(g, [462, 484, 668, 690], [0, 1, 1, 0]);
  const t3b = ip(g, [698, 716, 752, 768], [0, 1, 1, 0]);
  const t4a = ip(g, [790, 810, 858, 876], [0, 1, 1, 0]);
  const t4b = ip(g, [892, 914, 1156, 1178], [0, 1, 1, 0]);
  const t5a = ip(g, [1210, 1234, 1400, 1424], [0, 1, 1, 0]);
  const t5b = ip(g, [1590, 1612, 1698, 1716], [0, 1, 1, 0]);
  const t5c = ip(g, [1734, 1758], [0, 1]);

  // las trazas del precio hacia el ticket (una por compra)
  const trz = [
    { x1: 50, y1: 52, p: ip(g, [30, 54], [0, 1]) },
    { x1: 70, y1: 46, p: ip(g, [222, 246], [0, 1]) },
    { x1: 42, y1: 49, p: ip(g, [484, 508], [0, 1]) },
    { x1: 49, y1: 46, p: ip(g, [814, 838], [0, 1]) },
    { x1: 49, y1: 46, p: ip(g, [878, 902], [0, 1]) },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMOSFERA: se monta UNA vez y no se remonta nunca; solo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ EL ESPACIO 3D — planos con parallax propio, bajo UNA sola camara ══════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · el fondo lejano. Cambia DURO bajo la manta de la frontera 2. ---------- */}
        <Plane z={-700}>
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${interiorDy.toFixed(1)}px)` }}>
            {fondoTaller ? (
              <Fondo src="img/cmeurgente/cmeu_temporizador_caja.jpg" g={g}
                scale={ip(g, [0, 430], [1.34, 1.24])}
                dim={ip(g, [0, 120, 430], [0.62, 0.7, 0.74])} tint={V.volt} />
            ) : (
              <Fondo src="img/cmeurgente/cmeu_regleta.jpg" g={g}
                scale={ip(g, [430, 1195], [1.36, 1.22])}
                dim={ip(g, [430, 770, 1195], [0.76, 0.72, 0.7])} tint={V.volt} />
            )}
          </div>
        </Plane>

        {/* PLANO 1b · EL TEJADO AL AMANECER — entra desde arriba con el mismo vector ------ */}
        {roofOn > 0 && (
          <Plane z={-680}>
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${roofDy.toFixed(1)}px)` }}>
              <Fondo src="img/cmeurgente/cmeu_tejado_seis.jpg" g={g}
                scale={ip(g, [1100, 1500, 1860], [1.3, 1.22, 1.16])}
                dim={ip(g, [1100, 1330, 1600, 1860], [0.62, 0.48, 0.4, 0.34])} tint={V.sky} />
            </div>
          </Plane>
        )}

        {/* PLANO 2 · el aire: rejilla de profundidad que respira con la luz --------------- */}
        <Plane z={-430}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.6).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [0, 160, 1080, 1330], [0.06, 0.24, 0.24, 0.05]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.09)} 0 1px, rgba(0,0,0,0) 1px 108px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.06)} 0 1px, rgba(0,0,0,0) 1px 108px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO 3 · EL BANCO DE TRABAJO (actos 1-4) y EL TEJADO (acto 5) ----------------- */}
        {g < 1330 && (
          <PadPlane y={ip(g, [0, 770, 1195, 1330], [78, 80, 96, 132])} w={1520} h={340} rx={62}
            lit={ip(g, [0, 200, 1080, 1195, 1330], [0.7, 0.92, 0.92, 0.6, 0.1])} z={-160} />
        )}
        {g >= 1150 && (
          <RoofPlane y={ip(g, [1150, 1330, 1600, 1860], [-58, 56, 60, 62])} w={1500} h={340} rx={54}
            lit={roofLit} z={-190} panels={panels} />
        )}

        {/* PLANO 4 · ACTO 1 — LA TARJETA DEL TEMPORIZADOR (material real) ----------------- */}
        {opT > 0.01 && (
          <Plane z={0}>
            <Ventana x={xT} y={yT} w={wT} h={hT} z={zT} ry={ryT} radius={14}
              lit={litT} litColor={V.volt} opacity={opT}>
              <Mat photo="img/cmeurgente/cmeu_temporizador_caja.jpg" w={wT} h={hT} k={kbT}
                cx={50 + Math.sin(g / 250) * 3.2} cy={50 + Math.cos(g / 300) * 2.4}
                lit={litT} litColor={V.volt} sheenAt={L(30)} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 16px 11px",
                opacity: ip(g, [64, 88, 176, 198], [0, 1, 1, 0]),
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 58%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 2.2,
                color: V.white, textTransform: "uppercase",
              }}>Compra uno · el temporizador</div>
            </Ventana>
          </Plane>
        )}

        {/* PLANO 5 · EL DISCO — costura 1 en una sola forma: reloj de 24 horas → tapa ---- */}
        {opD > 0.01 && (
          <Plane z={0}>
            <div style={{
              position: "absolute", left: `${xD}%`, top: `${yD}%`, width: dD, height: dD,
              marginLeft: -dD / 2, marginTop: -dD / 2,
              transform: `translateZ(${zD.toFixed(1)}px)`, opacity: opD,
              transformStyle: "preserve-3d",
            }}>
              {/* el disco viejo: la cara del temporizador */}
              <Ventana x={50} y={50} w={dD} h={dD} z={0} radius="50%"
                lit={0.5 + 0.5 * voltD} litColor={light(clamp01(1 - voltD), "volt", "steel")}
                opacity={ip(g, [176, 236], [1, 0.001])}>
                <Mat photo="img/cmeurgente/cmeu_temporizador_caja.jpg" w={dD} h={dD}
                  k={Math.max(1.06, 640 / Math.max(40, dD))} cx={49} cy={44}
                  lit={0.9} litColor={V.volt} sheenAt={L(58)} />
              </Ventana>
              {/* la TAPA DEL TANQUE: nace EXACTO sobre el disco viejo, mismo centro y radio */}
              {tapaOn > 0 && (
                <Ventana x={50} y={50} w={dD} h={dD} z={0} radius="50%"
                  lit={0.86} litColor={V.steel} opacity={ip(g, [176, 232], [0.001, 1])}>
                  <Mat photo="img/cmeurgente/cmeu_manta.jpg" w={dD} h={dD} k={kbD}
                    cx={ip(g, [176, 300, 540], [56, 52, 50]) + Math.sin(g / 260) * 1.6}
                    cy={ip(g, [176, 300, 540], [42, 47, 49])}
                    lit={0.9} litColor={V.steel} sheenAt={L(240)} />
                </Ventana>
              )}
              <AroHoras d={dD} volt={voltD} corte={corteD} g={g} />
            </div>
          </Plane>
        )}

        {/* PLANO 6 · ACTO 2 — EL TANQUE ENVUELTO (foto) + LA CINTA (clip por delante) ---- */}
        {opM > 0.01 && (
          <Plane z={0}>
            <Ventana x={xM} y={yM} w={wM} h={hM} z={zM} ry={ryM} radius={12}
              lit={litM} litColor={V.steel} opacity={opM}>
              <Mat photo="img/cmeurgente/cmeu_manta.jpg" clip="broll/cmeurgente/cmeu_manta_mov.mp4"
                vid={g < 214 ? 0 : ip(g, [232, 356, 380], [1, 1, 0])}
                w={wM} h={hM} k={kbM}
                cx={50 + Math.sin(g / 240) * 3} cy={50 + Math.cos(g / 290) * 2.2}
                lit={litM} litColor={V.steel} sheenAt={L(240)} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 16px 11px",
                opacity: ip(g, [258, 282, 396, 418], [0, 1, 1, 0]),
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 58%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 2.2,
                color: V.white, textTransform: "uppercase",
              }}>Compra dos · la manta termica</div>
            </Ventana>
          </Plane>
        )}
        {/* LA CINTA DE ALUMINIO pasa POR DELANTE del lente: primer plano real (z +180…+268) */}
        {cintaOn > 0 && (
          <Plane z={0}>
            <Ventana x={cintaX} y={ip(g, [296, 366, 432], [62, 58, 63])} w={470} h={296}
              z={cintaZ} ry={ip(g, [296, 432], [-22, 20])} rot={ip(g, [296, 432], [4, -5])}
              radius={12} lit={0.94} litColor={V.steel} opacity={cintaOp}>
              <Mat photo="img/cmeurgente/cmeu_manta.jpg" clip="broll/cmeurgente/cmeu_manta_mov.mp4"
                vid={ip(g, [300, 424, 440], [1, 1, 0])} w={470} h={296} k={1.5}
                cx={ip(g, [296, 432], [42, 58])} cy={52} lit={0.94} litColor={V.steel} sheenAt={L(326)} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 7 · ACTO 3 — LAS DOS REGLETAS (mismo material, dos encuadres) ----------- */}
        {opR > 0.01 && (
          <Plane z={0}>
            <Ventana x={xR} y={yR} w={wR} h={hR} z={zR} ry={ryR} radius={12}
              lit={litR} litColor={V.volt} opacity={opR}>
              <Mat photo="img/cmeurgente/cmeu_regleta.jpg" w={wR} h={hR} k={kbR}
                cx={ip(g, [430, 640, 800], [44, 50, 52]) + Math.sin(g / 260) * 2.6}
                cy={ip(g, [430, 640, 800], [54, 50, 48])}
                lit={litR} litColor={V.volt} sheenAt={L(470)} />
              <Fantasmas on={fanOn} vivo={fanVivo} g={g} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 16px 11px",
                opacity: ip(g, [500, 524, 668, 690], [0, 1, 1, 0]),
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 58%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 2.2,
                color: V.white, textTransform: "uppercase",
              }}>Detras del mueble del televisor</div>
            </Ventana>
          </Plane>
        )}
        {r2On > 0 && (
          <Plane z={0}>
            <Ventana x={r2X} y={r2Y} w={382} h={252} z={-56} ry={-13} radius={10}
              lit={0.8} litColor={V.sky} opacity={r2Op}>
              <Mat photo="img/cmeurgente/cmeu_regleta.jpg" w={382} h={252} k={2.35}
                cx={68 + Math.sin(g / 210) * 2} cy={38} lit={0.8} litColor={V.sky} sheenAt={L(626)} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "22px 12px 9px",
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 21, letterSpacing: 1.9,
                color: V.white, textTransform: "uppercase",
              }}>El escritorio de arriba</div>
            </Ventana>
          </Plane>
        )}

        {/* PLANO 8 · ACTO 4 — LA CAJA DE LOS DIEZ FOCOS (nace sobre el filamento) -------- */}
        {opF > 0.01 && (
          <Plane z={0}>
            <Ventana x={xF} y={yF} w={wF} h={hF} z={zF} ry={ryF} rx={rxF} radius={12}
              lit={litF} litColor={V.volt} opacity={opF}>
              <Mat photo="img/cmeurgente/cmeu_focos_led.jpg" clip="broll/cmeurgente/cmeu_foco_mov.mp4"
                vid={vidF} w={wF} h={hF} k={kbF}
                cx={ip(g, [744, 812, 1080, 1250], [50, 50, 49, 46]) + Math.sin(g / 230) * 2.4}
                cy={ip(g, [744, 812, 1080, 1250], [45, 47, 50, 54])}
                lit={litF} litColor={V.volt} sheenAt={L(818)} />
              {/* LOS DIEZ: se cuentan encendiendose de a uno (grafico puro sobre la caja) */}
              {diezOn > 0.01 && (
                <div style={{
                  position: "absolute", left: "9%", right: "9%", bottom: "13%",
                  display: "flex", gap: 8, opacity: diezOn,
                }}>
                  {Array.from({ length: 10 }, (_, i) => {
                    const q = clamp01(diezN - i);
                    return (
                      <div key={i} style={{
                        flex: 1, height: Math.round(10 + 8 * (hF / 540)), borderRadius: 4,
                        background: rgba(V.volt, 0.1 + 0.66 * q),
                        border: `1px solid ${rgba(V.volt, 0.2 + 0.5 * q)}`,
                        boxShadow: q > 0.4 ? `0 0 ${Math.round(8 + 20 * q)}px ${rgba(V.volt, 0.42 * q)}` : "none",
                      }} />
                    );
                  })}
                </div>
              )}
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 16px 11px",
                opacity: ip(g, [824, 848, 1130, 1156], [0, 1, 1, 0]),
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.86) 58%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 2.2,
                color: V.white, textTransform: "uppercase",
              }}>Compra cuatro · diez focos led</div>
            </Ventana>
          </Plane>
        )}

        {/* PLANO 9 · EL INTERRUPTOR → EL FILAMENTO: costura 3, una sola forma ------------ */}
        {opI > 0.01 && (
          <Plane z={44}>
            <div style={{
              position: "absolute", left: `${xI}%`, top: `${yI}%`, width: wI, height: hI,
              marginLeft: -wI / 2, marginTop: -hI / 2, opacity: opI,
              transform: `rotate(${rotI.toFixed(2)}deg)`,
              borderRadius: Math.max(2, hI / 2),
              background: `linear-gradient(90deg, ${rgba(light(ledI, "amber", "volt"), 0.32 + 0.6 * Math.max(calorI, ledI))} 0%, ` +
                `${rgba(light(ledI, "white", "volt"), 0.45 + 0.5 * Math.max(calorI, ledI))} 50%, ` +
                `${rgba(light(ledI, "amber", "volt"), 0.32 + 0.6 * Math.max(calorI, ledI))} 100%)`,
              boxShadow: `0 0 ${Math.round(10 + 46 * Math.max(calorI, ledI))}px ${rgba(light(ledI, "amber", "volt"), 0.55 * Math.max(calorI, ledI))}, ` +
                `inset 0 1px 0 ${rgba(V.white, 0.4)}`,
              border: `1px solid ${rgba(light(ledI, "amber", "volt"), 0.4)}`,
            }} />
          </Plane>
        )}

        {/* PLANO 10 · EL CARRUSEL DE LAS CINCO COMPRAS (acto 5) -------------------------- */}
        {carOn > 0 && (
          <Plane z={-90} style={{ opacity: ip(g, [1236, 1276, 1520, 1576], [0, 0.9, 0.9, 0]) }}>
            <Carousel3D
              items={[
                { src: "img/cmeurgente/cmeu_temporizador_caja.jpg", kind: "photo", label: "Temporizador" },
                { src: "img/cmeurgente/cmeu_manta.jpg", kind: "photo", label: "Manta" },
                { src: "img/cmeurgente/cmeu_regleta.jpg", kind: "photo", label: "Regletas" },
                { src: "img/cmeurgente/cmeu_focos_led.jpg", kind: "photo", label: "Focos led" },
                { src: "broll/cmeurgente/cmeu_manta_mov.mp4", kind: "video", label: "Filtro y cinta" },
              ]}
              spin={carSpin} radius={760} cardW={330} cardH={206} y={24} focus={4} litColor={V.amber} />
          </Plane>
        )}

        {/* PLANO 11 · EL TICKET — el objeto que cruza las cuatro fronteras --------------- */}
        <Plane z={150}>
          <Ticket g={g} x={tkX} y={tkY} h={tkH} s={tkS} ry={tkRy} total={tkTotal} pulso={tkPulso} />
        </Plane>

        {/* PLANO 12 · ICONOS PNG como objetos de la escena, con su parallax -------------- */}
        {g >= 96 && g < 196 && (
          <Plane z={90}>
            <IconPng src="img/cmeurgente/cmeu_ic_reloj.png" x={70} y={64}
              size={ip(g, [96, 126], [76, 118])} z={0}
              opacity={ip(g, [96, 122, 172, 194], [0, 0.95, 0.95, 0])}
              rot={ip(g, [96, 194], [-9, 5])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 268 && g < 400 && (
          <Plane z={90}>
            <IconPng src="img/cmeurgente/cmeu_ic_calentador.png" x={30} y={26}
              size={ip(g, [268, 300], [80, 124])} z={0}
              opacity={ip(g, [268, 296, 372, 398], [0, 0.95, 0.95, 0])}
              rot={ip(g, [268, 398], [7, -4])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 620 && g < 756 && (
          <Plane z={90}>
            <IconPng src="img/cmeurgente/cmeu_ic_enchufe.png" x={64} y={72}
              size={ip(g, [620, 652], [74, 116])} z={0}
              opacity={ip(g, [620, 648, 728, 754], [0, 0.95, 0.95, 0])}
              rot={ip(g, [620, 754], [-6, 6])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 900 && g < 1060 && (
          <Plane z={90}>
            <IconPng src="img/cmeurgente/cmeu_ic_foco.png" x={22} y={28}
              size={ip(g, [900, 934], [76, 122])} z={0}
              opacity={ip(g, [900, 930, 1030, 1058], [0, 0.95, 0.95, 0])}
              rot={ip(g, [900, 1058], [9, -3])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1596 && g < 1720 && (
          <Plane z={90}>
            <IconPng src="img/cmeurgente/cmeu_ic_calendario.png" x={80} y={70}
              size={ip(g, [1596, 1628], [78, 124])} z={0}
              opacity={ip(g, [1596, 1624, 1692, 1718], [0, 0.95, 0.95, 0])}
              rot={ip(g, [1596, 1718], [-8, 4])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1700 && (
          <Plane z={90}>
            <IconPng src="img/cmeurgente/cmeu_ic_panelsolar.png" x={78} y={30}
              size={ip(g, [1700, 1740, 1860], [70, 124, 112])} z={0}
              opacity={ip(g, [1700, 1734], [0, 0.92])}
              rot={ip(g, [1700, 1860], [8, -3])} glow={V.ink0} />
          </Plane>
        )}
      </Layers>

      {/* ══════ LA FIRMA DEL VIDEO — las 24 horas y el sol que entra ══════════════════════ */}
      {g >= 1440 && (
        <SunField sun={7 / 24} from={9} use={0.22}
          on={ip(g, [1440, 1478, 1820, 1858], [0, 0.82, 0.82, 0.4])}
          y={90} w={1040} h={26} cycle={200} />
      )}

      {/* ══════ COSTURA · FRONTERA 2 (g430) — OCLUSION: LA MANTA PLATEADA cruza ══════════ */}
      <SeamOcclude at={L(414)} dur={32} color={V.steel} angle={-7} lit={0.34} />

      {/* ══════ HUD — texto y cifras en espacio de pantalla ══════════════════════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* LAS TRAZAS: el precio viajando del objeto al ticket */}
        {trz.map((t, i) => (
          <Traza key={i} x1={t.x1} y1={t.y1} x2={tkX} y2={tkY} p={t.p} />
        ))}

        {/* LOS PRECIOS de cada compra, en AMBAR (el dinero) */}
        {g >= 40 && g < 200 && (
          <Readout value="25" unit="USD" label="UNA SOLA VEZ" at={L(44)}
            x={62} y={70} size={ip(g, [44, 96, 200], [86, 104, 92])} color={V.amber} />
        )}
        {g >= 232 && g < 424 && (
          <Readout value="30" unit="USD" label="MEDIA HORA DE TRABAJO" at={L(236)}
            x={26} y={70} size={ip(g, [236, 300, 424], [86, 106, 96])} color={V.amber} />
        )}
        {g >= 494 && g < 690 && (
          <Readout value="14" unit="USD" label="LAS DOS JUNTAS" at={L(498)}
            x={73} y={62} size={ip(g, [498, 560, 690], [86, 104, 94])} color={V.amber} />
        )}
        {g >= 812 && g < 884 && (
          <Readout value="22" unit="USD" label="DIEZ FOCOS" at={L(816)}
            x={24} y={70} size={ip(g, [816, 858, 884], [84, 100, 94])} color={V.amber} />
        )}
        {g >= 882 && g < 1170 && (
          <Readout value="35" unit="USD" label="FILTRO Y CINTA" at={L(886)}
            x={24} y={70} size={ip(g, [886, 950, 1170], [84, 102, 94])} color={V.amber} />
        )}

        {/* ACTO 5 · LO QUE COMPRARON ESOS 126: los kilovatios hora y los dolares al mes */}
        {g >= 1258 && g < 1420 && (
          <div style={{ opacity: ip(g, [1258, 1280, 1392, 1418], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "76%", top: "50%", width: 460, height: 300,
              marginLeft: -230, marginTop: -150,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value={String(Math.round(kwhMes))} unit="kWh" label="MENOS, CADA MES"
              at={L(1262)} x={76} y={50} size={112} color={V.volt} />
          </div>
        )}
        {g >= 1484 && g < 1600 && (
          <div style={{ opacity: ip(g, [1484, 1506, 1574, 1598], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "72%", top: "52%", width: 520, height: 320,
              marginLeft: -260, marginTop: -160,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.84), rgba(8,9,6,0))",
            }} />
            <Readout value={dolarMes.toFixed(2).replace(".", ",")} unit="USD"
              label="AL MES, LOS DOS ESCALONES" at={L(1490)} x={72} y={52} size={104} color={V.amber} />
          </div>
        )}

        {/* LA BARRA DE LAS CINCO SEMANAS */}
        <CincoSemanas on={ip(g, [1586, 1612, 1706, 1724], [0, 1, 1, 0])} llena={semanas} />

        {/* EL SISTEMA QUE ENCOGE: de diez kilovatios a seis, empujado por el ticket */}
        {g >= 1668 && (
          <div style={{ opacity: ip(g, [1668, 1696], [0, 1]) }}>
            <div style={{
              position: "absolute", left: "68%", top: "27%", width: 560, height: 300,
              marginLeft: -280, marginTop: -150,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.8), rgba(8,9,6,0))",
            }} />
            <Readout value={kwSistema.toFixed(1).replace(".", ",")} unit="kW"
              label="EL SISTEMA QUE HACE FALTA" at={L(1672)} x={68} y={27} size={116} color={V.volt} />
            {/* el empujon: la flecha ambar del ticket contra los paneles */}
            <div style={{
              position: "absolute", left: "30%", top: "37%", width: ip(g, [1690, 1740, 1860], [40, 300, 262]),
              height: 4, borderRadius: 3, opacity: empuje,
              background: `linear-gradient(90deg, ${rgba(V.amber, 0.85)}, ${rgba(V.white, 0.5)})`,
              boxShadow: `0 0 18px ${rgba(V.amber, 0.45)}`,
            }} />
          </div>
        )}

        {/* ACTO 1 · EL TEMPORIZADOR */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "72%", opacity: t1, transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)` }}>
            <Bed w={690} pad={24}>
              <Kick color={V.volt}>Compra uno</Kick>
              <div style={{ height: 7 }} />
              <Head size={68}>EL TEMPORIZADOR</Head>
              <div style={{ height: 9 }} />
              <Body size={30}>Apaga la resistencia de <Em>once de la noche</Em> a cinco de la mañana</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · LA MANTA TERMICA */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "12%", opacity: t2, transform: `translateY(${((1 - t2) * -22).toFixed(1)}px)` }}>
            <Bed w={690} pad={24}>
              <Kick color={V.volt}>Compra dos</Kick>
              <div style={{ height: 7 }} />
              <Head size={68}>LA MANTA TÉRMICA</Head>
              <div style={{ height: 9 }} />
              <Body size={30}>El tanque deja de <Em>perder calor</Em> mientras espera</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · DOS REGLETAS CON INTERRUPTOR */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "70%", opacity: t3, transform: `translateY(${((1 - t3) * 22).toFixed(1)}px)` }}>
            <Bed w={730} pad={24}>
              <Kick color={V.volt}>Compra tres</Kick>
              <div style={{ height: 7 }} />
              <Head size={62}>DOS REGLETAS CON INTERRUPTOR</Head>
              <div style={{ height: 9 }} />
              <Body size={30}>Una detrás del televisor, otra en el escritorio de arriba</Body>
            </Bed>
          </div>
        )}
        {t3b > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "70%", opacity: t3b, transform: `translateY(${((1 - t3b) * 18).toFixed(1)}px)` }}>
            <Bed w={620} pad={22}>
              <Head size={58}>LOS FANTASMAS, <Em color={V.amber}>A CERO</Em></Head>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · DIEZ FOCOS LED */}
        {t4a > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "13%", opacity: t4a, transform: `translateY(${((1 - t4a) * -20).toFixed(1)}px)` }}>
            <Bed w={620} pad={24}>
              <Kick color={V.volt}>Compra cuatro</Kick>
              <div style={{ height: 7 }} />
              <Head size={68}>DIEZ FOCOS LED</Head>
            </Bed>
          </div>
        )}
        {t4b > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "13%", opacity: t4b, transform: `translateY(${((1 - t4b) * -20).toFixed(1)}px)` }}>
            <Bed w={740} pad={24}>
              <Kick color={V.volt}>Compra cinco</Kick>
              <div style={{ height: 7 }} />
              <Head size={60}>FILTRO NUEVO Y CINTA DE ALUMINIO</Head>
              <div style={{ height: 9 }} />
              <Body size={30}>Dos uniones de ductos que tiraban <Em color={V.amber}>aire frío</Em> adentro del techo</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · CIENTO VEINTISEIS · CINCO SEMANAS · EL SISTEMA ENCOGE */}
        {t5a > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "72%", opacity: t5a, transform: `translateY(${((1 - t5a) * 24).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.amber}>Las cinco compras</Kick>
              <div style={{ height: 7 }} />
              <Head size={70}>CIENTO VEINTISÉIS DÓLARES</Head>
              <div style={{ height: 9 }} />
              <Body size={30}>Se hacen <Em color={V.amber}>una vez</Em> y no se tocan más</Body>
            </Bed>
          </div>
        )}
        {t5b > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "17%", opacity: t5b, transform: `translateY(${((1 - t5b) * -22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Head size={64}>SE PAGARON SOLOS EN <Em color={V.amber}>CINCO SEMANAS</Em></Head>
            </Bed>
          </div>
        )}
        {t5c > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "70%", opacity: t5c, transform: `translateY(${((1 - t5c) * 24).toFixed(1)}px)` }}>
            <Bed w={740} pad={24}>
              <Kick color={V.amber}>Y el presupuesto encoge con ella</Kick>
              <div style={{ height: 7 }} />
              <Head size={64}>DE DIEZ KILOVATIOS <Em>A SEIS</Em></Head>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta: se abre con el amanecer (los bordes se apagan menos a medida que sube el sol) */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(130% 110% at 50% 46%, rgba(0,0,0,0) 52%, rgba(6,7,5,${ip(g, [0, 1195, 1860], [0.44, 0.36, 0.26]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
