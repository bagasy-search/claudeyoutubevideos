// agnes_json_prompt.mjs — EXPANDE prompts cortos a JSON HIPERDETALLADO para agnes-image (gratis, agnes-3.0-flash).
//
//   node scripts/agnes_json_prompt.mjs <lista.json> <salida.json> [--conc 8]
//   lista = [{ name, prompt, ref? }]  →  salida = misma lista con `prompt` = JSON (string) y `prompt_corto` = el original.
//   Después: node scripts/agnes_img.mjs <salida.json> <dir>  →  node scripts/agnes_img_gate.mjs <salida.json> <dir>
//
// Por qué (9-oct-2026, idea del creador): describir una foto REAL en un JSON de ~3.000 caracteres y pasárselo a
// agnes-image-2.5 reprodujo la escena con look de cuadro de video real, sin el "estilo IA lindo". Los prompts
// cortos dejan huecos que agnes rellena embelleciendo. Este script escribe ese JSON por cada plano.
//
// Reglas que el JSON SIEMPRE trae (cada una nació de un defecto medido el 9-oct):
//   · people.count exacto + "nobody else in the frame"  → agnes metía gente que nadie pidió (el plato del desayuno)
//   · "people caught mid-action" SÓLO si hay gente       → la receta de realismo lo pedía en escenas sin personas
//   · body_placement: dónde está cada cuerpo respecto de cada objeto, con el cuerpo ENTERO afuera de los sólidos
//                                                         → Claudio salía de ADENTRO del motor
//   · cada persona con rasgos concretos (piel, edad, pelo) → sin eso agnes elige otra etnia
//   · cero vocabulario de cámara de cine; luz y color mundanos
import fs from "node:fs";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const [LIST, OUT] = args.filter((a, i) => !a.startsWith("--") && !(args[i - 1] || "").startsWith("--"));
if (!LIST || !OUT) { console.error("uso: node scripts/agnes_json_prompt.mjs <lista.json> <salida.json> [--conc 8]"); process.exit(2); }
const CONC = Number(opt("--conc", 8));

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch { }
const KEYS = (process.env.AGNES_KEYS || env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!KEYS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(2); }
const API = (process.env.AGNES_BASE_URL || env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1").replace(/\/$/, "") + "/chat/completions";
const MODEL = process.env.JSON_MODEL || "agnes-3.0-flash";

// Molde: la descripción de una foto REAL que agnes reprodujo bien (abuela con los porotos, 9-oct).
const MOLDE = {
  source: "a single frame grabbed from an ordinary home video, 16:9, filmed from across a kitchen work counter at chest height",
  people: { count: 1, nobody_else: "nobody else in the frame, no other hands, arms or bodies at the edges" },
  subject: {
    who: "a white woman about 78 years old, short thick white-grey hair, curly and a little messy",
    face: "round face, deep wrinkles on the forehead and around the eyes, sagging cheeks, age spots, light olive skin a bit reddish on the cheeks, small closed-mouth smile, eyes looking down at the ladle, no makeup",
    body: "heavy-set, soft arms with loose skin, freckles and sun spots on the forearms",
    clothes: "dark bottle-green short-sleeve cotton t-shirt, a long stained beige canvas apron with brown leather straps",
    action: "her right hand lifts a long steel ladle full of cooked white beans out of a big pot; her left hand holds a fine-mesh strainer over an empty glass jar",
    body_placement: "she stands BEHIND the counter, her whole body outside and behind the pot and the counter; only her hands reach over the pot",
  },
  foreground: "a very large dented aluminium stock pot cut by the bottom edge, full of light brown broth with small white beans; a clear empty glass canning jar; an old worn butcher-block counter with scratches and water rings",
  background: "stainless steel kitchen line on the left with a meat slicer and a toaster oven; cream subway tiles with grey grout; a long wooden shelf crowded with mismatched glass jars of spices; on the right a big window to a sunny backyard with a wooden fence and a grey barbecue grill, the outside slightly overexposed",
  light: "soft daylight from the big window on the right plus flat overhead kitchen light, soft shadows, no dramatic contrast",
  color: "natural slightly warm colours, muted, no saturation boost",
  camera: "everything in focus from the pot to the jars on the shelf, no background blur, a little digital softness and compression like a frame from a 1080p video",
  imperfections: "framing a little off, something cut by the edge; everyday stuff left around, nothing tidy, nothing new; skin with pores, blemishes and uneven tone",
  mood: "calm, homely, an ordinary moment nobody staged",
};

const SYS = `You turn a short scene description into a hyper-detailed JSON description of ONE ordinary frame from a real home video, for an image generator.
Use EXACTLY this structure (same keys), like this example:
${JSON.stringify(MOLDE, null, 1)}

Rules:
- Keep every fact of the short description (who, what they do, where, the objects). Do not add a different story.
- people.count = the exact number of people in the frame. Count EVERY person the short description mentions, even in passing: "talks with a neighbour" = 2 people, "hands a cup to his wife" = 2, "in front of a crowd" = many (describe them). Every one of them must be visible in the frame and described in subject. If the scene has no people, count 0 and write "no people at all, no hands, no arms, no body parts anywhere in the frame", and leave subject empty ("").
  If there is more than one person, subject becomes an array, one entry per person, each with its own distinct face description.
- Objects that are normally held but nobody is mentioned (a flashlight beam, a spray, a phone screen): if there are 0 people, put the object RESTING on a surface and say so ("a switched-on flashlight lying on the floor, its beam pointing under the fridge"). Never leave a held object floating, and never add a hand the description does not ask for. If the description says "a hand", people.count = 1 and only that hand and forearm are in the frame.
- An ANIMAL that is the subject must be fully visible and recognisable, never hidden behind or under furniture.
- body_placement: say where each body is relative to each big object (car, engine, table, wall, counter, bed), always with the whole body OUTSIDE solid objects: "stands beside the front fender, next to the open hood, his whole body outside the car; only his forearms reach over the engine". NEVER write that a torso, chest, waist or upper body is "under the hood", "inside" or "in" a car, engine, oven, cabinet or any object, even if the short description says "leans under the hood": translate that into standing beside it with only the arms reaching in.
- Describe each person with concrete skin tone, age, hair, build, wrinkles, so the generator cannot pick a different ethnicity.
- Describe the place with many concrete, worn, ordinary objects; real materials; mundane light that the place really has.
- REALISM, not a stock photo (measured 9-oct: tidy JSONs gave glossy stock-looking images): people look average and ordinary, never like models — tired eyes, uneven teeth, messy or flattened hair, a few extra kilos, worn and slightly ill-fitting clothes, sweat or dirt where it makes sense; nobody poses or smiles for the picture unless the description says so. Places are lived in and a bit messy: nothing colour-coordinated, no decorative props, cheap mismatched things, cables, stains, clutter on surfaces. Light is uneven: indoors a little dim with a blown-out window, or a single ceiling bulb; outdoors flat overcast or harsh noon sun. "imperfections" must list at least five concrete ones that fit this scene.
- NO film or photo vocabulary: never write cinematic, photorealistic, 8k, bokeh, lens, 35mm, shallow depth of field, golden hour, studio, phone, camera (except in the "camera" key, which only says what is in focus and that it looks like a frame from an ordinary 1080p video).
- If a reference face is used, the subject's face key must say: "his exact face, hair and beard from the reference image", and "who" must NOT describe his hair, beard, eyes or face (only age, skin and build) — the reference decides those. Every OTHER person gets a clearly different face written out (different age, build, hair, skin) plus "a different person, NOT the face from the reference image".
- English. Reply ONLY with the JSON.`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ki = 0;
async function expandir(it) {
  for (let intento = 0; intento < 6; intento++) {
    const key = KEYS[(ki++) % KEYS.length];
    try {
      const r = await fetch(API, {
        method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(120_000),
        body: JSON.stringify({ model: MODEL, temperature: 0.3, messages: [
          { role: "system", content: SYS },
          { role: "user", content: `Short description${it.ref ? " (the main person's face comes from a reference image)" : ""}:\n${it.prompt}` },
        ] }),
      });
      const txt = await r.text();
      if (!r.ok) throw new Error(`${r.status} ${txt.slice(0, 120)}`);
      const m = (JSON.parse(txt).choices?.[0]?.message?.content || "").match(/\{[\s\S]*\}/);
      if (!m) throw new Error("sin JSON");
      const j = JSON.parse(m[0]);
      if (!j.people || !("count" in j.people)) throw new Error("JSON sin people.count");
      return j;
    } catch (e) {
      if (intento === 5) throw e;
      await sleep(3000 * (intento + 1));
    }
  }
}

const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
const out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : [];
const hechos = new Set(out.map((x) => x.name));
const cola = items.filter((it) => !hechos.has(it.name));
let ok = 0, mal = 0;
await Promise.all(Array.from({ length: Math.min(CONC, cola.length) }, async () => {
  while (cola.length) {
    const it = cola.shift();
    try {
      const j = await expandir(it);
      out.push({ ...it, prompt_corto: it.prompt, prompt: JSON.stringify(j) });
      ok++;
      fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
    } catch (e) { mal++; console.log(`✗ ${it.name}: ${String(e.message).slice(0, 120)}`); }
  }
}));
console.log(`MEDIDO: ${ok} expandidos · ${mal} fallidos · ${out.length} en ${OUT}`);
process.exit(mal ? 1 : 0);
