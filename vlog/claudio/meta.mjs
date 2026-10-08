// public/<slug>_meta.json {title, description, pinned_comment} — rama CLAUDIO EN JAPÓN (row 307). Embudo:
//   1ª línea = la página GRATIS del arreglo de ESTE video (landing ?src=<slug>) · 2ª = el regalo "Antes de Pintar" (?src=<slug>-desc)
//   + el texto del canal de la tarjeta (sin su 1ª línea, que es el gancho suelto) con los capítulos REALES (vlog/<slug>/chapters.json).
// SLUG=x node vlog/claudio/meta.mjs
import fs from "node:fs";
import { R, SLUG, V3, J } from "./env.mjs";
import { get } from "./sb.mjs";
const NL = "\n";
const P = J(V3 + "paras.json"), CF = J(R + `vlog/${SLUG}/chapters.json`);
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CF.chapters.map(([p, t]) => `${ts(p === 0 ? 0 : Math.max(0, P[p].s - 0.5))} ${t}`).join(NL);
const card = (await get("tracked_channels?select=plan&id=eq.307"))[0].plan.find((c) => c.slug === SLUG);
if (!card.description.includes("[[CHAPTERS]]")) throw new Error("la descripción de la tarjeta no tiene [[CHAPTERS]]");
const body = card.description.slice(card.description.indexOf("Soy Claudio"));
const L = "https://metodo-japones-claudio.vercel.app";
const head = [
  `🎁 GRATIS: ¿A qué huele tu casa? El test japonés de 5 minutos 👉 ${L}/gratis/?src=${SLUG}-desc`,
  `📖 La regla de este video, gratis y paso a paso: ${L}/?src=${SLUG}`,
  "",
  ...(CF.intro ? [CF.intro, ""] : []),
].join(NL) + NL;
const meta = { title: card.title, description: head + body.replace("[[CHAPTERS]]", chapters), pinned_comment: CF.pinned };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(meta, null, 1));
console.log([meta.title, "", meta.description, "", "FIJADO: " + meta.pinned_comment].join(NL));
