// fbcafe · DEL 2:25 AL FINAL. Misma vara que el minuto 1 (gary01): una base por frase — toma real (LTX / agnes),
// el mundo 3D del taller (la tabla en los caballetes, la veta como paisaje, el frasco de café, el deck podrido, la Colección)
// o el avatar — y CERO cortes secos: cada cambio de base es una transición (latigazo, portal, zoom a través, giro, empuje,
// fogonazo); el avatar entra con latigazo y sale abriendo un portal. Las piezas 2.5D viven en una capa aparte que cruza las
// transiciones, clavadas a la palabra con ax(). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PT, screenOf, pageAt } from "./taller3d";
import { EV, RW, ax, we } from "./cam";
import { fin } from "./at";
import { Avatar, Calendar, Chips as Fichas, Clip, Desc, Stamp, World, WIN, inAvatar } from "./Min1";
import { BigNum, COL, Flash, LowerThird, Portal, Receipt, Tag, e, ei } from "./lib";
import { CheckList, Mistake, MistakesDeal, StepTitle, Versus, Words } from "./comps2";

export const T0 = EV.fin1;
export const TEND = fin("nos vemos en el patio", 950) + 1.2;
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
  // historia: Dionicio Rodríguez y el falso bosque
  C(we(152.0), "h_puente"),
  C(ax("hacia puentes bancos y barandas", 157.5), "h_baranda", "push"),
  C(ax("que parecian troncos de arbol", 161.5), "h_corteza", "zoom", [960, 540]),
  C(we(168.1), "h_taller"),
  C(ax("trabajaba tapado con lonas", 173), "h_lona", "light"),
  C(ax("en estados unidos todavia hay puentes", 177.5), "h_banco", "flip"),
  C(we(186.6), "h_falso"),
  W(RW.plank0, "zoom"),
  // lo que necesitás
  C(ax("vamos con lo que necesitas", 194.8), "m_mesa", "flip"),
  C(we(203.1), "m_arena"),
  C(ax("un adhesivo acrilico para cemento", 208.1), "m_bidon", "whipL"),
  C(we(218.8), "m_fibra"),
  C(ax("cafe instantaneo el mas barato", 220.6), "m_frasco", "zoom", [960, 540]),
  // PASO 1 · el molde
  W(RW.p1, "light"),
  C(we(233.2), "mo_tablavieja"),
  C(ax("que pasas el dedo", 239.5), "mo_dedo", "zoom", [960, 560]),
  C(ax("pasale un cepillo de alambre", 241.9), "mo_cepillo", "push"),
  C(we(250.3), "mo_cajon"),
  W(RW.copia, "zoom"),
  C(we(268.3), "mo_goma"),
  C(ax("volcas la goma sobre la tabla", 274.6), "x_gomavolcar", "push"),
  C(ax("esperas un dia", 276.5), "mo_negativo", "whip"),
  W(RW.copia2),
  C(ax("antes de volcar el desmoldante", 290.7), "mo_aceite", "zoom", [960, 540]),
  C(we(301.8), "mo_pegada"),
  // PASO 2 · la mezcla
  W(RW.bags, "flip"),
  C(ax("la medida es una de cemento", 306.8), "mz_tarro", "push"),
  C(we(317.3), "mz_grisblanco"),
  C(ax("mezcla en seco primero", 325.3), "mz_seco", "whipL"),
  W(RW.cafe),
  C(ax("eso le saca el gris frio", 339.1), "mz_cucharadas", "push"),
  C(we(351.5), "mz_marron"),
  C(ax("y por que no mas cafe", 353.1), "c_cafe", "zoom", [960, 540]),
  C(ax("mucho y la tabla te queda blanda", 360), "mz_blanda", "whip"),
  C(we(367.2), "mz_adhesivo"),
  C(ax("ese chorrito es lo que hace", 372.7), "c_mezcla", "push"),
  C(we(384.3), "mz_dulce"),
  C(ax("si levantas la llana", 389.1), "x_llana", "zoom", [960, 540]),
  C(ax("si se te fue el agua", 393.5), "mz_aguada", "flip"),
  C(ax("sale con agujeritos", 395.5), "mz_agujeros", "zoom", [960, 540]),
  // PASO 3 · volcar
  C(we(403.2), "c_volcar"),
  C(ax("golpeas los costados", 405.4), "vo_martillo", "whipL"),
  C(ax("vas a ver que suben burbujitas", 411.4), "vo_burbujas", "zoom", [960, 540]),
  C(we(418.3), "vo_malla"),
  C(ax("y pasas una regla", 421.5), "vo_regla", "push"),
  W(RW.p4a),
  // PASO 4 · el peine de vetas
  C(we(437.3), "pe_peines"),
  C(ax("apoyas el dedo", 443.6), "pe_huella", "zoom", [960, 540]),
  C(we(454.0), "pe_clavos"),
  C(ax("lo arrastras de punta a punta", 461.8), "c_peine", "push"),
  C(we(472.4), "pe_nudo"),
  C(ax("apoyas el pulgar", 474), "x_pulgar", "push"),
  C(ax("como el agua de un arroyo", 480), "pe_arroyo", "light"),
  // PASO 5 · el curado
  C(we(489.4), "pe_rama"),
  C(ax("tapas el molde con un nylon", 494.3), "cu_nylon", "flip"),
  C(ax("al otro dia mojas", 497.5), "cu_mojar", "whip"),
  C(we(503.4), "cu_sol"),
  W(RW.desm, "zoom"),
  C(we(521.6), "p_desmolde_s2"),
  C(ax("cada linea cada nudo", 523.7), "x_rajadita", "zoom", [960, 540]),
  // PASO 6 · lavar
  W(RW.p6, "light"),
  C(we(538.8), "c_lavar"),
  C(ax("si tenis encima", 546.3), "la_manchas", "zoom", [960, 540]),
  C(we(553.7), "la_secar"),
  W(RW.cafe2, "whipL"),
  C(we(572.3), "la_verde"),
  C(ax("una semana", 579.3), "la_semana", "push"),
  // PASO 7 · el tinte de café
  C(we(589.6), "ti_taza"),
  C(ax("primera mano", 596.4), "c_pintar", "push"),
  C(we(607.4), "ti_esponja"),
  W(RW.grain3, "zoom"),
  C(ax("pintas un tramo de la tabla", 613.3), "c_trapo", "whip"),
  C(we(626.3), "ti_crestas"),
  W(RW.grain4, "light"),
  C(we(641.5), "ti_iguales"),
  C(ax("a una le das una mano mas", 647.7), "ti_distintas", "flip"),
  // PASO 8 · sellar y la prueba
  C(we(660.8), "c_sellar"),
  C(ax("al otro dia", 665.5), "x_cafeseco", "push"),
  C(ax("para pisos", 669.8), "se_brillante", "zoom", [960, 540]),
  W(RW.p8),
  C(ax("la primera lluvia fuerte", 687), "se_lluvia", "push"),
  C(we(695.5), "p_manguera_s2"),
  C(ax("se hace gotitas", 700.7), "se_gotas", "zoom", [960, 540]),
  C(we(711.1), "se_pino"),
  // los números
  W(RW.bench, "whipL"),
  C(we(727.8), "nu_bolsa"),
  C(ax("un metro cuadrado son 11 tablas", 733.2), "x_metro", "push"),
  C(ax("un deck de madera dura instalado", 738.4), "nu_deckmadera", "whip"),
  W(RW.deck),
  C(ax("porque aca esta la cuenta", 749.6), "x_pinotierra", "zoom", [960, 540]),
  W(RW.book, "cut"),
  C(ax("el 90 de los postes", 769), "nu_postes", "zoom", [960, 540]),
  C(we(780.5), "nu_termitas"),
  C(ax("los puentes de dionisio", 788), "x_puenteviejo", "light"),
  W(RW.verdad, "flip"),
  C(we(800.1), "nu_frio"),
  C(ax("pero desde la galeria", 804.3), "nu_galeria", "light"),
  // cómo se pone
  C(we(817.6), "co_tierra"),
  C(ax("y apoyas las tablas", 822), "c_colocar", "whip"),
  C(ax("un centimetro de junta", 824.5), "co_junta", "zoom", [960, 540]),
  C(we(831.9), "x_juntitas"),
  C(ax("si vas sobre un contrapiso", 835), "x_contrapiso", "push"),
  C(ax("y si estas pensando en hacer escalones", 841), "co_escalon", "whip"),
  C(ax("el banco de mi viejo", 843.6), "co_banco", "light"),
  // repaso de los 5 errores
  W(RW.recap),
  W(RW.recap2),
  W(RW.recap3),
  W(RW.book2, "cut"),
  // tarea, comentarios, próximo video
  W(RW.tarea, "cut"),
  C(we(914.2), "ta_unatabla"),
  W(RW.end, "zoom"),
  C(we(931.4), "ta_quebracho"),
  C(ax("en el proximo video hacemos otra mezcla", 932.9), "x_vidrio", "flip"),
  C(ax("lo pulimos con agua", 938.1), "nx_terrazo", "zoom", [960, 540]),
  C(we(949.4), "ta_banco"),
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
const A = {
  cien: ax("tiene casi 100 anos", 152), mexicano: ax("hubo un mexicano", 153.4), toluca: ax("nacido en toluca", 156), veinte: ax("en los anos 20", 157),
  puentes: ax("hacia puentes bancos y barandas", 157.5), troncos: ax("que parecian troncos de arbol", 161.5), aMano: ax("los hacia a mano", 168.3),
  cuchara: ax("con cuchara de albanil", 169.5), secreto: ax("cuidaba tanto su secreto", 172), lonas: ax("trabajaba tapado con lonas", 173.5), copiara: ax("para que nadie le copiara", 175.5),
  eeuu: ax("en estados unidos todavia hay puentes", 177.5), creyendo: ax("creyendo que es madera", 183), falso: ax("le decian falso bosque", 186.5),
  chiquito: ax("pero en chiquito", 192), esconder: ax("y sin esconder nada", 193.5), necesitas: ax("vamos con lo que necesitas", 194.8),
  portland: ax("cemento por langriz", 195), blanco: ax("un poco de cemento blanco", 199.5), arena: ax("arena fina", 203.3), adhesivo: ax("un adhesivo acrilico para cemento", 208.1),
  fibra: ax("un punado de fibra", 213.9), cafe: ax("cafe instantaneo el mas barato", 220.6), sellador: ax("y un sellador acrilico", 223.4), nada: ax("nada mas", 227.5),
  p1: ax("paso 1", 227.7), dos: ax("tenes dos maneras", 230), noCuesta: ax("la que no cuesta nada", 231.3), dedo: ax("que pasas el dedo", 239.5), cepillo: ax("pasale un cepillo de alambre", 241.9),
  fondo: ax("esa tabla va a ser el fondo", 246.2), listones: ax("cuatro listones", 250), cajon: ax("60 centimetros de largo", 252.5), copia: ax("el cemento copia todo", 256.9), conVeta: ax("sale con beta", 261),
  segunda: ax("la segunda manera", 265.1), goma: ax("con goma de moldes de dos componentes", 271), unDia: ax("esperas un dia", 276), negativo: ax("copiada en negativo", 280.5),
  cincuenta: ax("50 60 tablas", 284.5), nudo: ax("nudo por nudo", 289.5), desmoldante: ax("antes de volcar el desmoldante", 290.7), aceite: ax("aceite de cocina usado", 294.5),
  sePega: ax("la tabla se pega", 299.5), vuelve: ax("que despues vuelve", 302.5),
  p2: ax("paso 2", 302.5), medida: ax("la medida es una de cemento", 306.8), dosArena: ax("y dos de arena fina", 309), volumen: ax("medido en volumen", 310.6),
  mitad: ax("mitad gris y mitad blanco", 315), muelle: ax("de muelle", 320), roble: ax("tipo roble", 323.5), enSeco: ax("mezcla en seco primero", 325.3), elAgua: ax("recien ahi el agua", 328.6),
  entraCafe: ax("y aca entra el cafe", 329.9), cucharadas: ax("dos cucharadas de cafe instantaneo", 334), noMas: ax("no mas", 338), grisFrio: ax("eso le saca el gris frio", 339.1),
  porDentro: ax("como si la madera tuviera color por dentro", 343), marron: ax("va a saber marron", 350.5), porQue: ax("y por que no mas cafe", 353.1), azucar: ax("igual que el azucar", 356),
  poquito: ax("un poquito no se nota", 358.3), blanda: ax("blanda dos dias", 362), doble: ax("tarda el doble", 366), unaDiez: ax("una parte de adhesivo cada 10", 370), chorrito: ax("ese chorrito es lo que hace", 372.7),
  lijar: ax("se pueda lijar", 376), puntas: ax("no se te partan las puntas", 378.5), deApoco: ax("el agua va de a poco", 380.3), dulce: ax("dulce de leche espeso", 386.5), parada: ax("se queda parada", 391),
  seFue: ax("si se te fue el agua", 393.5), agujeritos: ax("sale con agujeritos", 395.5), e4: ax("ese es el error numero 4", 397.8),
  p3: ax("paso 3", 398.1), laMitad: ax("hasta la mitad", 404.5), martillo: ax("con un martillo de goma", 407), minuto: ax("durante un minuto", 410), burbujas: ax("suben burbujitas", 412.5), aire: ax("es el aire que se iba a quedar", 414),
  malla: ax("pones la malla de alambre", 417.5), regla: ax("y pasas una regla", 421.5), abajo: ax("la de abajo de la tabla", 427), liso: ax("si tu molde es liso", 430.5), vos: ax("la beta la haces vos", 433.5),
  p4: ax("paso 4", 435.5), peine: ax("el peine de vetas", 438.4), punto: ax("tome el punto", 441), niNi: ax("ni fresca ni dura", 442.1), huella: ax("si marca la huella", 445), verano: ax("en verano es media hora", 448.4), invierno: ax("en invierno puede ser una hora y media", 450.5),
  peineP: ax("un peine de vetear", 455.5), clavos: ax("una tablita con clavos", 457.5), tenedor: ax("un tenedor viejo", 460.5), unaPasada: ax("en una sola pasada", 464.5), apenitas: ax("a penitas de un lado al otro", 467),
  recto: ax("nunca recto", 469.1), noCrece: ax("la madera no crece recta", 470.7), elNudo: ax("y el nudo", 472.1), pulgar: ax("apoyas el pulgar", 474), medioGiro: ax("lo giras medio giro", 477), arroyo: ax("como el agua de un arroyo", 480),
  rama: ax("alrededor de una rama", 486), ojo: ax("el ojo lo reconoce", 488.3),
  p5: ax("paso 5", 488.4), nylon: ax("tapas el molde con un nylon", 494.3), sombra: ax("a la sombra", 496.5), otroDia: ax("al otro dia mojas", 497.5), otro: ax("y al otro mojas de nuevo", 498.9), seCura: ax("se cura", 503),
  solPelado: ax("al sol pelado", 506.5), cuartea: ax("se cuartea entero", 509), desmoldas: ax("a los dos o tres dias desmoldas", 510.7), momento: ax("y aca viene el momento", 512.9),
  despacito: ax("lo doblas despacito", 517.5), aparece: ax("y abajo aparece la veta", 521.5), cadaLinea: ax("cada linea cada nudo", 523.7), noPodes: ax("no lo podes creer", 530),
  p6: ax("paso 6", 529.1), antesTenir: ax("antes de tenir", 533.6), detergente: ax("con un chorrito de detergente", 538.5), teAcordas: ax("te acordas del aceite", 541.2), pegado: ax("quedo pegado", 544.2),
  manchas: ax("te quedan manchas claras", 550), e2: ax("ese es el error numero 2", 553.7), secar: ax("y dejas secar", 557.5),
  importante: ax("y ahora lo mas importante del video", 558.7), e1: ax("y es el error numero 1", 561.5), elDia: ax("no va el dia que desmoldas", 563.5), semana: ax("esperas una semana como minimo", 565.4),
  alcalino: ax("es muy alcalino", 568.5), seCome: ax("se come el color", 571), verdoso: ax("gris verdoso en una tarde", 575.5), noHay: ax("no hay forma de arreglarlo", 577.5), unaSemana: ax("una semana", 579.3), dos2: ax("si puedes aguantar dos", 579.5),
  p7: ax("paso 7", 580), tinte: ax("el tinte de cafe", 583.5), cuatro: ax("4 cucharadas soperas", 584.5), cargado: ax("bien cargado", 589.9), negro: ax("mas negro que el que tomas", 591), grumo: ax("hasta que no quede un grumo", 594),
  primera: ax("primera mano", 596.4), pincel: ax("un pincel viejo gastado", 598.5), esponja: ax("como una esponja", 605), unaHora: ax("esperas una hora", 606.1), segundaM: ax("segunda mano igual", 607.4), otraHora: ax("esperas otra hora", 609.1),
  tercera: ax("y la tercera mano", 610.4), haceMadera: ax("es la que hace la madera", 611.8), trapo: ax("pasas un trapo humedo", 617.5), unaSola: ax("una sola pasada", 620.5),
  crestas: ax("de las crestas", 624), surcos: ax("y lo deja en los surcos", 626), oscuras: ax("las lineas quedan oscuras", 628), ojoLee: ax("eso es exactamente lo que el ojo", 631.5), vetaOsc: ax("beta oscura sobre fondo claro", 635),
  e3: ax("y acaba el error numero tres", 637.5), iguales: ax("no hagas todas las tablas iguales", 641.6), deckVerdad: ax("un deck de verdad nunca tiene", 644), unaMas: ax("a una le das una mano mas", 647.7), engana: ax("esa diferencia es la que engana", 655.5),
  ceramica: ax("parecen ceramica", 658), madera10: ax("10 tablas distintas parecen madera", 658.1),
  p8: ax("paso 8", 658.4), sellar: ax("sellar", 664.5), dosManos: ax("dos manos de sellador acrilico", 667), mate: ax("mate", 670.9), brillante: ax("nunca brillante", 671.4), plastificada: ax("como plastificada", 675),
  e5: ax("es el error numero 5", 682), cafeEsCafe: ax("sin sellador el cafe es cafe", 684.4), lluvia: ax("la primera lluvia fuerte", 687), unMes: ax("en un mes tenes otra vez", 690.5), encierra: ax("encierra el color adentro", 694),
  prueba: ax("y ahora la prueba", 695.3), manguera: ax("le tiro agua con la manguera", 696.6), noEntra: ax("el agua no entra", 698.5), perlas: ax("perlas redondas", 703), seca: ax("abajo la tabla esta seca", 706), pan: ax("como un pan", 712),
  numeros: ax("vamos a los numeros", 713.4), villanos: ax("no hay villanos", 716.5), kilo: ax("un kilo y medio de cemento", 720.5), bolsa25: ax("una bolsa de 25 kilos", 722.6), dieciseis: ax("unas 16 tablas", 725),
  sumale: ax("sumale la arena", 726.6), dosD: ax("unos 2 dolares", 731), metro: ax("un metro cuadrado son 11 tablas", 733.2), veinte25: ax("20-25 dolares", 736.5), deckDura: ax("un deck de madera dura instalado", 738.4),
  sesenta: ax("entre 60 y 90", 742), pino: ax("y el pino que es mas barato", 743.9), podrido: ax("esta podrido", 748), cuantos: ax("cuantos anos dura", 752.5), dosCinco: ax("de 2 a 5 anos", 757.5),
  tratada: ax("tratada si la mantienes 15", 759.7), pagina: ax("en la pagina 17", 763.5), noventa: ax("el 90 de los postes", 769), diezCm: ax("los primeros 10 centimetros", 771), linea: ax("justo en la linea del suelo", 772),
  humedad: ax("muere donde esta la humedad", 778.5), noTiene: ax("el cemento no tiene ese problema", 781.2), noPudre: ax("no se pudre", 783.5), hongo: ax("no le entra el hongo", 784.5), termitas: ax("no tiene termitas", 785.7), astilla: ax("no astilla", 787),
  dionicio: ax("los puentes de dionisio", 788), verdad: ax("ahora la verdad", 791.2), humo: ax("no vendemos humo", 793), esMadera: ax("es madera", 794.3), no: ax("no", 795), fria: ax("al tacto es fria", 795.7), pesa: ax("pesa unos 5 kilos", 797.4),
  veinteCm: ax("a 20 centimetros", 802), galeria: ax("pero desde la galeria", 804.3), nadie: ax("nadie", 808), nuncaMas: ax("no se te pudre nunca mas", 810.5),
  comoPone: ax("como se pone", 812.5), diezT: ax("sacas 10 centimetros de tierra", 816), cincoA: ax("5 de arena compactada", 819), unCm: ax("un centimetro de junta", 824.5), contrapiso: ax("si vas sobre un contrapiso", 827.6),
  escalones: ax("hacer escalones", 834), bancoArbol: ax("o el banco del arbol", 836), hierros: ax("con dos hierros finitos", 841.5), bancoViejo: ax("el banco de mi viejo", 843.6), domingo: ax("cada domingo", 848),
  repaso: ax("te repaso los cinco errores", 853.7), r1: ax("1 tenir el cemento fresco", 853.8), r2: ax("2 no lavar el desmoldante", 860.5), r3: ax("3 betas rectas", 865.6), r4: ax("4 mezcla aguada", 871.9), r5: ax("5 no sellar", 881.3),
  medidas: ax("todas las medidas", 888.5), colec2: ax("esta todo en la coleccion", 902), link: ax("el link en la primera linea", 904.8), tarea: ax("la tarea para esta semana", 907.9),
  entero: ax("no hagas el deck entero", 910.8), una: ax("hace una tabla", 912.4), tarro: ax("con un tarro de cemento", 914), desmoldes: ax("cuando la desmoldes", 919.2), entender: ax("me vas a entender", 922),
  comentarios: ax("contame en los comentarios", 923.3), queMadera: ax("que madera queres copiar vos", 925.5), pinoR: ax("pino roble", 927.5), quebracho: ax("o quebracho", 928.5), leo: ax("leo todos", 931.8),
  proximo: ax("en el proximo video hacemos otra mezcla", 932.9), vidrio: ax("cemento con vidrio molido", 935.5), terrazo: ax("aparece un terrazo", 940), cuatroD: ax("por cuatro dolares el metro", 943),
  viejoD: ax("mi viejo decia", 949.6), caro: ax("no tiene por que ser caro", 952), bienHecho: ax("tiene que estar bien hecho", 953.5), nosVemos: ax("nos vemos en el patio", 954.9),
};

// ---------- LA CAPA DE PIEZAS (cruza las transiciones) ----------
const WOOD = "#d9a066", WOODE = "#4a2a10", CAFE = "#c8874a";
const pieces = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const g = (a: number, b: number) => t > a - 0.5 && t < b + 0.8;   // sólo se arma cerca de su tramo
  // 1 · Dionicio Rodríguez → falso bosque → nosotros
  if (g(A.cien, A.necesitas)) L.push(
    <BigNum key="100" t={t} at={A.cien} text="~100 AÑOS" x={1400} y={250} size={140} col="#e8d8b4" edge="#4a3a22" sub="Y SIGUE EN PIE" out={A.mexicano + 1.6} />,
    <Words key="dr" t={t} items={[{ at: A.mexicano + 0.6, txt: "DIONICIO RODRÍGUEZ" }, { at: A.toluca, txt: "TOLUCA · MÉXICO", col: COL.amber }]} out={A.puentes - 0.3} y={880} size={78} />,
    <Fichas key="pb" t={t} items={[{ at: A.puentes + 0.3, tx: "PUENTES", col: "#e8d8b4" }, { at: A.puentes + 0.9, tx: "BANCOS", col: "#e8d8b4" }, { at: A.puentes + 1.5, tx: "BARANDAS", col: "#e8d8b4" }]} out={A.troncos - 0.2} y={880} />,
    <Tag key="tr" t={t} at={A.troncos + 0.5} x={960} y={560} dx={240} dy={-210} text="CEMENTO" sub="QUE PARECE TRONCO" col={WOOD} out={A.aMano - 0.3} size={58} />,
    <Fichas key="cu" t={t} items={[{ at: A.aMano + 0.4, tx: "A MANO", col: COL.ink }, { at: A.cuchara, tx: "CUCHARA DE ALBAÑIL", col: COL.ink }, { at: A.cuchara + 1.6, tx: "PINCELES", col: COL.amber }]} out={A.secreto - 0.2} y={880} />,
    <Stamp key="sc" t={t} at={A.lonas} text="SECRETO" x={1450} y={260} out={A.eeuu - 0.3} rot={-8} size={120} />,
    <Words key="cr" t={t} items={[{ at: A.creyendo - 0.6, txt: "CREYENDO QUE ES" }, { at: A.creyendo + 0.3, txt: "MADERA", col: WOOD }]} out={A.falso - 1.2} y={200} size={100} />,
    <Words key="fb" t={t} items={[{ at: A.falso - 0.3, txt: "FAUX BOIS", col: WOOD }, { at: A.falso + 0.6, txt: "= FALSO BOSQUE" }]} out={A.chiquito - 1.8} y={880} size={92} />,
    <Words key="ch" t={t} items={[{ at: A.chiquito, txt: "EN CHIQUITO" }, { at: A.esconder, txt: "SIN ESCONDER NADA", col: COL.leaf }]} out={A.necesitas - 0.2} y={200} size={92} />,
  );
  // 2 · lo que necesitás
  if (g(A.necesitas, A.p1)) L.push(
    <CheckList key="ck" t={t} title="LO QUE NECESITÁS" x={1300} y={150} rows={[{ at: A.portland, txt: "CEMENTO PORTLAND GRIS" }, { at: A.blanco, txt: "+ CEMENTO BLANCO (MEJOR)" }, { at: A.arena, txt: "ARENA FINA, TAMIZADA" }, { at: A.adhesivo, txt: "ADHESIVO ACRÍLICO" }, { at: A.fibra, txt: "FIBRA O MALLA" }, { at: A.cafe, txt: "CAFÉ INSTANTÁNEO" }, { at: A.sellador, txt: "SELLADOR ACRÍLICO MATE" }]} out={A.nada + 0.4} />,
    <Tag key="bc" t={t} at={A.cafe + 0.5} x={960} y={600} dx={-260} dy={-210} text="EL MÁS BARATO" sub="QUE ENCUENTRES" col={CAFE} out={A.sellador - 0.2} size={56} />,
  );
  // 3 · PASO 1 · el molde
  if (g(A.p1, A.p2)) L.push(
    <ST key="s1" t={t} at={A.p1} n={1} name="EL MOLDE" out={A.dos - 0.1} col={WOOD} />,
    <Words key="nc" t={t} items={[{ at: A.noCuesta, txt: "LA QUE NO CUESTA NADA", col: COL.leaf }]} out={A.dedo - 4} y={200} size={84} />,
    <Tag key="dd" t={t} at={A.dedo + 0.3} x={960} y={560} dx={240} dy={-210} text="LA VETA EN RELIEVE" sub="LA SENTÍS CON EL DEDO" col={WOOD} out={A.cepillo - 0.2} size={54} />,
    <Words key="cp" t={t} items={[{ at: A.cepillo + 0.6, txt: "CEPILLO DE ALAMBRE" }, { at: A.cepillo + 1.8, txt: "A FAVOR DE LA VETA", col: COL.amber }]} out={A.fondo - 0.3} y={880} size={80} />,
    <BigNum key="60" t={t} at={A.cajon} text="60 × 15 × 3" x={1380} y={250} size={130} col={COL.ink} edge="#3a2a18" sub="CENTÍMETROS · EL CAJÓN" out={A.copia - 0.3} />,
    <Words key="co" t={t} items={[{ at: A.copia + 0.3, txt: "EL CEMENTO" }, { at: A.copia + 1.1, txt: "COPIA TODO", col: COL.amber }]} out={A.conVeta - 0.4} y={200} size={110} />,
    <Words key="cv" t={t} items={[{ at: A.conVeta - 0.4, txt: "FONDO CON VETA" }, { at: A.conVeta + 0.4, txt: "= TABLA CON VETA", col: WOOD }]} out={A.segunda - 2.5} y={880} size={84} />,
    <Tag key="gm" t={t} at={A.goma} x={960} y={600} dx={260} dy={-200} text="GOMA DE 2 COMPONENTES" sub="PARA HACER MUCHAS" col={COL.rose} out={A.unDia - 0.2} size={50} />,
    <Calendar key="c1" t={t} x={140} y={130} label="DÍA" inAt={A.unDia} out={A.negativo + 0.6} days={[{ at: A.unDia, d: 1 }]} />,
    <Words key="ng" t={t} items={[{ at: A.negativo, txt: "LA VETA EN NEGATIVO", col: COL.rose }]} out={A.cincuenta - 0.3} y={880} size={84} />,
    <BigNum key="50" t={t} at={A.cincuenta} text="50-60" x={1420} y={250} size={170} col={COL.leaf} edge="#1d3a12" sub="TABLAS POR MOLDE" out={A.nudo + 0.8} />,
    <Words key="np" t={t} items={[{ at: A.nudo - 0.2, txt: "NUDO POR NUDO", col: WOOD }]} out={A.desmoldante - 0.2} y={880} size={92} />,
    <Fichas key="ac" t={t} items={[{ at: A.desmoldante + 0.6, tx: "DESMOLDANTE", col: COL.amber }, { at: A.aceite, tx: "ACEITE DE COCINA USADO", col: COL.ink }, { at: A.aceite + 1.4, tx: "MANO FINITA", col: COL.ink }]} out={A.sePega - 1.6} y={880} />,
    <Stamp key="vu" t={t} at={A.vuelve - 0.6} text="EL ACEITE VUELVE…" x={960} y={880} out={A.p2 + 0.2} rot={-4} size={78} col={COL.amber} />,
  );
  // 4 · PASO 2 · la mezcla
  if (g(A.p2, A.p3)) L.push(
    <ST key="s2" t={t} at={A.p2} n={2} name="LA MEZCLA" out={A.medida - 0.2} col={COL.leaf} />,
    <Words key="rc" t={t} items={[{ at: A.medida + 0.6, txt: "1 CEMENTO" }, { at: A.dosArena, txt: "2 ARENA", col: "#e8d8b4" }]} out={A.mitad - 3} y={200} size={110} />,
    <Tag key="vo" t={t} at={A.volumen + 0.2} x={960} y={600} dx={260} dy={-200} text="EN VOLUMEN" sub="CON EL MISMO TARRO" col={COL.amber} out={A.mitad - 3} size={54} />,
    <Versus key="gb" t={t} at={A.mitad - 1.6} out={A.enSeco - 0.3} title="¿QUÉ CEMENTO?" L={{ label: "SÓLO GRIS", val: "MADERA DE MUELLE", h: 0.5, col: "#9a968e" }} R={{ label: "MITAD BLANCO", val: "ROBLE CÁLIDO", h: 0.9, col: WOOD, mark: "ok" }} />,
    <Words key="sc" t={t} items={[{ at: A.enSeco + 0.2, txt: "EN SECO" }, { at: A.elAgua, txt: "RECIÉN AHÍ EL AGUA", col: COL.ice }]} out={A.entraCafe - 0.1} y={200} size={96} />,
    <BigNum key="2c" t={t} at={A.cucharadas - 0.4} text="2 CUCHARADAS" x={1400} y={250} size={110} col={CAFE} edge={WOODE} sub="DE CAFÉ POR BALDE" out={A.grisFrio - 0.3} />,
    <Stamp key="nm" t={t} at={A.noMas} text="NO MÁS" x={1450} y={560} out={A.grisFrio - 0.2} rot={-8} size={110} />,
    <Words key="gf" t={t} items={[{ at: A.grisFrio + 0.4, txt: "CHAU GRIS FRÍO" }, { at: A.porDentro, txt: "COLOR POR DENTRO", col: CAFE }]} out={A.marron - 2} y={880} size={84} />,
    <Words key="pq" t={t} items={[{ at: A.porQue, txt: "¿POR QUÉ NO MÁS CAFÉ?" }]} out={A.azucar - 0.2} y={200} size={92} />,
    <Tag key="az" t={t} at={A.azucar} x={960} y={600} dx={-260} dy={-210} text="COMO EL AZÚCAR" sub="FRENA EL FRAGUADO" col={COL.amber} out={A.blanda - 0.6} size={56} />,
    <Calendar key="c2" t={t} x={140} y={130} label="DÍA" inAt={A.blanda - 0.8} out={A.unaDiez - 0.4} days={[{ at: A.blanda - 0.8, d: 1 }, { at: A.blanda, d: 2 }]} />,
    <BigNum key="x2" t={t} at={A.doble} text="×2" x={1480} y={280} size={220} col={COL.red} edge="#4a0d08" sub="TARDA EL DOBLE" out={A.unaDiez - 0.4} />,
    <BigNum key="10" t={t} at={A.unaDiez} text="1 : 10" x={1430} y={260} size={150} col={COL.ice} edge="#1d3a52" sub="ADHESIVO : AGUA" out={A.deApoco - 0.3} />,
    <Fichas key="lj" t={t} items={[{ at: A.lijar, tx: "SE LIJA SIN DESCASCARAR", col: COL.leaf }, { at: A.puntas, tx: "NO SE PARTE EN LAS PUNTAS", col: COL.leaf }]} out={A.deApoco - 0.2} y={880} />,
    <Words key="dl" t={t} items={[{ at: A.dulce - 0.4, txt: "DULCE DE LECHE ESPESO", col: CAFE }]} out={A.parada - 0.4} y={880} size={84} />,
    <Tag key="pa" t={t} at={A.parada} x={960} y={540} dx={260} dy={-200} text="SE QUEDA PARADA" sub="NO CHORREA" col={COL.leaf} out={A.seFue - 0.2} size={56} />,
    <Stamp key="ag" t={t} at={A.agujeritos} text="AGUADA = AGUJEROS" x={960} y={880} out={A.e4 + 0.2} rot={-4} size={84} />,
  );
  // 5 · PASO 3 · volcar
  if (g(A.p3, A.p4)) L.push(
    <ST key="s3" t={t} at={A.p3} n={3} name="VOLCAR" out={A.laMitad - 0.3} />,
    <Words key="mt" t={t} items={[{ at: A.laMitad, txt: "HASTA LA MITAD" }]} out={A.martillo - 0.3} y={200} size={100} />,
    <BigNum key="1m" t={t} at={A.minuto} text="1 MINUTO" x={1420} y={260} size={130} col={COL.ink} edge="#3a2a18" sub="GOLPES EN LOS COSTADOS" out={A.burbujas - 0.3} />,
    <Tag key="ai" t={t} at={A.aire} x={960} y={560} dx={250} dy={-200} text="AIRE QUE SE IBA A QUEDAR" sub="ADENTRO DE LA TABLA" col={COL.ice} out={A.malla - 0.2} size={50} />,
    <Fichas key="ml" t={t} items={[{ at: A.malla, tx: "MALLA O FIBRA", col: COL.amber }, { at: A.malla + 1.8, tx: "HASTA ARRIBA", col: COL.ink }, { at: A.regla, tx: "ENRASAR", col: COL.leaf }]} out={A.abajo - 0.6} y={880} />,
    <Words key="lv" t={t} items={[{ at: A.liso, txt: "¿MOLDE LISO?" }, { at: A.vos, txt: "LA VETA LA HACÉS VOS", col: WOOD }]} out={A.p4 - 0.1} y={200} size={92} />,
  );
  // 6 · PASO 4 · el peine de vetas
  if (g(A.p4, A.p5)) L.push(
    <ST key="s4" t={t} at={A.p4} n={4} name="EL PEINE DE VETAS" out={A.peine + 1.8} col={WOOD} />,
    <Words key="pt" t={t} items={[{ at: A.niNi, txt: "NI FRESCA" }, { at: A.niNi + 0.8, txt: "NI DURA", col: COL.amber }]} out={A.huella - 0.6} y={200} size={110} />,
    <Tag key="hu" t={t} at={A.huella} x={960} y={560} dx={250} dy={-210} text="MARCA Y NO SE PEGA" sub="ES EL MOMENTO" col={COL.leaf} out={A.verano - 0.2} size={56} />,
    <Versus key="vi" t={t} at={A.verano} out={A.peineP - 0.4} title="CUÁNDO PEINAR" L={{ label: "VERANO", val: "30 MIN", h: 0.35, col: COL.amber, mark: "ok" }} R={{ label: "INVIERNO", val: "1 h 30", h: 0.9, col: COL.ice, mark: "ok" }} />,
    <Fichas key="pn" t={t} items={[{ at: A.peineP, tx: "PEINE DE VETEAR", col: COL.ink }, { at: A.clavos, tx: "TABLITA CON CLAVOS", col: COL.ink }, { at: A.tenedor, tx: "UN TENEDOR VIEJO", col: COL.amber }]} out={A.unaPasada - 0.4} y={880} />,
    <Words key="up" t={t} items={[{ at: A.unaPasada, txt: "UNA SOLA PASADA" }, { at: A.apenitas, txt: "MOVIÉNDOLO APENITAS", col: WOOD }]} out={A.recto - 0.2} y={200} size={88} />,
    <Words key="mg" t={t} items={[{ at: A.pulgar + 0.4, txt: "PULGAR" }, { at: A.medioGiro, txt: "MEDIO GIRO", col: WOOD }]} out={A.arroyo - 0.3} y={880} size={100} />,
    <Tag key="ar" t={t} at={A.arroyo + 0.6} x={960} y={540} dx={-260} dy={-210} text="COMO EL AGUA" sub="QUE ESQUIVA UNA PIEDRA" col={COL.ice} out={A.rama - 0.6} size={56} />,
  );
  // 7 · PASO 5 · el curado + el desmolde
  if (g(A.p5, A.p6)) L.push(
    <ST key="s5" t={t} at={A.p5} n={5} name="EL CURADO" out={A.nylon - 0.2} col={COL.ice} />,
    <Fichas key="ny" t={t} items={[{ at: A.nylon + 0.4, tx: "NYLON", col: COL.ink }, { at: A.sombra, tx: "A LA SOMBRA", col: COL.ice }]} out={A.otroDia - 0.2} y={880} />,
    <Calendar key="c5" t={t} x={140} y={130} label="DÍA" inAt={A.otroDia} out={A.solPelado - 0.4} days={[{ at: A.otroDia, d: 1 }, { at: A.otro, d: 2 }]} />,
    <Words key="cu" t={t} items={[{ at: A.seCura - 1.2, txt: "NO SE SECA:" }, { at: A.seCura, txt: "SE CURA", col: COL.ice }]} out={A.solPelado - 0.3} y={200} size={110} />,
    <Stamp key="cq" t={t} at={A.cuartea} text="SE CUARTEA" x={1450} y={260} out={A.desmoldas - 0.3} rot={-8} size={110} />,
    <Calendar key="c6" t={t} x={140} y={130} label="DÍA" inAt={A.desmoldas} out={A.momento + 1.5} days={[{ at: A.desmoldas, d: 2 }, { at: A.desmoldas + 0.6, d: 3 }]} />,
    <Words key="ve" t={t} items={[{ at: A.cadaLinea, txt: "CADA LÍNEA" }, { at: A.cadaLinea + 0.8, txt: "CADA NUDO", col: WOOD }, { at: A.cadaLinea + 1.8, txt: "EN CEMENTO" }]} out={A.p6 - 0.2} y={880} size={96} />,
  );
  // 8 · PASO 6 · lavar + el error número 1
  if (g(A.p6, A.p7)) L.push(
    <ST key="s6" t={t} at={A.p6} n={6} name="LAVAR" out={A.antesTenir - 0.1} col={COL.ice} />,
    <Fichas key="lv" t={t} items={[{ at: A.detergente, tx: "MANGUERA + CEPILLO", col: COL.ink }, { at: A.detergente + 0.8, tx: "DETERGENTE", col: COL.ice }]} out={A.teAcordas - 0.2} y={880} />,
    <Words key="ta" t={t} items={[{ at: A.teAcordas, txt: "¿Y EL ACEITE?", col: COL.amber }]} out={A.manchas - 1} y={200} size={110} />,
    <Tag key="mc" t={t} at={A.manchas} x={960} y={540} dx={260} dy={-210} text="MANCHAS CLARAS" sub="EL CAFÉ NO ENTRA" col={COL.red} out={A.e2 - 0.1} size={56} />,
    <Mistake key="m2" t={t} at={A.e2 + 0.1} n={2} txt="NO LAVAR EL DESMOLDANTE" out={A.secar - 0.3} />,
    <Words key="mi" t={t} items={[{ at: A.importante + 0.4, txt: "LO MÁS IMPORTANTE", col: "#ffd76a" }]} out={A.e1 - 0.1} y={200} size={96} />,
    <Mistake key="m1" t={t} at={A.e1 + 0.2} n={1} txt="TEÑIR EL CEMENTO FRESCO" out={A.semana - 0.3} />,
    <Calendar key="c7" t={t} x={140} y={130} label="DÍA" inAt={A.semana} out={A.p7 - 0.3} days={[{ at: A.semana, d: 1 }, { at: A.semana + 0.5, d: 4 }, { at: A.semana + 1.0, d: 7 }, { at: A.dos2, d: 14 }]} />,
    <Tag key="al" t={t} at={A.alcalino} x={960} y={560} dx={260} dy={-200} text="MUY ALCALINO" sub="SE COME EL COLOR" col={COL.red} out={A.verdoso - 0.3} size={56} />,
    <BigNum key="gv" t={t} at={A.verdoso} text="GRIS VERDOSO" x={1380} y={250} size={110} col="#9fb08a" edge="#2a3320" sub="EN UNA TARDE · SIN ARREGLO" out={A.unaSemana - 0.2} />,
    <BigNum key="1s" t={t} at={A.unaSemana} text="1 SEMANA" x={1400} y={250} size={140} col={COL.leaf} edge="#1d3a12" sub="SI PODÉS, DOS" out={A.p7 - 0.2} />,
  );
  // 9 · PASO 7 · el tinte de café
  if (g(A.p7, A.p8)) L.push(
    <ST key="s7" t={t} at={A.p7} n={7} name="EL TINTE DE CAFÉ" out={A.tinte + 1.6} col={CAFE} />,
    <BigNum key="4c" t={t} at={A.cuatro} text="4 CUCHARADAS" x={1400} y={250} size={110} col={CAFE} edge={WOODE} sub="EN UNA TAZA HIRVIENDO" out={A.cargado - 0.2} />,
    <Words key="bc" t={t} items={[{ at: A.cargado, txt: "BIEN CARGADO" }, { at: A.negro, txt: "MÁS NEGRO QUE EL QUE TOMÁS", col: CAFE }]} out={A.primera - 0.3} y={200} size={84} />,
    <Fichas key="mn" t={t} items={[{ at: A.primera, tx: "1ª MANO · PAREJA", col: CAFE }, { at: A.unaHora, tx: "1 HORA", col: COL.ink }, { at: A.segundaM, tx: "2ª MANO", col: CAFE }, { at: A.otraHora, tx: "1 HORA", col: COL.ink }]} out={A.tercera - 0.2} y={880} />,
    <Tag key="es" t={t} at={A.esponja} x={960} y={540} dx={-260} dy={-200} text="LO CHUPA" sub="COMO UNA ESPONJA" col={CAFE} out={A.unaHora - 0.2} size={56} />,
    <Words key="3m" t={t} items={[{ at: A.tercera, txt: "LA 3ª MANO" }, { at: A.haceMadera, txt: "HACE LA MADERA", col: WOOD }]} out={A.trapo - 1.8} y={200} size={110} />,
    <Fichas key="tp" t={t} items={[{ at: A.trapo, tx: "TRAPO HÚMEDO", col: COL.ice }, { at: A.unaSola, tx: "UNA SOLA PASADA", col: COL.ink }]} out={A.crestas - 0.3} y={880} />,
    <Versus key="cs" t={t} at={A.crestas - 0.4} out={A.ojoLee - 0.3} title="EL TRAPO" L={{ label: "CRESTAS", val: "CLARAS", h: 0.45, col: "#e8d8b4" }} R={{ label: "SURCOS", val: "OSCUROS", h: 0.9, col: CAFE, mark: "ok" }} />,
    <Words key="vo" t={t} items={[{ at: A.vetaOsc - 0.4, txt: "VETA OSCURA" }, { at: A.vetaOsc + 0.6, txt: "SOBRE FONDO CLARO", col: WOOD }]} out={A.e3 - 0.1} y={880} size={92} />,
    <Mistake key="m3" t={t} at={A.e3 + 0.3} n={3} txt="TABLAS IGUALES" out={A.deckVerdad - 0.3} />,
    <Versus key="10t" t={t} at={A.ceramica - 1.6} out={A.p8 - 0.2} title="DIEZ TABLAS" L={{ label: "IDÉNTICAS", val: "CERÁMICA", h: 0.35, col: "#9a968e", mark: "x" }} R={{ label: "DISTINTAS", val: "MADERA", h: 0.95, col: WOOD, mark: "ok" }} />,
  );
  // 10 · PASO 8 · sellar + la prueba de la manguera
  if (g(A.p8, A.numeros)) L.push(
    <ST key="s8" t={t} at={A.p8} n={8} name="SELLAR" out={A.sellar + 1} col={COL.leaf} />,
    <Fichas key="sm" t={t} items={[{ at: A.dosManos, tx: "2 MANOS", col: COL.ink }, { at: A.mate, tx: "MATE", col: COL.leaf }]} out={A.brillante - 0.2} y={880} />,
    <Stamp key="br" t={t} at={A.brillante} text="NUNCA BRILLANTE" x={960} y={220} out={A.plastificada + 1.5} rot={-5} size={92} />,
    <Mistake key="m5" t={t} at={A.e5 + 0.2} n={5} txt="NO SELLAR" out={A.cafeEsCafe + 1.4} />,
    <Words key="ll" t={t} items={[{ at: A.lluvia, txt: "1ª LLUVIA FUERTE" }, { at: A.unMes, txt: "EN UN MES: GRIS", col: "#9a968e" }]} out={A.encierra - 0.6} y={200} size={92} />,
    <Words key="pr" t={t} items={[{ at: A.prueba + 0.2, txt: "LA PRUEBA", col: COL.ice }]} out={A.noEntra - 0.2} y={200} size={110} />,
    <Tag key="pe" t={t} at={A.perlas} x={960} y={560} dx={250} dy={-210} text="PERLAS QUE RUEDAN" sub="EL AGUA NO ENTRA" col={COL.ice} out={A.seca - 0.2} size={56} />,
    <Words key="se" t={t} items={[{ at: A.seca + 0.4, txt: "ABAJO: SECA", col: COL.leaf }]} out={A.pan - 1.2} y={880} size={100} />,
  );
  // 11 · los números
  if (g(A.numeros, A.verdad)) L.push(
    <Words key="vl" t={t} items={[{ at: A.villanos, txt: "SIN VILLANOS:" }, { at: A.villanos + 1.0, txt: "CUENTAS", col: COL.amber }]} out={A.kilo - 0.5} y={200} size={100} />,
    <Receipt key="rc" t={t} title="UNA TABLA DE 60 cm" cur="US$ " x={1180} y={110} sc={1.35} rows={[{ at: A.kilo, item: "CEMENTO 1,5 kg", $: 1 }, { at: A.sumale + 0.6, item: "ARENA + ADHESIVO", $: 0.5 }, { at: A.sumale + 1.6, item: "CAFÉ + SELLADOR", $: 0.5 }]} totalAt={A.dosD} out={A.metro - 0.3} />,
    <Tag key="bl" t={t} at={A.bolsa25} x={960} y={600} dx={-260} dy={-200} text="BOLSA DE 25 kg" sub="= 16 TABLAS" col={COL.ink} out={A.sumale - 0.3} size={54} />,
    <Versus key="m2v" t={t} at={A.metro + 1.4} out={A.pino - 0.3} title="EL METRO CUADRADO" L={{ label: "DECK DE MADERA DURA", val: "US$ 60-90", h: 0.95, col: COL.red, mark: "x" }} R={{ label: "11 TABLAS DE CEMENTO", val: "US$ 20-25", h: 0.3, col: COL.leaf, mark: "ok" }} />,
    <Words key="cd" t={t} items={[{ at: A.cuantos - 0.6, txt: "¿CUÁNTOS AÑOS DURA?" }]} out={A.dosCinco - 0.4} y={200} size={100} />,
    <Versus key="pd" t={t} at={A.dosCinco} out={RW.book - 0.2} title="PINO EN LA TIERRA" L={{ label: "SIN TRATAR", val: "2-5 AÑOS", h: 0.25, col: COL.red, mark: "x" }} R={{ label: "TRATADO Y MANTENIDO", val: "15 AÑOS", h: 0.6, col: COL.amber }} />,
    <BigNum key="90" t={t} at={A.noventa} text="90%" x={1430} y={260} size={190} col={COL.red} edge="#4a0d08" sub="DE LOS POSTES SE PUDRE EN LOS 1os 10 cm" out={A.humedad - 0.3} />,
    <Words key="hm" t={t} items={[{ at: A.humedad, txt: "MUERE DONDE ESTÁ LA HUMEDAD", col: COL.ice }]} out={A.noTiene - 0.2} y={880} size={76} />,
    <CheckList key="nt" t={t} title="EL CEMENTO" x={1320} y={200} rows={[{ at: A.noPudre, txt: "NO SE PUDRE" }, { at: A.hongo, txt: "NO LE ENTRA EL HONGO" }, { at: A.termitas, txt: "NO TIENE TERMITAS" }, { at: A.astilla, txt: "NO ASTILLA" }]} out={A.dionicio - 0.3} />,
    <BigNum key="1h" t={t} at={A.dionicio + 0.4} text="~100 AÑOS" x={1400} y={250} size={140} col="#e8d8b4" edge="#4a3a22" sub="LOS PUENTES DE DIONICIO" out={A.verdad - 0.2} />,
  );
  // la Colección (pág. 17): sólo cuando la cámara está en el libro
  if (t > RW.book - 0.2 && t < A.noventa && !inAvatar(t)) {
    const bk = screenOf(t, pageAt(0.5, 0.25));
    L.push(<Tag key="co" t={t} at={A.pagina} x={bk.x} y={bk.y} dx={60} dy={-190} text="LA COLECCIÓN · PÁG. 17" sub="EL DATO DE LOS POSTES" col={COL.amber} out={A.noventa - 0.3} size={54} />);
  }
  // 12 · la verdad + cómo se pone
  if (g(A.verdad, A.repaso)) L.push(
    <Words key="hu" t={t} items={[{ at: A.verdad, txt: "LA VERDAD" }, { at: A.humo, txt: "SIN HUMO", col: COL.amber }]} out={A.esMadera - 0.1} y={200} size={100} />,
    <Stamp key="no" t={t} at={A.no} text="NO ES MADERA" x={1400} y={300} out={A.fria + 2.6} rot={-8} size={96} />,
    <Fichas key="fr" t={t} items={[{ at: A.fria, tx: "FRÍA AL TACTO", col: COL.ice }, { at: A.pesa, tx: "5 kg POR TABLA", col: COL.ink }, { at: A.veinteCm - 0.4, tx: "A 20 cm SE NOTA", col: COL.amber }]} out={A.galeria - 0.3} y={880} />,
    <Words key="nd" t={t} items={[{ at: A.galeria + 0.6, txt: "A UN METRO, CON EL MATE:" }, { at: A.nadie, txt: "NADIE", col: COL.leaf }]} out={A.nuncaMas - 0.2} y={200} size={88} />,
    <Stamp key="nn" t={t} at={A.nuncaMas + 0.4} text="NO SE PUDRE NUNCA MÁS" x={960} y={880} out={A.comoPone - 0.2} rot={-4} size={76} col={COL.leaf} />,
    <CheckList key="cp" t={t} title="CÓMO SE PONE" x={1320} y={180} rows={[{ at: A.diezT, txt: "10 cm DE TIERRA AFUERA" }, { at: A.cincoA, txt: "5 cm DE ARENA COMPACTADA" }, { at: A.unCm, txt: "JUNTA DE 1 cm" }, { at: A.contrapiso, txt: "O MORTERO SOBRE CONTRAPISO" }]} out={A.escalones - 0.4} />,
    <Fichas key="es" t={t} items={[{ at: A.escalones, tx: "ESCALONES", col: COL.ink }, { at: A.bancoArbol, tx: "EL BANCO DEL ÁRBOL", col: WOOD }, { at: A.hierros, tx: "+ 2 HIERROS FINITOS", col: COL.amber }]} out={A.bancoViejo - 0.3} y={880} />,
    <Words key="dm" t={t} items={[{ at: A.domingo - 0.6, txt: "CADA DOMINGO", col: COL.amber }]} out={A.repaso - 0.3} y={200} size={96} />,
  );
  // 13 · repaso de los 5 errores
  if (g(A.repaso, A.medidas)) L.push(
    <MistakesDeal key="md" t={t} at={A.repaso} out={A.r1 - 0.05} />,
    <Mistake key="r1" t={t} at={A.r1 + 0.2} n={1} txt="TEÑIR EL CEMENTO FRESCO" out={A.r2 - 0.3} />,
    <Mistake key="r2" t={t} at={A.r2} n={2} txt="NO LAVAR EL DESMOLDANTE" out={A.r3 - 0.3} />,
    <Mistake key="r3" t={t} at={A.r3} n={3} txt="VETAS RECTAS, TABLAS IGUALES" out={A.r4 - 0.3} />,
    <Mistake key="r4" t={t} at={A.r4} n={4} txt="MEZCLA AGUADA" out={A.r5 - 0.3} />,
    <Mistake key="r5" t={t} at={A.r5} n={5} txt="NO SELLAR · O BRILLANTE" out={A.medidas - 0.3} />,
  );
  // 14 · CTA: la descripción + la Colección (sin URL en pantalla) + tarea + comentarios + próximo video
  if (g(A.medidas, TEND)) {
    L.push(<Desc key="ds" t={t} at={A.medidas + 0.4} l2at={A.medidas + 1.6} out={A.colec2 - 0.6} />);
    if (t > A.colec2 - 0.5 && t < A.tarea && !inAvatar(t)) {
      const bk = screenOf(t, pageAt(0.5, 0.25));
      L.push(<Tag key="c2" t={t} at={A.colec2} x={bk.x} y={bk.y} dx={60} dy={-190} text="LA COLECCIÓN" sub="DEL CONSTRUCTOR LIBRE" col={COL.amber} out={A.tarea - 0.3} size={58} />);
    }
    L.push(
      <Desc key="ds2" t={t} at={A.link} out={A.tarea - 0.2} />,
      <Words key="tt" t={t} items={[{ at: A.una, txt: "UNA TABLA." }, { at: A.una + 0.9, txt: "UNA.", col: COL.amber }]} out={A.tarro - 0.2} y={200} size={110} />,
      <Fichas key="kt" t={t} items={[{ at: A.tarro, tx: "UN TARRO DE CEMENTO", col: COL.ink }, { at: A.tarro + 1.4, tx: "LA TABLA VIEJA", col: WOOD }, { at: A.tarro + 2.8, tx: "EL CAFÉ DE LA MAÑANA", col: CAFE }]} out={A.desmoldes - 0.3} y={880} />,
      <Words key="cm" t={t} items={[{ at: A.queMadera, txt: "¿QUÉ MADERA COPIARÍAS?" }]} out={A.leo - 0.2} y={200} size={92} />,
      <Fichas key="md3" t={t} items={[{ at: A.pinoR, tx: "PINO", col: "#e8d8b4" }, { at: A.pinoR + 0.6, tx: "ROBLE", col: WOOD }, { at: A.quebracho, tx: "QUEBRACHO", col: "#b5652e" }]} out={A.proximo - 0.3} y={880} />,
      <Words key="lt" t={t} items={[{ at: A.leo, txt: "LEO TODOS 💬" }]} out={A.proximo - 0.2} y={200} size={96} />,
      <Words key="nx" t={t} items={[{ at: A.proximo + 0.4, txt: "PRÓXIMO VIDEO:" }, { at: A.vidrio, txt: "CEMENTO + VIDRIO MOLIDO", col: COL.leaf }]} out={A.terrazo - 0.2} y={200} size={84} />,
      <BigNum key="tz" t={t} at={A.terrazo} text="TERRAZO" x={1400} y={250} size={150} col={COL.leaf} edge="#1d3a12" sub="US$ 4 EL METRO" out={A.viejoD - 0.4} />,
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
