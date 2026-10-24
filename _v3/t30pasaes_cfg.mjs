// _v3/t30pasaes_cfg.mjs — "JAPÓN | El País Más Educado del Mundo, Donde 76.000 Personas Mueren Solas Cada Año" · Pasaporte Sucio (ES), Javier.
// Generado por D:/rtmp_t30pasaes/tools/mk_cfg.py (tiempos de words.json). Ritmo Bertha: avatar ~22 % en ventanas 3-6 s, b-roll 2,3-5,2 s (mediana ~3,6).
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 3.0;
export const AVATAR_WIN_MAX = 6.0;
export const AVATAR_CAND_MAX = 6.0;
export const AVATAR_OBJ = 0.22;
export const APERTURA_MIN = 3.0;
export const TRANSICIONES = true;
export const SECCIONES = [{"sec": "S1", "rol": "hook", "p0": 1, "p1": 4}, {"sec": "S2", "rol": "explica", "p0": 5, "p1": 6}, {"sec": "S3", "rol": "prueba", "p0": 7, "p1": 11}, {"sec": "S4", "rol": "explica", "p0": 12, "p1": 19}, {"sec": "S5", "rol": "prueba", "p0": 20, "p1": 24}, {"sec": "S6", "rol": "prueba", "p0": 25, "p1": 28}, {"sec": "S7", "rol": "explica", "p0": 29, "p1": 32}, {"sec": "S8", "rol": "cierre", "p0": 33, "p1": 41}];
const R = [3.6, 2.6, 4.4, 3.1, 5.0, 2.4, 3.9, 4.7, 2.9, 3.4, 5.2, 3.0];
export const ESCALERA = { hook: [2.4, 3.0, 2.6, 3.4, 2.3, 3.8, 2.8, 4.2, 2.5, 3.2, 2.7, 3.6], explica: R, receta: [...R].reverse(), prueba: [3.2, 4.6, 2.5, 3.8, 5.1, 2.8, 3.5, 4.2, 2.4, 3.9, 4.9, 3.1], cierre: R };
export const ORDEN_FORZADO = {};
export const OVERLAY = ['ActChip'];
export const IMPORTS = {
  BigStat: '../backfire/BigStat', FileStamp: '../backfire/FileStamp', ActChip: '../backfire/ActChip', YearCounter: '../backfire/YearCounter',
  SplitVs: '../backfire/SplitVs', MapPin: '../backfire/MapPin', SceneCallout: '../backfire/SceneCallout',
};
export const BEDS = ["a01_doors_row", "a07_wallet_seat", "a20_elderly_bench", "a23_key_door", "a27_closed_door_night", "a30_tv_through_wall", "a31_hikikomori_room", "a36_miniature_room", "a40_for_rent", "a41_map_icons", "a43_akiya_house", "a48_maternity_empty", "a49_funeral_flowers", "a50_newspapers_door", "a56_kettle_white", "a63_law_paper", "a65_windows_many", "a67_cafe_morning"];
export const COMPONENTES = [
 {
  "p": 1,
  "q": "Cada año, en Japón, setenta y seis mil personas mueren así.",
  "dur": 8.6,
  "comp": "BigStat",
  "props": {
   "value": 76000,
   "unit": "personas",
   "label": "MUEREN SOLAS EN SU CASA, CADA AÑO",
   "compare": "En el país más educado del mundo.",
   "source": "Agencia Nacional de Policía de Japón, 2024",
   "photo": "img/t30pasaes_a01_doors_row.jpg",
   "tone": "red",
   "at": 13.84,
   "compareAt": 16.76
  }
 },
 {
  "p": 2,
  "q": "ni una sola persona de esta ciudad de catorce millones vino a buscarlo.",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "value": 14,
   "unit": "millones",
   "label": "DE PERSONAS VIVEN EN TOKIO",
   "compare": "Y nadie vino a buscarlo.",
   "source": "Gobierno Metropolitano de Tokio",
   "photo": "img/t30pasaes_a65_windows_many.jpg",
   "tone": "white",
   "at": 53.16,
   "compareAt": 54.06
  }
 },
 {
  "p": 5,
  "q": "Soy Javier.",
  "dur": 5.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "PASAPORTE SUCIO · Nº 01",
   "title": "JAPÓN",
   "sub": "El lado que no sale en la postal",
   "part": "",
   "stamp": "",
   "typeAt": 92.08
  }
 },
 {
  "p": 7,
  "q": "Empecemos por el número, porque es real, y es más grande de lo que parece.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "PASAPORTE SUCIO · JAPÓN",
   "title": "EL NÚMERO",
   "sub": "",
   "part": "PARTE 1",
   "stamp": "",
   "typeAt": 136.04
  }
 },
 {
  "p": 8,
  "q": "En dos mil veinticuatro, la Agencia Nacional de Policía de Japón",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "JAPÓN · PARTE 1",
   "part": "EL NÚMERO"
  }
 },
 {
  "p": 8,
  "q": "La cifra fue de poco más de setenta y seis mil.",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 76020,
   "unit": "personas",
   "label": "MURIERON SOLAS EN SU CASA · JAPÓN, 2024",
   "compare": "Más de 3 de cada 4 tenían más de 65 años.",
   "source": "Agencia Nacional de Policía de Japón (primer conteo nacional, 2024)",
   "photo": "img/t30pasaes_keisatsucho.jpg",
   "credit": "Foto: っ · CC BY-SA 3.0 · Wikimedia Commons",
   "tone": "red",
   "at": 152.8,
   "compareAt": 153.68
  }
 },
 {
  "p": 9,
  "q": "Kodoku significa soledad.",
  "dur": 6.8,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30pasaes_a30_tv_through_wall.jpg",
   "rightImg": "img/t30pasaes_a49_funeral_flowers.jpg",
   "leftHead": "KODOKU",
   "rightHead": "SHI",
   "leftText": "Soledad",
   "rightText": "Muerte",
   "stamp": "KODOKUSHI",
   "leftAt": 170.76,
   "rightAt": 172.76
  }
 },
 {
  "p": 10,
  "q": "Justo a las afueras de Tokio, en una ciudad llamada Matsudo",
  "dur": 9.4,
  "comp": "MapPin",
  "props": {
   "map": "img/t30pasaes_map_kanto.jpg",
   "pins": [
    {
     "x": 745,
     "y": 760,
     "label": "TOKIO",
     "at": 186.82,
     "zoom": 1.3
    },
    {
     "x": 935,
     "y": 580,
     "label": "MATSUDO",
     "at": 188.7,
     "zoom": 1.9
    },
    {
     "x": 1003,
     "y": 559,
     "label": "TOKIWADAIRA",
     "year": "1960",
     "at": 192.76,
     "zoom": 2.6
    }
   ],
   "kicker": "JAPÓN · CHIBA",
   "credit": "Mapa: Soren Bradley · CC0 · Wikimedia Commons"
  }
 },
 {
  "p": 13,
  "q": "La primera razón es la edad del país.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "PASAPORTE SUCIO · JAPÓN",
   "title": "RAZÓN 1 · LA EDAD",
   "sub": "",
   "part": "PARTE 2",
   "stamp": "",
   "typeAt": 249.2
  }
 },
 {
  "p": 13,
  "q": "Japón tiene una de las poblaciones más viejas del planeta.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "JAPÓN · PARTE 2",
   "part": "RAZÓN 1 · LA EDAD"
  }
 },
 {
  "p": 13,
  "q": "Casi el treinta por ciento de la gente aquí tiene más de sesenta y cinco años.",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 29.3,
   "decimals": 1,
   "unit": "%",
   "label": "DE LA GENTE EN JAPÓN TIENE MÁS DE 65 AÑOS",
   "compare": "Casi 1 de cada 3 personas en la calle.",
   "source": "Oficina de Estadística de Japón, 2024",
   "photo": "img/t30pasaes_a20_elderly_bench.jpg",
   "tone": "white",
   "at": 255.48,
   "compareAt": 260.7
  }
 },
 {
  "p": 14,
  "q": "Casi cuatro de cada diez hogares en Japón son una sola persona viviendo sola.",
  "dur": 8.2,
  "comp": "BigStat",
  "props": {
   "value": 38,
   "unit": "%",
   "label": "DE LOS HOGARES: UNA SOLA PERSONA",
   "compare": "Una persona, una llave, una puerta.",
   "source": "Censo de Japón, 2020",
   "photo": "img/t30pasaes_a23_key_door.jpg",
   "tone": "white",
   "at": 276.44,
   "compareAt": 281.68
  }
 },
 {
  "p": 15,
  "q": "La segunda razón es una palabra que tienes que conocer si quieres entender este país.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "PASAPORTE SUCIO · JAPÓN",
   "title": "RAZÓN 2 · MEIWAKU",
   "sub": "",
   "part": "PARTE 3",
   "stamp": "",
   "typeAt": 284.98
  }
 },
 {
  "p": 15,
  "q": "Significa ser una carga.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "JAPÓN · PARTE 3",
   "part": "RAZÓN 2 · MEIWAKU"
  }
 },
 {
  "p": 16,
  "q": "La misma educación que te devuelve la billetera es la educación que no deja que un anciano pida ayuda.",
  "dur": 6.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30pasaes_a07_wallet_seat.jpg",
   "rightImg": "img/t30pasaes_a27_closed_door_night.jpg",
   "leftHead": "LA EDUCACIÓN QUE…",
   "rightHead": "…Y LA MISMA EDUCACIÓN",
   "leftText": "Te devuelve la billetera",
   "rightText": "No deja pedir ayuda",
   "stamp": "LA PARADOJA",
   "leftAt": 332.46,
   "rightAt": 334.78
  }
 },
 {
  "p": 18,
  "q": "La tercera razón son las paredes.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "PASAPORTE SUCIO · JAPÓN",
   "title": "RAZÓN 3 · LAS PAREDES",
   "sub": "",
   "part": "PARTE 4",
   "stamp": "",
   "typeAt": 348.78
  }
 },
 {
  "p": 18,
  "q": "No las paredes de papel de las casas antiguas.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "JAPÓN · PARTE 4",
   "part": "RAZÓN 3 · LAS PAREDES"
  }
 },
 {
  "p": 19,
  "q": "calculó cerca de un millón y medio de personas de entre quince y sesenta y cuatro años viviendo así.",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 1.46,
   "decimals": 2,
   "unit": "millones",
   "label": "HIKIKOMORI · DE 15 A 64 AÑOS",
   "compare": "Gente en la mitad de su vida.",
   "source": "Oficina del Gabinete de Japón, encuesta 2023",
   "photo": "img/t30pasaes_a31_hikikomori_room.jpg",
   "tone": "white",
   "at": 393.24,
   "compareAt": 398.52
  }
 },
 {
  "p": 20,
  "q": "Ahora, quiero que veas esto.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "PASAPORTE SUCIO · JAPÓN",
   "title": "LA INDUSTRIA SILENCIOSA",
   "sub": "",
   "part": "PARTE 5",
   "stamp": "",
   "typeAt": 403.42
  }
 },
 {
  "p": 20,
  "q": "Porque Japón no se quedó mirando.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "JAPÓN · PARTE 5",
   "part": "LA INDUSTRIA SILENCIOSA"
  }
 },
 {
  "p": 22,
  "q": "el calendario detenido en un mes.",
  "dur": 5,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30pasaes_a36_miniature_room.jpg",
   "x": 1229,
   "y": 393,
   "r": 110,
   "note": "El calendario, detenido",
   "circleAt": 453.32,
   "noteAt": 453.98
  }
 },
 {
  "p": 24,
  "q": "La soledad de una generación se convierte en el descuento de la siguiente.",
  "dur": 6,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30pasaes_a40_for_rent.jpg",
   "rightImg": "img/t30pasaes_a41_map_icons.jpg",
   "leftHead": "UNA GENERACIÓN",
   "rightHead": "LA SIGUIENTE",
   "leftText": "Muere sola",
   "rightText": "Alquila más barato",
   "stamp": "JIKO BUKKEN",
   "leftAt": 519.58,
   "rightAt": 522.4
  }
 },
 {
  "p": 25,
  "q": "Ahora aleja la cámara, porque los departamentos son sólo el principio.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "PASAPORTE SUCIO · JAPÓN",
   "title": "LAS CASAS VACÍAS",
   "sub": "",
   "part": "PARTE 6",
   "stamp": "",
   "typeAt": 524.46
  }
 },
 {
  "p": 25,
  "q": "el gobierno contó cerca de nueve millones de casas vacías en Japón.",
  "dur": 6.5,
  "comp": "BigStat",
  "props": {
   "value": 9,
   "unit": "millones",
   "label": "DE CASAS VACÍAS EN JAPÓN · 2023",
   "compare": "Nueve millones.",
   "source": "Encuesta de Vivienda y Tierra, Ministerio del Interior, 2023",
   "photo": "img/t30pasaes_a43_akiya_house.jpg",
   "tone": "red",
   "at": 531.96,
   "compareAt": 534.76
  }
 },
 {
  "p": 25,
  "q": "Casas en el campo donde murió el último de la familia",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "JAPÓN · PARTE 6",
   "part": "LAS CASAS VACÍAS"
  }
 },
 {
  "p": 26,
  "q": "En dos mil veinticuatro nacieron menos de setecientos mil bebés de padres japoneses",
  "dur": 11.5,
  "comp": "YearCounter",
  "props": {
   "photo": "img/t30pasaes_a48_maternity_empty.jpg",
   "yearFrom": 1949,
   "yearTo": 2024,
   "popFrom": 2696638,
   "popTo": 686061,
   "unit": "bebés",
   "label": "NACIMIENTOS EN JAPÓN POR AÑO",
   "from": 555.94,
   "to": 566.94,
   "marks": [
    {
     "year": 1949,
     "note": "2,7 millones"
    },
    {
     "year": 2024,
     "note": "686.061 · el mínimo"
    }
   ],
   "source": "Ministerio de Salud de Japón · estadísticas vitales"
  }
 },
 {
  "p": 29,
  "q": "Y después está la parte que es casi tierna.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "PASAPORTE SUCIO · JAPÓN",
   "title": "LA TECNOLOGÍA DEL CUIDADO",
   "sub": "",
   "part": "PARTE 7",
   "stamp": "",
   "typeAt": 624.8
  }
 },
 {
  "p": 29,
  "q": "Japón creó tecnología para saber si la gente sigue viva",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "JAPÓN · PARTE 7",
   "part": "LA TECNOLOGÍA DEL CUIDADO"
  }
 },
 {
  "p": 29,
  "q": "Mamá hizo té.",
  "dur": 4.5,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30pasaes_a56_kettle_white.jpg",
   "x": 444,
   "y": 577,
   "r": 150,
   "note": "Mamá hizo té. Está bien.",
   "circleAt": 644.83,
   "noteAt": 645.33
  }
 },
 {
  "p": 32,
  "q": "Nombró un ministro de la soledad.",
  "dur": 11.1,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30pasaes_kantei.jpg",
   "rightImg": "img/t30pasaes_a63_law_paper.jpg",
   "leftHead": "2021",
   "rightHead": "2024",
   "leftText": "Un ministro de la soledad",
   "rightText": "Una ley nacional",
   "stamp": "PROBLEMA PÚBLICO",
   "credit": "Foto: AMANO Jun-ichi · CC BY 3.0 · Wikimedia Commons",
   "leftAt": 693.67,
   "rightAt": 701.75
  }
 },
 {
  "p": 33,
  "q": "Así que aquí es donde terminé, después de semanas en este cuarto, escuchando el televisor de mi vecino.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "PASAPORTE SUCIO · JAPÓN",
   "title": "LO QUE APRENDÍ",
   "sub": "",
   "part": "PARTE 8",
   "stamp": "",
   "typeAt": 711.85
  }
 },
 {
  "p": 34,
  "q": "Las muertes solitarias de Japón no son una historia de gente a la que no le importa.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "JAPÓN · PARTE 8",
   "part": "LO QUE APRENDÍ"
  }
 },
 {
  "p": 36,
  "q": "La buena noticia está en Tokiwadaira.",
  "dur": 4,
  "comp": "MapPin",
  "props": {
   "map": "img/t30pasaes_map_kanto.jpg",
   "pins": [
    {
     "x": 1003,
     "y": 559,
     "label": "TOKIWADAIRA",
     "at": 758.53,
     "zoom": 2.6
    }
   ],
   "kicker": "MATSUDO · CHIBA",
   "credit": "Mapa: Soren Bradley · CC0 · Wikimedia Commons"
  }
 },
 {
  "p": 38,
  "q": "En Tokiwadaira, es la diferencia entre tres días y tres años.",
  "dur": 3.6,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30pasaes_a67_cafe_morning.jpg",
   "rightImg": "img/t30pasaes_a50_newspapers_door.jpg",
   "leftHead": "SI ALGUIEN TOCA LA PUERTA",
   "rightHead": "SI NADIE LA TOCA",
   "leftText": "Tres días",
   "rightText": "Tres años",
   "stamp": "",
   "leftAt": 806.47,
   "rightAt": 809.45
  }
 },
 {
  "p": 40,
  "q": "En el próximo episodio llevo esta misma pregunta a un país que es lo opuesto a Japón",
  "dur": 5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "02",
   "label": "PRÓXIMO · Nº 02",
   "title": "EL PAÍS OPUESTO",
   "sub": "Tan lleno de gente que no puedes estar solo",
   "part": "",
   "stamp": "",
   "typeAt": 824.75
  }
 }
];
export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
