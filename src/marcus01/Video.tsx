// marcus01 · DEL 1:12 AL FINAL (72,1 → 577,9 s) con el motor del kit yanqui3d: una base por frase (toma agnes de Marcus
// haciendo lo que dice / el furnace 3D en corte / el avatar) y CERO cortes secos; las piezas 2.5D cruzan las transiciones.
// El mundo 3D (world3d.tsx) tiene UNA cámara keyada a la voz: acá sólo se elige cuándo se lo ve. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { setSlug, BigNum, COL, Card3D, DrawX, Flash, FONT, Receipt, Tag, e, ei, extrude, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Beat, Price, Stamp, Tr } from "../kits/yanqui3d/engine";
import { CheckList, Mistake, MistakesDeal, NextCard, StepTitle, TimeBars, Toggle, Versus, Words } from "../kits/yanqui3d/pieces";
import { EV, PT, screenOf } from "./world3d";
import { World, MIN1_END } from "./Min1";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("marcus01");
export const TEND = 577.9;
const AVWIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win.map((w) => [w.ms, w.me, w.off]);
const HAS = AVAIL as { clips: string[]; imgs: string[] };
const cardId = (k: string) => (HAS.clips.includes(k) ? "ltx_" + k : "img_" + k);
const xy = (q: { x: number; y: number }): [number, number] => [q.x, q.y];

// base del mundo 3D (blur/oscurecido por tramos cuando hay una pieza pesada encima)
const W3 = (a: number, tr: Tr, p?: [number, number], spans: [number, number][] = []): Beat => ({
  a, tr, p, r: (t) => {
    const b = spans.reduce((m, [x, y]) => Math.max(m, e(t, x, x + 0.35) * (1 - e(t, y, y + 0.35))), 0);
    return <World t={t} blur={10 * b} dark={0.45 * b} />;
  },
});
const sp = (a: number, q: [number, number, number]) => xy(screenOf(a, q));

// onda senoidal limpia vs cuadrada (error 4)
const Wave: React.FC<{ t: number; at: number; out: number; sq: boolean; x: number; y: number; label: string }> = ({ t, at, out, sq, x, y, label }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const c = sq ? COL.red : "#5ee38f", grow = ei(t, at, at + 0.9);
  const pts = Array.from({ length: 160 }, (_, i) => { const u = i / 159; const ph = u * 4 * Math.PI * 2 - (t - at) * 6; const v = sq ? Math.sign(Math.sin(ph)) : Math.sin(ph); return `${u * 560 * grow},${70 - v * 55}`; }).join(" ");
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${Math.min(1.05, spr(t, at))})`, padding: "18px 26px", borderRadius: 22, background: "rgba(8,12,18,.86)", border: `3px solid ${c}`, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      <svg width={560} height={140}><polyline points={pts} fill="none" stroke={c} strokeWidth={6} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${c})` }} /></svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 4, color: c }}>{label} {sq ? "✗" : "✓"}</div>
    </div>
  );
};
// la cuenta de la batería
const Math3: React.FC<{ t: number; out: number }> = ({ t, out }) => {
  const rows = [{ at: EV.battMath + 4.5, txt: "1500 Wh" }, { at: EV.battMath + 8.4, txt: "÷ 500 W" }, { at: EV.threeHours + 0.2, txt: "= 3 H" }];
  const o = 1 - e(t, out, out + 0.3);
  return (
    <div style={{ position: "absolute", right: 120, top: 220, opacity: o, textAlign: "right", fontFamily: FONT }}>
      {rows.map((r, i) => <div key={i} style={{ fontWeight: 900, fontSize: i === 2 ? 150 : 104, lineHeight: 1.08, color: i === 2 ? "#5ee38f" : COL.ink, opacity: e(t, r.at, r.at + 0.15), transform: `translateX(${(1 - Math.min(1, spr(t, r.at))) * 120}px)`, textShadow: extrude(8, "rgba(0,0,0,.65)") }}>{r.txt}</div>)}
    </div>
  );
};
// barra de una hora con los ciclos del furnace (20 min de cada 60)
const Cycle: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const g = ei(t, at, at + 1.6);
  return (
    <div style={{ position: "absolute", left: 260, right: 260, top: 700, opacity: o, fontFamily: FONT }}>
      <div style={{ fontWeight: 900, fontSize: 44, letterSpacing: 6, color: COL.ink, marginBottom: 14, textShadow: "0 3px 12px #000" }}>ONE HOUR ON A COLD NIGHT</div>
      <div style={{ position: "relative", height: 70, borderRadius: 14, background: "rgba(255,255,255,.12)", border: "3px solid rgba(255,255,255,.4)", overflow: "hidden" }}>
        {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: `${(k * 33.3 + 2) * g}%`, width: `${11.1 * g}%`, top: 0, bottom: 0, background: "linear-gradient(180deg,#ffb257,#e36a1e)", boxShadow: "0 0 20px rgba(255,150,60,.6)" }} />)}
      </div>
      <div style={{ fontWeight: 800, fontSize: 36, color: COL.amber, marginTop: 10, opacity: e(t, at + 1.2, at + 1.5) }}>RUNS ≈ 20 MIN · RESTS ≈ 40</div>
    </div>
  );
};

export const V = makeVideo({
  caps: CAPS as [string, number][], avwin: AVWIN, avail: HAS, T0: MIN1_END, TEND,
  beats: ({ AV, CL, at }) => [
    // ---- cómo funciona ----
    W3(MIN1_END, "cut"),                                                            // la tapa vuela, entramos
    AV(78.09, "whip"),
    CL(82.23, "s_tstat", "light"),                                                  // 24-volt signal
    CL(84.9, "s_board", "whipL"),                                                   // the board is the brain
    W3(88.5, "portal", sp(88.5, PT.inducer)),                                       // inductor + humo por el caño
    AV(93.5, "zoom", { spans: [] }),
    W3(99.33, "flip"),                                                              // presostato + encendedor que se pone naranja
    CL(106.0, "s_igniter", "portal", sp(106.0, PT.igniter)),
    AV(110.81, "whip"),
    W3(115.57, "zoom", [960, 540]),                                                 // válvula que abre
    CL(118.4, "s_burners", "portal", sp(118.4, PT.burners)),                        // los quemadores prenden
    W3(123.6, "light"),                                                             // el ventilador y el aire a toda la casa
    AV(128.08, "whip", { spans: [[130.4, 133.2]] }),
    CL(133.18, "s_count", "whipL"),
    W3(137.3, "push"),                                                              // se corta: todo se apaga, la válvula trabada
    AV(143.96, "zoom"),
    W3(148.61, "flip"),                                                             // esperando
    CL(154.0, "s_meter", "whip"),                                                   // 300-800 W
    AV(160.86, "whipL", { spans: [[161.9, 165.9]] }),
    W3(165.91, "portal", [960, 540], [[171.2, 177.9]]),                             // < 1000 W, menos que una cafetera
    AV(177.97, "whip"),
    // ---- el problema: viene cableado fijo ----
    W3(182.87, "push"),                                                             // el generador en el patio y no hay por dónde entrar
    AV(191.21, "zoom"),
    CL(196.05, "s_switch", "whip"),                                                 // el interruptor tipo luz
    W3(201.4, "portal", sp(201.4, PT.switchBox)),                                   // sin enchufe → el generador sin camino
    AV(208.81, "whipL"),
    // ---- la pieza de $5 ----
    CL(214.06, "s_palm", "light"),
    W3(221.4, "zoom", [960, 540]),                                                  // tomacorriente + ficha junto al furnace
    AV(225.58, "whip"),
    W3(229.74, "flip"),                                                             // antes/después; día normal
    AV(242.81, "whip"),
    CL(246.88, "s_extcord", "whipL"),
    W3(252.5, "portal", [960, 600]),                                                // el cableado de la casa NUNCA lo toca
    // ---- los pasos ----
    AV(260.63, "whip", { spans: [[261.6, 264.0]] }),
    CL(264.37, "s_breaker", "whipL"),
    CL(at("check it with a tester") - 0.1, "s_tester", "whip"),
    AV(275.21, "push", { spans: [[275.2, 277.6]] }),
    CL(280.62, "s_code", "whip"),
    W3(289.9, "light", undefined, [[289.9, 292.2]]),
    AV(293.02, "zoom", { spans: [[294.4, 298.2]] }),
    W3(298.18, "portal", [960, 540]),                                               // el tomacorriente de cerca
    CL(304.5, "s_wiring", "portal", sp(304.5, PT.outlet)),
    AV(309.58, "whip"),
    CL(315.02, "s_transfer", "whipL"),
    W3(318.8, "portal", sp(318.8, PT.transfer)),
    AV(324.66, "whip"),
    W3(329.41, "flip", undefined, [[335.7, 342.3]]),                                // un furnace, dos maneras → los errores
    // ---- error 1: backfeed ----
    AV(342.18, "zoom"),
    CL(346.88, "s_suicide", "whipL"),
    W3(351.0, "portal", [520, 140]),                                                // del secarropas a la calle
    AV(358.64, "whip"),
    W3(364.48, "zoom", [960, 540]),                                                 // el transformador
    CL(368.5, "s_lineman", "whip"),
    // ---- error 2: monóxido ----
    AV(375.93, "push", { spans: [[376.1, 380.3]] }),
    W3(380.27, "zoom", [960, 540]),
    CL(389.9, "s_codetector", "whipL"),
    // ---- error 3: neutro flotante ----
    AV(393.36, "whip"),
    CL(397.6, "s_flameout", "flip"),
    W3(404.5, "portal", [960, 470]),
    AV(408.3, "whip"),
    W3(412.83, "zoom", [960, 540]),
    AV(425.69, "whip"),
    W3(431.98, "flip"),
    CL(437.5, "s_bond", "whip"),
    // ---- error 4: inverter barato ----
    AV(445.07, "whipL"),
    W3(451.15, "zoom", [960, 540]),
    CL(455.5, "s_squarewave", "whip"),
    // ---- error 5: cable fino ----
    AV(460.29, "push"),
    CL(465.41, "s_cords", "whipL"),
    W3(474.5, "portal", [1250, 520]),
    // ---- cuánto dura ----
    AV(478.19, "whip"),
    W3(483.35, "zoom", [960, 540]),
    CL(488.0, "s_gas", "whip"),
    AV(493.61, "whipL"),
    W3(499.07, "portal", [960, 540], [[499.6, 511.5]]),
    AV(511.46, "whip"),
    W3(516.1, "push", undefined, [[516.1, 523.2]]),
    CL(523.0, "s_dial", "whipL"),
    CL(525.9, "s_door", "whip"),
    // ---- la prueba y el cierre ----
    AV(528.3, "whipL"),
    CL(533.07, "s_test", "light"),
    W3(538.4, "portal", [1250, 820]),
    AV(543.41, "whip"),
    CL(548.95, "s_kids", "whipL"),
    W3(552.6, "light", undefined, [[553.9, 559.5]]),
    CL(559.5, "s_filter", "whip"),
    AV(563.18, "whipL"),
    CL(567.02, "s_warm", "light"),
  ],
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const tag = (key: string, a: number, out: number, q: [number, number, number], text: string, sub?: string, col?: string, dx = 220, dy = -120) => {
      if (t < a - 0.1 || t > out + 0.4) return;
      const s = screenOf(t, q);
      L.push(<Tag key={key} t={t} at={a} x={s.x} y={s.y} dx={dx} dy={dy} text={text} sub={sub} col={col} out={out} />);
    };
    // cómo funciona
    L.push(<Words key="w24" t={t} items={[{ at: 81.34, txt: "24 V SIGNAL", col: COL.amber }]} out={84.6} y={880} size={90} />);
    L.push(<Tag key="brain" t={t} at={85.6} x={1140} y={430} dx={240} dy={-160} text="THE BRAIN" sub="CONTROL BOARD" col="#5ee38f" out={88.3} />);
    tag("ind", EV.inducer + 0.6, 93.4, PT.inducer, "INDUCER", "PULLS AIR THROUGH", COL.ice);
    tag("flue", 93.92 - 1.2, 93.4, [PT.inducer[0], PT.inducer[1] + 0.7, PT.inducer[2] - 0.08], "EXHAUST → UP THE FLUE", undefined, COL.ink, -240, -60);
    tag("ps", 99.6, 104.0, PT.pressure, "PRESSURE SWITCH", "IS THE AIR MOVING?", COL.ice, -240, -120);
    L.push(<Stamp key="safe" t={t} at={EV.safety + 0.2} text="SAFETY" x={1450} y={830} out={104.2} rot={-6} size={84} />);
    tag("ign", 104.2, 105.9, PT.igniter, "IGNITER", "HEATING UP", COL.amber, -220, -130);
    L.push(<Words key="toast" t={t} items={[{ at: 112.86, txt: "GLOWS LIKE A TOASTER WIRE", col: COL.amber }]} out={115.5} y={860} size={80} />);
    tag("valve", EV.valve + 0.2, 118.3, PT.valve, "GAS VALVE", "OPENS", "#ffe066");
    tag("sens", EV.sensor + 0.3, 123.4, PT.sensor, "FLAME SENSOR", "IS THERE REALLY A FLAME?", COL.ice);
    tag("blow", EV.blower + 0.5, 126.6, PT.blower, "BLOWER", "WARM AIR TO EVERY ROOM", COL.amber, -240, -110);
    L.push(<CheckList key="six" t={t} title="NEEDS POWER" rows={[{ at: 131.36, txt: "BOARD" }, { at: 132.2, txt: "INDUCER" }, { at: 133.0, txt: "IGNITER" }, { at: 133.8, txt: "GAS VALVE" }, { at: 134.7, txt: "FLAME SENSOR" }, { at: 135.6, txt: "BLOWER" }]} out={137.4} />);
    L.push(<Stamp key="every" t={t} at={137.48} text="ALL 6 NEED ELECTRICITY" x={960} y={180} out={140.0} rot={-3} size={72} />);
    tag("shut", EV.shut + 0.2, 143.9, PT.valve, "STAYS SHUT", "ON PURPOSE", COL.red);
    L.push(<Words key="nobrk" t={t} items={[{ at: 148.8, txt: "NOT BROKEN" }, { at: EV.waiting, txt: "WAITING", col: COL.ice }]} out={153.6} y={880} size={110} />);
    L.push(<BigNum key="w38" t={t} at={156.81} text="300–800 W" x={1380} y={300} size={150} col={COL.amber} edge="#5a3a16" out={160.7} sub="THE BLOWER" />);
    L.push(<TimeBars key="watts" t={t} rows={[{ at: 161.6, label: "BLOWER", val: "300–800 W", frac: 0.8, col: COL.amber }, { at: 162.07, label: "IGNITER (30 s)", val: "400 W", frac: 0.4, col: COL.red }, { at: 165.45, label: "BOARD + INDUCER", val: "SMALL", frac: 0.12, col: COL.ice }]} out={165.8} />);
    L.push(<BigNum key="1000" t={t} at={171.37} text="< 1000 W" size={210} col="#5ee38f" edge="#1f5a36" out={174.2} sub="THE WHOLE FURNACE" y={470} />);
    L.push(<Versus key="coffee" t={t} at={174.47} out={177.8} title="LESS THAN A COFFEE MAKER" L={{ label: "FURNACE", val: "≈ 800 W", h: 0.53, col: "#5ee38f", mark: "ok" }} R={{ label: "COFFEE MAKER", val: "≈ 1500 W", h: 1, col: COL.amber }} />);
    // el problema
    L.push(<Words key="prob" t={t} items={[{ at: 183.63, txt: "THE POWER ISN'T THE PROBLEM" }, { at: 186.2, txt: "GETTING IT IN IS", col: COL.amber }]} out={189.4} y={180} size={84} />);
    tag("hw", EV.hardwired + 0.1, 191.1, PT.switchBox, "HARDWIRED", undefined, COL.amber);
    L.push(<Tag key="lsw" t={t} at={196.81} x={980} y={500} dx={260} dy={-170} text="LOOKS LIKE A LIGHT SWITCH" col={COL.ink} out={201.2} size={42} />);
    L.push(<Stamp key="noplug" t={t} at={EV.noPlug} text="NO PLUG" x={1400} y={300} out={205.4} rot={-7} size={110} />);
    tag("gen", EV.genYard + 0.6, 208.7, PT.generator, "GENERATOR", "NO WAY IN", COL.red, 200, -140);
    // la pieza
    L.push(<Receipt key="rc" t={t} title="THE $5 PART" rows={[{ at: 215.61, item: "15 A RECEPTACLE", $: 2 }, { at: 219.87, item: "PLUG + SHORT CORD", $: 5 }]} totalAt={220.75} x={1380} y={180} out={221.3} />);
    tag("outl", EV.bothPlug + 0.2, 225.5, PT.outlet, "OUTLET + PLUG", "$5–$8 FOR BOTH", "#ffe066", 200, -140);
    L.push(<Words key="norm" t={t} items={[{ at: EV.normalDay + 0.2, txt: "NORMAL DAY", col: "#ffcf6a" }]} out={242.6} y={170} size={92} />);
    tag("own", EV.normalDay + 2.5, 242.6, PT.outlet, "PLUGGED INTO ITS OWN OUTLET", undefined, COL.ink, 200, -150);
    L.push(<Stamp key="never" t={t} at={EV.never + 0.3} text="NEVER TOUCHES" x={960} y={180} out={260.4} rot={-4} size={96} />);
    L.push(<Tag key="hw2" t={t} at={EV.never + 1.6} x={sp(EV.never + 1.6, PT.panel)[0]} y={sp(EV.never + 1.6, PT.panel)[1]} dx={-180} dy={-120} text="HOUSE WIRING" col={COL.amber} out={260.3} size={40} />);
    // pasos
    L.push(<StepTitle key="s1" t={t} at={261.85} n={1} name="THE BREAKER" out={264.2} />);
    L.push(<Stamp key="lw" t={t} at={270.49} text="LABELED WRONG" x={1400} y={260} out={274.9} rot={6} size={74} />);
    L.push(<StepTitle key="s2" t={t} at={274.47} n={2} name="LOCAL CODE" out={277.8} />);
    L.push(<Words key="elec" t={t} items={[{ at: 284.51, txt: "CALL AN ELECTRICIAN", col: COL.amber }, { at: 286.29, txt: "30-MINUTE JOB" }]} out={289.7} y={880} size={80} />);
    L.push(<StepTitle key="s3" t={t} at={289.97} n={3} name="POLARITY" out={292.6} />);
    L.push(<TimeBars key="pol" t={t} rows={[{ at: 294.73, label: "BLACK →", val: "BRASS", frac: 0.7, col: "#c9a04a" }, { at: 297.11, label: "WHITE →", val: "SILVER", frac: 0.7, col: "#d0d4d8" }, { at: 299.35, label: "GREEN →", val: "GROUND", frac: 0.7, col: "#5ee38f" }]} out={303.9} />);
    L.push(<Words key="why" t={t} items={[{ at: EV.modern + 0.2, txt: "MODERN FURNACES CARE" }]} out={304.3} y={170} size={78} />);
    L.push(<Words key="best" t={t} items={[{ at: 305.89, txt: "THE BEST VERSION", col: "#ffe066" }]} out={309.4} y={860} size={84} />);
    L.push(<Toggle key="tg" t={t} at={315.3} flipAt={EV.normalOrGen + 1.2} out={318.6} a={["NORMAL", "UTILITY"]} b={["GENERATOR", "CORD"]} />);
    L.push(<BigNum key="60" t={t} at={EV.costs + 0.6} text="$60–$100" x={1380} y={300} size={150} col="#ffe066" edge="#5a4a16" out={324.4} sub="LABELED · INSPECTOR LIKES IT" />);
    L.push(<Words key="two" t={t} items={[{ at: EV.twoWays, txt: "ONE FURNACE · TWO FEEDS" }, { at: EV.neverBoth + 0.3, txt: "NEVER BOTH AT ONCE", col: COL.red }]} out={335.5} y={170} size={84} />);
    // errores
    L.push(<MistakesDeal key="md" t={t} at={335.93} out={339.2} />);
    L.push(<Mistake key="m1" t={t} at={339.37} n={1} txt="THE SUICIDE CORD" out={342.3} />);
    L.push(<Words key="both" t={t} items={[{ at: 344.91, txt: "A PLUG ON BOTH ENDS", col: COL.red }]} out={346.8} y={880} size={80} />);
    L.push(<Tag key="dry" t={t} at={350.17} x={520} y={140} dx={260} dy={120} text="DRYER OUTLET" col={COL.red} out={351.4} size={42} />);
    L.push(<Stamp key="bf" t={t} at={EV.backfeeding} text="BACKFEEDING" x={960} y={180} out={364.3} rot={-4} size={100} />);
    tag("tr", 364.7, 368.4, PT.transformerP, "TRANSFORMER", "STEPS IT UP", COL.ice, -240, -120);
    L.push(<BigNum key="kv" t={t} at={EV.thousands + 0.4} text="THOUSANDS OF VOLTS" size={120} col={COL.red} edge="#4a1410" out={368.3} y={860} />);
    L.push(<Words key="dead" t={t} items={[{ at: 368.55, txt: "HE THINKS IT'S DEAD" }]} out={372.4} y={880} size={80} />);
    L.push(<Stamp key="nev" t={t} at={EV.neverEver} text="NEVER. EVER." x={960} y={300} out={375.7} rot={-6} size={130} />);
    L.push(<Mistake key="m2" t={t} at={376.1} n={2} txt="GENERATOR IN THE GARAGE" out={380.0} y={900} />);
    if (t > 376 && t < 380.6) {
      const k = spr(t, 376.6, 0.8);
      L.push(<Card3D key="gg" id={cardId("s_garagegen")} at={376.6} x={620} y={150} w={680} h={383} ry={(1 - Math.min(1, k)) * 60 - 6} rx={4} z={(1 - Math.min(1, k)) * -1300} o={e(t, 376.6, 376.75) * (1 - e(t, 380.0, 380.25))} label="EVEN WITH THE DOOR OPEN" labelCol={COL.red} />);
      L.push(<DrawX key="ggx" t={t} at={378.9} x={660} y={190} w={600} h={300} />);
    }
    tag("co", EV.co + 0.6, 384.6, [2.5, 1.6, -0.6], "CARBON MONOXIDE", "NO SMELL", "#e8a796", 220, -150);
    L.push(<BigNum key="20ft" t={t} at={EV.twenty + 0.3} text="20 FT" y={300} size={230} col="#ffd34a" edge="#5a4a16" out={389.7} sub="AT LEAST · EXHAUST AWAY" />);
    L.push(<Words key="bat" t={t} items={[{ at: 394.23, txt: "BATTERY CO DETECTOR" }, { at: 398.23, txt: "PLUG-IN KIND DIES", col: COL.red }]} out={400.9} y={170} size={78} />);
    L.push(<Mistake key="m3" t={t} at={401.05} n={3} txt="IT LIGHTS… THEN DIES" out={404.3} />);
    tag("plug3", EV.m3plug + 0.2, 408.2, PT.outlet, "PLUGGED IN", "EVERYTHING RIGHT", "#5ee38f", 200, -140);
    L.push(<Words key="3s" t={t} items={[{ at: EV.m3out, txt: "3 SECONDS → OUT", col: COL.red }, { at: 414.85, txt: "OVER AND OVER" }]} out={418.6} y={180} size={84} />);
    tag("cur", EV.tinyCurrent + 0.4, 424.0, PT.sensor, "TINY CURRENT", "FLAME → GROUND", COL.ice);
    tag("gnd", EV.goodGround + 0.2, 425.6, PT.board, "NEEDS A GOOD GROUND", undefined, COL.amber, -240, -100);
    tag("led", 432.2, 437.3, PT.board, "CAN'T FEEL THE FLAME", "GAS OFF", COL.red, 200, -130);
    L.push(<Words key="nbp" t={t} items={[{ at: 436.58, txt: "NEUTRAL BONDING PLUG", col: COL.amber }]} out={440.3} y={170} size={80} />);
    L.push(<Price key="10" t={t} at={440.52} x={1500} y={240} item="BONDING PLUG" $={10} out={445.0} />);
    L.push(<Stamp key="only" t={t} at={443.82} text="STANDALONE ONLY" x={900} y={860} out={445.0} rot={-4} size={78} />);
    L.push(<Mistake key="m4" t={t} at={448.04} n={4} txt="THE CHEAP INVERTER" out={451.0} />);
    tag("comp", EV.computer + 0.4, 455.4, PT.board, "A LITTLE COMPUTER", "WANTS CLEAN POWER", "#5ee38f");
    L.push(<Wave key="sine" t={t} at={455.58} out={460.2} sq={false} x={160} y={140} label="PURE SINE" />);
    L.push(<Wave key="sq" t={t} at={457.6} out={460.2} sq x={1150} y={140} label="SQUARE WAVE" />);
    L.push(<Mistake key="m5" t={t} at={467.56} n={5} txt="THE SKINNY CORD" out={470.6} />);
    L.push(<Versus key="cords" t={t} at={471.54} out={478.0} title="FOR A FURNACE" L={{ label: "THIN · LONG", val: "16 GA", h: 0.35, col: "#ff8a3a", mark: "x" }} R={{ label: "SHORT · THICK", val: "12 GA", h: 0.75, col: "#ffd34a", mark: "ok" }} />);
    tag("hot", EV.runHot - 1.6, 488.0, PT.blower, "LOW VOLTAGE", "MOTOR RUNS HOT", COL.red, -240, -110);
    L.push(<BigNum key="gal" t={t} at={492.02} text="≈ 1 GALLON" y={300} size={170} col={COL.amber} edge="#5a3a16" out={493.5} sub="ALL NIGHT" />);
    L.push(<Math3 key="math" t={t} out={511.3} />);
    L.push(<Cycle key="cyc" t={t} at={516.26} out={523.0} />);
    L.push(<BigNum key="68" t={t} at={520.96} text="6–8 HOURS" y={330} size={180} col="#5ee38f" edge="#1f5a36" out={523.0} />);
    L.push(<BigNum key="62" t={t} at={523.98} text="62°" x={1500} y={300} size={200} col={COL.ice2} edge="#26425e" out={525.8} />);
    L.push(<Words key="rooms" t={t} items={[{ at: 525.94, txt: "CLOSE OFF THE ROOMS" }]} out={528.2} y={880} size={80} />);
    // la prueba y el cierre
    L.push(<Stamp key="test" t={t} at={532.26} text="TEST IT" x={1380} y={300} out={533.3} rot={-6} size={120} />);
    L.push(<CheckList key="oct" t={t} title="IN OCTOBER" rows={[{ at: EV.flip, txt: "BREAKER OFF" }, { at: EV.pull, txt: "PULL THE PLUG" }, { at: EV.runGen, txt: "ON THE GENERATOR" }, { at: EV.staysLit, txt: "LIGHTS & STAYS LIT" }]} out={543.2} />);
    L.push(<Words key="kids" t={t} items={[{ at: 549.2, txt: "NOT THE TIME TO FIND OUT", col: COL.red }]} out={552.5} y={180} size={80} />);
    L.push(<CheckList key="end" t={t} title="THE DIFFERENCE" rows={[{ at: EV.fiveParts, txt: "$5 OF PARTS" }, { at: 554.36, txt: "ONE AFTERNOON" }, { at: 555.68, txt: "A TEST RUN" }]} out={559.3} x={1240} />);
    L.push(<Words key="warm" t={t} items={[{ at: EV.warmOne, txt: "A WARM ONE", col: COL.amber }]} out={559.4} y={880} size={110} />);
    L.push(<Tag key="filt" t={t} at={563.36} x={1340} y={500} dx={200} dy={-200} text="LOOK AT YOUR FILTER" col={COL.amber} out={567.0} />);
    L.push(<NextCard key="next" t={t} at={567.42} subAt={572.2} out={577.4} title="YOUR FILTER IS COSTING YOU $400 A YEAR">
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: COL.dim }}>NEXT VIDEO</div>
    </NextCard>);
    L.push(<Flash key="fsl" t={t} at={EV.staysLit} peak={0.35} col="#bfe0ff" w={0.25} />);
    return L;
  },
});

export const Rest: React.FC = () => <AbsoluteFill><V.Body /></AbsoluteFill>;
export const FULL_FRAMES = V.FRAMES;
void ei;
