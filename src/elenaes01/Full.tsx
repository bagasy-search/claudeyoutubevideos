// elenaes01 · el video ENTERO (0 → 1223 s), vara gary01: una base por frase —Elena en cámara / su toma haciendo lo que
// cuenta (LTX, plano fijo) / su mundo 3D (la despensa infinita, la olla y el frasco en corte)— y CERO cortes secos.
// Orden y anclas de las bases: beats.json (D:/rtmp_elenaes01/mk_beats.py). Piezas 2.5D clavadas a la palabra con at().
// Audio fuera de Remotion (mezcla.py). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PantryWorld, sceneOf, screenOf, camSpeed, PT, V3, BADP } from "./pantry3d";
import { BigNum, COL, Chips, DrawX, FONT, LowerThird, Tag, Thermo, setSlug } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Beat, Tr } from "../kits/yanqui3d/engine";
import { CheckList, NextCard, StepTitle, TimeBars, Timer, Versus, Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avw.json";
import AVAIL from "./avail.json";
import BJ from "./beats.json";

setSlug("elenaes01");
export const TEND = BJ.TEND;
export const FULL_FRAMES = Math.ceil(TEND * 30);
type BB = { a: number; k: string; tr: Tr };
const BEATS = BJ.beats as BB[];
// segundo en que entra / sale cada base del mundo 3D (para clavar etiquetas a un punto del mundo)
const startOf = (k: string) => BEATS.find((b) => b.k === k)!.a;
const endOf = (k: string) => { const i = BEATS.findIndex((b) => b.k === k); return (BEATS[i + 1]?.a ?? TEND) - 0.1; };

// el mundo con blur de movimiento real (sólo el mundo, nunca el avatar)
const World: React.FC<{ t: number; name: string; a: number }> = ({ t, name, a }) => {
  const u = t - a, v0 = camSpeed(name, u), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><PantryWorld t={t} sc={sceneOf(name, u)} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
// etiqueta pegada a un punto del mundo mientras esa base está en pantalla
const pin = (t: number, k: string, q: V3) => { const a = startOf(k); return screenOf(k.slice(2), t - a, q); };
const inB = (t: number, k: string) => { const i = BEATS.findIndex((b) => b.k === k); return t >= BEATS[i].a && t < (BEATS[i + 1]?.a ?? TEND); };
const GREEN = "#9df0b4";
const NO = "NO HAGAS ESTO";

const M = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL as { clips: string[]; imgs: string[] }, T0: 0, TEND, flashAtStart: false,
  beats: ({ AV, CL }) => BEATS.map((b): Beat => {
    if (b.k === "AV") return { ...AV(b.a, b.tr), a: b.a };
    if (b.k.startsWith("W:")) return { a: b.a, tr: b.tr, p: [960, 470], r: (t) => <World t={t} name={b.k.slice(2)} a={b.a} /> };
    return CL(b.a, b.k, b.tr, [960, 470], [1.0, 1.06]);
  }),
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const P = (n: React.ReactNode) => L.push(n);
    // etiqueta clavada a un punto del mundo, sólo mientras su base está en pantalla
    const PinTag = (key: string, k: string, q: V3, d: number, text: string, col: string, dx = 300, dy = -140, size?: number) => {
      if (!inB(t, k)) return;
      // el rótulo nunca se sale del cuadro: si no entra de un lado, va del otro
      // (el lado se decide con la posición al ENTRAR, así no salta mientras la cámara se mueve; si no entra de ningún lado, se achica)
      const p = pin(t, k, q), p0 = pin(startOf(k) + d, k, q), cw = text.length * 0.76;
      let sz = size ?? 46;
      const right = 1880 - (p0.x + Math.abs(dx)), left = p0.x - Math.abs(dx) - 40;
      if (dx > 0 && cw * sz > right && left > right) dx = -dx; else if (dx < 0 && cw * sz > left && right > left) dx = -dx;
      const room = dx > 0 ? right : left; if (cw * sz > room) sz = Math.max(26, room / cw);
      size = sz;
      P(<Tag key={key} t={t} at={startOf(k) + d} x={p.x} y={p.y} dx={dx} dy={dy} text={text} col={col} size={size} out={endOf(k)} />);
    };
    // ---------- gancho: el frasco inflado ----------
    P(<Words key="inf" t={t} items={[{ at: at("Está inflada"), txt: "TAPA INFLADA", col: COL.red }, { at: at("burbujitas que suben sola"), txt: "BURBUJAS QUE SUBEN SOLAS" }]} out={at("Eso es un frasco") - 0.05} y={900} size={80} />);
    P(<Words key="3m" t={t} items={[{ at: at("Eso es un frasco"), txt: "EJOTES · HACE 3 MESES" }]} out={at("y ahorita mismo") - 0.05} y={160} size={70} />);
    PinTag("blg", "W:jar:bulge", PT.lid, 1.4, "EL GAS EMPUJA LA TAPA", COL.red);
    P(<Words key="err" t={t} items={[{ at: at("Ese es el error"), txt: "ESE ES EL ERROR.", col: COL.amber }]} out={at("No el frasco") + 0.9} y={900} size={90} />);
    PinTag("bad1", "W:aisle:bad", BADP, 1.6, "LE PASA A CUALQUIERA", COL.ink, -320, -150);
    P(<BigNum key="50a" t={t} at={at("en 50 años")} text="50 AÑOS" x={1440} y={300} size={170} col={COL.amber} sub="NI UNA SOLA VEZ" out={at("Sabes cuál es") - 0.05} />);
    P(<BigNum key="9a" t={t} at={at("9 cosas")} text="9" x={1450} y={300} size={240} col={COL.red} sub="COSAS QUE NO SE HACEN" out={at("No son mis opiniones") + 1.5} />);
    P(<Stamp key="peso" t={t} at={at("un peso más")} text="NI UN PESO MÁS" x={1340} y={290} size={92} out={at("Y la cuarta") - 0.05} />);
    P(<Words key="enoja" t={t} items={[{ at: at("Y la cuarta"), txt: "LA #4 HACE ENOJAR A TU FAMILIA", col: COL.amber }]} out={at("Tú todavía no me") - 0.05} y={900} size={70} />);
    P(<LowerThird key="lt" t={t} at={at("Yo soy Elena")} out={at("tomate duraznos") - 0.1} name="ELENA" l2="74 AÑOS · HACE CONSERVAS DESDE LOS 24 · EL RANCHO" l2at={at("Yo soy Elena") + 0.4} />);
    P(<Chips key="crops" t={t} at={at("tomate duraznos")} items={["TOMATES", "DURAZNOS", "CHILES", "EJOTES", "MERMELADAS", "SALSA"]} out={at("Me enseñó mi suegra") - 0.05} y={880} />);
    P(<Tag key="olla" t={t} at={at("despostillado")} x={960} y={420} dx={300} dy={-120} text="LA MISMA OLLA DE PELTRE" col={COL.ink} out={at("Mi primer verano") - 0.05} size={40} />);
    P(<BigNum key="40" t={t} at={at("40 frascos")} text="40" x={1440} y={330} size={230} col={COL.red} sub="FRASCOS DE DURAZNOS PERDIDOS" out={at("Así que vamos") - 0.1} />);
    P(<DrawX key="x40" t={t} at={at("Ella no dijo nada")} x={1300} y={180} w={300} h={300} out={at("Así que vamos") - 0.1} />);
    P(<Words key="nunca" t={t} items={[{ at: at("no me iba a volver"), txt: "NUNCA MÁS." }]} out={at("Así que vamos") - 0.1} y={900} size={90} />);
    // ---------- 1 · baño María sin ácido ----------
    P(<StepTitle key="s1" t={t} at={at("No hagas esto número uno")} n={1} kicker={NO} name="BAÑO MARÍA A LO QUE NO ES ÁCIDO" out={at("por eso va primero") + 1.2} />);
    P(<BigNum key="100a" t={t} at={at("llega a 100 grados")} text="100 °C" x={1460} y={300} size={170} col={COL.amber} sub="LO MÁS CALIENTE QUE LLEGA" out={at("Y eso alcanza") - 0.1} />);
    P(<Chips key="aci" t={t} at={at("Durazno manzana")} items={["DURAZNOS", "MANZANAS", "MERMELADAS", "ENCURTIDOS", "TOMATE + ÁCIDO"]} out={at("El ácido hace") - 0.05} y={880} />);
    P(<Words key="esc" t={t} items={[{ at: at("El ácido hace"), txt: "ÁCIDO = LOS BICHOS NO CRECEN", col: GREEN }]} out={at("Pero los ejotes") - 0.05} y={900} size={72} />);
    P(<Chips key="noac" t={t} at={at("Pero los ejotes")} items={["EJOTES", "ELOTE", "ZANAHORIA", "PAPA", "FRIJOLES", "CALDO", "CARNE"]} out={at("Esos no son") - 0.05} y={880} />);
    P(<Words key="sin" t={t} items={[{ at: at("Esos no son"), txt: "SIN ÁCIDO", col: COL.red }]} out={at("Sus esporas") - 0.05} y={160} size={110} />);
    P(<Words key="bot" t={t} items={[{ at: at("del botulismo"), txt: "BOTULISMO", col: COL.red }]} out={at("Para matarla") - 0.05} y={900} size={96} />);
    P(<BigNum key="116" t={t} at={at("116")} text="116 °C" x={1460} y={300} size={170} col={COL.red} sub="PARA MATAR LAS ESPORAS" out={at("Mi vecina") - 0.1} />);
    PinTag("wb", "W:jar:water", PT.jarMid, 1.0, "BAÑO MARÍA: SOBREVIVEN", COL.red, -300, -160, 34);
    PinTag("pc", "W:jar:press", PT.jarMid, 1.2, "OLLA A PRESIÓN: MUEREN", GREEN, -300, -160, 34);
    P(<Stamp key="3h" t={t} at={at("tres horas")} text="3 HORAS ≠ SEGURO" x={1350} y={280} size={92} out={at("Decía que así") + 1.0} />);
    P(<Words key="tf" t={t} items={[{ at: at("el tiempo no arregla"), txt: "EL TIEMPO NO ARREGLA LA TEMPERATURA" }, { at: at("sigue en 100"), txt: "SIGUE EN 100 °C", col: COL.amber }]} out={at("Así que esta es mi regla") - 0.1} y={900} size={68} />);
    P(<Versus key="vs1" t={t} y={730} at={at("Si es dulce")} out={at("No hagas esto número 2") - 0.1} title="MI REGLA" L={{ label: "DULCE O AGRIO", val: "BAÑO MARÍA", h: 0.55, col: COL.amber, mark: "ok" }} R={{ label: "SIMPLE", val: "PRESIÓN", h: 0.9, col: COL.red }} />);
    // ---------- 2 · tomate sin ácido ----------
    P(<StepTitle key="s2" t={t} at={at("No hagas esto número 2")} n={2} kicker={NO} name="TOMATE SIN ÁCIDO" out={at("Ni un frasco") - 0.05} />);
    P(<Words key="ne" t={t} items={[{ at: at("Ni un frasco"), txt: "NI UN FRASCO." }, { at: at("Sin excepción"), txt: "SIN EXCEPCIÓN.", col: COL.amber }]} out={at("Tu abuela") - 0.05} y={900} size={84} />);
    P(<Words key="raya" t={t} items={[{ at: at("son más dulces"), txt: "MÁS DULCES = JUSTO EN LA RAYA" }, { at: at("no se siente en la boca"), txt: "NO SE SIENTE EN LA BOCA", col: COL.red }]} out={at("Entonces en cada frasco") - 0.05} y={900} size={68} />);
    P(<TimeBars key="lim" t={t} rows={[
      { at: at("dos cucharadas"), label: "FRASCO DE LITRO", val: "2 CDAS DE LIMÓN", frac: 1, col: "#f2e27a" },
      { at: at("una cucharada"), label: "MEDIO LITRO", val: "1 CDA DE LIMÓN", frac: 0.5, col: "#f2e27a" },
      { at: at("media cucharadita"), label: "LITRO", val: "½ CDTA DE CÍTRICO", frac: 0.5, col: COL.ice }]} out={at("Va en el fondo") + 2.2} />);
    PinTag("bt", "W:jar:acid", PT.jarBot, 0.6, "EN EL FRASCO VACÍO · PRIMERO", "#f2e27a", -320, -60);
    P(<Stamp key="btl" t={t} at={at("no un limón fresco")} text="DE BOTELLA — NO FRESCO" x={1340} y={260} size={86} out={at("En la salsa") - 0.05} />);
    P(<Words key="az" t={t} items={[{ at: at("pizquita de azúcar"), txt: "+ UNA PIZCA DE AZÚCAR" }]} out={at("No hagas esto número 3") - 0.05} y={900} size={76} />);
    // ---------- 3 · frascos de mayonesa y tapas viejas ----------
    P(<StepTitle key="s3" t={t} at={at("No hagas esto número 3")} n={3} kicker={NO} name="FRASCOS DE MAYONESA Y TAPAS VIEJAS" out={at("Yo sé que da") - 0.05} />);
    P(<Words key="del" t={t} items={[{ at: at("vidrio es más delgado"), txt: "VIDRIO MÁS DELGADO", col: COL.red }, { at: at("se te quiebra"), txt: "SE QUIEBRA EN LA OLLA" }]} out={at("Y la tapa de rosca") - 0.05} y={900} size={76} />);
    P(<Chips key="gom" t={t} at={at("gomita aplastada")} items={["GOMITA APLASTADA", "ÓXIDO EN LA ORILLA"]} out={at("Parece que cerró") - 0.05} y={880} />);
    P(<Words key="pq" t={t} items={[{ at: at("Parece que cerró"), txt: "PARECE QUE CERRÓ… Y NO.", col: COL.red }]} out={at("Los frascos de conserva") - 0.05} y={900} size={84} />);
    P(<Chips key="reu" t={t} at={at("Los frascos de conserva")} items={["FRASCOS: 20 AÑOS", "AROS: SE REÚSAN", "TAPA PLANA: NUEVA CADA VEZ"]} out={at("Y ya no hace falta") - 0.05} y={880} />);
    P(<Stamp key="1980a" t={t} at={at("1980")} text="FRASCOS DE 1980" x={1340} y={270} size={84} out={at("Los aros también") + 1.0} />);
    P(<Words key="once" t={t} items={[{ at: at("esa sella bien"), txt: "LA GOMITA ROJA SELLA UNA VEZ", col: COL.red }]} out={at("Y ya no hace falta") - 0.05} y={160} size={72} />);
    P(<Stamp key="nob" t={t} at={at("ya no hace falta")} text="NO HACE FALTA HERVIRLAS" x={1330} y={270} size={80} out={at("Eso me costó") - 0.05} />);
    // ---------- 4 · voltear los frascos ----------
    P(<StepTitle key="s4" t={t} at={at("No hagas esto número 4")} n={4} kicker={NO} name="VOLTEAR LOS FRASCOS BOCA ABAJO" out={at("No hagas esto número 4") + 3.4} />);
    P(<Words key="nh" t={t} items={[{ at: at("nunca hirvieron"), txt: "EL FRASCO Y EL AIRE NUNCA HIRVIERON", col: COL.red }]} out={at("Y el moho") - 0.05} y={900} size={66} />);
    P(<Words key="mo" t={t} items={[{ at: at("Y el moho"), txt: "MOHO DEBAJO DEL SELLO", col: COL.red }]} out={at("Yo lo dejé") - 0.05} y={900} size={80} />);
    PinTag("mold", "W:jar:inv|1", PT.jarMid, 2.6, "PELUSA BLANCA BAJO LA TAPA", COL.red, -320, -160);
    P(<Words key="par" t={t} items={[{ at: at("y se encoge"), txt: "SE ENCOGE · SE RAJA · ENTRA EL MOHO", col: COL.red }]} out={at("Tapa nueva y baño") - 0.05} y={900} size={64} />);
    P(<Stamp key="10m" t={t} at={at("Tapa nueva y baño")} text="TAPA NUEVA + BAÑO MARÍA · 10 MIN" x={1180} y={270} size={70} out={at("No hagas esto número 5") - 0.05} />);
    // ---------- 5 · frascos fríos en agua caliente ----------
    P(<StepTitle key="s5" t={t} at={at("No hagas esto número 5")} n={5} kicker={NO} name="FRASCOS FRÍOS EN AGUA CALIENTE" out={at("El vidrio no aguanta") - 0.05} />);
    PinTag("ts", "W:canner:crack", PT.canLids, 1.0, "AFUERA CALIENTE · ADENTRO FRÍO", COL.red, 330, -80);
    P(<Words key="tsh" t={t} items={[{ at: at("choque térmico"), txt: "CHOQUE TÉRMICO", col: COL.red }]} out={at("Entonces yo mantengo") - 0.05} y={160} size={110} />);
    P(<CheckList key="hot" t={t} title="SIEMPRE" rows={[{ at: at("Frasco caliente"), txt: "FRASCO CALIENTE" }, { at: at("comida caliente agua"), txt: "COMIDA CALIENTE" }, { at: at("agua caliente siempre"), txt: "AGUA CALIENTE" }]} out={at("Si llenas el frasco") - 0.05} />);
    P(<BigNum key="60" t={t} at={at("60 grados")} text="60 °C" x={460} y={300} size={150} col={COL.amber} sub="FRUTA CRUDA" out={at("Y luego sube") + 1.5} />);
    P(<BigNum key="80" t={t} at={at("80")} text="80 °C" x={1460} y={300} size={150} col={COL.red} sub="COMIDA CALIENTE" out={at("Y luego sube") + 1.5} />);
    P(<DrawX key="ovx" t={t} at={at("en el horno") + 0.2} x={560} y={240} w={800} h={560} out={at("El calor seco") - 0.1} />);
    P(<Words key="ovw" t={t} items={[{ at: at("El calor seco"), txt: "CALOR SECO = VIDRIO DÉBIL", col: COL.red }]} out={at("El agua calienta") - 0.05} y={900} size={80} />);
    P(<Words key="wyf" t={t} items={[{ at: at("El agua es tu amiga"), txt: "EL AGUA ES TU AMIGA", col: COL.ice }]} out={at("No hagas esto número 6") - 0.05} y={900} size={84} />);
    // ---------- 6 · llenar hasta el borde ----------
    P(<StepTitle key="s6" t={t} at={at("No hagas esto número 6")} n={6} kicker={NO} name="LLENAR HASTA EL BORDE" out={at("Arriba siempre") - 0.05} />);
    PinTag("hs", "W:jar:fill", PT.head, 1.4, "ESPACIO DE CABEZA", COL.amber);
    P(<TimeBars key="hsb" t={t} rows={[
      { at: at("medio centímetro"), label: "MERMELADA · JALEA", val: "0,5 CM", frac: 0.2, col: COL.amber },
      { at: at("centímetro y medio"), label: "FRUTA · TOMATE · ENCURTIDOS", val: "1,5 CM", frac: 0.6, col: COL.amber },
      { at: at("dos centímetros y medio"), label: "OLLA A PRESIÓN", val: "2,5 CM", frac: 1, col: COL.red }]} out={at("Yo uso esta reglita") - 0.05} />);
    P(<Stamp key="thb" t={t} at={at("primer pliegue")} text="PUNTA → 1er PLIEGUE" x={1330} y={260} size={80} out={at("Mide el tuyo") + 1.8} />);
    PinTag("ov", "W:jar:over", PT.rim, 1.6, "COMIDA EN EL SELLO", COL.red, 320, -140);
    P(<Versus key="hs2" t={t} y={730} at={at("no va a sellar") - 0.2} out={at("Esos 40 frascos") - 0.1} title="EL ESPACIO" L={{ label: "MUY POQUITO", val: "NO SELLA", h: 0.4, col: COL.red, mark: "x" }} R={{ label: "DEMASIADO", val: "CAFÉ · NO SE HUNDE", h: 0.8, col: COL.red, mark: "x" }} />);
    P(<Words key="hh" t={t} items={[{ at: at("Los llené hasta arriba"), txt: "LOS LLENÉ HASTA ARRIBA" }, { at: at("Ni más ni menos"), txt: "1,5 CM. NI MÁS, NI MENOS.", col: COL.amber }]} out={at("Y antes de tapar") - 0.05} y={900} size={76} />);
    P(<Words key="ap" t={t} items={[{ at: at("saca las burbujas"), txt: "AIRE ATRAPADO", col: COL.ice }]} out={at("Vas a ver cómo suben") + 1.0} y={160} size={96} />);
    P(<Words key="lv" t={t} items={[{ at: at("Vuelves a medir"), txt: "BAJA EL NIVEL → COMPLETAS" }]} out={at("Luego limpias") - 0.05} y={900} size={74} />);
    P(<Chips key="rim" t={t} at={at("Una semilla")} items={["UNA SEMILLA", "UNA GOTITA", "UN PEDACITO DE CÁSCARA"]} out={at("Para encurtido") - 0.05} y={880} />);
    P(<Stamp key="vin" t={t} at={at("poquito de vinagre")} text="GRASA O SAL → VINAGRE" x={1330} y={260} size={80} out={at("por frasco") - 0.3} />);
    P(<Timer key="5s" t={t} at={at("por frasco") - 0.4} out={at("Y es la diferencia") - 0.05} secs={5} label="SEGUNDOS POR FRASCO" />);
    P(<Versus key="sf" t={t} y={730} at={at("Y es la diferencia")} out={at("No hagas esto número 7") - 0.05} L={{ label: "LIMPIO", val: "SELLA", h: 0.7, col: GREEN, mark: "ok" }} R={{ label: "SIN LIMPIAR", val: "AL REFRI", h: 0.45, col: COL.red, mark: "x" }} />);
    // ---------- 7 · apretar el aro ----------
    P(<StepTitle key="s7" t={t} at={at("No hagas esto número 7")} n={7} kicker={NO} name="APRETAR EL ARO CON TODA TU FUERZA" out={at("Mira lo que pasa") - 0.05} />);
    PinTag("ai", "W:jar:air", PT.lid, 1.2, "EL AIRE SALE", COL.ice, 330, -120);
    if (inB(t, "W:jar:pop")) { const q = pin(t, "W:jar:pop", PT.lid), a = startOf("W:jar:pop"); P(<Tag key="vac" t={t} at={a + 0.6} x={q.x} y={q.y} dx={-330} dy={-140} text="VACÍO = TU SELLO" col={COL.amber} out={endOf("W:jar:pop")} />); P(<Stamp key="pop1" t={t} at={a + 2.05} text="¡POP!" x={q.x + 260} y={q.y - 160} size={120} rot={-8} out={a + 3.6} />); }
    PinTag("bd", "W:jar:tight", PT.lid, 1.6, "NO SALE → SE DOBLA LA TAPA", COL.red, 320, -140);
    P(<Stamp key="yem" t={t} at={at("puras yemas")} text="CON LAS YEMAS · HASTA QUE SE DETIENE" x={960} y={250} size={50} out={at("Mi esposo") - 0.05} />);
    P(<Stamp key="ram" t={t} at={at("Ramón ve a ordeñar")} text="“RAMÓN, VE A ORDEÑAR ALGO.”" x={1200} y={260} size={70} rot={-5} out={at("Y cuando salen") - 0.05} />);
    P(<Words key="flo" t={t} items={[{ at: at("no lo apriete"), txt: "¿ARO FLOJITO? NO LO APRIETES", col: COL.red }]} out={at("No hagas esto número 8") - 0.05} y={900} size={74} />);
    // ---------- 8 · el reloj y la altura ----------
    P(<StepTitle key="s8" t={t} at={at("No hagas esto número 8")} n={8} kicker={NO} name="EL RELOJ ANTES DEL HERVOR" out={at("Y no te olvides") + 1.8} />);
    P(<Words key="rk" t={t} items={[{ at: at("nunca en el fondo"), txt: "EN LA REJILLA — NUNCA EN EL FONDO" }]} out={at("El agua tiene que tapar") - 0.05} y={900} size={70} />);
    if (inB(t, "W:canner:load|3")) { const q = pin(t, "W:canner:load|3", PT.canWater); P(<Tag key="dedos" t={t} at={at("tapar las tapas")} x={q.x} y={q.y} dx={300} dy={-150} text="2–3 DEDOS SOBRE LAS TAPAS" col={COL.ice} out={endOf("W:canner:load|3")} />); }
    P(<Words key="kt" t={t} items={[{ at: at("de la tetera"), txt: "AGUA CALIENTE — NUNCA FRÍA", col: COL.amber }]} out={at("Tapa puesta") - 0.05} y={900} size={70} />);
    P(<Words key="tm" t={t} items={[{ at: at("no arranca cuando metes"), txt: "✗ AL METER LOS FRASCOS" }, { at: at("unas burbujitas"), txt: "✗ CON UNAS BURBUJITAS" }, { at: at("hervor fuerte"), txt: "✓ HERVOR FUERTE", col: GREEN }]} out={at("Ahí pones el reloj") + 1.5} y={900} size={70} />);
    P(<Stamp key="zero" t={t} at={at("desde cero")} text="SE PARA EL HERVOR = DESDE CERO" x={1250} y={270} size={70} out={at("Y aquí está lo que") - 0.05} />);
    P(<BigNum key="pla" t={t} at={at("En la playa")} text="100 °C" x={460} y={300} size={150} col={COL.amber} sub="EN LA PLAYA" out={at("Sigue burbujeando") + 2.0} />);
    P(<BigNum key="cdmx" t={t} at={at("92")} text="92 °C" x={1460} y={300} size={150} col={COL.ice} sub="CIUDAD DE MÉXICO" out={at("Sigue burbujeando") + 2.0} />);
    P(<TimeBars key="alt" t={t} rows={[
      { at: at("De 300 a 900"), label: "300–900 M", val: "+5 MIN", frac: 0.25, col: COL.ice },
      { at: at("De 900 a 1800"), label: "900–1800 M", val: "+10 MIN", frac: 0.5, col: COL.ice },
      { at: at("De 1800 a 2400"), label: "1800–2400 M", val: "+15 MIN", frac: 0.75, col: COL.amber },
      { at: at("arriba de eso"), label: "MÁS DE 2400 M", val: "+20 MIN", frac: 1, col: COL.red }]} out={at("Mi hermana") + 0.5} />);
    P(<BigNum key="zac" t={t} at={at("Zacatecas")} text="2400 M" x={1450} y={300} size={140} col={COL.ice} sub="SU HERMANA · ZACATECAS" out={at("15 minutos más") - 0.05} />);
    P(<BigNum key="15m" t={t} at={at("15 minutos más")} text="+15 MIN" x={960} y={420} size={190} col={COL.amber} sub="ESO ERA TODO" out={at("No hagas esto número 9") - 0.05} />);
    // ---------- 9 · sacarlos corriendo ----------
    P(<StepTitle key="s9" t={t} at={at("No hagas esto número 9")} n={9} kicker={NO} name="SACAR LOS FRASCOS CORRIENDO" out={at("Cuando suena el reloj") - 0.05} />);
    P(<Timer key="w5" t={t} at={at("Esperas 5 minutos")} out={at("Los frascos siguen") + 2.5} secs={5} label="MINUTOS · SIN TAPA, SIN FUEGO" />);
    P(<Words key="sy" t={t} items={[{ at: at("se te sale por debajo"), txt: "SE SALE EL ALMÍBAR = SE PIERDE EL SELLO", col: COL.red }]} out={at("A los 5 minutos") - 0.05} y={900} size={64} />);
    P(<Stamp key="su" t={t} at={at("Derechito para arriba")} text="DERECHITO PARA ARRIBA" x={1300} y={260} size={92} out={at("Lo pones en una toalla") - 0.05} />);
    P(<CheckList key="cool" t={t} title="AL ENFRIAR" rows={[{ at: at("toalla doblada"), txt: "TOALLA DOBLADA" }, { at: at("Dejas un espacio"), txt: "ESPACIO ENTRE FRASCOS" }, { at: at("corrientes de aire"), txt: "SIN CORRIENTES DE AIRE" }, { at: at("No los toques"), txt: "NO TOCAR 12–24 H" }]} out={at("Y entonces lo vas") - 0.05} />);
    P(<Words key="pp" t={t} items={[{ at: at("Pop pop pop"), txt: "POP… POP… POP…", col: COL.amber }]} out={at("Cuando era joven") + 0.8} y={900} size={96} />);
    P(<Words key="inv" t={t} items={[{ at: at("Cada pop era"), txt: "UNA COSA MÁS PARA EL INVIERNO" }]} out={at("A la mañana siguiente") - 0.05} y={900} size={72} />);
    P(<Words key="fgt" t={t} items={[{ at: at("con el dedo"), txt: "LA PRUEBA DEL DEDO", col: GREEN }]} out={at("Si está hundida") - 0.1} y={160} size={96} />);
    P(<Versus key="seal" t={t} y={730} at={at("Si está hundida")} out={at("Eso no es un fracaso") - 0.05} L={{ label: "HUNDIDA, NO SE MUEVE", val: "SELLÓ", h: 0.75, col: GREEN, mark: "ok" }} R={{ label: "SUBE, BAJA Y HACE CLIC", val: "AL REFRI", h: 0.45, col: COL.red, mark: "x" }} />);
    P(<Words key="des" t={t} items={[{ at: at("Eso es el desayuno"), txt: "ESO ES EL DESAYUNO.", col: COL.amber }]} out={at("quita los aros") - 0.05} y={900} size={96} />);
    P(<Words key="aro" t={t} items={[{ at: at("sin el aro"), txt: "SIN ARO → LA TAPA MALA SE VE" }, { at: at("engañarte"), txt: "CON ARO → TE ENGAÑA", col: COL.red }]} out={at("Y un aro mojado") + 1.5} y={900} size={72} />);
    P(<Thermo key="th" t={t} at={at("Entre 10 y 20")} x={1500} y={480} from={10} to={20} unit="°C" out={at("antes de un año") + 1.5} />);
    P(<Chips key="st" t={t} at={at("fresco y oscuro")} items={["FRESCO", "OSCURO", "10–20 °C", "ANTES DE UN AÑO"]} out={at("Ahora sí") - 0.05} y={880} />);
    // ---------- la revelación: el error que nunca cometí ----------
    P(<Words key="rev" t={t} items={[{ at: at("El error que yo nunca"), txt: "EL ERROR QUE NUNCA COMETÍ", col: COL.amber }]} out={at("probé un frasco dudoso") - 0.05} y={160} size={90} />);
    PinTag("bad2", "W:aisle:bad|2", BADP, 1.4, "EL FRASCO DUDOSO", COL.red, -320, -150);
    P(<Stamp key="prob" t={t} at={at("probé un frasco dudoso")} text="NUNCA LO PROBÉ" x={1330} y={270} size={110} out={at("Porque mira lo que pasa") - 0.05} />);
    P(<Words key="avi" t={t} items={[{ at: at("no siempre avisa"), txt: "NO SIEMPRE AVISA", col: COL.red }]} out={at("El frasco puede verse") - 0.05} y={160} size={100} />);
    PinTag("blg2", "W:jar:bulge|2", PT.lid, 0.8, "A VECES INFLA LA TAPA", COL.red);
    P(<Words key="vb" t={t} items={[{ at: at("El frasco puede verse"), txt: "PUEDE VERSE Y OLER BIEN", col: COL.red }]} out={at("Y la toxina") - 0.05} y={900} size={80} />);
    P(<Words key="hos" t={t} items={[{ at: at("una probadita"), txt: "UNA PROBADITA → AL HOSPITAL", col: COL.red }]} out={at("No es un dolor") - 0.05} y={900} size={76} />);
    P(<CheckList key="sen" t={t} title="MIS SEÑALES" rows={[
      { at: at("La tapa bombada"), txt: "TAPA ABOMBADA" },
      { at: at("Líquido que escurre"), txt: "ESCURRE POR FUERA" },
      { at: at("Burbujitas que suben", at("La tapa bombada")), txt: "BURBUJAS QUE SUBEN SOLAS" },
      { at: at("Espuma o un chorro"), txt: "ESPUMA O CHORRO" },
      { at: at("El líquido turbio"), txt: "TURBIO, COMO LECHOSO" },
      { at: at("Un olor raro"), txt: "OLOR RARO" },
      { at: at("aunque sea un puntito"), txt: "MOHO, AUNQUE SEA UN PUNTITO" }]} out={at("Y lo que haces es esto") - 0.05} />);
    P(<CheckList key="tir" t={t} title="ASÍ SE TIRA" rows={[{ at: at("esto no lo abre"), txt: "NO LO ABRES" }, { at: at("te pones guante"), txt: "GUANTES" }, { at: at("en otra bolsa"), txt: "BOLSA DENTRO DE OTRA BOLSA" }, { at: at("ni un niño"), txt: "LEJOS DE NIÑOS Y PERROS" }]} out={at("Y si se te derramó") - 0.05} />);
    P(<BigNum key="clo" t={t} at={at("una parte de cloro")} text="1 : 5" x={1450} y={300} size={200} col={COL.ice} sub="CLORO : AGUA · 15 MINUTOS" out={at("Y si alguien en tu casa") - 0.05} />);
    P(<Chips key="sin" t={t} at={at("ver doble")} items={["VE DOBLE", "PÁRPADOS CAÍDOS", "LE CUESTA TRAGAR", "→ AL HOSPITAL HOY"]} out={at("Ante la duda") - 0.05} y={880} />);
    P(<Words key="dud" t={t} items={[{ at: at("Ante la duda"), txt: "ANTE LA DUDA…" }]} out={at("Ante la duda") + 1.0} y={900} size={96} />);
    P(<Stamp key="tir2" t={t} at={at("Ante la duda") + 1.05} text="¡TÍRALO!" x={960} y={840} size={200} rot={-6} out={at("Un frasco de tomate") + 1.2} />);
    P(<Words key="val" t={t} items={[{ at: at("Tú vales mucho"), txt: "TÚ VALES MUCHO MÁS QUE ESO." }]} out={at("Y una más") - 0.05} y={900} size={80} />);
    // ---------- ajos en aceite ----------
    P(<Words key="ajo" t={t} items={[{ at: at("Los ajos en aceite"), txt: "AJO EN ACEITE", col: COL.red }]} out={at("Ese frasquito") + 2.0} y={160} size={110} />);
    P(<Chips key="ajo2" t={t} at={at("sin aire sin ácido")} items={["SIN AIRE", "SIN ÁCIDO", "A TEMPERATURA DE CUARTO", "= BOTULISMO"]} out={at("Si lo haces") - 0.05} y={880} />);
    P(<Versus key="ajo3" t={t} y={730} at={at("Si lo haces")} out={at("Y ahora la cuenta") - 0.05} title="AJO EN ACEITE" L={{ label: "REFRI", val: "4 DÍAS", h: 0.5, col: GREEN, mark: "ok" }} R={{ label: "REPISA", val: "NUNCA", h: 0.85, col: COL.red, mark: "x" }} />);
    // ---------- el sistema de los 500 ----------
    P(<BigNum key="500" t={t} at={at("500 frascos")} text="500" x={1450} y={300} size={210} col={COL.amber} sub="FRASCOS AL AÑO · UNA SOLA MUJER" out={at("no es un día") - 0.05} />);
    P(<Words key="sys" t={t} items={[{ at: at("Es un sistema"), txt: "ES UN SISTEMA.", col: COL.amber }]} out={at("Nunca hago todo") - 0.05} y={900} size={96} />);
    P(<Words key="eq" t={t} items={[{ at: at("Tres ollas por día"), txt: "3 OLLAS AL DÍA" }, { at: at("7 frascos"), txt: "× 7 FRASCOS" }, { at: at("20 frascos al día"), txt: "≈ 20 FRASCOS AL DÍA", col: COL.amber }, { at: at("25 días"), txt: "× 25 DÍAS = 500", col: GREEN }]} out={at("Cada semana") + 1.5} y={160} size={84} />);
    P(<Chips key="line" t={t} at={at("de izquierda a derecha")} items={["LAVAR Y CORTAR", "FRASCOS CALIENTES", "EMBUDO · REGLITA · TRAPO", "OLLA", "TOALLAS"]} out={at("nada se regresa") + 0.8} y={880} />);
    P(<Stamp key="cua" t={t} at={at("50 años de cuadernos")} text="50 AÑOS DE CUADERNOS" x={1330} y={260} size={80} out={at("de duranos en") - 0.05} />);
    P(<Versus key="pr" t={t} y={730} at={at("en almíbar en la tienda")} out={at("El frasco lo tengo") - 0.05} title="UN FRASCO DE DURAZNOS" L={{ label: "TIENDA", val: "CARO", h: 0.9, col: COL.red, mark: "x" }} R={{ label: "EL DE ELENA", val: "FRUTA + TAPA", h: 0.2, col: GREEN, mark: "ok" }} />);
    P(<Tag key="1980b" t={t} at={at("El frasco lo tengo")} x={960} y={600} dx={-330} dy={-200} text="EL MISMO FRASCO DESDE 1980" col={COL.ink} out={at("El invierno que") - 0.05} />);
    P(<BigNum key="11" t={t} at={at("11 días")} text="11 DÍAS" x={1450} y={300} size={160} col={COL.ice} sub="SIN LUZ · LA HELADA" out={at("comimos como reyes") + 1.4} />);
    P(<Words key="tie" t={t} items={[{ at: at("No fui a la tienda"), txt: "NI UNA VUELTA A LA TIENDA" }]} out={at("Así que esta es tu tarea") - 0.05} y={900} size={76} />);
    // ---------- tarea + cierre ----------
    P(<CheckList key="hw" t={t} title="TU TAREA" rows={[{ at: at("Revisa tu despensa"), txt: "LO ABOMBADO, A LA BASURA" }, { at: at("sus dos cucharadas"), txt: "2 CDAS DE LIMÓN AL TOMATE" }]} out={at("Si esto te sirvió") - 0.05} />);
    PinTag("bad4", "W:aisle:bad|4", BADP, 1.6, "¿ABOMBADO? SIN PROBARLO", COL.red, -320, -150);
    P(<Words key="sub" t={t} items={[{ at: at("suscríbete"), txt: "SUSCRÍBETE" }, { at: at("la campanita"), txt: "+ ACTIVA LA CAMPANITA", col: COL.amber }]} out={at("La semana que viene") - 0.05} y={900} size={84} />);
    P(<NextCard key="nw" t={t} at={at("La semana que viene")} subAt={at("cinco conservas") + 0.4} out={at("Y cuéntame") - 0.05} title="PRÓXIMO DÍA DE CONSERVAS" tag="PRÓXIMO VIDEO" sub={["SUSCRÍBETE", "SUSCRITO ✓"]}><div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "radial-gradient(ellipse at 50% 40%, #6a3c14, #1a0d05 75%)", fontFamily: FONT, fontWeight: 900, fontSize: 66, lineHeight: 1.0, paddingBottom: 96, boxSizing: "border-box", color: COL.amber, textShadow: "0 6px 0 #3a1c06, 0 14px 30px rgba(0,0,0,.7)" }}>5 CONSERVAS<br />DE MI DESPENSA</div></NextCard>);
    P(<Words key="q" t={t} items={[{ at: at("Y cuéntame"), txt: "¿CUÁL DE ESTOS 9 ERRORES", col: COL.amber }, { at: at("te enseñaron en tu casa"), txt: "TE ENSEÑARON EN TU CASA?" }]} out={at("Yo empiezo") - 0.05} y={160} size={76} />);
    P(<Words key="mine" t={t} items={[{ at: at("Yo empiezo"), txt: "LA DE ELENA: VOLTEARLOS BOCA ABAJO" }, { at: at("Ahora te toca"), txt: "TE TOCA ↓", col: COL.amber }]} out={TEND} y={900} size={72} />);
    return L;
  },
});

export const Full: React.FC = () => {
  useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}><M.Body /></AbsoluteFill>;
};
export const clipPlan = M.clipPlan;
export const beatTable = M.beatTable;
