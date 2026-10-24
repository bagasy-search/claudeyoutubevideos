// mecdesemp30 · EL RESTO (fin del minuto 1 → final, ~35 min). Un solo hilo sin cortes secos:
// abajo, tomas reales (cada foto/clip UNA sola vez) con empuje propio y cámara a mano, o el mundo del taller con piezas 2D;
// arriba, el avatar en cada ventana del reel (capa aparte, en Full). Todo anclado a la voz con at("frase"),
// leído EN ORDEN (cursor): cada frase se busca después de la anterior. Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Stamp, WIN, MIN1_END } from "./Min1";
import { at, END } from "./at";
import { BigNum, COL, Flash, FONT, P, Portal, Tag, e, ei, s, spr } from "./lib";
import { Comment, Desc, ErrorCard, Flow, KitTray, Libro, MaxTimer, NextCard, Recap, Rows, StepPlate, Subscribe, VsCard } from "./kit2d";
import { AcBtn, Botonera, Fondo, Jarras, Rocio } from "./rest2d";
import { CamaraMano } from "../kits/camara/CamaraMano";
import AVAIL from "./avail.json";
import EXTRA from "./extra.json";

export const REST_START = MIN1_END;
export const FULL_END = END;
const CLIPS = new Set((AVAIL as { clips?: string[] }).clips ?? []);
const LTX = new Set((AVAIL as { ltx: string[] }).ltx);

// ---------- fondo de las piezas: el mismo mundo 3D del minuto 1 (último encuadre), oscurecido, con la grilla ----------
const Mundo: React.FC<{ t: number; tone: string }> = ({ t, tone }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ transform: `scale(${1.06 + 0.03 * Math.sin(t * 0.13)}) translate(${8 * Math.sin(t * 0.09)}px, ${5 * Math.cos(t * 0.11)}px)` }}><Img src={staticFile(P + "mundo_bg.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    <AbsoluteFill style={{ background: tone, opacity: 0.78 }} />
    <AbsoluteFill style={{ opacity: 0.55 }}><Fondo t={t} /></AbsoluteFill>
  </AbsoluteFill>
);

// toma real: foto con empuje lento; si hay clip de agnes (3 s) corre primero y deja la foto debajo; LTX corre entera
const Toma: React.FC<{ k: string; t: number; a: number; b: number; i: number }> = ({ k, t, a, b, i }) => {
  const q = e(t, a, b + 0.4), dir = i % 4;
  const z0 = dir === 1 ? 1.14 : 1.03, z1 = dir === 1 ? 1.03 : 1.14, ox = [0, 0, -30, 30][dir], oy = [0, 0, -14, 12][dir];
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ transform: `scale(${z0 + (z1 - z0) * q}) translate(${ox * q}px, ${oy * q}px)` }}>
      {LTX.has(k) ? <Sequence from={s(a) - 6} layout="none"><OffthreadVideo src={staticFile(P + "ltx_" + k + ".mp4")} muted style={st} /></Sequence> : <Img src={staticFile(P + "img_" + k + ".jpg")} style={st} />}
      {CLIPS.has(k) && t < a + 2.9 && <Sequence from={s(a) - 6} layout="none"><OffthreadVideo src={staticFile(P + "clip_" + k + ".mp4")} muted style={st} /></Sequence>}
    </AbsoluteFill>
  );
};

type Tr = "swipeL" | "swipeR" | "up" | "down" | "portal" | "iris" | "zoom" | "wipe";
const TRS: Tr[] = ["swipeL", "up", "zoom", "swipeR", "iris", "down", "wipe", "portal"];
type Seg = { a: number; b: number; k: string; tr: Tr; i: number };
const D = 0.36;
const baseOf = (sg: Seg, t: number) =>
  sg.k === "BK" ? <Mundo t={t} tone="#070c14" /> : sg.k === "BKr" ? <Mundo t={t} tone="#1a0909" /> : <CamaraMano seed={sg.i}><Toma k={sg.k} t={t} a={sg.a} b={sg.b} i={sg.i} /></CamaraMano>;

const Trans: React.FC<{ t: number; s: Seg; from: React.ReactNode; to: React.ReactNode }> = ({ t, s: sg, from, to }) => {
  const k = ei(t, sg.a, sg.a + D), tr = sg.tr;
  const L = (n: React.ReactNode, st: React.CSSProperties, key: string) => <AbsoluteFill key={key} style={st}>{n}</AbsoluteFill>;
  if (tr === "swipeL" || tr === "swipeR" || tr === "up" || tr === "down") {
    const dir = tr === "swipeL" || tr === "up" ? 1 : -1, ax = tr === "up" || tr === "down" ? "Y" : "X", DD = ax === "Y" ? 1080 : 1920;
    return <AbsoluteFill>{L(from, { transform: `translate${ax}(${-dir * k * DD}px)` }, "f")}{L(to, { transform: `translate${ax}(${dir * (1 - k) * DD}px)` }, "t")}</AbsoluteFill>;
  }
  if (tr === "portal") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><Portal x={960} y={540} r={k}>{to}</Portal></AbsoluteFill>;
  if (tr === "iris") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `circle(${k * 1150}px at 960px 540px)` }}>{to}</AbsoluteFill><Flash t={t} at={sg.a + 0.02} col="#eaf6ff" peak={0.3} w={0.3} /></AbsoluteFill>;
  if (tr === "wipe") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `inset(${(1 - k) * 100}% 0 0 0)` }}>{to}</AbsoluteFill></AbsoluteFill>;
  return <AbsoluteFill><AbsoluteFill style={{ transform: `scale(${0.94 + 0.06 * k})` }}>{to}</AbsoluteFill><AbsoluteFill style={{ opacity: 1 - k, transform: `scale(${1 + k * 0.35})` }}>{from}</AbsoluteFill></AbsoluteFill>;
};

// el QR a la guía (url corta /g): tarjeta al costado, nunca a pantalla completa, nunca la URL escrita
export const QrCard: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a, out, x = 1500, y = 520 }) => {
  const k = Math.min(1.08, spr(t, a, 0.9)), o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * Math.min(1, k)})` }}>
      <div style={{ transform: `rotateY(${-10 + 4 * Math.sin(t * 0.7)}deg) rotateX(4deg)`, background: "linear-gradient(180deg,#fbf9f3,#e6e1d4)", borderRadius: 26, padding: "26px 26px 22px", boxShadow: "0 50px 90px rgba(0,0,0,.65)", textAlign: "center", fontFamily: FONT }}>
        <Img src={staticFile(P + "qr_g.png")} style={{ width: 360, height: 360, display: "block", imageRendering: "pixelated" }} />
        <div style={{ marginTop: 14, fontWeight: 900, fontSize: 34, color: "#1d2733", letterSpacing: 1 }}>📷 ESCANEA CON LA CÁMARA</div>
        <div style={{ marginTop: 4, fontWeight: 800, fontSize: 26, color: "#8a5a00" }}>EL MANUAL DEL MECÁNICO</div>
      </div>
    </div>
  );
};

type Ov = { a: number; b: number; n: (t: number, a: number, b: number) => React.ReactNode; piece?: boolean };
const GREEN = "#7dff9e", YEL = "#ffd60a", ORG = "#ff9f43", GRAY = "#cfd6dc", ROSE = "#ff9fd0", CREAM = "#ffd08a";

const build = () => {
  const segs: Seg[] = [], ovs: Ov[] = [];
  let cur = REST_START - 0.5;
  const A = (p: string) => (cur = at(p, cur)); // avanza el cursor
  const Q = (p: string) => at(p, cur); // mira adelante sin moverlo
  const IMG = new Set((AVAIL as { img?: string[] }).img ?? []);
  const b = (p: string, k: string) => { const a = A(p); segs.push({ a, b: 0, k: k.startsWith("BK") || LTX.has(k) || IMG.has(k) ? k : "BK", tr: TRS[segs.length % TRS.length], i: segs.length }); };
  const ov = (p: string, d: number, n: Ov["n"]) => { const a = A(p); ovs.push({ a, b: a + d, n }); };
  const pc = (p: string, n: Ov["n"]) => { const a = A(p); ovs.push({ a, b: 0, n, piece: true }); };
  // posiciones que rotan para que nada quede siempre en el mismo lugar
  const POS = [[960, 520, 300, -200], [960, 560, -320, 200], [1000, 420, 300, -170], [900, 600, -300, -180], [1020, 480, 280, 190]];
  let pi = 0;
  const tag = (p: string, text: string, col: string = COL.ink, sub?: string, size = 52, d = 3.6) => { const [x, y, dx, dy] = POS[pi++ % POS.length]; ov(p, d, (t, a, bb) => <Tag t={t} at={a} x={x} y={y} dx={dx} dy={dy} text={text} col={col} out={bb} size={size} sub={sub} />); };
  const BY = [200, 880, 220, 860];
  let bi = 0;
  const big = (p: string, text: string, col: string = COL.ink, edge = "#1c2a3a", sub?: string, size = 92, d = 3.4) => { const y = BY[bi++ % BY.length]; ov(p, d, (t, a, bb) => <BigNum t={t} at={a} text={text} y={y} size={size} col={col} edge={edge} out={bb} sub={sub} />); };
  const stamp = (p: string, text: string, col: string = COL.red, size = 84, d = 2.8) => ov(p, d, (t, a, bb) => <Stamp t={t} at={a} text={text} x={1380} y={860} out={bb} col={col} size={size} rot={-7} />);
  const plate = (p: string, n: string, tx: string, red = false) => pc(p, (t, a, bb) => <StepPlate t={t} at={a + 0.05} out={bb - 0.1} n={n} tx={tx} y={520} c1={red ? ["#ff7a6a", "#c0251a"] : undefined} ink={red ? "#fff" : undefined} />);
  const errc = (p: string, n: number, tx: string) => pc(p, (t, a, bb) => <ErrorCard t={t} at={a} out={bb - 0.1} n={n} of={5} tx={tx} y={300} />);
  const timer = (p: string, label: string, sub: string, col: string, d = 4) => ov(p, d, (t, a, bb) => <MaxTimer t={t} at={a} out={bb} x={420} y={330} label={label} sub={sub} col={col} />);

  // ================= INTRO: lo que dicen en el taller → nada roto → Doña Elena =================
  b("la gente llega al taller", "w_tibio");
  { const t1 = Q("que la calefaccion no funciona"), t2 = Q("que el ventilador esta flojo"), t3 = Q("que algo anda mal");
    pc("diciendo que la calefaccion", (t, a, bb) => <Rows t={t} title="LLEGAN AL TALLER DICIENDO…" x={1380} y={520} out={bb - 0.1} rows={[
      { at: t1, ic: "🔥", tx: "LA CALEFACCIÓN NO ANDA" }, { at: t2, ic: "🌀", tx: "EL VENTILADOR, FLOJO" }, { at: t3, ic: "❓", tx: "ALGO ANDA MAL EN EL AIRE" }]} />); }
  b("casi nunca hay nada roto", "BK");
  stamp("hay nada roto", "NADA ROTO", GREEN, 96);
  big("es la forma de usar tres botones", "3 BOTONES", YEL, "#5a4500");
  b("un buen taller te lo", "r_taller");
  tag("un buen taller te lo", "TE LO EXPLICA GRATIS", GREEN, "EN LA VEREDA");
  tag("un taller malo te cobra", "UNA REVISIÓN DEL CLIMATIZADOR", COL.red, "$$$");
  stamp("que no hacia falta", "NO HACÍA FALTA", COL.red, 80);
  b("por eso vale mas que lo sepas", "BK");
  timer("a las 7 de la manana", "7:00", "TALLER CERRADO", COL.red, 3.5);
  big("dona elena me llamo", "DOÑA ELENA · UN MARTES", CREAM, "#4a2a00");
  big("lo voy a tener que llevar", "“LO VOY A TENER QUE LLEVAR”", COL.ink, "#1c2a3a", undefined, 70);
  b("fui a verla a su casa", "e_casa");
  b("se subio prendio", "e_manos");
  { const t1 = Q("la calefaccion a fondo"), t2 = Q("la recirculacion prendida"), t3 = Q("el aire apagado");
    ov("se subio prendio", 7.5, (t, a, bb) => <Rows t={t} title="LO QUE HIZO ELENA" x={1380} y={500} out={bb} rows={[
      { at: t1, ic: "🔥", tx: "CALEFACCIÓN A FONDO" }, { at: t2, ic: "🔁", tx: "RECIRCULACIÓN PRENDIDA", no: true }, { at: t3, ic: "❄", tx: "AIRE APAGADO", no: true }]} />); }
  tag("y el vidrio se cerro en un minuto", "SE CERRÓ EN 1 MINUTO", COL.ice);
  b("le dije que apretara", "BK");
  big("le dije que apretara un boton", "UN BOTÓN", YEL, "#5a4500", undefined, 130, 2);
  big("uno solo", "UNO SOLO", YEL, "#5a4500", undefined, 120, 2);
  b("el vidrio se empezo a abrir", "n_desemp2");
  tag("como una cortina que sube", "COMO UNA CORTINA QUE SUBE", GREEN);
  big("y por que nadie me lo dijo", "“¿Y POR QUÉ NADIE ME LO DIJO EN 40 AÑOS?”", COL.ink, "#1c2a3a", undefined, 62, 4);
  b("antes de seguir algo rapido", "r_mostrador");
  tag("decir en el mostrador", "LO QUE DICES EN EL MOSTRADOR", YEL, undefined, 46);
  stamp("para que no te cobren", "QUE NO TE COBREN DE MÁS", YEL, 68);
  // ================= CTA 1: la guía 3D abierta en la pág. 30 + QR =================
  b("esta en mi manual del mecanico", "BK");
  { const op = Q("lo de los vidrios"), hl = Q("esta en la pagina 30") + 0.3;
    pc("esta en mi manual del mecanico", (t, a, bb) => <Libro t={t} at={a + 0.05} openAt={op} out={bb - 0.2} page={30} x={760} hl={{ at: hl, x: 0.07, y: 0.54, w: 0.42, h: 0.4 }} />); }
  b("si quieres tenerlo en el celular", "BK");
  pc("si quieres tenerlo en el celular", (t, a, bb) => <QrCard t={t} at={a} out={bb - 0.2} x={1440} />);
  ov("busca el link", 3.6, (t, a, bb) => <Desc t={t} at={a} out={bb} />);

  // ================= PUNTO 1: el empañado no es frío, es agua =================
  b("y ahora si vamos a lo importante", "BK");
  plate("punto numero 1", "1", "EL EMPAÑADO NO ES FRÍO");
  stamp("es agua", "ES AGUA", COL.ice, 110);
  b("en el ano 89", "n_aurelio_vaso");
  big("en el ano 89", "1989 · EL TALLER DE DON AURELIO", CREAM, "#4a2a00", undefined, 70);
  tag("agarro un vaso de la cocina", "UN VASO CON HIELO", COL.ice);
  b("a los dos minutos el vaso", "n_vaso_suda");
  tag("todo mojado por fuera", "TODO MOJADO POR FUERA", COL.ice);
  tag("el vidrio no suda", "“EL VIDRIO NO SUDA, MUCHACHO”", COL.ink, undefined, 46);
  tag("que deja su agua", "EL AIRE DEJA SU AGUA", YEL);
  b("y tu parabrisas es ese vaso", "w_vaso");
  b("cuando respiras echas vapor", "n_respira");
  big("40 gramos de agua por hora", "40 g DE AGUA POR HORA", COL.ice, "#0a2a40", "UNA SOLA PERSONA");
  tag("casi medio vaso", "CASI MEDIO VASO", COL.ice);
  b("con dos personas adentro", "n_cabina_humeda");
  { const t1 = Q("dos personas adentro"), t2 = Q("un abrigo mojado"), t3 = Q("un paraguas en el piso"), t4 = Q("los zapatos con barro");
    ov("con dos personas adentro", 7, (t, a, bb) => <KitTray t={t} out={bb} y={140} items={[
      { at: t1, ic: "👥", tx: "2 PERSONAS" }, { at: t2, ic: "🧥", tx: "ABRIGO MOJADO" }, { at: t3, ic: "☂️", tx: "PARAGUAS" }, { at: t4, ic: "👞", tx: "ZAPATOS CON BARRO" }]} />); }
  b("es una caja chica", "w_paraguas");
  big("es una caja chica", "UNA CAJA CHICA, SIN SALIDA", COL.ice, "#0a2a40", undefined, 76);
  b("ese aire humedo toca el vidrio", "w_gotas");
  tag("tan chiquitas que no se ven", "GOTITAS INVISIBLES", COL.ice);
  b("hay un numero que lo explica", "n_higrometro");
  big("se llama punto de rocio", "PUNTO DE ROCÍO", YEL, "#5a4500");
  b("es la temperatura a la que", "BK");
  { const dr = Q("si el vidrio esta mas frio");
    pc("es la temperatura a la que", (t, a, bb) => <Rocio t={t} at={a + 0.05} dropAt={dr} out={bb - 0.2} />); }
  stamp("siempre en cualquier auto", "SIEMPRE", COL.red, 100);
  b("entonces tienes dos caminos", "BK");
  { const r1 = Q("el motor esta frio"), r2 = Q("le sacas el agua al aire");
    pc("entonces tienes dos caminos", (t, a, bb) => <VsCard t={t} at={a} out={bb - 0.15} y={540}
      l={{ h: "CALENTAR EL VIDRIO", rows: [{ at: r1, tx: "TARDA: MOTOR FRÍO" }] }} r={{ h: "SECAR EL AIRE", rows: [{ at: r2, tx: "BAJA EL PUNTO DE ROCÍO" }] }} />); }
  big("el primer camino tarda 10 minutos", "10 MIN vs 30 SEG", GREEN, "#0a3a1a", undefined, 110);
  // ================= PUNTO 2: el A/C seca =================
  b("una maquina que casi nadie usa", "BK");
  { const pr = Q("el aire acondicionado no solo");
    pc("una maquina que casi nadie usa", (t, a, bb) => <AcBtn t={t} at={a + 0.05} pressAt={pr} out={bb - 0.2} sub={t > pr + 1.2 ? "NO SÓLO ENFRÍA: SECA" : "LA QUE NADIE USA EN INVIERNO"} />); }
  big("punto numero 2", "2 · EL A/C SECA", COL.ice, "#0a2a40");
  b("detras de la guantera", "n_guantera_hvac");
  tag("se llama evaporador", "EL EVAPORADOR", COL.ice, "UN RADIADORCITO");
  b("se pone muy frio", "a_evaporador");
  tag("casi a cero grados", "CASI 0 °C", COL.ice);
  b("pasa por sus aletas", "a_aletas");
  tag("deja su agua pegada", "EL AGUA QUEDA PEGADA", COL.ice, "IGUAL QUE EL VASO");
  b("por un tubito de goma", "n_dren_verano");
  tag("por un tubito de goma", "EL TUBITO", YEL, "SALE DEBAJO DEL AUTO");
  b("viste en verano el charquito", "a_charco");
  big("no es una fuga", "NO ES UNA FUGA", GREEN, "#0a3a1a", "ES TU SECADOR FUNCIONANDO");
  b("y aca esta la parte que nadie sabe", "BK");
  big("y aca esta la parte que nadie sabe", "LA PARTE QUE NADIE SABE", YEL, "#5a4500", undefined, 90, 2.6);
  { const f1 = Q("el aire pasa primero"), f2 = Q("evaporador que lo seca"), f3 = Q("radiador de la calefaccion");
    pc("el aire pasa primero", (t, a, bb) => <Flow t={t} out={bb - 0.2} y={620} items={[
      { at: f1, ic: "🌬️", tx: "AIRE" }, { at: f2, ic: "❄", tx: "EVAPORADOR", sub: "LE SACA EL AGUA", col: COL.ice }, { at: f3, ic: "🔥", tx: "CALEFACCIÓN", sub: "LO CALIENTA", col: ORG }]} />); }
  b("misma caja de plastico", "n_caja_hvac");
  stamp("aire seco y caliente", "SECO + CALIENTE", ORG, 84);
  b("le saca el agua la calefaccion", "BK");
  { const f1 = Q("le saca el agua"), f2 = Q("la calefaccion lo calienta"), f3 = Q("va directo al vidrio");
    pc("le saca el agua la calefaccion", (t, a, bb) => <Flow t={t} out={bb - 0.2} y={560} items={[
      { at: a, ic: "🌬️", tx: "AIRE" }, { at: f1, ic: "❄", tx: "SE SECA", col: COL.ice }, { at: f2, ic: "🔥", tx: "SE CALIENTA", col: ORG }, { at: f3, ic: "🪟", tx: "AL VIDRIO", col: GREEN }]} />); }
  big("como una esponja vacia", "COMO UNA ESPONJA VACÍA", GREEN, "#0a3a1a");
  big("se abre en 30 segundos", "30 SEG · NO 10 MIN", GREEN, "#0a3a1a", "EL MISMO AIRE, SIN AGUA");
  b("un taxista del centro", "n_taxi_puerta");
  big("que se llamaba ramiro", "RAMIRO · TAXISTA", CREAM, "#4a2a00");
  tag("se iba a congelar", "“ME VOY A CONGELAR”", COL.ice);
  tag("pon la temperatura en rojo", "TEMPERATURA EN ROJO", COL.red);
  big("el que manda en la temperatura", "LA PERILLA MANDA EN EL CALOR", COL.ink, "#1c2a3a", "EL BOTÓN: SECO O MOJADO", 76, 5);
  b("me trajo un cafe", "n_cafe_taxista");
  big("20 minutos de trabajo", "+20 MIN DE TRABAJO", GREEN, "#0a3a1a", "CADA MAÑANA");
  b("ahora si apretas el boton", "BKr");
  stamp("arruina todo el truco", "ARRUINA TODO", COL.red, 90);
  tag("casi todos lo tienen prendido", "CASI TODOS LO TIENEN PRENDIDO", YEL, "SIN SABERLO", 46);
  // ================= PUNTO 3: el orden exacto =================
  b("punto numero 3", "BK");
  plate("punto numero 3", "3", "EL ORDEN EXACTO");
  const o1 = Q("1 el boton que dice"), o2 = Q("2 la recirculacion apagada"), o3 = Q("3 la temperatura en caliente"), o4 = Q("4 el ventilador alto"), o5 = Q("5 la salida del aire");
  b("1 el boton que dice", "n_dedo_ac");
  big("1 el boton que dice", "1 · A/C (EL COPITO)", COL.ice, "#0a2a40", "AUNQUE HAGA FRÍO", 84, 4);
  tag("tiene que prender su lucecita", "QUE PRENDA LA LUCECITA", GREEN);
  b("2 la recirculacion apagada", "o_recirc");
  big("2 la recirculacion apagada", "2 · RECIRCULACIÓN OFF", YEL, "#5a4500", "EL AUTITO CON LA FLECHA", 84, 5);
  b("3 la temperatura en caliente", "o_temp");
  big("3 la temperatura en caliente", "3 · CALOR, TODO ROJO", COL.red, "#3a0a06", undefined, 84, 2.6);
  b("4 el ventilador alto", "o_vent");
  big("4 el ventilador alto", "4 · VENTILADOR 3 O 4", COL.ice, "#0a2a40", "NO EN 1", 84, 3);
  b("5 la salida del aire", "o_modo");
  big("5 la salida del aire", "5 · AL PARABRISAS", GREEN, "#0a3a1a", "EL VIDRIO CURVO CON FLECHITAS", 84, 5);
  b("por que en ese orden", "BK");
  pc("por que en ese orden", (t, a, bb) => <Botonera t={t} at={a + 0.05} out={bb - 0.2} steps={[o1, o2, o3, o4, o5].map((x, i) => Math.min(x, a + 0.4 + i * 0.3))} y={600} sc={0.9} />);
  tag("tarda unos segundos en enfriar", "EL COMPRESOR TARDA UNOS SEGUNDOS", COL.ice, undefined, 44);
  b("el aire va a los pies", "n_pies_primero");
  tag("el aire va a los pies", "PRIMERO A LOS PIES", ORG, "DESPUÉS ARRIBA");
  big("entre 30 segundos y 2 minutos", "30 SEG vs 2 MIN", GREEN, "#0a3a1a");
  b("dirige las rejillas", "n_rejilla_lateral");
  tag("hacia las ventanillas de adelante", "REJILLAS A LAS VENTANILLAS", COL.ice, "LOS ESPEJOS, SIN TOCARLOS", 46);
  // ================= PUNTO 4: la recirculación =================
  b("punto numero 4", "BKr");
  plate("punto numero 4", "4", "EL BOTÓN QUE ARRUINA TODO", true);
  b("porque el aire frio de afuera", "n_calle_niebla");
  tag("tiene muy poca agua", "EL AIRE FRÍO TIENE POCA AGUA", COL.ice, undefined, 46);
  b("te doy numeros", "BK");
  { const ia = Q("y el aire de adentro el que");
    pc("te doy numeros", (t, a, bb) => <Jarras t={t} at={a + 0.05} inAt={ia} out={bb - 0.2} />); }
  big("aguanta menos de 5 gramos", "0 °C → MENOS DE 5 g", COL.ice, "#0a2a40", "POR METRO CÚBICO");
  big("aguanta mas de 17", "20 °C → MÁS DE 17 g", ORG, "#4a2000");
  stamp("secarte con una toalla mojada", "TOALLA MOJADA", COL.red, 90);
  b("con la recirculacion apagada entra", "n_rejilla_trasera");
  tag("sale por unas rejillas", "EL HÚMEDO SALE POR ATRÁS", ORG, "DETRÁS DEL PARAGOLPES", 46);
  big("en invierno la recirculacion va apagada", "EN INVIERNO: RECIRCULACIÓN APAGADA", COL.ice, "#0a2a40", "CASI SIEMPRE", 72);
  b("detras de un camion", "f_camion");
  tag("detras de un camion", "SÓLO UN RATITO", YEL, "Y LA VUELVES A APAGAR");
  b("dona elena tenia la recirculacion", "n_elena_recirc");
  tag("el vendedor le habia dicho", "“ASÍ CALIENTA MÁS RÁPIDO”", CREAM);
  stamp("lo pierde en vista", "LO PIERDE EN VISTA", COL.red, 80);
  b("calcetines gruesos", "n_elena_calcetines");
  big("calcetines gruesos", "CALCETINES GRUESOS", CREAM, "#4a2a00", "MÁS BARATOS QUE UN CHOQUE");
  // ================= PUNTO 5: el botón del parabrisas =================
  b("punto numero 5", "o_moderno");
  plate("punto numero 5", "5", "EL BOTÓN QUE HACE TODO");
  { const r1 = Q("prende el compresor"), r2 = Q("saca la recirculacion"), r3 = Q("sube el ventilador"), r4 = Q("manda todo el aire al vidrio");
    ov("prende el compresor", 7, (t, a, bb) => <Rows t={t} title="LO HACE SOLO" x={1400} y={520} out={bb} rows={[
      { at: r1, ic: "❄", tx: "PRENDE EL COMPRESOR" }, { at: r2, ic: "🔁", tx: "SACA LA RECIRCULACIÓN" }, { at: r3, ic: "🌀", tx: "SUBE EL VENTILADOR" }, { at: r4, ic: "🪟", tx: "TODO AL VIDRIO" }]} />); }
  big("pero muchos autos no", "PERO MUCHOS NO", COL.red, "#3a0a06", undefined, 110);
  b("haz esta prueba hoy", "n_prueba_luces");
  { const r1 = Q("aprieta el boton del parabrisas"), r2 = Q("mira dos lucecitas"), r3 = Q("si la del ac se prende sola"), r4 = Q("si la recirculacion queda prendida");
    ov("haz esta prueba hoy", 18, (t, a, bb) => <Rows t={t} title="LA PRUEBA DEL MINUTO" x={1400} y={520} out={bb} rows={[
      { at: r1, ic: "🪟", tx: "BOTÓN DEL PARABRISAS" }, { at: r2, ic: "💡", tx: "MIRA 2 LUCES" }, { at: r3, ic: "❄", tx: "¿EL A/C PRENDE SOLO?" }, { at: r4, ic: "🔁", tx: "RECIRCULACIÓN: LA APAGAS TÚ" }]} />); }
  stamp("hazlo hoy con calma", "HOY, CON CALMA", YEL, 80);
  b("climatizador automatico", "n_climatizador");
  tag("dejalo en automatico", "EN AUTO + BOTÓN DEL PARABRISAS", GREEN, undefined, 44);
  b("baja un dedo las dos ventanillas", "n_ventanilla_dedo");
  big("baja un dedo las dos ventanillas", "UN DEDO, LAS 2 DE ADELANTE", COL.ink, "#1c2a3a", undefined, 76);
  tag("se escapa por ahi", "SALE EL HÚMEDO", ORG);
  tag("el aire seco que mete", "ENTRA EL SECO", COL.ice);
  b("como abrir la ventana del bano", "n_bano_espejo");
  tag("el espejo se desempana", "COMO EL ESPEJO DEL BAÑO", COL.ice);
  b("ahora todo esto supone", "BK");
  big("y si no tiene", "¿Y SI NO TENGO A/C?", YEL, "#5a4500", undefined, 110);
  tag("no prende en las mananas", "¿O NO PRENDE CON FRÍO?", COL.ice);
  // ================= PUNTO 6: sin aire acondicionado =================
  b("punto numero 6", "n_camioneta90");
  plate("punto numero 6", "6", "SIN AIRE ACONDICIONADO");
  b("como no tienes con que secar", "BK");
  big("lo que haces es cambiarlo", "NO LO SECAS: LO CAMBIAS", GREEN, "#0a3a1a");
  b("las dos ventanillas de adelante un dedo abiertas", "o_ventanillas");
  { const r4 = Q("la temperatura aqui");
    ov("las dos ventanillas", 9, (t, a, bb) => <Rows t={t} title="SIN A/C" x={1400} y={520} out={bb} rows={[
      { at: a, ic: "🔁", tx: "RECIRCULACIÓN OFF" }, { at: a + 0.3, ic: "🌀", tx: "VENTILADOR ALTO" }, { at: a + 0.6, ic: "🪟", tx: "VENTANILLAS UN DEDO" }, { at: r4, ic: "🌡", tx: "LA TEMPERATURA: EL DETALLE" }]} />); }
  b("la calefaccion sopla aire frio", "BK");
  timer("a medida que el motor calienta", "↑", "SUBES DE A POCO", ORG, 4);
  big("no es en 30 segundos", "2-3 MIN", GREEN, "#0a3a1a", "MEJOR QUE 10 MIN", 120);
  b("no hables hacia el vidrio", "w_aliento");
  tag("no hables hacia el vidrio", "NO LE HABLES AL VIDRIO", COL.ice);
  b("el que maneja agachado", "n_agachado");
  stamp("lo empana el solo", "LO EMPAÑA ÉL SOLO", COL.red, 76);
  // ================= PUNTO 7: el compresor que no prende =================
  b("punto numero 7", "e4_helada");
  plate("punto numero 7", "7", "CON MUCHO FRÍO NO PRENDE");
  stamp("esto es honesto", "HONESTO", YEL, 90);
  tag("cerca de 0 grados", "CERCA DE 0 °C", COL.ice, "ALGUNOS YA A 4-5 °C");
  big("es para cuidarlo", "ES PARA CUIDARLO", COL.ink, "#1c2a3a");
  b("se prende la lucecita pero", "n_capo_compresor");
  tag("no escuchas el clic", "SIN EL CLIC DEBAJO DEL CAPÓ", ORG, "SIN EL TIRÓN DEL MOTOR", 44);
  b("lo que haces ahi es lo del auto sin aire", "n_escarcha_auto");
  big("es lo del auto sin aire", "IGUAL QUE SIN A/C", COL.ice, "#0a2a40");
  b("suele volver a prender solo", "BK");
  timer("suele volver a prender solo", "5-10'", "VUELVE A PRENDER SOLO", GREEN, 5);
  stamp("dejalo prendido todo el invierno", "A/C PRENDIDO TODO EL INVIERNO", GREEN, 60, 3.5);
  b("la segunda semana me", "n_elena_telefono");
  tag("se me empana igual", "“SE ME EMPAÑA IGUAL”", CREAM);
  b("ahi aparecieron los errores", "BKr");
  big("son 5 y apuesto", "5 ERRORES", COL.red, "#3a0a06", "APUESTO A QUE TIENES 2", 140, 3.6);
  // ================= ERROR 1: el trapo =================
  b("error numero 1", "BKr");
  errc("error numero 1", 1, "EL TRAPO");
  b("manga del abrigo", "e1_manga");
  tag("lo aclara dos segundos", "2 SEGUNDOS…", GREEN);
  tag("y despues queda peor", "…Y QUEDA PEOR", COL.red);
  tag("la piel tiene", "PIEL + TELA = GRASA", "#ffd66b");
  big("el agua se agarra a la grasa", "EL AGUA SE AGARRA A LA GRASA", "#ffd66b", "#4a3200", undefined, 70);
  b("con las luces de los autos", "e1_noche");
  tag("y te encandilan", "DE NOCHE, TE ENCANDILAN", YEL);
  b("no pases la mano", "BK");
  timer("espera los 30 segundos", "30 S", "ESPERA EL AIRE", GREEN, 3);
  big("nunca manejes mirando", "NO PASES LA MANO", COL.red, "#3a0a06");
  stamp("si no ves no sales", "SI NO VES, NO SALES", COL.red, 80);
  b("un trapo amarillo", "n_trapo_amarillo");
  tag("para el tablero para el vidrio", "EL TRAPO PARA TODO", YEL);
  big("me dijo que nunca", "LAVADO: NUNCA", COL.red, "#3a0a06");
  stamp("una esponja de grasa", "ESPONJA DE GRASA", "#ffd66b", 76);
  b("lo tiramos ese mismo dia", "n_trapo_basura");
  // ================= ERROR 2: el vidrio sucio por dentro =================
  b("error numero 2", "BKr");
  errc("error numero 2", 2, "EL VIDRIO SUCIO POR DENTRO");
  b("con el sol de frente", "e2_sol");
  tag("ves una pelicula gris", "UNA PELÍCULA GRIS", GRAY, "COMO UN VELO = GRASA");
  b("el plastico del tablero", "e2_tablero");
  tag("suelta unos vapores", "EL PLÁSTICO SUELTA VAPORES", ORG, undefined, 46);
  b("si alguien fuma", "n_pelicula_humo");
  stamp("deja una capa amarilla", "CAPA AMARILLA", "#ffd66b", 80);
  big("se empane primero", "SE EMPAÑA PRIMERO", COL.ice, "#0a2a40", "Y SE DESEMPAÑA ÚLTIMO");
  b("se limpia asi", "e2_kit");
  { const k1 = Q("limpia vidrios comun"), k2 = Q("chorrito de alcohol"), k3 = Q("dos panos de microfibra");
    ov("se limpia asi", 9, (t, a, bb) => <KitTray t={t} out={bb} y={130} items={[
      { at: k1, ic: "🧴", tx: "LIMPIAVIDRIOS" }, { at: k2, ic: "💧", tx: "AGUA + ALCOHOL" }, { at: k3, ic: "🧽", tx: "2 PAÑOS DE MICROFIBRA" }]} />); }
  tag("no papel de", "NO PAPEL: DEJA PELUSA", COL.red);
  b("rocias el pano", "n_rocia_pano");
  tag("rocias el pano", "EL PAÑO, NO EL VIDRIO", GREEN);
  b("de arriba abajo", "n_limpia_vertical");
  tag("de arriba abajo", "↕ LIMPIAS", COL.ice);
  tag("de lado a lado", "↔ SECAS", GREEN);
  b("dorso de la mano", "e2_dorso");
  b("un palito con el pano", "n_palito_esquina");
  tag("un palito con el pano", "AHÍ SE ACUMULA", YEL);
  b("le pase el pano humedo", "e2_gris");
  tag("quedo gris casi negro", "GRIS, CASI NEGRO", GRAY);
  stamp("por dentro nunca", "POR DENTRO: NUNCA", COL.red, 80);
  b("hazlo una vez por mes", "BK");
  timer("hazlo una vez por mes", "1×", "POR MES EN INVIERNO", GREEN, 3.4);
  big("con el mismo trapo", "NO CON EL TRAPO DEL TABLERO", COL.red, "#3a0a06", undefined, 70);
  // ================= ERROR 3: el agua escondida =================
  b("error numero 3", "BKr");
  errc("error numero 3", 3, "EL AGUA QUE LLEVAS ADENTRO");
  stamp("hay agua escondida", "AGUA ESCONDIDA", COL.ice, 84);
  b("levanta las alfombras", "n_alfombra_mano");
  tag("si esta humeda", "HÚMEDA = TU PROBLEMA", COL.red);
  b("se evapora toda la noche", "e3_alfombra");
  big("se evapora toda la noche", "SE EVAPORA TODA LA NOCHE", COL.ice, "#0a2a40", undefined, 76);
  { const k1 = Q("los paraguas mojados"), k2 = Q("el barro de los zapatos"), k3 = Q("una botella");
    ov("los paraguas mojados", 7, (t, a, bb) => <KitTray t={t} out={bb} y={130} items={[
      { at: k1, ic: "☂️", tx: "PARAGUAS MOJADOS" }, { at: k2, ic: "👞", tx: "NIEVE Y BARRO" }, { at: k3, ic: "🍼", tx: "UNA BOTELLA VOLCADA" }]} />); }
  b("deja el auto al sol", "e3_sol");
  b("papel de diario", "n_diario_alfombra");
  tag("cambialo cada dia", "CAMBIALO CADA DÍA", YEL);
  b("es la del acompanante", "e3_tubo");
  tag("puede ser el tubito", "EL TUBITO DEL A/C", YEL);
  tag("se tapa con hojas", "TAPADO = CAE ADENTRO", COL.red);
  b("con un alambre suave", "n_alambre_dren");
  tag("con un alambre suave", "UN ALAMBRE SUAVE, DESDE ABAJO", GREEN, undefined, 44);
  b("la canaleta de abajo", "n_canaleta_hojas");
  tag("la canaleta de abajo", "LA CANALETA DEL PARABRISAS", YEL, "SE JUNTAN HOJAS", 46);
  b("echa un vaso de", "n_vaso_canaleta");
  tag("tiene que irse rapido", "TIENE QUE IRSE RÁPIDO", GREEN);
  b("los burletes de las puertas", "n_burlete_roto");
  stamp("un burlete roto", "BURLETE ROTO = AGUA", COL.red, 76);
  // ================= ERROR 4: el filtro de cabina =================
  b("error numero 4", "BKr");
  errc("error numero 4", 4, "EL FILTRO DE LA CABINA");
  b("es un filtro de papel", "e3_filtro");
  big("tarda el doble", "TAPADO = TARDA EL DOBLE", COL.red, "#3a0a06", undefined, 80);
  tag("cria hongos", "HONGOS · OLOR A HUMEDAD", "#b6d36b");
  b("se cambia en cinco minutos", "n_baja_guantera");
  timer("se cambia en cinco minutos", "5'", "SIN HERRAMIENTAS", GREEN, 4);
  tag("como si fuera media hora", "EL TALLER COBRA MEDIA HORA", YEL, undefined, 46);
  b("tenia hojas", "n_filtro_sucio");
  tag("el auto tenia seis anos", "6 AÑOS · EL DE FÁBRICA", GRAY);
  big("soplaba el doble", "SOPLABA EL DOBLE", GREEN, "#0a3a1a");
  stamp("cambialo una vez al ano", "1 VEZ AL AÑO", GREEN, 84);
  // ================= ERROR 5: apagar con el evaporador mojado =================
  b("error numero 5", "BKr");
  errc("error numero 5", 5, "APAGAR CON EL EVAPORADOR MOJADO");
  b("queda empapado de agua", "BK");
  tag("queda empapado de agua", "EL EVAPORADOR, EMPAPADO", COL.ice);
  b("crecen hongos", "n_hongos_aletas");
  tag("huelen a calcetin mojado", "OLOR A CALCETÍN MOJADO", "#b6d36b");
  b("dos minutos antes de llegar", "e4_llegar");
  big("dos minutos antes de llegar", "2 MIN ANTES DE LLEGAR", YEL, "#5a4500", "A/C OFF · SÓLO VENTILADOR", 90, 5);
  b("tambien esta en la pagina 30", "BK");
  pc("tambien esta en la pagina 30", (t, a, bb) => <Libro t={t} at={a} openAt={a + 0.2} out={bb - 0.2} page={30} hl={{ at: a + 0.6, x: 0.07, y: 0.13, w: 0.42, h: 0.4 }} />);
  b("en la esquina de la panaderia", "n_panaderia");
  tag("la panaderia es su alarma", "LA PANADERÍA = SU ALARMA", CREAM);
  // ================= CTA 2 =================
  b("piensa en lo que te ahorraste", "n_mostrador_cuenta");
  { const r1 = Q("una revision del sistema"), r2 = Q("una carga de gas");
    ov("piensa en lo que te ahorraste", 10, (t, a, bb) => <Rows t={t} title="LO QUE TE AHORRASTE" x={1400} y={520} out={bb} rows={[
      { at: r1, ic: "🧾", tx: "REVISIÓN: MÁS QUE UNA CENA" }, { at: r2, ic: "💸", tx: "CARGA DE GAS: EL DOBLE", no: true }]} />); }
  big("tres botones y un filtro", "3 BOTONES + 1 FILTRO", GREEN, "#0a3a1a");
  b("tienes 58 trucos", "BK");
  { const p32 = Q("la 32 es la de los olores");
    pc("tienes 58 trucos", (t, a, bb) => <Libro t={t} at={a} openAt={a + 0.3} out={bb - 0.2} page={t < p32 ? 30 : 32} x={720} />); }
  big("tienes 58 trucos", "58 TRUCOS DE TALLER", YEL, "#5a4500", "CON LO QUE DICES EN EL MOSTRADOR", 84, 6);
  b("codigo con la camara o", "BK");
  pc("codigo con la camara o", (t, a, bb) => <QrCard t={t} at={a - 0.6} out={bb - 0.2} x={1440} />);
  ov("primera linea de la descripcion", 2.6, (t, a, bb) => <Desc t={t} at={a} out={bb} />);
  { const ck = Q("arreglamos");
    ov("y suscribete", 6, (t, a, bb) => <Subscribe t={t} at={a} clickAt={ck} out={bb} y={900} />); }
  tag("lo que le pasa a ella", "LO QUE LE PASA A ELENA…", CREAM, "…TE VA A PASAR A TI");
  // ================= DON AURELIO: la noche anterior =================
  b("lo que hacia mi maestro", "BK");
  big("nunca desempanaba el vidrio", "NUNCA DESEMPAÑABA", CREAM, "#4a2a00", "DON AURELIO");
  b("una camioneta del 78", "n_camioneta78");
  tag("una camioneta del 78", "CAMIONETA DEL 78 · SIN A/C", CREAM, undefined, 46);
  big("lo primero nunca dejaba", "1 · NADA MOJADO ADENTRO", COL.ice, "#0a2a40");
  b("el paraguas iba al baul", "n_paraguas_baul");
  big("lo segundo", "2 · VENTANILLAS ABIERTAS LOS ÚLTIMOS 2 MIN", COL.ink, "#1c2a3a", undefined, 62, 4);
  big("lo tercero", "3 · EL CALCETÍN", YEL, "#5a4500");
  b("un calcetin viejo", "n_calcetin_arena");
  tag("arena para", "ARENA DE SÍLICE PARA GATOS", GRAY, undefined, 46);
  tag("chupa la humedad", "CHUPA LA HUMEDAD", COL.ice, "TODA LA NOCHE");
  b("bolsitas deshumidificadoras", "n_bolsa_micro");
  tag("se recargan en el microondas", "SE RECARGAN EN EL MICROONDAS", GREEN, undefined, 44);
  stamp("no hacen milagros", "NO HACEN MILAGROS", COL.red, 80);
  big("primero el agua afuera", "1º EL AGUA AFUERA", COL.ice, "#0a2a40", "DESPUÉS LA BOLSITA");
  b("limpiaba los vidrios por dentro", "n_aurelio_diario");
  big("limpiaba los vidrios por dentro", "4 · VIDRIOS LIMPIOS LOS DOMINGOS", CREAM, "#4a2a00", undefined, 66, 3);
  tag("diarios viejos", "DIARIOS VIEJOS", GRAY);
  big("es la mitad del trabajo", "VIDRIO LIMPIO = LA MITAD DEL TRABAJO", GREEN, "#0a3a1a", "LA OTRA MITAD: EL BOTÓN", 64, 5);
  // ================= CLIMA: montaña, costa, afuera, atrás =================
  b("no es lo mismo el frio", "n_escarcha_monte");
  big("de la montana que el de la costa", "MONTAÑA ≠ COSTA", COL.ice, "#0a2a40");
  tag("en el frio seco de altura", "FRÍO SECO: APAGA LA RECIRCULACIÓN", COL.ice, undefined, 42);
  b("nunca nunca le eches agua caliente", "n_vidrio_rajado");
  stamp("agua caliente al parabrisas", "NUNCA AGUA CALIENTE", COL.red, 80, 4);
  b("un raspador de plastico", "n_raspador");
  tag("un raspador de plastico", "RASPADOR DE PLÁSTICO", GREEN, "NI METAL NI TARJETA");
  b("con un carton", "n_carton_vidrio");
  tag("con un carton", "CARTÓN O TOALLA VIEJA", YEL, "LA NOCHE ANTERIOR");
  b("costa o de lluvia", "n_costa_lluvia");
  big("es indispensable", "COSTA Y LLUVIA: EL A/C ES INDISPENSABLE", COL.ice, "#0a2a40", undefined, 62);
  b("el empanado esta afuera", "n_tropical_fuera");
  big("el empanado esta afuera", "A VECES ES AFUERA", ORG, "#4a2000", undefined, 110);
  tag("se condensa del lado", "SE CONDENSA AFUERA", ORG);
  tag("no sale nada", "POR DENTRO NO SALE NADA", COL.ink);
  big("una pasada", "AL REVÉS: 1 PASADA DEL LIMPIA", GREEN, "#0a3a1a", "Y SUBE LA TEMPERATURA", 70);
  b("el vidrio de atras es otra", "x_trasero");
  b("lineas finitas", "n_lineas_luneta");
  tag("resistencias electricas", "RESISTENCIAS ELÉCTRICAS", ORG);
  tag("con el boton del rectangulo", "EL BOTÓN DEL RECTÁNGULO", YEL);
  stamp("ni con el", "NUNCA EL RASPADOR", COL.red, 80);
  // ================= LAS PREGUNTAS =================
  b("me quedan las preguntas", "BK");
  big("que la senal es en serio", "LA SEÑAL ES EN SERIO", COL.red, "#3a0a06", "NO TE VAYAS TODAVÍA");
  b("la primera pregunta", "n_humo_puerta");
  plate("la primera pregunta", "1", "¿GASTA MÁS GASOLINA?");
  tag("si un poco", "UN POCO, 2-3 MINUTOS", YEL);
  big("menos que un choque", "MENOS QUE UN CHOQUE", GREEN, "#0a3a1a");
  b("la segunda no se", "n_manguera_ac");
  plate("la segunda no se", "2", "¿SE ROMPE EL COMPRESOR?");
  tag("lleva aceite", "EL GAS LLEVA ACEITE", ORG, "LUBRICA GOMAS Y SELLOS");
  big("10 minutos una vez por semana", "10 MIN · 1 VEZ POR SEMANA", GREEN, "#0a3a1a", "TODO EL AÑO");
  b("la tercera", "n_antiempanante");
  plate("la tercera", "3", "¿Y LOS ANTIEMPAÑANTES?");
  tag("sobre un vidrio muy limpio", "SÓLO SOBRE VIDRIO LIMPIO", GREEN);
  b("la papa cruda", "n_papa_vidrio");
  tag("deja residuos", "DEJA RESIDUOS", COL.red);
  b("la cuarta", "x_lluvia");
  plate("la cuarta", "4", "¿POR QUÉ CON LLUVIA?");
  b("el pelo los zapatos", "n_lluvia_sube");
  big("no es opcional", "CON LLUVIA EL A/C NO ES OPCIONAL", COL.ice, "#0a2a40", undefined, 66);
  big("prevenir es mas facil", "PREVENIR > DESEMPAÑAR", GREEN, "#0a3a1a");
  b("y la quinta", "BK");
  plate("y la quinta", "5", "¿SE EMPAÑA MÁS AL PRENDERLO?");
  tag("un senor de bogota", "DESDE BOGOTÁ", CREAM);
  tag("todavia esta mojado", "EL EVAPORADOR, MOJADO DE LA NOCHE", COL.ice, undefined, 42);
  big("entonces no es humedad", "ENTONCES NO ES HUMEDAD", COL.red, "#3a0a06");
  // ================= LA SEÑAL =================
  b("es la senal que te prometi", "BKr");
  plate("es la senal que te prometi", "!", "LA SEÑAL · ESTA ES SERIA", true);
  b("una pelicula grasosa", "n_velo_aceitoso");
  stamp("una pelicula grasosa", "PELÍCULA GRASOSA", "#ffd66b", 74);
  tag("un olor dulce", "+ OLOR DULCE, A JARABE", ROSE);
  big("es el liquido refrigerante", "ES REFRIGERANTE DEL MOTOR", COL.red, "#3a0a06", undefined, 76);
  b("esta el radiadorcito de la calefaccion", "s_vapor");
  tag("sale en vapor", "SALE EN VAPOR POR LAS REJILLAS", ORG, undefined, 44);
  big("no lo arregla ningun boton", "NINGÚN BOTÓN LO ARREGLA", COL.red, "#3a0a06");
  b("mira el nivel del deposito", "s_deposito");
  tag("de minimo y maximo", "CON EL MOTOR FRÍO", COL.ice, "MÍNIMO · MÁXIMO");
  b("un marcador", "n_marcador");
  tag("si en una semana baja", "SI BAJA Y NO GOTEA…", COL.red);
  b("la alfombra del acompanante esta mojada", "n_alfombra_dulce");
  tag("y huele dulce", "ALFOMBRA MOJADA Y DULCE", ROSE);
  b("va al taller esta semana", "s_taller");
  stamp("va al taller esta semana", "AL TALLER · ESTA SEMANA", COL.red, 74, 3.5);
  big("una junta de culata", "JUNTA DE CULATA = CARO", COL.red, "#3a0a06");
  b("esta en el manual en la pagina 32", "BK");
  { const hl = Q("olor dulce como a jarabe");
    pc("esta en el manual en la pagina 32", (t, a, bb) => <Libro t={t} at={a + 0.05} openAt={a + 0.2} out={bb - 0.2} page={32} hl={{ at: hl, x: 0.07, y: 0.13, w: 0.86, h: 0.4 }} />); }
  b("el mostrador dices exactamente", "n_elena_mostrador");
  { const r1 = Q("pierdo refrigerante"), r2 = Q("no hay gotas debajo"), r3 = Q("con pelicula grasosa"), r4 = Q("revisen el radiador");
    ov("el mostrador dices exactamente", 13, (t, a, bb) => <Rows t={t} title="DILO ASÍ EN EL MOSTRADOR" x={1380} y={520} out={bb} rows={[
      { at: r1, ic: "💧", tx: "“PIERDO REFRIGERANTE”" }, { at: r2, ic: "🚫", tx: "“NO HAY GOTAS DEBAJO”" }, { at: r3, ic: "🪟", tx: "“PELÍCULA GRASOSA, OLOR DULCE”" }, { at: r4, ic: "🔧", tx: "“REVISEN EL RADIADOR DE LA CALEFACCIÓN”" }]} />); }
  b("a dona elena no le pasaba", "c_salida");
  tag("lo de ella era humedad", "LO DE ELENA: HUMEDAD", CREAM);
  // ================= EL REPASO =================
  b("te repaso todo en un minuto", "BK");
  { const rows = [
      { at: Q("aire acondicionado prendido"), tx: "A/C PRENDIDO, AUNQUE HAGA FRÍO" }, { at: Q("recirculacion apagada temperatura"), tx: "RECIRCULACIÓN APAGADA" },
      { at: Q("ventilador alto unos segundos"), tx: "CALOR + VENTILADOR ALTO" }, { at: Q("despues al parabrisas"), tx: "PIES → PARABRISAS" },
      { at: Q("las ventanillas un dedo abiertas el"), tx: "VENTANILLAS UN DEDO" }, { at: Q("aire de afuera ventilador fuerte"), tx: "SIN A/C: AIRE DE AFUERA + PACIENCIA" },
      { at: Q("nunca el trapo"), tx: "EL TRAPO O LA MANO", no: true }, { at: Q("el vidrio limpio por dentro"), tx: "VIDRIO LIMPIO, 1 VEZ POR MES" },
      { at: Q("escondida en las alfombras"), tx: "SIN AGUA ESCONDIDA" }, { at: Q("el filtro de la cabina una vez"), tx: "FILTRO 1 VEZ AL AÑO" },
      { at: Q("el aire apagado dos"), tx: "A/C OFF 2 MIN ANTES DE LLEGAR" }, { at: Q("con olor dulce al taller"), tx: "GRASOSO + DULCE = TALLER" }];
    pc("te repaso todo en un minuto", (t, _a, bb) => <Recap t={t} out={bb - 0.3} title="EL REPASO DE CLAUDIO" rows={rows} />); }
  // ================= COMENTARIOS · PRÓXIMO · CIERRE =================
  b("ahora dime tu", "c_libreta");
  { const ty = Q("cuentamelo en los");
    pc("ahora dime tu", (t, a, bb) => <Comment t={t} at={a + 0.1} typeAt={ty - 0.4} out={bb - 0.1} text="Esperaba 10 minutos 🥶 · desde Chile" x={960} y={560} />); }
  big("de que pais", "¿DESDE QUÉ PAÍS?", YEL, "#5a4500");
  b("la semana que viene", "BK");
  pc("la semana que viene", (t, a, bb) => <NextCard t={t} at={a + 0.05} out={bb - 0.2} img="img_c_bateria.jpg" title="EL CABLE DE LA BATERÍA: ¿REINICIA LA COMPUTADORA?" x={1180} y={520} />);
  big("que es verdad", "VERDAD · MENTIRA", YEL, "#5a4500");
  stamp("puede costar caro", "UNA TE PUEDE COSTAR CARO", COL.red, 76);
  b("dona elena ahora sale", "n_elena_715");
  timer("dona elena ahora sale", "7:15", "NI UN MINUTO MÁS", GREEN, 4);
  b("en la guantera tiene un calcetin", "n_regalo_calcetin");
  big("la hizo sentir mecanica", "“ME SENTÍ MECÁNICA”", CREAM, "#4a2a00", undefined, 100);
  b("los autos no se rompen", "BK");
  big("a veces solo hay que saber", "A VECES SÓLO HAY QUE SABER QUÉ BOTÓN APRETAR", COL.ink, "#1c2a3a", undefined, 54, 10);

  // tomas extra: parten las fotos largas justo cuando el avatar sale (sólo las que ya existen)
  const XOK = new Set((AVAIL as { extra?: string[] }).extra ?? []);
  for (const x of EXTRA as { t: number; k: string }[]) if (XOK.has(x.k)) segs.push({ a: x.t, b: 0, k: x.k, tr: TRS[segs.length % TRS.length], i: segs.length });
  // fin de cada toma = arranque de la siguiente; piezas = hasta la próxima toma
  segs.sort((x, y) => x.a - y.a);
  segs.forEach((sg, i) => { sg.b = i + 1 < segs.length ? segs[i + 1].a : FULL_END; });
  const nextSeg = (a: number) => (segs.find((sg) => sg.a > a + 0.05)?.a ?? FULL_END);
  ovs.forEach((o) => { if (o.piece) o.b = nextSeg(o.a); });
  // una pieza que arranca debajo del avatar entra cuando el avatar sale (si le queda lugar)
  ovs.forEach((o) => { const w = WIN.find((x) => o.a >= x.ms - 0.1 && o.a < x.me); if (w && o.b - w.me > 1.4) o.a = w.me + 0.05; });
  return { segs, ovs: ovs.sort((x, y) => x.a - y.a) };
};

let B: ReturnType<typeof build> | null = null;
export const restCheck = () => (B = B ?? build());

export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const { segs, ovs } = restCheck();
  let i = 0;
  for (let j = 0; j < segs.length; j++) if (segs[j].a <= t) i = j;
  const cur = segs[i], prev = segs[i - 1];
  const base = t < cur.a ? <Mundo t={t} tone="#070c14" /> : prev && t < cur.a + D ? <Trans t={t} s={cur} from={baseOf(prev, t)} to={baseOf(cur, t)} /> : baseOf(cur, t);
  const on = ovs.filter((x) => t >= x.a - 0.25 && t < x.b + 0.6).map((x, k) => <React.Fragment key={k + "_" + x.a}>{x.n(t, x.a, x.b)}</React.Fragment>);
  const fade = 0.75 * e(t, FULL_END - 0.6, FULL_END - 0.05); // tope 75 %: a negro pleno el blackframe lo cuenta como cuadro negro
  return (
    <AbsoluteFill style={{ background: "#0b0e13" }}>
      {base}
      {on}
      {fade > 0 && <AbsoluteFill style={{ background: "#000", opacity: fade }} />}
    </AbsoluteFill>
  );
};
