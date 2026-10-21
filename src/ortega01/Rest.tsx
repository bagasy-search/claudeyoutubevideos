// ortega01 · DEL 1:08 AL FINAL. Misma vara que el minuto 1 (gary01/cgordie1): una BASE por frase (el mundo 3D de la casa con su
// única cámara / la foto o toma del comandante haciendo lo que cuenta / el avatar en sus ventanas pagadas) y CERO cortes secos:
// cada cambio de base es una transición (latigazo, portal desde un punto 3D, zoom a través, giro de tarjeta, empuje, luz).
// Las piezas 2.5D viven en una capa aparte que cruza las transiciones. TODO anclado con at("frase") a la voz. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PT, screenOf, setKeys, setRoute, setPins, Key, RP, Pin } from "./casa3d";
import { COL, Flash, FONT, Portal, Tag, at as at0, e, ei, extrude } from "./lib";
import { Avatar, Shot, World, REDS } from "./Min1";
import { SelloTinta, Crono } from "./piezas_m1";
import {
  Esposas, MiedoOficio, SubBell, Calcula, EvTent, Cajita, Junta, TeleVieja, FichaDetenido, UnMinuto, ReglaCard, Enemigos, Triada, Libreta,
  Letrero, Barras, Lista25, Pasos, Balanza, EnemyChips, Alacena, CandadoPolvo, Costura, CasasGrid, TuboCorte, Invisible, Calendario, CajonCorte,
  MacetaCorte, Corcho, Huella, GrandeDiario, ListaSuper, Detector, Divide, Nadie, Papeles, CasaBanco, Tarea, Comentario, Proximo, Frase, Polaroid, Pregunta,
} from "./piezas_rest";
import AVW from "./avwin.json";

const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
export const T0 = WIN[4].me;
export const TEND = WIN[WIN.length - 1].me;
export const FULL_FRAMES = Math.ceil(TEND * 30);
const PI = Math.PI;
type V3 = [number, number, number];

// ---------- ANCLAS: segundo exacto de cada frase (sólo se busca del 1:08 en adelante) ----------
const at = (f: string, after = 68) => at0(f, after);
const A = {
  tengo: at("Tengo 66 años"), esposa: at("vivo con mi esposa"), misma: at("la misma de hace 30"), barda: at("con su barda"), zaguan: at("su saguán"), naranjo: at("su naranjo en el patio"),
  miedo: at("no le voy a dar miedo"), oficio: at("le voy a dar oficio"), aprendi: at("lo que aprendí"), agarraba: at("el que los agarraba"),
  rapidito: at("Rapidito"), sirve: at("Si esto le sirve"), suscribase: at("suscríbase"), campanita: at("campanita"), cuenteme: at("cuénteme abajo"), ahora: at("Ahora sí, vamos"),
  primero: at("Primero entienda"), noBusca: at("el ratero no busca"), calcula: at("el ratero calcula"), pocos: at("tiene pocos minutos"), seguro: at("Y lo seguro es"),
  n5: at("Número 5"), cajita: at("La cajita fuerte"), atorn: at("y atornilló"), niLa: at("o ni la atornilló"), noAbre: at("El ladrón no la abre"), brazo: at("bajo el brazo"), favor: at("le hizo el favor"),
  n4: at("Número 4"), conge: at("El congelador"), haceAnos: at("Hace años era"), tele: at("lo pasan en la tele"), agarre: at("Yo agarré a un muchacho"), abrir: at("abrir el congelador"), hambre: at("Ni siquiera tenía hambre"),
  n3: at("Número 3"), repisa: at("La repisa de arriba"), zapatos: at("las cajas de zapatos"), bolsillos: at("los bolsillos de los sacos"), piso: at("Lo sacan todo al piso"),
  n2: at("Número 2"), colchon: at("Debajo del colchón"), abuelitas: at("de las abuelitas"), levanta: at("Levanta el colchón con una mano"), otra: at("con la otra"),
  n1: at("Y número 1"), cajon: at("El cajón del buró"), ahiVa: at("Ahí va primero"), reloj: at("el reloj"), alhajas: at("las alhajas"), dinero: at("el dinero de la semana"), saquelo: at("sáquelo hoy mismo"),
  comun: at("los cinco tienen algo en común"), tresPasos: at("a tres pasos"), porEso: at("Por eso la regla número uno"), nunca: at("el dinero nunca duerme"), explico: at("Y ahora le explico"),
  enemigos: at("tres enemigos"), tiempo: at("el tiempo, el ruido"), ruido: at("el ruido y la suciedad"), suciedad: at("y la suciedad"), noTardar: at("No quiere tardar"), limpio: at("lo tienen que ver limpio"),
  todo: at("todo escondite bueno"), quita: at("Le quita tiempo"), hace: at("le hace hacer ruido"), obliga: at("o lo obliga a ensuciarse"), conEsa: at("Con esa regla"), inventar: at("puede inventar los suyos"),
  cuarto: at("Vamos cuarto por cuarto"), cocina: at("Vámonos a la cocina"), casiNo: at("El ladrón casi no entra"), mover: at("mucho que mover"), llevarse: at("poco que llevarse"),
  L1: at("Lugar número 1"), bote: at("Debajo de la bolsa del bote"), saca: at("Saca la bolsa"), fondo: at("pone el sobre en el fondo"), encima: at("vuelve a poner la bolsa"), ajena: at("basura ajena"),
  L2: at("Número 2", 230), frijoles: at("La bolsa de frijoles"), cerrado: at("El sobre bien cerrado"), pesa: at("Pesa lo mismo"), vaciar: at("vaciar frijoles"),
  L3: at("Número 3", 240), croq: at("El bote de las croquetas"), huele: at("caja fuerte que huele mal"), sellada: at("Bolsa sellada, debajo"),
  L4: at("Número 4", 250), lata: at("Una lata vieja"), verdad: at("entre las latas de verdad"), atras: at("la fila de atrás"),
  L5: at("Número 5", 262), sarten: at("Adentro de la caja del sartén"), polvo: at("El polvo es su mejor"), loQue: at("Lo que tiene polvo"),
  lavado: at("Ahora el cuarto de lavado"), L6: at("Número 6"), deter: at("Adentro de la caja de detergente"), enterrada: at("enterrada en el jabón"), noSeVa: at("buscar entre detergente"),
  L7: at("Número 7"), canasta: at("En la canasta de la ropa sucia"), nadieRopa: at("ni el ratero más necesitado"),
  L8: at("Número 8"), tabla: at("Dentro de la funda"), descose: at("Se descoce"), plancha: at("y se plancha encima"),
  L9: at("Número 9"), bano: at("En el baño"), ojo: at("Pero ojo"), conocen: at("Ese ya lo conocen"), revisado: at("Lo vi revisado"), sala: at("Pasamos a la sala"),
  busca: at("Aquí el ladrón busca la tele"), L10: at("Número 10"), carton: at("Detrás del cartón"), fotos: at("Las fotos de la familia"), clavitos: at("Se quitan los clavitos"), billete: at("Se mete el billete plano"), cierra: at("Y se vuelve a cerrar"), retrato: at("desarmar un retrato"),
  L11: at("Número 11"), barra: at("Adentro de la barra hueca"), tapita: at("Se quita la tapita"),
  L12: at("Número 12"), libro: at("Dentro de un libro aburrido"), biblia: at("No la Biblia"), directorio: at("Un directorio viejo"), contab: at("un libro de contabilidad"), manual: at("un manual del refrigerador"), invisible: at("Lo aburrido es invisible"),
  L13: at("Número 13"), recibos: at("Una caja de archivos"), quince: at("Nadie se roba recibos"),
  nietos: at("Ahora el cuarto de los nietos"), favorito: at("Este es mi favorito"), L14: at("Número 14"), peluche: at("Adentro de un peluche"), entraNinos: at("El ladrón entra a un cuarto de niños"),
  L15: at("Número 15"), juguetes: at("En la caja de los juguetes"), L16: at("Número 16"), navidad: at("En las cajas de los adornos"), once: at("Once meses al año"), niUsted: at("Ni usted"),
  L17: at("Número 17"), mochila: at("Dentro de una mochila escolar"), basuraAno: at("Parece basura del año pasado"), cochera: at("Bajamos a la cochera"), siEntra: at("Aquí el ratero sí entra"),
  L18: at("Número 18"), pintura: at("Adentro de una lata de pintura"), usada: at("Se ve usada"), pesada: at("se ve pesada"), sinValor: at("se ve sin valor"),
  L19: at("Número 19"), herram: at("En la caja de herramientas vieja"), grasa: at("Nadie mete la mano en la grasa"), L20: at("Número 20"), botas: at("Dentro de unas botas"), punta: at("hasta la punta del pie"),
  L21: at("Número 21"), escoba: at("En el tubo hueco"), L22: at("Número 22"), cinta: at("Pegado con cinta"), porDentro: at("Por dentro y arriba"), abajoSi: at("Abajo si miran"),
  patio: at("Y por último, el patio"), L23: at("Número 23"), maceta: at("Una maceta grande"), plato: at("Se pone un plato"), sobreAbajo: at("el sobre abajo"), tierra: at("y la tierra y la planta"), cuenta: at("Mi naranjo tiene su cuenta"),
  L24: at("Número 24"), tubo: at("Un tubo de plástico"), piedra: at("debajo de una piedra"), meses: at("lo que no va a usar en meses"),
  L25: at("Número 25"), cal: at("La bodeguita del jardín"), carga: at("Nadie carga un costal"),
  ojoErr: at("Ahora, ojo"), E1: at("Error 1"), huellas: at("Las huellas"), esconde: at("Usted esconde el dinero en la lata"), limpia: at("la lata queda limpia"), tapon: at("O el tapón de la escoba"),
  experiencia: at("El ratero con experiencia"), seUsa: at("busca lo que se usa"), grande: at("en el escondite grande"), diario: at("Lo de diario, aparte"),
  E2: at("Error 2"), olvidarse: at("Olvidarse"), mayor: at("Esto le pasa a la gente mayor"), noAcuerda: at("Esconde tan bien"), zapopan: at("Yo conocí a una señora"), anote: at("Anote sus escondites"),
  ejemplo: at("Por ejemplo, el naranjo"), xFrij: at("los frijoles, las botas"), xBotas: at("las botas."), superL: at("es una lista del súper"),
  E3: at("Error 3"), mismo: at("Esconder siempre lo mismo"), plomero: at("un plomero"), pintor: at("un pintor"), sobrino: at("un sobrino"), cambie: at("cambie de escondite"), pilas: at("Una vez al año"),
  reglas: at("Ahora le doy las tres reglas"), R1: at("Regla 1"), nuncaTodo: at("Nunca todo en un solo lugar"), divida: at("Divídalo en tres"), encuentran: at("Si encuentran uno"),
  R2: at("Regla 2"), senuelo: at("Deje una cartera señuelo"), billete100: at("con un billete de 100"), credencial: at("una credencial vencida"), papeles: at("y unos papeles"), primerMin: at("El ratero la encuentra"), gano: at("cree que ganó"),
  corriendo: at("Yo vi rateros salir corriendo"), R3: at("Regla 3"), nadie: at("Que nadie lo sepa"), llave: at("Ni el que viene a arreglar"), vecina: at("ni la vecina"), nieto: at("ni el nieto"), cuenta2: at("El escondite que se cuenta"),
  amigo: at("Y una cosa más"), escrituras: at("Las escrituras"), protegen: at("se protegen"), originales: at("Los originales"), copias: at("En la casa, solo copias"),
  grandeNo: at("Y el dinero grande no vive"), semanaE: at("téngalo de la semana"), emergencia: at("algo para una emergencia"), banco: at("Lo demás, al banco"),
  ocho: at("en ocho minutos"), mire: at("Mire, no tiene que hacer"), dos: at("Haga dos cosas"), sacarB: at("Saque el dinero del buró"), poner: at("y ponga la cartera señuelo"), gano2: at("Con eso ya le ganó"),
  comentarios: at("Y cuénteme en los comentarios"), mama: at("dónde lo escondía su mamá"), mia: at("La mía lo guardaba"), proximo: at("En el próximo video"), cuelgo: at("que yo cuelgo"), cuatro: at("La número cuatro"),
  cuidese: at("Cuídese mucho"), acuerdese: at("Y acuérdese"), fN: at("el dinero nunca duerme", 640), fDonde: at("donde duerme usted", 640),
};

// ---------- ventanas del avatar del resto (pagadas): por cercanía al segundo que se da ----------
const av = (ms: number) => WIN.reduce((b, w) => (Math.abs(w.ms - ms) < Math.abs(b.ms - ms) ? w : b));

// ---------- LA CÁMARA (suma sus keyframes a los del minuto 1) ----------
const K: Key[] = [];
const cam = (t: number, p: V3, l: V3, fov = 40, arc = 0) => K.push({ t, p, l, fov, arc });
// vistas por cuarto (frente abierto de la maqueta)
const V = {
  casa: { p: [-1.5, 6.4, 17.5] as V3, l: [-1.5, 2.4, 0] as V3 },
  casaAlta: { p: [-2.5, 10.5, 16] as V3, l: [-2.0, 2.0, -0.5] as V3 },
  mesa: { p: [-2.9, 1.75, 2.5] as V3, l: [-2.9, 0.8, 0.6] as V3 },
  recamara: { p: [-3.1, 5.0, 4.6] as V3, l: [-3.0, 3.8, -1.0] as V3 },
  closet: { p: [-3.3, 4.7, 3.2] as V3, l: [-4.9, 4.1, 0.4] as V3 },
  conge: { p: [-3.6, 1.8, 2.4] as V3, l: [-5.0, 1.3, -1.6] as V3 },
  cama: { p: [-2.3, 4.6, 2.2] as V3, l: [-3.3, 3.6, -0.8] as V3 },
  cocina: { p: [-3.2, 2.4, 6.0] as V3, l: [-3.2, 1.2, -0.8] as V3 },
  basura: { p: [-1.8, 1.4, 1.2] as V3, l: [-1.5, 0.55, -2.1] as V3 },
  lavado: { p: [-8.2, 2.4, 3.2] as V3, l: [-7.2, 0.7, -1.8] as V3 },
  sala: { p: [1.1, 2.2, 6.0] as V3, l: [0.9, 1.3, -1.0] as V3 },
  cuadros: { p: [0.0, 2.1, 0.6] as V3, l: [-0.45, 2.1, -2.47] as V3 },
  nietos: { p: [1.3, 5.0, 5.0] as V3, l: [1.3, 3.8, -1.0] as V3 },
  cochera: { p: [5.9, 2.6, 6.6] as V3, l: [6.2, 0.9, -1.2] as V3 },
  patio: { p: [-7.6, 2.8, 6.8] as V3, l: [-8.6, 1.0, -0.8] as V3 },
  naranjo: { p: [-9.1, 2.3, 1.6] as V3, l: [-10.1, 1.3, -1.85] as V3 },
};
const hold = (a: number, b: number, v: { p: V3; l: V3 }, fov = 40, drift: V3 = [0.25, 0, -0.35]) => { cam(a, v.p, v.l, fov); cam(b, [v.p[0] + drift[0], v.p[1] + drift[1], v.p[2] + drift[2]], v.l, fov); };
const move = (a: number, v1: { p: V3; l: V3 }, b: number, v2: { p: V3; l: V3 }, arc = 0) => { cam(a, v1.p, v1.l); cam(b, v2.p, v2.l, 40, arc); };

// ---------- ruta del ratero en las escenas 3D donde aparece ----------
const R: RP[] = [];
const rp = (t: number, p: V3, ry: number, pose: RP["pose"] = "walk") => R.push({ t, p, ry, pose });

// ---------- pines del resto ----------
const PN: Pin[] = [];
const COC: V3[] = [[-1.5, 0.66, -2.1], [-3.3, 2.75, -2.2], [-4.3, 0.12, 0.3], [-2.4, 2.75, -2.3], [-3.9, 2.75, -2.3]];
const LAV: V3[] = [[-7.2, 0.96, -2.25], [-6.95, 0.42, -1.45], [-9.0, 0.02, 1.4], [-6.9, 0.02, 1.9]];
const SAL: V3[] = [[-0.45, 2.55, -2.4], [3.1, 2.4, 1.2], [-0.6, 0.9, -2.2], [0.0, 0.12, 1.6]];
const NIE: V3[] = [[1.9, 4.0, -2.2], [0.0, 3.65, 1.2], [3.1, 5.4, -2.1], [-0.6, 3.12, 2.0]];
const COCH: V3[] = [[7.6, 1.25, -2.1], [7.6, 0.62, -2.1], [7.1, 0.03, -1.6], [7.8, 0.03, 0.8], [6.9, 1.9, -2.2]];
const PAT: V3[] = [[-10.1, 2.6, -1.85], [-10.6, 0.02, -0.5], [-8.3, 1.6, -2.0]];
const ALL = [...COC, ...LAV, ...SAL, ...NIE, ...COCH, ...PAT];
const pins = (ps: V3[], a: number, out: number, col: "g" | "r" = "g", step = 0.22) => ps.forEach((p, i) => PN.push({ p, col, at: a + i * step, out }));

// ================= LA LÍNEA DE TIEMPO =================
type Tr = "whip" | "whipL" | "whipU" | "portal" | "zoom" | "flip" | "push" | "light" | "cut";
const DUR: Record<Tr, number> = { whip: 0.45, whipL: 0.45, whipU: 0.5, portal: 0.55, zoom: 0.5, flip: 0.55, push: 0.5, light: 0.5, cut: 0 };
type Beat = { a: number; tr: Tr; p?: (t: number) => [number, number]; r: (t: number) => React.ReactNode };
const B: Beat[] = [];
const dim = (spans: [number, number][], amt = 0.4) => (t: number) => spans.reduce((m, [a, b]) => Math.max(m, e(t, a, a + 0.3) * (1 - e(t, b, b + 0.3))), 0) * amt;
// AVATAR: entra 0,25 s antes de su ventana; la base siguiente arranca 0,15 s antes de que termine
const AVB = (ms: number, tr: Tr, opt: { dark?: [number, number][]; p?: [number, number] } = {}) => {
  const w = av(ms), dk = dim(opt.dark ?? []);
  B.push({ a: w.ms - 0.25, tr, p: opt.p ? () => opt.p! : undefined, r: (t) => <AbsoluteFill><Avatar t={t} /><AbsoluteFill style={{ background: "#000", opacity: dk(t) }} /></AbsoluteFill> });
  return w.me - 0.15;
};
// FOTO / TOMA del comandante (LTX si llegó; si no la foto con zoom lento)
const IM = (a: number, k: string, tr: Tr, z?: [number, number], p?: [number, number], dk?: [number, number][]) => {
  const d = dim(dk ?? [], 0.45);
  B.push({ a, tr, p: p ? () => p : undefined, r: (t) => <AbsoluteFill><Shot k={k} t={t} a={a} z={z} /><AbsoluteFill style={{ background: "#000", opacity: d(t) }} /></AbsoluteFill> });
};
// MUNDO 3D (la cámara ya está en K)
const W3 = (a: number, tr: Tr, o: { thief?: boolean; naranjo?: (t: number) => { glow: number; lift: number }; zaguan?: (t: number) => number; dk?: [number, number][]; from?: V3 } = {}) => {
  const d = dim(o.dk ?? [], 0.5);
  B.push({ a, tr, p: o.from ? (t) => { const q = screenOf(t, o.from!); return [q.x, q.y]; } : undefined,
    r: (t) => <AbsoluteFill><World t={t} thief={o.thief ?? false} naranjo={o.naranjo?.(t)} zaguan={o.zaguan?.(t)} /><AbsoluteFill style={{ background: "#000", opacity: d(t) }} /></AbsoluteFill> });
};
// FONDO liso (para piezas de pantalla completa que traen su propio fondo)
const BG = (a: number, tr: Tr, bg = "#0b0c0f") => B.push({ a, tr, r: () => <AbsoluteFill style={{ background: bg }} /> });

// arranque: el avatar del minuto 1 sigue un instante y entra la casa
B.push({ a: T0 - 0.4, tr: "cut", r: (t) => <Avatar t={t} /> });
// ---- 1 · presentación: la casa, la barda, el zaguán, el naranjo ----
move(T0 - 0.1, V.casaAlta, A.barda - 0.4, { p: [-4.0, 4.8, 13.0], l: [-4.0, 2.0, 0] });
move(A.barda - 0.3, { p: [-6.5, 3.8, 10.5], l: [-9.5, 1.6, 0] }, A.zaguan + 0.3, { p: [4.2, 3.4, 10.5], l: [5.8, 1.4, 1.5] }, 0.3);
move(A.naranjo - 0.2, { p: [-6.2, 3.4, 8.5], l: [-9.8, 1.6, -1.2] }, A.miedo - 0.3, V.naranjo, 0.2);
W3(T0, "zoom", { naranjo: (t) => ({ glow: e(t, A.naranjo, A.naranjo + 0.4) * 0.6, lift: 0 }) });
IM(A.miedo - 0.25, "r_oficio", "whip");
let x = AVB(A.aprendi, "portal", { p: [700, 420] });
// ---- CTA (sin guía: el canal no tiene producto): suscribirse + campanita + UNA pregunta para comentar, sobre la casa ----
move(x, V.casaAlta, A.ahora - 0.2, { p: [-2.0, 7.4, 12.5], l: [-2.0, 2.2, 0] });
W3(x, "zoom", { dk: [[A.rapidito + 0.2, A.ahora - 0.5]] });
x = AVB(A.ahora, "light");
// ---- 2 · los 5 de siempre ----
hold(x, A.n5 - 0.2, V.recamara, 40, [0.3, -0.2, -0.6]);
rp(x, [-3.4, 3.12, 1.2], PI, "walk"); rp(A.calcula, [-3.0, 3.12, 0.4], PI * 0.8, "walk"); rp(A.pocos, [-2.2, 3.12, -0.9], PI, "walk"); rp(A.seguro, [-2.1, 3.12, -1.25], PI, "reach"); rp(A.n5 + 0.5, [-2.1, 3.12, -1.25], PI, "reach");
pins(REDS, A.seguro + 0.2, A.n5 + 0.6, "r", 0.18);
W3(x, "whipU", { thief: true });
cam(A.n5 - 0.1, V.recamara.p, V.recamara.l); cam(A.cajita - 0.3, V.closet.p, V.closet.l);
x = AVB(A.cajita, "portal", { p: [1300, 400] });
IM(x, "r_cajita", "whip", [1.04, 1.14], undefined, [[A.favor - 0.1, A.n4 - 0.3]]);
hold(A.n4 - 0.2, A.tele - 0.3, V.conge, 40, [0.2, 0, -0.5]);
rp(A.n4 - 0.3, [-5.0, 0.12, -1.0], PI, "reach"); rp(A.tele, [-5.0, 0.12, -1.0], PI, "reach");
PN.push({ p: REDS[3], col: "r", at: A.conge, out: A.tele + 0.5 });
W3(A.n4 - 0.2, "zoom", { thief: true, from: PT.congelador });
x = AVB(A.tele, "flip");
IM(x, "r_congelador", "push", [1.03, 1.12]);
IM(A.n3 - 0.15, "r_closet2", "whipL");
x = AVB(A.piso, "zoom", { p: [960, 540] });
hold(x, A.levanta - 0.25, V.cama, 40, [0.3, -0.1, -0.4]);
rp(x - 0.2, [-1.0, 3.12, 1.0], -PI / 2, "walk"); rp(A.colchon, [-2.0, 3.12, -0.2], -PI / 2, "walk"); rp(A.abuelitas + 0.3, [-2.0, 3.12, -0.2], -PI / 2, "reach"); rp(A.levanta, [-2.0, 3.12, -0.2], -PI / 2, "reach");
PN.push({ p: REDS[1], col: "r", at: A.colchon, out: A.levanta + 0.4 });
W3(x, "push", { thief: true });
IM(A.levanta - 0.25, "r_colchon2", "whip", [1.04, 1.14]);
x = AVB(A.cajon, "light");
IM(x, "r_buro2", "zoom", [1.02, 1.16], [960, 540], [[A.saquelo - 0.1, A.comun - 0.2]]);
hold(A.comun - 0.25, av(A.porEso).ms - 0.2, { p: [-3.0, 5.6, 6.2], l: [-3.0, 3.6, -0.6] }, 40, [0, -0.3, -0.8]);
pins(REDS, A.comun, av(A.porEso).ms + 0.5, "r", 0.12);
W3(A.comun - 0.25, "flip");
x = AVB(A.porEso, "portal", { p: [960, 380] });
move(x, { p: [-3.0, 5.2, 5.0], l: [-3.0, 3.6, -0.6] }, A.enemigos - 0.3, V.casa);
pins(ALL, A.explico + 0.2, A.enemigos + 0.2, "g", 0.07);
W3(x, "zoom", { dk: [[A.enemigos - 0.4, 1e9]] });
// ---- 3 · los tres enemigos ----
hold(A.enemigos - 0.3, av(A.noTardar).ms, V.casaAlta, 40, [0.5, -0.5, -1]);
x = AVB(A.noTardar + 1.0, "zoom", { dark: [[A.noTardar, A.limpio - 0.6]] });
IM(x, "r_manos", "whip", [1.03, 1.1]);
hold(A.todo - 0.2, av(A.conEsa).ms, V.casa, 40, [1.2, 0.2, -1.5]);
pins(ALL, A.todo, av(A.conEsa).ms + 0.5, "g", 0.04);
W3(A.todo - 0.2, "light", { dk: [[A.todo, 1e9]] });
x = AVB(A.conEsa, "push");
// ---- 4 · COCINA ----
move(x, V.casa, A.casiNo, V.cocina, 0.2); hold(A.casiNo + 0.01, A.bote - 0.2, V.cocina, 40, [0.4, 0, -0.6]); cam(A.bote, V.basura.p, V.basura.l);
rp(x, [-5.2, 0.12, 1.2], PI / 2, "walk"); rp(A.mover, [-3.6, 0.12, 1.4], PI / 2, "walk"); rp(A.llevarse + 0.6, [-1.3, 0.12, 1.4], PI / 2, "walk"); rp(A.L1, [0.4, 0.12, 1.4], PI / 2, "walk");
pins(COC, A.cocina + 0.2, A.bote + 0.4, "g", 0.18);
W3(x, "whip", { thief: true });
IM(A.bote - 0.15, "r_basura", "portal", [1.03, 1.12], [960, 640]);
x = AVB(A.saca, "flip", { dark: [[A.saca, A.encima + 1.2]] });
IM(x, "r_basura2", "push", [1.03, 1.14]);
IM(A.frijoles - 0.3, "r_frijoles", "whip", [1.03, 1.12]);
x = AVB(A.pesa, "zoom", { p: [1300, 560] });
IM(x, "r_croquetas", "whipL", [1.03, 1.12]);
IM(A.L4 - 0.1, "r_latas", "push", [1.03, 1.12]);
x = AVB(A.L4 + 4.0, "light");
BG(x, "flip");
IM(A.L5 - 0.15, "r_sarten", "whip", [1.03, 1.14], undefined, [[A.polvo - 0.1, av(A.loQue).ms]]);
x = AVB(A.loQue, "zoom", { p: [960, 540] });
// ---- 5 · LAVADO y BAÑO ----
move(x, V.cocina, A.L6 - 0.1, V.lavado, 0.3); hold(A.L6, A.deter - 0.2, V.lavado, 40, [0.2, 0, -0.4]);
pins(LAV, A.lavado + 0.3, A.deter, "g", 0.2);
W3(x, "whipL", { from: PT.lavadero });
IM(A.deter - 0.15, "r_detergente", "portal", [1.03, 1.12], [960, 600]);
x = AVB(A.L7, "whip");
IM(x, "r_calceta", "push", [1.03, 1.12]);
IM(A.L8 - 0.1, "r_tabla", "whip", [1.03, 1.12]);
x = AVB(A.descose, "flip", { dark: [[A.descose - 0.2, A.plancha + 1.5]] });
IM(x, "r_papel", "zoom", [1.03, 1.14], [960, 540]);
IM(A.ojo - 0.1, "r_tanque", "whipL", [1.04, 1.14], undefined, [[A.ojo + 0.3, A.revisado]]);
x = AVB(A.revisado, "push", { dark: [[A.revisado, A.sala - 0.2]] });
// ---- 6 · SALA ----
move(x, V.casa, A.busca + 0.6, V.sala, 0.2); hold(A.busca + 0.61, A.carton, V.sala, 40, [0.3, 0, -0.5]); cam(A.fotos - 0.1, V.cuadros.p, V.cuadros.l);
pins(SAL, A.sala + 0.4, A.fotos, "g", 0.2);
W3(x, "zoom", { from: PT.sala });
IM(A.fotos - 0.05, "r_cuadro", "portal", [1.03, 1.12], [760, 300]);
x = AVB(A.retrato, "light");
IM(x, "r_cortina", "whip", [1.03, 1.12], undefined, [[A.tapita - 0.2, A.L12 - 0.4]]);
IM(A.L12 - 0.1, "r_libro", "push", [1.03, 1.12]);
x = AVB(A.directorio, "zoom", { p: [960, 540] });
BG(x, "flip");
IM(A.L13 - 0.1, "r_recibos", "whipU", [1.03, 1.12]);
// ---- 7 · NIETOS ----
x = AVB(A.nietos, "light");
hold(x, A.peluche - 0.3, V.nietos, 40, [0.3, -0.1, -0.5]);
pins(NIE, A.nietos + 0.3, A.peluche, "g", 0.2);
W3(x, "whipU");
IM(A.peluche - 0.2, "r_peluche", "portal", [1.03, 1.12], [1300, 620]);
hold(A.entraNinos - 0.2, A.L15 - 0.1, V.nietos, 40, [-0.2, 0, -0.3]);
rp(A.entraNinos - 0.3, [-0.7, 3.12, 1.9], PI / 2, "walk"); rp(A.entraNinos + 1.2, [1.2, 3.12, 0.6], PI / 2 + 0.4, "walk"); rp(A.entraNinos + 2.2, [1.2, 3.12, 0.6], -PI / 2, "walk"); rp(A.entraNinos + 3.8, [-0.8, 3.12, 1.9], -PI / 2, "walk");
W3(A.entraNinos - 0.2, "whip", { thief: true });
IM(A.L15 - 0.1, "r_juguetes", "push", [1.03, 1.12]);
x = AVB(A.L16, "flip");
IM(x, "r_navidad", "whip", [1.03, 1.12], undefined, [[A.once - 0.1, A.L17 - 0.3]]);
IM(A.L17 - 0.1, "r_mochila", "whipL", [1.03, 1.12]);
x = AVB(A.basuraAno, "zoom", { p: [960, 540] });
// ---- 8 · COCHERA ----
move(x, V.casa, A.siEntra + 0.3, V.cochera, 0.2); hold(A.siEntra + 0.31, A.L18 + 0.4, V.cochera, 40, [-0.3, 0, -0.8]);
pins(COCH, A.cochera + 0.5, A.L18 + 0.6, "g", 0.2);
W3(x, "whip", { zaguan: (t) => ei(t, A.cochera, A.cochera + 1.4) });
IM(A.L18 + 0.4, "r_pintura", "portal", [1.03, 1.12], [1500, 600]);
x = AVB(A.sinValor + 1.5, "push");
IM(x, "r_herramientas", "whip", [1.03, 1.14]);
IM(A.L20 - 0.1, "r_botas", "whipL", [1.03, 1.12]);
x = AVB(A.punta, "flip");
IM(x, "r_escoba", "zoom", [1.03, 1.14], [960, 540]);
IM(A.L22 - 0.1, "r_cajon", "whip", [1.03, 1.12], undefined, [[A.cinta + 0.6, A.abajoSi + 1]]);
x = AVB(A.porDentro, "push", { dark: [[A.porDentro, A.abajoSi + 1]] });
// ---- 9 · PATIO ----
move(x, V.casa, A.L23, V.patio, 0.3); move(A.L23 + 0.01, V.patio, A.maceta + 0.6, V.naranjo);
pins(PAT, A.patio + 0.3, A.L24, "g", 0.25);
W3(x, "whipL", { naranjo: (t) => ({ glow: e(t, A.maceta, A.maceta + 0.4), lift: ei(t, A.plato, A.plato + 0.8) * (1 - ei(t, A.tierra + 0.6, A.tierra + 1.4)) }), dk: [[A.plato - 0.2, A.cuenta - 0.3]] });
x = AVB(A.L24 + 1.0, "portal", { p: [500, 520] });
IM(x, "r_tubo", "whip", [1.03, 1.12]);
IM(A.L25 - 0.1, "r_cal", "push", [1.03, 1.12]);
x = AVB(A.carga, "light");
// ---- 10 · los TRES ERRORES ----
BG(x, "zoom");
IM(A.esconde - 0.2, "r_lata_limpia", "whip", [1.03, 1.16]);
x = AVB(A.limpia + 2.0, "flip");
IM(x, "r_tapon", "push", [1.04, 1.16]);
hold(A.experiencia - 0.2, A.E2 - 0.2, V.casa, 40, [0.8, 0.2, -1.2]);
pins(ALL, A.experiencia, A.E2, "g", 0.03);
W3(A.experiencia - 0.2, "light", { dk: [[A.experiencia + 0.4, 1e9]] });
x = AVB(A.mayor, "zoom", { p: [960, 540] });
hold(x, A.zapopan - 0.2, V.casaAlta, 40, [1.2, -0.4, -1.5]);
W3(x, "push", { dk: [[x, 1e9]] });
IM(A.zapopan - 0.2, "r_sillon", "whip", [1.03, 1.12]);
hold(A.anote - 0.2, av(A.ejemplo).ms, V.mesa, 38, [0.15, -0.2, -0.5]);
W3(A.anote - 0.2, "zoom", { dk: [[A.anote, 1e9]] });
x = AVB(A.ejemplo, "light", { dark: [[A.ejemplo - 0.4, A.E3 - 0.6]] });
BG(x, "flip");
IM(A.plomero - 1.2, "r_plomero", "whip", [1.03, 1.12]);
x = AVB(A.pilas, "push");
// ---- 11 · las TRES REGLAS ----
hold(x, A.R2 - 0.2, V.casa, 40, [0.8, 0.3, -1.6]);
const R1P: V3[] = [[-10.1, 2.6, -1.85], [-2.4, 2.75, -2.3], [1.9, 4.0, -2.2], [7.6, 1.25, -2.1]];
pins(R1P, A.divida + 0.3, A.R2, "g", 0.3);
W3(x, "zoom");
x = AVB(A.senuelo, "flip", { dark: [[A.senuelo, A.billete100 + 0.4]] });
IM(x, "r_cartera", "zoom", [1.03, 1.18], [960, 540]);
hold(A.primerMin - 0.25, A.corriendo, V.recamara, 40, [0.4, -0.2, -0.6]);
rp(A.primerMin - 0.4, [-2.1, 3.12, -1.25], PI, "reach"); rp(A.gano, [-2.1, 3.12, -1.25], PI, "reach"); rp(A.gano + 0.5, [-1.8, 3.12, -0.6], 0, "walk"); rp(A.corriendo, [-0.6, 3.12, 1.9], 0.3, "walk");
W3(A.primerMin - 0.25, "whip", { thief: true });
IM(A.corriendo - 0.1, "r_corriendo", "push", [1.03, 1.12]);
x = AVB(A.nadie, "light");
hold(x, av(A.protegen).ms, V.casaAlta, 40, [0.6, -0.4, -1]);
W3(x, "zoom", { dk: [[x, 1e9]] });
x = AVB(A.protegen, "flip", { dark: [[A.escrituras - 0.2, A.originales]] });
IM(x, "r_notario", "whip", [1.03, 1.12]);
IM(A.grandeNo - 0.15, "r_banco", "push", [1.03, 1.12], undefined, [[A.semanaE, A.banco + 1.2]]);
x = AVB(A.ocho, "zoom", { p: [960, 540] });
IM(x, "r_saca", "whip", [1.03, 1.12], undefined, [[A.dos - 0.2, A.gano2 - 0.3]]);
move(A.gano2 - 0.25, V.casaAlta, A.comentarios - 0.4, V.casa);
pins(ALL, A.gano2, A.comentarios + 0.5, "g", 0.05);
W3(A.gano2 - 0.25, "light");
x = AVB(A.comentarios, "portal", { p: [960, 500] });
IM(x, "r_cafe", "push", [1.03, 1.14]);
IM(A.proximo - 0.1, "r_telefono", "whip", [1.03, 1.12], undefined, [[A.proximo, 1e9]]);
AVB(A.cuidese, "light");

setKeys(K); setRoute(R); setPins(PN);

// las 25 marcas (para la lista de arriba)
const MARKS = [A.L1, A.L2, A.L3, A.L4, A.L5, A.L6, A.L7, A.L8, A.L9, A.L10, A.L11, A.L12, A.L13, A.L14, A.L15, A.L16, A.L17, A.L18, A.L19, A.L20, A.L21, A.L22, A.L23, A.L24, A.L25];

// ================= CAPA DE PIEZAS (cruza las transiciones) =================
const pieces = (t: number): React.ReactNode[] => {
  const sc = (q: V3) => screenOf(t, q);
  const L: React.ReactNode[] = [];
  const add = (from: number, to: number, f: () => React.ReactNode) => { if (t > from - 0.05 && t < to + 0.6) L.push(f()); };
  // 1 · presentación
  add(A.tengo, A.barda, () => <Tag key="66" t={t} at={A.tengo} x={1180} y={520} dx={160} dy={-260} text="66 AÑOS" sub="CON SU ESPOSA" col={COL.gold} out={A.barda - 0.3} />);
  add(A.misma, A.barda, () => <Tag key="30" t={t} at={A.misma} x={1500} y={700} dx={140} dy={-120} text="30 AÑOS" sub="LA MISMA CASA" out={A.barda - 0.3} />);
  add(A.barda, A.zaguan, () => <Tag key="tb" t={t} at={A.barda} x={sc(PT.barda).x} y={sc(PT.barda).y} dx={-150} dy={-120} text="LA BARDA" col={COL.amber} out={A.zaguan - 0.2} />);
  add(A.zaguan, A.naranjo, () => <Tag key="tz" t={t} at={A.zaguan + 0.15} x={sc(PT.zaguan).x} y={sc(PT.zaguan).y} dx={160} dy={-150} text="EL ZAGUÁN" col={COL.green} out={A.naranjo - 0.2} />);
  add(A.naranjo, A.miedo, () => <Tag key="tn" t={t} at={A.naranjo + 0.2} x={sc(PT.naranjo).x} y={sc(PT.naranjo).y} dx={220} dy={-150} text="EL NARANJO" sub="DEL PATIO" col="#ff8c1a" out={A.miedo - 0.35} />);
  add(A.miedo, A.aprendi, () => <MiedoOficio key="mo" t={t} at={A.miedo} at2={A.oficio} out={A.aprendi - 0.6} />);
  add(A.aprendi, A.rapidito, () => <Esposas key="es" t={t} at={A.agarraba} out={A.rapidito - 0.5} x={1520} y={480} text="EL QUE LOS AGARRABA" sub="32 AÑOS DE OFICIO" />);
  // CTA (la guía en la mesa; sin link en pantalla) + suscribirse y campanita
  add(A.cuenteme, A.ahora, () => <Pregunta key="pq" t={t} at={A.cuenteme - 0.2} qAt={A.cuenteme + 0.6} out={A.ahora - 0.45} pre="EL COMANDANTE PREGUNTA" q="¿Dónde escondía el dinero su mamá?" hl="su mamá" />);
  add(A.suscribase, A.ahora, () => <SubBell key="sb" t={t} at={A.suscribase - 0.1} bellAt={A.campanita} out={A.cuenteme - 0.3} x={960} y={440} />);
  // 2 · los 5 de siempre
  add(A.noBusca, A.n5, () => <Calcula key="ca" t={t} at={A.noBusca - 0.1} at2={A.calcula} out={A.seguro - 0.2} />);
  add(A.seguro, A.n5, () => <Tag key="sg" t={t} at={A.seguro + 0.3} x={sc(REDS[0]).x} y={sc(REDS[0]).y} dx={200} dy={-140} text="DONDE BUSCA TODO EL MUNDO" col={COL.red} out={A.n5 - 0.2} size={40} />);
  add(A.n5, A.noAbre, () => <EvTent key="e5" t={t} at={A.n5} out={A.noAbre - 0.3} n={5} label="LA CAJITA FUERTE" sub="CHIQUITA, DE TIENDA" col="r" />);
  add(A.cajita, A.noAbre, () => <Cajita key="cj" t={t} at={A.cajita + 0.2} looseAt={A.niLa + 0.3} out={A.noAbre - 0.3} x={1520} y={480} />);
  add(A.brazo, A.favor, () => <Tag key="br" t={t} at={A.brazo} x={1040} y={560} dx={220} dy={-160} text="SE LA LLEVA ENTERA" col={COL.red} out={A.favor - 0.2} />);
  add(A.favor, A.n4, () => <Junta key="ju" t={t} at={A.favor} out={A.n4 - 0.3} x={960} y={470} text="TODO EN UNA SOLA CAJA" />);
  add(A.n4, A.tele, () => <EvTent key="e4" t={t} at={A.n4} out={A.tele - 0.3} n={4} label="EL CONGELADOR" sub="ANTES ERA BUENO" col="r" />);
  add(A.tele, A.agarre, () => <TeleVieja key="tv" t={t} at={A.tele} out={A.agarre - 0.3} x={1520} y={470} text="EL CONGELADOR" />);
  add(A.agarre, A.n3, () => <FichaDetenido key="fd" t={t} at={A.agarre + 0.4} out={A.n3 - 0.3} x={1520} y={520} big="19 AÑOS" l2="ABRIÓ EL CONGELADOR PRIMERO" l2At={A.abrir} />);
  add(A.hambre, A.n3, () => <Tag key="ha" t={t} at={A.hambre} x={700} y={420} dx={-160} dy={-120} text="NI TENÍA HAMBRE" col={COL.amber} out={A.n3 - 0.3} />);
  add(A.n3, A.piso, () => <EvTent key="e3" t={t} at={A.n3} out={A.piso - 0.3} n={3} label="EL CLÓSET" col="r" />);
  add(A.repisa, A.piso, () => <Tag key="rp" t={t} at={A.repisa} x={1500} y={330} dx={160} dy={-80} text="LA REPISA" col={COL.red} out={A.piso - 0.3} size={40} />);
  add(A.zapatos, A.piso, () => <Tag key="cz" t={t} at={A.zapatos} x={1420} y={760} dx={160} dy={60} text="CAJAS DE ZAPATOS" col={COL.red} out={A.piso - 0.3} size={40} />);
  add(A.bolsillos, A.piso, () => <Tag key="bo" t={t} at={A.bolsillos} x={900} y={520} dx={-180} dy={-130} text="LOS BOLSILLOS" col={COL.red} out={A.piso - 0.3} size={40} />);
  add(A.piso, A.n2, () => <UnMinuto key="um" t={t} at={A.piso} out={A.n2 - 0.2} x={1520} y={480} text="1 MINUTO" sub="TODO AL PISO" />);
  add(A.n2, A.n1, () => <EvTent key="e2" t={t} at={A.n2} out={A.n1 - 0.3} n={2} label="DEBAJO DEL COLCHÓN" sub="EL DE LAS ABUELITAS" col="r" />);
  add(A.otra, A.n1, () => <Tag key="ot" t={t} at={A.otra} x={560} y={760} dx={-120} dy={-180} text="UNA MANO" sub="Y YA LO TIENE" col={COL.red} out={A.n1 - 0.3} />);
  add(A.n1, A.comun, () => <EvTent key="e1" t={t} at={A.n1} out={A.comun - 0.3} n={1} label="EL BURÓ Y LA CÓMODA" sub="AHÍ VA PRIMERO, SIEMPRE" col="r" />);
  add(A.reloj, A.saquelo, () => <Tag key="rl" t={t} at={A.reloj} x={720} y={420} dx={-170} dy={-120} text="EL RELOJ" col={COL.gold} out={A.saquelo - 0.2} />);
  add(A.alhajas, A.saquelo, () => <Tag key="al" t={t} at={A.alhajas} x={1130} y={300} dx={180} dy={-80} text="LAS ALHAJAS" col={COL.gold} out={A.saquelo - 0.2} />);
  add(A.dinero, A.saquelo, () => <Tag key="dn" t={t} at={A.dinero} x={1180} y={620} dx={200} dy={120} text="EL DINERO" sub="DE LA SEMANA" col={COL.green} out={A.saquelo - 0.2} />);
  add(A.saquelo, A.comun, () => <SelloTinta key="sq" t={t} at={A.saquelo + 0.2} out={A.comun - 0.3} x={960} y={540} text="SÁQUELO HOY" sub="HOY MISMO" col="#ff3b2f" size={120} />);
  add(A.tresPasos, A.porEso, () => <Tag key="3p" t={t} at={A.tresPasos} x={sc([-3.3, 3.2, -0.6]).x} y={sc([-3.3, 3.2, -0.6]).y} dx={-260} dy={-200} text="A 3 PASOS DE LA CAMA" col={COL.red} out={av(A.porEso).ms} />);
  add(A.porEso, A.explico, () => <ReglaCard key="r1" t={t} at={A.porEso} out={A.explico - 0.2} head="REGLA N.º 1 DEL COMANDANTE"
    words={["El", "dinero", "nunca", "duerme", "donde", "duerme", "usted."].map((w, i) => ({ at: A.nunca + i * 0.28, w, hl: i === 2 || i === 3 }))} />);
  add(A.explico, A.enemigos, () => <Tag key="ex" t={t} at={A.explico + 0.4} x={1100} y={420} dx={120} dy={-200} text="¿POR QUÉ FUNCIONAN?" col={COL.green} out={A.enemigos - 0.3} />);
  // 3 · los tres enemigos
  const lit3 = [e(t, A.quita, A.quita + 0.2), e(t, A.hace, A.hace + 0.2), e(t, A.obliga, A.obliga + 0.2)];
  add(A.enemigos, A.limpio, () => <Enemigos key="en" t={t} items={[{ at: A.tiempo, txt: "TIEMPO", ic: "tiempo" }, { at: A.ruido, txt: "RUIDO", ic: "ruido" }, { at: A.suciedad, txt: "SUCIEDAD", ic: "suciedad" }]} out={A.limpio - 0.4}
    lit={[e(t, A.noTardar, A.noTardar + 0.2) * (1 - e(t, A.noTardar + 1.2, A.noTardar + 1.4)), e(t, A.noTardar + 1.2, A.noTardar + 1.4) * (1 - e(t, A.noTardar + 2.6, A.noTardar + 2.8)), e(t, A.noTardar + 2.6, A.noTardar + 2.8)]} />);
  add(A.limpio, A.todo, () => <Tag key="li" t={t} at={A.limpio} x={1000} y={420} dx={200} dy={-140} text="SALE A LA CALLE LIMPIO" col={COL.amber} out={A.todo - 0.3} />);
  add(A.todo, A.conEsa, () => <Triada key="tr" t={t} at={A.todo} out={av(A.conEsa).ms - 0.1} lit={lit3} title="CON 1 BASTA" x={1400} y={560} />);
  add(A.conEsa, A.cuarto, () => <Libreta key="lb" t={t} at={A.inventar - 0.4} out={A.cuarto - 0.3} x={1540} y={520} title="MIS ESCONDITES" lines={[{ at: A.inventar + 0.2, txt: "1. ________" }, { at: A.inventar + 0.7, txt: "2. ________" }, { at: A.inventar + 1.2, txt: "3. ________" }]} />);
  // 4 · cocina y la lista de 25
  add(A.cocina, A.casiNo, () => <Letrero key="lc" t={t} at={A.cocina} out={A.casiNo + 1.2} text="COCINA" sub="LUGARES 1 AL 5" />);
  add(A.mover, A.L1, () => <Barras key="ba" t={t} out={A.L1 - 0.3} rows={[{ at: A.mover, label: "MUCHO QUE MOVER", v: 0.95, col: COL.red }, { at: A.llevarse, label: "POCO QUE LLEVARSE", v: 0.12, col: COL.green }]} x={1400} y={840} />);
  add(A.L1 - 0.5, A.carga + 3, () => <Lista25 key="l25" t={t} at={A.L1 - 0.4} out={A.carga + 2.5} marks={MARKS} />);
  add(A.L1, A.ajena + 2, () => <EvTent key="g1" t={t} at={A.L1} out={A.ajena + 2.4} n={1} label="EL BOTE DE BASURA" sub="DEBAJO DE LA BOLSA" />);
  add(A.saca, A.ajena, () => <Pasos key="p1" t={t} out={A.ajena - 0.6} steps={[{ at: A.saca, txt: "SACA LA BOLSA" }, { at: A.fondo, txt: "SOBRE AL FONDO" }, { at: A.encima, txt: "BOLSA ENCIMA" }]} y={880} />);
  add(A.ajena, A.L2, () => <EnemyChips key="c1" t={t} at={A.ajena + 0.2} out={A.L2 - 0.3} which={["suciedad"]} />);
  add(A.L2, A.L3, () => <EvTent key="g2" t={t} at={A.L2} out={A.L3 - 0.3} n={2} label="LOS FRIJOLES" sub="O EL ARROZ" />);
  add(A.pesa, A.L3, () => <Balanza key="bz" t={t} at={A.pesa} out={A.L3 - 0.3} x={1520} y={470} l="CON SOBRE" r="SIN SOBRE" title="PESA LO MISMO" />);
  add(A.vaciar, A.L3, () => <EnemyChips key="c2" t={t} at={A.vaciar + 0.3} out={A.L3 - 0.3} which={["tiempo", "suciedad"]} />);
  add(A.L3, A.L4, () => <EvTent key="g3" t={t} at={A.L3} out={A.L4 - 0.3} n={3} label="LAS CROQUETAS" sub="DEL PERRO" />);
  add(A.huele, A.L4, () => <Tag key="hm" t={t} at={A.huele} x={1180} y={720} dx={220} dy={-220} text="CAJA FUERTE" sub="QUE HUELE MAL" col={COL.amber} out={A.L4 - 0.3} />);
  add(A.sellada, A.L4, () => <EnemyChips key="c3" t={t} at={A.sellada + 0.5} out={A.L4 - 0.3} which={["suciedad"]} />);
  add(A.L4, A.L5, () => <EvTent key="g4" t={t} at={A.L4} out={A.L5 - 0.3} n={4} label="UNA LATA VIEJA" sub="LAVADA, CON SU ETIQUETA" />);
  add(A.verdad, A.L5, () => <Alacena key="ala" t={t} at={av(A.L4 + 4).me - 0.15} backAt={A.verdad + 1.0} out={A.L5 - 0.1} />);
  add(A.L5, av(A.loQue).me, () => <EvTent key="g5" t={t} at={A.L5} out={A.polvo - 0.2} n={5} label="LA CAJA DEL SARTÉN" sub="ARRIBA, CON POLVO" />);
  add(A.polvo, A.lavado, () => <CandadoPolvo key="cp" t={t} at={A.polvo} out={A.lavado - 0.3} x={1520} y={480} text="EL POLVO = CANDADO" />);
  // 5 · lavado y baño
  add(A.lavado, A.deter, () => <Letrero key="ll" t={t} at={A.lavado} out={A.deter - 0.3} text="LAVADO Y BAÑO" sub="LUGARES 6 AL 9" />);
  add(A.L6, A.L7, () => <EvTent key="g6" t={t} at={A.L6} out={A.L7 - 0.3} n={6} label="EL DETERGENTE" sub="ENTERRADO EN EL JABÓN" />);
  add(A.noSeVa, A.L7, () => <EnemyChips key="c6" t={t} at={A.noSeVa + 0.4} out={A.L7 - 0.3} which={["tiempo", "suciedad"]} />);
  add(A.L7, A.L8, () => <EvTent key="g7" t={t} at={A.L7} out={A.L8 - 0.3} n={7} label="LA ROPA SUCIA" sub="EN UNA CALCETA, HASTA ABAJO" />);
  add(A.nadieRopa, A.L8, () => <EnemyChips key="c7" t={t} at={A.nadieRopa + 0.6} out={A.L8 - 0.3} which={["suciedad"]} />);
  add(A.L8, A.L9, () => <EvTent key="g8" t={t} at={A.L8} out={A.L9 - 0.3} n={8} label="LA TABLA DE PLANCHAR" sub="DENTRO DE LA FUNDA" />);
  add(A.descose, A.L9, () => <Costura key="co" t={t} at={A.descose} inAt={A.descose + 1.2} closeAt={A.plancha} out={A.L9 - 0.3} x={1440} y={520} />);
  add(A.L9, A.ojo, () => <EvTent key="g9" t={t} at={A.L9} out={A.ojo - 0.2} n={9} label="EL PAPEL DE BAÑO" sub="EN EL PAQUETE DE RESERVA" />);
  add(A.ojo, A.revisado, () => <SelloTinta key="nt" t={t} at={A.ojo + 0.4} out={A.revisado - 0.3} x={960} y={500} text="EL TANQUE NO" sub="YA LO CONOCEN TODOS" col="#ff3b2f" size={110} />);
  add(A.revisado, A.sala, () => <CasasGrid key="cg" t={t} at={A.revisado} out={A.sala - 0.3} x={1500} y={500} text="CASI TODAS" />);
  // 6 · sala
  add(A.sala, A.busca + 2, () => <Letrero key="ls" t={t} at={A.sala + 0.1} out={A.busca + 1.6} text="SALA" sub="LUGARES 10 AL 13" />);
  add(A.busca, A.L10, () => <Tag key="tl" t={t} at={A.busca + 0.5} x={sc(PT.tele).x} y={sc(PT.tele).y} dx={200} dy={-200} text="LA TELE" sub="Y LA COMPU, NO PAPELITOS" col={COL.red} out={A.L10 - 0.2} />);
  add(A.L10, A.retrato, () => <EvTent key="g10" t={t} at={A.L10} out={A.retrato - 0.3} n={10} label="DETRÁS DE UN CUADRO" sub="LAS FOTOS DE LA FAMILIA" />);
  add(A.clavitos, A.retrato, () => <Pasos key="p10" t={t} out={A.retrato - 0.5} steps={[{ at: A.clavitos, txt: "QUITE LOS CLAVITOS" }, { at: A.billete, txt: "BILLETE PLANO" }, { at: A.cierra, txt: "SE CIERRA" }]} y={880} />);
  add(A.retrato, A.L11, () => <Polaroid key="pr" t={t} at={A.retrato + 0.2} out={A.L11 - 0.3} id="img_r_cuadro" x={1560} y={480} w={420} h={236} rot={6} cap="nunca lo desarman" />);
  add(A.L11, A.L12, () => <EvTent key="g11" t={t} at={A.L11} out={A.L12 - 0.3} n={11} label="LA BARRA DE LA CORTINA" sub="HUECA, CON TAPITA" />);
  add(A.tapita, A.L12, () => <TuboCorte key="tc" t={t} at={A.tapita} out={A.L12 - 0.3} x={960} y={560} />);
  add(A.L12, A.invisible, () => <EvTent key="g12" t={t} at={A.L12} out={A.directorio - 0.3} n={12} label="UN LIBRO ABURRIDO" sub="LA BIBLIA NO: ESA LA OJEAN" />);
  add(A.directorio, A.invisible, () => <Libreta key="lb2" t={t} at={A.directorio} out={A.invisible - 0.4} x={1540} y={520} title="LIBROS QUE NADIE ABRE" lines={[{ at: A.directorio + 0.1, txt: "Directorio viejo" }, { at: A.contab, txt: "Contabilidad" }, { at: A.manual, txt: "Manual del refri" }]} />);
  add(A.invisible, A.L13, () => <Invisible key="iv" t={t} at={A.invisible - 0.1} out={A.L13 - 0.2} text="LO ABURRIDO ES INVISIBLE" />);
  add(A.L13, av(A.nietos).ms, () => <EvTent key="g13" t={t} at={A.L13} out={av(A.nietos).ms - 0.1} n={13} label="RECIBOS DE LUZ VIEJOS" sub="NADIE SE LOS ROBA" />);
  // 7 · nietos
  add(A.nietos, A.L14, () => <Letrero key="ln" t={t} at={A.nietos + 0.2} out={A.L14 - 0.25} text="LOS NIETOS" sub={"LUGARES 14 AL 17 · SU FAVORITO"} y={760} />);
  add(A.L14, A.L15, () => <EvTent key="g14" t={t} at={A.L14} out={A.L15 - 0.3} n={14} label="UN PELUCHE" sub="CON CIERRE EN LA ESPALDA" />);
  add(A.entraNinos, A.L15, () => <Tag key="tn2" t={t} at={A.entraNinos + 2.0} x={sc([1.2, 4.6, 0.6]).x} y={sc([1.2, 4.6, 0.6]).y} dx={260} dy={-120} text="ENTRA Y SE SALE" sub="NADA QUE SE VENDA RÁPIDO" col={COL.green} out={A.L15 - 0.3} />);
  add(A.L15, A.L16, () => <EvTent key="g15" t={t} at={A.L15} out={A.L16 - 0.3} n={15} label="LA CAJA DE JUGUETES" sub="DEBAJO DE BLOQUES Y CARRITOS" />);
  add(A.L16, A.L17, () => <EvTent key="g16" t={t} at={A.L16} out={A.once - 0.2} n={16} label="LOS ADORNOS DE NAVIDAD" sub="ARRIBA DEL CLÓSET" />);
  add(A.once, A.L17, () => <Calendario key="cal" t={t} at={A.once} out={A.L17 - 0.3} x={1430} y={500} text="NI USTED" textAt={A.niUsted} />);
  add(A.L17, A.cochera, () => <EvTent key="g17" t={t} at={A.L17} out={A.cochera - 0.3} n={17} label="UNA MOCHILA VIEJA" sub="ATRÁS DE LA PUERTA" />);
  // 8 · cochera
  add(A.cochera, A.L18, () => <Letrero key="lco" t={t} at={A.cochera + 0.2} out={A.siEntra + 0.9} text="COCHERA" sub="LUGARES 18 AL 22" />);
  add(A.siEntra, A.L18, () => <Tag key="he" t={t} at={A.siEntra + 1.2} x={sc(PT.estante).x} y={sc(PT.estante).y} dx={-260} dy={-170} text="BUSCA HERRAMIENTA" sub="Y COSAS GRANDES" col={COL.red} out={A.L18 - 0.2} />);
  add(A.L18, A.L19, () => <EvTent key="g18" t={t} at={A.L18} out={A.L19 - 0.3} n={18} label="LATA DE PINTURA VIEJA" sub="CON SU ESCURRIDO" />);
  add(A.usada, A.L19, () => <Pasos key="p18" t={t} out={A.L19 - 0.4} steps={[{ at: A.usada, txt: "USADA" }, { at: A.pesada, txt: "PESADA" }, { at: A.sinValor, txt: "SIN VALOR" }]} y={880} />);
  add(A.L19, A.L20, () => <EvTent key="g19" t={t} at={A.L19} out={A.L20 - 0.3} n={19} label="LA CAJA DE HERRAMIENTAS" sub="DEBAJO DE LA CHAROLA" />);
  add(A.grasa, A.L20, () => <EnemyChips key="c19" t={t} at={A.grasa + 0.3} out={A.L20 - 0.3} which={["suciedad"]} />);
  add(A.L20, A.L21, () => <EvTent key="g20" t={t} at={A.L20} out={A.L21 - 0.3} n={20} label="LAS BOTAS CON LODO" sub="HASTA LA PUNTA DEL PIE" />);
  add(A.L21, A.L22, () => <EvTent key="g21" t={t} at={A.L21} out={A.L22 - 0.3} n={21} label="EL PALO DE LA ESCOBA" sub="HUECO, CON TAPÓN" />);
  add(A.L22, A.patio, () => <EvTent key="g22" t={t} at={A.L22} out={A.cinta + 0.5} n={22} label="EL TECHO DEL CAJÓN" sub="PEGADO CON CINTA" />);
  add(A.cinta, A.patio, () => <CajonCorte key="cc" t={t} at={A.cinta + 0.6} out={A.patio - 0.3} x={1460} y={520} okAt={A.porDentro} noAt={A.abajoSi} />);
  // 9 · patio
  add(A.patio, A.maceta, () => <Letrero key="lp" t={t} at={A.patio + 0.1} out={A.maceta - 0.2} text="PATIO" sub="LUGARES 23 AL 25" />);
  add(A.L23, A.L24, () => <EvTent key="g23" t={t} at={A.L23} out={A.L24 - 0.3} n={23} label="LA MACETA GRANDE" sub="CON DOBLE FONDO" />);
  add(A.plato, A.L24, () => <MacetaCorte key="mc" t={t} at={A.plato - 0.1} out={A.cuenta + 1.6} x={1500} y={520} steps={[A.plato, A.sobreAbajo, A.tierra]} />);
  add(A.cuenta, A.L24, () => <Tag key="cu" t={t} at={A.cuenta} x={sc(PT.naranjo).x} y={sc(PT.naranjo).y} dx={-60} dy={-260} text="SU CUENTA DE AHORRO" col={COL.green} out={A.L24 - 0.3} />);
  add(A.L24, A.L25, () => <EvTent key="g24" t={t} at={A.L24} out={A.L25 - 0.3} n={24} label="UN TUBO ENTERRADO" sub="JUNTO A LA BARDA" />);
  add(A.piedra, A.L25, () => <Tag key="pi" t={t} at={A.piedra} x={900} y={800} dx={100} dy={-330} text="UNA PIEDRA QUE USTED RECONOZCA" col={COL.amber} out={A.L25 - 0.3} size={38} />);
  add(A.meses, A.L25, () => <Tag key="me" t={t} at={A.meses} x={840} y={640} dx={-200} dy={-260} text="LO QUE NO USA EN MESES" col={COL.green} out={A.L25 - 0.3} size={38} />);
  add(A.L25, A.ojoErr, () => <EvTent key="g25" t={t} at={A.L25} out={A.carga + 2.5} n={25} label="EL COSTAL DE CAL" sub="EN LA BODEGUITA" />);
  add(A.carga, A.ojoErr, () => <EnemyChips key="c25" t={t} at={A.carga + 0.5} out={A.ojoErr - 0.3} which={["tiempo", "ruido", "suciedad"]} />);
  // 10 · errores
  add(A.ojoErr, A.esconde, () => <Corcho key="cr" t={t} at={av(A.carga).me - 0.15} out={A.esconde - 0.25} cards={[{ at: A.E1, n: "1", txt: "Las huellas" }, { at: 1e9, n: "2", txt: "" }, { at: 1e9, n: "3", txt: "" }]} />);
  add(A.esconde, A.experiencia, () => <Huella key="hu" t={t} at={A.limpia} out={av(A.limpia + 2).ms - 0.1} x={1560} y={460} text="LA LATA LIMPIA" />);
  add(A.experiencia, A.E2, () => <Tag key="se" t={t} at={A.seUsa} x={960} y={300} dx={0} dy={-140} text="BUSCA LO QUE SE USA" col={COL.amber} out={A.grande - 0.2} />);
  add(A.grande, A.E2, () => <GrandeDiario key="gd" t={t} at={A.grande} at2={A.diario} out={A.E2 - 0.3} />);
  add(A.E2, A.mayor, () => <Corcho key="cr2" t={t} at={A.E2 - 0.15} out={av(A.mayor).ms + 0.2} cards={[{ at: A.E2 - 0.4, n: "1", txt: "Las huellas" }, { at: A.olvidarse - 0.2, n: "2", txt: "Olvidarse" }, { at: 1e9, n: "3", txt: "" }]} />);
  add(A.noAcuerda, A.zapopan, () => <Tag key="dp" t={t} at={A.noAcuerda + 0.3} x={960} y={420} dx={0} dy={-160} text="¿DÓNDE LO PUSE?" col={COL.amber} out={A.zapopan - 0.2} size={70} />);
  add(A.zapopan, A.anote, () => <Tag key="zp" t={t} at={A.zapopan + 1.2} x={760} y={560} dx={-160} dy={-200} text="ZAPOPAN" sub="VENDIÓ EL SILLÓN... CON SUS AHORROS" col={COL.red} out={A.anote - 0.3} />);
  add(A.anote, A.E3, () => <ListaSuper key="ls2" t={t} at={A.anote + 0.2} out={A.E3 - 0.4} superAt={A.superL} items={[{ at: A.ejemplo + 0.5, txt: "Naranjas" }, { at: A.xFrij + 0.2, txt: "Frijoles" }, { at: A.xBotas, txt: "Botas" }]} />);
  add(A.E3, A.plomero, () => <Corcho key="cr3" t={t} at={A.E3 - 0.15} out={A.plomero - 1.3} cards={[{ at: A.E3 - 0.4, n: "1", txt: "Las huellas" }, { at: A.E3 - 0.4, n: "2", txt: "Olvidarse" }, { at: A.E3, n: "3", txt: "Siempre el mismo lugar" }]} />);
  add(A.plomero, A.pilas, () => <Pasos key="pp" t={t} out={av(A.pilas).ms - 0.1} steps={[{ at: A.plomero, txt: "EL PLOMERO" }, { at: A.pintor, txt: "EL PINTOR" }, { at: A.sobrino, txt: "EL SOBRINO" }]} y={170} />);
  add(A.cambie, A.pilas, () => <Tag key="cb" t={t} at={A.cambie} x={960} y={760} dx={0} dy={110} text="→ CAMBIE DE ESCONDITE" col={COL.green} out={av(A.pilas).ms - 0.1} size={52} />);
  add(A.pilas, A.reglas, () => <Detector key="dt" t={t} at={A.pilas + 0.2} out={A.reglas - 0.3} x={1520} y={470} text="1 VEZ AL AÑO" />);
  // 11 · reglas
  add(A.reglas, A.R1, () => <Balanza key="bz2" t={t} at={A.reglas + 0.3} out={A.R1 - 0.2} x={1400} y={520} l="3 REGLAS" r="25 LUGARES" title="VALEN MÁS" />);
  add(A.R1, A.R2, () => <EvTent key="R1" t={t} at={A.R1} out={A.R2 - 0.3} n={1} label="NUNCA TODO EN UN LUGAR" sub="REGLA 1" />);
  add(A.divida, A.R2, () => <Divide key="dv" t={t} at={A.divida} splitAt={A.divida + 0.4} lossAt={A.encuentran + 0.4} out={A.R2 - 0.3} x={1500} y={430} />);
  add(A.R2, A.primerMin, () => <EvTent key="R2" t={t} at={A.R2} out={A.primerMin - 0.3} n={2} label="LA CARTERA SEÑUELO" sub="REGLA 2" />);
  add(A.billete100, A.primerMin, () => <Tag key="100" t={t} at={A.billete100 + 0.3} x={820} y={330} dx={-180} dy={-110} text="UN BILLETE DE $100" col={COL.green} out={A.primerMin - 0.3} />);
  add(A.credencial, A.primerMin, () => <Tag key="cv" t={t} at={A.credencial + 0.2} x={1000} y={560} dx={60} dy={150} text="CREDENCIAL VENCIDA" col={COL.gold} out={A.primerMin - 0.3} />);
  add(A.papeles, A.primerMin, () => <Tag key="pa" t={t} at={A.papeles} x={1360} y={300} dx={160} dy={-90} text="UNOS PAPELES" col={COL.ink} out={A.primerMin - 0.3} />);
  add(A.primerMin, A.corriendo, () => <Crono key="cr1" t={t} at={A.primerMin} out={A.corriendo - 0.3} x={1600} y={300} size={260} val={Math.min(58, (t - A.primerMin) * 40)} max={480} label={t > A.gano ? "¡CREE QUE GANÓ!" : "PRIMER MINUTO"} freeze={t > A.gano} col={t > A.gano ? COL.green : COL.amber} />);
  add(A.corriendo, A.R3, () => <Tag key="cc2" t={t} at={A.corriendo + 1.0} x={sc([0, 0, 0]).x * 0 + 1180} y={300} dx={200} dy={-60} text="MUY CONTENTOS" sub="CON SU SEÑUELO" col={COL.green} out={av(A.nadie).ms} />);
  add(A.R3, A.amigo, () => <EvTent key="R3" t={t} at={A.R3} out={A.llave - 0.2} n={3} label="QUE NADIE LO SEPA" sub="REGLA 3" />);
  add(A.llave, A.amigo, () => <Nadie key="na" t={t} items={[{ at: A.llave, txt: "EL PLOMERO" }, { at: A.vecina, txt: "LA VECINA" }, { at: A.nieto, txt: "EL NIETO" }]} out={A.amigo - 0.2} finalAt={A.cuenta2} final="EL QUE SE CUENTA, YA NO ES ESCONDITE" />);
  add(A.amigo, A.escrituras, () => <Tag key="am" t={t} at={A.amigo + 0.6} x={960} y={540} dx={0} dy={-60} text="DE POLICÍA A AMIGO" col={COL.gold} out={A.escrituras + 0.6} size={70} />);
  add(A.escrituras, A.originales, () => <Papeles key="pp2" t={t} at={A.escrituras} protAt={A.protegen} out={A.originales - 0.3} x={1440} y={480} docs={["ESCRITURAS", "ACTAS", "PAPELES DEL BANCO"]} />);
  add(A.originales, A.grandeNo, () => <Pasos key="or" t={t} out={A.grandeNo - 0.3} steps={[{ at: A.originales, txt: "ORIGINALES → BANCO O NOTARIO" }, { at: A.copias, txt: "EN CASA, SÓLO COPIAS" }]} y={880} />);
  add(A.semanaE, A.ocho, () => <CasaBanco key="cb2" t={t} at={A.semanaE} out={av(A.ocho).ms - 0.1} rows={[{ at: A.semanaE, txt: "LA SEMANA", v: 0.16, col: COL.gold, where: "CASA" }, { at: A.emergencia, txt: "EMERGENCIA", v: 0.14, col: COL.amber, where: "CASA" }, { at: A.banco, txt: "TODO LO DEMÁS", v: 0.7, col: COL.green, where: "BANCO" }]} />);
  add(A.ocho, A.mire, () => <Crono key="c8" t={t} at={A.ocho} out={A.mire - 0.2} x={1560} y={460} size={300} val={480 - Math.max(0, t - A.ocho) * 120} max={480} label="LOS AHORROS DE UNA VIDA" />);
  add(A.mire, A.dos, () => <Tag key="no25" t={t} at={A.mire + 0.4} x={1500} y={300} dx={0} dy={-120} text="NO HACEN FALTA LOS 25" col={COL.gold} out={A.dos - 0.2} />);
  add(A.dos, A.comentarios, () => <Tarea key="ta" t={t} at={A.dos} out={A.gano2 - 0.3} title="ESTA SEMANA" items={[{ at: A.sacarB, txt: "Sacar el dinero del buró", ok: A.sacarB + 1.0 }, { at: A.poner, txt: "Poner la cartera señuelo", ok: A.poner + 1.0 }]} />);
  add(A.gano2, A.comentarios, () => <Tag key="g2b" t={t} at={A.gano2 + 0.4} x={860} y={460} dx={80} dy={-240} text="YA LE GANÓ AL RATERO" col={COL.green} out={A.comentarios - 0.3} />);
  add(A.comentarios, A.proximo, () => <Comentario key="cm" t={t} at={A.comentarios} out={A.mia - 0.3} q="¿Dónde lo escondía su mamá?" a="En el bote del café..." aAt={A.mama + 0.6} />);
  add(A.mia, A.proximo, () => <Tag key="mi" t={t} at={A.mia + 0.8} x={960} y={420} dx={220} dy={-160} text="EL BOTE DEL CAFÉ" sub="MI PAPÁ NUNCA SE ENTERÓ" col={COL.gold} out={A.proximo - 0.2} />);
  add(A.proximo, A.cuidese, () => <Proximo key="px" t={t} at={A.proximo + 0.2} hangAt={A.cuelgo + 1.0} out={av(A.cuidese).ms} title="LA LLAMADA QUE CUELGO EN 3 SEGUNDOS" sub="EL PRÓXIMO VIDEO" />);
  add(A.acuerdese, TEND, () => <Frase key="fr" t={t} out={TEND + 5} words={["El", "dinero", "nunca", "duerme", "donde", "duerme", "usted."].map((w, i) => ({ at: (i < 4 ? A.fN : A.fDonde) + (i < 4 ? i : i - 4) * 0.26, w, hl: i === 2 || i === 3 }))} />);
  return L;
};

// ---------- transiciones entre bases ----------
const HB: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={`${x} ${y}`} /></filter></svg>;
const transition = (tr: Tr, k: number, prev: React.ReactNode, cur: React.ReactNode, p: [number, number]) => {
  const L: React.ReactNode[] = [];
  if (tr === "whip" || tr === "whipL" || tr === "whipU") {
    const v = tr === "whipU", d = tr === "whipL" ? -1 : 1, mb = Math.round(Math.sin(k * Math.PI) * 70), id = `w${v ? "y" : "x"}${mb}`, kk = ei(k, 0, 1);
    const T = (u: number) => (v ? `translateY(${u * 1080}px)` : `translateX(${u * 1920}px)`);
    L.push(<HB key="hb" id={id} x={v ? 0 : mb} y={v ? mb : 0} />);
    L.push(<AbsoluteFill key="wp" style={{ transform: T(-kk * d), filter: mb ? `url(#${id})` : undefined }}>{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="wc" style={{ transform: T((1 - kk) * d), filter: mb ? `url(#${id})` : undefined }}>{cur}</AbsoluteFill>);
  } else if (tr === "portal") {
    L.push(<AbsoluteFill key="pp">{prev}</AbsoluteFill>);
    L.push(<Portal key="pc" x={p[0]} y={p[1]} r={ei(k, 0, 1) * 0.999 + 0.001}>{cur}</Portal>);
  } else if (tr === "zoom") {
    const z = ei(k, 0, 1), b = Math.round(22 * Math.sin(Math.PI * k)), id = `zb${b}`;
    L.push(<AbsoluteFill key="zc" style={{ transform: `scale(${1.35 - 0.35 * z})` }}>{cur}</AbsoluteFill>);
    L.push(<AbsoluteFill key="zp" style={{ transformOrigin: `${p[0]}px ${p[1]}px`, transform: `scale(${1 + 3.2 * z})`, opacity: 1 - e(k, 0.35, 0.9), filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={b} /> : null}{prev}</AbsoluteFill>);
  } else if (tr === "flip") {
    const out = k < 0.5, a = out ? ei(k * 2, 0, 1) * 90 : (1 - ei((k - 0.5) * 2, 0, 1)) * -90;
    L.push(<AbsoluteFill key="fb" style={{ background: "radial-gradient(ellipse at 50% 50%, #1a222c, #05070a)" }} />);
    L.push(<AbsoluteFill key="ff" style={{ perspective: 2200 }}><AbsoluteFill style={{ transform: `translateZ(${-Math.sin(Math.PI * k) * 500}px) rotateY(${a}deg)`, borderRadius: 30 * Math.sin(Math.PI * k), overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,.8)" }}>{out ? prev : cur}</AbsoluteFill></AbsoluteFill>);
  } else if (tr === "push") {
    const z = ei(k, 0, 1), b = Math.round(60 * Math.sin(Math.PI * k)), id = `pb${b}`;
    L.push(<HB key="hb" id={id} x={0} y={b} />);
    L.push(<AbsoluteFill key="up" style={{ transform: `translateY(${-z * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="uc" style={{ transform: `translateY(${(1 - z) * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{cur}</AbsoluteFill>);
  } else if (tr === "light") {
    L.push(<AbsoluteFill key="lp">{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="lc" style={{ opacity: e(k, 0.25, 0.75) }}>{cur}</AbsoluteFill>);
    const g = Math.sin(Math.PI * k);
    L.push(<AbsoluteFill key="ll" style={{ background: `radial-gradient(ellipse 80% 70% at ${30 + 40 * k}% 45%, rgba(255,236,200,${0.95 * g}), rgba(255,170,90,${0.35 * g}) 50%, transparent 80%)`, mixBlendMode: "screen" }} />);
  } else L.push(<AbsoluteFill key="c">{cur}</AbsoluteFill>);
  return L;
};

// tabla para revisar: base, inicio, largo
export const beatTable = () => B.map((b, i) => ({ i, a: +b.a.toFixed(2), dur: +((B[i + 1]?.a ?? TEND) - b.a).toFixed(2), tr: b.tr }));

export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  if (t < T0 - 0.001) return null;
  let i = 0; while (i < B.length - 1 && B[i + 1].a <= t) i++;
  const b = B[i], D = DUR[b.tr], k = D > 0 ? (t - b.a) / D : 1;
  const base = i > 0 && k < 1 ? transition(b.tr, k, B[i - 1].r(t), b.r(t), b.p ? b.p(t) : [960, 540]) : [<AbsoluteFill key="b">{b.r(t)}</AbsoluteFill>];
  const fin = 1 - e(t, TEND - 0.6, TEND - 0.02);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fin }}>
        {base}
        {pieces(t)}
      </AbsoluteFill>
      <Flash t={t} at={A.patio} peak={0.25} col="#ffe6b0" w={0.4} />
      <div style={{ display: "none", fontFamily: FONT, textShadow: extrude(1, "#000") }} />
    </AbsoluteFill>
  );
};
