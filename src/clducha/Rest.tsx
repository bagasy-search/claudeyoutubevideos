// clducha · EL RESTO (107,9-937,4 s): qué es una junta (la ciudad en corte) → el moho con raíces → el cloro blanquea arriba →
// el jabón → las dos pruebas (la gota en la ciudad, el palillo) → materiales → los 7 pasos (la pasta en la pared, el oxígeno que baja
// a las raíces, la PASADA DE PLATA) → los 5 errores → el sellador (la gota otra vez: redondita) → la rutina → la cuenta honesta →
// CTA2 en la guía (pág. 19 y 53, avatar en videollamada) → la noche del 214 → cierre. Mismo mundo, misma cámara (rest_plan.ts).
import React from "react";
import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";
import { PT, pagePt } from "./ducha3d";
import { screenOf } from "./camara";
import { SEG, LEN, REST_START, FULL_END, type Seg } from "./rest_plan";
import { Avatar, World, Shot, Swipe, Stamp, Stopwatch, ChipsAt, VideoCall, Desc, Min1, MIN1_END } from "./Min1";
import { BigNum, COL, DrawX, FONT, LowerThird, Portal, Tag, e, ei, extrude, s, spr } from "./lib";

type V3 = [number, number, number];
const DROP: V3 = [12.58, 0.0, 1.27], TILE: V3 = [12.0, 0.0, 1.1], BOWL: V3 = [0.45, 0.1, 0.4], DRAIN: V3 = [-0.22, 0.06, -0.22];

// toma con el último cuadro congelado si el plano dura más que el clip
const ShotF: React.FC<{ k: string; t: number; a: number; b: number }> = ({ k, t, a, b }) => {
  const len = (LEN[k] ?? 6) - 0.15, end = s(a + len);
  return <Freeze frame={end} active={(f) => f > end}><Shot k={k} t={t} a={a} dur={b - a} z={[1.02, 1.1]} /></Freeze>;
};
const render = (g: Seg, t: number): React.ReactNode => {
  if (g.k === "A") return <Avatar t={t} />;
  if (g.k === "S") return <ShotF k={g.c!} t={t} a={g.a} b={g.b} />;
  const w = <World t={Math.max(g.a, Math.min(t, g.b - 0.001))} />;
  return g.k === "V" ? <AbsoluteFill>{w}<VideoCall t={t} at={g.a} out={g.b - 0.3} x={g.a > 880 ? 1330 : 70} y={g.a > 880 ? 24 : 250} w={g.a > 880 ? 520 : 760} /></AbsoluteFill> : w;
};
// ¿el plano sigue al anterior sin corte? (mundo → mundo con la misma pose)
const cont = (p: Seg, g: Seg) => (p.k === "W" || p.k === "V") && (g.k === "W" || g.k === "V") && (!g.pa || g.pa === p.pb);

// insignia del capítulo (PASO n / ERROR n / RUTINA): queda arriba a la izquierda y cambia con su frase
const CH: [number, number, string, string][] = [
  [235.6, 243.7, "PRUEBA", "1"], [268.0, 298.1, "PRUEBA", "2"],
  [346.5, 363.4, "PASO", "1"], [363.4, 442.8, "PASO", "2"], [442.8, 479.4, "PASO", "3"], [479.4, 512.9, "PASO", "4"], [512.9, 572.9, "PASO", "5"], [572.9, 595.6, "PASO", "6"], [595.6, 649.4, "PASO", "7"],
  [657.2, 689.8, "ERROR", "1"], [689.8, 719.1, "ERROR", "2"], [719.1, 740.9, "ERROR", "3"], [740.9, 753.8, "ERROR", "4"], [753.8, 803.0, "ERROR", "5"], [803.0, 837.4, "RUTINA", "★"],
];
const Badge: React.FC<{ t: number }> = ({ t }) => {
  const c = CH.find(([a, b]) => t >= a && t < b + 0.35);
  if (!c) return null;
  const [a, b, w, n] = c, k = Math.min(1.1, spr(t, a, 0.9)), o = e(t, a, a + 0.15) * (1 - e(t, b, b + 0.3));
  const err = w === "ERROR";
  return (
    <div style={{ position: "absolute", left: 60, top: 46, opacity: o, perspective: 900 }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * 80}deg)`, transformOrigin: "0 50%", display: "flex", alignItems: "center", gap: 16, padding: "10px 26px 10px 12px", borderRadius: 18,
        background: err ? "linear-gradient(180deg,#7a1f1a,#4a100d)" : "linear-gradient(180deg, rgba(20,32,52,.95), rgba(10,16,28,.95))", boxShadow: "0 20px 40px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.18)", fontFamily: FONT }}>
        <div style={{ width: 70, height: 70, borderRadius: 14, background: err ? "#ff4a3d" : "#ffd60a", color: err ? "#fff" : "#3a2400", fontWeight: 900, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
        <div style={{ fontWeight: 900, fontSize: 40, color: COL.ink, letterSpacing: 4, textShadow: extrude(4, "#000") }}>{w}</div>
      </div>
    </div>
  );
};
// lista de materiales: cada cosa entra con su palabra y queda tildada
const Lista: React.FC<{ t: number; at: number; out: number; items: [number, string][] }> = ({ t, at, out, items }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", right: 60, top: 150, width: 520, padding: "22px 28px", borderRadius: 22, opacity: o, background: "linear-gradient(180deg, rgba(18,20,24,.93), rgba(10,11,14,.93))", boxShadow: "0 40px 80px rgba(0,0,0,.6)", fontFamily: FONT }}>
      <div style={{ color: COL.amber, fontWeight: 900, fontSize: 30, letterSpacing: 5, marginBottom: 8 }}>LO QUE VA A NECESITAR</div>
      {items.map(([a, tx], i) => {
        const k = e(t, a, a + 0.25);
        return <div key={i} style={{ opacity: k, transform: `translateX(${(1 - k) * 40}px)`, display: "flex", gap: 14, alignItems: "center", fontWeight: 800, fontSize: 31, color: COL.ink, padding: "5px 0" }}>
          <span style={{ color: "#7dff9e", fontSize: 30 }}>✓</span>{tx}</div>;
      })}
    </div>
  );
};
// tarjeta de comentario (el cierre): la pregunta para comentar
const Comment: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = Math.min(1.1, spr(t, at, 0.8)), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: 520, opacity: o, perspective: 1300 }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${10 - 6 * Math.min(1, k)}deg)`, width: 1100, padding: "30px 40px", borderRadius: 26, background: "rgba(16,17,20,.95)", boxShadow: "0 60px 110px rgba(0,0,0,.7)", fontFamily: FONT, display: "flex", gap: 26, alignItems: "center" }}>
        <div style={{ width: 90, height: 90, borderRadius: 45, background: "#3a6ea5", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>💬</div>
        <div>
          <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>CUÉNTEME EN LOS COMENTARIOS</div>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 46, marginTop: 6 }}>¿Cuánto tiempo llevaban negras sus juntas?<span style={{ opacity: Math.sin(t * 6) > 0 ? 1 : 0 }}>|</span></div>
        </div>
      </div>
    </div>
  );
};

type O = [number, number, (t: number) => React.ReactNode];
const at3 = (t: number, q: V3) => screenOf(t, q);
const tg = (a: number, b: number, text: string, q: V3 | [number, number], dx: number, dy: number, col: string = COL.ink, sub?: string, size = 46): O =>
  [a, b, (t) => { const p = q.length === 3 ? at3(t, q as V3) : { x: q[0], y: q[1] }; return <Tag t={t} at={a} out={b} x={p.x} y={p.y} dx={dx} dy={dy} text={text} sub={sub} col={col} size={size} />; }];
const st = (a: number, b: number, text: string, x = 960, y = 250, col: string = COL.red, size = 84, rot = -6): O => [a, b, (t) => <Stamp t={t} at={a} out={b} text={text} x={x} y={y} col={col} size={size} rot={rot} />];
const bn = (a: number, b: number, text: string, o: { x?: number; y?: number; size?: number; col?: string; edge?: string; sub?: string } = {}): O =>
  [a, b, (t) => <BigNum t={t} at={a} out={b} text={text} x={o.x ?? 960} y={o.y ?? 190} size={o.size ?? 100} col={o.col ?? "#f3f0e6"} edge={o.edge ?? "#3a2a20"} sub={o.sub} />];
const AV = { x: 1440, y: 210 }; // sobre el avatar: a la derecha, sin tapar la cara
const GR = "#7dff9e", ICE = COL.ice, AMB = COL.amber, RED = COL.red, ROOT = "#ff9a5a";

const OV: O[] = [
  bn(108.6, 110.8, "¿QUÉ ES UNA JUNTA?", { size: 110 }),
  // qué es: arena y cemento, una piedrita llena de agujeritos
  tg(116.3, 120.5, "PASTINA · FRAGÜE", PT.street, -300, -160, AMB), bn(118.6, 120.6, "ARENA + CEMENTO", { size: 110 }),
  tg(123.6, 125.8, "DURA COMO UNA PIEDRITA", PT.street, 280, -170),
  tg(131.9, 134.0, "MILES DE AGUJERITOS", PT.street, -300, -170, ICE),
  tg(134.2, 136.2, "EL AZULEJO: LISO", TILE, 260, -170), tg(136.4, 138.8, "EL AGUA RESBALA", TILE, -280, 150, ICE),
  st(139.0, 140.05, "LA JUNTA CHUPA", 960, 260),
  tg(142.0, 143.55, "EL AGUA DE CADA BAÑO", PT.low, 300, -200, ICE),
  [143.9, 154.0, (t) => <ChipsAt t={t} out={153.9} y={t < 148.68 ? 840 : 830} items={[{ at: 144.0, tx: "JABÓN" }, { at: 146.4, tx: "CHAMPÚ" }, { at: 147.7, tx: "GRASA DE LA PIEL" }]} />],
  bn(150.2, 152.0, "SON AÑOS", { size: 110 }), tg(152.0, 153.9, "ENTRA Y SE QUEDA", PT.street, -300, -160),
  tg(155.4, 159.0, "HÚMEDO · OSCURO", PT.root, 300, 120, "#c9a27a"), st(157.2, 159.05, "VIVE EL MOHO", 1380, 220),
  bn(159.4, 161.8, "UN HONGO", { ...AV, size: 110, col: GR, edge: "#123a20" }), st(162.0, 164.45, "ALGO VIVO", 1420, 260, GR, 72),
  // la torta: costra arriba, hilitos que bajan
  bn(166.0, 169.4, "COMO UNA TORTA", { size: 100 }),
  tg(170.2, 176.5, "CAPITA NEGRA", PT.crust, -320, -160, "#f3f0e6"), tg(172.5, 176.5, "HILITOS QUE BAJAN", PT.root, 300, 130, ROOT), st(175.6, 176.6, "RAÍCES", 1400, 220),
  bn(179.7, 181.05, "EL CLORO", { ...AV, col: ICE, edge: "#0a2a40" }),
  bn(184.6, 187.4, "1 MINUTO", { x: 1500, size: 110 }), tg(186.0, 191.4, "BLANCO ARRIBA", PT.crust, -300, -170, ICE), tg(189.4, 191.4, "LAS RAÍCES: INTACTAS", PT.root, 300, 140, ROOT),
  st(194.6, 196.8, "NO BAJA", 1420, 240, ICE, 80),
  tg(198.7, 204.5, "EL MOHO SIGUE VIVO", PT.root, 300, 120, ROOT), bn(201.2, 204.5, "1-2 SEMANAS", { size: 110 }),
  st(205.0, 207.3, "LA MISMA RAYA", 960, 260), bn(207.5, 210.2, "LA PINTÓ DE BLANCO", { ...AV, x: 1400, size: 80 }),
  bn(211.0, 212.65, "CASI SIN CLORO", { ...AV, size: 70, sub: "EN EL HOTEL" }),
  st(214.4, 216.6, "NO LLEGA", 960, 260),
  // el jabón
  tg(217.5, 224.4, "EL JABÓN", PT.low, -280, -200, AMB), tg(220.5, 224.4, "GRIS OPACA", PT.low2, 300, -170, "#cfcfcf"),
  bn(226.0, 229.2, "JABÓN VIEJO + TIERRA", { ...AV, x: 1400, size: 64 }),
  tg(229.6, 232.2, "LE PASA POR ENCIMA", [900, 560], 300, -160, ICE),
  // las dos pruebas
  bn(234.4, 238.9, "1 MINUTO CADA UNA", { size: 90 }),
  [233.6, 243.8, (t) => <ChipsAt t={t} out={243.6} y={840} hl={t >= 240 ? 0 : -1} items={[{ at: 233.8, tx: "LA GOTA" }, { at: 234.6, tx: "EL PALILLO" }]} />],
  tg(244.5, 249.3, "UNA SOLA GOTA", [900, 500], -300, -180),
  tg(250.6, 252.75, "REDONDITA = SELLADA", DROP, -320, -170, GR), tg(253.6, 257.2, "SE LA TOMA = NO SELLADA", DROP, 300, 150, RED),
  st(260.5, 263.25, "ESTÁ TOMANDO AGUA", 1400, 230, RED, 64),
  bn(263.7, 267.9, "ACUÉRDESE", { size: 100, sub: "AL FINAL LA VAMOS A NECESITAR" }),
  tg(271.5, 274.4, "UN RINCÓN DE ABAJO", [960, 700], 300, -200, AMB),
  st(277.5, 278.95, "DURA = TIENE ARREGLO", 1380, 230, GR, 60),
  st(281.8, 284.6, "SUCIA, NO GASTADA", 960, 240, GR, 80), bn(285.0, 288.95, "HOY QUEDA BLANCA", { size: 100 }),
  bn(289.6, 294.35, "¿SE DESARMA?", { ...AV, size: 90, col: "#ff8a7a", edge: "#4a100d" }),
  st(294.8, 298.0, "HAY QUE REHACERLA", 960, 260),
  bn(298.4, 301.4, "MEJOR SABERLO AHORA", { size: 90 }),
  // materiales
  [302.8, 331.0, (t) => <Lista t={t} at={302.9} out={330.8} items={[[303.3, "Bicarbonato"], [306.2, "Agua oxigenada 3 %"], [310.7, "Detergente de platos"], [313.3, "Un bol"], [315.4, "Cepillo de dientes viejo"], [318.1, "(mejor: cepillo de juntas)"], [321.6, "Esponja"], [322.5, "Balde con agua limpia"], [324.5, "Toalla seca"], [325.6, "Guantes"]]} />],
  st(327.6, 330.85, "NADA DE ALAMBRE", 760, 250, RED, 70),
  bn(334.4, 337.1, "¿USÓ CLORO HOY?", { size: 90, col: ICE, edge: "#0a2a40" }), st(337.3, 339.4, "MAÑANA", 1300, 300, AMB, 90),
  tg(339.6, 343.9, "VENTANA ABIERTA", PT.window, 300, 160, ICE), st(342.1, 343.95, "NUNCA MEZCLAR", 960, 860, RED, 70),
  // paso 1
  tg(349.5, 355.3, "AGUA SOLA", [900, 520], 300, -180, ICE),
  tg(355.6, 357.8, "HÚMEDA, NO CHORREANDO", PT.low, -300, -190, ICE), tg(358.0, 359.6, "AGUA BIEN CALIENTE", PT.low2, 300, -170, AMB),
  // paso 2: la pasta
  st(365.6, 367.9, "LO MÁS IMPORTANTE", 960, 250, AMB, 80),
  bn(368.0, 369.55, "½ TAZA", { x: 1500, size: 110, sub: "BICARBONATO" }), bn(370.3, 374.2, "¼ TAZA", { x: 1500, size: 110, sub: "AGUA OXIGENADA" }),
  bn(374.6, 377.8, "60 ML", { ...AV, size: 110, sub: "UN VASITO DE CAFÉ" }), bn(378.0, 381.9, "1 CDTA", { ...AV, size: 110, sub: "DETERGENTE DE PLATOS" }),
  tg(382.2, 385.0, "REVUELVA", BOWL, -300, -170), tg(386.2, 389.2, "COMO PASTA DE DIENTES", BOWL, 300, -170, "#f3f0e6"),
  bn(389.5, 392.25, "¿LÍQUIDA? + BICARBONATO", { size: 70 }), bn(392.8, 396.2, "¿DURA? + AGUA OXIGENADA", { ...AV, x: 1360, size: 56 }),
  bn(396.4, 397.6, "¿POR QUÉ ESTAS TRES?", { ...AV, x: 1360, size: 60 }),
  tg(401.0, 404.5, "BICARBONATO", PT.street, -300, -170, "#f3f0e6", "LA LIJA SUAVE"), tg(406.0, 410.4, "DETERGENTE", PT.street, 300, -170, AMB, "CORTA EL JABÓN Y LA GRASA"),
  bn(411.0, 414.2, "AGUA OXIGENADA", { ...AV, x: 1400, size: 70, col: ICE, edge: "#0a2a40", sub: "LA QUE ENTRA" }),
  tg(415.0, 419.6, "SUELTA OXÍGENO", PT.root, 300, 120, ICE, "ABAJO, EN LAS RAÍCES"),
  tg(420.0, 424.4, "BURBUJITAS FINITAS", [900, 500], 300, -180, ICE),
  st(427.6, 429.75, "ÚSELA TODA", 1420, 230, AMB, 70),
  st(431.6, 434.0, "NUNCA EN BOTELLA CERRADA", 960, 240, RED, 64), bn(434.5, 439.2, "HACE PRESIÓN", { size: 90, col: "#ff8a7a", edge: "#4a100d" }),
  tg(439.5, 442.4, "LO QUE SOBRE: AL DESAGÜE", DRAIN, 300, -170),
  // paso 3
  tg(449.0, 455.6, "A LO LARGO, COMO PINTANDO", [900, 560], 300, -200),
  tg(456.0, 458.8, "NO FROTE TODAVÍA", PT.low2, 300, -180, RED),
  bn(460.8, 464.1, "DE ARRIBA HACIA ABAJO", { ...AV, x: 1400, size: 60 }),
  bn(464.5, 468.5, "1 TANDA ≈ 1 M²", { size: 100 }), bn(468.8, 472.1, "DUCHA: 2-3 TANDAS", { size: 90 }), tg(473.5, 477.0, "ABAJO: CAPA MÁS GRUESA", PT.low, -300, -190, AMB),
  // paso 4: esperar
  [483.7, 488.7, (t) => <Stopwatch t={t} at={483.9} out={488.4} x={900} y={560} />], st(485.9, 488.45, "NI UNO MENOS", 1500, 220, RED, 64),
  tg(489.0, 494.3, "TIEMPO PARA BAJAR", PT.root, 300, 120, ICE),
  st(496.5, 499.6, "SÓLO LIMPIA ARRIBA", 1400, 230, RED, 60),
  tg(499.9, 502.2, "IGUAL QUE EL CLORO", PT.crust, -300, -170, ICE),
  tg(506.0, 510.4, "SE PONE GRIS", PT.low, -300, -190, "#cfcfcf", "ES LO DE ABAJO QUE SALE"),
  // paso 5: frotar · la pasada de plata
  tg(516.5, 522.6, "A LO LARGO, NO EN CÍRCULOS", [900, 560], 300, -200),
  tg(523.5, 526.45, "FIRME, SIN DESESPERARSE", PT.low, -300, -190),
  tg(530.0, 533.4, "LA PASTA HACE EL TRABAJO", PT.low, -300, -190, AMB),
  bn(538.4, 541.8, "UNA SOLA PASADA", { size: 100 }),
  bn(542.5, 545.6, "2 AÑOS", { ...AV, size: 110, sub: "NEGRA" }),
  bn(548.0, 552.9, "EL BLANCO DEL PRIMER DÍA", { size: 80 }),
  tg(553.3, 555.95, "CEMENTO LIMPIO", PT.low, -300, -190, GR),
  tg(560.3, 565.8, "EL GERENTE", [900, 500], -300, -180, "#ffd08a", "LA LIBRETA Y LA LINTERNA"),
  st(565.8, 569.4, "UNA RAYA GRIS = NO SE ENTREGA", 960, 240, RED, 56), bn(569.6, 572.6, "NUNCA MÁS DEVUELTA", { size: 80, col: GR, edge: "#123a20" }),
  // paso 6 y 7
  tg(577.0, 582.5, "ENJUAGUE LA ESPONJA", [900, 520], 300, -180),
  tg(583.5, 587.7, "AGUA TURBIA: CAMBIARLA", PT.low2, 300, -180, AMB),
  st(587.9, 590.6, "AGUA SUCIA = VUELVE EL GRIS", 1380, 230, RED, 50),
  tg(594.3, 597.2, "DE ARRIBA A ABAJO", PT.mid, 300, -160, ICE),
  bn(599.3, 602.2, "LA MITAD DEL ARREGLO", { size: 80 }), tg(602.3, 604.5, "EL MOHO NECESITA AGUA", [900, 600], 300, -200, AMB),
  st(605.0, 608.9, "JUNTA SECA = SIN MOHO", 1400, 230, GR, 52),
  tg(611.4, 614.9, "LA NUBE: BICARBONATO", [900, 500], 300, -180, "#f3f0e6"),
  tg(617.3, 621.7, "AGUA LIMPIA + TOALLA", PT.mid, 300, -160, ICE, "BRILLAN DE NUEVO"),
  bn(629.4, 631.7, "OTRO DÍA", { size: 100 }), bn(631.8, 636.35, "2 PASADAS", { size: 120, sub: "CASI SIEMPRE ALCANZAN" }),
  tg(642.0, 646.0, "DEBAJO DE LA SILICONA", [900, 560], 300, -200, RED),
  tg(646.5, 649.3, "OTRO ARREGLO · EN EL CANAL", PT.corner, 300, -200, AMB), bn(649.6, 654.75, "LOS ERRORES", { size: 120, col: "#ff8a7a", edge: "#4a100d" }),
  // los errores
  tg(661.0, 664.6, "CEPILLO DE ALAMBRE", DROP, -300, -170, RED), tg(664.8, 668.8, "MÁS FUERTE", DROP, 300, -170, AMB),
  st(668.9, 671.2, "NO LA LIMPIÓ", 960, 240), tg(671.4, 672.65, "LE SACÓ LA CAPA DE ARRIBA", PT.street, -300, -170, RED),
  bn(675.4, 677.05, "EL ALAMBRE SE LA COME", { ...AV, x: 1380, size: 56, col: "#ff8a7a", edge: "#4a100d" }),
  tg(677.5, 686.2, "MÁS HUNDIDA · MÁS RUGOSA", PT.crust, -320, -170, RED), bn(682.5, 686.2, "MÁS MUGRE, MÁS RÁPIDO", { size: 80 }),
  bn(686.7, 689.7, "2 AÑOS → REHACERLA", { ...AV, x: 1400, size: 60, col: "#ff8a7a", edge: "#4a100d" }),
  bn(690.0, 693.9, "EL VINAGRE", { size: 100 }), tg(694.1, 695.7, "SARRO SÍ · JUNTA NO", [900, 560], 300, -180, AMB),
  tg(697.1, 702.4, "ÁCIDO vs CEMENTO", PT.crust, -300, -170, AMB), st(700.5, 702.45, "SE COME EL CEMENTO", 960, 240, RED, 70),
  bn(705.0, 707.9, "1 VEZ POR SEMANA × 1 AÑO", { ...AV, x: 1380, size: 50 }),
  st(709.4, 712.25, "NADA DE VINAGRE", 960, 240),
  tg(712.4, 719.6, "VINAGRE + BICARBONATO", BOWL, -300, -170, AMB), bn(715.9, 719.65, "= AGUA CON SAL", { size: 90 }),
  bn(721.4, 723.4, "CLORO + VINAGRE ✗", { ...AV, x: 1400, size: 60, col: "#ff8a7a", edge: "#4a100d" }), bn(723.5, 725.5, "CLORO + AMONÍACO ✗", { ...AV, x: 1400, size: 60, col: "#ff8a7a", edge: "#4a100d" }),
  st(726.0, 730.9, "NUNCA", 960, 260, RED, 110),
  tg(728.8, 730.9, "GAS QUE HACE DAÑO", [900, 600], 300, -180, RED),
  tg(733.6, 737.0, "LUGAR CHICO Y CERRADO", PT.window, 300, 160, ICE),
  bn(737.6, 740.8, "ENJUAGUE · VENTILE · ESPERE", { ...AV, x: 1380, size: 46 }),
  tg(741.8, 747.5, "MUCHO JABÓN", [900, 560], 300, -180, RED),
  tg(747.8, 750.6, "DEJA UNA PELÍCULA", PT.low, -300, -190, AMB), tg(750.8, 753.0, "LA PONE GRIS", PT.low2, 300, -170, "#cfcfcf"),
  bn(753.1, 754.3, "DÍA A DÍA: AGUA SOLA", { size: 80, col: ICE, edge: "#0a2a40" }),
  bn(755.5, 760.25, "DEJARLA ABIERTA", { ...AV, x: 1400, size: 70, col: "#ff8a7a", edge: "#4a100d" }),
  tg(760.6, 764.6, "BLANCA… Y SIN SELLAR", PT.low, -300, -190, AMB),
  tg(765.0, 769.8, "VUELVE A TOMAR JABÓN", DROP, 300, 150, RED), bn(769.9, 771.45, "EL SELLADOR", { size: 110, col: GR, edge: "#123a20" }),
  bn(772.9, 776.0, "ESPERE 2 DÍAS", { ...AV, size: 80 }),
  tg(777.5, 783.9, "CADA LÍNEA", [900, 560], 300, -180),
  tg(784.3, 788.4, "FERRETERÍA · FRASCO CHICO", PT.street, -300, -170),
  bn(789.0, 793.45, "TAPA LOS AGUJERITOS", { ...AV, x: 1400, size: 60 }),
  tg(793.8, 797.0, "NO SE VE", PT.street, -300, -170), tg(797.4, 800.2, "REDONDITA", DROP, 300, -170, GR),
  bn(803.1, 805.2, "1 VEZ POR AÑO", { size: 90, sub: "SE VUELVE A SELLAR" }),
  // la rutina
  bn(805.8, 809.5, "LA RUTINA DEL HOTEL", { ...AV, x: 1400, size: 60 }),
  bn(809.8, 811.95, "10 MIN POR SEMANA", { size: 90 }),
  tg(812.9, 816.5, "SECADOR DE GOMA · 30 s", [900, 560], 300, -180),
  tg(818.3, 819.8, "1 VEZ POR SEMANA", [900, 560], 300, -180, ICE),
  bn(820.5, 824.4, "RINCONES + JUNTAS DE ABAJO", { ...AV, x: 1380, size: 46 }),
  tg(824.7, 826.8, "10 MIN Y ENJUAGUE", PT.corner, 300, -190),
  bn(827.5, 831.8, "EXTRACTOR 20 MIN", { size: 80 }),
  st(832.5, 834.5, "SIN AGUA NO ARRANCA", 960, 240, RED, 70), bn(834.7, 837.25, "LE SACA LA CASA", { y: 860, size: 80, col: GR, edge: "#123a20" }),
  // la cuenta honesta
  bn(837.9, 842.55, "LA CUENTA HONESTA", { ...AV, x: 1400, size: 64 }),
  [845.0, 854.4, (t) => <ChipsAt t={t} out={854.2} y={830} items={[{ at: 845.3, tx: "LLAMAR A ALGUIEN" }, { at: 847.0, tx: "RASPAR TODO" }, { at: 848.8, tx: "PASTINA NUEVA" }, { at: 850.4, tx: "DÍAS SIN DUCHA" }]} />],
  [852.0, 854.4, (t) => (t < 854.2 ? <DrawX t={t} at={852.0} x={110} y={815} w={1700} h={200} /> : null)], st(852.2, 854.3, "CASI NUNCA HACE FALTA", 960, 250, GR, 70),
  bn(855.0, 859.15, "SANA POR DEBAJO", { ...AV, x: 1420, size: 70, col: GR, edge: "#123a20" }),
  [859.3, 865.1, (t) => <ChipsAt t={t} out={864.9} y={830} items={[{ at: 859.4, tx: "½ TAZA BICARBONATO" }, { at: 860.5, tx: "AGUA OXIGENADA" }, { at: 861.8, tx: "UNA TARDE" }]} />],
  st(862.9, 864.95, "SE AHORRA TODO ESO", 960, 250, GR, 70),
  // CTA2: la guía, pág. 19 y pág. 53
  bn(868.6, 873.9, "PÁG. 19", { x: 1560, y: 150, size: 120, col: "#ffd60a", edge: "#5a4500" }),
  [868.6, 874.2, (t) => { const p = at3(t, pagePt(0.6, 0.5)); return <Tag t={t} at={868.8} out={873.9} x={p.x} y={p.y} dx={-420} dy={-210} text="LA RECETA EXACTA" sub="CON LAS CANTIDADES" col="#ffd60a" size={42} />; }],
  [871.0, 874.2, (t) => { const p = at3(t, pagePt(0.28, 0.85)); return <Tag t={t} at={871.2} out={873.9} x={p.x} y={p.y} dx={420} dy={110} text="SI NO SALE" col="#9fd0ff" size={42} />; }],
  bn(874.3, 882.4, "PÁG. 53", { x: 1560, y: 150, size: 120, col: "#ffd60a", edge: "#5a4500" }),
  [876.4, 882.5, (t) => { const p = at3(t, pagePt(0.5, 0.3)); return <Tag t={t} at={876.6} out={879.6} x={p.x} y={p.y} dx={-380} dy={-170} text="LA RUTINA SEMANAL" sub="PASO POR PASO" col="#ffd60a" size={42} />; }],
  [879.4, 882.5, (t) => { const p = at3(t, pagePt(0.5, 0.75)); return <Tag t={t} at={879.6} out={882.4} x={p.x} y={p.y} dx={-380} dy={120} text="PARA EL ARMARIO" col="#9fd0ff" size={42} />; }],
  bn(882.8, 886.4, "94 ARREGLOS", { x: 1540, y: 150, size: 100, col: "#ffd08a", edge: "#4a2e10" }),
  bn(886.6, 889.3, "EL FRASCO MARRÓN", { x: 1480, y: 150, size: 70, col: "#ffd08a", edge: "#4a2e10", sub: "+ COSAS DE LA COCINA" }),
  [889.5, 893.0, (t) => <Desc t={t} at={889.6} out={892.7} />],
  // silicona → el video del moho · la noche del 214 · cierre
  tg(895.5, 903.5, "PUNTITOS EN LA SILICONA", PT.corner, 300, -200, RED), bn(898.5, 903.5, "VIDEO DEL MOHO NEGRO", { size: 70, sub: "EN EL CANAL" }),
  bn(904.0, 906.6, "ESA NOCHE · HAB. 214", { size: 70, col: "#ffd08a", edge: "#4a2e10" }),
  bn(907.6, 911.75, "6:00", { ...AV, x: 1500, size: 130, col: "#ffd08a", edge: "#4a2e10" }),
  bn(912.2, 914.6, "7:00", { x: 1500, size: 130, col: "#f3f0e6" }), tg(916.5, 919.7, "NO DIJO NADA", [900, 560], 300, -180),
  st(922.4, 925.0, "QUE NADIE NOTE NADA", 960, 250, GR, 70),
  bn(925.5, 930.7, "1 METRO · EL DE ABAJO", { ...AV, x: 1400, size: 56 }),
  [930.9, 936.4, (t) => <Comment t={t} at={931.0} out={936.0} />],
  [933.6, 937.4, (t) => <LowerThird t={t} at={933.8} out={937.0} name="CLAUDIO" l2="30 AÑOS · CONSERJE DE HOTEL" l2at={934.2} />],
];

export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const i = Math.max(0, SEG.findIndex((g) => t >= g.a && t < g.b));
  const g = SEG[i], p = i > 0 ? SEG[i - 1] : undefined;
  let base: React.ReactNode = render(g, t);
  if (p && !cont(p, g) && t < g.a + 0.4) {
    const n = i % 5; // variedad: barridos laterales, verticales y un portal
    if (n === 4 && g.k !== "A") base = <AbsoluteFill>{render(p, t)}<Portal x={960} y={540} r={ei(t, g.a, g.a + 0.4)}>{render(g, t)}</Portal></AbsoluteFill>;
    else base = <Swipe t={t} a={g.a} b={g.a + 0.32} dir={n % 2 ? -1 : 1} vert={n === 2} from={render(p, t)} to={render(g, t)} />;
  }
  const L = OV.filter(([a, b]) => t >= a - 0.05 && t < b + 0.5).map(([, , f], j) => <React.Fragment key={j}>{f(t)}</React.Fragment>);
  const fade = e(t, FULL_END - 1.1, FULL_END - 0.2);
  return (
    <AbsoluteFill style={{ background: "#0b0e13" }}>
      {base}{L}<Badge t={t} />
      {fade > 0 && <AbsoluteFill style={{ background: "#000", opacity: fade }} />}
    </AbsoluteFill>
  );
};

// el video entero: el minuto 1 + la guía (Min1) y después el resto, sin corte (el mismo mundo sigue volando)
export const FULL_FRAMES = s(FULL_END);
export const Full: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return t < MIN1_END ? <Min1 /> : <Rest />;
};
void REST_START;
