// marcus02 · DEL 1:20 AL FINAL (79,8 → 902 s) con el motor del kit yanqui3d: una base por frase (toma agnes de Marcus
// haciendo lo que dice / la casa 3D en corte / el avatar) y CERO cortes secos; las piezas 2.5D cruzan las transiciones.
// La casa (world3d.tsx) tiene UNA cámara keyada a la voz: cada uno de los 12 puntos tiene su parada. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { setSlug, BigNum, COL, Flash, FONT, Receipt, Tag, Thermo, e, extrude, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Beat, Price, Stamp, Tr } from "../kits/yanqui3d/engine";
import { CheckList, NextCard, StepTitle, TimeBars, Versus, Words } from "../kits/yanqui3d/pieces";
import { EV, PT, screenOf } from "./world3d";
import { World, MIN1_END, Bill, Pins } from "./Min1";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("marcus02");
export const TEND = 902.0;
const AVWIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win.map((w) => [w.ms, w.me, w.off]);
const HAS = AVAIL as { clips: string[]; imgs: string[] };
const xy = (q: { x: number; y: number }): [number, number] => [q.x, q.y];
type V3 = [number, number, number];

// base de la casa 3D (blur/oscurecido por tramos cuando hay una pieza pesada encima)
const W3 = (a: number, tr: Tr, p?: [number, number], spans: [number, number][] = []): Beat => ({
  a, tr, p, r: (t) => {
    const b = spans.reduce((m, [x, y]) => Math.max(m, e(t, x, x + 0.35) * (1 - e(t, y, y + 0.35))), 0);
    return <World t={t} blur={10 * b} dark={0.45 * b} />;
  },
});
const sp = (a: number, q: V3) => xy(screenOf(a, q));

// cierre: suscribirse + campanita (sin links), y la pregunta para comentar
const Sub: React.FC<{ t: number; at: number; bell: number; out: number }> = ({ t, at, bell, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const k = Math.min(1.06, spr(t, at)), ring = Math.sin((t - bell) * 22) * 18 * Math.exp(-Math.max(0, t - bell) * 2.5) * (t > bell ? 1 : 0);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", gap: 34, opacity: o, transform: `scale(${k})` }}>
      <div style={{ padding: "22px 54px", borderRadius: 18, background: "#e62117", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff", letterSpacing: 4, boxShadow: "0 24px 50px rgba(0,0,0,.6)" }}>SUBSCRIBE</div>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: "rgba(10,12,16,.9)", border: "4px solid #ffd166", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, opacity: e(t, bell - 0.1, bell + 0.1), transform: `rotate(${ring}deg)` }}>🔔</div>
    </div>
  );
};
const Ask: React.FC<{ t: number; at: number; l2: number; out: number }> = ({ t, at, l2, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 120, top: 150, width: 820, opacity: o, transform: `perspective(1400px) rotateY(${(1 - Math.min(1, spr(t, at))) * 40 + 6}deg)`, padding: "34px 40px", borderRadius: 24, background: "rgba(250,246,238,.96)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", fontFamily: FONT, color: "#231d16" }}>
      <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 5, color: "#9a7a4a" }}>TELL ME IN THE COMMENTS</div>
      <div style={{ fontWeight: 900, fontSize: 62, lineHeight: 1.1, marginTop: 12 }}>HOW OLD IS YOUR HOUSE?</div>
      <div style={{ fontWeight: 900, fontSize: 52, lineHeight: 1.1, marginTop: 10, color: COL.red, opacity: e(t, l2, l2 + 0.2) }}>LAST JANUARY'S HEATING BILL?</div>
    </div>
  );
};

export const V = makeVideo({
  caps: CAPS as [string, number][], avwin: AVWIN, avail: HAS, T0: MIN1_END, TEND,
  beats: ({ AV, CL }) => [
    // ---- 1 · el termostato no es un acelerador ----
    W3(MIN1_END, "cut"),                                                    // la cámara ya está en el termostato
    AV(84.64, "whip", { spans: [[85.6, 88.3]] }),
    CL(88.4, "s_crank", "whipL"),
    W3(94.9, "portal", [960, 540], [[95.0, 98.7]]),                         // misma llama a 70 o a 85
    AV(98.85, "zoom"),
    W3(103.12, "push"),                                                     // la casa sube a 78
    CL(107.5, "s_window", "light"),
    AV(113.4, "whip"),
    W3(118.6, "flip", undefined, [[121.4, 129.5]]),                         // dejalo quieto · 5-10 %
    // ---- 2 · el filtro ----
    AV(131.1, "whip"),
    CL(135.8, "s_filter_light", "whipL"),
    W3(140.2, "portal", sp(140.2, PT.n2), [[140.6, 147.2]]),               // 5-15 % (DOE)
    AV(147.3, "whip"),                                                      // zoom desde el mundo 3D se colgaba en el farm
    CL(151.4, "s_filter_two", "whip"),
    W3(158.9, "push"),                                                      // demasiado cerrado para el soplador
    AV(163.8, "whipL"),
    CL(167.2, "s_coil", "whip"),
    CL(171.4, "s_filter_slide", "light"),
    AV(177.9, "whip", { spans: [[178.1, 182.4]] }),
    W3(182.5, "zoom", [960, 540], [[184.8, 190.4]]),                        // $50-$100 por año
    // ---- 3 · cerrar rejillas ----
    AV(192.1, "whip"),
    CL(197.1, "s_vent_close", "whipL"),
    W3(204.4, "portal", sp(204.4, PT.n3)),                                  // la presión sube, el aire se escapa
    AV(211.4, "whip"),
    CL(214.9, "s_duct_leak", "zoom", [960, 540]),
    W3(222.8, "push"),
    AV(227.8, "whipL"),
    // ---- 4 · de noche ----
    W3(234.1, "flip", undefined, [[237.2, 244.0]]),                         // 7-10° · 8 h · hasta 10 %
    AV(244.3, "whip"),
    CL(249.7, "s_sleep", "light"),
    W3(255.0, "portal", sp(255.0, PT.n4)),                                  // el mito
    AV(262.2, "whip"),
    CL(267.0, "s_prog", "whipL"),
    W3(275.0, "push", undefined, [[275.2, 279.3]]),                         // $20 por mes
    AV(279.5, "whip"),
    // ---- 5 · los ductos ----
    W3(285.4, "zoom", [960, 540], [[294.4, 297.5]]),                        // 20-30 % se pierde
    AV(297.6, "whipL"),
    W3(302.5, "flip"),                                                      // calentás el ático · la cinta
    AV(313.5, "whip"),
    CL(316.9, "s_tape", "whipL"),
    CL(321.6, "s_mastic", "light"),
    AV(328.5, "whip"),
    CL(334.1, "s_foiltape", "whipL"),
    W3(340.0, "portal", sp(340.0, PT.n5), [[340.3, 346.8]]),               // hasta 20 % · un fin de semana y $15
    AV(347.0, "whip"),
    W3(351.4, "zoom", [960, 540]),                                          // la caja grande arriba del furnace
    CL(356.9, "s_plenum", "whip"),
    // ---- 6 · bomba de calor ----
    AV(362.7, "whipL"),
    W3(368.1, "flip"),                                                      // la bomba afuera mueve el calor adentro
    AV(378.1, "whip"),
    CL(384.0, "s_strips", "zoom", [960, 540]),
    W3(389.8, "push", undefined, [[389.9, 396.5]]),                         // 2-3 veces más caro
    AV(396.7, "whip"),
    CL(400.2, "s_emheat", "whipL"),
    W3(407.0, "light"),
    AV(409.9, "whip"),
    CL(415.8, "s_heatpump", "whipL"),
    W3(420.3, "portal", [960, 540], [[420.4, 425.9]]),                      // +$50-$100 por mes
    // ---- 7 · las fugas de aire (el grande) ----
    AV(427.7, "zoom"),
    W3(431.7, "portal", sp(431.7, PT.n7), [[431.9, 441.3]]),               // 25-40 % (DOE)
    AV(444.1, "whip"),
    W3(450.3, "zoom", [960, 540]),                                          // la chimenea: sale arriba, entra abajo
    AV(461.3, "whip"),
    W3(466.4, "flip", undefined, [[467.6, 473.9]]),                         // masilla, espuma y una tarde
    CL(474.4, "s_attic_flash", "whip"),
    AV(478.3, "whipL"),
    W3(481.7, "portal", sp(481.7, PT.n7)),                                  // los agujeros del ático · la mugre
    AV(493.5, "whip"),
    CL(497.3, "s_dirty", "zoom", [960, 540]),
    CL(499.6, "l_foam", "light"),                                           // LTX: la espuma llena el hueco
    AV(507.3, "whip"),
    CL(511.7, "s_hatch", "whipL"),
    W3(517.9, "portal", sp(517.9, PT.rim)),                                 // el rim joist
    AV(524.4, "whip"),
    CL(529.5, "s_rimjoist", "whipL"),
    CL(534.8, "s_gasket", "light"),
    AV(540.8, "whip"),
    W3(544.4, "flip", undefined, [[545.6, 551.0]]),                         // día ventoso, todo cerrado
    CL(551.0, "s_fans", "whip"),
    AV(557.4, "whipL"),
    CL(561.8, "s_tape_mark", "whip"),
    CL(567.8, "s_incense2", "light"),
    AV(574.0, "whip"),
    CL(579.5, "s_caulk", "whipL"),
    W3(582.4, "portal", sp(582.4, PT.door)),                                // las puertas
    CL(586.6, "s_daylight", "whip"),
    AV(589.6, "whipL"),
    CL(594.9, "s_sweep", "whip"),
    W3(601.7, "zoom", [960, 540], [[602.0, 608.0]]),                        // la factura a la mitad
    AV(608.2, "whip"),
    CL(612.2, "l_gasket", "light"),                                         // LTX: el humo sube derecho
    CL(615.6, "s_twobills", "whipL"),                                      // escena de la miniatura (C)
    // ---- 8 · el ventilador de techo ----
    W3(619.0, "portal", sp(619.0, PT.n8)),
    AV(622.8, "whip"),
    CL(626.7, "s_fan_switch", "whipL"),
    W3(631.0, "push"),                                                      // horario, despacio: el aire tibio baja
    AV(636.9, "whip"),
    CL(642.8, "s_fan_spin", "light"),
    W3(647.5, "zoom", [960, 540]),
    // ---- 9 · el aire seco ----
    AV(655.5, "whip"),
    CL(660.7, "s_spark", "whipL"),
    CL(666.6, "s_hygro", "whip", undefined, undefined),
    AV(673.4, "whipL"),
    CL(677.5, "s_humid", "light"),
    CL(683.6, "s_condens", "whip"),
    // ---- 10 · las cortinas ----
    AV(689.5, "whipL"),
    CL(695.0, "s_curtain", "whip"),
    W3(698.5, "portal", sp(698.5, PT.n10), [[698.7, 703.6]]),
    CL(703.8, "s_sun", "light"),
    AV(708.2, "whip"),
    // ---- 11 · tres cosas antes de llamar ----
    W3(712.7, "flip"),
    CL(719.7, "s_van", "whip"),
    AV(722.3, "whipL"),
    CL(728.6, "s_switch", "whip"),
    W3(736.6, "portal", sp(736.6, PT.n11)),
    AV(741.7, "whip"),
    W3(747.0, "push"),
    CL(751.0, "s_drain", "whipL"),
    AV(758.3, "whip"),
    W3(762.9, "zoom", sp(762.9, PT.n12)),
    CL(767.5, "s_sensor", "whip"),
    AV(774.4, "whipL"),
    // ---- 12 · arreglá la casa antes de comprar un furnace ----
    W3(779.7, "flip"),
    CL(789.6, "s_sales", "whip"),
    AV(792.5, "whipL"),
    CL(797.7, "s_math", "whip"),
    CL(803.0, "s_newfurn", "light"),
    AV(810.4, "whip", { spans: [[810.5, 815.2]] }),
    W3(815.3, "zoom", [960, 540], [[815.4, 828.4]]),
    AV(828.6, "whip"),
    // ---- la suma y el cierre ----
    W3(834.6, "portal", [960, 540]),                                        // la casa desde la calle con los 12 pines
    AV(847.0, "whip"),
    W3(851.7, "zoom", [960, 540]),
    CL(859.6, "s_coffee", "whip"),
    AV(862.2, "whipL"),
    CL(867.3, "s_filter_next", "whip"),
    W3(872.7, "light", undefined, [[872.8, 880.5]]),                        // suscribite
    AV(880.6, "whip", { spans: [[880.8, 884.2]] }),
    W3(884.2, "push", undefined, [[884.3, 895.8]]),                         // el próximo video
    AV(895.9, "whip"),
  ],
  pieces: (t) => {
    const L: React.ReactNode[] = [];
    const tag = (key: string, a: number, out: number, q: V3, text: string, sub?: string, col?: string, dx = 220, dy = -120) => {
      if (t < a - 0.1 || t > out + 0.4) return;
      const s = screenOf(t, q);
      L.push(<Tag key={key} t={t} at={a} x={s.x} y={s.y} dx={dx} dy={dy} text={text} sub={sub} col={col} out={out} />);
    };
    // 1
    L.push(<StepTitle key="s1" t={t} at={EV.n1} n={1} name="NOT A GAS PEDAL" out={84.4} />);
    L.push(<Thermo key="th" t={t} at={86.0} x={1380} y={160} from={70} to={85} out={88.3} />);
    L.push(<Stamp key="wont" t={t} at={90.5} text="IT WON'T" x={1350} y={260} out={94.6} rot={-6} size={110} />);
    L.push(<Versus key="v70" t={t} at={95.0} out={98.7} title="SAME HEAT" L={{ label: "SET TO 70", val: "100 %", h: 0.8, col: COL.amber }} R={{ label: "SET TO 85", val: "100 %", h: 0.8, col: COL.amber }} />);
    L.push(<BigNum key="78" t={t} at={104.7} text="78°" x={1400} y={330} size={230} col="#ff9a4a" edge="#5a2a10" out={107.3} sub="YOU GET HOT" />);
    L.push(<Stamp key="win" t={t} at={113.8} text="OUT THE WINDOW" x={960} y={870} out={118.4} rot={-4} size={86} />);
    L.push(<Words key="leave" t={t} items={[{ at: 118.6, txt: "SET IT · LEAVE IT" }]} out={121.2} y={180} size={92} />);
    L.push(<BigNum key="510" t={t} at={124.5} text="5–10 %" size={230} col="#5ee38f" edge="#1f5a36" out={129.5} sub="COSTS NOTHING" y={480} />);
    // 2
    L.push(<StepTitle key="s2" t={t} at={130.0} n={2} name="THE FILTER" out={131.0} />);
    L.push(<Words key="half" t={t} items={[{ at: 132.2, txt: "THE PART NOBODY TELLS YOU", col: COL.amber }]} out={135.6} y={880} size={74} />);
    L.push(<BigNum key="515" t={t} at={141.5} text="5–15 %" size={230} col="#5ee38f" edge="#1f5a36" out={147.1} sub="CLEAN FILTER · DEPT. OF ENERGY" y={480} />);
    L.push(<Stamp key="exp" t={t} at={149.4} text="PRICIEST ≠ BEST" x={960} y={870} out={151.3} rot={-4} size={86} />);
    L.push(<Tag key="thick" t={t} at={154.5} x={760} y={480} dx={-220} dy={-160} text="THICK · HIGH-RATED" col={COL.red} out={158.7} />);
    tag("tight", 159.6, 163.6, PT.n2, "TOO TIGHT", "FOR MOST HOME SYSTEMS", COL.red);
    L.push(<Words key="strug" t={t} items={[{ at: 164.4, txt: "BLOWER STRUGGLES" }, { at: 165.9, txt: "RUNS HOT", col: COL.red }]} out={167.0} y={880} size={78} />);
    L.push(<Stamp key="frz" t={t} at={169.5} text="FROZEN COIL" x={1350} y={260} out={171.2} rot={6} size={92} />);
    L.push(<Words key="light" t={t} items={[{ at: 175.1, txt: "NO LIGHT? CHANGE IT", col: COL.amber }]} out={177.7} y={880} size={84} />);
    L.push(<CheckList key="plain" t={t} title="WHAT I'D BUY" rows={[{ at: 178.9, txt: "PLAIN PLEATED" }, { at: 180.4, txt: "MIDDLE OF THE ROAD" }, { at: 181.5, txt: "EVERY 1–3 MONTHS" }]} out={182.4} />);
    L.push(<BigNum key="50" t={t} at={185.6} text="$50–$100" size={210} col="#5ee38f" edge="#1f5a36" out={190.2} sub="A YEAR YOU STOP WASTING" y={480} />);
    // 3
    L.push(<StepTitle key="s3" t={t} at={190.6} n={3} name="CLOSING VENTS" out={192.0} />);
    L.push(<Words key="paper" t={t} items={[{ at: 195.0, txt: "MAKES SENSE ON PAPER" }]} out={197.0} y={880} size={78} />);
    tag("press", 209.5, 211.2, PT.n5, "PRESSURE UP", undefined, COL.red);
    L.push(<Stamp key="moved" t={t} at={220.8} text="YOU JUST MOVED IT OUTSIDE" x={960} y={180} out={222.6} rot={-3} size={70} />);
    L.push(<Words key="open" t={t} items={[{ at: 222.8, txt: "LEAVE MOST OPEN" }, { at: 225.6, txt: "1–2 CLOSED, MAX", col: COL.amber }]} out={227.6} y={880} size={80} />);
    L.push(<Stamp key="lose" t={t} at={230.9} text="STOPS THE LOSS" x={1380} y={250} out={233.9} rot={5} size={80} />);
    // 4
    L.push(<StepTitle key="s4" t={t} at={234.2} n={4} name="TURN IT BACK AT NIGHT" out={237.0} />);
    L.push(<TimeBars key="tb4" t={t} rows={[{ at: 238.0, label: "SETBACK", val: "7–10°", frac: 0.6, col: COL.ice }, { at: 240.5, label: "FOR", val: "8 HOURS", frac: 0.5, col: COL.amber }, { at: 242.5, label: "SAVES", val: "UP TO 10 %", frac: 0.8, col: "#5ee38f" }]} out={244.0} />);
    L.push(<BigNum key="62" t={t} at={250.3} text="62°" x={1450} y={300} size={220} col={COL.ice2} edge="#26425e" out={254.8} sub="UNDER THE BLANKETS" />);
    L.push(<Words key="myth" t={t} items={[{ at: 255.4, txt: "MYTH: IT CATCHES UP", col: COL.red }]} out={261.2} y={180} size={84} />);
    L.push(<Stamp key="dont" t={t} at={261.4} text="IT DOESN'T" x={960} y={540} out={262.4} rot={-6} size={130} />);
    L.push(<Words key="slow" t={t} items={[{ at: 262.4, txt: "COOLER HOUSE = SLOWER LOSS", col: "#5ee38f" }]} out={266.8} y={880} size={74} />);
    L.push(<Words key="prog" t={t} items={[{ at: 271.2, txt: "DOWN AT 10 PM" }, { at: 272.7, txt: "UP 30 MIN BEFORE YOU WAKE", col: COL.amber }]} out={274.9} y={880} size={72} />);
    L.push(<BigNum key="20" t={t} at={276.5} text="$20 / MONTH" size={190} col="#5ee38f" edge="#1f5a36" out={279.3} sub="ON A $200 WINTER BILL" y={480} />);
    L.push(<Tag key="hp" t={t} at={281.5} x={1300} y={420} dx={160} dy={-150} text="HEAT PUMP?" sub="WAIT FOR #6" col={COL.amber} out={285.2} />);
    // 5
    L.push(<StepTitle key="s5" t={t} at={285.6} n={5} name="YOUR DUCTS LEAK" out={289.8} />);
    tag("j5", 290.6, 294.2, PT.n5, "LOOSE JOINT", undefined, COL.ice);
    L.push(<BigNum key="2030" t={t} at={295.4} text="20–30 %" size={230} col={COL.red} edge="#4a1410" out={297.5} sub="OF THE AIR NEVER ARRIVES · ENERGY STAR" y={480} />);
    L.push(<Words key="att" t={t} items={[{ at: 305.6, txt: "YOU'RE HEATING THE ATTIC", col: COL.amber }]} out={309.2} y={180} size={84} />);
    L.push(<Stamp key="dt" t={t} at={310.4} text="DUCT TAPE ✗" x={1380} y={820} out={313.3} rot={-6} size={100} />);
    L.push(<Words key="dry" t={t} items={[{ at: 317.0, txt: "DRIES OUT · LETS GO" }]} out={321.4} y={880} size={80} />);
    L.push(<Price key="m15" t={t} at={325.6} x={1500} y={220} item="DUCT MASTIC" $={15} out={328.3} />);
    L.push(<Tag key="foil" t={t} at={334.6} x={900} y={520} dx={240} dy={-160} text="REAL METAL FOIL TAPE" sub="THEN MASTIC OVER IT" col={COL.ink} out={339.8} />);
    L.push(<BigNum key="up20" t={t} at={341.0} text="UP TO 20 %" size={200} col="#5ee38f" edge="#1f5a36" out={346.6} sub="MORE EFFICIENT" y={440} />);
    L.push(<Words key="wk" t={t} items={[{ at: 344.6, txt: "A WEEKEND + $15", col: COL.amber }]} out={346.6} y={880} size={84} />);
    tag("box", 353.0, 356.7, PT.n12, "THE BIG BOX ON TOP", "CARRIES ALL THE AIR", COL.amber, 220, -160);
    L.push(<Words key="fing" t={t} items={[{ at: 359.6, txt: "GAPS YOU COULD PUT YOUR FINGERS IN", col: COL.red }]} out={362.5} y={880} size={66} />);
    // 6
    L.push(<StepTitle key="s6" t={t} at={364.2} n={6} name="HEAT PUMP: NO EMERGENCY HEAT" out={367.9} y={860} />);
    tag("moves", 371.6, 377.9, PT.n6, "BURNS NOTHING", "MOVES HEAT INSIDE", "#5ee38f", -260, -140);
    L.push(<Words key="aux" t={t} items={[{ at: 380.5, txt: "EMERGENCY HEAT · AUX", col: COL.amber }]} out={383.8} y={880} size={80} />);
    L.push(<Stamp key="toast" t={t} at={384.6} text="A BIG TOASTER" x={1380} y={250} out={389.6} rot={6} size={90} />);
    L.push(<Versus key="hpv" t={t} at={390.2} out={396.5} title="COST TO RUN" L={{ label: "HEAT PUMP", val: "1×", h: 0.33, col: "#5ee38f", mark: "ok" }} R={{ label: "ELECTRIC STRIPS", val: "2–3×", h: 1, col: COL.red, mark: "x" }} />);
    L.push(<Words key="r1" t={t} items={[{ at: 397.4, txt: "RULE 1: ONLY WHEN IT'S BROKEN" }]} out={400.0} y={880} size={70} />);
    L.push(<Words key="r2" t={t} items={[{ at: 403.3, txt: "RULE 2: NO BIG SETBACKS", col: COL.amber }]} out={406.8} y={880} size={74} />);
    tag("str", 408.3, 409.8, PT.n6, "-10° → STRIPS KICK ON", undefined, COL.red, -260, -120);
    L.push(<BigNum key="23" t={t} at={415.8} text="2–3° ONLY" size={190} col="#5ee38f" edge="#1f5a36" out={420.1} y={440} />);
    L.push(<BigNum key="extra" t={t} at={421.2} text="+$50–$100" size={200} col={COL.red} edge="#4a1410" out={425.8} sub="A MONTH · NEVER KNEW WHY" y={480} />);
    // 7
    L.push(<StepTitle key="s7" t={t} at={426.2} n={7} name="SEAL THE AIR LEAKS" col={COL.red} out={427.6} />);
    L.push(<Words key="rem" t={t} items={[{ at: 428.8, txt: "THE INCENSE BY THE OUTLET", col: COL.amber }]} out={431.5} y={880} size={78} />);
    L.push(<BigNum key="2540" t={t} at={433.5} text="25–40 %" size={250} col={COL.red} edge="#4a1410" out={441.2} sub="OF YOUR HEATING $ LEAKS OUT · DEPT. OF ENERGY" y={460} />);
    L.push(<Stamp key="holes" t={t} at={441.5} text="THROUGH THE HOLES" x={960} y={540} out={444.0} rot={-4} size={100} />);
    L.push(<Words key="chim" t={t} items={[{ at: 444.3, txt: "YOUR HOUSE IS A CHIMNEY" }]} out={450.1} y={880} size={84} />);
    tag("top", 450.6, 457.6, PT.ridge, "WARM AIR OUT THE TOP", undefined, "#ff9a4a", 240, -40);
    tag("bot", 451.4, 461.1, PT.rim, "COLD AIR IN AT THE BOTTOM", undefined, COL.ice, 240, 60);
    tag("breath", 457.9, 461.1, PT.outlet, "THE HOUSE BREATHING IN", undefined, COL.ice, -260, -120);
    L.push(<Stamp key="sell" t={t} at={464.5} text="NOTHING TO SELL YOU" x={1380} y={250} out={466.2} rot={5} size={74} />);
    L.push(<Receipt key="kit7" t={t} title="THE WHOLE KIT" rows={[{ at: 467.9, item: "CAULK", $: 8 }, { at: 468.6, item: "SPRAY FOAM", $: 10 }, { at: 469.4, item: "AN AFTERNOON", $: 0 }]} totalAt={470.2} x={1380} y={180} out={473.8} />);
    L.push(<Words key="order" t={t} items={[{ at: 471.0, txt: "MOST MONEY → LEAST" }]} out={473.8} y={880} size={74} />);
    L.push(<Words key="a1" t={t} items={[{ at: 474.4, txt: "① THE ATTIC" }]} out={478.1} y={180} size={92} />);
    tag("plate", 482.0, 486.0, PT.n7, "WHERE EVERY WALL MEETS THE ATTIC", undefined, COL.amber, -280, -120);
    tag("pipes", 485.5, 489.1, PT.n7, "PIPES · WIRES · FAN · LIGHTS", undefined, COL.ink, 240, -150);
    tag("dirt", 489.6, 493.3, PT.n7, "DIRTY INSULATION", "= AIR BLOWING THROUGH", COL.red, 240, -130);
    L.push(<Words key="filt" t={t} items={[{ at: 496.0, txt: "THE DIRT SHOWS YOU THE HOLE", col: COL.amber }]} out={497.1} y={880} size={72} />);
    L.push(<Words key="foam" t={t} items={[{ at: 500.2, txt: "PULL BACK · FOAM · PUT BACK" }]} out={507.1} y={880} size={74} />);
    L.push(<Words key="a2" t={t} items={[{ at: 507.4, txt: "② THE ATTIC HATCH" }]} out={511.5} y={180} size={86} />);
    L.push(<Tag key="wst" t={t} at={512.6} x={900} y={420} dx={240} dy={-140} text="FOAM WEATHERSTRIP" sub="+ RIGID FOAM BOARD ON TOP" col={COL.ink} out={517.7} />);
    L.push(<Words key="a3" t={t} items={[{ at: 518.0, txt: "③ THE RIM JOIST" }]} out={524.2} y={180} size={86} />);
    tag("rimT", 521.6, 524.2, PT.rim, "RIM JOIST", "ALL THE WAY AROUND", COL.amber, 240, -130);
    L.push(<Stamp key="leaky" t={t} at={526.2} text="LEAKIEST SPOT" x={1380} y={250} out={529.3} rot={5} size={90} />);
    L.push(<Words key="a4" t={t} items={[{ at: 531.6, txt: "④ OUTLETS ON OUTSIDE WALLS" }]} out={534.6} y={180} size={76} />);
    L.push(<Price key="gask" t={t} at={537.8} x={1500} y={220} item="12 GASKETS" $={3} out={540.6} />);
    L.push(<Words key="5min" t={t} items={[{ at: 542.4, txt: "5 MINUTES EACH", col: "#5ee38f" }]} out={544.2} y={880} size={84} />);
    L.push(<CheckList key="find" t={t} title="FIND THE REST" rows={[{ at: 545.9, txt: "COLD, WINDY DAY" }, { at: 547.6, txt: "WINDOWS + DOORS SHUT" }, { at: 549.8, txt: "FURNACE OFF" }, { at: 551.2, txt: "EVERY EXHAUST FAN ON" }]} out={557.2} />);
    L.push(<Words key="pull" t={t} items={[{ at: 557.7, txt: "PULLING AIR THROUGH EVERY CRACK", col: COL.ice }]} out={561.6} y={880} size={68} />);
    L.push(<Words key="tape" t={t} items={[{ at: 572.0, txt: "SMOKE BENDS → TAPE IT", col: COL.amber }]} out={573.8} y={880} size={80} />);
    L.push(<Stamp key="job" t={t} at={576.4} text="EVERY TAPE = A JOB" x={1380} y={250} out={579.3} rot={5} size={78} />);
    L.push(<Words key="a5" t={t} items={[{ at: 582.5, txt: "⑤ THE DOORS" }]} out={589.4} y={180} size={86} />);
    L.push(<Tag key="dollar" t={t} at={586.9} x={960} y={720} dx={260} dy={-160} text="DAYLIGHT UNDER IT?" sub="NEW SWEEP + WEATHERSTRIP" col={COL.amber} out={589.4} />);
    L.push(<BigNum key="200" t={t} at={595.0} text="≈ $200" x={1400} y={300} size={170} col="#ffd166" edge="#5a4210" out={601.5} sub="ALL OF IT, DIY" />);
    L.push(<Words key="tight" t={t} items={[{ at: 596.4, txt: "NEWER HOUSE: 15–20 % OFF", col: "#5ee38f" }]} out={601.5} y={880} size={74} />);
    L.push(<Bill key="half7" t={t} at={602.0} out={608.0} x={1400} y={500} amt="$412" split={EV.close + 0.1} after="≈ HALF" sc={0.85} />);
    L.push(<Words key="drafty" t={t} items={[{ at: 602.0, txt: "OLD, DRAFTY HOUSE" }]} out={608.0} y={180} size={84} />);
    L.push(<Stamp key="stays" t={t} at={EV.staysDone + 0.1} text="AND IT STAYS DONE" x={960} y={870} out={612.0} rot={-4} size={86} />);
    L.push(<Words key="one" t={t} items={[{ at: 614.9, txt: "IF YOU DO ONE THING", col: COL.amber }, { at: 616.9, txt: "DO #7", col: COL.red }]} out={618.8} y={880} size={84} />);
    // 8
    L.push(<StepTitle key="s8" t={t} at={619.0} n={8} name="THE FAN'S WINTER SWITCH" out={622.6} />);
    L.push(<Tag key="sw8" t={t} at={623.4} x={900} y={420} dx={240} dy={-140} text="LITTLE SWITCH" sub="ON THE MOTOR" col={COL.ink} out={626.5} />);
    L.push(<Words key="cw" t={t} items={[{ at: 630.0, txt: "WINTER = CLOCKWISE, SLOW", col: COL.amber }]} out={634.3} y={880} size={78} />);
    tag("down", 634.6, 636.7, PT.n8, "WARM AIR DOWN THE WALLS", undefined, "#ff9a4a");
    L.push(<Words key="few" t={t} items={[{ at: 641.6, txt: "ON ITS OWN: A FEW $", col: COL.ink }]} out={642.6} y={880} size={78} />);
    L.push(<BigNum key="12d" t={t} at={647.8} text="−1–2°" size={220} col="#5ee38f" edge="#1f5a36" out={654.3} sub="ON THE THERMOSTAT = MONEY" y={480} />);
    // 9
    L.push(<StepTitle key="s9" t={t} at={654.6} n={9} name="DRY AIR FEELS COLD" out={657.6} y={860} />);
    L.push(<Stamp key="zap" t={t} at={662.2} text="ZAP" x={1400} y={300} out={663.6} rot={8} size={130} />);
    L.push(<Versus key="feels" t={t} at={663.4} out={666.4} title="FEELS LIKE" L={{ label: "THERMOSTAT", val: "70°", h: 0.8, col: COL.amber }} R={{ label: "YOUR SKIN", val: "66°", h: 0.55, col: COL.ice }} />);
    L.push(<TimeBars key="hum" t={t} rows={[{ at: 670.5, label: "HUMIDITY", val: "20 % → 35–40 %", frac: 0.7, col: COL.ice }, { at: 675.0, label: "COMFORTABLE AT", val: "68° NOT 72°", frac: 0.75, col: "#5ee38f" }]} out={677.3} />);
    L.push(<Price key="gauge" t={t} at={680.4} x={1500} y={220} item="HUMIDITY GAUGE" $={10} out={683.4} />);
    L.push(<Stamp key="40" t={t} at={683.9} text="MAX 40 %" x={1380} y={250} out={688.4} rot={5} size={100} />);
    // 10
    L.push(<StepTitle key="s10" t={t} at={688.6} n={10} name="CURTAINS ARE A HEATING SYSTEM" out={691.8} y={860} />);
    L.push(<Words key="glass" t={t} items={[{ at: 692.2, txt: "GLASS = THE WEAKEST SPOT" }]} out={694.8} y={180} size={78} />);
    L.push(<BigNum key="10c" t={t} at={699.4} text="≈ 10 %" size={230} col="#5ee38f" edge="#1f5a36" out={703.5} sub="LESS HEAT LOST · DEPT. OF ENERGY" y={480} />);
    L.push(<Words key="sun" t={t} items={[{ at: 709.8, txt: "THE SUN IS FREE HEAT", col: "#ffd166" }]} out={712.5} y={880} size={84} />);
    // 11
    L.push(<StepTitle key="s11" t={t} at={715.1} n={11} name="3 CHECKS BEFORE YOU CALL" out={719.5} />);
    L.push(<Price key="call" t={t} at={720.6} x={1500} y={220} item="SERVICE CALL" $={150} out={722.1} />);
    L.push(<Words key="phone" t={t} items={[{ at: 726.6, txt: "FIXED OVER THE PHONE" }]} out={728.4} y={880} size={80} />);
    L.push(<CheckList key="chk" t={t} title="BEFORE YOU CALL" rows={[{ at: 730.8, txt: "THE SWITCH" }, { at: 742.2, txt: "THE FILTER" }, { at: 748.7, txt: "THE DRAIN" }, { at: 765.9, txt: "+ FLAME SENSOR" }]} out={774.2} />);
    L.push(<Stamp key="xmas" t={t} at={737.0} text="BUMPED BY THE XMAS BOXES" x={760} y={870} out={741.4} rot={-4} size={60} />);
    tag("pipes11", 749.8, 750.9, PT.n12, "WHITE PLASTIC PIPES?", undefined, COL.ink, -240, -120);
    L.push(<Words key="clog" t={t} items={[{ at: 757.0, txt: "DRAIN CLOGS → SHUTS DOWN", col: COL.red }]} out={762.7} y={880} size={74} />);
    tag("sens", 766.5, 767.4, PT.n12, "FLAME SENSOR", "LIGHTS, THEN GOES OUT", COL.amber, -240, -120);
    L.push(<Words key="5j" t={t} items={[{ at: 780.9, txt: "A 5-MINUTE JOB", col: "#5ee38f" }]} out={785.1} y={880} size={84} />);
    // 12
    L.push(<StepTitle key="s12" t={t} at={785.3} n={12} name="FIX THE HOUSE FIRST" out={789.4} />);
    L.push(<Tag key="15y" t={t} at={790.6} x={760} y={420} dx={-200} dy={-150} text={"“IT'S 15 YEARS OLD”"} col={COL.ink} out={792.3} />);
    L.push(<Words key="arith" t={t} items={[{ at: 798.8, txt: "LET'S DO THE ARITHMETIC", col: COL.amber }]} out={803.0} y={180} size={78} />);
    L.push(<Words key="afue" t={t} items={[{ at: 801.3, txt: "80 % → 96 %" }, { at: 806.0, txt: "SAVES 16–17 %", col: "#5ee38f" }]} out={810.2} y={880} size={80} />);
    L.push(<BigNum key="5k" t={t} at={811.0} text="$5–10K" size={230} col={COL.red} edge="#4a1410" out={815.1} sub="INSTALLED" y={480} />);
    L.push(<Versus key="vs12" t={t} at={815.6} out={821.0} title="SAME SAVINGS OR MORE" L={{ label: "NEW FURNACE", val: "$5–10K", h: 1, col: COL.red, mark: "x" }} R={{ label: "SEAL THE HOUSE (#7)", val: "≈ $200", h: 0.12, col: "#5ee38f", mark: "ok" }} />);
    L.push(<CheckList key="cheap" t={t} title="CHEAP STUFF FIRST" rows={[{ at: 823.3, txt: "SEAL IT" }, { at: 824.2, txt: "FIX THE DUCTS" }, { at: 825.0, txt: "CHANGE THE FILTER" }, { at: 827.5, txt: "→ SMALLER FURNACE" }]} out={828.4} />);
    // la suma
    L.push(<Words key="add" t={t} items={[{ at: 832.7, txt: "LET'S ADD IT UP" }]} out={836.0} y={150} size={84} />);
    L.push(<Pins key="pins" t={t} from={834.2} step={1.85} out={859.4} seven={847.0} />);
    L.push(<Words key="do2" t={t} items={[{ at: 859.8, txt: "DON'T DO ALL 12" }, { at: 862.1, txt: "DO TWO", col: COL.amber }]} out={866.9} y={880} size={84} />);
    L.push(<Words key="last" t={t} items={[{ at: 863.6, txt: "① INCENSE ON THE OUTSIDE WALLS" }, { at: 869.5, txt: "② HOLD THE FILTER TO THE LIGHT", col: COL.amber }]} out={872.5} y={180} size={64} />);
    L.push(<Sub key="sub" t={t} at={873.2} bell={874.6} out={880.4} />);
    L.push(<Ask key="ask" t={t} at={880.4} l2={882.9} out={886.8} />);
    L.push(<NextCard key="next" t={t} at={889.1} subAt={892.5} out={895.7} title="YOUR FURNACE FILTER IS COSTING YOU $400 A YEAR">
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: COL.dim }}>NEXT VIDEO</div>
    </NextCard>);
    L.push(<Words key="warm" t={t} items={[{ at: 898.6, txt: "STAY WARM", col: COL.amber }]} out={901.6} y={880} size={96} />);
    L.push(<Flash key="f7" t={t} at={426.2} peak={0.3} w={0.25} />);
    L.push(<Flash key="fh" t={t} at={EV.close + 0.1} peak={0.3} w={0.2} />);
    void extrude;
    return L;
  },
});

export const Rest: React.FC = () => <AbsoluteFill><V.Body /></AbsoluteFill>;
export const FULL_FRAMES = V.FRAMES;
