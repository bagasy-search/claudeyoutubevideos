// _v3/rdsparrows_cfg.mjs — "Mao's sparrows / Great Chinese Famine" · Ruth Dalby (EN), file 04. Generado por D:/rtmp_rdsparrows/tools/mk_cfg.py
// (tiempos de words.json). Ritmo Bertha: avatar 27 % en ventanas 3-6 s, b-roll 2,3-5,2 s (mediana ~3,6).
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 3.0;
export const AVATAR_WIN_MAX = 6.0;
export const AVATAR_CAND_MAX = 6.0;
export const AVATAR_OBJ = 0.27;
export const APERTURA_MIN = 3.0;
export const TRANSICIONES = true;
export const SECCIONES = [{"sec": "S1", "rol": "hook", "p0": 1, "p1": 8}, {"sec": "S4", "rol": "explica", "p0": 9, "p1": 11}, {"sec": "S2", "rol": "explica", "p0": 12, "p1": 20}, {"sec": "S3", "rol": "prueba", "p0": 21, "p1": 30}, {"sec": "S5", "rol": "prueba", "p0": 31, "p1": 48}, {"sec": "S6", "rol": "prueba", "p0": 49, "p1": 80}, {"sec": "S7", "rol": "explica", "p0": 81, "p1": 98}, {"sec": "S8", "rol": "receta", "p0": 99, "p1": 108}, {"sec": "S9", "rol": "cierre", "p0": 109, "p1": 115}, {"sec": "S10", "rol": "cierre", "p0": 116, "p1": 117}];
const R = [3.6, 2.6, 4.4, 3.1, 5.0, 2.4, 3.9, 4.7, 2.9, 3.4, 5.2, 3.0];
export const ESCALERA = { hook: [2.4, 3.0, 2.6, 3.4, 2.3, 3.8, 2.8, 4.2, 2.5, 3.2, 2.7, 3.6], explica: R, receta: [...R].reverse(), prueba: [3.2, 4.6, 2.5, 3.8, 5.1, 2.8, 3.5, 4.2, 2.4, 3.9, 4.9, 3.1], cierre: R };
export const ORDEN_FORZADO = {"S1": ["rdsparrows_bp11", "rdsparrows_un10", "rdsparrows_bp10"]};
export const OVERLAY = ['ActChip'];
export const IMPORTS = {
  BigStat: '../backfire/BigStat', FileStamp: '../backfire/FileStamp', ActChip: '../backfire/ActChip', YearCounter: '../backfire/YearCounter',
  SplitVs: '../backfire/SplitVs', PullQuote: '../backfire/PullQuote', DocumentPage: '../backfire/DocumentPage', MapPin: '../backfire/MapPin',
};
export const BEDS = ["a04_empty_sky", "a10_four_pests_poster", "a12_grain_scale", "a21_beetle_jar_macro", "a30_broken_nest_eggs", "a31_old_newspaper_china", "a34_tally_sticks", "a38_records_desk", "a42_granary_full", "a43_empty_bowl", "a44_mountain_pavilion", "a49_bedbug_bed", "a50_post_office", "a54_boarding_school", "a55_village_house_door", "a56_archive_boxes", "a57_book_plain", "a58_cemetery_hill", "a59_cradle_empty", "a62_broom_toilet", "a63_armband_badge", "a67_thumbprints", "a70_full_granary_family", "a71_wheat_field_today"];
export const COMPONENTES = [
 {
  "p": 1,
  "q": "The worst famine anybody has ever counted.",
  "dur": 5,
  "comp": "BigStat",
  "props": {
   "value": 30,
   "unit": "million people",
   "label": "DIED OF HUNGER IN CHINA · 1959-1961",
   "compare": "The worst famine anybody has ever counted.",
   "source": "Sources: Banister 1987 · Ashton et al. 1984",
   "photo": "img/rdsparrows_a58_cemetery_hill.jpg",
   "at": 12.08,
   "compareAt": 13.08
  }
 },
 {
  "p": 10,
  "q": "This is file number four.",
  "dur": 6,
  "comp": "FileStamp",
  "props": {
   "fileNo": "04",
   "label": "FILE Nº 04",
   "title": "THE SPARROWS",
   "sub": "China · 1958-1962",
   "part": "",
   "stamp": "TRUE STORY",
   "typeAt": 103.5,
   "stampAt": 106.04
  }
 },
 {
  "p": 12,
  "q": "So let's start with the people who made the plan.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "04",
   "label": "FILE Nº 04",
   "title": "THE PLAN",
   "sub": "",
   "part": "PART 1",
   "stamp": "",
   "typeAt": 129.88
  }
 },
 {
  "p": 12,
  "q": "They weren't cartoon villains.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "FILE 04 · PART 1",
   "part": "THE PLAN"
  }
 },
 {
  "p": 19,
  "q": "Each sparrow, they said, eats about four pounds of grain a year.",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 4,
   "unit": "pounds of grain",
   "label": "WHAT ONE SPARROW EATS IN A YEAR · THE OFFICIAL MATH",
   "compare": "Kill one sparrow, save four pounds. On paper.",
   "source": "Source: TIME, May 5, 1958",
   "photo": "img/rdsparrows_a12_grain_scale.jpg",
   "at": 216.56,
   "compareAt": 219.42
  }
 },
 {
  "p": 24,
  "q": "Somebody did warn them about the sparrows.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "04",
   "label": "FILE Nº 04",
   "title": "THE WARNING",
   "sub": "",
   "part": "PART 2",
   "stamp": "",
   "typeAt": 279.88
  }
 },
 {
  "p": 24,
  "q": "His name was Tso-hsin Cheng.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "FILE 04 · PART 2",
   "part": "THE WARNING"
  }
 },
 {
  "p": 26,
  "q": "Yes, they eat some grain.",
  "dur": 7,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/rdsparrows_a70_full_granary_family.jpg",
   "rightImg": "img/rdsparrows_a21_beetle_jar_macro.jpg",
   "leftHead": "WHAT THEY SAID",
   "rightHead": "WHAT THEY FEED THEIR BABIES",
   "leftText": "Grain",
   "rightText": "Mostly insects",
   "stamp": "FREE PEST CONTROL",
   "leftAt": 312.7,
   "rightAt": 318.82
  }
 },
 {
  "p": 31,
  "q": "Now, the battle itself.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "04",
   "label": "FILE Nº 04",
   "title": "THE BATTLE",
   "sub": "",
   "part": "PART 3",
   "stamp": "",
   "typeAt": 365.73
  }
 },
 {
  "p": 31,
  "q": "That's the word they used, a battle.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "FILE 04 · PART 3",
   "part": "THE BATTLE"
  }
 },
 {
  "p": 32,
  "q": "About three million people came out.",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 3000000,
   "unit": "people",
   "label": "OUT IN THE STREETS OF PEKING · ONE MORNING, 1958",
   "compare": "More than everyone in Chicago today.",
   "source": "Source: TIME, May 5, 1958 · U.S. Census Bureau",
   "photo": "img/rdsparrows_a04_empty_sky.jpg",
   "at": 380.23,
   "compareAt": 382.23
  }
 },
 {
  "p": 38,
  "q": "No warrior, it said, shall be withdrawn until the battle is won.",
  "dur": 7,
  "comp": "PullQuote",
  "props": {
   "quote": "No warrior shall be withdrawn until the battle is won.",
   "who": "People's Daily, Peking",
   "year": "1958",
   "source": "Quoted in TIME, May 5, 1958",
   "at": 442.41,
   "until": 448.07,
   "highlight": "until the battle is won",
   "bed": "img/rdsparrows_a31_old_newspaper_china.jpg"
  }
 },
 {
  "p": 39,
  "q": "about three hundred ten thousand sparrows died in Peking alone.",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 310000,
   "unit": "sparrows",
   "label": "KILLED IN PEKING ALONE · 1958",
   "compare": "About 4 million more across the rest of China.",
   "source": "Source: TIME, May 5, 1958",
   "photo": "img/rdsparrows_a30_broken_nest_eggs.jpg",
   "at": 451.37,
   "compareAt": 456.71
  }
 },
 {
  "p": 41,
  "q": "A youth magazine said he'd killed twenty thousand sparrows by himself.",
  "dur": 6,
  "comp": "BigStat",
  "props": {
   "value": 20000,
   "unit": "sparrows",
   "label": "ONE 16-YEAR-OLD BOY · YUNNAN",
   "compare": "Held up as a hero by a youth magazine.",
   "source": "China Youth, via TIME, May 5, 1958",
   "photo": "img/rdsparrows_a34_tally_sticks.jpg",
   "at": 489.49,
   "compareAt": 493.11
  }
 },
 {
  "p": 42,
  "q": "It was fun, wiping out the Four Pests.",
  "dur": 6,
  "comp": "PullQuote",
  "props": {
   "quote": "It was fun to wipe out the Four Pests.",
   "who": "A former schoolboy, Sichuan",
   "year": "",
   "source": "Judith Shapiro, Mao's War Against Nature (2001)",
   "at": 504.35,
   "until": 507.87,
   "highlight": "fun",
   "bed": "img/rdsparrows_a63_armband_badge.jpg"
  }
 },
 {
  "p": 49,
  "q": "Now here's where it goes from foolish to deadly.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "04",
   "label": "FILE Nº 04",
   "title": "YEAR BY YEAR",
   "sub": "",
   "part": "PART 4",
   "stamp": "",
   "typeAt": 586.59
  }
 },
 {
  "p": 49,
  "q": "Year by year.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "FILE 04 · PART 4",
   "part": "YEAR BY YEAR"
  }
 },
 {
  "p": 54,
  "q": "On paper, China had never grown so much grain.",
  "dur": 6,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/rdsparrows_a38_records_desk.jpg",
   "rightImg": "img/rdsparrows_a43_empty_bowl.jpg",
   "leftHead": "ON PAPER",
   "rightHead": "IN THE BOWL",
   "leftText": "Record harvests",
   "rightText": "Hunger",
   "stamp": "YOU CAN'T EAT PAPER",
   "leftAt": 642.41,
   "rightAt": 648.55
  }
 },
 {
  "p": 57,
  "q": "When there is not enough to eat, people starve to death.",
  "dur": 10,
  "comp": "PullQuote",
  "props": {
   "quote": "When there is not enough to eat, people starve to death. It is better to let half of the people die so that the other half can eat their fill.",
   "who": "Mao Zedong",
   "year": "March 25, 1959",
   "source": "Secret meeting in Shanghai · Gansu Provincial Archives, via F. Dikötter, Mao's Great Famine (2010)",
   "at": 676.55,
   "until": 687.44,
   "highlight": "let half of the people die",
   "bed": "img/rdsparrows_a56_archive_boxes.jpg"
  }
 },
 {
  "p": 59,
  "q": "China grew almost three times the food its people needed to survive.",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 3,
   "unit": "× what people needed",
   "label": "FOOD GROWN IN CHINA · 1959",
   "compare": "And people were starving anyway.",
   "source": "Meng, Qian & Yared, Review of Economic Studies (2015)",
   "photo": "img/rdsparrows_a42_granary_full.jpg",
   "at": 705.06,
   "compareAt": 709.98
  }
 },
 {
  "p": 63,
  "q": "at a party meeting in the mountains at Lushan",
  "dur": 4.5,
  "comp": "MapPin",
  "props": {
   "map": "img/rdsparrows_map_china.jpg",
   "pins": [
    {
     "x": 1240,
     "y": 700,
     "label": "LUSHAN",
     "year": "1959",
     "at": 745.16,
     "zoom": 2.2
    }
   ],
   "kicker": "CHINA",
   "credit": "Map: CIA, China Administrative Divisions · Public domain · Wikimedia Commons"
  }
 },
 {
  "p": 69,
  "q": "Stop killing sparrows. Replace them with bedbugs.",
  "dur": 5,
  "comp": "PullQuote",
  "props": {
   "quote": "Stop killing sparrows. Replace them with bedbugs.",
   "who": "Mao Zedong",
   "year": "March 18, 1960",
   "source": "Party directive, 1960 · via Judith Shapiro (2001)",
   "at": 821.64,
   "until": 826.44,
   "highlight": "bedbugs",
   "bed": "img/rdsparrows_a49_bedbug_bed.jpg"
  }
 },
 {
  "p": 70,
  "q": "the official list was rewritten.",
  "dur": 6,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/rdsparrows_a10_four_pests_poster.jpg",
   "rightImg": "img/rdsparrows_a54_boarding_school.jpg",
   "leftHead": "THE LIST · 1958",
   "rightHead": "THE LIST · APRIL 1960",
   "leftText": "Rats · Flies · Mosquitoes · Sparrows",
   "rightText": "Rats · Flies · Mosquitoes · Bedbugs",
   "stamp": "TOO LATE",
   "leftAt": 829.4,
   "rightAt": 832.56
  }
 },
 {
  "p": 72,
  "q": "And by then, the hunger was everywhere.",
  "dur": 5.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/rdsparrows_doc_cia1960.png",
   "aspect": 0.7727,
   "highlights": [
    {
     "x": 13.5,
     "y": 21.6,
     "w": 31.5,
     "h": 6.0,
     "at": 845.64
    },
    {
     "x": 61.0,
     "y": 21.8,
     "w": 16.5,
     "h": 2.4,
     "at": 846.92
    },
    {
     "x": 50.0,
     "y": 47.3,
     "w": 25.0,
     "h": 1.9,
     "at": 848.04
    }
   ],
   "chip": "CIA REPORT · SEPT 1960",
   "source": "CIA Information Report, Conditions in China, 13 Sept 1960 · CIA-RDP80T00246A056000500001-4",
   "note": {
    "text": "Food shortage. Sept 1960.",
    "at": 848.94
   },
   "credit": "CIA FOIA Reading Room · Public domain",
   "bed": "img/rdsparrows_a50_post_office.jpg"
  }
 },
 {
  "p": 73,
  "q": "In Xinyang, in Henan province",
  "dur": 4.5,
  "comp": "MapPin",
  "props": {
   "map": "img/rdsparrows_map_china.jpg",
   "pins": [
    {
     "x": 1150,
     "y": 580,
     "label": "XINYANG, HENAN",
     "year": "1960",
     "at": 848.22,
     "zoom": 2.2
    }
   ],
   "kicker": "CHINA",
   "credit": "Map: CIA, China Administrative Divisions · Public domain · Wikimedia Commons"
  }
 },
 {
  "p": 79,
  "q": "His count is thirty-six million dead.",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 36,
   "unit": "million dead",
   "label": "YANG JISHENG'S COUNT · TOMBSTONE",
   "compare": "His book is banned in China to this day.",
   "source": "Yang Jisheng, Tombstone (2008)",
   "photo": "img/rdsparrows_a57_book_plain.jpg",
   "at": 932.78,
   "compareAt": 935.24
  }
 },
 {
  "p": 81,
  "q": "So now, the number in the title.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "04",
   "label": "FILE Nº 04",
   "title": "THE NUMBER",
   "sub": "",
   "part": "PART 5",
   "stamp": "",
   "typeAt": 944.94
  }
 },
 {
  "p": 81,
  "q": "Here's where it comes from.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "FILE 04 · PART 5",
   "part": "THE NUMBER"
  }
 },
 {
  "p": 82,
  "q": "rebuilt the population numbers year by year.",
  "dur": 8,
  "comp": "YearCounter",
  "props": {
   "photo": "img/rdsparrows_a55_village_house_door.jpg",
   "yearFrom": 1959,
   "yearTo": 1961,
   "popFrom": 0,
   "popTo": 30000000,
   "unit": "deaths",
   "label": "EXCESS DEATHS IN CHINA · 1959-1961",
   "from": 956.48,
   "to": 965.44,
   "marks": [
    {
     "year": 1959,
     "note": "famine begins"
    },
    {
     "year": 1961,
     "note": "≈ 30 million"
    }
   ],
   "source": "Sources: Banister 1987 · Ashton et al. 1984"
  }
 },
 {
  "p": 87,
  "q": "Two million. That's about one death in fifteen.",
  "dur": 6,
  "comp": "BigStat",
  "props": {
   "value": 2,
   "unit": "million extra deaths",
   "label": "LINKED TO THE SPARROW CAMPAIGN ALONE",
   "compare": "About 1 death in 15.",
   "source": "NBER Working Paper 34087 (2025)",
   "photo": "img/rdsparrows_a71_wheat_field_today.jpg",
   "at": 1017.94,
   "compareAt": 1019.36
  }
 },
 {
  "p": 90,
  "q": "So who's still paying?",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "04",
   "label": "FILE Nº 04",
   "title": "WHO'S STILL PAYING",
   "sub": "",
   "part": "PART 6",
   "stamp": "",
   "typeAt": 1054.72
  }
 },
 {
  "p": 91,
  "q": "Start with the babies.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "FILE 04 · PART 6",
   "part": "WHO'S STILL PAYING"
  }
 },
 {
  "p": 91,
  "q": "the birth rate fell by about eighty percent",
  "dur": 7,
  "comp": "BigStat",
  "props": {
   "value": 80,
   "unit": "%",
   "label": "DROP IN BIRTHS · WUHU, ANHUI · 1959-1960",
   "compare": "Babies carried through the hunger: 2× the schizophrenia risk.",
   "source": "St Clair et al., JAMA (2005)",
   "photo": "img/rdsparrows_a59_cradle_empty.jpg",
   "at": 1067.44,
   "compareAt": 1076.58
  }
 },
 {
  "p": 97,
  "q": "The man who was wrong blamed the weather.",
  "dur": 6,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/rdsparrows_a44_mountain_pavilion.jpg",
   "rightImg": "img/rdsparrows_a62_broom_toilet.jpg",
   "leftHead": "WRONG",
   "rightHead": "RIGHT",
   "leftText": "Blamed the weather",
   "rightText": "Cleaned the toilets",
   "stamp": "WHO PAID",
   "leftAt": 1127.86,
   "rightAt": 1131.16
  }
 },
 {
  "p": 99,
  "q": "Now, what actually worked?",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "04",
   "label": "FILE Nº 04",
   "title": "WHAT WORKED",
   "sub": "",
   "part": "PART 7",
   "stamp": "",
   "typeAt": 1152.36
  }
 },
 {
  "p": 99,
  "q": "Because something did.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "FILE 04 · PART 7",
   "part": "WHAT WORKED"
  }
 },
 {
  "p": 103,
  "q": "in a little village called Xiaogang, in Anhui province",
  "dur": 4.5,
  "comp": "MapPin",
  "props": {
   "map": "img/rdsparrows_map_china.jpg",
   "pins": [
    {
     "x": 1322,
     "y": 522,
     "label": "XIAOGANG, ANHUI",
     "year": "1978",
     "at": 1197.52,
     "zoom": 2.2
    }
   ],
   "kicker": "CHINA",
   "credit": "Map: CIA, China Administrative Divisions · Public domain · Wikimedia Commons"
  }
 },
 {
  "p": 105,
  "q": "If we are put in prison or executed, we will not complain.",
  "dur": 9,
  "comp": "PullQuote",
  "props": {
   "quote": "If we are put in prison or executed, we will not complain. And the others in the group will raise our children to 18 years old.",
   "who": "18 farmers, Xiaogang village",
   "year": "1978",
   "source": "Their secret contract, Xiaogang, Anhui province",
   "at": 1226.82,
   "until": 1237.54,
   "highlight": "we will not complain",
   "bed": "img/rdsparrows_a67_thumbprints.jpg"
  }
 },
 {
  "p": 109,
  "q": "So here's what I take from it, sitting at this kitchen table.",
  "dur": 3.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "04",
   "label": "FILE Nº 04",
   "title": "THE LESSON",
   "sub": "",
   "part": "PART 8",
   "stamp": "",
   "typeAt": 1263.04
  }
 },
 {
  "p": 110,
  "q": "The sparrow was never the pest.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "FILE 04 · PART 8",
   "part": "THE LESSON"
  }
 },
 {
  "p": 116,
  "q": "The file is called, Fishermen Woke Up and the Sea Was Gone.",
  "dur": 6.2,
  "comp": "FileStamp",
  "props": {
   "fileNo": "05",
   "label": "NEXT · FILE Nº 05",
   "title": "FISHERMEN WOKE UP AND THE SEA WAS GONE",
   "sub": "Who took it",
   "part": "",
   "stamp": "NEXT FILE",
   "typeAt": 1345.08,
   "stampAt": 1350.32
  }
 }
];
export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
