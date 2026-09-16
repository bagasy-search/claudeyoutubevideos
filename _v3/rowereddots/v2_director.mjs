// v2 PREMIUM: set-pieces hero sobre el plan v1 (quita los comps que reemplaza, agrega los set-pieces)
import fs from "fs";
const D = "_v3/rowereddots/", I = (n) => `img/rowereddots/${n}.jpg`;
const S = fs.readFileSync(D + "guion_rowereddots.txt", "utf8");
const QUITAR = [
  ["errorstinger", "But there is one kind of red dot that looks a lot like them"],
  ["lowerthird", "more than almost anything else"],
  ["mitoverdad", "Myth number one."],
  ["mitoverdad", "Myth number three."],
  ["datoimpacto", "There is no cream, no vitamin and no special diet"],
  ["frasecinetica", "keep your wallet in your pocket"],
  ["lowerthird", "The first one, and the most important one, is called petechiae."],
  ["checklist", "And if those dots come with a fever"],
  ["lowerthird", "Then there is a spot called a pyogenic granuloma."],
  ["carrusel", "So here are the warning signs."],
  ["carrusel", "If it becomes an open sore that doesn't heal."],
  ["lowerthird", "Dermatologists call that the ugly duckling sign"],
  ["errorstinger", "I have seen patients who tried to burn these spots off"],
  ["checklist", "The common options are a tiny electric needle"],
  ["checklist", "You're looking for anything new"],
  ["checklist", "They're not your liver"],
  ["splitcompare", "That is not the same thing as a round cherry dot."],
  ["checklist", "It is not a blood clot."],
  ["datoimpacto", "the majority of us have at least some"],
  ["carrusel", "Hormones can play a part"],
  ["freezezoom", "a little cluster of round red or purple pockets"],
  ["datoimpacto", "over just a few weeks or months, mention it at your next visit"],
  ["callout", "What gives them away is behavior."],
  ["checklist", "That can happen with low platelets"],
];
const LOOK = [{ name: "Petechiae", img: I("rd_petechiae_ankles") }, { name: "Spider angioma", img: I("rd_spider_angioma") }, { name: "Pyogenic granuloma", img: I("rd_pyogenic") }, { name: "Red melanoma (rare)", img: I("rd_red_melanoma") }];
const lk = (idx, p, revealPh, endP) => ({ p, kind: "carousel", group: "look", idx, mode: "reveal", cards: LOOK, revealP: [revealPh], endP, kicker: `Lookalike ${idx + 1} of 4`, title: "Red dots that aren't cherries", bed: I("rd_quick_glance") });
const NUEVOS = [
  { p: "But there is one kind of red dot that looks a lot like them", kind: "falltease", kicker: "Before we're done", title: "The red dot that can't wait", img: I("rd_shins_hook"), sideL: I("rd_petechiae_ankles"), sideR: I("rd_leaked_forearm"), bed: I("rd_shins_hook"), hitAtP: "call your doctor today", endP: "not next month." },
  { p: "I'm Dr. Emmett Rowe", kind: "presenter", mode: "intro", img: "img/rowereddots/rd_doc_cutout.png", bg: I("rd_dr_glass_desk"), kicker: "Your doctor today", role: "Everyday skin questions after 60", endP: "more than almost anything else." },
  { p: "Red dots mean your liver is bad.", kind: "myth2", kicker: "Myth number one", myth: "Red dots mean a bad liver", truth: "That's a spider angioma, not a cherry dot", mythImg: I("rd_liver_worry"), truthImg: I("rd_spider_angioma"), bed: I("rd_liver_worry"), hitAtP: "This one scares a lot of people", truthAtP: "There is a different spot, called a spider angioma", endP: "can be connected to liver problems." },
  { p: "A spider angioma has a red center", kind: "splitcompare", eyebrow: "NOT THE SAME SPOT", title: "Spider vs. cherry", left: { image: I("rd_spider_angioma"), label: "Spider angioma", note: "red center + thin legs" }, right: { image: I("rd_round_oval"), label: "Cherry angioma", note: "a round dot, no legs" }, winner: "none", endP: "not a sign of liver disease." },
  { p: "Myth number three.", kind: "myth2", kicker: "Myth number three", myth: "Left alone, they turn into cancer", truth: "Benign. They don't become skin cancer.", mythImg: I("rd_warn_black"), truthImg: I("rd_dr_benign"), bed: I("rd_dr_benign"), hitAtP: "Cherry angiomas are benign.", truthAtP: "Benign means not cancer.", endP: "that is their normal behavior." },
  { p: "There is no cream, no vitamin and no special diet", kind: "myth2", kicker: "Can you prevent them?", myth: "A cream or vitamin stops them", truth: "Nothing proven. Keep your wallet.", mythImg: I("rd_cream_shelf"), truthImg: I("rd_dr_wallet"), bed: I("rd_miracle_bottle"), hitAtP: "has been shown to stop cherry angiomas", truthAtP: "So please don't spend your money", endP: "keep your wallet in your pocket." },
  lk(0, "The first one, and the most important one, is called petechiae.", "is called petechiae.", "under the skin."),
  { p: "And if those dots come with a fever", kind: "redflags", kicker: "Don't wait for an appointment", img: I("rd_fever_bed"), bed: I("rd_er_entrance"), flags: [{ text: "Fever or feeling very sick", atP: "with a fever" }, { text: "New bruises you can't explain", atP: "with new bruises" }, { text: "Bleeding gums or nosebleeds", atP: "with bleeding gums" }, { text: "Blood in your urine", atP: "blood in your urine" }], stamp: "Get seen right away", stampAtP: "Get seen right away.", endP: "Get seen right away." },
  lk(1, "The spider angioma I already mentioned.", "The spider angioma I already mentioned.", "Red center, little legs."),
  lk(2, "Then there is a spot called a pyogenic granuloma.", "a spot called a pyogenic granuloma.", "because it is not an infection."),
  lk(3, "Some skin cancers, including a type of melanoma", "Some skin cancers, including a type of melanoma", "instead of brown."),
  { p: "So here are the warning signs.", kind: "redflags", kicker: "Show a doctor if a red spot", img: I("rd_ugly_duckling"), bed: I("rd_dr_serious"), flags: [{ text: "Grows quickly over weeks", atP: "if it grows quickly" }, { text: "Changes shape or edge", atP: "If it changes shape" }, { text: "Turns black or blue", atP: "If it turns black or blue." }, { text: "Bleeds on its own", atP: "If it bleeds again and again" }, { text: "A sore that won't heal", atP: "open sore that doesn't heal." }], stamp: "Or: the ugly duckling", stampAtP: "the one spot that looks different", endP: "looks different from all the others." },
  { p: "I have seen patients who tried to burn these spots off", kind: "routineswap", mode: "old", kicker: "What people do at home", title: "Please don't.", bed: I("rd_hot_needle"), items: [{ label: "A hot needle", img: I("rd_hot_needle"), atP: "burn these spots off", hitAtP: "Please don't." }, { label: "Nail clippers or thread", img: I("rd_clippers_thread"), atP: "cut them with nail clippers", hitAtP: "Please don't." }, { label: "Vinegar or garlic", img: I("rd_vinegar_garlic"), atP: "apple cider vinegar", hitAtP: "Please don't." }, { label: "Remover pens", img: I("rd_remover_pen"), atP: "online remover pens", hitAtP: "Please don't." }], endP: "so it bleeds." },
  { p: "The common options are a tiny electric needle", kind: "routineswap", mode: "new", kicker: "Safe, in the office", title: "The right way to remove one", bed: I("rd_dr_cautery"), items: [{ label: "A hot needle", img: I("rd_hot_needle"), newLabel: "Tiny electric needle", newImg: I("rd_dr_cautery"), flipAtP: "a tiny electric needle" }, { label: "Nail clippers", img: I("rd_clippers_thread"), newLabel: "Laser for the red", newImg: I("rd_laser"), flipAtP: "a laser that targets" }, { label: "Vinegar or garlic", img: I("rd_vinegar_garlic"), newLabel: "Freezing", newImg: I("rd_dr_no_needles"), flipAtP: "freezing, or" }, { label: "Remover pens", img: I("rd_remover_pen"), newLabel: "Small shave removal", newImg: I("rd_dr_dermatoscope"), flipAtP: "a small shave removal." }], chip: "Ask about the cost first", chipAtP: "ask about the cost", endP: "ask about the cost before you book." },
  { p: "You're looking for anything new", kind: "selfcheck", kicker: "Your monthly check", questions: [{ text: "Anything new?", img: I("rd_wife_back"), atP: "anything new" }, { text: "Growing fast?", img: I("rd_warn_grow"), atP: "anything growing fast" }, { text: "Bleeding?", img: I("rd_warn_bleed"), atP: "anything bleeding", tone: "danger" }, { text: "The ugly duckling?", img: I("rd_ugly_duckling"), atP: "anything that is the ugly duckling", tone: "danger" }], endP: "anything that is the ugly duckling." },
  { p: "Keep a clear glass in the bathroom cabinet.", kind: "selfcheck", kicker: "The glass test", questions: [{ text: "Sudden flat red dots?", img: I("rd_press_home"), atP: "a sudden crop of tiny flat red dots" }, { text: "Do they fade under a glass?", img: I("rd_glass_shin"), atP: "press the glass on them" }, { text: "No? Call your doctor today", img: I("rd_dr_you_know"), atP: "If they don't fade", tone: "danger" }], endP: "you know what to do." },
  { p: "Let me leave you with the big picture.", kind: "carousel", mode: "recap", cards: [{ name: "Not your liver", img: I("rd_liver_worry") }, { name: "Not contagious", img: I("rd_grandpa_hug") }, { name: "Not cancer", img: I("rd_dr_benign") }], revealP: ["They're not your liver", "they're not contagious", "they don't turn into cancer"], endP: "a few spots that are serious.", kicker: "The big picture", title: "What to remember", bed: I("rd_couple_dock") },
  { p: "If this helped you", kind: "presenter", mode: "signoff", img: "img/rowereddots/rd_doc_cutout.png", bg: I("rd_dr_glass_desk"), kicker: "Subscribe", role: "Everyday skin questions after 60", endP: "I read them." },
];
const secs = ["a", "b", "c", "d", "e", "f"].map((k) => [k, JSON.parse(fs.readFileSync(D + `v1_sec_${k}.json`, "utf8"))]);
let quitados = 0;
for (const [, s] of secs) for (const sec of s) { const n0 = sec.componentes.length; sec.componentes = sec.componentes.filter((c) => !QUITAR.some(([k, p]) => c.kind === k && c.p === p)); quitados += n0 - sec.componentes.length; }
const allSec = secs.flatMap(([k, s]) => s.map((sec) => ({ k, sec }))).filter((x) => x.sec.id !== "sx_real");
let malos = 0;
const chkP = (o) => { for (const [k, v] of Object.entries(o)) { if (k.endsWith("P") && k !== "revealP" && typeof v === "string" && S.indexOf(v) < 0) { console.log("FALTA frase", k, v); malos++; } if (k === "revealP") v.forEach((x) => { if (x && S.indexOf(x) < 0) { console.log("FALTA reveal", x); malos++; } }); if (v && typeof v === "object" && k !== "revealP") chkP(v); } };
for (const c of NUEVOS) {
  chkP(c); const pos = S.indexOf(c.p); if (pos < 0) { console.log("FALTA p", c.p); malos++; continue; }
  let best = allSec[0]; for (const x of allSec) { const m0 = x.sec.momentos[0]; const f = m0 ? S.indexOf(m0.p) : -1; if (f >= 0 && f <= pos) best = x; }
  best.sec.componentes.push(c);
}
if (quitados !== QUITAR.length) { console.log(`quitó ${quitados}/${QUITAR.length}`); malos++; }
if (malos) process.exit(1);
for (const [k, s] of secs) fs.writeFileSync(D + `sec_${k}.json`, JSON.stringify(s, null, 1));
console.log(`v2: quitados ${quitados} · set-pieces ${NUEVOS.length}`);
