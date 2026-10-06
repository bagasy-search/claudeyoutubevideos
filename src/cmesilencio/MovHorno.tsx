// MovHorno.tsx — S12 · EL HORNO  (arranca en 850,98 s · 51,6 s · 1549 frames · 5 actos)
//
// EL FRACASO QUE DA CREDIBILIDAD: la primera caja tenía "la entrada correcta según mis cuentas",
// con una rejilla de plástico blanco que se comía LA MITAD DEL ÁREA LIBRE (las barras se llevan
// entre el 30 y el 50% del paso: hay que contar los AGUJEROS, no el marco). 38 → 52 → 68 grados
// con 26 afuera, la luz del tablero en naranja, y a los 26 minutos el generador se apaga solo.
// Después el arreglo: agrandar la entrada, poner el segundo codo, y quedar en 34 con 26 afuera.
//
// ENTRA desde el PAPEL de la lámina: la cámara empuja contra la rejilla DIBUJADA a tinta en la
// página, las barras se levantan del papel, toman espesor y se vuelven la rejilla REAL de plástico
// blanco, y la cámara pasa entre dos barras a luz `torch`. Esa metamorfosis es la costura de entrada.
// SALE en rojo-ámbar de sobrecalentamiento, con la cámara ADENTRO de la caja, macro sobre la esfera.
//
// ⛔ UNA SOLA <Sequence> (la del wrapper, que alinea useCurrentFrame() con gFrame). Los actos se
//    recortan por RANGO de `g` y se pisan 20-40 cuadros. La cámara NUNCA vuelve a cero.
//
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, zoomThrough,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO ─────────────────────────────────────────────────────────────────
const END = 1549;

const A1 = 0, A2 = 176, A3 = 469, A4 = 829, A5 = 1189;   // arranques nominales de cada acto
const S12 = 120;      // ZOOM-THROUGH: la cámara se mete entre dos barras (dur 46)
const S23 = 469;      // LA CÁMARA SIGUE: el giro continuo de la esfera al tablero
const S34 = 829;      // HERENCIA DE LUZ: el negro tibio del apagón ES el negro del que sube el rojo
const S45 = 1176;     // OCCLUDER DE MATERIA: la rejilla de plástico cae por delante del lente

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));

// ── LA REJILLA — el objeto que nace DIBUJADO y termina siendo plástico ──────────────────────
// `m` = 0 → línea de tinta sobre el papel de la lámina.  `m` = 1 → barra de plástico blanco con
// espesor, canto iluminado y sombra propia. `negro` rellena las barras una por una (el área que
// tapaban de verdad). `abre` separa las dos barras centrales: por ahí pasa la cámara.
const Rejilla: React.FC<{
  g: number; m: number; x: number; y: number; w: number; h: number;
  negro?: number; abre?: number; op?: number; luz?: string;
}> = ({ g, m, x, y, w, h, negro = 0, abre = 0, op = 1, luz = V.torch }) => {
  const N = 7;
  const paso = w / N;
  const grosor = lerp(paso * 0.10, paso * 0.44, m);      // la barra se lleva del 10% al 44% del paso
  const cuerpo = light(m, "ink0", "blade");
  const canto = light(m, "ink0", "white");
  const respira = 1 + Math.sin(g / 71) * 0.004;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity: clamp01(op),
      transform: `translateZ(${lerp(0, 120, m).toFixed(1)}px) scale(${respira.toFixed(4)})`,
      transformStyle: "preserve-3d",
    }}>
      {/* EL MARCO: de trazo de tinta a perfil de plástico atornillado */}
      <div style={{
        position: "absolute", inset: 0,
        border: `${lerp(2.4, 15, m).toFixed(1)}px solid ${cuerpo}`,
        borderRadius: lerp(1, 8, m),
        boxShadow: `inset 0 ${lerp(0, 3, m).toFixed(1)}px 0 ${rgba(V.white, 0.34 * m)}, ` +
          `inset 0 -${lerp(0, 4, m).toFixed(1)}px 0 ${rgba(V.ink0, 0.5 * m)}, ` +
          `0 ${Math.round(26 * m)}px ${Math.round(58 * m)}px ${rgba(V.ink0, 0.78 * m)}`,
      }} />
      {/* LOS CUATRO TORNILLOS: aparecen cuando la cosa ya es un objeto, no un dibujo */}
      {[[0.045, 0.06], [0.955, 0.06], [0.045, 0.94], [0.955, 0.94]].map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p[0] * 100}%`, top: `${p[1] * 100}%`,
          width: lerp(3, 20, m), height: lerp(3, 20, m), marginLeft: -lerp(3, 20, m) / 2,
          marginTop: -lerp(3, 20, m) / 2, borderRadius: "50%",
          opacity: clamp01((m - 0.42) / 0.3),
          background: `radial-gradient(circle at 34% 28%, ${rgba(V.white, 0.85)} 0%, ${rgba(V.steel, 0.9)} 46%, ${rgba(V.ink0, 0.9)} 100%)`,
          boxShadow: `0 2px 6px ${rgba(V.ink0, 0.8)}`,
        }} />
      ))}
      {/* LAS BARRAS */}
      {Array.from({ length: N }, (_, i) => {
        const centro = (i + 0.5) * paso;
        const lado = i < (N - 1) / 2 ? -1 : i > (N - 1) / 2 ? 1 : 0;
        const dx = lado * abre * w * 1.15;
        const relleno = clamp01(negro * N - i);
        return (
          <div key={i} style={{
            position: "absolute", top: lerp(3, 12, m), bottom: lerp(3, 12, m),
            left: centro - grosor / 2 + dx, width: grosor,
            borderRadius: lerp(0.5, grosor * 0.22, m),
            overflow: "hidden",
            background: `linear-gradient(90deg, ${rgba(canto, 0.9)} 0%, ${cuerpo} 26%, ${rgba(V.ink0, 0.30 * m)} 74%, ${rgba(cuerpo, 0.86)} 100%)`,
            boxShadow: `0 ${Math.round(8 * m)}px ${Math.round(22 * m)}px ${rgba(V.ink0, 0.7 * m)}`,
          }}>
            {/* el reflejo del `torch` sobre el plástico */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(180deg, ${rgba(luz, 0.30 * m)} 0%, rgba(0,0,0,0) 34%, ${rgba(luz, 0.12 * m)} 100%)`,
            }} />
            {/* LO QUE TAPABA DE VERDAD: la barra se rellena de negro, una por una */}
            {relleno > 0 && (
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0,
                height: `${(relleno * 100).toFixed(1)}%`,
                background: `linear-gradient(180deg, ${rgba(V.ink0, 0.55)} 0%, ${rgba(V.ink0, 0.97)} 40%, ${V.ink0} 100%)`,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── EL AIRE QUE SE VE — el temblor caliente pegado a la lámina del motor ────────────────────
const Aire: React.FC<{ g: number; on: number; calor: number; frena: number; diag?: number }> = ({
  g, on, calor, frena, diag = 0,
}) => {
  if (on <= 0.01) return null;
  const vivo = 1 - clamp01(frena);
  return (
    <AbsoluteFill style={{ opacity: clamp01(on), pointerEvents: "none", mixBlendMode: "screen" }}>
      {Array.from({ length: 22 }, (_, i) => {
        const sp = (0.35 + rnd(i * 5.7) * 0.85) * (0.25 + 0.75 * vivo);
        const base = rnd(i * 3.1) * 100;
        const sube = (((base - (g * sp) / 7) % 130) + 130) % 130;
        const yy = lerp(sube, 88 - sube * 0.55, diag);
        const xx = lerp(20 + rnd(i * 9.3) * 26, 12 + rnd(i * 9.3) * 74, diag);
        const s = 26 + rnd(i * 7.1) * 74;
        const col = light(clamp01(calor), "torch", "danger");
        return (
          <div key={i} style={{
            position: "absolute", left: `${xx.toFixed(2)}%`, top: `${(yy - 12).toFixed(2)}%`,
            width: s, height: s * (1.6 - 0.7 * clamp01(frena)), borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(col, 0.11 + 0.1 * calor)}, rgba(0,0,0,0) 68%)`,
            filter: "blur(9px)",
            transform: `translateX(${(Math.sin(g / 23 + i) * 7 * vivo).toFixed(2)}px)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── LAS FRANJAS DE LUZ que se cuelan entre las barras y caen adentro de la caja ─────────────
const Franjas: React.FC<{ g: number; on: number; tint: string; ancho?: number }> = ({ g, on, tint, ancho = 96 }) => {
  if (on <= 0.01) return null;
  const dx = Math.sin(g / 118) * 12;
  return (
    <AbsoluteFill style={{ opacity: clamp01(on) * 0.5, pointerEvents: "none", mixBlendMode: "screen" }}>
      <div style={{
        position: "absolute", inset: "-20%",
        transform: `rotate(-8deg) translateX(${dx.toFixed(1)}px)`,
        background: `repeating-linear-gradient(90deg, ${rgba(tint, 0.16)} 0px, ${rgba(tint, 0.16)} ${Math.round(ancho * 0.34)}px, rgba(0,0,0,0) ${Math.round(ancho * 0.34)}px, rgba(0,0,0,0) ${ancho}px)`,
        filter: "blur(6px)",
      }} />
    </AbsoluteFill>
  );
};

// ── LA PARED DE LANA — el forro amarillo-ocre que se pone naranja con el calor ──────────────
const Lana: React.FC<{ g: number; calor: number; lado: "izq" | "der"; on: number }> = ({ g, calor, lado, on }) => {
  if (on <= 0.01) return null;
  const col = light(clamp01(calor), "amber", "danger");
  return (
    <div style={{
      position: "absolute", top: "-8%", bottom: "-8%", width: "22%",
      [lado === "izq" ? "left" : "right"]: "-2%",
      opacity: clamp01(on),
      background: `linear-gradient(${lado === "izq" ? 96 : 84}deg, ${rgba(col, 0.30)} 0%, ${rgba(col, 0.12)} 52%, rgba(0,0,0,0) 100%)`,
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.5,
        backgroundImage: `repeating-linear-gradient(${lado === "izq" ? 74 : 106}deg, ${rgba(V.white, 0.09)} 0 2px, rgba(0,0,0,0) 2px 11px), repeating-linear-gradient(${lado === "izq" ? 12 : -12}deg, ${rgba(V.ink0, 0.24)} 0 1px, rgba(0,0,0,0) 1px 16px)`,
        transform: `translateY(${(Math.sin(g / 97) * 4).toFixed(2)}px)`,
      }} />
    </div>
  );
};

// ── TITULAR: entra por barrido (clip-path), nunca por fade ─────────────────────────────────
const Titular: React.FC<{ g: number; at: number; out?: number; kick: string; text: string; top?: number; left?: number; color?: string }> = ({
  g, at, out = 999999, kick, text, top = 148, left = 148, color = V.volt,
}) => {
  const inP = ES(g, at, at + 17);
  const outP = ES(g, out, out + 15);
  if (inP <= 0) return null;
  const p = clamp01(inP - outP);
  if (p <= 0) return null;
  return (
    <div style={{
      position: "absolute", left, top, maxWidth: 900,
      transform: `translateY(${((1 - inP) * 26 - outP * 20).toFixed(1)}px)`,
      clipPath: `inset(0 ${(100 - p * 100).toFixed(1)}% -34% 0)`,
    }}>
      <Bed pad={22}>
        <Kick color={color}>{kick}</Kick>
        <div style={{ height: 8 }} />
        <Head size={72}>{text}</Head>
      </Bed>
    </div>
  );
};

// ── LA ESCENA ───────────────────────────────────────────────────────────────────────────────
const Horno: React.FC<{ g: number }> = ({ g }) => {
  // ── LA CÁMARA: una sola, que empuja contra el papel, atraviesa la rejilla y se cierra en macro
  //    sobre la esfera. Nunca retrocede: los empujones de acto se SUMAN, no reinician.
  const cam = gcam(g, { z0: 0, z1: 430, panX: -110, panY: 54, ry: 3.4, rx: -1.8, dur: END });
  const giro = lerp(0, -9.5, ES(g, S23 - 39, S23 + 91));       // 2→3: la cámara gira al tablero
  const macro = lerp(0, 210, ES(g, 1420, END));                // 5: el cierre en macro
  const camT = `${cam.transform} rotateY(${giro.toFixed(2)}deg) translateZ(${macro.toFixed(1)}px)`;

  // ── LA LUZ: papel cálido → torch → ámbar sucio → NEGRO → rojo de sobrecalentamiento →
  //    verde voltio (el número sano) → y otra vez rojo ámbar en la salida.
  const tintA =
    g < 200 ? light(ES(g, 108, 200), "paper", "torch")
      : g < 800 ? light(ES(g, 556, 800), "torch", "danger")
        : g < 1268 ? light(ES(g, 1152, 1268), "danger", "volt")
          : light(ES(g, 1402, 1508), "volt", "danger");
  const tint2A =
    g < 1000 ? V.amber
      : g < 1300 ? light(ES(g, 1000, 1124), "amber", "sky")
        : light(ES(g, 1300, 1436), "sky", "amber");
  const inten =
    g < 700 ? lerp(0.86, 1.0, ES(g, 118, 520))
      : g < 826 ? lerp(1.0, 0.15, ES(g, 700, 824))                // el apagón
        : lerp(0.15, 1.0, ES(g, 842, 1076));                      // el rojo vuelve a subir
  const keyFrom = lerp(0.30, 0.66, ES(g, 88, 520)) - lerp(0, 0.26, ES(g, 900, 1400));
  const piso = lerp(0.34, 0.76, ES(g, 118, 764));

  // ── LA METAMORFOSIS PAPEL → REJILLA (el mejor momento del movimiento) ──────────────────────
  const mp = ES(g, A1 + 18, A1 + 112);                          // la tinta toma espesor
  const zt = zoomThrough(g, S12, 46, 50, 50);                   // la cámara pasa entre dos barras
  const abre = ES(g, S12 + 4, S12 + 44);                        // las dos barras centrales se apartan
  const a1T = zt.out === "none" ? "none" : zt.out;

  // ── EL TERMÓMETRO: UNA sola aguja que sube, y nunca vuelve sola ────────────────────────────
  const grados = interpolate(
    g,
    [A2, 236, 300, 372, 430, 496, 604, 700, 792, 1060, 1230, 1300, 1470, END],
    [26, 38, 38.4, 46, 52, 54, 60, 66, 68, 68, 44, 34, 34, 36.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const calor = clamp01((grados - 30) / 40);

  // ── EL ÁREA LIBRE: 100% de lo que él creía → 50% de verdad ────────────────────────────────
  const negro = ES(g, 1004, 1122);
  const areaLibre = lerp(100, 50, negro);

  // ── VENTANAS DE ACTO (se pisan 20-40 cuadros; cada unión lleva su costura) ────────────────
  const v1 = g < A2 + 20;
  const v2 = g >= A2 - 20 && g < A3 + 20;
  const v3 = g >= A3 - 20 && g < A4 + 20;
  const v4 = g >= A4 - 20 && g < A5 + 20;
  const v5 = g >= A5 - 20;

  // el apagón del acto 3 y la brasa del acto 4
  const apaga = ES(g, S34 - 53, S34 - 3);
  const brasa = ES(g, 842, 992);
  const azul = ES(g, 1096, 1170);                               // la noche entrando por el hueco
  const drena = ES(g, 1150, 1300);                              // el rojo se va al verde
  const vuelve = ES(g, 1404, 1520);                             // y el rojo vuelve, más despacio

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── ATMÓSFERA: se monta UNA vez y no se remonta nunca ───────────────────────────── */}
      <VoltAtmos tint={tintA} tint2={tint2A} keyFrom={keyFrom} intensity={inten} floor={piso} />

      <Layers cam={camT}>
        {/* ═══ ACTO 1 · EL PAPEL SE VUELVE REJILLA ═════════════════════════════════════════ */}
        {v1 && (
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: a1T, opacity: zt.opacity }}>
            {/* LA PÁGINA REAL de la guía, con la rejilla dibujada en un rincón */}
            <Plane z={-520}>
              <PhotoPlane
                src="img/cms_lam_14acciones.jpg" kind="photo" z={0}
                scale={lerp(1.16, 2.7, mp)} dim={lerp(0.08, 0.66, mp)} tint={V.paper}
              />
              {/* la luz de lectura sobre el papel se apaga a medida que la cosa se vuelve objeto */}
              <AbsoluteFill style={{
                background: `radial-gradient(64% 52% at 52% 48%, ${rgba(V.paper, 0.16 * (1 - mp))} 0%, rgba(0,0,0,0) 72%)`,
              }} />
            </Plane>

            {/* LA REJILLA: nace como trazo de tinta en un rincón del dibujo y crece hasta ser
                el objeto de plástico atornillado en la cara de entrada, a contraluz. */}
            <Plane z={40}>
              <Rejilla
                g={g} m={mp}
                x={lerp(63.5, 50, mp)} y={lerp(59, 50, mp)}
                w={lerp(286, 1180, mp)} h={lerp(188, 760, mp)}
                abre={abre} luz={light(mp, "paper", "torch")}
              />
              {/* el contraluz de la última tarde detrás de la rejilla ya real */}
              <AbsoluteFill style={{
                background: `radial-gradient(38% 30% at 50% 50%, ${rgba(V.torch, 0.20 * mp)} 0%, rgba(0,0,0,0) 74%)`,
                mixBlendMode: "screen",
              }} />
            </Plane>

            {/* MATERIAL REAL: la rejilla de plástico, en la mano, sobre el banco */}
            <Plane z={150}>
              <MediaCard
                src="img/cmesilencio/cms_s12_deja_rejilla_banco.jpg" kind="photo"
                w={392} h={252} x={17} y={lerp(74, 70, ES(g, 20, 90))} z={0}
                ry={13} lit={0.95} litColor={V.paper} sheenAt={34}
                label="LA REJILLA DE PLÁSTICO"
                opacity={LN(g, 14, 34) * (1 - LN(g, 108, 136))}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_rejilla.png" x={85} y={24} size={116} z={0}
                opacity={LN(g, 40, 62) * (1 - LN(g, 104, 130))} glow={V.ink0}
              />
            </Plane>

            <Plane z={130}>
              <Titular g={g} at={24} out={112} kick="MI PRIMERA CAJA" text="LA CUENTA DABA BIEN" color={V.amber} />
            </Plane>
          </div>
        )}

        {/* ═══ ACTOS 2 y 3 · ADENTRO DE LA CAJA (la misma cama: la cámara sólo gira) ═══════ */}
        {(v2 || v3) && (
          <Plane z={-520}>
            <PhotoPlane
              src="img/cmesilencio/cms_s12_enchufa_carga_gruesa.jpg" kind="photo" z={0}
              scale={lerp(1.30, 1.52, ES(g, 160, 820))}
              dim={lerp(0.58, 0.94, Math.max(ES(g, 300, 700), apaga))}
              tint={light(calor, "torch", "danger")}
            />
          </Plane>
        )}

        {/* ═══ ACTO 2 · EL AIRE SE VUELVE VISIBLE Y LA AGUJA SE DESPEGA DEL CERO ═══════════ */}
        {v2 && (
          <>
            <Plane z={-260}>
              <Franjas g={g} on={LN(g, 156, 210) * (1 - apaga)} tint={V.torch} ancho={104} />
              <Lana g={g} calor={calor} lado="izq" on={LN(g, 176, 240)} />
              <Lana g={g} calor={calor} lado="der" on={LN(g, 176, 240)} />
            </Plane>

            <Plane z={-60}>
              <Aire g={g} on={LN(g, 196, 268) * (1 - ES(g, 430, 489))} calor={calor} frena={0} />
            </Plane>

            {/* LA ESFERA REAL: la cámara se le acerca y ya no se aleja */}
            <Plane z={60}>
              <MediaCard
                src="broll/cmesilencio/cms_s12_aguja_zona_verde.mp4" kind="video"
                w={lerp(430, 780, ES(g, 200, 460))} h={lerp(300, 540, ES(g, 200, 460))}
                x={lerp(70, 61, ES(g, 200, 460))} y={lerp(48, 46, ES(g, 200, 460))}
                z={0} ry={lerp(-11, -3, ES(g, 200, 460))} radius={18}
                lit={0.94} litColor={light(calor, "torch", "danger")} sheenAt={214}
                label="TERMÓMETRO DE ESFERA"
                opacity={LN(g, 168, 200)}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_termometro.png" x={13} y={72} size={126} z={40}
                opacity={LN(g, 232, 258) * (1 - LN(g, 442, 480))} glow={V.ink0}
              />
            </Plane>

            {/* LA CIFRA: una sola aguja que sube, con las dos marcas que dijo la narración */}
            <Plane z={120}>
              <Titular g={g} at={196} out={438} kick="LO ENCENDÍ BIEN CARGADO" text="Y ME SENTÉ A MIRAR" top={132} color={V.torch} />
              <div style={{
                position: "absolute", left: 152, top: 452, opacity: LN(g, 222, 250) * (1 - LN(g, 446, 482)),
              }}>
                <Bed pad={26} w={470}>
                  <Kick color={light(calor, "torch", "danger")}>GRADOS ADENTRO</Kick>
                  <div style={{ height: 6 }} />
                  <Num size={186} color={light(calor, "torch", "danger")}>{Math.round(grados)}</Num>
                  <div style={{ height: 10 }} />
                  <Body size={29}>
                    {g < 396 ? <>A los <Em color={V.torch}>diez minutos</Em>.</> : <>A los <Em color={V.amber}>veinte</Em>.</>}
                  </Body>
                </Bed>
              </div>
            </Plane>
          </>
        )}

        {/* ═══ ACTO 3 · LA LUZ DEL TABLERO SE PONE NARANJA Y SE APAGA SOLO ════════════════ */}
        {v3 && (
          <>
            <Plane z={-260}>
              <Franjas g={g} on={(1 - apaga) * 0.9} tint={light(calor, "torch", "danger")} ancho={104} />
              <Lana g={g} calor={calor} lado="izq" on={1 - apaga * 0.7} />
              <Lana g={g} calor={calor} lado="der" on={1 - apaga * 0.7} />
              {/* el ámbar sucio llena la caja entera y después se corta de golpe */}
              <AbsoluteFill style={{
                background: `radial-gradient(78% 62% at 62% 54%, ${rgba(V.danger, 0.30 * ES(g, 560, 780) * (1 - apaga))} 0%, rgba(0,0,0,0) 76%)`,
                mixBlendMode: "screen",
              }} />
            </Plane>

            {/* el temblor del aire se frena, se queda quieto y espeso */}
            <Plane z={-60}>
              <Aire g={g} on={(1 - apaga * 0.86)} calor={calor} frena={ES(g, 600, 790)} />
            </Plane>

            {/* EL TABLERO: material real + la lucecita que pasa de verde a naranja y late */}
            <Plane z={60}>
              <MediaCard
                src="broll/cmesilencio/cms_s12_enchufa_carga_gruesa.mp4" kind="video"
                w={lerp(560, 800, ES(g, 500, 760))} h={lerp(340, 470, ES(g, 500, 760))}
                x={lerp(84, 44, ES(g, 470, 620))} y={lerp(54, 50, ES(g, 470, 620))}
                z={0} ry={lerp(16, 2, ES(g, 470, 620))} radius={16}
                lit={lerp(0.95, 0.12, apaga)} litColor={light(ES(g, 560, 720), "torch", "danger")}
                sheenAt={492} label="EL TABLERO"
                opacity={LN(g, 462, 500)}
              />
              {/* LA LUCECITA DE CARGA */}
              {(() => {
                const naranja = ES(g, 560, 660);
                const late = 0.45 + 0.55 * Math.abs(Math.sin(g / 7.5));
                const vida = (1 - apaga);
                const col = light(naranja, "volt", "danger");
                return (
                  <div style={{
                    position: "absolute", left: "44%", top: "34%", width: 34, height: 34,
                    marginLeft: -17, marginTop: -17, borderRadius: "50%",
                    background: rgba(col, (0.5 + 0.5 * (naranja > 0.2 ? late : 1)) * vida),
                    boxShadow: `0 0 ${Math.round(20 + 54 * (naranja > 0.2 ? late : 0.4))}px ${rgba(col, 0.7 * vida)}`,
                    opacity: LN(g, 490, 520),
                  }} />
                );
              })()}
              <IconPng
                src="img/cmesilencio/cms_ic_alerta.png" x={80} y={26} size={132} z={60}
                opacity={LN(g, 620, 656) * (1 - apaga * 0.6)} glow={V.danger}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_calor.png" x={17} y={26} size={118} z={60}
                opacity={LN(g, 540, 578) * (1 - apaga * 0.8)} glow={V.ink0}
              />
            </Plane>

            {/* EL HUMO: sube derecho, choca contra la tapa y se desparrama a los costados */}
            <Plane z={20}>
              {Array.from({ length: 7 }, (_, i) => {
                const t = clamp01((ES(g, 700 + i * 16, 846 + i * 16)));
                if (t <= 0.001) return null;
                const yy = lerp(74, 17, t);
                const anchoX = lerp(1, 3.6, clamp01((t - 0.62) / 0.38));
                return (
                  <div key={i} style={{
                    position: "absolute", left: `${(40 + rnd(i * 4.7) * 22).toFixed(1)}%`, top: `${yy.toFixed(1)}%`,
                    width: 150, height: 150, marginLeft: -75, marginTop: -75, borderRadius: "50%",
                    transform: `scale(${anchoX.toFixed(2)}, ${(1 / Math.max(1, anchoX * 0.62)).toFixed(2)})`,
                    background: `radial-gradient(circle, ${rgba(V.bone, 0.15 * (1 - t * 0.4))}, rgba(0,0,0,0) 66%)`,
                    filter: "blur(15px)",
                  }} />
                );
              })}
            </Plane>

            {/* EL NEGRO DEL APAGÓN, con el filo ámbar del respiradero y las franjas en el piso */}
            <Plane z={200}>
              <AbsoluteFill style={{ background: rgba(V.ink0, 0.94 * apaga), pointerEvents: "none" }} />
              <div style={{
                position: "absolute", left: "8%", right: "8%", top: "22%", height: 5,
                borderRadius: 3, opacity: apaga,
                background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.amber, 0.72)} 38%, ${rgba(V.amber, 0.5)} 66%, rgba(0,0,0,0) 100%)`,
                boxShadow: `0 0 34px ${rgba(V.amber, 0.42 * apaga)}`,
              }} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: "6%", height: "26%", opacity: apaga * 0.7,
                background: `repeating-linear-gradient(96deg, ${rgba(V.amber, 0.10)} 0 34px, rgba(0,0,0,0) 34px 96px)`,
                filter: "blur(4px)",
              }} />
            </Plane>

            <Plane z={120}>
              <Titular g={g} at={504} out={660} kick="EL AIRE SE QUEDÓ QUIETO" text="PERDIÓ FUERZA" top={132} color={V.danger} />
              <Titular g={g} at={676} out={824} kick="MINUTO 26" text="SE APAGÓ SOLO" top={132} color={V.danger} />
              <div style={{
                position: "absolute", right: 150, top: 430, textAlign: "right",
                opacity: LN(g, 640, 676) * (1 - apaga * 0.9),
              }}>
                <Bed pad={24} w={400}>
                  <Kick color={V.danger}>ADENTRO</Kick>
                  <Num size={168} color={V.danger}>{Math.round(grados)}</Num>
                  <div style={{ height: 8 }} />
                  <Body size={28}>Con <Em color={V.sky}>26</Em> afuera.</Body>
                </Bed>
              </div>
            </Plane>
          </>
        )}

        {/* ═══ ACTO 4 · LA BRASA, LA REJILLA ARRANCADA Y LA MITAD DEL ÁREA ════════════════ */}
        {v4 && (
          <>
            {/* la cama nueva emerge DEL NEGRO (herencia de luz), no de un fundido: entra CUANDO el
                cuadro ya está negro (g ≥ 826), nunca a la vista */}
            <Plane z={-520} style={{ opacity: g >= S34 - 3 ? 1 : 0 }}>
              <PhotoPlane
                src="img/cmesilencio/cms_s12_sierra_agujero_pared.jpg" kind="photo" z={0}
                scale={lerp(1.34, 1.20, ES(g, 900, 1200))}
                dim={lerp(0.97, 0.52, brasa)}
                tint={light(drena, "danger", "volt")}
              />
            </Plane>

            {/* EL ROJO DE SOBRECALENTAMIENTO tiñe contrachapado, lana y lámina: la caja es brasa */}
            <Plane z={-260}>
              <Lana g={g} calor={1 - drena * 0.75} lado="izq" on={brasa} />
              <Lana g={g} calor={1 - drena * 0.75} lado="der" on={brasa} />
              <AbsoluteFill style={{
                background: `radial-gradient(86% 70% at 50% 58%, ${rgba(V.danger, 0.34 * brasa * (1 - drena * 0.8))} 0%, rgba(0,0,0,0) 78%)`,
                mixBlendMode: "screen",
              }} />
              {/* LA LUZ AZUL DE LA NOCHE entrando de golpe por el rectángulo abierto */}
              <div style={{
                position: "absolute", left: "50%", top: "52%", width: lerp(300, 1240, azul), height: lerp(180, 780, azul),
                marginLeft: -lerp(300, 1240, azul) / 2, marginTop: -lerp(180, 780, azul) / 2,
                opacity: azul, borderRadius: 8,
                background: `radial-gradient(closest-side, ${rgba(V.sky, 0.34)} 0%, rgba(0,0,0,0) 78%)`,
                mixBlendMode: "screen",
              }} />
            </Plane>

            {/* LA REJILLA arrancada: entra desde abajo, confiesa cuánto tapaba y se va del cuadro */}
            <Plane z={90}>
              <Rejilla
                g={g} m={1}
                x={50}
                y={lerp(132, 52, ES(g, 930, 1010)) + lerp(0, 118, ES(g, 1128, S45 + 12))}
                w={1180} h={760}
                negro={negro}
                op={1 - LN(g, S45 + 4, S45 + 20)}
                luz={light(azul, "danger", "sky")}
              />
            </Plane>

            {/* MATERIAL REAL: la rejilla en el banco, la sierra, el segundo codo */}
            <Plane z={160}>
              <MediaCard
                src="broll/cmesilencio/cms_s12_deja_rejilla_banco.mp4" kind="video"
                w={396} h={250} x={16} y={26} z={0} ry={12} radius={14}
                lit={0.94} litColor={V.danger} sheenAt={962} label="LA SAQUÉ"
                opacity={LN(g, 944, 978) * (1 - LN(g, 1112, 1142))}
              />
              <MediaCard
                src="broll/cmesilencio/cms_s12_sierra_agujero_pared.mp4" kind="video"
                w={430} h={268} x={19} y={72} z={0} ry={9} radius={14}
                lit={0.95} litColor={light(drena, "danger", "volt")} sheenAt={1094}
                label="AGRANDAR LA ENTRADA"
                opacity={LN(g, 1078, 1108)}
              />
              <MediaCard
                src="img/cmesilencio/cms_s12_atornilla_lamina_aro.jpg" kind="photo"
                w={392} h={248} x={83} y={30} z={0} ry={-12} radius={14}
                lit={0.95} litColor={V.volt} sheenAt={1146} label="EL SEGUNDO CODO"
                opacity={LN(g, 1132, 1162)}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_sierra.png" x={17} y={45} size={112} z={40}
                opacity={LN(g, 1086, 1114) * (1 - LN(g, 1178, 1200))} glow={V.ink0}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_codo.png" x={84} y={58} size={124} z={40}
                opacity={LN(g, 1140, 1168)} glow={V.ink0}
              />
            </Plane>

            {/* LA CIFRA DEL ACTO: lo que quedaba libre de verdad */}
            <Plane z={120}>
              <Titular g={g} at={870} out={996} kick="42 GRADOS POR ENCIMA" text="ESO NO ES UNA CAJA" top={128} color={V.danger} />
              <Titular g={g} at={1008} kick="CONTÉ LOS AGUJEROS" text="LA MITAD DEL ÁREA" top={128} color={V.volt} />
              <div style={{
                position: "absolute", right: 148, top: 476, textAlign: "right",
                opacity: LN(g, 1016, 1048) * (1 - LN(g, 1188, 1206)),
              }}>
                <Bed pad={24} w={440}>
                  <Kick color={V.volt}>ÁREA LIBRE DE VERDAD</Kick>
                  <Num size={178} color={light(negro, "amber", "volt")}>{`${Math.round(areaLibre)}%`}</Num>
                  <div style={{ height: 8 }} />
                  <Body size={27}>Las barras se llevan del <Em>30</Em> al <Em>50</Em> por ciento del paso.</Body>
                </Bed>
              </div>
            </Plane>
          </>
        )}

        {/* ═══ ACTO 5 · TRES HORAS, 34 CON 26 AFUERA, Y LA AMENAZA QUE NO TERMINÓ ═════════ */}
        {v5 && (
          <>
            {/* la cama del acto 5 entra EXACTAMENTE en el instante de cobertura total del occluder */}
            <Plane z={-520} style={{ opacity: g >= S45 + 13 ? 1 : 0 }}>
              <PhotoPlane
                src="img/cmesilencio/cms_s12_orienta_tubo_afuera.jpg" kind="photo" z={0}
                scale={lerp(1.26, 1.44, ES(g, 1200, END))}
                dim={lerp(0.60, 0.86, ES(g, 1380, END))}
                tint={light(vuelve, "volt", "danger")}
              />
            </Plane>

            {/* EL AIRE VUELVE A MOVERSE: cruza la caja en diagonal, del hueco de abajo al codo */}
            <Plane z={-160}>
              <Aire g={g} on={LN(g, 1186, 1250)} calor={0.16 + 0.6 * vuelve} frena={0} diag={ES(g, 1200, 1320)} />
              <Lana g={g} calor={0.1 + 0.75 * vuelve} lado="izq" on={0.9} />
              <Lana g={g} calor={0.1 + 0.75 * vuelve} lado="der" on={0.9} />
              <AbsoluteFill style={{
                background: `linear-gradient(38deg, rgba(0,0,0,0) 22%, ${rgba(light(vuelve, "volt", "danger"), 0.13)} 52%, rgba(0,0,0,0) 78%)`,
                mixBlendMode: "screen",
              }} />
            </Plane>

            {/* EL RELOJ DE TALLER: tres vueltas completas, sin cortar */}
            <Plane z={40}>
              <IconPng
                src="img/cmesilencio/cms_ic_reloj.png" x={15} y={27} size={148} z={0}
                rot={1080 * ES(g, 1206, 1418)}
                opacity={LN(g, 1196, 1226) * (1 - LN(g, 1450, 1486))} glow={V.ink0}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_tubo_flexible.png" x={85} y={70} size={126} z={0}
                opacity={LN(g, 1246, 1278) * (1 - LN(g, 1430, 1470))} glow={V.ink0}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_ok.png" x={85} y={26} size={132} z={0}
                opacity={LN(g, 1288, 1320) * (1 - LN(g, 1416, 1452))} glow={V.volt}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_calor.png" x={16} y={70} size={126} z={0}
                opacity={LN(g, 1452, 1500)} glow={V.danger}
              />
            </Plane>

            {/* LA ESFERA: la verde se abre y la cámara la atraviesa hasta el macro de la roja */}
            <Plane z={70}>
              <MediaCard
                src="broll/cmesilencio/cms_s12_aguja_zona_roja.mp4" kind="video"
                w={lerp(700, 1560, ES(g, 1400, END))} h={lerp(430, 950, ES(g, 1400, END))}
                x={50} y={lerp(50, 49, ES(g, 1400, END))} z={0} radius={lerp(20, 8, ES(g, 1400, END))}
                lit={lerp(0.6, 1, ES(g, 1390, 1500))} litColor={light(vuelve, "volt", "danger")}
                sheenAt={1466} grade
                opacity={LN(g, 1352, 1400)}
              />
              <MediaCard
                src="broll/cmesilencio/cms_s12_aguja_zona_verde.mp4" kind="video"
                w={lerp(760, 2600, ES(g, 1360, 1470))} h={lerp(520, 1780, ES(g, 1360, 1470))}
                x={50} y={48} z={lerp(0, 260, ES(g, 1360, 1470))} radius={20}
                lit={0.96} litColor={V.volt} sheenAt={1214} label={g < 1330 ? "TRES HORAS SEGUIDAS" : undefined}
                opacity={LN(g, 1178, 1210) * (1 - LN(g, 1372, 1436))}
              />
            </Plane>

            {/* LOS NÚMEROS SANOS: 34 adentro, 26 afuera, +8 escrito en el aire */}
            <Plane z={120}>
              <Titular g={g} at={1214} out={1404} kick="TRES HORAS SEGUIDAS" text="OCHO POR ENCIMA: SANO" top={128} color={V.volt} />
              <div style={{
                position: "absolute", left: 150, top: 470,
                opacity: LN(g, 1244, 1276) * (1 - LN(g, 1400, 1450)),
              }}>
                <Bed pad={26} w={520}>
                  <Kick color={V.volt}>ADENTRO · AFUERA</Kick>
                  <div style={{ height: 6 }} />
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
                    <Num size={168} color={V.volt}>{Math.round(grados)}</Num>
                    <div style={{ paddingBottom: 22 }}><Num size={104} color={rgba(V.sky, 0.92)}>26</Num></div>
                  </div>
                  <div style={{ height: 10 }} />
                  <Body size={29}>La diferencia es <Em>ocho grados</Em>. Ese es el número que se mide.</Body>
                </Bed>
              </div>
              <Readout
                value="+8" unit="°" label="SOBRE EL AMBIENTE" at={1300}
                x={80} y={72} size={150} color={V.volt}
              />
            </Plane>
          </>
        )}

        {/* PLANO DE PRIMER TÉRMINO: el polvo del taller, parallax fuerte, hold vivo */}
        <Plane z={300} style={{ pointerEvents: "none" }}>
          {Array.from({ length: 15 }, (_, i) => {
            const sp = 0.5 + rnd(i * 11.3) * 1.5;
            const yy = (((rnd(i * 4.4) * 132 - (g * sp) / 9) % 132) + 132) % 132;
            const s = 3 + rnd(i * 7.9) * 5;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 2.2) * 110 - 5).toFixed(2)}%`, top: `${(yy - 12).toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(V.white, 0.05 + rnd(i * 5.1) * 0.1),
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURA 1→2 · el canto de la barra de plástico pasa pegado al lente mientras la
             cámara se mete entre dos barras (materia `blade`, a luminancia media) ─────────── */}
      <SeamOcclude at={S12 + 26} dur={30} color={V.blade} angle={82} lit={0.28} />

      {/* ── el aserrín de la sierra, DENTRO del acto 4 (no es una unión: es la materia del acto) */}
      <SeamWipeMatter at={1098} dur={26} tint={V.paper} />

      {/* ── COSTURA 4→5 · la rejilla arrancada cae por delante del lente ──────────────────── */}
      <SeamOcclude at={S45} dur={26} color={V.blade} angle={-72} lit={0.30} />

      {/* viñeta: se cierra sobre la esfera para entregar el macro en rojo-ámbar */}
      <AbsoluteFill style={{
        background: `radial-gradient(${lerp(128, 74, ES(g, 1380, END)).toFixed(0)}% ${lerp(96, 58, ES(g, 1380, END)).toFixed(0)}% at 50% 50%, rgba(0,0,0,0) 42%, ${rgba(V.ink0, lerp(0.48, 0.9, ES(g, 1300, END)))} 100%)`,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export const MovHorno: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  void acto;                       // el build lo usa para saber qué acto monta; acá TODO sale de `g`
  const localF = useCurrentFrame();
  const gf = gFrame ?? localF;
  // Los componentes del Stage leen useCurrentFrame(). Con este Sequence, adentro
  // useCurrentFrame() === gFrame: las costuras, los Readout, el polvo y la deriva de las tarjetas
  // quedan CONTINUOS aunque el build monte cada acto en su propia ventana.
  const off = Math.round(localF - gf);
  const g = Math.max(0, Math.min(END, gf));
  return (
    <Sequence from={off} layout="none">
      <Horno g={g} />
    </Sequence>
  );
};

/*
── TABLA DE ENTRADA Y SALIDA DE LOS ACTOS ─────────────────────────────────────────────────────
ACTO | RANGO g (ventana)   | ENTRA (encuadre + luz)                          | SALE (encuadre + luz)                              | COSTURA hacia el siguiente
-----|---------------------|-------------------------------------------------|----------------------------------------------------|-------------------------------------------------
 1   | 0 → 176   (0-196)   | la HOJA de la guía a sangre, luz `paper` cálida, | la rejilla REAL de plástico llena el cuadro,        | METAMORFOSIS + ZOOM-THROUGH: las barras
     |                     | la rejilla dibujada a tinta en un rincón        | contraluz de la última tarde, `paper`→`torch`      | dibujadas toman espesor y se vuelven plástico;
     |                     | (cám z≈0, empuja contra el papel)               | (cám z≈+50, entre las dos barras centrales)        | la cámara pasa entre ellas · SeamOcclude V.blade
     |                     |                                                 |                                                    | (lit .28) = el canto de la barra pegado al lente
-----|---------------------|-------------------------------------------------|----------------------------------------------------|-------------------------------------------------
 2   | 176 → 469 (156-489) | ADENTRO de la caja cerrada, luz `torch` en      | macro medio sobre la esfera, aire temblando,       | LA CÁMARA SIGUE: el mismo movimiento gira
     |                     | franjas entre las barras, lana amarilla        | `torch` virando a ámbar sucio (52 grados)          | −9,5° de la esfera al tablero; la cama de foto
     |                     | (cám z≈+55, aguja despegándose del cero)        | (cám z≈+150, la esfera ya no se aleja)             | es la MISMA: nada corta
-----|---------------------|-------------------------------------------------|----------------------------------------------------|-------------------------------------------------
 3   | 469 → 829 (449-849) | el tablero entra por derecha con el giro,       | NEGRO tibio: sólo el filo ámbar del respiradero    | HERENCIA DE LUZ: el negro del apagón ES el
     |                     | ámbar sucio, la lucecita todavía verde          | y las franjas marcadas en el piso; el humo         | negro del que sube el rojo del acto 4 — el
     |                     | (cám z≈+150)                                    | aplastado bajo la tapa (cám z≈+235)                | color de salida es literalmente el de entrada
-----|---------------------|-------------------------------------------------|----------------------------------------------------|-------------------------------------------------
 4   | 829 → 1189(809-1209)| del NEGRO sube el rojo-ámbar de brasa sobre     | el rojo drenado hacia el verde voltio por la       | OCCLUDER DE MATERIA: la rejilla arrancada
     |                     | contrachapado, lana y lámina                    | diagonal reabierta; azul de la noche por el hueco  | cae por delante del lente (V.blade, lit .30)
     |                     | (cám z≈+235, la rejilla sube desde abajo)       | (cám z≈+330, la rejilla saliendo por abajo)        |
-----|---------------------|-------------------------------------------------|----------------------------------------------------|-------------------------------------------------
 5   | 1189 → 1549(1169-…) | verde voltio, el aire cruzando en diagonal,     | MACRO sobre la esfera, aguja temblando en el borde | (SALIDA DEL MOVIMIENTO) cámara ADENTRO de la
     |                     | reloj girando tres vueltas                      | de la zona caliente, ROJO-ÁMBAR otra vez, viñeta   | caja, en rojo-ámbar. El tramo intermedio de
     |                     | (cám z≈+330)                                    | cerrada (cám z≈+640, lo más cerca del video)       | planos sueltos la saca al patio → MovDieciocho
───────────────────────────────────────────────────────────────────────────────────────────────
*/
