// public/rhtoiletrim_meta.json {title, description, pinned_comment}: descripción de la tarjeta (row 302) con los capítulos REALES
// (inicio de cada sección en el máster = en el video, no hay corrimiento). node vlog/rhtoiletrim/meta.mjs
import fs from "node:fs";
import { get } from "./sb.mjs";
const R = "D:/Proyectos/video2-wt/rhtoiletrim/", P = JSON.parse(fs.readFileSync(R + "_v3/rhtoiletrim_paras.json", "utf8"));
const CH = [[0, "That black gunk is alive"], [6, "The whole fix, start to finish"], [15, "Why it keeps coming back"], [24, "The bleach myth"], [31, "The blue tablet"], [35, "Read the color in the mirror"], [40, "Still dark after two rounds? It's mineral"], [45, "5 mistakes that waste it"], [51, "3 spots nobody cleans"], [60, "Questions I always get"], [68, "The 2-second weekly reset"], [71, "Recap + what you never mix"]];
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s)} ${t}`).join("\n");
const card = (await get("tracked_channels?select=plan&id=eq.302"))[0].plan.find((c) => c.id === "plan-own-1791246085234-0");
if (!card.description.includes("[[CHAPTERS]]")) throw new Error("la descripción de la tarjeta no tiene [[CHAPTERS]]");
const meta = {
  title: card.title,
  description: card.description.replace("[[CHAPTERS]]", chapters),
  pinned_comment: "What keeps coming back in YOUR house no matter what you do? Tell me down here. I read every one, and I bet I've cleaned it. It might just be my next video. — Rhonda",
};
fs.writeFileSync(R + "public/rhtoiletrim_meta.json", JSON.stringify(meta, null, 1));
console.log(meta.title + "\n\n" + meta.description + "\n\nPINNED: " + meta.pinned_comment);
