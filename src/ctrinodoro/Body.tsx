// ctrinodoro · CUERPO (fin del minuto 1 → final). Un solo hilo: avatar (ventanas pagadas) ↔ tramos. Cada tramo = tomas reales / el baño 3D
// unidas por portal, latigazo, subida o zoom a través (nunca corte seco), con piezas ancladas a la voz con at("frase").
// Una sola cámara para el baño (CAM2) y un "tablero" = el mismo baño desenfocado detrás de las piezas.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EV0, Ev, BathWorld, makeCam, PT, win, Key } from "./bano3d";
import { BigNum, COL, Chips, FONT, LowerThird, Portal, Tag, Thermo, e, ei, extrude, spr } from "./lib";
import { at, Avatar, Line, MIN1_END, Shot, Stamp, Sticker, WIN, VO } from "./Min1";
import { Book3D, CommentType, DescBox, Dose, EndCard, Equation, ErrorBanner, Habits, Note, RecapRail, SafetyRow, Section, Spent, Versus } from "./body_fx";

type V3 = [number, number, number];
type Pose = { p: V3; l: V3; fov: number };
type Via = "whip" | "rise" | "zoom" | "portal";
type Beat = { a: number; k?: string; z?: [number, number]; from?: number; w?: { A: Pose; B?: Pose; keys?: [number, Pose][]; ev: (t: number) => Partial<Ev> }; board?: boolean; c?: (t: number) => React.ReactNode; via?: Via; q?: V3 | [number, number] };
type Seg = { i: number; j?: number; beats: Beat[]; fx: (t: number) => React.ReactNode[]; out?: V3 | [number, number]; pip?: number[] };

export const END = 870.5 + VO + 1.0;
const TR = 0.32;
const FIRST = 5; // el minuto 1 termina al cerrar la ventana 5 del avatar
const gs = (i: number) => WIN[i].me, ge = (i: number) => (i + 1 < WIN.length ? WIN[i + 1].ms : END);
const G = (i: number, f: string, fin = false) => at(f, gs(i) - 0.6, fin);
const Wt = (i: number, f: string, fin = false) => at(f, WIN[i].ms - 0.6, fin);

// las tomas del baño (mismas poses que el minuto 1 + las nuevas)
const OV: Pose = { p: [0.6, 1.3, 2.15], l: [0.05, 0.55, -0.3], fov: 38 };
const RING: Pose = { p: [0.0, 0.52, 0.66], l: [0, 0.29, -0.16], fov: 30 };
const MACRO: Pose = { p: [-0.06, 0.4, 0.52], l: [0.2, 0.3, 0.1], fov: 26 };
const MACROB: Pose = { p: [0.05, 0.37, 0.28], l: [0, 0.3, -0.25], fov: 26 };
const CLOCK: Pose = { p: [-0.5, 1.45, 0.5], l: [-0.95, 1.5, -0.68], fov: 34 };
const SINK: Pose = { p: [0.95, 1.25, 0.55], l: [0.92, 0.88, -0.35], fov: 34 };
const TANK: Pose = { p: [0.6, 1.55, 0.15], l: [0, 0.66, -0.42], fov: 34 };
const TOP: Pose = { p: [0.0, 1.2, 0.35], l: [0, 0.25, -0.02], fov: 34 };
const HOLES: Pose = { p: [0.0, 0.33, 0.12], l: [0, 0.41, -0.3], fov: 32 };
const WINDOW: Pose = { p: [-0.55, 1.3, 0.9], l: [-1.39, 1.35, -0.1], fov: 38 };
const WIDE: Pose = { p: [0.9, 1.55, 2.7], l: [0, 0.6, -0.3], fov: 42 };
const push = (P: Pose, k = 0.1): Pose => ({ p: [P.p[0] + (P.l[0] - P.p[0]) * k, P.p[1] + (P.l[1] - P.p[1]) * k, P.p[2] + (P.l[2] - P.p[2]) * k], l: P.l, fov: P.fov - 2 });
const GREEN = "#9df0b4";

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
// la lista de compras: hoja de papel que se va tildando a medida que la dice
const ListCard: React.FC<{ t: number; items: { at: number; text: string }[]; out: number }> = ({ t, items, out }) => {
  const a = items[0].at - 0.4, o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.25)), k = Math.min(1.08, spr(t, a, 0.8));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 60, width: 760, padding: "34px 40px", background: "#fbf8f1", borderRadius: 10, opacity: o, boxShadow: "0 40px 80px rgba(0,0,0,.6)", transform: `rotate(-2deg) translateY(${(1 - Math.min(1, k)) * 700}px)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#8a5428", letterSpacing: 4, marginBottom: 10 }}>LO QUE JUNTAS ANTES</div>
      {items.map((it, i) => {
        const on = e(t, it.at, it.at + 0.2);
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, margin: "9px 0", opacity: 0.25 + 0.75 * on }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, border: "4px solid #2b2b2b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={34} height={34} viewBox="0 0 100 100"><path d="M14 54l24 24 50-56" fill="none" stroke="#1f8a4c" strokeWidth={14} strokeLinecap="round" strokeDasharray={130} strokeDashoffset={130 * (1 - e(t, it.at + 0.05, it.at + 0.3))} /></svg>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#1b1205" }}>{it.text}</div>
        </div>;
      })}
    </div>
  );
};

// ---------- el baño: una cámara, eventos por toma ----------
const BCAM = makeCam([{ t: 60, ...WIDE }, { t: 900, ...push(WIDE, 0.15) }]);
const Board: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ filter: "blur(16px) brightness(.42) saturate(.8)", transform: "scale(1.06)" }}><BathWorld t={t} ev={{ ...EV0, day: 0.75, hour: 30 }} cam={BCAM} /></AbsoluteFill>
);
let CAM2: ReturnType<typeof makeCam>;
const World2: React.FC<{ t: number; ev: Partial<Ev> }> = ({ t, ev }) => {
  const v0 = CAM2.camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb2" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><BathWorld t={t} ev={{ ...EV0, day: 0.85, hour: 30, ...ev }} cam={CAM2} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const scr = (t: number, q: V3) => CAM2.screenOf(t, q);
const ptOf = (t: number, q: V3 | [number, number] | undefined) => (!q ? { x: 960, y: 540 } : q.length === 3 ? scr(t, q as V3) : { x: q[0], y: q[1] });
const RT = (t: number, q: V3, dx: number, dy: number, text: string, a: number, out: number, col = COL.ink, size = 48, sub?: string) =>
  <Tag t={t} at={a} x={scr(t, q).x} y={scr(t, q).y} dx={dx} dy={dy} text={text} sub={sub} col={col} out={out} size={size} />;

// ===================================================================================
// LOS TRAMOS (G5…G52) · cada uno: tomas + piezas, todo desde la voz
// ===================================================================================
const SEGS: Seg[] = [];
const S = (g: Seg) => SEGS.push(g);

// G5 · guantes, ventana abierta, nunca con cloro · si hubo cloro: descarga 3 veces
{ const i = 5, a0 = gs(i), irr = G(i, "irrita"), ven = G(i, "ventana abierta"), nun = G(i, "nunca nunca"), sem = G(i, "si esta semana"), des = G(i, "descarga tres veces");
  S({ i, beats: [
    { a: a0 + 0.05, via: "whip", w: { A: OV, keys: [[ven - 0.2, OV], [ven + 0.8, WINDOW], [sem - 0.2, WINDOW], [sem + 0.8, TOP]], ev: (t) => ({ flush: win(t, des, des + 0.5) * (1 - win(t, des + 2.4, des + 3)) }) } },
  ], fx: (t) => [
    <SafetyRow t={t} items={[{ at: a0 + 0.1, icon: "guante", text: "GUANTES DE GOMA", col: "#ffd34d" }, { at: ven, icon: "ventana", text: "VENTANA ABIERTA", col: "#8fd6ff" }, { at: nun, icon: "nomezcla", text: "NUNCA CON CLORO", col: "#ff9a8a" }]} out={sem - 0.25} />,
    <Line t={t} at={irr} out={ven - 0.1} text="IRRITA PIEL Y OJOS" y={130} size={72} col={COL.red} />,
    <Line t={t} at={sem} out={ge(i) + 0.3} text="¿CLORO ESTA SEMANA? DESCARGA 3 VECES" y={130} size={62} col={COL.amber} />,
  ], out: PT.tank }); }

// G6 · ya me conoces: 30 años de oficio · departamentos como nuevos
{ const i = 6, a0 = gs(i), tre = G(i, "30 años"), fum = G(i, "fumigador"), dep = G(i, "entregar departamentos");
  S({ i, beats: [{ a: a0 + 0.05, board: true, via: "zoom" }, { a: dep, k: "o_limpio", via: "portal", q: [960, 540] }], fx: (t) => [
    <LowerThird t={t} at={a0 + 0.1} out={dep - 0.3} name="CLAUDIO" l2="30 AÑOS DE OFICIO" l2at={tre} />,
    <BigNum t={t} at={tre} text="30 AÑOS" x={960} y={380} size={200} col={COL.amber} edge="#5a3a10" out={dep - 0.3} />,
    <Chips t={t} at={fum} items={["FUMIGADOR", "ALBAÑIL", "MANTENIMIENTO"]} out={dep - 0.3} y={640} />,
    <Line t={t} at={dep + 0.2} out={ge(i) + 0.3} text="BAÑOS COMO NUEVOS" y={900} size={76} col={GREEN} />,
  ] }); }

// G7 · inodoros perfectos dados por perdidos · el portero viejo · "déjalo dormir"
{ const i = 7, a0 = gs(i), per = G(i, "daba por perdidos"), por = G(i, "hasta que un portero"), fro = G(i, "no lo frotes");
  S({ i, beats: [
    { a: a0 + 0.05, via: "whip", w: { A: RING, B: push(RING, 0.15), ev: (t) => ({ hi: win(t, per, per + 0.5) }) } },
    { a: por, k: "o_portero", via: "portal", q: PT.ring },
  ], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={per - 0.1} text="SIN UNA FISURA" y={130} size={80} col={GREEN} />,
    <Stamp t={t} at={per + 0.2} text="¿DADO POR PERDIDO?" x={960} y={820} rot={-6} size={90} out={por - 0.3} />,
    <Tag t={t} at={G(i, "12 pisos")} x={1100} y={420} dx={220} dy={-160} text="EDIFICIO DE 12 PISOS" col={COL.amber} out={fro - 0.3} size={48} />,
    <Note t={t} at={fro} out={ge(i) + 0.3} text="No lo frotes, déjalo dormir." x={1400} y={380} />,
  ] }); }

// G8 · a la mañana salió con una pasada · el libro
{ const i = 8, a0 = gs(i), pas = G(i, "una pasada"), rap = G(i, "rápido mientras"), lib = G(i, "en un libro");
  S({ i, beats: [
    { a: a0 + 0.05, via: "whip", w: { A: RING, B: push(RING, 0.1), ev: (t) => ({ day: 0.95, brush: win(t, pas, pas + 1.3), brown: 1 - win(t, pas, pas + 1.2), cal: 1 - 0.8 * win(t, pas, pas + 1.2), cloud: 0.4 * (1 - win(t, pas, pas + 1)), lift: 0.6 * (1 - win(t, pas + 0.5, pas + 1.5)) }) } },
    { a: rap, board: true, via: "zoom" },
  ], fx: (t) => [
    <Sticker t={t} at={a0 + 0.1} out={pas - 0.1} x={1440} y={330} icon="luna" text="A LA MAÑANA" col="#2f5f8f" />,
    <Line t={t} at={pas} out={rap - 0.3} text="UNA SOLA PASADA" y={130} size={86} col={GREEN} />,
    <Line t={t} at={rap + 0.1} out={lib - 0.2} text="RÁPIDO, MIENTRAS TE TENGO AQUÍ" y={130} size={66} col={COL.amber} />,
    <Book3D t={t} at={lib - 0.3} open={1e9} out={ge(i) + 0.3} page="guia_p10.png" label="TODO LO QUE APRENDÍ EN 30 AÑOS" />,
  ] }); }

// G9 · página 10 (este anillo) · página 9 (la mugre negra del borde)
{ const i = 9, a0 = gs(i), p10 = G(i, "en la página 10"), rec = G(i, "con la receta"), p9 = G(i, "y en la página 9");
  S({ i, beats: [{ a: a0 + 0.05, board: true, via: "zoom" }], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={p10 - 0.2} text="CADA UNO CON SU MEDIDA EXACTA" y={130} size={62} col={COL.amber} />,
    <Book3D t={t} at={a0 - 0.2} open={p10 + 0.1} out={p9 - 0.1} page="guia_p10.png" mark={[0.06, 0.3, 0.88, 0.32]} markAt={rec} label="PÁGINA 10" />,
    <Book3D t={t} at={p9} open={p9 + 0.4} out={ge(i) + 0.3} page="guia_p9.png" label="PÁGINA 9 · LA DE AL LADO" />,
  ] }); }

// G10 · menos que una visita del plomero · el enlace en la 1ª línea · el QR
{ const i = 10, a0 = gs(i), enl = G(i, "el enlace está"), esc = G(i, "escanea"), sie = G(i, "y los 7 pasos");
  S({ i, beats: [{ a: a0 + 0.05, k: "o_plomero", via: "whip" }, { a: enl, board: true, via: "zoom" }], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={enl - 0.3} text="CUESTA MENOS QUE UNA VISITA DEL PLOMERO" y={900} size={58} col={COL.amber} />,
    <DescBox t={t} at={enl} out={ge(i) + 0.3} qrAt={esc} />,
    <Line t={t} at={sie} out={ge(i) + 0.3} text="+ LOS 7 PASOS DE HOY" y={110} size={66} col={GREEN} />,
  ] }); }

// G11 · PASO 1 · son dos capas · abajo el sarro (la cal del agua)
{ const i = 11, a0 = gs(i), dos = G(i, "son dos capas"), aba = G(i, "abajo"), sar = G(i, "el sarro");
  S({ i, beats: [{ a: a0 + 0.05, via: "whip", w: { A: MACRO, B: push(MACRO, 0.12), ev: (t) => ({ hi: win(t, dos, dos + 0.5), brown: 1 - 0.7 * win(t, aba, aba + 0.6) }) } }], fx: (t) => [
    <StepTitle t={t} at={a0 + 0.1} out={ge(i) + 0.2} n={1} text="QUÉ ES ESE ANILLO" />,
    <Line t={t} at={dos} out={ge(i) + 0.2} text="SON DOS CAPAS" y={900} size={84} col={COL.amber} />,
    RT(t, PT.ring, -320, 160, "ABAJO: SARRO", sar, ge(i) + 0.2, COL.ice, 52, "LA CAL DEL AGUA"),
  ], out: PT.ring }); }

// G12 · como la olla · día tras día, costrita áspera · encima se agarra todo
{ const i = 12, a0 = gs(i), dia = G(i, "día tras día"), enc = G(i, "encima se");
  S({ i, beats: [
    { a: a0 + 0.05, k: "m_olla", via: "zoom" },
    { a: dia, via: "portal", q: [960, 540], w: { A: MACROB, B: push(MACROB, 0.1), ev: (t) => ({ brown: win(t, enc, enc + 1.5), cal: 0.3 + 0.7 * win(t, dia, enc), hi: win(t, dia, dia + 0.5) }) } },
  ], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={dia - 0.2} text="EL BORDE BLANCO DE LA OLLA" y={900} size={70} col={COL.ice2} />,
    <Line t={t} at={dia} out={enc - 0.1} text="AÑO TRAS AÑO: COSTRA ÁSPERA" y={130} size={72} col={COL.ice} />,
    <Line t={t} at={enc} out={ge(i) + 0.2} text="Y ENCIMA SE AGARRA TODO" y={130} size={76} col={COL.amber} />,
  ], out: PT.ring }); }

// G13 · la capa marrón · el cloro sólo le saca el color · frotar no sirve
{ const i = 13, a0 = gs(i), clo = G(i, "el cloro le saca"), cos = G(i, "pero la costra"), sem = G(i, "a la semana"), fro = G(i, "por eso frotar");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "zoom" },
    { a: clo, via: "portal", q: [960, 540], w: { A: RING, B: push(RING, 0.12), ev: (t) => ({ brown: 1 - 0.65 * win(t, clo + 0.3, clo + 1.3) + 0.65 * win(t, sem, sem + 1) }) } },
  ], fx: (t) => [
    <Section t={t} at={a0 + 0.05} out={clo - 0.2} mode="capas" labels={[a0 + 0.2, a0 + 1.0, a0 + 1.6]} />,
    <Line t={t} at={clo} out={sem - 0.1} text="EL CLORO SÓLO LE SACA EL COLOR" y={130} size={64} col={COL.ice2} />,
    <Line t={t} at={sem} out={fro - 0.1} text="A LA SEMANA: MARRÓN OTRA VEZ" y={130} size={66} col={COL.amber} />,
    <Stamp t={t} at={fro} text="FROTAR NO SIRVE" x={960} y={840} rot={-6} size={100} out={ge(i) + 0.3} />,
  ], out: PT.ring }); }

// G14 · PASO 2 · la prueba de la tarjeta (2 segundos)
{ const i = 14, a0 = gs(i), seg = G(i, "en dos segundos"), gua = G(i, "ponte el guante"), cm = G(i, "un centímetro");
  S({ i, beats: [
    { a: a0 + 0.05, via: "whip", w: { A: MACROB, B: push(MACROB, 0.1), ev: (t) => ({ hi: win(t, a0, a0 + 0.6) }) } },
    { a: gua, k: "c_tarjeta", via: "portal", q: PT.ring },
  ], fx: (t) => [
    <StepTitle t={t} at={a0 + 0.1} out={ge(i) + 0.2} n={2} text="LA PRUEBA DE LA TARJETA" />,
    <Sticker t={t} at={seg} out={gua - 0.2} x={1440} y={330} icon="reloj" text="2 SEGUNDOS" col="#2f5f8f" />,
    <Line t={t} at={cm} out={ge(i) + 0.2} text="SUAVE · UN CENTÍMETRO" y={900} size={72} col={COL.amber} />,
  ] }); }

// G15 · blanda = 1 noche · dura y gris = sarro viejo
{ const i = 15, a0 = gs(i), pat = G(i, "si la tarjeta patina");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: MACRO, B: push(MACRO, 0.1), ev: (t) => ({ card: 1 - win(t, pat - 0.6, pat - 0.2), lift: 0.4 * win(t, a0, a0 + 1.5) }) } },
    { a: pat, via: "zoom", c: (t) => <Versus t={t} at={pat - 0.1} out={1e9} l="BLANDA" r="DURA, GRIS" sl="CAPA DE ARRIBA · 1 NOCHE" sr="SARRO VIEJO DE VERDAD" /> },
  ], fx: (t) => [
    <Sticker t={t} at={G(i, "en una sola noche")} out={pat - 0.2} x={1440} y={330} icon="luna" text="EN UNA SOLA NOCHE" col="#2f5f8f" />,
  ] }); }

// G16 · la raya negra dentro del esmalte = desgaste
{ const i = 16, a0 = gs(i), met = G(i, "metida dentro"), des = G(i, "es desgaste"), nin = G(i, "ningún truco");
  S({ i, beats: [{ a: a0 + 0.05, k: "o_esmalte", via: "whip" }], fx: (t) => [
    <Line t={t} at={a0 + 0.2} out={met - 0.1} text="UNA RAYA NEGRA FINA" y={130} size={76} col={COL.ink} />,
    <Line t={t} at={met} out={des - 0.1} text="METIDA DENTRO DEL ESMALTE" y={130} size={72} col={COL.amber} />,
    <Stamp t={t} at={des} text="DESGASTE, NO MUGRE" x={960} y={500} rot={-6} size={96} out={ge(i) + 0.3} />,
    <Line t={t} at={nin} out={ge(i) + 0.3} text="NINGÚN TRUCO LO DEVUELVE" y={900} size={66} col={COL.red} />,
  ] }); }

// G17 · PASO 3 · qué pastilla sirve · el reverso de la caja
{ const i = 17, a0 = gs(i), nom = G(i, "no te voy a decir"), mir = G(i, "lo que tienes que mirar"), let_ = G(i, "la letra chiquita"), bus = G(i, "busca dos palabras");
  S({ i, beats: [
    { a: a0 + 0.05, via: "whip", w: { A: SINK, B: push(SINK, 0.15), ev: () => ({}) } },
    { a: mir, k: "c_caja", via: "portal", q: PT.box },
    { a: let_, k: "o_caja_atras", via: "zoom" },
  ], fx: (t) => [
    <StepTitle t={t} at={a0 + 0.1} out={mir - 0.2} n={3} text="QUÉ PASTILLA SIRVE" />,
    <Line t={t} at={G(i, "que no son todas")} out={nom - 0.1} text="NO SON TODAS IGUALES" y={900} size={72} col={COL.amber} />,
    <Line t={t} at={nom} out={mir - 0.2} text="SIN MARCAS: CAMBIAN DE PAÍS A PAÍS" y={900} size={58} col={COL.ink} />,
    <Line t={t} at={let_ + 0.2} out={bus - 0.1} text="EL REVERSO · LA LETRA CHIQUITA" y={130} size={64} col={COL.ice2} />,
    <Line t={t} at={bus} out={ge(i) + 0.3} text="BUSCA 2 PALABRAS" y={130} size={86} col={COL.amber} />,
  ] }); }

// G18 · las burbujitas = oxígeno que levanta la capa marrón · la segunda: enzimas
{ const i = 18, a0 = gs(i), bur = G(i, "las burbujitas"), lev = G(i, "levanta la capa"), seg = G(i, "la segunda es");
  S({ i, beats: [{ a: a0 + 0.05, via: "zoom", w: { A: RING, B: push(RING, 0.15), ev: (t) => ({ tab: 1 - win(t, lev, lev + 1.5), tabDrop: win(t, a0, a0 + 0.8), bub: win(t, a0 + 0.5, bur), eat: win(t, bur, lev), lift: win(t, lev, lev + 2), brown: 1 - 0.4 * win(t, lev, seg) }) } }], fx: (t) => [
    RT(t, PT.ring, 240, -170, "BURBUJAS = OXÍGENO", bur, seg - 0.2, COL.ice, 52),
    <Line t={t} at={lev} out={seg - 0.1} text="LEVANTA LA CAPA MARRÓN" y={900} size={70} col={COL.amber} />,
    <BigNum t={t} at={seg} text="2 · ENZIMAS" x={960} y={820} size={120} col={GREEN} edge="#1f5a36" out={ge(i) + 0.3} />,
  ], out: PT.ring }); }

// G19 · + ácido cítrico · gel, líquidas, sólo abrillantador: no
{ const i = 19, a0 = gs(i), aci = G(i, "ácido cítrico"), gel = G(i, "las pastillas de gel");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: MACROB, B: push(MACROB, 0.1), ev: (t) => ({ eat: win(t, aci, aci + 0.6), cal: 1 - 0.3 * win(t, aci, gel), hi: win(t, aci, aci + 0.5) }) } },
    { a: gel, k: "o_gel", via: "whip" },
  ], fx: (t) => [
    <Line t={t} at={aci} out={gel - 0.2} text="+ ÁCIDO CÍTRICO: MEJOR TODAVÍA" y={130} size={66} col={GREEN} />,
    RT(t, PT.ring, -300, 170, "ABLANDA LA CAL", G(i, "le va ablandando"), gel - 0.2, COL.ice, 50),
    <Line t={t} at={gel + 0.1} out={ge(i) + 0.3} text="GEL · LÍQUIDAS · SÓLO ABRILLANTADOR" y={900} size={58} col={COL.red} />,
  ] }); }

// G20 · una sola alcanza · PASO 4 · en la taza, nunca en el tanque
{ const i = 20, a0 = gs(i), mas = G(i, "más no limpia"), n4 = G(i, "número 4"), taz = G(i, "va en la taza"), tan = G(i, "nunca en el tanque");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "zoom" },
    { a: n4, via: "whip", w: { A: OV, keys: [[taz + 0.6, RING], [tan - 0.2, RING], [tan + 0.8, TANK]], B: push(TANK, 0.1), ev: (t) => ({ hi: win(t, taz, taz + 0.5) * (1 - win(t, tan, tan + 0.5)), tank: win(t, tan, tan + 0.6), puck: 0 }) } },
  ], fx: (t) => [
    <Dose t={t} rows={[{ at: a0 + 0.1, n: 1, text: "UNA ALCANZA" }, { at: G(i, "poner tres"), n: 3, text: "NO HACE FALTA" }]} out={n4 - 0.3} />,
    <Line t={t} at={mas} out={n4 - 0.3} text="MÁS NO LIMPIA MÁS, SÓLO HACE ESPUMA" y={900} size={56} col={COL.amber} />,
    <StepTitle t={t} at={n4} out={ge(i) + 0.2} n={4} text="LA HORA Y EL LUGAR" />,
    <Line t={t} at={taz} out={tan - 0.1} text="EN LA TAZA, EN EL AGUA" y={900} size={72} col={GREEN} />,
    <Line t={t} at={tan} out={ge(i) + 0.3} text="NUNCA EN EL TANQUE DE ATRÁS" y={900} size={68} col={COL.red} />,
  ], out: PT.tank }); }

// G21 · gotea y sube la cuenta · en la taza sí, de noche · el truco es el tiempo
{ const i = 21, a0 = gs(i), taz = G(i, "en la taza sí"), noc = G(i, "y va de noche"), tru = G(i, "el truco es");
  S({ i, beats: [
    { a: a0 + 0.05, k: "o_gomas", via: "zoom" },
    { a: taz, via: "portal", q: [960, 540], w: { A: CLOCK, B: push(CLOCK, 0.12), ev: (t) => ({ day: 0.85 - 0.7 * win(t, noc, noc + 0.8), hour: 22 + 2 * win(t, tru, ge(i)), glow: win(t, noc, noc + 0.4) }) } },
  ], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={taz - 0.2} text="GOTEA · TE SUBE LA CUENTA DEL AGUA" y={900} size={60} col={COL.red} />,
    <Sticker t={t} at={noc} out={tru - 0.1} x={1440} y={330} icon="luna" text="DE NOCHE" col="#2f5f8f" />,
    <Line t={t} at={G(i, "el último")} out={tru - 0.1} text="DESPUÉS DEL ÚLTIMO DE LA CASA" y={900} size={60} col={COL.ink} />,
    <Line t={t} at={tru} out={ge(i) + 0.2} text="EL TRUCO ES EL TIEMPO" y={900} size={80} col={COL.amber} />,
  ], out: PT.clock }); }

// G22 · tiraste la pastilla · el papelito "no descargar" · el detalle del portero
{ const i = 22, a0 = gs(i), peg = G(i, "yo le pego"), nod = G(i, "no descargar"), tre = G(i, "3 de la mañana"), det = G(i, "y aquí va");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: TOP, B: push(TOP, 0.1), ev: (t) => ({ day: 0.2, flush: win(t, a0, a0 + 0.4) * (1 - win(t, a0 + 2, a0 + 2.6)), tab: 1 - win(t, a0, a0 + 0.6) }) } },
    { a: peg, k: "c_nota", via: "portal", q: PT.ring },
    { a: det, board: true, via: "zoom" },
  ], fx: (t) => [
    <Stamp t={t} at={a0 + 0.2} text="TIRASTE LA PASTILLA" x={960} y={820} rot={-6} size={96} out={peg - 0.3} />,
    <Note t={t} at={nod} out={det - 0.2} text="NO DESCARGAR" x={1400} y={380} />,
    <Sticker t={t} at={tre} out={det - 0.2} x={300} y={330} icon="reloj" text="3 DE LA MAÑANA" col="#2f5f8f" />,
    <Line t={t} at={det} out={ge(i) + 0.3} text="EL DETALLE DEL PORTERO" y={500} size={96} col={COL.amber} />,
  ] }); }

// G23 · tirada así nomás se va al fondo · el jarro con agua caliente (nunca hirviendo)
{ const i = 23, a0 = gs(i), fon = G(i, "se va al fondo"), jar = G(i, "en un jarro"), cal = G(i, "agua caliente"), hir = G(i, "nunca hirviendo"), dis = G(i, "disuelves");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: RING, B: push(RING, 0.12), ev: (t) => ({ tab: 1 - win(t, jar - 1, jar), tabDrop: win(t, a0, fon + 0.8), bub: 0.5 * win(t, fon, fon + 0.6) }) } },
    { a: jar, k: "c_jarro", via: "whip" },
    { a: dis, k: "p_jarro", via: "zoom" },
  ], fx: (t) => [
    RT(t, PT.drain, 260, 120, "SE VA AL FONDO", fon, jar - 0.2, COL.red, 52),
    <Line t={t} at={G(i, "casi no toca")} out={jar - 0.2} text="Y CASI NO TOCA LA LÍNEA" y={130} size={72} col={COL.amber} />,
    <Thermo t={t} at={cal} x={1640} y={260} from={20} to={45} out={ge(i) + 0.2} />,
    <Line t={t} at={hir} out={dis - 0.1} text="QUE TE LA AGUANTE LA MANO · NUNCA HIRVIENDO" y={900} size={52} col={COL.red} />,
    <Line t={t} at={dis} out={ge(i) + 0.3} text="DISUELVES LA PASTILLA" y={900} size={70} col={COL.ice2} />,
  ] }); }

// G24 · en círculo desde el borde, que bañe el anillo · una pasada suave
{ const i = 24, a0 = gs(i), cir = G(i, "en círculo"), mez = G(i, "para que la mezcla"), cep = G(i, "si tienes un cepillo");
  S({ i, beats: [
    { a: a0 + 0.05, k: "c_echar", via: "whip" },
    { a: mez, via: "portal", q: [960, 540], w: { A: RING, B: push(RING, 0.12), ev: (t) => ({ pour: win(t, mez - 0.3, cep), cloud: win(t, mez, cep), bub: win(t, mez, mez + 0.6), eat: win(t, mez + 0.4, mez + 1), brush: win(t, cep + 0.4, cep + 1.8) }) } },
  ], fx: (t) => [
    <Line t={t} at={cir} out={mez - 0.1} text="EN CÍRCULO, DESDE EL BORDE DE ARRIBA" y={130} size={60} col={COL.amber} />,
    RT(t, PT.ring, 260, -170, "BAÑA EL ANILLO ENTERO", G(i, "bañe el anillo"), cep - 0.1, COL.ice, 50),
    <Line t={t} at={cep} out={ge(i) + 0.2} text="UNA PASADA SUAVE PARA REPARTIRLA" y={900} size={62} col={COL.ink} />,
  ], out: PT.ring }); }

// G25 · el calor raja la porcelana · PASO 5 · la noche hace el trabajo · de abajo hacia arriba
{ const i = 25, a0 = gs(i), raj = G(i, "un inodoro rajado"), n5 = G(i, "número 5"), dur = G(i, "mientras duermes"), aba = G(i, "de abajo hacia");
  S({ i, beats: [
    { a: a0 + 0.05, board: true, via: "zoom" },
    { a: n5, via: "whip", w: { A: CLOCK, keys: [[dur - 0.2, CLOCK], [dur + 0.9, MACRO]], B: push(MACRO, 0.1), ev: (t) => ({ day: 0.12, glow: 1, hour: 22 + 8 * win(t, n5, ge(i) + 15), bub: win(t, dur, dur + 0.5), eat: win(t, dur, dur + 0.6), lift: win(t, aba, aba + 3), brown: 1 - 0.4 * win(t, aba, aba + 4) }) } },
  ], fx: (t) => [
    <Stamp t={t} at={a0 + 0.1} text="EL CALOR RAJA LA PORCELANA" x={960} y={480} rot={-5} size={84} out={n5 - 0.3} />,
    <Line t={t} at={raj} out={n5 - 0.3} text="UN INODORO RAJADO NO TIENE ARREGLO" y={900} size={58} col={COL.red} />,
    <StepTitle t={t} at={n5} out={ge(i) + 0.2} n={5} text="LA NOCHE HACE EL TRABAJO" />,
    <Line t={t} at={aba} out={ge(i) + 0.2} text="DE ABAJO HACIA ARRIBA" y={900} size={76} col={COL.ice} />,
  ], out: PT.ring }); }

// G26 · oxígeno + enzimas + ácido suave · a la mañana: agua turbia y hojuelas
{ const i = 26, a0 = gs(i), com = G(i, "se van comiendo"), aci = G(i, "y el ácido suave"), man = G(i, "a la mañana");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: MACROB, B: push(MACROB, 0.12), ev: (t) => ({ day: 0.12, glow: 0.6, hour: 26 + 4 * win(t, a0, man), bub: 1, eat: 1, lift: 0.6 + 0.4 * win(t, a0, man), brown: 0.6 - 0.3 * win(t, a0, man), cal: 1 - 0.3 * win(t, aci, man), cloud: 0.5 }) } },
    { a: man, k: "c_manana", via: "rise" },
  ], fx: (t) => [
    <Equation t={t} parts={[{ at: a0 + 0.1, text: "OXÍGENO", col: COL.ice }, { at: com, text: "ENZIMAS", col: GREEN }, { at: aci, text: "ÁCIDO SUAVE", col: COL.amber }]} out={man - 0.2} y={780} />,
    <Line t={t} at={G(i, "un poco turbia")} out={ge(i) + 0.3} text="AGUA TURBIA + HOJUELAS MARRONES" y={900} size={60} col={COL.amber} />,
  ] }); }

// G27 · no tires la cadena todavía · ¿por qué de noche? la pastilla es lenta
{ const i = 27, a0 = gs(i), por = G(i, "y por qué de noche"), len = G(i, "es lenta");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: TOP, B: push(TOP, 0.12), ev: () => ({ day: 0.95, cloud: 0.6, lift: 1, brown: 0.35 }) } },
    { a: por, via: "zoom", c: (t) => <Versus t={t} at={por - 0.1} out={1e9} l="1 MINUTO" r="TODA LA NOCHE" sl="UN ÁCIDO QUE QUEMA" sr="LA PASTILLA: LENTA" /> },
  ], fx: (t) => [
    <Stamp t={t} at={a0 + 0.1} text="NO TIRES LA CADENA TODAVÍA" x={960} y={840} rot={-5} size={80} out={por - 0.3} />,
    <Line t={t} at={len} out={ge(i) + 0.3} text="ES LENTA" y={130} size={90} col={COL.amber} />,
  ] }); }

// G28 · el portero: 40 baños el viernes, media hora para 40 inodoros
{ const i = 28, a0 = gs(i), sab = G(i, "y el sábado"), med = G(i, "media hora para");
  S({ i, beats: [{ a: a0 + 0.05, k: "o_edificio", via: "whip" }], fx: (t) => [
    <Sticker t={t} at={G(i, "el viernes")} out={sab - 0.1} x={1440} y={330} icon="luna" text="VIERNES A LA NOCHE" col="#2f5f8f" />,
    <Sticker t={t} at={sab} out={med - 0.1} x={1440} y={330} icon="reloj" text="SÁBADO: PISO POR PISO" col="#8f5a2a" />,
    <BigNum t={t} at={med} text="40 INODOROS" sub="MEDIA HORA" x={960} y={480} size={170} col={COL.ink} out={ge(i) + 0.3} />,
  ] }); }

// G29 · PASO 6 · la pasada de la mañana: guantes, el cepillo de siempre, una vuelta firme
{ const i = 29, a0 = gs(i), gua = G(i, "guantes otra vez"), dal = G(i, "y dale una sola"), vas = G(i, "vas a ver que");
  S({ i, beats: [
    { a: a0 + 0.05, k: "c_cepillo", via: "whip" },
    { a: dal, via: "portal", q: [960, 540], w: { A: RING, B: push(RING, 0.12), ev: (t) => ({ day: 0.95, brush: win(t, dal + 0.3, vas), brown: 0.35 * (1 - win(t, dal + 0.3, vas)), cal: 1 - 0.5 * win(t, dal + 0.3, vas), lift: 0.5 }) } },
    { a: vas, k: "p_pasada", via: "zoom" },
  ], fx: (t) => [
    <StepTitle t={t} at={a0 + 0.1} out={ge(i) + 0.2} n={6} text="LA PASADA DE LA MAÑANA" />,
    <Chips t={t} at={gua} items={["GUANTES", "EL CEPILLO DE SIEMPRE"]} out={dal - 0.2} y={880} />,
    <Line t={t} at={dal} out={ge(i) + 0.2} text="UNA VUELTA FIRME, SIN FUERZA DE MÁS" y={900} size={58} col={COL.amber} />,
  ] }); }

// G30 · capa de arriba: ya está · línea gris y áspera = sarro viejo → sin agua
{ const i = 30, a0 = gs(i), gri = G(i, "una línea gris"), sin = G(i, "sin agua");
  S({ i, beats: [{ a: a0 + 0.05, via: "zoom", w: { A: RING, B: push(RING, 0.15), ev: (t) => ({ day: 0.95, brown: 0, cal: 1, hi: win(t, gri, gri + 0.5), level: 1 - 0.85 * win(t, sin, sin + 1.2) }) } }], fx: (t) => [
    <Stamp t={t} at={a0 + 0.2} text="YA ESTÁ" x={1400} y={300} rot={-8} size={110} col="#2f9e5f" out={gri - 0.2} />,
    RT(t, PT.ring, -300, 170, "GRIS, ÁSPERA: SARRO VIEJO", gri, ge(i) + 0.2, COL.ice2, 50, "EL DE 10 AÑOS"),
    <Line t={t} at={sin} out={ge(i) + 0.2} text="A ESE: SIN AGUA" y={130} size={86} col={COL.ice} />,
  ], out: PT.valve }); }

// G31 · con un vaso hasta que la línea quede al aire · otra noche: papel con vinagre como vendaje
{ const i = 31, a0 = gs(i), otr = G(i, "ahí otra noche"), pap = G(i, "papel higiénico"), ven = G(i, "como un vendaje");
  S({ i, beats: [
    { a: a0 + 0.05, k: "c_vaso", via: "whip" },
    { a: otr, via: "portal", q: [960, 540], w: { A: RING, B: push(RING, 0.12), ev: (t) => ({ day: 0.12, glow: 0.6, brown: 0, level: 0.15, paper: win(t, pap, pap + 1.4) }) } },
    { a: ven, k: "c_papel", via: "zoom" },
  ], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={otr - 0.2} text="HASTA QUE LA LÍNEA QUEDE AL AIRE" y={900} size={60} col={COL.ice} />,
    <Sticker t={t} at={otr} out={ven - 0.1} x={1440} y={330} icon="luna" text="OTRA NOCHE" col="#2f5f8f" />,
    RT(t, PT.ring, 260, -170, "PAPEL + VINAGRE BLANCO", pap, ven - 0.1, COL.ink, 50),
    <Line t={t} at={ven} out={ge(i) + 0.3} text="PEGADO HASTA LA MAÑANA" y={900} size={66} col={COL.amber} />,
  ] }); }

// G32 · la pómez la deshace como tiza · otra noche distinta · nunca vinagre + pastilla
{ const i = 32, a0 = gs(i), pero = G(i, "pero eso"), nun = G(i, "nunca el vinagre"), n7 = G(i, "número 7");
  S({ i, beats: [
    { a: a0 + 0.05, k: "c_pomez", via: "whip" },
    { a: pero, via: "zoom", c: (t) => <Versus t={t} at={pero - 0.1} out={1e9} l="NOCHE 1" r="NOCHE 2" sl="LA PASTILLA" sr="EL VINAGRE" /> },
  ], fx: (t) => [
    <Line t={t} at={G(i, "como tiza")} out={pero - 0.2} text="SE DESHACE COMO TIZA" y={900} size={72} col={COL.ice2} />,
    <Stamp t={t} at={nun} text="NUNCA JUNTOS" x={960} y={180} rot={-5} size={100} out={n7 - 0.1} />,
    <BigNum t={t} at={n7} text="PASO 7" x={960} y={520} size={180} col={COL.amber} edge="#5a3a10" out={ge(i) + 0.3} />,
  ] }); }

// G33 · PASO 7 · una por semana · el baño de visitas es el peor
{ const i = 33, a0 = gs(i), sem = G(i, "una vez por semana"), bano = G(i, "si tienes un baño"), peo = G(i, "ese es el peor");
  S({ i, beats: [
    { a: a0 + 0.05, via: "whip", w: { A: CLOCK, B: push(CLOCK, 0.1), ev: (t) => ({ day: 0.15, glow: 1, hour: 22 + 8 * win(t, sem, bano), brown: 0, cal: 0 }) } },
    { a: bano, k: "o_visitas_bano", via: "portal", q: PT.clock },
  ], fx: (t) => [
    <StepTitle t={t} at={a0 + 0.1} out={bano - 0.2} n={7} text="QUE NO VUELVA" col={GREEN} />,
    <Sticker t={t} at={sem} out={bano - 0.2} x={1440} y={330} icon="luna" text="1 VEZ POR SEMANA" col="#2f5f8f" />,
    <Stamp t={t} at={peo} text="EL PEOR" x={1400} y={320} rot={-8} size={110} out={ge(i) + 0.3} />,
    <Line t={t} at={G(i, "se queda quieta")} out={ge(i) + 0.3} text="EL AGUA QUIETA DÍAS" y={900} size={70} col={COL.amber} />,
  ] }); }

// G34 · 10 segundos de cepillo, sin producto · ahora los errores
{ const i = 34, a0 = gs(i), sin = G(i, "sin producto"), asi = G(i, "así la cal"), err = G(i, "ahora los errores");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: RING, B: push(RING, 0.1), ev: (t) => ({ day: 0.95, brown: 0, cal: 0, brush: win(t, a0 + 0.2, a0 + 1.6) }) } },
    { a: err, board: true, via: "zoom" },
  ], fx: (t) => [
    <Habits t={t} items={[{ at: Wt(34, "descárgalo"), text: "DESCARGAR EL DE VISITAS CADA DÍA" }, { at: sin, text: "CEPILLO SIN PRODUCTO, 10 SEG" }, { at: asi, text: "LA CAL NO SE PEGA" }]} out={err - 0.3} />,
    <Line t={t} at={err} out={ge(i) + 0.3} text="LOS ERRORES" y={460} size={140} col={COL.red} />,
    <Line t={t} at={G(i, "todas las semanas")} out={ge(i) + 0.3} text="LOS DE TODAS LAS SEMANAS EN LOS EDIFICIOS" y={680} size={52} col={COL.ink} />,
  ] }); }

// G35 · ERROR 1 · mezclar con cloro: gas · si hubo cloro, descarga varias veces
{ const i = 35, a0 = gs(i), gas = G(i, "hace un gas"), des = G(i, "descarga varias");
  S({ i, beats: [{ a: a0 + 0.05, k: "o_mezcla", via: "whip" }], fx: (t) => [
    <ErrorBanner t={t} at={a0 + 0.1} out={ge(i) + 0.2} n={1} text="MEZCLAR EL CLORO CON OTRO LIMPIADOR" />,
    <Line t={t} at={gas} out={des - 0.1} text="GAS QUE QUEMA LOS PULMONES" y={900} size={72} col={COL.red} />,
    <Line t={t} at={des} out={ge(i) + 0.3} text="¿HUBO CLORO? DESCARGA VARIAS VECES" y={900} size={62} col={COL.amber} />,
  ] }); }

// G36 · ERROR 2 · el ácido fuerte se come el brillo · ERROR 3 · la pómez seca
{ const i = 36, a0 = gs(i), bri = G(i, "se come el brillo"), dob = G(i, "el doble"), ter = G(i, "el tercero");
  S({ i, beats: [
    { a: a0 + 0.05, via: "whip", w: { A: MACROB, B: push(MACROB, 0.1), ev: (t) => ({ brown: 0, cal: 0, glaze: win(t, bri, bri + 1), hi: win(t, bri, bri + 0.5) }) } },
    { a: ter, k: "o_piedra", via: "zoom" },
  ], fx: (t) => [
    <ErrorBanner t={t} at={a0 + 0.1} out={ter - 0.2} n={2} text="EL ÁCIDO FUERTE DE FERRETERÍA" />,
    <Line t={t} at={bri} out={dob - 0.1} text="SE COME EL BRILLO DEL ESMALTE" y={900} size={64} col={COL.red} />,
    <BigNum t={t} at={dob} text="×2" sub="SE ENSUCIA EL DOBLE DE RÁPIDO" x={1400} y={520} size={180} col={COL.amber} edge="#5a3a10" out={ter - 0.2} />,
    <ErrorBanner t={t} at={ter} out={ge(i) + 0.2} n={3} text="LA PIEDRA PÓMEZ SECA" />,
  ] }); }

// G37 · ERROR 4 · alambre o espátula de metal: rayitas · y un regalo: los agujeritos del borde
{ const i = 37, a0 = gs(i), ray = G(i, "en cada rayita"), reg = G(i, "y un regalo");
  S({ i, beats: [
    { a: a0 + 0.05, k: "o_rayas", via: "whip" },
    { a: reg, via: "portal", q: [960, 540], w: { A: OV, B: HOLES, ev: (t) => ({ holes: 1, hi: 0 * t }) } },
  ], fx: (t) => [
    <ErrorBanner t={t} at={a0 + 0.1} out={reg - 0.2} n={4} text="ALAMBRE O ESPÁTULA DE METAL" />,
    <Line t={t} at={ray} out={reg - 0.2} text="EN CADA RAYITA SE VUELVE A PEGAR EL SARRO" y={900} size={54} col={COL.red} />,
    <Line t={t} at={reg} out={ge(i) + 0.3} text="Y UN REGALO" y={130} size={96} col={GREEN} />,
  ], out: PT.holes }); }

// G38 · el espejito: si están negros, el agua sale torcida · la misma noche, antes de la pastilla
{ const i = 38, a0 = gs(i), neg = G(i, "si están negros"), mis = G(i, "la misma noche");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: HOLES, B: push(HOLES, 0.12), ev: (t) => ({ holes: 1, flush: win(t, G(i, "el agua sale"), G(i, "el agua sale") + 0.4) * (1 - win(t, mis - 0.6, mis)) }) } },
    { a: mis, k: "c_agujeros", via: "portal", q: PT.holes },
  ], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={neg - 0.1} text="CON UN ESPEJITO DE MANO" y={900} size={70} col={COL.ice2} />,
    RT(t, PT.holes, 260, 170, "NEGROS = AGUA TORCIDA", neg, mis - 0.2, COL.red, 52),
    <Line t={t} at={mis} out={ge(i) + 0.3} text="LA MISMA NOCHE, ANTES DE LA PASTILLA" y={900} size={58} col={COL.amber} />,
  ] }); }

// G39 · a la mañana baja en cortina · la página 9 · hagamos la cuenta
{ const i = 39, a0 = gs(i), cor = G(i, "en cortina"), pag = G(i, "eso es la página"), cue = G(i, "y hagamos la cuenta");
  S({ i, beats: [
    { a: a0 + 0.05, via: "zoom", w: { A: TOP, B: push(TOP, 0.1), ev: (t) => ({ day: 0.95, holes: 0, brown: 0, cal: 0, curtain: win(t, cor - 0.8, cor) * (1 - win(t, pag - 0.3, pag)), flush: win(t, cor - 0.8, cor) * (1 - win(t, pag - 0.3, pag)) }) } },
    { a: pag, board: true, via: "zoom" },
  ], fx: (t) => [
    <Line t={t} at={cor} out={pag - 0.2} text="PAREJA, EN CORTINA" y={130} size={86} col={GREEN} />,
    <Book3D t={t} at={pag - 0.2} open={pag + 0.4} out={cue - 0.1} page="guia_p9.png" label="PÁGINA 9" />,
    <Line t={t} at={cue} out={ge(i) + 0.3} text="HAGAMOS LA CUENTA" y={500} size={110} col={COL.amber} />,
  ] }); }

// G40 · el plomero, el inodoro nuevo con instalación · la caja de pastillas
{ const i = 40, a0 = gs(i), nue = G(i, "un inodoro nuevo"), med = G(i, "medio día"), caj = G(i, "una caja de pastillas");
  S({ i, beats: [{ a: a0 + 0.05, k: "o_inodoro_nuevo", via: "whip" }, { a: caj, k: "o_caja_atras", via: "zoom", z: [1.14, 1.22] }], fx: (t) => [
    <Spent t={t} rows={[{ at: Wt(40, "te cobra la visita"), text: "LA VISITA DEL PLOMERO" }, { at: nue, text: "INODORO NUEVO + INSTALACIÓN" }, { at: med, text: "MEDIO DÍA SIN BAÑO" }]} totalAt={G(i, "mucha plata")} out={caj - 0.2} total="MUCHA PLATA" title="SI LO CAMBIAS" />,
    <Line t={t} at={caj} out={ge(i) + 0.3} text="UNA CAJA DE LAS COMUNES" y={900} size={72} col={GREEN} />,
  ] }); }

// G41 · una caja = todo el año · vinagre y pómez, menos que un café · no cambiaste nada
{ const i = 41, a0 = gs(i), vin = G(i, "el vinagre y la piedra"), nad = G(i, "no cambiaste nada");
  S({ i, beats: [{ a: a0 + 0.05, via: "zoom", w: { A: SINK, B: push(SINK, 0.15), ev: () => ({ day: 0.95, brown: 0, cal: 0 }) } }, { a: nad, k: "o_limpio", via: "portal", q: PT.box, z: [1.12, 1.2] }], fx: (t) => [
    <BigNum t={t} at={a0 + 0.1} text="1 CAJA = 1 AÑO" sub="Y TE SOBRA PARA EL LAVAVAJILLAS" x={960} y={460} size={150} col={COL.ink} out={vin - 0.2} />,
    <Line t={t} at={vin} out={nad - 0.2} text="VINAGRE + PÓMEZ: MENOS QUE UN CAFÉ" y={900} size={62} col={COL.amber} />,
    <Stamp t={t} at={nad} text="NO CAMBIASTE NADA" x={960} y={820} rot={-5} size={96} col="#2f9e5f" out={ge(i) + 0.3} />,
  ] }); }

// G42 · 2-3 noches si es de 10 años · agua dura: pozo o zona de cal
{ const i = 42, a0 = gs(i), cos = G(i, "es que la costra"), agu = G(i, "si el agua de tu casa");
  S({ i, beats: [
    { a: a0 + 0.05, via: "whip", w: { A: CLOCK, B: push(CLOCK, 0.1), ev: (t) => ({ day: 0.12, glow: 1, hour: 22 + 8 * (((t - a0) / 2.2) % 1) }) } },
    { a: agu, k: "o_pozo", via: "zoom" },
  ], fx: (t) => [
    <BigNum t={t} at={a0 + 0.1} text="2-3 NOCHES" sub="NO UNA" x={960} y={780} size={150} col={COL.ice} edge="#26405a" out={cos - 0.1} />,
    <Line t={t} at={cos} out={agu - 0.2} text="LA COSTRA ERA MÁS GRUESA" y={900} size={70} col={COL.amber} />,
    <Line t={t} at={G(i, "de pozo")} out={ge(i) + 0.3} text="AGUA DURA: POZO O ZONA DE CAL" y={900} size={62} col={COL.ice2} />,
  ] }); }

// G43 · la sombra que ni la pómez saca: mira de cerca, dentro del esmalte
{ const i = 43, a0 = gs(i), mir = G(i, "mira de cerca"), met = G(i, "si está metida");
  S({ i, beats: [{ a: a0 + 0.05, via: "zoom", w: { A: MACROB, B: push(MACROB, 0.2), ev: (t) => ({ day: 0.95, brown: 0.1, cal: 0, glaze: win(t, met, met + 0.8) }) } }], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={mir - 0.1} text="UNA SOMBRA QUE NI LA PÓMEZ SACA" y={130} size={62} col={COL.amber} />,
    <Line t={t} at={mir} out={met - 0.1} text="MIRA DE CERCA" y={130} size={90} col={COL.ink} />,
    RT(t, PT.ring, 260, -170, "DENTRO DEL ESMALTE = GASTADO", met, ge(i) + 0.2, COL.red, 48),
  ], out: PT.ring }); }

// G44 → G48 (con el avatar en recuadro): perfecto debajo · la lista completa · el repaso de los 7 pasos en el baño
{ const i = 44, a0 = gs(i), lis = G(i, "te dejo la lista"), tod = G(46, "eso es todo"), rep = G(46, "te lo repito");
  const r: number[] = []; r.push(at("1", rep)); for (let k = 2; k <= 7; k++) r.push(at(String(k), r[r.length - 1] + 0.1));
  const steps = ["DOS CAPAS: CAL Y MUGRE", "LA TARJETA TE DICE CUÁL", "OXÍGENO ACTIVO + ENZIMAS, UNA", "EN LA TAZA, DE NOCHE, PAPELITO", "DISUELTA, DESDE EL BORDE", "MAÑANA: UNA PASADA Y DESCARGA", "1 POR SEMANA · NUNCA CON CLORO"];
  S({ i, j: 49, pip: [45, 46, 47, 48], beats: [
    { a: a0 + 0.05, k: "o_cortina", via: "zoom" },
    { a: lis, k: "o_lista", via: "portal", q: [960, 540], z: [1.0, 1.04] },
    { a: tod, via: "zoom", w: { A: WIDE, keys: [[r[0] + 0.6, MACRO], [r[1] - 0.2, MACRO], [r[1] + 0.7, MACROB], [r[2] - 0.2, MACROB], [r[2] + 0.7, SINK], [r[3] - 0.2, SINK], [r[3] + 0.7, CLOCK], [r[4] - 0.2, CLOCK], [r[4] + 0.7, RING], [r[5] - 0.2, RING], [r[5] + 0.7, TOP], [r[6] - 0.2, TOP], [r[6] + 0.8, OV]],
      ev: (t) => ({ hi: win(t, r[0], r[0] + 0.5) * (1 - win(t, r[1], r[1] + 0.3)), card: win(t, r[1], r[1] + 0.4) * (1 - win(t, r[2] - 0.3, r[2])), jar: win(t, r[2], r[2] + 0.5), day: 0.85 - 0.7 * win(t, r[3], r[3] + 0.5) * (1 - win(t, r[5] - 0.3, r[5])), glow: win(t, r[3], r[3] + 0.4) * (1 - win(t, r[5], r[5] + 0.3)),
        pour: win(t, r[4], r[4] + 1.6), cloud: win(t, r[4], r[4] + 1) * (1 - win(t, r[5] + 0.5, r[6])), bub: win(t, r[4], r[4] + 0.5) * (1 - win(t, r[5], r[5] + 0.4)), lift: win(t, r[4] + 0.5, r[5] + 0.5),
        brown: 1 - win(t, r[5], r[5] + 1.2), cal: 1 - win(t, r[5], r[5] + 1.2), brush: win(t, r[5], r[5] + 1.3), flush: win(t, r[5] + 1.4, r[5] + 1.8) * (1 - win(t, r[6] - 0.3, r[6])) }) } },
  ], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={lis - 0.3} text="CASI SIEMPRE: PERFECTO DEBAJO" y={130} size={72} col={GREEN} />,
    <ListCard t={t} items={[
      { at: G(44, "una pastilla de lavavajillas"), text: "1 PASTILLA (OXÍGENO ACTIVO)" }, { at: Wt(45, "un jarro"), text: "UN JARRO DE AGUA CALIENTE" }, { at: Wt(45, "el cepillo del inodoro"), text: "EL CEPILLO DEL INODORO" },
      { at: G(45, "guantes de goma"), text: "GUANTES DE GOMA" }, { at: G(45, "una tarjeta"), text: "UNA TARJETA VIEJA" }, { at: G(45, "un papelito"), text: "EL PAPELITO \"NO DESCARGAR\"" },
      { at: G(45, "vinagre blanco"), text: "VINAGRE BLANCO" }, { at: Wt(46, "papel higiénico"), text: "PAPEL HIGIÉNICO" }, { at: Wt(46, "un vaso"), text: "UN VASO" }, { at: Wt(46, "una piedra"), text: "PIEDRA PÓMEZ MOJADA" },
    ]} out={tod - 0.3} />,
    <Line t={t} at={rep} out={r[0] - 0.1} text="TE LO REPITO RÁPIDO" y={130} size={76} col={COL.amber} />,
    <RecapRail t={t} at={r[0] - 0.2} out={ge(48) + 0.3} steps={r.map((a, k) => ({ at: a, text: steps[k] }))} />,
    ...[45, 46, 47, 48].map((n) => <Pip t={t} a={WIN[n].ms} b={WIN[n].me} />),
  ], out: [1520, 830] }); }

// G49 · nunca con cloro · ¿cuántos años tiene tu anillo? comentarios con tu país
{ const i = 49, a0 = gs(i), pre = G(i, "y ahora te pregunto"), pai = G(i, "con tu país");
  S({ i, beats: [{ a: a0 + 0.05, board: true, via: "zoom" }], fx: (t) => [
    <Stamp t={t} at={a0 + 0.1} text="NUNCA CON CLORO" x={960} y={480} rot={-5} size={110} out={pre - 0.2} />,
    <CommentType t={t} at={G(i, "cuántos años") - 0.2} out={ge(i) + 0.3} text="Mi anillo tiene 8 años y ya le probé de todo… (tu país)" y={560} />,
    <Line t={t} at={pai} out={ge(i) + 0.3} text="CON TU PAÍS · LOS LEO TODOS" y={300} size={60} col={COL.amber} />,
  ] }); }

// G50 · la mampara y el resto del baño: el libro en el primer enlace · guárdalo en el celular
{ const i = 50, a0 = gs(i), lib = G(i, "el libro está"), gua = G(i, "guárdalo en");
  S({ i, beats: [{ a: a0 + 0.05, board: true, via: "whip" }], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={lib - 0.1} text="EL BORDE · LA MAMPARA · EL RESTO DEL BAÑO" y={130} size={56} col={COL.ice2} />,
    <Book3D t={t} at={lib - 0.3} open={1e9} out={ge(i) + 0.3} page="guia_p9.png" label="EN EL PRIMER ENLACE" />,
    <Tag t={t} at={gua} x={1240} y={420} dx={200} dy={-150} text="GUÁRDALO EN EL CELULAR" col={COL.ice} out={ge(i) + 0.3} size={46} />,
  ] }); }

// G51 · la mampara blanca y opaca → vidrio · el anillo no se frota, se deja dormir
{ const i = 51, a0 = gs(i), ani = G(i, "el anillo del inodoro");
  S({ i, beats: [{ a: a0 + 0.05, board: true, via: "zoom" }, { a: ani, via: "portal", q: [960, 540], w: { A: RING, B: push(RING, 0.1), ev: () => ({ day: 0.2, glow: 0.8, hour: 23, brown: 0, cal: 0 }) } }], fx: (t) => [
    <Line t={t} at={a0 + 0.1} out={ani - 0.2} text="PRÓXIMO: LA MAMPARA BLANCA Y OPACA" y={460} size={70} col={COL.amber} />,
    <Line t={t} at={G(i, "el truco del portero")} out={ani - 0.2} text="→ OTRA VEZ VIDRIO" y={600} size={70} col={GREEN} />,
    <Line t={t} at={G(i, "no se frota")} out={ge(i) + 0.3} text="NO SE FROTA, SE DEJA DORMIR" y={130} size={80} col={GREEN} />,
  ], out: PT.ring }); }

// G52 · guantes, pastilla y no descargar
{ const i = 52, a0 = gs(i);
  S({ i, beats: [{ a: a0 + 0.05, via: "zoom", w: { A: OV, B: push(OV, 0.1), ev: () => ({ day: 0.15, glow: 1, hour: 22, brown: 0, cal: 0 }) } }], fx: (t) => [
    <EndCard t={t} at={a0 + 0.1} l1="GUANTES · PASTILLA" l2="Y NO DESCARGAR" />,
  ] }); }

// las ventanas del avatar a pantalla completa: piezas propias (las que no están en recuadro)
const WL = (n: number, f: string, text: string, y = 900, size = 66, col: string = COL.amber) => (t: number) => [<Line t={t} at={Wt(n, f)} out={WIN[n].me + 0.2} text={text} y={y} size={size} col={col} />];
const WFX: Record<number, (t: number) => React.ReactNode[]> = {
  6: WL(6, "sácala hoy", "PASTILLA DE CLORO DEL TANQUE: SÁCALA HOY", 900, 56, COL.red),
  7: (t) => [<BigNum t={t} at={Wt(7, "inodoros")} text="INODOROS" x={1460} y={420} size={110} col={COL.amber} edge="#5a3a10" out={WIN[7].me + 0.2} />],
  8: (t) => [<BigNum t={t} at={Wt(8, "40")} text="40 BAÑOS" x={1460} y={420} size={120} col={COL.ink} out={WIN[8].me + 0.2} />],
  9: (t) => [<Book3D t={t} at={Wt(9, "se llama") - 0.2} open={1e9} out={WIN[9].me + 0.3} page="guia_p10.png" x={1470} y={560} sc={0.72} />, <Line t={t} at={Wt(9, "94")} out={WIN[9].me + 0.3} text="94 ARREGLOS DE LA CASA" y={900} size={62} col={COL.amber} />],
  10: WL(10, "debajo del borde", "DEBAJO DEL BORDE, DONDE EL CEPILLO NO LLEGA", 900, 52),
  11: WL(11, "vamos al baño", "VAMOS AL BAÑO", 130, 80, GREEN),
  12: WL(12, "se queda quieta", "AGUA QUIETA = CAL EN LA ORILLA", 900, 64, COL.ice),
  13: (t) => [<Chips t={t} at={Wt(13, "el óxido")} items={["ÓXIDO", "MUGRE", "BABA FINA"]} out={WIN[13].me + 0.2} y={880} />],
  14: WL(14, "resbala", "EL CEPILLO RESBALA SOBRE UNA PIEDRA", 900, 58),
  15: WL(15, "pastita marrón", "PASTA BLANDA = LA CAPA DE ARRIBA", 900, 62),
  16: (t) => [<BigNum t={t} at={Wt(16, "el paso 6")} text="+ PASO 6" x={1460} y={420} size={120} col={COL.ice} edge="#26405a" out={WIN[16].me + 0.2} />],
  17: WL(17, "mejor saberlo", "MEJOR SABERLO HOY", 130, 80, GREEN),
  18: (t) => [<BigNum t={t} at={Wt(18, "percarbonato")} text="PERCARBONATO" sub="U OXÍGENO ACTIVO" x={1440} y={420} size={86} col={COL.ice} edge="#26405a" out={WIN[18].me + 0.2} />],
  19: (t) => [<Sticker t={t} at={Wt(19, "durante horas")} out={WIN[19].me + 0.2} x={1440} y={330} icon="reloj" text="DURANTE HORAS" col="#2f5f8f" />],
  20: (t) => [<Stamp t={t} at={Wt(20, "no sirven")} text="NO SIRVEN" x={1430} y={320} rot={7} size={96} out={WIN[20].me + 0.2} />, <Line t={t} at={Wt(20, "una sola pastilla")} out={WIN[20].me + 0.2} text="UNA SOLA ALCANZA" y={900} size={70} col={GREEN} />],
  21: WL(21, "las gomas", "RESECA LAS GOMAS DEL MECANISMO", 900, 60, COL.red),
  22: (t) => [<BigNum t={t} at={Wt(22, "6")} text="6-8 HORAS" sub="SIN DESCARGAR" x={1460} y={420} size={120} col={COL.ink} out={WIN[22].me + 0.2} />],
  23: WL(23, "en la orilla", "EN LA ORILLA, DONDE TERMINA EL AGUA", 900, 58),
  24: (t) => [<Sticker t={t} at={Wt(24, "un minuto")} out={WIN[24].me + 0.2} x={1440} y={330} icon="reloj" text="1 MINUTO" col="#8f5a2a" />],
  25: (t) => [<Stamp t={t} at={Wt(25, "nada de agua")} text="NADA DE AGUA HIRVIENDO" x={1400} y={320} rot={7} size={70} out={WIN[25].me + 0.2} />],
  26: WL(26, "una calcomanía", "COMO UNA CALCOMANÍA VIEJA", 900, 66, COL.ice2),
  27: (t) => [<Stamp t={t} at={Wt(27, "buena señal")} text="BUENA SEÑAL" x={1420} y={320} rot={-7} size={100} col="#2f9e5f" out={WIN[27].me + 0.2} />],
  28: WL(28, "cuanto más tiempo", "MÁS TIEMPO = MEJOR", 900, 76, GREEN),
  29: WL(29, "media hora en uno", "YO: MEDIA HORA EN UNO SOLO", 900, 66, COL.red),
  30: WL(30, "ahí sí", "AHÍ SÍ: DESCARGA", 130, 84, GREEN),
  31: WL(31, "la llave de paso", "CIERRA LA LLAVE DE PASO", 900, 70, COL.ice),
  32: WL(32, "siempre mojada", "PÓMEZ DE INODORO, SIEMPRE MOJADA", 900, 60, COL.ice),
  33: WL(33, "que no vuelva", "QUE NO VUELVA", 130, 86, GREEN),
  34: WL(34, "descárgalo", "DESCÁRGALO UNA VEZ AL DÍA", 900, 66),
  35: (t) => [<ErrorBanner t={t} at={Wt(35, "mezclar")} out={WIN[35].me + 0.3} n={1} text="MEZCLAR" />],
  36: (t) => [<ErrorBanner t={t} at={Wt(36, "el ácido fuerte")} out={WIN[36].me + 0.3} n={2} text="EL ÁCIDO FUERTE" />],
  37: WL(37, "la piedra seca", "SECA RAYA · MOJADA NO", 900, 72, COL.red),
  38: WL(38, "agujeritos", "LOS AGUJERITOS DEL BORDE", 900, 70, COL.ice),
  39: WL(39, "un cepillito", "UN CEPILLITO DE DIENTES VIEJO", 900, 66),
  40: WL(40, "te cobra la visita", "TE COBRA LA VISITA", 900, 70, COL.red),
  41: (t) => [<BigNum t={t} at={Wt(41, "3040")} text="30-40 PASTILLAS" sub="UNA ESTA NOCHE · UNA POR SEMANA" x={1440} y={420} size={96} col={COL.ink} out={WIN[41].me + 0.2} />],
  42: WL(42, "si tu anillo", "¿DE 10 AÑOS, DE LOS DUROS?", 900, 66, COL.ice2),
  43: (t) => [<Sticker t={t} at={Wt(43, "los domingos")} out={WIN[43].me + 0.2} x={1440} y={330} icon="luna" text="CADA DOMINGO, SIN FALTA" col="#2f5f8f" />],
  50: WL(50, "los 7 pasos", "LOS 7 PASOS: EN LA DESCRIPCIÓN", 900, 64),
  51: WL(51, "la mampara", "PRÓXIMO: LA MAMPARA", 130, 80),
};

// ---------- la cámara del baño: keyframes de todas las tomas 3D ----------
{
  const K: Key[] = [{ t: 60, ...WIDE }];
  SEGS.forEach((g) => g.beats.forEach((b, k) => {
    if (!b.w) return;
    const end = k + 1 < g.beats.length ? g.beats[k + 1].a : (g.j ? WIN[g.j].ms : ge(g.i));
    K.push({ t: b.a - TR - 0.3, ...b.w.A });
    (b.w.keys ?? []).forEach(([kt, P]) => K.push({ t: kt, ...P }));
    if (b.w.B) K.push({ t: end + 0.4, ...b.w.B });
  }));
  K.sort((a, b) => a.t - b.t);
  CAM2 = makeCam(K);
}
const PIPW = new Set(SEGS.flatMap((g) => g.pip ?? []));

const beatNode = (b: Beat, t: number): React.ReactNode =>
  b.w ? <World2 t={t} ev={b.w.ev(t)} /> : b.board ? <><Board t={t} />{b.c?.(t)}</> : b.c ? b.c(t) : <Shot k={b.k!} t={t} a={b.a} z={b.z} from={b.from} />;

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
  for (let n = FIRST + 1; n < WIN.length; n++) {
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
    const prev = i > 0 ? beatNode(B[i - 1], t) : <Avatar t={Math.min(t, s0 - 0.01)} />;
    const node = beatNode(cur, t);
    if (p >= 1) L.push(<AbsoluteFill key={"g" + g.i}>{node}</AbsoluteFill>);
    else VIA(cur.via ?? "whip", p, prev, node, ptOf(t, cur.q), "g" + g.i + "_" + i, i === 0).forEach((x) => L.push(x));
    if (t < e0 + 0.1) g.fx(t).forEach((x, k) => L.push(<React.Fragment key={"f" + g.i + "_" + k}>{x}</React.Fragment>));
    // entrada a la ventana siguiente: portal desde el punto que toca
    const r = ei(t, e0 - 0.15, e0 + 0.4);
    if (r > 0 && (g.j ?? g.i + 1) < WIN.length) {
      const last = B[B.length - 1], o = g.out ?? (last.w ? PT.ring : [960, 540]);
      L.push(<Portal key={"po" + g.i} x={ptOf(t, o).x} y={ptOf(t, o).y} r={r}><Avatar t={Math.max(e0, t)} /></Portal>);
    }
  }
  // el fondo negro recién cuando el minuto 1 ya salió: antes tapaba al avatar
  return <AbsoluteFill style={{ background: t >= MIN1_END + 0.4 ? "#05070b" : undefined }}>{L}</AbsoluteFill>;
};
