// MovTrescientos.tsx — S1 · UN MOVIMIENTO CONTINUO de 43 s (1290 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmegenerador`.
//
// LA ESPINA: se corta la luz de verdad y la pinza marca 308 vatios — setenta veces menos que la
// máquina de 22.000 que le querían vender. Este movimiento tiene el REVEAL más importante del
// arranque: el "308" tiene que GANARSE la pantalla. Por eso el número no aparece: SUBE en el
// display real (con su sobretiro y su temblor de instrumento), se asienta, y recién ahí se
// despega del vidrio y se convierte en el titular de la escena siguiente.
//
// ╔══════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el exitTo del acto N                ║
// ╠════╦══════════════════════════════════╦═════════════════════════════════════════════════════
// ║ AC ║ enterFrom                        ║ exitTo
// ╠════╬══════════════════════════════════╬═════════════════════════════════════════════════════
// ║ 1  ║ CÁM: viene de MovPapel, lejos y  ║ CÁM: z≈-150 → +74, empujando 7 frames hacia el punto
// ║ f0 ║ baja (z≈-470), pan a la izq.     ║      verde del fondo del pasillo (embiste, no corta).
// ║    ║ LUZ: frío que baja + ÁMBAR de    ║ LUZ: ámbar MUERTO. keyFrom 0.78→0.55, intensidad
// ║    ║ las ventanas de la casa (tint    ║      0.86→0.34: la noche del apagón. tint amber→volt.
// ║    ║ amber, keyFrom 0.78, int 0.85).  ║ MAT: el PUNTO VERDE del display de la pinza, visto
// ║    ║ MAT: la VENTANA ENCENDIDA de la  ║      chiquito al fondo del pasillo (nace en f200 y
// ║    ║ casa (6 cuadros cálidos vivos).  ║      SOBREVIVE al corte: en f270 ya es el macro).
// ╠════╬══════════════════════════════════╬═════════════════════════════════════════════════════
// ║ 2  ║ CÁM: el punto verde YA es macro  ║ CÁM: z 74→90, empieza a retroceder y a abrir hacia el
// ║f270║ a pantalla casi llena (z +74).   ║      cilindro del carrusel (sin frenar: misma inercia).
// ║    ║ LUZ: noche cerrada, la ÚNICA     ║ LUZ: el verde ya es la key (keyFrom 0.52→0.44,
// ║    ║ fuente es el verde del display.  ║      intensidad 0.52→0.66), entra el torch de contra.
// ║    ║ MAT: la MediaCard del display    ║ MAT: LA MISMA MediaCard del display (no se desmonta:
// ║    ║ (misma posición que el punto).   ║      se encoge y viaja a la esquina inferior izq.).
// ╠════╬══════════════════════════════════╬═════════════════════════════════════════════════════
// ║ 3  ║ CÁM: retrocediendo (z≈+90) y     ║ CÁM: z≈-10 y cayendo, el cilindro se aplana de canto
// ║f570║ abriendo el cilindro 3D.         ║      justo cuando cruza el polvo.
// ║    ║ LUZ: verde key + torch de contra.║ LUZ: keyFrom 0.44→0.30, intensidad 0.66→0.80: el
// ║    ║ MAT: la MediaCard del display,   ║      laboratorio empieza a levantar.
// ║    ║ ahora chica, abajo a la izq.     ║ MAT: la MISMA MediaCard del display, que se endereza
// ║    ║ + el 308 que se despegó de ella. ║      y se para: se vuelve LA BARRA de 308.
// ╠════╬══════════════════════════════════╬═════════════════════════════════════════════════════
// ║ 4  ║ CÁM: z≈-170 (el polvo tapa el    ║ CÁM: BAJA (translateY -120px) y se aleja a z≈-50.
// ║f900║ salto), subiendo con la barra.   ║ LUZ: negro casi total en f1244 con el VERDE DEL
// ║    ║ LUZ: key volt levantando desde   ║      DISPLAY como única fuente → y en los últimos 30
// ║    ║ la izquierda (keyFrom 0.30).     ║      frames entra la key VOLT DURA DESDE LA IZQUIERDA
// ║    ║ MAT: la barra de 308 (la         ║      (keyFrom 0.12, intensidad 0.88) = taller neutro.
// ║    ║ MediaCard del display, parada).  ║ MAT: el DISPLAY VERDE se acuesta (rotateX 0→66°) y se
// ║    ║                                  ║      vuelve LA LOSA (PadPlane entrando desde abajo)
// ║    ║                                  ║      = exactamente el suelo con el que abre MovDesglose.
// ╚════╩══════════════════════════════════╩═════════════════════════════════════════════════════
//
// COSTURAS (una distinta por frontera · ninguna es un fade):
//   f270  1→2  CORTE EN EL BEAT   — corte seco sobre 'pinza'. Calza porque el PUNTO VERDE queda en
//                                   la misma coordenada de pantalla antes y después, la cámara ya
//                                   venía embistiendo y el flash volt de 5 frames marca el golpe.
//   f570  2→3  MATCH-SHAPE        — la MISMA MediaCard del display cambia w/h/x/y/z/ry sin cortar,
//                                   y el 308 se despega del vidrio y crece hasta ser el titular.
//   f900  3→4  WIPE POR MATERIA   — polvo de concreto cruzando; detrás ya están paradas las barras.
//
// ⛔ Sin Math.random / Date.now (todo sale de rnd(k) y de gFrame) · sin backdrop-filter ·
// ⛔ sin Easing.quint · rutas SOLO literales de la ficha · imports sólo remotion/react/VoltStage.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, Carousel3D, PhotoPlane, IconPng,
  Readout, SeamWipeMatter, SeamFlash,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

const END = 1290;
const A2 = 270;
const A3 = 570;
const A4 = 900;
const BASE_PX = 700;   // la línea de base de las dos barras del acto 4 (en px de 1080)

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const miles = (n: number) => {
  const s = String(Math.max(0, Math.round(n)));
  return s.length > 3 ? s.slice(0, s.length - 3) + "." + s.slice(s.length - 3) : s;
};

// ── LA VENTANA ENCENDIDA — la MATERIA que llega desde MovPapel y se apaga de golpe ───────────
const Ventana: React.FC<{
  x: number; y: number; w: number; h: number; off: number; g: number; drift: number;
}> = ({ x, y, w, h, off, g, drift }) => {
  const on = clamp01(1 - (g - off) / 4);
  if (on <= 0.001) return null;
  const flick = g < off - 2 ? 0.9 + Math.sin(g / 6.3 + x) * 0.09 : 1;
  const a = on * flick;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2,
      transform: `translateY(${drift.toFixed(2)}px)`,
      background: `linear-gradient(172deg, ${rgba(V.torch, 0.92 * a)} 0%, ${rgba(V.amber, 0.76 * a)} 62%, ${rgba(V.amber, 0.5 * a)} 100%)`,
      boxShadow: `0 0 ${Math.round(58 * a)}px ${Math.round(20 * a)}px ${rgba(V.amber, 0.26 * a)}, inset 0 0 6px ${rgba(V.torch, 0.6 * a)}`,
      borderRadius: 2,
    }} />
  );
};

export const MovTrescientos: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  // El build puede montarme dentro de una Sequence: el frame LOCAL no es el global. Todo componente
  // del Stage que recibe `at` (Readout, Seam*, sheenAt) razona en frames LOCALES → los traduzco.
  const lFrame = useCurrentFrame();
  const off = gFrame - lFrame;
  const L = (gAt: number) => gAt - off;

  // `acto` es la red: si el build me pasa un gFrame no numérico, arranco en la cabecera del acto.
  const ACT_IN = [0, 0, A2, A3, A4];
  const gRaw = Number.isFinite(gFrame) ? gFrame : ACT_IN[Math.max(0, Math.min(4, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ── LA CÁMARA: UNA sola, función de g, que NUNCA vuelve a 0 ────────────────────────────────
  const cam = gcam(g, { z0: -170, z1: 150, panX: -120, panY: 26, ry: -6.4, rx: 1.6, dur: END });
  const cz = ip(
    g,
    [0, 130, 264, 271, 430, 570, 645, 790, 896, 903, 985, 1095, 1205, 1290],
    [-300, -180, -120, 110, 40, 90, -150, -70, -10, -170, -80, 0, 60, -200],
  );
  const camDrop = ip(g, [900, 1150, 1232, 1290], [0, 0, -14, -120]);   // la cámara BAJA al final
  const camT = `${cam.transform} translateZ(${cz.toFixed(1)}px) translateY(${camDrop.toFixed(1)}px)`;
  // deriva de la cámara replicada para los overlays (así el texto no se lee pegado con cinta)
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;

  // ── LA LUZ: EVOLUCIONA. Ámbar de la casa → verde del display → laboratorio → key volt izq. ──
  const keyFrom = ip(g, [0, 60, 270, 570, 900, 1244, 1290], [0.78, 0.74, 0.52, 0.44, 0.30, 0.20, 0.12]);
  const inten = ip(g, [0, 48, 68, 200, 270, 430, 900, 1150, 1244, 1290],
    [0.82, 0.88, 0.34, 0.30, 0.52, 0.66, 0.80, 0.94, 0.30, 0.88]);
  const floor = ip(g, [0, 68, 570, 900, 1290], [0.60, 0.80, 0.74, 0.62, 0.55]);
  const tintA = light(ip(g, [46, 68, 300], [0, 0.35, 1]), "amber", "volt");
  const tintB = light(ip(g, [60, 620, 1020], [0, 0.6, 1]), "amber", "torch");

  // ── LA MEDIA CARD DEL DISPLAY: el objeto que SOBREVIVE de f268 a f1290 ─────────────────────
  // macro del display → tarjeta chica en la esquina → barra vertical de 308 → losa acostada.
  const pinF = [268, 300, 545, 604, 664, 880, 902, 968, 1150, 1244, 1290];
  const pinW = ip(g, pinF, [1310, 1180, 1180, 452, 336, 336, 322, 332, 332, 366, 900]);
  const pinH = ip(g, pinF, [706, 622, 622, 262, 196, 196, 208, 430, 430, 404, 300]);
  const pinX = ip(g, pinF, [50, 50, 50, 27.5, 21.6, 21.6, 30, 68, 68, 60, 50]);
  const pinY = ip(g, pinF, [47, 47, 47, 68, 74, 74, 70, 44.9, 44.9, 52, 84]);
  const pinZ = ip(g, pinF, [130, 96, 78, -18, -60, -60, -34, 44, 44, 62, -40]);
  const pinRy = ip(g, pinF, [0, 0, 0, 7, 10, 10, 6, -4, -4, -2, 0]);
  const pinRx = ip(g, [1236, 1290], [0, 66]);            // se ACUESTA y se vuelve la losa
  const pinLit = ip(g, [268, 300, 1150, 1244, 1290], [0.5, 1, 1, 0.86, 1]);

  // ── EL NÚMERO: sube en el instrumento, se asienta, y RECIÉN AHÍ se despega del vidrio ──────
  const wattsRaw = ip(g, [286, 322, 356, 386, 400, 414, 424], [4, 148, 246, 341, 288, 314, 308]);
  const settle = clamp01((g - 424) / 10);
  const shake = g < 424 ? (rnd(Math.floor(g / 2) * 1.7) - 0.5) * 26 * (1 - clamp01((g - 286) / 130)) : 0;
  const watts = g < 284 ? 0 : Math.max(0, Math.round(wattsRaw + shake));
  const numX = ip(g, [270, 556, 620, 664, 908, 986, 1290], [50, 50, 68.5, 72, 72, 68, 64]);
  const numY = ip(g, [270, 556, 620, 664, 908, 986, 1290], [47, 47, 26, 22, 22, 76.9, 79]);
  const numSize = ip(g, [270, 545, 620, 664, 908, 986, 1290], [178, 178, 236, 248, 248, 156, 150]);
  const numOn = ip(g, [282, 292, 1258, 1284], [0, 1, 1, 0.15]);
  const numGlow = 0.35 + 0.65 * settle;

  // ── ACTO 4: las dos barras (la de 22.000 crece hacia ARRIBA y en FRÍO: es lo que te venden) ─
  const tallH = Math.max(
    8,
    ipe(g, [915, 950, 1092], [24, 384, 2600], Easing.out(Easing.cubic)) * ip(g, [1236, 1272], [1, 0.02]),
  );
  const tallY = ((BASE_PX - tallH / 2) / 1080) * 100;
  const tallOp = ip(g, [905, 928, 1240, 1268], [0, 1, 1, 0]);
  const watts22 = ipe(g, [950, 1092], [0, 22000], Easing.out(Easing.cubic));

  // ── VELOS DEL CIERRE: negro casi total + el verde del display como única fuente ────────────
  const veil = ip(g, [1214, 1246, 1264, 1290], [0, 0.74, 0.6, 0.1]);
  const onlyGreen = ip(g, [1212, 1248, 1290], [0, 0.26, 0.09]);

  // opacidades de bloque
  const a1On = g < 272 ? 1 : 0;
  const a2WideOn = ip(g, [272, 300, 600, 656], [0, 1, 1, 0]);
  const carOn = ip(g, [560, 598, 882, 906], [0, 1, 1, 0]);
  const dutyOn = ip(g, [648, 688, 862, 892], [0, 0.9, 0.9, 0]);
  const truckOn = ip(g, [774, 806, 866, 894], [0, 1, 1, 0]);

  const carItems: { src: string; kind?: "video" | "photo"; label?: string }[] = [
    { src: "broll/cmegenerador/cmeg_mv_tres3.mp4", kind: "video", label: "REFRIGERADOR" },
    { src: "broll/cmegenerador/cmeg_mv_tres4.mp4", kind: "video", label: "MÓDEM Y ROUTER" },
    { src: "broll/cmegenerador/cmeg_mv_tres5.mp4", kind: "video", label: "TELÉFONOS Y TABLET" },
    { src: "img/cmegenerador/cmeg_mv_tres6.jpg", kind: "photo", label: "LA LUZ DEL PASILLO" },
    { src: "img/cmegenerador/cmeg_mv_tres1.jpg", kind: "photo", label: "LA CUADRA A OSCURAS" },
  ];

  // la deriva interna de la MediaCard, replicada para clavarle las ventanas encima
  const cardDrift = Math.sin(lFrame / 41 + 50) * 2.4;
  const bokehC = light(ip(g, [60, 320], [0, 1]), "amber", "volt");

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca; sólo evoluciona ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══ EL ESPACIO 3D — 7 planos con parallax propio, bajo UNA sola cámara ══════════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · el fondo lejano ------------------------------------------------------- */}
        {g < 300 && (
          <AbsoluteFill style={{ opacity: a1On ? ip(g, [0, 14, 258, 270], [0, 1, 1, 0.86]) : 0 }}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_tres1.jpg" kind="photo" z={-640}
              scale={1.42} dim={ip(g, [0, 52, 74], [0.30, 0.34, 0.74])} tint={V.amber} />
          </AbsoluteFill>
        )}
        {g >= 268 && g < 664 && (
          <AbsoluteFill style={{ opacity: a2WideOn }}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_tres6.jpg" kind="photo" z={-600}
              scale={1.26} dim={0.7} tint={V.volt} />
          </AbsoluteFill>
        )}
        {g >= 890 && (
          <AbsoluteFill style={{ opacity: ip(g, [890, 940, 1236, 1272], [0, 0.55, 0.55, 0.12]) }}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_tres6.jpg" kind="photo" z={-660}
              scale={1.34} dim={0.82} tint={V.volt} />
          </AbsoluteFill>
        )}

        {/* PLANO 2 · el aire de atrás: rejilla de profundidad + halo de la key --------------- */}
        <Plane z={-420}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.4).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [560, 640, 1240, 1284], [0, 0.3, 0.3, 0.06]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.1)} 0 1px, rgba(0,0,0,0) 1px 96px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.07)} 0 1px, rgba(0,0,0,0) 1px 96px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO 3 · la losa que ENTRA por abajo al final = el suelo de MovDesglose ---------- */}
        {g >= 1238 && (
          <PadPlane y={ip(g, [1238, 1290], [106, 76])} w={1520} h={340} rx={62}
            lit={ip(g, [1238, 1290], [0, 0.95])} z={-130} />
        )}

        {/* PLANO 4 · EL CARRUSEL 3D (acto 3) ------------------------------------------------ */}
        {g >= 556 && g < 910 && (
          <Plane z={-40} style={{ opacity: carOn }}>
            <Carousel3D
              items={carItems}
              spin={ip(g, [578, 700, 800, 906], [0, 0.42, 0.68, 0.83])}
              radius={640} cardW={430} cardH={258} y={51} focus={0} litColor={V.volt}
            />
          </Plane>
        )}

        {/* PLANO 5 · LOS PROTAGONISTAS ------------------------------------------------------ */}
        {/* acto 1: la casa a oscuras dentro de vidrio + las ventanas que se apagan de golpe */}
        {g < 276 && (
          <Plane z={0} style={{ opacity: ip(g, [0, 12, 262, 272], [0, 1, 1, 1]) }}>
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_tres1.mp4" kind="video"
              w={1230} h={646} x={50} y={48} z={0}
              ry={ip(g, [0, 270], [4.5, -1.5])} rx={ip(g, [0, 270], [1.4, -0.4])}
              lit={ip(g, [0, 52, 76, 270], [1, 1, 0.42, 0.5])} litColor={V.amber}
              sheenAt={L(18)} radius={10}
            />
            {/* LA MATERIA QUE ENTRA DESDE MovPapel: seis ventanas encendidas de la cuadra */}
            <Ventana x={30.5} y={52.5} w={34} h={24} off={54} g={g} drift={cardDrift} />
            <Ventana x={36.0} y={51.0} w={28} h={22} off={57} g={g} drift={cardDrift} />
            <Ventana x={43.5} y={53.5} w={40} h={26} off={60} g={g} drift={cardDrift} />
            <Ventana x={57.0} y={52.0} w={36} h={25} off={62} g={g} drift={cardDrift} />
            <Ventana x={63.5} y={54.0} w={26} h={21} off={65} g={g} drift={cardDrift} />
            <Ventana x={70.0} y={51.5} w={44} h={28} off={68} g={g} drift={cardDrift} />
            {/* lo único que queda prendido: el faro de un auto, lejos */}
            <div style={{
              position: "absolute", left: "83%", top: "56%", width: 54, height: 12,
              marginLeft: -27, marginTop: -6, borderRadius: 9,
              background: `radial-gradient(circle, ${rgba(V.torch, 0.9)}, rgba(0,0,0,0) 72%)`,
              opacity: 0.5 + Math.sin(g / 19) * 0.16,
              boxShadow: `0 0 44px 14px ${rgba(V.torch, 0.14)}`,
            }} />
          </Plane>
        )}

        {/* LA CARD QUE CRUZA TODO: display macro → tarjeta chica → barra de 308 → losa */}
        {g >= 266 && (
          <Plane z={0}>
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_tres2.mp4" kind="video"
              w={pinW} h={pinH} x={pinX} y={pinY} z={pinZ}
              ry={pinRy} rx={pinRx} radius={12}
              lit={pinLit} litColor={V.volt}
              sheenAt={L(296)}
              label={g >= 930 && g < 1236 ? "LO QUE PIDE TU CASA" : undefined}
              opacity={ip(g, [266, 276, 1276, 1290], [0, 1, 1, 0.55])}
            />
          </Plane>
        )}

        {/* ACTO 4 · la barra de 22.000: crece hacia ARRIBA, en FRÍO, y se va de cuadro */}
        {g >= 902 && (
          <Plane z={10} style={{ opacity: tallOp }}>
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_tres1.mp4" kind="video"
              w={332} h={tallH} x={34} y={tallY} z={16}
              ry={4} radius={10} lit={0.9} litColor={V.steel}
              label={g >= 962 ? "LO QUE TE VENDEN" : undefined}
            />
            {/* la barra NO termina en cuadro: los chevrones dicen que sigue subiendo */}
            {g >= 1040 && [0, 1, 2].map((i) => {
              const pu = clamp01(((g - 1040) / 12 - i * 0.5) % 2.4);
              return (
                <div key={i} style={{
                  position: "absolute", left: "34%", top: `${5 + i * 4.4}%`,
                  marginLeft: -20, width: 40, height: 40,
                  borderLeft: `5px solid ${rgba(V.steel, 0.14 + 0.5 * (1 - pu))}`,
                  borderTop: `5px solid ${rgba(V.steel, 0.14 + 0.5 * (1 - pu))}`,
                  transform: "rotate(45deg)",
                }} />
              );
            })}
          </Plane>
        )}

        {/* PLANO 6 · objetos de escena delante (íconos PNG) ---------------------------------- */}
        {g >= 770 && g < 900 && (
          <Plane z={110} style={{ opacity: truckOn }}>
            <IconPng src="img/cmegenerador/cmeg_ic_camioneta.png"
              x={80} y={ip(g, [774, 812], [24, 29])} size={200} z={0}
              opacity={0.95} rot={ip(g, [774, 890], [-6, 2])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 196 && g < 300 && (
          /* EL PUNTO VERDE que cruza el corte del beat: nace acá y en f270 ya es el macro */
          <Plane z={130}>
            <div style={{
              position: "absolute", left: "50%", top: "47%",
              width: ipe(g, [196, 256, 269], [10, 26, 190], Easing.in(Easing.cubic)),
              height: ipe(g, [196, 256, 269], [7, 17, 120], Easing.in(Easing.cubic)),
              marginLeft: -ipe(g, [196, 256, 269], [5, 13, 95], Easing.in(Easing.cubic)),
              marginTop: -ipe(g, [196, 256, 269], [3.5, 8.5, 60], Easing.in(Easing.cubic)),
              borderRadius: 3,
              background: `linear-gradient(170deg, ${rgba(V.volt, 0.95)}, ${rgba(V.voltSoft, 0.7)})`,
              boxShadow: `0 0 ${Math.round(ip(g, [196, 269], [30, 180]))}px ${rgba(V.volt, 0.42)}`,
              opacity: ip(g, [196, 214, 268, 276], [0, 0.85, 1, 0]),
            }} />
          </Plane>
        )}
        {/* el verde del display como ÚNICA fuente en el cierre */}
        {g >= 1206 && (
          <Plane z={140}>
            <AbsoluteFill style={{
              background: `radial-gradient(38% 34% at ${pinX.toFixed(1)}% ${pinY.toFixed(1)}%, ${rgba(V.volt, onlyGreen)} 0%, rgba(0,0,0,0) 66%)`,
              mixBlendMode: "screen",
            }} />
          </Plane>
        )}

        {/* PLANO 7 · el primer plano fuera de foco (hold VIVO permanente) -------------------- */}
        <Plane z={320} style={{ opacity: 0.5 }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * -3.2).toFixed(2)}px)` }}>
            {Array.from({ length: 9 }, (_, i) => {
              const sp = 0.4 + rnd(i * 4.1) * 0.9;
              const xx = ((rnd(i * 7.3) * 100 + (g * sp) / 26) % 106) - 3;
              const yy = 8 + rnd(i * 2.9) * 82;
              const s = lerp(24, 78, rnd(i * 5.7));
              return (
                <div key={i} style={{
                  position: "absolute", left: `${xx.toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                  width: s, height: s, borderRadius: "50%",
                  background: `radial-gradient(circle, ${rgba(bokehC, 0.17)}, rgba(0,0,0,0) 70%)`,
                }} />
              );
            })}
          </div>
        </Plane>
      </Layers>

      {/* ══ VELO DEL CIERRE: negro casi total, con el verde como única fuente ═══════════════ */}
      {g >= 1210 && <AbsoluteFill style={{ background: rgba(V.ink0, veil), pointerEvents: "none" }} />}

      {/* ══ LA TIRA DEL CANAL: acá van 30 de 30 encendidas — TODO a la vez ═════════════════ */}
      {g >= 640 && g < 900 && (
        <DutyField duty={1} cells={26} on={dutyOn} tint={V.volt} y={89} w={1160} h={24} cycle={104} />
      )}

      {/* ══ OVERLAYS DE TEXTO — fuera de la cámara para que la tipografía no se deforme, ════
          pero atados a la deriva de la cámara para que no se lean pegados con cinta.       */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        transform: `translate3d(${(bx * 0.55).toFixed(2)}px, ${(by * 0.55 + camDrop * 0.22).toFixed(2)}px, 0)`,
      }}>

        {/* EL NÚMERO — sube en el display, se asienta, se despega y se vuelve el titular */}
        {g >= 282 && (
          <div style={{
            position: "absolute", left: `${numX}%`, top: `${numY}%`,
            transform: `translate(-50%,-50%) scale(${(1 + (1 - settle) * 0.05).toFixed(4)})`,
            opacity: numOn, whiteSpace: "nowrap", textAlign: "center",
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 4.2,
              color: rgba(V.white, 0.62 + 0.2 * settle), textTransform: "uppercase", marginBottom: 8,
              textShadow: "0 4px 18px rgba(0,0,0,0.92)",
            }}>
              {g < 560 ? "PINZA AMPERIMÉTRICA" : "TODA LA CASA"}
            </div>
            <div style={{
              filter: `drop-shadow(0 0 ${Math.round(numSize * 0.34 * numGlow)}px ${rgba(V.volt, 0.4 * numGlow)})`,
            }}>
              <Num size={numSize} color={V.volt}>
                {watts}
                <span style={{ fontSize: Math.round(numSize * 0.33), marginLeft: 12, color: rgba(V.volt, 0.8) }}>W</span>
              </Num>
            </div>
            {/* la aguja del instrumento: se calma cuando el número se asienta */}
            <div style={{
              margin: "14px auto 0", width: Math.round(numSize * 1.5), height: 4, borderRadius: 3,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.volt, 0.16 + 0.42 * settle)} 50%, rgba(0,0,0,0) 100%)`,
            }} />
          </div>
        )}

        {/* ACTO 1 · el reloj del apagón */}
        {g >= 128 && g < 268 && (
          <Readout value="4:30" label="SIN LUZ" at={L(132)} x={79}
            y={ip(g, [132, 200], [28, 26])} size={116} color={V.torch} align="center" />
        )}

        {/* ACTO 1 · titular */}
        {g >= 74 && g < 274 && (
          <div style={{
            position: "absolute", left: 124, bottom: 116, width: 880,
            opacity: ip(g, [74, 96, 250, 268], [0, 1, 1, 0]),
            transform: `translateY(${ip(g, [74, 100, 252, 270], [46, 0, 0, -30]).toFixed(1)}px)`,
          }}>
            <Bed pad={28}>
              <Kick color={V.torch}>SE FUE LA LUZ · CUADRA ENTERA</Kick>
              <div style={{ height: 12 }} />
              <Head size={92}>CUATRO HORAS Y MEDIA</Head>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · titular + el fantasma de los 22.000 que la narración nombra en f531 */}
        {g >= 428 && g < 596 && (
          <div style={{
            position: "absolute", left: 124, bottom: 116, width: 900,
            opacity: ip(g, [428, 448, 572, 594], [0, 1, 1, 0]),
            transform: `translateY(${ip(g, [428, 452, 574, 596], [42, 0, 0, -34]).toFixed(1)}px)`,
          }}>
            <Bed pad={28}>
              <Kick>LA PINZA NO OPINA · MIDE</Kick>
              <div style={{ height: 12 }} />
              <Head size={94}>TRESCIENTOS OCHO</Head>
            </Bed>
          </div>
        )}
        {g >= 520 && g < 600 && (
          <div style={{
            position: "absolute", right: 130, top: 92, textAlign: "right",
            opacity: ip(g, [520, 540, 576, 598], [0, 0.4, 0.4, 0]),
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 128, lineHeight: 0.9,
              color: rgba(V.steel, 0.55), letterSpacing: 2,
              textShadow: `0 6px 30px rgba(0,0,0,0.9)`,
            }}>22.000</div>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 4,
              color: rgba(V.steel, 0.6), textTransform: "uppercase",
            }}>LA MÁQUINA QUE LE OFRECEN</div>
          </div>
        )}

        {/* ACTO 3 · titular + el remate del camión */}
        {g >= 596 && g < 900 && (
          <div style={{
            position: "absolute", left: 124, bottom: 150, width: 760,
            opacity: ip(g, [596, 622, 866, 892], [0, 1, 1, 0]),
            transform: `translateY(${ip(g, [596, 626, 868, 896], [44, 0, 0, -30]).toFixed(1)}px)`,
          }}>
            <Bed pad={28}>
              <Kick>UNA NOCHE SIN LUZ</Kick>
              <div style={{ height: 12 }} />
              <Head size={90}>TODO ESTO, A LA VEZ</Head>
              {g >= 776 && (
                <div style={{ marginTop: 16, opacity: truckOn }}>
                  <Body size={33}>
                    Un camión de mudanzas para <Em color={V.amber}>una bolsa de cemento</Em>.
                  </Body>
                </div>
              )}
            </Bed>
          </div>
        )}

        {/* ACTO 4 · el contador de la máquina + el ×70 + el titular */}
        {g >= 944 && g < 1262 && (
          <div style={{
            position: "absolute", left: "34%", top: ip(g, [944, 1000], [21, 18]) * 10.8,
            transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap",
            opacity: ip(g, [944, 968, 1240, 1260], [0, 1, 1, 0]),
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 4.2,
              color: rgba(V.white, 0.62), textTransform: "uppercase", marginBottom: 8,
              textShadow: "0 4px 18px rgba(0,0,0,0.92)",
            }}>LO QUE TE VENDEN</div>
            <Num size={168} color={V.steel}>
              {miles(watts22)}
              <span style={{ fontSize: 56, marginLeft: 12, color: rgba(V.steel, 0.78) }}>W</span>
            </Num>
          </div>
        )}
        {g >= 1092 && g < 1250 && (
          <div style={{
            position: "absolute", left: "51%", top: "62%",
            transform: `translate(-50%,-50%) scale(${ipe(g, [1092, 1116], [0.6, 1], Easing.out(Easing.back(2))).toFixed(3)})`,
            opacity: ip(g, [1092, 1108, 1232, 1248], [0, 1, 1, 0]),
          }}>
            <div style={{
              padding: "16px 34px", borderRadius: 999,
              background: "linear-gradient(180deg, rgba(8,9,6,0.94) 0%, rgba(8,9,6,0.8) 100%)",
              border: `2px solid ${rgba(V.volt, 0.5)}`,
              boxShadow: `0 18px 50px rgba(0,0,0,0.7), 0 0 44px ${rgba(V.volt, 0.2)}`,
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 76, lineHeight: 1,
              color: V.volt, letterSpacing: 2,
            }}>× 70</div>
          </div>
        )}
        {g >= 1096 && (
          <div style={{
            position: "absolute", left: 124, bottom: 96, width: 820,
            opacity: ip(g, [1096, 1120, 1256, 1284], [0, 1, 1, 0.2]),
            transform: `translateY(${ip(g, [1096, 1124], [46, 0]).toFixed(1)}px)`,
          }}>
            <Bed pad={28}>
              <Kick>PARA UNA CASA QUE PIDE 308</Kick>
              <div style={{ height: 12 }} />
              <Head size={96}>SETENTA VECES MÁS</Head>
              {g >= 1150 && (
                <div style={{ marginTop: 16, opacity: ip(g, [1150, 1174, 1240, 1260], [0, 1, 1, 0]) }}>
                  <Body size={33}>
                    El vendedor te vende <Em>exactamente</Em> lo que le pediste.
                  </Body>
                </div>
              )}
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* ══ COSTURAS ═══════════════════════════════════════════════════════════════════════
          f270 · CORTE EN EL BEAT (flash volt de 5 frames, no es un fade: es el golpe)
          f900 · WIPE POR MATERIA (polvo de concreto; detrás ya están las barras paradas)
          f570 · MATCH-SHAPE — no lleva overlay: la costura ES la MediaCard que se transforma. */}
      <SeamFlash at={L(270)} color={V.volt} dur={5} />
      <SeamWipeMatter at={L(900)} dur={22} tint={V.concrete} />
    </AbsoluteFill>
  );
};
