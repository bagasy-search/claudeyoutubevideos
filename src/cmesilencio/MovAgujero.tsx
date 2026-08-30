// MovAgujero.tsx — S5 · LAS TRES IDEAS QUE DECIDEN SI UNA CAJA SIRVE
// "Son tres ideas y con ellas juzgas cualquier caja."
//   1. el ruido lo detiene el PESO, no la esponja
//   2. el absorbente es la TOALLA, no la pared
//   3. MANDA EL AGUJERO
//
// 57,0 s · 1710 cuadros · 5 actos · UNA sola <Sequence>, UNA sola atmósfera, UNA sola cámara.
// El objeto que cruza los cinco actos es UNA MONEDA DE COBRE: entra apoyada de canto en el acto 1,
// rueda, queda al borde, entra a la caja, y en el acto 5 SE CONVIERTE EN EL AGUJERO por donde se
// escapa todo. Esa metamorfosis es la costura que sostiene el movimiento entero.
//
// ENTRA: plano medio sobre la pared de contrachapado, luz `sky` (viene del movimiento de los tres
//        números, que dejó la cámara bajando hacia una superficie).
// SALE:  DENTRO del agujero — negro total con el aro del borde encendido en `volt`. Ese negro con
//        filo verde ES el primer cuadro de MovDolares (la cámara sale por la junta).
//
// (la tabla de entrada/salida de los actos está al final del archivo)
//
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, SoundField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, zoomThrough,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO ─────────────────────────────────────────────────────────────────
const END = 1710;
const S12 = 300;   // 1→2  WIPE DE MATERIA   · el aserrín del canto barre el cuadro
const S23 = 648;   // 2→3  METAMORFOSIS      · la hoja se despliega y se vuelve la caja
const S34 = 975;   // 3→4  OCCLUDER          · la boca de la caja pasa por delante (V.paper)
const S45 = 1338;  // 4→5  LA CÁMARA SIGUE   · sin corte: el acto 5 ya está dentro del recorrido
const ZT = 1612;   // salida ZOOM-THROUGH al agujero

// el agujero (y por lo tanto la moneda del acto 5) vive acá, en % de pantalla
const HX = 41.5, HY = 52;

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
// onda triangular determinista: la usa la pelota de luz que rebota adentro de la caja
const tri = (q: number) => { const m = ((q % 2) + 2) % 2; return m < 1 ? m : 2 - m; };

// ── LA HOJA DE CONTRACHAPADO — material REAL adentro + un canto de 12 mm de verdad ──────────
// La placa no es un rectángulo pintado: adentro corre el clip de la mano sobre la hoja cruda, y el
// canto es una pila de láminas pegadas. Cuando gira sobre su canto se leen las capas.
const Placa: React.FC<{
  x: number; y: number; w: number; h: number; ry: number; lit: number; z: number;
  canto: number; sheenAt: number; label?: string;
}> = ({ x, y, w, h, ry, lit, z, canto, sheenAt, label }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
    marginLeft: -w / 2, marginTop: -h / 2,
    transform: `translateZ(${z}px) rotateY(${ry.toFixed(2)}deg)`,
    transformStyle: "preserve-3d",
  }}>
    <MediaCard
      src="broll/cmesilencio/cms_s5_mano_hoja_cruda.mp4" kind="video"
      w={w} h={h} x={50} y={50} z={0} radius={3}
      lit={lit} litColor={V.sky} sheenAt={sheenAt} label={label} grade
    />
    {/* EL CANTO: las láminas pegadas. Es DELGADO y es lo que para el ruido. */}
    <div style={{
      position: "absolute", top: 0, right: 0, width: canto, height: h,
      transform: `translateX(${canto.toFixed(1)}px) rotateY(90deg)`, transformOrigin: "left center",
      backgroundImage:
        `repeating-linear-gradient(90deg, ${rgba(V.paper, 0.86 * lit)} 0 ${(canto / 7).toFixed(2)}px, ` +
        `${rgba(V.copper, 0.52 * lit)} ${(canto / 7).toFixed(2)}px ${(canto / 3.5).toFixed(2)}px)`,
      boxShadow: `inset 0 0 14px ${rgba(V.ink0, 0.72)}, 0 0 0 1px ${rgba(V.ink0, 0.5)}`,
    }} />
  </div>
);

// ── LA PLANCHA DE ESPUMA — gruesa, esponjosa, llena de aire, y NO hace nada ──────────────────
const Espuma: React.FC<{ x: number; y: number; w: number; h: number; grosor: number; lit: number; z: number }> = ({
  x, y, w, h, grosor, lit, z,
}) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
    marginLeft: -w / 2, marginTop: -h / 2,
    transform: `translateZ(${z}px)`, transformStyle: "preserve-3d",
  }}>
    {/* el costado: el GROSOR es toda su historia */}
    <div style={{
      position: "absolute", top: 0, left: 0, width: w + grosor, height: h,
      transform: `translate3d(${(grosor * 0.62).toFixed(1)}px, ${(-grosor * 0.24).toFixed(1)}px, ${(-grosor * 0.5).toFixed(1)}px)`,
      background: `linear-gradient(168deg, ${rgba(V.steel, 0.34 * lit)} 0%, ${rgba(V.ink2, 0.86)} 100%)`,
      borderRadius: 4,
    }} />
    <div style={{
      position: "absolute", inset: 0, borderRadius: 4,
      background: `linear-gradient(172deg, ${rgba(V.steel, 0.62 * lit)} 0%, ${rgba(V.steel, 0.30 * lit)} 58%, ${rgba(V.ink2, 0.9)} 100%)`,
      boxShadow: `0 ${Math.round(h * 0.15)}px ${Math.round(h * 0.2)}px ${rgba(V.ink0, 0.7)}, inset 0 1px 0 ${rgba(V.white, 0.2 * lit)}`,
      overflow: "hidden",
    }}>
      {/* las celdas abiertas: aire, aire y más aire */}
      <AbsoluteFill style={{
        opacity: 0.5,
        backgroundImage:
          `radial-gradient(circle at 30% 30%, ${rgba(V.ink0, 0.6)} 0 3px, rgba(0,0,0,0) 4px), ` +
          `radial-gradient(circle at 70% 66%, ${rgba(V.ink0, 0.5)} 0 4px, rgba(0,0,0,0) 5px)`,
        backgroundSize: "22px 22px, 31px 31px",
      }} />
      <AbsoluteFill style={{ background: `linear-gradient(178deg, ${rgba(V.white, 0.1 * lit)} 0%, rgba(255,255,255,0) 30%)` }} />
    </div>
  </div>
);

// ── EL GENERADOR — silueta de marco de tubo rojo/naranja con contra ámbar ────────────────────
const Generador: React.FC<{ x: number; y: number; s: number; lit: number; late: number }> = ({ x, y, s, lit, late }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, width: 320 * s, height: 220 * s,
    marginLeft: -160 * s, marginTop: -110 * s,
    transform: `scale(${(1 + late * 0.012).toFixed(4)})`,
  }}>
    {/* marco de tubo */}
    <div style={{
      position: "absolute", inset: 0, borderRadius: 12 * s,
      border: `${Math.max(3, 9 * s)}px solid ${rgba(V.danger, 0.72 * lit)}`,
      boxShadow: `0 0 ${Math.round(34 * s)}px ${rgba(V.danger, 0.20 * lit)}, 0 ${Math.round(26 * s)}px ${Math.round(30 * s)}px ${rgba(V.ink0, 0.8)}`,
    }} />
    {/* motor + tanque */}
    <div style={{
      position: "absolute", left: "13%", top: "16%", width: "74%", height: "44%", borderRadius: 8 * s,
      background: `linear-gradient(172deg, ${rgba(V.steel, 0.42 * lit)} 0%, ${rgba(V.ink1, 0.96)} 100%)`,
      boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.22 * lit)}`,
    }} />
    <div style={{
      position: "absolute", left: "18%", top: "60%", width: "64%", height: "26%", borderRadius: 6 * s,
      background: `linear-gradient(180deg, ${rgba(V.ink2, 1)} 0%, ${rgba(V.ink0, 1)} 100%)`,
    }} />
    {/* el escape, corto, a un costado — de acá sale todo */}
    <div style={{
      position: "absolute", right: "-6%", top: "40%", width: 46 * s, height: 20 * s, borderRadius: 4 * s,
      background: `linear-gradient(90deg, ${rgba(V.steel, 0.5 * lit)}, ${rgba(V.ink0, 1)})`,
    }} />
  </div>
);

// ── LA ESCENA ───────────────────────────────────────────────────────────────────────────────
const Agujero: React.FC<{ g: number }> = ({ g }) => {
  // ── LA CÁMARA: una sola llamada. Baja y se acerca. NUNCA vuelve a cero. ──────────────────
  const cam = gcam(g, { z0: -20, z1: 340, panX: -84, panY: -70, ry: 5, rx: -3.4, dur: END });
  const zt = zoomThrough(g, ZT, 34, HX, HY);
  const camT = zt.out === "none" ? cam.transform : `${cam.transform} ${zt.out}`;

  // ── LA LUZ: `sky` fría (de donde venimos) → ámbar de la ventana en el acto 3 → `volt` ────
  const tintA = light(ES(g, 300, 1520), "sky", "volt");
  const tint2A = light(ES(g, 560, 1180), "sky", "amber");
  const keyFrom = lerp(0.24, 0.62, ES(g, 120, 1420));
  const inten = lerp(0.84, 1.0, ES(g, 0, 1300));
  const piso = lerp(0.46, 0.82, ES(g, 280, 1640));

  // ── VENTANAS DE ACTO: recorte por RANGO de g, pisándose 20-30 cuadros ────────────────────
  const vA1 = g < 332;
  const vA2 = g > 296 && g < 676;
  const vA3 = g > 640 && g < 1006;
  const vA4 = g > 968 && g < 1366;
  const vA5 = g > 1330;

  // ── LA MONEDA: un solo objeto, un solo recorrido, los cinco actos ────────────────────────
  // A1 apoyada de canto · A2 rueda · A3 al borde · A4 entra a la caja · A5 se hunde = EL AGUJERO
  const mx =
    g < 315 ? lerp(25.5, 29.0, ES(g, 40, 300))
      : g < 660 ? lerp(29.0, 46.0, ES(g, 315, 640))
        : g < 990 ? lerp(46.0, 52.0, ES(g, 660, 940))
          : g < 1350 ? lerp(52.0, 63.5, ES(g, 1010, 1300))
            : lerp(63.5, HX, ES(g, 1352, 1500));
  const my =
    g < 315 ? 78.5
      : g < 660 ? lerp(78.5, 75.0, ES(g, 315, 640))
        : g < 990 ? lerp(75.0, 88.0, ES(g, 660, 900))
          : g < 1350 ? lerp(88.0, 71.0, ES(g, 1010, 1300))
            : lerp(71.0, HY, ES(g, 1352, 1500));
  const mrot = g < 315 ? Math.sin(g / 38) * 4 : (g - 315) * 1.45;
  // se HUNDE en la madera como en agua: 1490 → 1545
  const hunde = ES(g, 1490, 1545);
  const mSize = lerp(96, 74, hunde);
  const mOp = clamp01(1 - LN(g, 1512, 1548));
  // y el agujero nace exactamente donde estaba
  const hole = ES(g, 1500, 1560);

  // ── LA PELOTA DE LUZ que rebota dentro de la caja (acto 4) — determinista ────────────────
  const bola = (t: number) => {
    const sp = 1 + 2.4 * clamp01((t - 1010) / 150);
    return {
      x: lerp(15, 85, tri(t * 0.0195 * sp)),
      y: lerp(20, 80, tri(t * 0.0129 * sp + 0.37)),
    };
  };
  const satur = clamp01(LN(g, 1020, 1152));            // el verde se AMONTONA
  const fuga = LN(g, 1152, 1196);                      // y sale multiplicado por la rendija
  const lanaCae = ES(g, 1186, 1246);                   // cae la lana mineral
  const muere = clamp01(LN(g, 1252, 1322));            // la pelota se apaga

  // ── EL HAZ del acto 5: lo que sobrevive deja de ir en todas direcciones ──────────────────
  const haz = ES(g, 1420, 1496);

  // ── EL ADENTRO DEL AGUJERO: el cuadro de salida del movimiento ──────────────────────────
  const dentro = clamp01(LN(g, ZT + 24, ZT + 50));
  const aro = 352 + Math.sin(g / 46) * 5;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── ATMÓSFERA: se monta UNA vez, arriba de todo, y nunca se remonta ───────────────── */}
      <VoltAtmos tint={tintA} tint2={tint2A} keyFrom={keyFrom} intensity={inten} floor={piso} />

      {/* PLANO 0 — la cama de material real detrás de todo (cambia sólo bajo costura) */}
      {g < 660 && (
        <PhotoPlane src="img/cmesilencio/cms_s5_mano_hoja_cruda.jpg" kind="photo"
          z={0} scale={1.2} dim={lerp(0.5, 0.66, ES(g, 0, 640))} tint={V.sky} />
      )}
      {g >= 648 && g < 990 && (
        <PhotoPlane src="img/cmesilencio/cms_s5_dedo_rendija_junta.jpg" kind="photo"
          z={0} scale={1.24} dim={0.62} tint={V.amber} />
      )}
      {g >= 972 && (
        <PhotoPlane src="img/cmesilencio/cms_s5_dedo_rendija_junta.jpg" kind="photo"
          z={0} scale={1.42} dim={lerp(0.82, 0.9, ES(g, 972, 1500))} tint={V.volt} />
      )}

      <Layers cam={camT}>
        {/* ── PLANO FONDO z:-60 — el patio, el muro bajo y la ventana del vecino ──────────── */}
        <Plane z={-60}>
          <PadPlane y={86} w={1520} h={330} rx={64} lit={lerp(0.32, 0.6, ES(g, 200, 1200))} z={-260} />
          {/* la ventana amarilla del vecino, desenfocada al fondo */}
          {g < 1010 && (
            <div style={{
              position: "absolute", left: "78%", top: "34%", width: 168, height: 118,
              background: `linear-gradient(178deg, ${rgba(V.amber, 0.5)} 0%, ${rgba(V.amber, 0.22)} 100%)`,
              filter: "blur(13px)", opacity: lerp(0.36, 0.86, ES(g, 620, 980)), borderRadius: 5,
            }} />
          )}
          {/* el generador rojo late al fondo: de él salen los anillos */}
          {g < 1010 && (
            <Generador x={15} y={57} s={lerp(0.86, 1.12, ES(g, 0, 900))} lit={0.9}
              late={0.5 + 0.5 * Math.sin(g / 7)} />
          )}
        </Plane>

        {/* ── LA FIRMA: SoundField. Izquierda = contra el CONTRACHAPADO (se aplasta y muere),
              derecha = contra la ESPUMA (pasa de largo entera). Dos instancias, cada una
              recortada a su mitad: la comparación se decide delante de la cámara. ─────────── */}
        <Plane z={-30}>
          {(vA1 || vA2) && (
            <>
              <div style={{ position: "absolute", inset: 0, clipPath: "inset(0 49% 0 0)" }}>
                <SoundField db={78} x={15} y={57} wall={lerp(37, 33, ES(g, 315, 640))} on={1}
                  tint={V.volt} speed={1.05} spread={78} />
              </div>
              <div style={{ position: "absolute", inset: 0, clipPath: "inset(0 0 0 49%)" }}>
                <SoundField db={78} x={15} y={57} wall={null} on={1} tint={V.volt} speed={1.05} spread={78} />
              </div>
            </>
          )}
          {/* ACTO 3 — la caja forrada de espuma: los anillos salen ENTEROS por las juntas */}
          {vA3 && (
            <SoundField db={78} x={44} y={58} wall={null} on={clamp01(LN(g, 662, 700)) * (1 - LN(g, 950, 1000))}
              tint={V.volt} speed={1.15} spread={64} />
          )}
          {/* ACTO 5 — masa a la izquierda, absorbente a la derecha */}
          {vA5 && (
            <div style={{ position: "absolute", inset: 0, opacity: clamp01(1 - haz * 0.86) }}>
              <SoundField db={78} x={50} y={58} wall={70} on={1} tint={V.volt} speed={0.95} spread={52} />
            </div>
          )}
        </Plane>

        {/* ── PLANO MATERIA z:0 — las dos placas, la caja, el interior ───────────────────── */}
        <Plane z={0}>
          {/* ═══ ACTO 1 y 2 — LA COMPARACIÓN A LA MISMA ALTURA ═══════════════════════════ */}
          {(vA1 || vA2) && (
            <div style={{
              position: "absolute", inset: 0, transformStyle: "preserve-3d",
              opacity: clamp01(1 - LN(g, 648, 690)),
              transform: `translateY(${(-26 * ES(g, 640, 690)).toFixed(1)}px)`,
            }}>
              {/* la repisa del muro bajo: las dos placas se paran acá y hace de balanza */}
              <div style={{
                position: "absolute", left: "50%", top: "77%", width: 1180, height: 26, marginLeft: -590,
                transform: `rotate(${lerp(0, 3.1, ES(g, 360, 620)).toFixed(2)}deg)`, transformOrigin: "50% 50%",
                background: `linear-gradient(180deg, ${rgba(V.concrete, 0.62)} 0%, ${rgba(V.ink1, 1)} 100%)`,
                boxShadow: `0 18px 44px ${rgba(V.ink0, 0.85)}, inset 0 1px 0 ${rgba(V.white, 0.16)}`,
                borderRadius: 3,
              }} />
              {/* IZQUIERDA — el contrachapado: gira sobre su canto en el acto 2 */}
              <Placa
                x={lerp(31, 28.5, ES(g, 320, 640))}
                y={lerp(58, 60.5, ES(g, 320, 640))}
                w={lerp(430, 372, ES(g, 320, 640))}
                h={lerp(300, 336, ES(g, 320, 640))}
                ry={lerp(-4, -76, ES(g, 316, 612))}
                canto={lerp(13, 17, ES(g, 320, 640))}
                lit={0.95} z={40} sheenAt={54}
                label={g > 380 ? "12 MM" : undefined}
              />
              {/* DERECHA — la espuma: se hincha hasta ocho veces el grosor de la madera */}
              <Espuma
                x={lerp(69, 71.5, ES(g, 320, 640))}
                y={lerp(58, 60.5, ES(g, 320, 640))}
                w={lerp(400, 372, ES(g, 320, 640))}
                h={lerp(300, 336, ES(g, 320, 640))}
                grosor={lerp(26, 208, ES(g, 330, 626))}
                lit={0.9} z={20}
              />
              <IconPng src="img/cmesilencio/cms_ic_espuma.png" x={71.5} y={38} size={86} z={70}
                opacity={0.72 * clamp01(LN(g, 90, 140))} rot={-6} glow={V.ink0} />
              <IconPng src="img/cmesilencio/cms_ic_pesa.png" x={28.5} y={38} size={92} z={90}
                opacity={0.86 * clamp01(LN(g, 120, 176))} rot={4} glow={V.volt} />
            </div>
          )}

          {/* ═══ ACTO 3 — LA CAJA FORRADA DE ESPUMA (el error del espectador) ════════════ */}
          {vA3 && (
            <div style={{
              position: "absolute", inset: 0, transformStyle: "preserve-3d",
              opacity: clamp01(LN(g, 652, 692)) * clamp01(1 - LN(g, 976, 1000)),
            }}>
              {/* la caja cruda, abierta hacia la cámara: cinco caras de contrachapado */}
              <div style={{
                position: "absolute", left: "50%", top: "58%", width: lerp(700, 880, ES(g, 660, 980)),
                height: lerp(440, 540, ES(g, 660, 980)),
                marginLeft: -lerp(700, 880, ES(g, 660, 980)) / 2,
                marginTop: -lerp(440, 540, ES(g, 660, 980)) / 2,
                border: `18px solid ${rgba(V.paper, 0.5)}`,
                borderRadius: 6,
                background: `linear-gradient(176deg, ${rgba(V.ink1, 0.9)} 0%, ${rgba(V.ink0, 1)} 100%)`,
                boxShadow: `0 44px 90px ${rgba(V.ink0, 0.9)}, inset 0 0 90px ${rgba(V.ink0, 0.9)}`,
              }}>
                {/* el forro: espuma prolija en las cinco caras… que se despega y cae de TOALLA */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const cae = ES(g, 812 + i * 22, 900 + i * 22);
                  const px = [8, 30, 52, 74, 41][i];
                  const py = [16, 12, 16, 12, 62][i];
                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${px}%`, top: `${py + cae * 22}%`,
                      width: "20%", height: `${lerp(66, 30, cae)}%`,
                      borderRadius: lerp(3, 2, cae),
                      background: cae < 0.5
                        ? `linear-gradient(172deg, ${rgba(V.steel, 0.46)} 0%, ${rgba(V.ink2, 0.92)} 100%)`
                        : `linear-gradient(180deg, ${rgba(V.bone, 0.66)} 0%, ${rgba(V.steel, 0.3)} 62%, ${rgba(V.ink2, 0.9)} 100%)`,
                      boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.2)}, 0 10px 26px ${rgba(V.ink0, 0.7)}`,
                      transform: `rotate(${(lerp(0, (rnd(i * 3.7) - 0.5) * 9, cae)).toFixed(2)}deg)`,
                      opacity: 0.94,
                    }}>
                      {/* al caer se pliega como una toalla colgada de un clavo */}
                      <AbsoluteFill style={{
                        opacity: cae * 0.7,
                        backgroundImage: `repeating-linear-gradient(178deg, ${rgba(V.ink0, 0.42)} 0 3px, rgba(0,0,0,0) 3px 15px)`,
                      }} />
                    </div>
                  );
                })}
                {/* los hilos verdes que salen ENTEROS por las juntas de las esquinas */}
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{
                    position: "absolute",
                    left: i % 2 === 0 ? "-2%" : "auto", right: i % 2 === 1 ? "-2%" : "auto",
                    top: i < 2 ? "-1%" : "auto", bottom: i >= 2 ? "-1%" : "auto",
                    width: 210, height: 3,
                    transform: `rotate(${i === 0 ? -28 : i === 1 ? 28 : i === 2 ? 28 : -28}deg)`,
                    transformOrigin: i % 2 === 0 ? "left center" : "right center",
                    background: `linear-gradient(${i % 2 === 0 ? 270 : 90}deg, ${rgba(V.volt, 0.85)}, rgba(0,0,0,0))`,
                    opacity: 0.5 + 0.5 * Math.abs(Math.sin(g / 13 + i)),
                    filter: "blur(0.6px)",
                  }} />
                ))}
              </div>
              {/* la tarjeta con MATERIAL REAL: el dedo en la rendija de la junta */}
              <MediaCard
                src="broll/cmesilencio/cms_s5_dedo_rendija_junta.mp4" kind="video"
                w={430} h={258} x={lerp(84, 80, ES(g, 700, 960))} y={lerp(28, 31, ES(g, 700, 960))}
                z={150} ry={-13} rot={-2} lit={0.95} litColor={V.volt} label="LAS JUNTAS"
                sheenAt={720} opacity={clamp01(LN(g, 700, 744))} grade
              />
              {/* el sonómetro del muro sigue clavado en 78 y tiembla sin bajar */}
              <div style={{
                position: "absolute", inset: 0,
                transform: `translate(${(Math.sin(g / 3.1) * 2.2).toFixed(2)}px, ${(Math.cos(g / 2.7) * 1.6).toFixed(2)}px)`,
              }}>
                <Readout value="78" unit="dB" label="NO BAJA" at={706} x={17} y={24} size={132} color={V.volt} />
              </div>
            </div>
          )}

          {/* ═══ ACTO 4 — ADENTRO DE LA CAJA: el rebote, la saturación y la lana ═════════ */}
          {vA4 && (
            <div style={{
              position: "absolute", inset: 0, transformStyle: "preserve-3d",
              opacity: clamp01(LN(g, 982, 1006)) * clamp01(1 - LN(g, 1344, 1372)),
            }}>
              {/* las cinco paredes de contrachapado crudo, vistas desde adentro */}
              <div style={{
                position: "absolute", left: "10%", top: "13%", right: "10%", bottom: "12%",
                border: `2px solid ${rgba(V.paper, 0.3)}`, borderRadius: 4,
                background: `radial-gradient(120% 100% at 50% 40%, ${rgba(V.paper, 0.10)} 0%, ${rgba(V.ink0, 0.95)} 78%)`,
                boxShadow: `inset 0 0 140px ${rgba(V.ink0, 0.95)}`,
                overflow: "hidden",
              }}>
                {/* la estela QUE NO SE BORRA: el verde se amontona hasta saturar */}
                {Array.from({ length: 78 }, (_, k) => {
                  const t = g - k * 3;
                  if (t < 1004) return null;
                  const b = bola(t);
                  const a = 0.05 + 0.16 * satur * (1 - muere);
                  return (
                    <div key={k} style={{
                      position: "absolute", left: `${b.x}%`, top: `${b.y}%`,
                      width: 62, height: 62, marginLeft: -31, marginTop: -31, borderRadius: "50%",
                      background: `radial-gradient(closest-side, ${rgba(V.volt, a)}, rgba(0,0,0,0) 72%)`,
                      mixBlendMode: "screen",
                    }} />
                  );
                })}
                {/* LA PELOTA */}
                {(() => {
                  const b = bola(g);
                  const vida = clamp01(1 - muere);
                  return (
                    <div style={{
                      position: "absolute", left: `${b.x}%`, top: `${b.y}%`,
                      width: 96, height: 96, marginLeft: -48, marginTop: -48, borderRadius: "50%",
                      background: `radial-gradient(closest-side, ${rgba(V.volt, 0.95 * vida)} 0%, ${rgba(V.volt, 0.24 * vida)} 46%, rgba(0,0,0,0) 72%)`,
                      mixBlendMode: "screen",
                    }} />
                  );
                })()}
                {/* LA LANA MINERAL: cae desde arriba y se pega a las cinco caras */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const px = [1, 24, 47, 70, 24][i];
                  const py = [2, 2, 2, 2, 74][i];
                  const pw = [22, 22, 22, 29, 52][i];
                  const ph = [96, 96, 96, 96, 24][i];
                  const c = ES(g, 1186 + i * 14, 1256 + i * 14);
                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${px}%`, top: `${py}%`, width: `${pw}%`, height: `${ph}%`,
                      transform: `translateY(${((1 - c) * -120).toFixed(1)}%)`, opacity: c,
                      background: `linear-gradient(174deg, ${rgba(V.amber, 0.34)} 0%, ${rgba(V.copper, 0.26)} 52%, ${rgba(V.ink1, 0.9)} 100%)`,
                      boxShadow: `inset 0 0 40px ${rgba(V.ink0, 0.72)}`,
                    }}>
                      <AbsoluteFill style={{
                        opacity: 0.5,
                        backgroundImage: `repeating-linear-gradient(${62 + i * 11}deg, ${rgba(V.bone, 0.16)} 0 1px, rgba(0,0,0,0) 1px 6px)`,
                      }} />
                    </div>
                  );
                })}
                {/* LA FUGA: todo lo amontonado se escapa por la única rendija de la esquina */}
                {fuga > 0 && fuga < 1 && (
                  <div style={{
                    position: "absolute", right: "-6%", top: "18%", width: `${(70 * fuga).toFixed(1)}%`, height: 26,
                    transform: "rotate(-13deg)", transformOrigin: "right center",
                    background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.volt, 0.9 * Math.sin(fuga * Math.PI))})`,
                    filter: "blur(2px)", mixBlendMode: "screen",
                  }} />
                )}
              </div>
              <IconPng src="img/cmesilencio/cms_ic_lana.png" x={82} y={70} size={104} z={140}
                opacity={0.9 * lanaCae} rot={-7} glow={V.amber} />
              {/* la rendija por donde se escapó todo, con material REAL adentro */}
              <MediaCard
                src="broll/cmesilencio/cms_s5_luz_por_rendija.mp4" kind="video"
                w={412} h={244} x={81} y={26} z={170} ry={-14} rot={2}
                lit={0.95} litColor={V.volt} label="LA RENDIJA" sheenAt={1168}
                opacity={clamp01(LN(g, 1148, 1190)) * clamp01(1 - LN(g, 1318, 1352))} grade
              />
            </div>
          )}

          {/* ═══ ACTO 5 — MASA A LA IZQUIERDA, ABSORBENTE A LA DERECHA, Y EL AGUJERO ═════ */}
          {vA5 && (
            <div style={{
              position: "absolute", inset: 0, transformStyle: "preserve-3d",
              opacity: clamp01(LN(g, 1336, 1372)),
            }}>
              {/* el cuadro partido en dos MATERIAS, sin línea divisoria */}
              <div style={{
                position: "absolute", left: 0, top: 0, width: "58%", height: "100%",
                background: `linear-gradient(96deg, ${rgba(V.paper, 0.20)} 0%, ${rgba(V.paper, 0.09)} 62%, rgba(0,0,0,0) 100%)`,
              }}>
                <AbsoluteFill style={{
                  opacity: 0.24,
                  backgroundImage: `repeating-linear-gradient(94deg, ${rgba(V.copper, 0.5)} 0 2px, rgba(0,0,0,0) 2px 16px)`,
                }} />
              </div>
              <div style={{
                position: "absolute", right: 0, top: 0, width: "50%", height: "100%",
                background: `linear-gradient(264deg, ${rgba(V.amber, 0.20)} 0%, ${rgba(V.copper, 0.10)} 58%, rgba(0,0,0,0) 100%)`,
              }}>
                <AbsoluteFill style={{
                  opacity: 0.4,
                  backgroundImage: `repeating-linear-gradient(74deg, ${rgba(V.bone, 0.14)} 0 1px, rgba(0,0,0,0) 1px 7px)`,
                }} />
              </div>

              {/* EL HAZ: lo que sobrevive deja de ir en todas direcciones y apunta a UN punto */}
              {haz > 0.01 && (
                <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
                  style={{ position: "absolute", inset: 0 }}>
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const y0 = 300 + i * 96;
                    const x1 = lerp(1180, (HX / 100) * 1920, haz);
                    const y1 = lerp(y0, (HY / 100) * 1080, haz);
                    return (
                      <line key={i} x1={330} y1={y0} x2={x1} y2={y1}
                        stroke={rgba(V.volt, 0.16 + 0.5 * haz)} strokeWidth={1.4 + 3.4 * haz} />
                    );
                  })}
                </svg>
              )}

              {/* EL AGUJERO — nace exactamente donde estaba la moneda */}
              {hole > 0.01 && (
                <>
                  <div style={{
                    position: "absolute", left: `${HX}%`, top: `${HY}%`,
                    width: 86 * hole, height: 86 * hole, marginLeft: -43 * hole, marginTop: -43 * hole,
                    borderRadius: "50%", background: V.ink0,
                    boxShadow: `0 0 0 ${(3 * hole).toFixed(1)}px ${rgba(V.volt, 0.9)}, 0 0 ${(52 * hole).toFixed(0)}px ${rgba(V.volt, 0.5)}, inset 0 0 26px ${rgba(V.ink0, 1)}`,
                  }} />
                  {/* todo el sonido de la caja se ENHEBRA por ahí */}
                  <div style={{
                    position: "absolute", left: `${HX}%`, top: `${HY}%`,
                    width: 300 * hole, height: 300 * hole, marginLeft: -150 * hole, marginTop: -150 * hole,
                    borderRadius: "50%", mixBlendMode: "screen",
                    background: `radial-gradient(closest-side, rgba(0,0,0,0) 26%, ${rgba(V.volt, 0.34 * hole)} 34%, rgba(0,0,0,0) 72%)`,
                  }} />
                </>
              )}

              {/* EL BOTE: cinco centímetros de madera que igual se hunde por un agujero de moneda */}
              <MediaCard
                src="broll/cmesilencio/cms_s5_bote_madera_gruesa.mp4" kind="video"
                w={404} h={240} x={78} y={lerp(30, 27, ES(g, 1520, 1620))} z={190} ry={-15} rot={-2}
                lit={0.95} litColor={V.amber} label="5 CM DE MADERA" sheenAt={1536}
                opacity={clamp01(LN(g, 1518, 1552)) * clamp01(1 - LN(g, 1616, 1642))} grade
              />
              <MediaCard
                src="broll/cmesilencio/cms_s5_bote_se_hunde.mp4" kind="video"
                w={404} h={240} x={78} y={lerp(63, 60, ES(g, 1548, 1620))} z={190} ry={-15} rot={2}
                lit={0.95} litColor={V.volt} label="SE HUNDE IGUAL" sheenAt={1566}
                opacity={clamp01(LN(g, 1546, 1580)) * clamp01(1 - LN(g, 1616, 1642))} grade
              />
              <MediaCard
                src="broll/cmesilencio/cms_s5_agua_hilo_agujero.mp4" kind="video"
                w={330} h={198} x={20} y={76} z={160} ry={12} rot={-3}
                lit={0.9} litColor={V.volt} label="POR UN AGUJERO" sheenAt={1500}
                opacity={clamp01(LN(g, 1482, 1520)) * clamp01(1 - LN(g, 1600, 1628))} grade
              />
            </div>
          )}
        </Plane>

        {/* ── PRIMER PLANO z:+90 — LA MONEDA (cruza los cinco actos) + el polvo del patio ─── */}
        <Plane z={90} style={{ pointerEvents: "none" }}>
          {mOp > 0.01 && (
            <div style={{
              position: "absolute", left: `${mx}%`, top: `${my}%`,
              transform: `translate(-50%,-50%) rotate(${mrot.toFixed(2)}deg) scaleY(${(1 - hunde * 0.42).toFixed(3)})`,
              opacity: mOp,
              filter: `drop-shadow(0 10px 22px ${rgba(V.ink0, 0.9)})`,
            }}>
              <IconPng src="img/cmesilencio/cms_ic_moneda.png" x={0} y={0} size={mSize} z={0}
                opacity={1} rot={0} glow={hunde > 0.1 ? V.volt : V.ink0} />
            </div>
          )}
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

      {/* ── LOS RÓTULOS: una idea por acto, en cama oscura, fuera del parallax ────────────── */}
      {g < 306 && (
        <div style={{
          position: "absolute", left: 150, top: 132,
          opacity: clamp01(LN(g, 40, 76)) * clamp01(1 - LN(g, 274, 302)),
          transform: `translateY(${((1 - ES(g, 40, 76)) * 26).toFixed(1)}px)`,
        }}>
          <Bed pad={24}>
            <Kick>IDEA 1</Kick>
            <div style={{ height: 8 }} />
            <Head size={76}>El ruido lo detiene<br />el <Em>PESO</Em>, no la esponja</Head>
          </Bed>
        </div>
      )}
      {g > 330 && g < 640 && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 128, textAlign: "center",
          opacity: clamp01(LN(g, 340, 380)) * clamp01(1 - LN(g, 606, 636)),
        }}>
          <div style={{
            display: "inline-block", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30,
            letterSpacing: 5.4, color: rgba(V.white, 0.62), textTransform: "uppercase",
            textShadow: "0 4px 20px rgba(0,0,0,0.92)",
          }}>lo que de verdad frena el ruido</div>
          <Readout value="12" unit="mm" label="CONTRACHAPADO" at={392} x={28.5} y={22} size={126} color={V.volt} />
          <Readout value="10" unit="cm" label="ESPUMA" at={452} x={71.5} y={22} size={126} color={V.steel} />
        </div>
      )}
      {g > 700 && g < 986 && (
        <div style={{
          position: "absolute", left: 150, bottom: 128, maxWidth: 900,
          opacity: clamp01(LN(g, 712, 750)) * clamp01(1 - LN(g, 952, 982)),
        }}>
          <Bed pad={24}>
            <Kick>IDEA 2</Kick>
            <div style={{ height: 8 }} />
            <Head size={72}>Puso <Em>toallas</Em> donde<br />tenía que poner pared</Head>
          </Bed>
        </div>
      )}
      {g > 1040 && g < 1344 && (
        <div style={{
          position: "absolute", left: 150, bottom: 132, maxWidth: 880,
          opacity: clamp01(LN(g, 1050, 1088)) * clamp01(1 - LN(g, 1310, 1340)),
        }}>
          <Bed pad={24}>
            <Head size={70}>El sonido rebota,<br />se amontona y sale <Em>multiplicado</Em></Head>
            <div style={{ height: 10 }} />
            <Body size={30}>La lana no tapa: se come los rebotes.</Body>
          </Bed>
        </div>
      )}
      {g > 1430 && g < ZT + 6 && (
        <div style={{
          position: "absolute", left: 150, top: 138,
          opacity: clamp01(LN(g, 1440, 1478)) * clamp01(1 - LN(g, ZT - 30, ZT)),
        }}>
          <Bed pad={24}>
            <Kick>IDEA 3</Kick>
            <div style={{ height: 8 }} />
            <Head size={80}>Manda el <Em>AGUJERO</Em></Head>
            <div style={{ height: 10 }} />
            <div style={{
              fontFamily: F_BODY, fontWeight: 600, fontSize: 29, letterSpacing: 0.4,
              color: rgba(V.bone, 0.9), textShadow: "0 3px 16px rgba(0,0,0,0.9)",
            }}>Y ésta decide si tu caja sirve o no.</div>
          </Bed>
        </div>
      )}

      {/* ── COSTURA 1→2: WIPE DE MATERIA — el aserrín del canto que gira barre el cuadro ─── */}
      <SeamWipeMatter at={S12} dur={26} tint={V.paper} />
      {/* ── COSTURA 3→4: OCCLUDER — la boca de la caja pasa por delante (contrachapado) ──── */}
      <SeamOcclude at={S34} dur={20} color={V.paper} angle={7} lit={0.30} />

      {/* ── EL CUADRO DE SALIDA: DENTRO DEL AGUJERO ───────────────────────────────────────
          Negro total con el borde circular encendido en verde-voltio. Es EXACTAMENTE el cuadro
          con el que arranca MovDolares, que sale por esa junta hacia el patio. */}
      {dentro > 0.005 && (
        <AbsoluteFill style={{ opacity: dentro, backgroundColor: V.ink0, overflow: "hidden" }}>
          {/* material real del borde del agujero, se apaga antes del handoff para entregar
              un cuadro puramente geométrico que el movimiento siguiente puede clonar */}
          <div style={{
            position: "absolute", left: "50%", top: "50%", width: aro * 2, height: aro * 2,
            marginLeft: -aro, marginTop: -aro, borderRadius: "50%", overflow: "hidden",
            opacity: 0.5 * clamp01(1 - LN(g, 1664, 1692)),
          }}>
            <MediaCard
              src="broll/cmesilencio/cms_s5_borde_agujero_volt.mp4" kind="video"
              w={aro * 2} h={aro * 2} x={50} y={50} z={0} radius={aro}
              lit={0.4} litColor={V.volt} grade
            />
          </div>
          <AbsoluteFill style={{ background: rgba(V.ink0, 0.72) }} />
          {/* EL ARO: el filo del agujero, la única luz que queda */}
          <div style={{
            position: "absolute", left: "50%", top: "50%", width: aro * 2, height: aro * 2,
            marginLeft: -aro, marginTop: -aro, borderRadius: "50%",
            border: `4px solid ${rgba(V.volt, 0.92)}`,
            boxShadow: `0 0 64px ${rgba(V.volt, 0.5)}, inset 0 0 96px ${rgba(V.ink0, 0.74)}, inset 0 0 26px ${rgba(V.volt, 0.34)}`,
            background: `radial-gradient(64% 64% at 44% 40%, ${rgba(V.steel, 0.16)} 0%, ${rgba(V.ink1, 0.30)} 58%, rgba(0,0,0,0) 100%)`,
          }} />
          <AbsoluteFill style={{
            background: `radial-gradient(closest-side, rgba(0,0,0,0) 30%, ${rgba(V.ink0, 0.92)} 78%)`,
          }} />
        </AbsoluteFill>
      )}

      {/* viñeta de cierre */}
      <AbsoluteFill style={{
        background: `radial-gradient(128% 96% at 50% 50%, rgba(0,0,0,0) 42%, ${rgba(V.ink0, lerp(0.48, 0.9, ES(g, 1400, 1700)))} 100%)`,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export const MovAgujero: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  void acto; // el build lo usa para saber qué acto monta; acá TODO el dibujo sale de gFrame
  const localF = useCurrentFrame();
  const gf = gFrame === undefined ? localF : gFrame;
  // Los componentes del Stage leen useCurrentFrame(). Con este Sequence, adentro
  // useCurrentFrame() === gFrame: las costuras, los Readout y la fase del SoundField quedan
  // CONTINUOS aunque el build monte cada acto en su propia Sequence.
  const off = Math.round(localF - gf);
  const g = Math.max(0, Math.min(END, gf));
  return (
    <Sequence from={off} layout="none">
      <Agujero g={g} />
    </Sequence>
  );
};

/*
// ─────────────────────────────────────────────────────────────────────────────────────────────
// TABLA DE ENTRADA Y SALIDA DE LOS ACTOS — MovAgujero (1710 cuadros · 57,0 s)
// ─────────────────────────────────────────────────────────────────────────────────────────────
// ACTO | RANGO g (dibujo)   | ENTRA (encuadre + luz)                          | SALE (encuadre + luz)                              | COSTURA hacia el siguiente
// -----|--------------------|-------------------------------------------------|----------------------------------------------------|--------------------------------------------------
//  —   | (mov. tres números)| —                                               | cámara BAJANDO hacia una superficie, luz `sky` fría | (herencia de luz: `sky` entra igual acá)
//  1   | 0 → 332            | plano medio sobre la pared de contrachapado,     | placas a media altura sobre la repisa, la hoja ya   | 1→2 f=300 · WIPE DE MATERIA
//      | (acto 0→315)       | cám z≈-20 · luz `sky` fría · la moneda de canto  | empezando a girar sobre su canto · `sky`           | (`SeamWipeMatter` V.paper: el aserrín del canto)
//  2   | 296 → 676          | mismas placas, cám un paso más abajo y más cerca | canto de 12 mm de perfil vs. espuma 8× más gruesa;  | 2→3 f≈648-690 · METAMORFOSIS
//      | (acto 315→660)     | z≈+60 · `sky` · la moneda rueda por la repisa    | la balanza del muro volcada · `sky`+ámbar naciente  | (la hoja se despliega y SE VUELVE la caja)
//  3   | 640 → 1006         | la caja cruda abierta a cámara, forrada de       | la espuma despegada colgando de TOALLA, el 78       | 3→4 f=975 · OCCLUDER DE MATERIA
//      | (acto 660→990)     | espuma · z≈+130 · `sky` + ámbar de la ventana    | temblando sin bajar · ámbar de la ventana           | (`SeamOcclude` V.paper lit .30: la boca de la caja)
//  4   | 968 → 1366         | DENTRO de la caja, cinco paredes crudas y        | la lana pegada a las cinco caras, el interior       | 4→5 f=1338 · LA CÁMARA SIGUE
//      | (acto 990→1350)    | vacías · z≈+230 · `volt` de la pelota vs. ámbar  | limpio de verde, la moneda girando en el rincón     | (sin corte: el acto 5 ya está dentro del recorrido)
//  5   | 1330 → 1710        | sigue dentro de la caja, cuadro partido:         | DENTRO DEL AGUJERO: negro total con el aro del      | → MovDolares · ZOOM-THROUGH (f=1612, dur 34)
//      | (acto 1350→1710)   | madera / lana · z≈+340 · `volt` duro             | borde encendido en `volt` (aro r≈352 px, centrado)  | + METAMORFOSIS moneda→agujero (f≈1490-1560)
// ─────────────────────────────────────────────────────────────────────────────────────────────
// LA MONEDA (el objeto que cruza los cinco actos):
//   A1 apoyada de canto en la repisa (x 25,5→29 %) · A2 rueda siguiendo el giro (→46 %) ·
//   A3 quieta al borde inferior (→52 %, y 88 %) · A4 entra rodando al piso de la caja (→63,5 %) ·
//   A5 rueda hasta la pared (→41,5 % / 52 %), el haz la empuja, SE HUNDE (f 1490-1548) y deja su
//   forma exacta: EL AGUJERO (f 1500-1560). La cámara entra por ahí.
// ─────────────────────────────────────────────────────────────────────────────────────────────
*/
