// llm.mjs — lo creativo con un modelo BARATO (Qwen/DeepSeek vía API compatible OpenAI) en vez de Claude.
// Experimento E1 (PLAN_FABRICA §4): ¿un modelo de US$0,16/M llena la dirección y pasa las compuertas?
//
//   node factory/tools/llm.mjs guion  <slug> --tema "<tema>" [--seg 180]   → escribe el guion en spec.guion
//   node factory/tools/llm.mjs direct <slug> [--intentos 3]                → DIRECTOR_PROMPT.md → dir_A.json…
//   node factory/tools/llm.mjs meta   <slug>                               → public/<slug>_meta.json (90_deliver lo exige)
//
// `direct` corre 30_direct, y si la compuerta falla le devuelve los errores al modelo (sólo de su tramo).
// Mide y loguea tokens y US$ de cada llamada: el número es lo que decide si esto sirve.
// Env: LLM_BASE (default AIHubMix) · LLM_KEY (default AIHUBMIX_KEY) · LLM_MODEL (default qwen3.8-flash)
//      LLM_USD_IN / LLM_USD_OUT por millón (default 0,16 / 0,47, precio OpenRouter de qwen3.8-flash).
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { env, ROOT } from "../lib/env.mjs";
import { loadSpec } from "../lib/spec.mjs";
import { slugPaths } from "../lib/paths.mjs";

const BASE = env("LLM_BASE") || "https://aihubmix.com/v1";
const KEY = env("LLM_KEY") || env("AIHUBMIX_KEY");
const MODEL = env("LLM_MODEL") || "qwen3.8-flash";
const USD_IN = Number(env("LLM_USD_IN") || 0.16), USD_OUT = Number(env("LLM_USD_OUT") || 0.47);
const tot = { in: 0, out: 0, llamadas: 0, seg: 0 };

// Va por `curl` y no por fetch: undici corta a los 300 s sin cabeceras/sin bytes, y un modelo que
// razona puede pasar más tiempo callado. Sin límite de tiempo salvo LLM_TIMEOUT_S. La clave viaja por
// variable de entorno (--expand-header), nunca en la línea de comandos.
function curlStream(body, onLine) {
  return new Promise((ok, mal) => {
    const lim = Number(env("LLM_TIMEOUT_S") || 0);
    const p = spawn("curl", ["-sS", "-N", "--fail-with-body", ...(lim ? ["--max-time", String(lim)] : []), "--variable", "%LLM_CURL_KEY",
      "--expand-header", "Authorization: Bearer {{LLM_CURL_KEY}}", "-H", "content-type: application/json",
      "--data-binary", "@-", `${BASE}/chat/completions`], { env: { ...process.env, LLM_CURL_KEY: KEY } });
    let buf = "", err = "";
    let cortado = false;
    p.stdout.on("data", (d) => { buf += d; let nl; while (!cortado && (nl = buf.indexOf("\n")) >= 0) { if (onLine(buf.slice(0, nl).trim()) === false) { cortado = true; p.kill(); } buf = buf.slice(nl + 1); } });
    p.stderr.on("data", (d) => { err += d; });
    p.on("close", (code) => { if (cortado) return mal(new Error("TOPE_USD: llamada cortada para no pasar el presupuesto")); if (buf.trim()) onLine(buf.trim()); code === 0 ? ok() : mal(new Error(`curl ${code}: ${err.trim().slice(0, 300)}`)); });
    p.stdin.end(JSON.stringify(body));
  });
}

async function chat(messages, { json = false, maxTokens = 32000 } = {}) {
  if (!KEY) throw new Error("falta LLM_KEY / AIHUBMIX_KEY en .env");
  const t0 = Date.now();
  // ⛔ Medido 05-oct (hl20qwen): el tope se miraba DESPUÉS de cada ronda y una sola ronda razonando
  //    gastó US$ 2,57 sobre un tope de 2. Ahora se estima ANTES (entrada) y se corta DURANTE (salida).
  const tope = Number(env("LLM_TOPE_USD") || 0);
  const gastado = () => (tot.in * USD_IN + tot.out * USD_OUT) / 1e6;
  const inEst = Math.ceil(JSON.stringify(messages).length / 3.5);
  if (tope && gastado() + (inEst * USD_IN) / 1e6 > tope) throw new Error(`TOPE_USD: no alcanza el presupuesto (US$ ${tope}) ni para leer el pedido`);
  for (let i = 0; i < 4; i++) {
    let txt = "", u = {}, razona = 0, ultimo = Date.now(), errApi = "";
    const caro = () => tope && gastado() + (inEst * USD_IN + ((txt.length + razona) / 3.5) * USD_OUT) / 1e6 > tope;
    try {
      await curlStream({ model: MODEL, messages, max_tokens: maxTokens, temperature: 0.7, stream: true, stream_options: { include_usage: true },
        ...(env("LLM_THINK") === "0" ? { enable_thinking: false } : {}), ...(json ? { response_format: { type: "json_object" } } : {}) }, (l) => {
        if (l.startsWith("{")) { errApi += l; return; }   // error de la API (no SSE)
        if (!l.startsWith("data:") || l === "data: [DONE]") return;
        const j = JSON.parse(l.slice(5));
        txt += j.choices?.[0]?.delta?.content || "";
        razona += (j.choices?.[0]?.delta?.reasoning_content || "").length;
        if (j.usage) u = j.usage;
        if (caro()) return false;   // corta la llamada: lo que sigue ya no entra en el presupuesto
        if (Date.now() - ultimo > 60_000) { ultimo = Date.now(); console.log(`   … ${((Date.now() - t0) / 1000).toFixed(0)} s: razonó ${razona} car., respondió ${txt.length} car.`); }
      });
      tot.in += u.prompt_tokens || 0; tot.out += u.completion_tokens || 0; tot.llamadas++; tot.seg += (Date.now() - t0) / 1000;
      console.log(`   llm ${MODEL}: ${u.prompt_tokens} in / ${u.completion_tokens} out · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
      return txt;
    } catch (e) {
      if (/TOPE_USD/.test(e.message)) {
        const outEst = Math.ceil((txt.length + razona) / 3.5);
        tot.in += inEst; tot.out += outEst; tot.llamadas++;
        console.log(`   llm ${MODEL}: ${inEst} in / ${outEst} out · cortada por TOPE_USD (estimado)`);
        throw e;
      }
      if (/insufficient|invalid.*key|40[13]/i.test(errApi + e.message) || i === 3) throw new Error(`${e.message} ${errApi.slice(0, 300)}`);
      console.log(`   llm: ${e.message} ${errApi.slice(0, 200)} → reintento`);
      await new Promise((s) => setTimeout(s, 2000 * 2 ** i));
    }
  }
  throw new Error("el modelo no respondió tras 4 intentos");
}

const costo = () => `${tot.llamadas} llamadas · ${tot.in} in / ${tot.out} out · ${tot.seg.toFixed(0)} s · US$ ${((tot.in * USD_IN + tot.out * USD_OUT) / 1e6).toFixed(4)}`;

function sacarJson(txt) {
  const s = txt.replace(/^[\s\S]*?```(?:json)?\s*/i, (m) => (/```/.test(m) ? "" : m)).replace(/```[\s\S]*$/, "");
  const a = s.indexOf("["), o = s.indexOf("{");
  const ini = a >= 0 && (o < 0 || a < o) ? a : o;
  const v = JSON.parse(s.slice(ini, Math.max(s.lastIndexOf("]"), s.lastIndexOf("}")) + 1));
  return Array.isArray(v) ? v : v.planos || v.plans || v.shots || Object.values(v).find(Array.isArray) || [];
}

// ⛔ Medido 05-oct (hlcasas): deepseek-v4-pro escribe ~13k car. por llamada pida lo que se le pida (objetivo
//    15,4k → 13,4k; objetivo 17k → 12,8k: MENOS). Un guion largo se escribe en PARTES de ≤ 7k car., cada una
//    viendo lo anterior: la 1ª abre con el gancho, sólo la última cierra con la CTA.
async function guion(slug, { tema, seg }) {
  const spec = loadSpec(slug);
  const chars = Math.round(seg * (spec.style.frases?.cps || 14));
  const n = Math.max(1, Math.ceil(chars / 7000)), porParte = Math.round(chars / n);
  const sys = { role: "system", content: `You write YouTube voice-over scripts for the channel "${spec.style.nombre}". Dialect/voice rules: ${spec.style.dialecto}` };
  const reglas = "Plain spoken text ONLY: no headings, no stage directions, no brackets, no emojis, no lists with symbols. Concrete, practical, specific details a viewer can act on today. Do not mention prices of any product of the channel, links or anything free.";
  const cta = `Near the end include, word for word, a sentence that starts with "${spec.cta.ancla}" and invites to subscribe.`;
  // ⛔ (05-oct, hlcasas) el largo por parte varía 1,3-2,2× lo pedido: se acepta [0,9-1,3]× el objetivo y si no,
  //    se reescribe entero (≤ 4 intentos, ~US$0,007 c/u) quedándose con el más cercano.
  let mejor = "";
  for (let intento = 1; intento <= 4; intento++) {
  let txt = "";
  for (let i = 0; i < n; i++) {
    const ultima = i === n - 1;
    const pide = n === 1
      ? [`Write the full spoken script for a video about: ${tema}`, `Length: about ${chars} characters (~${seg} seconds read aloud). ${reglas}`, "Open with a strong hook in the first two sentences.", cta]
      : [`We are writing, in ${n} parts, the spoken script (~${chars} characters in total, ~${seg} seconds read aloud) for a video about: ${tema}`,
        i === 0 ? "Write PART 1: open with a strong hook in the first two sentences." : `Here is everything written so far:\n"""\n${txt}\n"""\nWrite PART ${i + 1}: continue seamlessly right where it stops, with NEW material (never repeat a story, tip or sentence already told).`,
        `This part: about ${porParte} characters. ${reglas}`,
        ultima ? `This is the LAST part: wrap the video up. ${cta}` : "Do NOT wrap up, summarize, say goodbye or invite to subscribe in this part: the video goes on after it. Output only the text of this part."];
    const parte = await chat([sys, { role: "user", content: pide.join("\n") }], { maxTokens: Math.ceil(porParte / 3) * 2 + 8000 });   // 20 min ≈ 16k car.: el tope fijo de 4000 lo cortaba
    txt = (txt ? txt + "\n\n" : "") + parte.trim();
    if (n > 1) console.log(`   parte ${i + 1}/${n}: ${parte.trim().length} car.`);
  }
  const r = txt.length / chars;
  console.log(`   intento ${intento}: ${txt.length} car. (${(r * 100).toFixed(0)} % del objetivo)`);
  if (!mejor || Math.abs(Math.log(txt.length / chars)) < Math.abs(Math.log(mejor.length / chars))) mejor = txt;
  if (r >= 0.9 && r <= 1.3) break;
  }
  const txt = mejor;
  fs.mkdirSync(path.dirname(spec.guion), { recursive: true });
  fs.writeFileSync(spec.guion, txt.trim() + "\n");
  console.log(`guion → ${spec.guion} (${txt.trim().length} car., objetivo ${chars}) · ${costo()}`);
}

// meta de YouTube para 90_deliver: el título es el de la tarjeta (spec.titulo); el modelo escribe descripción y tags.
async function meta(slug) {
  const spec = loadSpec(slug);
  const g = fs.readFileSync(spec.guion, "utf8");
  const txt = await chat([
    { role: "system", content: `You write YouTube descriptions for the channel "${spec.style.nombre}". Dialect/voice rules: ${spec.style.dialecto}` },
    { role: "user", content: [
      `Video title: ${spec.titulo}`, "Full voice-over script:", g, "",
      'Return ONLY a JSON object {"description": "...", "tags": ["..."]}.',
      "description: 3 short paragraphs in the same voice as the script (hook, what the viewer learns, invite to subscribe). No links, no prices, never promise anything free, no hashtags spam (max 3 at the end).",
      "tags: 10-15 search phrases, lowercase.",
    ].join("\n") },
  ], { json: true, maxTokens: 4000 });
  const j = JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1));
  if (!j.description) throw new Error("el modelo no devolvió description");
  const out = slugPaths(slug).meta;
  fs.writeFileSync(out, JSON.stringify({ title: spec.titulo, description: j.description, tags: j.tags || [] }, null, 1));
  console.log(`meta → ${out} · ${costo()}`);
}

function correr30(slug) {
  const r = spawnSync(process.execPath, [path.join(ROOT, "factory", "run.mjs"), "run", slug, "--from", "30_direct", "--hasta", "30_direct"], { encoding: "utf8", env: process.env });
  return { code: r.status, log: (r.stdout || "") + (r.stderr || "") };
}

// Un GATE crudo ("avatarPctMomentos: midió=3 (min 10)") no le dice al modelo QUÉ cambiar: medido con
// deepseek-v4-pro, devolvió la MISMA dirección dos veces. Se traduce a una orden concreta.
function traducir(e) {
  // ⛔ (05-oct, hlcasas) un 0 sale con OTRO formato ("<gate>: midió 0 — sin allowZero …") y llegaba crudo al
  //    director, que no tenía cómo entenderlo: se quedó sin avatar y frenó la corrida. Mismos topes que 30_direct.
  const cero = e.match(/(\w+): midió=?\s?0 (?:⛔ \(0 sin allowZero|— sin allowZero)/);
  const m = cero ? [null, cero[1], "0", ...({ avatarPctMomentos: ["10", "45"] }[cero[1]] || ["?", "?"])]
    : e.match(/GATE (\w+): midió=([\d.]+) \((?:min ([\d.]+))?(?: · )?(?:max ([\d.]+))?/);
  if (!m) return e;
  const [, g, v, min, max] = m;
  const H = {
    avatarPctMomentos: () => Number(v) < Number(min)
      ? `El avatar (presentador hablando a cámara) aparece en ${v} % de los momentos y tiene que estar entre ${min} y ${max} %. Convertí más momentos en planos de avatar: {"n":"pNNN","t":"avatar","m":"..."} (sin s/mo/q/st/k que lo tape), REPARTIDOS a lo largo del video (no seguidos), sobre todo en frases de opinión, advertencia o consejo directo al espectador.`
      : `El avatar aparece en ${v} % de los momentos (máximo ${max} %). Pasá algunos planos avatar a imagen.`,
    animadoPct: () => `${v} % de los planos de imagen se animan (máximo ${max}). Poné "q":1 (foto quieta, sin mo) a más planos.`,
    rachaMaxLugar: () => `Hay ${v} planos seguidos en el mismo lugar "l" (máximo ${max}). Alterná lugares.`,
    frasesLargasSinSegundoPlano: () => `Hay ${v} frases de más de 7 s sin segundo plano "pNNNx". Agregales uno.`,
  };
  return H[g] ? `${H[g]()} (${e.trim()})` : e;
}

async function direct(slug, { intentos, seguir = false, extra = [] }) {
  const P = slugPaths(slug);
  const pf = path.join(P.dirDir, "DIRECTOR_PROMPT.md");
  if (!fs.existsSync(pf)) throw new Error(`no existe ${pf}: corré antes run ${slug} --hasta 30_direct`);
  const prompt = fs.readFileSync(pf, "utf8");
  const [cabeza, tabla] = prompt.split("## Momentos");
  const filas = tabla.split("\n").filter((l) => /^\| p\d{3} /.test(l));
  const TR = 60, tramos = [];
  for (let i = 0; i < filas.length; i += TR) tramos.push(filas.slice(i, i + TR));
  const sys = { role: "system", content: "You are the film DIRECTOR of a YouTube video factory. You answer ONLY with a JSON object {\"planos\": [...]} following the rules and format exactly. No prose." };
  const pedir = (k, extra = []) => [sys, { role: "user", content: [cabeza, "## Momentos de ESTE tramo (escribí TODOS, en orden, con sus segundos planos `x` cuando correspondan)", "| n | sec | dur s | dice |", "|---|---|---|---|", ...tramos[k], "", ...extra].join("\n") }];

  const letra = (k) => String.fromCharCode(65 + k);
  if (!seguir) {
    for (const f of fs.readdirSync(P.dirDir).filter((f) => /^dir_[A-Z]+\.json$/.test(f))) fs.unlinkSync(path.join(P.dirDir, f));
    await Promise.all(tramos.map(async (_, k) => {
      const planos = sacarJson(await chat(pedir(k), { json: true }));
      fs.writeFileSync(path.join(P.dirDir, `dir_${letra(k)}.json`), JSON.stringify(planos, null, 1));
      console.log(`   dir_${letra(k)}.json: ${planos.length} planos para ${tramos[k].length} momentos`);
    }));
  }

  // ⛔ (05-oct, hlcasas) un tramo puede devolver planos de OTRO tramo (el B metió un "p000" por la regla de
  //    apertura) y la compuerta lo rechaza como "repetido": cada tramo se queda sólo con SUS momentos (y sus x).
  const nombres = (k) => new Set(tramos[k].map((l) => l.split("|")[1].trim()));
  const sanear = () => tramos.forEach((_, k) => {
    const f = path.join(P.dirDir, `dir_${letra(k)}.json`);
    if (!fs.existsSync(f)) return;
    const planos = JSON.parse(fs.readFileSync(f, "utf8")), mios = nombres(k);
    const quedan = planos.filter((x) => mios.has(String(x.n || "").replace(/x+$/, "")));
    if (quedan.length < planos.length) { console.log(`   dir_${letra(k)}: saco ${planos.length - quedan.length} planos de otro tramo (${planos.filter((x) => !quedan.includes(x)).map((x) => x.n).join(", ")})`); fs.writeFileSync(f, JSON.stringify(quedan, null, 1)); }
  });
  for (let n = 1; n <= intentos; n++) {
    sanear();
    const r = correr30(slug);
    // `extra`: errores de fases POSTERIORES (p. ej. 60_build) que el piloto automático le devuelve al
    // director. Cuentan en la PRIMERA vuelta aunque 30_direct pase.
    const errores = [...(n === 1 ? extra : []), ...r.log.split("\n").filter((l) => /⛔|GATE|Error|falló|sin segundo plano/.test(l) && !/✓\s*$/.test(l))];   // una compuerta que PASÓ no es un error
    console.log(`── 30_direct intento ${n}: exit ${r.code}\n${errores.slice(0, 25).join("\n")}`);
    // El exit es el del VIDEO entero (puede fallar 10_voice sin Fish): decide la línea de 30_direct.
    if (/30_direct ✓ hecha/.test(r.log) && !(n === 1 && extra.length)) { console.log(`✅ la dirección de ${MODEL} pasó TODAS las compuertas · ${costo()}`); return; }
    if (n === intentos) break;
    // Devuelve a cada tramo sus errores (los que nombran sus pNNN) + los globales.
    await Promise.all(tramos.map(async (_, k) => {
      const mios = errores.filter((e) => [...nombres(k)].some((nm) => e.includes(nm)));
      const globales = errores.filter((e) => !/p\d{3}/.test(e)).map(traducir);
      if (!mios.length && !globales.length) return;
      const actual = fs.readFileSync(path.join(P.dirDir, `dir_${letra(k)}.json`), "utf8");
      const planos = sacarJson(await chat(pedir(k, ["## Tu versión anterior", "```json", actual, "```",
        "## La compuerta la RECHAZÓ por esto. Corregí SÓLO lo necesario y devolvé el tramo COMPLETO:", ...mios, ...globales]), { json: true }));
      fs.writeFileSync(path.join(P.dirDir, `dir_${letra(k)}.json`), JSON.stringify(planos, null, 1));
    }));
  }
  console.log(`⛔ no pasó tras ${intentos} intentos · ${costo()}`); process.exitCode = 1;
}

const [cmd, slug, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf(`--${k}`); return i >= 0 ? rest[i + 1] : d; };
if (cmd === "guion") await guion(slug, { tema: opt("tema"), seg: Number(opt("seg", 180)) });
else if (cmd === "meta") await meta(slug);
else if (cmd === "direct") await direct(slug, { intentos: Number(opt("intentos", 3)), seguir: rest.includes("--seguir"), extra: rest.filter((_, i) => rest[i - 1] === "--extra") });
else { console.log("uso: llm.mjs guion <slug> --tema \"…\" [--seg 180] | llm.mjs direct <slug> [--intentos 3] [--seguir] [--extra \"error\"]… | llm.mjs meta <slug>"); process.exitCode = 2; }
