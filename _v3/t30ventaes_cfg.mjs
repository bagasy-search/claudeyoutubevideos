// _v3/t30ventaes_cfg.mjs — «Fui Gerente de Banco 35 Años…» · Don Rodolfo (ES). Generado por D:/rtmp_t30ventaes/tools/mk_cfg.py
// (tiempos de words.json). Ritmo Bertha: avatar 27 % en ventanas 3-6 s, b-roll 2,3-5,2 s (mediana ~3,6).
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 3.0;
export const AVATAR_WIN_MAX = 6.0;
export const AVATAR_CAND_MAX = 6.0;
export const AVATAR_OBJ = 0.27;
export const APERTURA_MIN = 3.0;
export const TRANSICIONES = true;
export const SECCIONES = [{"sec": "S1", "rol": "hook", "p0": 1, "p1": 4}, {"sec": "S2", "rol": "explica", "p0": 5, "p1": 6}, {"sec": "S3", "rol": "receta", "p0": 7, "p1": 9}, {"sec": "S4", "rol": "receta", "p0": 10, "p1": 12}, {"sec": "S5", "rol": "receta", "p0": 13, "p1": 15}, {"sec": "S6", "rol": "prueba", "p0": 16, "p1": 18}, {"sec": "S7", "rol": "receta", "p0": 19, "p1": 21}, {"sec": "S8", "rol": "explica", "p0": 22, "p1": 24}, {"sec": "S9", "rol": "receta", "p0": 25, "p1": 27}, {"sec": "S10", "rol": "prueba", "p0": 28, "p1": 29}, {"sec": "S11", "rol": "explica", "p0": 30, "p1": 32}, {"sec": "S12", "rol": "explica", "p0": 33, "p1": 35}, {"sec": "S13", "rol": "prueba", "p0": 36, "p1": 38}, {"sec": "S14", "rol": "cierre", "p0": 39, "p1": 43}];
const R = [3.6, 2.6, 4.4, 3.1, 5.0, 2.4, 3.9, 4.7, 2.9, 3.4, 5.2, 3.0];
export const ESCALERA = { hook: [2.4, 3.0, 2.6, 3.4, 2.3, 3.8, 2.8, 4.2, 2.5, 3.2, 2.7, 3.6], explica: R, receta: [...R].reverse(), prueba: [3.2, 4.6, 2.5, 3.8, 5.1, 2.8, 3.5, 4.2, 2.4, 3.9, 4.9, 3.1], cierre: R };
export const ORDEN_FORZADO = {};
export const OVERLAY = ['ActChip'];
export const IMPORTS = {"BigStat": "../backfire/BigStat", "FileStamp": "../backfire/FileStamp", "ActChip": "../backfire/ActChip", "SplitVs": "../backfire/SplitVs", "RayChecklist": "../rksafe/RayChecklist", "PhoneAlert": "../rksafe/PhoneAlert"};
export const BEDS = ["img/t30ventaes_a06_estado_cuenta.jpg", "img/t30ventaes_a12_cartas_sello.jpg", "img/t30ventaes_a16_alcancia.jpg", "img/t30ventaes_a17_carta_abierta.jpg", "img/t30ventaes_a18_tres_estados.jpg", "img/t30ventaes_a21_boleta_retiro.jpg", "img/t30ventaes_a22_senora_telefono.jpg", "img/t30ventaes_a24_sobres_fila.jpg", "img/t30ventaes_a25_formulario_mostrador.jpg", "img/t30ventaes_a28_formulario_tabla.jpg", "img/t30ventaes_a29_pareja_sale.jpg", "img/t30ventaes_a30_dos_manos_libreta.jpg", "img/t30ventaes_a32_testamento.jpg", "img/t30ventaes_a33_mesa_familia.jpg", "img/t30ventaes_a36_poder_sello.jpg", "img/t30ventaes_a39_chequera.jpg", "img/t30ventaes_a40_celular_app.jpg", "img/t30ventaes_a41_fila_ventanilla.jpg", "img/t30ventaes_a43_certificado.jpg", "img/t30ventaes_a44_calculadora.jpg", "img/t30ventaes_a45_despertador.jpg", "img/t30ventaes_a48_tarjeta_atras.jpg", "img/t30ventaes_a49_baston_silla.jpg", "img/t30ventaes_a51_caja_abierta.jpg", "img/t30ventaes_a54_llave_cinta.jpg", "img/t30ventaes_a55_libreta_polvo.jpg", "img/t30ventaes_a60_dedo_colgar.jpg", "img/t30ventaes_a61_tarjeta_teclado.jpg", "img/t30ventaes_a63_senora_llora.jpg", "img/t30ventaes_a64_circulos_rojos.jpg"];
export const COMPONENTES = [
 {
  "p": 1,
  "q": "Después de los sesenta y cinco",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 65,
   "unit": "años",
   "label": "EL BANCO LE EMPIEZA A CERRAR PUERTAS",
   "photo": "img/t30ventaes_a41_fila_ventanilla.jpg",
   "at": 8.22,
   "compare": "Despacito. Sin avisar.",
   "compareAt": 11.88,
   "tone": "red"
  }
 },
 {
  "p": 2,
  "q": "estuvo cuarenta minutos apretando números",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "value": 40,
   "unit": "minutos",
   "label": "APRETANDO NÚMEROS POR UN COBRO RARO",
   "photo": "img/t30ventaes_a61_tarjeta_teclado.jpg",
   "at": 39.2,
   "tone": "white"
  }
 },
 {
  "p": 4,
  "q": "Así que hoy le voy a contar once cosas",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 11,
   "unit": "cosas",
   "label": "LO QUE EL BANCO LE DEJÓ DE PERMITIR",
   "photo": "img/t30ventaes_a12_cartas_sello.jpg",
   "at": 82.38,
   "compare": "La número cuatro enojó a mi hermana.",
   "compareAt": 98.26,
   "tone": "white"
  }
 },
 {
  "p": 5,
  "q": "Usted ya me conoce, soy Rodolfo",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "VENTANILLA 3",
   "title": "DON RODOLFO",
   "sub": "35 años en una agencia de Lima · de cajero a gerente",
   "stamp": "",
   "typeAt": 108.32,
   "stampAt": 109.78
  }
 },
 {
  "p": 6,
  "q": "suscríbase y toque la campanita",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "02",
   "label": "CADA SEMANA, UN CAJÓN MÁS",
   "title": "SUSCRÍBASE + CAMPANITA",
   "sub": "¿Qué fue lo que más rabia le dio de su banco?",
   "stamp": "",
   "typeAt": 136.5,
   "stampAt": 146.42
  }
 },
 {
  "p": 7,
  "q": "Número uno.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 1",
   "part": "CUENTA VIEJA, REGLAS NUEVAS"
  }
 },
 {
  "p": 8,
  "q": "no le cobraban nada",
  "dur": 8.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30ventaes_a16_alcancia.jpg",
   "rightImg": "img/t30ventaes_a06_estado_cuenta.jpg",
   "leftHead": "ANTES",
   "rightHead": "AHORA",
   "leftText": "Sin cobros. Hasta una alcancía.",
   "rightText": "Comisión de mantenimiento.",
   "kicker": "SU CUENTA DE TODA LA VIDA",
   "stamp": "",
   "leftAt": 163.22,
   "rightAt": 187.3
  }
 },
 {
  "p": 9,
  "q": "Agarre sus últimos tres estados de cuenta",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 3,
   "unit": "estados de cuenta",
   "label": "LÉALOS RENGLÓN POR RENGLÓN",
   "photo": "img/t30ventaes_a18_tres_estados.jpg",
   "at": 202.62,
   "compare": "Busque: comisión · mantenimiento · cargo por servicio",
   "compareAt": 207.92,
   "tone": "white"
  }
 },
 {
  "p": 10,
  "q": "Número dos.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 2",
   "part": "SU EFECTIVO, CON PREGUNTAS"
  }
 },
 {
  "p": 12,
  "q": "llame a la agencia un día antes",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "value": 1,
   "unit": "día antes",
   "label": "PIDA EL EFECTIVO GRANDE CON TIEMPO",
   "photo": "img/t30ventaes_a21_boleta_retiro.jpg",
   "at": 306.1,
   "tone": "white"
  }
 },
 {
  "p": 12,
  "q": "nunca parta un retiro grande en pedacitos",
  "dur": 8.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30ventaes_a24_sobres_fila.jpg",
   "rightImg": "img/t30ventaes_a25_formulario_mostrador.jpg",
   "leftHead": "NUNCA",
   "rightHead": "SÍ",
   "leftText": "Partir el retiro en pedacitos.",
   "rightText": "Sáquela y deje que llenen el papel.",
   "kicker": "EL RETIRO GRANDE",
   "stamp": "",
   "leftAt": 318.28,
   "rightAt": 331.3
  }
 },
 {
  "p": 13,
  "q": "Número tres.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 3",
   "part": "EL BANCO PUEDE FRENAR SU OPERACIÓN"
  }
 },
 {
  "p": 15,
  "q": "esa regla salvó a más clientes míos",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 35,
   "unit": "años",
   "label": "DETRÁS DEL ESCRITORIO",
   "photo": "img/t30ventaes_a29_pareja_sale.jpg",
   "at": 375.46,
   "compare": "Esta regla salvó a más clientes que ninguna.",
   "compareAt": 376.66,
   "tone": "white"
  }
 },
 {
  "p": 15,
  "q": "un contacto de confianza",
  "dur": 8.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30ventaes_a28_formulario_tabla.jpg",
   "rightImg": "img/t30ventaes_a22_senora_telefono.jpg",
   "leftHead": "QUÉ HACE",
   "rightHead": "ACCESO A SU PLATA",
   "leftText": "El banco llama a esa persona antes.",
   "rightText": "Ninguno.",
   "kicker": "CONTACTO DE CONFIANZA",
   "stamp": "",
   "leftAt": 390.26,
   "rightAt": 396.36
  }
 },
 {
  "p": 16,
  "q": "Número cuatro.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 4",
   "part": "LA CUENTA MANCOMUNADA"
  }
 },
 {
  "p": 17,
  "q": "si usted tiene tres hijos y agregó a uno",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 3,
   "unit": "hijos",
   "label": "AGREGÓ A UNO SOLO A LA CUENTA",
   "photo": "img/t30ventaes_a33_mesa_familia.jpg",
   "at": 459.46,
   "compare": "Los otros dos se pueden quedar sin nada.",
   "compareAt": 461.6,
   "tone": "red"
  }
 },
 {
  "p": 18,
  "q": "pregunte en su banco por un apoderado",
  "dur": 9.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30ventaes_a30_dos_manos_libreta.jpg",
   "rightImg": "img/t30ventaes_a32_testamento.jpg",
   "leftHead": "AYUDA CON LOS PAGOS",
   "rightHead": "A QUIÉN VA LA PLATA",
   "leftText": "Apoderado, autorizado o un poder.",
   "rightText": "Beneficiarios en la cuenta.",
   "kicker": "NO LAS MEZCLE",
   "stamp": "",
   "leftAt": 491.4,
   "rightAt": 505.24
  }
 },
 {
  "p": 19,
  "q": "Número cinco.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 5",
   "part": "EL PODER QUE NO ACEPTAN"
  }
 },
 {
  "p": 21,
  "q": "lleve su poder a su agencia",
  "dur": 8.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "AHORA QUE ESTÁ SANO, ESTE MES",
   "title": "Su poder, revisado",
   "items": [
    {
     "text": "Llévelo a su agencia con la persona que nombró"
    },
    {
     "text": "Que lo revisen y lo registren desde ya"
    },
    {
     "text": "Si falta algo, corríjalo con el notario"
    }
   ],
   "bed": "img/t30ventaes_a36_poder_sello.jpg"
  }
 },
 {
  "p": 22,
  "q": "Número seis.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 6",
   "part": "EL PAPEL LE EMPIEZA A COSTAR"
  }
 },
 {
  "p": 23,
  "q": "Un cobro por el estado de cuenta impreso.",
  "dur": 7.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "DE A POQUITO",
   "title": "Cobros nuevos",
   "items": [
    {
     "text": "El estado de cuenta impreso"
    },
    {
     "text": "La operación en ventanilla"
    },
    {
     "text": "La chequera"
    }
   ],
   "bed": "img/t30ventaes_a39_chequera.jpg"
  }
 },
 {
  "p": 24,
  "q": "Sólo para mirar su cuenta cada dos o tres días",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 3,
   "unit": "días",
   "label": "MIRE SU CUENTA CADA",
   "photo": "img/t30ventaes_a40_celular_app.jpg",
   "at": 636.02,
   "prefix": "2–",
   "compare": "Sólo para mirar, no para mover plata.",
   "compareAt": 637.32,
   "tone": "green"
  }
 },
 {
  "p": 25,
  "q": "Número siete.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 7",
   "part": "EL PLAZO FIJO QUE SE RENOVÓ SOLO"
  }
 },
 {
  "p": 27,
  "q": "ponga una segunda nota una semana antes",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 1,
   "unit": "semana antes",
   "label": "UNA SEGUNDA NOTA EN EL CALENDARIO",
   "photo": "img/t30ventaes_a45_despertador.jpg",
   "at": 686.8,
   "compare": "El vencimiento, anotado en rojo.",
   "compareAt": 688.0,
   "tone": "white"
  }
 },
 {
  "p": 28,
  "q": "Número ocho.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 8",
   "part": "LA AGENCIA DE SIEMPRE PUEDE CERRAR"
  }
 },
 {
  "p": 29,
  "q": "sepa dónde queda su segunda agencia más cercana",
  "dur": 8.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "ANTES DE QUE PASE",
   "title": "Tenga a mano",
   "items": [
    {
     "text": "Su segunda agencia más cercana"
    },
    {
     "text": "El número de atrás de su tarjeta"
    },
    {
     "text": "La atención para adultos mayores"
    }
   ],
   "bed": "img/t30ventaes_a49_baston_silla.jpg"
  }
 },
 {
  "p": 30,
  "q": "Número nueve.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 9",
   "part": "LA CAJA DE SEGURIDAD NO ESTÁ ASEGURADA"
  }
 },
 {
  "p": 31,
  "q": "El seguro de depósitos de su país cubre los depósitos",
  "dur": 9.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30ventaes_a43_certificado.jpg",
   "rightImg": "img/t30ventaes_a51_caja_abierta.jpg",
   "leftHead": "CUBIERTO, HASTA UN LÍMITE",
   "rightHead": "NO ES UN DEPÓSITO",
   "leftText": "Ahorros, cuenta corriente, plazo fijo.",
   "rightText": "Lo que está adentro de la caja.",
   "kicker": "EL SEGURO DE DEPÓSITOS",
   "stamp": "",
   "leftAt": 775.2,
   "rightAt": 784.7
  }
 },
 {
  "p": 32,
  "q": "Así que tres cosas.",
  "dur": 9.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "SU CAJA DE SEGURIDAD",
   "title": "Tres cosas",
   "items": [
    {
     "text": "Lista y fotos, guardadas en su casa"
    },
    {
     "text": "¿Su seguro de hogar la cubre?"
    },
    {
     "text": "Alguien de confianza sabe que existe"
    }
   ],
   "bed": "img/t30ventaes_a54_llave_cinta.jpg"
  }
 },
 {
  "p": 33,
  "q": "Número diez.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 10",
   "part": "LA PLATA OLVIDADA"
  }
 },
 {
  "p": 35,
  "q": "una vez al año, haga un depósito chiquito",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 1,
   "unit": "vez al año",
   "label": "UN MOVIMIENTO CHIQUITO EN CADA CUENTA",
   "photo": "img/t30ventaes_a55_libreta_polvo.jpg",
   "at": 887.62,
   "compare": "El movimiento la mantiene viva.",
   "compareAt": 895.28,
   "tone": "green"
  }
 },
 {
  "p": 36,
  "q": "Número once.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 11",
   "part": "LA LLAMADA DE «SU BANCO»"
  }
 },
 {
  "p": 37,
  "q": "A veces saben los últimos cuatro números de su tarjeta",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 4,
   "unit": "números",
   "label": "DE SU TARJETA: YA LOS SABEN",
   "photo": "img/t30ventaes_a48_tarjeta_atras.jpg",
   "at": 920.33,
   "compare": "Y en la pantalla, el nombre del banco.",
   "compareAt": 921.73,
   "tone": "red"
  }
 },
 {
  "p": 38,
  "q": "Si alguien lo llama del banco, cuelgue",
  "dur": 7.5,
  "comp": "PhoneAlert",
  "props": {
   "kicker": "LA LLAMADA FALSA",
   "title": "Área de fraudes",
   "body": "Movimientos sospechosos. Valide su identidad.",
   "action": "Cuelgue y llame usted",
   "side": "right",
   "bg": "img/t30ventaes_a63_senora_llora.jpg"
  }
 },
 {
  "p": 38,
  "q": "Cuelgue y llame usted. Cuatro palabras.",
  "dur": 4.0,
  "comp": "BigStat",
  "props": {
   "value": 4,
   "unit": "palabras",
   "label": "CUELGUE Y LLAME USTED",
   "photo": "img/t30ventaes_a60_dedo_colgar.jpg",
   "at": 965.64,
   "tone": "white"
  }
 },
 {
  "p": 39,
  "q": "Entonces, sumemos.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "LA CUENTA",
   "part": "SUMEMOS"
  }
 },
 {
  "p": 39,
  "q": "son doce cobros al año",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 12,
   "unit": "cobros al año",
   "label": "UNA COMISIÓN QUE NO SABÍA QUE PAGABA",
   "photo": "img/t30ventaes_a44_calculadora.jpg",
   "at": 972.9,
   "tone": "red"
  }
 },
 {
  "p": 40,
  "q": "Sólo dos cosas esta semana.",
  "dur": 8.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "SU TAREA · ESTA SEMANA",
   "title": "Dos cosas",
   "items": [
    {
     "text": "Marque con un círculo cada cobro"
    },
    {
     "text": "Pregunte por el contacto de confianza"
    }
   ],
   "bed": "img/t30ventaes_a64_circulos_rojos.jpg"
  }
 },
 {
  "p": 41,
  "q": "¿Cuál número?",
  "dur": 6.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "03",
   "label": "CUÉNTEME EN LOS COMENTARIOS",
   "title": "¿CUÁL NÚMERO?",
   "sub": "¿Y desde qué país me ve?",
   "stamp": "",
   "typeAt": 1026.55,
   "stampAt": 1028.46
  }
 },
 {
  "p": 42,
  "q": "las tres palabras que usted tiene que buscar",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "value": 3,
   "unit": "palabras",
   "label": "LA CARTA ANTES DE QUE LE CIERREN LA CUENTA",
   "photo": "img/t30ventaes_a17_carta_abierta.jpg",
   "at": 1045.2,
   "tone": "white"
  }
 }
];
export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
