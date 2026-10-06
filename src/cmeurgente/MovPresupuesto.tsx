// MovPresupuesto.tsx — S1 · EL PRIMER MOVIMIENTO DE `cmeurgente` (el video abre acá).
// Canal "Claudio Mendoza Constructor" · arranca en el segundo 1,1 · 1635 cuadros = 54,0 s @30fps.
//
// LA ESPINA: el papel brillante de 23.000 dólares se impone sobre la mesa de la cocina, se desarma
// en sus tres promesas (diez kilovatios · doce años · cuarenta y ocho horas), y termina apartado
// por una mano que apoya la pinza amperimétrica encima. De la promesa impresa al primer dato medido.
//
// Los primeros segundos deciden la retención de 24 minutos: la CIFRA (veintitrés mil) y el OBJETO
// DEL CONFLICTO (el presupuesto couché con el tejado azul de una casa ajena) están en cuadro desde
// el cuadro 0 y golpean antes del segundo 4.
//
// ╔══════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE donde termina el acto N                   ║
// ╠════╦══════════════════════════════════════════╦══════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto           ║ SALE: encuadre + luz + objeto                ║
// ╠════╬══════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 1  ║ CÁM: alto y frío, casi cenital sobre la  ║ CÁM: z −60→−22 con la grúa YA subiendo        ║
// ║ g0 ║   mesa de la cocina (z0 −60, rx +2,6).   ║   (camLift 0→+30): no frena en la frontera,   ║
// ║    ║   Es la apertura del video: nadie me      ║   la atraviesa despegando del papel.          ║
// ║    ║   entrega nada.                           ║ LUZ: keyFrom 0,88→0,84, int 1,02: el blanco   ║
// ║    ║ LUZ: MEDIODÍA DEL VENDEDOR — blanco duro  ║   duro todavía manda, el couché sigue         ║
// ║    ║   arriba-derecha (keyFrom 0,88), el papel ║   rebotando.                                  ║
// ║    ║   couché rebotando (int 0,70→0,98).       ║ MAT: LA FOTO DEL FOLLETO (la casa ajena con   ║
// ║    ║ MAT: EL PAPEL del presupuesto (V.paper),  ║   el tejado azul), recortada en el papel, YA  ║
// ║    ║   a sangre sobre la mesa.                 ║   creciendo: 400×236 → 900×530.               ║
// ╠════╬══════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 2  ║ CÁM: subiendo con la misma inercia, la    ║ CÁM: z ≈ −96 y la grúa detenida arriba        ║
// ║g357║   hoja cae fuera de cuadro por abajo.     ║   (camLift +46): el tejado se hunde, no la    ║
// ║    ║ LUZ: keyFrom 0,84, tintB paper→ámbar en   ║   cámara.                                     ║
// ║    ║   0,25: entra el sol del tejado.          ║ LUZ: keyFrom 0,80, tintB ámbar 0,55.          ║
// ║    ║ MAT: la foto del folleto TERMINÓ de       ║ MAT: LA FILA DE DOCE PANELES azules apoyada   ║
// ║    ║   crecer: ES el tejado real (1740×980)    ║   sobre el tejado, ya despegando de la teja   ║
// ║    ║   con RoofPlane panels=1 debajo.          ║   (rotateX 58→0 arrancado).                   ║
// ╠════╬══════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 3  ║ CÁM: heredada arriba, empieza la deriva   ║ CÁM: z ≈ −140, derivando hacia la casilla     ║
// ║g687║   hacia la casilla doce (camZ +20→+64).   ║   doce: la entrada al túnel ya está en curso. ║
// ║    ║ LUZ: keyFrom 0,80 → 0,74, ámbar 0,55.     ║ LUZ: keyFrom 0,74, tintB ámbar 0,80.          ║
// ║    ║ MAT: LAS DOCE CASILLAS (los mismos doce   ║ MAT: LA CASILLA DOCE, la última que se        ║
// ║    ║   rectángulos, ya planos y ámbar) sobre   ║   encendió, sola y viva: es el agujero por    ║
// ║    ║   la página del presupuesto que subió.    ║   el que entra la cámara.                     ║
// ╠════╬══════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 4  ║ CÁM: sale del túnel (escala 3,6→1,0),     ║ CÁM: z ≈ −186, bajando (camLift +8→−26) y     ║
// ║g987║   ya bajando hacia la mesa.               ║   ladeándose hacia la mano.                   ║
// ║    ║ LUZ: keyFrom 0,74→0,66, int 0,94: el      ║ LUZ: keyFrom 0,66, int 0,78: el blanco YA     ║
// ║    ║   blanco empieza a bajar.                 ║   bajó un tercio.                             ║
// ║    ║ MAT: la casilla doce, abierta, es el      ║ MAT: EL PAPEL ENTERO (V.paper) girando y      ║
// ║    ║   RECUADRO sobre la letra chica; detrás   ║   cruzando el cuadro pegado al lente.         ║
// ║    ║   el reloj de la cocina desenfocado.      ║                                               ║
// ╠════╬══════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 5  ║ CÁM: baja y cerca, a la altura de la      ║ CÁM: BAJA Y CERCA, a la altura de la mano,    ║
// ║g1317║  mano, ladeándose (ry −5 casi cumplido). ║   ladeada: z −220, ry −5, rx +4,2.            ║
// ║    ║ LUZ: keyFrom 0,66, int 0,78, sin volt.    ║ LUZ: el blanco bajó un tercio (int 0,66) y    ║
// ║    ║ MAT: el papel que cruzó ATERRIZA en la    ║   ENTRA EL PRIMER VOLT del display.           ║
// ║    ║   mesa; la mano lo aparta.                ║ MAT: LA MORDAZA NARANJA DE LA PINZA apoyada   ║
// ║    ║                                           ║   sobre el presupuesto, display encendido.    ║
// ║    ║                                           ║   → así abre `MovTreintaDias`.                ║
// ╚════╩══════════════════════════════════════════╩══════════════════════════════════════════════╝
//
// COSTURAS — una distinta por frontera, ninguna es un fundido, ninguna baja un opacity a 0:
//   g357  1→2  MATCH-MOVE     — la cámara NO corta: sigue su grúa (camLift 0→+46) y el mundo cambia
//                               debajo. La hoja del presupuesto sale por abajo con el mismo vector
//                               de la grúa mientras LA FOTO DEL FOLLETO (misma Ventana, mismo
//                               recorte, k 1,06→1,10: el material NO se re-encuadra) crece de un
//                               recorte de 400 px a un plano de 1740 px. La foto impresa SE VUELVE
//                               el tejado real, y el RoofPlane sube por debajo a apoyarla.
//   g687  2→3  MATCH-SHAPE    — LOS MISMOS DOCE RECTÁNGULOS. En el acto 2 son la fila de paneles
//                               apoyada en la teja (rotateX 58°, azul V.panel); entre g626 y g740,
//                               escalonados uno a uno, se enderezan a rotateX 0 y viran a ámbar:
//                               son las doce casillas de los doce años. Ni un frame se desmontan.
//                               A la vez la página del presupuesto SUBE al cuadro (geometría pura)
//                               y el tejado se hunde: el suelo se cambia por debajo.
//   g987  3→4  ZOOM-THROUGH   — `zoomThrough(g, 966, 26, foco = casilla doce)`. El acto 3 entero
//                               escala hacia la casilla doce y pasa de largo por el lente; el acto 4
//                               ya está detrás, naciendo a escala 3,6 → 1,0. La casilla doce viaja
//                               FUERA del túnel y se abre hasta ser el RECUADRO de la letra chica.
//   g1317 4→5  OCLUSIÓN       — `SeamOcclude` con `V.paper` (lit 0,30, el de fábrica: ni flash
//                               blanco ni fundido a negro) + LA HOJA REAL girando pegada al lente
//                               (Ventana con la foto del presupuesto + el clip del folleto adentro,
//                               rot −14°→96°, cruzando de x −42% a x 146%). Detrás ya está la mesa.
//                               Esa misma hoja es la que la mano aparta en el acto 5.
//
// EL OBJETO QUE CRUZA CADA FRONTERA Y SE TRANSFORMA:
//   1→2  la FOTO IMPRESA del folleto        → el TEJADO REAL de paneles azules
//   2→3  la FILA DE DOCE PANELES azules     → las DOCE CASILLAS ámbar de las cuotas
//   3→4  la CASILLA DOCE (la última cuota)  → el RECUADRO que enmarca la letra chica
//   4→5  el PAPEL del presupuesto girando   → el papel que la mano APARTA para apoyar la pinza
//
// ⛔ CONTRATO: cero azar de reloj de sistema (todo sale de `rnd(k)` y de `g`) · sin `position: fixed` ·
// ⛔ nunca más de dos capas con blur simultáneas (acto 1 y acto 4 no coexisten) · rutas SÓLO
// ⛔ literales de la ficha · ningún acto envuelto en su propia secuencia: un solo reloj `g`.
// ⚠️ `cmeu_ic_dolar.png` NO existe en disco (no está en el set de íconos del video): se resuelve
//    con `cmeu_ic_billete.png`, que sí existe y está en la lista abierta a todos los movimientos.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, RoofPlane, SunField, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, zoomThrough,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO ──────────────────────────────────────────────────────────────────
const END = 1635;
const A2 = 357;
const A3 = 687;
const A4 = 987;
const A5 = 1317;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const miles = (n: number) => {
  const s = String(Math.max(0, Math.round(n)));
  return s.length > 3 ? s.slice(0, s.length - 3) + "." + s.slice(s.length - 3) : s;
};

// ── VENTANA — el marco de vidrio que RECORTA el material real ────────────────────────────────
// Es la primitiva de este movimiento: la MISMA Ventana que era el recorte de la foto impresa en el
// folleto se abre y se vuelve el tejado a sangre. Adentro va SIEMPRE material real.
const Ventana: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  lit?: number; litColor?: string; opacity?: number; children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, radius = 12, lit = 1, litColor = V.volt, opacity = 1, children }) => {
  const ww = Math.max(10, w);
  const hh = Math.max(10, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      border: `1px solid ${rgba(litColor, 0.26 * lit)}`,
      boxShadow: `0 ${Math.round(hh * 0.14)}px ${Math.round(hh * 0.22)}px ${rgba(V.ink0, 0.76)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.6)}, inset 0 1px 0 ${rgba(V.white, 0.28 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL dentro de la Ventana: la FOTO siempre (recorte animado = nunca queda quieta) y el
//    CLIP encima en su ventana viva. `k` es el zoom del recorte (≥1: la foto siempre cubre).
const Mat: React.FC<{
  photo: string; clip?: string; vid?: number;
  w: number; h: number; k: number; cx?: number; cy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.03, k);
  const iw = Math.max(12, w * kk);
  const ih = Math.max(12, h * kk);
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

// ── LOS DOCE RECTÁNGULOS — la costura MATCH-SHAPE del video en una sola primitiva ────────────
// El MISMO elemento es, según `m`: (m=0) una teja de panel azul apoyada en el tejado con rotateX 58,
// (m=1) una casilla plana de una cuota. `on` la enciende en ámbar cuando esa cuota se firma.
const Casilla: React.FC<{
  x: number; y: number; w: number; h: number; z: number; rx: number; ry: number;
  m: number; on: number; lit: number; g: number; i: number; fill?: number;
}> = ({ x, y, w, h, z, rx, ry, m, on, lit, g, i, fill = 1 }) => {
  const ww = Math.max(6, w);
  const hh = Math.max(6, h);
  const pulse = on > 0.6 ? 0.5 + 0.5 * Math.sin((g - i * 6) / 11) : 0;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`,
      transformStyle: "preserve-3d", transformOrigin: "50% 100%",
      borderRadius: lerp(2, 5, m),
      border: `1px solid ${rgba(m < 0.5 ? V.steel : V.amber, (0.3 + 0.42 * on) * lit)}`,
      boxShadow: `0 0 ${Math.round(8 + 30 * on * (0.4 + 0.6 * pulse))}px ${rgba(V.amber, 0.3 * on * lit)}, ` +
        `0 ${Math.round(hh * 0.1)}px ${Math.round(hh * 0.16)}px ${rgba(V.ink0, 0.62)}`,
      overflow: "hidden",
    }}>
      {/* la piel de PANEL SOLAR (lo que TODAVÍA no hay que comprar) */}
      <div style={{
        position: "absolute", inset: 0, opacity: clamp01(1 - m) * lit * fill,
        background: `linear-gradient(158deg, ${rgba(V.panel, 0.94)} 0%, ${rgba(V.panel, 0.54)} 58%, ${rgba(V.ink1, 0.92)} 100%)`,
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.4, mixBlendMode: "overlay",
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.42) 0 1px, rgba(0,0,0,0) 1px 15px)," +
            "repeating-linear-gradient(90deg, rgba(0,0,0,.5) 0 1px, rgba(0,0,0,0) 1px 22px)",
        }} />
      </div>
      {/* la piel de CASILLA DE CUOTA (el dinero: ámbar) */}
      <div style={{
        position: "absolute", inset: 0, opacity: clamp01(m) * lit * fill,
        background: `linear-gradient(180deg, ${rgba(V.amber, 0.10 + 0.52 * on)} 0%, ${rgba(V.amber, 0.04 + 0.20 * on)} 100%)`,
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, height: Math.max(2, hh * 0.06),
        opacity: clamp01(m) * on * lit, background: rgba(V.amber, 0.92),
      }} />
    </div>
  );
};

// ── EL DISPLAY DE LA PINZA — el primer volt del video (lo que hereda `MovTreintaDias`) ───────
const DisplayVolt: React.FC<{ x: number; y: number; w: number; on: number; g: number }> = ({ x, y, w, on, g }) => {
  if (on <= 0.01) return null;
  const h = Math.round(w * 0.46);
  const blink = 0.72 + 0.28 * Math.sin(g / 7);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity: clamp01(on),
      borderRadius: 6, overflow: "hidden",
      border: `1px solid ${rgba(V.volt, 0.5)}`,
      background: `linear-gradient(180deg, ${rgba(V.voltSoft, 0.36)} 0%, ${rgba(V.ink1, 0.9)} 100%)`,
      boxShadow: `0 0 ${Math.round(26 + 26 * blink)}px ${rgba(V.volt, 0.36 * blink)}, inset 0 1px 0 ${rgba(V.volt, 0.4)}`,
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.22, mixBlendMode: "overlay",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.6) 0 1px, rgba(0,0,0,0) 1px 4px)",
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)",
        textAlign: "center", fontFamily: F_DISPLAY, fontWeight: 800,
        fontSize: Math.round(h * 0.56), lineHeight: 1, letterSpacing: 2,
        color: rgba(V.volt, 0.62 + 0.38 * blink),
        textShadow: `0 0 ${Math.round(h * 0.3)}px ${rgba(V.volt, 0.6)}`,
      }}>0.00</div>
    </div>
  );
};

export const MovPresupuesto: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El build monta UN movimiento en UNA sola secuencia: `useCurrentFrame()` es local a ese tramo.
  // Todo componente del Stage que recibe `at`/`sheenAt` razona en frames LOCALES → se traduce con L().
  const f = useCurrentFrame();
  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame as number)
    ? (gFrame as number)
    : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))] + f;
  const off = gRaw - f;
  const L = (gAt: number) => gAt - off;
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola, función de g, que NUNCA vuelve a cero ═══════════════════════════
  // Base: de alto y frío sobre la mesa (z −60) a bajo y cerca de la mano (z −220, ry −5).
  const camB = gcam(g, { z0: -60, z1: -220, panX: 13, panY: -28, ry: -5, rx: 2.6, dur: END });
  // Desviaciones LOCALES que se SUMAN a la base (nunca la reemplazan): la deriva de cada acto.
  const camZ = ip(g,
    [0, 150, 300, A2, 440, 560, A3, 830, 940, A4, 1060, 1230, A5, 1420, 1540, END],
    [0, 30, 50, 52, 4, 14, 20, 48, 64, 58, 8, 46, 44, -6, 12, 4]);
  // la GRÚA: sube y despega del papel en la frontera 1, y baja a la altura de la mano en la 4.
  const camLift = ip(g,
    [0, 260, 300, A2, 470, A3, A4, 1240, A5, 1400, 1480, END],
    [0, 3, 12, 30, 44, 46, 40, 30, 8, -12, -26, -34]);
  const camTilt = ip(g, [0, A2, A3, A4, A5, 1470, END], [0, -1.2, -0.5, 0.8, 2.4, 3.6, 4.2]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camLift.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg)`;
  // la deriva de la cámara, replicada (a menor ganancia) para el HUD: el texto no va pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.4).toFixed(2)}px, ${(by * 0.4).toFixed(2)}px)`;

  // ══ LA LUZ — MEDIODÍA DEL VENDEDOR que se gasta un tercio y deja entrar el primer volt ════
  const keyFrom = ip(g, [0, 300, A2, A3, A4, A5, 1470, END],
    [0.88, 0.88, 0.84, 0.80, 0.74, 0.66, 0.63, 0.62]);
  const inten = ip(g, [0, 90, A2, A3, A4, 1240, 1400, 1560, END],
    [0.70, 0.98, 1.02, 1.00, 0.94, 0.92, 0.78, 0.68, 0.66]);
  const floor = ip(g, [0, A2, A3, A4, A5, END], [0.44, 0.42, 0.50, 0.58, 0.62, 0.66]);
  // el blanco duro del vendedor cede al primer volt del display, sólo en el último acto
  const tintA = light(ip(g, [0, 1240, 1400, 1560, END], [0, 0, 0.35, 0.82, 1]), "white", "volt");
  // el rebote del couché se calienta hasta el ámbar del dinero
  const tintB = light(ip(g, [0, A2, A3, A4, A5, END], [0, 0.25, 0.55, 0.80, 1, 1]), "paper", "amber");

  // ══════════════════════════════════════════════════════════════════════════════════════════
  // ACTO 1 (g0–357) · VEINTITRÉS MIL — la hoja del presupuesto sobre la mesa de la cocina
  // ══════════════════════════════════════════════════════════════════════════════════════════
  const kHoja = [0, 40, 150, 260, 300, A2, 400, 470];
  const hojaW = ip(g, kHoja, [1180, 1212, 1244, 1258, 1246, 1120, 878, 560]);
  const hojaH = ip(g, kHoja, [700, 720, 738, 748, 740, 664, 520, 332]);
  const hojaX = ip(g, kHoja, [50, 50, 50.4, 50.8, 51, 50, 46, 40]);
  const hojaY = ip(g, kHoja, [47, 47, 47.5, 48, 49, 63, 98, 144]);
  const hojaZ = ip(g, kHoja, [-10, -6, 0, 6, 8, -30, -92, -164]);
  const hojaRy = ip(g, kHoja, [0, 0.4, 0.9, 1.4, 1.6, 3.2, 7, 12]);
  const hojaRx = ip(g, kHoja, [4, 3.4, 2.4, 1.6, 1.2, -6, -18, -30]);
  const hojaLit = ip(g, kHoja, [0.9, 1, 1, 1, 1, 0.92, 0.7, 0.42]);
  const hojaK = ip(g, kHoja, [1.20, 1.18, 1.14, 1.11, 1.10, 1.13, 1.20, 1.32]);
  const hojaVid = ip(g, [0, 126, 146], [1, 1, 0]);

  // la CIFRA: veintitrés mil dólares. Salta a su valor en el segundo 3 y se queda.
  const cifra = ip(g, [64, 76, 88, 100, 114], [0, 14200, 21600, 22400, 23000]);
  const cifraX = ip(g, [60, 300, A2, 400], [64.5, 64.5, 60, 54]);
  const cifraY = ip(g, [60, 300, A2, 400], [27, 27, 22, 15]);
  const cifraS = ip(g, [60, 300, A2, 400], [150, 150, 108, 60]);
  const cifraOn = ip(g, [58, 70, 372, 402], [0, 1, 1, 0]);

  // ══════════════════════════════════════════════════════════════════════════════════════════
  // FRONTERA 1 · MATCH-MOVE + ACTO 2 (g357–687) · DIEZ KILOVATIOS
  // La MISMA Ventana: recorte impreso en el folleto → tejado real a sangre. El recorte (k) casi no
  // se mueve: lo que crece es el MARCO. Eso ES el match: la foto impresa se vuelve el tejado.
  // ══════════════════════════════════════════════════════════════════════════════════════════
  const kTej = [0, 250, 300, A2, 430, 500, A3, 700, 772];
  const tejW = ip(g, kTej, [400, 414, 430, 900, 1560, 1740, 1740, 1706, 1560]);
  const tejH = ip(g, kTej, [236, 244, 254, 530, 880, 980, 980, 962, 880]);
  const tejX = ip(g, kTej, [38.6, 38.8, 39.2, 44, 50, 50, 50, 50, 50]);
  const tejY = ip(g, kTej, [57, 57.4, 58, 54, 48, 44, 44, 62, 152]);
  const tejZ = ip(g, kTej, [14, 18, 22, 10, -60, -120, -140, -190, -280]);
  const tejRy = ip(g, kTej, [0, 0.3, 0.6, 1.4, 0.6, 0, 0, 0, 0]);
  const tejRx = ip(g, kTej, [4, 3.4, 3, -2, -6, -8, -8, -6, -2]);
  const tejLit = ip(g, kTej, [0.82, 0.88, 0.94, 1, 1, 1, 1, 0.82, 0.4]);
  const tejK = ip(g, kTej, [1.06, 1.06, 1.06, 1.08, 1.09, 1.10, 1.12, 1.14, 1.18]);

  // el tejado geométrico que sube por debajo a APOYAR la foto que creció
  const roofY = ip(g, [330, 430, 520, A3, 700, 772], [122, 92, 76, 74, 96, 150]);
  const roofLit = ip(g, [330, 430, A3, 700, 760], [0, 0.7, 1, 0.7, 0.2]);

  // la cifra del sistema que te venden: diez kilovatios
  const kwOn = ip(g, [402, 418, 640, 668], [0, 1, 1, 0]);

  // el folleto vuelve, chico y de perfil: el mismo material en otra escala (variedad por MATERIAL)
  const folOn = ip(g, [396, 424, 636, 664], [0, 1, 1, 0]);
  const folVid = ip(g, [400, 526, 548], [1, 1, 0]);

  // ══════════════════════════════════════════════════════════════════════════════════════════
  // FRONTERA 2 · MATCH-SHAPE — los MISMOS doce rectángulos: paneles → casillas de las cuotas
  // ══════════════════════════════════════════════════════════════════════════════════════════
  const slats = Array.from({ length: 12 }, (_, i) => {
    const m = eio(0, 1, clamp01((g - (626 + i * 4.2)) / 82));
    const on = clamp01((g - (712 + i * 15)) / 13);
    const jitter = (rnd(i * 3.7) - 0.5) * 0.5;
    return {
      i, m, on,
      x: lerp(13.6 + i * 6.2, 14.2 + i * 6.15, m),
      y: lerp(66, 55, m) + jitter,
      w: lerp(96, 104, m),
      h: lerp(150, 78, m),
      z: lerp(-30, 20, m),
      rx: lerp(58, 0, m),
      ry: lerp(0, (i - 5.5) * 0.28, m),
    };
  });
  const slatLit = ip(g, [378, 410, 950, 990], [0, 1, 1, 1]);

  // LA CASILLA DOCE: sale del túnel y se abre hasta ser el RECUADRO de la letra chica.
  const cajaT = ipe(g, [964, 1050], [0, 1], Easing.out(Easing.cubic));
  const cajaX = lerp(slats[11].x, 50, cajaT);
  const cajaY = lerp(slats[11].y, 53.5, cajaT);
  const cajaW = lerp(104, 980, cajaT);
  const cajaH = lerp(78, 168, cajaT);
  const cajaOn = ip(g, [948, 966, 1250, 1300], [1, 1, 1, 0.02]);

  // ══════════════════════════════════════════════════════════════════════════════════════════
  // ACTO 3 (g687–987) · FINANCIADO A DOCE AÑOS — la página sube por geometría, cero fundido
  // ══════════════════════════════════════════════════════════════════════════════════════════
  const pagRise = ipe(g, [616, 736], [1240, 0], Easing.out(Easing.cubic));
  const pagK = ip(g, [616, 736, A4], [1.62, 1.50, 1.42]);
  const pagLit = ip(g, [616, 700, 940], [0.5, 0.94, 1]);
  // lo que se firma: los 23.000 se acumulan cuota por cuota
  const firma = ip(g, [716, 800, 880, 900], [0, 12800, 22100, 23000]);
  const firmaOn = ip(g, [712, 730, 934, 958], [0, 1, 1, 0]);
  // el túnel de la frontera 3: la cámara entra en la casilla doce
  const zt = zoomThrough(g, 966, 26, slats[11].x, slats[11].y);

  // ══════════════════════════════════════════════════════════════════════════════════════════
  // ACTO 4 (g987–1317) · VÁLIDO CUARENTA Y OCHO HORAS — sale del túnel en la letra chica
  // ══════════════════════════════════════════════════════════════════════════════════════════
  const salidaS = ipe(g, [968, 1056], [3.6, 1], Easing.out(Easing.cubic));
  const salidaX = ipe(g, [968, 1056], [(50 - slats[11].x) * 2.4, 0], Easing.out(Easing.cubic));
  const salidaY = ipe(g, [968, 1056], [(50 - slats[11].y) * 2.4, 0], Easing.out(Easing.cubic));
  const chicaScale = ip(g, [964, 1160, A5], [1.30, 1.21, 1.15]);
  const chicaDim = ip(g, [964, 1050, 1200, A5], [0.16, 0.32, 0.38, 0.44]);
  // el reloj de la cocina, desenfocado detrás (única capa con blur mientras dura este acto)
  const relojOn = ip(g, [990, 1040, 1280, 1312], [0, 0.52, 0.52, 0.3]);
  const manecilla = ip(g, [1000, 1300], [-24, 96]);
  // las cuarenta y ocho horas: la barra que se vacía
  const plazoOn = ip(g, [1040, 1064, 1262, 1298], [0, 1, 1, 0]);
  const plazoRest = ip(g, [1070, 1290], [48, 11]);
  const plazoBar = ip(g, [1070, 1290], [1, 0.24]);
  const folOn4 = ip(g, [1016, 1046, 1276, 1300], [0, 1, 1, 0.6]);
  const folVid4 = ip(g, [1020, 1148, 1170], [1, 1, 0]);

  // ══════════════════════════════════════════════════════════════════════════════════════════
  // FRONTERA 4 · OCLUSIÓN con V.paper + la HOJA REAL girando pegada al lente
  // ══════════════════════════════════════════════════════════════════════════════════════════
  const spinX = ip(g, [1288, 1350], [-44, 148]);
  const spinY = ip(g, [1288, 1350], [38, 64]);
  const spinRot = ip(g, [1288, 1350], [-14, 96]);
  const spinRy = ip(g, [1288, 1350], [26, -32]);
  const spinLit = ip(g, [1288, 1310, 1332, 1350], [0.5, 0.34, 0.34, 0.5]);

  // ══════════════════════════════════════════════════════════════════════════════════════════
  // ACTO 5 (g1317–1635) · DÉJAME MEDIRLO — la mano aparta el papel y apoya la pinza
  // ══════════════════════════════════════════════════════════════════════════════════════════
  const mesaY = ipe(g, [1300, 1428], [66, 50], Easing.out(Easing.cubic));
  const mesaW = ip(g, [1300, 1428, END], [1360, 1520, 1560]);
  const mesaH = ip(g, [1300, 1428, END], [790, 880, 902]);
  const mesaRx = ip(g, [1300, 1428, END], [12, 3, 1]);
  const mesaLit = ip(g, [1300, 1360, 1500, END], [0.62, 0.94, 1, 1]);
  const mesaK = ip(g, [1300, 1428, END], [1.22, 1.12, 1.07]);
  const mesaVid = ip(g, [1304, 1326, 1470, 1494], [0, 1, 1, 0]);
  // el papel que cruzó ATERRIZA y la mano lo aparta hacia la izquierda
  const apartaX = ipe(g, [1330, 1452], [46, -30], Easing.out(Easing.cubic));
  const apartaRot = ip(g, [1330, 1452], [-3, -24]);
  const apartaLit = ip(g, [1330, 1452, 1560], [0.9, 0.6, 0.44]);
  const apartaOn = ip(g, [1318, 1332, 1470, 1524], [0, 1, 1, 0.72]);
  // el PRIMER VOLT del video: el display de la pinza se enciende (lo hereda MovTreintaDias)
  const voltOn = ip(g, [1494, 1530, END], [0, 1, 1]);
  const voltRim = ip(g, [1490, 1560, END], [0, 0.5, 0.62]);

  // ══ TEXTOS — UNA idea por acto, siempre sobre <Bed>, titular ≥48 px ═══════════════════════
  const t1 = ip(g, [70, 92, 314, 336], [0, 1, 1, 0]);       // VEINTITRÉS MIL
  const t2 = ip(g, [396, 420, 640, 662], [0, 1, 1, 0]);     // DIEZ KILOVATIOS
  const t3 = ip(g, [716, 740, 936, 958], [0, 1, 1, 0]);     // FINANCIADO A DOCE AÑOS
  const t4 = ip(g, [1024, 1048, 1266, 1290], [0, 1, 1, 0]); // VÁLIDO CUARENTA Y OCHO HORAS
  const t5 = ip(g, [1382, 1406, 1600, 1618], [0, 1, 1, 0]); // DÉJAME MEDIRLO

  // ── montaje por ventanas de g (⛔ ningún acto envuelto: sólo condiciones sobre el reloj continuo)
  const onA12 = g < 776;
  const onA5 = g >= 1296;
  const onA4 = g >= 964 && g < 1318;
  const onA3 = g >= 614 && g < 996;
  const onSlats = g >= 376 && g < 1310;
  const onSpin = g >= 1286 && g < 1354;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca; sólo EVOLUCIONA ────────── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ═══════════ ACTOS 1 y 2 · la mesa de la cocina → el tejado ═══════════════════════ */}
      {onA12 && (
        <Layers cam={camT}>
          {/* FONDO LEJANO · la mesa de la cocina a sangre, sobreexpuesta por el mediodía */}
          <PhotoPlane src="img/cmeurgente/cmeu_presu_macro.jpg" kind="photo" z={-660}
            scale={ip(g, [0, A2, 700], [1.34, 1.26, 1.20])}
            dim={ip(g, [0, 150, A2, 470, 700], [0.56, 0.62, 0.70, 0.80, 0.84])}
            tint={V.paper} />

          {/* PLANO DE AIRE · la trama del papel milimetrado del mediodía comercial */}
          <Plane z={-420}>
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.4).toFixed(2)}px)` }}>
              <AbsoluteFill style={{
                opacity: ip(g, [0, 90, A2, 560, 720], [0, 0.14, 0.2, 0.12, 0]),
                backgroundImage:
                  `repeating-linear-gradient(90deg, ${rgba(V.paper, 0.1)} 0 1px, rgba(0,0,0,0) 1px 118px),` +
                  `repeating-linear-gradient(0deg, ${rgba(V.paper, 0.07)} 0 1px, rgba(0,0,0,0) 1px 118px)`,
              }} />
            </div>
          </Plane>

          {/* EL TEJADO GEOMÉTRICO — sube por debajo a apoyar la foto que creció (panels = 1) */}
          {g >= 326 && (
            <RoofPlane y={roofY} w={1520} h={356} rx={56} lit={roofLit} z={-210} panels={1} />
          )}

          {/* ⭐ EL PAPEL DEL PRESUPUESTO — el objeto protagonista, a sangre sobre la mesa */}
          {g < 486 && (
            <Plane z={0}>
              <Ventana x={hojaX} y={hojaY} w={hojaW} h={hojaH} z={hojaZ} ry={hojaRy} rx={hojaRx}
                radius={10} lit={hojaLit} litColor={V.paper}>
                <Mat photo="img/cmeurgente/cmeu_presu_macro.jpg"
                  clip="broll/cmeurgente/cmeu_presu_folleto.mp4" vid={hojaVid}
                  w={hojaW} h={hojaH} k={hojaK}
                  cx={50 + Math.sin(g / 240) * 2.6} cy={48 + Math.cos(g / 290) * 2.0}
                  lit={hojaLit} litColor={V.paper} sheenAt={L(22)} />
                {/* el membrete de la empresa: lo único que el papel dice de sí mismo */}
                <div style={{
                  position: "absolute", left: 0, right: 0, top: 0, padding: "14px 22px 30px",
                  background: "linear-gradient(180deg, rgba(8,9,6,0.86) 0%, rgba(8,9,6,0) 100%)",
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 4.2,
                  color: rgba(V.white, 0.8 * hojaLit), textTransform: "uppercase",
                  opacity: ip(g, [14, 40, 320, A2], [0, 1, 1, 0.3]),
                }}>Propuesta de energía solar</div>
              </Ventana>
            </Plane>
          )}

          {/* ⭐ LA FOTO DEL FOLLETO → EL TEJADO REAL. La MISMA Ventana. El marco crece, el
              recorte NO se mueve (k 1,06 → 1,12): eso es el MATCH-MOVE de la frontera 1. */}
          <Plane z={0}>
            <Ventana x={tejX} y={tejY} w={tejW} h={tejH} z={tejZ} ry={tejRy} rx={tejRx}
              radius={g < 320 ? 4 : 10} lit={tejLit} litColor={g < A2 ? V.paper : V.sky}>
              <Mat photo="img/cmeurgente/cmeu_tejado_azul.jpg"
                w={tejW} h={tejH} k={tejK}
                cx={50 + Math.sin(g / 210) * 2.2} cy={48 + Math.cos(g / 260) * 1.8}
                lit={tejLit} litColor={g < A2 ? V.paper : V.sky} sheenAt={L(372)} />
              {/* mientras es una foto IMPRESA, lleva la trama del papel couché encima */}
              <AbsoluteFill style={{
                opacity: ip(g, [0, 300, A2, 430], [0.34, 0.3, 0.12, 0]),
                mixBlendMode: "overlay",
                backgroundImage: "repeating-linear-gradient(46deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 4px)",
              }} />
              {/* el brillo del couché corriendo por la foto impresa */}
              <AbsoluteFill style={{
                opacity: ip(g, [0, 260, A2, 420], [0.5, 0.44, 0.18, 0]),
                background: `linear-gradient(${(104 + Math.sin(g / 96) * 12).toFixed(1)}deg, rgba(255,255,255,0) 34%, ${rgba(V.white, 0.2)} 50%, rgba(255,255,255,0) 66%)`,
                mixBlendMode: "screen",
              }} />
              {/* rótulo del folleto: la casa de la foto NO es la casa de Ernesto */}
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "30px 18px 12px",
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
                fontFamily: F_DISPLAY, fontWeight: 700,
                fontSize: Math.round(ip(g, [0, A2, 470], [17, 24, 30])), letterSpacing: 2.4,
                color: rgba(V.white, 0.86), textTransform: "uppercase",
                opacity: ip(g, [150, 200, 430, 490], [0, 0.9, 0.9, 0]),
              }}>No es su casa</div>
            </Ventana>
          </Plane>

          {/* EL FOLLETO DE PERFIL (acto 2): el mismo material, otra escala y otra luz */}
          {g >= 392 && g < 672 && (
            <Plane z={40} style={{ opacity: folOn }}>
              <Ventana x={ip(g, [392, 470, 640], [10, 17.5, 19])} y={ip(g, [392, 640], [30, 33])}
                w={392} h={236} z={70} ry={14} rx={-4} radius={9} lit={0.88} litColor={V.paper}>
                <Mat photo="img/cmeurgente/cmeu_presu_macro.jpg"
                  clip="broll/cmeurgente/cmeu_presu_folleto.mp4" vid={folVid}
                  w={392} h={236} k={1.7}
                  cx={38 + Math.sin(g / 170) * 3} cy={56} lit={0.88} litColor={V.paper}
                  sheenAt={L(430)} />
              </Ventana>
            </Plane>
          )}

          {/* PRIMER PLANO · la esquina desenfocada de la hoja pasando por DELANTE de todo */}
          {g < 470 && (
            <Plane z={280}>
              <div style={{
                position: "absolute",
                left: `${ip(g, [0, 300, 470], [-16, 4, 26]).toFixed(1)}%`,
                top: `${ip(g, [0, 300, 470], [70, 76, 104]).toFixed(1)}%`,
                width: 760, height: 470, marginLeft: -380, marginTop: -235,
                transform: `rotate(${ip(g, [0, 470], [-13, -3]).toFixed(1)}deg)`,
                borderRadius: 16, filter: "blur(11px)",
                opacity: ip(g, [0, 60, 380, 470], [0.5, 0.44, 0.36, 0]),
                background: `linear-gradient(154deg, ${rgba(V.paper, 0.5)} 0%, ${rgba(V.paper, 0.2)} 56%, rgba(0,0,0,0) 100%)`,
              }} />
            </Plane>
          )}

          {/* ÍCONO PNG como objeto de la escena: el billete que el papel pide */}
          {g >= 96 && g < 348 && (
            <Plane z={120}>
              <IconPng src="img/cmeurgente/cmeu_ic_billete.png"
                x={ip(g, [96, 348], [80.5, 83])} y={ip(g, [96, 348], [46, 41])}
                size={ip(g, [96, 150, 348], [78, 132, 146])} z={0}
                opacity={ip(g, [96, 128, 314, 346], [0, 0.95, 0.95, 0])}
                rot={ip(g, [96, 348], [-11, 5])} glow={V.ink0} />
            </Plane>
          )}
          {/* el sol del mediodía del tejado (acto 2) */}
          {g >= 404 && g < 668 && (
            <Plane z={110}>
              <IconPng src="img/cmeurgente/cmeu_ic_sol.png"
                x={ip(g, [404, 668], [85, 87])} y={ip(g, [404, 668], [17, 13])}
                size={ip(g, [404, 470, 668], [70, 124, 134])} z={0}
                opacity={ip(g, [404, 436, 634, 666], [0, 0.9, 0.9, 0])}
                rot={ip(g, [404, 668], [7, -4])} glow={V.ink0} />
            </Plane>
          )}
        </Layers>
      )}

      {/* ═══════════ ACTO 5 · la mesa, la mano y la pinza (nace DETRÁS del acto 4) ════════ */}
      {onA5 && (
        <Layers cam={camT}>
          <PhotoPlane src="img/cmeurgente/cmeu_pinza_papel.jpg" kind="photo" z={-560}
            scale={ip(g, [1296, END], [1.32, 1.22])}
            dim={ip(g, [1296, 1420, END], [0.7, 0.62, 0.56])} tint={V.volt} />

          {/* EL PAPEL QUE CRUZÓ, ya en la mesa, y la mano que lo APARTA */}
          {g < 1560 && (
            <Plane z={40} style={{ opacity: apartaOn }}>
              <Ventana x={apartaX} y={ip(g, [1330, 1452], [52, 60])} w={820} h={500}
                z={70} ry={ip(g, [1330, 1452], [8, 22])} rx={ip(g, [1330, 1452], [6, 14])}
                rot={apartaRot} radius={9} lit={apartaLit} litColor={V.paper}>
                <Mat photo="img/cmeurgente/cmeu_presu_macro.jpg"
                  w={820} h={500} k={1.16}
                  cx={50 + Math.sin(g / 190) * 2} cy={50} lit={apartaLit} litColor={V.paper}
                  sheenAt={L(1342)} />
                <AbsoluteFill style={{
                  background: `linear-gradient(196deg, rgba(0,0,0,0) 30%, ${rgba(V.ink0, ip(g, [1330, 1500], [0.1, 0.6]))} 100%)`,
                }} />
              </Ventana>
            </Plane>
          )}

          {/* ⭐ LA PINZA SOBRE EL PRESUPUESTO — el clip real: la mano baja y el display se enciende */}
          <Plane z={0}>
            <Ventana x={50} y={mesaY} w={mesaW} h={mesaH} z={-30} ry={ip(g, [1300, END], [-3, 1])}
              rx={mesaRx} radius={12} lit={mesaLit} litColor={V.volt}>
              <Mat photo="img/cmeurgente/cmeu_pinza_papel.jpg"
                clip="broll/cmeurgente/cmeu_pinza_papel_mov.mp4" vid={mesaVid}
                w={mesaW} h={mesaH} k={mesaK}
                cx={50 + Math.sin(g / 250) * 2.4} cy={52 + Math.cos(g / 300) * 1.8}
                lit={mesaLit} litColor={V.volt} sheenAt={L(1344)} />
              {/* el primer VOLT del video entra por la izquierda-arriba, como manda el canal */}
              <AbsoluteFill style={{
                background: `radial-gradient(70% 56% at 26% 12%, ${rgba(V.volt, 0.24 * voltRim)} 0%, rgba(0,0,0,0) 64%)`,
              }} />
              {/* el DISPLAY de la pinza, encendido: es lo que hereda el movimiento siguiente */}
              <DisplayVolt x={ip(g, [1494, END], [58, 57])} y={ip(g, [1494, END], [63, 62])}
                w={ip(g, [1494, 1560, END], [150, 186, 194])} on={voltOn} g={g} />
            </Ventana>
          </Plane>

          {/* PRIMER PLANO · el canto de la mesa desenfocado cruzando por delante */}
          {g >= 1330 && (
            <Plane z={300}>
              <div style={{
                position: "absolute",
                left: `${ip(g, [1330, END], [112, 66]).toFixed(1)}%`,
                top: `${ip(g, [1330, END], [92, 84]).toFixed(1)}%`,
                width: 900, height: 520, marginLeft: -450, marginTop: -260,
                transform: `rotate(${ip(g, [1330, END], [9, 2]).toFixed(1)}deg)`,
                borderRadius: 20, filter: "blur(13px)",
                opacity: ip(g, [1330, 1400, END], [0, 0.4, 0.5]),
                background: `linear-gradient(16deg, ${rgba(V.ink1, 0.86)} 0%, ${rgba(V.concrete, 0.24)} 62%, rgba(0,0,0,0) 100%)`,
              }} />
            </Plane>
          )}

          {/* ÍCONO PNG · la pinza como objeto de la escena, no como decoración pegada */}
          {g >= 1462 && (
            <Plane z={130}>
              <IconPng src="img/cmeurgente/cmeu_ic_pinza.png"
                x={ip(g, [1462, END], [83, 85])} y={ip(g, [1462, END], [28, 24])}
                size={ip(g, [1462, 1520, END], [72, 128, 136])} z={0}
                opacity={ip(g, [1462, 1496, END], [0, 0.92, 0.92])}
                rot={ip(g, [1462, END], [-13, 3])} glow={V.ink0} />
            </Plane>
          )}
        </Layers>
      )}

      {/* ═══════════ ACTO 4 · la letra chica (nace DETRÁS del acto 3, sale del túnel) ═════ */}
      {onA4 && (
        <Layers cam={camT}>
          <div style={{
            position: "absolute", inset: 0,
            transform: `translate(${salidaX.toFixed(2)}%, ${salidaY.toFixed(2)}%) scale(${salidaS.toFixed(3)})`,
            transformOrigin: "50% 50%",
          }}>
            {/* EL MACRO DE LA LETRA CHICA, a sangre: el grano del papel es el decorado */}
            <PhotoPlane src="img/cmeurgente/cmeu_letrachica.jpg" kind="photo" z={-120}
              scale={chicaScale} dim={chicaDim} tint={V.paper} />

            {/* EL RELOJ DE LA COCINA, desenfocado detrás (única capa con blur de este tramo) */}
            <Plane z={-460}>
              <div style={{
                position: "absolute", left: "74%", top: "27%", width: 520, height: 520,
                marginLeft: -260, marginTop: -260, filter: "blur(15px)", opacity: relojOn,
              }}>
                <IconPng src="img/cmeurgente/cmeu_ic_reloj.png" x={50} y={0} size={520} z={0}
                  opacity={0.9} rot={0} glow={V.ink0} />
                {/* la manecilla que se come el plazo (esto SÍ es un gráfico) */}
                <div style={{
                  position: "absolute", left: "50%", top: "50%", width: 6, height: 180,
                  marginLeft: -3, transformOrigin: "50% 0%",
                  transform: `rotate(${manecilla.toFixed(1)}deg)`,
                  background: `linear-gradient(180deg, ${rgba(V.amber, 0.95)} 0%, ${rgba(V.amber, 0.2)} 100%)`,
                  borderRadius: 3,
                }} />
              </div>
            </Plane>

            {/* EL FOLLETO EN PRIMER PLANO · el papel que en 20 s va a cruzar el cuadro */}
            {g >= 1012 && (
              <Plane z={250} style={{ opacity: folOn4 }}>
                <Ventana x={ip(g, [1012, A5], [21, 26])} y={ip(g, [1012, A5], [79, 84])}
                  w={540} h={324} z={0} ry={17} rx={-9} rot={-8} radius={10}
                  lit={0.76} litColor={V.paper}>
                  <Mat photo="img/cmeurgente/cmeu_presu_macro.jpg"
                    clip="broll/cmeurgente/cmeu_presu_folleto.mp4" vid={folVid4}
                    w={540} h={324} k={1.5}
                    cx={60 + Math.sin(g / 180) * 3} cy={62} lit={0.76} litColor={V.paper}
                    sheenAt={L(1052)} />
                </Ventana>
              </Plane>
            )}
          </div>
        </Layers>
      )}

      {/* ═══════════ ACTO 3 · la página del presupuesto sube y trae las doce cuotas ══════ */}
      {onA3 && (
        <Layers cam={camT}>
          <div style={{
            position: "absolute", inset: 0,
            transform: zt.out === "none" ? "none" : zt.out,
            transformOrigin: `${slats[11].x}% ${slats[11].y}%`,
            opacity: clamp01(zt.opacity),
          }}>
            {/* el grupo entero SUBE al cuadro: el suelo se cambia por geometría, no por fundido */}
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${pagRise.toFixed(1)}px)` }}>
              {/* la cama opaca que viaja con la página (tapa el acto 4 hasta que el túnel abre) */}
              <div style={{
                position: "absolute", left: "-14%", top: 0, width: "128%", height: "216%",
                background: `linear-gradient(180deg, ${rgba(V.ink0, 0.97)} 0%, ${rgba(V.ink1, 0.96)} 46%, ${rgba(V.ink0, 0.99)} 100%)`,
              }} />
              <Plane z={-60}>
                <Ventana x={50} y={48} w={1780} h={1030} z={0} ry={0} rx={2}
                  radius={8} lit={pagLit} litColor={V.paper}>
                  <Mat photo="img/cmeurgente/cmeu_presu_macro.jpg"
                    w={1780} h={1030} k={pagK}
                    cx={50 + Math.sin(g / 280) * 2.2} cy={44 + Math.cos(g / 330) * 1.8}
                    lit={pagLit} litColor={V.paper} sheenAt={L(752)} />
                  {/* el mediodía comercial rebotando en el couché de la página */}
                  <AbsoluteFill style={{
                    background: `radial-gradient(64% 48% at 78% 8%, ${rgba(V.white, 0.16)} 0%, rgba(0,0,0,0) 62%)`,
                  }} />
                  <AbsoluteFill style={{ background: rgba(V.ink0, 0.42) }} />
                </Ventana>
              </Plane>

              {/* el calendario: los doce años tienen dueño */}
              {g >= 706 && g < 950 && (
                <Plane z={130}>
                  <IconPng src="img/cmeurgente/cmeu_ic_calendario.png"
                    x={ip(g, [706, 950], [17, 19])} y={ip(g, [706, 950], [26, 22])}
                    size={ip(g, [706, 764, 950], [76, 132, 140])} z={0}
                    opacity={ip(g, [706, 742, 918, 948], [0, 0.92, 0.92, 0])}
                    rot={ip(g, [706, 950], [-9, 4])} glow={V.ink0} />
                </Plane>
              )}

              {/* la regla del plazo: doce marcas bajo las casillas (esto SÍ es un gráfico) */}
              <Plane z={30}>
                <div style={{
                  position: "absolute", left: "50%", top: "63.5%", width: 1180, marginLeft: -590,
                  height: 2, opacity: ip(g, [700, 736, 940, 962], [0, 0.5, 0.5, 0.1]),
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.amber, 0.5)}, rgba(0,0,0,0))`,
                }} />
              </Plane>
            </div>
          </div>
        </Layers>
      )}

      {/* ═══════════ LOS DOCE RECTÁNGULOS · paneles → casillas → el recuadro de la letra ══ */}
      {onSlats && (
        <Layers cam={camT}>
          {/* LAS ONCE PRIMERAS · se van por el túnel montadas en el MISMO zoom que el acto 3:
              no se apagan, pasan de largo por el lente igual que la página que las sostenía. */}
          <div style={{
            position: "absolute", inset: 0,
            transform: zt.out === "none" ? "none" : zt.out,
            transformOrigin: `${slats[11].x}% ${slats[11].y}%`,
            opacity: clamp01(zt.opacity),
          }}>
            <Plane z={0}>
              {slats.slice(0, 11).map((s) => (
                <Casilla key={s.i} i={s.i} g={g}
                  x={s.x} y={s.y} w={s.w} h={s.h} z={s.z} rx={s.rx} ry={s.ry}
                  m={s.m} on={s.on} lit={slatLit} />
              ))}
            </Plane>
          </div>

          {/* ⭐ LA CASILLA DOCE · la ÚNICA que NO entra en el túnel: la cámara entra EN ELLA.
              Del otro lado se abre hasta ser el RECUADRO que enmarca la letra chica. */}
          {g < 1302 && (
            <Plane z={0}>
              <Casilla i={11} g={g}
                x={g >= 950 ? cajaX : slats[11].x}
                y={g >= 950 ? cajaY : slats[11].y}
                w={g >= 950 ? cajaW : slats[11].w}
                h={g >= 950 ? cajaH : slats[11].h}
                z={g >= 950 ? lerp(slats[11].z, 90, cajaT) : slats[11].z}
                rx={g >= 950 ? lerp(slats[11].rx, 0, cajaT) : slats[11].rx}
                ry={g >= 950 ? lerp(slats[11].ry, 0, cajaT) : slats[11].ry}
                m={slats[11].m}
                on={slats[11].on * (g >= 950 ? cajaOn : 1)}
                lit={g >= 950 ? cajaOn : slatLit}
                fill={g >= 950 ? lerp(1, 0.14, cajaT) : 1} />
            </Plane>
          )}
        </Layers>
      )}

      {/* ═══════════ HUD · texto y cifras en espacio de pantalla ═════════════════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* LA CIFRA DEL VIDEO: veintitrés mil dólares, en cuadro antes del segundo cuatro */}
        {g >= 56 && g < 404 && (
          <div style={{ opacity: cifraOn }}>
            <div style={{
              position: "absolute", left: `${cifraX}%`, top: `${cifraY}%`,
              width: cifraS * 4.6, height: cifraS * 2.8,
              marginLeft: -cifraS * 2.3, marginTop: -cifraS * 1.4,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.86), rgba(8,9,6,0))",
            }} />
            <Readout value={miles(cifra)} unit="USD" label={g < 330 ? "EL PRESUPUESTO" : undefined}
              at={L(62)} x={cifraX} y={cifraY} size={cifraS} color={V.amber} align="center" />
          </div>
        )}

        {/* ACTO 2 · la potencia que te cotizan */}
        {g >= 398 && g < 672 && (
          <div style={{ opacity: kwOn }}>
            <div style={{
              position: "absolute", left: "76%", top: "62%", width: 560, height: 340,
              marginLeft: -280, marginTop: -170,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.84), rgba(8,9,6,0))",
            }} />
            <Readout value="10" unit="kW" label="LO QUE TE COTIZAN"
              at={L(404)} x={76} y={62} size={126} color={V.amber} align="center" />
          </div>
        )}

        {/* LA FIRMA DEL VIDEO · las 24 horas del día, y cuánto del consumo cae con sol */}
        {g >= 416 && g < 684 && (
          <SunField sun={7 / 24} from={9} use={0.22}
            on={ip(g, [416, 452, 640, 682], [0, 0.55, 0.55, 0])}
            tint={V.volt} night={V.sky} y={88} w={1120} h={26} cycle={230} />
        )}

        {/* ACTO 3 · lo que se firma, cuota por cuota */}
        {g >= 708 && g < 962 && (
          <div style={{ opacity: firmaOn }}>
            <div style={{
              position: "absolute", left: "50%", top: "26%", width: 780, height: 400,
              marginLeft: -390, marginTop: -200,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value={miles(firma)} unit="USD" label="LO QUE FIRMAS"
              at={L(714)} x={50} y={26} size={116} color={V.amber} align="center" />
          </div>
        )}

        {/* ACTO 4 · las cuarenta y ocho horas que se vacían */}
        {g >= 1036 && g < 1302 && (
          <div style={{ opacity: plazoOn }}>
            <div style={{
              position: "absolute", left: "50%", top: "27%", width: 760, height: 380,
              marginLeft: -380, marginTop: -190,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.84), rgba(8,9,6,0))",
            }} />
            <Readout value={String(Math.round(plazoRest))} unit="h" label="TE QUEDAN"
              at={L(1042)} x={50} y={27} size={122} color={V.amber} align="center" />
            <div style={{
              position: "absolute", left: "50%", top: "36%", width: 640, marginLeft: -320,
              height: 8, borderRadius: 5, overflow: "hidden",
              background: rgba(V.ink0, 0.8), boxShadow: `inset 0 0 0 1px ${rgba(V.amber, 0.26)}`,
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: "100%",
                transform: `scaleX(${plazoBar.toFixed(3)})`, transformOrigin: "0% 50%",
                background: `linear-gradient(90deg, ${rgba(V.amber, 0.9)}, ${rgba(V.amber, 0.42)})`,
                boxShadow: `0 0 18px ${rgba(V.amber, 0.42)}`,
              }} />
            </div>
          </div>
        )}

        {/* ── ACTO 1 · VEINTITRÉS MIL ─────────────────────────────────────────────────── */}
        {t1 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "70%", opacity: t1,
            transform: `translateY(${((1 - t1) * 24).toFixed(1)}px)`,
          }}>
            <Bed w={720} pad={24}>
              <Kick color={V.amber}>En la mesa de la cocina</Kick>
              <div style={{ height: 8 }} />
              <Head size={78}>VEINTITRÉS MIL</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Un papel brillante y <Em color={V.amber}>la casa de otro</Em> en la foto</Body>
            </Bed>
          </div>
        )}

        {/* ── ACTO 2 · DIEZ KILOVATIOS ────────────────────────────────────────────────── */}
        {t2 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "9%", opacity: t2,
            transform: `translateY(${((1 - t2) * -24).toFixed(1)}px)`,
          }}>
            <Bed w={700} pad={24}>
              <Kick color={V.amber}>El sistema que le ofrecen</Kick>
              <div style={{ height: 8 }} />
              <Head size={76}>DIEZ KILOVATIOS</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Calculados sobre <Em color={V.amber}>la casa que tiene hoy</Em></Body>
            </Bed>
          </div>
        )}

        {/* ── ACTO 3 · FINANCIADO A DOCE AÑOS ─────────────────────────────────────────── */}
        {t3 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "72%", opacity: t3,
            transform: `translateY(${((1 - t3) * 24).toFixed(1)}px)`,
          }}>
            <Bed w={760} pad={24}>
              <Kick color={V.amber}>Y la letra de abajo</Kick>
              <div style={{ height: 8 }} />
              <Head size={70}>FINANCIADO A <Em color={V.amber}>DOCE AÑOS</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Doce años pagando un número que nadie midió</Body>
            </Bed>
          </div>
        )}

        {/* ── ACTO 4 · VÁLIDO CUARENTA Y OCHO HORAS ───────────────────────────────────── */}
        {t4 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "70%", opacity: t4,
            transform: `translateY(${((1 - t4) * 24).toFixed(1)}px)`,
          }}>
            <Bed w={800} pad={24}>
              <Kick color={V.amber}>En letra chica, abajo del todo</Kick>
              <div style={{ height: 8 }} />
              <Head size={66}>VÁLIDO <Em color={V.amber}>CUARENTA Y OCHO HORAS</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={31}>El apuro no es del precio: es <Em color={V.amber}>del que vende</Em></Body>
            </Bed>
          </div>
        )}

        {/* ── ACTO 5 · DÉJAME MEDIRLO ─────────────────────────────────────────────────── */}
        {t5 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "13%", opacity: t5,
            transform: `translateY(${((1 - t5) * -24).toFixed(1)}px)`,
          }}>
            <Bed w={740} pad={24}>
              <Kick color={V.volt}>Lo que le dije a Ernesto</Kick>
              <div style={{ height: 8 }} />
              <Head size={82}>DÉJAME <Em>MEDIRLO</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Antes de firmar, la casa se mide con <Em>una pinza</Em></Body>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* ═══════ FRONTERA 4 · LA HOJA REAL girando pegada al lente (pasa por DELANTE) ════ */}
      {onSpin && (
        <Layers cam={camT}>
          <Plane z={320}>
            <Ventana x={spinX} y={spinY} w={1180} h={720} z={0} ry={spinRy} rx={6}
              rot={spinRot} radius={12} lit={spinLit} litColor={V.paper}>
              <Mat photo="img/cmeurgente/cmeu_presu_macro.jpg"
                clip="broll/cmeurgente/cmeu_presu_folleto.mp4"
                vid={ip(g, [1288, 1330, 1348], [1, 1, 0])}
                w={1180} h={720} k={1.22} cx={50} cy={50}
                lit={spinLit} litColor={V.paper} sheenAt={L(1300)} />
              {/* el objeto pegado al lente TAPA la luz: llega a cámara en sombra, no iluminado */}
              <AbsoluteFill style={{
                background: `linear-gradient(96deg, ${rgba(V.ink0, 0.5)} 0%, ${rgba(V.ink0, 0.72)} 48%, ${rgba(V.ink0, 0.44)} 100%)`,
              }} />
            </Ventana>
          </Plane>
        </Layers>
      )}

      {/* ═══════ FRONTERA 4 · OCLUSIÓN con la MATERIA del papel (lit de fábrica: 0,30) ═══ */}
      <SeamOcclude at={L(1303)} dur={26} color={V.paper} angle={11} lit={0.3} />

      {/* viñeta: el mediodía plano del vendedor se cierra sobre la mesa de Ernesto */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(126% 108% at ${(52 - camLift * 0.06).toFixed(1)}% 46%, rgba(0,0,0,0) 50%, rgba(6,7,5,${ip(g, [0, A3, END], [0.22, 0.3, 0.42]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
