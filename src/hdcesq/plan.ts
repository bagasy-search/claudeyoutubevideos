// hdcesq · PLAN del resto (101-991 s): poses de cámara del patio, tomas entre las ventanas del avatar y
// los tiempos de los eventos del mundo, TODO clavado a la frase con at(). Lo leen patio3d (cámara), rest3d (eventos) y Rest (tomas).
import { at, fin, AVWIN } from "./at";

type V = [number, number, number];
export type Pose = { p: V; l: V; f: number };
export const PO: Record<string, Pose> = {
  wt0: { p: [1.9, 1.55, 2.75], l: [1.95, 0.92, 1.3], f: 40 }, wt1: { p: [2.3, 1.35, 2.3], l: [2.0, 0.92, 1.3], f: 38 },
  st0: { p: [1.76, 1.09, 1.55], l: [1.76, 0.947, 1.3], f: 34 }, st1: { p: [1.72, 1.06, 1.5], l: [1.72, 0.947, 1.3], f: 32 },
  stN: { p: [1.695, 1.0, 1.4], l: [1.695, 0.947, 1.3], f: 30 }, stC: { p: [1.662, 0.99, 1.39], l: [1.675, 0.947, 1.3], f: 30 },
  stL: { p: [1.76, 1.13, 1.62], l: [1.76, 0.94, 1.3], f: 38 },
  gl0: { p: [2.2, 1.2, 1.9], l: [2.2, 1.05, 1.25], f: 34 }, gl1: { p: [2.32, 1.17, 1.82], l: [2.2, 1.04, 1.25], f: 32 }, glW: { p: [2.2, 1.0, 1.5], l: [2.2, 0.96, 1.25], f: 32 },
  pl0: { p: [2.47, 1.14, 1.72], l: [2.45, 0.95, 1.42], f: 32 }, hb0: { p: [2.62, 1.12, 1.5], l: [2.6, 0.97, 1.18], f: 32 },
  ja0: { p: [1.98, 1.2, 2.15], l: [1.98, 1.03, 1.52], f: 34 }, ja1: { p: [2.08, 1.15, 2.05], l: [1.98, 1.02, 1.52], f: 32 },
  cp0: { p: [1.0, 0.3, 2.8], l: [1.0, 0.18, 1.95], f: 34 }, cp1: { p: [1.02, 0.22, 2.55], l: [1.0, 0.16, 1.95], f: 30 }, cpT: { p: [1.0, 0.75, 2.4], l: [1.0, 0.28, 1.95], f: 34 },
  bg0: { p: [2.55, 1.22, 2.0], l: [2.55, 1.08, 1.25], f: 34 }, bg1: { p: [2.62, 1.17, 1.85], l: [2.55, 1.06, 1.25], f: 32 },
  ro0: { p: [-0.6, 1.35, 0.2], l: [-1.4, 1.0, -1.6], f: 38 }, ro1: { p: [-0.9, 1.2, -0.4], l: [-1.4, 1.05, -1.6], f: 34 },
  roB: { p: [-0.9, 0.85, -0.85], l: [-1.33, 0.66, -1.48], f: 34 }, roT: { p: [-1.0, 1.6, -0.9], l: [-1.38, 1.35, -1.55], f: 34 },
  pa0: { p: [0.6, 2.4, 4.4], l: [0.5, 1.0, -1.6], f: 44 }, pa1: { p: [0.9, 2.2, 3.6], l: [0.6, 1.0, -1.7], f: 42 },
  dr0: { p: [-3.6, 4.8, 5.2], l: [0, 0.6, -1.5], f: 46 }, dr1: { p: [2.6, 3.6, 4.6], l: [0.2, 0.7, -1.6], f: 44 }, up: { p: [0.5, 9, 7.5], l: [0.3, 0, -1], f: 50 },
  sh0: { p: [1.75, 1.55, -1.45], l: [1.7, 1.36, -3.0], f: 38 }, sh1: { p: [1.72, 1.5, -1.65], l: [1.7, 1.36, -3.0], f: 36 },
  be0: { p: [2.05, 1.5, -0.95], l: [2.2, 0.98, -2.25], f: 36 }, be1: { p: [2.1, 1.42, -1.2], l: [2.25, 0.98, -2.25], f: 34 }, beM: { p: [2.55, 1.22, -1.75], l: [2.62, 1.04, -2.15], f: 32 },
  bk0: { p: [1.42, 1.45, -1.85], l: [1.36, 0.94, -2.21], f: 34 }, bkP: { p: [1.356, 1.31, -2.1], l: [1.356, 0.975, -2.192], f: 40 }, bkQ: { p: [1.356, 1.27, -2.13], l: [1.4, 0.975, -2.17], f: 36 },
  al0: { p: [-1.9, 0.85, -1.7], l: [-2.4, 0.35, -2.85], f: 36 },
  wi0: { p: [2.4, 3.9, -2.4], l: [3.6, 2.0, -11.5], f: 38 }, wi1: { p: [2.6, 3.7, -3.6], l: [3.6, 2.0, -11.5], f: 36 },
  wiS: { p: [1.5, 0.75, -8.9], l: [2.2, 0.15, -10.6], f: 36 }, wiS2: { p: [1.9, 0.55, -9.3], l: [2.2, 0.3, -10.6], f: 34 },
  bu0: { p: [3.0, 1.5, -1.0], l: [4.0, 1.8, -3.1], f: 40 }, bu1: { p: [3.6, 1.7, -1.8], l: [4.0, 1.9, -3.1], f: 34 },
  rm0: { p: [2.6, 1.3, 0.6], l: [3.4, 0.6, -1.0], f: 40 }, rmB: { p: [2.9, 0.9, 0.0], l: [3.4, 0.45, -1.0], f: 36 }, rmT: { p: [2.95, 1.4, 0.0], l: [3.4, 0.9, -1.0], f: 36 },
};

// ---------- tomas ----------
export type Shot = { a: number; b: number; k: "W" | "C" | "P" | "F" | "A"; c0?: string; c1?: string; id?: string; ft?: number };
const W = (c0: string, c1 = c0) => ({ k: "W" as const, c0, c1 });
const C = (id: string) => ({ k: "C" as const, id });
const Ph = (id: string) => ({ k: "P" as const, id });
const F = (ft: number) => ({ k: "F" as const, ft });
type Part = [number | string | null, { k: Shot["k"]; c0?: string; c1?: string; id?: string; ft?: number }];

// las brechas entre ventanas del avatar (desde el final del minuto 1)
const WINS = AVWIN.filter(([, b]) => b > 101.3);
const GAPS: [number, number][] = WINS.map(([a], i) => [i === 0 ? 101.38 : WINS[i - 1][1], a]);
GAPS.push([WINS[WINS.length - 1][1], 991.2]);

// guion de tomas por brecha (la 1ª parte arranca en el inicio de la brecha; las demás en la frase dada)
const G: Part[][] = [
  /*  1 101-113 */[[null, W("ro1", "st0")], ["mira la rama de cerca", C("c_nudo")], ["un abultamiento", W("st1", "stN")]],
  /*  2 117-130 */[[null, W("stN", "st0")], ["si cortas la rama", W("st0", "stC")], ["ese pedazo de abajo", Ph("p_tocon")], ["se queda ahi", W("stC", "stN")]],
  /*  3 135-147 */[[null, C("c_corte")], ["si la tijera esta mocha", W("st0", "stC")], ["los conductos", W("stC", "stN")]],
  /*  4 150-160 */[[null, C("c_alcohol")], ["parece una exageracion", W("stC", "stC")]],
  /*  5 164-177 */[[null, W("stL", "st0")], ["mas larga se seca antes", Ph("p_larga_seca")], ["y ahora viene", W("st0", "stL")], ["las hojas a la rama", C("c_hojas")]],
  /*  6 182-193 */[[null, Ph("c_mitad")], ["por que porque", W("gl0", "gl1")]],
  /*  7 198-209 */[[null, W("gl1", "gl0")], ["aguanta semanas", Ph("p_semanas")], ["yo corto temprano", C("c_manana")]],
  /*  8 213-226 */[[null, W("ro0", "ro1")], ["llevo una bolsa", C("c_bolsa_trapo")], ["de la tijera al vaso", W("wt0", "gl0")]],
  /*  9 230-242 */[[null, W("sh0", "sh1")], ["si cortas uno solo", Ph("p_uno_solo")], ["ahora si lo que le echas", W("be0", "be1")]],
  /* 10 247-260 */[[null, Ph("p_canela_frasco")], ["lo que hace la canela", W("stC", "stC")], ["pones una cucharadita", C("c_canela_plato")]],
  /* 11 265-276 */[[null, C("c_canela_dip")], ["como polvo en un mueble", W("pl0", "pl0")], ["y enseguida lo plantas", W("cpT", "cp0")]],
  /* 12 281-291 */[[null, W("be1", "beM")], ["la miel de abeja", Ph("p_miel_frasco")], ["la miel es como una curita", W("stC", "stC")]],
  /* 13 295-307 */[[null, W("stC", "stN")], ["mojas un centimetro en la miel", C("c_miel")]],
  /* 14 313-325 */[[null, W("hb0", "cpT")], ["la tercera cosa es la sabila", W("al0", "al0")], ["la que seguro tienes", Ph("p_sabila_maceta")], ["cortas una penca", C("c_sabila_corta")]],
  /* 15 329-339 */[[null, C("c_sabila_gel")], ["ese gel lo machacas", W("ja0", "ja1")]],
  /* 16 343-355 */[[null, C("c_sabila_cuela")], ["en esa agua dejas", W("ja1", "ja0")]],
  /* 17 362-373 */[[null, W("wi0", "wi1")], ["tiene adentro de sus ramas", W("wiS", "wiS2")], ["sustancias que le ayudan", Ph("p_sauce_rio")]],
  /* 18 378-389 */[[null, W("wiS2", "wiS")], ["cortas unas 10 ramitas", W("wi1", "wi0")], ["las cortas en pedacitos", C("c_sauce_trozos")]],
  /* 19 394-408 */[[null, C("c_sauce_frasco")], ["al otro dia", C("c_sauce_cuela")], ["le dejas la base", W("ja0", "ja1")], ["despues de plantarlo", W("cpT", "cp0")]],
  /* 20 413-423 */[[null, W("ja1", "ja0")], ["si dejas el esqueje al sol", W("cp0", "cp1")]],
  /* 21 427-440 */[[null, Ph("p_seca_tierra")], ["y aqui esta la pregunta", W("wt0", "wt1")], ["ves las raices", C("c_agua_raices")]],
  /* 22 445-457 */[[null, W("glW", "gl0")], ["y le cambias el agua", Ph("c_agua_cambia")], ["y hay plantas de tallo duro", W("roT", "ro1")]],
  /* 23 463-474 */[[null, W("ja0", "cp0")], ["si las dejas semanas", F(27.5)]],
  /* 24 478-491 */[[null, C("c_dos")], ["el que prende", W("wt1", "wt0")]],
  /* 25 497-508 */[[null, W("ro0", "ro1")], ["una rama con flor", W("st0", "st1")]],
  /* 26 513-524 */[[null, C("c_rosa_flor")], ["del grosor de un lapiz", W("stL", "st0")], ["corte en diagonal", W("stC", "stN")]],
  /* 27 531-542 */[[null, W("ja1", "pl0")], ["y la entierras bien hondo", C("c_rosa_entierra")], ["las dos terceras partes", W("cp0", "cp1")]],
  /* 28 547-557 */[[null, W("cp1", "cp0")], ["juntas en la misma maceta", C("c_rosa_tres")]],
  /* 29 561-574 */[[null, W("ro1", "ro1")], ["muchas rosas del vivero", Ph("p_vivero")], ["abajo cerca de la tierra", W("ro1", "roB")], ["una especie de bola", C("c_injerto")], ["si cortas una rama que sale", W("roB", "roB")]],
  /* 30 579-591 */[[null, W("roT", "ro0")], ["como el de la vecina", Ph("p_rosal_vecina")], ["la rosa tarda", W("cp0", "cp1")]],
  /* 31 597-608 */[[null, W("bk0", "bkP")]],
  /* 32 612-624 */[[null, W("bkQ", "bkQ")], ["y haz la cuenta conmigo", W("bkQ", "bk0")]],
  /* 33 629-640 */[[null, W("dr0", "dr1")], ["el link en la primera", W("pa0", "pa1")], ["ahora la bugambilia", W("bu0", "bu1")]],
  /* 34 644-656 */[[null, W("st0", "stL")], ["la doblas un poquito", C("c_buga_chasquido")]],
  /* 35 661-673 */[[null, W("stL", "st0")], ["la epoca", W("bu1", "bu0")]],
  /* 36 677-688 */[[null, W("gl0", "pl0")], ["la dejas secar", Ph("c_buga_seca")]],
  /* 37 693-707 */[[null, C("c_buga_arena")], ["en arena el agua baja", W("cp0", "cp1")], ["y riega solamente", C("c_buga_dedo")]],
  /* 38 713-724 */[[null, W("rm0", "rm0")], ["compraste un manojo", Ph("p_romero_mercado")], ["que ya esta gris", W("rm0", "rmB")]],
  /* 39 729-739 */[[null, W("rmB", "rmT")], ["del romero se cortan las puntas", C("c_rom_puntas")]],
  /* 40 743-757 */[[null, C("c_rom_deshoja")], ["le dejas 3 pares", W("stL", "st0")], ["y lo entierras 4", W("cp0", "cp1")]],
  /* 41 760-772 */[[null, W("cp1", "cp0")], ["le pellizcas la punta", Ph("c_rom_pellizca")], ["asi la mata se abre", W("rmT", "rm0")]],
  /* 42 776-788 */[[null, W("bg0", "bg1")], ["agua por las hojas mas rapido", Ph("p_hojas_mustias")], ["asi que le haces un invernadero", W("bg0", "bg1")]],
  /* 43 793-805 */[[null, C("c_bolsa_palito")], ["adentro se hace una nubecita", W("bg1", "bg0")]],
  /* 44 810-822 */[[null, Ph("c_botella")], ["pero cuidado", W("bg0", "bg1")]],
  /* 45 828-842 */[[null, C("c_agujeros")], ["el dia que pasan a tierra", W("gl0", "glW")], ["espera a que las raices", C("c_pasar_raices")]],
  /* 46 847-857 */[[null, W("cpT", "cp0")], ["aprietas un puno", Ph("c_puno")], ["haces un hoyo con el dedo", C("c_pasar_planta")]],
  /* 47 862-871 */[[null, Ph("p_nublado")], ["es delicada", W("cp0", "cp1")], ["y ahora lo que te prometi", W("sh0", "sh1")]],
  /* 48 875-887 */[[null, W("bg0", "bg1")], ["se llena de hongo", C("c_moho_bolsa")]],
  /* 49 891-902 */[[null, C("c_abrir")], ["y si adentro ves gotas", W("bg1", "bg0")]],
  /* 50 906-918 */[[null, W("cp1", "cp0")], ["tiras de la rama", C("c_tirar")], ["y si te sale una hoja", C("c_hoja")]],
  /* 51 923-935 */[[null, W("glW", "gl0")], ["repasemos rapido", W("stL", "stC")]],
  /* 52 940-950 */[[null, W("ro1", "ro0")], ["canela para frenar", W("be0", "be1")]],
  /* 53 954-967 */[[null, W("ja0", "cp0")], ["bolsa con agujeritos", W("bg0", "bg1")], ["y paciencia hasta", W("cp0", "cp1")], ["y mira la proxima vez", W("pa1", "ro0")]],
  /* 54 972-983 */[[null, Ph("p_tres_ramas")], ["que en dos meses", C("c_vecina")], ["ese rosal nuevo", W("ro1", "ro0")]],
  /* 55 989-991 */[[null, W("pa0", "up")]],
];

export const SHOTS: Shot[] = [];
GAPS.forEach(([ga, gb], gi) => {
  const parts = G[gi] ?? [[null, W("pa0", "pa1")]];
  const starts = parts.map(([ph], k) => (k === 0 || ph === null ? ga : typeof ph === "number" ? ph : at(ph as string, ga - 0.5)));
  // ≥25 % de metraje REAL: cada toma LTX (8 s) se queda en pantalla hasta ~7,4 s, corriendo la parte siguiente
  // (que sigue empezando dentro de su tramo y nunca queda de menos de 2,4 s)
  for (let k = 0; k < parts.length - 1; k++) if (parts[k][1].k === "C") {
    const end = k + 2 < parts.length ? starts[k + 2] : gb;
    starts[k + 1] = Math.max(starts[k + 1], Math.min(starts[k] + 7.4, end - 2.4));
  }
  parts.forEach(([, sp], k) => SHOTS.push({ a: starts[k], b: k < parts.length - 1 ? starts[k + 1] : gb, ...sp }));
  if (gi < WINS.length) SHOTS.push({ a: gb, b: WINS[gi][1], k: "A" });
});
export const REST0 = 101.38, REST1 = 991.2;

// cámara del mundo: cada toma "W" = pose c0 → c1 (cortes entre tomas: la cámara salta mientras se ve otra cosa)
// si la toma anterior también es del mundo (o es la 1ª, que sale del minuto 1) NO hay corte: la cámara VUELA de una pose a la otra
// (0,9 s con blur de movimiento) → un solo plano continuo por el patio.
export const FLY = 0.9;
export const KEYS2 = SHOTS.flatMap((x, i) => {
  if (x.k !== "W") return [];
  const A = PO[x.c0!], B = PO[x.c1!];
  if (!A || !B) throw new Error("pose " + x.c0 + "/" + x.c1);
  const fly = i === 0 || SHOTS[i - 1].k === "W";
  const ta = fly ? x.a + Math.min(FLY, (x.b - x.a) * 0.4) : x.a + 0.001;
  return [{ t: ta, p: A.p, l: A.l, fov: A.f }, { t: x.b, p: B.p, l: B.l, fov: B.f }];
});

// ---------- eventos del mundo (segundos globales) ----------
export const T = {
  nodo: at("un abultamiento"), bolita: at("una bolita chiquita"),
  raizNudo: at("porque la raiz sale del nudo"), cinco: at("si cortas la rama a 5"), ablanda: at("se ablanda"),
  cortar: at("un solo tajo"), conductos: at("los conductos"), herida: at("lo metes justo en la herida"),
  canilla: at("pero las hojas la siguen"), dosHojas: at("con dos hojas cortadas"),
  diez: at("de cada diez esquejes bien"), canela: at("lo que hace la canela es frenar"), plato: at("pones una cucharadita"),
  plantaCan: at("y enseguida lo plantas"), miel: at("la segunda cosa"), curita: at("la miel es como una curita"),
  llorar: at("la base empieza a llorar"), mielMucha: at("y aqui esta el error mucha miel"), poquita: at("poquita y la plantas"),
  gel: at("ese gel lo machacas"), remojo: at("en esa agua dejas la rama"),
  palo: at("un palo de sauce"), pasarAgua: at("esas sustancias se pueden pasar"), frascoS: at("al otro dia cuelas"), riegaS: at("lo riegas con esa misma agua"),
  sol: at("si dejas el esqueje al sol"), charco: at("la tierra echa un charco"),
  aguaTierra: at("en agua o en tierra"), pothos: at("esas si van en el vaso"), terminan: at("pero la raiz la terminan en tierra"),
  dos: at("dos esquejes de la misma"), prende: at("el que prende te dice"),
  flor: at("una rama con flor esta gastando"), cortaR: at("corte en diagonal debajo del nudo", 500),
  remojaR: at("despues la remojas en el agua de sauce"), canelaR: at("y la pasas por canela y la entierras"), hondo: at("las dos terceras partes"),
  arena: at("en una maceta de 12"), tres: at("pon tres o cuatro ramas"), injerto: at("vienen injertadas"), bola: at("una especie de bola"), debajo: at("si cortas una rama que sale"),
  semanas8: at("la rosa tarda de 6 a 8"),
  pag30: at("en la pagina 30"), cuenta: at("y haz la cuenta conmigo"), masPlantas: at("cada rama es una planta mas"),
  bugaVerde: at("y la rama vieja"), semi: at("semilenosa"), dobla: at("la doblas un poquito"), primavera: at("al principio de la primavera"),
  remojaB: at("la base la remojas 10 minutos"), canelaB: at("la pasas por canela y la dejas secar"), arenaB: at("en arena el agua baja"), entierraB: at("la entierras unos 10"),
  romBase: at("gris y lenosa abajo"), puntas: at("del romero se cortan las puntas"), deshoja: at("le dejas 3 pares"), romEnt: at("y lo entierras 4"), romRaiz: at("de 3 a 6 semanas"), abre: at("asi la mata se abre"),
  bolsa: at("la bolsa una rama sin raiz"), invernadero: at("le haces un invernadero"), nube: at("adentro se hace una nubecita"), horno: at("es un horno"), cocina: at("te cocina las hojas"),
  raices25: at("espera a que las raices midan"), pasaT: at("aprietas un puno"), quema: at("el primer sol fuerte la quema"),
  cierra: at("cerrar la bolsa y no abrirla"), hongoB: at("se llena de hongo"), abreB: at("la bolsa se abre una hora"), gotas: at("y si adentro ves gotas"),
  porDebajo: at("rosa estaba echando raiz por debajo"), sucia: at("cambiale el agua cada"), negra: at("quita cualquier hoja que se ponga negra"), sopa: at("es una sopa de hongos"),
  repaso: at("repasemos rapido"), florea: at("ese rosal nuevo se llene de flores"), devuelves: at("que en dos meses"),
};
export { at, fin };
