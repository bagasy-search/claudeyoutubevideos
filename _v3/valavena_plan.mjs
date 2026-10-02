// valavena_plan.mjs — §0 DIRECTOR · Doctora Valeria Alcázar · MONTAJE DR. FEDERER (FedKit)
// "Prepare Esta CREMA de AVENA y Póngala Antes de Dormir: Piel Suave y Firme"
// t: A avatar (T = título {kicker,title,hot,tone} o sello {stamp,title}) · V stock video · F foto · H doctora · G generada · C componente FedKit
// GLOSARIO: Teresa = 66, Guadalajara → sólo stock de mayores / manos / objetos.
export const POT = 'a small stainless steel saucepan';
export const OATCREAM = 'smooth glossy off-white homemade oat cream with a soft gel texture';
export const HANDS = "an older woman's hands (about 65, natural wrinkles and a few age spots, short clean unpainted nails, no rings)";
export const SECCIONES = [
{ id: 'hook', m: [
  { d: 'Cinco cucharaditas de avena, una taza de agua', t: 'A', T: { kicker: 'Avena, agua y diez minutos', title: 'La crema que se pone antes de dormir', hot: ['dormir'] } },
  { d: 'Con eso se hace una crema blanca, suave', t: 'V', q: ['homemade face cream jar', 'cream jar spoon close up'] },
  { d: 'y a la mañana deja la piel como si hubiera dormido', t: 'V', q: ['senior woman waking up morning bed', 'elderly woman touching face morning'] },
  { d: 'Millones de mujeres la están haciendo', t: 'V', q: ['senior woman watching video smartphone', 'elderly woman phone sofa'] },
  { d: 'Pero casi todas la hacen con avena de sobre', t: 'C', c: { kind: 'redflags', kicker: 'Casi todas', title: 'La hacen mal', hot: ['mal'], items: ['Avena de sobre', 'Le ponen demasiado', 'La dejan en el baño'], hits: ['con avena de sobre', 'le ponen demasiado', 'la dejan en el baño'], iq: 'instant oatmeal packets' } },
]},
{ id: 'presenta', m: [
  { d: 'Yo soy la doctora Valeria Alcázar', t: 'A', T: { kicker: 'Dra. Valeria Alcázar', title: 'A qué hora, cuánto tiempo y cuánto dura', hot: ['hora,'] } },
  { d: 'Busque papel y lápiz', t: 'V', q: ['notebook and pencil on kitchen table', 'writing in notebook pencil'] },
]},
{ id: 'receta', m: [
  { d: 'Primero, lo que necesita', t: 'C', c: { kind: 'recipe', kicker: 'Paso 1 · Lo que necesita', title: 'Avena simple, nada más', hot: ['simple,'], ing: [{ q: '5 cdtas', t: 'avena en hojuelas, sin azúcar' }, { q: '1 taza', t: 'agua' }, { q: '1 cdta', t: 'aceite de almendras' }, { q: '2', t: 'cápsulas de vitamina E' }], steps: ['Remojar 10 min', 'Cocinar 2 min', 'Colar con tela', 'Terminar y a la heladera'], hits: ['Cinco cucharaditas de avena en hojuelas', 'Una taza de agua', 'Una cucharadita de aceite', 'dos cápsulas de vitamina E'], iq: 'rolled oats bowl wooden spoon' } },
  { d: 'Segundo, se remoja', t: 'V', q: ['oats in water bowl', 'rolled oats soaking'] },
  { d: 'Tercero, se cocina', t: 'G', p: `close-up on a gas stove in daylight: ${HANDS} stirring thick bubbling oatmeal with a wooden spoon in ${POT} over a medium blue flame. EMPTY: hands only, no face`,
    x: [{ at: 'Después apague el fuego y siga revolviendo', q: ['stirring oatmeal pot', 'cooking oatmeal stove'] }] },
  { d: 'Cuarto, se cuela', t: 'G', p: `close-up on a kitchen counter in daylight: ${HANDS} squeezing a clean white cotton cloth bundle of cooked oats over a small glass bowl, a smooth off-white oat gel dripping into the bowl. EMPTY: hands only, no face`,
    x: [{ at: 'Lo que queda en la tela, guárdelo', q: ['cheesecloth cooked oats', 'cloth strainer bowl'] }] },
  { d: 'Quinto, se termina', t: 'C', c: { kind: 'steps', kicker: 'Paso 5', title: 'Se termina y se guarda', hot: ['guarda'], steps: [{ title: 'Siete cucharadas', sub: 'de la crema colada' }, { title: 'Aceite y vitamina E', sub: 'y se bate' }, { title: 'Frasco hervido', sub: 'a la heladera, cinco días' }], hits: ['Tome siete cucharadas', 'y bata con un tenedor', 'Va a un frasco de vidrio'], iq: 'whisk bowl cream kitchen' } },
  { d: 'Esa es la receta completa', t: 'A', T: { kicker: 'La receta completa', title: 'Diez minutos, y menos de un dólar', hot: ['minutos,'] } },
]},
{ id: 'loops', m: [
  { d: 'Ahora, a qué hora se pone', t: 'C', c: { kind: 'questions', kicker: 'Hoy le respondo', title: 'Lo que nadie le explica', questions: ['¿A qué hora?', '¿Cuánto tiempo?', '¿Todos los días?', '¿Y lo de la tela?'], hits: ['a qué hora se pone', 'Cuánto tiempo se deja', 'todos los días', 'lo que queda en la tela'], iq: 'oats jar kitchen window' } },
  { d: 'Porque hay un error, uno solo', t: 'A', T: { stamp: 'UN ERROR', title: 'que le irrita la piel' } },
  { d: 'Se lo cuento en unos minutos', t: 'V', q: ['senior woman looking in bathroom mirror', 'elderly woman mirror reflection'] },
]},
{ id: 'porque', m: [
  { d: 'Empecemos por lo más importante', t: 'C', c: { kind: 'chapter', kicker: 'Primera parte', index: '01', title: 'Por qué la avena', hot: ['avena'], sub: 'lo casero que tiene respaldo', iq: 'oat field' } },
  { d: 'La avena es de los pocos ingredientes', t: 'A', T: { kicker: 'Avena coloidal', title: 'Aprobada como protector de la piel', hot: ['protector'] } },
  { d: 'Se usa en cremas y en baños', t: 'V', q: ['oatmeal bath', 'bath water bathtub relaxing'] },
  { d: 'Y no es casualidad', t: 'C', c: { kind: 'trio', kicker: 'Lo que tiene la avena', title: 'Tres cosas para la piel', hot: ['piel'], methods: [{ name: 'Beta glucano', desc: 'película que retiene el agua', icon: 'drop' }, { name: 'Avenantramidas', desc: 'calman la picazón', icon: 'hand' }, { name: 'Almidón y grasa', desc: 'para que no se reseque', icon: 'moon' }] , iq: 'rolled oats close up' } },
  { d: 'La primera, una fibra que se llama beta glucano', t: 'V', q: ['cooked oatmeal close up', 'oatmeal spoon texture'] },
  { d: 'Por eso la piel queda suave', t: 'V', q: ['senior woman touching smooth cheek', 'elderly woman touching face smiling'] },
  { d: 'La segunda, unas sustancias', t: 'A', T: { kicker: 'Avenantramidas', title: 'Calman la piel irritada y la picazón', hot: ['picazón'] } },
  { d: 'La tercera, el almidón', t: 'V', q: ['oat flour bowl', 'rolled oats spoon'] },
  { d: 'Así que la avena hidrata, calma y protege', t: 'C', c: { kind: 'chips', title: 'La avena…', chips: ['Hidrata', 'Calma', 'Protege', 'El aceite sella'], hits: ['la avena hidrata', 'calma', 'y protege', 'le suman el sello'], iq: 'almond oil bottle almonds' } },
  { d: 'Pero le voy a ser honesta', t: 'C', c: { kind: 'cross', kicker: 'Con honestidad', title: 'Lo que no hace', hot: ['no'], items: ['No blanquea la piel', 'No borra las manchas', 'No levanta la piel caída'], hits: ['No blanquea la piel', 'No borra las manchas', 'No levanta la piel caída'], iq: 'senior woman face natural light window' } },
  { d: 'Lo que sí hace, y muy bien', t: 'V', q: ['senior woman applying cream face', 'elderly woman face cream mirror'] },
]},
{ id: 'teresa', m: [
  { d: 'Le cuento el caso de una señora', t: 'C', c: { kind: 'story', kicker: 'Un caso real', name: 'Teresa', age: '66 años', detail: 'Guadalajara', iq: 'senior latin woman at home portrait' } },
  { d: 'Teresa vio la receta y la hizo con lo que tenía', t: 'G', p: 'a torn-open paper packet of instant flavored oatmeal with apple pieces and cinnamon spilling onto a kitchen counter next to a small saucepan, daylight. The packet is completely plain with no logo, no brand, no letters, no text. EMPTY: nobody',
    x: [{ at: 'Le salió una crema que olía riquísimo', q: ['cinnamon apple oatmeal bowl', 'oatmeal with apple cinnamon'] }] },
  { d: 'Y como le gustaba tanto, se la ponía gruesa', t: 'V', q: ['thick cream on fingers', 'applying thick cream face'] },
  { d: 'Y el frasco lo tenía en el baño', t: 'G', p: `a glass jar of homemade oat cream left on a steamy bathroom shelf right next to the shower, droplets of condensation on the jar and the tiles, warm humid light. EMPTY: nobody, no reflection of any person` },
  { d: 'A la semana, tenía la piel de las mejillas colorada', t: 'V', q: ['senior woman worried mirror skin', 'elderly woman touching cheek mirror'] },
  { d: 'Y me escribió: doctora', t: 'C', c: { kind: 'quote', quote: 'Doctora, ¿cómo puede ser que la avena me irritara?', attrib: 'Teresa, 66 años', iq: 'senior woman reading smartphone' } },
  { d: 'Le expliqué lo mismo que le explico a usted', t: 'A' },
]},
{ id: 'error', m: [
  { d: 'Y ahora sí, el error del que le hablé', t: 'C', c: { kind: 'chapter', kicker: 'El error', index: '02', title: 'Avena con azúcar o sabor', hot: ['azúcar'], sub: 'la que irrita y se echa a perder', tone: 'danger', iq: 'cinnamon sticks sugar' } },
  { d: 'La avena instantánea de sobre trae azúcar', t: 'C', c: { kind: 'board', title: '¿Cuál avena?', cards: [{ name: 'De sobre, con sabor', verdict: 'No', tone: 'danger' }, { name: 'En hojuelas, simple', verdict: 'Sí', tone: 'green' }], hits: ['La avena instantánea de sobre', 'La avena para la piel tiene que ser'], iqA: 'instant oatmeal packets', iqB: 'rolled oats jar' } },
  { d: 'Y Teresa cometió los otros dos errores', t: 'A', T: { kicker: 'Y dos errores más', title: 'Que veo todo el tiempo', hot: ['tiempo'] } },
  { d: 'El primero, la capa gruesa', t: 'C', c: { kind: 'split', title: 'Gruesa o finita', left: { label: 'Capa gruesa', text: 'Se seca, tira y raspa', tone: 'danger' }, right: { label: 'Capa finita', text: 'Suave a la mañana', tone: 'green' }, verdict: 'Capa finita, siempre', hits: ['Si queda gruesa', 'a la mañana deja la piel áspera'], iq: 'cream texture fingertip' } },
  { d: 'El segundo, guardarla en el baño', t: 'C', c: { kind: 'checklist', kicker: 'Error 2 · El baño', title: 'Dónde se guarda', hot: ['guarda'], items: ['Nunca en el baño', 'Siempre en la heladera', 'Con cucharita limpia'], hits: ['guardarla en el baño', 'Siempre en la heladera', 'se saca con una cucharita limpia'], iq: 'refrigerator shelf jars' } },
  { d: 'Y una señal que no falla', t: 'A', T: { stamp: 'SE TIRA', title: 'si cambia el olor, el color o aparece pelusa' } },
]},
{ id: 'lamina', m: [
  { d: 'Preste mucha atención a esta imagen', t: 'C', c: { kind: 'lamina', regions: [{ x: 0.19, y: 0.38, s: 2.0 }, { x: 0.5, y: 0.5, s: 1.7 }, { x: 0.82, y: 0.42, s: 1.9 }, { x: 0.19, y: 0.72, s: 2.0 }, { x: 0.5, y: 0.9, s: 1.9 }], hits: ['Arriba a la izquierda tiene lo que necesita', 'En el centro, los cinco pasos', 'A la derecha, cómo se usa', 'En el recuadro rojo', 'Y abajo de todo'] } },
  { d: 'Y dicho sea de paso', t: 'C', c: { kind: 'qrcta', kicker: 'El recetario de la doctora', title: 'La mascarilla está en el recetario', hot: ['mascarilla'], sub: 'con sesenta y seis recetas más' } },
]},
{ id: 'preguntas', m: [
  { d: 'Ahora déjeme responder las preguntas', t: 'A', T: { kicker: 'Leí cientos de comentarios', title: 'Lo que nadie responde', hot: ['nadie'] },
    x: [{ at: 'porque leí cientos de comentarios', q: ['senior woman reading tablet sofa', 'elderly woman reading laptop home'] }] },
  { d: 'Primera pregunta', t: 'C', c: { kind: 'myth', kicker: 'Pregunta 1', statement: '¿A qué hora se pone?', truth: 'De noche, antes de dormir, en capa finita.', verdict: 'DE NOCHE', tone: 'green', hits: ['De noche'], iq: 'bedroom night lamp' } },
  { d: 'Segunda pregunta', t: 'C', c: { kind: 'split', title: '¿Cuánto tiempo se deja?', left: { label: 'Piel normal o seca', text: 'Toda la noche', tone: 'green' }, right: { label: 'Piel grasa o con calor', text: 'Veinte minutos', tone: 'amber' }, verdict: 'A la mañana: agua tibia y protector', hits: ['Si su piel es grasa', 'déjela veinte minutos'], iq: 'alarm clock bedside' } },
  { d: 'Tercera pregunta', t: 'A', T: { kicker: 'Pregunta 3 · ¿Todos los días?', title: 'Sí, si la tolera bien', hot: ['Sí,'] } },
  { d: 'Cuarta pregunta', t: 'C', c: { kind: 'stat', kicker: 'Pregunta 4 · ¿Cuánto dura?', value: '5 días', unit: 'en la heladera', caption: 'frasco hervido · haga poquito', iq: 'refrigerator glass jar' } },
  { d: 'Quinta pregunta', t: 'C', c: { kind: 'steps', kicker: 'Pregunta 5 · Lo de la tela', title: 'La mascarilla de esa noche', hot: ['mascarilla'], steps: [{ title: 'Avena de la tela', sub: 'más una cucharadita de miel' }, { title: 'Diez o quince minutos', sub: 'y agua tibia' }], hits: ['más una cucharadita de miel', 'Diez o quince minutos'], iq: 'honey jar spoon' } },
  { d: 'Sexta pregunta', t: 'A', T: { kicker: 'Pregunta 6 · ¿Alérgica a la vaselina?', title: 'Esta no lleva derivados del petróleo', hot: ['petróleo'] } },
  { d: 'Es avena, agua, aceite de almendras', t: 'A' },
  { d: 'Séptima pregunta', t: 'C', c: { kind: 'zones', kicker: 'Pregunta 7', title: '¿Alrededor de los ojos?', hot: ['ojos?'], zones: [{ label: 'Sobre el hueso', x: 64, y: 49 }, { label: 'Párpado', x: 36, y: 43, no: true }], note: 'Con el anular, a toquecitos', hits: ['sobre el hueso de abajo del ojo', 'Nunca en el párpado'], iq: 'senior woman eye close up' } },
  { d: 'Y una cosa que vale para todas', t: 'C', c: { kind: 'steps', kicker: 'La primera vez', title: 'Pruébela en el antebrazo', hot: ['antebrazo'], steps: [{ title: 'Un poquito', sub: 'en el antebrazo' }, { title: 'Toda la noche', sub: 'y a la mañana mire' }, { title: 'Sin ronchas', sub: 'ni picazón: a la cara' }], hits: ['pruébela en el antebrazo', 'déjela toda la noche', 'si a la mañana la piel está bien'], iq: 'senior woman forearm skin' } },
]},
{ id: 'esperar', m: [
  { d: 'Ahora, qué puede esperar, noche a noche', t: 'A', T: { kicker: 'Noche a noche', title: 'Qué puede esperar', hot: ['esperar'] } },
  { d: 'La primera mañana', t: 'C', c: { kind: 'timeline', kicker: 'Noche a noche', title: 'Qué puede esperar', days: [{ day: '1.ª mañana', text: 'Más suave, menos tirante' }, { day: '1 semana', text: 'Más calmada' }, { day: '3 semanas', text: 'Más pareja y cómoda' }], hits: ['La primera mañana', 'A la semana', 'A las tres semanas'], iq: 'bedroom morning light window' } },
  { d: 'Y lo que no va a pasar', t: 'A', T: { stamp: 'NO ES MAGIA', title: 'No levanta, no borra, no blanquea' } },
]},
{ id: 'cta2', m: [
  { d: 'Le cuento algo que me pasa seguido', t: 'A' },
  { d: 'Después de cada video, muchas de ustedes', t: 'V', q: ['senior woman writing notes watching tv', 'elderly woman writing in notebook at table'] },
  { d: 'Por eso armé ese recetario', t: 'C', c: { kind: 'qrcta', kicker: 'El recetario de la doctora', title: 'Las recetas de la noche, por escrito', hot: ['escrito'], sub: 'y las mascarillas, en orden' } },
]},
{ id: 'mascarilla', m: [
  { d: 'Ahora, la mascarilla con lo que quedó en la tela', t: 'A', T: { kicker: 'Con lo que quedó en la tela', title: 'La mascarilla de avena y miel', hot: ['miel'] } },
  { d: 'Junte en un tazón dos cucharadas', t: 'G', p: `close-up on a kitchen counter in daylight: ${HANDS} mixing two spoonfuls of soft cooked oats with a teaspoon of golden honey in a small white ceramic bowl, a honey jar with a dipper beside. EMPTY: hands only, no face`,
    x: [{ at: 'Agregue una cucharadita de miel', q: ['honey dripping spoon', 'honey jar dipper'] }] },
  { d: 'Extiéndala con los dedos en capa fina', t: 'V', q: ['woman applying oatmeal face mask', 'face mask application fingers'] },
  { d: 'Y después, su crema de avena, y a dormir', t: 'V', q: ['senior woman going to sleep bed', 'elderly woman bedtime lamp'] },
  { d: 'Si tiene alergia a la miel', t: 'A', T: { kicker: 'Alergia a la miel o al polen', title: 'Sólo avena y agua tibia', hot: ['agua'] } },
]},
{ id: 'secretos', m: [
  { d: 'Y ya que estamos, le doy tres secretos', t: 'C', c: { kind: 'trio', kicker: 'Para que rinda más', title: 'Tres secretos', hot: ['secretos'], methods: [{ name: 'Piel húmeda', desc: 'la avena atrapa el agua', icon: 'drop' }, { name: 'Cuello y manos', desc: 'de abajo hacia arriba', icon: 'hand' }, { name: 'Sin frotar', desc: 'a toquecitos', icon: 'brush' }], iq: 'bathroom towel daylight' } },
  { d: 'El primero: póngala sobre la piel apenas húmeda', t: 'V', q: ['patting face dry towel', 'senior woman towel face'] },
  { d: 'El segundo: lo que le queda en los dedos', t: 'V', q: ['applying cream on neck upward', 'senior woman hands lotion'] },
  { d: 'El tercero: no la frote', t: 'V', q: ['patting cream on face fingertips', 'gentle tapping face skin'] },
]},
{ id: 'mitos', m: [
  { d: 'Antes de seguir, quiero desarmar tres mitos', t: 'A', T: { kicker: 'Antes de seguir', title: 'Tres mitos que leo todo el tiempo', hot: ['mitos'] } },
  { d: 'Primer mito', t: 'C', c: { kind: 'myth', kicker: 'Mito 1', statement: 'La crema de avena blanquea', truth: 'La deja luminosa porque la hidrata y la calma', verdict: 'FALSO', hits: ['Falso'], iq: 'rolled oats close up' } },
  { d: 'Segundo mito', t: 'A', T: { kicker: 'Mito 2', title: 'Más espesa no es mejor', hot: ['mejor'] } },
  { d: 'Tercer mito', t: 'C', c: { kind: 'myth', kicker: 'Mito 3', statement: 'Es natural, dura para siempre', truth: 'Es comida: cinco días en la heladera', verdict: 'FALSO', hits: ['Falso Es comida'], iq: 'calendar kitchen wall' } },
]},
{ id: 'cuidados', m: [
  { d: 'Y ahora, cuidados importantes', t: 'A', T: { stamp: 'CUIDADOS', title: 'Lo que no se saltea' } },
  { d: 'Si tiene alergia a la avena', t: 'C', c: { kind: 'redflags', kicker: 'Cuidados', title: 'No la use si…', hot: ['No'], items: ['Alergia a avena, almendras o miel', 'Heridas o granitos abiertos', 'Arde, pica o se enrojece'], hits: ['Si tiene alergia a la avena', 'Nunca la ponga sobre heridas', 'si al ponérsela siente ardor'], iq: 'washing hands kitchen sink' } },
]},
{ id: 'teresa2', m: [
  { d: 'Le quiero contar cómo terminó la historia de Teresa', t: 'V', q: ['senior woman cooking kitchen', 'elderly woman kitchen stove'] },
  { d: 'Teresa tiró la crema de sabor manzana', t: 'C', c: { kind: 'steps', kicker: 'Teresa, la segunda vez', title: 'Así lo hizo', hot: ['Así'], steps: [{ title: 'Cuatro días', sub: 'sólo agua tibia' }, { title: 'Avena simple', sub: 'en hojuelas, sin nada' }], hits: ['Dejó descansar la piel cuatro días', 'una bolsa de avena en hojuelas'], iq: 'rolled oats bag kitchen' } },
  { d: 'Se la pone de noche, en capa finita', t: 'V', q: ['senior woman applying night cream', 'elderly woman face cream bedtime'] },
  { d: 'Y me mandó un mensaje hace poco', t: 'C', c: { kind: 'quote', quote: 'Doctora, se me fue lo colorado, y la siento suavecita.', attrib: 'Teresa, 66 años', iq: 'senior woman smiling phone' } },
  { d: 'Eso, créame, es lo lindo', t: 'A', T: { kicker: 'Créame', title: 'Lo lindo de las recetas de siempre', hot: ['siempre'] } },
]},
{ id: 'repaso', m: [
  { d: 'Hagamos un repaso rápido', t: 'V', q: ['writing checklist notebook pen', 'notebook list pen table'] },
  { d: 'Cinco cucharaditas de avena en hojuelas, sin azúcar', t: 'C', c: { kind: 'recipe', kicker: 'Repaso rápido', title: 'Lo que se lleva', hot: ['lleva'], ing: [{ q: '5 cdtas', t: 'avena en hojuelas, simple' }, { q: '1 taza', t: 'agua' }], steps: ['Remojar, cocinar y colar', '7 cdas + aceite + 2 cápsulas', 'Frasco hervido, heladera', 'Dura cinco días', 'De noche, capa finita'], hits: ['Cinco cucharaditas de avena en hojuelas', 'y una taza de agua', 'Se remoja', 'Siete cucharadas de esa crema', 'va a un frasco hervido', 'Dura cinco días', 'De noche, capa finita'], iq: 'oatmeal bowl wooden table' } },
  { d: 'Y con lo que queda en la tela, la mascarilla', t: 'A', T: { kicker: 'Y con lo de la tela', title: 'La mascarilla de avena y miel', hot: ['miel'] } },
]},
{ id: 'cierre', m: [
  { d: 'Si este video le sirvió, guárdelo', t: 'A', T: { kicker: 'Compártalo', title: 'Con la amiga de piel seca', hot: ['seca'] } },
  { d: 'Y si quiere tener todas las recetas', t: 'C', c: { kind: 'qrcta', kicker: 'El recetario de la doctora', title: 'Todas las recetas por escrito', hot: ['escrito'], sub: 'con las medidas exactas' } },
  { d: 'Las medidas de esta crema', t: 'V', q: ['senior woman reading phone screen', 'elderly woman using smartphone at home'] },
  { d: 'Y suscríbase al canal', t: 'A', T: { kicker: 'Suscríbase', title: 'Un secreto de siempre, cada semana', hot: ['semana'] },
    x: [{ at: 'explicados con honestidad', q: ['senior woman smiling kitchen', 'elderly woman happy home kitchen'] }] },
  { d: 'Esta noche, cuando abra la alacena', t: 'A', T: { kicker: 'Esta noche', title: 'Avena, diez minutos, toda la semana', hot: ['semana'] } },
]},
];
