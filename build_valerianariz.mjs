// build_valerianariz.mjs — Doctora Valeria Alcázar · "¿Tu NARIZ puede AVISARTE del ALZHEIMER? 5 SEÑALES"
// Kit valeria-vintage (editorial claro). DIRECTOR + generador: escenas ancladas al ms de Whisper.
//   Motor: L0 avatar persistente EN BUCLE Y MUDO + <Audio> master aparte + escenas Val* opacas.
//   Avatar real = 0..485.12s (leyó la parte A del guion). 485.12..1911.91s = voz Fish clonada.
//   => En la zona Fish los labios NO sincronizan: cobertura visual ~100%, el avatar solo de fondo.
//   B-roll: 374 clips + 374 fotos agnes (prefijo vn_), uno POR FRASE + 15 hero gpt-image-2.
//   CTA = RETENCIÓN (guardar/suscribir/guía en descripción). SIN QR, sin precio ni link en voz.
// ⛔ NO se usa 'carousel' (ValOilCarousel sigue con preserve-3d+rotateY → EncodingError headless).
// ⛔ 'lowerthird' SOLO acepta name/role/topic (el Main NO reenvía title/sub) · 'cta' NO acepta items.
import fs from 'fs';

const SLUG = 'valerianariz';
const PFX = 'vn_';
const TOTAL = 1911.91;          // master de audio (avatar + Fish)
const AVATAR_END = 485.12;      // fin del avatar real → desde acá el bucle no sincroniza labios
const CLIP_DUR = 4.04;          // 97 frames @24 -> lo que devuelve agnes
const CAP_COMP = 6.5;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, 'utf8').replace(/^﻿/, ''));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const W = caps.map((c) => ({n: norm(c.text), ms: c.startMs}));
function at(phrase) {
  const t = norm(phrase).split(' ');
  for (let i = 0; i <= W.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return +(W[i].ms / 1000).toFixed(2);
  }
  return null;
}
let missing = 0;
const atc = (p) => { const v = at(p); if (v == null) { console.warn('anchor NO encontrado:', p); missing++; } return v; };

const skel = JSON.parse(fs.readFileSync(`_v3/${SLUG}_skel.json`, 'utf8').replace(/^﻿/, ''));
const haveVid = (id) => fs.existsSync(`public/broll/${PFX}${id}.mp4`);
const havePhoto = (id) => fs.existsSync(`public/img/${PFX}${id}.jpg`) || fs.existsSync(`public/img/${PFX}${id}.png`);
const photoPath = (id) => (fs.existsSync(`public/img/${PFX}${id}.jpg`) ? `img/${PFX}${id}.jpg` : `img/${PFX}${id}.png`);
// foto de respaldo: si la del beat pedido no salió, se busca la más cercana que sí exista
const ph = (id) => {
  if (havePhoto(id)) return photoPath(id);
  const n = Number(String(id).replace(/\D/g, ''));
  for (let d = 1; d < 40; d++) {
    for (const c of [n - d, n + d]) {
      const cid = `b${String(c).padStart(3, '0')}`;
      if (c >= 0 && c < skel.length && havePhoto(cid)) return photoPath(cid);
    }
  }
  return undefined;
};
// hero gpt-image-2 (la doctora haciendo la prueba) — undefined si todavía no existe
const hero = (n) => {
  for (const ext of ['jpg', 'png']) if (fs.existsSync(`public/img/${PFX}h_${n}.${ext}`)) return `img/${PFX}h_${n}.${ext}`;
  return undefined;
};

/* ===================== PLAN DEL DIRECTOR (componentes) ===================== */
// Cada componente reemplaza el b-roll de su beat. Anclado a la frase EXACTA del transcript de Whisper.
const COMP = [];
const C = (phrase, kind, props = {}, dur = CAP_COMP) => {
  const start = phrase === 0 ? 0 : atc(phrase);
  if (start == null) return;
  COMP.push({start, dur, kind, ...props});
};

/* — HOOK — */
C(0, 'talk', {title: 'Su nariz avisa años antes que su memoria', hot: ['años antes'], kicker: 'Dra. Valeria Alcázar'}, 6.0);
C('porque no es el fuego', 'hero', {kicker: 'Lo importante', title: 'Lo que falló esa mañana no fue la cabeza', sub: 'Se acordaba del paquete, del laurel y del fuego al dos', image: ph('b014'), mood: 'terracotta'}, 6.5);
C('era su nariz', 'hero', {kicker: 'El fallo', title: 'Era su nariz', hot: ['nariz'], sub: 'Cuarenta minutos a cuatro metros del humo', image: ph('b010'), side: 'right', mood: 'terracotta'}, 6.0);
C('uno de esos silencios que valen', 'quote', {role: '', kicker: 'La llamada', image: ph('b023'), quote: 'Un silencio al otro lado del teléfono que vale más que un análisis entero.', author: 'La llamada de su hija'}, 6.5);
C('la fecha exacta en que empezo todo esto', 'hero', {kicker: 'El detalle', title: 'La familia sabe la fecha exacta', sub: 'Está grabada en un vídeo del móvil', image: ph('b029'), mood: 'gold'}, 6.5);
C('En una comida de Navidad', 'chapter', {kicker: 'Tres años antes', index: 'La escena', title: 'Una comida de Navidad', sub: 'Lo vieron once personas y no lo entendió ninguna'}, 6.5);

/* — PRESENTACIÓN — */
C('Yo soy la doctora Valeria', 'lowerthird', {name: 'Dra. Valeria Alcázar', role: 'Medicina estética · el cuerpo a partir de los 50', topic: 'La nariz y la memoria'}, 6.0);
C('Hoy le voy a dar las cinco senales', 'chapter', {kicker: 'Lo que viene', index: 'Las 5', title: 'Las cinco señales que da la nariz', sub: 'Y una sexta que decide si las otras sirven'}, 6.5);
C('Lo que de verdad avisa no es cuanto huele usted', 'quote', {role: '', kicker: 'La sexta cosa', image: ph('b050'), quote: 'Lo que avisa no es cuánto huele usted. Es la distancia entre lo que cree que huele y lo que huele de verdad.', author: 'Dra. Valeria Alcázar'}, 7.0);
C('Son dos numeros y lo que importa es la resta', 'stat', {suffix: '', kicker: 'La sexta cosa', value: 2, label: 'Números en un papel', sub: 'Y lo único que importa es la resta entre los dos', mood: 'gold', image: ph('b050')}, 6.0);

/* — EL CEREBRO — */
C('el olfato es el unico que no hace escala', 'beforeafter', {kicker: 'Por qué la nariz', title: 'El único sentido que no hace escala', labelA: 'Vista, oído y tacto pasan por la centralita', labelB: 'El olfato entra directo', imageA: ph('b059'), imageB: ph('b060')}, 6.5);
C('justo al lado de la amigdala', 'molecule', {kicker: 'Cómo entra el olfato', image: ph('b061'), centerLabel: 'Bulbo olfatorio', nodes: [{label: 'Amígdala'}, {label: 'Hipocampo'}, {label: 'Corteza'}, {label: 'Emoción'}], title: 'Aterriza en la zona más antigua del cerebro', sub: 'Pegado a donde se fabrica la memoria'}, 7.0);
C('Eso no es sentimentalismo', 'quote', {role: '', kicker: 'Cómo está cableado', image: ph('b064'), quote: 'Eso no es sentimentalismo. Es fontanería: están cableados juntos.', author: 'Dra. Valeria Alcázar'}, 6.0);
C('el incendio empieza en el cuarto de al lado', 'hero', {kicker: 'El orden', title: 'El incendio empieza en el cuarto de al lado', hot: ['al lado'], sub: 'Por eso la nariz se entera antes que la memoria', image: ph('b069'), mood: 'terracotta'}, 6.5);
C('hasta 10 anos antes', 'stat', {kicker: 'Lo que ven los estudios', value: 10, suffix: ' años', label: 'Antes de que aparezca ningún problema de memoria', sub: 'Es lo que ven algunos estudios de seguimiento', mood: 'gold', image: ph('b073')}, 6.5);

/* — EL AVISO DE HONESTIDAD — */
C('Perder olfato no significa tener Alzheimer', 'hero', {kicker: 'Léalo antes de seguir', title: 'Perder olfato no significa tener alzhéimer', hot: ['no significa'], sub: 'La inmensa mayoría no lo va a desarrollar jamás', image: ph('b078'), mood: 'sage'}, 7.0);
C('El olfato se estropea por muchisimas cosas', 'checklist', {kicker: 'Antes de asustarse', title: 'Esto no es un diagnóstico', items: ['Es un aviso para ir a que la miren', 'La mayoría de las causas son otras', 'Y muchas de ellas se arreglan'], mood: 'sage'}, 6.5);

/* — SEÑAL 1 — */
C('Senal numero 1', 'chapter', {kicker: 'Señal', index: '01', title: 'No huele menos: confunde', sub: 'La que todo el mundo conoce es la que menos vale'}, 6.5);
C('Su olfato tiene dos capacidades distintas', 'beforeafter', {kicker: 'Dos cosas distintas', title: 'Detectar no es identificar', labelA: 'Detectar: saber que hay algo', labelB: 'Identificar: saber qué es', imageA: ph('b089'), imageB: ph('b090')}, 6.5);
C('Detectar es la nariz', 'molecule', {kicker: 'Las dos capacidades', image: ph('b092'), centerLabel: 'Identificar', nodes: [{label: 'Nariz'}, {label: 'Archivo'}, {label: 'Corteza'}, {label: 'La palabra'}], title: 'Detectar es la nariz. Identificar es el cerebro.', sub: 'Quien abre el archivo y devuelve la palabra es la corteza'}, 7.0);
C('chocolate y no rectifica', 'beforeafter', {kicker: 'El caso', title: 'Lo que había y lo que dijo', labelA: 'En el frasco: café molido', labelB: 'Ella dijo: chocolate', imageA: ph('b099'), imageB: ph('b100')}, 6.5);
C('preguntese si acierta', 'quote', {role: '', kicker: 'La regla de la señal 1', image: ph('b104'), quote: 'No se pregunte cuánto huele. Pregúntese si acierta.', author: 'La regla de la señal 1'}, 6.0);

/* — SEÑAL 2 — */
C('Senal numero dos', 'chapter', {kicker: 'Señal', index: '02', title: 'La comida ha dejado de saber', sub: 'Y en la mesa aparecen la sal y el azúcar'}, 6.5);
C('Su lengua solo distingue cinco cosas', 'checklist', {kicker: 'La lengua', title: 'Su lengua solo distingue cinco cosas', items: ['Dulce', 'Salado', 'Ácido', 'Amargo', 'El fondo sabroso del caldo'], mood: 'gold'}, 6.5);
C('Dice que la fruta ya no sabe como antes', 'checklist', {kicker: 'Lo que dice en su lugar', title: 'Nadie dice “he perdido el olfato”', items: ['La fruta ya no sabe como antes', 'La carne está sosa', 'El tomate no sabe a tomate', 'Tú no cocinas como cocinaba yo'], mood: 'terracotta'}, 7.0);
C('pierde el placer', 'hero', {kicker: 'Lo peligroso', title: 'No pierde el apetito: pierde el placer', hot: ['el placer'], sub: 'Y lo sustituye por sal y por azúcar', image: ph('b118'), mood: 'terracotta'}, 6.5);
C('Carmen llevaba haciendo el mismo asado', 'chapter', {kicker: 'La escena', index: 'Navidad', title: 'El asado que era su firma', sub: 'Once personas lo esperaban todo el año'}, 6.5);
C('acabo salandolo el triple', 'stat', {suffix: '', kicker: 'La Navidad de Carmen', value: 3, prefix: '×', label: 'La sal que acabó echándole al asado', sub: 'Ella lo probó y dijo, en voz alta, que estaba soso', mood: 'terracotta', image: ph('b127')}, 6.5);
C('Se rieron con muchisimo carino', 'quote', {role: '', kicker: 'La mesa de Navidad', image: ph('b129'), quote: 'Estaban oyendo el aviso más temprano que existe, y sonaba como una anécdota de abuela.', author: 'La mesa de Navidad'}, 7.0);
C('Es que esta de luto', 'hero', {kicker: 'La explicación fácil', title: 'Todos pensaron que era la pena', sub: 'El marido había muerto tres meses antes. Nadie pensó en la nariz.', image: ph('b134'), side: 'right', mood: 'terracotta'}, 7.0);
C('Pregunte estas dos', 'checklist', {kicker: 'En su familia', title: 'Las dos preguntas que sí sirven', items: ['¿Hace cuánto que no te gusta una comida?', '¿Le estás echando más sal que antes?'], mood: 'sage'}, 6.5);

/* — SEÑAL 3 — */
C('Senal numero 3', 'chapter', {kicker: 'Señal', index: '03', title: 'Olores que no están', sub: 'O los que están, deformados'}, 6.5);
C('Es un olor fantasma', 'hero', {kicker: 'El primero', title: 'Un olor fantasma', sub: 'Busca de dónde viene por toda la casa y no viene de ningún sitio', image: ph('b151'), mood: 'terracotta'}, 6.5);
C('El cafe huele a gasolina', 'beforeafter', {kicker: 'El segundo', title: 'El olor llega deformado', labelA: 'El café huele a gasolina', labelB: 'La colonia de siempre da asco', imageA: ph('b154'), imageB: ph('b156')}, 6.5);
C('como un telefono que se esta reparando', 'molecule', {kicker: 'Después de un virus', image: ph('b159'), centerLabel: 'Se regenera', nodes: [{label: 'Virus'}, {label: 'Neuronas'}, {label: 'Mal conectadas'}, {label: 'Mejora'}], title: 'Después de un virus suele ser buena señal', sub: 'Como un teléfono que se repara y cruza las líneas'}, 6.5);
C('hay una cosa que si es urgente', 'hero', {kicker: 'Esto sí, pronto', title: 'De golpe, siempre el mismo, en episodios cortos', sub: 'Sobre todo si además pierde el hilo unos segundos: consúltelo pronto', image: ph('b164'), mood: 'terracotta'}, 7.0);

/* — SEÑAL 4 — */
C('Senal numero cuatro', 'chapter', {kicker: 'Señal', index: '04', title: 'No lo sabe', sub: 'Se lo tienen que decir los demás'}, 6.5);
C('Yo huelo bien y no me estaba mintiendo', 'quote', {role: '', kicker: 'Lo que ella creía', image: ph('b173'), quote: 'Bien, doctora. Normal. Yo huelo bien.', author: 'Carmen, semanas después del incendio'}, 6.0);
C('se apaga como se apaga la luz al atardecer', 'hero', {kicker: 'Por qué no se nota', title: 'Se apaga como la luz al atardecer', hot: ['al atardecer'], sub: 'Sin un momento concreto, y el cerebro baja el listón cada día', image: ph('b177'), mood: 'gold'}, 6.5);
C('el cerebro rellena', 'molecule', {kicker: 'El segundo mecanismo', image: ph('b181'), centerLabel: 'El cerebro rellena', nodes: [{label: 'Los ojos'}, {label: 'La memoria'}, {label: 'Lo esperado'}, {label: 'La respuesta'}], title: 'Ve una naranja y “huele” naranja', sub: 'Aunque la nariz esté transmitiendo poquísimo'}, 7.0);
C('le mintieron a ella desde dentro', 'quote', {role: '', kicker: 'El frasco de perfume', image: ph('b168'), quote: 'No mintió. Le mintieron a ella desde dentro.', author: 'El frasco de perfume'}, 6.0);
C('su nariz no puede ser su detector de humo', 'checklist', {kicker: 'Si vive sola', title: 'Tres cosas que hay que sacar de la nariz', items: ['El detector de humo', 'El detector de gas', 'La fecha de caducidad'], mood: 'terracotta'}, 6.5);
C('Un detector de humo', 'step', {step: 1, total: 3, title: 'Un detector con pila en el pasillo', sub: 'Y comprobarlo de vez en cuando', image: ph('b191')}, 5.5);
C('la costumbre de mirar la fecha del envase', 'step', {step: 2, total: 3, title: 'Mirar la fecha, no olfatear el táper', sub: 'La vista decide, no la nariz', image: ph('b193')}, 5.5);
C('y si hay gas en casa', 'step', {step: 3, total: 3, title: 'Revisión al día y nunca el fuego solo', sub: 'La cocina no se deja sola ni un momento', image: ph('b195')}, 5.5);

/* — SEÑAL 5 — */
C('Senal numero cinco', 'chapter', {kicker: 'Señal', index: '05', title: 'Años, y sin resfriado', sub: 'La que separa el ruido de la información'}, 6.5);
C('Un olfato que va y viene', 'beforeafter', {kicker: 'Dos dibujos', title: 'El que no preocupa y el que sí', labelA: 'Va y viene con el catarro y la alergia', labelB: 'Cuesta abajo, años, sin excusa', imageA: ph('b203'), imageB: ph('b205')}, 6.5);
C('Y ya van cinco anos', 'stat', {kicker: 'El dibujo que importa', value: 5, suffix: ' años', label: 'Bajando un poco cada año, sin altibajos', sub: 'Ese dibujo es el que se parece al de los estudios', mood: 'terracotta', image: ph('b209')}, 6.5);
C('Si le falla mucho mas una fosa nasal que la otra', 'beforeafter', {kicker: 'Un detalle útil', title: 'Una fosa o las dos', labelA: 'Sólo una peor: problema de esa fosa', labelB: 'Las dos por igual: viene de más adentro', imageA: ph('b213'), imageB: ph('b215')}, 6.5);

/* — PILAR Y LA LISTA DE SOSPECHOSOS — */
C('Pilar tiene 68 anos', 'hero', {kicker: 'La otra historia', title: 'Pilar acertó dos de seis', sub: 'Y se pasó una semana entera sin dormir', image: ph('b219'), mood: 'terracotta'}, 6.5);
C('Le miraron la nariz por dentro con una camara', 'stat', {kicker: 'El caso de Pilar', value: 6, suffix: ' min', label: 'Lo que tardaron en mirarle la nariz por dentro', sub: 'Tenía las dos fosas llenas de pólipos', mood: 'gold', image: ph('b224')}, 6.5);
C('por oler lejia', 'quote', {role: '', kicker: 'Pilar, después de la operación', image: ph('b227'), quote: 'Se echó a llorar de alegría por oler lejía. Eso no le pasa a nadie que tenga el olfato bien.', author: 'Pilar, después de la operación'}, 7.0);
C('La lista de sospechosos', 'chapter', {kicker: 'Antes de asustarse', index: 'La lista', title: 'Lo que apaga el olfato', sub: 'Y casi nunca es la memoria'}, 6.5);
C('Lo primero la nariz misma', 'checklist', {kicker: 'Por orden de frecuencia', title: 'Los siete sospechosos', items: ['La nariz: pólipos, sinusitis, tabique', 'Un virus fuerte', 'Un golpe en la cabeza', 'El tabaco', 'Medicamentos y carencias', 'La edad, sin más', 'Otras enfermedades neurológicas'], mood: 'gold'}, 8.0);
C('Aqui lo importante es la fecha', 'hero', {kicker: 'Los virus', title: 'Si puede señalar la semana, es otra historia', sub: 'De golpe y justo después de estar mala: otro pronóstico', image: ph('b233'), mood: 'sage'}, 6.5);
C('Cuarto el tabaco', 'hero', {kicker: 'El tabaco', title: 'Apaga el olfato de forma muy notable', sub: 'Y mejora bastante al dejarlo, aunque tarde su tiempo', image: ph('b238'), side: 'right', mood: 'terracotta'}, 6.0);
C('Hay farmacos de uso comun', 'checklist', {kicker: 'Lo que se pasa por alto', title: 'Se ven en un análisis normal', items: ['Falta de zinc', 'Falta de vitamina B12', 'Un tiroides bajo', 'Fármacos de uso común'], mood: 'sage'}, 6.5);
C('una pastilla que cuesta 4 euros al mes', 'stat', {kicker: 'Lo que se arregla', value: 4, suffix: ' €', label: 'Al mes', sub: 'Hay olfatos que vuelven con eso. Por eso se mira primero.', mood: 'sage', image: ph('b243')}, 6.0);
C('Y septimo para no dejarme nada', 'hero', {kicker: 'Honestidad', title: 'En el párkinson es aún más precoz', sub: 'La pérdida de olfato es de las señales más constantes que existen', image: ph('b247'), mood: 'gold'}, 6.5);

/* — LA PRUEBA DE CASA — */
C('Ahora si la prueba de casa', 'chapter', {kicker: 'Hágala esta tarde', index: 'La prueba', title: 'Los seis frascos', sub: 'Hecha mal no vale nada y encima asusta'}, 6.5);
C('Le doy seis que tiene todo el mundo', 'checklist', {kicker: 'De su despensa', title: 'Los seis frascos', items: ['Café molido', 'Canela', 'Un limón cortado', 'Vinagre', 'Un jabón perfumado', 'Ajo crudo'], mood: 'gold'}, 7.0);
C('Regla primera', 'step', {step: 1, total: 5, title: 'No lo haga usted sola', sub: 'Si mira lo que huele, está midiendo sus ojos', image: hero('blindfold') || ph('b262')}, 6.0);
C('Regla segunda', 'step', {step: 2, total: 5, title: 'Con los ojos tapados y una fosa cada vez', sub: 'Primero las seis por la derecha, después por la izquierda', image: hero('nostril') || ph('b265')}, 6.0);
C('Regla tercera', 'step', {step: 3, total: 5, title: 'Con OPCIONES, nunca “¿hueles algo?”', hot: ['OPCIONES'], sub: '¿Es café, es canela o es ajo? Así se mide identificación', image: ph('b270')}, 6.5);
C('Regla cuarta', 'step', {step: 4, total: 5, title: 'Diga antes cuántas cree que va a acertar', sub: 'Ese número se apunta en el papel antes de oler nada', image: hero('writing') || ph('b274')}, 6.5);
C('Regla quinta', 'step', {step: 5, total: 5, title: 'Ni resfriada, ni recién comida', sub: 'Y no huela el mismo frasco cinco veces: la nariz se cansa', image: ph('b277')}, 6.0);
C('Desde cuando', 'checklist', {kicker: 'Apunte también', title: 'Dos preguntas que valen tanto como la prueba', items: ['¿Desde cuándo?', '¿Fue de golpe o poco a poco?'], mood: 'sage'}, 6.0);

/* — LA SEXTA COSA — */
C('la sexta cosa', 'chapter', {kicker: 'Lo prometido', index: 'La 6ª', title: 'La resta', sub: 'Lo que hace que las otras cinco sirvan'}, 6.5);
C('Si dijo cinco y saco cinco', 'checklist', {kicker: 'Los tres resultados', title: 'Mire los dos números', items: ['Dijo cinco y sacó cinco: nada que hablar', 'Dijo dos y sacó dos: flojo, pero informado', 'Dijo seis y sacó dos: ahí miro dos veces'], mood: 'gold'}, 7.0);
C('Usted dijo seis', 'beforeafter', {kicker: 'La señal fina', title: 'Lo que cree y lo que le pasa', labelA: 'Lo que usted dijo: seis', labelB: 'Lo que sacó: dos', imageA: hero('paper2') || ph('b284'), imageB: ph('b291')}, 6.5);
C('Esa resta', 'hero', {kicker: 'Por qué importa', title: 'No sólo falla la nariz: falla el darse cuenta', hot: ['darse cuenta'], sub: 'Y el darse cuenta vive en las zonas de las que llevamos hablando', image: ph('b293'), mood: 'terracotta'}, 7.0);
C('como una anecdota de abuela', 'quote', {role: '', kicker: 'Quédese con la resta', image: ph('b300'), quote: 'Quédese con la resta. Es gratis, se hace en diez minutos, y no hay aparato que se la dé mejor.', author: 'Dra. Valeria Alcázar'}, 7.0);

/* — LOS TRES PASOS — */
C('Primero con el otorrino', 'step', {step: 1, total: 3, title: 'Al otorrino, y a nadie más primero', sub: 'Que le miren la nariz por dentro con la cámara', image: hero('screen') || ph('b306')}, 6.5);
C('lleve la lista de todo lo que toma', 'step', {step: 2, total: 3, title: 'Análisis y la lista de todo lo que toma', sub: 'Hierro, zinc, B12 y tiroides. Y el herbolario también.', image: ph('b309')}, 6.5);
C('Apuntela tal cual', 'step', {step: 3, total: 3, title: 'La frase exacta para la consulta', sub: 'Escríbala y llévela en el bolso', image: hero('serious') || ph('b311')}, 6.0);
C('Me pueden hacer una prueba de identificacion de olores', 'quote', {role: '', kicker: 'La frase para la consulta', image: ph('b313'), quote: 'Doctor, ¿me pueden hacer una prueba de identificación de olores?', author: 'La frase que hay que llevar a la consulta'}, 7.0);

/* — ENTRENAMIENTO OLFATIVO — */
C('El olfato se entrena', 'chapter', {kicker: 'Mientras espera', index: 'Extra', title: 'El olfato se entrena', sub: 'Cuesta cero y se hace en tres minutos'}, 6.5);
C('Cuatro olores fuertes y distintos', 'checklist', {kicker: 'Dos veces al día', title: 'Los cuatro olores', items: ['Rosa', 'Limón', 'Clavo', 'Eucalipto'], mood: 'gold'}, 6.5);
C('veinte segundos cada uno', 'stat', {kicker: 'Entrenamiento olfativo', value: 20, suffix: ' s', label: 'Cada olor, dos veces al día', sub: 'Y mientras huele el limón, piense en un limón: eso es lo que reconstruye el camino', mood: 'sage', image: hero('training') || ph('b321')}, 7.0);
C('No es un tratamiento para el Alzheimer', 'hero', {kicker: 'La letra pequeña', title: 'No previene el alzhéimer, y no se lo voy a vender así', sub: 'Está estudiado sobre todo tras un virus o un golpe. Pero cuesta cero.', image: ph('b327'), mood: 'terracotta'}, 7.0);

/* — CIERRE — */
C('llegar antes no sirve para nada', 'hero', {kicker: 'Lo que de verdad importa', title: 'Llegar antes sí sirve', hot: ['sí sirve'], sub: 'Para descartar todo lo que se arregla y se confunde con esto', image: ph('b333'), mood: 'sage'}, 6.5);
C('Un tiroides bajo', 'checklist', {kicker: 'Se confunden con esto', title: 'Cosas que se arreglan', items: ['Un tiroides bajo', 'Falta de vitamina B12', 'Una depresión', 'Una apnea del sueño', 'Unos audífonos que hacían falta', 'Pastillas que juntas hacen daño'], mood: 'sage'}, 7.5);
C('la tension bien llevada', 'checklist', {kicker: 'Lo que sí protege', title: 'Y funciona mejor cuanto antes se empieza', items: ['La tensión bien llevada', 'El azúcar bien llevado', 'El oído corregido', 'El sueño', 'Moverse', 'No quedarse sola'], mood: 'gold'}, 7.5);
C('el tiempo es lo unico que aqui no se compra', 'quote', {role: '', kicker: 'Lo que de verdad importa', image: ph('b339'), quote: 'Todo eso es tiempo. Y el tiempo es lo único que aquí no se compra.', author: 'Dra. Valeria Alcázar'}, 6.5);
C('Hoy tiene un detector de humo en el pasillo', 'checklist', {kicker: 'Carmen, hoy', title: 'Lo que cambió en su casa', items: ['Un detector de humo en el pasillo', 'Un temporizador que suena como una bomba', 'El entrenamiento de los cuatro olores', 'Y sigue empezando por las verticales'], mood: 'sage'}, 7.0);
C('Cada navidad antes de comer', 'hero', {kicker: 'Y una cosa más', title: 'Cada Navidad sacan seis frascos a la mesa', sub: 'Se la hacen los once, por turnos, con una venda y muchas risas', image: ph('b346'), mood: 'gold'}, 7.0);
C('ahora sabemos de que nos estamos riendo', 'quote', {role: '', kicker: 'La hija de Carmen', image: ph('b349'), quote: 'Nos reímos igual que aquel año, doctora. Pero ahora sabemos de qué nos estamos riendo.', author: 'La hija de Carmen'}, 7.0);
C('Recapitulemos', 'checklist', {kicker: 'Guárdese estas cinco', title: 'Las cinco señales', items: ['No es oler menos: es confundir', 'La comida no sabe, y aparece la sal', 'Olores fantasma o deformados sin virus', 'No se ha dado cuenta: se lo dicen los demás', 'Años cuesta abajo, sin resfriado, las dos fosas'], mood: 'gold'}, 8.5);
C('la resta entre lo que usted cree que huele', 'stat', {suffix: '', kicker: 'Por encima de las cinco', value: 6, label: 'Y por encima de las cinco, la sexta', sub: 'La resta entre lo que cree que huele y lo que huele de verdad', mood: 'terracotta', image: hero('paper2') || ph('b355')}, 6.5);
C('Guarde este video', 'cta', {kicker: 'Antes de irse', title: 'Guarde este vídeo y suscríbase', hot: ['Guarde'], sub: 'La prueba de los seis frascos paso a paso, la hoja de los dos números y las frases para pedir cita están escritas en la descripción.', buttonLabel: 'Guardar · Suscribirse', image: hero('smile') || ph('b357')}, 8.0);
C('Cual fue el ultimo olor que la emociono de verdad', 'hero', {kicker: 'En los comentarios', title: '¿Cuál fue el último olor que la emocionó?', sub: 'El pan recién hecho, la lluvia sobre la tierra seca, la colonia de su madre', image: ph('b365'), mood: 'gold'}, 7.0);
C('presentese un dia en su casa con seis frascos', 'hero', {kicker: 'Si vive sola alguien cerca', title: 'Vaya un día con seis frascos', sub: 'Diez minutos de mesa de cocina hacen más que un año preocupándose de lejos', image: ph('b369'), mood: 'sage'}, 7.0);
C('Cuidese mucho', 'hero', {kicker: 'Hasta la semana que viene', title: 'Cuide esa cabeza suya', sub: 'Lleva toda la vida guardándolo todo por usted', image: hero('serious') || ph('b372'), mood: 'gold'}, 7.5);

/* — CAPA DE FRASE CINÉTICA (overlay 'talk' sobre el b-roll, NO lo tapa) — */
const _T = await import('./_talks_valerianariz.mjs');
const TALKS = [..._T.default, ...(_T.TALKS2 || [])];
const OVERLAYS = [];
for (const [anchor, title, hot] of TALKS) {
  const start = at(anchor);
  if (start == null) { console.warn('talk sin anchor:', anchor); continue; }
  OVERLAYS.push({start, dur: 8.6, kind: 'talk', title, hot});
}

COMP.sort((a, b) => a.start - b.start);

/* ===================== B-ROLL 1:1 CON LA GRILLA ===================== */
const occupied = COMP.map((c) => [c.start, c.start + c.dur]);
const overlaps = (s, e) => occupied.some(([a, b]) => s < b && e > a);
// un 'talk' encima de un componente a pantalla completa chocaria: se descarta
const OVER_OK = OVERLAYS.filter((o) => !overlaps(o.start, o.start + o.dur));
console.log(`frase cinetica: ${OVER_OK.length}/${OVERLAYS.length} overlays (descartados los que pisaban un componente)`);

const beats = [];
let idc = 0;
for (const c of COMP) beats.push({id: `${c.kind}_${++idc}`, ...c});

let nClip = 0, nPhoto = 0, nAvatar = 0;
for (let i = 0; i < skel.length; i++) {
  const b = skel[i];
  const s = +(b.ms / 1000).toFixed(2);
  const next = i + 1 < skel.length ? skel[i + 1].ms / 1000 : TOTAL;
  const slot = +(next - s).toFixed(2);
  if (slot <= 0.4) continue;
  const id = `b${String(i).padStart(3, '0')}`;
  // En la zona del avatar REAL dejamos respirar la cara: 1 de cada 3 beats sin tapar.
  // Despues de la costura el avatar va en bucle y NO sincroniza: no puede quedar a la vista.
  const enAvatar = s < AVATAR_END;
  if (enAvatar && i % 3 === 2) { nAvatar++; continue; }
  if (overlaps(s, s + slot)) continue;
  const vid = haveVid(id);
  const foto = ph(id);
  if (!vid && !foto) continue;
  const ken = ['in', 'out', 'left', 'right'][i % 4];
  if (vid) {
    const d = Math.min(slot, CLIP_DUR);
    beats.push({id: `full_${id}`, start: s, dur: +d.toFixed(2), kind: 'full', src: `broll/${PFX}${id}.mp4`, video: true, ken, noSplit: true});
    nClip++;
    const tail = +(slot - d).toFixed(2);
    if (tail > 0.7 && foto) { beats.push({id: `tail_${id}`, start: +(s + d).toFixed(2), dur: tail, kind: 'full', src: foto, video: false, ken: ken === 'in' ? 'out' : 'in'}); nPhoto++; }
  } else {
    beats.push({id: `full_${id}`, start: s, dur: slot, kind: 'full', src: foto, video: false, ken});
    nPhoto++;
  }
}
beats.sort((a, b) => a.start - b.start);

/* ============ RELLENO ANTI-HUECO DE LA ZONA FISH ============ */
{
  const porMs = skel.map((b, i) => ({t: b.ms / 1000, id: `b${String(i).padStart(3, '0')}`}));
  const cercano = (t) => {
    let best = null, bd = 1e9;
    for (const c of porMs) { const d = Math.abs(c.t - t); if (d < bd && havePhoto(c.id)) { bd = d; best = c.id; } }
    return best;
  };
  const rellenos = [];
  const segs = beats.map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
  let cur = AVATAR_END;
  const huecos = [];
  for (const [s2, e2] of segs) {
    if (e2 <= AVATAR_END) continue;
    const ini = Math.max(s2, AVATAR_END);
    if (ini - cur > 0.12) huecos.push([cur, ini]);
    cur = Math.max(cur, e2);
  }
  if (TOTAL - cur > 0.12) huecos.push([cur, TOTAL]);
  for (const [gs, ge] of huecos) {
    let t = gs;
    while (ge - t > 0.12) {
      const d = Math.min(4.2, ge - t);
      const id = cercano(t);
      if (!id) break;
      rellenos.push({id: `gap_${id}_${t.toFixed(0)}`, start: +t.toFixed(2), dur: +d.toFixed(2), kind: 'full',
                     src: photoPath(id), video: false, ken: rellenos.length % 2 ? 'out' : 'in', variant: 'whip'});
      t += d;
    }
  }
  beats.push(...rellenos);
  beats.sort((a, b) => a.start - b.start);
  // ⛔ COSTURA DEL BUCLE: el avatar reinicia en AVATAR_END y el salto se ve. Forzamos que un
  // plano EMPIECE exacto ahi: si un beat la cruza, se parte en dos.
  {
    const i = beats.findIndex((b) => b.kind === 'full' && b.start < AVATAR_END && b.start + b.dur > AVATAR_END + 0.3);
    if (i >= 0) {
      const b = beats[i];
      const d1 = +(AVATAR_END - b.start).toFixed(2);
      const d2 = +(b.dur - d1).toFixed(2);
      beats[i] = {...b, dur: d1};
      beats.push({...b, id: b.id + '_seam', start: AVATAR_END, dur: d2, ken: b.ken === 'in' ? 'out' : 'in'});
      beats.sort((a, c) => a.start - c.start);
      console.log(`corte forzado en la costura ${AVATAR_END}s (partido ${b.id})`);
    } else {
      const ya = beats.some((b) => Math.abs(b.start - AVATAR_END) < 0.25);
      console.log(ya ? 'costura: ya habia un corte exacto' : '⚠ costura sin corte propio');
    }
  }
  console.log(`relleno anti-hueco (zona Fish): ${rellenos.length} planos`);
}

// los 'talk' van AL FINAL del array: en Remotion el ultimo hermano se dibuja ENCIMA
let ido = 0;
for (const o of OVER_OK) beats.push({id: `talk_${++ido}`, ...o});

/* ===================== EMITIR ===================== */
const TOTAL_FRAMES = Math.round(TOTAL * 30);
const header = `// cues_valerianariz.gen.ts — GENERADO por build_valerianariz.mjs. NO editar a mano.
export type Cue = {
  id: string; start: number; dur: number;
  kind: 'talk'|'full'|'chapter'|'hero'|'stat'|'quote'|'molecule'|'step'|'beforeafter'|'checklist'|'cta'|'carousel'|'lowerthird'|'qr';
  title?: string; kicker?: string; sub?: string; hot?: string[]; accent?: string; mood?: string; variant?: string;
  index?: string; side?: 'left'|'right';
  image?: string; imageA?: string; imageB?: string; labelA?: string; labelB?: string;
  src?: string; video?: boolean; caption?: string; ken?: 'in'|'out'|'left'|'right'; noSplit?: boolean;
  value?: number; suffix?: string; prefix?: string; decimals?: number; label?: string;
  quote?: string; author?: string; role?: string; centerLabel?: string; nodes?: {label: string}[];
  step?: number; total?: number; items?: string[]; buttonLabel?: string;
  name?: string; topic?: string; cards?: {image: string; index: string; name: string; tag?: string}[]; focus?: number; intro?: boolean;
};
export const TOTAL_FRAMES_VN = ${TOTAL_FRAMES};
export const AVATAR_END_F = ${Math.round(AVATAR_END * 30)};
export const BEATS: Cue[] = ${JSON.stringify(beats, null, 2)};
`;
fs.writeFileSync('src/valeria/cues_valerianariz.gen.ts', header);

const assetSet = new Set();
for (const b of beats) {
  for (const k of ['src', 'image', 'imageA', 'imageB']) if (typeof b[k] === 'string' && !/^https?:/.test(b[k])) assetSet.add(b[k]);
}
fs.writeFileSync(`_${SLUG}_assets.txt`, [`${SLUG}_opt.mp4`, `${SLUG}.wav`, ...assetSet].join('\n') + '\n');

// ── cobertura: en la zona Fish no puede haber avatar descubierto (labios fuera de sync)
const segs = beats.map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
let cursor = AVATAR_END, huecoFish = 0, peor = 0;
for (const [s, e] of segs) {
  if (e <= AVATAR_END) continue;
  const ini = Math.max(s, AVATAR_END);
  if (ini > cursor) { const g = ini - cursor; huecoFish += g; if (g > peor) peor = g; }
  cursor = Math.max(cursor, e);
}
if (TOTAL - cursor > 0) { huecoFish += TOTAL - cursor; peor = Math.max(peor, TOTAL - cursor); }

const nComp = beats.filter((b) => !['talk', 'full'].includes(b.kind)).length;
const kinds = [...new Set(beats.filter((b) => b.kind !== 'full').map((b) => b.kind))];
const porKind = {};
for (const b of beats) if (b.kind !== 'full') porKind[b.kind] = (porKind[b.kind] || 0) + 1;
console.log(`=== build_${SLUG} ===`);
console.log(`beats: ${beats.length} · componentes: ${nComp} · clips: ${nClip} · fotos: ${nPhoto} · avatar libre: ${nAvatar}`);
console.log(`tipos distintos: ${kinds.length} ->`, porKind);
console.log(`anchors faltantes: ${missing}`);
console.log(`ZONA FISH descubierta: ${huecoFish.toFixed(1)}s (peor hueco ${peor.toFixed(1)}s)`);
console.log(`TOTAL_FRAMES: ${TOTAL_FRAMES} (${(TOTAL / 60).toFixed(1)} min)`);
