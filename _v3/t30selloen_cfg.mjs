// _v3/t30selloen_cfg.mjs — "Former Social Security Clerk: If You Were Born Before 1960…" · Frank (EN). Generado por D:/rtmp_t30selloen/tools/mk_cfg.py
// (tiempos de words.json). Ritmo Bertha: avatar 27 % en ventanas 3-6 s, b-roll 2,3-5,2 s (mediana ~3,6).
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 3.0;
export const AVATAR_WIN_MAX = 6.0;
export const AVATAR_CAND_MAX = 6.0;
export const AVATAR_OBJ = 0.27;
export const APERTURA_MIN = 3.0;
export const TRANSICIONES = true;
export const SECCIONES = [{"sec": "S1", "rol": "hook", "p0": 1, "p1": 4}, {"sec": "S2", "rol": "explica", "p0": 5, "p1": 6}, {"sec": "S3", "rol": "explica", "p0": 7, "p1": 10}, {"sec": "S4", "rol": "prueba", "p0": 11, "p1": 14}, {"sec": "S5", "rol": "prueba", "p0": 15, "p1": 17}, {"sec": "S6", "rol": "explica", "p0": 18, "p1": 20}, {"sec": "S7", "rol": "prueba", "p0": 21, "p1": 23}, {"sec": "S8", "rol": "explica", "p0": 24, "p1": 26}, {"sec": "S9", "rol": "prueba", "p0": 27, "p1": 29}, {"sec": "S10", "rol": "explica", "p0": 30, "p1": 31}, {"sec": "S11", "rol": "receta", "p0": 32, "p1": 33}, {"sec": "S12", "rol": "cierre", "p0": 34, "p1": 39}];
const R = [3.6, 2.6, 4.4, 3.1, 5.0, 2.4, 3.9, 4.7, 2.9, 3.4, 5.2, 3.0];
export const ESCALERA = { hook: [2.4, 3.0, 2.6, 3.4, 2.3, 3.8, 2.8, 4.2, 2.5, 3.2, 2.7, 3.6], explica: R, receta: [...R].reverse(), prueba: [3.2, 4.6, 2.5, 3.8, 5.1, 2.8, 3.5, 4.2, 2.4, 3.9, 4.9, 3.1], cierre: R };
export const ORDEN_FORZADO = {};
export const OVERLAY = ['ActChip'];
export const IMPORTS = {"BigStat": "../backfire/BigStat", "FileStamp": "../backfire/FileStamp", "ActChip": "../backfire/ActChip", "YearCounter": "../backfire/YearCounter", "SplitVs": "../backfire/SplitVs", "SceneCallout": "../backfire/SceneCallout", "DocumentPage": "../backfire/DocumentPage", "PullQuote": "../backfire/PullQuote"};
export const BEDS = ["a01_folded_letter", "a08_server_room", "a09_old_couple_kitchen", "a10_nine_folders", "a16_factory_payroll", "a18_wedding_couple", "a20_zero_year", "a22_tax_return_old", "a25_two_checks", "a26_hourglass", "a27_growing_jar", "a28_married_kitchen", "a31_ring_hand", "a32_widow_grave", "a33_widower_table", "a34_grocery_bag", "a35_teacher_class", "a43_forms_tray", "a46_calendar_days", "a47_drawer_closing", "a48_mailbox_blue", "a49_coins_slow", "a50_tax_forms", "a52_april_rain", "a58_coffee_letter", "a59_envelope_back", "a60_scam_phone"];
export const COMPONENTES = [
 {
  "p": 1,
  "q": "if you were born before nineteen sixty",
  "dur": 4.5,
  "comp": "YearCounter",
  "props": {
   "photo": "img/t30selloen_a01_folded_letter.jpg",
   "yearFrom": 1945,
   "yearTo": 1960,
   "unit": "",
   "label": "BORN BEFORE",
   "from": 5.74,
   "to": 8.6,
   "marks": [
    {
     "year": 1960,
     "note": "Check one line today."
    }
   ],
   "linear": true
  }
 },
 {
  "p": 2,
  "q": "you look at the number at the bottom",
  "dur": 6.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloen_doc_carta.png",
   "aspect": 0.7727,
   "chip": "THE LETTER",
   "source": "Rebuilt example · not a real notice",
   "highlights": [
    {
     "x": 5.6,
     "y": 79.36,
     "w": 88.8,
     "h": 6.82,
     "at": 40.94,
     "zoom": 1.6
    }
   ],
   "note": {
    "text": "...into the drawer",
    "at": 42.78
   }
  }
 },
 {
  "p": 3,
  "q": "Social Security pays you based on what's in their computer",
  "dur": 5.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30selloen_a08_server_room.jpg",
   "x": 1280,
   "y": 380,
   "r": 170,
   "note": "what's in their file",
   "circleAt": 66.68,
   "noteAt": 67.72,
   "zoom": 1.3
  }
 },
 {
  "p": 4,
  "q": "nine things. Nine.",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "tone": "red",
   "value": 9,
   "unit": "mistakes",
   "label": "I SAW OVER AND OVER",
   "compare": "Mostly born before 1960.",
   "photo": "img/t30selloen_a10_nine_folders.jpg",
   "at": 90.7,
   "compareAt": 97.68
  }
 },
 {
  "p": 5,
  "q": "I'm Frank",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "STAMPED AND FILED",
   "title": "FRANK",
   "sub": "Claims representative · New Jersey",
   "stamp": "FILED",
   "typeAt": 122.36,
   "stampAt": 124.34
  }
 },
 {
  "p": 6,
  "q": "subscribe and tap the bell",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "02",
   "label": "EVERY WEEK, ONE MORE LETTER",
   "title": "SUBSCRIBE + BELL",
   "sub": "What line did you never understand?",
   "stamp": "",
   "typeAt": 153.88,
   "stampAt": 164.42
  }
 },
 {
  "p": 7,
  "q": "Number one.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 1",
   "part": "YOUR EARNINGS RECORD"
  }
 },
 {
  "p": 8,
  "q": "This is the line.",
  "dur": 5.5,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloen_doc_carta.png",
   "aspect": 0.7727,
   "chip": "THE LETTER · LINE 1",
   "source": "Rebuilt example · not a real notice",
   "highlights": [
    {
     "x": 5.6,
     "y": 19.36,
     "w": 88.8,
     "h": 6.82,
     "at": 179.72,
     "zoom": 1.8
    }
   ]
  }
 },
 {
  "p": 8,
  "q": "highest thirty-five years",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "tone": "red",
   "value": 35,
   "unit": "years",
   "label": "YOUR HIGHEST EARNINGS",
   "compare": "Adjusted for inflation.",
   "photo": "img/t30selloen_a16_factory_payroll.jpg",
   "at": 190.24,
   "compareAt": 192.2
  }
 },
 {
  "p": 8,
  "q": "those years count as zero",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 0,
   "unit": "dollars",
   "prefix": "$",
   "label": "EACH MISSING YEAR COUNTS AS",
   "compare": "For the rest of your life.",
   "photo": "img/t30selloen_a20_zero_year.jpg",
   "at": 203.06,
   "compareAt": 209.94,
   "tone": "red"
  }
 },
 {
  "p": 10,
  "q": "Go down the list, year by year.",
  "dur": 7.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloen_doc_earnings.png",
   "aspect": 0.7727,
   "chip": "EARNINGS RECORD",
   "source": "Rebuilt example · not a real notice",
   "highlights": [
    {
     "x": 6.0,
     "y": 51.36,
     "w": 60.0,
     "h": 2.27,
     "at": 254.97,
     "zoom": 1.7
    },
    {
     "x": 6.0,
     "y": 63.64,
     "w": 60.0,
     "h": 2.27,
     "at": 256.77,
     "zoom": 1.7
    }
   ],
   "note": {
    "text": "Look for the zeros.",
    "at": 278.51
   }
  }
 },
 {
  "p": 11,
  "q": "Number two.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 2",
   "part": "FULL RETIREMENT AGE"
  }
 },
 {
  "p": 12,
  "q": "If you were born between nineteen forty-three and nineteen fifty-four",
  "dur": 16.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloen_doc_fra.png",
   "aspect": 0.7727,
   "chip": "FULL RETIREMENT AGE",
   "source": "Social Security Administration rules",
   "highlights": [
    {
     "x": 9.0,
     "y": 24.91,
     "w": 82.0,
     "h": 4.55,
     "at": 295.73
    },
    {
     "x": 9.0,
     "y": 30.82,
     "w": 82.0,
     "h": 4.55,
     "at": 301.27
    },
    {
     "x": 9.0,
     "y": 36.73,
     "w": 82.0,
     "h": 4.55,
     "at": 305.49
    },
    {
     "x": 9.0,
     "y": 60.36,
     "w": 82.0,
     "h": 4.55,
     "at": 310.95
    }
   ]
  }
 },
 {
  "p": 13,
  "q": "about thirty percent smaller",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 30,
   "unit": "%",
   "prefix": "~",
   "label": "SMALLER CHECK AT 62",
   "compare": "Than at 67. For life.",
   "photo": "img/t30selloen_a25_two_checks.jpg",
   "at": 334.07,
   "compareAt": 337.19,
   "tone": "red"
  }
 },
 {
  "p": 13,
  "q": "grows by eight percent a year",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 8,
   "unit": "% a year",
   "label": "EVERY YEAR YOU WAIT",
   "compare": "Up to age 70.",
   "photo": "img/t30selloen_a27_growing_jar.jpg",
   "at": 345.51,
   "compareAt": 347.45,
   "tone": "green"
  }
 },
 {
  "p": 14,
  "q": "Twelve months. That's the window.",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "tone": "red",
   "value": 12,
   "unit": "months",
   "label": "TO WITHDRAW YOUR APPLICATION",
   "compare": "Pay it back, start over.",
   "photo": "img/t30selloen_a26_hourglass.jpg",
   "at": 368.99,
   "compareAt": 369.99
  }
 },
 {
  "p": 15,
  "q": "Number three.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 3",
   "part": "THE SPOUSAL BENEFIT"
  }
 },
 {
  "p": 15,
  "q": "You might be owed a spousal benefit",
  "dur": 5.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloen_doc_carta.png",
   "aspect": 0.7727,
   "chip": "THE LETTER · LINE 3",
   "source": "Rebuilt example · not a real notice",
   "highlights": [
    {
     "x": 5.6,
     "y": 34.36,
     "w": 88.8,
     "h": 6.82,
     "at": 377.27,
     "zoom": 1.8
    }
   ]
  }
 },
 {
  "p": 16,
  "q": "up to half of the other spouse's full benefit",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "tone": "red",
   "value": 50,
   "unit": "%",
   "label": "OF YOUR SPOUSE'S FULL BENEFIT",
   "compare": "At your full retirement age.",
   "photo": "img/t30selloen_a28_married_kitchen.jpg",
   "at": 391.11,
   "compareAt": 395.39
  }
 },
 {
  "p": 17,
  "q": "If you were married for at least ten years",
  "dur": 9.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30selloen_a31_ring_hand.jpg",
   "rightImg": "img/t30selloen_a09_old_couple_kitchen.jpg",
   "leftHead": "YOU",
   "rightHead": "YOUR EX",
   "leftText": "10+ years married. Not remarried.",
   "rightText": "Loses nothing. Isn't even told.",
   "leftAt": 431.89,
   "rightAt": 441.05,
   "stamp": ""
  }
 },
 {
  "p": 17,
  "q": "Ten years of marriage.",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "tone": "red",
   "value": 10,
   "unit": "years",
   "label": "OF MARRIAGE",
   "compare": "That's the number.",
   "photo": "img/t30selloen_a18_wedding_couple.jpg",
   "at": 456.75,
   "compareAt": 457.91
  }
 },
 {
  "p": 18,
  "q": "Number four.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 4",
   "part": "WIDOWS AND WIDOWERS"
  }
 },
 {
  "p": 19,
  "q": "up to one hundred percent",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "tone": "red",
   "value": 100,
   "unit": "%",
   "label": "SURVIVOR BENEFIT",
   "compare": "Of what your spouse was getting.",
   "photo": "img/t30selloen_a32_widow_grave.jpg",
   "at": 468.63,
   "compareAt": 470.71
  }
 },
 {
  "p": 19,
  "q": "you can sometimes take one benefit first",
  "dur": 9.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30selloen_a33_widower_table.jpg",
   "rightImg": "img/t30selloen_a49_coins_slow.jpg",
   "leftHead": "FIRST",
   "rightHead": "LATER",
   "leftText": "Survivor benefit, early.",
   "rightText": "Your own, grown at 70.",
   "leftAt": 490.83,
   "rightAt": 496.79,
   "stamp": ""
  }
 },
 {
  "p": 20,
  "q": "two hundred fifty-five dollars for a surviving spouse",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "tone": "red",
   "value": 255,
   "unit": "dollars",
   "prefix": "$",
   "label": "ONE-TIME DEATH PAYMENT",
   "compare": "Apply within two years.",
   "photo": "img/t30selloen_a34_grocery_bag.jpg",
   "at": 520.35,
   "compareAt": 531.57
  }
 },
 {
  "p": 21,
  "q": "Number five.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 5",
   "part": "TEACHERS, POLICE, FIREFIGHTERS"
  }
 },
 {
  "p": 22,
  "q": "a lot of teachers, police officers, firefighters",
  "dur": 5.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloen_doc_carta.png",
   "aspect": 0.7727,
   "chip": "THE LETTER · LINE 5",
   "source": "Rebuilt example · not a real notice",
   "highlights": [
    {
     "x": 5.6,
     "y": 49.36,
     "w": 88.8,
     "h": 6.82,
     "at": 548.91,
     "zoom": 1.8
    }
   ]
  }
 },
 {
  "p": 23,
  "q": "In January of twenty twenty-five",
  "dur": 6.0,
  "comp": "YearCounter",
  "props": {
   "photo": "img/t30selloen_a35_teacher_class.jpg",
   "yearFrom": 1983,
   "yearTo": 2025,
   "unit": "",
   "label": "THE OLD PENSION RULES · ENDED",
   "from": 574.43,
   "to": 579.11,
   "marks": [
    {
     "year": 2025,
     "note": "Social Security Fairness Act"
    }
   ],
   "source": "Social Security Fairness Act, signed January 2025",
   "linear": true
  }
 },
 {
  "p": 24,
  "q": "Number six.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 6",
   "part": "MEDICARE PART B"
  }
 },
 {
  "p": 25,
  "q": "Your Medicare Part B premium comes out of your Social Security check.",
  "dur": 5.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloen_doc_carta.png",
   "aspect": 0.7727,
   "chip": "THE LETTER · LINE 6",
   "source": "Rebuilt example · not a real notice",
   "highlights": [
    {
     "x": 5.6,
     "y": 56.86,
     "w": 88.8,
     "h": 6.82,
     "at": 622.39,
     "zoom": 1.8
    }
   ]
  }
 },
 {
  "p": 25,
  "q": "Two years.",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "tone": "red",
   "value": 2,
   "unit": "years ago",
   "label": "THE TAX RETURN THEY USE",
   "compare": "Not what you earn today.",
   "photo": "img/t30selloen_a22_tax_return_old.jpg",
   "at": 639.05,
   "compareAt": 647.83
  }
 },
 {
  "p": 26,
  "q": "There's a form, it's called SSA-44",
  "dur": 9.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloen_doc_ssa44.png",
   "aspect": 0.7727,
   "chip": "FORM SSA-44",
   "source": "Rebuilt example of the SSA-44 form",
   "highlights": [
    {
     "x": 6.0,
     "y": 28.55,
     "w": 60.0,
     "h": 3.18,
     "at": 658.21
    },
    {
     "x": 6.0,
     "y": 24.91,
     "w": 60.0,
     "h": 3.18,
     "at": 659.77
    },
    {
     "x": 6.0,
     "y": 21.27,
     "w": 60.0,
     "h": 3.18,
     "at": 661.99
    },
    {
     "x": 6.0,
     "y": 39.45,
     "w": 60.0,
     "h": 3.18,
     "at": 663.23
    }
   ]
  }
 },
 {
  "p": 26,
  "q": "SSA-44. Write it down.",
  "dur": 4.0,
  "comp": "BigStat",
  "props": {
   "tone": "red",
   "value": 44,
   "unit": "",
   "prefix": "SSA-",
   "label": "WRITE IT DOWN",
   "compare": "Life-changing event form.",
   "photo": "img/t30selloen_a43_forms_tray.jpg",
   "at": 679.31
  }
 },
 {
  "p": 27,
  "q": "Number seven.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 7",
   "part": "THE 60-DAY CLOCK"
  }
 },
 {
  "p": 28,
  "q": "you have sixty days to ask them to look at it again",
  "dur": 5.5,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloen_doc_carta.png",
   "aspect": 0.7727,
   "chip": "THE LETTER · LINE 7",
   "source": "Rebuilt example · not a real notice",
   "highlights": [
    {
     "x": 5.6,
     "y": 64.36,
     "w": 88.8,
     "h": 6.82,
     "at": 691.37,
     "zoom": 1.8
    }
   ]
  }
 },
 {
  "p": 28,
  "q": "Sixty days... Sixty days from when you get the letter.",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 60,
   "unit": "days",
   "label": "TO ASK FOR RECONSIDERATION",
   "compare": "The clock runs in the drawer too.",
   "photo": "img/t30selloen_a46_calendar_days.jpg",
   "at": 701.29,
   "compareAt": 705.25,
   "tone": "red"
  }
 },
 {
  "p": 29,
  "q": "Silence is the worst answer.",
  "dur": 5.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30selloen_a47_drawer_closing.jpg",
   "rightImg": "img/t30selloen_a48_mailbox_blue.jpg",
   "leftHead": "SILENCE",
   "rightHead": "ASK",
   "leftText": "The clock runs out.",
   "rightText": "Reconsideration. Waiver. Slower payback.",
   "leftAt": 734.6,
   "rightAt": 736.18,
   "stamp": ""
  }
 },
 {
  "p": 30,
  "q": "Number eight.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 8",
   "part": "TAX YOU DON'T OWE"
  }
 },
 {
  "p": 31,
  "q": "Up to eighty-five percent",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "tone": "red",
   "value": 85,
   "unit": "%",
   "label": "OF YOUR BENEFIT CAN BE TAXED",
   "compare": "Depends on your other income.",
   "photo": "img/t30selloen_a50_tax_forms.jpg",
   "at": 744.32,
   "compareAt": 747.38
  }
 },
 {
  "p": 31,
  "q": "for the tax years twenty twenty-five through twenty twenty-eight",
  "dur": 6.0,
  "comp": "YearCounter",
  "props": {
   "photo": "img/t30selloen_a52_april_rain.jpg",
   "yearFrom": 2025,
   "yearTo": 2028,
   "unit": "",
   "label": "EXTRA SENIOR DEDUCTION · 65 AND OLDER",
   "from": 769.26,
   "to": 770.7,
   "marks": [],
   "source": "Temporary deduction for seniors, tax years 2025-2028",
   "linear": true
  }
 },
 {
  "p": 32,
  "q": "Number nine.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 9",
   "part": "CHECK IT EVERY JANUARY"
  }
 },
 {
  "p": 33,
  "q": "Look at three lines",
  "dur": 10.0,
  "comp": "DocumentPage",
  "props": {
   "page": "img/t30selloen_doc_enero.png",
   "aspect": 0.7727,
   "chip": "THE JANUARY LETTER",
   "source": "Rebuilt example · not a real notice",
   "highlights": [
    {
     "x": 6.0,
     "y": 20.82,
     "w": 88.0,
     "h": 4.55,
     "at": 819.2
    },
    {
     "x": 6.0,
     "y": 27.64,
     "w": 88.0,
     "h": 4.55,
     "at": 821.82
    },
    {
     "x": 6.0,
     "y": 41.27,
     "w": 88.0,
     "h": 4.55,
     "at": 823.28
    }
   ],
   "note": {
    "text": "Compare to last year.",
    "at": 826.1
   }
  }
 },
 {
  "p": 34,
  "q": "twelve hundred dollars a year",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "tone": "red",
   "value": 1200,
   "unit": "a year",
   "prefix": "$",
   "label": "$100 A MONTH NEVER CLAIMED",
   "compare": "Nobody's stealing. Nobody adds it.",
   "photo": "img/t30selloen_a58_coffee_letter.jpg",
   "at": 859.18,
   "compareAt": 868.9
  }
 },
 {
  "p": 35,
  "q": "Here's your homework",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "HOMEWORK",
   "part": "TWO THINGS THIS WEEK"
  }
 },
 {
  "p": 35,
  "q": "Am I getting the highest benefit I'm eligible for, on any record?",
  "dur": 7.0,
  "comp": "PullQuote",
  "props": {
   "quote": "Am I getting the highest benefit I'm eligible for, on any record?",
   "who": "The one question to ask",
   "source": "Write it on the back of an envelope",
   "at": 893.42,
   "until": 896.36,
   "highlight": "highest benefit",
   "portrait": "img/t30selloen_a59_envelope_back.jpg"
  }
 },
 {
  "p": 36,
  "q": "That's a scam, every time.",
  "dur": 5.0,
  "comp": "SceneCallout",
  "props": {
   "photo": "img/t30selloen_a60_scam_phone.jpg",
   "x": 1020,
   "y": 730,
   "r": 130,
   "note": "a scam, every time",
   "circleAt": 912.02,
   "noteAt": 915.46,
   "zoom": 1.3
  }
 },
 {
  "p": 37,
  "q": "what year were you born",
  "dur": 7.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "03",
   "label": "TELL ME IN THE COMMENTS",
   "title": "WHAT YEAR WERE YOU BORN?",
   "sub": "Did you know your real retirement age?",
   "stamp": "",
   "typeAt": 919.94,
   "stampAt": 929.26
  }
 }
];
export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
