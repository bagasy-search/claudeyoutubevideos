// seamaudit_agnes.mjs — AUDITOR DE COSTURAS con la visión gratis de agnes.
// Le muestra los dos lados de cada unión (antes / después) y pregunta lo único que importa:
// ¿se lee como una escena que sigue, o como un RESET?
//
//   node scripts/seamaudit_agnes.mjs _v3/mdmold_seams.json
//
// Dos varas distintas según el tipo de costura:
//   · kind "act"  → frontera DENTRO de un movimiento: un reset es un DEFECTO.
//   · kind "edge" → entrada/salida del movimiento: ahí el corte es intencional; sólo se mira que
//                   los dos lados tengan contenido y que no haya quedado un cuadro vacío.
import fs from "node:fs";

const LIST = process.argv[2] || "_v3/mdmold_seams.json";
const env = {};
for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const KS = (env.AGNES_KEYS || env.AGNES_API_KEY || "").split(",").map((s) => s.trim()).filter(Boolean);
const URL_ = (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions";
const MODEL = process.env.AGNES_VISION_MODEL || "agnes-2.5-flash";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uri = (f) => `data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}`;

const P_ACT = `These are two frames from what is supposed to be ONE continuous animated scene, taken 0.7 seconds apart, across a moment where the scene changes what it is showing. A skilled motion designer built it so the change is hidden — by an object crossing, a camera move, a shape turning into another, or a zoom into a detail.
Reply ONLY JSON:
{"reads_continuous":true|false,"reset":"none|background|camera|pop","empty":true|false,"legible":true|false,"why":"<short>"}
reads_continuous = it feels like the same shot continuing, even though the content changed.
reset = "background" if the backdrop clearly restarts or changes colour wholesale, "camera" if the viewpoint jumps to an unrelated position, "pop" if something big appears out of nothing, "none" if the change is carried.
empty = either frame is essentially blank, black, or has nothing to look at.
legible = any text present is big enough and contrasted enough to read comfortably.`;

const P_EDGE = `These are two frames 0.7 seconds apart, across a deliberate cut in a video.
A cut here is FINE and expected — do not complain about the content changing.
Reply ONLY JSON:
{"empty":true|false,"broken":true|false,"legible":true|false,"why":"<short>"}
empty = either frame is essentially blank, black, or has nothing to look at.
broken = a frame is corrupted, smeared, half-rendered, or shows an obviously unfinished element.
legible = any text present is big enough and contrasted enough to read comfortably.`;

const free = KS.map(() => 0);
const pick = async () => {
  for (;;) {
    const now = Date.now(); let b = -1, bt = Infinity;
    for (let i = 0; i < KS.length; i++) if (free[i] < bt) { bt = free[i]; b = i; }
    if (bt <= now) return b;
    await sleep(Math.min(1200, bt - now));
  }
};
const ask = async (prompt, imgs) => {
  for (let a = 0; a < 12; a++) {
    const ki = await pick();
    try {
      const r = await fetch(URL_, {
        method: "POST",
        headers: { Authorization: "Bearer " + KS[ki], "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, temperature: 0, messages: [{ role: "user", content: [
          { type: "text", text: prompt }, ...imgs.map((f) => ({ type: "image_url", image_url: { url: uri(f) } }))] }] }),
      });
      if (r.status === 429) { free[ki] = Date.now() + 20_000; continue; }
      if (!r.ok) { await sleep(1000 * (a + 1)); continue; }
      const d = await r.json();
      const m = (d.choices?.[0]?.message?.content || "").match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
    } catch { await sleep(1000); }
  }
  return null;
};

const pairs = JSON.parse(fs.readFileSync(LIST, "utf8"));
const out = [];
const cola = [...pairs];
const worker = async () => {
  for (;;) {
    const p = cola.shift(); if (!p) return;
    const v = await ask(p.kind === "act" ? P_ACT : P_EDGE, [p.a, p.b]);
    out.push({ ...p, v });
  }
};
await Promise.all(Array.from({ length: 6 }, worker));
out.sort((x, y) => x.t - y.t);
fs.writeFileSync("_v3/mdmold_seamaudit.json", JSON.stringify(out, null, 1));

const bad = [];
for (const o of out) {
  const v = o.v; if (!v) { bad.push([o.name, "sin veredicto"]); continue; }
  if (v.empty) bad.push([o.name, "CUADRO VACÍO"]);
  if (v.broken) bad.push([o.name, "frame roto"]);
  if (o.kind === "act" && v.reads_continuous === false && v.reset && v.reset !== "none") bad.push([o.name, `reset ${v.reset}: ${String(v.why).slice(0, 70)}`]);
  if (v.legible === false) bad.push([o.name, "texto poco legible"]);
}
const cont = out.filter((o) => o.kind === "act" && o.v?.reads_continuous).length;
const acts = out.filter((o) => o.kind === "act").length;
console.log(`\ncosturas ${out.length} · internas que se leen CONTINUAS: ${cont}/${acts}`);
if (!bad.length) console.log("✅ ninguna costura marcada");
else { console.log(`\n⚠ ${bad.length} marcas:`); for (const [n, w] of bad) console.log(`  · ${n} — ${w}`); }
