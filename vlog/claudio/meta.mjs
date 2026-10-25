// public/<slug>_meta.json {title, description, pinned_comment}. La tarjeta (row 303) se busca por cta_url ?src=<slug> (las tarjetas no
// tienen slug ni descripción). Descripción = vlog/<slug>/desc.txt con [[CHAPTERS]] (capítulos REALES de vlog/<slug>/chapters.json).
// ⛔⛔ Renglón 1 = CTA de valor percibido (feedback_cta_primer_renglon_todos_los_videos): emoji + lo de ESTE video + todo lo demás + ancla
// profesional + 👉 link https. ⛔⛔ NADA GRATIS (feedback_no_regalar_gratis_no_vende): si aparece "gratis/free/regalo" en algo, corta.
// SLUG=x node vlog/claudio/meta.mjs
import fs from "node:fs";
import { R, SLUG, V3, J } from "./env.mjs";
import { get } from "./sb.mjs";
const P = J(V3 + "paras.json"), CF = J(R + `vlog/${SLUG}/chapters.json`);
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CF.chapters.map(([p, t]) => `${ts(p === 0 ? 0 : Math.max(0, P[p].s - 0.5))} ${t}`).join("\n");
const card = (await get("tracked_channels?select=plan&id=eq.303"))[0].plan.find((c) => (c.cta_url || "").endsWith(`?src=${process.env.CARD_SRC || SLUG}`));
if (!card) throw new Error("no hay tarjeta con ?src=" + SLUG);
const desc = fs.readFileSync(R + `vlog/${SLUG}/desc.txt`, "utf8").trim();
if (!desc.includes("[[CHAPTERS]]")) throw new Error("desc.txt sin [[CHAPTERS]]");
const linea1 = `${CF.cta} 👉 ${card.cta_url.split("?")[0].replace(/\/$/, "")}`;  // link LIMPIO sin ?src= (feedback_cta_primer_renglon_todos_los_videos, 24-oct)
const meta = { title: card.title, description: linea1 + "\n\n" + desc.replace("[[CHAPTERS]]", chapters), pinned_comment: CF.pinned };
const all = JSON.stringify(meta);
if (/gratis|free|regal|sin costo/i.test(all)) throw new Error("⛔ la meta ofrece algo GRATIS: " + all.match(/.{0,40}(gratis|free|regal|sin costo).{0,40}/i)[0]);
if (!/^https:\/\//.test(card.cta_url)) throw new Error("cta_url sin https");
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(meta, null, 1));
console.log(meta.title + "\n\n" + meta.description + "\n\nFIJADO: " + meta.pinned_comment);
