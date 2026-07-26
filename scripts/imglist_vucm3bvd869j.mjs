// imglist_vucm3bvd869j.mjs — arma la lista de imágenes gpt-image-2 para el video del hormigueo.
// Estilo: foto casera real (celular), luz natural, imperfecciones. NADA de render 3D ni ilustración.
import fs from "fs";

const S = ", fotografia real tomada con celular, luz natural realista, grano leve, imperfecciones reales, sin texto ni letras, fotorrealista, no ilustracion, no render 3d, formato horizontal cinematografico";
const NOCHE = ", escena nocturna, poca luz calida de velador, sombras suaves";

// Ramón: 72 años, argentino, ex colectivero. Pelo blanco corto, bigote canoso, camisa a cuadros gastada,
// contextura media, manos grandes de trabajo. Se re-describe IGUAL en cada prompt (coherencia).
const R = "un hombre argentino de 72 anos, pelo blanco corto, bigote canoso, cara curtida y amable, camisa a cuadros gastada, contextura media, manos grandes de trabajador";

const P = [
  // ── HOOK / herida (0-2 min) ──────────────────────────────────────────────
  ["hk_pies_manta", `primer plano de los pies descalzos de un hombre mayor asomando debajo de una manta de lana en una cama${NOCHE}${S}`],
  ["hk_planta_pie", `primer plano cenital de la planta del pie de un hombre mayor sobre una sabana blanca arrugada${NOCHE}${S}`],
  ["hk_reloj_3am", `primer plano de un despertador de mesa de luz antiguo marcando las tres y diez de la madrugada, fondo oscuro de dormitorio${NOCHE}${S}`],
  ["hk_almohada", `cabeza de un hombre mayor apoyada en una almohada blanca, ojos abiertos mirando al techo${NOCHE}${S}`],
  ["hk_cocina_ventana", `una cocina modesta de casa argentina de noche, una silla vacia junto a la mesa, ventana con la persiana entreabierta${NOCHE}${S}`],
  ["hk_mate_frio", `un mate de calabaza con bombilla apoyado sobre una mesa de cocina, ya frio, primer plano, madrugada${S}`],
  ["hk_ramon_ventana", `${R} sentado a la mesa de la cocina mirando por la ventana de madrugada, tomando mate${NOCHE}${S}`],
  ["hk_pies_piso_frio", `pies descalzos de un hombre mayor caminando sobre las baldosas frias de una cocina de noche${NOCHE}${S}`],
  ["hk_consultorio_reloj", `sala de espera de un consultorio medico con sillas vacias y un reloj de pared, luz fria de tubo${S}`],
  ["hk_ramon_esposa", `${R} y su esposa mayor conversando preocupados en la cocina de su casa, luz de la manana${S}`],
  ["hk_medias_puestas", `un hombre mayor sentado en la camilla de un consultorio con los zapatos puestos y las medias sin sacar, plano medio${S}`],
  ["hk_carpeta_estudios", `manos de un hombre mayor sosteniendo una carpeta de estudios medicos con papeles de laboratorio, mesa de cocina${S}`],

  // ── principio: el cable / el nervio ──────────────────────────────────────
  ["nv_cable_pelado", `primer plano macro de un cable electrico viejo con la cubierta plastica pelada y los hilos de cobre a la vista, sobre una mesa de taller${S}`],
  ["nv_cable_largo", `un cable electrico largo enrollado sobre el piso de un taller, tono oscuro, primer plano${S}`],
  ["nv_pierna_hombre", `pierna de un hombre mayor sentado al borde de la cama, desde la rodilla hasta el pie descalzo${NOCHE}${S}`],
  ["nv_media_invisible", `pie y tobillo de un hombre mayor con una media de algodon a media pantorrilla, sentado en la cama${S}`],
  ["nv_dedos_pie", `primer plano de los dedos del pie de un hombre mayor sobre una toalla blanca, luz suave de ventana${S}`],

  // ── por qué de noche: la bomba de la pantorrilla ─────────────────────────
  ["pn_caminar_vereda", `hombre mayor caminando por la vereda de un barrio argentino visto desde atras, de dia${S}`],
  ["pn_pantorrilla", `primer plano de la pantorrilla de una persona mayor caminando, musculo trabajando, luz de dia${S}`],
  ["pn_tele_encendida", `living modesto con un televisor encendido de noche y un sillon vacio, luz azulada${NOCHE}${S}`],
  ["pn_casa_silencio", `pasillo oscuro de una casa modesta de noche, una sola luz encendida al fondo${NOCHE}${S}`],
  ["pn_bomba_agua", `una bomba de agua manual vieja de metal en un patio, primer plano, luz de tarde${S}`],

  // ── consultorio: se saca las medias ──────────────────────────────────────
  ["cs_ramon_camilla", `${R} sentado en una camilla de consultorio medico sacandose las medias, luz clinica suave${S}`],
  ["cs_pierna_sin_pelo", `primer plano de la pierna de un hombre mayor de la rodilla al tobillo, piel brillante y seca, consultorio${S}`],
  ["cs_unas_gruesas", `primer plano de los pies de un hombre mayor con unas gruesas y amarillentas, sobre una camilla${S}`],
  ["cs_manos_medico", `manos de un medico examinando el pie de un paciente mayor sobre una camilla, guantes no, luz clinica${S}`],
  ["cs_lampara_pie", `una lampara de consultorio iluminando el pie de un paciente mayor sobre la camilla${S}`],

  // ── causa 1: azúcar ──────────────────────────────────────────────────────
  ["az_pan_mesa", `una panera con pan frances sobre la mesa de una cocina argentina, luz de la manana${S}`],
  ["az_azucarera", `una azucarera de vidrio abierta con una cuchara llena de azucar, mesa de cocina, luz de ventana${S}`],
  ["az_glucometro", `un glucometro apoyado sobre la mesa junto a una tira reactiva, primer plano, luz de cocina${S}`],
  ["az_analisis_papel", `una hoja de resultados de laboratorio sobre una mesa de madera junto a unos anteojos de leer, primer plano desenfocado${S}`],
  ["az_tubos_sangre", `tubos de ensayo con muestras de sangre en una gradilla de laboratorio, primer plano, luz clinica${S}`],
  ["az_capilares", `macro extremo de una hoja verde a contraluz mostrando su red de nervaduras finisimas${S}`],
  ["az_caminata_cena", `pareja mayor caminando despacio por la vereda de un barrio despues de cenar, luz de faroles${NOCHE}${S}`],
  ["az_mesa_vueltas", `${R} caminando alrededor de la mesa del comedor de su casa, movimiento suave, luz calida de noche${S}`],
  ["az_plato_cena", `un plato de comida casera terminado sobre la mesa de una cocina, luz calida de noche${S}`],
  ["az_reloj_cocina", `un reloj de pared de cocina marcando las nueve y media de la noche${S}`],

  // ── causa 2: B12 y medicamentos ──────────────────────────────────────────
  ["b12_blister", `un blister de pastillas blancas sobre la mesa de luz junto a un vaso de agua${S}`],
  ["b12_frascos_mesa", `varios frascos de suplementos y medicamentos alineados sobre la mesa de una cocina, luz de ventana${S}`],
  ["b12_pastillero", `un pastillero semanal de plastico abierto con pastillas de colores, mesa de cocina${S}`],
  ["b12_vaso_agua", `una mano de persona mayor sosteniendo un vaso de agua con una pastilla, primer plano${S}`],
  ["b12_higado_carne", `carne roja cruda y higado sobre una tabla de madera en una cocina casera${S}`],
  ["b12_huevos_canasta", `huevos frescos en una canasta de mimbre sobre la mesada de una cocina${S}`],
  ["b12_farmacia_mostrador", `mostrador de una farmacia de barrio con cajas de medicamentos, luz de tubo${S}`],
  ["b12_receta_manuscrita", `una receta medica manuscrita sobre un escritorio junto a una lapicera${S}`],
  ["b12_estomago_te", `una taza de te y una botella de agua sobre una mesa de cocina, luz de la manana${S}`],

  // ── causa 3: circulación ─────────────────────────────────────────────────
  ["ci_vidriera", `${R} parado frente a la vidriera de un negocio de barrio, mirando, de dia${S}`],
  ["ci_vereda_cuadras", `vereda larga de un barrio argentino vista en perspectiva, arboles y frentes de casas, dia nublado${S}`],
  ["ci_pie_frio_mano", `una mano tocando el empeine del pie de una persona mayor sentada en una silla${S}`],
  ["ci_manguera_doblada", `una manguera de jardin doblada y aplastada sobre el pasto, el agua no pasa, primer plano${S}`],
  ["ci_camion_reparto", `un camion de reparto viejo estacionado en una calle de barrio, luz de tarde${S}`],
  ["ci_piernas_pared", `piernas de una persona mayor apoyadas rectas contra la pared del dormitorio, acostada en la cama${S}`],
  ["ci_piernas_colgando", `una persona mayor sentada al borde de la cama con las piernas colgando, plano de las piernas${S}`],
  ["ci_tensiometro_tobillo", `un manguito de tensiometro colocado en el tobillo de un paciente sobre una camilla, consultorio${S}`],
  ["ci_tensiometro_brazo", `un tensiometro digital midiendo la presion en el brazo de un paciente mayor${S}`],
  ["ci_herida_lenta", `un dedo del pie de una persona mayor con una curita, primer plano suave sobre una toalla${S}`],

  // ── causa 4: hierro / piernas inquietas ──────────────────────────────────
  ["fe_lentejas", `un plato hondo con lentejas guisadas caseras sobre la mesa de una cocina argentina${S}`],
  ["fe_limon_tomate", `medio limon exprimido y un tomate cortado sobre una tabla de madera en una cocina${S}`],
  ["fe_carne_plancha", `un bife de carne roja cocinandose en una plancha de hierro en una cocina casera${S}`],
  ["fe_mate_termo", `un mate y un termo sobre la mesa de una cocina, luz de la tarde${S}`],
  ["fe_piernas_sabanas", `piernas de una persona mayor moviendose inquietas entre las sabanas de una cama${NOCHE}${S}`],
  ["fe_morron_rojo", `un morron rojo entero y medio morron cortado sobre una tabla de madera, cocina casera${S}`],
  ["fe_ferritina_papel", `una planilla de resultados de laboratorio sobre una mesa con un boligrafo marcando un valor${S}`],
  ["fe_taza_cafe", `una taza de cafe negro humeante sobre la mesa del desayuno, luz de la manana${S}`],

  // ── causa 5: columna ─────────────────────────────────────────────────────
  ["co_carrito_super", `una persona mayor empujando un carrito en el pasillo de un supermercado, vista de espaldas${S}`],
  ["co_espalda_baja", `hombre mayor de espaldas con la mano apoyada en la zona lumbar, en el living de su casa${S}`],
  ["co_inclinado_banco", `una persona mayor sentada inclinada hacia adelante en un banco de plaza${S}`],
  ["co_kinesiologia", `sesion de kinesiologia con un paciente mayor haciendo un ejercicio suave sobre una colchoneta${S}`],
  ["co_radiografia_luz", `una radiografia de columna lumbar colgada en un negatoscopio en un consultorio${S}`],
  ["co_manguera_pisada", `una manguera de jardin pisada por la rueda de una carretilla sobre tierra${S}`],

  // ── señales de alerta ────────────────────────────────────────────────────
  ["al_guardia_entrada", `entrada de una guardia de hospital de noche con la luz encendida${NOCHE}${S}`],
  ["al_ambulancia", `una ambulancia estacionada en la puerta de un hospital de noche, luces encendidas${NOCHE}${S}`],
  ["al_espejito_piso", `un espejo de mano apoyado en el piso del bano junto a un pie descalzo, luz calida${S}`],
  ["al_linterna_pie", `una mano sosteniendo una linterna chica iluminando el pie descalzo de una persona sentada en la cama${NOCHE}${S}`],
  ["al_reloj_minutos", `un reloj de pulsera antiguo de cerca marcando los segundos, fondo oscuro${S}`],
  ["al_escalera_casa", `una escalera interior de casa con un pasamanos de madera, vista desde abajo${S}`],

  // ── el remedio: ajo ──────────────────────────────────────────────────────
  ["rm_cabeza_ajo", `una cabeza de ajo entera y varios dientes sueltos sobre una tabla de madera en una cocina casera${S}`],
  ["rm_ajo_machacado", `ajo machacado con el lado plano de un cuchillo sobre una tabla de madera, cocina casera${S}`],
  ["rm_ajo_reposo", `dientes de ajo machacados descansando sobre una tabla de madera junto a un reloj de cocina${S}`],
  ["rm_sarten_caliente", `una sarten de hierro caliente con aceite sobre la hornalla de una cocina casera${S}`],
  ["rm_ajo_sarten", `ajo picado cayendo en una sarten con aceite caliente, vapor, cocina casera${S}`],
  ["rm_ajo_pan", `una tostada con ajo y aceite de oliva sobre un plato en una mesa de cocina${S}`],
  ["rm_tabla_cuchillo", `una tabla de madera y un cuchillo de cocina usados sobre la mesada, luz de ventana${S}`],
  ["rm_anticoagulante", `un blister de pastillas pequenas junto a un vaso de agua sobre una mesa de luz${S}`],

  // ── remedio 2: agua tibia + tobillos ─────────────────────────────────────
  ["ag_palangana", `una palangana de plastico con agua tibia en el piso del bano junto a una toalla${S}`],
  ["ag_pies_agua", `los pies de una persona mayor sumergidos en una palangana con agua tibia, piso del bano${S}`],
  ["ag_codo_agua", `un codo probando la temperatura del agua en una palangana, primer plano${S}`],
  ["ag_toalla_dedos", `manos secando con una toalla blanca entre los dedos de un pie, sentado en el borde de la cama${S}`],
  ["ag_tobillo_punta", `pie de una persona mayor haciendo el movimiento de punta y talon, acostada en la cama${S}`],
  ["ag_termometro_agua", `un termometro de bano flotando en una palangana con agua, primer plano${S}`],

  // ── el error: la B6 ──────────────────────────────────────────────────────
  ["er_gondola_suplementos", `gondola de una farmacia llena de frascos de suplementos vitaminicos, luz de tubo${S}`],
  ["er_frasco_mano", `mano de una persona mayor sosteniendo un frasco de vitaminas y leyendo la etiqueta${S}`],
  ["er_frascos_mesa_luz", `cuatro frascos de suplementos distintos sobre una mesa de luz junto a un vaso de agua${NOCHE}${S}`],
  ["er_lupa_etiqueta", `una lupa sobre la etiqueta de un frasco de suplementos, primer plano, sin texto legible${S}`],
  ["er_papelito_anotado", `un papel con anotaciones a mano y una lapicera sobre la mesa de la cocina, escritura no legible${S}`],
  ["er_energizante_lata", `una lata de bebida energizante y un frasco de vitaminas sobre la mesada de una cocina${S}`],
  ["er_mesita_noche", `una mesa de luz de dormitorio con frascos de pastillas, un vaso de agua y un velador encendido${NOCHE}${S}`],

  // ── Ramón vuelve / cierre ────────────────────────────────────────────────
  ["fn_ramon_dormido", `${R} durmiendo tranquilo en su cama, manta hasta el pecho, luz suave de madrugada${S}`],
  ["fn_ramon_sonrie", `${R} sentado en una camilla de consultorio, sonriendo aliviado, luz clinica suave${S}`],
  ["fn_zapatos_piso", `un par de zapatos de hombre mayor y las medias al lado, en el piso de un consultorio${S}`],
  ["fn_cuaderno_numeros", `un cuaderno abierto con una tabla dibujada a mano y una lapicera sobre la mesa de la cocina${S}`],
  ["fn_ventana_amanecer", `la ventana de una cocina modesta con la primera luz del amanecer entrando${S}`],
  ["fn_pies_cama_calma", `los pies de una persona mayor quietos debajo de la manta en una cama, luz tenue de amanecer${S}`],
  ["fn_madrugada_reloj", `un despertador de mesa de luz marcando las cuatro de la madrugada, dormitorio a oscuras${NOCHE}${S}`],

  // ── recurso: retratos del presentador (con ref del avatar) ───────────────
  ["dr_escritorio", `un medico de unos 40 anos con ambo azul y estetoscopio sentado en su consultorio moderno, escribiendo en una libreta${S}`, "public/ref_vucm3bvd869j.png"],
  ["dr_examina_pie", `un medico de unos 40 anos con ambo azul examinando el pie de un paciente mayor sobre una camilla en un consultorio moderno${S}`, "public/ref_vucm3bvd869j.png"],
  ["dr_senala_pantalla", `un medico de unos 40 anos con ambo azul senalando una pantalla en la pared de su consultorio${S}`, "public/ref_vucm3bvd869j.png"],
  ["dr_orden_analisis", `un medico de unos 40 anos con ambo azul entregando una orden de analisis a un paciente mayor en el consultorio${S}`, "public/ref_vucm3bvd869j.png"],
];

const list = P.map(([name, prompt, ref]) => (ref ? { name, prompt, ref } : { name, prompt }));
fs.writeFileSync("_imgs_vucm3bvd869j.json", JSON.stringify(list, null, 1));
console.log("imágenes:", list.length);
