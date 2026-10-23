// tdccalor3 · EL RESTO (locución 153,5 → final). Mismo mundo y misma cámara que el minuto 1; el avatar entra y sale por la boca
// de su estufa; las tomas reales (LTX con primer cuadro / fotos) van por tramos; cada pieza se ancla a la frase del ASR.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { PT, screenOf } from "./taller3d";
import { BigNum, COL, FONT, Flash, P, Portal, Tag, e, ei, extrude, spr } from "./lib";
import { CheckList, Mistake, NextCard, StepTitle, TempChart, Words } from "./comps2";
import { AV_STOVE, Avatar, Chip, Clip, Desc, Shot, Stamp, Take, WIN, World } from "./parts";

export const REST_END = 1228.5;

// tramos de toma real: [desde, hasta, tipo, id, foto-de-respaldo, segundo de arranque de la toma]
type Seg = [number, number, "take" | "clip" | "shot" | "jpg", string, string?, number?];
const SEGS: Seg[] = [
  [170.6, 179.3, "shot", "f_cemento"],
  [207.9, 213.6, "jpg", "img_ladrillo"],
  [238.1, 248.1, "clip", "b_estalla_s2", undefined, 1],
  [252.8, 263.5, "take", "c_golpe", "f_golpe"],
  [268.6, 281.8, "shot", "f_secando"],
  [326.4, 330.3, "jpg", "img_tambor"],
  [335.2, 340.6, "take", "c_enjuague", "f_enjuague"],
  [340.6, 346.4, "take", "c_quema", "f_quema"],
  [350.6, 357.0, "take", "c_amoladora", "f_amoladora"],
  [368.7, 373.2, "take", "c_rejilla", "f_rejilla"],
  [474.8, 479.2, "take", "c_barro", "f_barro"],
  [483.4, 491.3, "take", "c_pared", "f_pared"],
  [567.5, 577.7, "shot", "f_tabla"],
  [616.2, 625.6, "shot", "f_humo_negro"],
  [634.3, 639.3, "take", "c_carga", "f_carga"],
  [639.3, 646.5, "clip", "b_humo_ok"],
  [667.0, 680.2, "take", "c_palma", "f_palma"],
  [700.3, 710.5, "take", "c_3am", "f_3am"],
  [716.0, 728.7, "clip", "b_escarcha"],
  [749.0, 761.2, "clip", "p_taza_s2"],
  [817.5, 823.8, "take", "c_silla", "f_silla"],
  [852.8, 861.5, "take", "c_cerrar", "f_cerrar"],
  [866.4, 877.6, "clip", "p_termica_s1"],
  [881.8, 894.0, "clip", "p_termica_s2"],
  [937.0, 945.8, "shot", "f_vibora"],
  [981.6, 994.3, "take", "c_detector", "f_detector"],
  [999.2, 1010.4, "take", "c_ventana", "f_ventana"],
  [1032.7, 1044.9, "take", "c_cenizas", "f_cenizas"],
  [1132.0, 1143.2, "shot", "f_salamandra"],
  [1165.5, 1177.7, "jpg", "img_medir"],
  [1182.4, 1193.1, "shot", "f_termo"],
];

const base = (t: number): React.ReactNode => {
  const g = SEGS.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, , kind, id, img, from = 0] = g;
  if (kind === "shot") return <Shot k={id} t={t} a={a} />;
  if (kind === "jpg") return <AbsoluteFill style={{ transform: `scale(${1.04 + 0.1 * e(t, a, a + 7)})` }}><Img src={staticFile(P + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>;
  if (kind === "take") return <Take k={id} img={img!} t={t} a={a} />;
  return <Clip k={id} t={t} a={a} from={from}><World t={t} /></Clip>;
};

const Stage: React.FC<{ t: number }> = ({ t }) => {
  const w = WIN.find((x) => t >= x.ms - 0.32 && t < x.me + 0.42);
  if (!w) return <>{base(t)}</>;
  if (t < w.ms) return <>{base(t)}<Portal x={AV_STOVE.x} y={AV_STOVE.y} r={ei(t, w.ms - 0.32, w.ms)}><Avatar t={t} /></Portal></>;
  if (t < w.me) return <Avatar t={t} />;
  return <><Avatar t={t} /><Portal x={AV_STOVE.x} y={AV_STOVE.y} r={ei(t, w.me, w.me + 0.42)}>{base(t)}</Portal></>;
};

// tarjeta de comentario que pide la respuesta del espectador
const AskCard: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.9));
  return <div style={{ position: "absolute", left: 960, top: 300, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, background: "rgba(18,20,24,.95)", borderRadius: 26, padding: "26px 40px", width: 1100, fontFamily: FONT, boxShadow: "0 50px 100px rgba(0,0,0,.7)" }}>
    <div style={{ color: "rgba(255,255,255,.6)", fontWeight: 800, fontSize: 28, letterSpacing: 3 }}>💬 CUÉNTAME EN LOS COMENTARIOS</div>
    <div style={{ color: "#fff", fontWeight: 900, fontSize: 52, marginTop: 10, lineHeight: 1.15 }}>Antes amanecía a <span style={{ color: COL.ice }}>__ °C</span> · ahora a <span style={{ color: COL.amber }}>__ °C</span></div>
  </div>;
};

// la página 71 de verdad (el libro 3D abierto queda negro en el render): tarjeta con la página y sus 3 marcas
const Page71: React.FC<{ t: number }> = ({ t }) => {
  const o = e(t, 772.0, 772.3) * (1 - e(t, 797.6, 798.1));
  if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, 772.0, 0.8));
  const hi = (a: number, l: string, r: string, top: string, h: string, c: string) =>
    <div style={{ position: "absolute", left: l, right: r, top, height: h, background: c, opacity: 0.38 * e(t, a, a + 0.5), borderRadius: 6, transformOrigin: "0 50%", transform: `scaleX(${e(t, a, a + 0.5)})` }} />;
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: "rgba(6,4,3,.55)", backdropFilter: "blur(14px)" }} />
    <div style={{ position: "absolute", left: 1290, top: 560, perspective: 1600 }}>
      <div style={{ position: "relative", transform: `translate(-50%,-50%) translateZ(${(1 - k) * -700}px) rotateY(${-14 + 5 * k}deg) rotateX(5deg) rotateZ(2deg)`, width: 640, boxShadow: "0 60px 120px rgba(0,0,0,.8)", borderRadius: 8, overflow: "hidden" }}>
        <Img src={staticFile(P + "m1_p071.jpg")} style={{ width: "100%", display: "block" }} />
        {hi(772.6, "8%", "7%", "3.2%", "8.5%", "rgba(255,214,10,1)")}
        {hi(777.9, "42%", "5%", "34%", "4%", "rgba(255,154,74,1)")}
        {hi(784.3, "42%", "5%", "42.2%", "4.5%", "rgba(125,255,158,1)")}
      </div>
    </div>
  </AbsoluteFill>;
};

export const RestBody: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];
  const at = (q: Parameters<typeof screenOf>[1]) => screenOf(t, q);
  const near = (a: number, b: number) => t > a - 0.5 && t < b + 0.5;
  // ===== la masa =====
  L.push(<Words key="w1" t={t} items={[{ at: 157.7, txt: "NO DA CALOR" }, { at: 159.65, txt: "LO GUARDA", col: COL.amber }]} out={160.4} y={190} size={110} />);
  L.push(<Chip key="cbat" t={t} at={162.0} out={165.1} text="COMO UNA BATERÍA QUE SE CARGA" />);
  L.push(<Chip key="clarg" t={t} at={166.0} out={170.5} text="Y LO LARGA DURANTE HORAS" col={COL.amber} />);
  L.push(<Words key="w2" t={t} items={[{ at: 170.8, txt: "NO ES MAGIA" }, { at: 171.8, txt: "ES PESO", col: COL.amber }]} out={172.5} y={200} size={110} />);
  L.push(<Chip key="caire" t={t} at={172.7} out={175.7} text="TODO EL AIRE DEL CUARTO < 1 BOLSA DE CEMENTO" col={COL.ice} />);
  L.push(<BigNum key="b100" t={t} at={175.9} text="100 KG" sub="DE LADRILLO" x={1350} y={480} size={220} col={COL.amber} edge="#5a2a00" out={179.2} />);
  L.push(<Words key="w3" t={t} items={[{ at: 179.8, txt: "MUCHO FUEGO PARA CALENTAR", col: COL.amber }, { at: 182.4, txt: "MUCHA NOCHE PARA ENFRIAR", col: COL.ice }]} out={184.6} y={200} size={78} />);
  L.push(<Chip key="cp2" t={t} at={186.2} out={191.6} text="PARTE 2 · LADRILLOS SUELTOS, ESTUFA CHICA" />);
  L.push(<Words key="w4" t={t} items={[{ at: 195.45, txt: "HOY: LA BATERÍA EN SERIO", col: COL.amber }]} out={197.3} y={190} size={96} />);
  // ===== secreto 1 =====
  L.push(<StepTitle key="s1" t={t} at={203.35} n={1} name="EL LADRILLO CORRECTO" out={207.7} />);
  L.push(<Chip key="cmac" t={t} at={208.1} out={213.4} text="✔ MACIZO · COLORADO · DE TODA LA VIDA" col="#7dff9e" />);
  L.push(<Chip key="cent" t={t} at={213.5} out={217.6} text="ENTERO · SIN GRIETAS" col="#7dff9e" />);
  L.push(<Chip key="chue" t={t} at={221.4} out={229.8} text="✘ HUECO: GUARDA LA MITAD Y SE RAJA" col={COL.red} />);
  if (near(221.3, 229.9)) { const p = at(PT.giant); L.push(<Tag key="tmit" t={t} at={225.0} x={p.x} y={p.y} dx={260} dy={-220} text="PESA LA MITAD" col={COL.red} out={229.6} />); }
  L.push(<Stamp key="shum" t={t} at={228.9} text="HÚMEDO = PELIGRO" x={960} y={240} out={235.6} size={90} />);
  L.push(<Chip key="cvap" t={t} at={238.3} out={245.7} text="AGUA EN LOS POROS → VAPOR → ESTALLA" col={COL.red} />);
  L.push(<Flash key="fb1" t={t} at={240.3} peak={0.6} col="#ffb257" />);
  L.push(<Chip key="c2p" t={t} at={250.4} out={252.6} text="2 PRUEBAS ANTES DE USARLO" />);
  L.push(<Chip key="cgol" t={t} at={253.8} out={261.0} text="PRUEBA 1 · EL GOLPE" />);
  L.push(<Words key="wcla" t={t} items={[{ at: 261.3, txt: "SUENA CLARO = SANO", col: "#7dff9e" }]} out={263.3} y={180} size={96} />);
  L.push(<Words key="wsor" t={t} items={[{ at: 265.15, txt: "SUENA SORDO = RAJADO", col: COL.red }]} out={268.4} y={180} size={96} />);
  L.push(<Chip key="ctie" t={t} at={270.6} out={281.6} text="PRUEBA 2 · UNA SEMANA BAJO TECHO" col={COL.ice} />);
  L.push(<Chip key="csua" t={t} at={281.9} out={286.1} text="1ª VEZ: LEÑA CHICA · FUEGO SUAVE" />);
  L.push(<Stamp key="sno" t={t} at={295.5} text="NO ES PARA EL FUEGO" x={960} y={250} out={297.6} size={80} />);
  // ===== secreto 2 =====
  L.push(<StepTitle key="s2" t={t} at={296.95} n={2} name="LA ESTUFA" out={301.7} />);
  L.push(<BigNum key="b200" t={t} at={301.7} text="200 L" sub="ACOSTADO" x={1400} y={300} size={170} col={COL.ink} out={305.0} />);
  L.push(<Chip key="cpar" t={t} at={306.2} out={310.7} text="PARADO: CONSUME RÁPIDO, UN SOLO LADO" col={COL.red} />);
  L.push(<Chip key="cac" t={t} at={310.9} out={316.5} text="ACOSTADO: MÁS PANZA AL CUARTO, PAREJO" col="#7dff9e" />);
  L.push(<Chip key="cace" t={t} at={318.6} out={326.2} text="DE ACERO · Y SABER QUÉ TUVO ADENTRO" />);
  L.push(<Stamp key="spla" t={t} at={326.5} text="PLÁSTICO: JAMÁS" x={1200} y={300} out={330.1} size={80} />);
  L.push(<Chip key="cenj" t={t} at={332.4} out={340.4} text="3 ENJUAGUES · SECAR AL SOL" col={COL.ice} />);
  L.push(<Chip key="cafu" t={t} at={340.7} out={346.2} text="1ª PRENDIDA AFUERA: SE QUEMA LA PINTURA" />);
  L.push(<BigNum key="bpue" t={t} at={348.1} text="20 × 15 CM" sub="PUERTA · BORDE A 10 CM DEL PISO" x={560} y={380} size={140} col={COL.amber} edge="#5a2a00" out={357.0} />);
  if (near(357.1, 362.7)) { const p = at(PT.holes); L.push(<Tag key="thol" t={t} at={357.2} x={p.x} y={p.y} dx={-320} dy={-160} text="6 AGUJEROS DE 3 CM" sub="(entra el aire)" col={COL.amber} out={362.6} />); }
  L.push(<Chip key="crej" t={t} at={363.5} out={373.0} text="REJILLA: VARILLAS DE 6 MM, A 8 CM DEL FONDO" />);
  if (near(373.3, 377.8)) { const p = at(PT.pipeHole); L.push(<Tag key="tcan" t={t} at={373.4} x={p.x} y={p.y} dx={280} dy={-120} text="CAÑO DE 12 CM" col={COL.amber} out={377.6} />); }
  if (near(377.9, 380.8)) { const p = at(PT.legs); L.push(<Tag key="tpat" t={t} at={378.0} x={p.x} y={p.y} dx={260} dy={-160} text="SOBRE 4 PATAS" col={COL.amber} out={380.7} />); }
  L.push(<Chip key="caf" t={t} at={386.0} out={391.6} text="EL CAÑO SIEMPRE SALE AFUERA" col={COL.red} />);
  L.push(<BigNum key="b4m" t={t} at={391.8} text="4 METROS" sub="GALPÓN DE 6 × 4" x={560} y={420} size={170} col={COL.ink} out={396.2} />);
  L.push(<BigNum key="b10k" t={t} at={396.9} text="10 KG" sub="DE LEÑA SECA · 8 HORAS" x={520} y={430} size={190} col={COL.amber} edge="#5a2a00" out={401.3} />);
  L.push(<Chip key="csin" t={t} at={405.7} out={414.4} text="PRUEBA: SIN LADRILLOS" col={COL.red} />);
  if (near(409.8, 414.5)) { const p = at(PT.thermoAt(20)); L.push(<Tag key="t20b" t={t} at={409.9} x={p.x} y={p.y} dx={220} dy={-60} text="22 H · 20 °C" col={COL.amber} out={414.4} />); }
  L.push(<BigNum key="b4c" t={t} at={416.1} text="4 °C" sub="A LAS 3 AM, OTRA VEZ" x={520} y={430} size={220} col={COL.ice} edge="#0a2a44" out={419.0} />);
  L.push(<Words key="wcha" t={t} items={[{ at: 419.9, txt: "CHAPA FINITA" }, { at: 422.85, txt: "CALIENTA RÁPIDO", col: COL.amber }, { at: 423.9, txt: "SE ENFRÍA RÁPIDO", col: COL.ice }]} out={428.0} y={190} size={84} />);
  // ===== secreto 3 =====
  L.push(<StepTitle key="s3" t={t} at={428.4} n={3} name="CÓMO SE ARMA LA BATERÍA" out={430.6} />);
  L.push(<BigNum key="b10c" t={t} at={432.6} text="10 CM" sub="LA REGLA DE ORO" x={520} y={420} size={230} col={COL.amber} edge="#5a2a00" out={434.6} />);
  if (near(434.7, 450.3)) { const p = at(PT.gap); L.push(<Tag key="tgap2" t={t} at={435.7} x={p.x} y={p.y} dx={-330} dy={-200} text="10 CM DE AIRE" sub="nunca pegados a la chapa" col={COL.amber} out={440.5} />); }
  L.push(<Chip key="clam" t={t} at={440.8} out={450.2} text="EL AIRE SUBE, LAME EL LADRILLO Y LE DEJA EL CALOR" />);
  L.push(<Stamp key="speg" t={t} at={450.7} text="PEGADO = SE DEFORMA" x={960} y={250} out={457.2} size={80} />);
  L.push(<Chip key="cdos" t={t} at={457.6} out={461.4} text="PARED DE 2 LADRILLOS DE ALTO" />);
  L.push(<Chip key="cfre" t={t} at={461.7} out={466.9} text="EL FRENTE LIBRE (LA PUERTA)" col="#7dff9e" />);
  L.push(<Stamp key="scan" t={t} at={470.1} text="EL CAÑO: NADA ENCIMA" x={960} y={250} out={474.6} size={80} />);
  L.push(<Chip key="cbar" t={t} at={475.0} out={480.7} text="BARRO: ARCILLA + ARENA" col={COL.amber} />);
  L.push(<Chip key="ccem" t={t} at={480.9} out={488.2} text="✘ CEMENTO: SE SUELTA CON EL CALOR" col={COL.red} />);
  L.push(<Chip key="c1d" t={t} at={488.5} out={491.2} text="1 DÍA DE SECADO ANTES DE PRENDER" col={COL.ice} />);
  if (near(491.4, 495.5)) { const p = at(PT.strip); L.push(<Tag key="tstr" t={t} at={491.6} x={p.x} y={p.y} dx={220} dy={-200} text="TIRA DE CHAPA ARRIBA" col={COL.amber} out={495.4} />); }
  L.push(<Chip key="c3f" t={t} at={501.4} out={508.9} text="3 FILAS DE FONDO · SIEMPRE CON EL AIRE" />);
  L.push(<BigNum key="b48" t={t} at={509.0} text="48 LADRILLOS" sub="CASI 120 KG DE BATERÍA" x={960} y={330} size={150} col={COL.amber} edge="#5a2a00" out={513.6} />);
  L.push(<Words key="wrob" t={t} items={[{ at: 520.15, txt: "UNA BATERÍA FRÍA" }, { at: 521.6, txt: "PRIMERO ROBA", col: COL.red }]} out={523.2} y={190} size={100} />);
  L.push(<Chip key="c1h" t={t} at={523.4} out={528.9} text="LA 1ª HORA EL TALLER TARDA MÁS EN CALENTAR" col={COL.red} />);
  L.push(<BigNum key="baga" t={t} at={534.2} text="AGUANTA" sub="TE LO DEVUELVE A LAS 3 AM" x={960} y={330} size={190} col={COL.amber} edge="#5a2a00" out={538.8} />);
  // ===== secreto 4 =====
  L.push(<StepTitle key="s4" t={t} at={539.15} n={4} name="CUÁNTOS LADRILLOS" out={545.0} />);
  L.push(<CheckList key="clcu" t={t} title="PARA UN CUARTO DE CASA" out={559.6} rows={[{ at: 549.6, txt: "Chico 3 × 3 → 4 ladrillos" }, { at: 553.4, txt: "Mediano o grande → 8" }, { at: 555.8, txt: "Si hiela, el chico → 6" }]} />);
  L.push(<Chip key="cm4" t={t} at={559.9} out={567.3} text="TABLA COMPLETA · MANUAL 4 · EL CUARTO TIBIO" col={COL.amber} />);
  L.push(<BigNum key="b100l" t={t} at={568.9} text="¿100 LADRILLOS?" x={960} y={330} size={150} col={COL.red} edge="#4a0a00" out={575.2} />);
  L.push(<Chip key="cmed" t={t} at={582.7} out={589.2} text="TIBIOS A MEDIAS → ROBAN TODA LA NOCHE" col={COL.red} />);
  L.push(<Words key="wtam" t={t} items={[{ at: 589.4, txt: "DEL TAMAÑO DEL FUEGO", col: COL.amber }]} out={592.0} y={190} size={100} />);
  L.push(<Words key="wfg" t={t} items={[{ at: 592.2, txt: "FUEGO CHICO → POCOS" }, { at: 594.95, txt: "FUEGO GRANDE → MUCHOS", col: COL.amber }]} out={597.7} y={190} size={80} />);
  // ===== secreto 5 =====
  L.push(<StepTitle key="s5" t={t} at={597.95} n={5} name="CÓMO SE CARGA" out={601.2} />);
  L.push(<Words key="wviv" t={t} items={[{ at: 605.9, txt: "FUEGO VIVO", col: COL.amber }, { at: 607.9, txt: "NO AHOGADO", col: COL.red }]} out={609.9} y={190} size={110} />);
  L.push(<Chip key="cahog" t={t} at={610.1} out={619.9} text="✘ AIRE CERRADO: HUMEA Y NO CARGA" col={COL.red} />);
  L.push(<Chip key="cmon" t={t} at={620.2} out={625.5} text="✘ MONÓXIDO + HOLLÍN EN EL CAÑO" col={COL.red} />);
  L.push(<CheckList key="clyo" t={t} title="YO HAGO ASÍ" out={646.3} rows={[{ at: 626.95, txt: "Entrada de aire a la mitad" }, { at: 629.1, txt: "Leña seca, siempre seca" }, { at: 634.9, txt: "2-3 ladrillos de papel encima" }, { at: 639.4, txt: "Humo transparente en el caño" }]} />);
  L.push(<Stamp key="sneg" t={t} at={644.8} text="NEGRO = FALTA AIRE" x={700} y={250} out={646.4} size={80} />);
  L.push(<Chip key="c2h" t={t} at={646.8} out={651.0} text="2 HORAS · FUEGO VIVO Y PAREJO" />);
  if (near(651.2, 661.9)) {
    L.push(<Tag key="t90" t={t} at={653.8} x={at(PT.row(1, 0)).x} y={at(PT.row(1, 0)).y} dx={-200} dy={-260} text="1ª FILA · 90 °C" col={COL.red} out={661.7} />);
    L.push(<Tag key="t60" t={t} at={657.5} x={at(PT.row(1, 1)).x} y={at(PT.row(1, 1)).y} dx={60} dy={-300} text="2ª · 60 °C" col={COL.amber} out={661.7} />);
    L.push(<Tag key="t40" t={t} at={659.75} x={at(PT.row(1, 2)).x} y={at(PT.row(1, 2)).y} dx={160} dy={-220} text="ATRÁS · 40 °C" col={COL.ice} out={661.7} />);
  }
  L.push(<Stamp key="sroj" t={t} at={662.0} text="NUNCA AL ROJO" x={560} y={300} out={666.8} size={80} />);
  L.push(<Chip key="cman" t={t} at={672.0} out={680.0} text="PRUEBA DE LA MANO: LA FILA DE ATRÁS" />);
  L.push(<Words key="wtib" t={t} items={[{ at: 677.65, txt: "TIBIA = LLENA", col: COL.amber }, { at: 680.3, txt: "FRÍA = FALTA FUEGO", col: COL.ice }]} out={684.5} y={190} size={84} />);
  // ===== la noche, con reloj =====
  L.push(<TempChart key="tc" t={t} at={686.3} out={696.2} nb={{ at: 694.2, v: 9 }} pts={[{ at: 686.3, v: 20, lab: "22 H" }, { at: 694.2, v: 16, lab: "1 AM" }]} />);
  L.push(<BigNum key="b45" t={t} at={715.1} text="45 °C" sub="EL LADRILLO · TALLER A 13 °C" x={520} y={420} size={190} col={COL.amber} edge="#5a2a00" out={715.95} />);
  L.push(<Chip key="c6am" t={t} at={720.7} out={728.5} text="6 AM · 11 °C (SIN LADRILLOS: 4 °C)" col={COL.amber} />);
  L.push(<Chip key="cafu2" t={t} at={725.95} out={728.5} text="AFUERA: −3 °C" col={COL.ice} x={110} y={210} />);
  L.push(<BigNum key="b7" t={t} at={727.35} text="+7 °C" sub="CON LA MISMA LEÑA" x={520} y={420} size={230} col={COL.amber} edge="#5a2a00" out={733.4} />);
  L.push(<Chip key="cnile" t={t} at={732.45} out={734.4} text="NI UN LEÑO DE MÁS" />);
  L.push(<BigNum key="b120" t={t} at={736.0} text="120 KG" sub="DE CALOR GUARDADO" x={1350} y={360} size={170} col={COL.amber} edge="#5a2a00" out={744.6} />);
  L.push(<BigNum key="b830" t={t} at={757.5} text="8 H 30" sub="DESDE QUE SE APAGÓ" x={1350} y={330} size={170} col={COL.ink} out={761.0} />);
  // ===== CTA 2: Manual 1 p. 71 =====
  L.push(<Chip key="cpap" t={t} at={764.5} out={770.2} text="LOS LADRILLOS DE PAPEL TAMBIÉN CUENTAN" />);
  L.push(<Page71 key="p71" t={t} />);
  L.push(<Chip key="cm71" t={t} at={770.5} out={777.6} text="MANUAL 1 · PÁG. 71 · LA CUENTA CONTRA LA LEÑA" col={COL.amber} />);
  L.push(<BigNum key="bmed" t={t} at={779.4} text="½ KG" sub="DE LEÑA POR LADRILLO" x={560} y={420} size={190} col={COL.amber} edge="#5a2a00" out={783.9} />);
  L.push(<Chip key="cgar" t={t} at={784.4} out={789.2} text="1 GARRAFA DE 10 KG ≈ 60 LADRILLOS DE PAPEL" col={COL.ice} />);
  L.push(<Words key="wjun" t={t} items={[{ at: 789.45, txt: "PAPEL LLENA", col: COL.amber }, { at: 792.5, txt: "BARRO GUARDA", col: COL.ink }]} out={794.5} y={190} size={100} />);
  L.push(<Desc key="desc2" t={t} at={798.5} out={802.4} x={560} />);
  // ===== secreto 6 =====
  L.push(<StepTitle key="s6" t={t} at={802.75} n={6} name="DÓNDE TE PONES TÚ" out={805.0} />);
  L.push(<Words key="wsol" t={t} items={[{ at: 809.3, txt: "COMO EL SOL DE INVIERNO", col: COL.amber }]} out={812.7} y={190} size={96} />);
  L.push(<Chip key="clad" t={t} at={814.9} out={823.6} text="SILLA, MESA, CAMA → DEL LADO DE LA BATERÍA" />);
  if (near(823.8, 829.1)) { const p = at(PT.chair); L.push(<Tag key="t15" t={t} at={824.0} x={p.x} y={p.y} dx={240} dy={-200} text="1,5 METROS" col={COL.amber} out={829.0} />); }
  if (near(833.1, 843.2)) { const p = at(PT.reflector); L.push(<Tag key="tref" t={t} at={833.3} x={p.x} y={p.y} dx={-320} dy={-160} text="CHAPA LISA CON AIRE ATRÁS" sub="devuelve el calor al cuarto" col={COL.amber} out={843.0} />); }
  L.push(<Words key="wcua" t={t} items={[{ at: 846.6, txt: "CALIENTA UN CUARTO" }, { at: 847.6, txt: "NO LA CASA", col: COL.red }]} out={848.6} y={190} size={100} />);
  L.push(<Stamp key="scie" t={t} at={856.9} text="CIERRA ESE CUARTO" x={960} y={250} out={861.3} size={80} />);
  // ===== secreto 7 =====
  L.push(<StepTitle key="s7" t={t} at={861.1} n={7} name="LO QUE SE VE CUANDO NO SE VE" out={861.45} />);
  L.push(<Chip key="cter" t={t} at={866.5} out={877.4} text="CÁMARA TÉRMICA · 23 H · 1 HORA APAGADO" col={COL.ice} />);
  L.push(<Words key="wbri" t={t} items={[{ at: 878.6, txt: "LOS LADRILLOS BRILLAN", col: COL.amber }]} out={881.6} y={190} size={96} />);
  L.push(<Chip key="c4am" t={t} at={882.7} out={893.8} text="4 AM · BRASAS SIN FUEGO" col={COL.amber} />);
  L.push(<Words key="wcm" t={t} items={[{ at: 892.1, txt: "CHAPA" }, { at: 892.9, txt: "VS" }, { at: 893.3, txt: "MASA", col: COL.amber }]} out={893.9} y={190} size={110} />);
  // ===== lo que no hace =====
  L.push(<CheckList key="clno" t={t} title="LO QUE ESTO NO HACE" out={945.6} rows={[{ at: 902.15, txt: "✘ No calienta la casa entera" }, { at: 913.5, txt: "✘ No ahorra leña la 1ª noche" }, { at: 930.9, txt: "✘ No hace milagros si chifla" }]} />);
  L.push(<Chip key="c23" t={t} at={923.9} out={927.3} text="EL AHORRO EMPIEZA LA 2ª O 3ª NOCHE" col="#7dff9e" />);
  L.push(<Chip key="cvib" t={t} at={943.1} out={945.6} text="PRIMERO LAS VÍBORAS · DESPUÉS LOS LADRILLOS" />);
  // ===== seguridad =====
  L.push(<Chip key="cseg" t={t} at={948.1} out={953.4} text="SEGURIDAD · 5 COSAS QUE NO SE DISCUTEN" col={COL.red} />);
  const SEG5: [number, number, string][] = [[953.6, 960.6, "HÚMEDO O HUECO: NUNCA AL FUEGO"], [960.8, 974.8, "LOS LADRILLOS NUNCA TAPAN NADA"], [975.0, 1011.6, "MONÓXIDO: NO SE VE NI SE HUELE"], [1011.8, 1028.0, "CHICOS Y MAYORES: 90 °C QUEMA"], [1028.25, 1039.2, "CENIZAS: BALDE DE METAL, AFUERA"]];
  SEG5.forEach(([a, b, txt], i) => L.push(<Mistake key={"m" + i} t={t} at={a} n={i + 1} txt={txt} out={b} />));
  L.push(<Flash key="fb2" t={t} at={958.9} peak={0.6} col="#ffb257" />);
  L.push(<CheckList key="clmon" t={t} title="CONTRA EL MONÓXIDO" out={1001.4} x={1240} y={180} rows={[{ at: 986.8, txt: "Caño libre y hacia afuera" }, { at: 989.5, txt: "Nunca cerrar el aire del todo" }, { at: 992.5, txt: "Detector a pilas al lado de la cama" }, { at: 996.0, txt: "Una ventana apenas abierta" }]} />);
  L.push(<Chip key="cdol" t={t} at={1001.6} out={1010.2} text="DOLOR DE CABEZA O MAREO → AL AIRE LIBRE YA" col={COL.red} />);
  L.push(<BigNum key="b90" t={t} at={1015.6} text="90 °C" sub="QUEMA EN UN SEGUNDO" x={1350} y={360} size={200} col={COL.red} edge="#4a0a00" out={1021.0} />);
  L.push(<Chip key="cbol" t={t} at={1034.5} out={1039.2} text="✘ NUNCA A LA BOLSA DE BASURA" col={COL.red} x={110} y={210} />);
  // ===== los 3 errores =====
  L.push(<Chip key="cerr" t={t} at={1039.4} out={1043.4} text="3 ERRORES DE LOS COMENTARIOS DE LA PARTE 2" />);
  L.push(<Mistake key="e1" t={t} at={1043.7} n={1} txt="PEGAR LOS LADRILLOS A LA CHAPA" out={1059.0} />);
  L.push(<Mistake key="e2" t={t} at={1059.3} n={2} txt="CEMENTO Y PRENDER AL OTRO DÍA" out={1074.0} />);
  L.push(<Chip key="c2d" t={t} at={1069.5} out={1074.0} text="BARRO + 1 DÍA · CEMENTO + 2 DÍAS" col="#7dff9e" x={110} y={110} />);
  L.push(<Mistake key="e3" t={t} at={1074.25} n={3} txt="MÁS LEÑA PORQUE HAY LADRILLOS" out={1085.6} />);
  L.push(<Words key="wcam" t={t} items={[{ at: 1091.1, txt: "NO ES CUÁNTO QUEMAS" }, { at: 1093.6, txt: "ES CUÁNTO SE TE ESCAPA", col: COL.amber }]} out={1095.2} y={190} size={84} />);
  // ===== el recibo =====
  L.push(<CheckList key="clrec" t={t} title="EL RECIBO" out={1127.0} rows={[{ at: 1099.8, txt: "Tambor: chatarrería" }, { at: 1103.85, txt: "48 ladrillos: medianera vieja · gratis" }, { at: 1109.2, txt: "Barro: arcilla y arena del patio" }, { at: 1112.4, txt: "Varillas y chapa: sobrantes" }, { at: 1117.0, txt: "Nuevo: sólo el caño de 12 cm" }]} />);
  L.push(<Chip key="cgar2" t={t} at={1120.9} out={1126.9} text="TODO JUNTO < LLENAR UNA GARRAFA UNA VEZ" col={COL.amber} x={110} y={110} />);
  L.push(<Words key="wvid" t={t} items={[{ at: 1128.1, txt: "TODA LA VIDA", col: COL.amber }]} out={1131.9} y={190} size={110} />);
  L.push(<Chip key="csal" t={t} at={1132.6} out={1137.0} text="«NO TENGO GALPÓN, TENGO UNA SALAMANDRA»" col={COL.ice} />);
  L.push(<CheckList key="clsal" t={t} title="TE SIRVE IGUAL" out={1151.6} rows={[{ at: 1137.75, txt: "4 u 8 ladrillos según el cuarto" }, { at: 1140.0, txt: "A 10 cm" }, { at: 1141.5, txt: "Frente y caño libres" }, { at: 1143.6, txt: "Fuego vivo" }]} />);
  L.push(<Chip key="cgas" t={t} at={1151.9} out={1159.4} text="ESTUFA DE GARRAFA: GUARDAN, PERO LA GARRAFA SIGUE CARA" />);
  // ===== la tarea =====
  L.push(<BigNum key="b8l" t={t} at={1166.6} text="8 LADRILLOS" sub="MACIZOS · SANOS · SECOS · A 10 CM" x={960} y={330} size={150} col={COL.amber} edge="#5a2a00" out={1175.0} />);
  L.push(<Words key="wnoc" t={t} items={[{ at: 1175.15, txt: "SIN TAMBOR · SIN BARRO" }, { at: 1177.95, txt: "ESTA NOCHE", col: COL.amber }]} out={1182.2} y={190} size={96} />);
  L.push(<Chip key="cmid" t={t} at={1183.5} out={1193.0} text="TERMÓMETRO LEJOS DE VENTANA Y ESTUFA" col={COL.ice} />);
  L.push(<Chip key="c22" t={t} at={1194.8} out={1200.2} text="2 NOCHES SIN · 2 NOCHES CON · MISMA HORA" />);
  L.push(<AskCard key="ask" t={t} at={1200.5} out={1210.6} />);
  L.push(<NextCard key="next" t={t} at={1210.8} subAt={1213.0} out={1219.6}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.amber, textShadow: extrude(6, "#5a2a00") }}>EL HORNO DE PAN</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: COL.ink }}>con este mismo tambor, parado</div></NextCard>);
  L.push(<Words key="wfin" t={t} items={[{ at: 1221.6, txt: "YA NO TIEMBLAN", col: COL.amber }]} out={1225.6} y={190} size={110} />);
  const fade = e(t, REST_END - 1.6, REST_END - 0.2);
  return <AbsoluteFill style={{ background: "#000" }}><Stage t={t} />{L}<AbsoluteFill style={{ background: "#000", opacity: fade }} /></AbsoluteFill>;
};
