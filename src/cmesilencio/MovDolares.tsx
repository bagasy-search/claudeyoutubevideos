// MovDolares.tsx — S6 · LOS DOS DÓLARES QUE PAGAN LA MITAD DE LOS DOCE DECIBELES
// El pago del primer open loop del video: de los doce decibeles, la madera puso seis. Los otros
// seis los ponen dos cosas que no cuestan nada — EL SELLADOR EN LAS JUNTAS (3 dB por 3 dólares) y
// LOS CUATRO TACOS DE GOMA bajo el generador (otros 3), porque el motor apoyado directo convierte
// la tabla en un parlante.
//
// 50,0 s · 1500 cuadros · 5 actos · UNA sola <Sequence>, UNA sola atmósfera, UNA sola cámara.
// EL MARCADOR baja 78 → 72 → 69 → 66 y el `SoundField` lo acompaña con el mismo número: los
// anillos se ralean solos, nadie los ralea a mano.
//
// ENTRA: SALIENDO DEL AGUJERO DE MovAgujero. El primer cuadro es idéntico al último de aquél —
//        negro total con el aro del borde encendido en `volt`, centrado, radio ~352 px. Ese aro
//        se estira hasta ser LA JUNTA entre dos tablas y la cámara sale por ahí al patio. Es una
//        costura de continuidad de cámara: no se tiene que notar dónde termina uno y empieza otro.
// SALE:  el 66 en verde-voltio apoyado sobre el concreto gris manchado del patio, luz `sky` fría
//        de anochecer (ahí lo encuentra la sección de los intentos que fracasan).
//
// (la tabla de entrada/salida de los actos está al final del archivo)
//
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, SoundField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, SeamFlash,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO ─────────────────────────────────────────────────────────────────
const END = 1500;
const S12 = 292;   // 1→2  METAMORFOSIS    · el hilo verde de la junta se vuelve el CORDÓN de sellador
const S23 = 588;   // 2→3  OCCLUDER        · la pared de contrachapado pasa por delante (V.paper)
const S34 = 888;   // 3→4  LA CÁMARA SIGUE · se retira sobre el mismo eje, sin corte
const S45 = 1218;  // 4→5  WIPE DE MATERIA · los tacos de goma barren el cuadro (V.ink2)

// El aro heredado de MovAgujero. ⛔ Estos tres números son la costura entre los dos movimientos:
// tienen que ser EXACTAMENTE los del cuadro de salida del movimiento anterior.
const ARO_R = 352;
const ARO_B = 4;

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));

// ── LA APERTURA — el agujero heredado que se estira hasta ser LA JUNTA y deja salir la cámara ─
// Un solo rectángulo redondeado con `box-shadow` de spread enorme: todo lo que está afuera es
// negro, todo lo que está adentro es el patio. Círculo (r 352) → junta vertical → cuadro entero.
const Apertura: React.FC<{ w: number; h: number; r: number; borde: number }> = ({ w, h, r, borde }) => (
  <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
    <div style={{
      position: "absolute", left: "50%", top: "50%", width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, borderRadius: r,
      boxShadow: `0 0 0 4000px ${V.ink0}, 0 0 ${Math.round(64 * borde)}px ${rgba(V.volt, 0.5 * borde)}, ` +
        `inset 0 0 ${Math.round(96 * borde)}px ${rgba(V.ink0, 0.72 * borde)}, inset 0 0 26px ${rgba(V.volt, 0.34 * borde)}`,
      border: `${ARO_B}px solid ${rgba(V.volt, 0.92 * borde)}`,
      background: `radial-gradient(64% 64% at 44% 40%, ${rgba(V.steel, 0.16 * borde)} 0%, ${rgba(V.ink1, 0.30 * borde)} 58%, rgba(0,0,0,0) 100%)`,
    }} />
  </AbsoluteFill>
);

// ── EL GENERADOR visto de cerca, con sus cuatro patas hincadas en la tabla ──────────────────
const GenSilueta: React.FC<{ x: number; y: number; s: number; tiembla: number; lit: number }> = ({
  x, y, s, tiembla, lit,
}) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, width: 460 * s, height: 300 * s,
    marginLeft: -230 * s, marginTop: -230 * s,
    transform: `translate(${(tiembla * 1.6).toFixed(2)}px, ${(tiembla * 0.9).toFixed(2)}px)`,
  }}>
    {/* marco de tubo rojo/naranja */}
    <div style={{
      position: "absolute", inset: 0, borderRadius: 14 * s,
      border: `${Math.max(4, 11 * s)}px solid ${rgba(V.danger, 0.7 * lit)}`,
      boxShadow: `0 0 ${Math.round(40 * s)}px ${rgba(V.danger, 0.18 * lit)}`,
    }} />
    {/* el bloque del motor: es lo que tiembla */}
    <div style={{
      position: "absolute", left: "12%", top: "10%", width: "76%", height: "46%", borderRadius: 10 * s,
      background: `linear-gradient(172deg, ${rgba(V.steel, 0.44 * lit)} 0%, ${rgba(V.ink1, 0.96)} 100%)`,
      boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.24 * lit)}`,
      transform: `translateY(${(tiembla * 1.1).toFixed(2)}px)`,
    }} />
    {/* tanque negro */}
    <div style={{
      position: "absolute", left: "17%", top: "56%", width: "66%", height: "22%", borderRadius: 8 * s,
      background: `linear-gradient(180deg, ${rgba(V.ink2, 1)} 0%, ${rgba(V.ink0, 1)} 100%)`,
    }} />
    {/* LAS CUATRO PATAS: acá se decide todo */}
    {[10, 34, 62, 86].map((px, i) => (
      <div key={i} style={{
        position: "absolute", left: `${px}%`, bottom: -18 * s, width: 34 * s, height: 40 * s,
        background: `linear-gradient(180deg, ${rgba(V.steel, 0.5 * lit)} 0%, ${rgba(V.ink0, 1)} 100%)`,
        borderRadius: 3 * s,
        boxShadow: `0 ${Math.round(8 * s)}px ${Math.round(16 * s)}px ${rgba(V.ink0, 0.9)}`,
      }} />
    ))}
  </div>
);

// ── LA TABLA — el piso de contrachapado de la caja, en perspectiva.
// Es donde entran las cuatro ondas, es lo que se vuelve cono de parlante y lo que se aquieta.
const Tabla: React.FC<{
  onda: number; cono: number; respira: number; lit: number; children?: React.ReactNode;
}> = ({ onda, cono, respira, lit, children }) => (
  <div style={{
    position: "absolute", left: "50%", top: "62%", width: 1420, height: 760, marginLeft: -710,
    transform: `rotateX(${lerp(64, 58, cono).toFixed(2)}deg) scale(${(1 + cono * respira * 0.02).toFixed(4)})`,
    transformOrigin: "50% 0%", transformStyle: "preserve-3d",
    background: `linear-gradient(178deg, ${rgba(V.paper, 0.3 * lit)} 0%, ${rgba(V.copper, 0.16 * lit)} 44%, ${rgba(V.ink0, 0.96)} 100%)`,
    boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.2 * lit)}, 0 -26px 80px ${rgba(V.ink0, 0.86)}`,
    borderRadius: 3, overflow: "hidden",
  }}>
    {/* LA VETA — se curva cuando la tabla se vuelve cono */}
    <AbsoluteFill style={{
      opacity: 0.3 * lit, mixBlendMode: "overlay",
      backgroundImage: `repeating-linear-gradient(${(99 + cono * 9).toFixed(1)}deg, rgba(255,255,255,.55) 0 1px, rgba(0,0,0,0) 1px ${(7 + cono * 5).toFixed(1)}px)`,
      transform: `scale(${(1 + cono * 0.06).toFixed(3)})`,
    }} />
    {/* EL CONO: anillos concéntricos EN RELIEVE, borde flexible, la bobina en el centro */}
    {cono > 0.01 && (
      <AbsoluteFill style={{ opacity: cono }}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const rr = 120 + i * 108;
          const rel = 0.5 + 0.5 * Math.sin(respira * Math.PI * 2 - i * 0.7);
          return (
            <div key={i} style={{
              position: "absolute", left: "50%", top: "50%", width: rr * 2, height: rr * 1.06,
              marginLeft: -rr, marginTop: -rr * 0.53, borderRadius: "50%",
              border: `${(4 + rel * 5).toFixed(1)}px solid ${rgba(V.paper, 0.10 + 0.16 * rel)}`,
              boxShadow: `inset 0 ${(3 + rel * 6).toFixed(1)}px ${(10 + rel * 12).toFixed(0)}px ${rgba(V.ink0, 0.6)}, ` +
                `0 ${(2 + rel * 5).toFixed(1)}px ${(8 + rel * 10).toFixed(0)}px ${rgba(V.ink0, 0.5)}`,
            }} />
          );
        })}
      </AbsoluteFill>
    )}
    {/* LAS CUATRO ONDAS que entran por las patas y se cruzan en el centro */}
    {onda > 0.01 && (
      <svg width="100%" height="100%" viewBox="0 0 1420 760" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}>
        {[[300, 250], [1120, 250], [300, 560], [1120, 560]].map((p, i) => (
          <g key={i}>
            {[0, 1, 2, 3].map((k) => {
              const ph = ((respira + k * 0.25) % 1);
              const r = 40 + ph * 520;
              const a = (1 - ph) * 0.5 * onda;
              if (a <= 0.02) return null;
              return (
                <ellipse key={k} cx={p[0]} cy={p[1]} rx={r} ry={r * 0.52} fill="none"
                  stroke={rgba(V.volt, a)} strokeWidth={1 + a * 3.2} />
              );
            })}
          </g>
        ))}
      </svg>
    )}
    {children}
  </div>
);

// ── LA ESCENA ───────────────────────────────────────────────────────────────────────────────
const Dolares: React.FC<{ g: number }> = ({ g }) => {
  // ── LA CÁMARA: hereda el encuadre de adentro del agujero, SALE por la junta y sigue
  //    bajando hasta quedar a ras del concreto. Una sola llamada, nunca vuelve a cero. ──────
  const cam = gcam(g, { z0: 300, z1: 466, panX: 64, panY: -126, ry: -6, rx: 4.6, dur: END });
  const salida = ES(g, 8, 168);                       // el envión de salir por la junta
  const camT = `${cam.transform} translateZ(${((1 - salida) * 300).toFixed(1)}px)`;

  // ── LA APERTURA heredada: círculo (r 352) → junta vertical → cuadro entero ───────────────
  const aCirc = clamp01(1 - LN(g, 30, 96));           // 1 = todavía es el agujero redondo
  const aAbre = ES(g, 96, 172);                       // 1 = la cámara ya salió
  const apW = lerp(lerp(ARO_R * 2, 150, 1 - aCirc), 2600, aAbre);
  const apH = lerp(lerp(ARO_R * 2, 980, 1 - aCirc), 1700, aAbre);
  const apR = lerp(lerp(ARO_R, 10, 1 - aCirc), 0, aAbre);
  const apBorde = clamp01(1 - LN(g, 118, 178));
  const apVela = clamp01(1 - LN(g, 24, 118));         // adentro del agujero todavía no hay luz

  // ── LA LUZ: filo `volt` → patio `sky` → ámbar de la ventana → `sky` fría de anochecer ────
  const w1 = ES(g, 40, 280);
  const w2 = ES(g, 620, 1080);
  const w3 = ES(g, 1236, 1466);
  const tintA = w3 > 0.02 ? light(w3, "amber", "sky")
    : w2 > 0.02 ? light(w2, "sky", "amber")
      : light(w1, "volt", "sky");
  const tint2A = light(ES(g, 1240, 1470), "amber", "concrete");
  const keyFrom = lerp(0.6, 0.28, ES(g, 120, 1300));
  const inten = lerp(0.7, 1.0, ES(g, 60, 900));
  const piso = lerp(0.5, 0.86, ES(g, 200, 1440));

  // ── EL MARCADOR y el SoundField: EL MISMO NÚMERO. 78 → 72 → 69 → 66 ─────────────────────
  const db = 78 - 6 * ES(g, 120, 208) - 3 * ES(g, 486, 546) - 3 * ES(g, 1300, 1364);

  // ── VENTANAS DE ACTO: recorte por RANGO de g, pisándose 20-30 cuadros ────────────────────
  const vA1 = g < 318;
  const vA2 = g > 282 && g < 618;
  const vA3 = g > 582 && g < 918;
  const vA4 = g > 882 && g < 1248;
  const vA5 = g > 1212;

  // ── EL CORDÓN de sellador: nace del hilo verde y recorre TODAS las uniones sin cortar ────
  const cord = clamp01(LN(g, S12, 528));
  // ── EL TEMBLOR del motor y las cuatro ondas de la tabla ─────────────────────────────────
  const tiembla = Math.sin(g / 2.6) * (0.4 + 0.6 * clamp01(LN(g, 620, 720)));
  const onda = clamp01(LN(g, 660, 790)) * clamp01(1 - LN(g, 1268, 1372));
  const cono = ES(g, 930, 1128) * clamp01(1 - LN(g, 1272, 1386));
  const respira = ((g / 96) % 1);
  const tacos = ES(g, 1236, 1386);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── ATMÓSFERA: se monta UNA vez, arriba de todo, y nunca se remonta ───────────────── */}
      <VoltAtmos tint={tintA} tint2={tint2A} keyFrom={keyFrom} intensity={inten} floor={piso} />

      {/* PLANO 0 — la cama de material real (cambia sólo bajo costura) */}
      {g < 600 && (
        <PhotoPlane src="img/cmesilencio/cms_s6_apoya_sonometro_muro.jpg" kind="photo"
          z={0} scale={1.2} dim={lerp(0.72, 0.56, ES(g, 60, 340))} tint={V.sky} />
      )}
      {g >= 584 && g < 1240 && (
        <PhotoPlane src="broll/cmesilencio/cms_s6_dos_objetos_concreto.mp4" kind="video"
          z={0} scale={1.3} dim={0.74} tint={V.amber} />
      )}
      {g >= 1224 && (
        <PhotoPlane src="img/cmesilencio/cms_s6_dos_objetos_concreto.jpg" kind="photo"
          z={0} scale={1.16} dim={lerp(0.72, 0.5, ES(g, 1224, 1460))} tint={V.sky} />
      )}

      <Layers cam={camT}>
        {/* ── PLANO FONDO z:-60 — el patio, el muro bajo y la ventana amarilla del vecino ─── */}
        <Plane z={-60}>
          <PadPlane y={84} w={1560} h={340} rx={64}
            lit={lerp(0.34, 0.72, ES(g, 200, 1400))} z={-240} />
          {g < 980 && (
            <div style={{
              position: "absolute", left: "81%", top: "31%", width: 176, height: 124,
              background: `linear-gradient(178deg, ${rgba(V.amber, 0.52)} 0%, ${rgba(V.amber, 0.22)} 100%)`,
              filter: "blur(13px)", borderRadius: 5,
              opacity: clamp01(LN(g, 130, 220)) * clamp01(1 - LN(g, 900, 976)),
            }} />
          )}
        </Plane>

        {/* ── LA FIRMA: SoundField. El `db` es el MISMO número del marcador: los anillos se
              ralean solos a medida que la cuenta baja. El muro bajo dobla los que lo cruzan. ── */}
        <Plane z={-30}>
          <SoundField db={db} x={lerp(34, 46, ES(g, 120, 620))} y={lerp(56, 62, ES(g, 120, 900))}
            wall={78} on={clamp01(LN(g, 128, 196))} tint={V.volt} speed={1} spread={74} />
          {/* ACTO 4 — anillos NUEVOS que no vienen del motor sino de la MADERA */}
          {vA4 && cono > 0.05 && (
            <SoundField db={lerp(58, 76, cono)} x={50} y={66} wall={78}
              on={cono * clamp01(1 - LN(g, 1250, 1330))} tint={V.danger} speed={1.4} spread={44} />
          )}
        </Plane>

        {/* ── PLANO MATERIA z:0 ───────────────────────────────────────────────────────────── */}
        <Plane z={0}>
          {/* ═══ ACTO 1 — LAS CUATRO PAREDES SE LEVANTAN Y SE CIERRAN (78 → 72) ══════════ */}
          {vA1 && (
            <div style={{
              position: "absolute", inset: 0, transformStyle: "preserve-3d",
              opacity: clamp01(LN(g, 96, 150)) * clamp01(1 - LN(g, 296, 316)),
            }}>
              {[0, 1, 2, 3].map((i) => {
                const cierra = ES(g, 140 + i * 16, 250 + i * 16);
                const lado = i % 2 === 0 ? -1 : 1;
                const alto = i < 2 ? 1 : 0.86;
                return (
                  <div key={i} style={{
                    position: "absolute", left: `${[19, 81, 33, 67][i]}%`, top: `${[54, 54, 60, 60][i]}%`,
                    width: 300 * alto, height: 400 * alto, marginLeft: -150 * alto, marginTop: -200 * alto,
                    transform: `rotateY(${(lado * lerp(74, 14, cierra)).toFixed(2)}deg) translateZ(${(lerp(-120, 40, cierra)).toFixed(1)}px)`,
                    background: `linear-gradient(174deg, ${rgba(V.paper, 0.3)} 0%, ${rgba(V.copper, 0.16)} 52%, ${rgba(V.ink0, 0.95)} 100%)`,
                    boxShadow: `0 30px 70px ${rgba(V.ink0, 0.9)}, inset 0 1px 0 ${rgba(V.white, 0.2)}`,
                    borderRadius: 3, opacity: cierra * 0.94 + 0.06,
                  }}>
                    <AbsoluteFill style={{
                      opacity: 0.26, mixBlendMode: "overlay",
                      backgroundImage: "repeating-linear-gradient(97deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 8px)",
                    }} />
                  </div>
                );
              })}
              {/* la mano con el cartucho entra desde el primer plano y apoya la punta cortada */}
              <MediaCard
                src="broll/cmesilencio/cms_s6_levanta_pistola_sellador.mp4" kind="video"
                w={520} h={310} x={lerp(112, 74, ES(g, 196, 300))} y={lerp(76, 66, ES(g, 196, 300))}
                z={250} ry={-16} rot={-3} lit={1} litColor={V.amber}
                label="SELLADOR ACÚSTICO" sheenAt={236}
                opacity={clamp01(LN(g, 190, 232))} grade
              />
              <IconPng src="img/cmesilencio/cms_ic_cartucho.png" x={26} y={30} size={96} z={180}
                opacity={0.85 * clamp01(LN(g, 214, 268))} rot={-8} glow={V.volt} />
            </div>
          )}

          {/* ═══ ACTO 2 — EL CORDÓN recorre TODAS las uniones y apaga los hilos (72 → 69) ═ */}
          {vA2 && (
            <div style={{
              position: "absolute", inset: 0, transformStyle: "preserve-3d",
              opacity: clamp01(LN(g, 288, 330)) * clamp01(1 - LN(g, 592, 616)),
            }}>
              <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
                style={{ position: "absolute", inset: 0 }}>
                {/* LAS JUNTAS del interior: la línea que el cordón va a recorrer sin cortar */}
                <path
                  d="M 500 300 L 1420 300 L 1560 820 L 360 820 Z M 500 300 L 360 820 M 1420 300 L 1560 820"
                  pathLength={1000} fill="none"
                  stroke={rgba(V.ink0, 0.6)} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round"
                />
                {/* EL CORDÓN: grueso, brillante y CONTINUO */}
                <path
                  d="M 500 300 L 1420 300 L 1560 820 L 360 820 Z M 500 300 L 360 820 M 1420 300 L 1560 820"
                  pathLength={1000} fill="none"
                  stroke={rgba(V.bone, 0.9)} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="1000" strokeDashoffset={1000 * (1 - cord)}
                />
                <path
                  d="M 500 300 L 1420 300 L 1560 820 L 360 820 Z M 500 300 L 360 820 M 1420 300 L 1560 820"
                  pathLength={1000} fill="none"
                  stroke={rgba(V.white, 0.75)} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="1000" strokeDashoffset={1000 * (1 - cord)}
                />
                {/* LOS HILOS VERDES: cada tramo que se cierra apaga el suyo, como un interruptor */}
                {[0.12, 0.34, 0.58, 0.82].map((u, i) => {
                  const vivo = clamp01(1 - LN(cord, u - 0.02, u + 0.06));
                  if (vivo <= 0.02) return null;
                  const px = [500, 1420, 1560, 360][i];
                  const py = [300, 300, 820, 820][i];
                  const dx = i === 0 || i === 3 ? -260 : 260;
                  const dy = i < 2 ? -170 : 170;
                  return (
                    <line key={i} x1={px} y1={py} x2={px + dx} y2={py + dy}
                      stroke={rgba(V.volt, 0.75 * vivo * (0.6 + 0.4 * Math.abs(Math.sin(g / 11 + i))))}
                      strokeWidth={3.4} />
                  );
                })}
              </svg>
              {/* la punta del cartucho viaja con la cámara a lo largo de la junta */}
              <IconPng src="img/cmesilencio/cms_ic_cartucho.png"
                x={lerp(26, 74, cord)} y={lerp(30, 74, cord)} size={110} z={230}
                opacity={0.95 * clamp01(1 - LN(g, 528, 566))} rot={lerp(-14, 12, cord)} glow={V.amber} />
              {/* TRES BILLETES DE UN DÓLAR sobre el concreto, en ámbar tibio */}
              {[0, 1, 2].map((i) => {
                const ent = ES(g, 408 + i * 26, 472 + i * 26);
                return (
                  <div key={i} style={{
                    position: "absolute", left: `${16 + i * 5.4}%`, top: `${84 - i * 1.6}%`,
                    width: 128, height: 58, marginLeft: -64, marginTop: -29,
                    transform: `rotate(${(lerp(-24, (rnd(i * 4.2) - 0.5) * 22, ent)).toFixed(1)}deg) scale(${ent.toFixed(3)})`,
                    background: `linear-gradient(168deg, ${rgba(V.bone, 0.82)} 0%, ${rgba(V.amber, 0.34)} 62%, ${rgba(V.ink1, 0.9)} 100%)`,
                    boxShadow: `0 12px 26px ${rgba(V.ink0, 0.8)}`, borderRadius: 3, opacity: ent * 0.94,
                  }}>
                    <AbsoluteFill style={{
                      opacity: 0.4,
                      backgroundImage: `repeating-linear-gradient(88deg, ${rgba(V.copper, 0.4)} 0 1px, rgba(0,0,0,0) 1px 6px)`,
                    }} />
                  </div>
                );
              })}
              <MediaCard
                src="broll/cmesilencio/cms_s6_dos_objetos_concreto.mp4" kind="video"
                w={400} h={238} x={83} y={26} z={200} ry={-14} rot={2}
                lit={0.95} litColor={V.amber} label="3 DÓLARES" sheenAt={432}
                opacity={clamp01(LN(g, 414, 456)) * clamp01(1 - LN(g, 556, 590))} grade
              />
            </div>
          )}

          {/* ═══ ACTO 3 y 4 — LA TABLA: el contacto directo, las ondas y el CONO ═════════ */}
          {(vA3 || vA4 || vA5) && (
            <div style={{
              position: "absolute", inset: 0, transformStyle: "preserve-3d",
              opacity: clamp01(LN(g, 596, 636)),
            }}>
              <Tabla onda={onda} cono={cono} respira={respira} lit={lerp(0.8, 1, ES(g, 600, 1000))} />
              <GenSilueta x={50} y={62} s={lerp(0.9, 1.06, ES(g, 600, 1200))}
                tiembla={tiembla} lit={lerp(0.85, 1, ES(g, 600, 900))} />
              {/* LOS CUATRO TACOS: esperan en el borde del cuadro y después entran bajo cada pata */}
              {[0, 1, 2, 3].map((i) => {
                const ent = ES(g, 1236 + i * 30, 1320 + i * 30);
                const x0 = [4, 96, 4, 96][i];
                const x1 = [36, 64, 30, 70][i];
                const y0 = [88, 88, 93, 93][i];
                const y1 = [70, 70, 74, 74][i];
                return (
                  <IconPng key={i} src="img/cmesilencio/cms_ic_taco.png"
                    x={lerp(x0, x1, ent)} y={lerp(y0, y1, ent)} size={lerp(72, 96, ent)} z={210}
                    opacity={clamp01(LN(g, 780 + i * 20, 840 + i * 20))}
                    rot={lerp(-16, 0, ent)} glow={V.ink0} />
                );
              })}
              {/* de dónde salen: una llanta vieja */}
              <IconPng src="img/cmesilencio/cms_ic_llanta.png" x={13} y={30} size={122} z={160}
                opacity={0.8 * clamp01(LN(g, 806, 872)) * clamp01(1 - LN(g, 1400, 1470))}
                rot={-6} glow={V.ink0} />
              {/* el camino de la vibración CORTADO en el taco */}
              {tacos > 0.05 && (
                <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
                  style={{ position: "absolute", inset: 0 }}>
                  {[[692, 760], [1228, 760], [576, 800], [1344, 800]].map((p, i) => (
                    <line key={i} x1={p[0]} y1={p[1] - 150} x2={p[0]} y2={p[1] - 150 + 150 * (1 - tacos)}
                      stroke={rgba(V.volt, 0.6 * (1 - tacos))} strokeWidth={5} strokeLinecap="round" />
                  ))}
                </svg>
              )}
              <MediaCard
                src="broll/cmesilencio/cms_s6_apoya_sonometro_muro.mp4" kind="video"
                w={392} h={234} x={84} y={27} z={210} ry={-14} rot={-2}
                lit={0.95} litColor={V.volt} label="EL MOTOR VIBRA" sheenAt={716}
                opacity={clamp01(LN(g, 698, 740)) * clamp01(1 - LN(g, 1180, 1226))} grade
              />
              <MediaCard
                src="img/cmesilencio/cms_s6_levanta_pistola_sellador.jpg" kind="photo"
                w={352} h={210} x={16} y={72} z={190} ry={13} rot={3}
                lit={0.9} litColor={V.amber} label="LO QUE YA PAGASTE" sheenAt={968}
                opacity={clamp01(LN(g, 950, 992)) * clamp01(1 - LN(g, 1196, 1240))} grade
              />
            </div>
          )}

          {/* ═══ ACTO 5 — LA CUENTA: 6 + 3 + 3, y el 66 apoyado en el concreto ═══════════ */}
          {vA5 && (
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
              {/* los números se ordenan en el aire como TRES BLOQUES DE MATERIA y bajan a posarse */}
              {[
                { n: "6", t: "CONTRACHAPADO", c: V.paper, b: `linear-gradient(172deg, ${rgba(V.paper, 0.68)} 0%, ${rgba(V.copper, 0.3)} 100%)`, at: 1272 },
                { n: "3", t: "SELLADOR", c: V.bone, b: `linear-gradient(172deg, ${rgba(V.white, 0.66)} 0%, ${rgba(V.steel, 0.3)} 100%)`, at: 1306 },
                { n: "3", t: "GOMA", c: V.white, b: `linear-gradient(172deg, ${rgba(V.ink2, 0.98)} 0%, ${rgba(V.ink0, 1)} 100%)`, at: 1340 },
              ].map((blq, i) => {
                const ent = ES(g, blq.at, blq.at + 76);
                const baja = ES(g, blq.at + 60, blq.at + 132);
                if (ent <= 0.01) return null;
                return (
                  <div key={i} style={{
                    position: "absolute", left: "22%", top: `${lerp(24, 40 + i * 12, baja)}%`,
                    width: 300, height: 118, marginLeft: -150, marginTop: -59,
                    transform: `translateY(${((1 - ent) * -70).toFixed(1)}px) rotate(${(lerp(-4 + i * 3, 0, baja)).toFixed(2)}deg)`,
                    opacity: ent, background: blq.b, borderRadius: 5,
                    boxShadow: `0 ${Math.round(20 + 14 * baja)}px ${Math.round(34 + 16 * baja)}px ${rgba(V.ink0, 0.84)}, inset 0 1px 0 ${rgba(V.white, 0.24)}`,
                    display: "flex", alignItems: "center", gap: 20, padding: "0 26px",
                  }}>
                    <Num size={82} color={blq.c}>{blq.n}</Num>
                    <div style={{
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 3,
                      color: rgba(blq.c, 0.8), textTransform: "uppercase",
                    }}>{blq.t}<br /><span style={{ fontSize: 18, letterSpacing: 2.2, color: rgba(blq.c, 0.55) }}>decibeles</span></div>
                  </div>
                );
              })}
              {/* EL 66 ESCRITO SOBRE EL CONCRETO — el cuadro de salida del movimiento */}
              {g > 1348 && (
                <div style={{
                  position: "absolute", left: "62%", top: "78%",
                  transform: `translate(-50%,-50%) rotateX(62deg) rotate(-4deg) scale(${(0.86 + 0.14 * ES(g, 1348, 1420)).toFixed(3)})`,
                  transformOrigin: "50% 50%", opacity: clamp01(LN(g, 1348, 1396)),
                  filter: `drop-shadow(${(46 * ES(g, 1360, 1480)).toFixed(0)}px 0 ${(26).toFixed(0)}px ${rgba(V.ink0, 0.92)})`,
                }}>
                  <Num size={252} color={V.volt}>66</Num>
                </div>
              )}
            </div>
          )}
        </Plane>

        {/* ── PRIMER PLANO z:+90 — el sonómetro y el polvo del patio ─────────────────────── */}
        <Plane z={90} style={{ pointerEvents: "none" }}>
          <IconPng src="img/cmesilencio/cms_ic_sonometro.png" x={13} y={lerp(70, 66, ES(g, 600, 1400))}
            size={104} z={0}
            opacity={0.9 * clamp01(LN(g, 230, 300)) * clamp01(1 - LN(g, 1408, 1470))}
            rot={5} glow={V.volt} />
          {Array.from({ length: 15 }, (_, i) => {
            const sp = 0.5 + rnd(i * 11.3) * 1.5;
            const yy = (((rnd(i * 4.4) * 132 - (g * sp) / 9) % 132) + 132) % 132;
            const s = 3 + rnd(i * 7.9) * 5;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 2.2) * 110 - 5).toFixed(2)}%`, top: `${yy - 12}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(V.white, 0.06 + rnd(i * 5.1) * 0.1),
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── EL MARCADOR: 78 → 72 → 69 → 66. Fuera del parallax, siempre en el mismo sitio ── */}
      {g > 128 && g < 214 && <Readout value="78" unit="dB" label="ASÍ ESTÁ AHORA" at={132} x={80} y={17} size={124} color={V.volt} />}
      {g >= 214 && g < 524 && <Readout value="72" unit="dB" label="SÓLO CON LA MADERA" at={216} x={80} y={17} size={124} color={V.volt} />}
      {g >= 524 && g < 1332 && (
        <div style={{
          position: "absolute", inset: 0,
          transform: g > 700 ? `translate(${(Math.sin(g / 2.9) * 2).toFixed(2)}px, ${(Math.cos(g / 3.3) * 1.5).toFixed(2)}px)` : "none",
        }}>
          <Readout value="69" unit="dB" label={g > 940 ? "YA NO BAJA" : "CON EL SELLADOR"} at={526} x={80} y={17} size={124}
            color={g > 1040 && g < 1150 ? V.danger : V.volt} />
        </div>
      )}
      {g >= 1332 && <Readout value="66" unit="dB" label="CON LA GOMA" at={1334} x={80} y={17} size={124} color={V.volt} />}

      {/* ── LOS RÓTULOS: una idea por acto ────────────────────────────────────────────────── */}
      {g > 176 && g < 296 && (
        <div style={{
          position: "absolute", left: 150, top: 140,
          opacity: clamp01(LN(g, 180, 216)) * clamp01(1 - LN(g, 266, 292)),
        }}>
          <Bed pad={24}>
            <Kick>LO BARATO QUE SÍ SIRVE</Kick>
            <div style={{ height: 8 }} />
            <Head size={74}>El sellador<br />en las <Em>juntas</Em></Head>
          </Bed>
        </div>
      )}
      {g > 452 && g < 596 && (
        <div style={{
          position: "absolute", left: 150, bottom: 140,
          opacity: clamp01(LN(g, 458, 494)) * clamp01(1 - LN(g, 566, 592)),
        }}>
          <Bed pad={24}>
            <Head size={76}>3 decibeles<br />por <Em>3 dólares</Em></Head>
            <div style={{ height: 10 }} />
            <Body size={30}>Medido con la caja ya armada.</Body>
          </Bed>
        </div>
      )}
      {g > 764 && g < 900 && (
        <div style={{
          position: "absolute", left: 150, top: 138,
          opacity: clamp01(LN(g, 770, 806)) * clamp01(1 - LN(g, 868, 896)),
        }}>
          <Bed pad={24}>
            <Kick>APOYADO DIRECTO</Kick>
            <div style={{ height: 8 }} />
            <Head size={72}>La vibración <Em>entra</Em><br />en la madera</Head>
          </Bed>
        </div>
      )}
      {g > 1058 && g < 1214 && (
        <div style={{
          position: "absolute", left: 150, bottom: 144,
          opacity: clamp01(LN(g, 1064, 1100)) * clamp01(1 - LN(g, 1184, 1210)),
        }}>
          <Bed pad={24}>
            <Head size={74}>La tabla vibra entera<br />y se vuelve un <Em>parlante</Em></Head>
            <div style={{ height: 10 }} />
            <Body size={30}>La caja dejó de tapar ruido: ahora lo fabrica.</Body>
          </Bed>
        </div>
      )}
      {g > 1268 && g < 1462 && (
        <div style={{
          position: "absolute", left: 150, top: 132,
          opacity: clamp01(LN(g, 1274, 1310)) * clamp01(1 - LN(g, 1428, 1458)),
        }}>
          <Bed pad={24}>
            <Kick>CUATRO PEDAZOS DE GOMA</Kick>
            <div style={{ height: 8 }} />
            <Head size={72}>Otros <Em>3 decibeles</Em></Head>
          </Bed>
        </div>
      )}

      {/* ── COSTURA 2→3: OCCLUDER — la pared de contrachapado pasa por delante ───────────── */}
      <SeamOcclude at={S23} dur={20} color={V.paper} angle={-7} lit={0.30} />
      {/* ── COSTURA 4→5: WIPE DE MATERIA — los tacos de goma barren el cuadro ───────────── */}
      <SeamWipeMatter at={S45} dur={24} tint={V.ink2} />
      {/* la caja AGREGANDO ruido: el marcador se enciende de rojo un instante (no es costura) */}
      <SeamFlash at={1044} color={V.danger} dur={7} />

      {/* ── LA APERTURA HEREDADA: el primer cuadro es el último de MovAgujero ────────────── */}
      {aAbre < 1 && (
        <>
          <Apertura w={apW} h={apH} r={apR} borde={apBorde} />
          {/* adentro del agujero todavía no entra luz: el patio aparece recién al salir */}
          <AbsoluteFill style={{ background: rgba(V.ink0, 0.94 * apVela), pointerEvents: "none" }} />
        </>
      )}

      {/* viñeta de cierre: el patio se enfría hacia el anochecer para entregar la sección siguiente */}
      <AbsoluteFill style={{
        background: `radial-gradient(126% 96% at 50% 56%, rgba(0,0,0,0) 44%, ${rgba(V.ink0, lerp(0.5, 0.84, ES(g, 1200, 1490)))} 100%)`,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export const MovDolares: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  void acto; // el build lo usa para saber qué acto monta; acá TODO el dibujo sale de gFrame
  const localF = useCurrentFrame();
  const gf = gFrame === undefined ? localF : gFrame;
  // Con este Sequence, adentro useCurrentFrame() === gFrame: costuras, Readout y la fase del
  // SoundField quedan CONTINUOS aunque el build monte cada acto en su propia Sequence.
  const off = Math.round(localF - gf);
  const g = Math.max(0, Math.min(END, gf));
  return (
    <Sequence from={off} layout="none">
      <Dolares g={g} />
    </Sequence>
  );
};

/*
// ─────────────────────────────────────────────────────────────────────────────────────────────
// TABLA DE ENTRADA Y SALIDA DE LOS ACTOS — MovDolares (1500 cuadros · 50,0 s)
// ─────────────────────────────────────────────────────────────────────────────────────────────
// ACTO | RANGO g (dibujo)   | ENTRA (encuadre + luz)                            | SALE (encuadre + luz)                              | COSTURA hacia el siguiente
// -----|--------------------|---------------------------------------------------|----------------------------------------------------|-------------------------------------------------
//  —   | (MovAgujero)       | —                                                 | DENTRO del agujero: negro + aro `volt` r≈352 px     | CONTINUIDAD DE CÁMARA (mismo aro, mismo centro)
//  1   | 0 → 318            | el MISMO negro con el aro `volt` centrado; el aro | la caja cerrada, hilos verdes por cada junta, la    | 1→2 f=292 · METAMORFOSIS
//      | (acto 0→300)       | se estira a JUNTA y la cámara sale · z≈+300 →    | mano con el cartucho apoyada · `sky` + ámbar       | (el hilo verde de la junta SE VUELVE el cordón)
//      |                    | +60 · luz `volt` → `sky` · marcador 78 → 72       | (marcador 72)                                      |
//  2   | 282 → 618          | ya dentro del cuadro de la caja, pegada a la mano | todas las uniones selladas, los hilos apagados,    | 2→3 f=588 · OCCLUDER DE MATERIA
//      | (acto 300→600)     | z≈+120 · `sky` cediendo al ámbar                  | tres billetes en el concreto · ámbar (marcador 69) | (`SeamOcclude` V.paper lit .30: la pared de la caja)
//  3   | 582 → 918          | a ras del piso de la caja, macro de una pata      | las cuatro ondas cruzándose en el centro, el 69    | 3→4 f=888 · LA CÁMARA SIGUE
//      | (acto 600→900)     | z≈+230 · ámbar de la ventana, más bajo            | temblando, los tacos esperando · ámbar bajo        | (se retira sobre el mismo eje, sin corte)
//  4   | 882 → 1248         | misma toma a ras, la cámara se retira apenas      | la tabla hecha CONO DE PARLANTE emitiendo anillos  | 4→5 f=1218 · WIPE DE MATERIA
//      | (acto 900→1230)    | z≈+330 · ámbar profundo                           | propios; el 69 en rojo medio punto arriba          | (`SeamWipeMatter` V.ink2: la goma negra barre)
//  5   | 1212 → 1500        | misma toma; los tacos entran bajo cada pata      | EL 66 EN VERDE-VOLTIO SOBRE EL CONCRETO gris del   | → sección de los intentos que fracasan
//      | (acto 1230→1500)   | z≈+466 · ámbar → `sky` fría de anochecer          | patio, con la sombra larga · `sky` fría (marc. 66) | (HERENCIA DE LUZ: `sky` fría de anochecer)
// ─────────────────────────────────────────────────────────────────────────────────────────────
// EL MARCADOR Y EL SOUNDFIELD SON EL MISMO NÚMERO:
//   db = 78 − 6·(f 120-208) − 3·(f 486-546) − 3·(f 1300-1364)  →  78 · 72 · 69 · 66
//   `SoundField` recibe ese `db` literal: los anillos se ralean solos, nadie los ralea a mano.
// ─────────────────────────────────────────────────────────────────────────────────────────────
*/
