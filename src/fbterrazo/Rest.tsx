// fbterrazo · DEL 2:22 AL FINAL. Misma vara que el minuto 1 (gary01): una base por frase — toma real (LTX / agnes),
// el mundo 3D del taller (la baldosa, el cajón, el quincho, la Colección) o el avatar — y CERO cortes secos: cada cambio
// de base es una transición (latigazo, portal, zoom a través, giro, empuje, fogonazo); el avatar entra con latigazo y sale
// abriendo un portal. Las piezas 2.5D viven en una capa aparte que cruza las transiciones, clavadas a la palabra con ax().
// Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PT, screenOf, pageAt } from "./taller3d";
import { EV, RW, ax, we } from "./cam";
import { fin } from "./at";
import { Avatar, Calendar, Chips as Fichas, Clip, Desc, Stamp, World, WIN, inAvatar } from "./Min1";
import { BigNum, COL, Flash, LowerThird, Portal, Receipt, Tag, e, ei } from "./lib";
import { CheckList, Mistake, MistakesDeal, StepTitle, Versus, Words } from "./comps2";

export const T0 = EV.fin1;
export const TEND = fin("nos vemos en el patio", 960) + 1.2;
export const FULL_FRAMES = Math.ceil(TEND * 30);

// ---------- transiciones entre bases (gary01) ----------
type Tr = "whip" | "whipL" | "portal" | "zoom" | "flip" | "push" | "light" | "cut";
const DUR: Record<Tr, number> = { whip: 0.5, whipL: 0.5, portal: 0.6, zoom: 0.55, flip: 0.6, push: 0.55, light: 0.5, cut: 0 };
const HB: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={`${x} ${y}`} /></filter></svg>;
const transition = (tr: Tr, k: number, prev: React.ReactNode, cur: React.ReactNode, p: [number, number]) => {
  const L: React.ReactNode[] = [];
  if (tr === "whip" || tr === "whipL") {
    const out = k < 0.5, k2 = out ? k * 2 : (1 - k) * 2, b = Math.round(90 * k2), d = tr === "whip" ? -1 : 1, id = `wb${b}`;
    L.push(<AbsoluteFill key="w" style={{ transform: `translateX(${(out ? d : -d) * k2 * 300}px) scale(${1 + k2 * 0.32})`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={0} /> : null}{out ? prev : cur}</AbsoluteFill>);
    if (k2 > 0.4) L.push(<AbsoluteFill key="wl" style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,226,170,.5) 50%, transparent 80%)", opacity: (k2 - 0.4) / 0.6, mixBlendMode: "screen" }} />);
  } else if (tr === "portal") {
    L.push(<AbsoluteFill key="pp">{prev}</AbsoluteFill>);
    L.push(<Portal key="pc" x={p[0]} y={p[1]} r={ei(k, 0, 1) * 0.999 + 0.001}>{cur}</Portal>);
  } else if (tr === "zoom") {
    const z = ei(k, 0, 1), b = Math.round(22 * Math.sin(Math.PI * k)), id = `zb${b}`;
    L.push(<AbsoluteFill key="zc" style={{ transform: `scale(${1.35 - 0.35 * z})` }}>{cur}</AbsoluteFill>);
    L.push(<AbsoluteFill key="zp" style={{ transformOrigin: `${p[0]}px ${p[1]}px`, transform: `scale(${1 + 3.2 * z})`, opacity: 1 - e(k, 0.35, 0.9), filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={b} /> : null}{prev}</AbsoluteFill>);
  } else if (tr === "flip") {
    const out = k < 0.5, a = out ? ei(k * 2, 0, 1) * 90 : (1 - ei((k - 0.5) * 2, 0, 1)) * -90;
    L.push(<AbsoluteFill key="fb" style={{ background: "radial-gradient(ellipse at 50% 50%, #2a241c, #080604)" }} />);
    L.push(<AbsoluteFill key="ff" style={{ perspective: 2200 }}><AbsoluteFill style={{ transform: `translateZ(${-Math.sin(Math.PI * k) * 500}px) rotateY(${a}deg)`, borderRadius: 30 * Math.sin(Math.PI * k), overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,.8)" }}>{out ? prev : cur}</AbsoluteFill></AbsoluteFill>);
  } else if (tr === "push") {
    const z = ei(k, 0, 1), b = Math.round(60 * Math.sin(Math.PI * k)), id = `pb${b}`;
    L.push(<AbsoluteFill key="up" style={{ transform: `translateY(${-z * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={0} y={b} /> : null}{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="uc" style={{ transform: `translateY(${(1 - z) * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{cur}</AbsoluteFill>);
  } else if (tr === "light") {
    L.push(<AbsoluteFill key="lp">{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="lc" style={{ opacity: e(k, 0.25, 0.75) }}>{cur}</AbsoluteFill>);
    const g = Math.sin(Math.PI * k);
    L.push(<AbsoluteFill key="ll" style={{ background: `radial-gradient(ellipse 80% 70% at ${30 + 40 * k}% 45%, rgba(255,236,200,${0.95 * g}), rgba(255,170,90,${0.35 * g}) 50%, transparent 80%)`, mixBlendMode: "screen" }} />);
  } else L.push(<AbsoluteFill key="c">{cur}</AbsoluteFill>);
  return L;
};

// ---------- LA LÍNEA DE BASES (fuera del avatar). w = mundo; el resto = toma (mp4 si llegó, si no su foto) ----------
type B = { a: number; k: string; tr: Tr; p?: [number, number]; z?: [number, number] };
const W = (a: number, tr: Tr = "whip"): B => ({ a, k: "w", tr });
const C = (a: number, k: string, tr: Tr = "whip", p?: [number, number], z?: [number, number]): B => ({ a, k, tr, p, z });
const RAW: B[] = [
  W(T0, "cut"),
  C(ax("primero de donde sale esto", 143.4) + 0.6, "h_venecia", "zoom", [960, 420]),
  C(we(150.9), "h_recortes"),
  C(ax("los mezclaban con cal", 157.3), "h_terraza", "light"),
  C(ax("y los pulian a mano", 161), "h_rodillas", "push"),
  C(ax("siglos despues", 174.2), "h_banco", "flip"),
  C(ax("las escuelas", 176), "nu_escuela", "whipL"),
  C(ax("las estaciones de tren", 177.4), "h_estacion", "whip"),
  W(RW.crate),
  C(ax("vamos con lo que necesitas", 195.4), "m_mesa", "flip"),
  C(we(201.2), "m_marmol"),
  C(ax("botellas verdes", 208.3), "m_botellas", "whipL"),
  C(we(218.5), "m_melamina"),
  C(ax("lijas diamantadas", 223.9), "m_lijas", "zoom", [960, 560]),
  C(we(234.4), "c_lavar"),
  C(we(248.5), "e_azucar"),
  C(ax("alrededor de cada vidrio", 259.2), "e_pozo", "zoom", [960, 540]),
  C(we(266.8), "s_equipo"),
  C(we(282.3), "c_romper"),
  C(we(299.2), "c_tamizar"),
  C(ax("los grandes de medio", 307.2), "v_gemas", "zoom", [960, 540]),
  C(we(316.3), "v_polvo"),
  C(ax("los pedazos mas grandes", 323.8), "v_grandes", "whip"),
  W(RW.tileA),
  C(we(348.2), "v_punado"),
  W(RW.bags, "flip"),
  C(we(363.7), "c_molde"),
  C(ax("pasas un cordon de silicona", 371), "mo_silicona", "zoom", [960, 600]),
  C(we(379.9), "mo_nivel"),
  C(we(397.8), "mz_tarros"),
  C(we(410.9), "mz_grisvs"),
  W(RW.tileB),
  C(we(444.8), "mz_pigmento"),
  C(ax("mezcla todo en seco", 449.8), "c_mezcla", "push"),
  C(ax("al agua le agregas", 452.9), "mz_adhesivo", "zoom", [960, 500]),
  C(we(459.7), "mz_puno"),
  C(ax("mezcla aguada", 469.5) - 2.6, "mz_poros", "flip"),
  C(we(478.5), "c_volcar"),
  C(ax("golpeas los costados", 488), "vo_burbujas", "zoom", [960, 540]),
  C(we(494.9), "vo_malla"),
  C(ax("tapas el molde", 502.6), "es_nylon", "light"),
  C(we(511.3), "c_desmolde"),
  C(we(527.8), "es_batea"),
  C(ax("si la pulis a los 2", 532.9), "es_crater", "zoom", [960, 540]),
  C(we(544.1), "g_pulir_s2"),
  C(ax("mojas la baldosa", 550.2), "c_lijas", "whip"),
  C(we(561.8), "pu_maquina"),
  C(ax("una amoladora comun", 566), "pu_amoladora", "whipL"),
  C(we(578.5), "p_pulir_s1"),
  C(ax("pasas el trapo", 585.5), "pu_trapo", "zoom", [960, 540]),
  C(we(594.9), "p_pulir_s2"),
  C(ax("pulis parejo", 599.7), "g_pulir_s3", "push"),
  C(ax("lavas bien el barro", 603.3), "pu_luz", "light"),
  C(we(612.3), "em_poros"),
  W(RW.tileC),
  C(we(627.6), "c_empastado"),
  C(ax("dos o tres dias tapada", 632.9) - 0.1, "em_tapada", "push"),
  C(we(642.2), "em_negros"),
  W(RW.tileD),
  C(we(660.9), "em_espejo"),
  C(ax("y el error numero 5", 667.5), "em_polvo", "zoom", [960, 540]),
  C(ax("por eso esto se hace siempre con agua", 681.4), "em_agua", "light"),
  C(ax("el agua no es para", 683.9), "em_viejo", "flip"),
  C(we(694.6), "c_sellar"),
  C(ax("el impregnante no hace", 702.2), "se_macro", "zoom", [960, 540]),
  C(we(711.7), "p_gota_s2"),
  C(we(727.3), "se_mancha"),
  W(RW.bench, "whipL"),
  W(RW.tileE, "cut"),
  C(we(759.7), "nu_juego"),
  C(ax("un terrazo de verdad", 766), "nu_obra", "whip"),
  W(RW.quincho),
  W(RW.tileF),
  C(we(808.1), "ve_pesa"),
  C(ax("pulir lleva tiempo", 808.3) + 1.6, "ve_pila", "push"),
  C(ax("y no es marmol", 813.8), "ve_carrara", "zoom", [960, 540]),
  C(ax("esto es otra cosa", 818.6), "ve_luz", "light"),
  C(we(827.1), "c_colocar"),
  C(we(843.5), "co_junta"),
  W(RW.book, "zoom"),
  C(we(859.3), "co_silicona"),
  C(ax("y si estas pensando en una mesada", 866.5), "co_mesa", "whip"),
  C(we(877.4), "co_mesavieja"),
  W(RW.recap, "flip"),
  W(RW.book2, "cut"),
  C(we(939.3), "ta_una"),
  C(ax("con las botellas que tenes en el fondo", 941.6), "c_piso", "whip"),
  C(ax("cuando le pases la primera lija", 947.7), "ta_primer", "zoom", [960, 540]),
  C(we(957.0), "ta_azul"),
  C(ax("mi viejo decia", 963.3), "ta_banco", "light"),
];
const BEATS: B[] = [...RAW].sort((x, y) => x.a - y.a)
  // si la base arranca justo cuando se va el avatar, la transición ya la hace el portal del avatar
  .map((b) => (WIN.some((w) => Math.abs(w.me - b.a) < 0.3) ? { ...b, tr: "cut" as Tr } : b));
// cuánto se ve cada toma (hasta la próxima base o hasta que entra el avatar): para la cámara lenta
const visible = (i: number) => {
  const a = BEATS[i].a, nx = BEATS[i + 1]?.a ?? TEND, w = WIN.find((x) => x.ms > a + 0.2);
  return Math.max(0.5, Math.min(nx, w ? w.ms : nx) - a);
};
const view = (i: number, t: number) => {
  const b = BEATS[i];
  return b.k === "w" ? <World t={t} /> : <Clip k={b.k} at={b.a} t={t} z={b.z} dur={visible(i)} />;
};
const beatAt = (t: number) => { let i = 0; while (i < BEATS.length - 1 && BEATS[i + 1].a <= t) i++; return i; };
const Content: React.FC<{ t: number }> = ({ t }) => {
  const i = beatAt(t), b = BEATS[i], D = DUR[b.tr], k = D > 0 ? (t - b.a) / D : 1;
  if (i > 0 && k < 1 && !(b.k === "w" && BEATS[i - 1].k === "w")) return <>{transition(b.tr, k, view(i - 1, t), view(i, t), b.p ?? [960, 540])}</>;
  return view(i, t);
};
// avatar encima del contenido según el reel: entra con latigazo, sale abriendo un portal
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

// ---------- anclas de las piezas ----------
export const A = {
  venecia: ax("hace mas de 500 anos", 147.2), recortes: ax("se llevaban los recortes", 152), nadie: ax("pedacitos que nadie queria", 156),
  cal: ax("los mezclaban con cal", 157.3), rodillas: ax("de rodillas", 163), nombre: ax("de ahi viene el nombre", 167.5), pobres: ax("era el piso de los pobres", 170.3),
  ricos: ax("lo que tiraban los ricos", 172), bancos: ax("los bancos", 175), setenta: ax("70 80 anos despues", 182), floja: ax("sin una baldosa floja", 184),
  nosotros: ax("nosotros vamos a hacer", 187.5), tiramos: ax("con lo que tiramos nosotros", 192), necesitas: ax("vamos con lo que necesitas", 195.4),
  cemento: ax("cemento blanco y aca", 197), reemplazo: ax("no hay reemplazo", 199), arena: ax("arena fina y clara", 201.2), regalan: ax("te lo regalan", 206),
  botellas: ax("botellas verdes", 208.3), adhesivo: ax("un adhesivo acrilico", 213.1), malla: ax("un pedazo de malla", 217.5), melamina: ax("una placa de melamina", 221.2),
  lijas: ax("lijas diamantadas", 223.9), numeros: ax("en numeros 50", 228), sellador: ax("y un sellador impregnante", 231.3), nada: ax("nada mas", 234.1),
  p1: ax("paso 1", 234.7), lavan: ax("las botellas se lavan", 237.5), caliente: ax("con agua caliente", 241), e1: ax("este es el error numero uno", 246.8),
  azucar: ax("el azucar frena el cemento", 253), doble: ax("tarda el doble", 257), blando: ax("el cemento queda blando", 260.5), pozo: ax("te deja un pozo", 264),
  pegamento: ax("el pegamento de la etiqueta", 266.5), paciencia: ax("agua caliente y paciencia", 270), guantes: ax("guantes gruesos", 273.9), anteojos: ax("anteojos de seguridad", 275),
  barbijo: ax("barbijo", 276.5), manga: ax("manga larga", 277.5), arpillera: ax("una bolsa de arpillera", 281.5), maza: ax("con una masa", 288), secos: ax("golpes secos", 291.9),
  cruje: ax("como cruje", 294), tamiza: ax("despues se tamiza", 299.3), tres: ax("separas tres tamanos", 304.5), grandes: ax("los grandes de medio", 307.2), gemas: ax("esas son tus gemas", 311),
  medianos: ax("los medianos", 314.4), polvito: ax("y el polvito fino", 319.1), muyGrandes: ax("los pedazos mas grandes", 323.8), parten: ax("se te parten al pulir", 328.5),
  oro: ax("un dato que vale oro", 330.7), pelea: ax("tienen una pelea quimica", 333), hincharse: ax("puede hincharse", 337.5), polvoFino: ax("le agregan ese polvo finito", 345),
  calma: ax("calma esa reaccion", 349), punadito: ax("un punadito de polvo de vidrio por balde", 351.3), seguro: ax("es un seguro", 356),
  p2: ax("paso 2", 354.1), cuarenta: ax("40 x 40", 362), tres3: ax("3 cm de alto", 366), canto: ax("el canto redondeado", 377), aceite: ax("aceite de cocina usado", 380.5),
  abajo: ax("la de abajo", 388), liso: ax("tiene que ser liso", 392), bocaAbajo: ax("se arma boca abajo", 396),
  p3: ax("paso 3", 395.7), medida: ax("la medida es una de cemento blanco", 400), unaArena: ax("una de arena fina", 403), dosVidrio: ax("y dos de vidrio", 406), tarro: ax("con el mismo tarro", 409),
  porque: ax("por que cemento blanco", 413.8), gris: ax("si lo metes en cemento gris", 419), charco: ax("una botella sucia en un charco", 423), miel: ax("brilla como miel", 428.5),
  e2: ax("ese es el error numero 2", 431.2), pigmento: ax("un pigmento para cemento", 434), cinco: ax("nunca mas", 437.5), negro: ax("un poquito de negro", 442.3), ocre: ax("un poquito de ocre", 445.3),
  seco: ax("mezcla todo en seco", 449.8), diez: ax("una parte cada 10", 455), deApoco: ax("va de a poco", 458), castillos: ax("castillos en la playa", 465), chorrea: ax("no chorrea agua", 469.5), poros: ax("mezcla aguada es mezcla con poros", 470.5),
  p4: ax("paso 4", 474), mitad: ax("hasta la mitad", 481.5), contraFondo: ax("contra el fondo", 484.5), martillo: ax("con un martillo de goma", 489.5), minuto: ax("un minuto entero", 491.5), mallaV: ax("pones la malla", 495),
  p5: ax("paso 5", 499.5), nylon: ax("tapas el molde con un nylon", 503.2), dosDias: ax("a los dos dias", 506.9), fea: ax("sale gris opaca fea", 511.3), desanimes: ax("no te desanimes", 520.2),
  batea: ax("va a una batea", 524), semana: ax("una semana entera", 527.5), e3: ax("el error numero 3", 530.4), crateres: ax("llena de crateres", 539), siete: ax("7 dias", 542), invierno: ax("en invierno 10", 545),
  p6: ax("paso 6", 545.4), momento: ax("este es el momento", 549.2), cincuenta: ax("la lija diamantada numero 50", 552), aMano: ax("si no a mano", 563.5), amoladora: ax("una amoladora comun", 567.6),
  disyuntor: ax("siempre con disyuntor", 572.4), barro: ax("al principio sale un barro gris", 574.2), verde: ax("verde", 582), ras: ax("cortada al ras", 582.8), otra: ax("y otra", 587), ambar: ax("y el ambar", 588.5), hielo: ax("parece hielo", 590.5),
  piso: ax("se convierte en un piso", 592.5), olvidas: ax("no te la olvidas mas", 597), parejo: ax("pulis parejo", 599.7), contraLuz: ax("contra la luz", 606),
  p7: ax("paso 7", 608.5), agujeritos: ax("vas a ver agujeritos", 610.8), lechada: ax("una lechada de cemento blanco", 621), crema: ax("espesa como una crema", 625), tapada: ax("dos o tres dias tapada", 632.9),
  e4: ax("el error numero cuatro", 635.4), negros: ax("puntitos negros", 644), cien: ax("100 200 400", 650), patio: ax("para el patio o la galeria", 656.2), resbala: ax("no resbala", 661), ochocientos: ax("hasta 800", 665), espejo: ax("como un espejo", 667),
  e5: ax("y el error numero 5", 668.8), enSeco: ax("pulir en seco", 671.5), silice: ax("es silice fina", 676), pulmones: ax("en los pulmones", 679), conAgua: ax("siempre con agua", 682), veinte: ax("dentro de 20 anos", 687),
  p8: ax("paso 8", 689), sellado: ax("el sellado y la prueba", 690.5), sol: ax("dos dias al sol", 694), segunda: ax("y una segunda mano", 700), noCapa: ax("no hace una capa encima", 703), porDentro: ax("lo cierra por dentro", 706.5),
  prueba: ax("y ahora la prueba", 708.2), tresGotas: ax("tres gotas", 713), mira: ax("mira", 715.5), perla: ax("como una perla dorada", 718), noSeAbre: ax("no se abre", 720.8), cincoMin: ax("espero cinco minutos", 722.6), sombra: ax("ni una sombra", 726.2),
  quinchoM: ax("hace lo mismo en tu alisado", 727.5), manchaVida: ax("para toda la vida", 731.5), numerosC: ax("vamos a los numeros", 733), villanos: ax("no hay villanos", 735.5),
  kilos: ax("dos kilos y medio de cemento blanco", 740), arenaS: ax("sumale la arena", 744.1), gratis: ax("que es gratis", 750), cuatro: ax("unos 4 dolares", 752.5), metro: ax("un metro cuadrado son 6", 754.3), veinticinco: ax("unos 25 dolares", 758),
  juego: ax("un juego te pule un patio entero", 763.5), empresa: ax("por una empresa", 770), cienD: ax("arranca en 100 dolares", 771), dura: ax("cuanto dura", 776.5), primerAno: ax("desde el primer ano", 779.5),
  bancosV: ax("el terrazo de los bancos viejos", 781), siglos: ax("de hace siglos", 786.5), duro: ax("es mas duro que el marmol", 790), noSeGasta: ax("no se gasta en tu vida", 794),
  verdad: ax("ahora la verdad", 794.8), esTerrazo: ax("es terrazo", 797.9), si: ax("si", 798.9), piedrasEn: ax("piedras en cemento pulidas", 801), noImit: ax("no es una imitacion", 802.7), cosas: ax("tiene sus cosas", 804.5),
  pesa: ax("pesa unos 10 kilos", 806.5), mediaHora: ax("mas de media hora", 812), carrara: ax("el marmol blanco de carrara", 816.5), luzB: ax("con la luz de las botellas", 820.5), noMancha: ax("no se mancha", 823.5),
  comoPone: ax("como se pone", 828.7), contrapiso: ax("sobre un contrapiso firme", 829.4), porcelanato: ax("pegamento para porcelanato", 832), tresMm: ax("3 milimetros de junta", 835), pastina: ax("pastina blanca", 838),
  dilatacion: ax("una junta de dilatacion", 842), coleccion: ax("en la coleccion en la pagina", 847.1), poliuretano: ax("es el poliuretano", 853.5), noventa: ax("el 90", 859.5), silicona: ax("pone silicona", 862), inviernos: ax("a los dos inviernos", 864.5),
  mesada: ax("en una mesada", 868), hierros: ax("dos hierros finitos", 874.5), mesaViejo: ax("la mesa del patio de mi viejo", 877.6), domingos: ax("40 anos de domingos", 880.5), todavia: ax("todavia esta", 883),
  repaso: ax("te repaso los 5 errores", 883.8), r1: ax("1 vidrio sucio", 885.5), r2: ax("2 cemento gris", 893), r3: ax("3 pulir antes", 897.5), r4: ax("4 saltear", 902), r5: ax("5 pulir en seco", 908),
  medidas: ax("todas las medidas", 915.2), colec2: ax("la coleccion del constructor libre", 928), link: ax("el link en la primera linea", 932.4), tarea: ax("la tarea para esta semana", 935.7),
  entero: ax("no hagas el patio entero", 938.4), una: ax("hace una baldosa", 940), kilo: ax("un kilo de cemento blanco", 945), primerV: ax("el primer vidrio", 950.5), meVas: ax("me vas a entender", 951.5),
  comentarios: ax("contame en los comentarios", 953.5), colorB: ax("de que color serian tus botellas", 955), verdeC: ax("verde de cerveza", 957), azul: ax("el azul de algun vino raro", 959.5), leo: ax("leo todos", 961.9),
  viejoD: ax("mi viejo decia", 963.3), caro: ax("no tiene por que ser caro", 965.5), bienHecho: ax("tiene que estar bien hecho", 967.2), nosVemos: ax("nos vemos en el patio", 968.4),
};

// ---------- LA CAPA DE PIEZAS (cruza las transiciones) ----------
const pieces = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const g = (a: number, b: number) => t > a - 0.5 && t < b + 0.8;   // sólo se arma cerca de su tramo
  // 1 · Venecia → bancos → nosotros
  if (g(A.venecia, A.necesitas)) L.push(
    <BigNum key="500" t={t} at={A.venecia + 0.2} text="+500 AÑOS" x={1380} y={250} size={150} col="#e8d8b4" edge="#4a3a22" sub="VENECIA" out={A.nadie - 0.3} />,
    <Words key="nq" t={t} items={[{ at: A.recortes + 0.6, txt: "LOS RECORTES" }, { at: A.nadie, txt: "QUE NADIE QUERÍA", col: COL.amber }]} out={A.cal - 0.25} y={880} size={84} />,
    <Fichas key="cal" t={t} items={[{ at: A.cal + 0.5, tx: "CAL", col: "#e8e4dc" }, { at: A.cal + 2.6, tx: "EN LAS TERRAZAS", col: COL.amber }, { at: A.rodillas, tx: "A MANO · DE RODILLAS", col: COL.leaf }]} out={A.nombre - 0.6} y={880} />,
    <Words key="tz" t={t} items={[{ at: A.nombre + 1.2, txt: "TERRAZO" }, { at: A.nombre + 1.9, txt: "← TERRAZA", col: COL.amber }]} out={A.pobres - 0.3} y={200} size={120} />,
    <Versus key="pr" t={t} at={A.pobres} out={A.bancos - 0.5} title="EL PISO DE LOS POBRES" L={{ label: "LO QUE TIRABAN", val: "LOS RICOS", h: 0.35, col: "#c9c5bc" }} R={{ label: "HECHO POR", val: "LOS POBRES", h: 0.9, col: COL.amber, mark: "ok" }} />,
    <Fichas key="bn" t={t} items={[{ at: A.bancos, tx: "BANCOS", col: "#e8d8b4" }, { at: A.bancos + 0.9, tx: "ESCUELAS", col: "#e8d8b4" }, { at: A.bancos + 1.9, tx: "ESTACIONES", col: "#e8d8b4" }]} out={A.setenta - 0.4} y={880} />,
    <BigNum key="80" t={t} at={A.setenta} text="80 AÑOS" x={1400} y={260} size={150} col={COL.leaf} edge="#1d3a12" sub="SIN UNA BALDOSA FLOJA" out={A.nosotros - 0.3} />,
    <Words key="ns" t={t} items={[{ at: A.tiramos, txt: "LO QUE TIRAMOS" }, { at: A.tiramos + 1.6, txt: "= BOTELLAS", col: COL.leaf }]} out={A.necesitas - 0.3} y={880} size={92} />,
  );
  // 2 · lo que necesitás
  if (g(A.necesitas, A.p1)) L.push(
    <CheckList key="ck" t={t} title="LO QUE NECESITÁS" x={1300} y={150} rows={[{ at: A.cemento, txt: "CEMENTO BLANCO" }, { at: A.arena, txt: "ARENA FINA / POLVO DE MÁRMOL" }, { at: A.botellas, txt: "BOTELLAS" }, { at: A.adhesivo, txt: "ADHESIVO ACRÍLICO" }, { at: A.malla, txt: "MALLA DE ALAMBRE" }, { at: A.melamina, txt: "MELAMINA" }, { at: A.lijas, txt: "LIJAS DIAMANTADAS" }, { at: A.sellador, txt: "SELLADOR IMPREGNANTE" }]} out={A.nada + 0.4} />,
    <Stamp key="nr" t={t} at={A.reemplazo} text="SIN REEMPLAZO" x={560} y={220} out={A.arena - 0.2} rot={-6} size={80} />,
    <Tag key="rg" t={t} at={A.regalan} x={640} y={560} dx={-200} dy={-180} text="A VECES, GRATIS" sub="EN LAS MARMOLERÍAS" col={COL.leaf} out={A.botellas - 0.3} size={50} />,
    <Words key="lj" t={t} items={[{ at: A.numeros, txt: "50" }, { at: A.numeros + 0.6, txt: "100", col: COL.amber }, { at: A.numeros + 1.2, txt: "200", col: COL.amber }, { at: A.numeros + 1.8, txt: "400", col: COL.leaf }]} out={A.sellador - 0.2} y={880} size={110} />,
  );
  // 3 · PASO 1 · el vidrio
  if (g(A.p1, A.p2)) L.push(
    <ST key="s1" t={t} at={A.p1} n={1} name="EL VIDRIO" out={A.lavan + 0.4} col={COL.leaf} />,
    <Fichas key="lv" t={t} items={[{ at: A.caliente, tx: "AGUA CALIENTE", col: COL.amber }, { at: A.caliente + 2.2, tx: "SIN ETIQUETA", col: COL.ink }, { at: A.caliente + 3.4, tx: "SIN PEGAMENTO", col: COL.ink }]} out={A.e1 - 0.3} y={880} />,
    <Mistake key="m1" t={t} at={A.e1 + 0.3} n={1} txt="VIDRIO SUCIO" out={A.azucar - 1.2} />,
    <Tag key="az" t={t} at={A.azucar - 0.6} x={960} y={600} dx={-260} dy={-230} text="AZÚCAR" sub="FRENA EL CEMENTO" col={COL.amber} out={A.blando - 0.2} size={58} />,
    <BigNum key="x2" t={t} at={A.doble} text="×2" x={1480} y={280} size={220} col={COL.red} edge="#4a0d08" sub="TARDA EL DOBLE EN FRAGUAR" out={A.blando - 0.2} />,
    <Tag key="po" t={t} at={A.pozo} x={960} y={560} dx={240} dy={-200} text="LA PIEDRA SE SALE" sub="Y QUEDA UN POZO" col={COL.red} out={A.pegamento - 0.3} size={54} />,
    <Words key="pc" t={t} items={[{ at: A.paciencia, txt: "AGUA CALIENTE" }, { at: A.paciencia + 0.9, txt: "Y PACIENCIA", col: COL.amber }]} out={A.guantes - 0.3} y={880} size={88} />,
    <CheckList key="eq" t={t} title="SIN DISCUSIÓN" x={1320} y={200} rows={[{ at: A.guantes, txt: "GUANTES GRUESOS" }, { at: A.anteojos, txt: "ANTEOJOS" }, { at: A.barbijo, txt: "BARBIJO" }, { at: A.manga, txt: "MANGA LARGA" }]} out={A.arpillera - 0.6} />,
    <Fichas key="ar" t={t} items={[{ at: A.arpillera, tx: "3-4 BOTELLAS", col: COL.leaf }, { at: A.arpillera + 1.2, tx: "BOLSA DE ARPILLERA", col: COL.ink }, { at: A.maza - 2, tx: "DENTRO DE UN CAJÓN", col: COL.amber }]} out={A.secos - 0.3} y={880} />,
    <Words key="gs" t={t} items={[{ at: A.secos, txt: "GOLPES SECOS" }, { at: A.secos + 1.0, txt: "NO MUCHOS", col: COL.amber }]} out={A.tamiza - 0.3} y={200} size={100} />,
    <Versus key="tm" t={t} at={A.tres} out={A.muyGrandes - 0.3} title="TRES TAMAÑOS" L={{ label: "GEMAS · ½-1 cm", val: "SE VEN", h: 0.9, col: COL.leaf, mark: "ok" }} R={{ label: "MEDIANOS · ARROZ", val: "RELLENAN", h: 0.55, col: COL.amber, mark: "ok" }} />,
    <Tag key="pf" t={t} at={A.polvito + 0.4} x={960} y={600} dx={240} dy={-210} text="NO LO TIRES" sub="EL POLVITO DE ABAJO" col={COL.leaf} out={A.muyGrandes - 0.3} size={56} />,
    <Stamp key="1cm" t={t} at={A.parten - 0.5} text="+1 cm = SE PARTE" x={960} y={880} out={A.oro - 0.2} rot={-4} size={80} />,
    <Words key="or" t={t} items={[{ at: A.oro, txt: "UN DATO QUE VALE ORO", col: "#ffd76a" }]} out={A.pelea - 0.1} y={880} size={84} />,
  );
  if (g(A.pelea, A.p2)) {
    const p = screenOf(t, PT.tile), inW = t > RW.tileA && t < A.polvoFino;
    if (inW) L.push(<Tag key="hi" t={t} at={A.hincharse} x={p.x} y={p.y} dx={-300} dy={-220} text="EL VIDRIO SE HINCHA" sub="UNA PELEA DE AÑOS" col={COL.red} out={A.polvoFino - 0.3} size={56} />);
    L.push(
      <Words key="pq" t={t} items={[{ at: A.pelea + 0.4, txt: "VIDRIO" }, { at: A.pelea + 0.9, txt: "VS", col: COL.red }, { at: A.pelea + 1.3, txt: "CEMENTO" }]} out={A.hincharse - 0.3} y={200} size={110} />,
      <Words key="pf2" t={t} items={[{ at: A.polvoFino, txt: "+ POLVO DE VIDRIO", col: COL.leaf }, { at: A.calma, txt: "= CALMA LA REACCIÓN" }]} out={A.punadito - 0.3} y={880} size={80} />,
      <BigNum key="pb" t={t} at={A.punadito + 0.5} text="1 PUÑADITO" x={1420} y={260} size={120} col={COL.leaf} edge="#1d3a12" sub="POR BALDE" out={A.seguro - 0.2} />,
      <Stamp key="sg" t={t} at={A.seguro + 0.3} text="ES UN SEGURO" x={960} y={880} out={A.p2 + 0.3} rot={-5} size={96} col={COL.leaf} />,
    );
  }
  // 4 · PASO 2 · el molde
  if (g(A.p2, A.p3)) L.push(
    <ST key="s2" t={t} at={A.p2 + 0.1} n={2} name="EL MOLDE" out={A.p2 + 4.2} />,
    <BigNum key="40" t={t} at={A.cuarenta} text="40 × 40" x={1420} y={250} size={150} col={COL.ink} edge="#3a2a18" sub="FONDO DE MELAMINA" out={A.tres3 + 1.4} />,
    <Tag key="3c" t={t} at={A.tres3 + 0.3} x={960} y={620} dx={260} dy={-180} text="COSTADOS: 3 cm" col={COL.amber} out={A.canto - 2.5} size={52} />,
    <Tag key="cr" t={t} at={A.canto - 1.2} x={960} y={600} dx={-260} dy={-200} text="SILICONA EN LAS ESQUINAS" sub="CANTO REDONDEADO" col={COL.leaf} out={A.aceite - 0.3} size={50} />,
    <Words key="ac" t={t} items={[{ at: A.aceite, txt: "ACEITE USADO" }, { at: A.aceite + 1.2, txt: "MANO FINITA", col: COL.amber }]} out={A.abajo - 1.5} y={880} size={84} />,
    <Words key="cv" t={t} items={[{ at: A.abajo - 0.4, txt: "LA CARA QUE SE VE", col: COL.amber }, { at: A.abajo + 0.2, txt: "= LA DE ABAJO" }]} out={A.liso - 0.3} y={200} size={92} />,
    <Fichas key="ln" t={t} items={[{ at: A.liso, tx: "LISO", col: COL.ink }, { at: A.liso + 0.9, tx: "SIN RAYAS", col: COL.ink }, { at: A.liso + 1.9, tx: "NIVELADO", col: COL.leaf }]} out={A.bocaAbajo - 0.6} y={880} />,
  );
  // 5 · PASO 3 · la mezcla
  if (g(A.p3, A.p4)) L.push(
    <ST key="s3" t={t} at={A.p3 + 2.1} n={3} name="LA MEZCLA" out={A.medida - 0.2} col={COL.leaf} />,
    <Words key="rc" t={t} items={[{ at: A.medida + 0.8, txt: "1 CEMENTO" }, { at: A.unaArena, txt: "1 ARENA", col: "#e8d8b4" }, { at: A.dosVidrio, txt: "2 VIDRIO", col: COL.leaf }]} out={A.porque - 0.3} y={200} size={100} />,
    <Tag key="tr" t={t} at={A.tarro + 0.2} x={960} y={600} dx={260} dy={-200} text="EN VOLUMEN" sub="CON EL MISMO TARRO" col={COL.amber} out={A.porque - 0.3} size={54} />,
    <Versus key="gb" t={t} at={A.porque} out={A.e2 - 0.4} title="¿POR QUÉ BLANCO?" L={{ label: "CEMENTO GRIS", val: "APAGADO", h: 0.3, col: "#9a968e", mark: "x" }} R={{ label: "CEMENTO BLANCO", val: "BRILLA", h: 0.95, col: COL.leaf, mark: "ok" }} />,
    <Mistake key="m2" t={t} at={A.e2 + 0.2} n={2} txt="CEMENTO GRIS" out={A.pigmento - 0.3} />,
    <BigNum key="5p" t={t} at={A.cinco} text="MÁX 5%" x={1430} y={260} size={150} col={COL.amber} edge="#5a3410" sub="DE PIGMENTO" out={A.seco - 0.3} />,
    <Fichas key="pg" t={t} items={[{ at: A.negro + 0.3, tx: "NEGRO = GRANITO", col: "#c9c5bc" }, { at: A.ocre + 0.3, tx: "OCRE = CASA VIEJA", col: "#e0b060" }]} out={A.seco - 0.3} y={880} />,
    <Words key="sc" t={t} items={[{ at: A.seco + 0.2, txt: "EN SECO" }, { at: A.seco + 1.4, txt: "SIN RAYAS", col: COL.amber }]} out={A.diez - 1.6} y={200} size={100} />,
    <BigNum key="10" t={t} at={A.diez} text="1 : 10" x={1430} y={260} size={150} col={COL.ice} edge="#1d3a52" sub="ADHESIVO : AGUA" out={A.castillos - 2.5} />,
    <Tag key="cs" t={t} at={A.castillos} x={960} y={580} dx={-260} dy={-200} text="ARENA DE CASTILLOS" sub="NO CHORREA" col={COL.amber} out={A.poros - 0.3} size={54} />,
    <Stamp key="pa" t={t} at={A.poros + 0.3} text="AGUADA = POROS" x={960} y={880} out={A.p4 + 0.3} rot={-4} size={88} />,
  );
  // 6 · PASO 4 y 5 · volcar y esperar
  if (g(A.p4, A.p6)) L.push(
    <ST key="s4" t={t} at={A.p4} n={4} name="VOLCAR" out={A.mitad - 0.2} />,
    <Tag key="gm" t={t} at={A.contraFondo} x={960} y={640} dx={260} dy={-220} text="GEMAS CONTRA EL FONDO" sub="ES LA CARA QUE SE VE" col={COL.leaf} out={A.martillo - 0.3} size={50} />,
    <BigNum key="1m" t={t} at={A.minuto} text="1 MINUTO" x={1420} y={260} size={130} col={COL.ink} edge="#3a2a18" sub="GOLPES HASTA QUE NO SUBAN BURBUJAS" out={A.mallaV - 0.3} />,
    <ST key="s5" t={t} at={A.p5} n={5} name="ESPERAR" out={A.nylon - 0.1} col={COL.ice} />,
    <Calendar key="cl" t={t} x={140} y={130} label="DÍA" inAt={A.nylon + 0.6} out={A.desanimes} days={[{ at: A.nylon + 0.6, d: 1 }, { at: A.dosDias + 0.2, d: 2 }]} />,
    <Words key="fe" t={t} items={[{ at: A.fea, txt: "GRIS" }, { at: A.fea + 0.5, txt: "OPACA" }, { at: A.fea + 1.0, txt: "FEA", col: COL.red }]} out={A.desanimes - 0.3} y={200} size={110} />,
    <Stamp key="da" t={t} at={A.desanimes + 0.4} text="ESTÁ TODO AHÍ ADENTRO" x={960} y={880} out={A.batea - 0.2} rot={-4} size={72} col={COL.leaf} />,
    <Calendar key="c7" t={t} x={140} y={130} label="DÍA" inAt={A.semana} out={A.p6 - 0.2} days={[{ at: A.semana, d: 1 }, { at: A.semana + 0.5, d: 4 }, { at: A.semana + 1.0, d: 7 }, { at: A.invierno, d: 10 }]} />,
    <Mistake key="m3" t={t} at={A.e3 + 0.2} n={3} txt="NO ESPERAR" out={A.crateres - 1.5} />,
    <Tag key="ct" t={t} at={A.crateres - 0.8} x={960} y={560} dx={250} dy={-210} text="CRÁTERES" sub="EL DISCO ARRANCA LAS GEMAS" col={COL.red} out={A.siete - 0.2} size={56} />,
    <BigNum key="7d" t={t} at={A.siete} text="7 DÍAS" x={1420} y={260} size={150} col={COL.leaf} edge="#1d3a12" sub="EN INVIERNO, 10" out={A.p6 - 0.2} />,
  );
  // 7 · PASO 6 · la primera pasada
  if (g(A.p6, A.p7)) L.push(
    <ST key="s6" t={t} at={A.p6} n={6} name="LA PRIMERA PASADA" out={A.momento + 0.5} col={COL.leaf} />,
    <BigNum key="50" t={t} at={A.cincuenta} text="LIJA 50" x={1420} y={250} size={140} col={COL.amber} edge="#5a3410" sub="EN CÍRCULOS · SIEMPRE CON AGUA" out={A.aMano - 3} />,
    <Tag key="tc" t={t} at={A.aMano + 0.3} x={960} y={620} dx={-260} dy={-200} text="O A MANO, CON UN TACO" sub="COMO LOS VENECIANOS" col="#e8d8b4" out={A.amoladora - 0.2} size={50} />,
    <Stamp key="am" t={t} at={A.amoladora + 0.6} text="AMOLADORA + AGUA = ACCIDENTE" x={960} y={200} out={A.disyuntor + 1.6} rot={-4} size={64} />,
    <Fichas key="dy" t={t} items={[{ at: A.disyuntor, tx: "SIEMPRE CON DISYUNTOR", col: COL.amber }]} out={A.barro - 0.2} y={880} />,
    <Words key="vd" t={t} items={[{ at: A.verde, txt: "VERDE", col: COL.leaf }, { at: A.ras + 0.4, txt: "AL RAS, BRILLANDO", col: COL.ink }]} out={A.otra - 0.2} y={200} size={110} />,
    <Words key="ot" t={t} items={[{ at: A.otra, txt: "OTRA" }, { at: A.otra + 0.6, txt: "OTRA" }, { at: A.ambar, txt: "ÁMBAR", col: COL.amber }, { at: A.hielo - 0.3, txt: "HIELO", col: COL.ice }]} out={A.piso - 0.6} y={200} size={100} />,
    <Words key="pz" t={t} items={[{ at: A.olvidas - 0.4, txt: "NO TE LA OLVIDÁS MÁS", col: "#ffd76a" }]} out={A.parejo - 0.3} y={880} size={78} />,
    <Tag key="pj" t={t} at={A.parejo + 0.3} x={960} y={560} dx={260} dy={-200} text="TODAS A LA MISMA ALTURA" col={COL.ink} out={A.contraLuz - 0.8} size={50} />,
  );
  // 8 · PASO 7 · el empastado
  if (g(A.p7, A.p8)) L.push(
    <ST key="s7" t={t} at={A.p7} n={7} name="EL EMPASTADO" out={A.agujeritos + 0.2} />,
    <Tag key="ag" t={t} at={A.agujeritos + 1.6} x={960} y={540} dx={240} dy={-200} text="POROS Y HUEQUITOS" sub="ES NORMAL" col={COL.amber} out={A.lechada - 0.3} size={54} />,
    <Fichas key="lc" t={t} items={[{ at: A.lechada + 0.4, tx: "CEMENTO BLANCO", col: COL.ink }, { at: A.lechada + 2.4, tx: "+ POLVITO DE VIDRIO", col: COL.leaf }, { at: A.crema, tx: "ESPESA COMO CREMA", col: COL.amber }]} out={A.tapada - 0.3} y={880} />,
    <Calendar key="c3" t={t} x={140} y={130} label="DÍA" inAt={A.tapada} out={A.e4 - 0.2} days={[{ at: A.tapada, d: 1 }, { at: A.tapada + 0.8, d: 3 }]} />,
    <Mistake key="m4" t={t} at={A.e4 + 0.2} n={4} txt="SALTEAR EL EMPASTADO" out={A.negros - 1.4} />,
    <Tag key="pn" t={t} at={A.negros - 0.4} x={960} y={600} dx={-260} dy={-200} text="PUNTITOS NEGROS" sub="PARA SIEMPRE" col={COL.red} out={A.cien - 0.3} size={56} />,
    <Words key="ci" t={t} items={[{ at: A.cien, txt: "100" }, { at: A.cien + 0.7, txt: "200", col: COL.amber }, { at: A.cien + 1.4, txt: "400", col: COL.leaf }]} out={A.patio - 0.5} y={200} size={130} />,
    <Versus key="sa" t={t} at={A.patio + 0.6} out={A.e5 - 0.4} title="¿HASTA DÓNDE PULIR?" L={{ label: "PATIO · GALERÍA", val: "200-400", h: 0.6, col: COL.amber, mark: "ok" }} R={{ label: "ADENTRO", val: "800", h: 0.95, col: COL.ice, mark: "ok" }} />,
    <Mistake key="m5" t={t} at={A.e5 + 0.2} n={5} txt="PULIR EN SECO" out={A.silice - 0.3} />,
    <BigNum key="si" t={t} at={A.silice} text="SÍLICE" x={1420} y={260} size={150} col={COL.red} edge="#4a0d08" sub="SE QUEDA EN LOS PULMONES" out={A.conAgua - 0.3} />,
    <Stamp key="ca" t={t} at={A.conAgua} text="SIEMPRE CON AGUA" x={960} y={880} out={A.p8 - 0.3} rot={-4} size={96} col={COL.ice} />,
    <Words key="20" t={t} items={[{ at: A.veinte - 0.6, txt: "PARA QUE ESTÉS BIEN", col: COL.ink }, { at: A.veinte, txt: "EN 20 AÑOS", col: COL.leaf }]} out={A.p8 - 0.3} y={200} size={84} />,
  );
  // 9 · PASO 8 · sellado y la prueba de la gota
  if (g(A.p8, A.numerosC)) L.push(
    <ST key="s8" t={t} at={A.p8} n={8} name="SELLADO Y PRUEBA" out={A.sol - 0.3} col={COL.leaf} />,
    <Fichas key="sl" t={t} items={[{ at: A.sol, tx: "2 DÍAS AL SOL", col: COL.amber }, { at: A.sol + 2.6, tx: "MANO FINITA", col: COL.ink }, { at: A.segunda, tx: "2ª MANO", col: COL.leaf }]} out={A.noCapa - 0.3} y={880} />,
    <Words key="pd" t={t} items={[{ at: A.noCapa, txt: "NO ES UNA CAPA" }, { at: A.porDentro, txt: "CIERRA POR DENTRO", col: COL.leaf }]} out={A.prueba - 0.2} y={200} size={92} />,
    <BigNum key="3g" t={t} at={A.tresGotas} text="3 GOTAS" x={1420} y={250} size={140} col={COL.amber} edge="#5a3410" sub="ACEITE DE COCINA" out={A.mira - 0.2} />,
    <Tag key="pl" t={t} at={A.perla} x={960} y={560} dx={260} dy={-210} text="UNA PERLA DORADA" sub="NO SE ABRE · NO SE METE" col={COL.amber} out={A.cincoMin - 0.2} size={56} />,
    <Words key="sb" t={t} items={[{ at: A.cincoMin + 1.6, txt: "5 MINUTOS DESPUÉS:" }, { at: A.sombra, txt: "NI UNA SOMBRA", col: COL.leaf }]} out={A.quinchoM - 0.3} y={200} size={92} />,
    <Versus key="qv" t={t} at={A.quinchoM + 0.3} out={A.numerosC - 0.4} title="LA MISMA GOTA" L={{ label: "TU ALISADO", val: "MANCHA PARA SIEMPRE", h: 0.25, col: "#9a968e", mark: "x" }} R={{ label: "TU TERRAZO", val: "NADA", h: 0.95, col: COL.leaf, mark: "ok" }} />,
  );
  // 10 · los números
  if (g(A.numerosC, A.verdad)) L.push(
    <Words key="vl" t={t} items={[{ at: A.villanos, txt: "SIN VILLANOS:" }, { at: A.villanos + 1.0, txt: "CUENTAS", col: COL.amber }]} out={A.kilos - 0.5} y={200} size={100} />,
    <Receipt key="rc" t={t} title="UNA BALDOSA 40×40" cur="US$ " x={1180} y={110} sc={1.35} rows={[{ at: A.kilos, item: "CEMENTO 2,5 kg", $: 2 }, { at: A.arenaS, item: "ARENA + ADHESIVO", $: 1 }, { at: A.arenaS + 2.2, item: "SELLADOR + LIJAS", $: 1 }, { at: A.gratis - 0.3, item: "VIDRIO", $: 0 }]} totalAt={A.cuatro} out={A.metro - 0.3} />,
    <BigNum key="25" t={t} at={A.veinticinco} text="US$ 25" x={1430} y={260} size={170} col={COL.leaf} edge="#1d3a12" sub="EL METRO CUADRADO" out={A.empresa - 1.5} />,
    <Tag key="jg" t={t} at={A.juego - 0.8} x={960} y={600} dx={-260} dy={-200} text="UN JUEGO DE LIJAS" sub="= UN PATIO ENTERO" col={COL.amber} out={A.empresa - 1.5} size={52} />,
    <Versus key="em" t={t} at={A.cienD} out={A.dura - 0.3} title="EL METRO CUADRADO" L={{ label: "UNA EMPRESA", val: "US$ 100+", h: 0.95, col: COL.red, mark: "x" }} R={{ label: "VOS, CON BOTELLAS", val: "US$ 25", h: 0.25, col: COL.leaf, mark: "ok" }} />,
    <Words key="du" t={t} items={[{ at: A.dura, txt: "¿CUÁNTO DURA?" }]} out={A.primerAno - 1} y={200} size={110} />,
    <Tag key="py" t={t} at={A.primerAno - 0.6} x={screenOf(t, PT.oil).x} y={screenOf(t, PT.oil).y} dx={-260} dy={-200} text="ALISADO GRIS" sub="MANCHADO DESDE EL AÑO 1" col={COL.red} out={A.bancosV - 0.3} size={54} />,
    <BigNum key="80b" t={t} at={A.bancosV + 1.6} text="80 AÑOS" x={1420} y={250} size={150} col={COL.leaf} edge="#1d3a12" sub="EN VENECIA, SIGLOS" out={A.duro - 0.4} />,
    <Words key="dr" t={t} items={[{ at: A.duro - 1.2, txt: "VIDRIO" }, { at: A.duro - 0.6, txt: ">", col: COL.amber }, { at: A.duro, txt: "MÁRMOL", col: "#e8e4dc" }]} out={A.noSeGasta - 0.2} y={200} size={110} />,
    <Stamp key="gv" t={t} at={A.noSeGasta + 0.3} text="NO SE GASTA EN TU VIDA" x={960} y={880} out={A.verdad - 0.1} rot={-4} size={76} col={COL.leaf} />,
  );
  // 11 · la verdad + cómo se pone
  if (g(A.verdad, A.repaso)) L.push(
    <Words key="hu" t={t} items={[{ at: A.verdad, txt: "LA VERDAD" }, { at: A.esTerrazo, txt: "¿ES TERRAZO?", col: COL.amber }]} out={A.si - 0.05} y={200} size={100} />,
    <Stamp key="si" t={t} at={A.si} text="SÍ" x={1450} y={300} out={A.noImit + 1.0} rot={-8} size={200} col={COL.leaf} />,
    <Fichas key="pe" t={t} items={[{ at: A.piedrasEn, tx: "PIEDRAS EN CEMENTO", col: COL.ink }, { at: A.piedrasEn + 1.0, tx: "PULIDAS", col: COL.leaf }]} out={A.cosas - 0.2} y={880} />,
    <BigNum key="10k" t={t} at={A.pesa} text="10 kg" x={1430} y={260} size={150} col={COL.ink} edge="#3a2a18" sub="CADA BALDOSA" out={A.mediaHora - 1.5} />,
    <BigNum key="30m" t={t} at={A.mediaHora - 0.5} text="+30 min" x={1430} y={260} size={150} col={COL.amber} edge="#5a3410" sub="DE PULIDO POR BALDOSA" out={A.carrara - 1.5} />,
    <Versus key="cv" t={t} at={A.carrara - 1.2} out={A.luzB + 1.5} title="NO ES CARRARA" L={{ label: "MÁRMOL DE CARRARA", val: "BLANCO PURO", h: 0.7, col: "#e8e4dc" }} R={{ label: "ESTO", val: "LUZ DE BOTELLAS", h: 0.9, col: COL.leaf, mark: "ok" }} />,
    <Fichas key="nm" t={t} items={[{ at: A.noMancha, tx: "NO SE MANCHA", col: COL.leaf }, { at: A.noMancha + 1.0, tx: "NO SE GASTA", col: COL.leaf }, { at: A.noMancha + 2.2, tx: "BOTELLAS DE TUS ASADOS", col: COL.amber }]} out={A.comoPone - 0.3} y={880} />,
    <CheckList key="cp" t={t} title="CÓMO SE PONE" x={1320} y={180} rows={[{ at: A.contrapiso + 0.4, txt: "CONTRAPISO FIRME" }, { at: A.porcelanato, txt: "PEGAMENTO PORCELANATO" }, { at: A.tresMm, txt: "JUNTA DE 3 mm" }, { at: A.pastina, txt: "PASTINA BLANCA" }, { at: A.dilatacion, txt: "DILATACIÓN CADA 3-4 m" }]} out={A.coleccion - 0.4} />,
    <Words key="pu" t={t} items={[{ at: A.poliuretano, txt: "POLIURETANO", col: COL.leaf }]} out={A.noventa - 0.3} y={880} size={100} />,
    <BigNum key="90" t={t} at={A.noventa} text="90%" x={1430} y={260} size={190} col={COL.red} edge="#4a0d08" sub="PONE SILICONA" out={A.mesada - 1.6} />,
    <Tag key="sd" t={t} at={A.inviernos} x={960} y={560} dx={-260} dy={-200} text="SE DESPEGA" sub="A LOS DOS INVIERNOS" col={COL.red} out={A.mesada - 1.6} size={56} />,
    <Fichas key="ms" t={t} items={[{ at: A.mesada, tx: "MESADA", col: COL.ink }, { at: A.mesada + 1.4, tx: "TAPA DE MESA", col: COL.ink }, { at: A.hierros, tx: "+ 2 HIERROS FINITOS", col: COL.amber }]} out={A.mesaViejo - 0.3} y={880} />,
    <Words key="mv" t={t} items={[{ at: A.domingos, txt: "40 AÑOS DE DOMINGOS", col: COL.amber }, { at: A.todavia, txt: "TODAVÍA ESTÁ" }]} out={A.repaso - 0.2} y={200} size={88} />,
  );
  // la Colección (pág. 53): sólo cuando la cámara está en el libro
  if (t > RW.book - 0.2 && t < A.poliuretano + 1 && t < WIN.find((w) => w.ms > RW.book)!.ms) {
    const bk = screenOf(t, pageAt(0.5, 0.25));
    L.push(<Tag key="co" t={t} at={A.coleccion + 0.3} x={bk.x} y={bk.y} dx={60} dy={-190} text="LA COLECCIÓN · PÁG. 53" sub="QUÉ SELLADOR VA EN CADA LADO" col={COL.amber} out={A.poliuretano + 0.6} size={54} />);
  }
  // 12 · repaso de los 5 errores
  if (g(A.repaso, A.medidas)) L.push(
    <MistakesDeal key="md" t={t} at={A.repaso} out={A.r1 - 0.2} />,
    <Mistake key="r1" t={t} at={A.r1} n={1} txt="VIDRIO SUCIO" out={A.r2 - 0.3} />,
    <Mistake key="r2" t={t} at={A.r2} n={2} txt="CEMENTO GRIS" out={A.r3 - 0.3} />,
    <Mistake key="r3" t={t} at={A.r3} n={3} txt="PULIR ANTES DE TIEMPO" out={A.r4 - 0.3} />,
    <Mistake key="r4" t={t} at={A.r4} n={4} txt="SALTEAR EL EMPASTADO" out={A.r5 - 0.3} />,
    <Mistake key="r5" t={t} at={A.r5} n={5} txt="PULIR EN SECO" out={A.medidas - 0.3} />,
  );
  // 13 · CTA: la descripción + la Colección (sin URL en pantalla) + tarea + comentarios
  if (g(A.medidas, TEND)) {
    L.push(<Desc key="ds" t={t} at={A.medidas + 0.4} l2at={A.medidas + 1.6} out={A.colec2 - 0.6} />);
    if (t > A.colec2 - 0.5 && t < A.tarea && !WIN.some((w) => t >= w.ms && t < w.me)) {
      const bk = screenOf(t, pageAt(0.5, 0.25));
      L.push(<Tag key="c2" t={t} at={A.colec2} x={bk.x} y={bk.y} dx={60} dy={-190} text="LA COLECCIÓN" sub="DEL CONSTRUCTOR LIBRE" col={COL.amber} out={A.tarea - 0.3} size={58} />);
    }
    L.push(
      <Desc key="ds2" t={t} at={A.link} out={A.tarea - 0.2} />,
      <Words key="ta" t={t} items={[{ at: A.una, txt: "UNA BALDOSA." }, { at: A.una + 0.9, txt: "UNA.", col: COL.amber }]} out={A.kilo - 1.6} y={200} size={110} />,
      <Fichas key="kt" t={t} items={[{ at: A.kilo - 2.4, tx: "TUS BOTELLAS", col: COL.leaf }, { at: A.kilo - 1.2, tx: "MELAMINA", col: COL.ink }, { at: A.kilo, tx: "1 kg CEMENTO BLANCO", col: COL.ink }]} out={A.primerV - 0.6} y={880} />,
      <Words key="cm" t={t} items={[{ at: A.colorB, txt: "¿DE QUÉ COLOR SERÍAN?" }]} out={A.verdeC - 0.1} y={200} size={96} />,
      <Fichas key="co3" t={t} items={[{ at: A.verdeC, tx: "VERDE CERVEZA", col: COL.leaf }, { at: A.verdeC + 1.2, tx: "ÁMBAR", col: COL.amber }, { at: A.azul, tx: "AZUL DE VINO RARO", col: COL.ice }]} out={A.viejoD - 0.3} y={880} />,
      <Words key="lt" t={t} items={[{ at: A.leo, txt: "LEO TODOS 💬" }]} out={A.viejoD - 0.2} y={200} size={96} />,
      <Words key="vj" t={t} items={[{ at: A.caro, txt: "LO LINDO NO TIENE QUE SER CARO" }, { at: A.bienHecho, txt: "TIENE QUE ESTAR BIEN HECHO", col: COL.amber }]} out={A.nosVemos + 0.2} y={540} size={78} />,
      <LowerThird key="lt3" t={t} at={A.nosVemos} out={TEND - 0.4} name="CLAUDIO" l2="NOS VEMOS EN EL PATIO" l2at={A.nosVemos + 0.3} />,
    );
  }
  return L;
};

// tomas para la mezcla de audio: cada toma suena desde que arranca hasta la próxima base (bajo la voz)
export const clipPlan = () => BEATS.map((b, i) => ({ k: b.k, a: +b.a.toFixed(3), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(3), vis: +visible(i).toFixed(3) })).filter((x) => x.k !== "w");
export const beatTable = () => BEATS.map((b, i) => ({ i, a: +b.a.toFixed(2), vis: +visible(i).toFixed(2), tr: b.tr, k: b.k }));

// paso sobre el presentador: a un costado y más chico, nunca tapándole la cara
const ST: React.FC<React.ComponentProps<typeof StepTitle>> = (p) => <StepTitle {...p} {...(inAvatar(p.at + 0.4) ? { x: 1490, s: 0.6 } : {})} />;

export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  if (t < T0 - 0.001) return null;
  const fade = 1 - e(t, TEND - 0.8, TEND - 0.05);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <Hilo t={t} />
        {pieces(t)}
      </AbsoluteFill>
      <Flash t={t} at={T0 + 0.02} peak={0.25} w={0.3} />
    </AbsoluteFill>
  );
};
