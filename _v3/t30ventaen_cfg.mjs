// _v3/t30ventaen_cfg.mjs — "I Ran a Bank Branch for 35 Years: What Banks Quietly Stopped Letting Seniors Do" · Harold (EN).
// Generado por D:/rtmp_t30ventaen/tools/mk_cfg.py (tiempos de words.json). Ritmo Bertha: avatar 27 % en ventanas 3-6 s, b-roll 2,3-5,2 s.
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 3.0;
export const AVATAR_WIN_MAX = 6.0;
export const AVATAR_CAND_MAX = 6.0;
export const AVATAR_OBJ = 0.27;
export const APERTURA_MIN = 3.0;
export const TRANSICIONES = true;
export const SECCIONES = [{"sec": "S0", "rol": "hook", "p0": 1, "p1": 6}, {"sec": "S1", "rol": "explica", "p0": 7, "p1": 9}, {"sec": "S2", "rol": "prueba", "p0": 10, "p1": 12}, {"sec": "S3", "rol": "explica", "p0": 13, "p1": 15}, {"sec": "S4", "rol": "prueba", "p0": 16, "p1": 18}, {"sec": "S5", "rol": "explica", "p0": 19, "p1": 21}, {"sec": "S6", "rol": "explica", "p0": 22, "p1": 24}, {"sec": "S7", "rol": "receta", "p0": 25, "p1": 27}, {"sec": "S8", "rol": "explica", "p0": 28, "p1": 29}, {"sec": "S9", "rol": "prueba", "p0": 30, "p1": 32}, {"sec": "S10", "rol": "explica", "p0": 33, "p1": 35}, {"sec": "S11", "rol": "prueba", "p0": 36, "p1": 38}, {"sec": "S12", "rol": "cierre", "p0": 39, "p1": 43}];
const R = [3.6, 2.6, 4.4, 3.1, 5.0, 2.4, 3.9, 4.7, 2.9, 3.4, 5.2, 3.0];
export const ESCALERA = { hook: [2.4, 3.0, 2.6, 3.4, 2.3, 3.8, 2.8, 4.2, 2.5, 3.2, 2.7, 3.6], explica: R, receta: [...R].reverse(), prueba: [3.2, 4.6, 2.5, 3.8, 5.1, 2.8, 3.5, 4.2, 2.4, 3.9, 4.9, 3.1], cierre: R };
export const ORDEN_FORZADO = {};
export const OVERLAY = ['ActChip'];
export const IMPORTS = {"BigStat": "../backfire/BigStat", "FileStamp": "../backfire/FileStamp", "ActChip": "../backfire/ActChip", "SplitVs": "../backfire/SplitVs", "PullQuote": "../backfire/PullQuote", "RayChecklist": "../rksafe/RayChecklist", "PhoneAlert": "../rksafe/PhoneAlert"};
export const BEDS = ["a03_fine_print", "a04_phone_menu", "a05_monthly_fee", "a08_brick_branch", "a12_toaster_box", "a13_old_checkbook", "a14_three_statements", "a16_senior_account", "a17_cash_counter", "a19_report_form", "a23_split_envelopes", "a27_trusted_form", "a28_church_friend", "a32_three_kids", "a33_probate", "a36_legal_dept", "a38_checkbook_stack", "a41_tablet_balance", "a42_cd_certificate", "a45_coin_growth", "a50_sdb_wall", "a51_sdb_contents", "a59_caller_id", "a62_old_couple_sad", "a63_adding_tape", "a65_mail_trash"];
export const COMPONENTES = [
 {
  "p": 1,
  "q": "Once you pass sixty-five",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 65,
   "unit": "and up",
   "label": "WHEN THE BANK STARTS CLOSING DOORS",
   "photo": "img/t30ventaen_a03_fine_print.jpg",
   "tone": "red",
   "at": 9.74
  }
 },
 {
  "p": 2,
  "q": "spent forty minutes pressing numbers",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "value": 40,
   "unit": "minutes",
   "label": "ON HOLD, PRESSING NUMBERS",
   "photo": "img/t30ventaen_a04_phone_menu.jpg",
   "tone": "white",
   "at": 42.3
  }
 },
 {
  "p": 4,
  "q": "So today I'm going to walk you through eleven things",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 11,
   "unit": "things",
   "label": "BANKS QUIETLY STOPPED LETTING SENIORS DO",
   "compare": "Number four made my sister angry.",
   "photo": "img/t30ventaen_a08_brick_branch.jpg",
   "tone": "white",
   "at": 81.76,
   "compareAt": 99.16
  }
 },
 {
  "p": 5,
  "q": "I'm Harold",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "01",
   "label": "TELLER WINDOW THREE",
   "title": "HAROLD",
   "sub": "35 years at a small brick branch · Pennsylvania",
   "stamp": "",
   "typeAt": 109.0,
   "stampAt": 109.68
  }
 },
 {
  "p": 6,
  "q": "subscribe and tap the little bell",
  "dur": 6.5,
  "comp": "FileStamp",
  "props": {
   "fileNo": "02",
   "label": "EVERY WEEK, ONE MORE DRAWER",
   "title": "SUBSCRIBE + BELL",
   "sub": "What did your bank do that made you angriest?",
   "stamp": "",
   "typeAt": 137.2,
   "stampAt": 146.58
  }
 },
 {
  "p": 7,
  "q": "Number one.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 1",
   "part": "OLD ACCOUNT, NEW RULES"
  }
 },
 {
  "p": 8,
  "q": "Free checking",
  "dur": 7.5,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30ventaen_a12_toaster_box.jpg",
   "rightImg": "img/t30ventaen_a05_monthly_fee.jpg",
   "leftHead": "THEN",
   "rightHead": "NOW",
   "leftText": "Free checking.",
   "rightText": "A monthly maintenance fee.",
   "leftAt": 163.6,
   "rightAt": 185.58,
   "stamp": ""
  }
 },
 {
  "p": 9,
  "q": "Look at your last three statements",
  "dur": 5.5,
  "comp": "BigStat",
  "props": {
   "value": 3,
   "unit": "statements",
   "label": "READ THEM LINE BY LINE",
   "compare": "Look for: maintenance fee · service charge.",
   "photo": "img/t30ventaen_a14_three_statements.jpg",
   "tone": "white",
   "at": 198.0,
   "compareAt": 201.98
  }
 },
 {
  "p": 9,
  "q": "Old account, new rules.",
  "dur": 4.5,
  "comp": "PullQuote",
  "props": {
   "quote": "Old account, new rules. Read the letter.",
   "who": "Harold",
   "source": "35 years behind the bank desk",
   "at": 221.94,
   "until": 225.64,
   "highlight": "Read the letter."
  }
 },
 {
  "p": 10,
  "q": "Number two.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 2",
   "part": "YOUR CASH, WITH QUESTIONS"
  }
 },
 {
  "p": 11,
  "q": "more than ten thousand dollars in cash",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 10000,
   "unit": "",
   "prefix": "$",
   "label": "CASH IN ONE DAY = A REPORT",
   "compare": "That's the law. It's not about you.",
   "photo": "img/t30ventaen_a17_cash_counter.jpg",
   "tone": "white",
   "at": 249.26,
   "compareAt": 252.74
  }
 },
 {
  "p": 12,
  "q": "never, ever break a big withdrawal",
  "dur": 8.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30ventaen_a23_split_envelopes.jpg",
   "rightImg": "img/t30ventaen_a19_report_form.jpg",
   "leftHead": "NEVER",
   "rightHead": "DO THIS",
   "leftText": "Break it into smaller pieces.",
   "rightText": "Take it out. Let them file the paper.",
   "leftAt": 300.78,
   "rightAt": 313.96,
   "stamp": ""
  }
 },
 {
  "p": 12,
  "q": "The paper doesn't hurt you.",
  "dur": 4.5,
  "comp": "PullQuote",
  "props": {
   "quote": "The paper doesn't hurt you. Hiding from it does.",
   "who": "Harold",
   "source": "35 years behind the bank desk",
   "at": 316.9,
   "until": 320.6,
   "highlight": "Hiding from it does."
  }
 },
 {
  "p": 13,
  "q": "Number three.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 3",
   "part": "THE BANK CAN HOLD IT"
  }
 },
 {
  "p": 15,
  "q": "Ask your bank to add a trusted contact person",
  "dur": 7.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30ventaen_a27_trusted_form.jpg",
   "rightImg": "img/t30ventaen_a28_church_friend.jpg",
   "leftHead": "WHAT IT DOES",
   "rightHead": "ACCESS TO YOUR MONEY",
   "leftText": "The bank can call them first.",
   "rightText": "None.",
   "leftAt": 371.16,
   "rightAt": 376.04,
   "stamp": ""
  }
 },
 {
  "p": 15,
  "q": "One form. It protects you",
  "dur": 6.0,
  "comp": "PullQuote",
  "props": {
   "quote": "One form. It protects you from the scammer and it protects you from the bank guessing wrong.",
   "who": "Harold",
   "source": "35 years behind the bank desk",
   "at": 386.9,
   "until": 392.1,
   "highlight": "One form."
  }
 },
 {
  "p": 16,
  "q": "Number four.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 4",
   "part": "THE JOINT ACCOUNT TRAP"
  }
 },
 {
  "p": 17,
  "q": "So if you have three kids",
  "dur": 6.0,
  "comp": "BigStat",
  "props": {
   "value": 3,
   "unit": "kids",
   "label": "YOU ADDED ONE TO THE ACCOUNT",
   "compare": "The other two might get nothing.",
   "photo": "img/t30ventaen_a32_three_kids.jpg",
   "tone": "red",
   "at": 433.1,
   "compareAt": 434.98
  }
 },
 {
  "p": 18,
  "q": "ask about adding an authorized signer",
  "dur": 9.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30ventaen_a16_senior_account.jpg",
   "rightImg": "img/t30ventaen_a33_probate.jpg",
   "leftHead": "HELP WITH THE BILLS",
   "rightHead": "WHO GETS THE MONEY",
   "leftText": "Authorized signer or power of attorney.",
   "rightText": "Payable-on-death beneficiary.",
   "leftAt": 460.54,
   "rightAt": 474.2,
   "stamp": ""
  }
 },
 {
  "p": 18,
  "q": "Help with the bills and ownership",
  "dur": 5.0,
  "comp": "PullQuote",
  "props": {
   "quote": "Help with the bills and ownership of the money are two different things.",
   "who": "Harold",
   "source": "35 years behind the bank desk",
   "at": 482.84,
   "until": 487.04,
   "highlight": "two different things."
  }
 },
 {
  "p": 19,
  "q": "Number five.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 5",
   "part": "YOUR POWER OF ATTORNEY"
  }
 },
 {
  "p": 20,
  "q": "that takes three weeks",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "value": 3,
   "unit": "weeks",
   "label": "“WE HAVE TO SEND IT TO LEGAL”",
   "photo": "img/t30ventaen_a36_legal_dept.jpg",
   "tone": "white",
   "at": 511.74
  }
 },
 {
  "p": 21,
  "q": "Do it while you can still walk in and sign.",
  "dur": 4.5,
  "comp": "PullQuote",
  "props": {
   "quote": "Do it while you can still walk in and sign.",
   "who": "Harold",
   "source": "35 years behind the bank desk",
   "at": 555.1,
   "until": 558.8,
   "highlight": "walk in and sign."
  }
 },
 {
  "p": 22,
  "q": "Number six.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 6",
   "part": "PAPER COSTS YOU NOW"
  }
 },
 {
  "p": 23,
  "q": "A charge for a paper statement.",
  "dur": 7.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "LITTLE BY LITTLE",
   "title": "New fees",
   "items": [
    {
     "text": "A paper statement"
    },
    {
     "text": "A teller-assisted transfer"
    },
    {
     "text": "A cashier's check"
    }
   ],
   "bed": "img/t30ventaen_a38_checkbook_stack.jpg"
  }
 },
 {
  "p": 24,
  "q": "Seeing your own account often",
  "dur": 5.0,
  "comp": "PullQuote",
  "props": {
   "quote": "Seeing your own account often is the best fraud protection there is.",
   "who": "Harold",
   "source": "35 years behind the bank desk",
   "at": 618.22,
   "until": 622.42,
   "highlight": "best fraud protection"
  }
 },
 {
  "p": 25,
  "q": "Number seven.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 7",
   "part": "THE CD THAT RENEWED ITSELF"
  }
 },
 {
  "p": 26,
  "q": "usually seven to ten days",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 10,
   "unit": "days",
   "prefix": "7–",
   "label": "THE WINDOW AFTER YOUR CD MATURES",
   "compare": "One notice. Then it rolls over.",
   "photo": "img/t30ventaen_a42_cd_certificate.jpg",
   "tone": "white",
   "at": 636.84,
   "compareAt": 639.4
  }
 },
 {
  "p": 27,
  "q": "Your loyalty is not paying you interest.",
  "dur": 5.0,
  "comp": "PullQuote",
  "props": {
   "quote": "Your loyalty is not paying you interest. The calendar is.",
   "who": "Harold",
   "source": "35 years behind the bank desk",
   "at": 678.52,
   "until": 682.72,
   "highlight": "The calendar is."
  }
 },
 {
  "p": 28,
  "q": "Number eight.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 8",
   "part": "WHEN THE BRANCH CLOSES"
  }
 },
 {
  "p": 29,
  "q": "only call the number printed on the back of your card",
  "dur": 6.0,
  "comp": "PullQuote",
  "props": {
   "quote": "Only call the number printed on the back of your card, never a number from a text message.",
   "who": "Harold",
   "source": "35 years behind the bank desk",
   "at": 714.28,
   "until": 719.48,
   "highlight": "the back of your card"
  }
 },
 {
  "p": 30,
  "q": "Number nine.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 9",
   "part": "THE BOX IS NOT INSURED"
  }
 },
 {
  "p": 31,
  "q": "The government deposit insurance covers deposits",
  "dur": 8.0,
  "comp": "SplitVs",
  "props": {
   "leftImg": "img/t30ventaen_a41_tablet_balance.jpg",
   "rightImg": "img/t30ventaen_a51_sdb_contents.jpg",
   "leftHead": "INSURED",
   "rightHead": "NOT INSURED",
   "leftText": "Checking · savings · CDs, up to the limit.",
   "rightText": "What's in your safe deposit box.",
   "leftAt": 740.98,
   "rightAt": 746.96,
   "stamp": ""
  }
 },
 {
  "p": 32,
  "q": "So, three things.",
  "dur": 8.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "SAFE DEPOSIT BOX",
   "title": "Three things",
   "items": [
    {
     "text": "A list and photos, kept at home"
    },
    {
     "text": "Check your homeowner's or renter's policy"
    },
    {
     "text": "Someone you trust knows the box exists"
    }
   ],
   "bed": "img/t30ventaen_a50_sdb_wall.jpg"
  }
 },
 {
  "p": 33,
  "q": "Number ten.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 10",
   "part": "FORGOTTEN MONEY"
  }
 },
 {
  "p": 35,
  "q": "Activity keeps it alive.",
  "dur": 4.0,
  "comp": "PullQuote",
  "props": {
   "quote": "Activity keeps it alive.",
   "who": "Harold",
   "source": "35 years behind the bank desk",
   "at": 856.66,
   "until": 859.86,
   "highlight": "alive."
  }
 },
 {
  "p": 36,
  "q": "Number eleven.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "Nº 11",
   "part": "THE CALL FROM “YOUR BANK”"
  }
 },
 {
  "p": 37,
  "q": "they know the last four digits",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "value": 4,
   "unit": "digits",
   "label": "OF YOUR CARD — THEY ALREADY KNOW",
   "compare": "Caller ID even says the bank's name.",
   "photo": "img/t30ventaen_a59_caller_id.jpg",
   "tone": "red",
   "at": 877.74,
   "compareAt": 879.34
  }
 },
 {
  "p": 38,
  "q": "If it was real, they'll still be there.",
  "dur": 8.0,
  "comp": "PhoneAlert",
  "props": {
   "kicker": "THE FAKE CALL",
   "title": "Fraud Department",
   "body": "Suspicious activity on your account. Verify now.",
   "action": "Hang up, then call back",
   "side": "right",
   "bg": "img/t30ventaen_a62_old_couple_sad.jpg"
  }
 },
 {
  "p": 39,
  "q": "So let's add it up.",
  "dur": 3.5,
  "comp": "ActChip",
  "props": {
   "fileNo": "THE TOTAL",
   "part": "LET'S ADD IT UP"
  }
 },
 {
  "p": 39,
  "q": "that's up to a hundred and eighty dollars a year",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 180,
   "unit": "a year",
   "prefix": "$",
   "label": "A FEE YOU DIDN'T KNOW ABOUT",
   "compare": "$10–15 a month.",
   "photo": "img/t30ventaen_a63_adding_tape.jpg",
   "tone": "red",
   "at": 930.38,
   "compareAt": 931.88
  }
 },
 {
  "p": 39,
  "q": "even one percent less is five hundred dollars a year",
  "dur": 5.0,
  "comp": "BigStat",
  "props": {
   "value": 500,
   "unit": "a year",
   "prefix": "$",
   "label": "A CD 1% LOWER ON $50,000",
   "photo": "img/t30ventaen_a45_coin_growth.jpg",
   "tone": "red",
   "at": 939.9
  }
 },
 {
  "p": 40,
  "q": "Just two things this week.",
  "dur": 8.0,
  "comp": "RayChecklist",
  "props": {
   "kicker": "YOUR HOMEWORK · THIS WEEK",
   "title": "Two things",
   "items": [
    {
     "text": "Circle every fee on your last three statements"
    },
    {
     "text": "Ask about a trusted contact person"
    }
   ],
   "bed": "img/t30ventaen_a13_old_checkbook.jpg"
  }
 },
 {
  "p": 41,
  "q": "Which number?",
  "dur": 6.0,
  "comp": "FileStamp",
  "props": {
   "fileNo": "03",
   "label": "TELL ME IN THE COMMENTS",
   "title": "WHICH NUMBER?",
   "sub": "And what state are you in?",
   "stamp": "",
   "typeAt": 985.66,
   "stampAt": 987.96
  }
 },
 {
  "p": 42,
  "q": "the three words in it you have to look for",
  "dur": 4.5,
  "comp": "BigStat",
  "props": {
   "value": 3,
   "unit": "words",
   "label": "NEXT WEEK: THE LETTER BEFORE THEY CLOSE YOUR ACCOUNT",
   "photo": "img/t30ventaen_a65_mail_trash.jpg",
   "tone": "white",
   "at": 1003.68
  }
 }
];
export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
