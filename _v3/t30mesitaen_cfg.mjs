// _v3/t30mesitaen_cfg.mjs — "A Retired Flight Attendant Reveals 11 Things Airlines Overcharge Seniors For" (Linda, EN)
// Generado por D:/rtmp_t30mesitaen/tools/mk_cfg.py (beats de words.json). Ritmo Bertha: avatar 27 % en ventanas 3-6 s,
// b-roll 2,3-5,2 s (mediana ~3,6). Frame 0 = Linda hablando.
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 3.0;
export const AVATAR_WIN_MAX = 6.0;
export const AVATAR_CAND_MAX = 6.0;
export const AVATAR_OBJ = 0.27;
export const APERTURA_MIN = 3.0;
export const TRANSICIONES = true;
export const CAM = {};
export const SECCIONES = [{"sec": "S0", "rol": "hook", "p0": 1, "p1": 6}, {"sec": "S1", "rol": "explica", "p0": 7, "p1": 9}, {"sec": "S2", "rol": "explica", "p0": 10, "p1": 12}, {"sec": "S3", "rol": "prueba", "p0": 13, "p1": 15}, {"sec": "S4", "rol": "explica", "p0": 16, "p1": 18}, {"sec": "S5", "rol": "receta", "p0": 19, "p1": 21}, {"sec": "S6", "rol": "explica", "p0": 22, "p1": 24}, {"sec": "S7", "rol": "receta", "p0": 25, "p1": 27}, {"sec": "S8", "rol": "explica", "p0": 28, "p1": 30}, {"sec": "S9", "rol": "receta", "p0": 31, "p1": 33}, {"sec": "S10", "rol": "prueba", "p0": 34, "p1": 36}, {"sec": "S11", "rol": "prueba", "p0": 37, "p1": 39}, {"sec": "S12", "rol": "explica", "p0": 40, "p1": 43}, {"sec": "S13", "rol": "cierre", "p0": 44, "p1": 50}];
const R = [3.6, 2.6, 4.4, 3.1, 5.0, 2.4, 3.9, 4.7, 2.9, 3.4, 5.2, 3.0];
export const ESCALERA = { hook: [2.4, 3.0, 2.6, 3.4, 2.3, 3.8, 2.8, 4.2, 2.5, 3.2, 2.7, 3.6], explica: R, receta: [...R].reverse(), prueba: [3.2, 4.6, 2.5, 3.8, 5.1, 2.8, 3.5, 4.2, 2.4, 3.9, 4.9, 3.1], cierre: R };
export const ORDEN_FORZADO = {};
export const OVERLAY = ['ActChip'];
export const IMPORTS = {
  BigStat: '../backfire/BigStat', FileStamp: '../backfire/FileStamp', ActChip: '../backfire/ActChip', SplitVs: '../backfire/SplitVs',
  SceneCallout: '../backfire/SceneCallout', DocumentPage: '../backfire/DocumentPage',
};
export const BEDS = [];
export const COMPONENTES = [
 {
  "p": 7,
  "q": "Number one.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 01",
   "part": "THE SENIOR FARE"
  }
 },
 {
  "p": 10,
  "q": "Number two.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 02",
   "part": "PICKING YOUR SEAT"
  }
 },
 {
  "p": 13,
  "q": "Number three.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 03",
   "part": "WHEELCHAIR & ASSISTANCE"
  }
 },
 {
  "p": 16,
  "q": "Number four.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 04",
   "part": "PRIORITY BOARDING"
  }
 },
 {
  "p": 19,
  "q": "Number five.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 05",
   "part": "TRAVEL INSURANCE"
  }
 },
 {
  "p": 22,
  "q": "Number six.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 06",
   "part": "PAYING IN DOLLARS"
  }
 },
 {
  "p": 25,
  "q": "Number seven.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 07",
   "part": "YOUR CHECKED BAG"
  }
 },
 {
  "p": 28,
  "q": "Number eight.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 08",
   "part": "BOOKING BY PHONE"
  }
 },
 {
  "p": 31,
  "q": "Number nine.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 09",
   "part": "WATER & SNACKS"
  }
 },
 {
  "p": 34,
  "q": "Number ten.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 10",
   "part": "MEDICATIONS & DEVICES"
  }
 },
 {
  "p": 37,
  "q": "Number eleven.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 11",
   "part": "WHEN THE FLIGHT GOES WRONG"
  }
 },
 {
  "p": 40,
  "q": "Before we do the math",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "BONUS",
   "part": "THREE QUESTIONS"
  }
 },
 {
  "p": 44,
  "q": "Now let's do the math",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "BONUS",
   "part": "THE MATH"
  }
 },
 {
  "p": 4,
  "q": "eleven things",
  "dur": 6.5,
  "comp": "BigStat",
  "props": {
   "value": 11,
   "unit": "things",
   "label": "WHAT AIRLINES OVERCHARGE SENIORS FOR",
   "compare": "Not opinions. What really happens.",
   "photo": "img/t30mesitaen_l08_counting.jpg",
   "tone": "white",
   "at": 70.4,
   "compareAt": 72.36
  }
 },
 {
  "p": 5,
  "q": "I'm Linda.",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": 1,
   "label": "TRAY TABLE UP · Nº 01",
   "title": "LINDA",
   "sub": "35 years in the air · Columbus, Ohio",
   "stamp": "",
   "typeAt": 93.5,
   "stampAt": 95.14
  }
 },
 {
  "p": 8,
  "q": "That discount is often taken",
  "dur": 9.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30mesitaen_l02_counter_offer.jpg",
   "rightImg": "img/t30mesitaen_a11_two_results.jpg",
   "leftHead": "THE SENIOR FARE",
   "rightHead": "A REGULAR SALE FARE",
   "leftText": "Off the full fare",
   "rightText": "Can come in lower",
   "stamp": "COMPARE THE TOTAL",
   "leftAt": 151.26,
   "rightAt": 156.88
  }
 },
 {
  "p": 11,
  "q": "If you don't pick",
  "dur": 6.5,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30mesitaen_l13_seatmap.jpg",
   "x": 1380,
   "y": 520,
   "r": 170,
   "note": "Free at check-in",
   "circleAt": 204.48,
   "noteAt": 207.84
  }
 },
 {
  "p": 14,
  "q": "the law requires airlines",
  "dur": 8.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30mesitaen_doc_assist.png",
   "aspect": 0.7857,
   "chip": "U.S. LAW · 14 CFR 382",
   "source": "Source: U.S. DOT · 14 CFR 382.31 · 382.95",
   "highlights": [
    {
     "x": 52.64,
     "y": 29.64,
     "w": 26.09,
     "h": 2.43,
     "at": 256.88
    },
    {
     "x": 7.27,
     "y": 32.36,
     "w": 15.55,
     "h": 2.43,
     "at": 256.88
    },
    {
     "x": 45.55,
     "y": 59.93,
     "w": 30.27,
     "h": 2.43,
     "at": 261.16
    }
   ],
   "note": {
    "text": "Assistance is free",
    "at": 263.46
   }
  }
 },
 {
  "p": 17,
  "q": "But many airlines let people board early",
  "dur": 8.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30mesitaen_l22_line_watch.jpg",
   "rightImg": "img/t30mesitaen_l21_first_board.jpg",
   "leftHead": "PAY TO BOARD EARLY",
   "rightHead": "ASK AT THE GATE",
   "leftText": "A fee for a spot in line",
   "rightText": "Extra time, no charge",
   "stamp": "JUST ASK",
   "leftAt": 298.7,
   "rightAt": 301.66
  }
 },
 {
  "p": 21,
  "q": "call the number on the back of your card",
  "dur": 6.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30mesitaen_a25_card_back.jpg",
   "x": 820,
   "y": 560,
   "r": 190,
   "note": "Call this number first",
   "circleAt": 353.42,
   "noteAt": 356.86
  }
 },
 {
  "p": 23,
  "q": "But that conversion is done",
  "dur": 8.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30mesitaen_l28_cafe_terminal.jpg",
   "rightImg": "img/t30mesitaen_a28_euro_coins.jpg",
   "leftHead": "PAY IN DOLLARS",
   "rightHead": "PAY IN LOCAL CURRENCY",
   "leftText": "The merchant's rate",
   "rightText": "Your bank's rate",
   "stamp": "PICK LOCAL",
   "leftAt": 390.1,
   "rightAt": 394.36
  }
 },
 {
  "p": 27,
  "q": "One of those little hanging luggage scales",
  "dur": 6.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30mesitaen_l31_scale.jpg",
   "x": 1000,
   "y": 420,
   "r": 150,
   "note": "Weigh it at home",
   "circleAt": 432.61,
   "noteAt": 435.59
  }
 },
 {
  "p": 30,
  "q": "sit with you for half an hour",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 30,
   "unit": "minutes",
   "label": "WITH A GRANDKID AT THE COMPUTER",
   "compare": "You decide. They drive the mouse.",
   "photo": "img/t30mesitaen_l34_grandson.jpg",
   "tone": "white",
   "at": 473.21,
   "compareAt": 476.53
  }
 },
 {
  "p": 32,
  "q": "Bring an empty bottle",
  "dur": 6.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30mesitaen_a37_bottle_bin.jpg",
   "x": 470,
   "y": 590,
   "r": 200,
   "note": "Empty through security",
   "circleAt": 493.07,
   "noteAt": 495.57
  }
 },
 {
  "p": 36,
  "q": "And if you use a medical device",
  "dur": 8.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30mesitaen_doc_devices.png",
   "aspect": 0.7857,
   "chip": "U.S. LAW · 14 CFR 382",
   "source": "Source: U.S. DOT · 14 CFR 382.121",
   "highlights": [
    {
     "x": 7.27,
     "y": 47.5,
     "w": 50.18,
     "h": 2.43,
     "at": 544.37
    },
    {
     "x": 60.73,
     "y": 62.64,
     "w": 19.55,
     "h": 2.43,
     "at": 547.91
    },
    {
     "x": 7.27,
     "y": 65.36,
     "w": 16.82,
     "h": 2.43,
     "at": 547.91
    }
   ],
   "note": {
    "text": "Not a second bag",
    "at": 550.43
   }
  }
 },
 {
  "p": 38,
  "q": "But here in the United States",
  "dur": 8.5,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30mesitaen_doc_refund.png",
   "aspect": 0.7857,
   "chip": "U.S. LAW · 14 CFR 260",
   "source": "Source: U.S. DOT · 14 CFR 260.6",
   "highlights": [
    {
     "x": 53.09,
     "y": 29.64,
     "w": 23.45,
     "h": 2.43,
     "at": 580.13
    },
    {
     "x": 7.27,
     "y": 32.36,
     "w": 14.45,
     "h": 2.43,
     "at": 580.13
    },
    {
     "x": 11.0,
     "y": 54.5,
     "w": 27.09,
     "h": 2.43,
     "at": 588.57
    }
   ],
   "note": {
    "text": "Money, not a voucher",
    "at": 587.59
   }
  }
 },
 {
  "p": 42,
  "q": "In the United States, if you book",
  "dur": 8.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30mesitaen_doc_24h.png",
   "aspect": 0.7857,
   "chip": "U.S. RULE · 14 CFR 259",
   "source": "Source: U.S. DOT · 14 CFR 259.5",
   "highlights": [
    {
     "x": 10.0,
     "y": 30.79,
     "w": 56.72,
     "h": 2.43,
     "at": 659.25
    }
   ],
   "note": {
    "text": "24 hours, no penalty",
    "at": 660.87
   }
  }
 },
 {
  "p": 44,
  "q": "Two trips a year",
  "dur": 6.5,
  "comp": "BigStat",
  "props": {
   "value": 2,
   "unit": "trips a year",
   "label": "TO SEE THE GRANDKIDS",
   "compare": "One of them could be close to paid.",
   "photo": "img/t30mesitaen_a53_grandkids_hug.jpg",
   "tone": "green",
   "at": 725.51,
   "compareAt": 727.69
  }
 },
 {
  "p": 46,
  "q": "change just two things",
  "dur": 6.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30mesitaen_a14_middle_seat.jpg",
   "rightImg": "img/t30mesitaen_l19_wheelchair_ride.jpg",
   "leftHead": "THING 1",
   "rightHead": "THING 2",
   "leftText": "Don't pay for the seat",
   "rightText": "Ask for assistance",
   "stamp": "",
   "leftAt": 750.79,
   "rightAt": 751.87
  }
 }
];
