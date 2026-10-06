// public/rhwasher_meta.json {title, description, pinned_comment}: descripción de la tarjeta (row 302) con los capítulos REALES
// (inicio de cada sección en el máster = en el video, no hay corrimiento). node vlog/rhwasher/meta.mjs
import fs from "node:fs";
import { get } from "./sb.mjs";
const R = "D:/Proyectos/video2-wt/rhwasher/", P = JSON.parse(fs.readFileSync(R + "_v3/rhwasher_paras.json", "utf8"));
const CH = [[0, "The spot nobody wipes"], [6, "The whole fix"], [16, "Why it stinks"], [23, "The towels she rewashed 3 times"], [25, "The soap drawer and its ceiling"], [32, "The little door at the bottom"], [41, "Never mix these"], [45, "5 mistakes that bring the smell back"], [52, "2 more spots plus a bonus"], [58, "Questions I always get"], [67, "The 2 second habit"], [73, "Recap"]];
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s)} ${t}`).join("\n");
const card = (await get("tracked_channels?select=plan&id=eq.302"))[0].plan.find((c) => c.id === "plan-own-1791246085234-4");
if (!card.description.includes("[[CHAPTERS]]")) throw new Error("la descripción de la tarjeta no tiene [[CHAPTERS]]");
const meta = {
  title: card.title,
  description: card.description.replace("[[CHAPTERS]]", chapters),
  pinned_comment: "What did YOU find in your washer filter? Tell me down here. I read every one. — Rhonda",
};
fs.writeFileSync(R + "public/rhwasher_meta.json", JSON.stringify(meta, null, 1));
console.log(meta.title + "\n\n" + meta.description + "\n\nPINNED: " + meta.pinned_comment);
