// keikoes01 · MINUTOS 2-11 (98,6 s → final). Mismo hilo que el minuto 1: la alacena de Keiko es el mundo; cada truco
// arranca con la cámara volando a SU frasco (que se enciende) y el noren con el número; después las tomas reales de Keiko
// haciendo el truco, y piezas NUEVAS por truco (piezas2.tsx). El avatar corta por encima en sus ventanas (preroll 10 cuadros).
// Todo clavado a la voz con at("frase"). Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { JARS, setKeys, V, Key } from "./kioto3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { KO, P, Tag, at, e, ei, s } from "./lib";
import { World, Clip, Slide, Hanko, Nota, NorenTitulo, SteamWipe, Aroma, TintaFilter, MIN1_END } from "./Min1";
import {
  BalanzaChiles, TresPalabras, NoSeHace, MisoCorte, PuertaMoho, Congelador, MitadPote, Anos, Veredicto, OllaSeis, Planito,
  VaporAtrapado, Micro, Precio5, NocheFria, SolD, Receta, Prensa, Nieve, BienSeca, Parada, DosBotellas, Semana, ErrorCard,
  Calma, Cuenta, Tarea, Comentarios, Proximo,
} from "./piezas2";

const REEL = (AVAIL as { reel: boolean }).reel;
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms >= 98);
export const END = 689.04;
export const FULL_FRAMES = s(END);
const inAvR = (t: number) => WIN.some((w) => t >= w.ms - 0.02 && t < w.me);
const nearAv = (t: number) => WIN.some((w) => Math.abs(t - w.ms) < 0.35 || Math.abs(t - w.me) < 0.35);

// ---------------- secciones (la voz manda) ----------------
const TR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => at(`truco numero ${n}`, n === 1 ? 90 : 96));
const x = (ph: string, n: number) => at(ph, TR[n - 1] - 0.5);       // frase dentro del truco n
const y = (ph: string, after: number) => at(ph, after);             // frase después de un segundo
const SEM = y("como es mi semana", 540), ERR = y("tres errores", 570), TRQ = y("unas cosas para que no te sientas mal", 605);
const CTA = y("hagamos una cuenta", 630), TAR = y("te dejo una tarea", 645), COM = y("cuentame en los comentarios", 655);
const PROX = y("en el proximo", 665), CIE = y("mi madre decia", 675);

// ---------------- los planos de debajo del avatar: "j:N" frasco N · "wide" alacena · "i:clave" toma real · "dusk" cierre ----------------
// cada plano dura hasta el siguiente; el avatar tapa por encima en sus ventanas. Tercer campo: "s" = vapor en vez de barrido.
type Shot = [number, string, string?];
const B: Shot[] = [
  [MIN1_END, "j:1"], [x("un chile rojo", 1), "i:t1_chile"], [x("esos bichitos", 1), "i:h_gorgojo_huye"], [x("en japon", 1), "j:1", "s"], [x("cuando pierden el color", 1) - 1.5, "i:t1_cambia"],
  [TR[1], "j:1", "s"], [x("el arroz no vive", 2), "i:h_estufa_vapor"], [x("lo mejor es un frasco", 2), "wide"], [x("y en verano", 2), "i:t2_botellas"], [x("el cajon de las verduras", 2), "i:t2_cajon"],
  [x("esas son las tres palabras", 2) - 1.3, "j:1", "s"], [x("primero terminas el viejo", 2), "i:t2_lavar"],
  [TR[2], "j:3", "s"], [x("cuando abres el miso", 3), "i:h_miso_oscuro"], [x("entonces cada vez", 3), "i:t3_film"], [x("asi el miso se queda", 3), "j:3", "s"],
  [TR[3], "j:3"], [x("por la sal que tiene", 4), "i:t4_congela"], [x("si vives sola", 4), "j:3", "s"],
  [TR[4] + 1.3, "i:t5_ume"], [x("lleva tanta sal", 5), "j:4", "s"], [x("se guarda en frasco", 5), "i:h_metal"], [x("medio de una bola", 5), "i:t5_onigiri"], [x("cristalitos blancos", 5) - 1, "i:h_cristales"],
  [TR[5] + 1.3, "i:t6_kombu"], [x("si la lavas", 6) + 0.9, "i:h_lavar_kombu"], [x("solo pasale", 6), "j:5", "s"], [x("bien seco en una bolsa", 6), "i:h_desecante"],
  [TR[6], "j:7", "s"], [x("se congela caliente", 7) - 0.6, "i:t7_cocina"], [x("una vez por semana", 7), "j:7", "s"], [x("lo envuelves en film", 7) - 2.3, "i:t7_porciones"],
  [x("planito no en bola", 7), "j:7", "s"], [x("lo pones en el microondas", 7) - 3.1, "i:t7_micro"], [x("con una olla de domingo", 7), "j:7", "s"], [x("no hace magia", 7) - 0.7, "i:h_comida_lista"],
  [TR[7], "j:6", "s"], [x("unas 5 horas", 8) - 2.8, "i:t8_shiitake"], [x("esa agua no se tira", 8), "i:h_agua_shiitake"], [x("si tienes hongos frescos", 8), "i:t8_sol"],
  [TR[8], "j:8", "s"], [x("ese pepino blando", 9), "i:h_verdura_triste"], [x("lo cortas en rodajas", 9), "i:t9_frasco"],
  [TR[9] + 1.1, "j:8", "s"], [x("entonces cortas la mitad", 10), "i:t10_repollo"], [x("en un dia suelta", 10) - 0.2, "j:8", "s"],
  [TR[10], "j:9", "s"], [x("lo metes entero", 11) + 1.9, "i:t11_jengibre"], [x("nunca mas se te arruga", 11), "i:h_jengibre_arrugado"],
  [TR[11], "j:10", "s"], [x("la guardas en un frasco", 12), "i:t12_verdeo"],
  [TR[12] + 4.3, "j:11", "s"], [x("les cortas las hojas", 13), "i:h_hojas"], [x("las envuelves en papel", 13), "i:t13_raices"],
  [TR[13], "j:12", "s"], [x("la que se pone fea", 14) - 3.2, "i:t14_soja"], [x("y nunca nunca", 14), "i:h_soja_fuego"],
  [TR[14], "j:15", "s"], [x("cuando haces caldo", 15), "i:h_dashi"], [x("cortas el alga", 15), "i:t15_furikake"], [x("eso es furikake", 15), "j:15", "s"],
  [SEM + 2.3, "i:s_domingo", "s"], [y("ese mismo dia", 545), "j:15"], [y("el lunes reviso", 550), "j:8", "s"], [y("compro poquito", 555) + 2.4, "i:h_mercado"], [y("el sabado miro", 560), "i:s_sabado"], [y("diez minutos", 565), "wide", "s"],
  [ERR + 6.1, "i:e_pinza"], [y("el segundo los frascos", 580), "i:h_frascos_sol"], [y("el tercero", 595) - 0.1, "i:e_oferta"],
  [TRQ + 3.2, "i:h_bolsa_congelador", "s"], [y("si el miso se te puso", 618), "i:h_raspar_miso"], [y("polvo verde", 625) + 2.6, "i:h_kombu_moho"],
  [CTA, "i:h_cuenta", "s"], [TAR - 1.3, "i:c_tarea"], [COM + 1.6, "i:c_te"], [PROX, "i:c_tofu", "s"], [y("mi pescado", 665), "i:h_pescado"],
  [CIE - 0.2, "dusk", "s"], [y("yo vivo sola", 680), "i:c_noche"],
];
B.sort((a, b) => a[0] - b[0]);
const endOf = (i: number) => (i + 1 < B.length ? B[i + 1][0] : END + 1);

// ---------------- cámara: cada plano de mundo vuela a SU frasco y se acerca despacio ----------------
const J = (n: number) => JARS[n - 1];
const keys: Key[] = [];
B.forEach(([a, sp], i) => {
  const b = endOf(i);
  if (sp.startsWith("j:")) {
    const q = J(+sp.slice(2)), l: V = [q[0], q[1] + 0.09, q[2]];
    keys.push({ t: a + 0.05, p: [q[0] + 0.22, q[1] + 0.14, q[2] + 1.15], l, fov: 40, arc: 0.06 }, { t: b - 0.05, p: [q[0] + 0.04, q[1] + 0.1, q[2] + 0.78], l, fov: 33 });
  } else if (sp === "wide") {
    keys.push({ t: a + 0.05, p: [1.45, 1.55, 0.6], l: [1.45, 1.5, -1.5], fov: 46 }, { t: b - 0.05, p: [1.5, 1.52, 0.35], l: [1.45, 1.5, -1.5], fov: 42 });
  } else if (sp === "dusk") {
    keys.push({ t: a + 0.05, p: [1.35, 1.6, 0.25], l: [1.45, 1.5, -1.5], fov: 42 }, { t: b - 0.05, p: [1.3, 1.68, 1.3], l: [1.45, 1.42, -1.5], fov: 50 });
  }
});
setKeys(keys);

const shotView = (i: number, t: number) => {
  const [a, sp] = B[i], b = endOf(i);
  if (sp.startsWith("i:")) return <Clip k={sp.slice(2)} t={t} a={a} dur={Math.max(3, b - a)} z={i % 2 ? [1.1, 1.02] : [1.02, 1.1]} ox={((i % 3) - 1) * 30} />;
  const n = sp.startsWith("j:") ? +sp.slice(2) : 0, dk = sp === "dusk" ? e(t, a, a + 4) : 0;
  return <World t={t} over={{ dusk: 0.7 * dk, lamp: 0.7 + 0.3 * dk, doors: 1, winOpen: 0, bags: 0, heat: 0.5, dimShelf: 0,
    jarGlow: JARS.map((_, k) => (n ? (k === n - 1 ? 1.2 * e(t, a + 0.2, a + 0.8) : 0.08) : sp === "wide" ? 0.35 : 0.5 * dk)) }} />;
};

// ---------------- avatar: sólo se monta la ventana del momento (preroll de 10 cuadros) ----------------
const AvatarR: React.FC<{ t: number }> = ({ t }) => {
  const w = WIN.find((q) => t >= q.ms - 0.45 && t < q.me + 0.05);
  if (!w) return null;
  const on = t >= w.ms - 0.02 && t < w.me;
  if (!REEL) return on ? <AbsoluteFill><Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill> : null;
  return <Sequence from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
    <AbsoluteFill style={{ opacity: on ? 1 : 0, background: "#000" }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
  </Sequence>;
};

// título del truco con salida
const Titulo: React.FC<{ t: number; n: number; text: string; out: number }> = ({ t, n, text, out }) => {
  if (t < TR[n - 1] - 0.1 || t > out + 0.35) return null;
  return <AbsoluteFill style={{ opacity: 1 - e(t, out, out + 0.3) }}><NorenTitulo t={t} at={TR[n - 1]} n={n} text={text} /></AbsoluteFill>;
};
const TIT: [number, string, number][] = [
  [1, "UN CHILE SECO EN EL ARROZ", x("si un chile rojo", 1) - 0.2], [2, "EL ARROZ NO VIVE JUNTO AL FUEGO", x("el calor y la humedad", 2) - 0.3],
  [3, "EL MISO SE TAPA CON SU PIEL", x("cuando abres el miso", 3) - 0.2], [4, "EL MISO VA AL CONGELADOR", x("por la sal que tiene", 4) - 0.3],
  [5, "UMEBOSHI, LA CIRUELA SALADA", x("mi madre siempre tenia", 5) - 0.2], [6, "EL POLVO BLANCO DEL KOMBU", x("mucha gente ve", 6) - 0.2],
  [7, "EL ARROZ SE CONGELA CALIENTE", x("se congela caliente", 7) - 0.8], [8, "SHIITAKE: AGUA FRÍA", x("la gente los pone", 8) - 0.2],
  [9, "EL VINAGRE SALVA LA VERDURA", x("ese pepino blando", 9) - 0.2], [10, "LA VERDURA CON SAL", x("cuando compras un repollo", 10) - 0.2],
  [11, "EL JENGIBRE, ENTERO AL CONGELADOR", x("no lo pelas", 11) - 0.2], [12, "LA CEBOLLITA DE VERDEO, TAMBIÉN", x("la lavas", 12) - 0.2],
  [13, "LAS RAÍCES SE GUARDAN PARADAS", x("el nabo largo", 13) - 0.2], [14, "LA SOJA ABIERTA, A LA HELADERA", x("cuando la abres", 14) - 0.2],
  [15, "DEL CALDO NO SE TIRA NADA", x("cuando haces caldo", 15) - 0.2],
];

// ---------------- piezas, cada una con su frase ----------------
const pieces = (t: number): React.ReactNode[] => [
  // 1 · el chile
  <Tag key="1a" t={t} at={x("un chile rojo", 1) + 0.4} x={1130} y={470} dx={260} dy={-200} text="CHILE ROJO SECO" sub="ENTERO" col={KO.washi} out={x("yo se parece", 1) - 0.3} size={54} />,
  <Aroma key="1b" t={t} at={x("no soportan el olor", 1)} out={x("en japon", 1) - 0.2} x={1250} y={620} />,
  <Hanko key="1c" t={t} at={x("se alejan", 1)} out={x("en japon", 1) - 0.2} x={1480} y={300} lines={["SE ALEJAN"]} size={92} rot={-6} />,
  <Nota key="1d" t={t} at={x("en japon", 1) + 0.2} out={x("pones dos chiles", 1) - 0.2} x={1450} y={640} rot={3} w={560} lines={["en Japón, casi todas", "las cajas de arroz", "tienen 1 o 2 chiles"]} />,
  <BalanzaChiles key="1e" t={t} at={x("pones dos chiles", 1)} meses={x("cada dos o tres meses", 1)} out={x("el arroz no toma", 1) - 0.2} />,
  <Veredicto key="1f" t={t} at={x("el arroz no toma", 1)} flip={x("te lo prometo", 1)} out={x("el chile cuida", 1) - 0.1} no="PICANTE" si="NO PICA" />,
  <Hanko key="1g" t={t} at={x("el chile cuida", 1)} out={TR[1] - 0.25} x={1440} y={330} lines={["EL CHILE CUIDA,", "NO PICA"]} size={84} paper />,
  // 2 · dónde vive el arroz
  <Tag key="2a" t={t} at={x("el arroz no vive", 2) + 0.3} x={1180} y={420} dx={240} dy={-170} text="CALOR + HUMEDAD" sub="= BICHOS" col={KO.washi} out={x("el calor y la humedad", 2) + 0.2} size={52} />,
  <Nota key="2b" t={t} at={x("lo mejor es un frasco", 2) + 0.2} out={x("y en verano", 2) - 0.2} x={500} y={760} rot={-3} w={540} lines={["bien cerrado", "en lo más fresco"]} />,
  <Tag key="2c" t={t} at={x("botellas limpias", 2)} x={1260} y={620} dx={260} dy={-240} text="BOTELLAS DE AGUA" sub="LIMPIAS" col={KO.washi} out={x("el cajon de las verduras", 2) - 0.2} size={50} />,
  <TresPalabras key="2d" t={t} ats={[y("fresco", x("mismo sabor", 2)), y("oscuro", x("mismo sabor", 2)), y("cerrado", x("mismo sabor", 2))]} out={x("y una cosa mas", 2) - 0.2} words={["FRESCO", "OSCURO", "CERRADO"]} y={830} />,
  <Nota key="2e" t={t} at={x("nunca eches el arroz", 2)} out={x("primero terminas", 2) - 0.2} x={500} y={330} rot={-4} w={520} lines={["arroz nuevo", "encima del viejo"]} />,
  <NoSeHace key="2f" t={t} at={x("encima del viejo", 2)} out={x("primero terminas", 2) - 0.2} x={500} y={330} r={250} label="NUNCA" />,
  <Nota key="2g" t={t} at={x("si los mezclas", 2)} out={TR[2] - 0.2} x={1490} y={760} rot={4} w={520} lines={["los bichitos", "se mudan →"]} />,
  // 3 · el miso con su piel
  <Tag key="3a" t={t} at={x("se oscurece", 3)} x={1000} y={560} dx={300} dy={-260} text="SE OSCURECE" sub="Y SE SECA" col={KO.washi} out={x("entonces cada vez", 3) - 0.2} size={56} />,
  <MisoCorte key="3b" t={t} at={x("alisas la superficie", 3)} film={x("un pedazo de film", 3)} out={x("asi el miso se queda", 3) + 1.5} />,
  <Veredicto key="3c" t={t} at={x("la cuchara siempre", 3)} flip={x("limpia y seca", 3)} out={x("una cuchara mojada", 3) - 0.1} no="MOJADA" si="SECA" />,
  <PuertaMoho key="3d" t={t} at={x("una cuchara mojada", 3)} out={TR[3] - 0.3} />,
  // 4 · miso al congelador
  <Congelador key="4a" t={t} at={x("el congelador", 4)} blando={x("no se pone duro", 4)} out={x("sacas la cuchara", 4) - 0.2} />,
  <Tag key="4b" t={t} at={x("la echas en la sopa", 4)} x={1150} y={560} dx={240} dy={-260} text="DIRECTO A LA SOPA" col={KO.washi} out={x("si vives sola", 4) - 0.2} size={56} />,
  <MitadPote key="4c" t={t} at={x("la mitad va", 4)} out={TR[4] - 0.35} />,
  // 5 · umeboshi
  <Anos key="5a" t={t} at={x("puede durar", 5)} out={x("se guarda en frasco", 5) - 0.2} to={10} label="AÑOS" />,
  <NoSeHace key="5b" t={t} at={x("nunca en metal", 5)} out={x("medio de una bola", 5) - 0.6} x={640} y={500} r={250} label="NUNCA EN METAL" />,
  <Veredicto key="5c" t={t} at={x("no hace milagros", 5)} flip={x("pero ayuda", 5)} out={x("cristalitos blancos", 5) - 0.1} no="MILAGRO" si="AYUDA" />,
  <Veredicto key="5d" t={t} at={x("cristalitos blancos", 5) + 0.4} flip={x("es la sal", 5)} out={TR[5] - 0.2} no="MOHO" si="ES SAL" />,
  // 6 · kombu
  <Veredicto key="6a" t={t} at={x("piensa que es moho", 6)} flip={x("es sabor", 6)} out={x("si la lavas", 6) - 0.1} no="MOHO" si="SABOR" />,
  <NoSeHace key="6b" t={t} at={x("si la lavas", 6)} out={x("solo pasale", 6) - 0.1} x={1480} y={420} r={210} label="NO SE LAVA" />,
  <Nota key="6c" t={t} at={x("solo pasale", 6) + 0.2} out={x("bien seco en una bolsa", 6) - 0.2} x={1450} y={680} rot={3} w={480} lines={["un paño", "apenas húmedo"]} />,
  <Tag key="6d" t={t} at={x("un sobrecito", 6)} x={1080} y={600} dx={280} dy={-260} text="SOBRECITO SECANTE" col={KO.washi} out={x("asi dura un ano", 6) - 0.1} size={52} />,
  <Anos key="6e" t={t} at={x("asi dura un ano", 6)} out={TR[6] - 0.25} to={1} label="AÑO" />,
  // 7 · el arroz congelado (el del ahorro)
  <Hanko key="7a" t={t} at={x("ahorrar dinero", 7)} out={x("se congela caliente", 7) - 0.3} x={1500} y={760} lines={["AHORRA", "DINERO"]} size={84} rot={5} />,
  <Tag key="7b" t={t} at={x("se congela caliente", 7)} x={1100} y={420} dx={260} dy={-180} text="CALIENTE" sub="RECIÉN HECHO" col={KO.oro} out={x("cuando cocinas para uno", 7) - 0.2} size={62} />,
  <Nota key="7c" t={t} at={x("no vale la pena", 7)} out={x("una vez por semana", 7) - 0.2} x={1460} y={760} rot={3} w={560} lines={["no prender la olla", "todos los días"]} />,
  <OllaSeis key="7d" t={t} at={x("una vez por semana", 7)} tazas={x("tres tazas", 7)} seis={1e9} out={x("todavia caliente", 7) - 0.2} />,
  <Planito key="7e" t={t} at={x("porciones de 150", 7)} bola={x("planito no en bola", 7)} out={x("por que caliente", 7) - 0.2} />,
  <VaporAtrapado key="7f" t={t} at={x("por que caliente", 7)} out={x("lo pones en el microondas", 7) - 0.2} x={1450} />,
  <Micro key="7g" t={t} at={x("lo pones en el microondas", 7)} quieto={x("un minuto quieto", 7)} out={x("con una olla de domingo", 7) - 0.2} />,
  <OllaSeis key="7h" t={t} at={x("con una olla de domingo", 7)} tazas={x("con una olla de domingo", 7)} seis={x("seis comidas", 7) - 0.4} out={x("comidas listas", 7) - 0.4} />,
  <Precio5 key="7i" t={t} at={x("comidas listas", 7)} out={x("ahi esta el ahorro", 7) + 0.6} />,
  <Hanko key="7j" t={t} at={x("no hace magia", 7)} out={TR[7] - 0.25} x={1250} y={330} lines={["ESTA CASA NO HACE MAGIA,", "HACE CUENTAS"]} size={70} paper />,
  // 8 · shiitake
  <Veredicto key="8a" t={t} at={x("agua caliente", 8)} flip={x("en agua fria", 8)} out={x("unas 5 horas", 8) - 0.2} no="AGUA CALIENTE" si="AGUA FRÍA" />,
  <NocheFria key="8b" t={t} at={x("unas 5 horas", 8)} out={x("esa agua no se tira", 8) - 0.2} />,
  <Hanko key="8c" t={t} at={x("esa agua es un caldo", 8)} out={x("si tienes hongos frescos", 8) - 0.2} x={1460} y={330} lines={["ESA AGUA", "ES CALDO"]} size={96} rot={-5} />,
  <SolD key="8d" t={t} at={x("una hora al sol", 8)} out={x("mi madre los ponia", 8) - 0.2} />,
  <Nota key="8e" t={t} at={x("sin saber por que", 8)} out={TR[8] - 0.25} x={1450} y={700} rot={-3} w={520} lines={["ella no sabía por qué…", "hoy sí"]} />,
  // 9 · vinagre
  <Hanko key="9a" t={t} at={x("no va a la basura", 9)} out={x("lo cortas en rodajas", 9) - 0.2} x={1480} y={760} lines={["NO VA A LA", "BASURA"]} size={84} rot={-4} />,
  <Receta key="9b" t={t} at={x("lo cortas en rodajas", 9)} out={x("lo que iba a la basura", 9) + 1.2} title="ENCURTIDO RÁPIDO" stamp="2 SEMANAS"
    lines={[{ at: x("media taza", 9), q: "½ taza", what: "vinagre de arroz" }, { at: x("dos cucharadas", 9), q: "2 cdas", what: "azúcar" }, { at: x("cucharadita de sal", 9), q: "1 cdta", what: "sal" }]} />,
  // 10 · verdura con sal
  <Nota key="10a" t={t} at={x("un repollo entero", 10)} out={x("entonces cortas la mitad", 10) - 0.2} x={1450} y={640} rot={3} w={520} lines={["un repollo entero", "para ti sola…"]} />,
  <Prensa key="10b" t={t} at={x("le echas sal", 10)} out={x("en un dia suelta", 10) - 0.3} />,
  <Tag key="10c" t={t} at={x("tsukimono", 10)} x={1050} y={600} dx={200} dy={-260} text="TSUKEMONO" sub="VERDURA SALADA" col={KO.washi} out={x("dura una semana larga", 10) - 0.1} size={60} />,
  <Nota key="10d" t={t} at={x("dura una semana larga", 10)} out={TR[10] - 0.25} x={1450} y={700} rot={-3} w={520} lines={["dura una semana", "larga en la heladera"]} />,
  // 11 · jengibre
  <Calma key="11a" t={t} at={x("no lo pelas", 11)} out={x("lo metes entero", 11) + 1.5} ok={false} text="NO LO PELAS" sub="entero, con piel" y={720} />,
  <Calma key="11b" t={t} at={x("no lo cortas", 11)} out={x("lo metes entero", 11) + 1.5} ok={false} text="NO LO CORTAS" sub="entero, a la bolsa" y={900} />,
  <Nieve key="11c" t={t} at={x("como nieve", 11) - 0.3} out={x("nunca mas se te arruga", 11) - 0.2} />,
  <Hanko key="11d" t={t} at={x("nunca mas se te arruga", 11)} out={TR[11] - 0.25} x={1450} y={330} lines={["NUNCA MÁS", "ARRUGADO"]} size={90} rot={5} />,
  // 12 · verdeo
  <BienSeca key="12a" t={t} ats={[x("la secas muy bien", 12), x("esto es importante", 12), x("bien seca", 12)]} out={x("la guardas en un frasco", 12) - 0.2} />,
  <Veredicto key="12b" t={t} at={x("no se pega", 12)} flip={x("en un bloque", 12) + 0.3} out={x("sacas una pizca", 12) - 0.1} no="UN BLOQUE" si="SUELTA" />,
  <Tag key="12c" t={t} at={x("sacas una pizca", 12)} x={1150} y={560} dx={260} dy={-240} text="UNA PIZCA" sub="Y A LA SOPA" col={KO.washi} out={TR[12] - 0.5} size={58} />,
  // 13 · raíces paradas
  <Nota key="13a" t={t} at={x("el nabo largo", 13)} out={x("les cortas las hojas", 13) - 0.2} x={1460} y={600} rot={3} w={460} lines={["nabo largo", "zanahoria", "puerro"]} />,
  <Tag key="13b" t={t} at={x("les chupan el agua", 13)} x={900} y={420} dx={300} dy={-200} text="LAS HOJAS" sub="LE CHUPAN EL AGUA" col={KO.washi} out={x("las envuelves en papel", 13) - 0.2} size={58} />,
  <Parada key="13c" t={t} at={x("se cansan", 13) - 0.2} doble={x("duran el doble", 13)} out={TR[13] - 0.25} />,
  // 14 · soja
  <Tag key="14a" t={t} at={x("el aire la oxida", 14)} x={1100} y={520} dx={160} dy={-220} text="EL AIRE LA OXIDA" col={KO.washi} out={x("mas oscura", 14) - 0.1} size={56} />,
  <Nota key="14b" t={t} at={x("mas oscura", 14)} out={x("asi que despues", 14) - 0.2} x={500} y={700} rot={-3} w={440} lines={["+ oscura", "+ salada", "– perfume"]} />,
  <DosBotellas key="14c" t={t} at={x("la botella chica", 14)} mes={x("en un mes", 14)} out={x("y nunca nunca", 14) - 0.2} />,
  <Hanko key="14d" t={t} at={x("la que se pone fea", 14)} out={x("y nunca nunca", 14) - 0.2} x={560} y={300} lines={["LA QUE SE PONE FEA", "NO ES BARATA"]} size={64} paper />,
  <NoSeHace key="14e" t={t} at={x("al lado del fuego", 14)} out={TR[14] - 0.25} x={700} y={520} r={240} label="NUNCA JUNTO AL FUEGO" />,
  // 15 · furikake
  <Tag key="15a" t={t} at={x("quedan el alga", 15)} x={1000} y={480} dx={300} dy={-240} text="KOMBU + BONITO" sub="EN EL COLADOR" col={KO.washi} out={x("no se tiran", 15) - 0.1} size={54} />,
  <Hanko key="15b" t={t} at={x("no se tiran", 15)} out={x("cortas el alga", 15) - 0.2} x={1450} y={330} lines={["NO SE TIRAN"]} size={100} rot={-5} />,
  <Receta key="15c" t={t} at={x("cortas el alga", 15)} out={x("eso es furikake", 15) - 0.2} title="FURIKAKE CASERO" y={560}
    lines={[{ at: x("cortas el alga", 15) + 0.4, q: "kombu", what: "en cuadraditos" }, { at: x("con las escamas", 15), q: "bonito", what: "las escamas" }, { at: x("una cucharada de salsa", 15), q: "1 cda", what: "salsa de soja" }, { at: x("una de azucar", 15), q: "1 cda", what: "azúcar" }, { at: x("un poquito de sesamo", 15), q: "pizca", what: "sésamo" }]} />,
  <Hanko key="15d" t={t} at={x("lo que otros tiran", 15)} out={SEM - 0.2} x={1460} y={760} lines={["LO QUE", "OTROS TIRAN"]} size={86} rot={4} paper />,
  // la semana
  <Semana key="sa" t={t} at={y("el domingo cocino", 541) - 0.3} out={y("diez minutos", 565) - 0.2} y={830}
    days={[{ i: 0, at: y("el domingo cocino", 541), what: "arroz, caldo y furikake" }, { i: 1, at: y("el lunes reviso", 550), what: "lo triste al vinagre" }, { i: 3, at: y("el miercoles compro", 555), what: "poquito y fresco" }, { i: 6, at: y("el sabado miro", 560), what: "linterna, frasco por frasco" }]} />,
  <Hanko key="sb" t={t} at={y("diez minutos", 565)} out={ERR - 0.2} x={1440} y={330} lines={["10 MINUTOS", "NADA MÁS"]} size={96} rot={-5} />,
  // los 3 errores
  <ErrorCard key="ea" t={t} at={y("el primero la bolsa", 572)} out={y("el segundo los frascos", 580) - 0.2} n={1} text="LA BOLSA CON PINZA" sub="la pinza no cierra, sólo aprieta" />,
  <Hanko key="eb" t={t} at={y("siempre a un frasco", 578)} out={y("el segundo los frascos", 580) - 0.2} x={1480} y={760} lines={["SIEMPRE A", "UN FRASCO"]} size={80} rot={4} paper />,
  <ErrorCard key="ec" t={t} at={y("el segundo los frascos", 580)} out={y("la despensa es un lugar", 590) - 0.2} n={2} text="FRASCOS LINDOS AL SOL" sub="el sol pone viejo todo" />,
  <Nota key="ed" t={t} at={y("la despensa es un lugar", 590)} out={y("el tercero", 595) - 0.2} x={1500} y={720} rot={3} w={500} lines={["la despensa es", "un lugar OSCURO"]} />,
  <ErrorCard key="ee" t={t} at={y("el tercero", 595)} out={y("compra lo que vas", 600) - 0.2} n={3} text="EL PAQUETE GIGANTE" sub="la oferta termina en la basura" />,
  <Hanko key="ef" t={t} at={y("compra lo que vas", 600)} out={TRQ - 0.2} x={1460} y={330} lines={["LO DE UN MES,", "NO MÁS"]} size={84} rot={-4} />,
  // tranquila
  <Calma key="qa" t={t} at={y("no fue tu culpa", 605)} out={y("pon la bolsa nueva", 612) - 0.2} ok text="NO FUE TU CULPA" sub="a veces vienen de la fábrica" y={830} />,
  <Calma key="qb" t={t} at={y("pon la bolsa nueva", 612)} out={y("si el miso se te puso", 618) - 0.2} ok text="3 DÍAS AL CONGELADOR" sub="y se acabó" y={830} />,
  <Calma key="qc" t={t} at={y("si el miso se te puso", 618)} out={y("polvo verde", 625) - 0.2} ok text="MISO OSCURO: NO ESTÁ MALO" sub="raspas la capa de arriba" y={830} />,
  <Calma key="qd" t={t} at={y("polvo verde", 625)} out={CTA - 0.2} ok={false} text="KOMBU VERDE O AZUL" sub="eso sí es moho: se tira" y={830} />,
  // la cuenta
  <Cuenta key="ca" t={t} at={CTA + 0.2} tira={y("se te echa a perder uno", 633)} vez={y("una vez y media", 633)} salva={y("ese paquete ya no se tira", 638)} out={y("no necesitas comprar", 640) - 0.2} x={1380} />,
  <Hanko key="cb" t={t} at={y("necesitas tirar menos", 644)} out={TAR - 0.2} x={1450} y={760} lines={["NO MÁS BARATO:", "TIRAR MENOS"]} size={80} rot={-4} paper />,
  // tarea, comentarios, próximo, cierre
  <Tarea key="ta" t={t} at={y("esta semana no hagas", 648)} b={y("el chile en el arroz", 650)} out={y("la semana que viene", 655) - 0.2} />,
  <Comentarios key="co" t={t} at={y("tu abuela tambien", 658)} out={PROX - 0.2} />,
  <Proximo key="pr" t={t} at={PROX + 0.3} out={y("y como congelo el tofu", 668) - 0.2} />,
  <Tag key="pr2" t={t} at={y("y como congelo el tofu", 668)} x={1200} y={820} dx={60} dy={-300} text="TOFU CONGELADO" sub="A PROPÓSITO" col={KO.washi} out={y("mi madre decia", 675) - 0.4} size={56} />,
  <Nota key="ci" t={t} at={CIE + 0.3} out={y("yo vivo sola", 680) - 0.2} x={1400} y={460} rot={-3} w={760} lines={["“Una cocina chiquita", "y ordenada da de comer", "más que una grande y llena.”"]} />,
  <Hanko key="fin" t={t} at={y("nos vemos pronto", 685)} out={END + 1} x={1440} y={330} lines={["NOS VEMOS", "PRONTO"]} size={96} rot={-5} paper />,
];

// =====================================================================================================
export const Resto: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [<TintaFilter key="tf" />];
  const i = Math.max(0, B.findIndex((_, k) => t >= B[k][0] && t < endOf(k)));
  // debajo: el plano del momento, con barrido de entrada desde el anterior (o vapor). Si el avatar tapa todo, no se dibuja.
  if (!inAvR(t)) {
    const a = B[i][0], kind = B[i][2], cut = i === 0 || nearAv(a);
    if (!cut && kind !== "s" && t < a + 0.25) L.push(<Slide key={"sl" + i} t={t} a={a - 0.2} w={0.45} dir={i % 2 ? 1 : -1} from={shotView(i - 1, t)} to={shotView(i, t)} />);
    else if (i + 1 < B.length && !nearAv(B[i + 1][0]) && B[i + 1][2] !== "s" && t >= B[i + 1][0] - 0.2) L.push(<Slide key={"sl" + (i + 1)} t={t} a={B[i + 1][0] - 0.2} w={0.45} dir={(i + 1) % 2 ? 1 : -1} from={shotView(i, t)} to={shotView(i + 1, t)} />);
    else L.push(<AbsoluteFill key={"sh" + i}>{shotView(i, t)}</AbsoluteFill>);
    if (kind === "s" && !cut) L.push(<SteamWipe key={"sw" + i} t={t} mid={a} w={0.35} />);
    if (i + 1 < B.length && B[i + 1][2] === "s" && !nearAv(B[i + 1][0])) L.push(<SteamWipe key={"sw" + (i + 1)} t={t} mid={B[i + 1][0]} w={0.35} />);
  }
  L.push(<AvatarR key="av" t={t} />);
  TIT.forEach(([n, text, out]) => L.push(<Titulo key={"ti" + n} t={t} n={n} text={text} out={out} />));
  L.push(...pieces(t));
  // fundido final a negro
  L.push(<AbsoluteFill key="fn" style={{ background: "#000", opacity: ei(t, END - 0.9, END - 0.1) }} />);
  return <AbsoluteFill style={{ background: "#0a0705" }}>{L}</AbsoluteFill>;
};
