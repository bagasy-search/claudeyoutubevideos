// gen_vucm3bvd869j.mjs — DIRECTOR + montaje: convierte las captions de Whisper en
// src/VideoEdit/cues_vucm3bvd869j.gen.tsx (la fuente de verdad que lee el render).
//
// Reglas del canal aplicadas acá:
//  · avatar FULL o visual FULL, nunca PiP/split → los cues tapan la pantalla, los huecos son avatar
//  · el video ABRE con avatar full (primer cue recién a los ~3.6s)
//  · cada corte cae en un LÍMITE DE FRASE de Whisper (sync milimétrico)
//  · ningún clip ni imagen se repite (pool global de una sola pasada)
//  · componentes del kit anclados al ms de la frase exacta que los nombra
import fs from "fs";

const SLUG = "vucm3bvd869j";
const FPS = 30;
const W = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));

/* ─────────────────────────── frases (sync milimétrico) ─────────────────── */
const SENTS = [];
{
  // un "beat" = trozo hablado de ~3s que termina en palabra (y de ser posible en puntuación).
  // Las frases de Whisper van de 0.5s a 10s: usarlas crudas daba tomas de 5s (el canal pide ~3s).
  const MINB = 2.2, MAXB = 3.6;
  let cur = null;
  for (const w of W) {
    if (!cur) cur = { s: w.startMs / 1000, e: w.endMs / 1000, txt: "" };
    cur.txt += w.text;
    cur.e = w.endMs / 1000;
    const len = cur.e - cur.s;
    const punct = /[.?!:;,]["»]?$/.test(w.text.trim());
    if ((len >= MINB && punct) || len >= MAXB) { SENTS.push(cur); cur = null; }
  }
  if (cur) SENTS.push(cur);
}
const END = SENTS[SENTS.length - 1].e;
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const NSENT = SENTS.map((x) => norm(x.txt));

/* ─────────────────────────────── assets ────────────────────────────────── */
const IMGS = fs.readdirSync(`public/img/${SLUG}`).filter((f) => f.endsWith(".jpg")).map((f) => f.replace(/\.jpg$/, ""));
const CLIPS = fs.readdirSync(`public/broll/${SLUG}/_720`).filter((f) => f.endsWith(".mp4")).map((f) => f.replace(/\.mp4$/, ""));
const usedImg = new Set(), usedClip = new Set();
const img = (n) => `staticFile('img/${SLUG}/${n}.jpg')`;
const clip = (n) => `staticFile('broll/${SLUG}/_720/${n}.mp4')`;
const R = (p, a, b) => Array.from({ length: b - a + 1 }, (_, i) => p + String(a + i).padStart(3, "0"));

/* ───────── secciones: pools temáticos (imágenes por prefijo + clips) ────── */
const SECTIONS = [
  { at: 0,      id: "hook",    ip: ["hk_"],            cl: [...R("d", 1, 10), ...R("d", 25, 32), ...R("e", 1, 9)] },
  { at: 78.5,   id: "present", ip: ["dr_", "ci_camion"], cl: [...R("d", 33, 48), "d096", "d097", ...R("e", 10, 14)] },
  { at: 160.5,  id: "cable",   ip: ["nv_"],            cl: ["d098", "d099", "d100", ...R("e", 47, 50), ...R("d", 11, 16)] },
  { at: 227.7,  id: "noche",   ip: ["pn_"],            cl: ["d081", "d082", "d084", "d117", "d118", "d119", "d115", ...R("e", 5, 8)] },
  { at: 287.4,  id: "consult", ip: ["cs_"],            cl: ["d012", "d033", "d040", "d045", "d127", "e003", "e010"] },
  { at: 330.4,  id: "azucar",  ip: ["az_"],            cl: ["d047", "d063", "d064", "d035", "d036", "d037", "d068", "e035", "e036", "d059", ...R("e", 11, 13)] },
  { at: 480.7,  id: "b12",     ip: ["b12_"],           cl: [...R("d", 49, 58), "d070", "d067", ...R("e", 19, 23)] },
  { at: 628.7,  id: "circu",   ip: ["ci_"],            cl: ["d083", "d085", "d086", "d087", "d088", "d093", "d094", "d095", "d042", "d138", ...R("e", 37, 41), ...R("e", 44, 46)] },
  { at: 774.4,  id: "hierro",  ip: ["fe_"],            cl: ["d060", "d061", "d062", "d065", "d066", "d069", ...R("e", 31, 34), "d008", "e009"] },
  { at: 894.2,  id: "columna", ip: ["co_"],            cl: ["d089", "d090", "d091", "d092", ...R("d", 105, 108), "e038", "e051", "e052"] },
  { at: 968.6,  id: "alerta",  ip: ["al_"],            cl: [...R("d", 101, 104), ...R("e", 57, 60)] },
  { at: 1050.4, id: "limites", ip: ["dr_", "fn_"],     cl: ["d046", "e014", "e017", "e018"] },
  { at: 1090.7, id: "ajo",     ip: ["rm_"],            cl: [...R("d", 71, 80), ...R("e", 25, 30)] },
  { at: 1240.8, id: "agua",    ip: ["ag_"],            cl: ["d020", "d021", "d022", "d023", "d124", "d125", "d126", "e043", "e056"] },
  { at: 1318.9, id: "error",   ip: ["er_"],            cl: ["d051", "d052", "d053", "d054", "d055", "d056", "e024", "e021"] },
  { at: 1440.0, id: "ramon",   ip: ["fn_"],            cl: ["d120", "d121", "d128", "e002", "e039", "d139"] },
  { at: 1502.9, id: "recap",   ip: ["az_", "b12_", "ci_", "fe_", "co_"], cl: ["d044", "d038", "d134", "e015", "e016"] },
  { at: 1572.2, id: "cta",     ip: ["fn_", "dr_"],     cl: ["d110", "d114", "e036", "d111"] },
  { at: 1612.3, id: "cierre",  ip: ["fn_", "hk_"],     cl: ["d115", "d122", "d133", "e006", "d010"] },
];
const secAt = (t) => { let s = SECTIONS[0]; for (const x of SECTIONS) if (t >= x.at) s = x; return s; };

const nextImg = (sec) => {
  for (const p of sec.ip) { const c = IMGS.find((n) => n.startsWith(p) && !usedImg.has(n)); if (c) { usedImg.add(c); return c; } }
  const c = IMGS.find((n) => !usedImg.has(n)); if (c) { usedImg.add(c); return c; } return null;
};
const nextClip = (sec) => {
  for (const n of sec.cl) if (CLIPS.includes(n) && !usedClip.has(n)) { usedClip.add(n); return n; }
  const c = CLIPS.find((n) => !usedClip.has(n)); if (c) { usedClip.add(c); return c; } return null;
};

/* ─────────────────────── anclas: componentes del kit ───────────────────── */
const F = (d) => Math.round(d * FPS);
const A = [];
const anc = (phrase, dur, node) => A.push({ phrase: norm(phrase), dur, node });

anc("y te lo digo asi de fuerte porque a ramon", 5.6, (d) => `<FedLowerThird totalF={${F(d)}} name="Ramón, 72" role="Ex colectivero de la línea 60" topic="Cuatro años escuchando «es la edad»" accent={ACC} avatarSrc={null} />`);
anc("los anos no hormiguean", 4.2, (d) => `<FedQuote totalF={${F(d)}} kicker="Escuchame una cosa" quote="Los años no hormiguean. Los nervios hormiguean." author="Dr. Federer" role="Federer Archivos" accent={ACC} mood="warmdark" />`);
anc("soy el dr", 6.0, (d) => `<FedLowerThird totalF={${F(d)}} name="Dr. Federer" role="Más de 10 años de consultorio" topic="Federer Archivos" accent={ACC} avatarSrc={null} />`);
anc("la sangre es el camion de reparto del cuerpo", 6.0, (d) => `<FedHero totalF={${F(d)}} kicker="El hilo de todo" title="La sangre es el camión de reparto" hot={['camión']} sub="Y tus pies son el barrio más lejos del centro." image={${img("ci_camion_reparto")}} accent={ACC} mood="warmdark" side="right" />`);
anc("tengo 5 causas", 8.0, (d) => `<FedChecklist totalF={${F(d)}} kicker="Lo que te llevás de este video" title="Cinco causas y un error" hot={['error']} items={['5 causas con nombre y número','Un test de 10 segundos, en tu cama','Un remedio de cocina con su mecanismo','Una advertencia que te puede salvar el pie']} accent={ACC} mood="science" />`);
anc("hay un error que cometen 9 de cada 10", 6.2, (d) => `<FedStat totalF={${F(d)}} kicker="El error del final" value={9} suffix=" de cada 10" label="lo están haciendo" sub="Se compra sin receta. Te lo cuento al final." image={${img("er_gondola_suplementos")}} accent={ACC} mood="warmdark" />`);
anc("empecemos por lo que casi todos entienden mal", 5.0, (d) => `<FedChapter totalF={${F(d)}} kicker="Capítulo" index="01" title="El cable" sub="Un metro de nervio que hay que alimentar" accent={ACC} mood="science" />`);
anc("el ciatico solo ya mide cerca de un metro", 9.5, (d) => `<FedNerveCable totalF={${F(d)}} accent={ACC} mood="science" kicker="Anatomía simple" title="El nervio más largo del cuerpo" hot={['largo']} sub="Casi un metro de cable, alimentado de punta a punta." rootLabel="Sale de la columna baja" tipLabel="Se apaga acá primero" />`);
anc("se apaga la punta", 5.4, (d) => `<FedStep totalF={${F(d)}} step={1} total={3} title="Siempre la punta primero" hot={['punta']} sub="Por eso empieza en los dedos y va subiendo." image={${img("nv_dedos_pie")}} accent={ACC} mood="science" />`);
anc("neuropatia de patron en media y guante", 6.0, (d) => `<FedMolecule totalF={${F(d)}} kicker="Se llama" title="Patrón en media y guante" hot={['media']} sub="No significa viejo. Significa que la punta no recibe lo que necesita." centerLabel="Nervio" image={${img("nv_media_invisible")}} nodes={[{label:'Punta primero'},{label:'Las dos piernas'},{label:'Peor de noche'}]} accent={TEALC} mood="science" />`);
anc("ahora por que de noche", 5.0, (d) => `<FedChapter totalF={${F(d)}} kicker="Capítulo" index="02" title="Por qué de noche" sub="La bomba que se apaga cuando te acostás" accent={ACC} mood="cool" />`);
anc("al caminar el musculo de la pantorrilla se contrae", 10.5, (d) => `<FedNightPump totalF={${F(d)}} accent={ACC} mood="cool" kicker="El segundo corazón" title="De día la pantorrilla bombea" hot={['bombea']} dayLabel="De día" nightLabel="De noche" daySub="Cada paso empuja sangre para arriba" nightSub="Se apaga la bomba y se apaga el ruido" footer="Y recién ahí escuchás el ruidito que estuvo todo el día." />`);
anc("vamos a la historia de ramon", 5.0, (d) => `<FedChapter totalF={${F(d)}} kicker="Capítulo" index="03" title="Sacate las medias" sub="Lo que estaba escrito en la piel" accent={ACC} mood="warmdark" />`);
anc("que no te duela no es una buena noticia", 5.2, (d) => `<FedQuote totalF={${F(d)}} kicker="Ojo con esto" quote="Que no te duela puede ser la peor noticia de todas." author="Dr. Federer" role="Pie dormido" accent={ACC} mood="warmdark" />`);
anc("primera causa", 5.0, (d) => `<FedChapter totalF={${F(d)}} kicker="Causa 1 de 5" index="04" title="El azúcar silenciosa" sub="Lastima el nervio años antes del diagnóstico" accent={ACC} mood="gold" />`);
anc("la hemoglobina glicosilada", 10.0, (d) => `<FedLabRange totalF={${F(d)}} accent={ACC} mood="science" kicker="Hemoglobina glicosilada · A1c" title="El número que promedia tres meses" hot={['tres']} min={4.5} max={8} unit="%" zones={[{from:4.5,to:5.7,label:'Normal',tone:'ok'},{from:5.7,to:6.5,label:'Prediabetes',tone:'watch'},{from:6.5,to:8,label:'Diabetes',tone:'alert'}]} marks={[{at:5.7,label:'5,7'},{at:6.5,label:'6,5'}]} value={6.1} valueLabel="6,1 %" note="«Está casi bien» no existe: eso ya lastima nervios." />`);
anc("le tapa los capilares diminutos", 6.0, (d) => `<FedMolecule totalF={${F(d)}} kicker="Qué le hace al nervio" title="Dos daños a la vez" hot={['Dos']} sub="Tapa los capilares que lo alimentan y arruina la cubierta." centerLabel="Azúcar alta" image={${img("az_capilares")}} nodes={[{label:'Capilares tapados'},{label:'Cubierta arruinada'},{label:'Cable pelado'}]} accent={TEALC} mood="science" />`);
anc("tus pies son la alarma mas temprana del cuerpo", 5.4, (d) => `<FedQuote totalF={${F(d)}} kicker="Lo injusto" quote="Tus pies son la alarma más temprana del cuerpo. Y casi todos la apagan con una crema." author="Dr. Federer" role="" accent={ACC} mood="warmdark" />`);
anc("anota esto para tu proxima consulta", 6.4, (d) => `<FedChecklist totalF={${F(d)}} kicker="Para tu próxima consulta" title="Pedilo con nombre" hot={['nombre']} items={['Glucosa en ayunas NO alcanza','Pedí hemoglobina glicosilada (A1c)','Promedia los últimos 3 meses']} accent={ACC} mood="science" />`);
anc("fue una caminata de 10 minutos despues de cenar", 7.0, (d) => `<FedStep totalF={${F(d)}} step={1} total={3} title="Diez minutos después de cenar" hot={['Diez']} sub="Media hora después del último bocado, que es cuando el azúcar sube." image={${img("az_caminata_cena")}} accent={ACC} mood="gold" />`);
anc("esa caminata con los horarios y el paso a paso", 6.0, (d) => `<FedCta totalF={${F(d)}} kicker="Guía de la Salud Después de los 60" title="Las rutinas, dibujadas" hot={['dibujadas']} sub="Está en la descripción, arriba de todo." buttonLabel="Mirá la descripción" image={${img("fn_cuaderno_numeros")}} accent={ACC} mood="warmdark" />`);
anc("segunda causa", 5.0, (d) => `<FedChapter totalF={${F(d)}} kicker="Causa 2 de 5" index="05" title="La vitamina que repara" sub="B12: el material de la cubierta del nervio" accent={ACC} mood="science" />`);
anc("sin b12 el cable se pela", 5.6, (d) => `<FedStep totalF={${F(d)}} step={2} total={3} title="Sin B12, el cable se pela" hot={['pela']} sub="Primer síntoma: hormigueo en las dos piernas, peor de noche." image={${img("nv_cable_pelado")}} accent={ACC} mood="science" />`);
anc("la metformina que es la pastilla mas recetada", 9.0, (d) => `<FedMolecule totalF={${F(d)}} kicker="El círculo perverso" title="Tres cosas que se apilan" hot={['Tres']} sub="Y las tres terminan en el mismo lugar: la punta de tus pies." centerLabel="B12 baja" image={${img("b12_blister")}} nodes={[{label:'Metformina'},{label:'Antiácidos crónicos'},{label:'Menos ácido a los 60'}]} accent={TEALC} mood="cool" />`);
anc("si te miden la b12 y el resultado dice normal", 9.5, (d) => `<FedLabRange totalF={${F(d)}} accent={ACC} mood="cool" kicker="Vitamina B12 · pg/mL" title="«Normal» no es lo mismo que suficiente" hot={['suficiente']} min={150} max={900} unit="" zones={[{from:150,to:300,label:'Deficiente',tone:'alert'},{from:300,to:450,label:'Mitad de abajo',tone:'watch'},{from:450,to:900,label:'Cómodo',tone:'ok'}]} marks={[{at:300,label:'300'},{at:450,label:'450'}]} value={340} valueLabel="340" note="Si da acá y hormiguea: se puede pedir ácido metilmalónico." />`);
anc("con un pedido concreto", 5.6, (d) => `<FedChecklist totalF={${F(d)}} kicker="Cómo pedirlo" title="Un pedido, no una queja" hot={['pedido']} items={['Vitamina B12 en sangre','Si da baja-normal: ácido metilmalónico','Contale qué tomás hace años']} accent={ACC} mood="science" />`);
anc("tercera causa", 5.0, (d) => `<FedChapter totalF={${F(d)}} kicker="Causa 3 de 5" index="06" title="Cuando la sangre no llega" sub="El camión de reparto llega a mitad de camino" accent={ACC} mood="warmdark" />`);
anc("dolor o ardor que aparece caminando", 6.0, (d) => `<FedStat totalF={${F(d)}} kicker="Enfermedad arterial periférica" value={3} suffix=" cuadras" label="siempre la misma distancia" sub="Camina, arde, para, se va. Como un reloj." image={${img("ci_vereda_cuadras")}} accent={ACC} mood="warmdark" />`);
anc("y ahora fijate el contraste", 11.0, (d) => `<FedTwoPaths totalF={${F(d)}} accent={ACC} mood="science" kicker="La pregunta que parte el diagnóstico" question="¿Cuándo te alivia?" left={{answer:'Cuando me muevo',verdict:'NERVIO',sub:'Empeora en reposo, mejora al mover',tone:'cool'}} right={{answer:'Cuando me quedo quieto',verdict:'CIRCULACIÓN',sub:'Aparece caminando, calma al parar',tone:'warm'}} footer="La misma pregunta, dos caminos distintos." />`);
anc("acostate boca arriba", 6.4, (d) => `<FedStep totalF={${F(d)}} step={1} total={2} title="Piernas rectas contra la pared" hot={['rectas']} sub="Un minuto, mirándote las plantas de los pies." image={${img("ci_piernas_pared")}} accent={ACC} mood="cool" />`);
anc("sentate al borde de la cama", 6.4, (d) => `<FedStep totalF={${F(d)}} step={2} total={2} title="Ahora colgá las piernas" hot={['colgá']} sub="¿Pálida arriba y colorada abajo? Ahí hay algo que mirar." image={${img("ci_piernas_colgando")}} accent={ACC} mood="cool" />`);
anc("vas y pedis un indice tobillo brazo", 9.5, (d) => `<FedLabRange totalF={${F(d)}} accent={ACC} mood="cool" kicker="Índice tobillo-brazo" title="Presión del tobillo dividido la del brazo" hot={['tobillo']} min={0.5} max={1.3} zones={[{from:0.5,to:0.9,label:'Obstrucción',tone:'alert'},{from:0.9,to:1,label:'Límite',tone:'watch'},{from:1,to:1.3,label:'Normal',tone:'ok'}]} marks={[{at:0.9,label:'0,9'}]} value={0.87} valueLabel="0,87" note="Por debajo de 0,9 hay obstrucción en esa pierna." />`);
anc("pierna sin pelo", 6.4, (d) => `<FedChecklist totalF={${F(d)}} kicker="El combo que me hace levantar las cejas" title="Cuatro señales en la piel" hot={['Cuatro']} items={['Pierna sin pelo, brillante','Uña gruesa, difícil de cortar','Pie frío comparado con el otro','Herida chiquita que tarda semanas']} accent={ACC} mood="warmdark" />`);
anc("cuarta causa", 5.0, (d) => `<FedChapter totalF={${F(d)}} kicker="Causa 4 de 5" index="07" title="El hierro que no se ve" sub="No el de la anemia: el de los depósitos" accent={ACC} mood="gold" />`);
anc("hay un cuadro que se llama sindrome de piernas inquietas", 6.6, (d) => `<FedChecklist totalF={${F(d)}} kicker="Síndrome de piernas inquietas" title="Cómo se siente" hot={['siente']} items={['Bichos caminando','Agua con gas','Corriente floja','Se alivia al mover la pierna']} accent={ACC} mood="cool" />`);
anc("lo que se mide es la ferritina", 9.5, (d) => `<FedLabRange totalF={${F(d)}} accent={ACC} mood="gold" kicker="Ferritina · ng/mL" title="El número que casi nadie mira" hot={['nadie']} min={0} max={150} zones={[{from:0,to:30,label:'Depósitos vacíos',tone:'alert'},{from:30,to:75,label:'«Normal» pero corto',tone:'watch'},{from:75,to:150,label:'Suficiente',tone:'ok'}]} marks={[{at:15,label:'15'},{at:75,label:'75'}]} value={42} valueLabel="42" note="El laboratorio la marca normal desde 15. Acá el número es 75." />`);
anc("no salgas a comprar hierro por tu cuenta", 5.4, (d) => `<FedQuote totalF={${F(d)}} kicker="Advertencia" quote="El hierro de más se acumula y hace daño. Primero el número, después la decisión." author="Dr. Federer" role="" accent={ACC} mood="warmdark" />`);
anc("comer mejor el hierro que ya comes", 7.0, (d) => `<FedChecklist totalF={${F(d)}} kicker="Sin permiso de nadie" title="Comé mejor el hierro que ya comés" hot={['mejor']} items={['Carne roja, morcilla, lentejas, hígado','Algo ácido y vitamina C en la misma comida','Mate, té y café: una hora después']} accent={ACC} mood="gold" />`);
anc("quinta causa", 5.0, (d) => `<FedChapter totalF={${F(d)}} kicker="Causa 5 de 5" index="08" title="La columna" sub="El cable apretado antes de salir" accent={ACC} mood="cool" />`);
anc("caminas bien empujando el carrito del supermercado", 7.5, (d) => `<FedBeforeAfter totalF={${F(d)}} kicker="El signo del carrito" title="La postura te lo dice" hot={['postura']} imageA={${img("co_espalda_baja")}} imageB={${img("co_carrito_super")}} labelA="Derecho: te dura 3 cuadras" labelB="Inclinado: caminás bien" accent={COOLC} mood="cool" />`);
anc("es kinesiologia", 6.0, (d) => `<FedChecklist totalF={${F(d)}} kicker="Acá el camino es otro" title="Columna: qué sí sirve" hot={['sirve']} items={['Kinesiología','Fortalecer abdomen y glúteos','A veces resonancia y traumatólogo']} accent={ACC} mood="cool" />`);
anc("las senales de alerta", 5.0, (d) => `<FedChapter totalF={${F(d)}} kicker="Importante" index="09" title="Señales de alerta" sub="Qué NO se espera hasta el lunes" accent={ALERT} mood="warmdark" />`);
anc("eso es emergencia", 7.5, (d) => `<FedChecklist totalF={${F(d)}} kicker="A la guardia YA" title="De golpe y de un solo lado" hot={['YA']} items={['Cara caída','Brazo pesado','Lengua trabada','Vista rara']} accent={ALERT} mood="warmdark" />`);
anc("y el pie diabetico no se pierde por la herida", 6.0, (d) => `<FedQuote totalF={${F(d)}} kicker="Pie dormido" quote="El pie no se pierde por la herida: se pierde por los días que pasaron sin que nadie la mirara." author="Dr. Federer" role="" accent={ALERT} mood="warmdark" />`);
anc("mirate los pies", 6.5, (d) => `<FedStep totalF={${F(d)}} step={3} total={3} title="Mirate los pies todas las noches" hot={['todas']} sub="Con luz. Si no llegás, un espejito en el piso. Treinta segundos." image={${img("al_espejito_piso")}} accent={ACC} mood="warmdark" />`);
anc("los limites", 5.0, (d) => `<FedChapter totalF={${F(d)}} kicker="Honestidad" index="10" title="Los límites" sub="Lo que esto NO hace" accent={ACC} mood="warmdark" />`);
anc("si hay dano nervioso", 6.6, (d) => `<FedQuote totalF={${F(d)}} kicker="Te lo digo derecho" quote="Se puede frenar el avance y mejorar mucho el síntoma. No siempre se revierte todo." author="Dr. Federer" role="Sin promesas" accent={ACC} mood="warmdark" />`);
anc("ajo crudo", 5.0, (d) => `<FedChapter totalF={${F(d)}} kicker="El remedio de cocina" index="11" title="Ajo crudo, machacado" sub="Y esperar diez minutos" accent={ACC} mood="gold" />`);
anc("el ajo entero", 6.4, (d) => `<FedStep totalF={${F(d)}} step={1} total={3} title="El diente entero no sirve" hot={['entero']} sub="El compuesto está guardado en dos piezas separadas." image={${img("rm_cabeza_ajo")}} accent={ACC} mood="gold" />`);
anc("cuando vos machacas el diente", 6.4, (d) => `<FedStep totalF={${F(d)}} step={2} total={3} title="Machacalo y esperá" hot={['esperá']} sub="La reacción no es instantánea: necesita unos minutos al aire." image={${img("rm_ajo_machacado")}} accent={ACC} mood="gold" />`);
anc("si vos picas el ajo", 6.4, (d) => `<FedStep totalF={${F(d)}} step={3} total={3} title="A la sartén enseguida, no" hot={['no']} sub="El calor destruye la enzima antes de que termine el trabajo." image={${img("rm_ajo_sarten")}} accent={ALERT} mood="warmdark" />`);
anc("y que hace la alicina en el cuerpo", 22.0, (d) => `<Whiteboard scene={SCENE_AJO_VUCM} theme="white" />`);
anc("muestran bajas de alrededor de 8 milimetros", 7.0, (d) => `<FedStat totalF={${F(d)}} kicker="Revisiones en personas con presión alta" value={8} prefix="−" suffix=" mmHg" label="en la máxima" sub="Y unos 5 en la mínima. Para una cabeza de ajo, es un montón." image={${img("ci_tensiometro_brazo")}} accent={ACC} mood="gold" />`);
anc("las cantidades exactas", 7.0, (d) => `<FedCta totalF={${F(d)}} kicker="Las medidas exactas" title="Te las dejé anotadas" hot={['anotadas']} sub="Cuánto, cada cuánto y con qué no. En la descripción, arriba de todo." buttonLabel="Abrí la descripción" image={${img("fn_cuaderno_numeros")}} accent={ACC} mood="warmdark" />`);
anc("las advertencias del ajo", 8.0, (d) => `<FedChecklist totalF={${F(d)}} kicker="Advertencias reales" title="Cuándo NO" hot={['NO']} items={['Anticoagulantes o aspirina indicada: hablalo','Cirugía programada: se suspende una semana antes','Gastritis o reflujo: con comida, nunca en ayunas']} accent={ALERT} mood="warmdark" />`);
anc("el agua tibia en los pies antes de dormir", 6.4, (d) => `<FedStep totalF={${F(d)}} step={1} total={2} title="Agua tibia, diez minutos" hot={['tibia']} sub="El calor suave abre los vasos justo antes de acostarte." image={${img("ag_palangana")}} accent={ACC} mood="warmdark" />`);
anc("si el nervio esta dormido", 8.0, (d) => `<FedQuote totalF={${F(d)}} kicker="La trampa" quote="Si el nervio está dormido, tu pie no mide bien la temperatura. Y te quemás sin enterarte." author="Dr. Federer" role="Regla sin excepción" accent={ALERT} mood="warmdark" />`);
anc("regla sin excepcion", 7.0, (d) => `<FedChecklist totalF={${F(d)}} kicker="Cómo se hace bien" title="Con el codo, nunca con el pie" hot={['codo']} items={['Tibia, no caliente','Diez minutos, no media hora','Secar bien entre los dedos']} accent={ACC} mood="cool" />`);
anc("20 movimientos de tobillo", 6.4, (d) => `<FedStep totalF={${F(d)}} step={2} total={2} title="Veinte de punta y talón" hot={['Veinte']} sub="Encendés a mano la bomba que se apagó después de cenar." image={${img("ag_tobillo_punta")}} accent={ACC} mood="cool" />`);
anc("el error del 90", 5.4, (d) => `<FedChapter totalF={${F(d)}} kicker="El pago del loop" index="12" title="El error del 90%" sub="Lo contraintuitivo del video" accent={ALERT} mood="warmdark" />`);
anc("la piridoxina que viene adentro de casi todos esos complejos", 13.0, (d) => `<FedB6Trap totalF={${F(d)}} accent={ALERT} mood="warmdark" kicker="Vitamina B6 · piridoxina" title="El frasco que compraste para el hormigueo" hot={['hormigueo']} items={[{label:'Complejo B',mg:50},{label:'Suplemento para el pelo',mg:25},{label:'Multivitamínico',mg:20},{label:'Energizante',mg:10}]} limitLabel="Nadie suma" note="En dosis altas y sostenidas, produce neuropatía." />`);
anc("el frasco que compraste para el hormigueo", 6.0, (d) => `<FedStat totalF={${F(d)}} kicker="Descrito hace más de 40 años" value={40} suffix=" años" label="en la literatura médica" sub="Por eso las agencias limitan las dosis de venta libre." image={${img("er_lupa_etiqueta")}} accent={ALERT} mood="warmdark" />`);
anc("que haces con esto", 7.5, (d) => `<FedChecklist totalF={${F(d)}} kicker="Dos minutos de trabajo" title="Juntá los frascos" hot={['frascos']} items={['Todos los que tomás, arriba de la mesa','Buscá «piridoxina» o «vitamina B6»','Sumá los miligramos del día','Ese papelito va a tu médico']} accent={ACC} mood="science" />`);
anc("la b12 que hablamos antes es la que repara", 7.5, (d) => `<FedBeforeAfter totalF={${F(d)}} kicker="Una sola letra de diferencia" title="Dos vitaminas distintas" hot={['distintas']} imageA={${img("b12_frascos_mesa")}} imageB={${img("er_frascos_mesa_luz")}} labelA="B12: repara la cubierta" labelB="B6 en exceso: la rompe" accent={ALERT} mood="warmdark" />`);
anc("cuatro cosas", 6.5, (d) => `<FedChecklist totalF={${F(d)}} kicker="Lo de Ramón" title="Cuatro cosas con nombre y número" hot={['número']} items={['Glicosilada 6,1','B12 en la mitad de abajo','Índice tobillo-brazo 0,87','Un complejo B «reforzado»']} accent={ACC} mood="science" />`);
anc("y me dijo una frase que me quedo grabada", 8.0, (d) => `<FedQuote totalF={${F(d)}} kicker="A los cuatro meses" quote="Doctor, anoche me acosté y me dormí. Nada más. Me dormí." author="Ramón" role="72 años" image={${img("fn_ramon_sonrie")}} accent={ACC} mood="warmdark" />`);
// ── recap numerado → FocusCards, una instancia por número (regla del canal) ──
const RECAP = `items={[{n:1,label:'Azúcar silenciosa',sub:'Pedí hemoglobina glicosilada (A1c)',image:${img("az_glucometro")}},{n:2,label:'Vitamina B12',sub:'Sobre todo con metformina o antiácidos',image:${img("b12_pastillero")}},{n:3,label:'Circulación arterial',sub:'Índice tobillo-brazo: por debajo de 0,9',image:${img("ci_tensiometro_tobillo")}},{n:4,label:'Hierro',sub:'Ferritina: mirá el 75, no el mínimo',image:${img("fe_ferritina_papel")}},{n:5,label:'Columna',sub:'Kinesiología, no vitaminas',image:${img("co_carrito_super")}}]}`;
anc("vamos al repaso", 5.5, (d) => `<FedFocusCards totalF={${F(d)}} accent={ACC} mood="science" kicker="Tu lista de control" title="Los cinco, en orden" hot={['cinco']} ${RECAP} focus={-1} footer="Anotalos: son la hoja con la que entrás al consultorio." />`);
anc("el azucar silenciosa pedi hemoglobina", 11.0, (d) => `<FedFocusCards totalF={${F(d)}} accent={ACC} mood="science" kicker="Uno" title="El azúcar silenciosa" hot={['azúcar']} ${RECAP} focus={0} footer="Prediabetes: 5,7 a 6,4. Ya lastima nervios." />`);
anc("la vitamina b12 sobre todo si tomas metformina", 9.5, (d) => `<FedFocusCards totalF={${F(d)}} accent={ACC} mood="science" kicker="Dos" title="La vitamina B12" hot={['B12']} ${RECAP} focus={1} footer="Si da baja dentro de lo normal: ácido metilmalónico." />`);
anc("la circulacion arterial", 12.0, (d) => `<FedFocusCards totalF={${F(d)}} accent={ACC} mood="science" kicker="Tres" title="La circulación arterial" hot={['circulación']} ${RECAP} focus={2} footer="Pedí índice tobillo-brazo. Por debajo de 0,9 hay que actuar." />`);
anc("si el hormigueo mejora al mover la pierna", 9.0, (d) => `<FedFocusCards totalF={${F(d)}} accent={ACC} mood="science" kicker="Cuatro" title="El hierro" hot={['hierro']} ${RECAP} focus={3} footer="Ferritina: mirá el 75, no el mínimo del laboratorio." />`);
anc("si mejora inclinandote hacia adelante", 9.0, (d) => `<FedFocusCards totalF={${F(d)}} accent={ACC} mood="science" kicker="Cinco" title="La columna" hot={['columna']} ${RECAP} focus={4} footer="El camino es kinesiología, no vitaminas." />`);
anc("y arriba de los 5 la regla de oro", 7.0, (d) => `<FedQuote totalF={${F(d)}} kicker="La regla de oro" quote="Mirate los pies todas las noches con luz. Y probá siempre el agua con el codo." author="Dr. Federer" role="" accent={ACC} mood="warmdark" />`);
anc("contame en los comentarios dos cosas", 8.0, (d) => `<FedChecklist totalF={${F(d)}} kicker="Te pido un favor" title="Contame dos cosas" hot={['dos']} items={['¿A qué hora te empieza el hormigueo?','¿En qué pie te empieza primero?','¿Tomás metformina o algo para la acidez?']} accent={ACC} mood="cool" />`);
anc("y si quieres tener todo esto ordenado y en papel", 9.0, (d) => `<FedCta totalF={${F(d)}} kicker="Guía de la Salud Después de los 60" title="Todo esto, ordenado y en papel" hot={['papel']} sub="Rutinas, cantidades exactas, la tablita de tus números y el manual de señales de alerta." buttonLabel="Está en la descripción, arriba de todo" image={${img("fn_cuaderno_numeros")}} accent={ACC} mood="warmdark" />`);
anc("la proxima vez", 8.5, (d) => `<FedHero totalF={${F(d)}} kicker="La próxima vez" title="Por qué te despertás a las 4 de la mañana" hot={['4']} sub="El azúcar de la cena y el hígado trabajando de madrugada." image={${img("fn_madrugada_reloj")}} accent={ACC} mood="cool" side="left" />`);
anc("comun y normal no son lo mismo", 7.0, (d) => `<FedQuote totalF={${F(d)}} kicker="Escuchame esto último" quote="Tus pies no se están poniendo viejos: te están hablando. Y ahora ya sabés en qué idioma." author="Dr. Federer" role="Federer Archivos" accent={ACC} mood="warmdark" />`);

/* ─── ubicar cada ancla: se busca la frase en el STREAM DE PALABRAS y se lleva
 *     su ms al beat que lo contiene. (Buscar dentro del texto del beat fallaba:
 *     un beat de ~3s corta la frase al medio.) ─────────────────────────────── */
const TOK = [], TOKMS = [];
for (const w of W) { const n = norm(w.text); if (n) { TOK.push(n); TOKMS.push(w.startMs / 1000); } }
const TOKSTR = TOK.join(" ");
const beatOfSec = (t) => { let k = 0; for (let i = 0; i < SENTS.length; i++) if (SENTS[i].s <= t + 0.001) k = i; return k; };
const findSec = (phrase, fromTok) => {
  // posición en caracteres → índice de token
  const head = TOK.slice(0, fromTok).join(" ");
  const at = TOKSTR.indexOf(" " + phrase + " ", Math.max(0, head.length - 1));
  const at2 = at >= 0 ? at + 1 : (TOKSTR.startsWith(phrase + " ") ? 0 : -1);
  if (at2 < 0) return null;
  let ti = 0, acc = 0;
  while (ti < TOK.length && acc + TOK[ti].length < at2) { acc += TOK[ti].length + 1; ti++; }
  return { sec: TOKMS[Math.min(ti, TOKMS.length - 1)], tok: ti };
};
const anchorAt = new Map();
let cursorTok = 0;
for (const a of A) {
  let hit = findSec(a.phrase, cursorTok) || findSec(a.phrase, 0);
  if (!hit) { console.warn("⚠ ancla sin frase:", a.phrase.slice(0, 50)); continue; }
  const bi = beatOfSec(hit.sec);
  if (anchorAt.has(bi)) { console.warn("⚠ ancla duplicada en beat", bi, a.phrase.slice(0, 40)); continue; }
  anchorAt.set(bi, a);
  cursorTok = hit.tok + 1;
}

/* ────────────────────────────── montaje ────────────────────────────────── */
const AVATAR_OPEN = 3.6;   // el video ABRE con avatar full (frames 0-108)
const RUN_TARGET = 20;     // seg de visual entre ventana y ventana de avatar
const WIN_MIN = 6.5;       // largo mínimo de cada ventana de avatar

const raw = [];
let i = 0;
while (i < SENTS.length && SENTS[i].s < AVATAR_OPEN) i++;
const nextAnchorIdx = (from) => { for (let k = from; k < SENTS.length; k++) if (anchorAt.has(k)) return k; return SENTS.length; };

while (i < SENTS.length) {
  const a = anchorAt.get(i);
  if (a) {
    const start = SENTS[i].s;
    let j = i, acc = 0;
    while (j < SENTS.length && acc < a.dur) { acc = SENTS[j].e - start; j++; }
    const dur = Math.max(a.dur, Math.min(acc, a.dur * 1.3));
    raw.push({ start, dur, node: a.node(dur), tag: "comp" });
    i = j; continue;
  }
  const stop = nextAnchorIdx(i);
  const start = SENTS[i].s;
  const j = Math.min(i + 1, stop);
  if (j === i) { i++; continue; }
  const dur = SENTS[j - 1].e - start;
  if (dur < 1.0) { i = j; continue; }
  raw.push({ start, dur, tag: "shot", sec: secAt(start) });
  i = j;
}

// VENTANAS DE AVATAR: se abren SACANDO tomas (nunca componentes) cada RUN_TARGET seg.
const keep = [];
let since = 0, cutting = false, cutAcc = 0, avatarSec = AVATAR_OPEN;
for (const c of raw) {
  if (cutting) {
    if (c.tag === "shot" && cutAcc < WIN_MIN) { cutAcc += c.dur; avatarSec += c.dur; continue; }
    cutting = false; since = 0; cutAcc = 0;
  }
  if (since >= RUN_TARGET && c.tag === "shot") { cutting = true; cutAcc = c.dur; avatarSec += c.dur; continue; }
  keep.push(c); since += c.dur;
}

// recién ahora se consumen los assets (así ninguno se "gasta" en una toma borrada)
const cues = [];
for (const c of keep) {
  if (c.tag === "comp") { cues.push(c); continue; }
  const k = cues.length;
  const cl = (k % 2 === 0) ? nextClip(c.sec) : null;
  let node;
  if (cl) {
    node = `<FedFullShot totalF={${F(c.dur)}} src={${clip(cl)}} video ken="${["in", "left", "out", "right"][k % 4]}" accent={ACC} mood="${["warmdark", "cool", "science", "gold"][k % 4]}" />`;
  } else {
    const im = nextImg(c.sec);
    if (im) node = `<FedFullShot totalF={${F(c.dur)}} src={${img(im)}} ken="${["in", "out", "left", "in"][k % 4]}" accent={ACC} mood="${["warmdark", "gold", "cool", "science"][k % 4]}" />`;
    else { const cl2 = nextClip(c.sec); if (!cl2) { avatarSec += c.dur; continue; } node = `<FedFullShot totalF={${F(c.dur)}} src={${clip(cl2)}} video ken="in" accent={ACC} mood="warmdark" />`; }
  }
  cues.push({ ...c, node });
}

/* ───────────────────────────── salida .tsx ─────────────────────────────── */
const body = cues.map((c) => `  {start: ${c.start.toFixed(2)}, dur: ${c.dur.toFixed(2)}, node: (\n    ${c.node}\n  )},`).join("\n");
const out = `/* GENERADO por scripts/gen_${SLUG}.mjs — NO editar a mano (se regenera).
 * ${cues.length} cues · ${IMGS.length} imágenes · ${CLIPS.length} clips disponibles
 * Cada corte cae en un límite de frase de Whisper. Los huecos = avatar FULL. */
import React from 'react';
import {staticFile} from 'remotion';
import {
  FedBeforeAfter, FedChapter, FedChecklist, FedCta, FedFullShot, FedHero,
  FedLowerThird, FedMolecule, FedQuote, FedStat, FedStep, TEAL, COOL_BLUE,
} from '../FedererKit';
import {FedB6Trap, FedFocusCards, FedLabRange, FedNerveCable, FedNightPump, FedTwoPaths} from '../scenes/${SLUG}';
import {FedWhiteboardNP as Whiteboard, SCENE_AJO_VUCM} from '../FedWhiteboard_${SLUG}';

const ACC = '#E9B44C';
const TEALC = TEAL;
const COOLC = COOL_BLUE;
const ALERT = '#D9705B';

export type Cue = {start: number; dur: number; node: React.ReactNode};

export const CUES: Cue[] = [
${body}
];

export const TOTAL_${SLUG.toUpperCase()} = ${END.toFixed(2)};
`;
fs.mkdirSync("src/VideoEdit", { recursive: true });
fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, out);

const visual = cues.reduce((a, c) => a + c.dur, 0);
console.log(`cues: ${cues.length}  ·  componentes: ${cues.filter((c) => c.tag === "comp").length}  ·  tomas: ${cues.filter((c) => c.tag === "shot").length}`);
console.log(`imgs usadas ${usedImg.size}/${IMGS.length} · clips usados ${usedClip.size}/${CLIPS.length}`);
console.log(`visual ${visual.toFixed(0)}s / ${END.toFixed(0)}s  →  avatar full ${(100 - (100 * visual) / END).toFixed(0)}%`);
console.log(`toma promedio: ${(visual / cues.length).toFixed(2)}s`);
