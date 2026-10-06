// Mov4Origenes.tsx — MOVIMIENTO 4 del VSL de constructorlibre.com/curso.
// 18,00 s · 540 frames @30 · arranca en el frame ABSOLUTO 3222 (seg 107,40 del video).
//
// Es EL TRAMO DEL VALOR: por qué le pagan a él y no al vecino. Un SOLO movimiento continuo de
// 4 actos, con UNA atmósfera montada una vez, UNA cámara (`useCam(desde)`, función del frame
// GLOBAL — hereda la inercia de lo que venía antes y nunca arranca en 0) y una luz que vira de
// FRÍA (la impotencia del vecino con la escoba) a CÁLIDA (el oficio) sin saltos.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF (`suites_premium.md` §4)
// ══════════════════════════════════════════════════════════════════════════════════════════════
// VECINO ANTERIOR (f<0): plano a sangre de `img/vslx01.png` (hombre con escoba), cámara en deriva
//   lenta, luz FRÍA, materia = LA PARED a sangre.
//
// ACTO 1 · f0–200 · "los tres orígenes"            protagonista: EL ABANICO 3D de 3 cartas
//   enterFrom {cam: la que trae el video (deriva lenta, z≈1.0, ry≈-1°), luz: {temp: FRÍA 0.30 azul,
//              dir: 250°}, materia: "la PARED a sangre — la del vecino se vuelve la que mide Tomás"}
//   exitTo    {cam: dentro de la carta "Del suelo" (zk=1, scale×10, ry→0), luz: {temp: cálida 0.42,
//              dir: 254°}, materia: "la CARTA-PARED crecida hasta sangrar el cuadro"}
//
// ACTO 2 · f200–336 · "qué material, cuánto"       protagonista: EL MATERIAL EN CAPAS (balde→brocha→pared)
//   enterFrom {cam: sale del interior de la carta, ya sobre el plano de la pared, luz: {0.42, 252°},
//              materia: "la pared: la carta se convirtió en el muro que se está tratando"}
//   exitTo    {cam: deriva a la derecha siguiendo el rectángulo que viaja, luz: {0.46, 250°},
//              materia: "el RECTÁNGULO del clip de la espátula, ya en movimiento"}
//
// ACTO 3 · f336–424 · "que no parezca un parche"    protagonista: LA FOTO DEL TRABAJO TERMINADO
//   enterFrom {cam: la del acto 2 (el rectángulo llega a su caja grande), luz: {0.46, 250°},
//              materia: "el mismo rectángulo: adentro el clip se volvió la foto del zócalo pintado"}
//   exitTo    {cam: encuadre abierto y asentado, luz: {0.50, 248°},
//              materia: "el REVOQUE/PINTURA gris-hueso que cruza el cuadro (las dos bandas)"}
//
// ACTO 4 · f424–540 · "pagan el diagnóstico"        protagonista: EL REMATE (texto) sobre el medidor
//   enterFrom {cam: heredada, casi quieta, luz: {0.50, 248°},
//              materia: "el MEDIDOR DE HUMEDAD — el mismo con el que Tomás abría el acto 1"}
//   exitTo    {cam: quieta, z asentado, luz: {0.58 cálida, 246°}, materia: "el cuadro DESPEJADO:
//              plate + grade asentados en los últimos ~12 frames"}
//
// VECINO SIGUIENTE (f>540): componente de 4 pasos numerados (Diagnosticar → Tratar → Cobrar →
//   Conseguir), tarjetas claras sobre velo oscuro, centradas → por eso el acto 4 saca TODO el texto
//   y los flotantes antes de f530 y deja el velo ya profundo.
//
// ── LAS 4 COSTURAS (una distinta por frontera, ⛔ ninguna es un fade) ──────────────────────────
//  F0   (f0)   CORTE EN EL BEAT — corte seco en "Tú sí": el vecino cierra con una foto a sangre y
//              acá entra otra foto a sangre, MISMO encuadre y MISMA escala; lo único que cambia es
//              la temperatura, que vira en los 44 frames siguientes.
//  F1   (f200) ZOOM-THROUGH — la carta "Del suelo" (la que está en foco cuando termina la frase)
//              crece ×10 y la cámara la ATRAVIESA. Cobertura opaca 100 % en f198–202 (5 frames).
//  F2   (f336) MATCH-SHAPE — el rectángulo del clip de la espátula VIAJA de su caja chica a la caja
//              hero y, mientras se mueve (con desenfoque de movimiento), su contenido pasa del clip
//              a la foto del trabajo terminado. Es el MISMO rectángulo: nunca hay dos.
//  F3   (f424) OCLUSIÓN — dos bandas de REVOQUE GRIS-HUESO (#A79C8B / #BCB2A0) cruzan en sentidos
//              opuestos y tapan el 100 % del cuadro en f422–429 (8 frames).
//              ⛔ el color es el de la MATERIA que cruza, NUNCA el del fondo (con el color del fondo
//              no ocluye: hace un fundido a negro y se ve un flash — medido en `mdbleach`).
//
// ── MATERIA QUE CRUZA CADA FRONTERA (nada nace de cero) ───────────────────────────────────────
//  · LA PARED: la del vecino → la que mide Tomás → la carta "Del suelo" → el muro del acto 2.
//  · EL RECTÁNGULO: la carta del abanico → la caja del clip → la caja hero del trabajo terminado.
//  · EL HUD DE ORÍGENES: los 3 íconos PNG entran en f138 y sobreviven los tres actos siguientes
//    (en f440 se les suma `ic_diag.png`: los tres orígenes + el diagnóstico).
//  · EL MEDIDOR: abre el acto 1 (Tomás midiendo) y cierra el acto 4 (las manos con el medidor).
//  · EL LÍQUIDO: `img/vslm01.png` es el objeto de primer plano del acto 2 y vuelve en el remate,
//    porque el remate habla literalmente de él ("no pagan el líquido").
//
// ⛔⛔ CONTRATO TÉCNICO (cada punto costó un render):
//  · CERO `Math.random`/`Date.now`: el farm rinde en 50 chunks paralelos. Todo es función pura de
//    `useCurrentFrame()`; lo aleatorio sale de `rnd()` del Escenario.
//  · CERO `backdrop-filter` y CERO `filter: blur` grande a pantalla completa: el desenfoque de
//    fondo son los hermanos `_blur.jpg` que ya están en disco.
//  · `<Video>` NUNCA: sólo `OffthreadVideo`.
//  · ⛔ `loop` no es prop de `OffthreadVideo`: ningún clip se usa más allá de su duración real.
//    Cada clip va envuelto en su `<Sequence>` para que su reloj arranque en 0 (si no, un clip
//    montado en el frame local 214 pediría el segundo 7,1 de un clip de 4,0 s → cuadro congelado).
//    003=191f · 046=185f · 045=160f · 008=121f · 039=79f · 013=211f · 052=75f · 042=143f
//  · `Easing.quint` NO EXISTE → `Easing.poly(5)`. `Easing.out(undefined)` compila y explota.
//
// ── ASSETS (para el tarball del farm; hardcodeados acá, el build tiene que escanear este .tsx) ──
//  img/vsls01.png + img/vsls01_blur.jpg   img/vsls02.png + img/vsls02_blur.jpg
//  img/vsls03.png + img/vsls03_blur.jpg   img/vsld01.png  img/vsld02.png  img/vsld03.png
//  img/vslk02.png  img/vslm01.png
//  img/ic_aire.png  img/ic_afuera.png  img/ic_suelo.png  img/ic_diag.png
//  broll/vslcurso_003.mp4  broll/vslcurso_013.mp4  broll/vslcurso_039.mp4  broll/vslcurso_008.mp4
import React from "react";
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, Sequence,
  interpolate, staticFile, useCurrentFrame,
} from "remotion";
import {
  useCam, useActo, useEntra, Plate, Grade, Atmos, Contacto, Occluder,
  Titular, Kicker, Chip, SAFE, FF, INK, PAPER, SOFT, MUTE, ACC, rnd, SOMBRA_TEXTO,
} from "./Escenario";

// ── helpers ───────────────────────────────────────────────────────────────────────────────────
const W = 1920;

/** interpolate con clamp en los dos lados (el 95 % de los usos de este archivo). */
const ip = (f: number, ent: number[], sal: number[], easing?: (n: number) => number) =>
  interpolate(f, ent, sal, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const cl = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
/** desenfoque de movimiento barato: sólo se emite si suma algo. */
const bl = (px: number) => (px > 0.12 ? `blur(${px.toFixed(2)}px)` : undefined);

/** los cortes de acto, en frames LOCALES. La cámara sigue siendo GLOBAL. */
const CORTES = [0, 200, 336, 424];

// ══ CAJA — la tarjeta flotante de este movimiento ══════════════════════════════════════════════
/** ⛔⛔ REGLA DURA de `suites_premium.md`: *toda tarjeta flotante lleva MATERIAL REAL adentro*. Por
 *  eso `children` es obligatorio y siempre es una foto o un clip; no existe la variante "forma con
 *  texto". Es hermana de `Tarjeta` del Escenario, pero con GEOMETRÍA ANIMABLE (x/y/w/h como
 *  números interpolados), que es lo que hace posible el MATCH-SHAPE de la frontera 2: un solo
 *  rectángulo que viaja de una caja a otra en vez de dos tarjetas que se cruzan.
 *
 *  Capas: sombra de objeto sólido con canto · sombra de CONTACTO que aterriza · el material dentro
 *  de un marco con recorte · rim-light en el canto superior · specular que sigue a la key (el mismo
 *  seno lento que usa `useKeyLight`) · flote e inclinación 3D propios por semilla. */
const Caja: React.FC<{
  x: number; y: number; w: number; h: number;
  children: React.ReactNode;
  z?: number; seed?: number; op?: number; rot?: number; radio?: number;
  /** transform 2D de pantalla, ANTES de la perspectiva (lo usa el zoom-through) */
  pre?: string;
  /** transform 3D dentro de la perspectiva de la caja (lo usa el abanico) */
  tr?: string;
  desenfoque?: number;
  contacto?: boolean;
}> = ({ x, y, w, h, children, z = 0, seed = 0, op = 1, rot = 0, radio = 18, pre = "", tr = "", desenfoque = 0, contacto = true }) => {
  const f = useCurrentFrame();
  const flota = Math.sin(f / (63 + rnd(seed + 3) * 26) + seed * 1.9) * (2.6 + rnd(seed + 9) * 3.4);
  const wob = Math.cos(f / 187 + seed * 2.3) * 0.85;
  const ang = 104 + 9 * Math.sin(f / 190);          // la key respira despacio: el specular la sigue
  if (op <= 0.004) return null;
  return (
    <>
      {contacto && (
        <div
          style={{
            position: "absolute", left: x + w * 0.05, top: y + h - 12, width: w * 0.9, height: 26,
            borderRadius: "50%", pointerEvents: "none",
            background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,${(0.52 * op).toFixed(3)}) 0%, rgba(0,0,0,0) 72%)`,
            filter: "blur(10px)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute", left: x, top: y, width: w, height: h, opacity: op,
          borderRadius: radio, background: PAPER, overflow: "hidden",
          transform: `${pre} perspective(1900px) ${tr} translateZ(${z.toFixed(1)}px) translateY(${flota.toFixed(2)}px) rotateY(${(rot + wob).toFixed(3)}deg)`,
          filter: bl(desenfoque),
          boxShadow: "0 12px 24px rgba(0,0,0,.42), 0 34px 68px rgba(0,0,0,.46), 0 74px 132px rgba(0,0,0,.34)",
        }}
      >
        <div style={{ position: "absolute", inset: 6, borderRadius: radio - 6, overflow: "hidden", background: SOFT }}>
          {children}
        </div>
        {/* specular que sigue a la key */}
        <div
          style={{
            position: "absolute", inset: 0, borderRadius: radio, pointerEvents: "none",
            mixBlendMode: "screen", opacity: 0.5,
            background: `linear-gradient(${ang.toFixed(1)}deg, rgba(255,255,255,0) 26%, rgba(255,255,255,0.40) 47%, rgba(255,255,255,0) 68%)`,
          }}
        />
        {/* rim: el canto del marco */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "rgba(255,255,255,0.62)" }} />
      </div>
    </>
  );
};

/** material dentro de una caja: llena el hueco y no se deforma. */
const Mat: React.FC<{ src: string; op?: number; escala?: number }> = ({ src, op = 1, escala = 1 }) => {
  const es = src.endsWith(".mp4");
  const st: React.CSSProperties = {
    position: "absolute", inset: 0, width: "100%", height: "100%",
    objectFit: "cover", opacity: op,
    transform: escala === 1 ? undefined : `scale(${escala.toFixed(3)})`,
  };
  return es
    ? <OffthreadVideo src={staticFile(src)} muted style={st} />
    : <Img src={staticFile(src)} style={st} />;
};

// ══ ACTO 1 · EL ABANICO 3D DE LOS TRES ORÍGENES ════════════════════════════════════════════════
const CW = 430;   // ancho de carta
const PH = 352;   // alto del material
const CH = 520;   // alto total (material + cajetín)
const FAN_Y = 596;

const ORIGENES = [
  { rotulo: "Del aire", sub: "la pared fría junta el vapor", foto: "img/vsld01.png", ic: "img/ic_aire.png", at: 83 },
  { rotulo: "De afuera", sub: "entra por una grieta o una gotera", foto: "img/vsld02.png", ic: "img/ic_afuera.png", at: 100 },
  { rotulo: "Del suelo", sub: "sube del suelo y deja salitre", foto: "img/vsld03.png", ic: "img/ic_suelo.png", at: 118 },
];

/** ⚠️ Por qué NO es el anillo de `<Carrusel>` y es un ABANICO plano: el anillo pone las cartas de
 *  canto (paso de 57°) y en el tramo f140–200 —donde el guion pide que LAS TRES SE LEAN— el texto
 *  sale deformado. Acá el ángulo máximo es 14° (cos 14° = 0,97: sin deformación) y la carta sin foco
 *  nunca baja de 0,96 de escala ni de −70 px de Z, así que el rótulo queda en 40,8 px efectivos y el
 *  sub en 25,0 px — justo por encima del mínimo. La profundidad la dan el Z, el parallax por carta
 *  (la delantera flota más que la trasera), el desenfoque de las traseras y la sombra de contacto. */
const CartaOrigen: React.FC<{
  i: number; foco: number; zk: number; blurMul: number; contactoOp: number;
}> = ({ i, foco, zk, blurMul, contactoOp }) => {
  const o = ORIGENES[i];
  const f = useCurrentFrame();
  const e = useEntra(o.at, { rise: 40, salida: false });
  const esFoco = i === 2;                                      // la carta que la cámara atraviesa

  const ad = cl(1 - Math.abs(foco - i));                       // 1 = está en foco
  const cx = 960 + (i - 1) * 498;
  const ry = (i - 1) * 14 * (1 - 0.75 * ad);
  const z = -70 + 220 * ad;
  const sc = (0.96 + 0.08 * ad) * (esFoco ? 1 + 9.5 * zk : 1 - 0.32 * zk);
  const op = e.a * (0.72 + 0.28 * ad) * (esFoco ? 1 : cl(1 - 1.6 * zk));
  const pre = esFoco && zk > 0
    ? `translate(${((960 - cx) * zk).toFixed(1)}px, ${((540 - FAN_Y) * zk).toFixed(1)}px)`
    : "";
  const dif = (1 - ad) * 1.7 * blurMul + (esFoco ? zk * zk * 2.2 : 0);
  const capOp = esFoco ? ip(f, [182, 190], [1, 0]) : 1;

  return (
    <>
      {/* sombra de CONTACTO: la elipse que ATERRIZA debajo de la carta (la capa que convence al ojo
          de que está apoyada). Va FUERA de la caja, que recorta su contenido. */}
      <div style={{ position: "absolute", left: cx, top: 0, width: 0, height: 0 }}>
        <Contacto
          w={CW * sc} y={FAN_Y + (CH / 2) * sc - 4}
          op={contactoOp * (0.30 + 0.24 * ad) * cl(1 - 2 * zk) * e.s}
        />
      </div>
    <Caja
      x={cx - CW / 2} y={FAN_Y - CH / 2} w={CW} h={CH}
      z={z} seed={i * 7 + 3} op={op} radio={20}
      tr={`rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(4)})`}
      pre={pre} desenfoque={dif} contacto={false}
    >
      {/* L5 · el MATERIAL REAL: la foto del origen */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: PH, overflow: "hidden" }}>
        <Mat src={o.foto} escala={1.04 + 0.03 * ad} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(12,11,9,0) 52%, rgba(12,11,9,${(0.30 + 0.16 * (1 - ad)).toFixed(3)}) 100%)` }} />
        {/* el ícono PNG transparente como objeto de la escena */}
        <div
          style={{
            position: "absolute", right: 16, top: 16, width: 66, height: 66, borderRadius: 33,
            background: "rgba(255,255,255,0.93)", boxShadow: "0 8px 20px rgba(0,0,0,.38)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: e.a, transform: `translateY(${(e.y * 0.4).toFixed(1)}px)`,
          }}
        >
          <Img src={staticFile(o.ic)} style={{ width: 44, height: 44, objectFit: "contain" }} />
        </div>
      </div>
      {/* el cajetín: rótulo ≥40 px / sub ≥25 px incluso en la carta SIN foco */}
      <div style={{ position: "absolute", left: 0, right: 0, top: PH, height: CH - PH, padding: "20px 26px 0", opacity: capOp }}>
        <div style={{ fontFamily: FF, fontSize: 44, fontWeight: 700, color: INK, letterSpacing: "-0.024em", lineHeight: 1.06 }}>
          {o.rotulo}
        </div>
        <div style={{ fontFamily: FF, fontSize: 27, fontWeight: 500, color: MUTE, marginTop: 9, lineHeight: 1.26 }}>
          {o.sub}
        </div>
        <div style={{ position: "absolute", left: 26, bottom: 18, width: 62, height: 5, borderRadius: 3, background: ACC, opacity: 0.35 + 0.65 * ad }} />
      </div>
    </Caja>
    </>
  );
};

// ══ HUD DE MATERIA — los íconos que SOBREVIVEN los cuatro actos ═════════════════════════════════
const HUD = ["img/ic_aire.png", "img/ic_afuera.png", "img/ic_suelo.png", "img/ic_diag.png"];

const HudOrigenes: React.FC = () => {
  const f = useCurrentFrame();
  const op = ip(f, [138, 152], [0, 1]) * ip(f, [516, 530], [1, 0]);
  if (op <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: W - SAFE - 306, top: SAFE, display: "flex", gap: 22, opacity: op }}>
      {HUD.map((s, i) => {
        const nace = i === 3 ? 440 : 138 + i * 12;
        const a = ip(f, [nace, nace + 14], [0, 1]);
        const y = (1 - a) * 12;
        const lat = Math.sin(f / (74 + i * 13) + i * 1.6) * 2.2;
        return (
          <div
            key={s}
            style={{
              width: 60, height: 60, borderRadius: 14,
              background: i === 3 ? "rgba(224,146,44,0.92)" : "rgba(255,255,255,0.14)",
              border: `2px solid ${i === 3 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.30)"}`,
              boxShadow: i === 3 ? "0 10px 26px rgba(224,146,44,.38)" : "0 8px 20px rgba(0,0,0,.34)",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: a, transform: `translateY(${(y + lat).toFixed(2)}px)`,
            }}
          >
            <Img src={staticFile(s)} style={{ width: 38, height: 38, objectFit: "contain" }} />
          </div>
        );
      })}
    </div>
  );
};

// ══ EL MOVIMIENTO ══════════════════════════════════════════════════════════════════════════════
export const Mov4Origenes: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const cam = useCam(desde);            // ⛔ UNA sola cámara, función del frame GLOBAL
  const acto = useActo(CORTES);

  // ── LA LUZ, que EVOLUCIONA (nunca salta): frío de la impotencia → cálido del oficio ──────────
  const frio = ip(f, [0, 44], [0.30, 0]);
  const calor = ip(f, [0, 44, 200, 336, 424, 476], [0.10, 0.34, 0.42, 0.46, 0.50, 0.58]);
  const keyX = 62 + 6 * Math.sin(f / 210);
  const dirAng = 250 + 4 * Math.sin(f / 260) - ip(f, [0, 540], [0, 4]);
  const dirA = ip(f, [0, 200, 336, 476], [0.34, 0.30, 0.26, 0.40]);
  // velo: 0,56·fuerza es el alfa real. 0,40 deja ver la materia; 0,59 sostiene el remate blanco.
  const fuerza = ip(f, [0, 70, 140, 206, 330, 424, 500, 540], [0.72, 0.82, 0.98, 0.88, 0.86, 1.05, 1.00, 0.95]);

  // ── ABANICO: el foco viaja al ms de la palabra (aire f83 · afuera f100 · suelo f118) ─────────
  const foco = ip(f, [83, 100, 118, 146, 170, 186], [0, 1, 2, 2, 1, 2], Easing.inOut(Easing.cubic));
  // F1 · ZOOM-THROUGH: cobertura opaca del 100 % en f198–202.
  const zk = ip(f, [184, 203], [0, 1], Easing.in(Easing.cubic));
  const blurMul = ip(f, [138, 150], [1, 0]);   // en el tramo "las tres se leen" NADA está borroso

  // ── plates (L1) y sus copias desenfocadas (L3) ───────────────────────────────────────────────
  const op2 = ip(f, [198, 201], [0, 1]);
  const op4 = ip(f, [422, 426], [0, 1]);
  const b1 = ip(f, [70, 104], [0, 0.80]);
  const b2 = ip(f, [210, 240], [0, 0.72]);
  const b4 = ip(f, [438, 468], [0, 0.60]);

  // ── ACTO 2/3 · geometría del RECTÁNGULO que hace el MATCH-SHAPE ───────────────────────────────
  const mk = ip(f, [326, 354], [0, 1], Easing.inOut(Easing.cubic));
  const mx = ip(mk, [0, 1], [1180, 700]);
  const my = ip(mk, [0, 1], [300, 240]);
  const mw = ip(mk, [0, 1], [560, 1040]);
  const mh = ip(mk, [0, 1], [360, 620]);
  const mBlur = Math.sin(cl(mk) * Math.PI) * 2.4;           // el contenido cambia BAJO el movimiento
  const clipOp = ip(f, [326, 334], [1, 0]);
  const mOp = ip(f, [214, 224], [0, 1]) * ip(f, [418, 426], [1, 0]);

  // ── ACTO 2 · objeto de primer plano (el balde y las botellas) ────────────────────────────────
  const fgOp = ip(f, [206, 220], [0, 1]) * ip(f, [418, 426], [1, 0]);
  const fgK = ip(f, [326, 352], [0, 1], Easing.inOut(Easing.cubic));

  // ── ACTO 4 · el remate ───────────────────────────────────────────────────────────────────────
  const remate = ip(f, [512, 528], [1, 0]);
  const liqOp = ip(f, [434, 446], [0, 1]) * ip(f, [452, 474], [1, 0.42]) * ip(f, [506, 520], [1, 0]);
  const pulso = 0.5 + 0.5 * Math.sin(f / 26);

  // la plataforma de las piezas hereda la cámara global, amortiguada (parallax propio de la capa)
  const piezasTr = `perspective(2200px) scale(${(1 + (cam.z - 1) * 0.55).toFixed(4)}) translate3d(${(cam.panX * 0.45).toFixed(3)}%, ${(cam.panY * 0.45).toFixed(3)}%, 0) rotateY(${(cam.ry * 0.6).toFixed(3)}deg) rotateX(${(cam.rx * 0.6).toFixed(3)}deg)`;
  const blurTr = `scale(1.13) translate(${(cam.panX * 0.22).toFixed(3)}%, ${(cam.panY * 0.22).toFixed(3)}%)`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0B09", overflow: "hidden" }}>
      {/* ══ L1 · PLATES ═══════════════════════════════════════════════════════════════════════ */}
      {/* ACTO 1 — Tomás midiendo la pared: el corte en el beat entra acá, a sangre y SIN fade */}
      {f <= 202 && <Plate src="img/vsls01.png" desde={desde} profundidad={0.18} />}
      {/* ACTO 2/3 — la pared que se está tratando (montada bajo la carta que crece, ver F1) */}
      {f >= 196 && f <= 428 && (
        <AbsoluteFill style={{ opacity: op2 }}>
          <Plate src="img/vsls02.png" desde={desde} profundidad={0.22} />
        </AbsoluteFill>
      )}
      {/* ACTO 4 — las manos con el medidor: el MEDIDOR cierra el arco que abrió el acto 1 */}
      {f >= 420 && (
        <AbsoluteFill style={{ opacity: op4 }}>
          <Plate src="img/vsls03.png" desde={desde} profundidad={0.20} />
        </AbsoluteFill>
      )}

      {/* ══ L3 · PROFUNDIDAD — la copia _blur.jpg del MISMO plate (⛔ nunca backdrop-filter) ════ */}
      {f >= 70 && f <= 202 && (
        <AbsoluteFill style={{ opacity: b1, overflow: "hidden" }}>
          <Img src={staticFile("img/vsls01_blur.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: blurTr }} />
        </AbsoluteFill>
      )}
      {f >= 210 && f <= 428 && (
        <AbsoluteFill style={{ opacity: b2 * op2, overflow: "hidden" }}>
          <Img src={staticFile("img/vsls02_blur.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: blurTr }} />
        </AbsoluteFill>
      )}
      {f >= 438 && (
        <AbsoluteFill style={{ opacity: b4, overflow: "hidden" }}>
          <Img src={staticFile("img/vsls03_blur.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: blurTr }} />
        </AbsoluteFill>
      )}

      {/* ══ L2 · GRADE — UN solo velo para los cuatro actos, con fuerza que evoluciona ═════════ */}
      <Grade p={1} fuerza={fuerza} lado="centro" />

      {/* ══ L6 · LUZ — frío que se va, cálido que llega, y una direccional que gira despacio ═══ */}
      {frio > 0.004 && (
        <AbsoluteFill
          style={{
            opacity: frio, mixBlendMode: "screen", pointerEvents: "none",
            background: "radial-gradient(120% 95% at 28% 8%, rgba(126,166,206,0.62) 0%, rgba(126,166,206,0) 68%)",
          }}
        />
      )}
      <AbsoluteFill
        style={{
          opacity: calor, mixBlendMode: "screen", pointerEvents: "none",
          background: `radial-gradient(105% 82% at ${keyX.toFixed(2)}% 10%, rgba(224,146,44,0.52) 0%, rgba(224,146,44,0) 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `linear-gradient(${dirAng.toFixed(2)}deg, rgba(12,11,9,${dirA.toFixed(3)}) 0%, rgba(12,11,9,0) 64%)`,
        }}
      />

      {/* ══ L5+L7 · LAS PIEZAS — una sola plataforma, con la cámara heredada ══════════════════ */}
      <AbsoluteFill style={{ transform: piezasTr, transformOrigin: "50% 50%" }}>

        {/* ─────────── ACTO 1 · f0–200 · LOS TRES ORÍGENES ─────────── */}
        {f <= 202 && (
          <>
            {/* columna de materia al borde derecho: condensación REAL corriendo, muy al fondo.
                003 = 191 frames; se usa de f56 a f200 (144). */}
            <Sequence from={56} durationInFrames={144} layout="none">
              <Caja
                x={1762} y={124} w={268} h={840} z={-300} seed={31} radio={10} contacto={false}
                op={ip(f, [56, 74], [0, 0.7]) * ip(f, [186, 200], [1, 0])}
              >
                <Mat src="broll/vslcurso_003.mp4" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(12,11,9,0.42) 0%, rgba(12,11,9,0.10) 60%)" }} />
              </Caja>
            </Sequence>

            {/* el texto del acto: 1 sola idea */}
            <div
              style={{
                position: "absolute", left: SAFE, top: 112, width: 900,
                opacity: ip(f, [176, 192], [1, 0]),
                transform: `translateY(${(-ip(f, [176, 192], [0, 22])).toFixed(1)}px)`,
              }}
            >
              <Kicker at={8}>DE DÓNDE VIENE EL AGUA</Kicker>
              <div style={{ marginTop: 16 }}>
                <Titular at={18} size={58} z={52}>Tres orígenes, tres tratamientos</Titular>
              </div>
              <div
                style={{
                  marginTop: 22, width: ip(f, [24, 52], [0, 168]), height: 6, borderRadius: 3,
                  background: ACC, boxShadow: "0 6px 20px rgba(224,146,44,.45)",
                }}
              />
            </div>

            {/* EL ABANICO 3D: tres tarjetas flotantes con la foto real de cada origen */}
            <div style={{ position: "absolute", inset: 0, perspective: 2000, perspectiveOrigin: "50% 46%" }}>
              {ORIGENES.map((o, i) => (
                <CartaOrigen key={o.foto} i={i} foco={foco} zk={zk} blurMul={blurMul} contactoOp={0.9 * (acto.i === 0 ? 0.6 + 0.4 * acto.p : 1)} />
              ))}
            </div>
          </>
        )}

        {/* ─────────── ACTO 2 · f200–336 · EL MATERIAL EN CAPAS ─────────── */}
        {f >= 200 && f <= 426 && (
          <>
            {/* plano profundo: el impermeabilizante corriendo, sangrando por la izquierda.
                013 = 211 frames; se usa de f203 a f404 (201). */}
            <Sequence from={203} durationInFrames={201} layout="none">
              <Caja
                x={-46} y={150} w={334} h={800} z={-280} seed={17} radio={10} contacto={false}
                op={ip(f, [203, 222], [0, 0.66]) * ip(f, [384, 402], [1, 0])}
              >
                <Mat src="broll/vslcurso_013.mp4" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, rgba(12,11,9,0.40) 0%, rgba(12,11,9,0.06) 62%)" }} />
              </Caja>
            </Sequence>

            {/* plano medio: el rodillo cargado en la bandeja. 039 = 79 frames; f252→f330 (78). */}
            <Sequence from={252} durationInFrames={78} layout="none">
              <Caja
                x={740} y={150} w={360} h={240} z={-90} seed={23} radio={14}
                op={ip(f, [252, 264], [0, 1]) * ip(f, [312, 328], [1, 0])}
              >
                <Mat src="broll/vslcurso_039.mp4" />
              </Caja>
            </Sequence>

            {/* EL OBJETO DE PRIMER PLANO: el balde, las botellas, la brocha y los guantes */}
            <Caja
              x={260 - fgK * 112} y={580 + fgK * 58} w={640} h={380} z={190 - fgK * 120}
              seed={11} radio={20} op={fgOp * (1 - 0.18 * fgK)}
            >
              <Mat src="img/vslm01.png" escala={1.03} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,11,9,0) 60%, rgba(12,11,9,0.26) 100%)" }} />
            </Caja>

            {/* ── EL RECTÁNGULO DEL MATCH-SHAPE (F2, f336) ──────────────────────────────────────
                UN solo rectángulo: nace como la caja del clip de la espátula y VIAJA hasta la caja
                hero; su contenido pasa del clip a la foto del trabajo terminado mientras se mueve y
                está desenfocado por movimiento. 008 = 121 frames; el clip vive f214→f334 (120). */}
            <Caja x={mx} y={my} w={mw} h={mh} z={70 + mk * 60} seed={5} radio={20} op={mOp} desenfoque={mBlur}>
              <Mat src="img/vslk02.png" escala={1.02} />
              {clipOp > 0.004 && (
                <Sequence from={214} durationInFrames={120} layout="none">
                  <Mat src="broll/vslcurso_008.mp4" op={clipOp} />
                </Sequence>
              )}
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(12,11,9,0) 58%, rgba(12,11,9,${(0.14 + 0.14 * mk).toFixed(3)}) 100%)` }} />
            </Caja>

            {/* el texto del acto 2: 1 sola idea, y se va antes de que el rectángulo llegue */}
            <div
              style={{
                position: "absolute", left: SAFE, top: 116, width: 560,
                opacity: ip(f, [320, 336], [1, 0]),
                transform: `translateY(${(-ip(f, [320, 336], [0, 26])).toFixed(1)}px)`,
              }}
            >
              <Kicker at={206}>MATERIAL Y MANO</Kicker>
              <div style={{ marginTop: 16 }}>
                <Titular at={214} size={56} z={48}>Qué usar, cuánto y cómo dejarlo</Titular>
              </div>
            </div>
          </>
        )}

        {/* ─────────── ACTO 4 · f424–540 · EL DIAGNÓSTICO ─────────── */}
        {f >= 424 && (
          <>
            {/* el líquido: el MISMO objeto del acto 2, que vuelve porque el remate habla de él */}
            <Caja
              x={1288} y={694} w={440} h={268} z={120 - ip(f, [452, 476], [0, 150])}
              seed={29} radio={18} op={liqOp}
            >
              <Mat src="img/vslm01.png" escala={1.05} />
              <div style={{ position: "absolute", inset: 0, background: `rgba(12,11,9,${ip(f, [452, 478], [0, 0.34]).toFixed(3)})` }} />
            </Caja>

            {/* EL REMATE: dos líneas cinéticas, centradas, y el cuadro queda despejado al final */}
            <div
              style={{
                position: "absolute", left: SAFE, right: SAFE, top: 392,
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                opacity: remate, transform: `translateY(${(-ip(f, [512, 528], [0, 24])).toFixed(1)}px)`,
              }}
            >
              <Titular at={432} size={78} z={64}>No pagan el líquido.</Titular>
              <div style={{ position: "relative", marginTop: 34 }}>
                <div
                  style={{
                    position: "absolute", left: -60, right: -60, top: -18, bottom: -18, borderRadius: 40,
                    background: "radial-gradient(ellipse at 50% 50%, rgba(224,146,44,0.34) 0%, rgba(224,146,44,0) 70%)",
                    opacity: ip(f, [446, 462], [0, 1]) * (0.55 + 0.45 * pulso),
                  }}
                />
                <Chip at={446} size={94}>PAGAN EL DIAGNÓSTICO.</Chip>
              </div>
              <div
                style={{
                  marginTop: 30, width: ip(f, [460, 492], [0, 300]), height: 4, borderRadius: 2,
                  background: "rgba(255,255,255,0.30)", boxShadow: SOMBRA_TEXTO,
                }}
              />
            </div>
          </>
        )}

        {/* EL HUD que SOBREVIVE los cuatro actos: los 3 orígenes + el diagnóstico */}
        <HudOrigenes />
      </AbsoluteFill>

      {/* ══ L4+L8+L9 · UNA sola atmósfera para los 18 s: ⛔ no se remonta entre actos ══════════ */}
      <Atmos desde={desde} polvo={1} bokeh={1} />

      {/* ══ F3 · OCLUSIÓN (f424) — dos bandas de REVOQUE cruzando en sentidos opuestos ═════════
          ⛔ el color es el de la MATERIA (revoque gris-hueso), nunca el del fondo ni un blanco de
          papel: con el color del fondo hace un fundido a negro y con papel puro, un flash.
          Cobertura opaca del 100 %: f422–429 (8 frames). El swap de plate cae en f422–426. */}
      <Occluder at={410} dur={30} material="#A79C8B" angulo={-9} />
      <Occluder at={416} dur={26} material="#BCB2A0" angulo={7} />
    </AbsoluteFill>
  );
};
