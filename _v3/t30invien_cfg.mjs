// _v3/t30invien_cfg.mjs — "I Turned 92 and Buried Every Friend I Had" · Lou (EN). Generado por D:/rtmp_t30invien/tools/mk_cfg.py
// (tiempos de words.json). Ritmo Bertha: avatar 27 % en ventanas 3-6 s, b-roll 2,3-5,2 s (mediana ~3,6).
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 3.0;
export const AVATAR_WIN_MAX = 6.0;
export const AVATAR_CAND_MAX = 6.0;
export const AVATAR_OBJ = 0.27;
export const APERTURA_MIN = 3.0;
export const TRANSICIONES = true;
export const SECCIONES = [{"sec": "S1", "rol": "hook", "p0": 1, "p1": 4}, {"sec": "S2", "rol": "explica", "p0": 5, "p1": 7}, {"sec": "S3", "rol": "prueba", "p0": 8, "p1": 10}, {"sec": "S4", "rol": "explica", "p0": 11, "p1": 12}, {"sec": "S5", "rol": "prueba", "p0": 13, "p1": 14}, {"sec": "S6", "rol": "explica", "p0": 15, "p1": 15}, {"sec": "S7", "rol": "explica", "p0": 16, "p1": 16}, {"sec": "S8", "rol": "prueba", "p0": 17, "p1": 19}, {"sec": "S9", "rol": "explica", "p0": 20, "p1": 20}, {"sec": "S10", "rol": "prueba", "p0": 21, "p1": 22}, {"sec": "S11", "rol": "prueba", "p0": 23, "p1": 26}, {"sec": "S12", "rol": "receta", "p0": 27, "p1": 30}, {"sec": "S13", "rol": "cierre", "p0": 31, "p1": 36}];
const R = [3.6, 2.6, 4.4, 3.1, 5.0, 2.4, 3.9, 4.7, 2.9, 3.4, 5.2, 3.0];
export const ESCALERA = { hook: [2.4, 3.0, 2.6, 3.4, 2.3, 3.8, 2.8, 4.2, 2.5, 3.2, 2.7, 3.6], explica: R, receta: [...R].reverse(), prueba: [3.2, 4.6, 2.5, 3.8, 5.1, 2.8, 3.5, 4.2, 2.4, 3.9, 4.9, 3.1], cierre: R };
export const ORDEN_FORZADO = {};
export const OVERLAY = ['ActChip'];
export const IMPORTS = {"BigStat": "../backfire/BigStat", "FileStamp": "../backfire/FileStamp", "ActChip": "../backfire/ActChip", "YearCounter": "../backfire/YearCounter", "SplitVs": "../backfire/SplitVs", "SceneCallout": "../backfire/SceneCallout", "FriendStrip": "../t30invien/FriendStrip"};
export const BEDS = ["a11_cardigan_chair", "a16_cards_table", "a18_des_moines_road", "a22_rotary_phone", "a25_street_blocks", "a34_front_door", "a35_two_cups", "a37_six_boys", "a40_harvard_brick", "a41_files", "a44_two_hand_cards", "a46_empty_chair", "a47_garage_motorcycle", "a48_diner", "a50_old_phone_hands", "a51_town_square", "a54_cards_phone"];
export const COMPONENTES = [
 {
  "p": 4,
  "q": "It took me ninety years",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 90,
   "unit": "years",
   "label": "TO FIGURE IT OUT",
   "photo": "img/t30invien_a11_cardigan_chair.jpg",
   "at": 86.24
  }
 },
 {
  "p": 5,
  "q": "My name is Lou",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "NINETY-TWO WINTERS",
   "title": "LOU",
   "sub": "Farm town, Iowa · machinist",
   "stamp": "",
   "typeAt": 111.56,
   "stampAt": 117.08
  }
 },
 {
  "p": 5,
  "q": "I was married fifty-eight years",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 58,
   "unit": "years",
   "label": "MARRIED TO JUNE",
   "compare": "Gone six winters now.",
   "photo": "img/t30invien_g06_june.jpg",
   "at": 127.48,
   "compareAt": 130.24
  }
 },
 {
  "p": 6,
  "q": "subscribe and tap the bell",
  "dur": 6.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "02",
   "label": "EVERY WEEK, RIGHT HERE",
   "title": "SUBSCRIBE + BELL",
   "sub": "Which friend do you need to call?",
   "stamp": "",
   "typeAt": 148.04,
   "stampAt": 157.06
  }
 },
 {
  "p": 8,
  "q": "There were six of us",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "PART 1",
   "part": "SIX BOYS"
  }
 },
 {
  "p": 8,
  "q": "Six boys from the same town",
  "dur": 9.0,
  "comp": "FriendStrip",
  "props": {
   "faces": [
    {
     "img": "img/t30invien_g01_walt.jpg",
     "name": "Walt",
     "x": 50,
     "y": 28,
     "z": 1.3,
     "inAt": 177.82
    },
    {
     "img": "img/t30invien_g02_ray.jpg",
     "name": "Skinny Ray",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "inAt": 178.58
    },
    {
     "img": "img/t30invien_g03_dutch.jpg",
     "name": "Dutch",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "inAt": 179.76
    },
    {
     "img": "img/t30invien_g04_swede.jpg",
     "name": "the Swede",
     "x": 55,
     "y": 22,
     "z": 2.0,
     "inAt": 180.54
    },
    {
     "img": "img/t30invien_g05_ronnie.jpg",
     "name": "Ronnie",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "inAt": 181.72
    }
   ],
   "label": "SIX BOYS · ONE TOWN",
   "note": "...and me.",
   "noteAt": 182.38
  }
 },
 {
  "p": 8,
  "q": "Thirty years of Saturday nights",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "value": 30,
   "unit": "years",
   "label": "OF SATURDAY NIGHT CARDS",
   "compare": "At the Legion hall.",
   "photo": "img/t30invien_a16_cards_table.jpg",
   "at": 203.8,
   "compareAt": 205.68
  }
 },
 {
  "p": 9,
  "q": "The first thing I learned",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "LESSON 1",
   "part": "THEY GO A LITTLE AT A TIME"
  }
 },
 {
  "p": 9,
  "q": "And one day I realized",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "value": 3,
   "unit": "years",
   "label": "WITHOUT SEEING THE SWEDE",
   "compare": "No fight. Nothing.",
   "photo": "img/t30invien_a18_des_moines_road.jpg",
   "at": 230.9,
   "compareAt": 232.16
  }
 },
 {
  "p": 10,
  "q": "When he died, his daughter called",
  "dur": 6.0,
  "comp": "FriendStrip",
  "props": {
   "faces": [
    {
     "img": "img/t30invien_g01_walt.jpg",
     "name": "Walt",
     "x": 50,
     "y": 28,
     "z": 1.3
    },
    {
     "img": "img/t30invien_g02_ray.jpg",
     "name": "Skinny Ray",
     "x": 50,
     "y": 30,
     "z": 1.3
    },
    {
     "img": "img/t30invien_g03_dutch.jpg",
     "name": "Dutch",
     "x": 50,
     "y": 30,
     "z": 1.3
    },
    {
     "img": "img/t30invien_g04_swede.jpg",
     "name": "the Swede",
     "x": 55,
     "y": 22,
     "z": 2.0,
     "goneAt": 237.7
    },
    {
     "img": "img/t30invien_g05_ronnie.jpg",
     "name": "Ronnie",
     "x": 50,
     "y": 30,
     "z": 1.3
    }
   ],
   "focus": 3,
   "focusAt": 237.4,
   "note": "the Swede",
   "noteAt": 238.26
  }
 },
 {
  "p": 11,
  "q": "The second thing I learned",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "LESSON 2",
   "part": "A CALL BEATS A VISIT"
  }
 },
 {
  "p": 12,
  "q": "a five-minute phone call",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "value": 5,
   "unit": "minutes",
   "label": "ONE PHONE CALL",
   "compare": "It would have cost nothing.",
   "photo": "img/t30invien_a22_rotary_phone.jpg",
   "at": 287.66,
   "compareAt": 289.34
  }
 },
 {
  "p": 12,
  "q": "Ray died in the winter",
  "dur": 6.0,
  "comp": "FriendStrip",
  "props": {
   "faces": [
    {
     "img": "img/t30invien_g01_walt.jpg",
     "name": "Walt",
     "x": 50,
     "y": 28,
     "z": 1.3
    },
    {
     "img": "img/t30invien_g02_ray.jpg",
     "name": "Skinny Ray",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "goneAt": 296.18
    },
    {
     "img": "img/t30invien_g03_dutch.jpg",
     "name": "Dutch",
     "x": 50,
     "y": 30,
     "z": 1.3
    },
    {
     "img": "img/t30invien_g04_swede.jpg",
     "name": "the Swede",
     "x": 55,
     "y": 22,
     "z": 2.0,
     "goneAt": 237.7
    },
    {
     "img": "img/t30invien_g05_ronnie.jpg",
     "name": "Ronnie",
     "x": 50,
     "y": 30,
     "z": 1.3
    }
   ],
   "focus": 1,
   "focusAt": 295.88,
   "note": "alone, in winter",
   "noteAt": 297.88
  }
 },
 {
  "p": 13,
  "q": "The third one",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "LESSON 3",
   "part": "PRIDE IS A LUXURY"
  }
 },
 {
  "p": 13,
  "q": "We went eleven years without speaking",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 11,
   "unit": "years",
   "label": "WITHOUT SPEAKING TO DUTCH",
   "compare": "Four blocks apart.",
   "photo": "img/t30invien_a25_street_blocks.jpg",
   "at": 322.48,
   "compareAt": 325.96
  }
 },
 {
  "p": 14,
  "q": "he didn't know me anymore",
  "dur": 6.0,
  "comp": "FriendStrip",
  "props": {
   "faces": [
    {
     "img": "img/t30invien_g01_walt.jpg",
     "name": "Walt",
     "x": 50,
     "y": 28,
     "z": 1.3
    },
    {
     "img": "img/t30invien_g02_ray.jpg",
     "name": "Skinny Ray",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "goneAt": 296.18
    },
    {
     "img": "img/t30invien_g03_dutch.jpg",
     "name": "Dutch",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "goneAt": 347.56
    },
    {
     "img": "img/t30invien_g04_swede.jpg",
     "name": "the Swede",
     "x": 55,
     "y": 22,
     "z": 2.0,
     "goneAt": 237.7
    },
    {
     "img": "img/t30invien_g05_ronnie.jpg",
     "name": "Ronnie",
     "x": 50,
     "y": 30,
     "z": 1.3
    }
   ],
   "focus": 2,
   "focusAt": 347.26,
   "note": "too late",
   "noteAt": 348.46
  }
 },
 {
  "p": 15,
  "q": "The fourth one",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "LESSON 4",
   "part": "NO REASON NEEDED"
  }
 },
 {
  "p": 16,
  "q": "The fifth one",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "LESSON 5",
   "part": "HER FRIENDS ARE YOURS"
  }
 },
 {
  "p": 17,
  "q": "The sixth one",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "LESSON 6",
   "part": "SHOW UP WHEN IT'S UGLY"
  }
 },
 {
  "p": 18,
  "q": "Ronnie had two bad years",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 2,
   "unit": "years",
   "label": "RONNIE, ALONE WITH HIS SHAME",
   "compare": "Nobody knocked on his door.",
   "photo": "img/t30invien_a34_front_door.jpg",
   "at": 462.52,
   "compareAt": 464.92
  }
 },
 {
  "p": 20,
  "q": "And the seventh",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "LESSON 7",
   "part": "KEEP WHAT TIES YOU"
  }
 },
 {
  "p": 20,
  "q": "I've got a photograph of the six of us",
  "dur": 8.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30invien_a37_six_boys.jpg",
   "x": 988,
   "y": 778,
   "r": 70,
   "note": "the taped-up ball",
   "circleAt": 512.1,
   "noteAt": 512.7,
   "zoom": 1.45
  }
 },
 {
  "p": 21,
  "q": "There's a very long study",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "THE STUDY",
   "part": "HARVARD · 1938"
  }
 },
 {
  "p": 21,
  "q": "back in nineteen thirty-eight",
  "dur": 6.5,
  "comp": "YearCounter",
  "props": {
   "photo": "img/t30invien_a40_harvard_brick.jpg",
   "yearFrom": 1938,
   "yearTo": 2018,
   "unit": "",
   "label": "HUNDREDS OF MEN · THEIR WHOLE LIVES",
   "from": 542.34,
   "to": 547.36,
   "marks": [
    {
     "year": 1938,
     "note": "it starts"
    },
    {
     "year": 2018,
     "note": "80 years"
    }
   ],
   "source": "Harvard Study of Adult Development (since 1938)",
   "linear": true
  }
 },
 {
  "p": 21,
  "q": "wasn't money",
  "dur": 7.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30invien_a41_files.jpg",
   "rightImg": "img/t30invien_a35_two_cups.jpg",
   "leftHead": "NOT THIS",
   "rightHead": "THIS",
   "leftText": "Money. Work. Being important.",
   "rightText": "Their relationships.",
   "leftAt": 559.16,
   "rightAt": 563.44,
   "stamp": ""
  }
 },
 {
  "p": 22,
  "q": "burying five of my six friends",
  "dur": 4.5,
  "comp": "FriendStrip",
  "props": {
   "faces": [
    {
     "img": "img/t30invien_g01_walt.jpg",
     "name": "Walt",
     "x": 50,
     "y": 28,
     "z": 1.3
    },
    {
     "img": "img/t30invien_g02_ray.jpg",
     "name": "Skinny Ray",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "goneAt": 296.18
    },
    {
     "img": "img/t30invien_g03_dutch.jpg",
     "name": "Dutch",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "goneAt": 347.56
    },
    {
     "img": "img/t30invien_g04_swede.jpg",
     "name": "the Swede",
     "x": 55,
     "y": 22,
     "z": 2.0,
     "goneAt": 237.7
    },
    {
     "img": "img/t30invien_g05_ronnie.jpg",
     "name": "Ronnie",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "goneAt": 577.9
    }
   ],
   "note": "five of six",
   "noteAt": 578.2
  }
 },
 {
  "p": 23,
  "q": "And now, kid. Walt.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "PART 2",
   "part": "WALT"
  }
 },
 {
  "p": 24,
  "q": "just the two of us for almost ten years",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 10,
   "unit": "years",
   "label": "JUST THE TWO OF US",
   "compare": "Tuesdays and Fridays.",
   "photo": "img/t30invien_a44_two_hand_cards.jpg",
   "at": 587.72,
   "compareAt": 592.6
  }
 },
 {
  "p": 25,
  "q": "He'd gone that morning",
  "dur": 7.0,
  "comp": "FriendStrip",
  "props": {
   "faces": [
    {
     "img": "img/t30invien_g01_walt.jpg",
     "name": "Walt",
     "x": 50,
     "y": 28,
     "z": 1.3,
     "goneAt": 625.38
    },
    {
     "img": "img/t30invien_g02_ray.jpg",
     "name": "Skinny Ray",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "goneAt": 296.18
    },
    {
     "img": "img/t30invien_g03_dutch.jpg",
     "name": "Dutch",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "goneAt": 347.56
    },
    {
     "img": "img/t30invien_g04_swede.jpg",
     "name": "the Swede",
     "x": 55,
     "y": 22,
     "z": 2.0,
     "goneAt": 237.7
    },
    {
     "img": "img/t30invien_g05_ronnie.jpg",
     "name": "Ronnie",
     "x": 50,
     "y": 30,
     "z": 1.3,
     "goneAt": 577.9
    }
   ],
   "focus": 0,
   "focusAt": 625.08,
   "note": "the last one",
   "noteAt": 626.68
  }
 },
 {
  "p": 27,
  "q": "And that's when I understood",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "PART 3",
   "part": "THE ONE THING"
  }
 },
 {
  "p": 28,
  "q": "Especially after sixty",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 60,
   "unit": "and up",
   "label": "NEW FRIENDS, EVERY DECADE",
   "photo": "img/t30invien_a48_diner.jpg",
   "at": 662.38
  }
 },
 {
  "p": 29,
  "q": "It's not a tragedy, it's arithmetic",
  "dur": 12.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30invien_a46_empty_chair.jpg",
   "rightImg": "img/t30invien_a47_garage_motorcycle.jpg",
   "leftHead": "ALL YOUR AGE",
   "rightHead": "YOUNGER TOO",
   "leftText": "They go one by one.",
   "rightText": "They'll outlive you.",
   "leftAt": 685.5,
   "rightAt": 693.26,
   "stamp": ""
  }
 },
 {
  "p": 31,
  "q": "I'm starting now, at ninety-two",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 92,
   "unit": "years old",
   "label": "STARTING NOW",
   "compare": "Late, but starting.",
   "photo": "img/t30invien_a51_town_square.jpg",
   "at": 724.0,
   "compareAt": 724.02
  }
 },
 {
  "p": 32,
  "q": "So here's what I'm asking",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "HOMEWORK",
   "part": "THIS WEEK"
  }
 },
 {
  "p": 32,
  "q": "do two things",
  "dur": 7.0,
  "comp": "BigStat",
  "props": {
   "value": 2,
   "unit": "things",
   "label": "THIS WEEK",
   "compare": "Call an old friend. Talk to someone younger.",
   "photo": "img/t30invien_a50_old_phone_hands.jpg",
   "at": 752.22,
   "compareAt": 753.64
  }
 },
 {
  "p": 32,
  "q": "more than five minutes",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "value": 5,
   "unit": "minutes",
   "prefix": "+",
   "label": "REALLY TALK",
   "photo": "img/t30invien_a54_cards_phone.jpg",
   "at": 762.74
  }
 },
 {
  "p": 34,
  "q": "how old are you",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "03",
   "label": "TELL ME IN THE COMMENTS",
   "title": "HOW OLD ARE YOU?",
   "sub": "How many friends from when you were a kid?",
   "stamp": "",
   "typeAt": 792.94,
   "stampAt": 794.2
  }
 }
];
export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
