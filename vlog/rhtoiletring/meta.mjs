// public/rhtoiletring_meta.json {title, description, pinned_comment}: descripción de la tarjeta (row 302) con los capítulos REALES
// (inicio de cada sección en el máster = en el video, no hay corrimiento). node vlog/rhtoiletring/meta.mjs
import fs from "node:fs";
import { get } from "./sb.mjs";
const R = "D:/Proyectos/video2-wt/rhtoiletring/", P = JSON.parse(fs.readFileSync(R + "_v3/rhtoiletring_paras.json", "utf8"));
const CH = [[0, "It's not dirt, it's rock"], [6, "The whole fix, start to finish"], [18, "Why it keeps coming back"], [27, "The $200 new toilet"], [29, "The pumice mistake you can't undo"], [37, "The 5-second color test"], [44, "The vinegar day"], [48, "5 mistakes that waste it"], [54, "3 spots that feed the ring"], [61, "Questions I always get"], [71, "One cup a week"], [76, "Recap"]];
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s)} ${t}`).join("\n");
const card = (await get("tracked_channels?select=plan&id=eq.302"))[0].plan.find((c) => c.id === "plan-own-1791246085234-2");
if (!card.description.includes("[[CHAPTERS]]")) throw new Error("la descripción de la tarjeta no tiene [[CHAPTERS]]");
const meta = {
  title: card.title,
  description: card.description.replace("[[CHAPTERS]]", chapters),
  pinned_comment: "What color is YOUR ring: brown, white, orange, black or pink? Tell me down here and I'll tell you what it is. — Rhonda",
};
fs.writeFileSync(R + "public/rhtoiletring_meta.json", JSON.stringify(meta, null, 1));
console.log(meta.title + "\n\n" + meta.description + "\n\nPINNED: " + meta.pinned_comment);
