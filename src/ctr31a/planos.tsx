// ctr31a · LAS PIEZAS ancladas a la voz. Cada una: id · tramo [a, b] (lo que cae dentro de una ventana del avatar lo recorta
// Body y la pieza sigue al salir) · n(t). Los momentos internos (m) salen todos de at("frase") — ningún segundo a mano.
import React from "react";
import { at } from "./base";
import { Thumb0, CasaArma, Kit, FrascoHero, Dial, LibroCTA, Recorrido, CanoTermo } from "./comps1";
import { Ladrillo, Coladera, Enjuague, Minuto, Espuma, MediaTaza, Chispas, Cuchara, Palanca, Rebosadero, Libreta, Errores, Rejilla } from "./comps2";
import { Banera, Sello, Sifon, Recibo, Manometro, Inodoro, CajaViejo, Espejo, DosDias, Bucle, Edificio, Destapadores, Puerta } from "./comps3";
import { Sonda, Llamar, Comentarios, CanoEscala, GolpeCasa, Heladera, Repaso, Cierre } from "./comps4";
import VEO from "./veo.json";

export type FX = { id: string; a: number; b: number; n: (t: number) => React.ReactNode; top?: boolean };
const V = VEO as { id: string; t: number; sec: string }[];
const clipsDe = (sec: string) => V.filter((v) => v.sec === sec).map((v) => v.id);
const f = (id: string, a: number, b: number, n: (t: number, a: number, b: number) => React.ReactNode, top = false): FX => ({ id, a, b, n: (t) => n(t, a, b), top });

const T_NINGUN = at("Ningún caño se tapa");
const ONEB = clipsDe("ONE_B");

// Tope del EVALUADOR (VARA_COMUN 29-oct): tras la ronda 4, lo que quedó <6 se reemplaza por clips Veo (no se rediseña más).
// Sus tramos quedan libres y la línea de tiempo los llena con los clips anclados a esa frase.
export const REEMPLAZADOS = new Set(["kit", "ladrillo", "coladera", "espuma", "media_taza", "cuchara", "palanca", "rebosadero", "libreta", "banera", "recibo", "bucle", "edificio", "destapadores", "llamar"]);
const FX_TODOS: FX[] = [
  // 0:00 cuadro 0 = la miniatura sin texto; la cámara entra en ella y abre el avatar
  f("thumb0", 0, 0.9, (t, a, b) => <Thumb0 t={t} b={b} />, true),
  // 0:20 la casa de cristal se arma (wow «Ningún caño se tapa»)
  f("casa_arma", T_NINGUN, at("muestro desagüe por desagüe") + 2.6, (t, a, b) => <CasaArma t={t} a={a} b={b} m={{ poquito: at("Se tapa un poquito"), hoy: at("muestro desagüe por desagüe") }} />),
  // 1:12 el kit sobre el trapo
  f("kit", at("Casi todo lo que vamos a usar"), at("y un trapo", 70, true) + 0.9, (t, a, b) => <Kit t={t} a={a} b={b} m={{ agua: at("Agua caliente de la llave", 70), det: at("detergente de platos", 70), balde: at("un balde, una linterna", 70), lint: at("una linterna y un trapo", 70), trapo: at("y un trapo", 70) }} />),
  // 1:44 el frasco marrón (agua oxigenada 3 %)
  f("frasco", at("de farmacia, la común al 3%") - 0.3, at("Y otra cosa que me escribieron") - 0.2, (t, a, b) => <FrascoHero t={t} a={a} b={b} m={{ tres: at("la común al 3%"), botella: at("la de la botella marrón", 100), ahora: at("A partir de ahora") }} />),
  // 2:37 el dial del agua: 4 avisos
  f("dial", at("Hay cuatro avisos"), at("Eso ya no es tu desagüe") - 0.1, (t, a, b) => <Dial t={t} a={a} b={b} m={[at("Uno, el agua baja lenta"), at("El agua hace gárgaras, glu glu"), at("El agua no baja nada"), at("Usas un desagüe y el agua sube")]} clips={[ONEB[0], ONEB[1], ONEB[2], ONEB[3]]} />),
  // 3:45 CTA1: el libro sale del mueble y se abre en la p7; QR
  f("cta1", at("lo escribí en un solo libro") - 0.2, at("está en la primera línea de la descripción", 240, true) + 0.8, (t, a, b) => <LibroCTA t={t} a={a} b={b} m={{ abre: at("94 arreglos de la casa"), p7: at("la tabla de nunca mezclar"), qr: at("por menos de lo que cuesta") }} />),
  // 4:22 el recorrido de la casa
  f("recorrido", at("de cada uno a todo lo que da"), at("ese papel te va a decir en qué orden", 290, true) + 0.4, (t, a, b) => <Recorrido t={t} a={a} b={b} m={[["kitchen", at("El fregadero,", 260)], ["basin", at("el lavamanos, la ducha, la bañera, la rejilla del lavadero")], ["shower", at("la ducha, la bañera, la rejilla del lavadero")], ["tub", at("la bañera, la rejilla del lavadero")], ["laundry", at("la rejilla del lavadero")], ["toilet", at("tiras la cadena del inodoro")]]} />),
  // 5:12 el caño-termómetro (wow «Se pone blanco»)
  f("cano_termo", at("y abrir la llave. Y como baja"), at("es igual de pesado", 330, true) + 0.4, (t, a, b) => <CanoTermo t={t} a={a} b={b} m={{ frio: at("El aceite caliente baja líquido"), blanco: at("Se pone blanco"), pega: at("Se pega en la pared del caño"), atun: at("el aceite de la lata de atún") }} />),
  // 6:40 una cucharada por día = un ladrillo por año
  f("ladrillo", at("El café no se disuelve", 390), at("tu dedo pulgar", 410, true) + 0.6, (t, a, b) => <Ladrillo t={t} a={a} b={b} m={{ cuch: at("una cucharada de borra", 400), ladrillo: at("un ladrillo por año", 400), cuenta: at("Haz la cuenta", 400), pulgar: at("tu dedo pulgar", 410) }} />),
  // 7:00 la coladera de malla y el edificio de 12 pisos
  f("coladera", at("Una coladera de malla fina", 418), at("pélalas sobre una hoja", 450) - 0.2, (t, a, b) => <Coladera t={t} a={a} b={b} m={{ malla: at("de malla fina", 418), plastico: at("la de plástico con agujeros grandes", 418), edificio: at("En un edificio de 12 pisos", 430), mitad: at("a la mitad", 445) }} />),
  // 7:50 el último enjuague frío / la tetera
  f("enjuague", at("El último enjuague", 469), at("cosas están mal", 495, true) + 0.6, (t, a, b) => <Enjuague t={t} a={a} b={b} m={{ frio: at("con agua fría y ahí", 470), tetera: at("Hierve una tetera", 490), mal: at("cosas están mal", 495) }} />),
  // 8:25 un minuto de agua caliente / el hervor ablanda el PVC
  f("minuto", at("Cuando terminas de lavar", 503), at("ya alcanza", 538, true) + 0.6, (t, a, b) => <Minuto t={t} a={a} b={b} m={{ minuto: at("dejas correr el agua caliente un minuto", 505), hirv: at("Pero agua hirviendo, nunca", 520), ablanda: at("se ablanda en las uniones", 525), meses: at("Se nota los meses", 530), mano: at("Con que la sientas bien caliente", 535) }} />),
  // 9:05 el show del bicarbonato con vinagre
  f("espuma", at("Echas bicarbonato", 550), at("Tienen razón", 570, true) + 0.5, (t, a, b) => <Espuma t={t} a={a} b={b} m={{ show: at("Es un show", 555), sal: at("agua con un poco de sal", 560), nada: at("no le hace nada", 565) }} />),
  // 9:38 media taza sin vinagre, una vez por mes
  f("media_taza", at("Media taza de bicarbonato", 577), at("el del final", 600, true) + 0.6, (t, a, b) => <MediaTaza t={t} a={a} b={b} m={{ caliente: at("enseguida agua caliente", 580), mes: at("Una vez por mes", 590), guarda: at("guárdate esa media taza", 594) }} />),
  // 10:28 la botella marrón sobre la baba (página 6)
  f("chispas", at("Dejas correr el agua fría un momento", 630), at("ya es agua y compras otro", 660, true) + 0.6, (t, a, b) => <Chispas t={t} a={a} b={b} m={{ media: at("echas media taza directo", 635), diez: at("minutos sin abrir la llave", 638) - 0.4, chis: at("Vas a escuchar un chisporroteo", 640), cal: at("Después, agua caliente de la llave", 648), p6: at("en la página 6", 652), espuma: at("Si hace espuma, sirve", 658) }} />),
  // 11:24 la cuchara del 2003
  f("cuchara", at("y adentro había una cuchara", 682), at("agua caliente y", 694, true) + 0.4, (t, a, b) => <Cuchara t={t} a={a} b={b} m={{ cuch: at("una cuchara de té envuelta", 682), dedo: at("del grosor de un dedo", 686), saca: at("La sacamos", 690) }} />),
  // 12:24 el tapón del lavamanos en despiece
  f("palanca", at("Primero sacas el tapón", 743), at("frotas y enjuagas", 793, true) + 0.6, (t, a, b) => <Palanca t={t} a={a} b={b} m={{ tuerca: at("hay una tuerca chiquita", 748), varilla: at("sacas la varilla", 754), sale: at("el tapón sale por arriba", 755), trenza: at("la trenza de pelo pegada", 765), tira: at("una tira dentada de plástico", 772), rosado: at("si ves un anillo rosado", 785) }} />),
  // 13:17 el canal oculto del rebosadero (página 22)
  f("rebosadero", at("el rebozadero", 800), at("Está en la página 22", 845) + 4.4, (t, a, b) => <Rebosadero t={t} a={a} b={b} m={{ agujero: at("Ahí entra agua", 804), tubo: at("Es un tubo oscuro", 808), linterna: at("Le alumbras adentro", 824), pico: at("Con una botella con pico", 828), p22: at("Está en la página 22", 845) }} />),
  // 14:14 la libreta del viejo (wow «ducha»)
  f("libreta", at("El viejo plomero tenía una libreta", 853), at("Así que vamos", 868) + 1.8, (t, a, b) => <Libreta t={t} a={a} b={b} m={{ hered: at("Yo me la heredé", 860), palabra: at("la palabra que más se repite", 862), ducha: at("es ducha", 866), vamos: at("Así que vamos", 868) }} />),
  // 14:38 los 5 errores
  f("errores", at("déjame contarte los 5 errores", 876), at("pero desde hoy ya no", 920, true) + 0.7, (t, a, b) => <Errores t={t} a={a} b={b} m={{ e: [at("esperar a que se tape del todo", 884), at("El segundo, echar un destapador", 890), at("El tercero, meter un alambre", 896), at("El cuarto, ajustar las tuercas", 904), at("Y el quinto, tapar el olor", 909)], hoy: at("pero desde hoy ya no", 920) }} />),
  // 15:27 la rejilla de la ducha (página 27)
  f("rejilla", at("Aquí está, la rejilla", 930), at("te olvidas", 1006, true) + 0.4, (t, a, b) => <Rejilla t={t} a={a} b={b} m={{ debajo: at("está debajo de la rejilla", 945), levanta: at("Te pones guantes y la levantas", 952), sorpresa: at("una trenza de pelo y jabón gris", 964), tira: at("tiras despacio", 975), crece: at("Esa trenza crece unos centímetros", 978), rosado: at("Y el anillo rosado", 985), p27: at("como lo puse en la página 27", 993), mallita: at("una rejillita de malla fina", 1000) }} />),
  // 17:16 la bañera: el mecanismo lleno de pelo y la prueba (4 min → 40 s)
  f("banera", at("La desatornillas y sale el mecanismo", 1044), at("tarda 40 segundos", 1068, true) + 0.6, (t, a, b) => <Banera t={t} a={a} b={b} m={{ mec: at("sale el mecanismo", 1045), prueba: at("Y después la prueba", 1053), menos: at("en menos de un minuto", 1064), cuarenta: at("tarda 40 segundos", 1068) }} />),
  // 18:15 el sello de agua de la curva y la cucharada de aceite (página 21)
  f("sello", at("Cada desagüe tiene en su curva", 1090), at("sin romper nada", 1140, true) + 0.4, (t, a, b) => <Sello t={t} a={a} b={b} m={{ tapon: at("que hace de tapón contra el olor", 1095), evap: at("esa agua se evapora", 1100), semana: at("un minuto por semana", 1106), p21: at("en la página 21", 1110), aceite: at("echas una cucharada de aceite", 1124) }} />),
  // 19:20 el sifón en despiece y lo que apareció en 30 años
  f("sifon", at("hace una curva como", 1160), at("lo busco tres meses", 1245, true) + 0.6, (t, a, b) => <Sifon t={t} a={a} b={b} m={{ mano: at("aflojas las dos tuercas", 1194), vacia: at("la vacías en el balde", 1198), gomita: at("cada tuerca tiene una gomita", 1208), seis: at("una vez cada seis meses", 1220), acordeon: at("el sifón de acordeón", 1224), hallazgo: [at("anillos", 1238), at("dientes de tenedor", 1238), at("tapitas de botella", 1241), at("el control", 1244)] }} />),
  // 20:56 las cuentas: el ticket del plomero contra el de hoy
  f("recibo", at("Un plomero solo por venir", 1255), at("con un balde y 10 minutos", 1280, true) + 0.6, (t, a, b) => <Recibo t={t} a={a} b={b} m={{ plomero: at("Un plomero solo por venir", 1255), hoy: at("hoy cuesta lo que vale", 1268), balde: at("con un balde y 10 minutos", 1280) }} />),
  // 21:44 la sopapa: empuja agua, no aire
  f("manometro", at("La sopapa no empuja aire", 1303), at("salpicar en la cara", 1356, true) + 0.5, (t, a, b) => <Manometro t={t} a={a} b={b} m={{ agua: at("La sopapa no empuja aire", 1303), bien: at("Así se usa bien", 1311), veces: at("y empujas y tiras derecho", 1328), remolino: at("haciendo remolino, ganaste", 1340), quimico: at("un destapador químico, ese día", 1353) }} />),
  // 22:53 el inodoro en orden: llave, detergente, la de pollera, el balde
  f("inodoro", at("Cierras la llave de paso del tanque", 1372), at("la altura de tu cintura", 1417, true) + 0.6, (t, a, b) => <Inodoro t={t} a={a} b={b} m={{ llave: at("Cierras la llave de paso del tanque", 1372), uno: at("Primero un chorro generoso", 1380), dos: at("Segundo, la sopapa", 1394), pollera: at("la de pollera", 1400), tres: at("Y tercero", 1410) }} />),
  // 23:50 la caja del viejo: un cajón por cada «nunca»
  f("caja_viejo", at("lo que el viejo nunca hacía", 1430), at("un plomero que no explica vuelve", 1468, true) + 0.6, (t, a, b) => <CajaViejo t={t} a={a} b={b} m={{ n: [at("Nunca echaba nada", 1436), at("Nunca forzaba una tuerca", 1443), at("Nunca dejaba un sifón", 1451), at("Nunca le prometía", 1456), at("Y nunca, nunca", 1464)], vuelve: at("un plomero que no explica vuelve", 1468) }} />),
  // 24:50 el espejo bajo el borde (página 16)
  f("espejo", at("Debajo del borde de la taza", 1489), at("con las cantidades exactas", 1508, true) + 0.4, (t, a, b) => <Espejo t={t} a={a} b={b} m={{ fila: at("hay una fila", 1492), chorro: at("un agujero más grande", 1498), sarro: at("llenan de sarro", 1502), p16: at("en la página 16", 1507) }} />),
  // 25:15 los dos días y el nivel del tanque
  f("dos_dias", at("lo haces en dos días", 1510), at("del tubo de rebalse", 1562, true) + 0.6, (t, a, b) => <DosDias t={t} a={a} b={b} m={{ d1: at("Día 1", 1512), d2: at("Día 2", 1527), noche: at("Toda la noche", 1539), palito: at("con un palito plástico", 1543), nivel: at("mira el nivel del", 1557) }} />),
  // 26:22 el bucle alto de la lavadora, en la casa
  f("bucle", at("el bucle alto", 1589), at("no hasta el fondo", 1612, true) + 0.4, (t, a, b) => <Bucle t={t} a={a} b={b} m={{ alto: at("el bucle alto", 1589), vuelve: at("el agua sucia del caño puede volver", 1595), precinto: at("levantas la manguera", 1603), dedos: at("apenas unos dedos", 1609) }} />),
  // 27:36 el edificio en corte: la bajante y lo de Elena
  f("edificio", at("desaguan en un mismo caño vertical", 1658), at("por la pared", 1705, true) + 0.4, (t, a, b) => <Edificio t={t} a={a} b={b} m={{ bajante: at("la bajante", 1661), tapa: at("tapa más abajo de tu piso", 1663), tuyo: at("el primer desagüe que encuentra", 1668), ati: at("te toca a ti", 1678), edif: at("La bajante es", 1679), escrito: at("pídelo por escrito", 1690) }} />),
  // 28:41 dos destapadores, nunca juntos
  f("destapadores", at("compró otro de otra marca", 1721), at("ellos y salpicar", 1732, true) + 0.4, (t, a, b) => <Destapadores t={t} a={a} b={b} m={{ otro: at("compró otro de otra marca", 1721), nunca: at("destapadores distintos, nunca juntos", 1729) }} />),
  // 29:18 CTA2: la tabla de nunca mezclar pegada dentro de la puerta del mueble (p7)
  f("puerta", at("en la tabla de nunca mezclar", 1757), at("llamas a emergencias de tu país", 1772, true) + 0.6, (t, a, b) => <Puerta t={t} a={a} b={b} m={{ p7: at("en la tabla de nunca mezclar", 1757), puerta: at("pegar por dentro de la puerta", 1762), qr: at("que es justo donde tienes", 1766) }} />),
  // 30:04 la sonda por el caño de la pared
  f("sonda", at("Ahí entra la sonda", 1802), at("porque sale sucia", 1836, true) + 0.6, (t, a, b) => <Sonda t={t} a={a} b={b} m={{ resorte: at("Es un resorte de metal", 1810), pared: at("la metes directo por el caño de la pared", 1819), gira: at("giras la manivela", 1821), frena: at("Cuando sientes que se frena", 1829), saca: at("Después la sacas", 1836) }} />),
  // 30:45 cuándo llamar (página 55)
  f("llamar", at("cuándo llamar", 1844), at("te doy la razón al plomero", 1874, true) + 0.5, (t, a, b) => <Llamar t={t} a={a} b={b} m={{ s: [at("Si se tapan dos desagües", 1846), at("Si sube el agua al usar la lavadora", 1850), at("si la sonda se frena siempre", 1854), at("si el inodoro se mueve", 1855)], maquina: at("plomero con máquina", 1865), p55: at("en la página 55", 1870) }} />),
  // 31:19 los comentarios, cada uno atado a su número
  f("comentarios", at("te contesto algunas preguntas", 1879), at("desde dónde me ven", 1933, true) + 0.4, (t, a, b) => <Comentarios t={t} a={a} b={b} m={{ q: [at("tengo 68", 1886), at("ni aceite ni restos", 1897), at("si el vinagre blanco", 1910), at("Se puede hacer como prevención", 1922)], r: [at("el número 4", 1893), at("Empieza por el número 12", 1909), at("cualquiera de los dos sirve", 1916), at("es justamente el truco del viejo", 1927)], pais: at("ponme de qué país eres", 1931) }} />),
  // 32:51 el caño a escala: hilito contra tarja llena
  f("cano_escala", at("el agua baja como un hilito", 1971), at("se limpia con peso", 2004, true) + 0.5, (t, a, b) => <CanoEscala t={t} a={a} b={b} m={{ hilito: at("el agua baja como un hilito", 1971), arriba: at("es justo donde se pega la grasa", 1979), tarja: at("cuando sueltas toda una tarja", 1980), arrastra: at("y arrastra la capa", 1992), olla: at("la diferencia entre mojar una olla", 1996), peso: at("se limpia con peso", 2004) }} />),
  // 33:27 el golpe de agua en toda la casa (página 53)
  f("golpe_casa", at("Y ahora para toda la casa", 2007), at("empiezas por los que tardaban", 2043, true) + 0.5, (t, a, b) => <GolpeCasa t={t} a={a} b={b} m={[["basin", 1, at("El lavamanos. Lo tapas", 2008)], ["tub", 5, at("La bañera. la llenas", 2017)], ["shower", 2, at("La ducha, que no tiene tapón", 2021)], ["toilet", 3, at("inodoro, la media taza", 2030)]]} p53={at("en la página 53", 2035)} />),
  // 34:05 la rutina en la heladera
  f("heladera", at("Te dejo la rutina", 2045), at("es costumbre", 2083, true) + 0.6, (t, a, b) => <Heladera t={t} a={a} b={b} m={{ semana: at("Una vez por semana, el golpe de agua", 2049), mes: at("Una vez por mes antes", 2055), seis: at("Y cada seis meses", 2069), anos: at("En 30 años no vi", 2081), costumbre: at("No es magia", 2083) }} />),
  // 34:46 el repaso de los 20 con la casa girando
  f("repaso", at("Te lo repito rápido", 2086), at("en toda la casa", 2150, true) + 0.6, (t, a, b) => <Repaso t={t} a={a} b={b} m={[at("Escucha cómo baja", 2088), at("El aceite al frasco", 2091), at("Coladera de malla", 2093), at("El último enjuague con agua caliente", 2095), at("El bicarbonato con vinagre no destapa", 2100), at("El olor con media taza", 2104), at("tapón de lavamanos afuera", 2102), at("El agujerito de arriba", 2110), at("Debajo de la rejilla de la ducha", 2107), at("La cruz de la bañera", 2115), at("Agua una vez por semana en el desagüe", 2112), at("El sifón cada seis meses", 2121), at("La sopapa con agua", 2125), at("El inodoro con detergente", 2123), at("agujeritos del borde en dos días", 2132), at("El bucle alto de la lavadora", 2135), at("Lavajantes del edificio", 2139), at("Nunca dos destapadores", 2143), at("Saber cuándo llamar", 2147), at("El golpe de agua una vez por semana en toda", 2149)]} />),
  // 36:04 CTA3: el libro otra vez, en la rutina de la semana (p53), y el QR
  f("cta3", at("Los 20 con las medidas", 2163), at("primera línea de la descripción", 2172, true) + 0.8, (t, a, b) => <LibroCTA t={t} a={a} b={b} page="p53" m={{ abre: at("los 94 arreglos", 2168), p7: at("con la botella marrón", 2169), qr: at("el frasco marrón de Claudio", 2172) }} />),
  // 36:27 el cierre: 52 semanas que se llenan
  f("cierre", at("Un desagüe no se tapa en un día", 2186), at("Nos vemos en el próximo", 2192, true) + 1.0, (t, a, b) => <Cierre t={t} a={a} b={b} m={{ ano: at("se tapa en un año", 2188), minuto: at("se cuida en un minuto", 2190), vemos: at("Nos vemos", 2192) }} />),
];
export const FXS: FX[] = FX_TODOS.filter((x) => !REEMPLAZADOS.has(x.id));
