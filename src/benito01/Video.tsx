// benito01 · el video ENTERO (0 → 1169,8 s) con el motor del kit yanqui3d: una base por frase (toma LTX de Benito
// haciendo lo que dice / la panadería 3D en corte / el avatar) y CERO cortes secos; las piezas 2.5D cruzan las transiciones.
// El mundo 3D (world3d.tsx) tiene UNA cámara keyada a la voz: acá sólo se elige cuándo se lo ve. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { setSlug, BigNum, COL, FONT, LowerThird, Tag, e, extrude, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Beat, Stamp, Tr } from "../kits/yanqui3d/engine";
import { CheckList, Mistake, MistakesDeal, NextCard, TimeBars, Versus, Words } from "../kits/yanqui3d/pieces";
import { EV, PT, World, screenOf } from "./world3d";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("benito01");
export const TEND = 1169.8;
const WINS = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
const AVWIN = WINS.map((w) => [w.ms, w.me, w.off]);
const HAS = AVAIL as { clips: string[]; imgs: string[] };
// fin de la ventana pagada más cercana a ms: la base siguiente entra ahí (el avatar sigue visible 0,65 s para la transición)
const M = (ms: number) => WINS.reduce((b, w) => (Math.abs(w.ms - ms) < Math.abs(b.ms - ms) ? w : b)).me;
const xy = (q: { x: number; y: number }): [number, number] => [q.x, q.y];
const sp = (a: number, q: [number, number, number]) => xy(screenOf(a, q));
const BREAD = "#c98a4a", GREEN = "#5ee38f";

// base del mundo 3D (blur/oscurecido por tramos cuando hay una pieza pesada encima)
const W3 = (a: number, tr: Tr, p?: [number, number], spans: [number, number][] = []): Beat => ({
  a, tr, p, r: (t) => {
    const b = spans.reduce((m, [x, y]) => Math.max(m, e(t, x, x + 0.35) * (1 - e(t, y, y + 0.35))), 0);
    return <World t={t} blur={10 * b} dark={0.45 * b} />;
  },
});

// "SECRET Nº n": tarjeta de capítulo que cae del fondo (misma familia que StepTitle del kit)
const Secret: React.FC<{ t: number; at: number; n: number; name: string; out: number }> = ({ t, at, n, name, out }) => {
  const o = e(t, at - 0.02, at + 0.18) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.85)), k2 = Math.min(1, spr(t, at + 0.22, 1)), sweep = e(t, at + 0.3, at + 1.1);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1400 }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 55% at 50% 48%, rgba(0,0,0,.55), transparent 75%)" }} />
      <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) translateZ(${(1 - k) * -1400}px) rotateX(${(1 - k) * 50 + 8}deg) rotateY(${Math.sin((t - at) * 0.8) * 5}deg)`, textAlign: "center", fontFamily: FONT, whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 900, fontSize: 60, letterSpacing: 22, color: COL.ink, textShadow: extrude(5, "rgba(0,0,0,.7)"), marginBottom: -20 }}>SECRET Nº</div>
        <div style={{ position: "relative", display: "inline-block", fontWeight: 900, fontSize: 340, lineHeight: 1, color: COL.amber, textShadow: extrude(22, "#5a3410") }}>
          {n}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${sweep * 140 - 40}%, rgba(255,255,255,.75) ${sweep * 140 - 25}%, transparent ${sweep * 140 - 10}%)`, WebkitBackgroundClip: "text", color: "transparent", mixBlendMode: "screen" } as React.CSSProperties}>{n}</div>
        </div>
        <div style={{ transform: `translateY(${(1 - k2) * 60}px)`, opacity: k2, fontWeight: 900, fontSize: 88, letterSpacing: 10, color: COL.ink, textShadow: extrude(8, "#3a2a18") }}>{name}</div>
      </div>
    </AbsoluteFill>
  );
};

// fila de pastillas de texto que caen de a una (sonidos/ideas sueltas: SHAGGY · WET · LUMPY · STICKY)
const Pills: React.FC<{ t: number; at: number; items: string[]; out: number; y?: number }> = ({ t, at, items, out, y = 860 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y - 50, display: "flex", justifyContent: "center", gap: 26, perspective: 1200 }}>
    {items.map((it, i) => {
      const a = at + i * 0.22, k = Math.min(1.08, spr(t, a, 1.1)), o = e(t, a, a + 0.1) * (1 - e(t, out + i * 0.04, out + i * 0.04 + 0.25));
      if (o <= 0.01) return null;
      return <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 90}px) rotateX(${(1 - Math.min(1, k)) * 60}deg) scale(${k})`, padding: "16px 34px", borderRadius: 999, background: it === "→" ? "transparent" : "linear-gradient(180deg,rgba(40,26,14,.94),rgba(18,11,6,.94))", border: it === "→" ? "none" : "3px solid " + COL.amber + "aa", boxShadow: it === "→" ? "none" : "0 22px 44px rgba(0,0,0,.55)", fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 3, color: COL.ink, textShadow: extrude(4, "rgba(0,0,0,.7)"), whiteSpace: "nowrap" }}>{it}</div>;
    })}
  </div>
);

// cita de Don Aurelio / de Benito: comillas grandes, palabras que entran de a una
const Quote: React.FC<{ t: number; at: number; out: number; lines: { at: number; txt: string }[]; by?: string }> = ({ t, at, out, lines, by }) => {
  const o = e(t, at - 0.1, at + 0.25) * (1 - e(t, out, out + 0.35)); if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity: o, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", fontFamily: FONT }}>
      <div style={{ fontWeight: 900, fontSize: 220, lineHeight: 0.6, color: COL.amber, textShadow: extrude(10, "#5a3410"), opacity: 0.9 }}>“</div>
      {lines.map((l, i) => {
        const k = Math.min(1, spr(t, l.at, 1));
        return <div key={i} style={{ fontWeight: 900, fontSize: 88, letterSpacing: 3, color: i === lines.length - 1 ? COL.amber : COL.ink, opacity: e(t, l.at, l.at + 0.15), transform: `translateY(${(1 - k) * 50}px) scale(${0.9 + 0.1 * k})`, textShadow: extrude(7, "rgba(0,0,0,.75)"), textAlign: "center", maxWidth: 1500 }}>{l.txt}</div>;
      })}
      {by && <div style={{ marginTop: 24, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: COL.dim, opacity: e(t, lines[lines.length - 1].at + 0.4, lines[lines.length - 1].at + 0.8) }}>— {by}</div>}
    </AbsoluteFill>
  );
};

// suscribite + campanita (sin links: sólo el gesto)
const SubBell: React.FC<{ t: number; at: number; bellAt: number; out: number }> = ({ t, at, bellAt, out }) => {
  const o = e(t, at - 0.05, at + 0.2) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 1)), kb = Math.min(1.04, spr(t, bellAt, 1.2));
  const ring = t > bellAt ? Math.sin((t - bellAt) * 18) * 22 * Math.exp(-(t - bellAt) * 1.6) : 0;
  const pressed = t > at + 1.0 ? 1 : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, opacity: o, fontFamily: FONT }}>
      <div style={{ transform: `scale(${k * (1 - 0.06 * e(t, at + 0.9, at + 1.0) + 0.06 * e(t, at + 1.0, at + 1.15))})`, padding: "26px 60px", borderRadius: 18, background: pressed ? "#3a3a3a" : "#d9302a", color: "#fff", fontWeight: 900, fontSize: 64, letterSpacing: 6, boxShadow: "0 24px 50px rgba(0,0,0,.55), inset 0 3px 0 rgba(255,255,255,.3)" }}>{pressed ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
      <div style={{ opacity: e(t, bellAt - 0.05, bellAt + 0.1), transform: `scale(${kb}) rotate(${ring}deg)`, transformOrigin: "50% 10%", width: 130, height: 130, borderRadius: "50%", background: "rgba(10,14,20,.85)", border: "4px solid " + COL.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, boxShadow: `0 0 40px ${COL.amber}66` }}>🔔</div>
    </div>
  );
};

// la pregunta para comentar: 3 opciones que caen
const Question: React.FC<{ t: number; at: number; out: number; opts: { at: number; txt: string; col: string }[] }> = ({ t, at, out, opts }) => {
  const o = e(t, at - 0.1, at + 0.25) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.9));
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, perspective: 1400 }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(6,4,2,.7), rgba(6,4,2,.3))" }} />
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center", transform: `translateY(${(1 - k) * -80}px)` }}>
        <div style={{ fontWeight: 800, fontSize: 44, letterSpacing: 10, color: COL.dim }}>TELL ME IN THE COMMENTS</div>
        <div style={{ fontWeight: 900, fontSize: 96, color: COL.ink, textShadow: extrude(8, "rgba(0,0,0,.75)") }}>YOUR FIRST LOAF — WHAT WAS IT?</div>
      </div>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
        {opts.map((q, i) => {
          const kq = Math.min(1.05, spr(t, q.at, 1.1));
          return <div key={i} style={{ opacity: e(t, q.at, q.at + 0.12), transform: `translateY(${(1 - Math.min(1, kq)) * 120}px) rotateX(${(1 - Math.min(1, kq)) * 40}deg) scale(${kq})`, padding: "34px 54px", borderRadius: 24, background: "linear-gradient(180deg,#2a1d12,#140d07)", border: `4px solid ${q.col}`, fontWeight: 900, fontSize: 70, letterSpacing: 4, color: q.col, boxShadow: `0 30px 60px rgba(0,0,0,.6), 0 0 40px ${q.col}44` }}>{q.txt}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

export const V = makeVideo({
  caps: CAPS as [string, number][], avwin: AVWIN, avail: HAS, T0: 0, TEND, flashAtStart: false,
  beats: ({ AV, CL }) => [
    // ---- gancho: vos estás ahí, con el ladrillo en la mano ----
    AV(0, "cut"),
    CL(M(0), "h_brick_phone", "whip"),
    W3(EV.inside - 0.2, "portal", sp(EV.inside, PT.loaf)),                       // por dentro: pálido, pesado, mojado
    AV(16.6, "whip"),
    CL(M(16.6), "h_knead_tired", "whipL"),
    AV(31.5, "whip"),
    W3(M(31.5), "light"),                                                          // cuatro cosas en un bol
    CL(41.9, "b_fourthings", "whip"),
    // ---- quién es Benito ----
    AV(48.4, "whipL"),
    W3(M(48.4), "portal"),                                                         // la panadería entera
    CL(61.5, "b_oven4am", "light"),
    AV(67.1, "whip"),
    CL(M(67.1), "b_street_bags", "whipL"),
    CL(76.8, "h_aurelio_hands", "light"),
    AV(82.5, "whip"),
    W3(M(82.5), "portal"),
    CL(95.6, "h_boy_knead", "whip"),
    AV(103.0, "whipL"),
    CL(M(103.0), "b_dogs_brick", "whip"),
    AV(119.6, "light"),
    W3(M(119.6), "portal", undefined, [[125.6, 129.5]]),                          // un panadero no pelea: espera
    AV(134.0, "whip"),
    W3(M(134.0), "portal"),
    AV(150.8, "whip"),
    W3(M(150.8), "light", undefined, [[155.5, 162.6]]),                           // 7 secretos · 3 errores
    // ---- secreto 1: la taza ----
    AV(166.5, "whipL"),
    W3(M(166.5), "portal", sp(170.8, PT.cupA)),
    CL(177.2, "h_scoop", "whip"),
    AV(182.8, "whipL", { spans: [[183.6, 189.2]] }),
    W3(M(182.8), "portal", sp(189.4, PT.cupA)),
    AV(201.6, "whip"),
    CL(M(201.6), "h_spoon_level", "whipL"),
    AV(217.4, "whip"),
    CL(M(217.4), "h_scale", "light"),
    CL(228.5, "b_lift_dough", "whipL"),
    AV(233.5, "whip"),
    W3(M(233.5), "portal", sp(237.4, PT.scale), [[242.4, 247.4]]),               // la balanza vs 50 años
    AV(249.8, "whipL"),
    W3(M(249.8), "portal"),
    CL(258.4, "h_salt_yeast", "whip"),
    // ---- secreto 2: el agua tibia ----
    AV(266.0, "whipL"),
    CL(M(266.0), "h_wrist", "whip"),
    AV(283.8, "light"),
    W3(M(283.8), "portal"),                                                        // la levadura despierta / muere
    AV(300.6, "whip"),
    W3(M(300.6), "portal"),
    CL(309.3, "h_stir_spoon", "whipL"),
    AV(317.6, "whip"),
    W3(M(317.6), "portal"),                                                        // fea, peluda, pegajosa: bien
    CL(330.3, "h_sticky", "whip"),
    AV(334.8, "whipL"),
    W3(M(334.8), "portal"),
    // ---- secreto 3: el gluten se arma solo ----
    AV(349.7, "whip"),
    W3(M(349.7), "portal"),
    AV(369.4, "whipL"),
    W3(M(369.4), "portal", undefined, [[384.0, 390.2]]),
    AV(387.0, "whip", { spans: [[387.0, 390.2]] }),
    W3(M(387.0), "portal"),
    CL(393.4, "b_trough_night", "light"),
    AV(400.3, "whip"),
    CL(M(400.3), "h_dough_alive", "whipL"),
    W3(414.2, "portal"),
    // ---- el camino rápido: tibio ----
    AV(417.8, "whip"),
    W3(M(417.8), "portal"),
    AV(433.2, "whipL"),
    CL(M(433.2), "h_oven_light", "light"),
    AV(449.5, "whip"),
    CL(M(449.5), "h_fold", "whipL"),
    // ---- secreto 4: manos mojadas ----
    AV(464.9, "whip"),
    W3(M(464.9), "portal", undefined, [[476.6, 481.4]]),
    AV(481.3, "whipL"),
    W3(M(481.3), "portal"),                                                        // peinar la red
    W3(497.1, "light"),
    AV(500.4, "whip"),
    W3(M(500.4), "portal"),                                                        // el doble
    AV(515.2, "whipL"),
    CL(M(515.2), "h_bubbles_bowl", "whip"),
    CL(524.5, "h_poke", "whipL"),
    AV(531.2, "whip"),
    W3(M(531.2), "portal"),
    W3(543.3, "light"),                                                            // el horno
    // ---- secreto 5: la olla caliente ----
    AV(547.8, "whip"),
    CL(M(547.8), "b_pot_oven", "whipL"),
    AV(562.1, "whip"),
    W3(M(562.1), "portal"),
    CL(573.4, "h_oven_bricks", "whip"),
    AV(578.3, "whipL"),
    W3(M(578.3), "portal"),
    AV(594.3, "whip"),
    W3(M(594.3), "portal", undefined, [[600.2, 609.6]]),
    AV(609.6, "whipL"),
    CL(M(609.6), "h_tip_out", "whip"),
    AV(627.2, "whipL"),
    CL(M(627.2), "h_package", "whip"),
    // ---- enero de 1971 ----
    AV(644.3, "light", { spans: [[656.8, 658.9]] }),
    W3(M(644.3), "portal", undefined, [[656.8, 662.4]]),
    AV(658.8, "whip", { spans: [[658.8, 662.4]] }),
    CL(M(658.8), "b_snow_line", "light"),
    AV(675.1, "whipL"),
    W3(M(675.1), "portal"),
    CL(683.5, "b_snow_child", "whip"),
    AV(691.2, "whipL"),
    W3(M(691.2), "portal", undefined, [[697.2, 700.9]]),
    // ---- el corte, la olla, el salto ----
    CL(700.7, "h_score", "whip"),
    AV(707.4, "whipL"),
    W3(M(707.4), "portal", undefined, [[718.6, 723.0]]),
    AV(725.8, "whip"),
    CL(M(725.8), "h_lower_pot", "whipL"),
    AV(741.6, "whip"),
    W3(M(741.6), "portal"),
    AV(757.6, "whipL"),
    CL(M(757.6), "h_lid_off", "whip"),
    W3(768.2, "portal"),
    // ---- secreto 6: no lo saques rubio ----
    AV(776.3, "whip"),
    W3(M(776.3), "portal"),
    AV(790.0, "whipL"),
    W3(M(790.0), "portal"),
    CL(801.6, "h_dark_crust", "whip"),
    AV(807.7, "whipL", { spans: [[807.7, 811.0]] }),
    W3(M(807.7), "portal"),
    CL(818.7, "h_knock_bottom", "whip"),
    // ---- los 80 panes ----
    AV(823.4, "whipL"),
    CL(M(823.4), "b_smoke", "whip"),
    AV(838.1, "light"),
    W3(M(838.1), "portal", undefined, [[850.3, 856.4]]),
    AV(855.9, "whip"),
    W3(M(855.9), "portal"),
    // ---- secreto 7: no lo cortes caliente ----
    AV(871.1, "whipL"),
    CL(M(871.1), "b_ear_crackle", "whip"),
    AV(888.8, "whip"),
    W3(M(888.8), "portal"),
    CL(900.7, "h_cut_hot", "whip"),
    AV(907.4, "whipL"),
    CL(M(907.4), "h_cut_cool", "whip"),
    // ---- los 3 errores + si algo sale mal ----
    AV(919.9, "whipL"),
    W3(M(919.9), "portal"),
    AV(937.7, "whip"),
    W3(M(937.7), "portal"),
    AV(953.3, "whipL"),
    W3(M(953.3), "portal"),
    AV(968.9, "whip"),
    W3(M(968.9), "portal"),
    AV(984.2, "whipL", { spans: [[984.2, 988.8]] }),
    W3(M(984.2), "portal"),
    // ---- la cuenta ----
    AV(998.7, "whip"),
    W3(M(998.7), "portal", undefined, [[1004.0, 1020.5]]),
    AV(1015.9, "whipL", { spans: [[1015.9, 1020.5]] }),
    W3(M(1015.9), "portal", undefined, [[1020.5, 1037.2]]),
    // ---- la receta entera ----
    AV(1032.5, "whip"),
    W3(M(1032.5), "portal", undefined, [[1044.8, 1082.0]]),
    AV(1047.0, "whipL", { spans: [[1047.0, 1051.4]] }),
    W3(M(1047.0), "portal", undefined, [[1044.8, 1082.0]]),
    AV(1065.3, "whip", { spans: [[1065.3, 1071.6]] }),
    W3(M(1065.3), "portal", undefined, [[1044.8, 1082.0]]),
    // ---- Don Aurelio, la pala, el cierre ----
    AV(1081.7, "whipL"),
    CL(M(1081.7), "b_peel", "whip"),
    AV(1099.4, "whipL"),
    W3(M(1099.4), "portal"),
    AV(1117.5, "whip"),
    W3(M(1117.5), "portal", undefined, [[1123.8, 1133.6]]),
    CL(1129.5, "b_coffee", "whip"),
    AV(1133.5, "whipL"),
    W3(M(1133.5), "portal", undefined, [[1137.4, 1150.4]]),
    AV(1150.3, "whip"),
    W3(M(1150.3), "portal"),
  ],
  pieces: (t) => {
    const L: React.ReactNode[] = [];
    const tag = (key: string, a: number, out: number, q: [number, number, number], text: string, sub?: string, col?: string, dx = 220, dy = -120) => {
      if (t < a - 0.1 || t > out + 0.4) return;
      const s = screenOf(t, q);
      L.push(<Tag key={key} t={t} at={a} x={s.x} y={s.y} dx={dx} dy={dy} text={text} sub={sub} col={col} out={out} />);
    };
    const W = (key: string, items: { at: number; txt: string; col?: string }[], out: number, y = 880, size = 76) => { if (t > items[0].at - 0.3 && t < out + 0.5) L.push(<Words key={key} t={t} items={items} out={out} y={y} size={size} />); };
    // gancho
    W("tok", [{ at: 7.9, txt: "TOK. TOK." }, { at: 9.3, txt: "LIKE A STONE", col: COL.red }], 10.4, 860, 96);
    tag("inside", EV.inside + 0.8, 16.5, PT.loaf, "PALE · HEAVY · WET", "IN THE MIDDLE", COL.red);
    W("20min", [{ at: 18.8, txt: "20 MINUTES OF KNEADING" }], 21.0);
    L.push(<Stamp key="brick" t={t} at={23.3} text="A BRICK" x={1400} y={280} out={27.2} rot={-8} size={120} />);
    W("arms", [{ at: 28.7, txt: "IT WAS NEVER YOUR ARMS" }, { at: 30.4, txt: "IT WAS THE KNEADING", col: COL.amber }], 31.6);
    L.push(<Stamp key="never" t={t} at={35.3} text="NEVER." x={1440} y={300} out={36.3} rot={-6} size={120} />);
    L.push(<Pills key="four" t={t} at={36.6} items={["4 THINGS", "1 BOWL", "5 MINUTES"]} out={41.8} y={860} />);
    W("why", [{ at: 42.2, txt: "NOBODY KNEADED IT" }, { at: 45.4, txt: "SO WHY IS IT BETTER?", col: COL.amber }], 48.2, 540, 100);
    // Benito
    L.push(<LowerThird key="lt" t={t} at={50.8} out={58.0} name="BENITO" l2="70 · VILLAGE BAKER · 50 YEARS" l2at={53.6} />);
    W("castile", [{ at: 58.4, txt: "A LITTLE VILLAGE IN CASTILE" }], 61.4, 170, 70);
    L.push(<BigNum key="4am" t={t} at={61.9} text="4:00 AM" x={1440} y={300} size={160} col={COL.amber} edge="#5a3a16" out={66.9} sub="EVERY MORNING · DRY VINE BRANCHES" />);
    W("7am", [{ at: 69.0, txt: "BY 7 · THE WHOLE STREET SMELLED OF BREAD" }], 76.6, 880, 60);
    W("14", [{ at: 77.2, txt: "AGE 14 · SWEEPING FLOUR" }], 80.4, 170, 66);
    L.push(<Tag key="aur" t={t} at={80.4} x={760} y={560} dx={220} dy={-170} text="DON AURELIO" sub="THE BAKER" col={COL.amber} out={82.4} />);
    W("hands", [{ at: 84.0, txt: "BIG HANDS · NO PATIENCE" }], 88.4, 880, 66);
    W("this", [{ at: 92.4, txt: "THE FIRST THING HE TAUGHT ME" }, { at: 94.2, txt: "THIS BREAD", col: COL.amber }], 95.5, 170, 70);
    L.push(<BigNum key="30m" t={t} at={99.6} text="30 MIN" x={1440} y={290} size={150} col={COL.red} edge="#4a1410" out={102.9} sub="KNEADING LIKE CRAZY" />);
    W("more", [{ at: 104.6, txt: "FLOUR · MORE FLOUR · MORE FLOUR" }], 108.7, 880, 64);
    L.push(<Stamp key="cobble" t={t} at={110.6} text="A COBBLESTONE" x={1380} y={260} out={113.3} rot={-6} size={96} />);
    W("dogs", [{ at: 119.0, txt: "EVEN THE DOGS SAID NO" }], 121.6, 880, 70);
    L.push(<Quote key="q1" t={t} at={125.8} out={129.3} lines={[{ at: 125.9, txt: "A BAKER DOES NOT FIGHT." }, { at: 127.5, txt: "A BAKER WAITS." }]} by="DON AURELIO" />);
    W("bowlcrust", [{ at: 129.6, txt: "FROM THE EMPTY BOWL" }, { at: 132.4, txt: "TO THE CRUST THAT SINGS", col: COL.amber }], 136.0, 880, 70);
    W("faster", [{ at: 137.0, txt: "THE FASTER WAY" }], 141.3, 170, 76);
    L.push(<Pills key="lunch" t={t} at={141.6} items={["AFTER BREAKFAST", "→", "WARM AT LUNCH"]} out={145.3} y={860} />);
    L.push(<Pills key="no" t={t} at={145.6} items={["NO MACHINE", "NO KNEADING", "NO SPECIAL FLOUR"]} out={149.2} y={860} />);
    W("4ing", [{ at: 149.5, txt: "FLOUR · WATER · SALT · YEAST", col: COL.amber }], 153.8, 880, 66);
    L.push(<BigNum key="7s" t={t} at={155.8} text="7 SECRETS" x={600} y={470} size={140} col={COL.amber} edge="#5a3a16" out={162.4} />);
    L.push(<BigNum key="3m" t={t} at={159.0} text="3 MISTAKES" x={1320} y={470} size={140} col={COL.red} edge="#4a1410" out={162.4} sub="→ A BRICK" />);
    W("tap", [{ at: 163.0, txt: "BEFORE YOU EVEN TURN ON THE TAP" }], 168.9, 880, 60);
    // secreto 1: la taza
    L.push(<Secret key="s1" t={t} at={169.16} n={1} name="THE CUP" out={171.9} />);
    tag("scA", 172.6, 177.1, PT.cupA, "SCOOPED", "STRAIGHT INTO THE BAG", COL.red, 60, -210);
    W("scoop", [{ at: 177.3, txt: "SCOOP · SCOOP · SCOOP" }, { at: 179.3, txt: "PRESSED DOWN", col: COL.red }], 182.7, 880, 80);
    L.push(<BigNum key="q" t={t} at={184.0} text="+ ¼" x={1460} y={290} size={190} col={COL.amber} edge="#5a3a16" out={189.0} sub="MORE FLOUR IN THE SAME CUP" />);
    tag("scA2", 189.6, 201.4, PT.cupA, "SCOOPED", "PACKED", COL.red, -40, -230);
    tag("scB2", 190.0, 201.4, PT.cupB, "SPOONED", "LOOSE", GREEN, 40, -230);
    W("34", [{ at: 189.6, txt: "RECIPE: 3 CUPS" }, { at: 191.6, txt: "YOU PUT ALMOST 4", col: COL.red }], 197.4, 170, 76);
    L.push(<Stamp key="yb" t={t} at={198.1} text="YOUR BRICK" x={1400} y={840} out={201.4} rot={-6} size={100} />);
    L.push(<BigNum key="400" t={t} at={204.4} text="400 g" x={1450} y={300} size={170} col={COL.amber} edge="#5a3a16" out={206.9} sub="PLAIN FLOUR" />);
    L.push(<CheckList key="nosc" t={t} title="NO SCALE?" rows={[{ at: 207.6, txt: "SPOON IT IN" }, { at: 211.0, txt: "LEVEL IT · KNIFE" }, { at: 214.8, txt: "3 CUPS" }, { at: 216.3, txt: "NEVER PACK IT" }]} out={217.4} />);
    W("snow", [{ at: 217.9, txt: "LIKE SNOW", col: COL.ice }, { at: 220.0, txt: "NOT SAND", col: COL.red }], 222.0, 880, 96);
    W("nocup", [{ at: 222.4, txt: "IN THE BAKERY · NO CUPS" }, { at: 225.6, txt: "AN OLD IRON SCALE", col: COL.amber }], 228.4, 170, 66);
    W("lift", [{ at: 230.4, txt: "THE WEIGHT · JUST BY LIFTING IT" }], 236.9, 880, 62);
    tag("scale", 238.0, 242.2, PT.scale, "THE OLD IRON SCALE", "NEVER WRONG", COL.amber, 220, -150);
    L.push(<Versus key="sc" t={t} at={242.6} out={247.2} title="CHEAPER?" L={{ label: "A KITCHEN SCALE", val: "CHEAP", h: 0.3, col: GREEN, mark: "ok" }} R={{ label: "PRACTICE", val: "50 YEARS", h: 0.7, col: COL.amber }} />);
    L.push(<CheckList key="bowl" t={t} title="INTO THE BOWL" rows={[{ at: 247.6, txt: "400 g FLOUR" }, { at: 249.0, txt: "8 g SALT" }, { at: 254.8, txt: "3 g YEAST" }]} out={258.3} />);
    W("more2", [{ at: 259.3, txt: "A LITTLE MORE YEAST" }, { at: 263.2, txt: "= FASTER", col: COL.amber }], 265.9, 880, 76);
    // secreto 2: el agua
    L.push(<BigNum key="300" t={t} at={269.2} text="300 g" x={1450} y={300} size={160} col={COL.ice} edge="#26425e" out={273.4} sub="WATER · A CUP AND A QUARTER" />);
    L.push(<Secret key="s2" t={t} at={273.9} n={2} name="WARM, NOT HOT" out={276.6} />);
    W("baby", [{ at: 278.4, txt: "LIKE A BABY'S BATH", col: COL.amber }], 281.4, 880, 80);
    L.push(<Pills key="wr" t={t} at={283.4} items={["NOTHING → TOO COLD", "PULL AWAY → TOO HOT"]} out={288.2} y={860} />);
    L.push(<BigNum key="40" t={t} at={289.2} text="40 °C" x={1450} y={300} size={170} col={COL.amber} edge="#5a3a16" out={292.5} sub="105 °F" />);
    W("wake", [{ at: 292.8, txt: "WARM → WAKES IT UP", col: GREEN }, { at: 295.7, txt: "HOT → KILLS IT", col: COL.red }], 300.5, 880, 80);
    L.push(<Stamp key="dead" t={t} at={297.9} text="DEAD" x={1420} y={260} out={300.6} rot={-8} size={130} />);
    L.push(<Mistake key="m1" t={t} at={302.07} n={1} txt="WATER TOO HOT" out={305.4} />);
    L.push(<BigNum key="60" t={t} at={305.6} text="60 °C +" x={1450} y={300} size={150} col={COL.red} edge="#4a1410" out={309.2} sub="A PASTE THAT NEVER RISES" />);
    W("spoon", [{ at: 312.4, txt: "THE HANDLE OF A WOODEN SPOON" }, { at: 315.9, txt: "STIR · 30 SECONDS", col: COL.amber }], 317.5, 880, 66);
    W("dry", [{ at: 319.8, txt: "NO DRY FLOUR LEFT" }], 322.7, 880, 66);
    L.push(<Pills key="ugly" t={t} at={323.1} items={["SHAGGY", "WET", "LUMPY", "STICKY"]} out={326.8} y={860} />);
    L.push(<Stamp key="good" t={t} at={326.95} text="GOOD." x={1420} y={260} out={330.2} rot={-8} size={140} />);
    L.push(<Stamp key="noflour" t={t} at={330.4} text="DO NOT ADD FLOUR" x={960} y={200} out={334.6} rot={-3} size={90} />);
    W("sticky", [{ at: 335.3, txt: "STICKY = WATER" }, { at: 338.4, txt: "= SOFT · FULL OF HOLES", col: COL.amber }], 341.4, 880, 70);
    tag("cover", EV.cover + 0.7, 345.2, PT.bowl, "COVER IT", "A PLATE OR A DAMP CLOTH", COL.ink, 220, -170);
    L.push(<BigNum key="12" t={t} at={345.5} text="1–2 MIN" x={1450} y={300} size={150} col={GREEN} edge="#1f5a36" out={348.0} sub="OF WORK · DONE" />);
    // secreto 3: el gluten
    L.push(<Secret key="s3" t={t} at={348.19} n={3} name="THE BIG ONE" out={351.9} />);
    W("never", [{ at: 352.0, txt: "THE ONE HE NEVER EXPLAINED" }], 355.8, 880, 62);
    W("prot", [{ at: 356.0, txt: "2 PROTEINS IN THE FLOUR" }, { at: 359.9, txt: "+ WATER → THEY HOLD HANDS", col: COL.ice }], 364.2, 170, 64);
    W("net", [{ at: EV.chains, txt: "CHAINS" }, { at: EV.net, txt: "→ A NET" }, { at: EV.gluten, txt: "= GLUTEN", col: COL.amber }], 369.3, 880, 96);
    W("force", [{ at: 370.2, txt: "KNEADING = HELPING BY FORCE" }], 374.6, 880, 62);
    W("alone", [{ at: 375.4, txt: "TIME + WATER DO IT ALONE", col: COL.amber }], 383.9, 170, 70);
    L.push(<Versus key="net" t={t} at={384.2} out={390.1} title="SAME NET" L={{ label: "KNEADING", val: "20 MIN", h: 0.55, col: COL.red, mark: "x" }} R={{ label: "WAITING", val: "2 H", h: 0.7, col: GREEN, mark: "ok" }} />);
    L.push(<Stamp key="torn" t={t} at={390.6} text="NOT TORN" x={1420} y={260} out={393.3} rot={-6} size={110} />);
    L.push(<BigNum key="10pm" t={t} at={397.4} text="10 PM" x={1450} y={290} size={150} col={COL.ice2} edge="#26425e" out={405.9} sub="MIX · COVER WITH SACKS · SLEEP" />);
    L.push(<BigNum key="4am2" t={t} at={406.3} text="4 AM" x={1450} y={290} size={150} col={COL.amber} edge="#5a3a16" out={412.2} sub="THE DOUGH WAS ALIVE" />);
    W("nobody", [{ at: 412.4, txt: "NOBODY TOUCHED IT ALL NIGHT" }], 414.2, 880, 64);
    L.push(<Stamp key="magic" t={t} at={414.4} text="NOT MAGIC" x={1400} y={260} out={417.7} rot={-6} size={110} />);
    W("gas", [{ at: 416.4, txt: "GLUTEN + LITTLE BUBBLES OF GAS" }], 422.4, 880, 62);
    // el camino rápido
    W("fw", [{ at: 422.6, txt: "THE FASTER WAY", col: COL.amber }], 425.9, 170, 80);
    L.push(<BigNum key="25" t={t} at={428.3} text="25–27 °C" x={1440} y={300} size={140} col={COL.amber} edge="#5a3a16" out={433.1} sub="≈ 80 °F · WARM, NOT HOT" />);
    W("light", [{ at: 434.4, txt: "OVEN OFF · LITTLE LIGHT ON", col: COL.amber }], 440.1, 880, 72);
    W("spring", [{ at: 440.3, txt: "LIKE A SPRING AFTERNOON" }], 443.9, 170, 66);
    L.push(<TimeBars key="warm" t={t} rows={[{ at: 444.2, label: "1 HOUR WARM", val: "1 H", frac: 0.3, col: COL.amber }, { at: 446.6, label: "SAME RISE · COLD KITCHEN", val: "2–3 H", frac: 0.9, col: COL.ice }]} out={449.4} />);
    W("2nd", [{ at: 450.2, txt: "WHY THIS BREAD IS FASTER · PART 2" }], 453.2, 880, 58);
    W("1h", [{ at: 453.6, txt: "AFTER THE FIRST HOUR · ONE THING" }], 458.2, 170, 62);
    L.push(<Pills key="wet" t={t} at={458.4} items={["WET HAND", "NOT FLOURED"]} out={462.0} y={860} />);
    W("fold", [{ at: 462.3, txt: "PULL · STRETCH · FOLD", col: COL.amber }], 468.1, 880, 84);
    W("turn", [{ at: 468.3, txt: "TURN ¼ · 4 TIMES · 30 SECONDS" }], 474.0, 880, 64);
    // secreto 4: manos mojadas
    L.push(<Secret key="s4" t={t} at={474.17} n={4} name="WET HANDS" out={476.7} />);
    L.push(<Versus key="hands" t={t} at={476.9} out={481.2} title="EVERY FOLD" L={{ label: "WET HANDS", val: "+0 g", h: 0.2, col: COL.ice, mark: "ok" }} R={{ label: "FLOURED HANDS", val: "+ FLOUR", h: 0.6, col: COL.red, mark: "x" }} />);
    W("back", [{ at: 482.6, txt: "→ BACK TOWARDS THE BRICK", col: COL.red }], 485.8, 880, 66);
    W("comb", [{ at: 489.9, txt: "LIKE COMBING HAIR" }], 494.0, 170, 76);
    W("tall", [{ at: 494.2, txt: "TALL, NOT FLAT", col: COL.amber }], 497.0, 880, 84);
    W("cov2", [{ at: 497.4, txt: "COVER · 1 MORE HOUR" }], 500.3, 170, 66);
    L.push(<Stamp key="liar" t={t} at={505.0} text="THE CLOCK IS A LIAR" x={960} y={200} out={509.9} rot={-3} size={84} />);
    L.push(<CheckList key="ready" t={t} title="READY?" rows={[{ at: 511.4, txt: "DOUBLE SIZE" }, { at: 513.4, txt: "ROUND TOP" }, { at: 515.6, txt: "SIDE BUBBLES" }, { at: 518.9, txt: "JIGGLES" }]} out={522.3} />);
    W("poke", [{ at: 522.1, txt: "THE FINGER TEST · 1 CM", col: COL.amber }], 526.7, 170, 70);
    L.push(<CheckList key="hole" t={t} title="THE HOLE…" rows={[{ at: 526.9, txt: "SLOW → READY" }, { at: 531.5, txt: "FAST → WAIT" }, { at: 535.3, txt: "NEVER → BAKE" }]} out={543.2} />);
    W("anyway", [{ at: 540.8, txt: "STILL BETTER THAN A BRICK" }], 543.3, 880, 66);
    W("oven", [{ at: 543.6, txt: "THE OVEN" }], 546.1, 170, 84);
    // secreto 5: la olla
    L.push(<Secret key="s5" t={t} at={546.31} n={5} name="THE HOT POT" out={549.4} />);
    W("vil", [{ at: 550.0, txt: "MY VILLAGE BAKERY · IN YOUR KITCHEN" }], 554.2, 880, 58);
    L.push(<Pills key="pot" t={t} at={554.4} items={["HEAVY POT", "WITH A LID", "CAST IRON"]} out={561.9} y={860} />);
    L.push(<BigNum key="230" t={t} at={565.7} text="230 °C" x={1450} y={300} size={160} col={COL.amber} edge="#5a3a16" out={572.6} sub="450 °F · 30 MIN · EMPTY POT INSIDE" />);
    W("hot3", [{ at: 568.9, txt: "HOT · HOT · HOT", col: COL.red }], 572.7, 880, 96);
    W("bricks", [{ at: 573.6, txt: "NOT HOT AIR", col: COL.ice }, { at: 575.6, txt: "BRICKS", col: COL.amber }], 578.2, 880, 90);
    W("tons", [{ at: 578.8, txt: "TONS OF BRICKS · HEAT FROM EVERY SIDE" }], 583.0, 880, 58);
    tag("iron", 588.0, 594.2, PT.pot, "THICK IRON", "THE SAME, IN SMALL", COL.amber, 220, -160);
    W("lid", [{ at: 595.0, txt: "THE LID = THE OVEN DOOR" }], 600.0, 880, 66);
    L.push(<Versus key="pale" t={t} at={600.4} out={609.4} title="THE SAME DOUGH" L={{ label: "OPEN AIR", val: "PALE", h: 0.42, col: "#e8d7b2", mark: "x" }} R={{ label: "HOT POT", val: "TALL", h: 0.7, col: COL.amber, mark: "ok" }} />);
    W("shape", [{ at: 610.4, txt: "A LITTLE FLOUR · ONLY UNDER THE DOUGH" }], 617.0, 880, 58);
    L.push(<Stamp key="punch" t={t} at={620.7} text="DO NOT PUNCH IT" x={960} y={200} out={625.0} rot={-3} size={88} />);
    W("2h", [{ at: 622.0, txt: "THE BUBBLES YOU WAITED 2 HOURS FOR" }], 625.1, 880, 58);
    W("1234", [{ at: 628.2, txt: "1 · 2 · 3 · 4", col: COL.amber }], 631.7, 880, 110);
    W("seam", [{ at: 631.9, txt: "SEAM DOWN" }], 634.3, 170, 76);
    W("drum", [{ at: 641.2, txt: "TIGHT LIKE A DRUM", col: COL.amber }], 644.6, 880, 80);
    W("rest", [{ at: 649.8, txt: "REST UNDER A CLOTH" }], 656.5, 880, 66);
    // enero de 1971
    L.push(<BigNum key="1971" t={t} at={657.0} text="JANUARY 1971" y={420} size={140} col={COL.ice2} edge="#26425e" out={662.2} />);
    L.push(<BigNum key="9d" t={t} at={662.7} text="9 DAYS" x={1450} y={280} size={150} col={COL.ice2} edge="#26425e" out={668.9} sub="THE ROAD WAS CLOSED" />);
    L.push(<Pills key="none" t={t} at={665.8} items={["NO TRUCKS", "NO ELECTRICITY", "SHOP EMPTY"]} out={671.0} y={860} />);
    L.push(<CheckList key="needed" t={t} title="MY OVEN NEEDED" rows={[{ at: 674.2, txt: "WOOD" }, { at: 675.5, txt: "FLOUR" }, { at: 676.8, txt: "WATER" }, { at: 678.0, txt: "SALT" }]} out={683.3} />);
    W("lant", [{ at: 684.0, txt: "LANTERNS · A LINE IN THE SNOW" }], 688.4, 880, 62);
    W("hungry", [{ at: 688.6, txt: "NOBODY WENT HUNGRY", col: COL.amber }], 693.0, 880, 76);
    W("recipe", [{ at: 693.2, txt: "THIS BREAD IS NOT A RECIPE" }], 697.2, 880, 66);
    L.push(<Quote key="q2" t={t} at={697.3} out={700.6} lines={[{ at: 697.4, txt: "A WAY TO NEVER" }, { at: 698.6, txt: "DEPEND ON ANYBODY." }]} />);
    // corte, olla, salto
    W("cut", [{ at: 703.0, txt: "ONE CUT · 1 CM DEEP", col: COL.amber }], 707.2, 880, 76);
    W("courage", [{ at: 710.4, txt: "FAST · WITH COURAGE" }], 713.6, 880, 70);
    L.push(<Quote key="q3" t={t} at={718.7} out={722.9} lines={[{ at: 718.8, txt: "THE KNIFE MUST SING," }, { at: 720.6, txt: "NOT SAW." }]} by="DON AURELIO" />);
    W("door", [{ at: 723.8, txt: "THE CUT = THE DOOR YOU OPEN" }], 729.0, 170, 64);
    L.push(<Stamp key="gloves" t={t} at={734.2} text="THICK GLOVES" x={1420} y={250} out={738.5} rot={-6} size={84} />);
    W("paper", [{ at: 739.0, txt: "PAPER AND ALL" }], 741.5, 880, 70);
    L.push(<BigNum key="30lid" t={t} at={744.9} text="30 MIN" x={1450} y={300} size={150} col={COL.amber} edge="#5a3a16" out={751.4} sub="LID ON · DO NOT LOOK" />);
    tag("steam", 752.0, 757.5, PT.potLoaf, "STEAM KEEPS THE SKIN SOFT", "SO IT CAN GROW", COL.ink, 220, -170);
    W("jump", [{ at: 760.1, txt: "THE JUMP OF THE OVEN", col: COL.amber }], 763.8, 880, 84);
    W("tallpale", [{ at: 765.7, txt: "TALL BUT PALE" }], 768.1, 170, 76);
    L.push(<BigNum key="1215" t={t} at={768.4} text="12–15 MIN" x={1450} y={300} size={140} col={COL.amber} edge="#5a3a16" out={772.9} sub="WITHOUT THE LID" />);
    // secreto 6: marrón
    L.push(<Secret key="s6" t={t} at={773.03} n={6} name="NOT BLONDE" out={775.9} />);
    W("afraid", [{ at: 777.0, txt: "AFRAID TO BURN IT" }], 782.3, 880, 70);
    L.push(<Stamp key="wait" t={t} at={782.5} text="WAIT!" x={1420} y={250} out={784.6} rot={-8} size={140} />);
    tag("chest", EV.chestnut + 0.3, 789.9, PT.crust, "CHESTNUT BROWN", "ALMOST BRONZE AT THE CUT", BREAD, 220, -170);
    W("flavor", [{ at: 790.4, txt: "THAT COLOR = THE FLAVOR", col: COL.amber }], 795.7, 880, 76);
    W("sugars", [{ at: 796.0, txt: "SUGARS + PROTEINS COOK TOGETHER" }], 801.4, 170, 60);
    L.push(<Pills key="taste" t={t} at={801.8} items={["TOASTED", "NUTTY", "A LITTLE CARAMEL"]} out={804.9} y={860} />);
    L.push(<Versus key="crust" t={t} at={805.4} out={810.9} title="THE CRUST" L={{ label: "BLONDE", val: "PAPER", h: 0.45, col: "#f1dcaa", mark: "x" }} R={{ label: "BROWN", val: "MY VILLAGE", h: 0.7, col: BREAD, mark: "ok" }} />);
    L.push(<BigNum key="96" t={t} at={814.0} text="96 °C" x={1450} y={300} size={170} col={COL.amber} edge="#5a3a16" out={818.6} sub="205 °F · DONE" />);
    W("hollow", [{ at: 821.0, txt: "HOLLOW LIKE A DRUM", col: COL.amber }, { at: 823.6, txt: "NOT A THUD" }], 825.3, 880, 76);
    W("toktok", [{ at: 825.5, txt: "TOK. TOK." }], 826.8, 170, 96);
    // los 80 panes
    W("once", [{ at: 829.8, txt: "ONCE IN 50 YEARS" }], 835.1, 170, 70);
    L.push(<BigNum key="80" t={t} at={833.0} text="80 LOAVES" x={1450} y={300} size={150} col={COL.red} edge="#4a1410" out={838.0} sub="A WHOLE OVEN · BURNT" />);
    W("love", [{ at: 838.4, txt: "22 · IN LOVE · AT THE DOOR" }], 845.6, 880, 64);
    W("smoke", [{ at: 845.8, txt: "DON AURELIO SAW THE SMOKE" }], 850.2, 170, 62);
    L.push(<Quote key="q4" t={t} at={850.4} out={856.3} lines={[{ at: 850.5, txt: "TODAY YOU LOST 80 LOAVES." }, { at: 854.5, txt: "DO NOT LOSE THE GIRL TOO." }]} by="DON AURELIO" />);
    L.push(<BigNum key="46" t={t} at={858.3} text="46 YEARS" x={1450} y={300} size={150} col={COL.amber} edge="#5a3a16" out={863.0} sub="TOGETHER" />);
    W("heel", [{ at: 861.6, txt: "THE HEEL OF THE FIRST LOAF" }], 866.9, 880, 62);
    // secreto 7: no lo cortes caliente
    L.push(<Secret key="s7" t={t} at={868.08} n={7} name="THE HARDEST ONE" out={871.0} />);
    W("crick", [{ at: 875.9, txt: "CRICK · CRACK · CRACK", col: COL.amber }], 878.0, 880, 90);
    W("sing", [{ at: 878.1, txt: "THE CRUST IS SINGING" }], 884.3, 170, 76);
    L.push(<Stamp key="nocut" t={t} at={884.5} text="DO NOT CUT IT" x={960} y={220} out={886.4} rot={-4} size={100} />);
    L.push(<Mistake key="m2" t={t} at={886.6} n={2} txt="CUTTING IT HOT" out={890.6} />);
    W("still", [{ at: 894.5, txt: "THE STEAM IS STILL MOVING" }], 900.6, 170, 62);
    tag("cust", 896.0, 900.5, PT.loaf, "STILL COOKING", "LIKE A CUSTARD", COL.amber, 220, -160);
    W("gummy", [{ at: 902.0, txt: "THE STEAM ESCAPES → GUMMY", col: COL.red }], 907.3, 880, 66);
    L.push(<Stamp key="imp" t={t} at={910.2} text="NOT RAW. IMPATIENT." x={960} y={200} out={913.5} rot={-3} size={80} />);
    L.push(<BigNum key="1h" t={t} at={913.8} text="1 HOUR" x={1450} y={300} size={160} col={GREEN} edge="#1f5a36" out={919.8} sub="ON A RACK · AIR UNDER IT" />);
    W("holes", [{ at: 919.0, txt: "THE HOLES · THE SHINE · THE SOFT INSIDE", col: COL.amber }], 924.9, 880, 54);
    // los 3 errores
    L.push(<MistakesDeal key="md" t={t} at={925.0} out={927.0} title="THE 3 MISTAKES" n={3} />);
    L.push(<Mistake key="r1" t={t} at={927.1} n={1} txt="WATER TOO HOT" out={933.4} />);
    W("wrist", [{ at: 929.0, txt: "WRIST TEST · 40 °C" }], 933.4, 170, 70);
    L.push(<Mistake key="r2" t={t} at={933.5} n={2} txt="TOO MUCH FLOUR" out={943.4} />);
    W("scf", [{ at: 935.4, txt: "THE SCOOPED CUP · THE FLOURED HANDS" }], 940.0, 170, 58);
    L.push(<Stamp key="sg" t={t} at={940.5} text="STICKY IS GOOD" x={1400} y={260} out={943.4} rot={-6} size={90} />);
    L.push(<Mistake key="r3" t={t} at={943.5} n={3} txt="IMPATIENCE" out={956.1} />);
    L.push(<CheckList key="impl" t={t} title="IMPATIENCE" rows={[{ at: 946.1, txt: "A COLD POT" }, { at: 947.4, txt: "A BLONDE CRUST" }, { at: 948.4, txt: "CUT HOT" }]} out={956.1} />);
    W("needs", [{ at: 950.2, txt: "POT 30 MIN · CRUST BROWN · BREAD 1 HOUR" }], 956.1, 170, 52);
    W("never2", [{ at: 956.3, txt: "NEVER A BRICK AGAIN", col: COL.amber }], 959.5, 880, 86);
    W("wrong", [{ at: 960.0, txt: "IF SOMETHING GOES WRONG…" }], 964.0, 170, 64);
    L.push(<BigNum key="flat" t={t} at={965.0} text="FLAT?" x={1450} y={290} size={150} col={COL.amber} edge="#5a3a16" out={972.1} sub="WAITED TOO LONG · SKIN NOT TIGHT" />);
    L.push(<Pills key="fix" t={t} at={972.4} items={["BAKE A LITTLE EARLIER", "PULL IT TIGHTER"]} out={976.9} y={860} />);
    L.push(<BigNum key="burnt" t={t} at={977.1} text="BURNT BOTTOM?" y={300} size={110} col={COL.red} edge="#4a1410" out={981.4} sub="A BAKING SHEET UNDER THE POT" />);
    L.push(<BigNum key="soft" t={t} at={981.6} text="SOFT CRUST?" y={300} size={110} col={COL.ice2} edge="#26425e" out={988.4} sub="NORMAL · 5 MIN IN A HOT OVEN" />);
    L.push(<BigNum key="dense" t={t} at={992.7} text="TOO DENSE?" y={250} size={110} col={COL.amber} edge="#5a3a16" out={995.4} sub="CHECK THE CUP" />);
    L.push(<Stamp key="cup" t={t} at={995.6} text="IT'S ALMOST ALWAYS THE CUP" x={960} y={860} out={998.6} rot={-3} size={70} />);
    // la cuenta
    W("baker", [{ at: 999.4, txt: "A BAKER, NOT A BANKER" }], 1003.6, 880, 66);
    L.push(<TimeBars key="cost" t={t} rows={[{ at: 1005.6, label: "2 KG OF FLOUR", val: "5 LOAVES", frac: 0.6, col: COL.amber }, { at: 1011.0, label: "ONE LOAF", val: "< A COFFEE", frac: 0.18, col: GREEN }, { at: 1015.6, label: "A GOOD CITY BAKERY", val: "×4 – ×6", frac: 1, col: COL.red }]} out={1020.3} />);
    L.push(<Versus key="label" t={t} at={1022.7} out={1032.0} title="LOOK AT THE LABEL" L={{ label: "SUPERMARKET BAG", val: "15–20", h: 0.7, col: "#9aa3ad", mark: "x" }} R={{ label: "MINE", val: "4", h: 0.22, col: COL.amber, mark: "ok" }} />);
    L.push(<Pills key="mine" t={t} at={1032.2} items={["FLOUR", "WATER", "SALT", "YEAST"]} out={1036.9} y={860} />);
    W("family", [{ at: 1036.0, txt: "A FAMILY THAT NEVER BUYS BREAD AGAIN", col: COL.amber }], 1040.4, 170, 56);
    // la receta entera
    W("write", [{ at: 1040.6, txt: "WRITE IT DOWN" }], 1044.8, 170, 84);
    L.push(<CheckList key="recA" t={t} title="THE DOUGH" rows={[{ at: 1045.3, txt: "400 g FLOUR" }, { at: 1049.7, txt: "8 g SALT" }, { at: 1051.4, txt: "3 g YEAST" }, { at: 1053.6, txt: "300 g WATER" }, { at: 1057.6, txt: "STIR 1 MIN" }, { at: 1059.0, txt: "2 H + 1 FOLD" }]} out={1064.2} x={1300} y={200} />);
    L.push(<CheckList key="recB" t={t} title="THE BAKE" rows={[{ at: 1064.4, txt: "SHAPE TIGHT" }, { at: 1066.0, txt: "POT 230 °C" }, { at: 1070.3, txt: "1 BRAVE CUT" }, { at: 1071.8, txt: "30 + 15 MIN" }, { at: 1074.2, txt: "CHESTNUT" }, { at: 1077.8, txt: "1 H ON A RACK" }]} out={1081.6} x={1300} y={200} />);
    W("work", [{ at: 1079.6, txt: "5 MINUTES OF WORK · THE REST IS TIME", col: COL.amber }], 1082.1, 880, 58);
    // Don Aurelio, la pala, el cierre
    W("peel", [{ at: 1086.0, txt: "HIS SCALE · HIS OLD WOODEN PEEL" }], 1092.2, 880, 62);
    W("still2", [{ at: 1092.4, txt: "I STILL USE IT", col: COL.amber }], 1096.8, 170, 76);
    L.push(<Quote key="q5" t={t} at={1096.9} out={1099.3} lines={[{ at: 1097.0, txt: "BENITO, STOP FIGHTING." }, { at: 1098.6, txt: "WAIT." }]} by="DON AURELIO" />);
    W("welcome", [{ at: 1105.8, txt: "WELCOME TO MY BAKERY", col: COL.amber }], 1110.1, 300, 90);
    L.push(<SubBell key="sub" t={t} at={1110.4} bellAt={1111.6} out={1117.3} />);
    W("week", [{ at: 1113.4, txt: "EVERY WEEK · ONE MORE THING THE OLD BAKERS KNEW" }], 1117.3, 170, 48);
    L.push(<Question key="qq" t={t} at={1124.0} out={1133.4} opts={[{ at: 1129.4, txt: "A BRICK", col: COL.red }, { at: 1130.2, txt: "A PANCAKE", col: COL.amber }, { at: 1131.5, txt: "A MIRACLE", col: GREEN }]} />);
    W("read", [{ at: 1133.7, txt: "I READ EVERY ONE · 4 AM · WITH MY COFFEE" }], 1137.3, 880, 54);
    L.push(<NextCard key="next" t={t} at={1137.6} subAt={1143.2} out={1150.1} title="MY BREAD VS THE SUPERMARKET LABEL">
      <></>
    </NextCard>);
    W("go", [{ at: 1151.4, txt: "WASH THE BOWL · WARM THE WATER" }, { at: 1155.1, txt: "DO NOT FIGHT THE DOUGH", col: COL.amber }], 1157.8, 880, 64);
    W("listen", [{ at: 1159.9, txt: "WHEN IT CRACKLES · LISTEN" }], 1164.2, 170, 66);
    L.push(<BigNum key="50y" t={t} at={1165.6} text="50 YEARS OF MORNINGS" y={480} size={110} col={COL.amber} edge="#5a3a16" out={1169.6} sub="NOW IT IS YOURS" />);
    return L;
  },
});

export const Full: React.FC = () => <AbsoluteFill><V.Body /></AbsoluteFill>;
export const FULL_FRAMES = V.FRAMES;
