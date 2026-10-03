// direct.mjs <slug> — DIRECTOR de los videos de Abuela Rosa: un plano por momento, con el CONTEXTO de lo que se dice en ese segundo.
// Entradas: D:/rtmp/<slug>/moments.json · vlog/rosa/<slug>/items.json
// Salida  : D:/rtmp/<slug>/prompts.json = [{i, kind: gpt|rosa|old|web, prompt, query, item, text}]
// kind gpt  = foto generada SIN persona (objeto, comida, cocina) → /generations
//      rosa = foto de Rosa (cara 128x192) → /edits
//      old  = foto de época (años 60-70) con familia → /generations
//      web  = foto/video REAL de la web (Pexels) con la consulta `query`
import fs from "node:fs";
import { WHO, KIT, TAIL, EITAIL, GLOSS, ROSA_ACT, FRAMES, norm } from "./lib.mjs";
const slug = process.argv[2];
const R = `D:/rtmp/${slug}/`;
const REPO = "C:/Users/bauti/Downloads/video2/";
const here = new URL(".", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const cfg = JSON.parse(fs.readFileSync(`${here}${slug}/items.json`, "utf8"));
const moments = JSON.parse(fs.readFileSync(R + "moments.json", "utf8"));

const ratio = { rosa: 0.22, web: 0.30, gpt: 0.38, old: 0.10 };
const count = { rosa: 0, web: 0, gpt: 0, old: 0 };
const OLDRX = /(mi madre|mis hermanos|mi hermana|mis sobrinos|eramos|siete hermanos|mi padre|cuando era|infancia|ninos|niños|mi abuel|antonio)/;
const ROSARX = /\b(yo|me senti|me puse|llore|me quede|me siento|mi cocina|extrano|me acuerdo|me fui|abri|lei|cene|me levanta)\b/;
const pickKind = (m, idxInItem) => {
  const t = norm(m.text);
  const sec = m.item;
  let want;
  if (sec === "hook") want = idxInItem % 3 === 0 ? "rosa" : idxInItem % 3 === 1 ? "gpt" : "old";
  else if (["corazon", "cierre", "interludio", "intro"].includes(sec)) want = OLDRX.test(t) ? "old" : (idxInItem % 2 === 0 ? "rosa" : "gpt");
  else if (OLDRX.test(t) && idxInItem % 2 === 1) want = "old";
  else if (ROSARX.test(t)) want = "rosa";
  else want = ["gpt", "web", "gpt", "web", "rosa", "gpt", "web"][idxInItem % 7];
  // equilibrio global: si un tipo se pasó del cupo, se cambia por el más rezagado
  const total = Math.max(1, Object.values(count).reduce((a, b) => a + b, 0));
  if (total > 30 && count[want] / total > ratio[want] + 0.06) {
    want = Object.keys(ratio).sort((a, b) => count[a] / total - ratio[a] - (count[b] / total - ratio[b]))[0];
  }
  count[want]++;
  return want;
};

const lastFrag = {};
const glossAll = (t) => GLOSS.filter((g) => g[0].test(t));
const gloss = (t) => glossAll(t)[0] ?? null;
const out = [];
const idxIn = {};
for (const m of moments) {
  const t = norm(m.text);
  const it = m.item;
  const k = (idxIn[it] = (idxIn[it] ?? -1) + 1);
  const itNum = /^i(\d+)$/.test(it) ? it.slice(1) : null;
  const dish = itNum ? cfg.items[itNum] : null;
  const kind = pickKind(m, k);
  const gls = glossAll(t);
  // varios ingredientes en una misma frase: manda el plato del ítem (más coherente que quedarse con uno solo)
  const gl = dish && gls.length >= 2 ? null : gls[0] ?? null;
  const frame = FRAMES[(m.i * 7 + k) % FRAMES.length];
  let scene = gl ? gl[1] : dish ? dish.dish : "an ordinary small home kitchen with a worn wooden table, a small enamel pot on the stove and terracotta tiles";
  if (!gl && dish && k % 2 === 1) scene = `${dish.dish}, with the ingredients of the dish laid out beside it on a wooden board`;
  if (lastFrag[kind] === scene) scene = (dish ? dish.dish : scene) + ", " + FRAMES[(m.i * 3) % FRAMES.length];
  lastFrag[kind] = scene;
  let query = gl ? gl[2] : dish ? dish.q : "home cooking pot kitchen";
  let prompt;
  if (kind === "rosa") {
    const act = ROSA_ACT.find((a) => a[0].test(t)) ?? ROSA_ACT[(m.i * 5) % (ROSA_ACT.length - 1)];
    prompt = `${WHO}, in ${KIT}. ${act[1]} Her face is the face of the reference image: same face, same age, not younger, not prettier.` + TAIL;
  } else if (kind === "old") {
    const era = cfg.era ?? [1962, 1975]; const yr = era[0] + ((m.i * 3) % (era[1] - era[0] + 1));
    prompt = `A faded color snapshot photograph taken around ${yr} in a small Latin American town kitchen: a family of children and a mother in an apron around a table, ${gl ? gl[1] : "a big pot of soup steaming on the table"}, children laughing and reaching with spoons, ${frame}.` + EITAIL;
  } else {
    prompt = `Candid phone snapshot of ${scene}, ${frame}.` + TAIL;
  }
  out.push({ i: m.i, kind, prompt, query, item: it, text: m.text, dur: (m.ms_out - m.ms_in) / 1000 });
}
fs.writeFileSync(R + "prompts.json", JSON.stringify(out, null, 1));
const c = {}; for (const o of out) c[o.kind] = (c[o.kind] ?? 0) + 1;
console.log("momentos", out.length, c, "· glosario acertó", out.filter((o) => gloss(norm(o.text))).length);
