// public/rhgrout_meta.json {title, description, pinned_comment}: renglón 1 = CTA (regla 10-oct: emoji + el arreglo de ESTE video +
// el resto del libro + ancla del precio de un profesional + 👉 link, sin precio del libro ni "gratis"), capítulos REALES del máster.
// OFS = corrimiento de la apertura en la entrega (miniatura → voz +1 s), medido entrega↔máster. node vlog/rhgrout/meta.mjs [OFS]
import fs from "node:fs";
import { get } from "./sb.mjs";
const R = "D:/Proyectos/video2-wt/rhgrout/", P = JSON.parse(fs.readFileSync(R + "_v3/rhgrout_paras.json", "utf8")), OFS = +(process.argv[2] || 0);
const CH = [[0, "One white line"], [6, "The whole fix"], [17, "The 3 worst spots"], [21, "Why grout goes gray (it's the mop)"], [29, "The $1,200 quote"], [31, "The brush that ruins grout"], [37, "Will it ruin the color?"], [42, "Black spots in the shower"], [46, "Grout or caulk?"], [49, "The last step: sealer"], [55, "Two floors I'll never forget"], [57, "5 mistakes"], [63, "Is it really worn out?"], [67, "Questions I always get"], [76, "Keep it white"], [82, "Recap"]];
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s + OFS)} ${t}`).join("\n");
const card = (await get("tracked_channels?select=plan&id=eq.302"))[0].plan.find((c) => c.id === "plan-own-1791246085234-5");
const URL = "https://rhondas-brown-bottle-book.vercel.app/?src=rhgrout";
const meta = {
  title: card.title,
  description: `🧽 My gray grout paste with the exact amounts + 91 more fixes a pro charges $150+ a visit for 👉 ${URL}

Gray grout usually isn't worn out. It's dirt down in the little holes, and most of it gets pushed in by the mop. Rhonda cleaned other people's homes in Ohio for 34 years. No music, no fluff: the paste, the brush that ruins grout, the colored-grout test, and the sealer step a contractor charges you for.

Chapters:
${chapters}

⚠️ Household cleaning use only. Never drink or ingest hydrogen peroxide. Use the regular 3% bottle, wear gloves, ventilate, and test colored grout in a hidden spot first. Not for natural stone (marble, travertine, limestone, slate). Never mix bleach with vinegar or ammonia, and never use peroxide and vinegar in the same bottle or the same pass.

Rhonda's Brown Bottle Book: the exact amounts for this fix and 91 more, printable. ${card.cta_pie}

#cleaningtips #hydrogenperoxide #groutcleaning`,
  pinned_comment: "What did somebody quote YOU to redo your grout? Tell me down here. I read every one. — Rhonda",
};
if (/free/i.test(meta.description) || /\$\s?\d+(\.\d\d)?\s*(book|pdf)/i.test(meta.description)) throw new Error("⛔ 'free' o precio del libro en la descripción");
fs.writeFileSync(R + "public/rhgrout_meta.json", JSON.stringify(meta, null, 1));
console.log(meta.title + "\n\n" + meta.description + "\n\nPINNED: " + meta.pinned_comment);
