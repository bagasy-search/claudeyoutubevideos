// _v3/t30selloes_cfg.mjs — «¿Naciste Antes de 1960? El Seguro Social Podría Estar Pagándote de Menos» · Don Ernesto (ES). Generado por D:/rtmp_t30selloes/tools/mk_cfg.py
// (tiempos de words.json). Ritmo Bertha: avatar 27 % en ventanas 3-6 s, b-roll 2,3-5,2 s (mediana ~3,6).
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 3.0;
export const AVATAR_WIN_MAX = 6.0;
export const AVATAR_CAND_MAX = 6.0;
export const AVATAR_OBJ = 0.27;
export const APERTURA_MIN = 3.0;
export const TRANSICIONES = true;
export const SECCIONES = [{"sec": "S1", "rol": "hook", "p0": 1, "p1": 6}, {"sec": "S2", "rol": "explica", "p0": 7, "p1": 9}, {"sec": "S3", "rol": "prueba", "p0": 10, "p1": 13}, {"sec": "S4", "rol": "explica", "p0": 14, "p1": 17}, {"sec": "S5", "rol": "prueba", "p0": 18, "p1": 20}, {"sec": "S6", "rol": "explica", "p0": 21, "p1": 23}, {"sec": "S7", "rol": "prueba", "p0": 24, "p1": 26}, {"sec": "S8", "rol": "explica", "p0": 27, "p1": 29}, {"sec": "S9", "rol": "prueba", "p0": 30, "p1": 32}, {"sec": "S10", "rol": "receta", "p0": 33, "p1": 35}, {"sec": "S11", "rol": "cierre", "p0": 36, "p1": 40}];
const R = [3.6, 2.6, 4.4, 3.1, 5.0, 2.4, 3.9, 4.7, 2.9, 3.4, 5.2, 3.0];
export const ESCALERA = { hook: [2.4, 3.0, 2.6, 3.4, 2.3, 3.8, 2.8, 4.2, 2.5, 3.2, 2.7, 3.6], explica: R, receta: [...R].reverse(), prueba: [3.2, 4.6, 2.5, 3.8, 5.1, 2.8, 3.5, 4.2, 2.4, 3.9, 4.9, 3.1], cierre: R };
export const ORDEN_FORZADO = {};
export const OVERLAY = ['ActChip'];
export const IMPORTS = {"BigStat": "../backfire/BigStat", "FileStamp": "../backfire/FileStamp", "ActChip": "../backfire/ActChip", "YearCounter": "../backfire/YearCounter", "DocumentPage": "../backfire/DocumentPage", "SceneCallout": "../backfire/SceneCallout"};
export const BEDS = ["a13_celular_mesa", "a20_boda_70s", "a21_carpetas_mezcladas", "a23_dedo_renglon", "a28_pastel_cumple", "a32_pareja_platos", "a36_viuda_tumba", "a45_consultorio", "a50_mano_cajon", "a58_cafe_carta", "e09_nueve_carpetas", "e27_calculadora", "e28_reloj_arena", "e35_mandado", "e48_cuenta_libreta"];
export const COMPONENTES = [
 {
  "p": 1,
  "q": "si usted nació antes de mil novecientos sesenta",
  "dur": 5.0,
  "comp": "YearCounter",
  "props": {
   "photo": "img/t30selloes_a28_pastel_cumple.jpg",
   "yearFrom": 1940,
   "yearTo": 1960,
   "unit": "",
   "label": "¿NACIÓ ANTES DE 1960?",
   "from": 7.619999999999999,
   "to": 10.34,
   "marks": [
    {
     "year": 1960,
     "note": "revise hoy"
    }
   ],
   "linear": true
  }
 },
 {
  "p": 2,
  "q": "Le llega la carta",
  "dur": 10.5,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloes_doc_carta.jpg",
   "chip": "LA CARTA",
   "highlights": [
    {
     "x": 5.6,
     "y": 19.36,
     "w": 88.8,
     "h": 6.82,
     "at": 36.38
    },
    {
     "x": 5.6,
     "y": 79.36,
     "w": 88.8,
     "h": 6.82,
     "at": 41.76
    }
   ],
   "note": {
    "text": "y la guarda en el cajón",
    "at": 43.58
   },
   "aspect": 0.7727,
   "source": "Carta de ejemplo hecha para este video · sin datos reales"
  }
 },
 {
  "p": 4,
  "q": "Así que hoy le voy a enseñar nueve cosas",
  "dur": 7.0,
  "comp": "BigStat",
  "props": {
   "value": 9,
   "unit": "errores",
   "label": "LOS QUE VI UNA Y OTRA VEZ",
   "photo": "img/t30selloes_e09_nueve_carpetas.jpg",
   "at": 96.32,
   "tone": "red",
   "compare": "Sobre todo en nacidos antes del 60.",
   "compareAt": 102.5
  }
 },
 {
  "p": 5,
  "q": "soy Ernesto",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "DEL OTRO LADO DEL VIDRIO",
   "title": "DON ERNESTO",
   "sub": "31 años en el Seguro Social · San Antonio, Texas",
   "stamp": "",
   "typeAt": 130.64,
   "stampAt": 132.64
  }
 },
 {
  "p": 6,
  "q": "suscríbase y toque la campanita",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "02",
   "label": "CADA SEMANA, UNA CARTA",
   "title": "SUSCRÍBASE + CAMPANITA",
   "sub": "¿Qué nunca entendió de su carta?",
   "stamp": "",
   "typeAt": 166.28,
   "stampAt": 168.28
  }
 },
 {
  "p": 7,
  "q": "Número uno",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 1",
   "part": "SU HISTORIAL DE GANANCIAS"
  }
 },
 {
  "p": 8,
  "q": "Si trabajó menos de treinta y cinco años",
  "dur": 12.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloes_doc_earnings.jpg",
   "chip": "HISTORIAL DE GANANCIAS",
   "highlights": [
    {
     "x": 6.0,
     "y": 21.82,
     "w": 88.0,
     "h": 13.64,
     "at": 215.02
    },
    {
     "x": 6.0,
     "y": 51.36,
     "w": 60.0,
     "h": 2.27,
     "at": 221.9
    }
   ],
   "note": {
    "text": "un cero baja el promedio",
    "at": 224.48
   },
   "aspect": 0.7727,
   "source": "Carta de ejemplo hecha para este video · sin datos reales"
  }
 },
 {
  "p": 8,
  "q": "treinta y cinco años de mejores ganancias",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "value": 35,
   "unit": "años",
   "label": "SUS MEJORES AÑOS DE GANANCIAS",
   "photo": "img/t30selloes_a23_dedo_renglon.jpg",
   "at": 207.48,
   "tone": "red",
   "compare": "Ajustados por la inflación.",
   "compareAt": 209.08
  }
 },
 {
  "p": 10,
  "q": "Número dos",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 2",
   "part": "SUS DOS APELLIDOS"
  }
 },
 {
  "p": 11,
  "q": "Se queda en un archivo aparte",
  "dur": 6.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30selloes_a21_carpetas_mezcladas.jpg",
   "x": 1180,
   "y": 560,
   "r": 260,
   "note": "ganancias sin dueño",
   "chip": "MIRE ESTO",
   "circleAt": 280.92,
   "noteAt": 283.96,
   "zoom": 1.3
  }
 },
 {
  "p": 14,
  "q": "Número tres",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 3",
   "part": "SU EDAD COMPLETA NO ES 65"
  }
 },
 {
  "p": 15,
  "q": "Si nació entre mil novecientos cuarenta y tres",
  "dur": 17.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloes_doc_fra.jpg",
   "chip": "EDAD DE JUBILACIÓN COMPLETA",
   "highlights": [
    {
     "x": 9.0,
     "y": 24.91,
     "w": 82.0,
     "h": 4.55,
     "at": 403.4
    },
    {
     "x": 9.0,
     "y": 30.82,
     "w": 82.0,
     "h": 4.55,
     "at": 413.56
    },
    {
     "x": 9.0,
     "y": 36.73,
     "w": 82.0,
     "h": 4.55,
     "at": 417.28
    }
   ],
   "note": {
    "text": "Sube 2 meses por año: 1960 = 67",
    "at": 417.0
   },
   "aspect": 0.7727,
   "source": "Carta de ejemplo hecha para este video · sin datos reales"
  }
 },
 {
  "p": 16,
  "q": "un cheque como treinta por ciento más chico",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "value": 30,
   "unit": "%",
   "label": "MÁS CHICO SI LO PIDE A LOS 62",
   "photo": "img/t30selloes_e27_calculadora.jpg",
   "at": 451.16,
   "tone": "red",
   "compare": "Comparado con los 67, de por vida.",
   "compareAt": 454.52
  }
 },
 {
  "p": 16,
  "q": "el beneficio crece ocho por ciento",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 8,
   "unit": "%",
   "label": "POR CADA AÑO QUE ESPERA",
   "photo": "img/t30selloes_a13_celular_mesa.jpg",
   "at": 464.8,
   "tone": "red",
   "compare": "Hasta los 70. Después, nada.",
   "compareAt": 466.8
  }
 },
 {
  "p": 17,
  "q": "si lo pidió hace menos de doce meses",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 12,
   "unit": "meses",
   "label": "PARA RETIRAR SU SOLICITUD",
   "photo": "img/t30selloes_e28_reloj_arena.jpg",
   "at": 476.68,
   "tone": "red",
   "compare": "Devuelve lo cobrado y empieza de nuevo.",
   "compareAt": 481.98
  }
 },
 {
  "p": 18,
  "q": "Número cuatro",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 4",
   "part": "EL BENEFICIO DE CÓNYUGE"
  }
 },
 {
  "p": 19,
  "q": "hasta la mitad del beneficio completo del otro",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "value": 50,
   "unit": "%",
   "label": "DEL BENEFICIO DEL CÓNYUGE",
   "photo": "img/t30selloes_a32_pareja_platos.jpg",
   "at": 515.86,
   "tone": "red",
   "compare": "Si lo pide a su edad completa.",
   "compareAt": 519.3
  }
 },
 {
  "p": 20,
  "q": "Si estuvo casada por lo menos diez años",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 10,
   "unit": "años",
   "label": "DE MATRIMONIO, COMO MÍNIMO",
   "photo": "img/t30selloes_a20_boda_70s.jpg",
   "at": 558.78,
   "tone": "red",
   "compare": "No se volvió a casar · su ex tiene 62 o más.",
   "compareAt": 563.28
  }
 },
 {
  "p": 21,
  "q": "Número cinco",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 5",
   "part": "VIUDAS Y VIUDOS"
  }
 },
 {
  "p": 22,
  "q": "hasta el cien por ciento",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "value": 100,
   "unit": "%",
   "label": "PARA EL CÓNYUGE QUE QUEDA",
   "photo": "img/t30selloes_a36_viuda_tumba.jpg",
   "at": 602.72,
   "tone": "red",
   "compare": "Si ya cumplió su edad completa.",
   "compareAt": 606.94
  }
 },
 {
  "p": 23,
  "q": "doscientos cincuenta y cinco dólares",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "value": 255,
   "unit": "dólares",
   "label": "PAGO ÚNICO POR FALLECIMIENTO",
   "photo": "img/t30selloes_e35_mandado.jpg",
   "at": 654.5,
   "tone": "red",
   "compare": "Hay que pedirlo dentro de 2 años.",
   "compareAt": 656.1,
   "prefix": "$"
  }
 },
 {
  "p": 24,
  "q": "Número seis",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 6",
   "part": "MAESTROS, POLICÍAS, BOMBEROS"
  }
 },
 {
  "p": 26,
  "q": "En enero de dos mil veinticinco",
  "dur": 7.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "03",
   "label": "ENERO DE 2025 · NUEVA LEY",
   "title": "SOCIAL SECURITY FAIRNESS ACT",
   "sub": "Se terminaron las dos reglas",
   "stamp": "",
   "typeAt": 720.24,
   "stampAt": 726.26
  }
 },
 {
  "p": 27,
  "q": "Número siete",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 7",
   "part": "MEDICARE LE COBRA DE MÁS"
  }
 },
 {
  "p": 28,
  "q": "se calcula con su declaración de impuestos de hace dos años",
  "dur": 7.0,
  "comp": "BigStat",
  "props": {
   "value": 2,
   "unit": "años",
   "label": "SU DECLARACIÓN DE HACE",
   "photo": "img/t30selloes_a45_consultorio.jpg",
   "at": 793.82,
   "tone": "red",
   "compare": "Un sueldo que a lo mejor ya no tiene.",
   "compareAt": 800.04
  }
 },
 {
  "p": 29,
  "q": "Hay un formulario, se llama SSA-44",
  "dur": 17.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloes_doc_ssa44.jpg",
   "chip": "FORMULARIO SSA-44",
   "highlights": [
    {
     "x": 6.0,
     "y": 28.55,
     "w": 60.0,
     "h": 3.18,
     "at": 814.04
    },
    {
     "x": 6.0,
     "y": 24.91,
     "w": 60.0,
     "h": 3.18,
     "at": 815.34
    },
    {
     "x": 6.0,
     "y": 21.27,
     "w": 60.0,
     "h": 3.18,
     "at": 818.28
    },
    {
     "x": 6.0,
     "y": 39.45,
     "w": 60.0,
     "h": 3.18,
     "at": 820.26
    }
   ],
   "note": {
    "text": "SSA-44: anótelo",
    "at": 822.56
   },
   "aspect": 0.7727,
   "source": "Carta de ejemplo hecha para este video · sin datos reales"
  }
 },
 {
  "p": 30,
  "q": "Número ocho",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 8",
   "part": "EL RELOJ DE LOS 60 DÍAS"
  }
 },
 {
  "p": 31,
  "q": "usted tiene sesenta días para pedir que lo revisen otra vez",
  "dur": 7.0,
  "comp": "BigStat",
  "props": {
   "value": 60,
   "unit": "días",
   "label": "PARA PEDIR OTRA REVISIÓN",
   "photo": "img/t30selloes_a50_mano_cajon.jpg",
   "at": 858.68,
   "tone": "red",
   "compare": "Desde que le llega la carta.",
   "compareAt": 864.86
  }
 },
 {
  "p": 33,
  "q": "Número nueve",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 9",
   "part": "REVISAR UNA VEZ NO ALCANZA"
  }
 },
 {
  "p": 34,
  "q": "Mire tres renglones",
  "dur": 9.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloes_doc_enero.jpg",
   "chip": "LA CARTA DE ENERO",
   "highlights": [
    {
     "x": 6.0,
     "y": 20.82,
     "w": 88.0,
     "h": 4.55,
     "at": 945.12
    },
    {
     "x": 6.0,
     "y": 27.64,
     "w": 88.0,
     "h": 4.55,
     "at": 947.82
    },
    {
     "x": 6.0,
     "y": 41.27,
     "w": 88.0,
     "h": 4.55,
     "at": 950.04
    }
   ],
   "note": {
    "text": "compárelo con el año pasado",
    "at": 951.48
   },
   "aspect": 0.7727,
   "source": "Carta de ejemplo hecha para este video · sin datos reales"
  }
 },
 {
  "p": 35,
  "q": "son mil doscientos dólares al año",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "value": 1200,
   "unit": "al año",
   "label": "UN BENEFICIO DE CÓNYUGE NUNCA PEDIDO",
   "photo": "img/t30selloes_e48_cuenta_libreta.jpg",
   "at": 993.7,
   "tone": "red",
   "compare": "Cien dólares al mes × 12.",
   "compareAt": 995.2,
   "prefix": "$"
  }
 },
 {
  "p": 36,
  "q": "Su tarea es chiquita",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "LA TAREA",
   "part": "DOS COSAS ESTA SEMANA"
  }
 },
 {
  "p": 36,
  "q": "Dos cosas esta semana",
  "dur": 6.5,
  "comp": "BigStat",
  "props": {
   "value": 2,
   "unit": "cosas",
   "label": "ESTA SEMANA",
   "photo": "img/t30selloes_a58_cafe_carta.jpg",
   "at": 1015.0,
   "tone": "red",
   "compare": "Revise su historial · pregunte por el beneficio más alto.",
   "compareAt": 1017.58
  }
 },
 {
  "p": 38,
  "q": "cuénteme en los comentarios",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "04",
   "label": "CUÉNTEME EN LOS COMENTARIOS",
   "title": "¿EN QUÉ AÑO NACIÓ?",
   "sub": "¿Sabía su edad de jubilación completa?",
   "stamp": "",
   "typeAt": 1071.96,
   "stampAt": 1076.02
  }
 }
];
export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
