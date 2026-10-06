// public/rhmoldbleach_meta.json {title, description, pinned_comment}: descripción de la tarjeta (row 302) con los capítulos REALES
// (inicio de cada sección en el máster = en el video, no hay corrimiento). node vlog/rhmoldbleach/meta.mjs
import fs from "node:fs";
import { get } from "./sb.mjs";
const R = "D:/Proyectos/video2-wt/rhmoldbleach/", P = JSON.parse(fs.readFileSync(R + "_v3/rhmoldbleach_paras.json", "utf8"));
const CH = [[0, "Bleach didn't kill it, it hid it"], [6, "The whole fix, start to finish"], [15, "Why bleach lets you down"], [23, "20 years of Sundays"], [25, "The 5-second swab test"], [31, "Never mix these"], [36, "5 mistakes that waste it"], [42, "4 spots nobody cleans"], [49, "Mold on the ceiling"], [51, "Questions I always get"], [60, "When to call a pro"], [64, "The 30-second habit"], [69, "Recap"]];
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s)} ${t}`).join("\n");
const card = (await get("tracked_channels?select=plan&id=eq.302"))[0].plan.find((c) => c.id === "plan-own-1791246085234-1");
if (!card.description.includes("[[CHAPTERS]]")) throw new Error("la descripción de la tarjeta no tiene [[CHAPTERS]]");
const meta = {
  title: card.title,
  description: card.description.replace("[[CHAPTERS]]", chapters),
  pinned_comment: "How many days did YOUR bleach last before the black dots came back? Tell me down here. I read every one. — Rhonda",
};
fs.writeFileSync(R + "public/rhmoldbleach_meta.json", JSON.stringify(meta, null, 1));
console.log(meta.title + "\n\n" + meta.description + "\n\nPINNED: " + meta.pinned_comment);
