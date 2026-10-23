// _v3/rdaral_cfg.mjs — "The Aral Sea" · Ruth Dalby (EN), file 05. Generado por D:/rtmp_rdaral/tools/mk_cfg.py
// (tiempos de words.json). Ritmo Bertha: avatar 27 % en ventanas 3-6 s, b-roll 2,3-5,2 s (mediana ~3,6).
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 3.0;
export const AVATAR_WIN_MAX = 6.0;
export const AVATAR_CAND_MAX = 6.0;
export const AVATAR_OBJ = 0.27;
export const APERTURA_MIN = 3.0;
export const TRANSICIONES = true;
export const SECCIONES = [
  { sec: 'S1', rol: 'hook', p0: 1, p1: 7 }, { sec: 'S2', rol: 'explica', p0: 8, p1: 10 }, { sec: 'S3', rol: 'explica', p0: 11, p1: 16 },
  { sec: 'S4', rol: 'prueba', p0: 17, p1: 30 }, { sec: 'S5', rol: 'explica', p0: 31, p1: 33 }, { sec: 'S6', rol: 'prueba', p0: 34, p1: 59 },
  { sec: 'S7', rol: 'prueba', p0: 60, p1: 73 }, { sec: 'S8', rol: 'receta', p0: 74, p1: 85 }, { sec: 'S9', rol: 'cierre', p0: 86, p1: 88 },
  { sec: 'S10', rol: 'cierre', p0: 89, p1: 91 },
];
const R = [3.6, 2.6, 4.4, 3.1, 5.0, 2.4, 3.9, 4.7, 2.9, 3.4, 5.2, 3.0];
export const ESCALERA = { hook: [2.4, 3.0, 2.6, 3.4, 2.3, 3.8, 2.8, 4.2, 2.5, 3.2, 2.7, 3.6], explica: R, receta: [...R].reverse(), prueba: [3.2, 4.6, 2.5, 3.8, 5.1, 2.8, 3.5, 4.2, 2.4, 3.9, 4.9, 3.1], cierre: R };
export const ORDEN_FORZADO = {};
export const OVERLAY = ['ActChip'];
export const IMPORTS = {
  BigStat: '../backfire/BigStat', FileStamp: '../backfire/FileStamp', ActChip: '../backfire/ActChip', YearCounter: '../backfire/YearCounter',
  SplitVs: '../backfire/SplitVs', PullQuote: '../backfire/PullQuote', DocumentPage: '../backfire/DocumentPage', MapPin: '../backfire/MapPin',
};
export const BEDS = ["e02_salar", "e03_tormenta_sal", "e07_algodonal", "e18_mujer_panuelo", "e22_pesca_red", "e25_plantando", "e30_vaso_salado", "e42_choza_redes", "h01_red_peces", "h05_cosecha_algodon", "h10_barco_pesca"];
export const COMPONENTES = [
 {
  "p": 1,
  "q": "Sixty-eight thousand square kilometers",
  "dur": 3.6,
  "comp": "BigStat",
  "props": {
   "value": 68000,
   "unit": "km²",
   "label": "THE ARAL SEA · 1960",
   "source": "Source: P. Micklin, Science, 1988",
   "photo": "img/rdaral_b_41g.jpg",
   "at": 5.82
  }
 },
 {
  "p": 2,
  "q": "about ninety-six percent",
  "dur": 6,
  "comp": "BigStat",
  "props": {
   "value": 96,
   "unit": "%",
   "label": "OF ITS WATER · GONE BY 2014",
   "compare": "The whole eastern basin dried up.",
   "source": "Source: P. Micklin et al., 2020",
   "photo": "img/rdaral_e02_salar.jpg",
   "at": 19.42,
   "compareAt": 23.24
  }
 },
 {
  "p": 3,
  "q": "The fishing town of Muynak",
  "dur": 7,
  "comp": "MapPin",
  "props": {
   "map": "img/rdaral_map2017.jpg",
   "kicker": "150 KM FROM THE WATER",
   "credit": "Map: NASA Earth Observatory · public domain",
   "pins": [
    {
     "x": 845,
     "y": 925,
     "label": "MUYNAK",
     "year": "PORT TOWN",
     "at": 31.84,
     "zoom": 1.5
    }
   ]
  }
 },
 {
  "p": 10,
  "q": "This is file number five",
  "dur": 6,
  "comp": "FileStamp",
  "props": {
   "fileNo": "05",
   "title": "THE ARAL SEA",
   "sub": "Kazakhstan · Uzbekistan · 1960",
   "stamp": "OPEN",
   "typeAt": 138.86,
   "stampAt": 141.46
  }
 },
 {
  "p": 11,
  "q": "First, you have to understand",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "word": "PART",
   "fileNo": 1,
   "part": "THE PROBLEM"
  }
 },
 {
  "p": 17,
  "q": "The Soviet planners wanted cotton",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "word": "PART",
   "fileNo": 2,
   "part": "THE PLAN"
  }
 },
 {
  "p": 31,
  "q": "The water started going",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "word": "PART",
   "fileNo": 3,
   "part": "THE LAUNCH"
  }
 },
 {
  "p": 34,
  "q": "Let me take you through it year by year",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "word": "PART",
   "fileNo": 4,
   "part": "YEAR BY YEAR"
  }
 },
 {
  "p": 60,
  "q": "So let's recap",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "word": "PART",
   "fileNo": 5,
   "part": "WHO PAYS"
  }
 },
 {
  "p": 74,
  "q": "Now I promised you the honest part",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "word": "PART",
   "fileNo": 6,
   "part": "WHAT WORKED"
  }
 },
 {
  "p": 86,
  "q": "So let's add it up",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "word": "PART",
   "fileNo": 7,
   "part": "THE LESSON"
  }
 },
 {
  "p": 22,
  "q": "with all its water going to farming",
  "dur": 9.5,
  "comp": "DocumentPage",
  "props": {
   "page": "img/rdaral_doc_p3.jpg",
   "aspect": 0.7727,
   "chip": "SCIENCE · 1988",
   "source": "P. Micklin, Science 241, 1988",
   "highlights": [
    {
     "x": 29.4,
     "y": 30.8,
     "w": 15.2,
     "h": 1.6,
     "at": 318.14
    }
   ],
   "note": {
    "text": "Desirable. Their word.",
    "at": 320.78
   }
  }
 },
 {
  "p": 25,
  "q": "They had a plan for the fish",
  "dur": 6,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/rdaral_h01_red_peces.jpg",
   "rightImg": "img/rdaral_e42_choza_redes.jpg",
   "leftHead": "THE PLAN",
   "rightHead": "THE PEOPLE",
   "leftText": "A plan for the fish",
   "rightText": "No plan for the fishermen",
   "stamp": "FORGOTTEN",
   "leftAt": 345.35,
   "rightAt": 347.27
  }
 },
 {
  "p": 29,
  "q": "They decided that the sea",
  "dur": 9,
  "comp": "PullQuote",
  "props": {
   "quote": "They decided that the sea was not necessary... that the value of the cotton would be greater than the loss of the fish.",
   "who": "Yusup Kamalov, Aral researcher",
   "year": "1992",
   "source": "The Washington Post",
   "at": 401.19,
   "until": 410.35,
   "highlight": "the sea was not necessary",
   "bed": "img/rdaral_h05_cosecha_algodon.jpg"
  }
 },
 {
  "p": 40,
  "q": "The commercial catch",
  "dur": 6.5,
  "comp": "BigStat",
  "props": {
   "value": 48000,
   "unit": "tons of fish",
   "label": "COMMERCIAL CATCH · 1957",
   "compare": "By the early 1980s: zero.",
   "source": "Source: P. Micklin, Science, 1988",
   "photo": "img/rdaral_h10_barco_pesca.jpg",
   "at": 49.9,
   "compareAt": 554.59
  }
 },
 {
  "p": 50,
  "q": "Nineteen eighty-seven. The sea is down",
  "dur": 8,
  "comp": "YearCounter",
  "props": {
   "photo": "img/rdaral_b_sts085.jpg",
   "yearFrom": 1960,
   "yearTo": 1987,
   "popFrom": 53,
   "popTo": 40,
   "unit": "meters above sea level",
   "label": "ARAL SEA · WATER LEVEL",
   "from": 674.26,
   "to": 679.02,
   "marks": [
    {
     "year": 1960,
     "note": "53 m"
    },
    {
     "year": 1987,
     "note": "13 m lower"
    }
   ],
   "source": "Source: P. Micklin, Science, 1988",
   "linear": true
  }
 },
 {
  "p": 51,
  "q": "In nineteen eighty-eight, Micklin wrote in Science",
  "dur": 9,
  "comp": "DocumentPage",
  "props": {
   "page": "img/rdaral_doc_p6.jpg",
   "aspect": 0.7727,
   "chip": "SCIENCE · 1988",
   "source": "P. Micklin, Science 241, 1988",
   "highlights": [
    {
     "x": 64.6,
     "y": 7.1,
     "w": 25.4,
     "h": 1.6,
     "at": 703.26
    },
    {
     "x": 81.0,
     "y": 11.3,
     "w": 12.4,
     "h": 1.6,
     "at": 712.28
    }
   ],
   "note": {
    "text": "Warned in 1988.",
    "at": 713.9
   }
  }
 },
 {
  "p": 59,
  "q": "The salt in that western basin",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 150,
   "unit": "grams of salt per liter",
   "label": "WESTERN BASIN · SOUTH ARAL",
   "compare": "Ocean water: about 35. Four times saltier.",
   "source": "Source: P. Micklin et al., 2020",
   "photo": "img/rdaral_e30_vaso_salado.jpg",
   "at": 814.88,
   "compareAt": 818.26
  }
 },
 {
  "p": 61,
  "q": "the European Space Agency put it",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 40000,
   "unit": "km²",
   "label": "THE ARALKUM · NEW SALT DESERT · 2003",
   "compare": "Bigger than Maryland.",
   "source": "Source: European Space Agency",
   "photo": "img/rdaral_e03_tormenta_sal.jpg",
   "at": 857.76,
   "compareAt": 862.28
  }
 },
 {
  "p": 69,
  "q": "the Washington Post reported infant deaths",
  "dur": 6.5,
  "comp": "BigStat",
  "props": {
   "value": 100,
   "prefix": "~",
   "unit": "per 1,000 births",
   "label": "INFANT DEATHS · KARAKALPAKSTAN · 1992",
   "compare": "About one baby in ten.",
   "source": "Source: The Washington Post, 1992",
   "photo": "img/rdaral_e18_mujer_panuelo.jpg",
   "at": 997.14,
   "compareAt": 1004.22
  }
 },
 {
  "p": 72,
  "q": "The irrigated land kept growing",
  "dur": 8,
  "comp": "YearCounter",
  "props": {
   "photo": "img/rdaral_e07_algodonal.jpg",
   "yearFrom": 1960,
   "yearTo": 2010,
   "popFrom": 5000000,
   "popTo": 8200000,
   "unit": "hectares irrigated",
   "label": "THE FIELDS KEPT GROWING",
   "from": 1044.87,
   "to": 1053.09,
   "marks": [
    {
     "year": 1960,
     "note": "~5 million ha"
    },
    {
     "year": 2010,
     "note": "8.2 million ha"
    }
   ],
   "source": "Source: P. Micklin, 2020",
   "linear": true
  }
 },
 {
  "p": 77,
  "q": "It's called the Kok-Aral",
  "dur": 7,
  "comp": "MapPin",
  "props": {
   "map": "img/rdaral_map2007.jpg",
   "kicker": "NORTH ARAL · KAZAKHSTAN",
   "credit": "Map: NASA Earth Observatory · public domain",
   "pins": [
    {
     "x": 905,
     "y": 262,
     "label": "KOK-ARAL DAM",
     "year": "2005",
     "at": 1113.85,
     "zoom": 1.6
    }
   ]
  }
 },
 {
  "p": 80,
  "q": "In two thousand five, the northern catch",
  "dur": 9,
  "comp": "YearCounter",
  "props": {
   "photo": "img/rdaral_e22_pesca_red.jpg",
   "yearFrom": 2005,
   "yearTo": 2025,
   "popFrom": 695,
   "popTo": 8000,
   "unit": "tons of fish a year",
   "label": "NORTH ARAL · FISH CATCH",
   "from": 1161.63,
   "to": 1173.79,
   "marks": [
    {
     "year": 2005,
     "note": "dam finished"
    },
    {
     "year": 2016,
     "note": "6,000 t"
    },
    {
     "year": 2025,
     "note": "~8,000 t"
    }
   ],
   "source": "Sources: P. Micklin 2020 · Kazakhstan Ministry of Water"
  }
 },
 {
  "p": 84,
  "q": "The United Nations Development Programme reported",
  "dur": 6.5,
  "comp": "BigStat",
  "props": {
   "value": 35100,
   "unit": "hectares",
   "label": "SAXAUL PLANTED · 2018-2020",
   "compare": "On the dry sea floor, to hold the dust.",
   "source": "Source: UNDP Uzbekistan",
   "photo": "img/rdaral_e25_plantando.jpg",
   "at": 1241.47,
   "compareAt": 1245.65
  }
 },
 {
  "p": 90,
  "q": "Next time, it's this one",
  "dur": 7,
  "comp": "FileStamp",
  "props": {
   "fileNo": "06",
   "title": "THE BALD EAGLE",
   "sub": "America sprayed its farms for 30 years",
   "stamp": "NEXT",
   "typeAt": 1336.91,
   "stampAt": 1342.89
  }
 }
];
export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
