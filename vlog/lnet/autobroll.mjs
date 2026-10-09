// B-roll CONTEXTUAL para los tramos que el director cubrió con una foto genérica de Loretta (gen=1) y búsqueda de stock real
// para las escenas sin cara: el LLM de agnes (gratis) lee las PALABRAS EXACTAS de ese tramo y propone UNA imagen que muestre
// lo que se dice en ese segundo (regla del plano = la frase) + una búsqueda corta de Pexels. No cambia NINGÚN tiempo
// (el avatar ya está pedido con esas ventanas). SLUG=x node vlog/lnet/autobroll.mjs   → reescribe _v3/<slug>_shots.json + listas
import fs from "node:fs";
import { CANAL, VIDEO } from "./canales.mjs";
const R = "D:/Proyectos/video2-wt/lnet/", SLUG = process.env.SLUG, V3 = R + "_v3/" + SLUG + "_";
const J = (f) => JSON.parse(fs.readFileSync(f, "utf8")), WR = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 1));
const env = {}; for (const l of fs.readFileSync(R + ".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); }
const OTHER = new Set((env.AGNES_KEYS_OTRA_PC || "").split(/[\s,;]+/).filter(Boolean));
const KS = (env.AGNES_KEYS || "").split(/[\s,;]+/).filter((k) => k && !OTHER.has(k));
const API = (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions";
const V = VIDEO[SLUG], C = CANAL[V.ch], STOCK_MAX = +process.env.STOCK_MAX || 36;
const SH = J(V3 + "shots.json"), W = J(V3 + "wordms.json");
const words = (s, e) => W.filter((w) => w.s >= s - 0.05 && w.s < e - 0.05).map((w) => w.w).join(" ");
const WHO = "Loretta, an 81-year-old woman with short curly white hair, thin wire-rimmed glasses, a small pearl necklace, a lilac cardigan over a lilac blouse and a faded floral apron with a green trim, old hands with age spots";
const TAIL = " One ordinary frame from a normal home video shot at eye level with a consumer camera, casual slightly imperfect framing. Almost everything in focus, the background readable with ordinary everyday objects. Only the light the place really has, correctly exposed, true-to-life colors, real materials with wear and use. No text, no letters, no labels, no logos.";
const LORP = (sc) => `${WHO}. ${sc.replace(/^Loretta\b\s*/, "")} Her face is the face of the reference image: same face, same age, same glasses, not younger, not prettier.` + TAIL;
const AGN = (sc) => sc.replace(/\.?\s*$/, ".") + " Everything in the picture is in focus. No text, no letters, no labels, no logos anywhere.";
const CTX = { ck: "a church supper cooking channel (pot roast, mashed potatoes, gravy, church basement funeral dinners, Iowa farm kitchen)",
  fo: "a cooking-for-one channel for seniors living alone (small pans, foil packets, small slow cooker, freezer bags, a widow's farmhouse kitchen)",
  cl: "an old-fashioned home cleaning channel (vinegar, baking soda, dish soap, peroxide, a 1950s farmhouse bathroom, laundry room and church fellowship hall)",
  fh: "an old farm channel about keeping bugs and mice out of an Iowa farmhouse and the garden (steel wool, jars, garden, porch, pantry)",
  su: "a gentle Christian faith channel of an old church lady (old Bible, Methodist country church, kitchen table, porch, funeral dinners in the church basement, family photographs)" }[V.ch];
const SYS = `You choose b-roll stills for ${CTX}. The narrator is Loretta, 81, a widow in rural Iowa. For each numbered piece of narration, describe ONE photograph that shows exactly what is being said in those words (not the general topic). Rules:
- Describe only what is seen: concrete objects, materials, wear, the place, where the light comes from, what else is on the table. 25-45 words. No camera, lens, film or photography words.
- No text, signs, labels, brands or logos anywhere. Plain jars and bottles with no writing.
- Avoid faces of other people: prefer hands, objects, rooms, farm and church places. If people are needed, show them from behind or at a distance.
- If the words are about Loretta herself (her feelings, her memories, talking to the viewer), answer type "loretta" and describe what Loretta is doing in her farmhouse (she will be drawn from her photo).
- Otherwise type "object". For type object also give "query": 2-4 plain common English words for a stock video search (e.g. "boiling potatoes pot", "white country church", "hands kneading dough"), and "stock": true if an ordinary stock video would fit, false if it is too specific.
Answer ONLY a JSON array: [{"id":n,"type":"object|loretta","scene":"...","query":"...","stock":true|false}]`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function ask(items) {
  for (let a = 1; a <= 6; a++) {
    try {
      const r = await fetch(API, { method: "POST", signal: AbortSignal.timeout(180000), headers: { "Content-Type": "application/json", Authorization: `Bearer ${KS[(a + items[0].id) % KS.length]}` },
        body: JSON.stringify({ model: "agnes-2.5-flash", temperature: 0.4, messages: [{ role: "system", content: SYS }, { role: "user", content: items.map((x) => `${x.id}. "${x.text}"`).join("\n") }] }) });
      if (!r.ok) { await sleep(3000 * a); continue; }
      const c = (await r.json()).choices?.[0]?.message?.content || ""; const arr = JSON.parse((c.match(/\[[\s\S]*\]/) || ["[]"])[0]);
      if (Array.isArray(arr) && arr.length) return arr;
    } catch { await sleep(3000 * a); }
  }
  return [];
}
// 1) tramos a resolver: fotos genéricas (gen) + escenas agnes explícitas sin stock (sólo búsqueda)
const todo = SH.shots.map((s, i) => ({ s, i })).filter(({ s }) => s.gen || (s.kind === "bi" && !s.q && !s.clip));
const items = todo.map(({ s, i }) => ({ id: i, text: (s.gen ? words(s.start, s.end) : (s.prompt || "").split(" Everything in the picture")[0]).slice(0, 400), gen: !!s.gen }));
const out = {};
for (const B of [10, 5, 2, 1]) {
  const falta = items.filter((x) => !out[x.id]?.scene); if (!falta.length) break;
  const lotes = []; for (let k = 0; k < falta.length; k += B) lotes.push(falta.slice(k, k + B));
  let li = 0; await Promise.all(Array.from({ length: +process.env.AB_CONC || 2 }, async () => { while (li < lotes.length) { const L = lotes[li++]; const res = await ask(L); for (const r of res) if (L.some((x) => x.id === r.id)) out[r.id] = r; process.stdout.write("."); } }));
}
console.log();
let nGen = 0, nLor = 0, nQ = 0;
for (const { s, i } of todo) {
  const r = out[i]; if (!r || !r.scene) continue;
  if (s.gen) {
    if (r.type === "loretta") { s.prompt = LORP(r.scene); nLor++; }
    else { s.kind = "bi"; s.name = s.name.replace(/^g/, "x"); s.prompt = AGN(r.scene); delete s.gen; nGen++; if (r.stock && r.query) { s.q = r.query; nQ++; } }
  } else if (r.stock && r.query) { s.q = r.query; nQ++; }
}
// tope de búsquedas de stock (Pexels 200/h por clave): se quedan las más repartidas a lo largo del video
const withQ = SH.shots.filter((s) => s.q && !s.page);
if (withQ.length > STOCK_MAX) { const keep = new Set(); const step = withQ.length / STOCK_MAX; for (let k = 0; k < STOCK_MAX; k++) keep.add(withQ[Math.floor(k * step)]); for (const s of withQ) if (!keep.has(s)) delete s.q; }
WR(V3 + "shots.json", SH);
// listas de imágenes (una por nombre)
const lor = [], agn = [], i2v = [], seen = new Set();
for (const s of SH.shots) {
  if (!s.prompt || seen.has(s.name)) continue; seen.add(s.name);
  if (s.kind === "lor") lor.push({ name: s.name, prompt: s.prompt, ref: "public/ref_lor_face.png" }); else agn.push({ name: s.name, prompt: s.prompt });
  if (s.clip) i2v.push({ nombre: s.name, motion: s.motion, ...(s.person ? { person: true } : {}) });
}
WR(V3 + "lor.json", lor); WR(V3 + "agn.json", agn); WR(V3 + "i2v.json", i2v);
const gl = SH.shots.filter((s) => s.gen).reduce((a, s) => a + s.dur, 0);
console.log(`${SLUG}: respuestas ${Object.keys(out).length}/${items.length} · genéricas→escena ${nGen} · Loretta contextual ${nLor} · búsquedas stock ${SH.shots.filter((s) => s.q).length} · Loretta genérica restante ${gl.toFixed(0)} s · imágenes: cara ${lor.length} · agnes ${agn.length} · clips ${i2v.length}`);
