// MovCuenta.tsx — S11 · UN MOVIMIENTO CONTINUO de 68 s (2040 frames @30fps)
// «Doce mil quinientos contra mil novecientos. Y las tres cosas que Ernesto perdió.»
//
// LA CUENTA FINAL. Las dos columnas NO son una tabla de datos: son DOS PAPELES FÍSICOS apoyados en
// la losa del patio, con su fibra, su borde levantado, su sombra de contacto y MATERIAL REAL adentro
// (el clip del presupuesto en uno, el clip del equipo en el otro). El remate es honesto — las tres
// cosas que perdió, cada una con su foto real — y el cierre es EL PLANO QUE ABRE Y CIERRA EL VIDEO:
// la losa de concreto VACÍA al atardecer, sin nada encima, respirando sola los últimos 8 segundos.
//
// UNA atmósfera montada una sola vez · UNA cámara función de `g` que NUNCA vuelve a 0 · la luz
// evoluciona danger(heredada) → volt frío desde arriba → ámbar cálido bajo · y hay MATERIA que cruza
// las cuatro fronteras (el cobre → las líneas del presupuesto → el papel → la página de la guía →
// el polvo del patio → la losa).
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z≈-30 casi quieta, empujando a la derecha (hereda la inercia de
//                       `MovPeligro`) · luz NARANJA DANGER DURA DESDE ARRIBA (keyFrom .20,
//                       intensity .98) · materia: EL COBRE PELADO DEL ALARGUE QUEMADO — sus tres
//                       hebras entran en cuadro y se enderezan hasta ser LAS TRES LÍNEAS DEL
//                       PRESUPUESTO impresas en el papel.
//                EXIT   cám z≈+150 (empuje sobre el papel), pan ≈0 · luz VOLT FRÍA DESDE ARRIBA
//                       (lo que te cobran entra en frío) · materia: LA HOJA DEL PRESUPUESTO, entera,
//                       con el total 12.500 encerrado a mano.
//
// acto 2 · f420  ENTER  cám z≈+150, pan empezando a ir a la izquierda · luz volt fría arriba + el
//                       ámbar de abajo entrando · materia: LA MISMA HOJA — se angosta, se corre a la
//                       izquierda y deja el hueco donde entra la SEGUNDA hoja (MATCH-SHAPE).
//                EXIT   cám z≈+165, pan -70 · luz: volt arriba / ÁMBAR ABAJO ya presente (lo que de
//                       verdad necesitás entra en cálido) · materia: LAS DOS HOJAS APOYADAS, con sus
//                       dos totales encerrados.
//
// acto 3 · f900  ENTER  cám z≈+165 EN PLENO RETROCESO (el mismo vector, sin cortar) · luz volt/ámbar
//                       repartida · materia: LAS DOS HOJAS, que la cámara termina de mostrar juntas
//                       y de las que salen las dos guías hasta la resta.
//                EXIT   cám z≈+100 empujando sobre la ventana · luz volt cayendo, ámbar subiendo ·
//                       materia: LA PÁGINA VERTICAL DE LA GUÍA (papel), que barre el cuadro entero.
//
// acto 4 · f1380 ENTER  cám z≈+100 retrocediendo a plano general · luz ámbar dominante, baja ·
//                       materia: EL PAPEL de la página, que al despejar deja debajo EL PATIO DE
//                       ERNESTO (la losa ya está ahí, en penumbra, esperando).
//                EXIT   cám z≈-40, plano general asentado · luz ámbar cálida baja · materia: LA
//                       TERCERA TARJETA (la losa vacía al atardecer), que ya está creciendo.
//
// acto 5 · f1800 ENTER  cám z≈-40 abriendo los últimos 12 px · luz ÁMBAR CÁLIDA BAJA · materia: la
//                       tercera tarjeta CRECE hasta ser el cuadro entero: la losa vacía.
//                EXIT   cám z≈-150 asentada, sólo deriva viva · luz ÁMBAR CÁLIDA BAJA EN EL PATIO
//                       (intensity .76, floor .69) · materia: LA LOSA VACÍA, sola en cuadro
//                       → así arranca `MovCierre`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f396  frontera 1→2 : MATCH-SHAPE — la hoja del presupuesto (620×700 @x63) se angosta y viaja a
//                      (520×620 @x28.5) mientras la segunda hoja entra desde la derecha al hueco que
//                      ella misma acaba de dejar. La forma A se convierte en la forma B: es el mismo
//                      objeto, no hay corte. (lo pide la ficha)
// f862  frontera 2→3 : MATCH-MOVE — la cámara sigue su vector y RETROCEDE 260 px sin cortar; las dos
//                      hojas no se mueven ni un píxel por su cuenta: es el encuadre el que las
//                      muestra juntas y abre el hueco donde nace la resta. (lo pide la ficha)
// f1372 frontera 3→4 : OCLUSIÓN con `V.paper` — la página de la guía, que ya estaba en cuadro como
//                      objeto, cruza y tapa el 100% durante 14 frames; detrás ya está el patio.
//                      El color es el del PAPEL que cruza, jamás el del fondo. (lo pide la ficha)
// f1786 frontera 4→5 : WIPE POR MATERIA con `V.concrete` — el polvo del patio cruza; detrás, la
//                      tercera tarjeta ya creció hasta ser la losa a cuadro completo. (lo pide la
//                      ficha)
// (cuatro costuras distintas · ninguna repite la anterior · ninguna es un fade)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, SeamFlash,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros de los actos
const F_A2 = 420;
const F_A3 = 900;
const F_A4 = 1380;
const F_A5 = 1800;
const ACT_IN = [0, F_A2, F_A3, F_A4, F_A5];
// frames maestros de las costuras
const SEAM_SHAPE = 396;   // MATCH-SHAPE  (1→2)
const SEAM_MOVE = 862;    // MATCH-MOVE   (2→3)
const SEAM_OCC = 1372;    // OCLUSIÓN     (3→4)
const SEAM_WIPE = 1786;   // WIPE MATERIA (4→5)

// tinta sobre papel (legibilidad: el papel es claro, la tinta es oscura de verdad)
const INK = "#1E2018";
const INK_SOFT = "#4A4A3C";
const INK_FAINT = "#8A8570";

// ── EL PAPEL FÍSICO — no es una tarjeta de datos: es una hoja apoyada, con fibra y borde ────
const Hoja: React.FC<{
  g: number; seed: number;
  x: number; y: number; w: number; h: number;
  ry?: number; rx?: number; z?: number; lit?: number; litColor?: string; opacity?: number;
  children?: React.ReactNode;
}> = ({ g, seed, x, y, w, h, ry = 0, rx = 0, z = 0, lit = 1, litColor = V.volt, opacity = 1, children }) => {
  const dy = Math.sin(g / 47 + seed) * 2.6;          // hold VIVO: la hoja nunca está perfectamente quieta
  const dr = Math.sin(g / 71 + seed) * 0.42;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity,
      transform: `translateZ(${z}px) rotateY(${(ry + dr).toFixed(2)}deg) rotateX(${rx}deg) translateY(${dy.toFixed(2)}px)`,
      transformStyle: "preserve-3d",
      borderRadius: 5, overflow: "hidden", padding: 26,
      background: "linear-gradient(168deg, #FAF6EC 0%, #EFE9D9 44%, #E0D8C2 78%, #CFC6AE 100%)",
      // iluminación de producto: sombra de contacto que ATERRIZA + ambiental + bisel del canto
      boxShadow:
        `0 ${Math.round(h * 0.15)}px ${Math.round(h * 0.20)}px ${rgba(V.ink0, 0.80)}, ` +
        `0 6px 20px ${rgba(V.ink0, 0.72)}, ` +
        `inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -22px 44px ${rgba(V.ink0, 0.10)}`,
    }}>
      {children}
      {/* la luz de la escena tiñendo el papel (la hoja vive en ESTE patio, no en un PDF) */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `linear-gradient(158deg, ${rgba(litColor, 0.20 * lit)} 0%, rgba(0,0,0,0) 46%), radial-gradient(90% 70% at 108% 112%, ${rgba(V.amber, 0.16)} 0%, rgba(0,0,0,0) 62%)`,
        mixBlendMode: "multiply",
      }} />
      {/* fibra del papel */}
      <AbsoluteFill style={{
        pointerEvents: "none", opacity: 0.10, mixBlendMode: "multiply",
        backgroundImage: "repeating-linear-gradient(94deg, rgba(90,84,64,.6) 0 1px, rgba(0,0,0,0) 1px 5px)",
      }} />
      {/* canto derecho levantado: la hoja tiene ESPESOR */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, right: 0, width: 9, pointerEvents: "none",
        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.20)} 100%)`,
      }} />
    </div>
  );
};

// ── UNA LÍNEA DEL PRESUPUESTO (se escribe, no aparece) ──────────────────────────────────────
const Linea: React.FC<{ g: number; at: number; label: string; monto: string; dim?: number }> = ({
  g, at, label, monto, dim = 1,
}) => {
  const a = ez(g, at, at + 22);
  if (a <= 0.001) return null;
  const dx = (1 - a) * -18;
  return (
    <div style={{
      display: "flex", alignItems: "baseline", justifyContent: "space-between",
      opacity: a * dim, transform: `translateX(${dx.toFixed(1)}px)`, gap: 12,
    }}>
      <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 26, letterSpacing: 0.4, color: INK_SOFT }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: rgba("#6B6650", 0.34), transform: "translateY(-6px)" }} />
      <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 36, color: INK, letterSpacing: 0.5 }}>{monto}</div>
    </div>
  );
};

// ── EL TOTAL, ENCERRADO A MANO (el gesto del que hace la cuenta en el mostrador) ────────────
const Total: React.FC<{
  g: number; at: number; valor: string; nota?: string; color: string; size?: number;
}> = ({ g, at, valor, nota, color, size = 88 }) => {
  const a = ez(g, at, at + 14);
  if (a <= 0.001) return null;
  const pop = 1 + (1 - a) * 0.17;
  const dash = lerp(960, 0, ez(g, at + 12, at + 72));
  return (
    <div style={{
      position: "relative", width: "100%", height: "100%", opacity: a,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      <svg viewBox="0 0 420 170" preserveAspectRatio="none" style={{
        position: "absolute", left: -10, top: 0, width: "104%", height: "100%", overflow: "visible",
      }}>
        <ellipse cx={206} cy={96} rx={188} ry={64} fill="none" stroke={color} strokeWidth={6}
          strokeLinecap="round" strokeDasharray={960} strokeDashoffset={dash}
          transform="rotate(-3 206 96)" opacity={0.92} />
      </svg>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.94, color: INK,
        transform: `scale(${pop.toFixed(3)})`, transformOrigin: "0% 100%",
      }}>{valor}</div>
      {nota ? (
        <div style={{
          fontFamily: F_BODY, fontWeight: 700, fontSize: 23, letterSpacing: 2.4,
          color: INK_FAINT, textTransform: "uppercase", marginTop: 6,
        }}>{nota}</div>
      ) : null}
    </div>
  );
};

// ── EL COBRE QUE ENTRA DE `MovPeligro` Y SE VUELVE LAS TRES LÍNEAS DEL PRESUPUESTO ──────────
// Tres hebras peladas del alargue quemado: entran torcidas, calientes y naranjas, y se enderezan
// hasta quedar exactamente sobre los renglones. Es LA MATERIA QUE CRUZA la primera frontera.
const Hebras: React.FC<{ g: number; w: number }> = ({ g, w }) => {
  const t = ez(g, 8, 132);
  const fade = 1 - ez(g, 128, 176);
  if (fade <= 0.001) return null;
  const col = light(t, "copper", "ink2");
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fade }}>
      {[0, 1, 2].map((i) => {
        const yTo = 54 + i * 12.5;                       // los tres renglones, en % de la hoja
        const yFrom = 18 + i * 4.2;
        const rotFrom = -17 + i * 3.4;
        const wid = lerp(0.34 + rnd(i * 3.7) * 0.14, 0.86, t) * w;
        return (
          <div key={i} style={{
            position: "absolute", left: `${lerp(-16 + i * 5, 7, t).toFixed(2)}%`,
            top: `${lerp(yFrom, yTo, t).toFixed(2)}%`,
            width: wid, height: lerp(7, 2.4, t),
            borderRadius: 4,
            transform: `rotate(${lerp(rotFrom, 0, t).toFixed(2)}deg)`,
            background: `linear-gradient(90deg, ${rgba(col, 0.25)} 0%, ${col} 16%, ${col} 84%, ${rgba(col, 0.25)} 100%)`,
            boxShadow: `0 0 ${Math.round(lerp(22, 0, t))}px ${rgba(V.danger, 0.55 * (1 - t))}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── TITULAR (una sola idea de texto por acto, sobre cama oscura, safe area 62 px) ────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 62, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 24)) * 26;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 64, width: 720,
      opacity: a, transform: `translateY(${dy.toFixed(1)}px)`,
    }}>
      <Bed pad={26}>
        <div style={{ marginBottom: 10 }}><Kick color={kickColor}>{kick}</Kick></div>
        <Head size={size}>{head}</Head>
        {sub ? <div style={{ marginTop: 12 }}><Body size={30}>{sub}</Body></div> : null}
      </Bed>
    </div>
  );
};

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovCuenta: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si `gFrame` llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : ACT_IN[Math.min(Math.max(acto, 1), 5) - 1];
  // los helpers del Stage (`Readout`, `SeamOcclude`, `SeamWipeMatter`, `SeamFlash`, `sheenAt`)
  // miden con useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: -30, z1: 240, panX: -50, panY: -34, ry: 6, rx: 1.6, dur: 1500 });
  const zAcc =
    eio(0, 92, seg(g, 60, 300)) +          // acto 1: empuje sobre la hoja
    eio(0, 26, seg(g, 470, 700)) +         // acto 2: micro-empuje sobre la segunda hoja
    eio(0, -262, seg(g, SEAM_MOVE, 1012)) +// MATCH-MOVE: el retroceso que muestra las dos juntas
    eio(0, 124, seg(g, 1150, 1330)) +      // acto 3: empuje sobre las ventanas
    eio(0, -168, seg(g, SEAM_OCC, 1540)) + // acto 4: abrimos a plano general del patio
    eio(0, -112, seg(g, SEAM_WIPE, 1980)); // acto 5: la losa respira, la cámara se aparta
  const pxAcc =
    eio(0, -64, seg(g, SEAM_SHAPE, 540)) +
    eio(0, 44, seg(g, SEAM_MOVE, 1040)) +
    eio(0, -58, seg(g, 1160, 1340)) +
    eio(0, 40, seg(g, SEAM_OCC, 1560));
  const pyAcc =
    eio(0, -26, seg(g, 60, 300)) +
    eio(0, 30, seg(g, SEAM_MOVE, 1040)) +
    eio(0, -22, seg(g, SEAM_WIPE, 1960));
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: evoluciona, no salta ──────────────────────────────────────────────────────────
  // danger (heredado de MovPeligro, duro desde arriba) → volt frío (lo que te cobran) → ámbar
  // cálido bajo (la casa, la losa al atardecer). Los dos tramos empalman en el mismo color.
  const cKey = g < 1300
    ? light(seg(g, 0, 250), "danger", "volt")
    : light(seg(g, 1300, 1900), "volt", "amber");
  const cWarm = light(seg(g, 0, 320), "danger", "amber");
  const keyFrom = 0.20 + eio(0, 0.16, seg(g, 0, 300)) + eio(0, 0.22, seg(g, 900, 1400)) + eio(0, 0.24, seg(g, 1700, 2020));
  const intensity = 0.98 + eio(0, -0.10, seg(g, 200, 620)) + eio(0, 0.10, seg(g, 1080, 1300)) + eio(0, -0.22, seg(g, 1660, 2020));
  const floorK = 0.55 + eio(0, 0.14, seg(g, 1620, 2020));

  // ── ACTO 1 · LA HOJA DEL PRESUPUESTO (y el cobre que se vuelve sus renglones) ──────────────
  const mShape = ez(g, SEAM_SHAPE, 486);                 // MATCH-SHAPE 1→2
  const hojaAOp = ez(g, 0, 12);
  const hojaAW = Math.round(lerp(620, 520, mShape));
  const hojaAH = Math.round(lerp(700, 620, mShape));
  const hojaAX = lerp(63, 28.5, mShape);
  const hojaAY = lerp(45, 43, mShape);
  const hojaARy = lerp(-9, 7, mShape);
  const hojaARx = lerp(3, 1.4, mShape);
  // las dos hojas salen de cuadro cuando el protagonista pasa a ser la ventana (acto 3)
  const salidaHojas = ez(g, 1152, 1268);
  const hojasVivas = g < 1276;

  // ── ACTO 2 · LA SEGUNDA HOJA (entra al hueco que dejó la primera) ──────────────────────────
  const mIn = ez(g, 412, 512);
  const hojaBOp = ez(g, 408, 430);
  const hojaBX = lerp(101, 71.5, mIn);
  const hojaBRy = lerp(-26, -7, mIn);
  const hojaBVive = g >= 404;

  // ── ACTO 3 · LA RESTA Y LAS VENTANAS ──────────────────────────────────────────────────────
  const guiaRev = ez(g, 1074, 1140);                     // las dos guías que bajan de los totales
  const ventOp = ez(g, 1148, 1186);
  const ventW = Math.round(lerp(1180, 980, ez(g, 1246, 1330)));
  const ventH = Math.round(ventW * 0.5254);
  const ventX = lerp(50, 41, ez(g, 1246, 1330));
  const ventVive = g >= 1144 && g < SEAM_OCC + 16;
  // LA PÁGINA DE LA GUÍA: objeto vertical real (1588×2246 → 0.707), y la MATERIA de la oclusión
  const lamOp = ez(g, 1252, 1292);
  const lamVive = g >= 1248 && g < SEAM_OCC + 10;

  // ── ACTO 4 · LAS TRES COSAS QUE PERDIÓ ────────────────────────────────────────────────────
  const patioVive = g >= SEAM_OCC - 6;                   // el patio nace TAPADO por el papel
  const c1 = ez(g, 1470, 1526);
  const c2 = ez(g, 1628, 1684);
  const c3 = ez(g, 1744, 1794);
  const salidaC12 = ez(g, SEAM_WIPE - 4, SEAM_WIPE + 16); // se van DEBAJO del polvo
  const c12Vive = g >= 1464 && g < SEAM_WIPE + 18;

  // ── ACTO 5 · LA TERCERA TARJETA CRECE HASTA SER LA LOSA VACÍA ─────────────────────────────
  const grow = ez(g, 1766, 1902);
  const kb = ez(g, 1900, 2040);                          // Ken-Burns final, lentísimo
  const losaW = Math.round(lerp(lerp(480, 2060, grow), 2180, kb));
  const losaH = Math.round(lerp(lerp(330, 1162, grow), 1230, kb));
  const losaX = lerp(79.5, 50, grow);
  const losaY = lerp(45, 50, grow);
  const losaLit = 0.74 + 0.26 * grow;
  const losaLuz = light(seg(g, 1760, 1990), "volt", "amber");

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cWarm} keyFrom={keyFrom} intensity={intensity} floor={floorK} />

      <Layers cam={cam}>
        {/* P0 · plano profundo: el mundo del papel primero, EL PATIO después. El cambio ocurre
            TAPADO por la oclusión de la página, así que nunca se ve un fundido. */}
        {g < SEAM_OCC ? (
          <PhotoPlane
            src="img/cmegenerador/cmeg_mv_cuen1.png" kind="photo" z={-620} scale={1.32}
            dim={lerp(0.68, 0.86, ez(g, 60, 900))} tint={V.volt}
          />
        ) : (
          <PhotoPlane
            src="img/cmegenerador/cmeg_mv_cuen5.png" kind="photo" z={-620} scale={lerp(1.30, 1.16, ez(g, SEAM_OCC, 2040))}
            dim={lerp(0.74, 0.34, ez(g, 1560, 1990))} tint={V.amber}
          />
        )}

        {/* P1 · el suelo: la losa del patio bajo las hojas (acto 1-3), la misma de todo el video */}
        {g < SEAM_OCC && (
          <Plane z={-300}>
            <PadPlane y={80} w={1500} h={330} rx={63}
              lit={0.9 - 0.42 * ez(g, 900, 1340)} z={-40} />
          </Plane>
        )}

        {/* P2 · estructura gráfica: las guías que bajan de los dos totales hasta la resta */}
        <Plane z={-80}>
          {guiaRev > 0.005 && salidaHojas < 0.9 && (
            <svg viewBox="0 0 1920 1080" style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible",
              opacity: guiaRev * (1 - salidaHojas),
            }}>
              <path d="M 547 742 L 547 470 L 862 470" fill="none" stroke={rgba(V.volt, 0.5)} strokeWidth={3}
                strokeDasharray={700} strokeDashoffset={lerp(700, 0, guiaRev)} strokeLinecap="round" />
              <path d="M 1373 742 L 1373 470 L 1058 470" fill="none" stroke={rgba(V.amber, 0.5)} strokeWidth={3}
                strokeDasharray={700} strokeDashoffset={lerp(700, 0, guiaRev)} strokeLinecap="round" />
              <path d="M 916 470 L 1004 470" fill="none" stroke={rgba(V.white, 0.72)} strokeWidth={7}
                strokeLinecap="round" opacity={ez(g, 1112, 1140)} />
            </svg>
          )}
        </Plane>

        {/* P3 · EL MATERIAL REAL — las dos hojas físicas, la ventana, las tres pérdidas, la losa */}
        <Plane z={40}>
          {/* ═══ HOJA A · EL PRESUPUESTO (frío desde arriba: es lo que te cobran) ═══ */}
          {hojasVivas && (
            <Hoja
              g={g} seed={1.7}
              x={hojaAX - salidaHojas * 34} y={hojaAY} w={hojaAW} h={hojaAH}
              ry={hojaARy - salidaHojas * 16} rx={hojaARx} z={0}
              lit={0.9} litColor={V.volt}
              opacity={hojaAOp * (1 - salidaHojas)}
            >
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ height: 38 }}>
                  <Kick color={INK_FAINT}>PRESUPUESTO · 10 AÑOS</Kick>
                </div>
                {/* MATERIAL REAL adentro del papel: el clip del presupuesto impreso */}
                <div style={{ position: "relative", height: Math.round(hojaAH * 0.32) }}>
                  <MediaCard
                    src="broll/cmegenerador/cmeg_mv_cuen1.mp4" kind="video"
                    w={hojaAW - 52} h={Math.round(hojaAH * 0.32)} x={50} y={50} z={0}
                    radius={3} startFrom={6} lit={0.92} litColor={V.volt} sheenAt={at(86)}
                  />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
                  <Linea g={g} at={150} label="EL EQUIPO INSTALADO" monto="9.400" />
                  <Linea g={g} at={192} label="GAS Y PUESTA EN MARCHA" monto="1.100" />
                  <Linea g={g} at={234} label="MANTENIMIENTO · 10 AÑOS" monto="2.000" />
                </div>
                <div style={{ height: Math.round(hojaAH * 0.23) }}>
                  <Total g={g} at={288} valor="$12.500" nota="EN DIEZ AÑOS" color={V.danger} size={86} />
                </div>
              </div>
              {/* el cobre del alargue quemado enderezándose hasta ser los renglones */}
              <Hebras g={g} w={hojaAW - 52} />
            </Hoja>
          )}

          {/* ═══ HOJA B · LO QUE HICIMOS (cálido desde abajo: es lo que de verdad necesitás) ═══ */}
          {hojasVivas && hojaBVive && (
            <Hoja
              g={g} seed={4.3}
              x={hojaBX + salidaHojas * 34} y={43} w={520} h={620}
              ry={hojaBRy + salidaHojas * 16} rx={1.4} z={0}
              lit={0.86} litColor={V.amber}
              opacity={hojaBOp * (1 - salidaHojas)}
            >
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ height: 38 }}>
                  <Kick color={INK_FAINT}>LO QUE HICIMOS</Kick>
                </div>
                {/* MATERIAL REAL adentro del papel: el clip del equipo alineado en el garaje */}
                <div style={{ position: "relative", height: 198 }}>
                  <MediaCard
                    src="broll/cmegenerador/cmeg_mv_cuen2.mp4" kind="video"
                    w={468} h={198} x={50} y={50} z={0}
                    radius={3} startFrom={10} lit={0.9} litColor={V.amber} sheenAt={at(472)}
                  />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
                  <Linea g={g} at={452} label="BATERÍA Y PANEL" monto="1.500" />
                  <Linea g={g} at={520} label="INTERRUPTOR + ELECTRICISTA" monto="400" />
                  {/* el medio litro de aceite del generador chico (f982) */}
                  <Linea g={g} at={986} label="ACEITE, UNA VEZ AL AÑO" monto="½ L" dim={0.72} />
                </div>
                <div style={{ height: 142 }}>
                  <Total g={g} at={653} valor="$1.900" nota="UNA SOLA VEZ" color={V.voltSoft} size={86} />
                </div>
              </div>
            </Hoja>
          )}

          {/* ═══ ACTO 3 · LAS VENTANAS NUEVAS, INSTALADAS ═══ */}
          {ventVive && (
            <div style={{ opacity: ventOp }}>
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_cuen3.mp4" kind="video"
                w={ventW} h={ventH} x={ventX} y={44} z={0}
                ry={lerp(7, -3, ez(g, 1148, 1330))} rx={-1.2} radius={14} startFrom={8}
                lit={0.94} litColor={light(seg(g, 1150, 1360), "volt", "amber")}
                label="LAS VENTANAS QUE LE FALTABAN HACE CUATRO AÑOS" sheenAt={at(1204)}
              />
            </div>
          )}

          {/* ═══ ACTO 4 · LAS TRES COSAS QUE PERDIÓ (cada una con su material real) ═══ */}
          {c12Vive && (
            <>
              <div style={{ opacity: c1 * (1 - salidaC12) }}>
                <MediaCard
                  src="broll/cmegenerador/cmeg_mv_cuen4.mp4" kind="video"
                  w={480} h={330} x={20.5 - salidaC12 * 9} y={45} z={0}
                  ry={lerp(14, 7, c1)} rx={-1} radius={12} startFrom={4}
                  lit={0.88} litColor={V.amber} label="EL ARRANQUE SOLO" sheenAt={at(1492)}
                />
              </div>
              <div style={{ opacity: c2 * (1 - salidaC12) }}>
                <MediaCard
                  src="img/cmegenerador/cmeg_mv_cuen2.png" kind="photo"
                  w={480} h={330} x={50} y={45 - (1 - c2) * 3} z={0}
                  ry={0} rx={-1} radius={12}
                  lit={0.84} litColor={V.amber} label="EL AIRE CENTRAL" sheenAt={at(1650)}
                />
              </div>
            </>
          )}

          {/* LA TERCERA PÉRDIDA · la losa vacía: la tarjeta que CRUZA la última frontera y CRECE
              hasta ser el cuadro entero. Es el objeto protagonista del cierre. */}
          {g >= 1738 && (
            <div style={{ opacity: c3 }}>
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_cuen5.mp4" kind="video"
                w={losaW} h={losaH} x={losaX} y={losaY} z={0}
                ry={lerp(-9, 0, grow)} rx={lerp(-1.4, 0, grow)}
                radius={Math.round(lerp(12, 0, grow))} startFrom={12}
                lit={losaLit} litColor={losaLuz}
                label={g < 1826 ? "DIEZ DÍAS SEGUIDOS" : undefined}
                sheenAt={at(1758)}
              />
            </div>
          )}
        </Plane>

        {/* P4 · objetos de la escena: la página de la guía, los íconos, la cifra de la resta */}
        <Plane z={120}>
          {/* LA PÁGINA REAL DE LA GUÍA (vertical 1588×2246 → 340×481, jamás estirada).
              Después es LA MATERIA que cruza y tapa el cuadro en la oclusión. */}
          {lamVive && (
            <div style={{ opacity: lamOp }}>
              <MediaCard
                src="img/cmegenerador/cmeg_lam_cuenta2anos.png" kind="photo"
                w={340} h={481} x={82} y={58} z={0}
                ry={lerp(-22, -9, ez(g, 1252, 1340))} rx={2} rot={-2} radius={8}
                lit={0.95} litColor={V.amber} label="LA CUENTA A DOS AÑOS" sheenAt={at(1300)}
              />
            </div>
          )}

          {/* LA RESTA — la cifra que justifica todo, exactamente en el beat (f1111) */}
          {g >= 1109 && salidaHojas < 0.96 && (
            <Readout value="10.600" unit="USD" label="DE DIFERENCIA" at={at(1111)}
              x={50} y={26} size={148} color={V.volt} />
          )}

          {/* el sello del pago único sobre la hoja B (f700) */}
          {g >= 698 && g < 1250 && (
            <div style={{ opacity: ez(g, 698, 726) * (1 - salidaHojas) }}>
              <IconPng src="img/cmegenerador/cmeg_ic_sello.png" x={83} y={62} size={104} z={0} rot={-11} glow={V.ink0} />
            </div>
          )}

          {/* los tres íconos de las tres pérdidas, cada uno sobre su tarjeta */}
          {c12Vive && (
            <>
              <div style={{ opacity: c1 * (1 - salidaC12) }}>
                <IconPng src="img/cmegenerador/cmeg_ic_breaker.png" x={20.5 - salidaC12 * 9} y={26} size={82} z={0} glow={V.ink0} />
              </div>
              <div style={{ opacity: c2 * (1 - salidaC12) }}>
                <IconPng src="img/cmegenerador/cmeg_ic_termometro.png" x={50} y={26} size={82} z={0} glow={V.ink0} />
              </div>
            </>
          )}
          {g >= 1744 && g < SEAM_WIPE + 12 && (
            <div style={{ opacity: c3 * (1 - ez(g, 1768, 1790)) }}>
              <IconPng src="img/cmegenerador/cmeg_ic_calendario.png" x={79.5} y={26} size={82} z={0} glow={V.ink0} />
            </div>
          )}
        </Plane>

        {/* P5 · primer plano: el polvo del patio (hold VIVO — nunca hay un frame quieto) */}
        <Plane z={240}>
          {Array.from({ length: 18 }, (_, i) => {
            const sp = 0.35 + rnd(i * 4.7) * 1.05;
            const yy = ((rnd(i * 8.3) * 132 - (g * sp) / 24) % 132 + 132) % 132 - 13;
            const s = 2 + rnd(i * 2.9) * 3.2;
            const a = (0.08 + rnd(i * 3.7) * 0.2) * (0.55 + 0.45 * ez(g, SEAM_OCC, 1900));
            return (
              <div key={i} style={{
                position: "absolute", left: `${(6 + rnd(i * 6.1) * 88).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cWarm, a),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cWarm, a * 0.7)}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURAS (encima de todo · ninguna es un fade · ninguna repite a la anterior) ── */}
      {/* f1372 · frontera 3→4: LA PÁGINA DE PAPEL cruza y tapa el 100%; detrás ya está el patio */}
      <SeamOcclude at={at(SEAM_OCC)} dur={14} color={V.paper} angle={7} />
      {/* f1786 · frontera 4→5: EL POLVO DEL PATIO cruza; detrás, la losa ya ocupa el cuadro */}
      <SeamWipeMatter at={at(SEAM_WIPE)} dur={22} tint={V.concrete} />
      {/* luces de EVENTO (no son costuras): la cifra que aterriza */}
      <SeamFlash at={at(290)} color={V.paper} dur={6} />
      <SeamFlash at={at(1111)} color={V.volt} dur={7} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 62 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={96} outF={368} kick="EL PRESUPUESTO" head="DOCE MIL QUINIENTOS"
          sub="El equipo, el gas y diez años de mantenimiento." size={62} kickColor={V.danger} />
        <Titular g={g} inF={438} outF={846} kick="LO QUE HICIMOS" head="MIL NOVECIENTOS, UNA VEZ"
          sub="Escalón tres más el interruptor de transferencia." size={58} kickColor={V.amber} />
        <Titular g={g} inF={1122} outF={1346} kick="LA RESTA" head="DIEZ MIL SEISCIENTOS"
          sub="Con eso puso las ventanas que le faltaban. Y le sobró." size={60} />
        <Titular g={g} inF={1398} outF={1608} kick="SEAMOS HONESTOS" head="QUÉ PERDIÓ"
          sub="Tres cosas, y te las digo todas." size={74} kickColor={V.danger} />
        <Titular g={g} inF={1868} outF={2004} kick="DIEZ DÍAS SIN HACER NADA" head="LA LOSA SIGUE VACÍA"
          sub="Nada encima. Y la casa anduvo igual." size={64} kickColor={V.amber} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
