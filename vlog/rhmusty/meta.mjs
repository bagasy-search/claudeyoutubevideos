// public/rhmusty_meta.json {title, description, pinned_comment}: renglón 1 = CTA (regla 10-oct: emoji + el arreglo de ESTE video +
// el resto del libro + ancla del precio de un profesional + 👉 link, sin precio del libro ni "gratis"), capítulos REALES del máster.
// OFS = corrimiento de la apertura en la entrega (miniatura → voz +1 s), medido entrega↔máster. node vlog/rhmusty/meta.mjs [OFS]
import fs from "node:fs";
import { get } from "./sb.mjs";
const R = "D:/Proyectos/video2-wt/rhmusty/", P = JSON.parse(fs.readFileSync(R + "_v3/rhmusty_paras.json", "utf8")), OFS = +(process.argv[2] || 0);
const CH = [[0, "The dark spot under the rug"], [6, "It's not dirt"], [8, "Use your nose"], [10, "All you need"], [11, "1 · Under the sinks"], [17, "2 · The towels"], [21, "3 · Rugs and rug pads"], [26, "4 · The drains you never use"], [32, "5 · Under the refrigerator"], [38, "6 · Outside-wall closets"], [46, "When the whole house is damp"], [50, "What makes it worse"], [55, "When to call a pro"], [58, "5 mistakes"], [64, "Questions I always get"], [72, "Keep it from coming back"], [77, "Recap"], [78, "Never mix"]];
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s + OFS)} ${t}`).join("\n");
const card = (await get("tracked_channels?select=plan&id=eq.302"))[0].plan.find((c) => c.id === "plan-own-1791246085234-6");
const URL = "https://rhondas-brown-bottle-book.vercel.app/?src=rhmusty";
const meta = {
  title: card.title,
  description: `🔦 My 6-place, 5-minute musty smell hunt with the exact amounts + 91 more fixes a pro charges $150+ a visit for 👉 ${URL}

A musty smell isn't dirt. It's something staying damp somewhere, and you can find it. Rhonda cleaned other people's homes in Ohio for 34 years and checks the same six places in the same order: under the sinks, the towels, rugs and rug pads, the drains you never use, the drip pan under the refrigerator, and closets on outside walls. No music, no fluff.

Chapters:
${chapters}

⚠️ Household cleaning use only. Never drink or ingest hydrogen peroxide. Use the regular 3% bottle, wear gloves and ventilate. A hidden leak or water inside a wall is a job for a plumber. Never mix bleach with vinegar or ammonia, and never use peroxide and vinegar in the same bottle or the same pass.

Rhonda's Brown Bottle Book: the exact amounts for this fix and 91 more, printable. ${card.cta_pie}

#cleaningtips #hydrogenperoxide #mustysmell`,
  pinned_comment: "Where did you find yours? Under the sink, a drain, the fridge? Tell me down here. I read every one. — Rhonda",
};
if (/free/i.test(meta.description) || /\$\s?\d+(\.\d\d)?\s*(book|pdf)/i.test(meta.description)) throw new Error("⛔ 'free' o precio del libro en la descripción");
fs.writeFileSync(R + "public/rhmusty_meta.json", JSON.stringify(meta, null, 1));
console.log(meta.title + "\n\n" + meta.description + "\n\nPINNED: " + meta.pinned_comment);
