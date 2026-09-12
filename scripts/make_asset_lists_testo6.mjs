// Convierte _v3/testo6_assets.json -> prompts del presentador (gpt-image-2) + needstock (Pexels)
// + la lista explicita de assets para el farm.
import {readFileSync, writeFileSync} from "node:fs";

const SLUG = "testo6";
const REF = `public/ref_${SLUG}.png`;
const A = JSON.parse(readFileSync(`_v3/${SLUG}_assets.json`, "utf8"));

const STYLE = "Casual candid photo shot on a smartphone in natural available light. Authentic, unpolished, slightly imperfect framing, everyday realism — real skin with visible pores and subtle imperfections, natural soft shadows. NOT a studio photo, NOT glossy, NOT 3D render, NOT AI-perfect, NOT stock-photo. Documentary and believable.";

const setting = (loc = "") => {
  const l = loc.toLowerCase();
  if (l.includes("pasillo")) return "in the hallway of his home, a plain wall, soft daylight";
  if (l.includes("cocina")) return "in his modest home kitchen, wooden countertop, soft daylight from a window";
  if (l.includes("consultorio") || l.includes("escritorio")) return "in his warm home office, wooden bookshelves and a soft lamp behind him";
  if (l.includes("dormitorio")) return "in his bedroom, soft early-morning light";
  return "in his modest warm home living room, wooden furniture and soft daylight from a window";
};

// prompts del presentador (ref explicita -> endpoint /edits mantiene su cara)
const prompts = A.presenter.map((p) => {
  const name = p.file.replace(/^img\//, "").replace(/\.png$/, "");
  const props = (p.props && p.props.length) ? ` Visible: ${p.props.join(", ")}.` : "";
  const prompt = `The man is the SAME person as the reference photo — EXACT same face, hair, short beard and athletic build, wearing the same light blue button-up shirt. He is ${p.action}, mid-motion, natural, ${setting(p.location)}. Framing: ${p.framing}.${props} ${STYLE} 16:9 horizontal, tack-sharp, absolutely NO text or letters anywhere, only ONE person, natural correct hands.`;
  return {name, prompt, ref: REF};
});
writeFileSync(`_v3/prompts_${SLUG}_presenter.json`, JSON.stringify(prompts, null, 1));

// needstock: stockfallback escribe public/broll/<name>.mp4
const needstock = A.stock.map((s) => ({
  name: s.file.replace(/^broll\//, "").replace(/\.mp4$/, ""),
  concept: s.query, query: s.query, dur: 4,
}));
writeFileSync(`_v3/needstock_${SLUG}.json`, JSON.stringify(needstock, null, 1));

// lista explicita de assets para el farm (rutas relativas a public/)
const lines = [...A.stock.map((s) => s.file), ...A.presenter.map((p) => p.file)];
writeFileSync(`_${SLUG}_assets.txt`, lines.join("\n") + "\n");

console.log(`presenter prompts: ${prompts.length} -> _v3/prompts_${SLUG}_presenter.json`);
console.log(`needstock: ${needstock.length} -> _v3/needstock_${SLUG}.json`);
console.log(`farm assets list: ${lines.length} -> _${SLUG}_assets.txt`);
