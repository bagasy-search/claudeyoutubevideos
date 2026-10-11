// public/rhmattress_meta.json {title, description, pinned_comment}: renglón 1 = CTA (regla 10-oct: emoji + el arreglo de ESTE video +
// el resto del libro + ancla del precio de un profesional + 👉 link, sin precio del libro ni "gratis"), capítulos REALES del máster.
// OFS = corrimiento de la apertura en la entrega (miniatura → voz +1 s), medido entrega↔máster. node vlog/rhmattress/meta.mjs [OFS]
import fs from "node:fs";
import { get } from "./sb.mjs";
const R = "D:/Proyectos/video2-wt/rhmattress/", P = JSON.parse(fs.readFileSync(R + "_v3/rhmattress_paras.json", "utf8")), OFS = +(process.argv[2] || 0);
const CH = [[0, "Half white, half yellow"], [6, "What that yellow really is"], [11, "All you need"], [13, "1 · Strip it and vacuum it"], [17, "2 · The mix (and the bottle that can pop)"], [22, "3 · Test a corner"], [25, "4 · Spray it light (don't soak it)"], [32, "5 · Dry it with a fan"], [36, "Your pillows"], [39, "Under the bed"], [42, "6 · Vacuum it up"], [47, "What if it's pee?"], [52, "Blood, coffee, makeup"], [57, "5 mistakes"], [63, "Questions I always get"], [73, "When it won't come out"], [77, "The $20 thing"], [81, "Recap"], [82, "Never mix"]];
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s + OFS)} ${t}`).join("\n");
const card = (await get("tracked_channels?select=plan&id=eq.302"))[0].plan.find((c) => c.id === "plan-own-1791246085234-7");
const URL = "https://rhondas-brown-bottle-book.vercel.app/?src=rhmattress";
const meta = {
  title: card.title,
  description: `🛏️ My yellow mattress stain spray with the exact amounts + 91 more fixes a pro charges $150+ a visit for 👉 ${URL}

Those yellow stains are old sweat and body oil in the top layer, and they come out. Rhonda cleaned other people's homes in Ohio for 34 years. No music, no fluff: the exact mix, the corner test, why soaking makes the ring bigger, drying it right, pee and other stains, and the $20 thing that means you never do this again.

Chapters:
${chapters}

⚠️ Household cleaning use only. Never drink or ingest hydrogen peroxide. Use the regular 3% bottle, wear gloves, ventilate, and test a hidden corner first. Mix it fresh and never store peroxide and baking soda in a closed bottle: it makes gas and the bottle can pop. Never mix bleach with vinegar or ammonia, and never use peroxide and vinegar in the same bottle or the same pass.

Rhonda's Brown Bottle Book: the exact amounts for this fix and 91 more, printable. ${card.cta_pie}

#cleaningtips #hydrogenperoxide #mattresscleaning`,
  pinned_comment: "How old is your mattress? Be honest. Tell me down here. I read every one. — Rhonda",
};
if (/free/i.test(meta.description) || /\$\s?\d+(\.\d\d)?\s*(book|pdf)/i.test(meta.description)) throw new Error("⛔ 'free' o precio del libro en la descripción");
fs.writeFileSync(R + "public/rhmattress_meta.json", JSON.stringify(meta, null, 1));
console.log(meta.title + "\n\n" + meta.description + "\n\nPINNED: " + meta.pinned_comment);
