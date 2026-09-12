// ════════════════════════════════════════════════════════════════════════════════════════════
//  MovMatch.tsx — MOVIMIENTO 1 del video `mdbleach` (canal Mike Dalton, EN)
//  "CHLORINE DEMAND" · ~45 s · 6 ACTOS que se FUNDEN · UNA sola escena continua
//
//  LA IDEA: el fósforo es el objeto protagonista y **LA LLAMA ES LA QUE VIAJA**. Prende en el
//  umbral, se come lo primero que toca, y se apaga antes de llegar al fondo del cuarto. El
//  espectador termina mirando el aro negro, intacto, con el fósforo ya frío.
//
//  MATERIA QUE CRUZA TODAS LAS FRONTERAS: **la BRASA** (`<Ember/>`) y su **HUMO** (`<Smoke/>`).
//  `heatAt(f)` es una sola curva descendente para TODO el movimiento: nace en el frame 6, arde
//  entera en el acto 1-2, se apaga por tramos y llega a 0 en el último acto. Ningún acto la
//  reinicia; cada uno sólo le dice DÓNDE está parada en pantalla.
//
//  ════════════════════════════════════════════════════════════════════════════════════════════
//  TABLA DE HANDOFF  (cam = offset del acto ENCIMA de `stageCam(p,1)`, nunca en lugar de ella)
//  ════════════════════════════════════════════════════════════════════════════════════════════
//  ACTO 1 · p 0.000–0.128 · "CHLORINE DEMAND" — el fósforo se prende (escala PRODUCTO)
//     enterFrom {cam: stageCam@0 = {z0,pan0,ry0} + off{z-170,x0,y10,rx3}, luz: warm@0.36 (rampa
//                de 14 f, la bombita levantando), materia: — (es el primer movimiento)}
//     exitTo    {cam: off{z+120,x-34,y-6,ry2.5}, luz: warm@1.0 key 0.18→0.30,
//                materia: LA LLAMA en el pico + la placa `h23_matchstrike`}
//  ── FRONTERA A @ p0.128 · **ZOOM-THROUGH** ── la cámara ENTRA en la llama (`ZoomThrough`,
//     into=[47,45], scale 7). Es de PRODUCTO a MACRO: la costura de manual para ese salto de
//     escala, y la llama (materia) es literalmente el túnel por donde se pasa.
//
//  ACTO 2 · p 0.128–0.300 · "THEN IT'S SALT" — macro de la cabeza quemada (escala MACRO)
//     enterFrom {cam: off{z+120,...} heredado sin reset, luz: warm@1.0, materia: la llama, ya
//                convertida en brasa sobre la cabeza negra}
//     exitTo    {cam: off{z+210,x+46,y+14,ry-3}, luz: warm key 0.30→0.47, brasa 0.55,
//                materia: LA PLACA de la cabeza quemada, centrada, lista para deformarse}
//  ── FRONTERA B @ p0.300 · **MATCH-SHAPE** ── la placa macro (1440×810, r18) se transforma en
//     la tarjeta de la tapita medidora (820×462, r20) con `MatchShape`; adentro, el material se
//     cambia con un WIPE DE BORDE ESPECULAR (no un fade). La forma no se reemplaza: se deforma.
//
//  ACTO 3 · p 0.300–0.470 · "THEY DOSE FOR THE LOSS" — la tapita + la barra de dosis (PRODUCTO)
//     enterFrom {cam: off{z+210,...}, luz: warm key ~0.47, materia: la tarjeta ya deformada,
//                que ES la tapita medidora del acto 3 (misma caja, mismo z, mismo lit)}
//     exitTo    {cam: off{z+30,x+86,ry-6}, luz: warm key ~0.60, brasa 0.40 corriendo por la
//                barra, materia: EL CHORRO BLANCO de la jarra `h20_bleachintofull`}
//  ── FRONTERA C @ p0.470 · **OCLUSIÓN** ── el cuerpo blanco de la jarra cruza el cuadro
//     (`Occluder` color `MD.bone`, 16 f, ~6 f de cobertura total). Cambio de tema fuerte
//     (de la planta de agua A TU BAÑO): se tapa el 100% y detrás ya está la fila.
//
//  ACTO 4 · p 0.470–0.700 · "LAST IN LINE" — la FILA: abanico 3D de 4 cartas reales (GENERAL)
//     enterFrom {cam: off{z+30,x+86,...}, luz: warm key ~0.60, materia: el chorro blanco, que
//                aterriza sobre la primera carta de la fila}
//     exitTo    {cam: off{z-110,x-56,y+16,ry5}, luz: warm key ~0.72, brasa 0.20 MUERTA en la
//                carta 3, materia: el VAPOR que sube del agua + la carta del moho}
//  ── FRONTERA D @ p0.700 · **WIPE POR MATERIA** ── el vapor cruza (`VaporWipe` + banco propio)
//     mientras las cartas se van hacia la cámara y el cuarto sube desde abajo. Detrás del vapor
//     ya está el plano general.
//
//  ACTO 5 · p 0.700–0.862 · "THE ROOM NEVER GETS WARM" — el cuarto entero (PLANO GENERAL)
//     enterFrom {cam: off{z-110,...}, luz: warm key ~0.72, materia: el vapor + el fósforo
//                gastado, ahora en primer plano abajo a la derecha}
//     exitTo    {cam: off{z-230,x-8,y+6,rx3.4}, luz: warm key ~0.86 y bajando, brasa 0.04,
//                materia: EL ARO (el final del camino punteado, ya en el centro del cuadro)}
//  ── FRONTERA E @ p0.862 · **CORTE EN EL BEAT** ── corte seco axial sobre el aro: los últimos
//     30 f del acto 5 empujan hacia él y el acto 6 abre en macro con la MISMA luz y el aro en el
//     mismo lugar del cuadro. Encuadre, escala y luz calzan → el corte se lee como golpe.
//
//  ACTO 6 · p 0.862–1.000 · "UNTOUCHED" — el aro negro, intacto, frío (DETALLE)
//     enterFrom {cam: off{z-230,...}, luz: warm apagándose, materia: el aro + el fósforo frío}
//     exitTo    {cam: off{0,0,0,0,0} → **aterriza EXACTO en `CAM_ARC[1].to`**
//                = {z:0.30, panX:-70, panY:18, ry:-7, rz:0.6}, luz 'warm', materia: el aro
//                negro en cuadro — que es donde arranca el Movimiento 2}
//     ⛔ No se pisa `stageCam` al final ni hay fundido de salida: el Mov 2 engancha en seco.
//
//  ────────────────────────────────────────────────────────────────────────────────────────────
//  NOTAS TÉCNICAS QUE COSTARON RENDERS
//  · Los clips de `broll/` duran 5,04 s = 151 frames. Sin `<Sequence>` alrededor, un
//    `OffthreadVideo` montado en el frame 900 pide el segundo 30 del clip → congelado o error.
//    Por eso TODO clip vive dentro de `<LiveSkin>`: un `<Sequence from=… durationInFrames≤126>`
//    que lo corre en tiempo local, y al morir se retira con un **wipe de borde especular** sobre
//    la MISMA toma quieta (`img/*.jpg`), que es la que la `GlassPlate` tiene siempre debajo.
//    Resultado: material real corriendo en todas las tarjetas, cero riesgo de frame muerto.
//  · El contenedor de cámara va en `transformStyle: "flat"` a propósito: cada acto trae su
//    propio `Space3D` (perspective + preserve-3d), así el `zIndex` explícito de cada acto manda
//    en las fronteras y el primer plano de un acto no se dibuja encima del siguiente.
//  · Sin `Math.random` / `Date` (el farm rinde en chunks paralelos), sin `backdrop-filter`, sin
//    `blur()` grande sobre imágenes a pantalla completa. `Easing.poly(5)`, nunca `Easing.quint`.
// ════════════════════════════════════════════════════════════════════════════════════════════
import React from "react";
import {
  AbsoluteFill, Img, Sequence, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing,
} from "remotion";
import {
  MD, F_SANS, F_SERIF, rgba, lerp, clamp01, eio, rnd, light,
  Atmos, Sheen, Kicker, Title, Em, TextBed, Occluder, VaporWipe,
  stageCam, movLight, Space3D, GlassPlate, Fan3D, ZoomThrough, MatchShape, Motes,
} from "./Stage";

// ── MATERIAL REAL (rutas hardcodeadas — el build tiene que sumarlas al tarball del farm) ─────
const A = {
  strikeJ: "img/mdbleach_h23_matchstrike.jpg",
  strikeV: "broll/mdbleach_h23_matchstrike.mp4",
  spentJ: "img/mdbleach_h24_matchspent.jpg",
  spentV: "broll/mdbleach_h24_matchspent.mp4",
  capJ: "img/mdbleach_h21_capmeasure.jpg",
  capV: "broll/mdbleach_h21_capmeasure.mp4",
  pourJ: "img/mdbleach_h20_bleachintofull.jpg",
  pourV: "broll/mdbleach_h20_bleachintofull.mp4",
  bowlJ: "img/mdbleach_h09_bowldrained.jpg",
  moldJ: "img/mdbleach_h46_patchymold.jpg",
  moldV: "broll/mdbleach_h46_patchymold.mp4",
  wideJ: "img/mdbleach_h03_toiletwide.jpg",
  wideV: "broll/mdbleach_h03_toiletwide.mp4",
  lamina: "img/mdbleach_lam_whybleach.jpg",
};

// ── LAS FRONTERAS, COMO FRACCIONES de `durationInFrames` (el build ancla al ms real, ±20%) ───
const K = { a2: 0.128, a3: 0.300, a4: 0.470, a5: 0.700, a6: 0.862 };

const CLIP_LIFE = 126; // < 151 f del asset · deja aire para `startFrom`
const WIPE = 10;       // frames del wipe de borde especular con que se retira el clip

// ════════════════════════════════════════════════════════════════════════════════════════════
//  LIVE SKIN — el clip REAL corriendo encima de su propia foto quieta, dentro de la tarjeta.
//  Vive en su propio `<Sequence>` (tiempo local) para no pedirle al mp4 un segundo que no tiene.
// ════════════════════════════════════════════════════════════════════════════════════════════
const LiveSkinInner: React.FC<{
  clip: string; life: number; startFrom: number; focusX: number; focusY: number; bornAt: number;
}> = ({ clip, life, startFrom, focusX, focusY, bornAt }) => {
  const f = useCurrentFrame(); // local al Sequence: 0..life
  const out = clamp01((f - (life - WIPE)) / WIPE);
  const edge = out * 100;
  // ⚠️ `Material` le mete a la FOTO de abajo un drift `1 + 0.05*min(1, frameAbs/240)`. Si el clip
  // no lo copia, el wipe de salida salta un 5 % de escala. Se calca acá con el frame ABSOLUTO.
  const sc = 1 + 0.05 * clamp01((bornAt + f) / 240);
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${edge.toFixed(2)}%)` }}>
      <OffthreadVideo
        src={staticFile(clip)}
        muted
        startFrom={startFrom}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          objectPosition: `${focusX}% ${focusY}%`,
          transform: `scale(${sc.toFixed(4)})`,
        }}
      />
      {out > 0 && out < 1 && (
        <div
          style={{
            position: "absolute", top: 0, bottom: 0, left: `${edge.toFixed(2)}%`,
            width: 10, marginLeft: -10,
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.white, 0.85)} 70%, ${rgba(MD.white, 0.95)} 100%)`,
            boxShadow: `0 0 30px ${rgba(MD.white, 0.6)}`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

const LiveSkin: React.FC<{
  clip: string; bornAt: number; life?: number; startFrom?: number; focusX?: number; focusY?: number;
}> = ({ clip, bornAt, life = CLIP_LIFE, startFrom = 0, focusX = 50, focusY = 46 }) => (
  <Sequence from={bornAt} durationInFrames={life} layout="none">
    <LiveSkinInner clip={clip} life={life} startFrom={startFrom} focusX={focusX} focusY={focusY} bornAt={bornAt} />
  </Sequence>
);

/** Tarjeta de vidrio con MATERIAL REAL: la foto siempre debajo, el clip corriendo encima. */
const Plate: React.FC<{
  still: string; clip?: string; bornAt?: number; life?: number; startFrom?: number;
  w: number; h: number; x?: number; y?: number; z?: number;
  ry?: number; rx?: number; rz?: number; radius?: number; lit?: number; sheenAt?: number;
  focusX?: number; focusY?: number; label?: React.ReactNode; opacity?: number;
  children?: React.ReactNode;
}> = ({
  still, clip, bornAt = 0, life = CLIP_LIFE, startFrom = 0,
  w, h, x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0, radius = 18, lit = 0.6, sheenAt,
  focusX = 50, focusY = 46, label, opacity = 1, children,
}) => (
  <GlassPlate
    src={still} w={w} h={h} x={x} y={y} z={z} ry={ry} rx={rx} rz={rz}
    radius={radius} lit={lit} sheenAt={sheenAt} focusX={focusX} focusY={focusY}
    label={label} opacity={opacity}
  >
    {clip && (
      <LiveSkin clip={clip} bornAt={bornAt} life={life} startFrom={startFrom} focusX={focusX} focusY={focusY} />
    )}
    {children}
  </GlassPlate>
);

// ════════════════════════════════════════════════════════════════════════════════════════════
//  LA MATERIA QUE CRUZA: LA BRASA Y SU HUMO
// ════════════════════════════════════════════════════════════════════════════════════════════
const Ember: React.FC<{ x: number; y: number; heat: number; size?: number; z?: number }> = ({
  x, y, heat, size = 1, z = 0,
}) => {
  const f = useCurrentFrame();
  const h = clamp01(heat);
  if (h <= 0.004) return null;
  // parpadeo determinístico (⛔ nada de Math.random: el farm rinde en chunks paralelos)
  const flick =
    0.66 +
    0.34 *
      clamp01(
        0.5 + 0.3 * Math.sin(f / 3.1) + 0.24 * Math.sin(f / 1.7 + 1.3) + 0.3 * (rnd(Math.floor(f / 2)) - 0.5),
      );
  const tint = light(1 - h, "warm", "red"); // arde naranja, muere roja
  const halo = 340 * size * (0.34 + h * 0.66) * (0.94 + flick * 0.1);
  const core = 26 * size * (0.35 + h * 0.65) * flick;
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        transform: `translate(-50%,-50%) translateZ(${z}px)`,
        pointerEvents: "none",
      }}
    >
      {/* el envolvente: es la brasa la que ILUMINA la escena */}
      <div
        style={{
          position: "absolute", left: -halo / 2, top: -halo / 2, width: halo, height: halo,
          borderRadius: "50%", mixBlendMode: "screen",
          background:
            `radial-gradient(circle, ${rgba(tint, 0.36 * h * flick)} 0%, ${rgba(tint, 0.13 * h)} 24%, rgba(0,0,0,0) 66%)`,
        }}
      />
      {/* núcleo caliente */}
      <div
        style={{
          position: "absolute", left: -core / 2, top: -core * 0.95, width: core, height: core * 1.95,
          borderRadius: "50% 50% 46% 46% / 64% 64% 36% 36%",
          filter: "blur(1.6px)",
          background:
            `radial-gradient(62% 72% at 50% 76%, ${rgba("#FFF4DE", 0.95 * h)} 0%, ${rgba(tint, 0.82 * h)} 44%, rgba(0,0,0,0) 78%)`,
        }}
      />
    </div>
  );
};

/** Derrame cálido de la brasa sobre el decorado del acto. La llama no sólo se ve: ALUMBRA. */
const Spill: React.FC<{ x: number; y: number; heat: number; r?: number; tone?: string }> = ({
  x, y, heat, r = 46, tone = MD.warm,
}) => {
  const f = useCurrentFrame();
  const h = clamp01(heat);
  if (h <= 0.01) return null;
  const b = 0.86 + 0.14 * Math.sin(f / 7.3) + 0.06 * Math.sin(f / 2.9);
  return (
    <div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen",
        background: `radial-gradient(${r}% ${(r * 0.78).toFixed(0)}% at ${x}% ${y}%, ${rgba(tone, 0.2 * h * b)} 0%, ${rgba(tone, 0.06 * h)} 34%, rgba(0,0,0,0) 72%)`,
      }}
    />
  );
};

const Smoke: React.FC<{ x: number; y: number; amount: number; h?: number; w?: number }> = ({
  x, y, amount, h = 360, w = 250,
}) => {
  const f = useCurrentFrame();
  const a = clamp01(amount);
  if (a <= 0.02) return null;
  return (
    <svg
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
        transform: "translate(-50%,-100%)", overflow: "visible", pointerEvents: "none",
        filter: "blur(3.4px)", opacity: a,
      }}
    >
      {Array.from({ length: 3 }, (_, i) => {
        const s = rnd(i * 5.3);
        const w1 = Math.sin(f / (27 + s * 22) + i * 2.1) * 26;
        const w2 = Math.cos(f / (35 + s * 26) + i * 1.3) * 34;
        return (
          <path
            key={i}
            d={`M${w / 2},${h} C${w / 2 + w1},${h * 0.66} ${w / 2 - w2},${h * 0.34} ${w / 2 + w1 * 0.6},${4 + i * 10}`}
            stroke={rgba(MD.bone, 0.17 - i * 0.045)}
            strokeWidth={8 + i * 6}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
    </svg>
  );
};

// ── EL RECORRIDO DE LA BRASA — una sola trayectoria continua para TODO el movimiento ────────
// La llama no "aparece" en cada acto: CAMINA. Sale del fósforo, cae sobre la barra de dosis,
// salta a la fila y se apaga en la carta 3, y termina tirada a mitad del cuarto. Los saltos
// grandes ocurren dentro de las fronteras (o sea, tapados) y los tramos útiles son recorridos.
type XY = { x: number; y: number };
const P0 = { x: 15, y: 77 };  // el umbral (acto 5)
const P1 = { x: 55, y: 56 };  // el aro, al fondo del cuarto
const DIE = 0.4;              // hasta dónde llega la llama antes de apagarse
const mixXY = (a: XY, b: XY, t: number): XY => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });

const BAR = { w: 1080, x: -110, y: 250 };
const barXY = (prog: number): XY => ({
  x: 50 + (BAR.x - BAR.w / 2 + BAR.w * prog) / 19.2,
  y: 50 + BAR.y / 10.8,
});
const QUEUE_X = [26.6, 42.2, 57.8, 73.4]; // centros de las cartas del abanico, en % de pantalla

const emberPos = (f: number, FA: number, FB: number, FC: number, FD: number, FE: number, D: number): XY => {
  const head: XY = { x: 47, y: 45 }, coal: XY = { x: 52, y: 51 };
  if (f < FA) return head;
  if (f < FB) {
    if (f < FB - 30) return mixXY(head, coal, eio(0, 1, clamp01((f - FA) / 40)));
    // baja hacia la barra mientras la placa se deforma (frontera B)
    return mixXY(coal, barXY(0.06), eio(0, 1, clamp01((f - (FB - 30)) / 44)));
  }
  if (f < FC) {
    const q = clamp01((f - FB) / Math.max(1, FC - FB));
    const eaten = eio(0, 1, clamp01((q - 0.22) / 0.56));
    const onBar = barXY(0.06 + eaten * 0.62);
    return f < FB + 14 ? mixXY(mixXY(coal, barXY(0.06), 1), onBar, clamp01((f - FB) / 14)) : onBar;
  }
  if (f < FD) {
    const q = clamp01((f - FC) / Math.max(1, FD - FC));
    const burn = clamp01((q - 0.24) / 0.46);
    const queue: XY = { x: lerp(QUEUE_X[0], QUEUE_X[2], burn), y: 47 };
    // el salto de la barra a la fila va tapado por la OCLUSIÓN de la frontera C
    return mixXY(barXY(0.68), queue, eio(0, 1, clamp01((f - (FC - 6)) / 34)));
  }
  if (f < FE) {
    const q = clamp01((f - FD) / Math.max(1, FE - FD));
    const walk = DIE * eio(0, 1, clamp01(q / 0.62));
    const onPath = mixXY(P0, P1, walk);
    // el salto al umbral va tapado por el VAPOR de la frontera D
    return mixXY({ x: QUEUE_X[2], y: 47 }, onPath, eio(0, 1, clamp01((f - (FD - 14)) / 30)));
  }
  const rest = mixXY(P0, P1, DIE);
  return mixXY(rest, { x: rest.x - 1, y: rest.y + 3 }, eio(0, 1, clamp01((f - FE) / Math.max(1, D - FE))));
};

// ── LA CURVA DE CALOR: una sola para todo el movimiento, nunca se reinicia ───────────────────
const heatAt = (f: number, D: number) => {
  const ign = clamp01((f - 6) / 22); // la cerilla prende en el frame 6, arde entera a los 28
  const p = clamp01(f / D);
  const decay =
    p < K.a2 ? 1 :
    p < K.a3 ? lerp(1.0, 0.55, (p - K.a2) / (K.a3 - K.a2)) :
    p < K.a4 ? lerp(0.55, 0.40, (p - K.a3) / (K.a4 - K.a3)) :
    p < K.a5 ? lerp(0.40, 0.20, (p - K.a4) / (K.a5 - K.a4)) :
    p < K.a6 ? lerp(0.20, 0.04, (p - K.a5) / (K.a6 - K.a5)) :
               lerp(0.04, 0.00, (p - K.a6) / (1 - K.a6));
  return ign * decay;
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  EL OFFSET DE CÁMARA DE LOS ACTOS — una sola curva continua ENCIMA de `stageCam`.
//  Cada acto hereda la posición y la inercia del anterior; ⛔ ninguno reinicia en 0.
//  La última clave es {0,0,0,0,0}: el movimiento aterriza EXACTO en `CAM_ARC[1].to`.
// ════════════════════════════════════════════════════════════════════════════════════════════
type Off = { z: number; x: number; y: number; ry: number; rx: number };
const OFF_KEYS: { at: number; v: Off }[] = [
  { at: 0.000, v: { z: -170, x: 0, y: 10, ry: 0, rx: 3.0 } },
  { at: K.a2, v: { z: 120, x: -34, y: -6, ry: 2.5, rx: 1.2 } },
  { at: K.a3, v: { z: 210, x: 46, y: 14, ry: -3.0, rx: -1.6 } },
  { at: K.a4, v: { z: 30, x: 86, y: -8, ry: -6.0, rx: 0.6 } },
  { at: K.a5, v: { z: -110, x: -56, y: 16, ry: 5.0, rx: 2.2 } },
  { at: K.a6, v: { z: -230, x: -8, y: 6, ry: 3.0, rx: 3.4 } },
  { at: 1.000, v: { z: 0, x: 0, y: 0, ry: 0, rx: 0 } },
];

const actOffset = (p: number): Off => {
  let i = 0;
  while (i < OFF_KEYS.length - 2 && p > OFF_KEYS[i + 1].at) i++;
  const a = OFF_KEYS[i], b = OFF_KEYS[i + 1];
  const t = clamp01((p - a.at) / Math.max(1e-6, b.at - a.at));
  return {
    z: eio(a.v.z, b.v.z, t),
    x: eio(a.v.x, b.v.x, t),
    y: eio(a.v.y, b.v.y, t),
    ry: eio(a.v.ry, b.v.ry, t),
    rx: eio(a.v.rx, b.v.rx, t),
  };
};

// ── TIPOGRAFÍA DEL MOVIMIENTO ───────────────────────────────────────────────────────────────
// 1 idea por acto, titular ≤7 palabras. Entra con WIPE + deslizamiento (⛔ nunca opacity 0→1).
const Say: React.FC<{
  at: number; out: number; kicker: string; children: React.ReactNode;
  w?: number; detail?: string; size?: number;
}> = ({ at, out, kicker, children, w = 880, detail, size = 62 }) => {
  const f = useCurrentFrame();
  const e = interpolate(clamp01((f - at) / 20), [0, 1], [0, 1], { easing: Easing.poly(5) });
  const g = eio(0, 1, clamp01((f - out) / 16)); // sale barrido por la izquierda, nunca en fade
  if (e <= 0 || g >= 1) return null;
  return (
    <div
      style={{
        width: w,
        transform: `translate3d(${((1 - e) * 46 - g * 40).toFixed(2)}px, 0, 0)`,
        clipPath: `inset(-40% ${((1 - e) * 102).toFixed(2)}% -40% ${(-6 + g * 110).toFixed(2)}%)`,
      }}
    >
      <TextBed pad={28} w="100%">
        <Kicker>{kicker}</Kicker>
        <div style={{ height: 12 }} />
        <Title size={size}>{children}</Title>
        {detail && (
          <div
            style={{
              marginTop: 16, fontFamily: F_SANS, fontWeight: 600, fontSize: 31, lineHeight: 1.32,
              color: rgba(MD.bone, 0.9),
            }}
          >
            {detail}
          </div>
        )}
        <div
          style={{
            marginTop: 20, height: 3, width: `${(e * 100).toFixed(1)}%`,
            background: `linear-gradient(90deg, ${MD.red}, ${rgba(MD.red, 0)})`,
          }}
        />
      </TextBed>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  ACTO 1 · "CHLORINE DEMAND" — el fósforo se prende en el umbral
// ════════════════════════════════════════════════════════════════════════════════════════════
const Act1: React.FC<{ f: number; heat: number; actT: string }> = ({ f, heat, actT }) => {
  const ent = interpolate(clamp01(f / 13), [0, 1], [0, 1], { easing: Easing.poly(5) }); // rampa ≤15 f
  return (
    <AbsoluteFill style={{ zIndex: 60 }}>
      <Space3D>
      <div style={{ position: "absolute", inset: 0, transform: actT, transformStyle: "preserve-3d" }}>
        {/* PLANO PROFUNDO: el fondo del cuarto, el sitio al que la llama nunca va a llegar */}
        <Plate
          still={A.wideJ}
          w={720} h={405} x={520} y={-140} z={-620} ry={-13} rz={1.4}
          lit={0.2} opacity={0.42} focusX={54} focusY={52}
        />
        {/* HÉROE: sus manos prendiendo el fósforo (clip real corriendo) */}
        <Plate
          still={A.strikeJ} clip={A.strikeV} bornAt={0} startFrom={6}
          w={1180} h={664} x={-80} y={28} z={lerp(-140, 40, ent)} ry={3.2} rz={-0.6}
          radius={20} lit={0.72} sheenAt={38} focusX={50} focusY={46}
        >
          {/* luz de la llama derramada DENTRO de la tarjeta */}
          <div
            style={{
              position: "absolute", inset: 0, mixBlendMode: "screen", pointerEvents: "none",
              background: `radial-gradient(38% 44% at 46% 44%, ${rgba(MD.warm, 0.34 * heat)} 0%, rgba(0,0,0,0) 72%)`,
            }}
          />
        </Plate>
      </div>
      </Space3D>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  ACTO 2 · "THEN IT'S SALT" — macro de la cabeza quemada. La reacción ya pasó.
//  La caja del héroe es EXACTAMENTE el `from` del MatchShape de la frontera B.
// ════════════════════════════════════════════════════════════════════════════════════════════
const HERO2 = { w: 1440, h: 810, r: 18 };
const CAP3 = { w: 820, h: 462, r: 20 };
const CAP3_POS = { x: -250, y: -60, z: 90 };

const Act2: React.FC<{ f: number; A2: number; FB: number; heat: number; actT: string }> = ({
  f, A2, FB, heat, actT,
}) => {
  const q = clamp01((f - A2) / Math.max(1, FB - A2));
  const gone = f >= FB - 30; // el héroe se lo lleva el MatchShape (misma caja, mismo material)
  const exit = clamp01((f - (FB - 30)) / 30);
  return (
    <AbsoluteFill style={{ zIndex: 50 }}>
      <Space3D>
      <div style={{ position: "absolute", inset: 0, transform: actT, transformStyle: "preserve-3d" }}>
        {!gone && (
          <Plate
            still={A.spentJ} clip={A.spentV} bornAt={A2} startFrom={4}
            w={HERO2.w} h={HERO2.h} x={0} y={0} z={40}
            radius={HERO2.r} lit={0.6} sheenAt={A2 + 46} focusX={50} focusY={48}
          />
        )}
        <Spill x={52} y={51} heat={heat * 0.8} r={40} tone={MD.red} />
        {/* "hace un segundo": la misma cerilla, viva, guardada al fondo — memoria, no repetición */}
        <Plate
          still={A.strikeJ}
          w={420} h={236} x={lerp(700, 880, q) - exit * 240} y={-300} z={-430} ry={-16} rz={2.2}
          lit={0.24} opacity={0.5 * (1 - exit * 0.7)} focusX={50} focusY={44}
        />
      </div>
      </Space3D>
    </AbsoluteFill>
  );
};

// ── EL PUENTE DE LA FRONTERA B: la placa macro SE DEFORMA en la tapita medidora ──────────────
// El material de adentro se cambia con un wipe de borde especular, no con un fade: la forma es
// la misma pieza todo el tiempo, que es lo que hace que se lea como TRANSFORMACIÓN.
const BridgeB: React.FC<{ FB: number; actT: string }> = ({ FB, actT }) => {
  const f = useCurrentFrame();
  const e = eio(0, 1, clamp01((f - (FB - 30)) / 30));
  const swap = clamp01((f - (FB - 16)) / 14);
  const edge = 100 - swap * 100;
  return (
    <Space3D style={{ zIndex: 56 }}>
     <div style={{ position: "absolute", inset: 0, transform: actT, transformStyle: "preserve-3d" }}>
      <div
        style={{
          position: "absolute", inset: 0,
          transform: `translate3d(${(CAP3_POS.x * e).toFixed(2)}px, ${(CAP3_POS.y * e).toFixed(2)}px, 0)`,
          transformStyle: "preserve-3d",
        }}
      >
        <MatchShape
          at={FB - 30}
          dur={30}
          from={HERO2}
          to={CAP3}
          src={A.spentJ}
          z={lerp(40, CAP3_POS.z, e)}
        >
          {/* el material NUEVO entra por un borde especular duro (no un fade). El CLIP de la
              tapita arranca recien cuando el puente se retira, para que la foto de abajo y el
              frame 0 del clip sean el mismo pixel. */}
          {swap > 0 && (
            <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${edge.toFixed(2)}%)` }}>
              <Img
                src={staticFile(A.capJ)}
                style={{
                  width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 46%",
                  transform: `scale(${(1 + 0.05 * clamp01(f / 240)).toFixed(4)})`,
                }}
              />
            </AbsoluteFill>
          )}
          {swap > 0 && swap < 1 && (
            <div
              style={{
                position: "absolute", top: 0, bottom: 0, left: `${edge.toFixed(2)}%`, width: 12,
                background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.white, 0.9)} 60%, ${rgba(MD.warm, 0.95)} 100%)`,
                boxShadow: `0 0 40px ${rgba(MD.white, 0.7)}`,
              }}
            />
          )}
        </MatchShape>
      </div>
     </div>
    </Space3D>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  ACTO 3 · "THEY DOSE FOR THE LOSS" — la tapita medidora + la barra dosis/residual
// ════════════════════════════════════════════════════════════════════════════════════════════
const Act3: React.FC<{ f: number; A3: number; FC: number; heat: number; actT: string }> = ({
  f, A3, FC, heat, actT,
}) => {
  const q = clamp01((f - A3) / Math.max(1, FC - A3));
  const ent = eio(0, 1, clamp01((f - (A3 - 24)) / 46)); // los satélites ENTRAN con movimiento
  const eaten = eio(0, 1, clamp01((q - 0.22) / 0.56));  // la pérdida se come la dosis
  // la barra se DIBUJA (no aparece): el puente de la frontera B todavía está en cuadro
  const draw = eio(0, 1, clamp01((f - (A3 + 8)) / 28));
  return (
    <AbsoluteFill style={{ zIndex: 40 }}>
      <Space3D>
      <div style={{ position: "absolute", inset: 0, transform: actT, transformStyle: "preserve-3d" }}>
        {/* la LÁMINA de la guía, parada al fondo: página real, no un rectángulo dibujado */}
        <Plate
          still={A.lamina}
          w={296} h={420} x={lerp(1560, 690, ent)} y={186} z={-430} ry={-15} rz={2.4}
          lit={0.3} opacity={0.62} focusX={50} focusY={38}
        />
        {/* el CHORRO que se pierde en la taza llena — la materia que le pasa al acto 4 */}
        <Plate
          still={A.pourJ} clip={A.pourV} bornAt={A3 + 26} startFrom={10}
          w={560} h={316} x={lerp(1520, 468, ent)} y={-176} z={-190} ry={-9} rz={-1.6}
          lit={0.46} sheenAt={A3 + 96} focusX={50} focusY={44}
        />
        {/* PROTAGONISTA: la tapita medidora. Misma caja/z/lit con que aterriza el MatchShape. */}
        <Plate
          still={A.capJ} clip={A.capV} bornAt={A3 + 3} startFrom={0}
          w={CAP3.w} h={CAP3.h} x={CAP3_POS.x} y={CAP3_POS.y} z={CAP3_POS.z}
          radius={CAP3.r} lit={0.6} sheenAt={A3 + 128} focusX={50} focusY={46}
        />
        <Spill x={30} y={73} heat={heat} r={38} />
        {/* ESTRUCTURA: la barra dosis → residual (capa gráfica, nunca protagonista) */}
        <div
          style={{
            position: "absolute", left: "50%", top: "50%", width: BAR.w,
            transform: `translate(-50%,-50%) translate3d(${BAR.x}px, ${BAR.y}px, 60px)`,
            clipPath: `inset(-60% ${((1 - draw) * 102).toFixed(1)}% -60% -2%)`,
          }}
        >
          <div
            style={{
              position: "relative", height: 26, borderRadius: 13, overflow: "hidden",
              background: rgba(MD.ink2, 0.9),
              boxShadow: `inset 0 1px 0 ${rgba(MD.white, 0.16)}, 0 16px 40px rgba(0,0,0,.6)`,
            }}
          >
            <div
              style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(90deg, ${rgba(MD.white, 0.86)} 0%, ${rgba(MD.bone, 0.6)} 100%)`,
              }}
            />
            {/* lo que se come la demanda */}
            <div
              style={{
                position: "absolute", top: 0, bottom: 0, left: 0, width: `${(6 + eaten * 62).toFixed(1)}%`,
                background: `linear-gradient(90deg, ${rgba(MD.red, 0.95)} 0%, ${rgba(MD.redHot, 0.75)} 100%)`,
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 31, color: MD.redHot, letterSpacing: 1.2 }}>
              EATEN ON THE WAY
            </div>
            <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 31, color: MD.white, letterSpacing: 1.2 }}>
              THE RESIDUAL
            </div>
          </div>
        </div>
      </div>
      </Space3D>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  ACTO 4 · "LAST IN LINE" — la FILA: abanico 3D de cuatro cartas de material REAL
// ════════════════════════════════════════════════════════════════════════════════════════════
const QueueTag: React.FC<{ i: number; at: number; burn: number; word: string; last?: boolean }> = ({
  i, at, burn, word, last,
}) => {
  const f = useCurrentFrame();
  const e = clamp01((f - (at + 26 + i * 9)) / 18);
  const fill = last ? 0 : clamp01((burn - i * 0.3) / 0.3);
  return (
    <div
      style={{
        display: "inline-block", padding: "10px 18px 12px", borderRadius: 10,
        background: "linear-gradient(180deg, rgba(6,6,8,0.9) 0%, rgba(6,6,8,0.7) 100%)",
        boxShadow: "0 14px 34px rgba(0,0,0,.6)",
        clipPath: `inset(-30% ${((1 - e) * 102).toFixed(1)}% -30% -6%)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontFamily: F_SERIF, fontStyle: "italic", fontSize: 32, color: last ? MD.redHot : MD.warm }}>
          {i + 1}
        </span>
        <span style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 1.4, color: MD.white }}>
          {word}
        </span>
      </div>
      <div style={{ marginTop: 8, height: 5, borderRadius: 3, background: rgba(MD.white, 0.14), overflow: "hidden" }}>
        <div
          style={{
            height: "100%", width: `${(fill * 100).toFixed(1)}%`,
            background: `linear-gradient(90deg, ${MD.warm}, ${MD.red})`,
          }}
        />
      </div>
    </div>
  );
};

const Act4: React.FC<{ f: number; A4: number; FD: number; heat: number; actT: string }> = ({
  f, A4, FD, heat, actT,
}) => {
  const q = clamp01((f - A4) / Math.max(1, FD - A4));
  const open = eio(0, 1, clamp01((q - 0.04) / 0.44));
  const burn = clamp01((q - 0.24) / 0.46); // la llama recorre la fila… y se apaga en la 3
  const ex = eio(0, 1, clamp01((f - (FD - 30)) / 30)); // las cartas se van hacia la cámara
  return (
    <AbsoluteFill style={{ zIndex: 30 }}>
      <Space3D>
      <div style={{ position: "absolute", inset: 0, transform: actT, transformStyle: "preserve-3d" }}>
        {/* cama de sala: el cuarto al fondo, fuera de foco por distancia, no por blur */}
        <Plate
          still={A.wideJ} clip={A.wideV} bornAt={A4} startFrom={0}
          w={1180} h={664} x={40} y={-40} z={-780} ry={4} lit={0.16} opacity={0.34}
          focusX={52} focusY={54}
        />
        <div
          style={{
            position: "absolute", inset: 0, transformStyle: "preserve-3d",
            transform: `translate3d(${(-40 * ex).toFixed(1)}px, ${(74 * ex).toFixed(1)}px, ${(560 * ex).toFixed(1)}px)`,
          }}
        >
          <Fan3D
            open={open}
            w={340} h={214} spread={300} arc={10} z={40} sheenAt={A4 + 60}
            items={[
              { src: A.wideJ, label: <QueueTag i={0} at={A4} burn={burn} word="THE WATER" /> },
              { src: A.bowlJ, label: <QueueTag i={1} at={A4} burn={burn} word="THE FILM" /> },
              { src: A.pourJ, label: <QueueTag i={2} at={A4} burn={burn} word="THE REST" /> },
              { src: A.moldJ, label: <QueueTag i={3} at={A4} burn={burn} word="THE MOLD" last /> },
            ]}
          />
        </div>
        <Spill x={lerp(26.6, 57.8, burn)} y={47} heat={heat * (1 - clamp01((burn - 0.86) / 0.14))} r={34} />
        {/* la carta 4, en la oscuridad: el rótulo que dice que ahí no llegó nada */}
        <div
          style={{
            position: "absolute", left: "50%", top: "50%", width: 340,
            transform: `translate(-50%,-50%) translate3d(${(450 + 30 * ex).toFixed(0)}px, -170px, 60px)`,
            textAlign: "center",
            clipPath: `inset(-30% ${((1 - clamp01((f - (A4 + 96)) / 20)) * 102).toFixed(1)}% -30% -6%)`,
          }}
        >
          <span
            style={{
              fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 2.6, color: MD.redHot,
              textShadow: "0 4px 20px rgba(0,0,0,.9)",
            }}
          >
            NOTHING LEFT BY HERE
          </span>
        </div>
      </div>
      </Space3D>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  ACTO 5 · "THE ROOM NEVER GETS WARM" — el cuarto entero y el camino que la llama no hace
// ════════════════════════════════════════════════════════════════════════════════════════════
const Act5: React.FC<{ f: number; A5: number; FE: number; heat: number; actT: string }> = ({
  f, A5, FE, heat, actT,
}) => {
  const q = clamp01((f - A5) / Math.max(1, FE - A5));
  const ent = eio(0, 1, clamp01((f - (A5 - 12)) / 40));
  const walk = DIE * eio(0, 1, clamp01(q / 0.62));
  const ex = eio(0, 1, clamp01((f - (FE - 30)) / 30)); // empuje axial hacia el aro (corte en beat)
  const ex1 = { x: lerp(P0.x, P1.x, walk), y: lerp(P0.y, P1.y, walk) };
  return (
    <AbsoluteFill style={{ zIndex: 20 }}>
      <Space3D>
      <div style={{ position: "absolute", inset: 0, transform: actT, transformStyle: "preserve-3d" }}>
        <div
          style={{
            position: "absolute", inset: 0, transformStyle: "preserve-3d",
            transform: `translate3d(0px, ${((1 - ent) * 130).toFixed(1)}px, ${(ex * 180).toFixed(1)}px)`,
          }}
        >
          <Plate
            still={A.wideJ} clip={A.wideV} bornAt={A5} startFrom={8}
            w={1500} h={844} x={-60} y={-24} z={-40} ry={1.6}
            radius={16} lit={0.5} sheenAt={A5 + 74} focusX={54} focusY={52}
          >
            {/* el charco cálido del umbral, que se encoge */}
            <div
              style={{
                position: "absolute", inset: 0, mixBlendMode: "screen", pointerEvents: "none",
                background: `radial-gradient(${(30 - walk * 8).toFixed(0)}% 40% at 12% 78%, ${rgba(MD.warm, 0.3 * heat + 0.06)} 0%, rgba(0,0,0,0) 74%)`,
              }}
            />
          </Plate>
        </div>
        {/* EL CAMINO — capa a pantalla completa en z 0, el MISMO espacio donde camina la brasa:
            sólido mientras hay fuego, punteado y frío en el tramo al que nunca llega */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox="0 0 100 100" preserveAspectRatio="none"
        >
          <line
            x1={P0.x} y1={P0.y} x2={ex1.x} y2={ex1.y}
            stroke={rgba(MD.warm, 0.85 * ent)} strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke"
          />
          <line
            x1={ex1.x} y1={ex1.y} x2={P1.x} y2={P1.y}
            stroke={rgba(MD.cold, 0.5 * ent)} strokeWidth={2.5} strokeDasharray="9 13" strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx={P1.x} cy={P1.y} r={2.2} fill="none"
            stroke={rgba(MD.red, 0.85 * ent)} strokeWidth={2.5} vectorEffect="non-scaling-stroke"
          />
          <circle
            cx={P1.x} cy={P1.y} r={2.2 + (0.5 + 0.5 * Math.sin(f / 15)) * 3}
            fill="none" stroke={rgba(MD.red, 0.3 * ent)} strokeWidth={1.6} vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* el fósforo gastado, ya en primer plano: frío, en la mano de él */}
        <Plate
          still={A.spentJ} clip={A.spentV} bornAt={A5 + 22} startFrom={20}
          w={430} h={242} x={560} y={200} z={210} ry={-12} rz={-2.2}
          lit={0.34} focusX={50} focusY={48}
        />
      </div>
      </Space3D>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  ACTO 6 · "UNTOUCHED" — el aro negro, intacto, y el fósforo ya frío
//  Los offsets aterrizan en 0: la cámara queda EXACTA en `CAM_ARC[1].to`.
// ════════════════════════════════════════════════════════════════════════════════════════════
const Act6: React.FC<{ f: number; A6: number; D: number; heat: number; actT: string }> = ({
  f, A6, D, heat, actT,
}) => {
  const q = clamp01((f - A6) / Math.max(1, D - A6));
  const cold = eio(0, 1, clamp01((q - 0.1) / 0.6)); // el grade se enfría: el fuego ya no está
  return (
    <AbsoluteFill style={{ zIndex: 10 }}>
      <Space3D>
      <div style={{ position: "absolute", inset: 0, transform: actT, transformStyle: "preserve-3d" }}>
        <Plate
          still={A.moldJ} clip={A.moldV} bornAt={A6} startFrom={12}
          w={1560} h={878} x={0} y={-10} z={lerp(90, 40, eio(0, 1, q))} ry={-1.2}
          radius={16} lit={0.44} sheenAt={A6 + 92} focusX={50} focusY={50}
        >
          <div
            style={{
              position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "soft-light",
              background: `linear-gradient(200deg, ${rgba(MD.cold, 0.14 + cold * 0.34)} 0%, ${rgba(MD.ink0, 0.2)} 100%)`,
            }}
          />
          {/* latido rojísimo bajo el aro: sigue vivo, y eso es todo el chiste */}
          <div
            style={{
              position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen",
              background: `radial-gradient(26% 22% at 50% 54%, ${rgba(MD.red, 0.06 + 0.05 * (0.5 + 0.5 * Math.sin(f / 21)))} 0%, rgba(0,0,0,0) 74%)`,
            }}
          />
        </Plate>
        <Spill x={30} y={72} heat={heat * (1 - q * 0.5)} r={30} tone={MD.red} />
        {/* el fósforo frío, primer plano, sin una sola brasa */}
        <Plate
          still={A.spentJ}
          w={380} h={214} x={-400} y={232} z={120} ry={11} rz={1.8}
          lit={0.22} opacity={0.9} focusX={50} focusY={48}
        />
      </div>
      </Space3D>
    </AbsoluteFill>
  );
};

/**
 * LA CAPA DE LA BRASA — la materia que cruza las seis fronteras, montada UNA sola vez.
 * Va en el mismo `actT` que los actos (mismo parallax, cero deriva) y por encima de todo,
 * que es donde tiene que estar una fuente de luz.
 */
const EmberLayer: React.FC<{ pos: XY; heat: number; smoke: number; size: number; actT: string }> = ({
  pos, heat, smoke, size, actT,
}) => (
  <Space3D style={{ zIndex: 70 }}>
    <div style={{ position: "absolute", inset: 0, transform: actT, transformStyle: "preserve-3d" }}>
      <Ember x={pos.x} y={pos.y} heat={heat} size={size} />
      <Smoke x={pos.x} y={pos.y - 1} amount={smoke} h={300} w={210} />
    </div>
  </Space3D>
);

/** Banco de vapor propio: `VaporWipe` sola es demasiado tenue para esconder una frontera. */
const SteamBank: React.FC<{ at: number; dur: number }> = ({ at, dur }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const o = Math.sin(p * Math.PI);
  const x = interpolate(p, [0, 1], [-46, 52]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      {Array.from({ length: 9 }, (_, i) => {
        const s = rnd(i * 9.7);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x + i * 13 - 16 + s * 8}%`,
              top: `${-6 + s * 74 - p * 14}%`,
              width: `${34 + s * 40}%`,
              height: `${30 + s * 36}%`,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${rgba(MD.white, 0.26 + s * 0.12)} 0%, ${rgba(MD.bone, 0.11)} 42%, rgba(255,255,255,0) 72%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  LA CAPA DE TIPOGRAFÍA — vive en ESPACIO DE PANTALLA, fuera del contenedor de cámara.
//
//  ⚠️ Por qué está acá y no adentro de cada acto (mina conocida del pipeline): el root de un acto
//  es un contexto `preserve-3d`, y ahí los hermanos se ordenan POR PROFUNDIDAD 3D — ni por orden
//  del DOM ni por `z-index`. Cualquier placa con `translateZ` positivo (actos 2, 3 y 4 llegan a
//  +210) se dibujaba ENCIMA del texto. Y además la perspectiva la MAGNIFICA: un titular anclado
//  a 232 px del borde se iba de la safe area cuando la cámara escala 1,078 y panea −70.
//
//  Solución: los seis titulares salen del mundo 3D y viven en una capa plana con `zIndex` alto,
//  acoplada a la cámara SÓLO por un parallax suave derivado de `cam.state` (panX/panY × 0,05).
//  Respira con la cámara, nunca la tapa una placa, y la safe area es constante todo el video.
// ════════════════════════════════════════════════════════════════════════════════════════════
const SAFE = 150; // margen real, ya sin magnificación de perspectiva

const Captions: React.FC<{
  FA: number; FB: number; FC: number; FD: number; FE: number; D: number; par: string;
}> = ({ FA, FB, FC, FD, FE, D, par }) => (
  <AbsoluteFill style={{ zIndex: 90, pointerEvents: "none", transform: par }}>
    {/* ACTO 1 */}
    <div style={{ position: "absolute", left: SAFE, bottom: SAFE }}>
      <Say at={22} out={FA - 20} kicker="THE WATER PLANT'S DAILY PROBLEM" w={820}>
        Chlorine <Em>demand</Em>.
      </Say>
    </div>
    {/* ACTO 2 */}
    <div style={{ position: "absolute", right: SAFE, top: SAFE - 10, width: 760 }}>
      <Say at={FA + 16} out={FB - 34} kicker="IT GRABS THE FIRST THING IT TOUCHES" w={760} size={58}>
        One reaction. Then it's <Em>salt</Em>.
      </Say>
    </div>
    {/* ACTO 3 */}
    <div style={{ position: "absolute", left: SAFE, top: SAFE }}>
      <Say
        at={FB + 18}
        out={FC - 20}
        kicker="THEY DON'T DOSE FOR THE GERMS"
        w={790}
        size={58}
        detail="Extra goes in on purpose. Most of it is gone before your house."
      >
        They dose for the <Em>loss</Em>.
      </Say>
    </div>
    {/* ACTO 4 */}
    <div style={{ position: "absolute", left: SAFE, bottom: SAFE }}>
      <Say at={FC + 18} out={FD - 26} kicker="YOUR BOWL IS ALREADY FULL" w={800} size={58}>
        The mold is <Em>last in line</Em>.
      </Say>
    </div>
    {/* ACTO 5 */}
    <div style={{ position: "absolute", left: SAFE, top: SAFE + 12 }}>
      <Say at={FD + 16} out={FE - 18} kicker="STRUCK IN THE DOORWAY" w={760} size={58}>
        The room never gets <Em>warm</Em>.
      </Say>
    </div>
    {/* ACTO 6 */}
    <div style={{ position: "absolute", right: SAFE, bottom: SAFE, width: 740 }}>
      <Say at={FE + 20} out={D - 34} kicker="SAME RING. SAME MORNING." w={740} size={72}>
        <Em>Untouched</Em>.
      </Say>
    </div>
  </AbsoluteFill>
);

// ════════════════════════════════════════════════════════════════════════════════════════════
//  EL MOVIMIENTO
// ════════════════════════════════════════════════════════════════════════════════════════════
export const MovMatch: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = Math.max(240, Math.round(durationInFrames));
  const f = Math.min(frame, D - 1);
  const p = clamp01(f / D);

  // fronteras ancladas a la duración real (el build las estira ±20% sin romper nada)
  const FA = Math.round(K.a2 * D);
  const FB = Math.round(K.a3 * D);
  const FC = Math.round(K.a4 * D);
  const FD = Math.round(K.a5 * D);
  const FE = Math.round(K.a6 * D);

  const heat = heatAt(f, D);
  const pos = emberPos(f, FA, FB, FC, FD, FE, D);
  // el tamaño de la brasa sigue la ESCALA del acto: macro grande, plano general chica
  const emBase = p < K.a2 ? 1.15 : p < K.a3 ? 0.8 : p < K.a4 ? 0.62 : p < K.a5 ? 0.9 : p < K.a6 ? 0.8 : 0.5;
  // …y ESTALLA mientras la cámara la atraviesa (frontera A): así el zoom-through pasa por dentro
  // del fuego en lugar de pasar al lado de un glow que se quedó quieto.
  const flare = f < FA - 22 || f > FA + 20 ? 0 : f < FA ? eio(0, 1, (f - (FA - 22)) / 22) : eio(1, 0, (f - FA) / 20);
  const emSize = emBase * (1 + 2.4 * flare);
  // el humo es el reverso del calor: casi nada mientras arde, espeso cuando se apaga, y se
  // termina de ir en el último acto (el fósforo ya está frío, no puede seguir humeando)
  const smoke = clamp01(f / 40) * lerp(0.18, 0.72, 1 - heat) * clamp01((D - f) / 110);
  const tint = movLight(1, p);            // la luz del movimiento la manda el Stage
  const cam = stageCam(p, 1);             // ⛔ no se pisa: los actos aplican offsets ENCIMA
  const off = actOffset(p);

  // respiración: nunca hay nada perfectamente quieto
  const bx = Math.sin(f / 53) * 2.4 + Math.sin(f / 119) * 1.3;
  const by = Math.cos(f / 67) * 1.9;
  const actT =
    `translate3d(${(off.x + bx).toFixed(2)}px, ${(off.y + by).toFixed(2)}px, ${off.z.toFixed(2)}px) ` +
    `rotateY(${off.ry.toFixed(3)}deg) rotateX(${off.rx.toFixed(3)}deg)`;
  // la tipografía NO entra en el mundo 3D: sólo respira con la cámara (cam.state × 0,05)
  const par = `translate3d(${(cam.state.panX * 0.05 + bx * 0.4).toFixed(2)}px, ${(cam.state.panY * 0.05 + by * 0.4).toFixed(2)}px, 0)`;

  // la atmósfera: UNA sola, montada acá, jamás remontada por un acto
  const keyFrom = lerp(0.16, 0.76, eio(0, 1, p));
  const intensity = lerp(0.34, 1.04, clamp01(f / 14)) * lerp(1.08, 0.8, p) * (0.9 + heat * 0.16);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={tint} keyFrom={keyFrom} intensity={intensity} />
      <Motes n={30} tint={MD.bone} speed={0.85} />

      {/* CÁMARA ÚNICA. `flat` a propósito: cada acto trae su Space3D y el zIndex manda. */}
      <AbsoluteFill style={{ transform: cam.transform, transformStyle: "flat" }}>
        {/* ── FRONTERA A · ZOOM-THROUGH: la cámara entra por la llama ── */}
        {f < FA + 6 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 60 }}>
            <ZoomThrough at={FA - 24} dur={28} into={[47, 45]} scale={7}>
              <Act1 f={f} heat={heat} actT={actT} />
            </ZoomThrough>
          </div>
        )}

        {f >= FA - 8 && f < FB + 2 && (
          <Act2 f={f} A2={FA} FB={FB} heat={heat} actT={actT} />
        )}

        {/* ── FRONTERA B · MATCH-SHAPE: la placa quemada SE DEFORMA en la tapita ── */}
        {f >= FB - 30 && f < FB + 3 && <BridgeB FB={FB} actT={actT} />}

        {f >= FB - 24 && f < FC + 1 && (
          <Act3 f={f} A3={FB} FC={FC} heat={heat} actT={actT} />
        )}

        {f >= FC - 2 && f < FD + 2 && (
          <Act4 f={f} A4={FC} FD={FD} heat={heat} actT={actT} />
        )}

        {f >= FD - 16 && f < FE && (
          <Act5 f={f} A5={FD} FE={FE} heat={heat} actT={actT} />
        )}

        {/* ── FRONTERA E · CORTE EN EL BEAT: axial sobre el aro, sin transición ── */}
        {f >= FE && <Act6 f={f} A6={FE} D={D} heat={heat} actT={actT} />}

        {/* ── LA MATERIA QUE CRUZA: una sola brasa para los seis actos ── */}
        <EmberLayer pos={pos} heat={heat} smoke={smoke} size={emSize} actT={actT} />
      </AbsoluteFill>

      {/* TIPOGRAFÍA — capa de pantalla, por encima de los seis actos y de la brasa. Va ANTES de
          las costuras a propósito: la oclusión y el vapor también tienen que taparla a ella. */}
      <Captions FA={FA} FB={FB} FC={FC} FD={FD} FE={FE} D={D} par={par} />

      {/* ── FRONTERA C · OCLUSIÓN: el cuerpo blanco de la jarra cruza y tapa el 100% ── */}
      <Occluder at={FC - 8} dur={16} color={MD.bone} angle={-6} />

      {/* ── FRONTERA D · WIPE POR MATERIA: el vapor del agua cruza y detrás ya está el cuarto ── */}
      <VaporWipe at={FD - 15} dur={30} />
      <SteamBank at={FD - 15} dur={30} />

      {/* hold vivo del último acto: un barrido especular cruza la porcelana */}
      <Sheen at={FE + 96} dur={44} angle={12} />
    </AbsoluteFill>
  );
};
