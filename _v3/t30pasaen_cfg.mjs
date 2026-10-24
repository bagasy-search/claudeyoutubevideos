// _v3/t30pasaen_cfg.mjs — "JAPAN: kodokushi" · Javier (Dirty Passport, EN), Nº 01. Generado por D:/rtmp_t30pasaen/tools/mk_cfg.py
// (tiempos de words.json). Ritmo Bertha: avatar ~22 % en ventanas 3-6 s, b-roll 2,3-5,2 s (mediana ~3,6).
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 3.0;
export const AVATAR_WIN_MAX = 6.0;
export const AVATAR_CAND_MAX = 6.0;
export const AVATAR_OBJ = 0.22;
export const APERTURA_MIN = 3.0;
export const TRANSICIONES = true;
export const SECCIONES = [{"sec": "S1", "rol": "hook", "p0": 1, "p1": 4}, {"sec": "S2", "rol": "explica", "p0": 5, "p1": 6}, {"sec": "S3", "rol": "prueba", "p0": 7, "p1": 11}, {"sec": "S4", "rol": "explica", "p0": 12, "p1": 19}, {"sec": "S5", "rol": "prueba", "p0": 20, "p1": 24}, {"sec": "S6", "rol": "prueba", "p0": 25, "p1": 28}, {"sec": "S7", "rol": "receta", "p0": 29, "p1": 32}, {"sec": "S8", "rol": "cierre", "p0": 33, "p1": 41}];
const R = [3.6, 2.6, 4.4, 3.1, 5.0, 2.4, 3.9, 4.7, 2.9, 3.4, 5.2, 3.0];
export const ESCALERA = { hook: [2.4, 3.0, 2.6, 3.4, 2.3, 3.8, 2.8, 4.2, 2.5, 3.2, 2.7, 3.6], explica: R, receta: [...R].reverse(), prueba: [3.2, 4.6, 2.5, 3.8, 5.1, 2.8, 3.5, 4.2, 2.4, 3.9, 4.9, 3.1], cierre: R };
export const ORDEN_FORZADO = {"S1": ["t30pasaen_f01", "t30pasaen_f02", "t30pasaen_f03"]};
export const OVERLAY = ['ActChip'];
export const IMPORTS = {
  BigStat: '../backfire/BigStat', FileStamp: '../backfire/FileStamp', ActChip: '../backfire/ActChip', SplitVs: '../backfire/SplitVs',
  PullQuote: '../backfire/PullQuote', DocumentPage: '../backfire/DocumentPage', MapPin: '../backfire/MapPin', SceneCallout: '../backfire/SceneCallout',
};
export const BEDS = ["a05_phone_bow", "a08_lost_found", "a13_police_stats", "a15_danchi_aerial", "a27_closed_door_night", "a29_modern_tower", "a31_hikikomori_room", "a36_miniature_room", "a40_for_rent", "a41_map_icons", "a42_old_building_stairs", "a44_akiya_inside", "a45_akiya_village", "a48_maternity_empty", "a49_funeral_flowers", "a53_prison_meal", "a54_living_room_alone", "a55_street_whole", "a58_phone_message", "a62_gov_building", "a63_law_paper", "a66_curtain_still", "a69_name_plate", "a70_corridor_wave"];
export const COMPONENTES = [
 {
  "p": 1,
  "q": "Every year in Japan, seventy-six thousand people die like that.",
  "dur": 5,
  "comp": "BigStat",
  "props": {
   "value": 76000,
   "unit": "people a year",
   "label": "DIE ALONE AT HOME · JAPAN",
   "compare": "In the most polite country on earth.",
   "source": "National Police Agency, 2024",
   "photo": "img/t30pasaen_a27_closed_door_night.jpg",
   "tone": "red",
   "at": 10.8,
   "compareAt": 14.08
  }
 },
 {
  "p": 5,
  "q": "I'm Javier.",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "DIRTY PASSPORT Nº 01",
   "title": "JAPAN",
   "sub": "The side the postcard doesn't show",
   "part": "",
   "stamp": "BEHIND THE DOOR",
   "typeAt": 76.24,
   "stampAt": 81.74
  }
 },
 {
  "p": 7,
  "q": "Let's start with the number,",
  "dur": 3.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "Nº 01",
   "title": "THE NUMBER",
   "sub": "",
   "part": "PART 1",
   "stamp": "",
   "typeAt": 114.88
  }
 },
 {
  "p": 8,
  "q": "In twenty twenty-four, Japan's National Police Agency",
  "dur": 3.0,
  "comp": "ActChip",
  "props": {
   "fileNo": "PART 1",
   "part": "THE NUMBER"
  }
 },
 {
  "p": 8,
  "q": "The number was a little over seventy-six thousand.",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 76020,
   "unit": "people",
   "label": "DIED ALONE AT HOME · JAPAN · 2024",
   "compare": "More than 3 in 4 were over 65.",
   "source": "National Police Agency, 2024",
   "photo": "img/t30pasaen_a13_police_stats.jpg",
   "tone": "red",
   "at": 132.2,
   "compareAt": 134.26
  }
 },
 {
  "p": 9,
  "q": "Kodokushi.",
  "dur": 6.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30pasaen_a54_living_room_alone.jpg",
   "rightImg": "img/t30pasaen_a49_funeral_flowers.jpg",
   "leftHead": "KODOKU",
   "rightHead": "SHI",
   "leftText": "Solitude",
   "rightText": "Death",
   "stamp": "KODOKUSHI",
   "leftAt": 146.24,
   "rightAt": 148.14
  }
 },
 {
  "p": 10,
  "q": "Just outside Tokyo, in a city called Matsudo,",
  "dur": 6.8,
  "comp": "MapPin",
  "props": {
   "map": "img/t30pasaen_map_kanto.jpg",
   "pins": [
    {
     "x": 745,
     "y": 760,
     "label": "TOKYO",
     "at": 159.36,
     "zoom": 1.3
    },
    {
     "x": 935,
     "y": 580,
     "label": "MATSUDO",
     "at": 160.76,
     "zoom": 1.9
    },
    {
     "x": 1003,
     "y": 559,
     "label": "TOKIWADAIRA",
     "year": "1960",
     "at": 163.82,
     "zoom": 2.6
    }
   ],
   "kicker": "JAPAN · CHIBA",
   "credit": "Map: Soren Bradley · CC0 · Wikimedia Commons"
  }
 },
 {
  "p": 13,
  "q": "The first reason is the age of the country, right?",
  "dur": 3.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "Nº 01",
   "title": "AN OLD COUNTRY",
   "sub": "",
   "part": "PART 2",
   "stamp": "",
   "typeAt": 213.35
  }
 },
 {
  "p": 13,
  "q": "Japan has one of the oldest populations on the planet.",
  "dur": 3.0,
  "comp": "ActChip",
  "props": {
   "fileNo": "PART 2",
   "part": "AN OLD COUNTRY"
  }
 },
 {
  "p": 13,
  "q": "Almost thirty percent of the people here are over sixty-five.",
  "dur": 4.6,
  "comp": "BigStat",
  "props": {
   "value": 29.3,
   "decimals": 1,
   "unit": "%",
   "label": "OF JAPAN IS 65 OR OLDER",
   "source": "Statistics Bureau, 2024",
   "photo": "img/t30pasaen_a55_street_whole.jpg",
   "tone": "white",
   "at": 219.73
  }
 },
 {
  "p": 13,
  "q": "Nearly one in three people you pass on the street.",
  "dur": 4.6,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30pasaen_doc_pyramid.jpg",
   "aspect": 1.435,
   "highlights": [
    {
     "x": 1.0,
     "y": 6.5,
     "w": 98.0,
     "h": 29.5,
     "at": 224.85
    }
   ],
   "chip": "AGE BY AGE",
   "source": "CIA World Factbook, 2015",
   "credit": "Public domain",
   "note": {
    "text": "Nearly 1 in 3 over 65",
    "at": 225.45
   },
   "bed": "img/t30pasaen_a15_danchi_aerial.jpg"
  }
 },
 {
  "p": 14,
  "q": "Nearly four out of every ten households in Japan are one person living alone.",
  "dur": 6,
  "comp": "BigStat",
  "props": {
   "value": 38,
   "unit": "%",
   "label": "OF HOUSEHOLDS ARE ONE PERSON ALONE",
   "compare": "One person. One key. One door.",
   "source": "Census of Japan, 2020",
   "photo": "img/t30pasaen_a29_modern_tower.jpg",
   "tone": "white",
   "at": 236.53,
   "compareAt": 239.91
  }
 },
 {
  "p": 15,
  "q": "The second reason is a word you need to know",
  "dur": 3.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "Nº 01",
   "title": "MEIWAKU",
   "sub": "",
   "part": "PART 3",
   "stamp": "",
   "typeAt": 242.45
  }
 },
 {
  "p": 15,
  "q": "Meiwaku.",
  "dur": 3.0,
  "comp": "ActChip",
  "props": {
   "fileNo": "PART 3",
   "part": "MEIWAKU"
  }
 },
 {
  "p": 16,
  "q": "The same politeness that returns your wallet is the politeness that keeps an old man from asking for help.",
  "dur": 6.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30pasaen_a08_lost_found.jpg",
   "rightImg": "img/t30pasaen_a05_phone_bow.jpg",
   "leftHead": "IT RETURNS",
   "rightHead": "IT KEEPS",
   "leftText": "Your lost wallet",
   "rightText": "An old man from asking for help",
   "stamp": "SAME POLITENESS",
   "leftAt": 287.69,
   "rightAt": 290.13
  }
 },
 {
  "p": 18,
  "q": "The third... The third reason is the walls.",
  "dur": 3.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "Nº 01",
   "title": "THE WALLS",
   "sub": "",
   "part": "PART 4",
   "stamp": "",
   "typeAt": 300.23
  }
 },
 {
  "p": 18,
  "q": "Not the paper walls of the old houses.",
  "dur": 3.0,
  "comp": "ActChip",
  "props": {
   "fileNo": "PART 4",
   "part": "THE WALLS"
  }
 },
 {
  "p": 19,
  "q": "A government survey in twenty twenty-three estimated about one and a half million people",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 1.5,
   "decimals": 1,
   "unit": "million people",
   "label": "WITHDRAWN FROM SOCIETY · AGES 15-64",
   "compare": "In the middle of their lives.",
   "source": "Cabinet Office, 2023",
   "photo": "img/t30pasaen_a31_hikikomori_room.jpg",
   "tone": "white",
   "at": 341.99,
   "compareAt": 347.07
  }
 },
 {
  "p": 20,
  "q": "Now, here's what I want you to see.",
  "dur": 3.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "Nº 01",
   "title": "THE QUIET INDUSTRY",
   "sub": "",
   "part": "PART 5",
   "stamp": "",
   "typeAt": 350.71
  }
 },
 {
  "p": 20,
  "q": "Because Japan didn't just let this happen.",
  "dur": 3.0,
  "comp": "ActChip",
  "props": {
   "fileNo": "PART 5",
   "part": "THE QUIET INDUSTRY"
  }
 },
 {
  "p": 22,
  "q": "One woman who did this work started building tiny models of the rooms she cleaned.",
  "dur": 10,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30pasaen_a36_miniature_room.jpg",
   "x": 595,
   "y": 400,
   "r": 150,
   "note": "The calendar stopped",
   "chip": "LOOK CLOSER",
   "circleAt": 392.18,
   "noteAt": 392.68
  }
 },
 {
  "p": 24,
  "q": "There are websites that map them, little icons all over Tokyo,",
  "dur": 5.5,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30pasaen_a41_map_icons.jpg",
   "x": 950,
   "y": 150,
   "r": 170,
   "note": "Each icon: a death",
   "chip": "LOOK CLOSER",
   "circleAt": 444.46,
   "noteAt": 445.24
  }
 },
 {
  "p": 24,
  "q": "The loneliness of one generation becomes the discount of the next, right?",
  "dur": 5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30pasaen_a40_for_rent.jpg",
   "rightImg": "img/t30pasaen_a42_old_building_stairs.jpg",
   "leftHead": "ONE GENERATION",
   "rightHead": "THE NEXT",
   "leftText": "Loneliness",
   "rightText": "A discount",
   "stamp": "JIKO BUKKEN",
   "leftAt": 453.88,
   "rightAt": 456.08
  }
 },
 {
  "p": 25,
  "q": "Now zoom out, because the apartments are only the beginning,",
  "dur": 3.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "Nº 01",
   "title": "ZOOM OUT",
   "sub": "",
   "part": "PART 6",
   "stamp": "",
   "typeAt": 458.46
  }
 },
 {
  "p": 25,
  "q": "In twenty twenty-three, the government counted about nine million empty homes in Japan, right?",
  "dur": 6.5,
  "comp": "BigStat",
  "props": {
   "value": 9,
   "unit": "million empty homes",
   "label": "AKIYA · JAPAN · 2023",
   "compare": "About 1 in 7 homes in the country.",
   "source": "Housing Survey, 2023",
   "photo": "img/t30pasaen_a45_akiya_village.jpg",
   "tone": "white",
   "at": 464.58,
   "compareAt": 467.12
  }
 },
 {
  "p": 25,
  "q": "Houses in the countryside where the last person",
  "dur": 3.0,
  "comp": "ActChip",
  "props": {
   "fileNo": "PART 6",
   "part": "ZOOM OUT"
  }
 },
 {
  "p": 26,
  "q": "In twenty twenty-four, fewer than seven hundred thousand babies were born to Japanese parents,",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 686061,
   "unit": "babies",
   "label": "BORN TO JAPANESE PARENTS · 2024",
   "compare": "The lowest since records began in 1899.",
   "source": "Health Ministry, 2025",
   "photo": "img/t30pasaen_a48_maternity_empty.jpg",
   "tone": "red",
   "at": 490.92,
   "compareAt": 494.68
  }
 },
 {
  "p": 27,
  "q": "For some of them, a cell was less lonely than home.",
  "dur": 4.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30pasaen_a53_prison_meal.jpg",
   "rightImg": "img/t30pasaen_a44_akiya_inside.jpg",
   "leftHead": "PRISON",
   "rightHead": "HOME",
   "leftText": "Meals, company",
   "rightText": "Nobody",
   "stamp": "LESS LONELY",
   "leftAt": 533.86,
   "rightAt": 534.96
  }
 },
 {
  "p": 29,
  "q": "And then there's the part that's almost tender.",
  "dur": 3.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "Nº 01",
   "title": "CHECKING IN",
   "sub": "",
   "part": "PART 7",
   "stamp": "",
   "typeAt": 548.96
  }
 },
 {
  "p": 29,
  "q": "Japan built technology to check if people are still alive,",
  "dur": 3.0,
  "comp": "ActChip",
  "props": {
   "fileNo": "PART 7",
   "part": "CHECKING IN"
  }
 },
 {
  "p": 29,
  "q": "Mom made tea. Mom is fine.",
  "dur": 4,
  "comp": "PullQuote",
  "props": {
   "quote": "Mom made tea. Mom is fine.",
   "who": "The kettle's message",
   "year": "",
   "source": "A message, every time she boils water",
   "at": 566.87,
   "until": 569.15,
   "highlight": "Mom is fine",
   "bed": "img/t30pasaen_a58_phone_message.jpg"
  }
 },
 {
  "p": 32,
  "q": "It appointed... It appointed a minister for loneliness.",
  "dur": 10.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30pasaen_a62_gov_building.jpg",
   "rightImg": "img/t30pasaen_a63_law_paper.jpg",
   "leftHead": "2021",
   "rightHead": "2024",
   "leftText": "A minister for loneliness",
   "rightText": "A national law on loneliness",
   "stamp": "OFFICIAL",
   "leftAt": 612.99,
   "rightAt": 620.79
  }
 },
 {
  "p": 33,
  "q": "So here's where I've ended up,",
  "dur": 3.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "Nº 01",
   "title": "WHERE I ENDED UP",
   "sub": "",
   "part": "PART 8",
   "stamp": "",
   "typeAt": 629.29
  }
 },
 {
  "p": 34,
  "q": "The lonely deaths in Japan are not a story about people who don't care.",
  "dur": 3.0,
  "comp": "ActChip",
  "props": {
   "fileNo": "PART 8",
   "part": "WHERE I ENDED UP"
  }
 },
 {
  "p": 36,
  "q": "The good news is in Tokiwadaira.",
  "dur": 4,
  "comp": "MapPin",
  "props": {
   "map": "img/t30pasaen_map_kanto.jpg",
   "pins": [
    {
     "x": 1003,
     "y": 559,
     "label": "TOKIWADAIRA",
     "at": 668.83,
     "zoom": 2.6
    }
   ],
   "kicker": "MATSUDO · CHIBA",
   "credit": "Map: Soren Bradley · CC0 · Wikimedia Commons",
   "bed": "img/t30pasaen_map_kanto.jpg"
  }
 },
 {
  "p": 38,
  "q": "In Tokiwadaira, it's the difference between three days and three years.",
  "dur": 5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30pasaen_a70_corridor_wave.jpg",
   "rightImg": "img/t30pasaen_a66_curtain_still.jpg",
   "leftHead": "SOMEONE KNOWS YOUR NAME",
   "rightHead": "NOBODY DOES",
   "leftText": "Found in 3 days",
   "rightText": "Found in 3 years",
   "stamp": "",
   "leftAt": 713.01,
   "rightAt": 713.75
  }
 },
 {
  "p": 39,
  "q": "do you know the name of the person who lives on the other side of your wall?",
  "dur": 5,
  "comp": "PullQuote",
  "props": {
   "quote": "Do you know the name of the person on the other side of your wall?",
   "who": "Tell me in the comments",
   "year": "",
   "source": "",
   "at": 716.63,
   "until": 720.13,
   "highlight": "the other side of your wall",
   "bed": "img/t30pasaen_a69_name_plate.jpg"
  }
 }
];
export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
