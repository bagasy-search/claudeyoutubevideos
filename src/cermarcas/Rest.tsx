// cermarcas · EL RESTO (110,2-858,5 s): las 7 señales + la del timbre + los 5 pasos + la guía. Mismo mundo (la casa de noche,
// el ojo térmico, el recibidor por la cerradura), el avatar NÍTIDO en sus ventanas, tomas reales con empuje propio y
// componentes nuevos en cada minuto (comps2). Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { PT, screenOf, pagePt, Marker, MarkState, MarkId, MARKS, V3 } from "./casa3d";
import { Avatar, World, Shot, Swipe, Stamp, Desc, ThermHud, clip } from "./Min1";
import { BigNum, COL, Card3D, Flash, Portal, Tag, e, ei, s } from "./lib";
import { SplitAv, QueHaces, Steps, PhoneCam, AlturaRegla, Veredicto, Semana, Cuadra, Llamada, TablaFalsa, Versus, Dias, Libreta, Chat, Balanza, Evidencia, Lupa, Garaje, CasaDice, Post, Timer, Regalo, Globos, Frase, Recap, Pasos5, Visor, Costos, Comentarios } from "./comps2";

export const REST_END = 859.5;
export const FULL_FRAMES = s(REST_END);

type WP = Omit<React.ComponentProps<typeof World>, "t">;
// cada marca aparece en la casa recién cuando se nombra su señal (antes no se adelanta ninguna)
const DESDE: Record<MarkId, number> = { plast: 110, cinta: 178, tiza: 225, volante: 306, precinto: 437, moneda: 500, diarios: 564 };
let TNOW = 0;
const mk = (lit: Partial<Record<MarkId, number>> = {}, off: MarkId[] = [], kk: Partial<Record<MarkId, number>> = {}): MarkState => {
  const m: MarkState = {};
  for (const id of MARKS) m[id] = { k: kk[id] ?? (off.includes(id) || TNOW < DESDE[id] ? 0 : 1), lit: lit[id] ?? 0 };
  return m;
};
const W = (t: number, x: WP = {}) => <World t={t} marks={mk()} {...x} />;
const ir = (t: number, a: number, d = 0.4) => ei(t, a, a + d);
const circ = (k: number, x = 960, y = 540) => ({ clipPath: `circle(${k * 1200}px at ${x}px ${y}px)` });
const Dark: React.FC<{ o: number }> = ({ o }) => <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,.15), rgba(0,0,0,.6))", opacity: o }} />;

export const Rest: React.FC<{ t: number }> = ({ t }) => {
  TNOW = t;
  const L: React.ReactNode[] = [];
  const at = (a: number, b: number) => t >= a && t < b;
  const tagAt = (key: string, p: V3, a: number, text: string, o: Partial<React.ComponentProps<typeof Tag>> = {}) => { const q = screenOf(t, p); L.push(<Tag key={key} t={t} at={a} x={q.x} y={q.y} text={text} {...o} />); };

  // ======================= SEÑAL 1 · EL PLÁSTICO EN EL MARCO =======================
  if (at(110.2, 120.18)) {
    L.push(<React.Fragment key="w1">{W(t, { marks: mk({ plast: e(t, 116.4, 116.8) }) })}</React.Fragment>);
    L.push(<BigNum key="s1" t={t} at={109.6} text="SEÑAL Nº 1" size={120} y={180} col={COL.amber} edge="#3a1a00" out={111.5} />);
    L.push(<BigNum key="s1b" t={t} at={111.64} text="EL PLÁSTICO EN EL MARCO" size={80} y={170} col="#fff3d6" edge="#3a1a00" out={115.6} />);
    tagAt("pl1", PT.plast, 117.0, "PLÁSTICO", { dx: -260, dy: -260, col: COL.ice, out: 120.1, size: 48 });
    tagAt("pl2", PT.plast, 117.9, "PAPEL", { dx: -330, dy: -120, col: COL.ink, out: 120.1, size: 48 });
    tagAt("pl3", PT.plast, 119.6, "UN FÓSFORO", { dx: -300, dy: 40, col: COL.amber, out: 120.1, size: 48 });
  }
  if (at(120.18, 125.62)) {
    L.push(<Avatar key="a120" t={t} />);
    L.push(<AlturaRegla key="alt" t={t} at={121.0} at2={123.1} out={125.4} />);
  }
  if (at(125.62, 130.76)) {
    const k2 = ei(t, 127.9, 128.25);
    L.push(<Swipe key="w125" t={t} a={127.9} b={128.25} vert
      from={W(t, { doorOpen: ei(t, 125.9, 126.9), plastFall: e(t, 126.8, 127.4) })}
      to={W(t, { marks: mk({ plast: 1 }) })} />);
    void k2;
    tagAt("cae", PT.plast, 127.0, "SE CAE", { dx: -300, dy: 80, col: COL.amber, out: 127.8, size: 56 });
    L.push(<BigNum key="ab" t={t} at={125.6} text="ABRES" size={110} y={170} out={127.6} col="#fff3d6" edge="#3a1a00" />);
    L.push(<Dias key="dias1" t={t} a={128.3} b={129.9} n={4} out={130.6} />);
  }
  if (at(130.76, 136.61)) {
    const th = ei(t, 130.76, 131.1), sec = t < 133.75;
    L.push(<React.Fragment key="w130">{W(t, { therm: th, walker: sec ? [130.6, 133.9] : [133.6, 136.9], marks: mk({ plast: 1 }) })}</React.Fragment>);
    L.push(<ThermHud key="h130" t={t} amt={e(t, 130.9, 131.2)} />);
    L.push(<BigNum key="ne" t={t} at={131.4} text="NO NECESITA ENTRAR" size={84} y={900} out={133.6} col="#fff3d6" edge="#5a1a00" />);
    L.push(<BigNum key="x1" t={t} at={133.8} text="PASA 1 VEZ" size={90} x={1500} y={190} out={135.8} col="#fff3d6" edge="#5a1a00" />);
    L.push(<BigNum key="x2" t={t} at={135.9} text="PASA 2 VECES" size={90} x={1500} y={190} out={136.5} col="#ffd60a" edge="#5a1a00" />);
  }
  if (at(136.61, 142.8)) {
    L.push(<Avatar key="a136" t={t} />);
    L.push(<Veredicto key="ver" t={t} a={139.3} b={140.4} out={142.6} l="EL VIENTO" ls="no lo mete en la ranura" r="UNA MANO" rs="doblado, justo ahí" />);
  }
  if (at(142.8, 154.76)) {
    const sw = ei(t, 148.1, 148.5);
    if (sw < 1) L.push(<AbsoluteFill key="hp" style={{ opacity: 1 - sw }}><Shot k="h_plastico" t={t} a={142.8} z={[1.04, 1.16]} oy={-20} dur={6} /></AbsoluteFill>);
    L.push(<Stamp key="alm" t={t} at={144.2} text="ALGUIEN LO METIÓ" x={960} y={520} out={145.3} size={96} />);
    L.push(<QueHaces key="qh1" t={t} at={145.4} out={154.6} />);
    if (sw > 0) L.push(<AbsoluteFill key="pc" style={{ opacity: sw, background: "#0b0d12" }}><PhoneCam t={t} at={148.1} snap={148.95} out={154.6}><Shot k="r_foto" t={t} a={148.1} z={[1.0, 1.08]} dur={6} /></PhoneCam></AbsoluteFill>);
    L.push(<Steps key="st1" t={t} x={60} y={30} w={620} size={34} out={146.0 + 8.6} items={[{ at: 146.3, tx: "NO LO TIRES ENSEGUIDA", bad: true }]} />);
    L.push(<Steps key="st1b" t={t} x={1180} y={930} w={700} size={38} out={154.6} items={[{ at: 153.8, tx: "DESPUÉS LO SACAS" }]} />);
  }
  if (at(154.76, 160.91)) {
    L.push(<Avatar key="a154" t={t} />);
    L.push(<BigNum key="tc" t={t} at={155.4} text="EL TRUCO DEL CERRAJERO" size={76} x={1340} y={170} out={157.0} col="#ffd60a" edge="#5a4500" />);
    L.push(<BigNum key="tvd" t={t} at={157.4} text="TE VAS UNOS DÍAS ✈️" size={80} x={1360} y={330} out={160.7} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(160.91, 166.1)) {
    L.push(<Shot key="vec" k="r_vecino" t={t} a={160.91} z={[1.03, 1.12]} ox={-30} dur={6} />);
    L.push(<Dark key="dk160" o={e(t, 161.6, 162.0)} />);
    L.push(<Tag key="vc" t={t} at={161.4} x={760} y={560} dx={-260} dy={-200} text="UN VECINO" sub="ABRE Y CIERRA TU PUERTA" col={COL.amber} out={164.0} size={52} />);
    L.push(<Semana key="sem" t={t} a={162.4} b={165.2} out={166.0} />);
  }
  if (at(166.1, 172.05)) {
    L.push(<AbsoluteFill key="w166" style={circ(ir(t, 166.1))}>{W(t, { doorOpen: ei(t, 166.8, 167.8), plastFall: e(t, 167.7, 168.3) })}</AbsoluteFill>);
    tagAt("sol", PT.plast, 168.0, "SE CAE SOLA", { dx: -320, dy: -60, col: COL.amber, out: 170.6, size: 52 });
    L.push(<BigNum key="hab" t={t} at={169.1} text="CASA HABITADA" size={110} y={180} out={170.9} col="#7dff9e" edge="#0a3a1a" />);
    L.push(<BigNum key="s2" t={t} at={171.1} text="SEÑAL Nº 2" size={120} y={180} col={COL.amber} edge="#3a1a00" />);
  }

  // ======================= SEÑAL 2 · LA CINTA EN LA CERRADURA =======================
  if (at(172.05, 178.02)) {
    L.push(<Avatar key="a172" t={t} />);
    L.push(<BigNum key="lc" t={t} at={172.3} text="LA CINTA EN LA CERRADURA" size={70} x={1350} y={150} out={174.2} col="#fff3d6" edge="#3a1a00" />);
    L.push(<BigNum key="3v" t={t} at={175.9} text="3 VECES" sub="EN UN MISMO BARRIO" size={130} x={1450} y={200} out={177.8} col={COL.red} edge="#3a0a06" />);
  }
  if (at(178.02, 183.3)) {
    L.push(<React.Fragment key="w178">{W(t, { marks: mk({ cinta: 1 }) })}</React.Fragment>);
    tagAt("c1", PT.cinta, 179.0, "CINTA ADHESIVA", { dx: 220, dy: -220, col: COL.amber, out: 183.2, size: 50 });
    tagAt("c2", PT.cinta, 180.4, "TRANSPARENTE", { dx: 260, dy: -60, col: COL.ice, out: 183.2, size: 44 });
    tagAt("c3", PT.cinta, 181.3, "O DEL COLOR DE LA PUERTA", { dx: 220, dy: 120, col: COL.ink, out: 183.2, size: 40 });
  }
  if (at(183.3, 188.7)) {
    L.push(<Shot key="cin" k="r_cinta" t={t} a={183.3} z={[1.05, 1.16]} ox={20} dur={6} />);
    L.push(<Tag key="hm" t={t} at={184.4} x={1000} y={520} dx={-160} dy={-300} text="ENTRE LA HOJA Y EL MARCO" col={COL.amber} out={188.5} size={46} />);
    L.push(<Tag key="ag" t={t} at={186.0} x={900} y={640} dx={-280} dy={180} text="O TAPANDO EL AGUJERO" col={COL.ice} out={188.5} size={44} />);
  }
  if (at(188.7, 190.14)) {
    L.push(<AbsoluteFill key="w188" style={circ(ir(t, 188.7, 0.35))}>{W(t, { marks: mk({ cinta: 1, plast: 0.5 }) })}</AbsoluteFill>);
    L.push(<BigNum key="iq" t={t} at={188.8} text="= EL PLÁSTICO" size={100} y={180} out={190.0} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(190.14, 195.62)) {
    const op = ei(t, 191.1, 192.0) * (1 - ei(t, 193.6, 194.2));
    L.push(<SplitAv key="sp190" t={t} a={190.14} b={195.62}>{W(t, { doorOpen: op, marks: mk({ cinta: 1 }) })}</SplitAv>);
    L.push(<BigNum key="co" t={t} at={191.9} text="CORTADA = ALGUIEN ABRIÓ" size={54} x={1440} y={150} out={193.6} col={COL.red} edge="#3a0a06" />);
    L.push(<BigNum key="en" t={t} at={194.3} text="ENTERA = NADIE" size={64} x={1440} y={150} out={195.4} col="#7dff9e" edge="#0a3a1a" />);
  }
  if (at(195.62, 201.06)) {
    L.push(<Shot key="arr" k="r_arranca" t={t} a={195.62} z={[1.03, 1.13]} ox={-30} dur={6} />);
    L.push(<BigNum key="er2" t={t} at={195.9} text="EL ERROR QUE VEO SIEMPRE" size={70} y={150} out={197.4} col={COL.red} edge="#3a0a06" />);
    L.push(<Steps key="st2" t={t} x={1150} y={300} w={700} size={40} out={200.9} items={[{ at: 198.2, tx: "LA ARRANCA", bad: true }, { at: 199.1, tx: "LA TIRA", bad: true }, { at: 199.9, tx: "NO LE CUENTA A NADIE", bad: true }]} />);
  }
  if (at(201.06, 206.74)) {
    L.push(<Cuadra key="cu2" t={t} a={201.06} out={206.6} you={2} night title="SE VA A LA CASA DE AL LADO" titleAt={204.0}
      marks={[{ at: 201.3, h: 2, icon: "✕", col: "#555" }, { at: 205.7, h: 3, icon: "🩹" }]} walk={{ a: 201.3, b: 205.2, hs: [0, 1, 2, 3] }} />);
  }
  if (at(206.74, 210.79)) {
    L.push(<Avatar key="a206" t={t} />);
    L.push(<BigNum key="mv" t={t} at={209.1} text="MIRA LA DEL VECINO ➜" size={80} x={1300} y={180} out={210.6} col="#ffd60a" edge="#5a4500" />);
  }
  if (at(210.79, 216.2)) {
    L.push(<Cuadra key="cu2b" t={t} a={210.79} out={216.1} you={2} night title="LA CUADRA ENTERA" titleAt={213.3}
      marks={[{ at: 211.0, h: 2, icon: "🩹" }, { at: 211.9, h: 3, icon: "🩹" }, { at: 212.5, h: 1, icon: "🩹" }, { at: 213.0, h: 8, icon: "🩹" }]} />);
    L.push(<Stamp key="nb" t={t} at={215.2} text="YA NO ES BASURA" x={960} y={820} out={216.2} rot={-5} size={90} />);
  }
  if (at(216.2, 221.34)) {
    L.push(<Shot key="pol" k="r_policia" t={t} a={216.2} z={[1.03, 1.12]} ox={40} dur={6} />);
    L.push(<Dark key="dk216" o={0.5} />);
  }
  if (at(216.2, 223.5)) {
    const toAv = t >= 221.34;
    if (toAv) L.push(<Avatar key="a221" t={t} />);
    L.push(<Llamada key="ll" t={t} at={216.5} out={223.3} x={toAv ? 1260 : 1180} items={[{ at: 220.8, tx: "QUÉ VISTE" }, { at: 221.9, tx: "EN QUÉ CASAS" }, { at: 222.8, tx: "A QUÉ HORA" }]} />);
  }
  if (at(223.5, 225.11)) {
    L.push(<Avatar key="a223" t={t} />);
    L.push(<BigNum key="s3" t={t} at={223.6} text="SEÑAL Nº 3" size={120} x={1350} y={180} col={COL.amber} edge="#3a1a00" />);
    L.push(<BigNum key="s3b" t={t} at={225.0} text="LA MARCA DE TIZA" size={80} x={1350} y={330} col="#fff3d6" edge="#3a1a00" />);
  }

  // ======================= SEÑAL 3 · LA MARCA DE TIZA =======================
  if (at(225.11, 228.7)) {
    L.push(<React.Fragment key="w225">{W(t, { marks: mk({ tiza: 1 }) })}</React.Fragment>);
    L.push(<BigNum key="s3c" t={t} at={225.11} text="LA MARCA DE TIZA" size={90} y={170} col="#fff3d6" edge="#3a1a00" out={227.0} />);
    L.push(<BigNum key="hon" t={t} at={227.7} text="CON HONESTIDAD" size={90} y={930} col={COL.ice} edge="#0a2a3a" out={228.6} />);
  }
  if (at(228.7, 238.81)) {
    L.push(<AbsoluteFill key="bg228" style={{ background: "radial-gradient(ellipse at 50% 40%, #232833, #07090d)" }} />);
    L.push(<TablaFalsa key="tf" t={t} at={228.9} out={1e9} stamp={243.7} hl={[{ at: 235.4, i: 0, tx: "○ = CASA RICA" }, { at: 237.4, i: 1, tx: "✕ = CASA VACÍA" }, { at: 239.3, i: 2, tx: "△ = MUJER SOLA" }]} />);
    L.push(<BigNum key="40" t={t} at={231.5} text="40 SÍMBOLOS" sub="EN INTERNET" size={90} x={1440} y={150} out={234.6} col="#ffd60a" edge="#5a4500" />);
  }
  if (at(238.81, 244.67)) {
    L.push(<Avatar key="a238" t={t} />);
    L.push(<TablaFalsa key="tf2" t={t} at={238.0} out={244.5} stamp={243.7} x={1440} y={520} sc={0.55} hl={[{ at: 235.4, i: 0, tx: "○ = CASA RICA" }, { at: 237.4, i: 1, tx: "✕ = CASA VACÍA" }, { at: 239.3, i: 2, tx: "△ = MUJER SOLA" }]} />);
  }
  if (at(244.67, 256.2)) {
    L.push(<Shot key="ser" k="r_servicio" t={t} a={244.67} z={[1.03, 1.15]} ox={-40} dur={11} />);
    L.push(<Dark key="dk244" o={e(t, 248.4, 248.8) * 0.8} />);
    L.push(<BigNum key="gas" t={t} at={249.4} text="GAS" size={110} x={560} y={300} out={255.3} col="#ffb257" edge="#3a1a00" />);
    L.push(<BigNum key="agua" t={t} at={250.1} text="AGUA" size={110} x={960} y={300} out={255.3} col={COL.ice} edge="#0a2a3a" />);
    L.push(<BigNum key="cab" t={t} at={250.9} text="CABLE" size={110} x={1400} y={300} out={255.3} col="#ffd60a" edge="#5a4500" />);
    L.push(<Tag key="tec" t={t} at={252.4} x={960} y={760} dx={-300} dy={-120} text="LAS PINTAN LOS TÉCNICOS" sub="PARA SABER DÓNDE CAVAR" col={COL.ink} out={255.3} size={48} />);
    L.push(<BigNum key="dist" t={t} at={255.5} text="¿CÓMO LAS DISTINGUES?" size={90} y={540} out={256.2} col="#fff3d6" edge="#3a1a00" />);
  }
  const VS = (x: number, sc: number) => <Versus key="vs" t={t} out={287.0} x={x} sc={sc}
    L={{ at: 258.5, title: "DE SERVICIO", rows: [{ at: 260.2, tx: "EN EL PISO" }, { at: 261.3, tx: "CERCA DEL MEDIDOR" }, { at: 265.0, tx: "AEROSOL DE COLORES" }, { at: 267.6, tx: "VARIAS CASAS, EN FILA" }] }}
    R={{ at: 270.5, title: "LA QUE PREOCUPA", rows: [{ at: 272.9, tx: "TIZA O LÁPIZ" }, { at: 274.3, tx: "CHIQUITA" }, { at: 275.2, tx: "EN TU PARED O BUZÓN" }, { at: 283.4, tx: "SÓLO EN TU CASA" }] }} />;
  if (at(256.2, 260.8)) { L.push(<Avatar key="a256" t={t} />); L.push(<div key="vsw" style={{ position: "absolute", inset: 0 }}>{VS(1450, 0.6)}</div>); }
  if (at(260.8, 269.75)) {
    L.push(<AbsoluteFill key="bg260" style={{ background: "radial-gradient(ellipse at 50% 40%, #1f2a33, #07090d)" }} />);
    L.push(<div key="vsf" style={{ position: "absolute", inset: 0 }}>{VS(960, 1)}</div>);
  }
  if (at(269.75, 274.26)) { L.push(<Avatar key="a269" t={t} />); L.push(<div key="vsw2" style={{ position: "absolute", inset: 0 }}>{VS(1450, 0.6)}</div>); }
  if (at(274.26, 282.0)) {
    const s1 = t < 276.2, s2 = t >= 276.2 && t < 278.7;
    if (s1) { L.push(<React.Fragment key="w274">{W(t, { marks: mk({ tiza: 1 }) })}</React.Fragment>); tagAt("tp", PT.tiza, 274.5, "EN TU PARED", { dx: 260, dy: -200, col: COL.amber, out: 276.1, size: 52 }); }
    if (s2) { L.push(<Shot key="tb" k="r_tizabuzon" t={t} a={276.2} z={[1.04, 1.14]} oy={-20} dur={3} />); L.push(<Tag key="bz" t={t} at={276.3} x={960} y={500} dx={300} dy={-200} text="BUZÓN · PORTÓN" col={COL.amber} out={278.6} size={52} />); }
    if (t >= 278.7) { L.push(<Shot key="ctz" k="c_tiza" t={t} a={278.7} z={[1.03, 1.12]} ox={-30} dur={4} />); L.push(<BigNum key="tec2" t={t} at={279.6} text="UN TÉCNICO NO TIENE NADA QUE HACER AHÍ" size={58} y={940} out={281.9} col="#fff3d6" edge="#3a1a00" />); }
  }
  if (at(282.0, 287.29)) {
    L.push(<Cuadra key="cu3" t={t} a={282.0} out={287.2} you={2} title="SÓLO EN TU CASA… O EN LAS DE LOS MAYORES" titleAt={282.3} old={[2, 4, 8]}
      marks={[{ at: 284.0, h: 2, icon: "✏️" }, { at: 285.6, h: 4, icon: "✏️" }, { at: 286.2, h: 8, icon: "✏️" }]} />);
  }
  if (at(287.29, 290.74)) {
    L.push(<Avatar key="a287" t={t} />);
    L.push(<QueHaces key="qh3" t={t} at={287.8} out={290.6} x={1180} />);
    L.push(<BigNum key="ff" t={t} at={288.9} text="📷 FOTO, SIEMPRE FOTO" size={74} x={1400} y={330} out={290.6} col="#ffd60a" edge="#5a4500" />);
  }
  if (at(290.74, 297.7)) {
    L.push(<Shot key="bor" k="r_borra" t={t} a={290.74} z={[1.04, 1.13]} ox={30} dur={7} />);
    L.push(<Tag key="tr" t={t} at={292.8} x={900} y={560} dx={-300} dy={-220} text="TRAPO HÚMEDO" col={COL.ice} out={297.5} size={54} />);
    L.push(<Chat key="ch3" t={t} at={294.1} out={297.5} x={1280} y={110} msgs={[{ at: 294.6, from: "Tú", me: true, tx: "¿Alguien vio una marquita de tiza en su portón? 🤔" }, { at: 296.2, from: "Rosa (n° 24)", tx: "¡Sí! En el mío también 😳" }]} />);
  }
  if (at(297.7, 300.22)) {
    L.push(<Cuadra key="cu3b" t={t} a={297.7} out={300.1} you={2} title="UNA SOLA: UN CHICO JUGANDO" titleAt={298.0} marks={[{ at: 298.0, h: 7, icon: "✏️", col: "#5f9ec0" }]} />);
  }
  if (at(300.22, 306.05)) {
    L.push(<SplitAv key="sp300" t={t} a={300.22} b={306.05}><Cuadra t={t} a={299.6} out={1e9} you={2} old={[2, 3, 5]} marks={[{ at: 301.9, h: 2, icon: "✏️" }, { at: 302.3, h: 3, icon: "✏️" }, { at: 302.8, h: 5, icon: "✏️" }]} /></SplitAv>);
    L.push(<Stamp key="nj" t={t} at={304.9} text="NO ES UN JUEGO" x={1440} y={540} out={305.9} size={70} />);
  }

  // ======================= SEÑAL 4 · EL VOLANTE QUE NADIE SACA =======================
  if (at(306.05, 314.8)) {
    L.push(<AbsoluteFill key="w306" style={circ(ir(t, 306.05))}>{W(t, { marks: mk({ volante: e(t, 308.0, 308.4) }) })}</AbsoluteFill>);
    L.push(<BigNum key="s4" t={t} at={306.3} text="SEÑAL Nº 4" size={120} y={180} col={COL.amber} edge="#3a1a00" out={307.8} />);
    L.push(<BigNum key="s4b" t={t} at={307.9} text="EL VOLANTE QUE NADIE SACA" size={74} y={170} col="#fff3d6" edge="#3a1a00" out={310.0} />);
    tagAt("lc4", PT.volante, 310.7, "LA MÁS COMÚN", { dx: 280, dy: -200, col: COL.ink, out: 314.6, size: 50 });
    tagAt("lt4", PT.volante, 312.0, "LA MÁS TRAMPOSA", { dx: 300, dy: -40, col: COL.red, out: 314.6, size: 50 });
    tagAt("pi4", PT.volante, 313.4, "PARECE INOCENTE", { dx: 280, dy: 120, col: COL.ice, out: 314.6, size: 44 });
  }
  if (at(314.8, 318.31)) {
    L.push(<Shot key="vol" k="r_volante" t={t} a={314.8} z={[1.04, 1.12]} dur={4} />);
    L.push(<BigNum key="piz" t={t} at={315.5} text="PIZZERÍA" size={84} x={420} y={250} col="#ffb257" edge="#3a1a00" />);
    L.push(<BigNum key="cer" t={t} at={316.7} text="CERRAJERO" size={84} x={420} y={420} col={COL.ice} edge="#0a2a3a" />);
    L.push(<BigNum key="igl" t={t} at={317.8} text="IGLESIA" size={84} x={420} y={590} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(318.31, 322.05)) {
    L.push(<Avatar key="a318" t={t} />);
    L.push(<Veredicto key="ver4" t={t} a={319.2} b={320.5} out={321.9} l="EN EL PICAPORTE" ls="enganchado" r="DEBAJO DE LA PUERTA" rs="metido por la ranura" />);
  }
  if (at(322.05, 332.81)) {
    const th = t >= 329.0 ? ei(t, 329.0, 329.3) : 0;
    L.push(<React.Fragment key="w322">{W(t, { therm: th, walker: t >= 329 ? [328.6, 332.9] : undefined, marks: mk({ volante: t >= 329 ? 1 : 0 }) })}</React.Fragment>);
    if (th > 0) L.push(<ThermHud key="h329" t={t} amt={th} />);
    L.push(<BigNum key="np" t={t} at={322.1} text="EL FOLLETO NO ES EL PROBLEMA" size={70} y={170} out={323.9} col="#fff3d6" edge="#3a1a00" />);
    L.push(<BigNum key="ct" t={t} at={324.1} text="¿CUÁNTO TIEMPO QUEDA AHÍ?" size={78} y={170} out={326.2} col="#ffd60a" edge="#5a4500" />);
    L.push(<Dias key="d4" t={t} a={326.6} b={328.7} n={3} out={329.0} label="VUELVE A MIRAR" />);
    L.push(<BigNum key="vm" t={t} at={330.0} text="VUELVE A MIRAR" size={96} y={900} out={332.7} col="#fff3d6" edge="#5a1a00" />);
    if (t >= 329) tagAt("tp4", PT.volante, 331.5, "TODAVÍA PUESTO", { dx: 280, dy: -160, col: "#fff3d6", out: 332.7, size: 46 });
  }
  if (at(332.81, 336.82)) {
    L.push(<Avatar key="a332" t={t} />);
    L.push(<Stamp key="nen" t={t} at={334.7} text="NADIE ENTRA NI SALE" x={1360} y={220} out={336.6} rot={-6} size={64} />);
  }
  if (at(336.82, 345.6)) {
    L.push(<Shot key="eva" k="e_valija" t={t} a={336.82} z={[1.03, 1.13]} ox={-40} dur={9} />);
    L.push(<Tag key="el" t={t} at={340.1} x={1100} y={420} dx={260} dy={-200} text="«ELENA»" sub="EL NOMBRE NO ES EL REAL" col={COL.amber} out={343.0} size={64} />);
    L.push(<BigNum key="10d" t={t} at={343.4} text="10 DÍAS" sub="A LO DE SU HERMANA" size={150} x={1450} y={250} out={345.5} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(345.6, 348.89)) {
    L.push(<Shot key="efo" k="e_folletos" t={t} a={345.6} z={[1.08, 1.18]} oy={-30} dur={4} />);
    ["1", "2", "3", "4"].forEach((n, i) => L.push(<BigNum key={"f" + n} t={t} at={346.8 + i * 0.35} text={n} size={120} x={1350 + i * 130} y={200} col={i === 3 ? COL.red : "#fff3d6"} edge="#3a1a00" />));
  }
  if (at(348.89, 353.33)) {
    L.push(<Avatar key="a348" t={t} />);
    L.push(<BigNum key="cal" t={t} at={350.6} text="COMO UN CALENDARIO" size={68} x={1350} y={170} out={352.2} col="#ffd60a" edge="#5a4500" />);
    const k = Math.min(1.1, ei(t, 352.4, 352.9)), o = e(t, 352.4, 352.6) * (1 - e(t, 353.1, 353.33));
    L.push(<Card3D key="ven" id={clip("e_ventana")} x={1160} y={300} w={640} h={360} ry={-20 + (1 - k) * -50} z={(1 - k) * -500} o={o} label="LA VENTANA DEL BAÑO" labelCol={COL.amber} />);
  }
  if (at(353.33, 358.0)) {
    const sw = ei(t, 355.7, 356.0);
    L.push(<Swipe key="sw353" t={t} a={355.7} b={356.0} from={<Shot k="e_ventana" t={t} a={353.33} z={[1.06, 1.14]} dur={3} />} to={<Shot k="e_alhajero" t={t} a={355.7} z={[1.03, 1.12]} ox={-30} dur={3} />} />);
    void sw;
    L.push(<Stamp key="fz" t={t} at={354.9} text="FORZADA" x={960} y={300} out={355.6} size={110} />);
    L.push(<Tag key="alh" t={t} at={356.5} x={960} y={520} dx={300} dy={-220} text="LAS ALHAJAS DE SU MADRE" col={COL.ink} out={357.9} size={54} />);
  }
  if (at(358.0, 366.22)) {
    L.push(<AbsoluteFill key="w358" style={circ(ir(t, 358.0, 0.35))}>{W(t, { marks: mk({}, [], { volante: 1 - e(t, 359.4, 360.0) }) })}</AbsoluteFill>);
    L.push(<QueHaces key="qh4" t={t} at={358.0} out={366.0} />);
    L.push(<Steps key="st4" t={t} x={1120} y={300} w={720} size={40} out={366.0} items={[{ at: 358.9, tx: "LO SACAS EL MISMO DÍA" }, { at: 362.5, tx: "SI TE VAS: EL VECINO" }, { at: 365.1, tx: "TAMBIÉN SACA LOS PAPELES" }]} />);
  }
  if (at(366.22, 370.1)) {
    L.push(<Avatar key="a366" t={t} />);
    L.push(<BigNum key="pl" t={t} at={367.0} text="PUERTA LIMPIA" sub="= ALGUIEN EN CASA" size={110} x={1380} y={220} out={369.9} col="#7dff9e" edge="#0a3a1a" />);
  }

  // ======================= LA PAUSA · EL GRUPO DE VECINOS (libro 5, pág. 39) =======================
  if (at(370.1, 379.7)) {
    const lit = (a: number) => e(t, a, a + 0.25);
    L.push(<AbsoluteFill key="w370" style={circ(ir(t, 370.1))}>{W(t, { therm: 1, marks: mk({ plast: lit(373.6), cinta: lit(373.8), tiza: lit(374.0), volante: lit(374.2) }, ["precinto", "moneda", "diarios"]) })}</AbsoluteFill>);
    L.push(<ThermHud key="h370" t={t} amt={e(t, 370.3, 370.6)} />);
    L.push(<BigNum key="4s" t={t} at={373.6} text="4 SEÑALES" size={150} y={180} out={376.3} col="#fff3d6" edge="#5a1a00" />);
    L.push(<BigNum key="mr" t={t} at={376.5} text="FUNCIONAN POR LA MISMA RAZÓN" size={66} y={900} out={379.5} col="#ffd60a" edge="#5a4500" />);
  }
  if (at(379.7, 381.52)) {
    L.push(<Cuadra key="cu5" t={t} a={379.7} out={1e9} you={2} night title="NADIE MÁS ESTÁ MIRANDO" titleAt={379.8} marks={[]} walk={{ a: 379.8, b: 381.5, hs: [8, 9, 10] }} />);
  }
  if (at(381.52, 386.14)) {
    L.push(<Avatar key="a381" t={t} />);
    L.push(<Libreta key="lb" t={t} at={381.8} out={386.0} title="Lo que anotó la cuadra:" rows={[{ at: 383.0, tx: "martes: …" }, { at: 384.0, tx: "jueves: …" }, { at: 385.2, tx: "NADA", col: COL.red }]} />);
  }
  if (at(386.14, 395.87)) {
    const bo = ei(t, 387.4, 389.0);
    const mks = <><Marker t={t} at={388.9} box={[0.148, 0.08, 0.777, 0.108]} out={395.8} /><Marker t={t} at={393.1} box={[0.078, 0.164, 0.217, 0.185]} out={395.8} col="#7dff9e" /></>;
    L.push(<AbsoluteFill key="w386" style={circ(ir(t, 386.14, 0.6))}><World t={t} libro="l5" bookOpen={bo} fan={ei(t, 386.3, 387.4)}>{mks}</World></AbsoluteFill>);
    L.push(<Flash key="fl386" t={t} at={386.16} col="#fff1cf" peak={0.35} w={0.4} />);
    L.push(<BigNum key="l5" t={t} at={386.6} text="LIBRO 5" size={110} x={1560} y={170} out={395.7} col="#ffd60a" edge="#5a4500" sub="PÁG. 39" />);
    const ti = screenOf(t, pagePt(0.45, 0.094)), cu = screenOf(t, pagePt(0.15, 0.175));
    L.push(<Tag key="am" t={t} at={390.3} x={ti.x} y={ti.y} dx={-120} dy={-150} text="EL QUE MÁS ME GUSTA" sub="DE LOS CINCO LIBROS" col="#ffd60a" out={395.7} size={46} />);
    L.push(<Tag key="0d" t={t} at={393.1} x={cu.x} y={cu.y} dx={-320} dy={140} text="NO CUESTA NADA" col="#7dff9e" out={395.7} size={52} />);
  }
  if (at(395.87, 401.66)) {
    L.push(<Avatar key="a395" t={t} />);
    L.push(<Chat key="ch5" t={t} at={396.0} out={1e9} members={4} msgs={[{ at: 398.6, from: "Rosa (n° 24)", tx: "¡Hola vecinos! 👋" }, { at: 399.2, from: "Don Julio (n° 31)", tx: "Agendado 👍" }]} />);
    L.push(<BigNum key="34" t={t} at={398.1} text="3 O 4 TELÉFONOS" size={70} x={640} y={160} out={401.5} col="#ffd60a" edge="#5a4500" />);
  }
  if (at(401.66, 414.43)) {
    L.push(<AbsoluteFill key="w401" style={{ filter: "blur(10px) brightness(.55)" }}><World t={t} libro="l5" bookOpen={1} /></AbsoluteFill>);
    L.push(<Chat key="ch5b" t={t} at={395.0} out={1e9} x={1220} members={4} msgs={[{ at: 398.6, from: "Rosa (n° 24)", tx: "¡Hola vecinos! 👋" }, { at: 399.2, from: "Don Julio (n° 31)", tx: "Agendado 👍" },
      { at: 402.6, from: "Tú", me: true, tx: "Un auto gris pasó 3 veces. La patente termina en 47." }, { at: 406.0, from: "Rosa (n° 24)", tx: "Lo vi también. 11:15 👀" },
      { at: 410.4, from: "Ernesto (n° 18)", tx: "Miren quién visita a los del 22…", img: "img_e_valija", x: 413.6 }]} />);
    L.push(<BigNum key="fc" t={t} at={400.4} text="UNA FRASE CLARA" size={86} x={600} y={300} out={406.6} col="#fff3d6" edge="#3a1a00" />);
    L.push(<BigNum key="er5" t={t} at={407.6} text="EL ERROR QUE VEO SIEMPRE" size={64} x={600} y={300} out={413.3} col={COL.red} edge="#3a0a06" />);
    L.push(<BigNum key="esp" t={t} at={413.8} text="ESPIAR ≠ CUIDAR" size={96} x={600} y={560} out={414.4} col={COL.red} edge="#3a0a06" />);
  }
  if (at(414.43, 419.31)) {
    L.push(<Avatar key="a414" t={t} />);
    L.push(<BigNum key="ch" t={t} at={415.7} text="LA CUENTA HONESTA" size={70} x={1380} y={150} out={419.1} col="#ffd60a" edge="#5a4500" />);
    const k = Math.min(1.1, ei(t, 417.1, 417.6)), o = e(t, 417.1, 417.3) * (1 - e(t, 419.0, 419.3));
    L.push(<Card3D key="cfz" id={clip("c_cerradura")} at={417.1} x={1160} y={290} w={640} h={360} ry={-20 + (1 - k) * -50} z={(1 - k) * -500} o={o} label="CERRADURA FORZADA" labelCol={COL.red} />);
  }
  if (at(419.31, 431.49)) {
    L.push(<AbsoluteFill key="bg419" style={{ background: "radial-gradient(ellipse at 50% 40%, #2a2318, #07090d)" }} />);
    L.push(<Balanza key="bal" t={t} at={419.4} lAt={420.0} rAt={424.9} tip={427.4} out={431.4} />);
    L.push(<BigNum key="us" t={t} at={429.8} text="UNA SOLA PUERTA" size={80} y={170} out={431.4} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(431.49, 437.31)) {
    L.push(<Avatar key="a431" t={t} />);
    L.push(<Stamp key="yp" t={t} at={432.0} text="YA SE PAGÓ" x={1420} y={220} out={432.9} rot={-6} size={80} col="#2fbf71" />);
    L.push(<Desc key="d431" t={t} at={432.8} out={436.3} line="🔐 Las 7 señales, el grupo de vecinos y la casa que parece ocupada" />);
    L.push(<BigNum key="s5" t={t} at={437.1} text="SEÑAL Nº 5" size={120} x={1350} y={180} col={COL.amber} edge="#3a1a00" />);
  }

  // ======================= SEÑAL 5 · EL PRECINTO O LA GOMA =======================
  if (at(437.31, 444.2)) {
    L.push(<AbsoluteFill key="w437" style={circ(ir(t, 437.31))}>{W(t, { marks: mk({ precinto: e(t, 439.0, 439.5) }) })}</AbsoluteFill>);
    L.push(<BigNum key="s5b" t={t} at={437.3} text="SEÑAL Nº 5" size={120} y={180} col={COL.amber} edge="#3a1a00" out={438.7} />);
    tagAt("pr", PT.precinto, 439.2, "EL PRECINTO", { dx: 260, dy: -220, col: COL.amber, out: 444.1, size: 54 });
    tagAt("gm", PT.precinto, 440.4, "O LA GOMA", { dx: 300, dy: -60, col: COL.ice, out: 444.1, size: 48 });
    L.push(<BigNum key="rj" t={t} at={442.2} text="CASAS CON REJA O PORTÓN" size={70} y={930} out={444.1} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(444.2, 447.95)) {
    L.push(<Shot key="pre" k="r_precinto" t={t} a={444.2} z={[1.05, 1.15]} dur={4} />);
    L.push(<Tag key="ac" t={t} at={447.2} x={960} y={540} dx={300} dy={-200} text="DE LOS DE ATAR CABLES" col={COL.amber} out={447.9} size={50} />);
  }
  if (at(447.95, 451.88)) {
    L.push(<Avatar key="a447" t={t} />);
    L.push(<Steps key="st5a" t={t} x={1180} y={260} w={600} size={44} out={451.7} items={[{ at: 448.9, tx: "EN LA REJA" }, { at: 449.9, tx: "EN EL PORTÓN" }, { at: 451.3, tx: "EN EL BUZÓN" }]} />);
  }
  if (at(451.88, 456.0)) {
    L.push(<Shot key="gom" k="r_goma" t={t} a={451.88} z={[1.04, 1.14]} ox={20} dur={4} />);
    L.push(<Tag key="ge" t={t} at={452.6} x={960} y={540} dx={-320} dy={-200} text="UNA GOMA ELÁSTICA" sub="EN EL PICAPORTE" col={COL.amber} out={455.9} size={52} />);
  }
  if (at(456.0, 462.74)) {
    L.push(<AbsoluteFill key="w456" style={circ(ir(t, 456.0))}>{W(t, { marks: mk({ precinto: 1 }) })}</AbsoluteFill>);
    L.push(<BigNum key="dm" t={t} at={458.4} text="UN DETALLE MÁS" size={90} y={170} out={459.5} col="#ffd60a" edge="#5a4500" />);
    tagAt("ps", PT.precinto, 459.7, "PARA PASAR:", { dx: 260, dy: -220, col: COL.ink, out: 462.6, size: 50 });
    tagAt("cs", PT.precinto, 460.9, "CORTARLO ✂ O SACARLO", { dx: 300, dy: -60, col: COL.red, out: 462.6, size: 50 });
  }
  if (at(462.74, 466.81)) {
    L.push(<Avatar key="a462" t={t} />);
    L.push(<Dias key="d5" t={t} a={463.2} b={464.2} n={2} out={466.6} x={1560} label="SIGUE CERRADO" />);
    L.push(<BigNum key="np5" t={t} at={465.2} text="NADIE PASÓ" size={86} x={1560} y={820} out={466.6} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(466.81, 476.1)) {
    L.push(<Shot key="cat" k="r_catalogo" t={t} a={466.81} z={[1.03, 1.14]} ox={-30} dur={14} />);
    L.push(<BigNum key="oj" t={t} at={467.1} text="OJO: COSAS INOCENTES" size={74} y={160} out={469.8} col={COL.ice} edge="#0a2a3a" />);
    L.push(<Tag key="rep" t={t} at={470.0} x={960} y={560} dx={-320} dy={-200} text="REPARTIDORES" sub="UNA BOLSA CON UN CATÁLOGO" col={COL.amber} out={476.0} size={54} />);
  }
  if (at(476.1, 481.72)) {
    L.push(<Avatar key="a476" t={t} />);
    const k = Math.min(1.1, ei(t, 476.5, 477.0)), o = e(t, 476.5, 476.7) * (1 - e(t, 481.4, 481.7));
    L.push(<Card3D key="cat2" id={clip("r_catalogo")} x={1160} y={300} w={640} h={360} ry={-20 + (1 - k) * -50} z={(1 - k) * -500} o={o} label={t >= 480.4 ? "✓ ES PUBLICIDAD" : "¿QUÉ HAY COLGADO?"} labelCol={t >= 480.4 ? "#7dff9e" : COL.amber} />);
  }
  if (at(481.72, 487.8)) {
    L.push(<AbsoluteFill key="w481" style={circ(ir(t, 481.72))}>{W(t, { therm: ei(t, 481.8, 482.2), marks: mk({ precinto: 1 }) })}</AbsoluteFill>);
    L.push(<ThermHud key="h481" t={t} amt={e(t, 481.9, 482.2)} />);
    tagAt("gs", PT.precinto, 482.1, "UNA GOMA SOLA · UN PRECINTO", { dx: -200, dy: -220, col: "#fff3d6", out: 486.0, size: 46 });
    tagAt("np", PT.precinto, 484.0, "QUE NADIE DE TU CASA PUSO", { dx: -200, dy: -80, col: COL.amber, out: 486.0, size: 42 });
    L.push(<Stamp key="pr5" t={t} at={486.1} text="ES UNA PRUEBA" x={960} y={300} out={487.7} size={100} />);
  }
  if (at(487.8, 494.98)) {
    L.push(<Shot key="tij" k="r_tijera" t={t} a={487.8} z={[1.03, 1.12]} ox={30} dur={8} />);
    L.push(<QueHaces key="qh5" t={t} at={487.0} out={494.8} />);
    L.push(<Steps key="st5" t={t} x={90} y={240} w={700} size={40} out={494.8} items={[{ at: 489.6, tx: "FOTO ANTES" }, { at: 488.0, tx: "LO CORTAS ✂" }, { at: 491.3, tx: "A UNA BOLSITA" }]} />);
    L.push(<Evidencia key="ev" t={t} at={493.5} out={494.9} />);
  }
  if (at(494.98, 500.27)) {
    L.push(<Avatar key="a494" t={t} />);
    L.push(<Evidencia key="ev2" t={t} at={493.5} out={496.8} x={1300} y={420} />);
    L.push(<BigNum key="s6" t={t} at={497.5} text="SEÑAL Nº 6" size={120} x={1350} y={180} col={COL.amber} edge="#3a1a00" />);
    L.push(<BigNum key="s6b" t={t} at={498.9} text="LA MONEDA EN LA RANURA" size={64} x={1350} y={330} col="#fff3d6" edge="#3a1a00" />);
  }

  // ======================= SEÑAL 6 · LA MONEDA EN LA RANURA =======================
  if (at(500.27, 505.0)) {
    L.push(<AbsoluteFill key="w500" style={circ(ir(t, 500.27))}>{W(t, { marks: mk({ moneda: 1 }) })}</AbsoluteFill>);
    L.push(<BigNum key="mv6" t={t} at={500.5} text="LA MÁS VIEJA DE TODAS" size={80} y={930} out={502.5} col="#fff3d6" edge="#3a1a00" />);
    tagAt("mc", PT.moneda, 502.8, "UNA MONEDA CHICA", { dx: 300, dy: 160, col: COL.amber, out: 504.9, size: 52 });
  }
  if (at(505.0, 510.12)) {
    L.push(<Shot key="mon" k="r_moneda" t={t} a={505.0} z={[1.05, 1.16]} oy={-20} dur={5} />);
    L.push(<Tag key="rn" t={t} at={506.0} x={960} y={500} dx={300} dy={-200} text="EN LA RANURA" col={COL.amber} out={510.0} size={52} />);
    L.push(<Tag key="um" t={t} at={509.2} x={960} y={600} dx={-320} dy={200} text="O EN EL UMBRAL" col={COL.ice} out={510.0} size={48} />);
  }
  if (at(510.12, 515.8)) {
    L.push(<Avatar key="a510" t={t} />);
    L.push(<Steps key="st6a" t={t} x={1180} y={260} w={640} size={44} out={515.6} items={[{ at: 511.1, tx: "UN PALILLO" }, { at: 512.4, tx: "UNA PIEDRITA" }, { at: 514.6, tx: "EL MISMO TRUCO" }]} />);
  }
  if (at(515.8, 521.5)) {
    const closed = t >= 518.4;
    L.push(<Swipe key="sw515" t={t} a={518.4} b={518.75} vert from={W(t, { doorOpen: ei(t, 516.0, 517.0), drop: e(t, 516.9, 517.7), marks: mk({ moneda: 1 }) })} to={W(t, { marks: mk({ moneda: 1, }) })} />);
    void closed;
    tagAt("sc6", [0.15, 0.25, 0.4], 517.6, "SE CAE", { dx: 280, dy: -100, col: COL.amber, out: 518.3, size: 60 });
    L.push(<BigNum key="sa" t={t} at={519.4} text="SIGUE ARRIBA = NO ABRISTE" size={74} y={930} out={521.4} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(521.5, 524.17)) {
    L.push(<Shot key="gar" k="r_garaje" t={t} a={521.5} z={[1.04, 1.12]} dur={3} />);
    L.push(<BigNum key="pg" t={t} at={521.6} text="PUERTAS DE GARAJE" size={90} y={170} out={524.0} col="#ffd60a" edge="#5a4500" />);
  }
  if (at(524.17, 529.97)) {
    L.push(<Avatar key="a524" t={t} />);
    L.push(<Tag key="tp6" t={t} at={527.8} x={1300} y={900} dx={120} dy={-260} text="DONDE TOCA EL PISO" col={COL.amber} out={529.8} size={52} />);
  }
  if (at(529.97, 538.6)) {
    L.push(<AbsoluteFill key="bg529" style={{ background: "radial-gradient(ellipse at 50% 40%, #232833, #07090d)" }} />);
    L.push(<Garaje key="gr" t={t} a={529.97} up={530.6} out={538.4} x={1300} />);
    L.push(<QueHaces key="qh6" t={t} at={532.4} out={538.4} />);
    L.push(<Steps key="st6" t={t} x={90} y={240} w={700} size={42} out={538.4} items={[{ at: 534.4, tx: "FOTO" }, { at: 535.5, tx: "LO SACAS" }, { at: 536.5, tx: "AVISAS AL GRUPO" }]} />);
  }
  if (at(538.6, 543.76)) {
    L.push(<AbsoluteFill key="w538" style={circ(ir(t, 538.6))}>{W(t)}</AbsoluteFill>);
    L.push(<BigNum key="ad" t={t} at={538.6} text="ADEMÁS:" size={90} y={170} out={540.4} col="#ffd60a" edge="#5a4500" />);
    tagAt("rc", PT.lock, 540.6, "REVISA LA CERRADURA", { dx: -300, dy: -200, col: COL.amber, out: 543.6, size: 52 });
    tagAt("mt", PT.lock, 541.7, "ESA MISMA TARDE", { dx: -300, dy: -60, col: COL.ink, out: 543.6, size: 46 });
  }
  if (at(543.76, 548.92)) {
    L.push(<Avatar key="a543" t={t} />);
    L.push(<Stamp key="li" t={t} at={548.0} text="ESA PUERTA LE INTERESA" x={1340} y={220} out={548.9} rot={-5} size={58} />);
  }
  if (at(548.92, 558.21)) {
    const sh = <Shot k="r_rayones" t={t} a={548.92} z={[1.02, 1.06]} dur={10} />;
    L.push(<React.Fragment key="ray">{sh}</React.Fragment>);
    L.push(<Lupa key="lu" t={t} a={549.0} out={558.0} dur={7} path={[[760, 420], [980, 520], [1100, 600], [960, 540]]}>{sh}</Lupa>);
    L.push(<Tag key="rn6" t={t} at={550.6} x={760} y={300} dx={-160} dy={-80} text="RAYONES NUEVOS" col={COL.amber} out={557.6} size={52} />);
    L.push(<Tag key="br6" t={t} at={553.4} x={760} y={420} dx={-160} dy={0} text="BRILLANTES" col={COL.ink} out={557.6} size={46} />);
    L.push(<Tag key="ds6" t={t} at={555.4} x={760} y={540} dx={-160} dy={80} text="DE DESTORNILLADOR" col={COL.ice} out={557.6} size={46} />);
    L.push(<Stamp key="yl" t={t} at={557.8} text="YA LA PROBARON" x={960} y={880} out={558.2} size={90} />);
  }
  if (at(558.21, 564.26)) {
    L.push(<Avatar key="a558" t={t} />);
    const k = Math.min(1.1, ei(t, 559.3, 559.8)), o = e(t, 559.3, 559.5) * (1 - e(t, 563.9, 564.2));
    L.push(<Card3D key="cil" id={clip("c_cilindro")} at={559.3} x={1160} y={300} w={640} h={360} ry={-20 + (1 - k) * -50} z={(1 - k) * -500} o={o} label={t >= 561.9 ? "O LA TRABA DE ADENTRO" : "CAMBIAR EL CILINDRO"} labelCol={COL.amber} />);
  }

  // ======================= SEÑAL 7 · LA MARCA QUE DEJAS TÚ =======================
  if (at(564.26, 576.52)) {
    L.push(<AbsoluteFill key="w564" style={circ(ir(t, 564.26))}>{W(t, { therm: 1, marks: mk({ plast: 1, cinta: 1, tiza: 1, volante: 1, precinto: 1, moneda: 1, diarios: e(t, 567.9, 568.4) }) })}</AbsoluteFill>);
    L.push(<ThermHud key="h564" t={t} amt={e(t, 564.4, 564.7)} />);
    L.push(<BigNum key="pm" t={t} at={564.5} text="LA QUE TE PROMETÍ" size={80} y={900} out={566.0} col="#fff3d6" edge="#5a1a00" />);
    L.push(<BigNum key="s7" t={t} at={566.2} text="SEÑAL Nº 7" size={130} y={180} col={COL.amber} edge="#3a1a00" out={568.0} />);
    L.push(<BigNum key="s7b" t={t} at={568.2} text="LA MARCA QUE DEJAS TÚ" size={90} y={180} col={COL.red} edge="#3a0a06" out={572.0} />);
    L.push(<BigNum key="ap" t={t} at={571.6} text="30 AÑOS ABRIENDO PUERTAS" sub="DESPUÉS DE LOS ROBOS" size={70} y={900} out={574.0} col="#fff3d6" edge="#5a1a00" />);
    L.push(<BigNum key="nn" t={t} at={576.0} text="NO NECESITAN NINGUNA MARCA" size={70} y={180} out={576.52} col="#fff3d6" edge="#5a1a00" />);
  }
  if (at(576.52, 581.1)) {
    const gone = (a: number) => e(t, a, a + 0.3);
    L.push(<SplitAv key="sp576" t={t} a={576.52} b={581.1}>{W(t, { therm: 1, marks: mk({ diarios: 1 }, [], { plast: 1 - gone(579.6), cinta: 1 - gone(579.9), tiza: 1 - gone(578.7), volante: 1 - gone(580.1), precinto: 1 - gone(580.3), moneda: 1 - gone(580.5) }) })}</SplitAv>);
    L.push(<BigNum key="nt" t={t} at={578.7} text="NI TIZA · NI PLÁSTICO · NI MONEDAS" size={44} x={1440} y={150} out={580.95} col="#fff3d6" edge="#5a1a00" />);
  }
  if (at(581.1, 585.16)) {
    L.push(<AbsoluteFill key="w581" style={circ(ir(t, 581.1))}>{W(t, { marks: mk({ diarios: 1 }, ["plast", "cinta", "tiza", "volante", "precinto", "moneda"]) })}</AbsoluteFill>);
    L.push(<BigNum key="lcd" t={t} at={582.2} text="LO QUE LA CASA DICE SOLA" size={80} y={180} out={585.0} col="#ffd60a" edge="#5a4500" />);
  }
  const CD = (x: number, sc: number, out: number) => <CasaDice key="cd" t={t} out={out} x={x} sc={sc} items={[{ at: 585.2, tx: "EL DIARIO DESDE EL LUNES", ic: "📰" }, { at: 588.2, tx: "EL BUZÓN QUE REBALSA", ic: "📬" }, { at: 591.1, tx: "LA LUZ PRENDIDA DE DÍA", ic: "💡" }, { at: 594.8, tx: "EL PASTO LARGO", ic: "🌾" }, { at: 596.0, tx: "EL TACHO QUE NO SALIÓ", ic: "🗑️" }, { at: 601.7, tx: "LA FOTO EN LAS REDES", ic: "📱" }]} />;
  if (at(585.16, 594.15)) {
    L.push(<Shot key="cs" k="r_casasola" t={t} a={585.16} z={[1.03, 1.14]} ox={-60} dur={9} />);
    L.push(<React.Fragment key="cdw">{CD(1180, 1, 1e9)}</React.Fragment>);
  }
  if (at(594.15, 599.53)) { L.push(<Avatar key="a594" t={t} />); L.push(<React.Fragment key="cdw2">{CD(1220, 0.95, 599.4)}</React.Fragment>); }
  if (at(599.53, 611.13)) {
    L.push(<AbsoluteFill key="bg599" style={{ background: "radial-gradient(ellipse at 50% 40%, #2a2030, #07090d)" }} />);
    L.push(<BigNum key="mm" t={t} at={599.9} text="LA MÁS MODERNA" size={80} x={960} y={110} out={601.5} col={COL.ice} edge="#0a2a3a" />);
    L.push(<Post key="po1" t={t} at={601.6} out={611.0} img="img_r_aeropuerto" cap="¡Por fin de vacaciones con mis nietos! ✈️" ta={605.0} tb={606.8} loc="Aeropuerto" locAt={603.3} x={160} y={110} w={900} />);
    L.push(<BigNum key="mc7" t={t} at={607.7} text="LA MARCA MÁS CLARA" size={76} x={1490} y={420} out={611.0} col="#ffd60a" edge="#5a4500" />);
    L.push(<BigNum key="dn" t={t} at={609.9} text="LA DEJAMOS NOSOTROS" size={64} x={1490} y={600} out={611.0} col={COL.red} edge="#3a0a06" />);
  }
  if (at(611.13, 616.67)) {
    L.push(<Avatar key="a611" t={t} />);
    L.push(<BigNum key="dom" t={t} at={615.4} text="UN DOMINGO A LA TARDE" size={64} x={1380} y={180} out={616.5} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(616.67, 629.15)) {
    const sw = ei(t, 619.6, 620.0);
    if (sw < 1) L.push(<AbsoluteFill key="alm" style={{ opacity: 1 - sw }}><Shot k="r_almuerzo" t={t} a={616.67} z={[1.03, 1.12]} ox={-30} dur={4} /></AbsoluteFill>);
    L.push(<Tag key="70" t={t} at={618.4} x={760} y={420} dx={-280} dy={-200} text="70 Y TANTOS" col={COL.amber} out={619.6} size={54} />);
    if (sw > 0) {
      L.push(<AbsoluteFill key="bg620" style={{ background: "radial-gradient(ellipse at 50% 40%, #2a2030, #07090d)", opacity: sw }} />);
      L.push(<Post key="po2" t={t} at={619.8} out={629.0} img="img_r_almuerzo" who="don.raul.53" cap="Almuerzo con mi hijo 🍝 ¡qué lindo día!" ta={620.6} tb={623.4} loc="Restaurante El Muelle · otra ciudad" locAt={625.8} x={160} y={110} w={900} />);
      L.push(<BigNum key="nr" t={t} at={625.8} text="EL NOMBRE DEL RESTAURANTE" size={54} x={1490} y={420} out={629.0} col={COL.red} edge="#3a0a06" />);
      L.push(<Steps key="ls" t={t} x={1110} y={560} w={760} size={38} out={629.0} items={[{ at: 627.9, tx: "NO TUVO QUE PROBAR NADA" }]} />);
    }
  }
  if (at(629.15, 633.24)) {
    L.push(<Avatar key="a629" t={t} />);
    L.push(<Libreta key="lb7" t={t} at={629.2} out={633.1} title="Lo que supo el ladrón:" x={1180} rows={[{ at: 630.4, tx: "✓ casa vacía", col: COL.red }, { at: 631.6, tx: "✓ cuánto tarda en volver", col: COL.red }]} />);
  }
  if (at(633.24, 640.1)) {
    L.push(<AbsoluteFill key="bg633" style={{ background: "radial-gradient(ellipse at 50% 40%, #1e2a24, #07090d)" }} />);
    L.push(<QueHaces key="qh7" t={t} at={633.6} out={640.0} text="¿QUÉ HACES CON ESTA?" />);
    L.push(<Steps key="st7" t={t} x={560} y={330} w={820} size={48} out={640.0} items={[{ at: 635.3, tx: "LAS FOTOS DEL VIAJE…" }, { at: 637.0, tx: "…CUANDO VUELVES" }, { at: 638.1, tx: "NUNCA MIENTRAS ESTÁS AFUERA", bad: true }]} />);
  }
  if (at(640.1, 643.36)) {
    L.push(<Shot key="tim" k="r_timer" t={t} a={640.1} z={[1.04, 1.12]} dur={4} />);
    L.push(<Timer key="ti" t={t} at={640.6} on={644.2} off={645.8} out={1e9} x={1480} y={520} sc={0.85} />);
  }
  if (at(643.36, 648.42)) {
    L.push(<Avatar key="a643" t={t} />);
    L.push(<Timer key="ti2" t={t} at={640.6} on={644.2} off={645.8} out={648.2} x={1480} y={470} sc={0.8} />);
    L.push(<BigNum key="pz" t={t} at={647.1} text="< UNA PIZZA 🍕" size={70} x={1480} y={900} out={648.3} col="#7dff9e" edge="#0a3a1a" />);
  }
  if (at(648.42, 658.68)) {
    L.push(<Shot key="tac" k="r_tacho" t={t} a={648.42} z={[1.03, 1.13]} ox={30} dur={8} />);
    L.push(<Steps key="st7b" t={t} x={90} y={150} w={760} size={40} out={655.6} items={[{ at: 649.9, tx: "EL DIARIO" }, { at: 650.4, tx: "EL CORREO" }, { at: 652.4, tx: "EL TACHO EL DÍA DEL CAMIÓN" }]} />);
    L.push(<Tag key="av7" t={t} at={654.6} x={1250} y={640} dx={160} dy={-260} text="AUNQUE ESTÉ VACÍO" col={COL.amber} out={655.6} size={48} />);
    L.push(<Dark key="dk656" o={e(t, 655.6, 656.0) * 0.85} />);
    L.push(<Regalo key="rg" t={t} at={656.3} open={657.4} out={658.6} x={960} y={540} text="UNA MÁS" />);
  }
  if (at(658.68, 662.8)) {
    L.push(<Avatar key="a658" t={t} />);
    L.push(<BigNum key="ma" t={t} at={660.3} text="LA QUE MÁS ASUSTA" size={74} x={1380} y={180} out={662.6} col={COL.red} edge="#3a0a06" />);
  }

  // ======================= DE REGALO · LA PRUEBA DEL TIMBRE =======================
  if (at(662.8, 674.84)) {
    L.push(<Shot key="tbr" k="d_timbre" t={t} a={662.8} z={[1.03, 1.14]} ox={-30} dur={12} />);
    L.push(<BigNum key="pt" t={t} at={663.1} text="🔔 LA PRUEBA DEL TIMBRE" size={86} y={160} out={665.3} col="#ffd60a" edge="#5a4500" />);
    L.push(<BigNum key="mm2" t={t} at={665.7} text="MEDIA MAÑANA" size={70} x={1560} y={160} out={669.3} col="#fff3d6" edge="#3a1a00" />);
    L.push(<Tag key="bv" t={t} at={669.8} x={960} y={420} dx={300} dy={-120} text="BIEN VESTIDO" col={COL.ice} out={673.6} size={52} />);
    L.push(<Tag key="pn" t={t} at={671.4} x={960} y={520} dx={300} dy={60} text="PREGUNTA POR ALGUIEN QUE NO EXISTE" col={COL.amber} out={673.6} size={40} />);
    L.push(<Globos key="g1" t={t} out={674.8} items={[{ at: 673.8, tx: "¿Está Roberto?", side: "l", y: 640 }]} />);
  }
  if (at(674.84, 680.22)) {
    L.push(<Avatar key="a674" t={t} />);
    L.push(<Globos key="g2" t={t} out={680.0} items={[{ at: 675.1, tx: "No, aquí no vive ningún Roberto.", side: "r", y: 300, x: 1060 }, { at: 677.9, tx: "Ah, perdón, me equivoqué de casa 😊", side: "r", y: 540, x: 1060 }]} />);
  }
  if (at(680.22, 691.48)) {
    const th = ei(t, 680.3, 680.7), lib = t >= 685.3;
    L.push(<React.Fragment key="w680">{W(t, { therm: th, walker: [679.6, 684.4] })}</React.Fragment>);
    L.push(<ThermHud key="h680" t={t} amt={e(t, 680.4, 680.7)} />);
    L.push(<BigNum key="sva" t={t} at={680.4} text="SE VA MUY AMABLE" size={74} y={900} out={682.1} col="#fff3d6" edge="#5a1a00" />);
    L.push(<Stamp key="ne2" t={t} at={682.3} text="NO SE EQUIVOCÓ" x={960} y={260} out={685.2} size={96} />);
    L.push(<BigNum key="qs" t={t} at={683.5} text="QUERÍA SABER SI HABÍA ALGUIEN" size={60} y={900} out={685.2} col="#ffd60a" edge="#5a4500" />);
    if (lib) L.push(<Dark key="dk685" o={0.7} />);
    L.push(<Libreta key="lbl" t={t} at={685.3} out={1e9} title="Calle 9, n° 22 · 11:00" x={1180} y={170} rows={[{ at: 685.7, tx: "nadie contesta → ANOTADA", col: COL.red }, { at: 689.1, tx: "contestan → otro día," }, { at: 693.0, tx: "otra hora" }]} />);
  }
  if (at(691.48, 696.96)) {
    L.push(<Avatar key="a691" t={t} />);
    L.push(<Libreta key="lbl2" t={t} at={685.3} out={694.6} title="Calle 9, n° 22 · 11:00" x={1180} y={170} rows={[{ at: 685.7, tx: "nadie contesta → ANOTADA", col: COL.red }, { at: 689.1, tx: "contestan → otro día," }, { at: 693.0, tx: "otra hora" }]} />);
    L.push(<QueHaces key="qh8" t={t} at={694.9} out={696.8} x={1180} />);
    L.push(<BigNum key="cs8" t={t} at={695.8} text="CONTESTA, PERO SIN ABRIR" size={56} x={1440} y={330} out={696.8} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(696.96, 706.7)) {
    L.push(<Swipe key="sw697" t={t} a={700.8} b={701.15} from={<Shot k="d_cadena" t={t} a={696.96} z={[1.03, 1.12]} ox={30} dur={5} />} to={<Shot k="d_mirilla" t={t} a={700.8} z={[1.05, 1.15]} dur={6} />} />);
    L.push(<Tag key="cad" t={t} at={700.0} x={960} y={420} dx={-300} dy={-160} text="CON LA CADENA PUESTA" col={COL.amber} out={700.8} size={52} />);
    L.push(<Tag key="mir" t={t} at={701.6} x={960} y={540} dx={300} dy={-260} text="O POR LA MIRILLA" col={COL.ice} out={706.5} size={52} />);
    L.push(<Steps key="st8" t={t} x={1100} y={640} w={760} size={40} out={706.5} items={[{ at: 703.1, tx: "QUE SEPA QUE HAY ALGUIEN" }, { at: 704.4, tx: "NO QUIÉN NI CUÁNTOS", bad: true }]} />);
  }
  if (at(706.7, 709.61)) {
    L.push(<AbsoluteFill key="bg706" style={{ background: "radial-gradient(ellipse at 50% 40%, #2a1e1e, #07090d)" }} />);
    L.push(<BigNum key="fr" t={t} at={706.9} text="LA FRASE PARA MIS CLIENTAS" size={70} y={180} out={709.5} col="#ffd60a" edge="#5a4500" />);
    L.push(<Frase key="fr1" t={t} at={708.0} xAt={1e9} bad="ESTOY SOLA" good="" goodAt={1e9} out={709.5} x={960} y={560} />);
  }
  if (at(709.61, 713.91)) {
    L.push(<Avatar key="a709" t={t} />);
    L.push(<Frase key="fr2" t={t} at={709.5} xAt={710.4} bad="ESTOY SOLA" good="MI HIJO ESTÁ DURMIENDO" goodAt={712.5} out={713.8} x={1380} y={520} />);
  }
  if (at(713.91, 723.0)) {
    L.push(<Cuadra key="cu8" t={t} a={713.91} out={722.9} you={2} title="SI VUELVE O TOCA OTROS TIMBRES…" titleAt={717.6}
      marks={[{ at: 719.0, h: 3, icon: "🔔", col: "#ffd60a" }, { at: 720.6, h: 4, icon: "🔔", col: "#ffd60a" }, { at: 721.3, h: 5, icon: "🔔", col: "#ffd60a" }]} walk={{ a: 718.2, b: 721.6, hs: [2, 3, 4, 5], icon: "👔" }} />);
    L.push(<BigNum key="op" t={t} at={714.8} text="AUNQUE VIVA EN OTRA PROVINCIA 😉" size={58} y={940} out={717.4} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(723.0, 727.0)) {
    L.push(<AbsoluteFill key="bg723" style={{ background: "radial-gradient(ellipse at 50% 40%, #1b2530, #07090d)" }} />);
    L.push(<Chat key="ch8" t={t} at={723.0} out={726.9} x={680} y={90} members={5} msgs={[{ at: 723.6, from: "Tú", me: true, tx: "11:10 · muchacho de camisa celeste tocando timbres en la cuadra" }, { at: 725.6, from: "Don Julio (n° 31)", tx: "Gracias, ya aviso 🙏" }]} />);
  }

  // ======================= QUÉ HACER CUANDO ENCUENTRAS UNA · 5 PASOS =======================
  if (at(727.0, 732.7)) {
    L.push(<Avatar key="a727" t={t} />);
    L.push(<Recap key="rc" t={t} at={728.6} out={731.4} y={880} />);
    L.push(<BigNum key="mi" t={t} at={731.6} text="LO MÁS IMPORTANTE" size={80} x={1380} y={180} out={732.6} col="#ffd60a" edge="#5a4500" />);
  }
  const P5 = <Pasos5 key="p5" t={t} at={732.8} out={1e9} items={[{ at: 738.1, tx: "NO TE ENCIERRES" }, { at: 749.5, tx: "FOTO ANTES DE TOCAR" }, { at: 756.2, tx: "SÁCALA" }, { at: 764.9, tx: "MIRA LAS CASAS DE AL LADO" }, { at: 781.0, tx: "REVISA TU PUERTA ESA TARDE" }]} />;
  if (at(732.7, 743.89)) {
    L.push(<AbsoluteFill key="w732" style={circ(ir(t, 732.7))}>{W(t)}</AbsoluteFill>);
    L.push(<Dark key="dk732" o={0.45} />);
    L.push(P5);
    L.push(<BigNum key="mi2" t={t} at={733.0} text="QUÉ HACER CUANDO ENCUENTRAS UNA" size={58} x={1300} y={110} out={735.0} col="#fff3d6" edge="#3a1a00" />);
    L.push(<BigNum key="mie" t={t} at={735.4} text="EL MIEDO HACE HACER COSAS RARAS" size={50} x={1300} y={110} out={737.9} col={COL.red} edge="#3a0a06" />);
    L.push(<BigNum key="en" t={t} at={741.3} text="NO ES «ESTA NOCHE»" size={70} x={1300} y={860} out={744.2} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(743.89, 748.96)) {
    L.push(<Avatar key="a743" t={t} />);
    L.push(<BigNum key="am2" t={t} at={744.4} text="ALGUIEN MIRA LA CUADRA" size={60} x={1380} y={180} out={746.8} col={COL.amber} edge="#3a1a00" />);
    L.push(<BigNum key="tt" t={t} at={747.0} text="TIENES TIEMPO" size={86} x={1380} y={180} out={748.8} col="#7dff9e" edge="#0a3a1a" />);
  }
  if (at(748.96, 762.22)) {
    L.push(<AbsoluteFill key="w748" style={circ(ir(t, 748.96))}>{W(t, { marks: mk({}, [], { plast: 1 - e(t, 757.0, 757.6) }) })}</AbsoluteFill>);
    L.push(<Visor key="vs8" t={t} at={750.0} snap={751.2} out={755.4} />);
    L.push(P5);
    L.push(<BigNum key="cc" t={t} at={760.2} text="QUE NO PUEDA SACAR CONCLUSIONES" size={52} x={1300} y={940} out={762.1} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(762.22, 766.05)) {
    L.push(<Avatar key="a762" t={t} />);
    L.push(<div key="p5w" style={{ position: "absolute", inset: 0, transform: "translateX(1150px) scale(.78)", transformOrigin: "0 0" }}>{P5}</div>);
  }
  if (at(766.05, 776.39)) {
    L.push(<Cuadra key="cu9" t={t} a={766.05} out={776.3} you={2} title="¿SEÑALES EN VARIAS CASAS?" titleAt={766.4}
      marks={[{ at: 767.6, h: 1, icon: "✏️" }, { at: 768.3, h: 3, icon: "🩹" }, { at: 769.0, h: 8, icon: "📄" }]} />);
    L.push(<Llamada key="ll2" t={t} at={771.0} out={776.3} x={1280} y={560} items={[{ at: 774.6, tx: "QUÉ ENCONTRASTE" }, { at: 775.9, tx: "EN QUÉ CASAS" }]} />);
  }
  if (at(776.39, 780.58)) {
    L.push(<Avatar key="a776" t={t} />);
    L.push(<Llamada key="ll3" t={t} at={771.0} out={780.4} x={1280} y={110} items={[{ at: 774.6, tx: "QUÉ ENCONTRASTE" }, { at: 775.9, tx: "EN QUÉ CASAS" }, { at: 777.4, tx: "QUIÉN PASÓ 2 VECES" }]} />);
  }
  if (at(780.58, 790.84)) {
    L.push(<Shot key="tor" k="c_tornillos" t={t} a={780.58} z={[1.03, 1.16]} ox={-30} dur={10} />);
    L.push(<Dark key="dk780" o={0.25} />);
    L.push(<div key="p5x" style={{ position: "absolute", inset: 0, opacity: 1 - e(t, 784.0, 784.3) }}>{P5}</div>);
    L.push(<Steps key="st9" t={t} x={1150} y={180} w={720} size={42} out={788.7} items={[{ at: 784.6, tx: "LA TRABA DE ADENTRO" }, { at: 785.9, tx: "LA CADENA" }, { at: 786.8, tx: "LOS TORNILLOS DE LA PLACA" }]} />);
    L.push(<BigNum key="cc9" t={t} at={790.0} text="RAYONES → CILINDRO NUEVO" size={64} y={180} out={790.8} col="#ffd60a" edge="#5a4500" />);
  }
  if (at(790.84, 795.01)) {
    L.push(<Avatar key="a790" t={t} />);
    L.push(<BigNum key="mo" t={t} at={793.5} text="MI OFICIO" size={110} x={1450} y={200} out={794.9} col="#ffd60a" edge="#5a4500" />);
  }
  if (at(795.01, 800.9)) {
    L.push(<AbsoluteFill key="bg795" style={{ background: "radial-gradient(ellipse at 50% 40%, #1b2530, #07090d)" }} />);
    L.push(<Costos key="cos" t={t} at={795.2} b2={798.6} out={800.8} x={550} y={260} />);
  }
  if (at(800.9, 807.77)) {
    L.push(<Shot key="lin" k="r_linterna" t={t} a={800.9} z={[1.03, 1.12]} ox={-30} dur={7} />);
    L.push(<BigNum key="mp" t={t} at={802.4} text="¿TU MAMÁ O TU PAPÁ VIVEN SOLOS?" size={62} y={160} out={804.6} col="#fff3d6" edge="#3a1a00" />);
    L.push(<Steps key="st10" t={t} x={1150} y={640} w={720} size={42} out={807.6} items={[{ at: 804.7, tx: "MÁNDALES ESTE VIDEO" }, { at: 806.4, tx: "MEJOR: VE EL DOMINGO" }]} />);
  }
  if (at(807.77, 812.14)) {
    L.push(<Avatar key="a807" t={t} />);
    L.push(<BigNum key="5m" t={t} at={810.0} text="5 MINUTOS + 🔦" size={100} x={1420} y={200} out={812.0} col="#ffd60a" edge="#5a4500" />);
  }

  // ======================= LA GUÍA (otra vez por la cerradura) =======================
  if (at(812.14, 814.81)) {
    L.push(<AbsoluteFill key="w812" style={circ(ir(t, 812.14))}>{W(t, { marks: mk({}, [...MARKS]) })}</AbsoluteFill>);
    L.push(<BigNum key="ca" t={t} at={813.1} text="> CUALQUIER ALARMA" size={90} y={180} out={814.4} col="#7dff9e" edge="#0a3a1a" />);
    const dk = e(t, 814.4, 814.8);
    if (dk > 0) L.push(<AbsoluteFill key="bk812" style={{ background: "#000", opacity: dk }} />);
  }
  if (at(814.81, 824.61)) {
    const bo = ei(t, 821.0, 822.8);
    const mks = <><Marker t={t} at={825.4} box={[0.075, 0.083, 0.625, 0.117]} /></>;
    L.push(<AbsoluteFill key="w814" style={circ(ir(t, 814.81, 0.6))}><World t={t} bookOpen={bo} fan={ei(t, 816.6, 818.2) * (1 - ei(t, 822.0, 823.0))}>{mks}</World></AbsoluteFill>);
    L.push(<Flash key="fl814" t={t} at={814.83} col="#fff1cf" peak={0.35} w={0.4} />);
    L.push(<Steps key="st11" t={t} x={90} y={160} w={720} size={40} out={823.3} items={[{ at: 816.8, tx: "LAS 7 SEÑALES" }, { at: 818.0, tx: "QUÉ HACER CON CADA UNA" }, { at: 819.6, tx: "LA LISTA DE COMPRAS" }]} />);
    L.push(<BigNum key="mc11" t={t} at={823.5} text="EL MÉTODO DEL CERRAJERO" size={80} y={150} out={1e9} col="#ffd60a" edge="#5a4500" />);
  }
  if (at(824.61, 829.52)) {
    L.push(<Avatar key="a824" t={t} />);
    L.push(<BigNum key="l1" t={t} at={825.4} text="LIBRO 1 · PÁG. 61" size={80} x={1380} y={180} out={829.4} col="#ffd60a" edge="#5a4500" />);
    const k = Math.min(1.1, ei(t, 825.6, 826.1)), o = e(t, 825.6, 825.8) * (1 - e(t, 829.2, 829.5));
    L.push(<Card3D key="p61" id="img_l1_p061" x={1240} y={300} w={440} h={570} ry={-16 + (1 - k) * -50} z={(1 - k) * -500} o={o} label="LA CASA DESDE LA VEREDA" labelCol={COL.amber} />);
  }
  if (at(829.52, 836.79)) {
    const mks = <><Marker t={t} at={830.3} box={[0.148, 0.08, 0.777, 0.108]} /><Marker t={t} at={832.4} box={[0.447, 0.525, 0.92, 0.562]} col="#8fd6ff" /></>;
    L.push(<React.Fragment key="w829"><World t={t} libro="l5" bookOpen={1}>{mks}</World></React.Fragment>);
    L.push(<BigNum key="l5b" t={t} at={829.9} text="LIBRO 5 · PÁG. 39" size={80} x={1500} y={160} out={833.4} col="#ffd60a" edge="#5a4500" />);
    const gv = screenOf(t, pagePt(0.45, 0.094));
    L.push(<Tag key="gv" t={t} at={832.4} x={gv.x} y={gv.y} dx={-240} dy={140} text="EL GRUPO DE VECINOS" col="#8fd6ff" out={833.4} size={46} />);
    L.push(<Desc key="d833" t={t} at={833.7} out={836.6} />);
  }
  if (at(836.79, 843.14)) {
    L.push(<AbsoluteFill key="w836" style={{ filter: "blur(8px) brightness(.5)" }}><World t={t} libro="l5" bookOpen={1} /></AbsoluteFill>);
    L.push(<BigNum key="cm" t={t} at={837.6} text="CUÉNTAME EN LOS COMENTARIOS" size={54} x={660} y={300} out={843.0} col="#fff3d6" edge="#3a1a00" />);
    L.push(<BigNum key="ar" t={t} at={839.2} text="¿ALGO RARO EN TU PUERTA?" size={58} x={660} y={460} out={843.0} col="#ffd60a" edge="#5a4500" />);
  }
  if (at(836.79, 849.22)) {
    if (t >= 843.14) L.push(<Avatar key="a843" t={t} />);
    L.push(<Comentarios key="cmt" t={t} out={849.0} x={t >= 843.14 ? 1180 : 1120} items={[{ at: 841.4, who: "marta_62", tx: "¡Un papel doblado! 😱" }, { at: 842.4, who: "jorge.r", tx: "Una cinta en la cerradura" }, { at: 843.2, who: "nelly.b", tx: "Una marca en el buzón…" }]} />);
    if (t >= 843.14) L.push(<BigNum key="lt" t={t} at={844.6} text="LOS LEO TODOS ❤️" size={64} x={620} y={180} out={849.0} col="#fff3d6" edge="#3a1a00" />);
  }
  if (at(849.22, 855.8)) {
    L.push(<Shot key="per" k="c_perro" t={t} a={849.22} z={[1.03, 1.12]} ox={-30} dur={7} />);
    L.push(<Tag key="sa" t={t} at={852.6} x={900} y={500} dx={-300} dy={-220} text="SE QUEDÓ AFUERA…" sub="…CON EL PERRO ADENTRO 🐶" col={COL.amber} out={855.6} size={52} />);
  }
  if (t >= 855.8) {
    L.push(<AbsoluteFill key="w855" style={circ(ir(t, 855.8))}>{W(t, { marks: mk({}, [...MARKS]) })}</AbsoluteFill>);
    L.push(<BigNum key="ct" t={t} at={857.0} text="CIERRA CON TRABA ESTA NOCHE" size={74} y={180} out={1e9} col="#ffd60a" edge="#5a4500" />);
    const dk = e(t, 858.5, 859.4);
    if (dk > 0) L.push(<AbsoluteFill key="bk855" style={{ background: "#000", opacity: dk }} />);
  }
  void Portal;
  return <AbsoluteFill style={{ background: "#05070c" }}>{L}</AbsoluteFill>;
};
