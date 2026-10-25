// _v3/t30cablees_cfg.mjs — «7 Cosas que Nunca Hago en Mi Casa…» · Maestro Ramiro (ES). Generado por D:/rtmp_t30cablees/tools/mk_cfg.py
// (tiempos de words.json). Ritmo Bertha: avatar 27 % en ventanas 3-6 s, b-roll 2,3-5,2 s (mediana ~3,6).
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 3.0;
export const AVATAR_WIN_MAX = 6.0;
export const AVATAR_CAND_MAX = 6.0;
export const AVATAR_OBJ = 0.27;
export const APERTURA_MIN = 3.0;
export const TRANSICIONES = true;
export const SECCIONES = [{"sec": "S1", "rol": "hook", "p0": 1, "p1": 4}, {"sec": "S2", "rol": "receta", "p0": 5, "p1": 8}, {"sec": "S3", "rol": "explica", "p0": 9, "p1": 12}, {"sec": "S4", "rol": "receta", "p0": 13, "p1": 16}, {"sec": "S5", "rol": "explica", "p0": 17, "p1": 21}, {"sec": "S6", "rol": "receta", "p0": 22, "p1": 24}, {"sec": "S7", "rol": "explica", "p0": 25, "p1": 28}, {"sec": "S8", "rol": "prueba", "p0": 29, "p1": 33}, {"sec": "S9", "rol": "cierre", "p0": 34, "p1": 38}];
const R = [3.6, 2.6, 4.4, 3.1, 5.0, 2.4, 3.9, 4.7, 2.9, 3.4, 5.2, 3.0];
export const ESCALERA = { hook: [2.4, 3.0, 2.6, 3.4, 2.3, 3.8, 2.8, 4.2, 2.5, 3.2, 2.7, 3.6], explica: R, receta: [...R].reverse(), prueba: [3.2, 4.6, 2.5, 3.8, 5.1, 2.8, 3.5, 4.2, 2.4, 3.9, 4.9, 3.1], cierre: R };
export const ORDEN_FORZADO = {};
export const OVERLAY = ['ActChip'];
export const IMPORTS = {"BigStat": "../backfire/BigStat", "FileStamp": "../backfire/FileStamp", "ActChip": "../backfire/ActChip", "SplitVs": "../backfire/SplitVs", "SceneCallout": "../backfire/SceneCallout", "PullQuote": "../backfire/PullQuote", "RayChecklist": "../rksafe/RayChecklist"};
export const BEDS = ["img/t30cablees_a09_pulpo.jpg", "img/t30cablees_a10_pulpo_tele.jpg", "img/t30cablees_a12_calentador.jpg", "img/t30cablees_a16_ext_derretida.jpg", "img/t30cablees_a17_contacto_pared.jpg", "img/t30cablees_a19_breakers.jpg", "img/t30cablees_a20_breaker_botado.jpg", "img/t30cablees_a21_breaker_grande.jpg", "img/t30cablees_a23_cable_quemado_pared.jpg", "img/t30cablees_a26_foco_cambiar.jpg", "img/t30cablees_a29_tester_brilla.jpg", "img/t30cablees_a33_cajon_cocina.jpg", "img/t30cablees_a34_contacto_tierra.jpg", "img/t30cablees_a39_gfci_bano.jpg", "img/t30cablees_a40_secadora_lavabo.jpg", "img/t30cablees_a43_socket_etiqueta.jpg", "img/t30cablees_a44_foco_filamento.jpg", "img/t30cablees_a48_led_base.jpg", "img/t30cablees_a49_lampara_recableada.jpg", "img/t30cablees_a50_cel_almohada.jpg", "img/t30cablees_a53_baterias.jpg", "img/t30cablees_a56_buro_cargando.jpg", "img/t30cablees_a57_cargador_barato.jpg", "img/t30cablees_a58_cargador_bueno.jpg", "img/t30cablees_a64_tablero_viejo.jpg", "img/t30cablees_a65_empalme_cinta.jpg", "img/t30cablees_a66_cinta_seca.jpg", "img/t30cablees_a67_caja_registro.jpg", "img/t30cablees_a69_casa_vuelta.jpg", "img/t30cablees_a70_casa_venta.jpg", "img/t30cablees_a71_tablero_abierto.jpg", "img/t30cablees_a72_taller_atardecer.jpg"];
export const COMPONENTES = [
 {
  "p": 1,
  "q": "Hay siete cosas que usted seguramente tiene",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 7,
   "unit": "cosas",
   "label": "QUE USTED TIENE Y YO EN MI CASA NO",
   "photo": "img/t30cablees_a09_pulpo.jpg",
   "at": 7.1,
   "compare": "Ninguna. Por respeto.",
   "compareAt": 14.16,
   "tone": "red"
  }
 },
 {
  "p": 4,
  "q": "Me dicen Maestro Ramiro",
  "dur": 4.6,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "40 AÑOS CON LAS MANOS EN LOS CABLES",
   "title": "MAESTRO RAMIRO",
   "sub": "Electricista · Monterrey",
   "stamp": "",
   "typeAt": 87.36,
   "stampAt": 90.02
  }
 },
 {
  "p": 4,
  "q": "empecé a los diecinueve",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "value": 19,
   "unit": "años",
   "label": "CARGÁNDOLE LA ESCALERA A SU TÍO",
   "photo": "img/t30cablees_a26_foco_cambiar.jpg",
   "at": 92.08,
   "tone": "white"
  }
 },
 {
  "p": 5,
  "q": "La número uno.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 1",
   "part": "LA EXTENSIÓN Y EL PULPO"
  }
 },
 {
  "p": 7,
  "q": "Y ella llevaba dos inviernos",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 2,
   "unit": "inviernos",
   "label": "EL CALENTADOR EN LA EXTENSIÓN",
   "photo": "img/t30cablees_a12_calentador.jpg",
   "at": 201.4,
   "compare": "No pasó nada de pura suerte.",
   "compareAt": 205.28,
   "tone": "red"
  }
 },
 {
  "p": 7,
  "q": "Levanté el tapete",
  "dur": 5.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30cablees_a16_ext_derretida.jpg",
   "x": 1100,
   "y": 600,
   "r": 170,
   "note": "derretida, pegada al piso",
   "chip": "FÍJESE",
   "circleAt": 191.5,
   "noteAt": 195.08
  }
 },
 {
  "p": 8,
  "q": "los aparatos que calientan",
  "dur": 7.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30cablees_a12_calentador.jpg",
   "rightImg": "img/t30cablees_a17_contacto_pared.jpg",
   "leftHead": "NUNCA",
   "rightHead": "SIEMPRE",
   "leftText": "En una extensión o en un pulpo",
   "rightText": "Directo a un contacto de la pared",
   "stamp": "",
   "leftAt": 213.04,
   "rightAt": 220.68,
   "kicker": "LO QUE CALIENTA"
  }
 },
 {
  "p": 8,
  "q": "Mando poner un contacto nuevo.",
  "dur": 6.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "EN LA CASA DEL MAESTRO RAMIRO",
   "title": "La 1 de 7",
   "items": [
    {
     "text": "1. Nada que caliente en una extensión o pulpo"
    }
   ],
   "bed": "img/t30cablees_a72_taller_atardecer.jpg"
  }
 },
 {
  "p": 9,
  "q": "La número dos.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 2",
   "part": "EL BREAKER QUE SE BOTA"
  }
 },
 {
  "p": 11,
  "q": "Si usted le pone uno más grande",
  "dur": 7.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30cablees_a21_breaker_grande.jpg",
   "rightImg": "img/t30cablees_a23_cable_quemado_pared.jpg",
   "leftHead": "BREAKER MÁS GRANDE",
   "rightHead": "EL CABLE ES EL MISMO",
   "leftText": "Ya no se bota",
   "rightText": "Se calienta adentro de la pared",
   "stamp": "",
   "leftAt": 302.35,
   "rightAt": 304.51,
   "kicker": "EL ARREGLO DEL CONOCIDO"
  }
 },
 {
  "p": 12,
  "q": "si un breaker se bota dos veces",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 2,
   "unit": "veces",
   "label": "SI UN BREAKER SE BOTA",
   "photo": "img/t30cablees_a20_breaker_botado.jpg",
   "at": 339.61,
   "compare": "Desconecto todo y busco al culpable.",
   "compareAt": 340.77,
   "tone": "white"
  }
 },
 {
  "p": 12,
  "q": "No le subo el brazo a la fuerza",
  "dur": 6.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "EN LA CASA DEL MAESTRO RAMIRO",
   "title": "Las 2 de 7",
   "items": [
    {
     "text": "1. Nada que caliente en una extensión o pulpo"
    },
    {
     "text": "2. El breaker que se bota se escucha"
    }
   ],
   "bed": "img/t30cablees_a19_breakers.jpg"
  }
 },
 {
  "p": 13,
  "q": "La número tres.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 3",
   "part": "CORTAR Y COMPROBAR"
  }
 },
 {
  "p": 14,
  "q": "Las etiquetas mienten.",
  "dur": 6.0,
  "comp": "PullQuote",
  "props": {
   "quote": "Las etiquetas mienten. Los apagadores mienten. El tester no.",
   "who": "Su tío, el primer maestro",
   "source": "Lo que le dijo a Ramiro a los diecinueve",
   "at": 400.11,
   "until": 405.11,
   "highlight": "El tester no.",
   "bed": "img/t30cablees_a29_tester_brilla.jpg"
  }
 },
 {
  "p": 16,
  "q": "lo pruebo en algo vivo, corto",
  "dur": 6.5,
  "comp": "RayChecklist",
  "props": {
   "kicker": "SIEMPRE IGUAL",
   "title": "Tres pasos · 30 segundos",
   "items": [
    {
     "text": "Lo pruebo en algo vivo"
    },
    {
     "text": "Corto el breaker"
    },
    {
     "text": "Lo pruebo en lo que voy a tocar"
    }
   ],
   "bed": "img/t30cablees_a33_cajon_cocina.jpg"
  }
 },
 {
  "p": 17,
  "q": "La número cuatro.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 4",
   "part": "LA TIERRA Y LA PROTECCIÓN CONTRA FUGAS"
  }
 },
 {
  "p": 18,
  "q": "Esa patita es la salida de emergencia.",
  "dur": 5.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30cablees_a34_contacto_tierra.jpg",
   "x": 960,
   "y": 870,
   "r": 100,
   "note": "la salida de emergencia",
   "chip": "FÍJESE",
   "circleAt": 491.49,
   "noteAt": 493.03
  }
 },
 {
  "p": 19,
  "q": "Son los que traen dos botoncitos",
  "dur": 5.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30cablees_a39_gfci_bano.jpg",
   "x": 950,
   "y": 470,
   "r": 120,
   "note": "prueba · restablecer",
   "chip": "FÍJESE",
   "circleAt": 540.0,
   "noteAt": 542.3
  }
 },
 {
  "p": 20,
  "q": "Y una vez al mes",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 1,
   "unit": "vez al mes",
   "label": "APRIETE EL BOTÓN DE PRUEBA",
   "photo": "img/t30cablees_a40_secadora_lavabo.jpg",
   "at": 568.96,
   "compare": "Tiene que hacer clic y cortar.",
   "compareAt": 572.62,
   "tone": "white"
  }
 },
 {
  "p": 21,
  "q": "Ahorita vamos por la mitad",
  "dur": 6.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "EN LA CASA DEL MAESTRO RAMIRO",
   "title": "Vamos por la mitad",
   "items": [
    {
     "text": "1. Nada que caliente en una extensión o pulpo"
    },
    {
     "text": "2. El breaker que se bota se escucha"
    },
    {
     "text": "3. Corto y compruebo con el tester"
    },
    {
     "text": "4. La tierra no se quita"
    }
   ],
   "bed": "img/t30cablees_a71_tablero_abierto.jpg"
  }
 },
 {
  "p": 22,
  "q": "La número cinco.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 5",
   "part": "EL FOCO QUE DICE LA LÁMPARA"
  }
 },
 {
  "p": 22,
  "q": "hay una etiquetita que dice",
  "dur": 5.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30cablees_a43_socket_etiqueta.jpg",
   "x": 980,
   "y": 510,
   "r": 120,
   "note": "máximo tantos watts",
   "chip": "FÍJESE",
   "circleAt": 608.66,
   "noteAt": 610.54
  }
 },
 {
  "p": 23,
  "q": "Hoy, con los focos LED",
  "dur": 7.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30cablees_a44_foco_filamento.jpg",
   "rightImg": "img/t30cablees_a48_led_base.jpg",
   "leftHead": "FOCO DE FILAMENTO",
   "rightHead": "FOCO LED",
   "leftText": "Calentaba muchísimo",
   "rightText": "Calienta poco",
   "stamp": "",
   "leftAt": 642.56,
   "rightAt": 646.54,
   "kicker": "ANTES · HOY"
  }
 },
 {
  "p": 24,
  "q": "las mandé recablear",
  "dur": 6.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "EN LA CASA DEL MAESTRO RAMIRO",
   "title": "Las 5 de 7",
   "items": [
    {
     "text": "1. Nada que caliente en una extensión o pulpo"
    },
    {
     "text": "2. El breaker que se bota se escucha"
    },
    {
     "text": "3. Corto y compruebo con el tester"
    },
    {
     "text": "4. La tierra no se quita"
    },
    {
     "text": "5. El foco que dice la lámpara"
    }
   ],
   "bed": "img/t30cablees_a49_lampara_recableada.jpg"
  }
 },
 {
  "p": 25,
  "q": "La número seis.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 6",
   "part": "NADA CARGANDO DE NOCHE EN LA CAMA"
  }
 },
 {
  "p": 27,
  "q": "Si está encima de la cama",
  "dur": 7.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30cablees_a50_cel_almohada.jpg",
   "rightImg": "img/t30cablees_a56_buro_cargando.jpg",
   "leftHead": "ENTRE COBIJAS",
   "rightHead": "SOBRE ALGO DURO",
   "leftText": "El calor no tiene a dónde irse",
   "rightText": "Con aire alrededor",
   "stamp": "",
   "leftAt": 741.38,
   "rightAt": 750.5,
   "kicker": "DÓNDE CARGA EL CELULAR"
  }
 },
 {
  "p": 28,
  "q": "Un cargador original",
  "dur": 7.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30cablees_a58_cargador_bueno.jpg",
   "rightImg": "img/t30cablees_a57_cargador_barato.jpg",
   "leftHead": "CARGADOR SERIO",
   "rightHead": "CARGADOR PIRATA",
   "leftText": "Protecciones que cortan",
   "rightText": "A veces ni la mitad",
   "stamp": "",
   "leftAt": 767.22,
   "rightAt": 775.26,
   "kicker": "POR FUERA SE VEN IGUAL"
  }
 },
 {
  "p": 28,
  "q": "En mi casa, cargadores buenos",
  "dur": 6.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "EN LA CASA DEL MAESTRO RAMIRO",
   "title": "Las 6 de 7",
   "items": [
    {
     "text": "1. Nada que caliente en una extensión o pulpo"
    },
    {
     "text": "2. El breaker que se bota se escucha"
    },
    {
     "text": "3. Corto y compruebo con el tester"
    },
    {
     "text": "4. La tierra no se quita"
    },
    {
     "text": "5. El foco que dice la lámpara"
    },
    {
     "text": "6. Nada cargando entre cobijas"
    }
   ],
   "bed": "img/t30cablees_a53_baterias.jpg"
  }
 },
 {
  "p": 29,
  "q": "La número siete.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 7",
   "part": "LOS AVISOS DE LA CASA"
  }
 },
 {
  "p": 32,
  "q": "Cualquiera de esos cinco",
  "dur": 8.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "LA CASA SIEMPRE AVISA ANTES",
   "title": "Los 5 avisos",
   "items": [
    {
     "text": "Contacto o apagador tibio"
    },
    {
     "text": "Olor a plástico quemado que va y viene"
    },
    {
     "text": "Luces que parpadean o bajan"
    },
    {
     "text": "Chispita o clavija floja"
    },
    {
     "text": "Zumbido del tablero o un apagador"
    }
   ],
   "bed": "img/t30cablees_a64_tablero_viejo.jpg"
  }
 },
 {
  "p": 33,
  "q": "Empalmes escondidos.",
  "dur": 5.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30cablees_a65_empalme_cinta.jpg",
   "x": 975,
   "y": 430,
   "r": 190,
   "note": "sin caja, sin nada",
   "chip": "FÍJESE",
   "circleAt": 899.69,
   "noteAt": 908.13
  }
 },
 {
  "p": 33,
  "q": "empieza a calentar",
  "dur": 7.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30cablees_a66_cinta_seca.jpg",
   "rightImg": "img/t30cablees_a67_caja_registro.jpg",
   "leftHead": "ESCONDIDO",
   "rightHead": "EN CAJA DE REGISTRO",
   "leftText": "Cinta que se seca donde nadie lo ve",
   "rightText": "Con tapa y conectores buenos",
   "stamp": "",
   "leftAt": 926.09,
   "rightAt": 928.57,
   "kicker": "LOS EMPALMES"
  }
 },
 {
  "p": 34,
  "q": "Una: extensiones y pulpos",
  "dur": 14.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "PARA QUE LE QUEDE CLARO",
   "title": "Las 7 del Maestro Ramiro",
   "items": [
    {
     "text": "1. Nada que caliente en una extensión o pulpo"
    },
    {
     "text": "2. El breaker que se bota se escucha"
    },
    {
     "text": "3. Corto y compruebo con el tester"
    },
    {
     "text": "4. La tierra no se quita"
    },
    {
     "text": "5. El foco que dice la lámpara"
    },
    {
     "text": "6. Nada cargando entre cobijas"
    },
    {
     "text": "7. Atiendo los avisos y los empalmes van en caja"
    }
   ],
   "bed": "img/t30cablees_a69_casa_vuelta.jpg"
  }
 },
 {
  "p": 35,
  "q": "Su tarea para esta semana es chiquita.",
  "dur": 7.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "SU TAREA DE ESTA SEMANA",
   "title": "Dos cosas nada más",
   "items": [
    {
     "text": "Busque pulpos en su casa"
    },
    {
     "text": "Ponga la mano en las placas de sus contactos"
    }
   ],
   "bed": "img/t30cablees_a10_pulpo_tele.jpg"
  }
 },
 {
  "p": 36,
  "q": "¿cuál de las siete tiene ahorita en su casa?",
  "dur": 6.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "02",
   "label": "CUÉNTEME EN LOS COMENTARIOS",
   "title": "¿CUÁL DE LAS 7 TIENE?",
   "sub": "Sea honesto, aquí nadie lo regaña",
   "stamp": "",
   "typeAt": 1026.17,
   "stampAt": 1029.65
  }
 },
 {
  "p": 37,
  "q": "en los primeros diez minutos",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 10,
   "unit": "minutos",
   "label": "LA PRÓXIMA SEMANA: LA CASA USADA",
   "photo": "img/t30cablees_a70_casa_venta.jpg",
   "at": 1051.55,
   "compare": "Suscríbase y active la campanita.",
   "compareAt": 1059.41,
   "tone": "white"
  }
 }
];
export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
