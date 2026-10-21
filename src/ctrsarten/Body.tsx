// ctrsarten · CUERPO (68,7 s → final). Un solo hilo: avatar (ventanas pagadas) ↔ tramos. Cada tramo = tomas reales / el laboratorio 3D
// unidas por portal, latigazo, subida o zoom a través (nunca corte seco), con piezas NUEVAS por minuto ancladas a la voz con at("frase").
// Una sola cámara para el laboratorio (CAM2) y un "tablero" = el mismo laboratorio desenfocado detrás de las piezas.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EV0, Ev, KitchenWorld, makeCam, PT, win, Key } from "./cocina3d";
import { BigNum, COL, Chips, DrawX, Flash, FONT, Portal, Tag, Thermo, e, ei, extrude, spr } from "./lib";
import { at, Avatar, Line, MIN1_END, Shot, Stamp, Sticker, WIN } from "./Min1";
import { Balance, Book3D, CheckOn, CommentType, DescBox, Dose, EndCard, Equation, ErrorBanner, Habits, Note, Polaroids, RecapRail, SafetyRow, Section, Spent, SubBtn, Versus, WaterGauge } from "./body_fx";

type V3 = [number, number, number];
type Pose = { p: V3; l: V3; fov: number };
type Via = "whip" | "rise" | "zoom" | "portal";
type Beat = { a: number; k?: string; z?: [number, number]; w?: { A: Pose; B?: Pose; keys?: [number, Pose][]; ev: (t: number) => Partial<Ev> }; board?: boolean; c?: (t: number) => React.ReactNode; via?: Via; q?: V3 | [number, number] };
type Seg = { i: number; j?: number; beats: Beat[]; fx: (t: number) => React.ReactNode[]; out?: V3 | [number, number]; pip?: number[] };

export const END = 868.0;
const TR = 0.32;
const gs = (i: number) => WIN[i].me, ge = (i: number) => (i + 1 < WIN.length ? WIN[i + 1].ms : END);
const G = (i: number, f: string, fin = false) => at(f, gs(i) - 0.6, fin);
const Wt = (i: number, f: string, fin = false) => at(f, WIN[i].ms - 0.6, fin);

const PAN_TOP: Pose = { p: [0.62, 1.85, 0.9], l: [0.55, 1, 0.22], fov: 34 };
const PAN_SIDE: Pose = { p: [1.05, 1.38, 1.5], l: [0.55, 0.98, 0.3], fov: 36 };
const PAN_CLOSE: Pose = { p: [0.6, 1.72, 0.74], l: [0.55, 1.0, 0.24], fov: 34 };
const CLOCK: Pose = { p: [0.3, 2.32, 1.05], l: [0.22, 2.4, -1.42], fov: 40 };
const RACK: Pose = { p: [1.37, 1.42, 0.35], l: [1.37, 1.28, -1.42], fov: 38 };
const KNOB: Pose = { p: [0.95, 1.5, 1.3], l: [0.55, 0.95, 0.42], fov: 38 };
const WIDE: Pose = { p: [-0.9, 2.3, 3.1], l: [0.3, 1.25, -0.6], fov: 44 };
const SINK: Pose = { p: [-1.0, 1.9, 0.4], l: [-1.35, 0.95, -0.95], fov: 40 };
const push = (P: Pose, k = 0.1): Pose => ({ p: [P.p[0] + (P.l[0] - P.p[0]) * k, P.p[1] + (P.l[1] - P.p[1]) * k, P.p[2] + (P.l[2] - P.p[2]) * k], l: P.l, fov: P.fov - 2 });

// ---------- piezas chicas de este cuerpo ----------
const StepTitle: React.FC<{ t: number; at: number; out: number; n: number; text: string; col?: string }> = ({ t, at: a, out, n, text, col = COL.amber }) => {
  const k = Math.min(1.1, spr(t, a, 0.9)), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 70, opacity: o, display: "flex", alignItems: "center", gap: 22, transform: `translateX(${(1 - Math.min(1, k)) * -500}px)` }}>
      <div style={{ width: 130, height: 130, borderRadius: 30, background: col, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#1b1205", boxShadow: "0 20px 40px rgba(0,0,0,.6), inset 0 -8px 0 rgba(0,0,0,.2)", transform: `rotate(${(1 - Math.min(1, k)) * -90}deg)` }}>{n}</div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: col, textShadow: "0 2px 10px #000, 0 0 3px #000" }}>PASO {n} DE 7</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 66, color: COL.ink, textShadow: extrude(7, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </div>
  );
};
const Pip: React.FC<{ t: number; a: number; b: number; left?: boolean }> = ({ t, a, b, left }) => {
  const k = Math.min(1.06, spr(t, a - 0.25, 1)), o = e(t, a - 0.25, a - 0.1) * (1 - e(t, b, b + 0.2));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: left ? 60 : 1190, top: 640, width: 660, height: 372, opacity: o, borderRadius: 30, overflow: "hidden", border: "6px solid #f4efe6", boxShadow: "0 40px 80px rgba(0,0,0,.65)", transform: `scale(${0.4 + 0.6 * k}) rotate(${(1 - Math.min(1, k)) * 8}deg)`, transformOrigin: left ? "0 100%" : "100% 100%" }}>
      <Avatar t={Math.max(a, Math.min(t, b - 0.01))} />
    </div>
  );
};

// ---------- el laboratorio: una cámara, eventos por toma ----------
const BCAM = makeCam([{ t: 60, p: [-0.9, 2.3, 3.1], l: [0.3, 1.25, -0.6], fov: 44 }, { t: 870, p: [0.4, 2.0, 2.4], l: [0.4, 1.15, -0.8], fov: 40 }]);
const Board: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ filter: "blur(16px) brightness(.42) saturate(.8)", transform: "scale(1.06)" }}><KitchenWorld t={t} ev={{ ...EV0, day: 0.75 }} cam={BCAM} /></AbsoluteFill>
);
let CAM2: ReturnType<typeof makeCam>;
const World2: React.FC<{ t: number; ev: Partial<Ev> }> = ({ t, ev }) => {
  const v0 = CAM2.camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb2" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><KitchenWorld t={t} ev={{ ...EV0, day: 0.8, ...ev }} cam={CAM2} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const scr = (t: number, q: V3) => CAM2.screenOf(t, q);
const ptOf = (t: number, q: V3 | [number, number] | undefined) => (!q ? { x: 960, y: 540 } : q.length === 3 ? scr(t, q as V3) : { x: q[0], y: q[1] });

// ===================================================================================
// LOS TRAMOS (G4…G51) · cada uno: tomas + piezas, todo desde la voz
// ===================================================================================
const SAFE_OUT = gs(5) - 0.25;
const SAFE = () => [
  { at: G(4, "guantes de goma"), icon: "guante", text: "GUANTES DE GOMA", col: "#ffd34d" },
  { at: Wt(5, "ventana abierta"), icon: "ventana", text: "VENTANA ABIERTA", col: "#8fd6ff" },
  { at: Wt(5, "no lo mezcles"), icon: "nomezcla", text: "NO MEZCLAR", col: "#ff9a8a" },
];
const SUB = () => ({ at: Wt(25, "suscríbete") - 0.3, press: Wt(25, "suscríbete") + 0.3, like: Wt(25, "me gusta"), out: G(25, "y si en tu casa") - 0.3 });
const HAB = () => [{ at: G(33, "la sartén nunca"), text: "NUNCA VACÍA EN FUEGO FUERTE" }, { at: Wt(34, "el aceite"), text: "ACEITE CON LA SARTÉN YA CALIENTE" }, { at: G(34, "y lo que se pegó"), text: "LO QUE SE PEGÓ, EL MISMO DÍA" }];
const CHECK = () => [
  { at: Wt(45, "una o dos pastillas"), x: 0, y: 0, text: "1-2 PASTILLAS" },
  { at: Wt(45, "un imán"), x: 0, y: 0, text: "UN IMÁN" },
  { at: G(45, "una espátula"), x: 0, y: 0, text: "MADERA" },
  { at: G(45, "guantes de goma"), x: 0, y: 0, text: "GUANTES" },
  { at: G(45, "una esponja que"), x: 0, y: 0, text: "ESPONJA QUE NO RAYA" },
  { at: Wt(46, "bicarbonato"), x: 0, y: 0, text: "BICARBONATO" },
  { at: Wt(46, "la botella marrón"), x: 0, y: 0, text: "LA BOTELLA MARRÓN" },
];
// posiciones de cada cosa en la foto cenital (o_flatlay)
const CHECK_XY: [number, number][] = [[700, 190], [830, 300], [440, 470], [1300, 250], [1190, 740], [1540, 480], [1480, 830]];

const SEGS: Seg[] = [];
const S = (g: Seg) => SEGS.push(g);

// G4 · en qué sartenes NO · guantes
{ const i = 4, a0 = gs(i), noSe = G(i, "no se hace"), arr = G(i, "arruina"), av = G(i, "un aviso"), irr = G(i, "irrita");
  S({ i, beats: [
    { a: a0 + 0.1, via: "whip", w: { A: RACK, B: push(RACK, 0.12), ev: (t) => ({ rackHi: win(t, a0, a0 + 0.8) }) } },
    { a: av, k: "p_guantes", via: "portal", q: PT.rack },
  ], fx: (t) => [
    <Tag t={t} at={noSe} x={scr(t, PT.rack).x} y={scr(t, PT.rack).y} dx={-260} dy={-200} text="NO EN TODAS" sub="AHÍ SE ARRUINA UNA BUENA" col={COL.red} out={av - 0.3} size={60} />,
    <Line t={t} at={arr} out={av - 0.3} text="CUIDADO CON CUÁL" y={860} size={64} />,
    <Line t={t} at={av} out={G(i, "guantes de goma") - 0.1} text="UN AVISO ANTES" y={880} size={80} col={COL.amber} />,
    <Tag t={t} at={irr} x={1100} y={420} dx={240} dy={-180} text="IRRITA PIEL Y OJOS" col="#ffd34d" out={ge(i) - 0.3} size={48} />,
    <SafetyRow t={t} items={SAFE()} out={SAFE_OUT} />,
  ] }); }

// G5 · ni cloro, ni vinagre, ni limpiahornos · 30 años de oficio (polaroids)
{ const i = 5, a0 = gs(i), clo = G(i, "ni cloro"), vin = G(i, "ni vinagre"), lim = G(i, "ni el limpiador"), con = G(i, "ya me conoces"), tre = G(i, "treinta años");
  const pol = [{ at: G(i, "fumigador"), k: "p_fumigador", cap: "fumigador", yr: "'95" }, { at: G(i, "albañil"), k: "p_albanil", cap: "albañil", yr: "'04" }, { at: G(i, "mantenimiento de"), k: "p_mantenimiento", cap: "mantenimiento", yr: "'13" }];
  S({ i, beats: [
    { a: a0 + 0.05, k: "o_botellas", via: "zoom" },
    { a: con, board: true, via: "rise" },
  ], fx: (t) => [
    <Stamp t={t} at={clo} text="NI CLORO" x={480} y={300} rot={-8} size={84} out={con - 0.35} />,
    <Stamp t={t} at={vin} text="NI VINAGRE" x={1420} y={330} rot={6} size={84} out={con - 0.35} />,
    <Stamp t={t} at={lim} text="NI LIMPIAHORNOS" x={960} y={820} rot={-4} size={84} out={con - 0.35} />,
    <Line t={t} at={con} out={G(i, "fumigador") - 0.1} text="YA ME CONOCES: SOY CLAUDIO" y={460} size={78} col={COL.amber} />,
    <BigNum t={t} at={tre} text="30 AÑOS" y={880} size={120} col={COL.amber} edge="#5a3a10" sub="DE OFICIO" out={ge(i) + 0.3} />,
    <Polaroids t={t} items={pol} out={ge(i) + 0.3} />,
  ], out: [1430, 400] }); }

// G6 · lo que más se tiraba · la señora de la limpieza
{ const i = 6, a0 = gs(i), mas = G(i, "lo que más"), tod = G(i, "todavía servían"), has = G(i, "hasta que una"), ant = G(i, "de las de antes"), rio = G(i, "se rió");
  S({ i, beats: [
    { a: a0 + 0.05, k: "p_basura", via: "whip" },
    { a: has, k: "p_senora", via: "rise" },
  ], fx: (t) => [
    <Line t={t} at={mas} out={has - 0.3} text="¿LO QUE MÁS SE TIRABA?" y={120} size={74} />,
    <Stamp t={t} at={tod} text="TODAVÍA SERVÍAN" x={1300} y={800} rot={-7} size={90} out={has - 0.3} />,
    <Tag t={t} at={ant} x={1250} y={380} dx={220} dy={-170} text="UNA SEÑORA" sub="DE LAS DE ANTES" col={COL.amber} out={ge(i) - 0.3} size={52} />,
    <Tag t={t} at={rio} x={700} y={520} dx={-220} dy={180} text="…Y SE RIÓ" col={COL.ink} out={ge(i) - 0.3} size={50} />,
  ] }); }

// G7 · 10 minutos de fuego vs una tarde de fibra · el libro
{ const i = 7, a0 = gs(i), rap = G(i, "rápido"), tod = G(i, "todo lo que aprendí"), lib = G(i, "en un libro");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", c: (t) => <Versus t={t} at={a0 - 0.1} out={1e9} l="10 MIN" r="UNA TARDE" /> },
    { a: rap, board: true, via: "whip" },
  ], fx: (t) => [
    <Line t={t} at={rap} out={tod - 0.1} text="RÁPIDO, MIENTRAS TE TENGO AQUÍ" y={150} size={62} col={COL.amber} />,
    <Line t={t} at={tod} out={ge(i) - 0.2} text="30 AÑOS DE CASAS COMO NUEVAS" y={120} size={62} />,
    <Book3D t={t} at={lib} open={1e9} out={ge(i) + 0.4} page="guia_p12.png" y={600} />,
  ], out: [960, 600] }); }

// G8 · cada uno con su medida → la costra marrón de las bandejas = la de hoy → página 13
{ const i = 8, a0 = gs(i), cad = G(i, "cada uno"), cos = G(i, "y esa costra"), mis = G(i, "la misma que"), pag = G(i, "está en la"), tre = G(i, "página trece");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "zoom" },
    { a: mis, via: "portal", q: [960, 560], w: { A: PAN_TOP, B: push(PAN_TOP, 0.15), ev: () => ({}) } },
    { a: pag, board: true, via: "portal", q: PT.pan },
  ], fx: (t) => [
    <Book3D t={t} at={a0 - 0.3} open={cad - 0.1} out={mis - 0.2} page="guia_p12.png" label="CADA UNO CON SU MEDIDA" />,
    <Tag t={t} at={cos} x={960} y={560} dx={-300} dy={-260} text="LA COSTRA MARRÓN" sub="DE LAS BANDEJAS DEL HORNO" col={COL.amber} out={mis - 0.25} size={50} />,
    <Tag t={t} at={mis + 0.2} x={scr(t, PT.pan).x} y={scr(t, PT.pan).y} dx={-260} dy={-200} text="LA MISMA DE HOY" col={COL.amber} out={pag - 0.25} size={56} />,
    <Book3D t={t} at={pag - 0.2} open={pag + 0.2} out={ge(i) + 0.4} page="guia_p13.png" zoomAt={tre} zoom={[0.5, 0.37, 1.7]} mark={[0.06, 0.33, 0.88, 0.09]} markAt={tre + 0.5} label="PÁGINA 13" />,
  ] }); }

// G9 · cuesta menos que una sartén nueva · enlace en la 1ª línea + QR
{ const i = 9, a0 = gs(i), enl = G(i, "el enlace"), esc = G(i, "escanea");
  S({ i, beats: [{ a: a0 + 0.05, board: true, via: "whip" }], fx: (t) => [
    <BigNum t={t} at={a0 + 0.1} text="MENOS QUE" sub="UNA SARTÉN NUEVA DE LAS BUENAS" y={480} size={150} col={COL.ink} out={enl - 0.2} />,
    <DescBox t={t} at={enl} qrAt={esc} out={ge(i) + 0.4} />,
  ], out: [1510, 470] }); }

// G10 · PASO 1: qué es lo negro · azúcar + almidón + grasa = carbón
{ const i = 10, a0 = gs(i), az = G(i, "el azúcar"), al = G(i, "el almidón"), gr = G(i, "y la grasa"), ca = G(i, "casi carbón");
  S({ i, beats: [{ a: a0 + 0.05, via: "zoom", w: { A: PAN_CLOSE, B: PAN_TOP, ev: (t) => ({ day: 0.7, glow: 0 }) } }], fx: (t) => [
    <StepTitle t={t} at={a0 + 0.1} out={ge(i) - 0.3} n={1} text="QUÉ ES LO NEGRO" />,
    <Line t={t} at={G(i, "ahí está todo")} out={az - 0.2} text="AHÍ ESTÁ TODO EL SECRETO" y={860} size={62} col={COL.amber} />,
    <Equation t={t} parts={[{ at: az, text: "AZÚCAR", col: "#ffe1a8" }, { at: al, text: "ALMIDÓN", col: "#f3ead8" }, { at: gr, text: "GRASA", col: "#ffcf7a" }, { at: ca, text: "CARBÓN", col: "#9a9088" }]} out={ge(i) - 0.2} y={790} />,
  ], out: PT.pan }); }

// G11 · el detergente no le hace nada (corte de capas) · la fibra raya
{ const i = 11, a0 = gs(i), fre = G(i, "para grasa fresca"), fib = G(i, "y la fibra"), ray = G(i, "rayar el fondo");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "zoom" },
    { a: fib, k: "o_rayas", via: "whip" },
  ], fx: (t) => [
    <Section t={t} at={a0 - 0.1} out={fib - 0.3} mode="capas" labels={[a0 + 0.3, a0 + 0.6, a0 + 0.9]} y={600} />,
    <Line t={t} at={a0 + 0.2} out={fre - 0.1} text="EL DETERGENTE DE PLATOS: NADA" y={130} size={62} />,
    <Line t={t} at={fre} out={fib - 0.3} text="ES PARA GRASA FRESCA, NO COCINADA" y={130} size={58} col={COL.amber} />,
    <Stamp t={t} at={ray} text="SÓLO RAYA" x={1350} y={300} rot={7} size={100} out={ge(i) - 0.2} />,
  ] }); }

// G12 · tallar con fuerza ✗ · ablandar: algo que disuelva + calor
{ const i = 12, a0 = gs(i), fun = G(i, "lo que funciona"), alg = G(i, "algo que lo"), cal = G(i, "y calor"), pas = G(i, "la pastilla de lavavajillas");
  S({ i, beats: [{ a: a0 + 0.05, via: "whip", w: { A: PAN_SIDE, B: push(PAN_SIDE, 0.15), ev: (t) => ({ water: win(t, alg - 0.3, alg + 0.3), tab: win(t, alg, alg + 0.3), tabDrop: win(t, alg + 0.2, alg + 0.7), flame: win(t, cal, cal + 0.4), foam: win(t, cal + 0.4, ge(i)) * 0.5, steam: win(t, cal + 0.6, ge(i)) }) } }], fx: (t) => [
    <Tag t={t} at={a0 + 0.2} x={scr(t, PT.pan).x} y={scr(t, PT.pan).y} dx={-280} dy={-210} text="TALLAR CON FUERZA" sub="LO QUE HACE TODO EL MUNDO" col={COL.red} out={fun - 0.2} size={54} />,
    <Line t={t} at={fun} out={alg - 0.1} text="ABLANDAR EL PEGAMENTO" y={130} size={74} col="#9df0b4" />,
    <Equation t={t} parts={[{ at: alg, icon: "pastilla", text: "DISUELVE", col: "#d9ecff" }, { at: cal, icon: "llama", text: "CALOR", col: "#ffcf7a" }, { at: pas, text: "SE DESPEGA", col: "#9df0b4" }]} out={ge(i) - 0.2} y={800} />,
  ], out: PT.pan }); }

// G13 · el lavavajillas: una hora con agua caliente · aquí le damos lo mismo
{ const i = 13, a0 = gs(i), cie = G(i, "esa es toda"), hor = G(i, "una hora"), cal = G(i, "bien caliente"), aqu = G(i, "aquí le vamos");
  S({ i, beats: [
    { a: a0 + 0.05, k: "o_lavavajillas", via: "whip" },
    { a: aqu, via: "portal", q: [960, 620], w: { A: PAN_SIDE, B: PAN_CLOSE, ev: (t) => ({ water: 1, tab: 1 - win(t, aqu, ge(i) + 2) * 0.6, tabDrop: 1, flame: 1, foam: 0.6, steam: 0.8, glow: 0.3 }) } },
  ], fx: (t) => [
    <Line t={t} at={cie} out={hor - 0.1} text="ESA ES TODA LA CIENCIA" y={130} size={74} />,
    <Sticker t={t} at={hor} out={aqu - 0.3} x={1420} y={300} icon="reloj" text="UNA HORA" col="#2f5f8f" />,
    <Thermo t={t} at={cal} x={1650} y={560} from={20} to={65} out={aqu - 0.3} />,
    <Tag t={t} at={aqu + 0.3} x={scr(t, PT.pan).x} y={scr(t, PT.pan).y} dx={-280} dy={-200} text="LO MISMO, EN LA HORNALLA" col={COL.amber} out={ge(i) - 0.2} size={52} />,
  ], out: PT.pan }); }

// G14 · PASO 2: qué sartén tienes · el imán
{ const i = 14, a0 = gs(i), nad = G(i, "esto nadie"), ima = G(i, "pon un imán"), peg = G(i, "si se pega");
  S({ i, beats: [{ a: a0 + 0.05, via: "zoom", w: { A: RACK, keys: [[ima + 0.6, push(RACK, 0.18)]], ev: (t) => ({ rackHi: 1, mag: win(t, ima, peg) }) } }], fx: (t) => [
    <StepTitle t={t} at={a0 + 0.1} out={ge(i) - 0.3} n={2} text="QUÉ SARTÉN TIENES" col={COL.ice} />,
    <Line t={t} at={nad} out={ima - 0.1} text="ESTO NADIE LO DICE" y={880} size={66} col={COL.amber} />,
    <Tag t={t} at={ima + 0.2} x={scr(t, PT.magnet).x} y={scr(t, PT.magnet).y} dx={-200} dy={160} text="UN IMÁN AL FONDO" col={COL.ice} out={peg - 0.1} size={48} />,
    <Tag t={t} at={peg} x={scr(t, [0.98, 1.2, -1.37]).x} y={scr(t, [0.98, 1.2, -1.37]).y} dx={-220} dy={170} text="SE PEGA" sub="PLATEADA Y PESADA" col="#9df0b4" out={ge(i) + 0.4} size={56} />,
  ], out: [0.98, 1.2, -1.37] }); }

// G15 · no se pega = aluminio · se mancha oscuro · nada de hervir
{ const i = 15, a0 = gs(i), nos = G(i, "no se pega"), alu = G(i, "casi seguro"), man = G(i, "manchar oscuro"), her = G(i, "nada de hervir");
  S({ i, beats: [{ a: a0 + 0.05, k: "o_aluminio", via: "whip" }], fx: (t) => [
    <Tag t={t} at={nos} x={1350} y={760} dx={200} dy={-150} text="EL IMÁN NO SE PEGA" col={COL.ice} out={alu - 0.1} size={48} />,
    <BigNum t={t} at={alu} text="ALUMINIO" y={180} size={140} col={COL.ice2} edge="#26405a" out={her - 0.2} />,
    <Tag t={t} at={man} x={900} y={520} dx={-240} dy={200} text="SE MANCHA OSCURO" col={COL.amber} out={ge(i) - 0.2} size={52} />,
    <Stamp t={t} at={her} text="NADA DE HERVIR" x={960} y={220} rot={-6} size={100} out={ge(i) + 0.3} />,
  ] }); }

// G16 · antiadherente: agua tibia + una gota · sin pastilla, sin raspar
{ const i = 16, a0 = gs(i), tib = G(i, "agua tibia"), sin = G(i, "sin pastilla"), ray = G(i, "si la rayas");
  S({ i, beats: [{ a: a0 + 0.05, k: "p_teflon", via: "rise" }], fx: (t) => [
    <BigNum t={t} at={a0 + 0.15} text="ANTIADHERENTE" y={160} size={110} col={COL.ink} edge="#3a3a3a" out={tib - 0.15} />,
    <Chips t={t} at={tib} items={["AGUA TIBIA", "UNA GOTA DE DETERGENTE"]} out={sin - 0.1} y={820} />,
    <Stamp t={t} at={sin} text="SIN PASTILLA" x={560} y={300} rot={-8} size={90} out={ge(i) - 0.2} />,
    <Line t={t} at={ray} out={ge(i) + 0.2} text="SI LA RAYAS, YA NO ES ANTIADHERENTE" y={860} size={54} col={COL.amber} />,
  ] }); }

// G17 · hierro fundido: se oxida · PASO 3: agua y pastilla
{ const i = 17, a0 = gs(i), oxi = G(i, "se te oxida"), otr = G(i, "otro día"), n3 = G(i, "número tres");
  S({ i, beats: [
    { a: a0 + 0.05, k: "o_hierro", via: "zoom" },
    { a: n3, via: "portal", q: [960, 560], w: { A: PAN_SIDE, B: push(PAN_SIDE, 0.12), ev: () => ({}) } },
  ], fx: (t) => [
    <Tag t={t} at={a0 + 0.3} x={900} y={560} dx={-260} dy={-220} text="LE SACA LA CAPA DE ACEITE" col={COL.amber} out={oxi - 0.1} size={46} />,
    <Stamp t={t} at={oxi} text="SE OXIDA" x={1350} y={320} rot={6} size={110} out={n3 - 0.3} />,
    <Line t={t} at={otr} out={n3 - 0.3} text="TIENE SU PROPIO TRUCO (OTRO DÍA)" y={880} size={52} />,
    <StepTitle t={t} at={n3 + 0.1} out={ge(i) + 0.3} n={3} text="EL AGUA Y LA PASTILLA" col={COL.ice} />,
  ], out: PT.pan }); }

// G18 · 1-2 dedos (si la llenas, trabaja la mitad) · UNA pastilla en el centro
{ const i = 18, a0 = gs(i), arr = G(i, "hasta arriba"), mit = G(i, "trabaja la mitad"), pon = G(i, "y pones una"), cen = G(i, "en el centro"), enc = G(i, "encima de lo");
  S({ i, beats: [
    { a: a0 + 0.05, k: "p_agua", via: "whip" },
    { a: pon, via: "rise", w: { A: PAN_CLOSE, B: push(PAN_CLOSE, 0.15), ev: (t) => ({ water: 1, tab: win(t, pon, pon + 0.3), tabDrop: win(t, cen - 0.1, cen + 0.4) }) } },
  ], fx: (t) => [
    <WaterGauge t={t} at={a0 + 0.1} bad={arr} out={pon - 0.3} x={1560} />,
    <Tag t={t} at={mit} x={700} y={480} dx={-230} dy={-190} text="TRABAJA LA MITAD" col={COL.red} out={pon - 0.3} size={50} />,
    <Line t={t} at={pon} out={ge(i) + 0.3} text="UNA SOLA PASTILLA" y={130} size={76} col={COL.ice} />,
    <Tag t={t} at={enc} x={scr(t, PT.pan).x} y={scr(t, PT.pan).y} dx={260} dy={-200} text="ENCIMA DE LO MÁS QUEMADO" col={COL.amber} out={ge(i) + 0.3} size={46} />,
  ], out: PT.pan }); }

// G19 · el plástico duro se saca · dosis
{ const i = 19, a0 = gs(i), sac = G(i, "se saca"), oll = G(i, "para una olla"), dia = G(i, "para la sartén de");
  S({ i, beats: [
    { a: a0 + 0.05, k: "p_plastico", via: "zoom" },
    { a: oll, board: true, via: "whip" },
  ], fx: (t) => [
    <Stamp t={t} at={sac} text="EL PLÁSTICO SE SACA" x={960} y={220} rot={-5} size={90} out={oll - 0.3} />,
    <Dose t={t} rows={[{ at: oll + 0.3, n: 2, text: "OLLA GRANDE O MUY QUEMADO" }, { at: dia, n: 1, text: "LA SARTÉN DE TODOS LOS DÍAS" }]} out={ge(i) + 0.3} />,
  ], out: [960, 700] }); }

// G20 · media botella + vinagre "por si acaso" → NO · PASO 4: los diez minutos
{ const i = 20, a0 = gs(i), no = G(i, "no"), sol = G(i, "la pastilla sola"), mez = G(i, "mezclar es"), n4 = G(i, "número cuatro");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "zoom" },
    { a: n4, via: "portal", q: [960, 540], w: { A: CLOCK, B: push(CLOCK, 0.1), ev: (t) => ({ water: 1, tab: 1, tabDrop: 1, glow: win(t, n4, n4 + 0.4) * 0.7 }) } },
  ], fx: (t) => [
    <Equation t={t} parts={[{ at: a0 - 0.2, text: "DETERGENTE", col: "#d9ecff" }, { at: G(i, "un chorro"), text: "VINAGRE", col: "#f6e7b0" }, { at: no, icon: "nomezcla", text: "NO", col: COL.red }]} out={n4 - 0.3} y={430} />,
    <Line t={t} at={sol} out={n4 - 0.3} text="LA PASTILLA SOLA, CON EL AGUA" y={250} size={66} col="#9df0b4" />,
    <Line t={t} at={mez} out={n4 - 0.3} text="MEZCLAR = INTOXICARSE" y={700} size={74} col={COL.red} />,
    <StepTitle t={t} at={n4 + 0.1} out={ge(i) + 0.3} n={4} text="LOS DIEZ MINUTOS" />,
  ], out: PT.clock }); }

// G21 · no un hervor fuerte · la pastilla se deshace, agua turbia, espuma blanca
{ const i = 21, a0 = gs(i), fue = G(i, "un hervor fuerte"), vas = G(i, "vas a ver"), des = G(i, "se deshace"), tur = G(i, "se pone turbia"), esp = G(i, "una espuma blanca");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: PAN_SIDE, B: push(PAN_SIDE, 0.12), ev: (t) => ({ water: 1, tab: 0.8, tabDrop: 1, flame: 1, big: 0.9 * win(t, fue - 0.2, fue + 0.3) * (1 - win(t, vas - 1.2, vas - 0.5)), foam: 0.3 + 0.5 * win(t, fue, fue + 1), steam: 1 }) } },
    { a: vas, k: "o_hervor", via: "portal", q: PT.pan },
  ], fx: (t) => [
    <Stamp t={t} at={fue + 0.2} text="NO UN HERVOR FUERTE" x={960} y={210} rot={-5} size={92} out={vas - 0.3} />,
    <Tag t={t} at={des} x={980} y={560} dx={-260} dy={-200} text="SE DESHACE" col={COL.ice2} out={ge(i) - 0.2} size={48} />,
    <Tag t={t} at={tur} x={760} y={700} dx={-200} dy={170} text="TURBIA" col={COL.ink} out={ge(i) - 0.2} size={48} />,
    <Tag t={t} at={esp} x={1320} y={520} dx={220} dy={-180} text="ESPUMA POR LOS BORDES" col="#ffffff" out={ge(i) + 0.3} size={48} />,
  ] }); }

// G22 · rajitas como barro al sol · el reloj en diez minutos
{ const i = 22, a0 = gs(i), raj = G(i, "rajitas"), bar = G(i, "como barro"), flo = G(i, "que flotan"), rel = G(i, "pones el reloj"), nov = G(i, "no te vas");
  S({ i, beats: [
    { a: a0 + 0.05, k: "o_rajitas", via: "zoom" },
    { a: rel, via: "portal", q: [960, 540], w: { A: CLOCK, B: push(CLOCK, 0.12), ev: (t) => ({ water: 1, flame: 1, foam: 0.7, steam: 1, rem: 600 - Math.max(0, t - rel) * 6, hot: win(t, rel, rel + 0.5), glow: 0.4 }) } },
  ], fx: (t) => [
    <Tag t={t} at={raj} x={900} y={540} dx={-280} dy={-210} text="RAJITAS" col={COL.amber} out={rel - 0.3} size={60} />,
    <Tag t={t} at={bar} x={1180} y={600} dx={240} dy={-200} text="COMO BARRO AL SOL" col={COL.ink} out={rel - 0.3} size={48} />,
    <Line t={t} at={flo} out={rel - 0.3} text="SE LEVANTAN Y FLOTAN" y={880} size={60} col="#9df0b4" />,
    <Line t={t} at={nov} out={ge(i) + 0.3} text="Y NO TE VAS DE LA COCINA" y={880} size={60} col={COL.amber} />,
  ] }); }

// G23 · agregar un poquito de la caliente · ¿por qué bajito? el agua se mete por debajo (corte)
{ const i = 23, a0 = gs(i), por = G(i, "y por qué"), lo = G(i, "porque lo que"), con = G(i, "contra lo negro"), met = G(i, "metiéndose");
  S({ i, beats: [
    { a: a0 + 0.05, k: "p_agregar", via: "whip" },
    { a: por, board: true, via: "zoom" },
  ], fx: (t) => [
    <Tag t={t} at={a0 + 0.3} x={1000} y={420} dx={240} dy={-170} text="UN POQUITO MÁS" sub="DE LA CALIENTE" col={COL.ice} out={por - 0.3} size={52} />,
    <Line t={t} at={por} out={ge(i) + 0.3} text="¿POR QUÉ BAJITO?" y={120} size={80} col={COL.amber} />,
    <Section t={t} at={lo} out={ge(i) + 0.3} mode="agua" labels={[con, con + 0.3, con + 0.6]} y={620} />,
    <Tag t={t} at={met} x={720} y={560} dx={-140} dy={260} text="POR DEBAJO DE LA COSTRA" col={COL.ice} out={ge(i) + 0.3} size={46} />,
  ] }); }

// G24 · la espuma se gasta en la hornalla · bajito, paciencia, reloj · ya te ahorró una sartén
{ const i = 24, a0 = gs(i), baj = G(i, "bajito paciencia"), lle = G(i, "si llegaste");
  S({ i, beats: [
    { a: a0 + 0.05, k: "o_derrame", via: "zoom" },
    { a: baj, via: "portal", q: [960, 500], w: { A: CLOCK, B: push(CLOCK, 0.15), ev: (t) => ({ water: 1, flame: 1, foam: 0.7, steam: 0.8, rem: 420 - Math.max(0, t - baj) * 5, hot: 1, glow: 0.4 }) } },
    { a: lle, board: true, via: "whip" },
  ], fx: (t) => [
    <Tag t={t} at={a0 + 0.2} x={960} y={640} dx={-260} dy={-230} text="SE GASTA EN LA HORNALLA" sub="NO EN TU SARTÉN" col={COL.red} out={baj - 0.3} size={50} />,
    <Chips t={t} at={baj} items={["BAJITO", "PACIENCIA", "EL RELOJ"]} out={lle - 0.3} y={820} />,
    <BigNum t={t} at={lle} text="1 SARTÉN" sub="QUE YA NO TIENES QUE COMPRAR" y={460} size={180} col="#9df0b4" edge="#1f5a36" out={ge(i) + 0.3} />,
    <SubBtn t={t} {...SUB()} />,
  ], out: [1400, 800] }); }

// G25 · (suscríbete sigue) · fuente de vidrio con esquinas marrones · platillos de los quemadores
{ const i = 25, a0 = gs(i), si = G(i, "y si en tu casa"), esq = G(i, "esquinas marrones"), pla = G(i, "o los platillos"), ya = G(i, "ya no son");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "zoom" },
    { a: si, k: "o_fuente", via: "portal", q: [960, 540] },
    { a: pla, k: "o_platillos", via: "whip" },
  ], fx: (t) => [
    <SubBtn t={t} {...SUB()} />,
    <Line t={t} at={a0 + 0.1} out={si - 0.3} text="ESO AYUDA MUCHÍSIMO" y={300} size={70} />,
    <Tag t={t} at={esq} x={1300} y={420} dx={220} dy={-170} text="ESQUINAS MARRONES" col={COL.amber} out={pla - 0.3} size={52} />,
    <Tag t={t} at={ya} x={900} y={520} dx={-240} dy={-200} text="YA NO SON PLATEADOS" col={COL.ink} out={ge(i) + 0.2} size={52} />,
  ] }); }

// G26 · el enlace otra vez · PASO 5: cómo se levanta · apagas y 5 min para entibiar
{ const i = 26, a0 = gs(i), aho = G(i, "ahora viene"), n5 = G(i, "número cinco"), apa = G(i, "apagas el fuego"), cin = G(i, "cinco minutos");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "whip" },
    { a: aho, via: "portal", q: [960, 540], w: { A: PAN_CLOSE, keys: [[apa - 0.2, PAN_CLOSE], [apa + 0.7, KNOB], [cin + 0.6, KNOB]], ev: (t) => ({ water: 1, foam: 0.6 * (1 - win(t, apa, cin + 1)), steam: 1 - win(t, apa, ge(i)) * 0.6, flame: 1 - win(t, apa, apa + 0.3), rem: 300 - Math.max(0, t - cin) * 4, hot: win(t, cin, cin + 0.4), glow: win(t, cin, cin + 0.3) * 0.5 }) } },
  ], fx: (t) => [
    <Book3D t={t} at={a0 - 0.3} open={a0 - 0.3} out={a0 + 0.9} page="guia_p34.png" x={1460} sc={0.75} />,
    <DescBox t={t} at={a0 + 0.2} out={aho - 0.3} />,
    <Line t={t} at={aho} out={n5 - 0.1} text="LA PARTE QUE MÁS SE DISFRUTA" y={860} size={62} col="#9df0b4" />,
    <StepTitle t={t} at={n5} out={ge(i) + 0.3} n={5} text="CÓMO SE LEVANTA" col="#9df0b4" />,
    <Tag t={t} at={apa} x={scr(t, PT.knob).x} y={scr(t, PT.knob).y} dx={200} dy={-140} text="APAGAS" col={COL.red} out={cin - 0.1} size={54} />,
    <Tag t={t} at={cin} x={scr(t, PT.pan).x} y={scr(t, PT.pan).y} dx={-260} dy={-200} text="5 MIN PARA ENTIBIAR" col={COL.amber} out={ge(i) + 0.3} size={50} />,
  ], out: PT.pan }); }

// G27 · empujas desde el borde con madera · sale en láminas, como una calcomanía
{ const i = 27, a0 = gs(i), lo = G(i, "lo que estaba"), lam = G(i, "en láminas"), cal = G(i, "una calcomanía");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: PAN_CLOSE, B: push(PAN_CLOSE, 0.2), ev: (t) => ({ water: 0.6, steam: 0.3, spat: win(t, a0, lo + 0.5), lift: win(t, a0 + 0.5, lo + 1), crust: 1 - win(t, a0 + 0.8, lo + 1) * 0.7 }) } },
    { a: lo, k: "o_lamina", via: "portal", q: PT.pan },
  ], fx: (t) => [
    <Tag t={t} at={a0 + 0.2} x={scr(t, PT.panRim).x} y={scr(t, PT.panRim).y} dx={240} dy={-120} text="DEL BORDE AL CENTRO" sub="DESPACITO, SIN FUERZA" col="#9df0b4" out={lo - 0.3} size={50} />,
    <Line t={t} at={lam} out={ge(i) + 0.3} text="SALE EN LÁMINAS" y={130} size={86} col="#9df0b4" />,
    <Tag t={t} at={cal} x={1000} y={560} dx={260} dy={180} text="COMO UNA CALCOMANÍA VIEJA" col={COL.ink} out={ge(i) + 0.3} size={46} />,
  ] }); }

// G28 · nunca cuchillo ni metal · la isla negra del medio
{ const i = 28, a0 = gs(i), pag = G(i, "lo vas a pagar"), isl = G(i, "si queda una");
  S({ i, beats: [
    { a: a0 + 0.05, k: "o_cuchillo", via: "zoom" },
    { a: isl, via: "portal", q: [960, 540], w: { A: PAN_TOP, B: push(PAN_TOP, 0.2), ev: () => ({ crust: 0, island: 1, shine: 0.35, water: 0.15 }) } },
  ], fx: (t) => [
    <Stamp t={t} at={a0 + 0.15} text="NUNCA METAL" x={1340} y={260} rot={7} size={100} out={isl - 0.3} />,
    <Line t={t} at={pag} out={isl - 0.3} text="LO PAGAS LA PRÓXIMA VEZ QUE COCINES" y={880} size={50} />,
    <Tag t={t} at={isl + 0.3} x={scr(t, [0.57, 1.01, 0.24]).x} y={scr(t, [0.57, 1.01, 0.24]).y} dx={-260} dy={-200} text="UNA ISLA NEGRA" sub="LA PARTE MÁS QUEMADA" col={COL.amber} out={ge(i) + 0.3} size={56} />,
  ], out: PT.pan }); }

// G29 · la fuerza la hace el calor · PASO 6: el fondo de afuera
{ const i = 29, a0 = gs(i), n6 = G(i, "número seis"), don = G(i, "donde le pega"), noe = G(i, "no es comida");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "whip" },
    { a: n6, k: "o_fondo_afuera", via: "portal", q: [960, 500] },
  ], fx: (t) => [
    <BigNum t={t} at={a0 + 0.1} text="EL CALOR" sub="NO TU BRAZO" y={460} size={200} col={COL.amber} edge="#5a3a10" out={n6 - 0.3} />,
    <StepTitle t={t} at={n6 + 0.1} out={ge(i) + 0.3} n={6} text="EL FONDO DE AFUERA" />,
    <Tag t={t} at={don} x={960} y={600} dx={260} dy={200} text="DONDE LE PEGA LA LLAMA" col={COL.amber} out={ge(i) + 0.3} size={48} />,
    <Stamp t={t} at={noe} text="NO ES COMIDA QUEMADA" x={960} y={330} rot={-5} size={84} out={ge(i) + 0.2} />,
  ] }); }

// G30 · capa sobre capa, como un barniz · el fregadero con agua bien caliente
{ const i = 30, a0 = gs(i), bar = G(i, "como un barniz"), toc = G(i, "toca el fuego"), par = G(i, "para esa haces");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "zoom" },
    { a: par, k: "p_fregadero", via: "rise" },
  ], fx: (t) => [
    <Section t={t} at={a0 - 0.1} out={par - 0.3} mode="barniz" labels={[a0 + 0.2, bar, toc]} y={600} />,
    <Line t={t} at={toc - 0.2} out={par - 0.3} text="NO SALE HIRVIENDO" y={130} size={74} col={COL.red} />,
    <Tag t={t} at={G(i, "agua bien caliente")} x={900} y={640} dx={-240} dy={-220} text="AGUA BIEN CALIENTE" col={COL.ice} out={ge(i) + 0.3} size={52} />,
  ] }); }

// G31 · una hora · la esponja en circulitos · la muy vieja → página 13 del libro
{ const i = 31, a0 = gs(i), cir = G(i, "en circulitos"), vie = G(i, "la que es muy"), tre = G(i, "página trece"), pas = G(i, "una pasta gruesa");
  S({ i, beats: [
    { a: a0 + 0.05, k: "p_esponja", via: "whip" },
    { a: vie, board: true, via: "zoom" },
  ], fx: (t) => [
    <Sticker t={t} at={a0 + 0.05} out={cir - 0.2} x={1450} y={260} icon="reloj" text="UNA HORA" col="#2f5f8f" />,
    <Tag t={t} at={cir} x={960} y={620} dx={260} dy={-200} text="EN CIRCULITOS" sub="ESPONJA QUE NO RAYA" col="#9df0b4" out={vie - 0.3} size={52} />,
    <Book3D t={t} at={vie} open={vie + 0.6} out={ge(i) + 0.4} page="guia_p13.png" zoomAt={tre + 0.1} zoom={[0.5, 0.48, 1.6]} mark={[0.06, 0.45, 0.88, 0.1]} markAt={pas} label="PÁGINA 13" />,
  ], out: [960, 560] }); }

// G32 · dos o tres vueltas, pero sale · PASO 7: el enjuague
{ const i = 32, a0 = gs(i), n7 = G(i, "número siete"), lav = G(i, "lávala con");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: PAN_TOP, B: push(PAN_TOP, 0.12), ev: (t) => ({ crust: 0.35 - win(t, a0, n7) * 0.3, shine: 0.6, water: 0.1 }) } },
    { a: n7, k: "p_enjuague", via: "portal", q: PT.pan },
  ], fx: (t) => [
    <BigNum t={t} at={a0 + 0.2} text="2 O 3 VUELTAS" sub="PERO SALE" y={200} size={130} col={COL.ink} out={n7 - 0.3} />,
    <StepTitle t={t} at={n7 + 0.1} out={ge(i) + 0.3} n={7} text="ENJUAGUE Y QUE NO VUELVA" col="#9df0b4" />,
    <Chips t={t} at={lav} items={["AGUA CALIENTE", "TU DETERGENTE DE SIEMPRE"]} out={ge(i) + 0.3} y={840} />,
  ] }); }

// G33 · eso no se come · secar al fuego · 3 costumbres: nunca vacía en fuego fuerte
{ const i = 33, a0 = gs(i), min = G(i, "un minuto"), tre = G(i, "tres costumbres"), nun = G(i, "la sartén nunca");
  S({ i, beats: [
    { a: a0 + 0.05, k: "p_secar", via: "whip" },
    { a: tre - 0.6, via: "portal", q: [960, 560], w: { A: PAN_SIDE, B: push(PAN_SIDE, 0.12), ev: (t) => ({ crust: 0, shine: 1, flame: win(t, nun, nun + 0.3), big: win(t, nun + 0.3, nun + 0.8) * 0.8, smoke: win(t, nun + 0.8, ge(i)) * 0.4 }) } },
  ], fx: (t) => [
    <Stamp t={t} at={a0 + 0.05} text="ESO NO SE COME" x={1350} y={260} rot={6} size={90} out={min - 0.2} />,
    <Tag t={t} at={min} x={960} y={600} dx={-260} dy={-200} text="UN MINUTO AL FUEGO" sub="PARA QUE SE SEQUE DEL TODO" col={COL.amber} out={tre - 0.8} size={50} />,
    <Line t={t} at={tre} out={ge(i) + 0.3} text="3 COSTUMBRES" y={120} size={86} col="#9df0b4" />,
    <Stamp t={t} at={nun + 0.4} text="NUNCA VACÍA" x={960} y={860} rot={-5} size={96} out={ge(i) + 0.3} />,
  ], out: PT.pan }); }

// G34 · lo que se pegó, el mismo día (costumbres) · 1 minuto hoy = 1 hora · los 4 errores
{ const i = 34, a0 = gs(i), mie = G(i, "mientras la sartén"), min = G(i, "un minuto ese"), err = G(i, "y ahora los cuatro");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "zoom" },
    { a: mie, k: "o_tibia", via: "portal", q: [1440, 510] },
    { a: err, board: true, via: "whip" },
  ], fx: (t) => [
    <Habits t={t} items={[{ at: a0 + 0.1, text: HAB()[0].text }, { at: a0 + 0.35, text: HAB()[1].text }, { at: HAB()[2].at, text: HAB()[2].text }]} out={mie - 0.3} />,
    <BigNum t={t} at={min} text="1 MIN HOY" sub="= 1 HORA LA SEMANA QUE VIENE" y={200} size={140} col="#9df0b4" edge="#1f5a36" out={err - 0.3} />,
    <BigNum t={t} at={err + 0.1} text="4 ERRORES" sub="LOS QUE ARRUINAN UNA SARTÉN BUENA" y={480} size={200} col={COL.red} edge="#4a1410" out={ge(i) + 0.3} />,
  ] }); }

// G35 · ERROR 1: toda la noche en agua fría
{ const i = 35, a0 = gs(i), mis = G(i, "la misma costra"), tra = G(i, "lo que trabaja");
  S({ i, beats: [{ a: a0 + 0.05, k: "o_noche", via: "zoom" }], fx: (t) => [
    <ErrorBanner t={t} at={a0 + 0.1} out={ge(i) + 0.3} n={1} text="TODA LA NOCHE EN AGUA FRÍA" />,
    <Tag t={t} at={mis} x={960} y={640} dx={260} dy={-160} text="LA MISMA COSTRA" sub="PERO MOJADA" col={COL.ice} out={tra - 0.2} size={52} />,
    <Line t={t} at={tra} out={ge(i) + 0.3} text="LO QUE TRABAJA ES EL CALOR" y={880} size={62} col={COL.amber} />,
  ] }); }

// G36 · ERROR 2: sal gruesa + fibra de alambre
{ const i = 36, a0 = gs(i), bri = G(i, "lo que sale es"), dej = G(i, "le dejas el"), dob = G(i, "el doble");
  S({ i, beats: [
    { a: a0 + 0.05, k: "o_sal", via: "whip" },
    { a: dej, board: true, via: "zoom" },
  ], fx: (t) => [
    <ErrorBanner t={t} at={a0 + 0.1} out={ge(i) + 0.3} n={2} text="SAL GRUESA + FIBRA DE ALAMBRE" />,
    <Tag t={t} at={bri} x={960} y={600} dx={260} dy={180} text="SALE EL BRILLO DEL METAL" col={COL.red} out={dej - 0.3} size={52} />,
    <BigNum t={t} at={dob - 0.3} text="×2" sub="SE PEGA EL DOBLE" y={520} size={300} col={COL.red} edge="#4a1410" out={ge(i) + 0.3} />,
  ] }); }

// G37 · ERROR 3: recién quemada bajo el agua fría → el fondo se tuerce, baila
{ const i = 37, a0 = gs(i), rui = G(i, "un ruido fuerte"), tue = G(i, "se tuerce"), des = G(i, "después la sartén");
  S({ i, beats: [
    { a: a0 + 0.05, k: "o_choque", via: "zoom" },
    { a: des, via: "portal", q: [960, 540], w: { A: PAN_SIDE, B: push(PAN_SIDE, 0.1), ev: (t) => ({ crust: 0.4, wobble: win(t, des, des + 0.5) }) } },
  ], fx: (t) => [
    <ErrorBanner t={t} at={a0 + 0.1} out={ge(i) + 0.3} n={3} text="CALIENTE, DIRECTO AL AGUA FRÍA" />,
    <Flash t={t} at={rui} peak={0.45} />,
    <Stamp t={t} at={tue} text="SE TUERCE" x={1350} y={760} rot={6} size={100} out={des - 0.3} />,
    <Tag t={t} at={des + 0.5} x={scr(t, PT.pan).x} y={scr(t, PT.pan).y} dx={260} dy={-200} text="BAILA EN LA HORNALLA" col={COL.amber} out={ge(i) + 0.3} size={52} />,
  ], out: PT.pan }); }

// G38 · ERROR 4: prender y salir de la cocina → se seca y se vuelve a quemar
{ const i = 38, a0 = gs(i), sal = G(i, "salir de la"), eva = G(i, "el agua se"), que = G(i, "se vuelve a");
  S({ i, beats: [
    { a: a0 + 0.05, via: "whip", w: { A: WIDE, B: push(WIDE, 0.15), ev: (t) => ({ water: 1, tab: 1, tabDrop: 1, flame: 1, steam: 0.8, day: 0.6 }) } },
    { a: eva, k: "o_seco", via: "portal", q: PT.pan },
  ], fx: (t) => [
    <ErrorBanner t={t} at={a0 + 0.1} out={ge(i) + 0.3} n={4} text="PRENDER EL FUEGO Y SALIR" />,
    <Tag t={t} at={sal} x={scr(t, PT.pan).x} y={scr(t, PT.pan).y} dx={-240} dy={200} text="NADIE MIRANDO" col={COL.red} out={eva - 0.3} size={50} />,
    <Stamp t={t} at={que} text="SE VUELVE A QUEMAR" x={960} y={820} rot={-5} size={88} out={ge(i) + 0.3} />,
  ] }); }

// G39 · por esos 4 errores se tiraron más sartenes · BONUS: la olla del anillo negro
{ const i = 39, a0 = gs(i), bon = G(i, "y un bonus"), ani = G(i, "un anillo negro"), mis = G(i, "es el mismo truco");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "zoom" },
    { a: bon + 0.5, k: "o_olla", via: "portal", q: [960, 520] },
  ], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={bon - 0.2} text="MÁS SARTENES TIRADAS POR ESTO" y={300} size={62} />,
    <Line t={t} at={a0 + 0.8} out={bon - 0.2} text="QUE POR EL QUEMADO" y={420} size={72} col={COL.red} />,
    <BigNum t={t} at={bon} text="BONUS" y={200} size={150} col={COL.amber} edge="#5a3a10" out={ani - 0.2} />,
    <Tag t={t} at={ani} x={960} y={640} dx={-260} dy={-220} text="EL ANILLO NEGRO" col={COL.amber} out={ge(i) + 0.3} size={56} />,
    <Line t={t} at={mis} out={ge(i) + 0.3} text="ES EL MISMO TRUCO" y={880} size={66} col="#9df0b4" />,
  ] }); }

// G40 · la tetera: es sarro, no quemado
{ const i = 40, a0 = gs(i), sar = G(i, "es sarro"), nos = G(i, "y eso no"), otr = G(i, "es otro video");
  S({ i, beats: [{ a: a0 + 0.05, k: "o_tetera", via: "whip" }], fx: (t) => [
    <Tag t={t} at={a0 + 0.4} x={960} y={600} dx={260} dy={-200} text="LA MANCHA MARRÓN" col={COL.amber} out={sar - 0.2} size={52} />,
    <Stamp t={t} at={sar} text="ES SARRO" x={960} y={260} rot={-6} size={120} out={ge(i) + 0.3} />,
    <Line t={t} at={nos} out={otr - 0.1} text="NO SALE CON LA PASTILLA" y={880} size={60} />,
    <Line t={t} at={otr} out={ge(i) + 0.3} text="ESO ES OTRO VIDEO" y={880} size={60} col={COL.amber} />,
  ] }); }

// G41 · la balanza: sartén nueva = una caja; una caja salva 20
{ const i = 41, a0 = gs(i), cue = G(i, "cuesta lo mismo"), caj = G(i, "con una caja");
  S({ i, beats: [{ a: a0 + 0.05, board: true, via: "zoom" }], fx: (t) => [
    <Balance t={t} at={a0 + 0.05} even={cue} many={caj + 0.4} out={ge(i) + 0.3} />,
  ] }); }

// G42 · lo que gastas: nada nuevo · te soy honesto (la de diez años)
{ const i = 42, a0 = gs(i), pas = G(i, "una pastilla"), gas = G(i, "minutos de gas"), cuc = G(i, "una cuchara"), nad = G(i, "no compraste"), hon = G(i, "y te soy honesto");
  S({ i, beats: [
    { a: a0 + 0.05, via: "whip", w: { A: WIDE, keys: [[hon - 0.3, push(WIDE, 0.2)], [hon + 0.8, PAN_TOP]], B: push(PAN_TOP, 0.15), ev: (t) => ({ day: 0.85 - 0.15 * win(t, hon, hon + 0.6), crust: 0.2 + 0.8 * win(t, hon + 0.2, hon + 0.7), shine: 0.6 * (1 - win(t, hon, hon + 0.5)) }) } },
  ], fx: (t) => [
    <Spent t={t} rows={[{ at: pas, text: "UNA PASTILLA" }, { at: gas, text: "10 MIN DE GAS" }, { at: cuc, text: "LA CUCHARA DE MADERA" }]} totalAt={nad} out={hon - 0.3} />,
    <Line t={t} at={hon} out={ge(i) + 0.3} text="TE SOY HONESTO" y={130} size={80} />,
    <Tag t={t} at={G(i, "la costra de")} x={scr(t, PT.pan).x} y={scr(t, PT.pan).y} dx={-260} dy={-200} text="LA COSTRA DE 10 AÑOS" col={COL.amber} out={ge(i) + 0.3} size={52} />,
  ], out: PT.pan }); }

// G43 · la capa era más gruesa · el arcoíris azul y dorado: no es mugre
{ const i = 43, a0 = gs(i), sif = G(i, "si el fondo"), arc = G(i, "un arcoíris"), mug = G(i, "no es mugre");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "zoom" },
    { a: sif, k: "o_arcoiris", via: "portal", q: [960, 600] },
  ], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={sif - 0.3} text="LA CAPA ERA MÁS GRUESA" y={460} size={86} col={COL.amber} />,
    <Tag t={t} at={arc} x={960} y={560} dx={260} dy={-200} text="AZUL Y DORADO" col={COL.ice2} out={ge(i) + 0.3} size={52} />,
    <Stamp t={t} at={mug} text="NO ES MUGRE" x={760} y={820} rot={-6} size={100} out={ge(i) + 0.3} />,
  ] }); }

// G44 → G48 (con el avatar en recuadro): la pelada ya cumplió · la lista completa · el repaso de los 7 pasos en el laboratorio
{ const i = 44, a0 = gs(i), cum = G(i, "esa ya cumplió"), lis = G(i, "te dejo la"), tod = G(46, "eso es todo"), rep = G(46, "te lo repito");
  const r = [G(46, "uno lo negro"), Wt(47, "dos el imán"), G(47, "tres agua"), G(47, "cuatro diez minutos"), Wt(48, "cinco entibiar"), G(48, "seis el fondo"), G(48, "siete enjuagar")];
  const steps = ["LO NEGRO SE ABLANDA", "EL IMÁN: QUÉ SARTÉN", "1-2 DEDOS + 1 PASTILLA", "10 MIN BAJITO, SIN IRTE", "ENTIBIAR + MADERA", "AFUERA: DE CABEZA, 1 HORA", "ENJUAGAR, SECAR, MISMO DÍA"];
  const ck = CHECK().map((c, k) => ({ ...c, x: CHECK_XY[k][0], y: CHECK_XY[k][1] }));
  S({ i, j: 49, pip: [45, 46, 47, 48], beats: [
    { a: a0 + 0.05, k: "o_pelada", via: "zoom" },
    { a: lis, k: "o_flatlay", via: "portal", q: [960, 540], z: [1.0, 1.04] },
    { a: tod, via: "zoom", w: { A: WIDE, keys: [[r[0] + 0.6, PAN_TOP], [r[1] - 0.2, PAN_TOP], [r[1] + 0.7, RACK], [r[2] - 0.2, RACK], [r[2] + 0.7, PAN_CLOSE], [r[3] - 0.2, PAN_CLOSE], [r[3] + 0.7, CLOCK], [r[4] - 0.2, CLOCK], [r[4] + 0.7, PAN_CLOSE], [r[5] - 0.2, PAN_CLOSE], [r[5] + 0.8, SINK], [r[6] - 0.2, SINK], [r[6] + 0.8, PAN_TOP]],
      ev: (t) => ({ day: 0.8, rackHi: win(t, r[1], r[1] + 0.5) * (1 - win(t, r[2] - 0.3, r[2])), mag: win(t, r[1] + 0.3, r[1] + 1.2), water: win(t, r[2], r[2] + 0.5) * (1 - win(t, r[5], r[6])), tab: win(t, r[2] + 0.2, r[2] + 0.5) * (1 - win(t, r[3] + 1, r[4])), tabDrop: win(t, r[2] + 0.3, r[2] + 0.8),
        flame: win(t, r[3], r[3] + 0.3) * (1 - win(t, r[4], r[4] + 0.3)), foam: win(t, r[3], r[3] + 1) * (1 - win(t, r[4], r[5])), steam: win(t, r[3], r[3] + 1) * (1 - win(t, r[5], r[6])), rem: 600 - win(t, r[3], r[4]) * 600, hot: win(t, r[3], r[3] + 0.4) * (1 - win(t, r[4], r[4] + 0.4)),
        spat: win(t, r[4], r[5]), lift: win(t, r[4] + 0.3, r[5]), crust: 1 - win(t, r[4] + 0.4, r[5] + 0.5), shine: win(t, r[6], r[6] + 1.2) }) } },
  ], fx: (t) => [
    <Stamp t={t} at={cum} text="YA CUMPLIÓ" x={960} y={260} rot={-6} size={110} out={lis - 0.3} />,
    <Tag t={t} at={G(i, "no conviene")} x={900} y={600} dx={-260} dy={200} text="COCINAR CON ESO NO CONVIENE" col={COL.amber} out={lis - 0.3} size={44} />,
    <Line t={t} at={lis} out={Wt(45, "una o dos") - 0.2} text="LA LISTA COMPLETA" y={110} size={80} col={COL.amber} />,
    <CheckOn t={t} items={ck} out={tod - 0.3} />,
    <Line t={t} at={G(45, "agua de la llave")} out={G(45, "una espátula") - 0.1} text="+ AGUA DE LA LLAVE" y={110} size={66} col={COL.ice} />,
    <Line t={t} at={rep} out={r[0] - 0.1} text="TE LO REPITO RÁPIDO" y={110} size={76} col={COL.amber} />,
    <RecapRail t={t} at={r[0] - 0.2} out={ge(48) + 0.3} steps={r.map((a, k) => ({ at: a, text: steps[k] }))} />,
    ...[45, 46, 47, 48].map((n) => <Pip t={t} a={WIN[n].ms} b={WIN[n].me} left={n < 47} />),
  ], out: [1520, 830] }); }

// G49 · escríbemelo en los comentarios · los 7 pasos en la descripción
{ const i = 49, a0 = gs(i), sie = G(i, "los siete pasos");
  S({ i, beats: [{ a: a0 + 0.05, board: true, via: "zoom" }], fx: (t) => [
    <CommentType t={t} at={Wt(49, "qué fue") - 0.2} out={sie - 0.3} text="Se me quemó el arroz y la sartén lleva 6 años guardada… (tu país)" y={460} />,
    <Line t={t} at={G(i, "con tu país")} out={sie - 0.3} text="CON TU PAÍS · LOS LEO TODOS" y={300} size={60} col={COL.amber} />,
    <DescBox t={t} at={sie} out={ge(i) + 0.3} />,
  ], out: [960, 540] }); }

// G50 · el libro en el primer enlace · próximo: el fregadero que no se tapa
{ const i = 50, a0 = gs(i), gua = G(i, "guárdalo en"), pro = G(i, "en el próximo");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "whip" },
    { a: pro, k: "p_next", via: "portal", q: [960, 560] },
  ], fx: (t) => [
    <Book3D t={t} at={a0 - 0.3} open={a0 + 0.4} out={pro - 0.2} page="guia_p33.png" label="EN EL PRIMER ENLACE" />,
    <Tag t={t} at={gua} x={1240} y={420} dx={200} dy={-150} text="GUÁRDALO EN EL CELULAR" col={COL.ice} out={pro - 0.3} size={46} />,
    <Line t={t} at={pro + 0.2} out={ge(i) + 0.3} text="PRÓXIMO: EL FREGADERO QUE NO SE TAPA" y={120} size={56} col={COL.amber} />,
  ] }); }

// G51 · no se talla, se cocina · pastilla y diez minutos
{ const i = 51, a0 = gs(i), nos = G(i, "nos vemos"), pas = G(i, "pastilla y diez");
  S({ i, beats: [{ a: a0 + 0.05, via: "zoom", w: { A: PAN_TOP, keys: [[nos, push(PAN_TOP, 0.1)], [END, WIDE]], ev: (t) => ({ crust: 0, shine: 1, day: 0.85, glow: win(t, pas, pas + 0.5) * 0.6 }) } }], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={nos - 0.1} text="NO SE TALLA, SE COCINA" y={130} size={86} col="#9df0b4" />,
    <EndCard t={t} at={pas} l1="PASTILLA + 10 MIN" l2="NO LA TIRES" />,
  ] }); }

// las ventanas del avatar a pantalla completa: piezas propias (las que no están en recuadro)
const WFX: Record<number, (t: number) => React.ReactNode[]> = {
  5: (t) => [<SafetyRow t={t} items={SAFE()} out={SAFE_OUT} />],
  6: (t) => [<Tag t={t} at={Wt(6, "como nuevos")} x={1380} y={520} dx={180} dy={-160} text="DEPARTAMENTOS" sub="COMO NUEVOS" col={COL.amber} out={WIN[6].me - 0.3} size={50} />],
  7: (t) => [<Note t={t} at={Wt(7, "no la pelees")} out={WIN[7].me + 0.1} text="No la pelees, cocínala." x={1440} y={420} />],
  8: (t) => [<Book3D t={t} at={Wt(8, "se llama") - 0.2} open={1e9} out={WIN[8].me + 0.3} page="guia_p12.png" x={1470} y={560} sc={0.72} />, <Line t={t} at={Wt(8, "noventa y cuatro")} out={WIN[8].me + 0.3} text="94 ARREGLOS DE LA CASA" y={900} size={62} col={COL.amber} />],
  9: (t) => [<Line t={t} at={WIN[9].ms + 0.3} out={WIN[9].me + 0.2} text="PARA LA QUE NI LA PASTILLA PUEDE" y={900} size={56} col={COL.amber} />],
  10: (t) => [<Line t={t} at={Wt(10, "vamos a la estufa")} out={WIN[10].me + 0.2} text="VAMOS A LA ESTUFA" y={130} size={80} col="#9df0b4" />],
  11: (t) => [<Line t={t} at={Wt(11, "como un pegamento")} out={WIN[11].me + 0.2} text="COMO UN PEGAMENTO" y={900} size={72} col={COL.amber} />],
  12: (t) => [<Tag t={t} at={Wt(12, "se pega")} x={1350} y={620} dx={180} dy={-180} text="SE PEGA MÁS" col={COL.red} out={WIN[12].me + 0.2} size={56} />],
  13: (t) => [<Line t={t} at={Wt(13, "para despegar")} out={WIN[13].me + 0.2} text="HECHA PARA DESPEGAR COMIDA" y={900} size={62} col={COL.ice} />],
  14: (t) => [<Tag t={t} at={Wt(14, "justo encima")} x={1350} y={640} dx={200} dy={-180} text="JUSTO ENCIMA DE LO NEGRO" col={COL.amber} out={WIN[14].me - 0.3} size={46} />],
  15: (t) => [<BigNum t={t} at={Wt(15, "acero inoxidable")} text="ACERO ✓" sub="LA MEJOR · AGUANTA TODO" x={1460} y={420} size={120} col="#9df0b4" edge="#1f5a36" out={WIN[15].me + 0.2} />],
  16: (t) => [<Sticker t={t} at={Wt(16, "quince minutos")} out={WIN[16].me + 0.2} x={1440} y={330} icon="reloj" text="15 MIN SIN FUEGO" col="#2f5f8f" />],
  17: (t) => [<Stamp t={t} at={Wt(17, "nunca")} text="HIERRO: NUNCA" x={1430} y={320} rot={7} size={96} out={WIN[17].me + 0.2} />],
  18: (t) => [<Tag t={t} at={Wt(18, "apagada")} x={1350} y={640} dx={200} dy={-170} text="APAGADA" col={COL.red} out={WIN[18].me + 0.2} size={56} />],
  19: (t) => [<Tag t={t} at={Wt(19, "la película")} x={1350} y={640} dx={200} dy={-170} text="CON PELÍCULA: ENTERA" col={COL.ice} out={WIN[19].me + 0.2} size={50} />],
  20: (t) => [<Line t={t} at={Wt(20, "una sobra")} out={Wt(20, "lo que hace") - 0.1} text="UNA SOBRA" y={130} size={86} col="#9df0b4" />],
  21: (t) => [<Tag t={t} at={Wt(21, "burbujitas")} x={1350} y={640} dx={200} dy={-170} text="BURBUJITAS EN EL BORDE" col={COL.ice} out={WIN[21].me + 0.2} size={48} />],
  22: (t) => [<Line t={t} at={Wt(22, "la pastilla trabajando")} out={Wt(22, "y al ratito")} text="LA PASTILLA TRABAJANDO" y={900} size={64} col={COL.ice} />],
  23: (t) => [<SafetyRow t={t} items={[{ at: Wt(23, "ventana abierta"), icon: "ventana", text: "VENTANA ABIERTA", col: "#8fd6ff" }, { at: Wt(23, "del vapor"), icon: "llama", text: "LEJOS DEL VAPOR", col: "#ffcf7a" }, { at: Wt(23, "sin agua"), icon: "agua", text: "NUNCA SIN AGUA", col: "#9fe0ff" }]} out={WIN[23].me + 0.1} />],
  24: (t) => [<Tag t={t} at={Wt(24, "ensucia toda")} x={1350} y={640} dx={200} dy={-170} text="ENSUCIA TODA LA ESTUFA" col={COL.red} out={WIN[24].me + 0.2} size={48} />],
  25: (t) => [<SubBtn t={t} {...SUB()} />],
  26: (t) => [<Book3D t={t} at={Wt(26, "la página")} open={Wt(26, "la página") + 0.5} out={WIN[26].me + 0.9} page="guia_p34.png" x={1460} sc={0.75} mark={[0.07, 0.545, 0.86, 0.4]} markAt={Wt(26, "cómo se hace")} label="PÁGINA 34" />],
  27: (t) => [<Tag t={t} at={Wt(27, "una espátula")} x={1350} y={640} dx={200} dy={-170} text="MADERA, NUNCA METAL" col="#9df0b4" out={WIN[27].me + 0.2} size={50} />],
  28: (t) => [<Line t={t} at={Wt(28, "el metal brillante")} out={WIN[28].me + 0.2} text="EL METAL BRILLANTE" y={900} size={72} col={COL.ice2} />],
  29: (t) => [<Sticker t={t} at={Wt(29, "cinco minutos")} out={WIN[29].me + 0.2} x={1440} y={330} icon="reloj" text="+5 MIN" col="#8f5a2a" />],
  30: (t) => [<BigNum t={t} at={Wt(30, "mil veces")} text="MIL VECES" x={1450} y={420} size={120} col={COL.amber} edge="#5a3a10" out={WIN[30].me + 0.2} />],
  31: (t) => [<Dose t={t} rows={[{ at: Wt(31, "dos pastillas"), n: 2, text: "DE CABEZA" }]} out={WIN[31].me + 0.2} />],
  32: (t) => [<Sticker t={t} at={Wt(32, "dos horas")} out={WIN[32].me + 0.2} x={1440} y={330} icon="reloj" text="DOS HORAS" col="#2f5f8f" />],
  33: (t) => [<BigNum t={t} at={Wt(33, "dos veces")} text="×2" sub="ENJUAGAR BIEN" x={1460} y={420} size={180} col={COL.ice} edge="#26405a" out={WIN[33].me + 0.2} />],
  34: (t) => [<Tag t={t} at={Wt(34, "el aceite")} x={1350} y={640} dx={200} dy={-170} text="ACEITE: SARTÉN YA CALIENTE" col={COL.amber} out={WIN[34].me + 0.2} size={46} />],
  36: (t) => [<Line t={t} at={Wt(36, "el segundo")} out={WIN[36].me + 0.2} text="EL SEGUNDO…" y={130} size={80} col={COL.red} />],
  37: (t) => [<Line t={t} at={Wt(37, "el que más duele")} out={WIN[37].me + 0.2} text="EL QUE MÁS DUELE" y={130} size={80} col={COL.red} />],
  38: (t) => [<Line t={t} at={Wt(38, "que se entibie")} out={WIN[38].me + 0.2} text="QUE SE ENTIBIE SOLA" y={900} size={70} col="#9df0b4" />],
  39: (t) => [<Sticker t={t} at={Wt(39, "diez minutos")} out={WIN[39].me + 0.2} x={1440} y={330} icon="reloj" text="10 MIN · TÚ AL LADO" col="#8f5a2a" />],
  40: (t) => [<Chips t={t} at={Wt(40, "una pastilla")} items={["1 PASTILLA", "TAPAR EL ANILLO", "10 MIN BAJITO"]} out={WIN[40].me + 0.2} y={860} />],
  41: (t) => [<Line t={t} at={Wt(41, "hagamos cuentas")} out={WIN[41].me + 0.2} text="HAGAMOS CUENTAS" y={130} size={86} col={COL.amber} />],
  42: (t) => [<Tag t={t} at={Wt(42, "ya la puedes")} x={1350} y={640} dx={200} dy={-170} text="LA DE ALAMBRE: A LA BASURA" col={COL.red} out={WIN[42].me + 0.2} size={46} />],
  43: (t) => [<BigNum t={t} at={Wt(43, "dos o tres")} text="2-3 VUELTAS" x={1450} y={420} size={110} col={COL.ink} out={WIN[43].me + 0.2} />],
  44: (t) => [<Line t={t} at={Wt(44, "no le hace nada")} out={Wt(44, "y si la") - 0.1} text="NO LE HACE NADA A LA COMIDA" y={900} size={58} col="#9df0b4" />],
  49: (t) => [<CommentType t={t} at={Wt(49, "qué fue") - 0.2} out={G(49, "los siete pasos") - 0.3} text="Se me quemó el arroz y la sartén lleva 6 años guardada… (tu país)" y={760} />],
  50: (t) => [<Tag t={t} at={Wt(50, "las bandejas")} x={1350} y={640} dx={200} dy={-170} text="Y EL RESTO DE LA CASA" col={COL.amber} out={WIN[50].me + 0.2} size={50} />],
  51: (t) => [<Line t={t} at={Wt(51, "un plomero viejo")} out={WIN[51].me + 0.2} text="UN PLOMERO VIEJO" y={130} size={80} col={COL.amber} />],
};

// ---------- la cámara del laboratorio: keyframes de todas las tomas 3D ----------
{
  const K: Key[] = [{ t: 60, ...WIDE }];
  SEGS.forEach((g) => g.beats.forEach((b, k) => {
    if (!b.w) return;
    const end = k + 1 < g.beats.length ? g.beats[k + 1].a : ge(g.j ? g.j - 1 : g.i);
    K.push({ t: b.a - TR - 0.3, ...b.w.A });
    (b.w.keys ?? []).forEach(([kt, P]) => K.push({ t: kt, ...P }));
    if (b.w.B) K.push({ t: end + 0.4, ...b.w.B });
  }));
  K.sort((a, b) => a.t - b.t);
  CAM2 = makeCam(K);
}
const PIPW = new Set(SEGS.flatMap((g) => g.pip ?? []));

const beatNode = (b: Beat, t: number): React.ReactNode =>
  b.w ? <World2 t={t} ev={b.w.ev(t)} /> : b.board ? <><Board t={t} />{b.c?.(t)}</> : b.c ? b.c(t) : <Shot k={b.k!} t={t} a={b.a} z={b.z} />;

const VIA = (via: Via, p: number, prev: React.ReactNode, cur: React.ReactNode, pt: { x: number; y: number }, key: string, nb = false): React.ReactNode[] => {
  // nb = el plano que sale es el avatar → nunca se desenfoca (creador, 21-oct)
  const q = Math.sin(p * Math.PI), bl = (px: number) => (nb || px <= 0.5 ? undefined : `blur(${px}px)`);
  if (via === "portal") return [<AbsoluteFill key={key + "p"}>{prev}</AbsoluteFill>, <Portal key={key + "c"} x={pt.x} y={pt.y} r={p}>{cur}</Portal>];
  if (via === "zoom") return [
    <AbsoluteFill key={key + "c"} style={{ transform: `scale(${1.25 - 0.25 * p})`, filter: q > 0.05 ? `blur(${q * 14}px)` : undefined }}>{cur}</AbsoluteFill>,
    <AbsoluteFill key={key + "p"} style={{ opacity: 1 - p, transformOrigin: `${pt.x}px ${pt.y}px`, transform: `scale(${1 + p * p * 5})`, filter: bl(p * 18) }}>{prev}</AbsoluteFill>];
  if (via === "rise") return [
    <AbsoluteFill key={key + "p"} style={{ transform: `translateY(${-p * 500}px)`, filter: bl(q * 20) }}>{prev}</AbsoluteFill>,
    <AbsoluteFill key={key + "c"} style={{ transform: `translateY(${(1 - p) * 1080}px)`, filter: q > 0.05 ? `blur(${q * 26}px)` : undefined }}>{cur}</AbsoluteFill>];
  return [
    <AbsoluteFill key={key + "p"} style={{ transform: `translateX(${-p * 700}px)`, filter: bl(q * 30) }}>{prev}</AbsoluteFill>,
    <AbsoluteFill key={key + "c"} style={{ transform: `translateX(${(1 - p) * 1920}px)`, filter: q > 0.05 ? `blur(${q * 36}px)` : undefined }}>{cur}</AbsoluteFill>];
};

export const Body: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  // ventanas del avatar a pantalla completa
  for (let n = 5; n < WIN.length; n++) {
    if (PIPW.has(n)) continue;
    const w = WIN[n];
    if (t >= w.ms + 0.35 && t < w.me + 0.1) {
      L.push(<Avatar key={"av" + n} t={t} />);
      (WFX[n]?.(t) ?? []).forEach((x, k) => L.push(<React.Fragment key={"w" + n + "_" + k}>{x}</React.Fragment>));
    }
  }
  // tramos
  for (const g of SEGS) {
    const s0 = gs(g.i), e0 = g.j ? WIN[g.j].ms : ge(g.i), B = g.beats;
    if (t < B[0].a - TR - 0.02 || t >= e0 + 0.45) continue;
    let i = 0; for (let k = 0; k < B.length; k++) if (t >= B[k].a - TR) i = k;
    const cur = B[i], p = ei(t, cur.a - TR, cur.a + 0.06);
    const prev = i > 0 ? beatNode(B[i - 1], t) : g.i === 4 ? null : <Avatar t={Math.min(t, s0 - 0.01)} />;
    const node = beatNode(cur, t);
    if (p >= 1 || prev === null && p >= 1) L.push(<AbsoluteFill key={"g" + g.i}>{node}</AbsoluteFill>);
    else if (prev === null) L.push(<AbsoluteFill key={"g" + g.i} style={{ transform: `translateX(${(1 - p) * 1920}px)`, filter: `blur(${Math.sin(p * Math.PI) * 36}px)` }}>{node}</AbsoluteFill>);
    else VIA(cur.via ?? "whip", p, prev, node, ptOf(t, cur.q), "g" + g.i + "_" + i, i === 0).forEach((x) => L.push(x));
    if (t < e0 + 0.1) g.fx(t).forEach((x, k) => L.push(<React.Fragment key={"f" + g.i + "_" + k}>{x}</React.Fragment>));
    // entrada a la ventana siguiente: portal desde el punto que toca
    const r = ei(t, e0 - 0.15, e0 + 0.4);
    if (r > 0) {
      const last = B[B.length - 1], o = g.out ?? (last.w ? PT.pan : [960, 540]);
      if (g.i !== 51) L.push(<Portal key={"po" + g.i} x={ptOf(t, o).x} y={ptOf(t, o).y} r={r}><Avatar t={Math.max(e0, t)} /></Portal>);
    }
  }
  // el fondo negro recién cuando el minuto 1 ya salió: antes tapaba al avatar (10 cuadros negros a 68,3 s)
  return <AbsoluteFill style={{ background: t >= MIN1_END + 0.4 ? "#05070b" : undefined }}>{L}</AbsoluteFill>;
};
