// vallimon_plan.mjs — §0 DIRECTOR · Doctora Valeria Alcázar · MONTAJE DR. FEDERER (FedKit)
// "Mezcle VASELINA con LIMÓN Antes de Dormir: Esto Pasa en 3 Noches"
// t: A avatar (T = título {kicker,title,hot,tone} o sello {stamp,title}) · V stock video · F foto · H doctora · G generada · C componente FedKit
// GLOSARIO: Carmen = 68, Monterrey → sólo stock de mayores / manos / pies / objetos. Frascos SIN etiqueta ni marca (nada de "Vaseline").
export const VAS = 'a small round clear glass jar of pure white petroleum jelly, completely unlabeled, no brand, no letters';
export const HANDS = "an older woman's hands (about 68, natural wrinkles and a few age spots, short clean unpainted nails, no rings)";
export const FEET = "an older woman's bare feet (about 68, dry rough heels with small shallow cracks, clean short toenails, no polish)";
export const SECCIONES = [
{ id: 'hook', m: [
  { d: 'Once millones de personas vieron esta mezcla', t: 'A', T: { kicker: 'Once millones la vieron', title: 'Vaselina con limón, antes de dormir', hot: ['limón,'] } },
  { d: 'La probamos con medidas exactas', t: 'G', p: `close-up on a wooden kitchen table in warm daylight: ${HANDS} squeezing a fresh cut lemon half over a small white saucer that holds a spoonful of white petroleum jelly, ${VAS} open beside it. EMPTY: hands only, no face` },
  { d: 'Y le digo la regla que nadie dice', t: 'C', c: { kind: 'redflags', kicker: 'La regla que nadie dice', title: 'El limón, nunca de día', hot: ['nunca'], items: ['Nunca de día', 'En la cara, nunca'], hits: ['el limón, nunca de día', 'Y en la cara, ni de día ni de noche'], iq: 'cut lemons sunlight' } },
  { d: 'Porque esta mezcla hace maravillas', t: 'V', q: ['senior woman feet socks bed', 'elderly woman sitting bed socks'] },
]},
{ id: 'presenta', m: [
  { d: 'Yo soy la doctora Valeria Alcázar', t: 'A', T: { kicker: 'Dra. Valeria Alcázar', title: 'Dónde sí funciona, y qué pasa en tres noches', hot: ['tres'] } },
  { d: 'y qué le pasa a la piel cuando el limón se encuentra con el sol', t: 'V', q: ['lemon tree sunlight', 'lemons in bright sun'] },
  { d: 'Busque papel y lápiz', t: 'V', q: ['notebook and pencil on kitchen table', 'writing in notebook pencil'] },
]},
{ id: 'receta', m: [
  { d: 'Primero, lo que necesita', t: 'C', c: { kind: 'recipe', kicker: 'Paso 1 · Lo que necesita', title: 'Tres cosas, nada más', hot: ['nada'], ing: [{ q: '1 cda', t: 'vaselina pura, sin perfume' }, { q: '10 gotas', t: 'limón fresco, colado (½ cdta)' }, { q: '1 par', t: 'medias de algodón' }], steps: ['Mezclar en un platito', 'Talones, a la noche', 'Medias puestas', 'A la mañana, agua y jabón'], hits: ['Una cucharada de vaselina pura', 'Media cucharadita de jugo de limón', 'un par de medias de algodón'], iq: 'lemons wooden table' } },
  { d: 'Segundo, se mezcla', t: 'G', p: `close-up on a kitchen table in daylight: ${HANDS} stirring white petroleum jelly with a few drops of lemon juice on a small white saucer using the handle of a teaspoon, a squeezed lemon half and a tiny strainer beside it. EMPTY: hands only, no face`,
    x: [{ at: 'No se va a mezclar del todo', q: ['stirring cream small bowl spoon', 'mixing ointment spoon'] }] },
  { d: 'Se hace en el momento, para una sola noche', t: 'A', T: { stamp: 'EN EL MOMENTO', title: 'para una sola noche' } },
  { d: 'Tercero, los pies', t: 'G', p: `close-up sitting on the edge of a bed with a white cotton bedspread, warm bedside lamp light: ${HANDS} massaging white petroleum jelly into ${FEET}, rubbing the heel. EMPTY: only hands and feet, no face`,
    x: [{ at: 'y masajee un minuto', q: ['foot massage heel cream', 'massaging feet lotion'] }] },
  { d: 'Si le sobra, a los codos y a las rodillas', t: 'V', q: ['applying lotion elbow', 'cream on elbow skin'] },
  { d: 'Cuarto, las medias', t: 'V', q: ['putting on white socks bed', 'woman putting socks on feet'] },
  { d: 'Quinto, a la mañana', t: 'V', q: ['washing feet soap', 'washing feet bathroom'] },
  { d: 'Esa es la receta completa', t: 'A', T: { kicker: 'La receta completa', title: 'Un minuto por noche, y cuesta centavos', hot: ['centavos'] } },
]},
{ id: 'loops', m: [
  { d: 'Ahora, qué pasa en tres noches', t: 'C', c: { kind: 'questions', kicker: 'Hoy le respondo', title: 'Lo que nadie le explica', questions: ['¿Qué pasa en 3 noches?', '¿Uñas amarillas?', '¿Se guarda hecha?', '¿Y la cara?'], hits: ['qué pasa en tres noches', 'Sirve para las uñas amarillas', 'Se puede guardar hecha', 'por qué en la cara no'], iq: 'lemon and jar kitchen' } },
  { d: 'Porque hay una cosa, una sola', t: 'A', T: { stamp: 'LIMÓN + SOL', title: 'manchas que pueden durar meses' } },
  { d: 'Se la cuento en unos minutos', t: 'V', q: ['senior woman garden sun', 'elderly woman watering plants sunny'] },
]},
{ id: 'porque', m: [
  { d: 'Empecemos por lo más importante', t: 'C', c: { kind: 'chapter', kicker: 'Primera parte', index: '01', title: 'Qué hace cada cosa', hot: ['cada'], sub: 'vaselina, limón y medias', iq: 'petroleum jelly jar' } },
  { d: 'La vaselina es de lo más estudiado', t: 'A', T: { kicker: 'La vaselina', title: 'No alimenta: sella', hot: ['sella'] } },
  { d: 'Lo que hace es sellar', t: 'V', q: ['petroleum jelly close up texture', 'white ointment fingertip'] },
  { d: 'Por eso la piel dura y reseca de los talones', t: 'V', q: ['dry cracked heels close up', 'dry feet heels'] },
  { d: 'El limón tiene un ácido', t: 'V', q: ['lemon slices close up', 'squeezing lemon juice'] },
  { d: 'Y las medias de algodón hacen de invernadero', t: 'V', q: ['white cotton socks', 'cotton socks folded'] },
  { d: 'Así que la vaselina sella', t: 'C', c: { kind: 'trio', kicker: 'Ocho horas mientras duerme', title: 'Cada uno, su trabajo', hot: ['trabajo'], methods: [{ name: 'Vaselina', desc: 'sella el agua', icon: 'drop' }, { name: 'Limón', desc: 'afloja la piel dura', icon: 'brush' }, { name: 'Medias', desc: 'toda la noche', icon: 'moon' }], iq: 'bedroom night lamp' } },
  { d: 'Pero le voy a ser honesta', t: 'C', c: { kind: 'cross', kicker: 'Con honestidad', title: 'Lo que no hace', hot: ['no'], items: ['No borra las arrugas', 'No aclara manchas de la cara', 'No blanquea axilas'], hits: ['Que borra las arrugas', 'que aclara las manchas de la cara', 'que blanquea las axilas'], iq: 'senior woman face natural light window' } },
  { d: 'Lo que sí hace, y muy bien', t: 'C', c: { kind: 'checklist', kicker: 'Lo que sí hace', title: 'En tres noches', hot: ['tres'], items: ['Talones suaves', 'Codos menos ásperos', 'Cutículas sin pellejitos'], hits: ['dejar los talones suaves', 'los codos menos ásperos', 'las cutículas sin pellejitos'], iq: 'feet on soft rug' } },
]},
{ id: 'carmen', m: [
  { d: 'Le cuento el caso de una señora', t: 'C', c: { kind: 'story', kicker: 'Un caso real', name: 'Carmen', age: '68 años', detail: 'Monterrey', iq: 'senior latin woman at home portrait' } },
  { d: 'Carmen vio el video de los once millones', t: 'V', q: ['senior woman watching video smartphone', 'elderly woman phone sofa'] },
  { d: 'A la mañana no se lavó bien', t: 'V', q: ['senior woman washing hands quickly', 'elderly woman hands sink'] },
  { d: 'Y salió al patio a regar sus plantas', t: 'V', q: ['senior woman watering plants garden', 'elderly woman garden hose sunny'] },
  { d: 'A los dos días le aparecieron unas manchas oscuras', t: 'G', p: `close-up of the back of ${HANDS.replace("hands", "left hand")} resting on a kitchen table in daylight, with two irregular streak-shaped light-brown patches on the skin that look like dried drips running down, real skin texture. EMPTY: hand only, no face` },
  { d: 'Y me escribió: doctora', t: 'C', c: { kind: 'quote', quote: 'Doctora, ¿cómo algo tan natural como el limón me manchó así?', attrib: 'Carmen, 68 años', iq: 'senior woman reading smartphone' } },
  { d: 'Le expliqué lo mismo que le explico a usted', t: 'A' },
]},
{ id: 'sol', m: [
  { d: 'Y ahora sí, lo que pasa cuando el limón se encuentra con el sol', t: 'C', c: { kind: 'chapter', kicker: 'Limón + sol', index: '02', title: 'La piel se quema donde estaba el jugo', hot: ['quema'], sub: 'y queda una mancha que dura meses', tone: 'danger', iq: 'limes lemons sun' } },
  { d: 'El limón, y sobre todo la lima', t: 'A', T: { kicker: 'El limón y, sobre todo, la lima', title: 'Con sol, reaccionan en la piel', hot: ['sol,'] } },
  { d: 'Primero se pone roja', t: 'C', c: { kind: 'steps', kicker: 'Lo que pasa', title: 'Paso a paso', hot: ['Paso'], steps: [{ title: 'Se pone roja', sub: 'arde o hace ampollas' }, { title: 'Queda una mancha', sub: 'con la forma de la gota' }, { title: 'Semanas o meses', sub: 'hasta que se va' }], hits: ['Primero se pone roja', 'queda una mancha oscura', 'puede durar semanas o meses'], iq: 'sun shining sky' } },
  { d: 'Le pasa mucho a la gente que prepara limonada', t: 'V', q: ['making lemonade outdoors', 'squeezing limes outdoor table'] },
  { d: 'Por eso la regla: el limón, nunca de día', t: 'C', c: { kind: 'board', title: 'La regla', cards: [{ name: 'Limón de día', verdict: 'Nunca', tone: 'danger' }, { name: 'Limón en la cara', verdict: 'Nunca', tone: 'danger' }], hits: ['el limón, nunca de día', 'Y en la cara, nunca'], iqA: 'bright sun sky', iqB: 'senior woman face natural light window' } },
  { d: 'Y Carmen cometió los otros dos errores', t: 'A', T: { kicker: 'Y dos errores más', title: 'Que veo todo el tiempo', hot: ['tiempo'] } },
  { d: 'El primero, no lavarse bien a la mañana', t: 'V', q: ['senior woman washing hands soap', 'washing hands soap sink'] },
  { d: 'El segundo, ponérsela en piel lastimada', t: 'A', T: { kicker: 'Error 2', title: 'Ponérsela en piel lastimada', hot: ['lastimada'] } },
  { d: 'Si el talón tiene grietas abiertas', t: 'C', c: { kind: 'split', title: '¿Grietas abiertas?', left: { label: 'Con limón', text: 'Arde e irrita', tone: 'danger' }, right: { label: 'Vaselina sola', text: 'En las grietas abiertas', tone: 'green' }, verdict: 'En las grietas, vaselina sola', hits: ['nada de limón', 'En las grietas abiertas va'], iq: 'dry cracked heels close up' } },
  { d: 'Y un detalle más: el limón de botella no sirve', t: 'C', c: { kind: 'board', title: '¿Qué limón?', cards: [{ name: 'De botella', verdict: 'No', tone: 'danger' }, { name: 'Fresco y colado', verdict: 'Sí', tone: 'green' }], hits: ['el limón de botella no sirve', 'Siempre limón fresco'], iqA: 'bottled lemon juice', iqB: 'squeezing fresh lemon' } },
]},
{ id: 'lamina', m: [
  { d: 'Preste mucha atención a esta imagen', t: 'C', c: { kind: 'lamina', regions: [{ x: 0.19, y: 0.38, s: 2.0 }, { x: 0.5, y: 0.5, s: 1.7 }, { x: 0.82, y: 0.42, s: 1.9 }, { x: 0.19, y: 0.72, s: 2.0 }, { x: 0.5, y: 0.9, s: 1.9 }], hits: ['Arriba a la izquierda tiene lo que necesita', 'En el centro, los cinco pasos', 'A la derecha, dónde sí y dónde no', 'En el recuadro rojo', 'Y abajo de todo'] } },
  { d: 'Y dicho sea de paso', t: 'C', c: { kind: 'qrcta', kicker: 'El recetario de la doctora', title: 'El guante de noche para las manos', hot: ['manos'], sub: 'y la receta de codos y rodillas' } },
]},
{ id: 'preguntas', m: [
  { d: 'Ahora déjeme responder las preguntas', t: 'A', T: { kicker: 'Leí cientos de comentarios', title: 'Lo que nadie responde', hot: ['nadie'] },
    x: [{ at: 'porque leí cientos de comentarios', q: ['senior woman reading tablet sofa', 'elderly woman reading laptop home'] }] },
  { d: 'Primera pregunta', t: 'A', T: { kicker: 'Pregunta 1 · ¿Qué pasa en tres noches?', title: 'Talones blandos, cutículas prolijas', hot: ['blandos,'] } },
  { d: 'Segunda pregunta', t: 'V', q: ['senior woman looking at fingernails', 'elderly woman hands nails close'] },
  { d: 'Pero si una uña se pone gruesa', t: 'C', c: { kind: 'redflags', kicker: 'Al médico si la uña…', title: 'Puede ser un hongo', hot: ['hongo'], items: ['Se pone gruesa', 'Se despega', 'Cambia de color sin esmalte'], hits: ['se pone gruesa', 'se despega', 'cambia de color sin esmalte'], iq: 'senior woman hands nails' } },
  { d: 'Tercera pregunta', t: 'A', T: { kicker: 'Pregunta 3 · ¿Se guarda hecha?', title: 'No: se hace en el momento', hot: ['momento'] } },
  { d: 'Cuarta pregunta', t: 'C', c: { kind: 'stat', kicker: 'Pregunta 4 · ¿Todas las noches?', value: '3 noches', unit: 'seguidas, al principio', caption: 'después 2 o 3 por semana; las otras, vaselina sola', iq: 'calendar wall kitchen' } },
  { d: 'Quinta pregunta', t: 'A', T: { kicker: 'Pregunta 5 · ¿Y para la cara?', title: 'Vaselina sola, sin limón', hot: ['sola,'] } },
  { d: 'Sexta pregunta', t: 'C', c: { kind: 'myth', kicker: 'Pregunta 6', statement: '¿Aclara las manchas de las manos?', truth: 'No: protector solar todos los días, también en las manos', verdict: 'NO', hits: ['No'], iq: 'senior woman hands age spots' } },
  { d: 'Séptima pregunta', t: 'A', T: { kicker: 'Pregunta 7 · ¿Diabética?', title: 'Primero, consulte a su médico', hot: ['médico'] } },
  { d: 'En los pies con diabetes hay que tener mucho cuidado', t: 'C', c: { kind: 'checklist', kicker: 'Con diabetes', title: 'Mucho cuidado con los pies', hot: ['cuidado'], items: ['Revíselos cada día', 'No se corte los callos', 'Grieta que no cierra: consulte'], hits: ['revíselos todos los días', 'no se corte los callos', 'si una grieta no cierra'], iq: 'senior woman feet check' } },
  { d: 'Y una cosa que vale para todas', t: 'C', c: { kind: 'steps', kicker: 'La primera vez', title: 'Pruébela en el antebrazo', hot: ['antebrazo'], steps: [{ title: 'Un poquito', sub: 'en el antebrazo, de noche' }, { title: 'A la mañana', sub: 'mire la piel' }, { title: 'Sin ronchas', sub: 'ni ardor: a los pies' }], hits: ['pruébela en el antebrazo', 'Si a la mañana la piel está bien', 'puede usarla en los pies'], iq: 'senior woman forearm skin' } },
]},
{ id: 'esperar', m: [
  { d: 'Ahora, qué puede esperar, noche a noche', t: 'A', T: { kicker: 'Noche a noche', title: 'Qué puede esperar', hot: ['esperar'] } },
  { d: 'La primera mañana', t: 'C', c: { kind: 'timeline', kicker: 'Noche a noche', title: 'Qué puede esperar', days: [{ day: '1.ª mañana', text: 'Talones blandos' }, { day: '3.ª noche', text: 'Piel dura más fina' }, { day: '1 semana', text: 'Codos y rodillas suaves' }, { day: '1 mes', text: 'Se mantienen suaves' }], hits: ['La primera mañana', 'A la tercera noche', 'A la semana', 'Al mes'], iq: 'bedroom morning light window' } },
  { d: 'Y lo que no va a pasar', t: 'A', T: { stamp: 'NO ES MAGIA', title: 'No borra arrugas, no aclara la cara' } },
]},
{ id: 'cta2', m: [
  { d: 'Le cuento algo que me pasa seguido', t: 'A' },
  { d: 'Después de cada video, muchas de ustedes', t: 'V', q: ['senior woman writing notes watching tv', 'elderly woman writing in notebook at table'] },
  { d: 'Por eso armé ese recetario', t: 'C', c: { kind: 'qrcta', kicker: 'El recetario de la doctora', title: 'Pies, manos, codos y cara, por escrito', hot: ['escrito'], sub: 'y en qué orden va cada cosa' } },
]},
{ id: 'bano', m: [
  { d: 'Ahora, el baño de pies de antes', t: 'A', T: { kicker: 'El baño de pies de antes', title: 'Para que la mezcla rinda el doble', hot: ['doble'] } },
  { d: 'Dos veces por semana, antes de la mezcla', t: 'G', p: `${FEET} soaking in a white enamel basin of warm water with two chamomile tea bags floating, on a tiled floor, a folded towel beside the basin, soft daylight. EMPTY: only the feet and lower legs, no face`,
    x: [{ at: 'con dos bolsitas de manzanilla', q: ['chamomile tea bags water', 'feet soaking basin water'] }] },
  { d: 'Pruebe la temperatura con el codo', t: 'C', c: { kind: 'steps', kicker: 'El baño de manzanilla', title: 'Antes de la mezcla', hot: ['mezcla'], steps: [{ title: 'Con el codo', sub: 'nunca con el pie' }, { title: 'Secar muy bien', sub: 'entre los dedos' }, { title: 'Y recién ahí', sub: 'vaselina, limón y medias' }], hits: ['Pruebe la temperatura con el codo', 'Séquelos muy bien', 'Y recién ahí'], iq: 'chamomile tea bags' } },
]},
{ id: 'secretos', m: [
  { d: 'Y ya que estamos, le doy tres secretos', t: 'C', c: { kind: 'trio', kicker: 'Para que rinda más', title: 'Tres secretos', hot: ['secretos'], methods: [{ name: 'Sentada', desc: 'sin pisar el suelo', icon: 'moon' }, { name: 'Lima en seco', desc: 'nunca cuchillas', icon: 'brush' }, { name: 'Cutículas', desc: 'lo que queda en los dedos', icon: 'hand' }], iq: 'bedroom bed edge' } },
  { d: 'El primero: siempre sentada', t: 'V', q: ['senior woman sitting on bed', 'elderly woman sitting bed bedroom'] },
  { d: 'El segundo: la piel dura se lima en seco', t: 'V', q: ['foot file heel', 'pumice stone foot'] },
  { d: 'El tercero: lo que le queda en los dedos', t: 'V', q: ['cuticle cream fingers', 'massaging cuticles nails'] },
]},
{ id: 'mitos', m: [
  { d: 'Antes de seguir, quiero desarmar tres mitos', t: 'A', T: { kicker: 'Antes de seguir', title: 'Tres mitos que leo todo el tiempo', hot: ['mitos'] } },
  { d: 'Primer mito', t: 'C', c: { kind: 'myth', kicker: 'Mito 1', statement: 'La vaselina es mala', truth: 'En pies, codos y piel seca, de lo mejor', verdict: 'FALSO', hits: ['En los pies'], iq: 'petroleum jelly jar' } },
  { d: 'Segundo mito', t: 'A', T: { kicker: 'Mito 2', title: 'El limón no blanquea: con sol mancha', hot: ['mancha'] } },
  { d: 'Tercer mito', t: 'C', c: { kind: 'myth', kicker: 'Mito 3', statement: 'Natural no hace daño', truth: 'El limón es natural y puede quemar', verdict: 'FALSO', hits: ['Falso'], iq: 'lemons on kitchen table' } },
]},
{ id: 'cuidados', m: [
  { d: 'Y ahora, cuidados importantes', t: 'A', T: { stamp: 'CUIDADOS', title: 'Lo que no se saltea' } },
  { d: 'Si tiene alergia a los cítricos', t: 'C', c: { kind: 'redflags', kicker: 'Cuidados', title: 'No la use si…', hot: ['No'], items: ['Alergia a los cítricos', 'Heridas o grietas abiertas', 'Arde o se enrojece'], hits: ['Si tiene alergia a los cítricos', 'Nunca la ponga sobre heridas', 'si al ponérsela siente ardor'], iq: 'washing hands soap sink' } },
]},
{ id: 'carmen2', m: [
  { d: 'Le quiero contar cómo terminó la historia de Carmen', t: 'V', q: ['senior woman garden gloves', 'elderly woman gardening'] },
  { d: 'Carmen dejó el limón lejos de la cara', t: 'A', T: { kicker: 'Carmen, la segunda vez', title: 'Protector, guantes, y la mezcla en los talones', hot: ['talones'] } },
  { d: 'Y me mandó un mensaje hace poco', t: 'C', c: { kind: 'quote', quote: 'Doctora, a la tercera noche me toqué los talones y no lo podía creer.', attrib: 'Carmen, 68 años', iq: 'senior woman smiling phone' } },
  { d: 'Eso, créame, es lo lindo', t: 'A', T: { kicker: 'Créame', title: 'Lo lindo de las recetas de siempre', hot: ['siempre'] } },
]},
{ id: 'repaso', m: [
  { d: 'Hagamos un repaso rápido', t: 'V', q: ['writing checklist notebook pen', 'notebook list pen table'] },
  { d: 'Una cucharada de vaselina pura y diez gotas', t: 'C', c: { kind: 'recipe', kicker: 'Repaso rápido', title: 'Lo que se lleva', hot: ['lleva'], ing: [{ q: '1 cda', t: 'vaselina pura' }, { q: '10 gotas', t: 'limón fresco' }], steps: ['Talones, codos, cutículas', 'A la mañana, agua y jabón', 'En la cara, nunca limón'], hits: ['Una cucharada de vaselina pura', 'diez gotas de limón fresco', 'En los talones, los codos', 'A la mañana, agua y jabón', 'En la cara, nunca limón'], iq: 'lemons wooden table' } },
]},
{ id: 'cierre', m: [
  { d: 'Si este video le sirvió, guárdelo', t: 'A', T: { kicker: 'Compártalo', title: 'Con la amiga de los talones agrietados', hot: ['talones'] } },
  { d: 'Y si quiere tener todas las recetas', t: 'C', c: { kind: 'qrcta', kicker: 'El recetario de la doctora', title: 'Todas las recetas por escrito', hot: ['escrito'], sub: 'con las medidas exactas' } },
  { d: 'Las medidas de esta mezcla', t: 'V', q: ['senior woman reading phone screen', 'elderly woman using smartphone at home'] },
  { d: 'Y suscríbase al canal', t: 'A', T: { kicker: 'Suscríbase', title: 'Un secreto de siempre, cada semana', hot: ['semana'] },
    x: [{ at: 'explicados con honestidad', q: ['senior woman smiling kitchen', 'elderly woman happy home kitchen'] }] },
  { d: 'Esta noche, antes de acostarse', t: 'A', T: { kicker: 'Esta noche', title: 'Vaselina, diez gotas y medias de algodón', hot: ['medias'] } },
]},
];
