// public/rhcaulk_meta.json {title, description, pinned_comment}: descripción de la tarjeta (row 302) con los capítulos REALES
// (inicio de cada sección en el máster = en el video, no hay corrimiento). node vlog/rhcaulk/meta.mjs
import fs from "node:fs";
import { get } from "./sb.mjs";
const R = "D:/Proyectos/video2-wt/rhcaulk/", P = JSON.parse(fs.readFileSync(R + "_v3/rhcaulk_paras.json", "utf8"));
const CH = [[0, "Put the knife down"], [6, "The whole fix: one night"], [19, "Why your spray never worked"], [27, "The nurse and her deposit"], [29, "The two night rule"], [36, "If it really has to come out"], [45, "Three tubes, three weekends"], [46, "Never mix these"], [49, "5 mistakes that waste it"], [55, "Same trick, 3 more places"], [62, "Questions I always get"], [73, "Keep it white"], [78, "Recap"]];
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s)} ${t}`).join("\n");
const card = (await get("tracked_channels?select=plan&id=eq.302"))[0].plan.find((c) => c.id === "plan-own-1791246085234-3");
if (!card.description.includes("[[CHAPTERS]]")) throw new Error("la descripción de la tarjeta no tiene [[CHAPTERS]]");
const meta = {
  title: card.title,
  description: card.description.replace("[[CHAPTERS]]", chapters),
  pinned_comment: "How many times have you recaulked that tub? Tell me down here. I read every one. — Rhonda",
};
fs.writeFileSync(R + "public/rhcaulk_meta.json", JSON.stringify(meta, null, 1));
console.log(meta.title + "\n\n" + meta.description + "\n\nPINNED: " + meta.pinned_comment);
