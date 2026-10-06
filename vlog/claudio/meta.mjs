// public/<slug>_meta.json {title, description, pinned_comment}: descripción de la tarjeta (row 303) con los capítulos REALES
// (vlog/<slug>/chapters.json = [[párrafo, título], …] + pinned). SLUG=x node vlog/claudio/meta.mjs
import fs from "node:fs";
import { R, SLUG, V3, J } from "./env.mjs";
import { get } from "./sb.mjs";
const P = J(V3 + "paras.json"), CF = J(R + `vlog/${SLUG}/chapters.json`);
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CF.chapters.map(([p, t]) => `${ts(p === 0 ? 0 : Math.max(0, P[p].s - 0.5))} ${t}`).join("\n");
const card = (await get("tracked_channels?select=plan&id=eq.303"))[0].plan.find((c) => c.slug === SLUG);
if (!card.description.includes("[[CHAPTERS]]")) throw new Error("la descripción de la tarjeta no tiene [[CHAPTERS]]");
// embudo: la 1ª línea de la descripción = lo GRATIS del video (la landing con ?src=<slug> muestra esa página entera)
const gratis = `🎁 GRATIS: la página ${card.book_page} entera de este arreglo, con las cantidades exactas 👉 ${card.cta_url}

`;
const meta = { title: card.title, description: gratis + card.description.replace("[[CHAPTERS]]", chapters), pinned_comment: CF.pinned };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(meta, null, 1));
console.log(meta.title + "\n\n" + meta.description + "\n\nFIJADO: " + meta.pinned_comment);
