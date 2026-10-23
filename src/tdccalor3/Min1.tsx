// tdccalor3 · MINUTO 1 (tiempo de LOCUCIÓN 0 → 153,5; el gancho LTX va antes, en Full). Un solo mundo + una cámara;
// el avatar entra y sale por la BOCA DE SU ESTUFA (portal en AV_STOVE); cada pieza se ancla a la palabra del ASR.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { PT, screenOf } from "./taller3d";
import { BigNum, COL, Flash, P, Portal, Tag, LowerThird, e, ei, s, spr } from "./lib";
import { Words } from "./comps2";
import { AV_STOVE, Avatar, Chip, Clip, OK, Desc, FrostEdge, LeakyBucket, Questions, Shot, Stamp, Take, Vaho, WIN, World } from "./parts";

export const MIN1_END = 153.5;
export const MIN1_FRAMES = s(MIN1_END);

// ===== la BASE (lo que se ve cuando no habla el avatar), por tramos de locución =====
const base = (t: number): React.ReactNode => {
  // "tomé el fósforo… los dedos no me respondían" → la toma 2 del gancho desde su segundo 7
  if (t >= 11.3 && t < 16.4) return <Clip k="g_gancho_s2" t={t} a={11.3} from={7} z={[1.02, 1.1]}><World t={t} /></Clip>;
  // "leña seca, la buena" → el fuego vivo por la puerta del tambor
  if (t >= 20.5 && t < 24.35) return <Clip k="b_brasas" t={t} a={20.5} from={1}><World t={t} /></Clip>;
  // "ladrillos comunes, de obra" → la medianera de verdad
  if (t >= 55.45 && t < 60.3) return <Shot k="f_medianera" t={t} a={55.45} />;
  // "un tambor de 200 litros de la chatarrería"
  if (t >= 69.4 && t < 71.6) return <Take k="c_chatarra" img="f_chatarra" t={t} a={69.4} />;
  // "la pistola… y la hora"
  if (t >= 73.1 && t < 76.35) return <Take k="c_pistola" img="f_pistola" t={t} a={73.1} />;
  return <World t={t} />;
};

// el avatar entra por un portal que se abre en la boca de su estufa y sale por el mismo lugar (cero cortes secos)
const Stage: React.FC<{ t: number }> = ({ t }) => {
  const w = WIN.find((x) => t >= x.ms - 0.32 && t < x.me + 0.42);
  if (!w) return <>{base(t)}</>;
  if (t < w.ms) return <>{base(t)}<Portal x={AV_STOVE.x} y={AV_STOVE.y} r={ei(t, w.ms - 0.32, w.ms)}><Avatar t={t} /></Portal></>;
  if (t < w.me) return <Avatar t={t} />;
  return <><Avatar t={t} /><Portal x={AV_STOVE.x} y={AV_STOVE.y} r={ei(t, w.me, w.me + 0.42)}>{base(t)}</Portal></>;
};

// el libro abierto visto DENTRO de la boca de la estufa del avatar mientras dice "página 74"
const BookPortal: React.FC<{ t: number }> = ({ t }) => {
  const k = spr(t, 131.0, 0.8), o = e(t, 131.0, 131.2) * (1 - e(t, 135.3, 135.7));
  if (o <= 0.01) return null;
  const hl = e(t, 132.9, 133.5);
  return <div style={{ position: "absolute", left: 430, top: 620, perspective: 1600, opacity: o }}>
    <div style={{ position: "relative", transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -700}px) rotateY(${18 - 6 * Math.min(1, k)}deg) rotateX(6deg) rotateZ(-3deg)`, width: 620, boxShadow: "0 60px 120px rgba(0,0,0,.75)", borderRadius: 8, overflow: "hidden" }}>
      <Img src={staticFile(P + "m1_p074.jpg")} style={{ width: "100%", display: "block" }} />
      <div style={{ position: "absolute", left: "6%", right: "6%", top: "5.5%", height: "6%", background: "rgba(255,214,10,.35)", opacity: hl, borderRadius: 6 }} />
    </div>
  </div>;
};
// la batería de ladrillos reventando dentro de la boca de la estufa ("revienta como una honda")
const BoomPortal: React.FC<{ t: number }> = ({ t }) => {
  const o = e(t, 82.9, 83.15) * (1 - e(t, 84.6, 84.95));
  if (o <= 0.01 || !OK.has("b_estalla_s1")) return null;
  return <div style={{ position: "absolute", left: 120, top: 250, width: 760, height: 428, borderRadius: 22, overflow: "hidden", opacity: o, transform: `scale(${0.9 + 0.1 * Math.min(1, spr(t, 82.9))}) rotate(-2deg)`, boxShadow: "0 50px 100px rgba(0,0,0,.7), 0 0 0 4px rgba(255,74,61,.8)" }}>
    <Clip k="b_estalla_s1" t={t} a={82.9} from={4} z={[1, 1.06]} />
  </div>;
};

export const Min1Body: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];
  const at = (q: Parameters<typeof screenOf>[1]) => screenOf(t, q);
  // ---- 0-16: las 3 de la mañana, la escarcha, el aliento ----
  if (t < 4.4) L.push(<Vaho key="v0" t={t} a={0.2} b={4.3} />);
  L.push(<Chip key="c3am" t={t} at={3.1} out={9.5} text="3:00 AM · 4 °C ADENTRO" col={COL.ice} />);
  if (t > 6 && t < 11.4) { const p = at(PT.window); L.push(<Tag key="tesc" t={t} at={6.3} x={p.x} y={p.y} dx={260} dy={-120} text="ESCARCHA POR DENTRO" col={COL.ice} out={11} />); }
  L.push(<FrostEdge key="fe" amt={ei(t, 6.2, 9.0) * (1 - ei(t, 10.8, 11.4))} />);
  if (t > 9.4 && t < 11.4) L.push(<Vaho key="v1" t={t} a={9.6} b={11.2} x={960} y={620} />);
  // ---- 16-32: la estufa 4 horas prendida, de 20 a 4 grados ----
  L.push(<BigNum key="b4h" t={t} at={18.6} text="4 HORAS" sub="PRENDIDA" x={480} y={420} size={190} col={COL.amber} edge="#5a2a00" out={20.5} />);
  L.push(<Chip key="clena" t={t} at={22.5} out={24.3} text="LEÑA SECA · LA BUENA" />);
  if (t > 24 && t < 32.5) {
    const p = at(PT.thermoAt(20)), q = at(PT.clock);
    L.push(<Tag key="t20" t={t} at={24.5} x={p.x} y={p.y} dx={220} dy={-60} text="22 H · 20 °C" col={COL.amber} out={27.6} />);
    L.push(<Tag key="t4" t={t} at={27.9} x={at(PT.thermoAt(4)).x} y={at(PT.thermoAt(4)).y} dx={240} dy={40} text="3 AM · 4 °C" col={COL.ice} out={32.3} />);
    L.push(<Tag key="tclk" t={t} at={28.2} x={q.x} y={q.y} dx={-260} dy={-40} text="5 HORAS" col={COL.ink} out={32.3} />);
    L.push(<BigNum key="b16" t={t} at={29.1} text="−16 °C" sub="EN 5 HORAS" x={1300} y={470} size={200} col={COL.ice} edge="#0a2a44" out={32.3} />);
  }
  // ---- 32-46: el balde agujereado; calentito → helado; no es tu culpa ----
  L.push(<LeakyBucket key="bk" t={t} at={32.8} out={36.1} x={470} y={540} />);
  L.push(<Words key="wcal" t={t} items={[{ at: 37.3, txt: "TE ACUESTAS CALENTITO", col: COL.amber }, { at: 38.9, txt: "TE DESPIERTAS HELADO", col: COL.ice }]} out={40.5} y={540} size={96} />);
  L.push(<Words key="wcul" t={t} items={[{ at: 40.7, txt: "NO ES TU CULPA" }]} out={41.8} y={540} size={130} />);
  L.push(<Words key="wle" t={t} items={[{ at: 41.95, txt: "NI LA LEÑA" }, { at: 42.9, txt: "NI LA ESTUFA" }]} out={44.0} y={250} size={100} />);
  if (t > 44 && t < 46.6) { const p = at(PT.battery); L.push(<Tag key="tnada" t={t} at={44.2} x={p.x} y={p.y} dx={160} dy={-240} text="NADA QUE GUARDE EL CALOR" col={COL.red} out={46.4} />); }
  // ---- 46-64: el aire no guarda nada · los ladrillos sí ----
  L.push(<Chip key="caire" t={t} at={47.0} out={51.8} text="EL AIRE NO GUARDA NADA" col={COL.ice} />);
  L.push(<BigNum key="b30" t={t} at={48.6} text="30 MIN" sub="Y SE FUE" x={470} y={560} size={190} col={COL.ice} edge="#0a2a44" out={51.8} />);
  L.push(<Words key="whoy" t={t} items={[{ at: 52.7, txt: "LOS LADRILLOS" }, { at: 53.5, txt: "QUE SÍ LO GUARDAN", col: COL.amber }]} out={55.3} y={200} size={100} />);
  L.push(<Chip key="cobra" t={t} at={55.6} out={60.1} text="LADRILLO COMÚN · DE OBRA" />);
  if (t > 60 && t < 64.8) { const p = at(PT.gap); L.push(<Tag key="tgap" t={t} at={60.4} x={p.x} y={p.y} dx={-320} dy={-180} text="PUESTOS DE UNA MANERA" sub="(con este hueco)" col={COL.amber} out={64.6} />); }
  // ---- 64-87: tambor de 200 L, lo mido todo, el ladrillo que revienta ----
  L.push(<BigNum key="b200" t={t} at={64.8} text="200 L" sub="TAMBOR DE CHATARRERÍA" x={480} y={460} size={210} col={COL.ink} out={69.4} />);
  if (t > 71.4 && t < 73.2) { const p = at(PT.thermoTop); L.push(<Tag key="tterm" t={t} at={71.6} x={p.x} y={p.y + 80} dx={260} dy={60} text="TERMÓMETRO EN LA PARED" col={COL.ice} out={73.0} />); }
  L.push(<Chip key="chora" t={t} at={74.6} out={76.2} text="LA PISTOLA · Y LA HORA" />);
  L.push(<Words key="wfun" t={t} items={[{ at: 76.45, txt: "SI NO FUNCIONA" }, { at: 77.3, txt: "TE LO DIGO", col: COL.amber }]} out={78.3} y={200} size={100} />);
  L.push(<Words key="wnun" t={t} items={[{ at: 78.4, txt: "NUNCA AL LADO", col: COL.red }, { at: 79.3, txt: "DEL FUEGO", col: COL.red }]} out={80.7} y={210} size={100} />);
  L.push(<BoomPortal key="boom" t={t} />);
  L.push(<Stamp key="srev" t={t} at={83.3} text="REVIENTA" x={560} y={420} out={84.8} />);
  // ---- 87-120: soy Claudio · parte 3 · las preguntas ----
  L.push(<Chip key="cnue" t={t} at={87.7} out={89.1} text="SI LLEGAS NUEVO…" />);
  L.push(<LowerThird key="lt" t={t} at={89.25} out={92.6} name="CLAUDIO" l2="TALLER DE CLAUDIO · INVIERNO SIN GAS" l2at={89.9} />);
  L.push(<BigNum key="bp3" t={t} at={92.85} text="PARTE 3" x={960} y={430} size={230} col={COL.amber} edge="#5a2a00" out={95.1} />);
  L.push(<Chip key="cp1" t={t} at={95.35} out={97.1} text="PARTE 1 · LADRILLOS DE PAPEL" x={110} y={180} />);
  L.push(<Chip key="cp2" t={t} at={99.9} out={102.9} text="PARTE 2 · LOS 7 CALORES" x={110} y={180} col={COL.ice} />);
  if (t > 104 && t < 108) { const p = at(PT.row(-1, 0)); L.push(<Tag key="tpar" t={t} at={104.6} x={p.x} y={p.y} dx={-260} dy={-200} text="LA PAREDCITA" col={COL.amber} out={107.8} />); }
  L.push(<Questions key="qs" t={t} out={115.1} qs={[
    { at: 108.0, txt: "¿Cuántos ladrillos pongo?", who: "@marta_del_sur" },
    { at: 111.0, txt: "¿Cuáles? A mí se me rajaron", who: "@ramon58" },
    { at: 113.55, txt: "¿Por qué a las 3 AM ya están fríos?", who: "@don_ernesto" },
  ]} />);
  L.push(<Chip key="ctam" t={t} at={116.65} out={119.8} text="¿Y CON ESTUFA DE TAMBOR? · HOY VAN JUNTAS" />);
  // ---- 120-153: CTA 1 · la guía, Manual 1, página 74 ----
  L.push(<Chip key="cguia" t={t} at={123.0} out={128.7} text="EL INVIERNO SIN GAS · 5 MANUALES" />);
  L.push(<Chip key="cm1" t={t} at={128.9} out={130.7} text="MANUAL 1 · LADRILLOS DE CALOR" col={COL.amber} />);
  L.push(<BookPortal key="bkp" t={t} />);
  L.push(<BigNum key="bp74" t={t} at={130.95} text="PÁG. 74" sub="CUÁNTOS LADRILLOS POR NOCHE" x={430} y={120} size={140} col={COL.amber} edge="#5a2a00" out={135.6} />);
  L.push(<Chip key="ccta" t={t} at={141.2} out={145.6} text="SIN HACER UNA SOLA CUENTA" x={110} y={110} col={COL.ice} />);
  L.push(<Desc key="desc" t={t} at={145.8} out={148.9} />);
  L.push(<Chip key="cban" t={t} at={148.6} out={153.3} text="VAMOS AL BANCO ➜" x={110} y={110} />);
  L.push(<Flash key="fl1" t={t} at={83.4} peak={0.5} col="#ffb257" />);
  return <AbsoluteFill style={{ background: "#000" }}><Stage t={t} />{L}</AbsoluteFill>;
};

export const Min1: React.FC = () => <Min1Body t={useCurrentFrame() / 30} />;
