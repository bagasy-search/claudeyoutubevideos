// benitoes01 (gemelo ES de benito01) · el video ENTERO (0 → 1291,8 s) con el motor del kit yanqui3d: una base por frase
// (toma LTX de Benito haciendo lo que dice / la panadería 3D en corte / el avatar) y CERO cortes secos; las piezas 2.5D cruzan
// las transiciones. Promesa de la miniatura: "NI LA TOQUÉ" → la masa nunca se toca con las manos (cuchara, rasqueta, papel).
// Todo entra con at("frase"). El mundo 3D (world3d.tsx) tiene UNA cámara keyada a la voz. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { setSlug, BigNum, COL, FONT, LowerThird, Tag, e, extrude, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Beat, Stamp, Tr } from "../kits/yanqui3d/engine";
import { CheckList, Mistake, MistakesDeal, NextCard, TimeBars, Versus, Words } from "../kits/yanqui3d/pieces";
import { EV, PT, World, screenOf } from "./world3d";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("benitoes01");
export const TEND = 1291.8;
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

// "SECRETO Nº n": tarjeta de capítulo que cae del fondo (misma familia que StepTitle del kit)
const Secret: React.FC<{ t: number; at: number; n: number; name: string; out: number }> = ({ t, at, n, name, out }) => {
  const o = e(t, at - 0.02, at + 0.18) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.85)), k2 = Math.min(1, spr(t, at + 0.22, 1)), sweep = e(t, at + 0.3, at + 1.1);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1400 }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 55% at 50% 48%, rgba(0,0,0,.55), transparent 75%)" }} />
      <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) translateZ(${(1 - k) * -1400}px) rotateX(${(1 - k) * 50 + 8}deg) rotateY(${Math.sin((t - at) * 0.8) * 5}deg)`, textAlign: "center", fontFamily: FONT, whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 900, fontSize: 60, letterSpacing: 22, color: COL.ink, textShadow: extrude(5, "rgba(0,0,0,.7)"), marginBottom: -20 }}>SECRETO Nº</div>
        <div style={{ position: "relative", display: "inline-block", fontWeight: 900, fontSize: 340, lineHeight: 1, color: COL.amber, textShadow: extrude(22, "#5a3410") }}>
          {n}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${sweep * 140 - 40}%, rgba(255,255,255,.75) ${sweep * 140 - 25}%, transparent ${sweep * 140 - 10}%)`, WebkitBackgroundClip: "text", color: "transparent", mixBlendMode: "screen" } as React.CSSProperties}>{n}</div>
        </div>
        <div style={{ transform: `translateY(${(1 - k2) * 60}px)`, opacity: k2, fontWeight: 900, fontSize: 88, letterSpacing: 10, color: COL.ink, textShadow: extrude(8, "#3a2a18") }}>{name}</div>
      </div>
    </AbsoluteFill>
  );
};

// fila de pastillas de texto que caen de a una (FEA · DESGREÑADA · MOJADA · PEGAJOSA)
const Pills: React.FC<{ t: number; at: number; items: string[]; out: number; y?: number }> = ({ t, at, items, out, y = 860 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y - 50, display: "flex", justifyContent: "center", gap: 26, perspective: 1200 }}>
    {items.map((it, i) => {
      const a = at + i * 0.22, k = Math.min(1.08, spr(t, a, 1.1)), o = e(t, a, a + 0.1) * (1 - e(t, out + i * 0.04, out + i * 0.04 + 0.25));
      if (o <= 0.01) return null;
      return <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 90}px) rotateX(${(1 - Math.min(1, k)) * 60}deg) scale(${k})`, padding: "16px 34px", borderRadius: 999, background: it === "→" ? "transparent" : "linear-gradient(180deg,rgba(40,26,14,.94),rgba(18,11,6,.94))", border: it === "→" ? "none" : "3px solid " + COL.amber + "aa", boxShadow: it === "→" ? "none" : "0 22px 44px rgba(0,0,0,.55)", fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 3, color: COL.ink, textShadow: extrude(4, "rgba(0,0,0,.7)"), whiteSpace: "nowrap" }}>{it}</div>;
    })}
  </div>
);

// cita de Don Aurelio / de Benito: comillas grandes, frases que entran de a una
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

// suscríbete + campanita (sin links: sólo el gesto)
const SubBell: React.FC<{ t: number; at: number; bellAt: number; out: number }> = ({ t, at, bellAt, out }) => {
  const o = e(t, at - 0.05, at + 0.2) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 1)), kb = Math.min(1.04, spr(t, bellAt, 1.2));
  const ring = t > bellAt ? Math.sin((t - bellAt) * 18) * 22 * Math.exp(-(t - bellAt) * 1.6) : 0;
  const pressed = t > at + 1.0 ? 1 : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, opacity: o, fontFamily: FONT }}>
      <div style={{ transform: `scale(${k * (1 - 0.06 * e(t, at + 0.9, at + 1.0) + 0.06 * e(t, at + 1.0, at + 1.15))})`, padding: "26px 60px", borderRadius: 18, background: pressed ? "#3a3a3a" : "#d9302a", color: "#fff", fontWeight: 900, fontSize: 64, letterSpacing: 6, boxShadow: "0 24px 50px rgba(0,0,0,.55), inset 0 3px 0 rgba(255,255,255,.3)" }}>{pressed ? "SUSCRITO ✓" : "SUSCRÍBETE"}</div>
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
        <div style={{ fontWeight: 800, fontSize: 44, letterSpacing: 10, color: COL.dim }}>CUÉNTAMELO EN LOS COMENTARIOS</div>
        <div style={{ fontWeight: 900, fontSize: 96, color: COL.ink, textShadow: extrude(8, "rgba(0,0,0,.75)") }}>TU PRIMER PAN, ¿CÓMO TE SALIÓ?</div>
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
  beats: ({ AV, CL, at, Avatar }) => {
    return [
      // ---- gancho: vos estás ahí, con el ladrillo en la mano ----
      AV(0, "cut"),
      CL(M(0), "h_brick_phone", "whip"),                                             // toc, como una piedra
      W3(EV.inside - 0.3, "portal", sp(EV.inside, PT.loaf)),                         // por dentro: pálido, pesado, húmedo
      CL(M(15.7), "h_knead_tired", "whipL"),                                         // veinte minutos, los brazos muertos
      AV(31.5, "whip"),
      CL(at("limpias, esta masa") - 0.8, "es_manos_arriba", "light"),               // NI LA TOQUÉ
      W3(EV.four - 0.3, "portal", sp(EV.four + 1, PT.bowl)),                         // tres minutos, una noche, una olla
      // ---- quién es Benito ----
      AV(48.8, "whipL"),
      W3(M(48.8), "portal"),                                                         // la panadería entera
      AV(65.0, "whip"),
      CL(M(65.0), "b_oven4am", "light"),                                             // el horno de leña a las 4
      CL(at("A las 7 la calle"), "b_street_bags", "whipL"),
      AV(83.3, "whip"),
      CL(M(83.3), "h_aurelio_hands", "light"),
      W3(at("Todo lo que sé lo aprendí") - 0.2, "portal"),
      AV(98.6, "whipL"),
      CL(M(98.6), "h_boy_knead", "whip"),                                            // amasando como un loco
      AV(115.5, "whipL"),
      CL(M(115.5), "b_dogs_brick", "whip"),                                          // ni los perros
      W3(at("Entonces me dijo, Benito") - 0.2, "light", undefined, [[at("un panadero no pelea") - 0.2, at("Y esa misma noche") - 0.3]]),
      // ---- el viejo truco: la artesa, la pala, la noche ----
      AV(132.9, "whip"),
      CL(M(132.9), "es_artesa_pala", "portal"),                                      // la pala en la artesa, nunca las manos
      AV(149.1, "whipL"),
      W3(M(149.1), "portal", sp(EV.sacos + 0.5, [-7.0, 0.8, -2.6])),                 // los sacos, a dormir
      CL(EV.viva - 0.3, "h_dough_alive", "light"),                                   // a las 4: viva
      AV(165.7, "whip"),
      W3(M(165.7), "portal", undefined, [[at("nada de máquina") - 0.3, at("nada de máquina") + 4]]),   // la promesa
      AV(182.0, "whipL"),
      W3(M(182.0), "light", undefined, [[at("los siete") - 0.3, 203.8]]),            // 7 secretos · 3 errores
      // ---- secreto 1: la taza ----
      AV(198.9, "whip"),
      W3(M(198.9), "portal", sp(EV.scoopIt, PT.cupA)),
      CL(EV.scoopIt - 0.4, "h_scoop", "whip"),                                       // la mete en el paquete y aprieta
      AV(217.0, "whipL", { spans: [[217.0, 220.7]] }),
      W3(M(217.0), "portal", sp(EV.quarter, PT.cupA)),
      AV(233.3, "whip"),
      W3(M(233.3), "portal", undefined, [[at("ese es tu ladrillo") - 0.2, at("ese es tu ladrillo") + 4.2]]),
      AV(247.7, "whipL"),
      CL(M(247.7), "h_spoon_level", "whip"),                                         // con cuchara, enrasada
      AV(265.4, "whip"),
      CL(M(265.4), "h_scale", "light"),                                              // la báscula vieja de hierro
      CL(at("y don Aurelio sabía") - 0.2, "b_lift_dough", "whipL"),
      AV(281.0, "whip"),
      W3(M(281.0), "portal", sp(at("sale más barata"), PT.scale), [[at("sale más barata") - 0.2, at("en el bol con la harina") - 0.3]]),
      AV(296.8, "whipL"),
      W3(M(296.8), "portal"),                                                        // sal y una pizca de levadura
      AV(313.0, "whip"),
      W3(M(313.0), "portal", undefined, [[at("poca levadura y mucho tiempo") - 0.2, at("poca levadura y mucho tiempo") + 5]]),
      // ---- secreto 2: el agua tibia ----
      AV(328.4, "whipL"),
      CL(M(328.4), "h_wrist", "whip"),                                               // la gota en la muñeca
      W3(EV.deg40 - 0.4, "portal"),                                                  // la levadura despierta / muere
      AV(362.6, "whip"),
      CL(M(362.6), "es_reloj_arena", "light"),                                       // los tres minutos: el reloj y la cuchara
      AV(378.1, "whipL"),
      W3(M(378.1), "portal", sp(EV.ugly + 1, PT.bowl)),                              // fea, desgreñada, pegajosa: perfecta
      CL(at("y no le eches más harina") - 0.2, "h_stir_spoon", "whip"),
      AV(396.2, "whipL"),
      W3(M(396.2), "portal", sp(EV.cover + 1, PT.bowl)),                             // tapada · tres minutos en el reloj
      // ---- secreto 3: el gluten se arma solo ----
      AV(412.3, "whip", { spans: [[EV.secret3, EV.secret3 + 2.6]] }),
      W3(M(412.3), "portal"),
      AV(428.1, "whipL", { spans: [[428.1, 433.8]] }),
      W3(M(428.1), "portal"),
      AV(446.1, "whip"),
      W3(M(446.1), "light", undefined, [[at("Veinte minutos de amasar") - 0.2, at("y mientras tanto la") - 0.2]]),
      AV(462.2, "whipL"),
      W3(M(462.2), "portal"),                                                        // burbujitas en la red
      // ---- la noche ----
      AV(479.8, "whip"),
      CL(M(479.8), "es_bol_noche", "light"),                                         // tapas y a dormir
      AV(496.4, "whipL"),
      CL(M(496.4), "b_sleep_sacks", "whip"),                                         // dormía sobre los sacos
      CL(at("la masa respiraba") - 0.3, "h_bubbles_bowl", "whipL"),                  // plop
      AV(512.5, "whip"),
      W3(M(512.5), "portal", sp(EV.ready, PT.bowl), [[at("El reloj miente") - 0.2, at("El reloj miente") + 3]]),
      AV(529.5, "whipL"),
      W3(M(529.5), "portal", sp(EV.double, PT.dough)),                               // el doble · tiembla como una gelatina
      AV(546.1, "whip"),
      CL(M(546.1), "h_oven_light", "light"),                                         // la lucecita del horno
      // ---- el pliegue, sin manos ----
      AV(563.7, "whipL", { spans: [[at("No.", 565) - 0.1, at("No.", 565) + 1.4]] }),
      CL(M(563.7), "es_rasqueta_pliegue", "whip"),                                   // la rasqueta mojada
      AV(581.6, "whipL"),
      W3(M(581.6), "portal", sp(EV.turn + 1, PT.bowl)),                              // cuatro veces, 30 segundos · secreto 4
      AV(599.4, "whip"),
      W3(M(599.4), "portal", undefined, [[at("con la espátula mojada no se pega") - 0.2, EV.comb - 0.2]]),   // peina la red
      // ---- secreto 5: la olla caliente ----
      AV(616.7, "whipL"),
      W3(M(616.7), "portal", undefined, [[EV.secret5 - 0.1, EV.secret5 + 2.6]]),
      AV(632.1, "whip"),
      CL(M(632.1), "b_pot_oven", "whipL"),                                           // la olla vacía al horno, 240
      AV(648.2, "whip"),
      W3(M(648.2), "portal"),                                                        // eran ladrillos
      CL(EV.tons - 0.2, "h_oven_bricks", "whip"),
      AV(664.0, "whipL"),
      W3(M(664.0), "portal"),                                                        // el viejo truco: la bóveda de vapor
      AV(679.5, "whip"),
      W3(M(679.5), "portal", sp(EV.lidSteam + 1, PT.dome)),                          // 80 masas soltando agua
      AV(698.1, "whipL"),
      W3(M(698.1), "portal", undefined, [[at("chato y pálido") - 0.3, EV.puerta + 2.5]]),
      AV(714.4, "whip", { spans: [[EV.boveda - 0.1, EV.boveda + 4.3]] }),
      // ---- la forma, otra vez sin manos ----
      W3(M(714.4), "light", undefined, [[EV.forma + 1, at("Vuelca el bol") - 0.4]]),
      AV(730.6, "whipL"),
      CL(M(730.6), "h_tip_out", "whip"),                                             // cae sola por su peso
      CL(EV.bordes - 0.3, "es_papel_rasqueta", "whipL"),                             // los bordes por debajo con la rasqueta
      AV(749.3, "whip"),
      W3(M(749.3), "portal", undefined, [[EV.tensa - 0.3, at("y la dejas reposar") - 0.3]]),
      // ---- enero del 71 ----
      AV(763.7, "whipL"),
      W3(M(763.7), "portal", undefined, [[EV.enero + 0.2, EV.enero + 5]]),
      AV(778.9, "light"),
      W3(M(778.9), "portal", undefined, [[at("Necesitaba leña") - 0.3, at("Y teníamos las cuatro") + 2]]),
      AV(796.0, "whipL"),
      CL(M(796.0), "b_snow_line", "light"),                                          // faroles en la nieve
      CL(at("Ahí entendí") - 0.4, "b_snow_child", "whip"),
      // ---- el corte, la olla, el salto ----
      AV(813.2, "whipL"),
      CL(M(813.2), "h_score", "whip"),                                               // un solo corte, con valor
      AV(828.8, "whipL", { spans: [[at("tiene que cantar") - 0.6, at("tiene que cantar") + 2.8]] }),
      W3(M(828.8), "portal"),                                                        // la puerta del pan
      AV(844.9, "whip"),
      CL(M(844.9), "h_lower_pot", "whipL"),                                          // el papel como una cuna
      AV(859.8, "whip"),
      W3(M(859.8), "portal", sp(EV.growing, PT.potLoaf)),                            // el salto del horno
      AV(876.8, "whipL"),
      CL(M(876.8), "h_lid_off", "whip"),                                             // alto pero pálido · 15 más
      W3(EV.blonde - 1.8, "portal", sp(EV.blonde, PT.crust), [[EV.blonde - 1.7, EV.blonde + 1.7]]),
      // ---- secreto 6: no lo saques rubio ----
      AV(893.8, "whip"),
      CL(M(893.8), "h_dark_crust", "whipL"),                                         // moreno como una castaña
      AV(909.3, "whip", { spans: [[at("Tostado, a fruto") - 0.3, 913.9]] }),
      W3(M(909.3), "portal", sp(EV.thermo + 1, PT.crust), [[at("Una corteza rubia") - 0.3, at("Si tienes termómetro") - 0.3]]),
      CL(at("Si no, dale") - 0.2, "h_knock_bottom", "whip"),                          // tac, tac
      // ---- los 80 panes ----
      AV(943.3, "whipL"),
      W3(M(943.3), "portal", undefined, [[at("80 panes", 940) - 0.2, at("Tenía 22 años") + 1.5]]),
      CL(at("Estaba enamorado") - 0.2, "b_smoke", "whip"),                            // vio el humo
      AV(962.3, "whipL", { spans: [[962.3, 966.1]] }),
      W3(M(962.3), "portal", undefined, [[EV.casa + 1.5, EV.casa + 4.5]]),
      // ---- secreto 7: no lo cortes caliente ----
      AV(978.3, "whip", { spans: [[EV.secret7 - 0.1, EV.secret7 + 2.6]] }),
      CL(M(978.3), "b_ear_crackle", "whipL"),                                        // cric, crac
      AV(992.5, "whip"),
      W3(M(992.5), "portal", sp(EV.stillCook, PT.loaf), [[at("No lo cortes") - 0.2, at("Cortar el pan caliente") + 1.5]]),
      AV(1009.6, "whipL"),
      CL(M(1009.6), "h_cut_hot", "whip"),                                            // gomosa
      W3(at("Y tú piensas, está crudo") - 0.2, "portal", undefined, [[at("Y tú piensas, está crudo") - 0.2, 1027.4]]),
      AV(1026.9, "whip"),
      CL(M(1026.9), "h_cut_cool", "whipL"),                                          // la miga abierta
      // ---- los 3 errores + si algo sale mal ----
      AV(1042.4, "whipL", { spans: [[1042.4, 1046.9]] }),
      W3(M(1042.4), "portal"),
      AV(1058.8, "whip", { spans: [[1058.8, 1062.3]] }),
      W3(M(1058.8), "portal"),
      AV(1073.5, "whipL"),
      W3(M(1073.5), "portal"),
      AV(1088.9, "whip", { spans: [[1088.9, 1092.7]] }),
      W3(M(1088.9), "portal"),
      AV(1105.5, "whipL"),
      W3(M(1105.5), "portal"),
      // ---- la cuenta ----
      AV(1120.1, "whip"),
      W3(M(1120.1), "portal", undefined, [[at("te da dos panes") - 1.4, at("Y el pan de bolsa") - 0.3]]),
      AV(1137.8, "whipL", { spans: [[at("mira la etiqueta") - 0.2, 1143.4]] }),
      W3(M(1137.8), "portal", undefined, [[1143.4, at("una familia entera") + 2]]),
      // ---- la receta entera ----
      AV(1153.6, "whip"),
      W3(M(1153.6), "portal", undefined, [[EV.recap + 2, 1205.5]]),
      AV(1167.5, "whipL", { spans: [[1167.5, 1171.4]] }),
      W3(M(1167.5), "portal", undefined, [[EV.recap + 2, 1205.5]]),
      AV(1185.0, "whip", { spans: [[1185.0, 1189.7]] }),
      W3(M(1185.0), "portal", undefined, [[EV.recap + 2, 1205.5]]),
      // ---- Don Aurelio, la pala, el cierre ----
      AV(1201.6, "whipL"),
      CL(M(1201.6), "b_peel", "whip"),                                               // su pala de madera vieja
      AV(1217.8, "whipL", { spans: [[at("deja de pelear") - 0.4, 1221.6]] }),
      W3(M(1217.8), "portal"),
      AV(1234.1, "whip"),
      W3(M(1234.1), "portal", undefined, [[at("cuéntame en los comentarios") - 0.3, 1250.4]]),
      AV(1250.4, "whipL", { spans: [[1250.4, at("Los leo todos") - 0.2]] }),
      CL(M(1250.4), "b_coffee", "whip"),                                             // con mi café, a las 4
      W3(at("Y la semana que viene") - 0.2, "portal"),
      AV(1268.0, "whipL"),
      W3(M(1268.0), "portal"),
      AV(1284.0, "whip"),
    ];
  },
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const tag = (key: string, a: number, out: number, q: [number, number, number], text: string, sub?: string, col?: string, dx = 220, dy = -120) => {
      if (t < a - 0.1 || t > out + 0.4) return;
      const s = screenOf(t, q);
      L.push(<Tag key={key} t={t} at={a} x={s.x} y={s.y} dx={dx} dy={dy} text={text} sub={sub} col={col} out={out} />);
    };
    const W = (key: string, items: { at: number; txt: string; col?: string }[], out: number, y = 880, size = 76) => { if (t > items[0].at - 0.3 && t < out + 0.5) L.push(<Words key={key} t={t} items={items} out={out} y={y} size={size} />); };
    // ---- gancho ----
    W("toc", [{ at: at("toc, como"), txt: "TOC." }, { at: at("una piedra"), txt: "COMO UNA PIEDRA", col: COL.red }], at("metes el cuchillo"), 860, 96);
    tag("inside", EV.pale, at("Veinte minutos amasando") - 0.4, PT.loaf, "PÁLIDO · PESADO · HÚMEDO", "EN EL MEDIO", COL.red);
    W("20min", [{ at: at("Veinte minutos amasando"), txt: "20 MINUTOS AMASANDO" }], at("y te salió un") - 0.1);
    L.push(<Stamp key="brick" t={t} at={at("un ladrillo", 20)} text="UN LADRILLO" x={1400} y={280} out={at("no se lo cuentas") + 1} rot={-8} size={110} />);
    W("arms", [{ at: at("no fueron tus brazos"), txt: "NO FUERON TUS BRAZOS" }, { at: at("fue amasar"), txt: "FUE AMASAR", col: COL.amber }], at("y fíjate en mis manos") + 0.6);
    L.push(<Stamp key="nila" t={t} at={at("ni la toqué")} text="NI LA TOQUÉ." x={1380} y={250} out={at("Tres minutos con una cuchara") - 0.1} rot={-6} size={120} />);
    L.push(<Pills key="three" t={t} at={EV.four} items={["3 MIN DE CUCHARA", "1 NOCHE", "1 OLLA"]} out={at("cuando no tenían") + 1.5} y={860} />);
    W("why", [{ at: at("¿cómo puede ser") , txt: "NADIE LO AMASA" }, { at: at("salga mejor"), txt: "¿Y SALE MEJOR?", col: COL.amber }], at("Siéntate, te lo cuento") - 0.2, 540, 100);
    // ---- Benito ----
    L.push(<LowerThird key="lt" t={t} at={at("me llamo Benito")} out={at("y durante 50") + 4} name="BENITO" l2="70 AÑOS · PANADERO DE PUEBLO · 50 AÑOS" l2at={at("Tengo 70 años")} />);
    W("castilla", [{ at: at("un pueblo pequeño de Castilla"), txt: "UN PUEBLO PEQUEÑO DE CASTILLA" }], at("Todas las mañanas") - 0.2, 170, 70);
    L.push(<BigNum key="4am" t={t} at={at("a las 4, a oscuras")} text="4:00" x={1440} y={300} size={170} col={COL.amber} edge="#5a3a16" out={at("A las 7 la calle") - 0.2} sub="CADA MAÑANA · SARMIENTOS DE LA VIÑA" />);
    W("7am", [{ at: at("A las 7 la calle"), txt: "A LAS 7 · TODA LA CALLE OLÍA A PAN" }], at("Empecé con 14") - 0.2, 880, 60);
    W("14", [{ at: at("Empecé con 14"), txt: "CON 14 AÑOS · BARRIENDO HARINA" }], at("Un hombre duro") - 0.2, 170, 66);
    L.push(<Tag key="aur" t={t} at={at("Don Aurelio", 85)} x={760} y={560} dx={220} dy={-170} text="DON AURELIO" sub="EL PANADERO" col={COL.amber} out={at("Un hombre duro") + 0.6} />);
    W("hands", [{ at: at("manos enormes"), txt: "MANOS ENORMES · CERO PACIENCIA" }], at("nunca escribió") + 2.4, 880, 64);
    W("this", [{ at: at("lo primero que me enseñó"), txt: "LO PRIMERO QUE ME ENSEÑÓ" }, { at: at("este pan", 99), txt: "ESTE PAN", col: COL.amber }], at("Mi primer pan") - 0.1, 170, 70);
    L.push(<BigNum key="30m" t={t} at={at("media hora")} text="30 MIN" x={1440} y={290} size={150} col={COL.red} edge="#4a1410" out={at("pegaba, así que") + 0.4} sub="AMASANDO COMO UN LOCO" />);
    W("more", [{ at: at("y más harina y más"), txt: "HARINA · MÁS HARINA · MÁS HARINA" }], at("porque yo creía") + 2.5, 880, 62);
    L.push(<Stamp key="adoquin" t={t} at={at("como un adoquín")} text="UN ADOQUÍN" x={1380} y={260} out={at("Don Aurelio lo cogió") - 0.2} rot={-6} size={110} />);
    W("dogs", [{ at: at("los perros tampoco"), txt: "NI LOS PERROS LO QUISIERON" }], at("Entonces me dijo") - 0.1, 880, 70);
    L.push(<Quote key="q1" t={t} at={at("un panadero no pelea")} out={at("Y esa misma noche") - 0.3} lines={[{ at: at("un panadero no pelea"), txt: "UN PANADERO NO PELEA." }, { at: at("un panadero espera"), txt: "UN PANADERO ESPERA." }]} by="DON AURELIO" />);
    W("truco", [{ at: EV.truco, txt: "EL VIEJO TRUCO", col: COL.amber }], at("A las 10, cuando") - 0.2, 170, 84);
    L.push(<BigNum key="10pm" t={t} at={at("A las 10, cuando")} text="22:00" x={1450} y={290} size={150} col={COL.ice2} edge="#26425e" out={EV.artesa + 0.4} sub="AL CERRAR LA PANADERÍA" />);
    L.push(<Pills key="ing0" t={t} at={at("echaba la harina")} items={["HARINA", "AGUA", "SAL", "UN PELLIZCO DE LEVADURA"]} out={EV.artesa + 0.3} y={860} />);
    W("artesa", [{ at: at("que es un cajón largo"), txt: "LA ARTESA · UN CAJÓN LARGO DE MADERA" }, { at: EV.pala, txt: "+ UNA PALA DE MADERA", col: COL.amber }], at("Nunca le metía") - 0.2, 880, 58);
    L.push(<Stamp key="nunca" t={t} at={at("Nunca le metía las manos")} text="NUNCA LAS MANOS" x={1380} y={260} out={at("Tres minutos, ni uno") - 0.1} rot={-6} size={96} />);
    W("3min", [{ at: at("Tres minutos, ni uno"), txt: "3 MINUTOS. NI UNO MÁS.", col: COL.amber }], at("Lo tapaba con") - 0.1, 880, 86);
    tag("sacos", EV.sacos + 0.6, EV.viva - 0.5, [-7.0, 0.85, -2.6], "TAPADA CON SACOS", "Y A DORMIR", COL.ink, 220, -170);
    L.push(<BigNum key="4am2" t={t} at={EV.viva} text="4:00" x={1450} y={290} size={150} col={COL.amber} edge="#5a3a16" out={at("Nadie la había tocado") - 0.2} sub="VIVA · SUAVE · LLENA DE BURBUJAS" />);
    W("nadie", [{ at: at("Nadie la había tocado"), txt: "NADIE LA TOCÓ EN TODA LA NOCHE", col: COL.amber }], at("ese es el pan que") + 1, 880, 62);
    W("tukitchen", [{ at: at("en tu cocina", 160), txt: "EN TU COCINA" }, { at: at("un bol y en una olla"), txt: "UN BOL · UNA OLLA", col: COL.amber }], at("te lo doy todo") + 0.6, 170, 76);
    W("bowlcrust", [{ at: at("desde el bol vacío"), txt: "DEL BOL VACÍO" }, { at: at("la corteza que canta"), txt: "A LA CORTEZA QUE CANTA", col: COL.amber }], at("harina común de") - 0.1, 880, 70);
    W("4ing", [{ at: at("harina común de"), txt: "HARINA · AGUA · SAL · LEVADURA", col: COL.amber }], at("nada de máquina") - 0.3, 880, 66);
    L.push(<Pills key="no" t={t} at={at("nada de máquina")} items={["SIN MÁQUINA", "SIN HARINA ESPECIAL", "SIN AMASAR"]} out={at("tres minutos de", 185) - 0.1} y={860} />);
    W("cuchara", [{ at: at("tres minutos de", 185), txt: "3 MINUTOS DE TRABAJO" }, { at: at("o de tu cuchara"), txt: "…DE TU CUCHARA", col: COL.amber }], at("el resto lo hace") + 2, 880, 70);
    L.push(<BigNum key="7s" t={t} at={at("los siete")} text="7 SECRETOS" x={600} y={470} size={140} col={COL.amber} edge="#5a3a16" out={203.6} />);
    L.push(<BigNum key="3m" t={t} at={at("y los tres errores", 195)} text="3 ERRORES" x={1320} y={470} size={140} col={COL.red} edge="#4a1410" out={203.6} sub="→ UN LADRILLO" />);
    W("grifo", [{ at: at("antes de abrir el grifo"), txt: "ANTES DE ABRIR EL GRIFO" }], at("secreto número uno") - 0.1, 880, 62);
    // ---- secreto 1: la taza ----
    L.push(<Secret key="s1" t={t} at={at("secreto número uno")} n={1} name="LA TAZA" out={EV.scoopIt - 0.1} />);
    tag("scA", EV.scoopIt + 0.3, EV.scoopIt - 0.5, PT.cupA, "A CUCHARÓN", "DIRECTO EN EL PAQUETE", COL.red, 60, -210);
    W("scoop", [{ at: EV.scoop3, txt: "DIRECTO AL PAQUETE" }, { at: EV.press, txt: "Y APRIETA", col: COL.red }], 217.0, 880, 80);
    L.push(<BigNum key="q" t={t} at={at("una cuarta parte más")} text="+ ¼" x={1460} y={290} size={190} col={COL.amber} edge="#5a3a16" out={EV.threeCups - 0.2} sub="MÁS HARINA EN LA MISMA TAZA" />);
    tag("scA2", EV.quarter + 0.4, EV.threeCups - 0.3, PT.cupA, "APRETADA", "A PRESIÓN", COL.red, -40, -230);
    tag("scB2", EV.quarter + 0.8, EV.threeCups - 0.3, PT.cupB, "CON CUCHARA", "SUELTA", GREEN, 40, -230);
    W("45", [{ at: EV.threeCups, txt: "LA RECETA: 4 TAZAS" }, { at: at("y tú pones casi cinco"), txt: "TÚ PONES CASI 5", col: COL.red }], at("mucha harina, poca agua") + 2, 170, 76);
    L.push(<Stamp key="yb" t={t} at={at("ese es tu ladrillo")} text="TU LADRILLO" x={960} y={500} out={at("ese es tu ladrillo") + 4} rot={-6} size={130} />);
    W("cup", [{ at: at("no tus brazos, la taza"), txt: "NO TUS BRAZOS. LA TAZA.", col: COL.amber }], at("si tienes una báscula") - 0.1, 880, 76);
    L.push(<BigNum key="500" t={t} at={EV.g400} text="500 g" x={1450} y={300} size={170} col={COL.amber} edge="#5a3a16" out={at("si no tienes báscula") - 0.2} sub="HARINA COMÚN · MEDIO KILO" />);
    L.push(<CheckList key="nosc" t={t} title="¿SIN BÁSCULA?" rows={[{ at: at("coge una cuchara, deja"), txt: "CON CUCHARA" }, { at: at("suavecito"), txt: "SUAVECITO" }, { at: at("y enrásala"), txt: "ENRASAR · CUCHILLO" }, { at: at("sin apretar nunca"), txt: "NUNCA APRETAR" }]} out={at("sin apretar nunca") + 1.8} />);
    W("snow", [{ at: at("como nieve"), txt: "COMO NIEVE", col: COL.ice }, { at: at("no como arena"), txt: "NO COMO ARENA", col: COL.red }], at("en la panadería no usábamos") - 0.1, 880, 96);
    W("nocup", [{ at: at("en la panadería no usábamos"), txt: "EN LA PANADERÍA · NADA DE TAZAS" }, { at: EV.iron, txt: "UNA BÁSCULA VIEJA DE HIERRO", col: COL.amber }], at("y don Aurelio sabía") + 0.4, 170, 62);
    W("lift", [{ at: at("y don Aurelio sabía"), txt: "EL PESO · CON SÓLO LEVANTARLA" }], 281.0, 880, 62);
    L.push(<Stamp key="10g" t={t} at={at("ni por 10 gramos")} text="NI POR 10 g" x={1400} y={260} out={at("yo estuve años") + 1} rot={-6} size={100} />);
    L.push(<Versus key="sc" t={t} at={at("sale más barata")} out={at("en el bol con la harina") - 0.3} title="¿MÁS BARATO?" L={{ label: "UNA BÁSCULA", val: "BARATA", h: 0.3, col: GREEN, mark: "ok" }} R={{ label: "LA PRÁCTICA", val: "50 AÑOS", h: 0.7, col: COL.amber }} />);
    L.push(<CheckList key="bowl" t={t} title="AL BOL" rows={[{ at: EV.intoBowl, txt: "500 g HARINA" }, { at: EV.salt, txt: "10 g SAL" }, { at: EV.yeast, txt: "2 g LEVADURA SECA" }]} out={at("o si la tienes fresca") + 0.4} />);
    W("avellana", [{ at: at("o si la tienes fresca"), txt: "FRESCA: COMO UNA AVELLANA" }], 313.0, 880, 66);
    L.push(<Versus key="lev" t={t} at={at("poca levadura y mucho tiempo")} out={at("poca levadura y mucho tiempo") + 5} title="SABE A PAN" L={{ label: "MUCHA LEVADURA", val: "PRISA", h: 0.4, col: COL.red, mark: "x" }} R={{ label: "POCA + TIEMPO", val: "SABOR", h: 0.7, col: GREEN, mark: "ok" }} />);
    // ---- secreto 2: el agua ----
    L.push(<BigNum key="380" t={t} at={at("380 gramos de agua")} text="380 g" x={1450} y={300} size={160} col={COL.ice} edge="#26425e" out={at("aquí va el secreto número 2") - 0.1} sub="DE AGUA" />);
    L.push(<Secret key="s2" t={t} at={at("secreto número 2")} n={2} name="TIBIA, NO CALIENTE" out={333.6} />);
    W("baby", [{ at: EV.bath, txt: "COMO EL BAÑO DE UN BEBÉ", col: COL.amber }], at("echa una gota") - 0.1, 880, 76);
    L.push(<Pills key="wr" t={t} at={at("si no sientes nada")} items={["NADA → FRÍA", "APARTAS LA MANO → CALIENTE"]} out={EV.deg40 - 0.2} y={860} />);
    L.push(<BigNum key="37" t={t} at={EV.deg40} text="37 °C" x={1450} y={300} size={170} col={COL.amber} edge="#5a3a16" out={EV.wakes - 0.1} />);
    W("wake", [{ at: EV.wakes, txt: "TIBIA → LA DESPIERTA", col: GREEN }, { at: EV.kills, txt: "CALIENTE → LA MATA", col: COL.red }], EV.dead + 1.5, 880, 80);
    L.push(<Stamp key="dead" t={t} at={EV.dead + 0.8} text="NO VUELVE" x={1420} y={260} out={at("ese es el primer gran error") - 0.1} rot={-8} size={120} />);
    L.push(<Mistake key="m1" t={t} at={at("ese es el primer gran error")} n={1} lab="ERROR" txt="AGUA DEMASIADO CALIENTE" out={EV.tooHot - 0.1} />);
    L.push(<BigNum key="55" t={t} at={EV.tooHot} text="+55 °C" x={1450} y={300} size={150} col={COL.red} edge="#4a1410" out={362.6} sub="ENGRUDO QUE NO SUBE NUNCA" />);
    W("reloj", [{ at: EV.reloj, txt: "EL RELOJ EN MARCHA", col: COL.amber }], EV.pour + 2, 170, 76);
    W("cuchara2", [{ at: at("coges una cuchara de madera"), txt: "UNA CUCHARA DE MADERA · Y REVUELVES" }], 378.1, 880, 62);
    W("seca", [{ at: at("ni un poquito de harina seca"), txt: "NI UN POQUITO DE HARINA SECA" }], EV.ugly - 0.1, 170, 62);
    L.push(<Pills key="ugly" t={t} at={EV.ugly + 0.5} items={["FEA", "DESGREÑADA", "MOJADA", "GRUMOS", "PEGAJOSA"]} out={at("perfecto, así tiene") - 0.1} y={860} />);
    L.push(<Stamp key="good" t={t} at={at("perfecto, así tiene")} text="PERFECTO." x={1420} y={260} out={at("y no le eches más harina") - 0.2} rot={-8} size={130} />);
    L.push(<Stamp key="noflour" t={t} at={at("y no le eches más harina")} text="NO LE ECHES MÁS HARINA" x={960} y={200} out={EV.sticky - 0.1} rot={-3} size={84} />);
    W("sticky", [{ at: EV.sticky, txt: "PEGAJOSO = AGUA" }, { at: at("que la miga salga tierna"), txt: "= MIGA TIERNA Y CON AGUJEROS", col: COL.amber }], 396.2, 880, 66);
    tag("cover", EV.cover + 0.7, EV.tresMin - 0.3, PT.bowl, "TAPADO", "UN PLATO O UN TRAPO HÚMEDO", COL.ink, 220, -170);
    L.push(<BigNum key="3min" t={t} at={EV.tresMin} text="3 MIN" x={1450} y={300} size={160} col={GREEN} edge="#1f5a36" out={412.3} sub="SE ACABÓ EL TRABAJO" />);
    L.push(<Stamp key="manos" t={t} at={at("ni las ensucié")} text="NI LAS ENSUCIÉ" x={1380} y={760} out={412.6} rot={-5} size={92} />);
    // ---- secreto 3: el gluten ----
    L.push(<Secret key="s3" t={t} at={EV.secret3} n={3} name="EL GRANDE" out={EV.secret3 + 2.6} />);
    W("nunca", [{ at: at("El que don Aurelio nunca"), txt: "EL QUE DON AURELIO NUNCA EXPLICÓ" }], EV.twoProt - 0.1, 880, 60);
    W("prot", [{ at: EV.twoProt, txt: "2 PROTEÍNAS EN LA HARINA" }, { at: EV.hands, txt: "+ AGUA → SE DAN LA MANO", col: COL.ice }], EV.chains - 0.1, 170, 64);
    W("net", [{ at: EV.chains, txt: "CADENAS" }, { at: EV.net, txt: "→ UNA RED" }, { at: EV.gluten, txt: "= GLUTEN", col: COL.amber }], EV.knead - 0.2, 880, 96);
    W("force", [{ at: EV.knead, txt: "AMASAR = OBLIGARLAS A LA FUERZA" }], EV.alone - 1, 880, 62);
    W("alone", [{ at: EV.alone, txt: "CON TIEMPO Y AGUA · SOLAS", col: COL.amber }], 446.1, 170, 70);
    L.push(<Stamp key="amasan" t={t} at={EV.doKnead} text="LAS HORAS AMASAN POR TI" x={960} y={760} out={at("Veinte minutos de amasar") - 0.2} rot={-3} size={78} />);
    L.push(<Versus key="net" t={t} at={at("Veinte minutos de amasar")} out={at("y mientras tanto la") - 0.2} title="LA MISMA RED" L={{ label: "AMASAR", val: "20 MIN", h: 0.55, col: COL.red, mark: "x" }} R={{ label: "DORMIR", val: "1 NOCHE", h: 0.7, col: GREEN, mark: "ok" }} />);
    L.push(<Stamp key="rota" t={t} at={EV.tear} text="SIN ROMPERLA" x={1420} y={260} out={at("y mientras tanto la") + 0.6} rot={-6} size={100} />);
    W("gas", [{ at: at("come los azúcares"), txt: "COME LOS AZÚCARES · SUELTA GAS" }, { at: at("como en un globo"), txt: "COMO EN UN GLOBO", col: COL.amber }], at("con poca levadura y toda") - 0.1, 880, 62);
    W("sabor", [{ at: at("con poca levadura y toda"), txt: "POCA LEVADURA + TODA LA NOCHE = SABOR", col: COL.amber }], EV.notMagic - 1.8, 170, 56);
    L.push(<Stamp key="magia" t={t} at={EV.notMagic} text="NO ERA MAGIA" x={1400} y={260} out={479.8} rot={-6} size={104} />);
    // ---- la noche ----
    L.push(<BigNum key="1822" t={t} at={EV.deg25} text="18–22 °C" x={1440} y={300} size={140} col={COL.amber} edge="#5a3a16" out={EV.apaga - 0.1} sub="EN LA ENCIMERA" />);
    W("cama", [{ at: EV.apaga, txt: "APAGA LA LUZ · A LA CAMA" }], EV.twoHours - 0.1, 880, 72);
    L.push(<BigNum key="12h" t={t} at={EV.twoHours} text="12–16 H" x={1440} y={300} size={160} col={COL.ice2} edge="#26425e" out={at("tú duermes") + 3} sub="TÚ DUERMES · LA MASA TRABAJA" />);
    W("plop", [{ at: at("y hacía plop") + 0.3, txt: "PLOP.", col: COL.amber }], 512.5, 880, 120);
    W("mejor", [{ at: at("Toda la noche nadie"), txt: "NADIE LA TOCÓ" }, { at: at("y estaba mejor"), txt: "Y ESTABA MEJOR", col: COL.amber }], 517.1, 170, 70);
    W("lista", [{ at: EV.ready - 1.2, txt: "¿CÓMO SABES QUE ESTÁ LISTA?" }], at("No por el reloj") + 1.2, 170, 70);
    L.push(<Stamp key="liar" t={t} at={at("El reloj miente")} text="EL RELOJ MIENTE" x={960} y={200} out={at("El reloj miente") + 3} rot={-3} size={96} />);
    L.push(<CheckList key="ready" t={t} title="¿LISTA?" rows={[{ at: EV.double, txt: "EL DOBLE O MÁS" }, { at: at("llena de burbujas", 530), txt: "LLENA DE BURBUJAS" }, { at: EV.sides, txt: "AGUJERITOS EN EL BOL" }, { at: EV.jiggle, txt: "TIEMBLA COMO GELATINA" }]} out={546.1} />);
    W("luz", [{ at: EV.light - 1.5, txt: "EL HORNO APAGADO · LA LUCECITA ENCENDIDA", col: COL.amber }], 563.4, 880, 58);
    // ---- el pliegue, sin manos (secreto 4) ----
    W("pliegue", [{ at: EV.firstHour, txt: "EL PLIEGUE" }], at("No.", 565) - 0.1, 170, 84);
    L.push(<Stamp key="no" t={t} at={at("No.", 565)} text="NO." x={1420} y={260} out={at("No.", 565) + 1.4} rot={-8} size={160} />);
    L.push(<Pills key="tool" t={t} at={EV.wetTool} items={["ESPÁTULA", "RASQUETA", "CUCHARA", "→", "MOJADA"]} out={at("mojada nunca con harina") + 1.5} y={860} />);
    W("fold", [{ at: EV.grab, txt: "POR EL BORDE · ARRIBA · POR ENCIMA", col: COL.amber }], 581.6, 880, 70);
    W("turn", [{ at: EV.turn, txt: "¼ DE VUELTA · 4 VECES · 30 SEGUNDOS" }], at("ese es el secreto número 4") - 0.1, 880, 62);
    L.push(<Secret key="s4" t={t} at={at("secreto número 4")} n={4} name="HERRAMIENTA MOJADA" out={at("nunca harina la harina") + 0.3} />);
    L.push(<Versus key="hands" t={t} at={at("con la espátula mojada no se pega")} out={EV.comb - 0.2} title="EN CADA PLIEGUE" L={{ label: "ESPÁTULA MOJADA", val: "+0 g", h: 0.2, col: COL.ice, mark: "ok" }} R={{ label: "MANOS ENHARINADAS", val: "+ HARINA", h: 0.6, col: COL.red, mark: "x" }} />);
    W("back", [{ at: at("un paso de vuelta hacia"), txt: "→ DE VUELTA AL LADRILLO", col: COL.red }], at("con la espátula mojada no se pega") - 0.2, 170, 66);
    W("comb", [{ at: EV.comb, txt: "COMO PEINAR EL PELO" }], at("para que el pan crezca") + 0.3, 170, 76);
    W("tall", [{ at: at("hacia arriba y no se desparrame"), txt: "HACIA ARRIBA · NO DESPARRAMADO", col: COL.amber }], 616.7, 880, 72);
    // ---- secreto 5: la olla ----
    L.push(<Secret key="s5" t={t} at={EV.secret5} n={5} name="LA OLLA CALIENTE" out={EV.secret5 + 2.6} />);
    W("vil", [{ at: at("tu cocina se convierte"), txt: "TU COCINA → MI PANADERÍA", col: COL.amber }], 632.1, 880, 66);
    L.push(<Pills key="pot" t={t} at={EV.potT} items={["OLLA PESADA", "CON TAPA", "HIERRO FUNDIDO"]} out={EV.potIn - 0.1} y={860} />);
    L.push(<BigNum key="240" t={t} at={at("a 240 grados")} text="240 °C" x={1450} y={300} size={160} col={COL.amber} edge="#5a3a16" out={at("La olla vacía tiene que") - 0.1} sub="OLLA VACÍA · MEDIA HORA" />);
    W("hot3", [{ at: at("caliente, caliente, caliente"), txt: "CALIENTE · CALIENTE · CALIENTE", col: COL.red }], 648.2, 880, 86);
    W("bricks", [{ at: at("no era aire caliente"), txt: "NO ERA AIRE CALIENTE", col: COL.ice }, { at: EV.bricks, txt: "ERAN LADRILLOS", col: COL.amber }], EV.tons - 0.3, 880, 86);
    W("tons", [{ at: EV.tons, txt: "TONELADAS DE LADRILLO · CALOR POR TODOS LADOS" }], 664.0, 880, 56);
    tag("iron", at("hierro grueso") , 674.0, PT.pot, "HIERRO GRUESO", "LO MISMO, EN PEQUEÑO", COL.amber, 220, -160);
    W("nadie", [{ at: EV.viejoTruco, txt: "EL VIEJO TRUCO QUE NADIE TE CUENTA", col: COL.amber }], 679.5, 880, 62);
    L.push(<BigNum key="80v" t={t} at={at("con 80 panes")} text="80 PANES" x={1450} y={300} size={150} col={COL.amber} edge="#5a3a16" out={EV.lidSteam - 0.1} sub="Y LA PUERTA CERRADA" />);
    tag("vapor", EV.lidSteam + 0.5, at("ese vapor mantiene") - 0.2, PT.dome, "LA BÓVEDA, LLENA DE VAPOR", "80 MASAS SOLTANDO AGUA", COL.ink, 220, -170);
    W("piel", [{ at: at("ese vapor mantiene"), txt: "EL VAPOR = PIEL BLANDA" }, { at: at("el pan puede crecer"), txt: "→ CRECE Y CRECE", col: COL.amber }], 698.1, 880, 70);
    L.push(<Versus key="pale" t={t} at={at("chato y pálido") - 0.4} out={EV.puerta + 2.5} title="LA MISMA MASA" L={{ label: "AL AIRE", val: "CHATO Y PÁLIDO", h: 0.42, col: "#e8d7b2", mark: "x" }} R={{ label: "CON TAPA", val: "ALTO", h: 0.7, col: COL.amber, mark: "ok" }} />);
    W("puerta", [{ at: EV.puerta, txt: "LA TAPA = LA PUERTA DE MI HORNO", col: COL.amber }], at("Guarda el vapor") + 3.5, 170, 64);
    L.push(<BigNum key="boveda" t={t} at={EV.boveda} text="UNA BÓVEDA DE PUEBLO" y={420} size={110} col={COL.amber} edge="#5a3a16" out={EV.boveda + 4.3} sub="DE 20 CENTÍMETROS" />);
    // ---- la forma, sin manos ----
    W("forma", [{ at: EV.forma, txt: "LA FORMA · OTRA VEZ SIN MANOS", col: COL.amber }], at("pon una hoja") - 0.1, 170, 70);
    L.push(<Pills key="papel" t={t} at={at("pon una hoja")} items={["PAPEL DE HORNO", "UN POCO DE HARINA"]} out={at("Aquí sí, un poquito") - 0.1} y={860} />);
    W("debajo", [{ at: at("Aquí sí, un poquito"), txt: "HARINA · SÓLO DEBAJO DE LA MASA" }], 730.6, 880, 62);
    W("sola", [{ at: at("deja que la masa caiga sola"), txt: "QUE CAIGA SOLA", col: COL.amber }], at("No la golpees") - 0.1, 880, 84);
    L.push(<Stamp key="golpe" t={t} at={at("No la golpees")} text="NO LA GOLPEES" x={960} y={200} out={at("Perderías las burbujas") + 2.6} rot={-3} size={92} />);
    W("bordes", [{ at: EV.bordes, txt: "LOS BORDES · POR DEBAJO · CON LA ESPÁTULA" }], 749.3, 880, 56);
    L.push(<CheckList key="sinmanos" t={t} title="SIN MANOS" rows={[{ at: at("ves como se va redondeando"), txt: "SE REDONDEA SOLA" }, { at: EV.tensa, txt: "LA PIEL, TENSA" }, { at: at("que el pan se levante"), txt: "SE LEVANTA Y SE ABRE" }]} out={763.7} />);
    // ---- enero del 71 ----
    L.push(<BigNum key="1971" t={t} at={EV.enero + 0.4} text="ENERO DE 1971" y={420} size={140} col={COL.ice2} edge="#26425e" out={EV.enero + 5} />);
    L.push(<BigNum key="9d" t={t} at={at("nueve días", 772)} text="9 DÍAS" x={1450} y={280} size={150} col={COL.ice2} edge="#26425e" out={778.9} sub="LA CARRETERA, CERRADA" />);
    L.push(<Pills key="none" t={t} at={at("sin camiones")} items={["SIN CAMIONES", "3 DÍAS SIN LUZ", "TIENDA VACÍA"]} out={at("Pero mi horno no") + 1} y={860} />);
    L.push(<CheckList key="needed" t={t} title="MI HORNO NECESITABA" rows={[{ at: at("Necesitaba leña"), txt: "LEÑA" }, { at: at("harina, agua y sal", 785), txt: "HARINA" }, { at: at("agua y sal", 785), txt: "AGUA" }, { at: at("y sal", 787), txt: "SAL" }]} out={at("Y teníamos las cuatro") + 2} />);
    W("comio", [{ at: at("todo el pueblo comió"), txt: "TODO EL PUEBLO COMIÓ DE AQUEL HORNO" }], 796.0, 880, 58);
    W("faroles", [{ at: at("con faroles"), txt: "FAROLES · COLA EN LA NIEVE" }], at("El alcalde") - 0.1, 880, 62);
    W("hambre", [{ at: at("nadie pasó hambre"), txt: "NADIE PASÓ HAMBRE", col: COL.amber }], at("Ahí entendí") - 0.1, 880, 76);
    L.push(<Quote key="q2" t={t} at={at("no es una receta")} out={813.2} lines={[{ at: at("no es una receta"), txt: "NO ES UNA RECETA." }, { at: at("es una manera de no depender"), txt: "ES NO DEPENDER NUNCA DE NADIE." }]} />);
    // ---- corte, olla, salto ----
    W("cut", [{ at: at("un solo corte decidido"), txt: "UN SOLO CORTE · 1 CM", col: COL.amber }], at("Uno, rápido") - 0.1, 880, 76);
    W("valor", [{ at: at("Uno, rápido"), txt: "RÁPIDO · CON VALOR" }], at("Si te da miedo") - 0.1, 880, 76);
    L.push(<Quote key="q3" t={t} at={at("tiene que cantar") - 0.6} out={at("tiene que cantar") + 2.8} lines={[{ at: at("tiene que cantar") - 0.5, txt: "EL CUCHILLO TIENE QUE CANTAR," }, { at: at("tiene que cantar") + 0.9, txt: "NO SERRAR." }]} by="DON AURELIO" />);
    W("door", [{ at: at("es la puerta que le abres"), txt: "EL CORTE = LA PUERTA QUE LE ABRES" }], at("y ahora con", 840) - 0.1, 170, 62);
    L.push(<Stamp key="gloves" t={t} at={at("guantes gruesos")} text="GUANTES GRUESOS" x={1420} y={250} out={EV.cuna - 0.2} rot={-6} size={80} />);
    W("cuna", [{ at: EV.cuna, txt: "EL PAPEL · COMO UNA CUNA", col: COL.amber }], at("tampoco aquí la tocas") - 0.1, 880, 72);
    L.push(<Stamp key="tocas" t={t} at={at("tampoco aquí la tocas")} text="TAMPOCO AQUÍ LA TOCAS" x={960} y={200} out={859.8} rot={-3} size={78} />);
    L.push(<BigNum key="30lid" t={t} at={EV.lidOn} text="30 MIN" x={1450} y={300} size={150} col={COL.amber} edge="#5a3a16" out={864.2} sub="CON TAPA · NO MIRES" />);
    tag("steam", EV.growing + 0.3, EV.jump - 0.4, PT.potLoaf, "SOLTANDO VAPOR", "LA BÓVEDA DE TU OLLA LO GUARDA", COL.ink, 220, -170);
    W("jump", [{ at: EV.jump, txt: "EL SALTO DEL HORNO", col: COL.amber }], 876.8, 880, 84);
    L.push(<BigNum key="230" t={t} at={at("Bajas el horno a 230")} text="230 °C" x={1450} y={300} size={140} col={COL.amber} edge="#5a3a16" out={EV.blonde - 1.8} sub="SIN TAPA · 15 MIN MÁS" />);
    // ---- secreto 6: moreno ----
    L.push(<Secret key="s6" t={t} at={at("Secreto número 6")} n={6} name="NO LO SAQUES RUBIO" out={EV.blonde + 1.7} />);
    W("miedo", [{ at: at("por miedo a quemarlo"), txt: "POR MIEDO A QUEMARLO" }], 893.8, 880, 70);
    L.push(<Stamp key="espera" t={t} at={at("Espera, déjalo")} text="¡ESPERA!" x={1420} y={250} out={at("Espera, déjalo") + 1.6} rot={-8} size={130} />);
    W("castana", [{ at: at("del color de una castaña"), txt: "COLOR CASTAÑA · CASI BRONCE", col: BREAD }], 899.6, 880, 76);
    W("flavor", [{ at: EV.flavor, txt: "ESE COLOR = EL SABOR", col: COL.amber }], 909.3, 880, 76);
    L.push(<Pills key="taste" t={t} at={EV.toasted} items={["TOSTADO", "FRUTO SECO", "UN POCO A CARAMELO"]} out={913.9} y={860} />);
    L.push(<Versus key="crust" t={t} at={at("Una corteza rubia")} out={EV.thermo - 0.3} title="LA CORTEZA" L={{ label: "RUBIA", val: "PAPEL", h: 0.45, col: "#f1dcaa", mark: "x" }} R={{ label: "MORENA", val: "MI PUEBLO", h: 0.7, col: BREAD, mark: "ok" }} />);
    tag("chest", EV.thermo + 0.4, EV.d96 + 2, PT.crust, "96 °C EN EL CENTRO", "ESTÁ HECHO", COL.amber, 220, -170);
    W("hueco", [{ at: at("Tiene que sonar hueco"), txt: "HUECO, COMO UN TAMBOR", col: COL.amber }, { at: at("Nada de toc sordo"), txt: "NADA DE TOC SORDO" }], at("Tac, tac") - 0.1, 880, 72);
    W("tactac", [{ at: at("Tac, tac"), txt: "TAC. TAC." }], at("Te voy a contar") + 0.6, 170, 96);
    // ---- los 80 panes ----
    W("una", [{ at: EV.quema, txt: "EN 50 AÑOS · UNA SOLA VEZ" }], at("80 panes", 945) - 0.1, 170, 70);
    L.push(<BigNum key="80" t={t} at={at("80 panes", 945)} text="80 PANES" x={1450} y={300} size={150} col={COL.red} edge="#4a1410" out={at("Tenía 22 años") + 1.5} sub="UNA HORNADA ENTERA · QUEMADA" />);
    W("love", [{ at: at("Estaba enamorado"), txt: "22 AÑOS · ENAMORADO · EN LA PUERTA" }], at("Don Aurelio entró") - 0.1, 880, 62);
    L.push(<Quote key="q4" t={t} at={at("hoy perdiste ochenta panes") - 0.4} out={966.1} lines={[{ at: at("hoy perdiste ochenta panes") - 0.3, txt: "HOY PERDISTE 80 PANES." }, { at: at("no pierdas también"), txt: "NO PIERDAS TAMBIÉN A LA CHICA." }]} by="DON AURELIO" />);
    L.push(<BigNum key="46" t={t} at={at("46 años juntos")} text="46 AÑOS" x={1450} y={300} size={150} col={COL.amber} edge="#5a3a16" out={EV.casa + 4.5} sub="JUNTOS" />);
    W("pico", [{ at: at("se comía el pico"), txt: "EL PICO DEL PRIMER PAN" }], 978.3, 880, 66);
    // ---- secreto 7: no lo cortes caliente ----
    L.push(<Secret key="s7" t={t} at={EV.secret7} n={7} name="EL MÁS DIFÍCIL" out={EV.secret7 + 2.6} />);
    W("crick", [{ at: at("Cric, crac"), txt: "CRIC · CRAC · CRIC", col: COL.amber }], 992.5, 880, 90);
    W("canta", [{ at: at("Es la corteza cantando"), txt: "LA CORTEZA CANTANDO" }], 997.3, 170, 76);
    L.push(<Stamp key="nocut" t={t} at={at("No lo cortes")} text="NO LO CORTES" x={960} y={220} out={EV.hotCut - 0.1} rot={-4} size={110} />);
    L.push(<Mistake key="m2" t={t} at={EV.hotCut} n={2} lab="ERROR" txt="CORTARLO CALIENTE" out={at("Cortar el pan caliente") + 1.5} />);
    tag("cust", EV.stillCook + 0.3, 1009.4, PT.loaf, "TODAVÍA SE ESTÁ HACIENDO", "EL VAPOR SE MUEVE", COL.amber, 220, -160);
    W("flan", [{ at: at("como un flan"), txt: "COMO UN FLAN" }], 1015.9, 880, 84);
    W("gomosa", [{ at: EV.gummy, txt: "→ GOMOSA Y HÚMEDA", col: COL.red }], at("Y tú piensas, está crudo") - 0.2, 880, 76);
    L.push(<Stamp key="imp" t={t} at={at("No estaba crudo")} text="NO ESTABA CRUDO. ERA IMPACIENCIA." x={960} y={500} out={1027.4} rot={-3} size={70} />);
    L.push(<BigNum key="1h" t={t} at={EV.rack} text="1 HORA" x={1450} y={300} size={160} col={GREEN} edge="#1f5a36" out={EV.holes - 0.2} sub="EN UNA REJILLA · AIRE POR DEBAJO" />);
    W("holes", [{ at: EV.holes, txt: "AGUJEROS · BRILLO · MIGA TIERNA", col: COL.amber }], EV.errores - 0.2, 880, 58);
    // ---- los 3 errores ----
    L.push(<MistakesDeal key="md" t={t} at={EV.errores} out={1042.6} title="LOS 3 ERRORES" n={3} />);
    L.push(<Mistake key="r1" t={t} at={at("El agua demasiado caliente")} n={1} lab="ERROR" txt="AGUA DEMASIADO CALIENTE" out={at("2.", 1050) - 0.1} />);
    W("wrist", [{ at: at("Prueba de la muñeca"), txt: "LA MUÑECA · AGUA DE BEBÉ · 37 °C" }], at("2.", 1050) - 0.1, 170, 62);
    L.push(<Mistake key="r2" t={t} at={at("Demasiada harina")} n={2} lab="ERROR" txt="DEMASIADA HARINA" out={at("3.", 1061) - 0.1} />);
    W("scf", [{ at: at("La taza apretada"), txt: "LA TAZA APRETADA · LAS MANOS ENHARINADAS" }], at("Pegajoso es bueno") - 0.1, 170, 54);
    L.push(<Stamp key="sg" t={t} at={at("Pegajoso es bueno")} text="PEGAJOSO ES BUENO" x={1400} y={260} out={1062.0} rot={-6} size={84} />);
    L.push(<Mistake key="r3" t={t} at={at("La impaciencia")} n={3} lab="ERROR" txt="LA IMPACIENCIA" out={1073.5} />);
    L.push(<CheckList key="impl" t={t} title="IMPACIENCIA" rows={[{ at: at("La olla fría"), txt: "LA OLLA FRÍA" }, { at: at("La corteza rubia"), txt: "LA CORTEZA RUBIA" }, { at: at("El pan cortado caliente"), txt: "CORTADO CALIENTE" }]} out={1073.5} />);
    W("needs", [{ at: at("La olla necesita su media hora"), txt: "OLLA 30 MIN · CORTEZA MORENA · 1 H DE REJILLA" }], 1073.5, 170, 50);
    W("nunca2", [{ at: at("no vuelves a ser un ladrillo"), txt: "NUNCA MÁS UN LADRILLO", col: COL.amber }], at("Y si algo sale mal") - 0.1, 880, 84);
    W("mal", [{ at: EV.algoMal, txt: "SI ALGO SALE MAL…" }], at("Si el pan te") - 0.1, 170, 64);
    L.push(<BigNum key="flat" t={t} at={at("chato como una torta")} text="¿CHATO COMO UNA TORTA?" y={300} size={100} col={COL.amber} edge="#5a3a16" out={1088.9} sub="ESPERÓ DEMASIADO · O PIEL SIN TENSAR" />);
    L.push(<Pills key="fix" t={t} at={at("La próxima vez")} items={["HORNÉALO ANTES", "MÁS BORDES POR DEBAJO"]} out={at("si la base se quema") - 0.2} y={860} />);
    L.push(<BigNum key="burnt" t={t} at={at("si la base se quema")} text="¿BASE QUEMADA?" y={300} size={110} col={COL.red} edge="#4a1410" out={at("si al día siguiente") - 0.2} sub="UNA BANDEJA DEBAJO DE LA OLLA" />);
    L.push(<BigNum key="soft" t={t} at={at("si al día siguiente")} text="¿CORTEZA BLANDA?" y={300} size={110} col={COL.ice2} edge="#26425e" out={1105.5} sub="NORMAL · 5 MIN EN EL HORNO CALIENTE" />);
    L.push(<BigNum key="dense" t={t} at={at("demasiado apretada")} text="¿MIGA APRETADA?" y={250} size={110} col={COL.amber} edge="#5a3a16" out={EV.laTaza - 0.1} sub="MIRA LA TAZA" />);
    L.push(<Stamp key="cup" t={t} at={EV.laTaza + 1.2} text="CASI SIEMPRE ES LA TAZA" x={960} y={860} out={1120.1} rot={-3} size={74} />);
    // ---- la cuenta ----
    W("baker", [{ at: at("no banquero"), txt: "PANADERO, NO BANQUERO" }], at("Un paquete de harina") - 0.1, 880, 66);
    L.push(<TimeBars key="cost" t={t} rows={[{ at: at("Un paquete de harina"), label: "1 KG DE HARINA", val: "2 PANES", frac: 0.6, col: COL.amber }, { at: at("menos que un café"), label: "UN PAN", val: "< UN CAFÉ", frac: 0.18, col: GREEN }, { at: at("cuatro, cinco, seis veces"), label: "PANADERÍA DE CIUDAD", val: "×4 – ×6", frac: 1, col: COL.red }]} out={at("Y el pan de bolsa") - 0.3} />);
    L.push(<Versus key="label" t={t} at={1143.4} out={at("harina, agua, sal y levadura", 1146) - 0.1} title="MIRA LA ETIQUETA" L={{ label: "PAN DE BOLSA", val: "15–20", h: 0.7, col: "#9aa3ad", mark: "x" }} R={{ label: "EL MÍO", val: "4", h: 0.22, col: COL.amber, mark: "ok" }} />);
    L.push(<Pills key="mine" t={t} at={at("harina, agua, sal y levadura", 1146)} items={["HARINA", "AGUA", "SAL", "LEVADURA"]} out={at("una familia entera") - 0.1} y={860} />);
    W("family", [{ at: at("una familia entera"), txt: "UNA FAMILIA QUE NO VUELVE A COMPRAR PAN", col: COL.amber }], 1153.6, 170, 54);
    // ---- la receta entera ----
    W("write", [{ at: at("y lo puedes apuntar"), txt: "APÚNTALO" }], EV.recap + 2.2, 170, 84);
    L.push(<CheckList key="recA" t={t} title="LA MASA" rows={[{ at: at("500 gramos de harina común con"), txt: "500 g HARINA · CON CUCHARA" }, { at: at("10 gramos de sal"), txt: "10 g SAL" }, { at: at("2 gramos de levadura seca"), txt: "2 g LEVADURA SECA" }, { at: at("380 gramos de agua tibia"), txt: "380 g AGUA TIBIA" }, { at: at("3 minutos con la cuchara"), txt: "3 MIN DE CUCHARA" }, { at: at("y a dormir 12"), txt: "12–16 H EN LA ENCIMERA" }]} out={at("Por la mañana un pliegue") - 0.1} x={1300} y={200} />);
    L.push(<CheckList key="recB" t={t} title="EL HORNO" rows={[{ at: at("Por la mañana un pliegue"), txt: "1 PLIEGUE · ESPÁTULA MOJADA" }, { at: at("La olla vacía al"), txt: "OLLA VACÍA · 240 °C · 30 MIN" }, { at: at("La masa al papel"), txt: "PAPEL · BORDES POR DEBAJO" }, { at: at("un corte con valor"), txt: "1 CORTE CON VALOR" }, { at: at("30 minutos con tapa"), txt: "30 CON TAPA + 15 SIN" }, { at: at("moreno como una castaña"), txt: "COLOR CASTAÑA" }, { at: at("una hora en la rejilla"), txt: "1 H EN LA REJILLA" }]} out={1201.6} x={1300} y={200} />);
    W("work", [{ at: at("tres minutos de tu trabajo"), txt: "3 MINUTOS DE TRABAJO · EL RESTO ES TIEMPO", col: COL.amber }], at("y tus manos, limpias") + 2, 880, 54);
    W("limpias", [{ at: at("y tus manos, limpias"), txt: "Y TUS MANOS, LIMPIAS", col: COL.amber }], 1206.8, 170, 80);
    // ---- Don Aurelio, la pala, el cierre ----
    W("peel", [{ at: at("su báscula y su pala"), txt: "SU BÁSCULA · SU PALA DE MADERA VIEJA" }], at("todavía la uso") - 0.1, 880, 60);
    W("uso", [{ at: at("todavía la uso"), txt: "TODAVÍA LA USO", col: COL.amber }], 1217.6, 170, 76);
    L.push(<Quote key="q5" t={t} at={at("deja de pelear") - 0.4} out={1221.6} lines={[{ at: at("deja de pelear") - 0.4, txt: "BENITO, DEJA DE PELEAR." }, { at: at("espera, y mira") , txt: "ESPERA." }]} by="DON AURELIO" />);
    W("razon", [{ at: at("tenía razón con el pan"), txt: "TENÍA RAZÓN CON EL PAN" }, { at: at("y tenía razón con muchas"), txt: "Y CON MUCHAS OTRAS COSAS", col: COL.amber }], EV.wordsEnd - 0.1, 880, 62);
    W("welcome", [{ at: at("bienvenido a mi panadería"), txt: "BIENVENIDO A MI PANADERÍA", col: COL.amber }], at("suscríbete") + 0.2, 300, 86);
    L.push(<SubBell key="sub" t={t} at={at("suscríbete")} bellAt={at("dale a la campanita") + 0.4} out={1239.6} />);
    W("week", [{ at: at("porque cada semana"), txt: "CADA SEMANA · OTRA COSA QUE SABÍAN LOS PANADEROS DE PUEBLO" }], at("y ahora te quiero preguntar") - 0.2, 170, 44);
    L.push(<Question key="qq" t={t} at={at("cuéntame en los comentarios")} out={at("Los leo todos") - 0.2} opts={[{ at: at("un ladrillo, una torta"), txt: "UN LADRILLO", col: COL.red }, { at: at("una torta o un milagro"), txt: "UNA TORTA", col: COL.amber }, { at: at("o un milagro"), txt: "UN MILAGRO", col: GREEN }]} />);
    W("read", [{ at: at("Los leo todos"), txt: "LOS LEO TODOS · A LAS 4 · CON MI CAFÉ" }], at("Y la semana que viene") - 0.2, 880, 54);
    L.push(<NextCard key="next" t={t} at={at("Y la semana que viene")} subAt={at("Te vas a sorprender") + 0.6} out={1268.0} title="CUÁNTO PAN SALE DE UN KILO" tag="EL PRÓXIMO VIDEO" sub="SUSCRÍBETE" subd="SUSCRITO ✓">
      <></>
    </NextCard>);
    W("go", [{ at: EV.final, txt: "LAVA EL BOL · TEMPLA EL AGUA" }, { at: at("y no pelees con la masa"), txt: "NO PELEES CON LA MASA", col: COL.amber }], at("y no pelees con la masa") + 2.4, 880, 64);
    W("listen", [{ at: at("acerca la oreja y escucha"), txt: "CUANDO CRUJA · ESCUCHA" }], 1284.0, 170, 66);
    L.push(<BigNum key="50y" t={t} at={at("son 50 años de madrugadas")} text="50 AÑOS DE MADRUGADAS" y={480} size={110} col={COL.amber} edge="#5a3a16" out={1291.5} sub="AHORA ES TUYO" />);
    return L;
  },
});

export const Full: React.FC = () => <AbsoluteFill><V.Body /></AbsoluteFill>;
export const FULL_FRAMES = V.FRAMES;
