// valniveamix · "Mujeres mayores: no usen la crema NIVEA sola, mézclenla con esto" — el video ENTERO en un solo hilo (vara gary01):
// avatar de la Dra. Valeria (reel pagado, ventanas de avwin.json) ↔ fuera del avatar una base por frase: toma real (LTX / agnes)
// o el MUNDO 3D (el tocador, el corte de piel, el vaso, las cadenas de la sábila) con una sola cámara. Cero cortes secos:
// cada cambio de base es una transición; el avatar entra con latigazo y sale abriendo un portal. Las piezas con la marca del
// canal viven en una capa aparte, clavadas al segundo de la frase. Audio fuera de Remotion. Render SÓLO en el farm.
// Sin marca en pantalla: "la crema de la lata azul"; nunca se critica la marca ni se promete milagro.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, camSpeed, screenOf, pageAt } from "./piel3d";
import { EV, PTS, visits, ws, Visit } from "./cam";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import CLIPS from "./clips.json";
import { P, Portal, e, ei, s } from "./lib";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { K, Arrows, BigNum, Chapter, CheckList, Chips, Desc, LowerThird, Mistake, MistakesDeal, NextCard, Note, NumList, QCard, Recipe, Stamp, Tag, Timer, Versus, Words } from "./kit";

export const TEND = 900.2;
export const FULL_FRAMES = Math.ceil(TEND * 30);
export const MIN1_END = 114.2;
const REEL = (AVAIL as { reel: boolean }).reel;
type Win = { ms: number; me: number; off: number };
export const WIN: Win[] = (AVW as { win: Win[] }).win;
const CL = CLIPS as Record<string, number>;
export const inAvatar = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);

// ---------- toma real: el mp4 si llegó (con cámara lenta si hace falta), si no la foto ----------
const Clip: React.FC<{ k: string; at: number; t: number; z?: [number, number]; dur?: number }> = ({ k, at, t, z = [1.03, 1.1], dur = 0 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, at, at + 8);
  const len = CL[k] ?? 0, rate = len && dur > len - 0.15 ? Math.max(0.35, (len - 0.15) / dur) : 1;
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return <AbsoluteFill style={{ background: K.paperDeep }}><CamaraMano seed={3}><AbsoluteFill style={{ transform: `scale(${sc})` }}>
    {len ? <Sequence from={s(at)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted playbackRate={rate} style={st} /></Sequence> : <Img src={staticFile(P + k + ".jpg")} style={st} />}
  </AbsoluteFill></CamaraMano></AbsoluteFill>;
};
// el avatar: SIN desenfoque ni halo (borde nítido)
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.5 && t < w.me + 0.8);
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 15)} durationInFrames={s(w.me - w.ms) + 15 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 15)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: K.paperDeep }}><CamaraMano seed={7}>{face}</CamaraMano></AbsoluteFill>;
};
// el mundo con desenfoque de movimiento según la velocidad de la cámara
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) }, id = "mb" + Math.round(t * 30);
  return <AbsoluteFill>
    <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
    <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- transiciones entre bases ----------
type Tr = "whip" | "whipL" | "portal" | "zoom" | "flip" | "push" | "light" | "cut";
const DUR: Record<Tr, number> = { whip: 0.5, whipL: 0.5, portal: 0.6, zoom: 0.55, flip: 0.6, push: 0.55, light: 0.5, cut: 0 };
const HB: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={`${x} ${y}`} /></filter></svg>;
const transition = (tr: Tr, k: number, prev: React.ReactNode, cur: React.ReactNode, p: [number, number]) => {
  const L: React.ReactNode[] = [];
  if (tr === "whip" || tr === "whipL") {
    const out = k < 0.5, k2 = out ? k * 2 : (1 - k) * 2, b = Math.round(90 * k2), d = tr === "whip" ? -1 : 1, id = `wb${b}`;
    L.push(<AbsoluteFill key="w" style={{ transform: `translateX(${(out ? d : -d) * k2 * 300}px) scale(${1 + k2 * 0.32})`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={0} /> : null}{out ? prev : cur}</AbsoluteFill>);
    if (k2 > 0.4) L.push(<AbsoluteFill key="wl" style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,240,215,.55) 50%, transparent 80%)", opacity: (k2 - 0.4) / 0.6, mixBlendMode: "screen" }} />);
  } else if (tr === "portal") {
    L.push(<AbsoluteFill key="pp">{prev}</AbsoluteFill>);
    L.push(<Portal key="pc" x={p[0]} y={p[1]} r={ei(k, 0, 1) * 0.999 + 0.001}>{cur}</Portal>);
  } else if (tr === "zoom") {
    const z = ei(k, 0, 1), b = Math.round(22 * Math.sin(Math.PI * k)), id = `zb${b}`;
    L.push(<AbsoluteFill key="zc" style={{ transform: `scale(${1.35 - 0.35 * z})` }}>{cur}</AbsoluteFill>);
    L.push(<AbsoluteFill key="zp" style={{ transformOrigin: `${p[0]}px ${p[1]}px`, transform: `scale(${1 + 3.2 * z})`, opacity: 1 - e(k, 0.35, 0.9), filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={b} /> : null}{prev}</AbsoluteFill>);
  } else if (tr === "flip") {
    const out = k < 0.5, a = out ? ei(k * 2, 0, 1) * 90 : (1 - ei((k - 0.5) * 2, 0, 1)) * -90;
    L.push(<AbsoluteFill key="fb" style={{ background: `radial-gradient(ellipse at 50% 50%, ${K.card}, ${K.paperDeep})` }} />);
    L.push(<AbsoluteFill key="ff" style={{ perspective: 2200 }}><AbsoluteFill style={{ transform: `translateZ(${-Math.sin(Math.PI * k) * 500}px) rotateY(${a}deg)`, borderRadius: 30 * Math.sin(Math.PI * k), overflow: "hidden", boxShadow: "0 60px 120px rgba(51,37,26,.45)" }}>{out ? prev : cur}</AbsoluteFill></AbsoluteFill>);
  } else if (tr === "push") {
    const z = ei(k, 0, 1), b = Math.round(60 * Math.sin(Math.PI * k)), id = `pb${b}`;
    L.push(<AbsoluteFill key="up" style={{ transform: `translateY(${-z * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={0} y={b} /> : null}{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="uc" style={{ transform: `translateY(${(1 - z) * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{cur}</AbsoluteFill>);
  } else if (tr === "light") {
    L.push(<AbsoluteFill key="lp">{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="lc" style={{ opacity: e(k, 0.25, 0.75) }}>{cur}</AbsoluteFill>);
    const g = Math.sin(Math.PI * k);
    L.push(<AbsoluteFill key="ll" style={{ background: `radial-gradient(ellipse 80% 70% at ${30 + 40 * k}% 45%, rgba(255,244,222,${0.95 * g}), rgba(240,200,140,${0.35 * g}) 50%, transparent 80%)`, mixBlendMode: "screen" }} />);
  } else L.push(<AbsoluteFill key="c">{cur}</AbsoluteFill>);
  return L;
};

// ---------- LA LÍNEA DE BASES (fuera del avatar). W = mundo (pose A → pose B); C = toma ----------
type B = { a: number; k: string; tr: Tr; p?: [number, number]; z?: [number, number]; A?: string; B?: string };
const W = (a: number, A: string, Bp: string, tr: Tr = "whip"): B => ({ a, k: "w", tr, A, B: Bp });
const C = (a: number, k: string, tr: Tr = "whip", p?: [number, number], z?: [number, number]): B => ({ a, k, tr, p, z });
const ZC: [number, number] = [960, 540];
const RAW: B[] = [
  // el gancho: la mitad de lo que la crema le puede dar → la lata y el gel → la farmacia → la maceta
  C(4.1, "l_dorso", "cut"), W(10.2, "pair", "pair2", "portal"), C(13.6, "b_farmacia", "push"), C(16.1, "b_maceta", "zoom", ZC),
  C(23.4, "l_absorbe1"), C(26.4, "b_reloj", "light"), C(30.6, "l_lata", "whipL"),
  C(38.5, "b_brillo"), C(43.0, "b_mejilla", "push"), C(47.1, "b_papelseda", "zoom", ZC),
  C(53.7, "b_mesitas"), W(56.6, "wide", "wide2", "light"), C(63.0, "v_consult", "flip"),
  C(70.6, "b_mesita"), W(73.2, "bowl", "bowl2", "zoom"), C(76.4, "l_brillo2", "push"), W(79.5, "wide2", "wide", "whipL"),
  W(87.4, "book", "bookTop", "cut"), C(90.3, "v_recetario", "flip"), W(94.0, "bookTop", "bookPg", "portal"),
  W(102.1, "bookPg", "bookTop", "cut"), W(105.8, "wide2", "wide"),
  // la prueba del pellizco
  C(119.4, "v_pellizco"), C(123.4, "l_pellizco", "zoom", ZC),
  C(134.4, "l_brillo1"), C(136.8, "b_suelta", "push"), C(139.6, "b_carpa", "zoom", ZC), W(143.4, "sk", "skTop", "light"),
  W(152.6, "wide", "pair"), C(157.0, "b_consultorio", "light"), C(159.6, "v_rosario", "flip"),
  // Doña Rosario
  C(169.1, "r_cartera"), C(172.6, "r_escritorio", "push"), C(177.3, "b_foto20", "flip"),
  C(186.0, "b_brillosa"), W(188.2, "tin", "tin2", "zoom"), C(195.3, "b_nuez", "push"),
  C(201.4, "r_tirar"), W(205.0, "skTop", "skTop2", "light"),
  // la historia: Alemania, 1911
  C(216.2, "h_1911"), C(222.2, "h_aguaaceite", "push"), W(225.2, "vaso", "vaso2", "zoom"),
  C(232.5, "h_oveja"), C(234.2, "h_nieve", "light"), C(237.4, "h_latavieja", "flip"), W(242.2, "tin2", "tinTop", "zoom"),
  C(248.6, "b_frio"), W(251.2, "vaso", "vaso2", "whipL"), W(256.6, "vaso2", "vasoIn"),
  W(262.5, "vaso2", "vasoIn", "cut"), C(270.0, "b_tapa", "push"), W(272.9, "sk", "skTop", "zoom"),
  W(279.7, "sk", "skDerm", "cut"), W(283.8, "skDerm", "skFat"), C(286.6, "b_esponja", "push"),
  C(295.7, "b_tierraseca"), W(297.8, "skTop", "sk", "light"),
  W(311.7, "tin", "tinTop", "cut"), W(317.1, "sk2", "skTop"),
  // la sábila
  W(328.6, "pair", "bowl", "cut"), C(336.0, "b_penca", "push"),
  C(344.1, "b_maceta2"), C(346.6, "l_sabila", "zoom", ZC), W(353.6, "cad", "cad2", "light"),
  W(360.3, "cad2", "cad", "cut"), C(364.4, "b_quemada", "push"), C(370.8, "l_gel", "zoom", ZC),
  W(375.8, "skTop", "skTop2", "cut"), W(382.9, "sk2", "skTop"),
  // la receta
  C(391.4, "v_mezcla"), C(396.6, "l_textura", "zoom", ZC), C(398.6, "b_reparte", "push"), W(403.2, "wide", "pair", "light"),
  W(412.1, "tin2", "pair2", "cut"), W(417.6, "bowl", "bowl2"), C(421.7, "l_mezcla", "zoom", ZC),
  W(429.4, "bowlTop", "bowl2", "cut"), C(437.1, "b_nata", "push"),
  C(445.3, "b_gotitas"), W(448.6, "bowl", "bowlTop", "zoom"), C(452.9, "b_manos2", "push"),
  W(462.4, "bowl2", "jar", "cut"), C(466.6, "l_frasco", "zoom", ZC), C(469.6, "b_fecha", "push"),
  // qué sábila
  W(477.6, "aloe", "aloe2", "cut"), C(485.6, "b_verde", "push"), C(487.8, "b_transparente", "zoom", ZC),
  C(496.0, "v_sabila"), C(497.6, "b_escurre", "push"), C(500.8, "b_filete", "zoom", ZC), W(503.8, "wide", "wide2", "light"),
  // el minuto justo
  C(514.0, "b_lavar"), C(514.9, "b_toalla", "push"), C(517.6, "l_humeda", "zoom", ZC), W(522.1, "skTop", "sk", "light"),
  W(528.5, "skTop", "sk", "cut"), C(530.0, "l_toques", "zoom", ZC), W(536.4, "wide", "wide2", "light"),
  W(545.5, "skTop2", "skTop", "cut"), C(547.7, "b_mojarse", "push"), W(551.6, "bowl", "bowl2", "zoom"), C(555.0, "b_cucharon", "push"),
  C(563.0, "b_garbanzo"), C(567.4, "b_almohada", "light"),
  C(577.8, "b_ojo"), C(587.3, "b_hueso", "push"),
  W(595.0, "wide2", "wide", "cut"), C(601.8, "l_antebrazo", "zoom", ZC),
  // los 5 lugares
  C(611.7, "b_antebrazo_ok"), W(614.4, "wide", "wide2", "light"), C(621.9, "l_cuello", "zoom", ZC),
  C(627.6, "b_cuello2"), C(633.2, "l_absorbe2", "push"), W(635.4, "book", "bookPg", "zoom"),
  C(643.3, "l_guantes"), C(646.4, "b_dormir", "light"), C(649.9, "b_pellizco2", "push"),
  C(656.4, "l_talones"), C(660.6, "b_codo", "push"), C(665.2, "b_brazo", "zoom", ZC), C(668.6, "b_azucar", "push"),
  // las 4 preguntas (+1 de regalo)
  W(675.9, "bowl", "bowl2", "cut"), W(677.4, "wide", "wide2"), C(685.4, "b_protector", "push"),
  W(693.8, "wide2", "wide", "cut"),
  C(707.9, "b_mitad"), C(712.8, "b_cuerpo", "push"), C(716.6, "b_pote", "flip"),
  W(724.8, "tin", "tin2", "cut"), W(727.6, "bowl", "bowl2"), C(733.6, "b_noche", "light"),
  C(741.9, "b_pegajosa"), W(746.8, "bowl2", "bowlTop", "zoom"), C(752.6, "b_vite", "push"),
  C(761.1, "b_capsula"), W(766.0, "bowl", "bowl2", "zoom"),
  // con honestidad
  C(776.5, "b_despertar"), C(781.2, "b_lineas", "push"), W(785.4, "skTop", "skTop2", "zoom"),
  C(792.1, "b_manchas"), W(796.1, "wide", "wide2", "light"), C(800.3, "b_protector2", "push"),
  W(811.5, "tin", "tinTop", "cut"), W(815.4, "aloe", "aloe2"), C(819.6, "b_cafe", "push"),
  C(827.2, "b_lujo"),
  // la tarea, los comentarios, el recetario, el próximo video
  C(840.8, "b_tarea"), W(843.2, "bowl", "bowl2", "zoom"), C(846.2, "l_pellizco2", "push"), W(851.3, "wide2", "wide", "light"),
  C(857.1, "b_abuela"), W(861.4, "book", "bookTop", "zoom"),
  W(872.2, "bookTop", "bookPg", "cut"), W(875.3, "wide", "wide2"), C(881.4, "b_almohada3", "push"),
  C(888.5, "r_final"), W(891.8, "pair", "wide", "light"),
];
const BEATS: B[] = [...RAW].sort((x, y) => x.a - y.a).map((b) => (WIN.some((w) => Math.abs(w.me - b.a) < 0.3) ? { ...b, tr: "cut" as Tr } : b));
// hasta cuándo se ve cada base (la próxima base o la entrada del avatar)
const until = (i: number) => { const a = BEATS[i].a, nx = BEATS[i + 1]?.a ?? TEND, w = WIN.find((x) => x.ms > a + 0.2); return Math.min(nx, w ? w.ms : nx); };
const visible = (i: number) => Math.max(0.5, until(i) - BEATS[i].a);
// la cámara del mundo: una visita por cada base de mundo
const VIS: Visit[] = BEATS.map((b, i) => (b.k === "w" ? { a: b.a, b: until(i), A: b.A!, B: b.B! } : null)).filter((v): v is Visit => !!v);
visits(VIS);
const view = (i: number, t: number) => { const b = BEATS[i]; return b.k === "w" ? <World t={t} /> : <Clip k={b.k} at={b.a} t={t} z={b.z} dur={visible(i)} />; };
const beatAt = (t: number) => { let i = 0; while (i < BEATS.length - 1 && BEATS[i + 1].a <= t) i++; return i; };
const Content: React.FC<{ t: number }> = ({ t }) => {
  if (t < BEATS[0].a) return <World t={t} />;
  const i = beatAt(t), b = BEATS[i], D = DUR[b.tr], k = D > 0 ? (t - b.a) / D : 1;
  if (i > 0 && k < 1 && !(b.k === "w" && BEATS[i - 1].k === "w")) return <>{transition(b.tr, k, view(i - 1, t), view(i, t), b.p ?? [960, 540])}</>;
  return view(i, t);
};
const TR = 0.4;
const Hilo: React.FC<{ t: number }> = ({ t }) => {
  const w = WIN.find((x) => t >= x.ms - TR && t < x.me + 0.02);
  if (!w) return <Content t={t} />;
  if (t < w.ms) {
    const k = ei(t, w.ms - TR, w.ms), mb = Math.sin(k * Math.PI) * 40;
    return <>
      <AbsoluteFill style={{ transform: `translateX(${-k * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Content t={t} /></AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${(1 - k) * 1920}px)` }}><Avatar t={t} /></AbsoluteFill>
    </>;
  }
  const r = ei(t, w.me - TR, w.me);
  return <><Avatar t={t} />{r > 0 && <Portal x={1250} y={470} r={r}><Content t={t} /></Portal>}</>;
};

// ---------- LA CAPA DE PIEZAS ----------
const G = K.gold, T = K.terracotta, S = K.sage, AQ = K.water;
const pieces = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const g = (a: number, b: number) => t > a - 0.5 && t < b + 0.8;
  const av = inAvatar(t);
  // 0:00-1:55 · el gancho, el porqué, la doctora, el recetario
  if (g(0, 70)) L.push(
    <Words key="w0" t={t} items={[{ at: 1.0, txt: "LA CREMA SOLA" }, { at: 2.3, txt: "NO ALCANZA", col: T }]} out={4.0} y={900} />,
    <Tag key="pl" t={t} at={5.2} x={960} y={560} dx={260} dy={-200} text="LA PIEL SE QUEDA ARRIBA" sub="UNOS SEGUNDOS…" out={9.6} />,
    <Chips key="gs" t={t} items={[{ at: 10.8, tx: "LA CREMA DE LA LATA AZUL", col: K.ink }, { at: 12.0, tx: "+ UNA CUCHARADITA DE GEL", col: S }]} out={13.8} />,
    <Words key="w1" t={t} items={[{ at: 16.6, txt: "TODO SE QUEDA" }, { at: 17.4, txt: "ADENTRO", col: AQ }]} out={18.3} y={180} />,
    <Timer key="t5" t={t} at={23.6} out={27.0} secs={3} label="Y SE ABSORBE" />,
    <Note key="la" t={t} at={30.8} out={34.3} txt="abra la lata azul…" x={1350} y={230} />,
    <Stamp key="br" t={t} at={39.2} out={43.4} text="BRILLOSA" x={1350} y={250} rot={-6} />,
    <Chips key="mj" t={t} items={[{ at: 44.0, tx: "PEGAJOSA", col: T }, { at: 45.0, tx: "Y POR DENTRO, SECA", col: T }]} out={47.1} />,
    <Words key="ps" t={t} items={[{ at: 47.6, txt: "PIEL DE" }, { at: 48.1, txt: "PAPEL DE SEDA", col: T }]} out={48.6} y={180} />,
    <Words key="nc" t={t} items={[{ at: 57.0, txt: "NO ES CULPA SUYA" }]} out={59.0} y={180} size={84} />,
    <Words key="nc2" t={t} items={[{ at: 59.2, txt: "NI DE LA CREMA" }, { at: 60.6, txt: "ES LA FORMA DE USARLA", col: G }]} out={62.8} y={900} size={70} />,
    <LowerThird key="lt" t={t} at={63.4} out={66.3} name="Dra. Valeria Alcázar" l2="MEDICINA ESTÉTICA" l2at={63.9} />,
  );
  if (g(70, 120)) L.push(
    <Chips key="ce" t={t} items={[{ at: 73.6, tx: "CANTIDADES EXACTAS", col: K.ink }, { at: 74.8, tx: "EL MINUTO JUSTO", col: G }]} out={76.2} />,
    <Tag key="b2" t={t} at={77.0} x={960} y={520} dx={-260} dy={-190} text="SIN BRILLO" sub="SIN PEGOTE" col={S} out={79.6} />,
    <MistakesDeal key="md0" t={t} at={80.1} out={82.3} items={["CREMA SOBRE PIEL SECA", "DEMASIADA CANTIDAD", "EL CONTORNO DE OJOS"]} />,
    <Words key="ul" t={t} items={[{ at: 92.5, txt: "TODO EN" }, { at: 93.0, txt: "UN SOLO LIBRO", col: G }]} out={95.2} y={180} />,
  );
  // el recetario en el tocador
  if (t > 94.3 && t < 114.2 && !av) {
    const pg = screenOf(t, pageAt(0.75, 0.4));
    L.push(
      <Tag key="rc" t={t} at={96.7} x={pg.x} y={pg.y} dx={120} dy={-200} text="EL RECETARIO DE LA DOCTORA" sub="67 RECETAS CASERAS" col={G} out={98.0} size={46} />,
      <Tag key="85" t={t} at={102.3} x={pg.x} y={pg.y} dx={140} dy={-190} text="PÁG. 43 · LA CAPA DE AGUA" sub="Y LA 85: NOCHE PARA LAS MANOS" out={105.7} size={46} />,
    );
  }
  if (g(106, 114.2)) L.push(<Desc key="d1" t={t} at={106.2} out={114.0} l2="🥄 La mezcla de hoy: 2 de crema + 1 de gel" l2at={108.9} />);
  // la prueba del pellizco
  if (g(119, 152.6)) L.push(
    <Timer key="pz" t={t} at={119.6} out={122.6} secs={2.5} label="PELLIZCO" />,
    <Tag key="pe" t={t} at={123.4} x={960} y={540} dx={260} dy={-200} text="¿TARDA EN VOLVER?" sub="LE FALTA AGUA" col={T} out={129.6} />,
    <Words key="bp" t={t} items={[{ at: 134.8, txt: "BRILLO" }, { at: 135.6, txt: "PERO NO HIDRATA", col: T }]} out={136.3} y={180} />,
    <Tag key="sl" t={t} at={137.0} x={960} y={520} dx={-260} dy={-200} text="LA PIEL SUELTA" sub="COMO PAPEL" out={139.9} />,
    <Tag key="pa" t={t} at={144.6} x={screenOf(t, [10, 0.95, 0.41]).x} y={screenOf(t, [10, 0.95, 0.41]).y} dx={-200} dy={-220} text="POCA AGUA" sub="Y MÁS FINA" col={AQ} out={146.6} />,
  );
  if (g(152.6, 169.1)) L.push(
    <Words key="af" t={t} items={[{ at: 153.0, txt: "AL FINAL DEL VIDEO" }, { at: 154.4, txt: "EL TRUCO DE LA PÁG. 85", col: G }]} out={157.3} y={180} size={70} />,
    <BigNum key="71" t={t} at={158.4} text="71 AÑOS" sub="DOÑA ROSARIO" out={163.0} />,
  );
  if (g(169.1, 211.6)) L.push(
    <Note key="ca" t={t} at={169.6} out={172.8} txt="la lata siempre en la cartera" x={1300} y={220} />,
    <Words key="d20" t={t} items={[{ at: 178.4, txt: "DESDE LOS" }, { at: 179.0, txt: "20 AÑOS", col: G }]} out={179.8} y={180} />,
    <Tag key="bs" t={t} at={186.3} x={960} y={500} dx={260} dy={-190} text="CARA BRILLOSA" sub="Y LAS MANOS ÁSPERAS" col={T} out={188.0} />,
    <Tag key="nz" t={t} at={196.3} x={960} y={560} dx={-260} dy={-200} text="UNA NUEZ DE CREMA" sub="CADA NOCHE" out={197.0} />,
    <Tag key="cg" t={t} at={206.8} x={screenOf(t, PTS.tapa).x} y={screenOf(t, PTS.tapa).y} dx={-160} dy={-210} text="CAPA GRUESA" sub="SOBRE PIEL SECA" col={T} out={209.2} />,
    <Words key="at" t={t} items={[{ at: 209.6, txt: "AHÍ ESTABA" }, { at: 210.3, txt: "TODO", col: G }]} out={211.3} y={900} />,
  );
  // la historia
  if (g(216.2, 262.5)) L.push(
    <BigNum key="1911" t={t} at={216.6} text="1911" sub="ALEMANIA" out={222.9} />,
    <Words key="as" t={t} items={[{ at: 225.6, txt: "AGUA + ACEITE" }, { at: 226.2, txt: "SIN SEPARARSE", col: G }]} out={226.6} y={180} />,
    <Tag key="ov" t={t} at={232.9} x={960} y={540} dx={260} dy={-200} text="DE LA LANA DE OVEJA" sub="UN ESPESANTE" out={233.8} />,
    <Words key="bn" t={t} items={[{ at: 234.4, txt: "BLANCA COMO" }, { at: 235.2, txt: "LA NIEVE", col: AQ }]} out={237.0} y={900} />,
    <Note key="mb" t={t} at={242.8} out={243.5} txt="¡muy buena!" x={1380} y={250} col={S} />,
    <Chips key="fv" t={t} items={[{ at: 248.9, tx: "FRÍO", col: AQ }, { at: 249.5, tx: "VIENTO", col: K.ink }, { at: 250.1, tx: "MANOS QUE LAVAN", col: K.ink }]} out={251.0} />,
    <Chips key="ag" t={t} items={[{ at: 251.8, tx: "AGUA", col: AQ }, { at: 252.6, tx: "GLICERINA", col: K.ink }, { at: 253.4, tx: "PANTENOL", col: K.ink }]} out={255.6} y={180} />,
    <Words key="ac" t={t} items={[{ at: 256.4, txt: "POR FUERA:" }, { at: 257.2, txt: "ACEITES Y CERAS", col: G }]} out={258.9} y={900} />,
  );
  if (g(262.5, 279.7)) L.push(
    <Words key="ae" t={t} items={[{ at: 264.0, txt: "AGUA" }, { at: 264.6, txt: "EN ACEITE", col: G }]} out={266.0} y={180} />,
    <Tag key="gt" t={t} at={266.5} x={screenOf(t, [13, 0.92, -0.2]).x} y={screenOf(t, [13, 0.92, -0.2]).y} dx={240} dy={-190} text="GOTITAS DE AGUA" sub="ESCONDIDAS" col={AQ} out={268.6} />,
    <Words key="gm" t={t} items={[{ at: 269.0, txt: "LA GRASA" }, { at: 269.5, txt: "MANDA", col: G }]} out={269.9} y={900} />,
    <Tag key="nt" t={t} at={273.4} x={screenOf(t, PTS.tapa).x} y={screenOf(t, PTS.tapa).y} dx={-200} dy={-200} text="FUNCIONA COMO UNA TAPA" sub="EL AGUA NO SE ESCAPA" col={S} out={275.6} />,
  );
  if (g(279.7, 311.7)) L.push(
    <BigNum key="67" t={t} at={280.0} text="60 · 70" sub="LA PIEL YA NO FABRICA LO MISMO" x={1420} y={260} size={150} out={284.2} />,
    <Tag key="mg" t={t} at={284.8} x={screenOf(t, PTS.fat).x} y={screenOf(t, PTS.fat).y} dx={-260} dy={-170} text="MENOS GRASA PROPIA" col={T} out={287.1} />,
    <Words key="es" t={t} items={[{ at: 287.6, txt: "MENOS" }, { at: 288.3, txt: "ESPONJITAS DE AGUA", col: AQ }]} out={290.1} y={180} />,
    <Words key="ts" t={t} items={[{ at: 295.9, txt: "COMO" }, { at: 296.4, txt: "TIERRA SECA", col: T }]} out={298.4} y={900} />,
    <CheckList key="ro" t={t} title="LO QUE HACÍA ROSARIO" x={1250} y={170} rows={[{ at: 300.4, txt: "UNA TAPA GRUESA" }, { at: 304.9, txt: "SIN AGUA PARA GUARDAR", x: true }]} out={306.6} />,
    <Words key="tc" t={t} items={[{ at: 312.0, txt: "TANTA CANTIDAD" }, { at: 313.4, txt: "→ BRILLOSA", col: T }]} out={317.2} y={180} />,
    <Words key="dc" t={t} items={[{ at: 317.8, txt: "DOS COSAS:" }, { at: 319.9, txt: "AGUA", col: AQ }, { at: 321.4, txt: "Y TAPA", col: G }]} out={324.4} y={900} />,
  );
  // la sábila
  if (g(328.6, 391.4)) L.push(
    <Tag key="gs2" t={t} at={330.4} x={screenOf(t, PTS.bowl).x} y={screenOf(t, PTS.bowl).y} dx={240} dy={-200} text="GEL DE SÁBILA" sub="UNA CUCHARADITA" col={S} out={335.8} />,
    <Chips key="sb" t={t} items={[{ at: 336.4, tx: "SÁBILA", col: S }, { at: 337.0, tx: "ALOE VERA", col: S }, { at: 337.6, tx: "LA PENCA", col: K.ink }]} out={338.7} />,
    <BigNum key="99" t={t} at={347.2} text="99 % AGUA" sub="EL GEL DE ADENTRO" x={1380} y={260} size={150} col={AQ} out={352.8} />,
    <Tag key="cz" t={t} at={355.2} x={screenOf(t, PTS.cadenas).x} y={screenOf(t, PTS.cadenas).y} dx={260} dy={-220} text="CADENAS DE AZÚCARES" sub="QUE ATRAPAN AGUA" col={S} out={356.3} />,
    <Words key="se" t={t} items={[{ at: 360.6, txt: "LA SUELTAN" }, { at: 361.5, txt: "DE A POCO", col: AQ }]} out={363.6} y={900} />,
    <Note key="eo" t={t} at={363.8} out={366.0} txt="estudios sugieren…" x={1380} y={230} />,
    <Tag key="qm" t={t} at={366.6} x={960} y={540} dx={-260} dy={-200} text="SE USA HACE SIGLOS" sub="EN QUEMADURAS LEVES" out={371.2} />,
    <Stamp key="ev" t={t} at={377.2} out={379.6} text="SE EVAPORA" x={1350} y={230} col={AQ} />,
    <Stamp key="cs" t={t} at={380.2} out={383.3} text="TAPA LA SEQUEDAD" x={1300} y={230} />,
    <Words key="ju" t={t} items={[{ at: 383.8, txt: "JUNTAS:" }, { at: 384.9, txt: "EL GEL PONE EL AGUA", col: AQ }, { at: 385.8, txt: "LA CREMA LA TAPA", col: G }]} out={386.8} y={900} size={58} />,
  );
  // la receta
  if (g(391.4, 477.6)) L.push(
    <Words key="mu" t={t} items={[{ at: 396.5, txt: "COMO UNA" }, { at: 397.0, txt: "MOUSSE", col: G }]} out={397.7} y={180} />,
    <Tag key="mc" t={t} at={398.3} x={960} y={540} dx={260} dy={-200} text="SE REPARTE SOLA" sub="LA MITAD DE CANTIDAD" col={S} out={402.9} />,
    <Chapter key="ch1" t={t} at={403.5} out={405.9} kicker="PASO A PASO" name="La receta" />,
    <Recipe key="rp" t={t} at={406.4} out={423.6} x={av ? 1430 : 1380} rows={[{ at: 406.8, txt: "1 cucharadita de crema, al ras" }, { at: 411.8, txt: "½ cucharadita de gel" }, { at: 414.3, txt: "un cuenquito limpio" }, { at: 418.3, txt: "crema → gel → mezclar 1 min" }]} />,
    <Timer key="1m" t={t} at={422.0} out={439.1} secs={60} label="MEZCLE EN CÍRCULOS" show={(x) => `0:${String(Math.ceil(x)).padStart(2, "0")}`} />,
    <Tag key="gr" t={t} at={429.8} x={screenOf(t, PTS.bowl).x} y={screenOf(t, PTS.bowl).y} dx={-260} dy={-200} text="PRIMERO GRUMITOS" sub="SIGA MEZCLANDO" out={436.9} />,
    <Words key="nb" t={t} items={[{ at: 437.6, txt: "COMO" }, { at: 438.0, txt: "NATA BATIDA", col: G }]} out={439.2} y={900} />,
    <Stamp key="dg" t={t} at={445.6} out={448.3} text="DEMASIADO GEL" x={1350} y={240} />,
    <BigNum key="21" t={t} at={449.0} text="2 : 1" sub="2 DE CREMA · 1 DE GEL" x={1420} y={270} size={170} out={453.5} />,
    <Chips key="cc" t={t} items={[{ at: 454.2, tx: "CARA", col: K.ink }, { at: 454.8, tx: "CUELLO", col: K.ink }, { at: 455.4, tx: "DORSO DE LAS MANOS", col: K.ink }]} out={456.8} />,
    <Words key="un" t={t} items={[{ at: 457.0, txt: "ALCANZA PARA" }, { at: 457.6, txt: "UNA NOCHE", col: G }]} out={458.1} y={180} />,
    <Words key="x3" t={t} items={[{ at: 463.0, txt: "¿PARA 3 NOCHES?" }, { at: 464.4, txt: "×3", col: G }]} out={466.8} y={180} />,
    <Note key="fe" t={t} at={469.9} out={472.0} txt="anote la fecha · 3 días en la heladera" x={1250} y={230} size={64} />,
  );
  if (g(477.6, 514)) L.push(
    <CheckList key="ql" t={t} title="LA SÁBILA" x={1250} y={170} rows={[{ at: 478.4, txt: "PURA, DE LA PLANTA" }, { at: 481.2, txt: "O GEL DE FARMACIA 99 %" }, { at: 485.9, txt: "SIN COLOR VERDE", x: true }, { at: 487.9, txt: "TRANSPARENTE" }]} out={491.0} />,
    <Timer key="10" t={t} at={497.8} out={501.0} secs={3} label="10 MIN PARADA" show={() => "10'"} />,
    <Note key="am" t={t} at={498.4} out={501.0} txt="el líquido amarillo irrita" x={700} y={230} col={T} size={64} />,
    <Chapter key="ch2" t={t} at={504.2} out={507.9} kicker="EL SECRETO" name="El minuto justo" />,
  );
  if (g(514, 545.5)) L.push(
    <Stamp key="nc3" t={t} at={514.3} out={515.1} text="NUNCA CALIENTE" x={1350} y={240} col={AQ} />,
    <Tag key="th" t={t} at={518.9} x={960} y={540} dx={260} dy={-200} text="LA PIEL TODAVÍA HÚMEDA" sub="NO SECA DEL TODO" col={AQ} out={522.1} />,
    <Words key="ag2" t={t} items={[{ at: 528.8, txt: "AGUA" }, { at: 529.2, txt: "→ GEL", col: S }, { at: 529.6, txt: "→ TAPA", col: G }]} out={530.1} y={180} />,
    <Arrows key="ar" t={t} at={530.6} out={537.6} x={1500} y={520} label="toquecitos hacia arriba" />,
    <Stamp key="ne" t={t} at={533.0} out={537.6} text="✗ ESTIRAR" x={480} y={260} rot={-8} />,
    <MistakesDeal key="md1" t={t} at={538.2} out={539.2} items={["CREMA SOBRE PIEL SECA", "DEMASIADA CANTIDAD", "EL CONTORNO DE OJOS"]} />,
    <Mistake key="m1" t={t} at={539.6} n={1} txt="LA MEZCLA SOBRE PIEL SECA" out={541.1} />,
  );
  if (g(545.5, 611.7)) L.push(
    <Tag key="ts2" t={t} at={545.8} x={screenOf(t, PTS.skinTop).x} y={screenOf(t, PTS.skinTop).y} dx={-200} dy={-220} text="TAPA SOBRE TIERRA SECA" col={T} out={547.6} />,
    <Mistake key="m2" t={t} at={555.4} n={2} txt="DEMASIADA CANTIDAD" out={557.1} />,
    <BigNum key="gb" t={t} at={563.4} text="UN GARBANZO" sub="PARA TODA LA CARA" x={1400} y={270} size={120} out={569.8} />,
    <Words key="al" t={t} items={[{ at: 570.4, txt: "LO DEMÁS" }, { at: 571.0, txt: "VA A LA ALMOHADA", col: T }]} out={572.4} y={900} />,
    <Mistake key="m3" t={t} at={578.0} n={3} txt="EL CONTORNO DE OJOS" out={581.4} />,
    <Tag key="pf" t={t} at={582.0} x={960} y={500} dx={260} dy={-180} text="LA PIEL MÁS FINA" sub="✗ PESTAÑAS · ✗ PÁRPADO" col={T} out={587.1} />,
    <Tag key="hs" t={t} at={587.7} x={960} y={560} dx={-260} dy={-200} text="SÓLO SOBRE EL HUESO" sub="CON EL ANULAR" col={S} out={590.6} />,
    <Words key="sl2" t={t} items={[{ at: 595.4, txt: "¿ARDE O PICA?" }, { at: 597.0, txt: "SE LAVA CON AGUA · SE SUSPENDE", col: T }]} out={601.6} y={180} size={64} />,
    <Tag key="pp" t={t} at={602.2} x={960} y={540} dx={260} dy={-200} text="PRUEBA EN EL ANTEBRAZO" sub="24 HORAS ANTES" col={S} out={606.3} />,
    <Stamp key="tq" t={t} at={612.0} out={614.8} text="TRANQUILA ✓" x={1350} y={240} col={S} />,
  );
  if (g(611.7, 675.9)) L.push(
    <Chapter key="ch3" t={t} at={615.3} out={618.2} kicker="DÓNDE PONERLA" name="5 lugares" s={0.85} />,
    <NumList key="nl" t={t} out={670.2} rows={[{ at: 618.5, txt: "CARA" }, { at: 621.9, txt: "CUELLO Y ESCOTE" }, { at: 633.2, txt: "DORSO DE LAS MANOS" }, { at: 656.5, txt: "CODOS Y TALONES" }, { at: 665.0, txt: "BRAZOS" }]} />,
    <Arrows key="ar2" t={t} at={627.9} out={633.0} x={1500} y={520} label="siempre hacia arriba" />,
    <Tag key="85b" t={t} at={635.6} x={screenOf(t, pageAt(0.75, 0.4)).x} y={screenOf(t, pageAt(0.75, 0.4)).y} dx={140} dy={-200} text="PÁG. 85 · EL TRUCO" sub="NOCHE PARA LAS MANOS" col={G} out={639.2} />,
    <BigNum key="8h" t={t} at={647.5} text="8 HORAS" sub="CON GUANTES DE ALGODÓN" x={1400} y={260} size={150} out={650.1} />,
    <Tag key="mcg" t={t} at={661.0} x={960} y={540} dx={260} dy={-200} text="MÁS CREMA QUE GEL" sub="EN TALONES Y CODOS" out={665.6} />,
  );
  // las 4 preguntas
  if (g(675.9, 776.5)) L.push(
    <Chapter key="ch4" t={t} at={677.3} out={679.6} kicker="LO QUE ME PREGUNTAN" name="4 preguntas" s={0.85} />,
    <QCard key="q1" t={t} at={680.0} out={687.4} n={1} q="¿Sirve de día?" />,
    <Versus key="vd" t={t} at={694.1} out={698.0} L={{ label: "DE NOCHE", val: "LA MEZCLA", mark: "ok" }} R={{ label: "DE DÍA", val: "PROTECTOR SOLAR", col: G }} />,
    <QCard key="q2" t={t} at={698.4} out={707.7} n={2} q="¿Y si tengo piel grasa?" />,
    <Words key="mm" t={t} items={[{ at: 708.2, txt: "MITAD" }, { at: 708.8, txt: "Y MITAD", col: G }]} out={711.0} y={900} />,
    <Chips key="fn" t={t} items={[{ at: 711.4, tx: "FRENTE ✗", col: T }, { at: 712.0, tx: "NARIZ ✗", col: T }]} out={714.7} y={900} />,
    <QCard key="q3" t={t} at={718.3} out={727.9} n={3} q="¿La de lata o la de pote?" />,
    <Tag key="ep" t={t} at={725.1} x={screenOf(t, PTS.tin).x} y={screenOf(t, PTS.tin).y} dx={260} dy={-200} text="LA MÁS ESPESA" sub="= MEJOR TAPA" col={G} out={728.5} />,
    <QCard key="q4" t={t} at={731.1} out={741.7} n={4} q="¿Y la vitamina E?" />,
    <Tag key="pg" t={t} at={742.2} x={960} y={540} dx={260} dy={-200} text="¿QUEDA PEGAJOSA?" sub="MENOS GEL" col={T} out={748.0} />,
    <BigNum key="hf" t={t} at={748.5} text="½" sub="MEDIA CUCHARADITA" x={1420} y={260} size={190} out={752.5} />,
    <Words key="rg" t={t} items={[{ at: 753.0, txt: "+1 DE REGALO" }]} out={754.6} y={180} />,
    <Chips key="vt" t={t} items={[{ at: 761.4, tx: "2-3 GOTAS", col: K.ink }, { at: 762.6, tx: "ANTIOXIDANTE", col: S }]} out={766.2} />,
    <Words key="ig" t={t} items={[{ at: 766.8, txt: "FUNCIONA IGUAL" }, { at: 767.6, txt: "CON 2", col: G }]} out={770.8} y={180} />,
    <Chapter key="ch5" t={t} at={771.4} out={773.0} kicker="SIN PROMESAS" name="Con honestidad" s={0.85} />,
  );
  if (g(776.5, 840.8)) L.push(
    <Words key="n1" t={t} items={[{ at: 776.8, txt: "NOCHE 1:" }, { at: 777.6, txt: "MÁS SUAVE", col: S }]} out={777.9} y={180} />,
    <BigNum key="s23" t={t} at={778.2} text="SEMANA 2-3" sub="LAS RAYITAS DE SEQUEDAD SE SUAVIZAN" x={1400} y={260} size={120} out={781.5} />,
    <CheckList key="hn" t={t} title="LO QUE NO HACE" x={1250} y={170} rows={[{ at: 792.5, txt: "NO BORRA ARRUGAS PROFUNDAS", x: true }, { at: 794.0, txt: "NO QUITA MANCHAS", x: true }]} out={800.0} />,
    <Tag key="ps2" t={t} at={800.6} x={960} y={540} dx={260} dy={-200} text="PARA LAS MANCHAS" sub="PROTECTOR SOLAR, TODOS LOS DÍAS" col={G} out={806.3} />,
    <BigNum key="2m" t={t} at={811.9} text="2 MESES" sub="CON UNA LATA" x={1420} y={260} size={150} out={815.7} />,
    <BigNum key="1u" t={t} at={816.4} text="≈ US$ 1" sub="LA PENCA DE SÁBILA" x={1420} y={260} size={150} col={S} out={820.0} />,
    <Chips key="lj" t={t} items={[{ at: 827.5, tx: "AGUA", col: AQ }, { at: 828.0, tx: "GLICERINA", col: K.ink }, { at: 828.5, tx: "ACEITES", col: G }, { at: 829.0, tx: "CERAS", col: G }, { at: 829.5, tx: "SÁBILA", col: S }]} out={835.8} />,
  );
  if (g(827.2, 836.0)) L.push(<BigNum key="45" t={t} at={831.0} text="US$ 40-50" sub="LAS CREMAS DE LUJO" x={1420} y={260} size={140} col={T} out={835.8} />);
  // la tarea · comentarios · el recetario · próximo video
  if (g(840.8, TEND)) {
    L.push(
      <Words key="tr" t={t} items={[{ at: 841.0, txt: "ESTA NOCHE:" }, { at: 841.8, txt: "1 + ½", col: G }]} out={843.0} y={180} />,
      <Note key="pz2" t={t} at={846.6} out={851.2} txt="haga el pellizco antes y después" x={1250} y={230} size={64} />,
      <Words key="cm" t={t} items={[{ at: 851.7, txt: "CUÉNTEME EN LOS COMENTARIOS 💬" }]} out={852.8} y={900} size={64} />,
      <Words key="lo" t={t} items={[{ at: 857.4, txt: "¿QUÉ LE PONÍA" }, { at: 858.4, txt: "SU ABUELA?", col: G }]} out={860.0} y={180} />,
      <Stamp key="lt2" t={t} at={860.3} out={861.6} text="LEO TODOS" x={1350} y={260} col={S} />,
    );
    if (t > 861.8 && t < 872.2 && !av) {
      const pg = screenOf(t, pageAt(0.5, 0.35));
      L.push(<Tag key="67r" t={t} at={862.3} x={pg.x} y={pg.y} dx={140} dy={-200} text="67 RECETAS" sub="MANCHAS · CUELLO · CONTORNO DE OJOS" col={G} out={868.0} size={52} />);
    }
    L.push(
      <Desc key="d2" t={t} at={872.4} out={875.2} />,
      <NextCard key="nx" t={t} at={875.7} out={881.3} title="El cuello: un mes" sub="y el error de la almohada" />,
      <Note key="fin" t={t} at={894.2} out={TEND - 0.4} txt="lo que cambió fue cómo me la pongo" x={960} y={880} size={72} />,
    );
  }
  return L;
};

export const clipPlan = () => BEATS.map((b, i) => ({ k: b.k, a: +b.a.toFixed(3), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(3), vis: +visible(i).toFixed(3) })).filter((x) => x.k !== "w");
export const beatTable = () => BEATS.map((b, i) => ({ i, a: +b.a.toFixed(2), vis: +visible(i).toFixed(2), tr: b.tr, k: b.k }));

export const Video: React.FC<{ from?: number }> = ({ from = 0 }) => {
  const t = useCurrentFrame() / 30 + from;
  const fade = 1 - e(t, TEND - 0.8, TEND - 0.05);
  return (
    <AbsoluteFill style={{ background: K.paperDeep }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <Hilo t={t} />
        {pieces(t)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export { EV, ws };
