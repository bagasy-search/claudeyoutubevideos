// MovTercios.tsx — S2 · UN MOVIMIENTO CONTINUO de 50,1 s (1503 frames @ 30 fps)
// Canal "Claudio Mendoza Constructor" · video `cmesilencio` · arranca en el segundo 122,40.
//
// LA ESPINA: el espectador cree que el ruido sale del escape. El escape es UN TERCIO, y encima ya
// viene resuelto de fábrica. Los otros dos tercios son el BLOQUE DEL MOTOR golpeando (suena el
// metal, no un tubo) y el VENTILADOR DE REFRIGERACIÓN moviendo un río de aire (el rugido grave que
// se dobla en el muro y se te mete en la casa). Y encima de los tres, la TAPA DE LÁMINA FINA, que
// vibra como el cono de un parlante y multiplica todo lo demás.
//
// LA CÁMARA arranca alta y lejos sobre el patio (herencia del hook) y NO vuelve a cero en ninguno
// de los cinco actos: baja y se acerca hasta el macro de la lámina temblando, que es lo que este
// movimiento le ENTREGA al plano siguiente.
//
// ⛔ CONTRATO: una sola <Sequence> (los actos se recortan por RANGO de `g` y se pisan 20-30 cuadros)
// ⛔ sin Math.random / Date.now (todo sale de `rnd(k)` y de `g`) · rutas de asset SOLO literales de
// ⛔ la ficha · `light()` sólo con claves de `V` · la atmósfera se monta UNA vez, arriba de todo.
// ⚠️ Los componentes del Stage que reciben `at`/`sheenAt` razonan en frames LOCALES de la Sequence:
//    se traducen con L(). (Acá local == global, pero L() lo deja blindado si el montaje cambia.)

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, SoundField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, zoomThrough, SeamFlash,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1503;
const A2 = 300;
const A3 = 645;
const A4 = 975;
const A5 = 1281;

// LAS CUATRO COSTURAS INTERNAS (+ la de salida)
const S12 = 286;    // 1→2 zoom-through por la boca del escape
const S23 = 631;    // 2→3 wipe de materia: la pala del ventilador barre
const S34 = 961;    // 3→4 la cámara sigue (no hay cobertura: es puro recorrido)
const S45 = 1267;   // 4→5 occluder: la tapa de lámina pasa por delante del lente
const SOUT = 1438;  // 5→siguiente: metamorfosis anillo → contorno del nudillo

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ── LA TAJADA: el hueco vertical de aire apoyado contra la máquina. Es ESTRUCTURA (un casillero),
//    no un objeto disfrazado: por eso es un marco, y adentro entra SIEMPRE material real.
const Tajada: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  on: number; llena: number; tint: string; nombre: string; g: number;
}> = ({ x, y, w, h, z = 0, on, llena, tint, nombre, g }) => {
  if (on <= 0.01) return null;
  const late = 0.5 + 0.5 * Math.sin(g / 11 + x);
  const vacio = 1 - clamp01(llena);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2,
      transform: `translateZ(${z}px)`,
      opacity: clamp01(on),
      borderRadius: 8,
      border: `${(1 + vacio * 1.2).toFixed(2)}px ${vacio > 0.35 ? "dashed" : "solid"} ${rgba(tint, 0.16 + 0.34 * (vacio * late) + 0.28 * (1 - vacio))}`,
      background: `linear-gradient(180deg, ${rgba(V.ink1, 0.24 * vacio)} 0%, ${rgba(V.ink0, 0.08 * vacio)} 100%)`,
      boxShadow: vacio > 0.35 ? `inset 0 0 ${Math.round(30 + 26 * late)}px ${rgba(tint, 0.09 * late)}` : "none",
    }}>
      <div style={{
        position: "absolute", left: 0, right: 0, top: -30, textAlign: "center",
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 21, letterSpacing: 3,
        color: rgba(V.white, 0.34 + 0.46 * clamp01(llena)), textTransform: "uppercase",
        textShadow: "0 3px 14px rgba(0,0,0,0.92)",
      }}>{nombre}</div>
    </div>
  );
};

// ── LAS LIMADURAS que saltan de la lámina cuando la chapa se abomba (acto 5). Es materia real de
//    la escena (polvo y virutas), determinista por `rnd`.
const Limaduras: React.FC<{ g: number; on: number; amp: number }> = ({ g, on, amp }) => {
  if (on <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: clamp01(on) }}>
      {Array.from({ length: 34 }, (_, i) => {
        const fase = (g / (46 + rnd(i * 3.7) * 40) + rnd(i * 9.1)) % 1;
        const salto = Math.sin(fase * Math.PI);
        const sz = 2 + rnd(i * 5.9) * 4;
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${(6 + rnd(i * 2.3) * 88).toFixed(2)}%`,
            top: `${(72 - salto * (14 + rnd(i * 7.1) * 22) * amp).toFixed(2)}%`,
            width: sz, height: sz, borderRadius: sz,
            background: rgba(V.steel, 0.28 + 0.5 * salto),
            boxShadow: `0 0 ${Math.round(4 + 9 * salto)}px ${rgba(V.volt, 0.24 * salto)}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

export const MovTercios: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El montaje puede envolver el movimiento en su propia <Sequence>: el frame LOCAL no tiene por
  // qué ser el global. `L()` traduce los `at` de los componentes del Stage.
  const lFrame = useCurrentFrame();
  const off = (gFrame ?? lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  // red de seguridad: sin gFrame usable, arranco en la cabecera del acto pedido
  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame as number)
    ? (gFrame as number)
    : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola llamada, función de g, que NUNCA vuelve a 0 ═══════════════════════
  // alta y lejos sobre el patio (z −190) → macro sobre la lámina (z +262). Baja todo el tramo.
  const camB = gcam(g, { z0: -190, z1: 120, panX: -52, panY: 30, ry: -5.2, rx: 2.6, dur: END });
  const camZ = ip(g,
    [0, 140, S12, A2, 470, S23, A3, 820, S34, A4, 1130, S45, A5, 1400, END],
    [-124, -74, -18, -22, 12, -6, 30, 66, 60, 92, 128, 158, 198, 240, 268]);
  const camDrop = ip(g, [0, A2, A3, A4, A5, END], [-42, -18, 2, 26, 56, 78]);
  const camTilt = ip(g, [0, A2, A3, A4, A5, END], [3.4, 2.3, 1.3, 0.3, -1.1, -2.0]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg)`;
  // la deriva de la cámara, replicada en el HUD: el texto no queda pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.42).toFixed(2)}px, ${(by * 0.42).toFixed(2)}px)`;

  // ══ LA LUZ — sky frío → volt (la medición) → steel (el metal del ventilador) + acento volt ══
  const pSkyVolt = ip(g, [0, 240, 470, A3], [0, 0.24, 0.68, 1]);
  const pVoltSteel = ip(g, [900, 1010, S45, END], [0, 0.55, 1, 1]);
  const tintA = g < 900 ? light(pSkyVolt, "sky", "volt") : light(pVoltSteel, "volt", "steel");
  const tintB = light(ip(g, [0, A4, 1130, S45, 1360, END], [0, 0, 0.14, 0.58, 0.9, 1]), "amber", "volt");
  const keyFrom = ip(g, [0, A2, A3, A4, A5, END], [0.20, 0.28, 0.36, 0.52, 0.62, 0.68]);
  const inten = ip(g, [0, 120, A3, S34, A5, END], [0.82, 0.96, 1.06, 0.96, 1.02, 1.08]);
  const floor = ip(g, [0, A3, A5, END], [0.58, 0.60, 0.52, 0.44]);

  // ══ ACTO 1 — el prejuicio: el escape ═══════════════════════════════════════════════════════
  // zoom-through por la boca del escape: la cámara ENTRA en el caño y sale del otro lado.
  const zt = zoomThrough(g, S12, 24, 76, 52);
  const a1On = ip(g, [0, 10], [0, 1]);
  // el tercio que se tiñe de voltio, se desprende del campo y se retira hacia la tarjeta
  const tercioX = ip(g, [104, 236], [38, 74]);
  const tercioY = ip(g, [104, 236], [61, 42]);
  const tercioSp = ip(g, [104, 236], [88, 22]);
  const tercioOn = ip(g, [72, 108, 196, 244], [0, 0.95, 0.95, 0]);
  // la tarjeta del silenciador: docka sobre el escape encendido
  const escX = ip(g, [40, 96, A2, 400, 470, 1503], [86, 74, 74, 82, 90, 90]);
  const escY = ip(g, [40, 96, A2, 400, 470, 1503], [40, 40, 41, 30, 19, 19]);
  const escW = ip(g, [40, 96, A2, 400, 470, 1503], [420, 452, 452, 300, 214, 214]);
  const escH = ip(g, [40, 96, A2, 400, 470, 1503], [272, 292, 292, 196, 138, 138]);
  const escLit = ip(g, [40, 96, 470, 1000, 1503], [0.5, 1, 0.86, 0.66, 0.6]);
  const escOn = ip(g, [34, 56, 1420, 1466], [0, 1, 1, 0]);

  // ══ ACTO 2 — las tres tajadas ══════════════════════════════════════════════════════════════
  const tajOn = ip(g, [318, 356, 916, 968], [0, 1, 1, 0]);
  const tajH = ip(g, [318, 420, A3, S34], [520, 560, 540, 470]);
  const tajW = ip(g, [318, 420, A3, S34], [356, 372, 356, 320]);
  const tajY = ip(g, [318, A3, S34], [47, 46, 44]);
  // la del ESCAPE se cierra y se archiva contra el borde derecho
  const tajEscOn = ip(g, [318, 356, 430, 476], [0, 1, 1, 0]);
  // la del MOTOR se llena en g≈520 con el bloque de aluminio
  const motorLleno = ip(g, [498, 566], [0, 1]);
  const motorX = ip(g, [470, 566, A3, 780, 900], [50, 50, 47, 42, 34]);
  const motorY = ip(g, [470, 566, A3, 900], [46, 46, 45, 47]);
  const motorW = ip(g, [470, 566, A3, 820, 968], [330, 392, 470, 520, 430]);
  const motorH = ip(g, [470, 566, A3, 820, 968], [230, 268, 316, 348, 290]);
  const motorOn = ip(g, [486, 520, 940, 990], [0, 1, 1, 0]);
  // la del VENTILADOR queda VACÍA y late pidiendo contenido; en el acto 4 vuela y se vuelve el
  // marco de la tarjeta grande de la rejilla (metamorfosis de la estructura).
  const venX = ip(g, [318, A4, 1040], [26, 26, 50]);
  const venW = ip(g, [318, A4, 1040], [356, 320, 1160]);
  const venH = ip(g, [318, A4, 1040], [520, 470, 740]);
  const venY = ip(g, [318, A4, 1040], [47, 44, 46]);
  const venOn = ip(g, [318, 356, 1030, 1062], [0, 1, 1, 0]);

  // ══ ACTO 3 — el bloque del motor: suena por todas partes ═══════════════════════════════════
  const pistOn = ip(g, [660, 700, 946, 986], [0, 1, 1, 0]);
  const pistX = ip(g, [660, 820, 986], [44, 40, 30]);
  const pistW = ip(g, [660, 820, 986], [470, 540, 470]);
  const pistH = ip(g, [660, 820, 986], [300, 344, 300]);
  const GOLPE = 846;
  const golpeOn = ip(g, [800, 832, 908, 944], [0, 1, 1, 0]);
  const golpeY = ipe(g, [800, GOLPE], [-16, 25], Easing.out(Easing.cubic));
  // el metal responde: los anillos se disparan al doble de amplitud y la carcasa vibra
  const resonancia = ip(g, [GOLPE, GOLPE + 8, GOLPE + 70, GOLPE + 130], [0, 1, 0.5, 0.18]);
  const vibra = resonancia * Math.sin(g / 2.6) * 5.2;

  // ══ ACTO 4 — el ventilador: el río de aire y el rugido grave ═══════════════════════════════
  const rejOn = ip(g, [900, 944, 1444, 1490], [0, 1, 1, 0]);
  const rejX = ip(g, [900, S34, A4, 1040, S45, A5, END], [118, 92, 74, 50, 50, 50, 50]);
  const rejY = ip(g, [900, A4, 1040, S45, END], [48, 47, 46, 47, 47]);
  const rejW = ip(g, [900, S34, A4, 1040, 1180, S45, END], [420, 520, 760, 1160, 1300, 1560, 1780]);
  const rejH = ip(g, [900, S34, A4, 1040, 1180, S45, END], [560, 640, 700, 740, 830, 980, 1120]);
  const rejLit = ip(g, [900, A4, S45, END], [0.6, 0.94, 0.9, 0.72]);
  // la BANDA GRAVE: anillos larguísimos y separados, a ras del piso, que se doblan en el muro
  const bandaOn = ip(g, [1046, 1096, 1250, 1292], [0, 1, 1, 0]);
  const bandaY = ip(g, [1046, 1140, 1250], [78, 85, 83]);
  // la ventana amarilla del vecino: el único ámbar del acto
  const ventanaOn = ip(g, [1096, 1148, 1244, 1276], [0, 1, 1, 0]);
  const ventanaX = ip(g, [1096, 1250], [86, 80]);

  // ══ ACTO 5 — la lámina: el multiplicador ═══════════════════════════════════════════════════
  const a5On = ip(g, [S45, 1292], [0, 1]);
  const abomba = Math.sin(g / 3.1) * 0.014 + Math.sin(g / 7.4) * 0.006;
  const resumenOn = ip(g, [1316, 1356, 1462, 1496], [0, 1, 1, 0]);
  const resumenY = ipe(g, [1316, 1372], [-8, 12], Easing.out(Easing.cubic));
  // METAMORFOSIS DE SALIDA: el último anillo que nace de la chapa se cierra sobre sí mismo y se
  // vuelve el contorno del nudillo que va a golpearla.
  const metaP = ip(g, [SOUT, END], [0, 1]);
  const metaR = ip(g, [SOUT, 1478, END], [430, 210, 44]);
  const metaW = ip(g, [SOUT, 1478, END], [860, 620, 660]);
  const metaH = ip(g, [SOUT, 1478, END], [860, 560, 470]);
  const metaOn = ip(g, [SOUT, SOUT + 26], [0, 1]);

  // ══ EL CAMPO DE SONIDO — db 78 en todo el movimiento: acá el ruido todavía está ENTERO ══════
  const campoOn = ip(g, [0, 16, S23, 668], [0, 1, 1, 0.5]);
  const campoX = ip(g, [0, A2, 470, S23], [38, 40, 44, 46]);
  const campoY = ip(g, [0, A2, S23], [61, 58, 56]);

  // ══ TEXTOS — UNA idea por acto ═════════════════════════════════════════════════════════════
  const t1 = ip(g, [64, 92, 244, 272], [0, 1, 1, 0]);
  const t2 = ip(g, [376, 404, 592, 620], [0, 1, 1, 0]);
  const t3 = ip(g, [704, 732, 918, 946], [0, 1, 1, 0]);
  const t4 = ip(g, [1048, 1078, 1218, 1250], [0, 1, 1, 0]);
  const t5 = ip(g, [1312, 1344, 1440, 1470], [0, 1, 1, 0]);

  // fondos: SÓLO cambian tapados por una costura (el wipe de g631 y el occluder de g1267)
  const fondoPatio = g < 640;
  const fondoMotor = g >= S23 && g < 1275;
  const fondoChapa = g >= S45;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca; sólo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      <Layers cam={camT}>
        {/* ── EL FONDO: el patio → las tripas de la máquina → la chapa ───────────────────── */}
        {fondoPatio && (
          <PhotoPlane src="broll/cmesilencio/cms_s2_patio_desde_calle.mp4" kind="video" z={-660}
            scale={ip(g, [0, 640], [1.16, 1.26])}
            dim={ip(g, [0, 140, A2, 640], [0.34, 0.42, 0.52, 0.66])} tint={V.sky} />
        )}
        {fondoMotor && (
          <PhotoPlane src="broll/cmesilencio/cms_s2_laberinto_carcasa_corte.mp4" kind="video" z={-640}
            scale={ip(g, [S23, A4, 1275], [1.30, 1.20, 1.16])}
            dim={ip(g, [S23, A3, A4, 1275], [0.66, 0.58, 0.66, 0.74])} tint={V.volt} />
        )}
        {fondoChapa && (
          <PhotoPlane src="broll/cmesilencio/cms_s2_chapa_tamborilea_polvo.mp4" kind="video" z={-600}
            scale={1.20 + abomba * a5On} dim={ip(g, [S45, 1340, END], [0.60, 0.44, 0.38])} tint={V.steel} />
        )}

        {/* ── EL SUELO DEL PATIO: mientras estamos lejos, el concreto sostiene todo ──────── */}
        {g < 700 && (
          <PadPlane y={ip(g, [0, A2, 700], [78, 84, 96])} w={1620} h={330} rx={63}
            lit={ip(g, [0, A2, 700], [0.9, 0.72, 0.2])} z={-180} />
        )}

        {/* ════════ ACTO 1 · EL ESCAPE (g 0 → 318) ═══════════════════════════════════════ */}
        {g < 318 && (
          <AbsoluteFill style={{
            transformStyle: "preserve-3d",
            transform: zt.out === "none" ? undefined : zt.out,
            opacity: a1On * zt.opacity,
          }}>
            {/* el escape encendido: el único punto en volt de todo el cuadro */}
            <Plane z={20}>
              <div style={{
                position: "absolute", left: "76%", top: "56%", width: 320, height: 320,
                marginLeft: -160, marginTop: -160, borderRadius: "50%",
                background: `radial-gradient(circle, ${rgba(V.volt, 0.26 * ip(g, [26, 74], [0, 1]))} 0%, rgba(0,0,0,0) 66%)`,
              }} />
              <IconPng src="img/cmesilencio/cms_ic_escape.png" x={76} y={57}
                size={ip(g, [26, 92], [72, 116])} z={10}
                opacity={ip(g, [26, 74, 250, 292], [0, 0.95, 0.95, 0])}
                rot={ip(g, [26, 292], [-6, 4])} glow={V.ink0} />
            </Plane>
          </AbsoluteFill>
        )}

        {/* LA TARJETA DEL SILENCIADOR — nace en el acto 1 y sobrevive archivada al borde:
            es el tercio que YA está resuelto, y se queda a la vista como prueba. */}
        {escOn > 0.01 && (
          <Plane z={40}>
            <MediaCard src="broll/cmesilencio/cms_s2_costura_carcasa_inversor.mp4" kind="video"
              w={escW} h={escH} x={escX} y={escY} z={ip(g, [40, A2, 470], [10, 26, -60])}
              ry={ip(g, [40, 470], [-9, -16])} radius={12}
              lit={escLit} litColor={V.volt} opacity={escOn}
              label={g < 500 ? "SILENCIADOR DE FÁBRICA" : undefined}
              sheenAt={L(112)} />
          </Plane>
        )}

        {/* ════════ ACTO 2 · LAS TRES TAJADAS (g 294 → 663) ══════════════════════════════ */}
        {g >= 294 && g < 995 && (
          <Plane z={-20}>
            <Tajada x={74} y={tajY} w={tajW} h={tajH} z={-10} on={tajOn * tajEscOn}
              llena={1} tint={V.volt} nombre="Escape" g={g} />
            <Tajada x={motorX} y={tajY} w={tajW} h={tajH} z={-10} on={tajOn}
              llena={motorLleno} tint={V.volt} nombre="Motor" g={g} />
            <Tajada x={venX} y={venY} w={venW} h={venH} z={-10} on={tajOn * venOn}
              llena={ip(g, [A4, 1030], [0, 1])} tint={V.steel} nombre="Ventilador" g={g} />
          </Plane>
        )}

        {/* EL BLOQUE DEL MOTOR — llena la segunda tajada con material REAL */}
        {motorOn > 0.01 && (
          <Plane z={0}>
            <MediaCard src="img/cmesilencio/cms_s2_sopesa_inversor_chico.jpg" kind="photo"
              w={motorW} h={motorH} x={motorX} y={motorY} z={ip(g, [486, A3, 968], [-30, 10, -20])}
              ry={ip(g, [486, 968], [6, -4])} radius={10}
              lit={ip(g, [486, 566, 968], [0.5, 1, 0.8])} litColor={V.volt} opacity={motorOn}
              label={g < 720 ? "EL BLOQUE DEL MOTOR" : undefined} sheenAt={L(540)} />
            <IconPng src="img/cmesilencio/cms_ic_motor.png" x={motorX} y={motorY - 13}
              size={ip(g, [498, 566], [46, 82])} z={40}
              opacity={ip(g, [498, 552, 900, 962], [0, 0.92, 0.92, 0])}
              rot={ip(g, [498, 962], [-8, 5])} glow={V.ink0} />
          </Plane>
        )}

        {/* ════════ ACTO 3 · EL PISTÓN Y EL GOLPE (g 638 → 995) ══════════════════════════ */}
        {pistOn > 0.01 && (
          <Plane z={30} style={{
            transform: `translateZ(30px) translate(${vibra.toFixed(2)}px, ${(vibra * 0.6).toFixed(2)}px)`,
            transformStyle: "preserve-3d",
          }}>
            <MediaCard src="broll/cmesilencio/cms_s2_recorte_viruta_borde.mp4" kind="video"
              w={pistW} h={pistH} x={pistX} y={ip(g, [660, 986], [45, 52])} z={20}
              ry={ip(g, [660, 986], [-5, 8])} radius={12}
              lit={ip(g, [660, 700, 986], [0.5, 1, 0.82])} litColor={V.volt} opacity={pistOn}
              label={g < 900 ? "PISTÓN Y VÁLVULAS" : undefined} sheenAt={L(714)} />
          </Plane>
        )}
        {/* EL GOLPE: entra por el borde superior, golpea una vez, y el metal responde */}
        {golpeOn > 0.01 && (
          <Plane z={70}>
            <MediaCard src="broll/cmesilencio/cms_s2_nudillo_golpea_tapa.mp4" kind="video"
              w={330} h={214} x={64} y={golpeY} z={70} rot={ip(g, [800, GOLPE], [-9, -2])}
              radius={10} lit={ip(g, [800, GOLPE], [0.55, 1])} litColor={V.volt}
              opacity={golpeOn} label="UN GOLPE" sheenAt={L(GOLPE)} />
          </Plane>
        )}

        {/* ════════ ACTO 4 · LA REJILLA DEL VENTILADOR (g 955 → 1300) ════════════════════ */}
        {rejOn > 0.01 && (
          <Plane z={10}>
            <MediaCard src="broll/cmesilencio/cms_s2_rejilla_inversor_chico.mp4" kind="video"
              w={rejW} h={rejH} x={rejX} y={rejY} z={ip(g, [900, A4, END], [-40, 0, 60])}
              ry={ip(g, [900, A4, 1120, END], [-14, -4, 0, 0])} radius={ip(g, [900, 1120, END], [12, 8, 4])}
              lit={rejLit} litColor={V.steel} opacity={rejOn}
              label={g >= A4 && g < 1180 ? "EL RÍO DE AIRE" : undefined} sheenAt={L(1004)} />
            <IconPng src="img/cmesilencio/cms_ic_ventilador.png" x={ip(g, [A4, 1200], [22, 16])} y={22}
              size={ip(g, [A4, 1060], [66, 104])} z={80}
              opacity={ip(g, [982, 1032, 1204, 1246], [0, 0.92, 0.92, 0])}
              rot={ip(g, [982, 1246], [0, 46])} glow={V.ink0} />
          </Plane>
        )}

        {/* LA VENTANA AMARILLA DEL VECINO: el único ámbar del acto, del otro lado del muro */}
        {ventanaOn > 0.01 && (
          <Plane z={-140}>
            <div style={{
              position: "absolute", left: `${ventanaX}%`, top: "56%", width: 210, height: 148,
              marginLeft: -105, marginTop: -74, opacity: ventanaOn,
              background: `linear-gradient(172deg, ${rgba(V.amber, 0.62)} 0%, ${rgba(V.amber, 0.30)} 100%)`,
              boxShadow: `0 0 120px ${rgba(V.amber, 0.34)}, inset 0 0 30px ${rgba(V.torch, 0.4)}`,
              border: `2px solid ${rgba(V.ink0, 0.7)}`,
            }}>
              <div style={{
                position: "absolute", left: "50%", top: 0, bottom: 0, width: 3, marginLeft: -1.5,
                background: rgba(V.ink0, 0.66),
              }} />
            </div>
            <IconPng src="img/cmesilencio/cms_ic_aire.png" x={ip(g, [1096, 1276], [58, 70])} y={80}
              size={ip(g, [1096, 1180], [58, 92])} z={30}
              opacity={ventanaOn * 0.9} rot={ip(g, [1096, 1276], [-4, 6])} glow={V.ink0} />
          </Plane>
        )}

        {/* ════════ ACTO 5 · LA LÁMINA QUE VIBRA (g 1272 → 1503) ═════════════════════════ */}
        {/* las tres tajadas vuelven achicadas al borde superior, ya llenas y ordenadas */}
        {resumenOn > 0.01 && (
          <Plane z={90}>
            {[
              { x: 30, src: "img/cmesilencio/cms_s2_palma_tapa_patio.jpg", ic: "img/cmesilencio/cms_ic_escape.png", n: "ESCAPE" },
              { x: 50, src: "img/cmesilencio/cms_s2_sopesa_inversor_chico.jpg", ic: "img/cmesilencio/cms_ic_motor.png", n: "MOTOR" },
              { x: 70, src: "img/cmesilencio/cms_s2_pasillo_inversores_tienda.jpg", ic: "img/cmesilencio/cms_ic_ventilador.png", n: "VENTILADOR" },
            ].map((it, i) => (
              <MediaCard key={i} src={it.src} kind="photo" w={224} h={140}
                x={it.x} y={resumenY + i * 0.4} z={40} ry={(i - 1) * 5} radius={8}
                lit={0.9} litColor={V.volt} opacity={resumenOn} label={it.n}
                sheenAt={L(1360 + i * 16)} />
            ))}
            <IconPng src="img/cmesilencio/cms_ic_lamina.png" x={50} y={resumenY + 15}
              size={ip(g, [1352, 1404], [58, 104])} z={60}
              opacity={ip(g, [1352, 1396, 1452, 1486], [0, 0.95, 0.95, 0])}
              rot={ip(g, [1352, 1486], [-5, 4])} glow={V.ink0} />
          </Plane>
        )}

        {/* METAMORFOSIS DE SALIDA: el anillo se cierra y se vuelve el contorno del nudillo */}
        {metaOn > 0.01 && (
          <Plane z={120}>
            <MediaCard src="img/cmesilencio/cms_s2_nudillo_golpea_tapa.jpg" kind="photo"
              w={metaW} h={metaH} x={50} y={52} z={80} radius={metaR}
              lit={0.94} litColor={V.volt} opacity={metaOn} sheenAt={L(1466)} />
            <div style={{
              position: "absolute", left: "50%", top: "52%",
              width: metaW + 26, height: metaH + 26,
              marginLeft: -(metaW + 26) / 2, marginTop: -(metaH + 26) / 2,
              borderRadius: metaR + 13, opacity: metaOn * (1 - metaP * 0.4),
              border: `${(2 + metaP * 3).toFixed(1)}px solid ${rgba(V.volt, 0.30 + 0.34 * metaP)}`,
              boxShadow: `0 0 ${Math.round(30 + 70 * metaP)}px ${rgba(V.volt, 0.20)}`,
            }} />
          </Plane>
        )}
      </Layers>

      {/* ══════ EL CAMPO DE SONIDO — db 78: el ruido todavía está ENTERO y satura ═════════ */}
      {/* el campo principal, saliendo del generador */}
      {campoOn > 0.01 && (
        <SoundField db={78} x={campoX} y={campoY} on={campoOn}
          tint={light(pSkyVolt, "sky", "volt")} speed={1} spread={ip(g, [0, S23], [92, 74])} />
      )}
      {/* el TERCIO del escape: se tiñe de voltio y se retira hacia la tarjeta hasta apagarse */}
      {tercioOn > 0.01 && (
        <SoundField db={78} x={tercioX} y={tercioY} on={tercioOn} tint={V.volt}
          speed={1.35} spread={tercioSp} />
      )}
      {/* ACTO 3: el motor suena ESFÉRICO — no sale por ningún tubo, sale del metal entero */}
      {g >= 638 && g < 1000 && (
        <SoundField db={78} x={ip(g, [645, 986], [46, 36])} y={ip(g, [645, 986], [50, 54])}
          on={ip(g, [638, 682, 950, 998], [0, 0.92, 0.92, 0]) * (1 + resonancia * 0.6)}
          tint={V.volt} speed={1 + resonancia * 0.9} spread={ip(g, [645, GOLPE, GOLPE + 20, 986], [54, 58, 104, 92])} />
      )}
      {/* ACTO 4: LA BANDA GRAVE — anillos larguísimos y separados, a ras del piso, que se
          DOBLAN contra el muro bajo y siguen del otro lado hasta la ventana del vecino */}
      {bandaOn > 0.01 && (
        <SoundField db={78} x={ip(g, [1046, 1250], [46, 42])} y={bandaY} wall={66} on={bandaOn}
          tint={V.steel} speed={0.5} spread={ip(g, [1046, 1180, 1250], [110, 148, 156])} />
      )}
      {/* ACTO 5: los anillos nacen de TODA la superficie de la chapa, no de un punto */}
      {a5On > 0.01 && (
        <AbsoluteFill style={{ opacity: a5On, pointerEvents: "none" }}>
          <SoundField db={78} x={30} y={56} on={0.7} tint={V.steel} speed={1.6} spread={38} />
          <SoundField db={78} x={54} y={64} on={0.62} tint={V.volt} speed={1.9} spread={34} />
          <SoundField db={78} x={72} y={49} on={0.66} tint={V.steel} speed={1.45} spread={40} />
        </AbsoluteFill>
      )}
      {/* las limaduras que saltan de la lámina abombándose */}
      <Limaduras g={g} on={a5On * ip(g, [1440, 1490], [1, 0])} amp={1 + Math.sin(g / 3.1) * 0.3} />

      {/* ══════ COSTURAS ══════════════════════════════════════════════════════════════════ */}
      {/* 2→3 · WIPE DE MATERIA: la pala del ventilador barre el cuadro de derecha a izquierda */}
      <SeamWipeMatter at={L(S23 - 14)} dur={30} tint={V.steel} />
      {g >= S23 - 18 && g < S23 + 22 && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "-30%", height: "160%", width: "46%",
            left: `${lerp(112, -58, clamp01((g - (S23 - 18)) / 40)).toFixed(1)}%`,
            transform: "rotate(-13deg)",
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.steel, 0.30)} 18%, ${rgba(V.ink0, 0.72)} 52%, ${rgba(V.steel, 0.22)} 84%, rgba(0,0,0,0) 100%)`,
            filter: "blur(2px)",
          }} />
        </AbsoluteFill>
      )}
      {/* el golpe del martillo: acento óptico corto de 6 cuadros (no es una costura) */}
      <SeamFlash at={L(GOLPE)} color={V.volt} dur={6} />
      {/* 4→5 · OCCLUDER DE MATERIA: la tapa de lámina gris pasa por delante del lente y en la
          cobertura total va a luminancia media (~76/255): ni flash blanco ni fundido a negro */}
      <SeamOcclude at={L(S45 - 12)} dur={26} color={V.steel} angle={-7} lit={0.30} />

      {/* ══════ HUD — una idea de texto por acto, en espacio de pantalla ══════════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* LA CIFRA DEL PATIO: 78 dB (el número con el que arranca el video) */}
        {g >= 36 && g < 296 && (
          <div style={{ opacity: ip(g, [36, 60, 250, 292], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "17%", top: "22%", width: 460, height: 300,
              marginLeft: -230, marginTop: -150,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value="78" unit="dB" label="EN EL PATIO, A SIETE METROS"
              at={L(44)} x={17} y={22} size={104} color={V.volt} align="center" />
          </div>
        )}

        {/* ACTO 1 */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "72%", opacity: t1, transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={22}>
              <Kick color={V.volt}>El primer tercio</Kick>
              <div style={{ height: 6 }} />
              <Head size={62}>EL ESCAPE YA VIENE RESUELTO</Head>
              <div style={{ height: 8 }} />
              <Body size={30}>Tu generador trae <Em>silenciador de fábrica</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "10%", opacity: t2, transform: `translateY(${((1 - t2) * -22).toFixed(1)}px)` }}>
            <Bed w={640} pad={22}>
              <Kick color={V.volt}>La cuenta real</Kick>
              <div style={{ height: 6 }} />
              <Head size={64}>SON <Em>TRES TERCIOS</Em>, NO UNO</Head>
              <div style={{ height: 8 }} />
              <Body size={30}>Uno cerrado. Dos sin explicar.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "71%", opacity: t3, transform: `translateY(${((1 - t3) * 22).toFixed(1)}px)` }}>
            <Bed w={720} pad={22}>
              <Kick color={V.volt}>El segundo tercio</Kick>
              <div style={{ height: 6 }} />
              <Head size={60}>EL MOTOR SUENA POR TODAS PARTES</Head>
              <div style={{ height: 8 }} />
              <Body size={30}>No hay tubo que tapar: <Em>suena el metal</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "12%", opacity: t4, transform: `translateY(${((1 - t4) * -22).toFixed(1)}px)` }}>
            <Bed w={720} pad={22}>
              <Kick color={V.steel}>El tercio que nadie mira</Kick>
              <div style={{ height: 6 }} />
              <Head size={58}>EL VENTILADOR MUEVE UN RÍO DE AIRE</Head>
              <div style={{ height: 8 }} />
              <Body size={30}>Rugido grave: <Em color={V.amber}>se dobla en el muro y entra</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 */}
        {t5 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "70%", opacity: t5, transform: `translateY(${((1 - t5) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={22}>
              <Kick color={V.volt}>Y encima de los tres</Kick>
              <div style={{ height: 6 }} />
              <Head size={62}>TODA LÁMINA FINA ES UN <Em>PARLANTE</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={30}>Vibra con todo lo demás y lo multiplica</Body>
            </Bed>
          </div>
        )}

        {/* el rótulo de los tercios: contador discreto, arriba a la derecha */}
        {g >= 330 && g < 1330 && (
          <div style={{
            position: "absolute", left: "92%", top: "8%", transform: "translate(-50%,-50%)",
            opacity: ip(g, [330, 372, 1290, 1328], [0, 1, 1, 0]), textAlign: "center",
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 3.2,
              color: rgba(V.white, 0.78), textTransform: "uppercase",
              textShadow: "0 4px 18px rgba(0,0,0,0.92)",
            }}>Tercios</div>
            <div style={{ display: "flex", gap: 7, marginTop: 8, justifyContent: "center" }}>
              {[ip(g, [340, 392], [0.14, 1]), ip(g, [500, 560], [0.14, 1]), ip(g, [980, 1040], [0.14, 1])].map((p, i) => (
                <div key={i} style={{
                  width: 44, height: 7, borderRadius: 4,
                  background: rgba(i === 2 ? V.steel : V.volt, 0.14 + 0.78 * p),
                  boxShadow: p > 0.5 ? `0 0 13px ${rgba(i === 2 ? V.steel : V.volt, 0.46 * p)}` : "none",
                }} />
              ))}
            </div>
          </div>
        )}

        {/* la marca del acto 5: la lámina multiplica a los tres */}
        {resumenOn > 0.01 && g < 1450 && (
          <div style={{
            position: "absolute", left: "50%", top: "31%", transform: "translate(-50%,-50%)",
            opacity: resumenOn, textAlign: "center",
            fontFamily: F_BODY, fontWeight: 700, fontSize: 26, letterSpacing: 3,
            color: rgba(V.white, 0.72), textShadow: "0 3px 16px rgba(0,0,0,0.92)",
          }}>ESCAPE &nbsp;+&nbsp; MOTOR &nbsp;+&nbsp; VENTILADOR</div>
        )}
      </AbsoluteFill>

      {/* viñeta: el cuadro se cierra a medida que la cámara entra en el macro */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(126% 106% at 50% 48%, rgba(0,0,0,0) 50%, rgba(6,7,5,${(0.28 + 0.22 * ip(g, [A4, END], [0, 1])).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};

/*
// ╔══════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ MovTercios — TABLA DE ENTRADA Y SALIDA DE LOS ACTOS (1503 frames · 50,1 s)                   ║
// ╚══════════════════════════════════════════════════════════════════════════════════════════════╝
// ACTO | RANGO g        | ENTRA (encuadre + luz)                        | SALE (encuadre + luz)                          | COSTURA hacia el siguiente
// -----+----------------+-----------------------------------------------+------------------------------------------------+---------------------------------------------
// 1    | 0 → 318        | patio ALTO y LEJOS sobre el generador de marco | tres cuartos BAJO sobre el flanco de la máquina,| ZOOM-THROUGH (g286, dur 24, foco 76/52):
//      | (pisa 24 al 2) | rojo, muro y ventana del vecino al fondo.      | el escape ocupando el borde derecho.            | la cámara entra por la boca del escape y sale
//      |                | LUZ: `sky` fría (tintA sky, keyFrom 0.20).    | LUZ: `sky` con el primer contagio de `volt`.    | del otro lado, ya dentro del acto 2.
//      |                | CAMPO: SoundField db 78 saturando el cuadro.  | MAT: la tarjeta del silenciador ya dockeada.    |
// -----+----------------+-----------------------------------------------+------------------------------------------------+---------------------------------------------
// 2    | 294 → 663      | sale del interior del caño, tres cuartos bajo | tres cuartos CERRADO sobre el bloque de aluminio| WIPE DE MATERIA (g631, dur 30, `V.steel`):
//      | (pisa 24 y 25) | sobre el flanco. LUZ: sky+volt.               | con la tajada del escape archivada al borde y   | una pala del ventilador cruza de derecha a
//      |                | MAT: el campo se corta en TRES tajadas; la    | la tercera todavía vacía.                       | izquierda y barre el encuadre.
//      |                | del escape se archiva con su foto adentro.    | LUZ: `volt` plena (tintA volt en g645).         |
// -----+----------------+-----------------------------------------------+------------------------------------------------+---------------------------------------------
// 3    | 638 → 995      | la pala descubre un plano cerrado del bloque  | la cámara deriva a la derecha y la rejilla del  | LA CÁMARA SIGUE (g961, sin cobertura):
//      | (pisa 25 y 20) | de aluminio con sus aletas. LUZ: `volt` plena.| ventilador entra ocupando el tercio derecho.    | el desplazamiento no se corta — el acto 4 ya
//      |                | MAT: pistón en tarjeta + el GOLPE (g846) que  | LUZ: cae de `volt` a `steel` frío (pVoltSteel   | está dentro de ese mismo recorrido.
//      |                | dispara los anillos al doble de amplitud.     | arranca en g900).                               |
// -----+----------------+-----------------------------------------------+------------------------------------------------+---------------------------------------------
// 4    | 955 → 1300     | de frente a la rejilla, que llena el cuadro.  | MACRO de las lamas, con la banda grave todavía  | OCCLUDER DE MATERIA (g1255, dur 26,
//      | (pisa 20 y 28) | LUZ: `steel` fría.                            | cruzando por delante.                           | `V.steel`, lit 0.30): la tapa de lámina gris
//      |                | MAT: la tercera tajada VUELA y se vuelve el   | LUZ: `steel` con la traza `amber` de la ventana | pasa por delante del lente y en la cobertura
//      |                | marco de la tarjeta grande del ventilador;    | del vecino en el borde.                         | total va a luminancia media (~76/255).
//      |                | banda grave a ras del piso con `wall={66}`.   |                                                 |
// -----+----------------+-----------------------------------------------+------------------------------------------------+---------------------------------------------
// 5    | 1272 → 1503    | la tapa termina de cruzar y descubre el MACRO | macro CERRADÍSIMO sobre la lámina temblando, la | METAMORFOSIS (g1438 → 1503): el borde del
//      | (pisa 28 al 4) | sobre esa misma lámina. LUZ: `steel`+`volt`.  | textura del metal gris ocupando el cuadro.      | último anillo que nace de la chapa cierra su
//      |                | MAT: la chapa se abomba y se hunde, saltan    | LUZ: `steel` + acento `volt` (tintB → volt).    | radio (430 → 44 px) y se vuelve el contorno
//      |                | limaduras, y las tres tajadas vuelven llenas. | LA CÁMARA QUEDA ACÁ Y NO SE REMONTA.            | del NUDILLO que va a golpearla.
//
// HERENCIA: entra con el encuadre alto y lejano y la luz `sky` del hook; entrega macro sobre la
// lámina en `steel`+`volt` — el evento siguiente hereda ESE encuadre y ESE color, sin remontar nada.
*/
