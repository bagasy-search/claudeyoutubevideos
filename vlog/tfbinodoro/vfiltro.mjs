// filtro GRATIS de anclas con agnes-3.0-flash: identidad, vestuario fijo, objetos colados, luz.
// uso: node vlog/tfbinodoro/vfiltro.mjs S1 S2 ...   → out/vlog/<s>/anc/_vision.json (cachea por mtime) + resumen de sospechosas
import fs from "node:fs";
const W = "D:/Proyectos/video2-wt/tfbinodoro/";
const env = Object.fromEntries(fs.readFileSync(W + ".env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#"))
  .map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const KS = (env.AGNES_KEYS || env.AGNES_KEY || "").split(",").map(s => s.trim()).filter(Boolean); let k = 0;
const uri = f => `data:image/png;base64,` + fs.readFileSync(f).toString("base64");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const Q = (prompt) => `Image 1 is the reference face of the presenter. Image 2 is a photo that was generated from this description: """${prompt.slice(0, 1500)}"""
Check image 2 and answer ONLY JSON:
{"presenter_visible":true/false,"same_person":true/false,"olive_shirt":true/false,"leather_apron":true/false,"stray_objects":"short description of any object or person that does not belong or contradicts the description, or empty","bright":true/false,"notes":"max 12 words"}
olive_shirt = he wears a faded olive-green work shirt; leather_apron = a brown leather apron over it. If the presenter is not visible (hands only), set same_person/olive_shirt/leather_apron to null.`;
async function ask(face, img, prompt) {
  for (let t = 0; t < 3; t++) try {
    const j = await (await fetch("https://apihub.agnes-ai.com/v1/chat/completions", { method: "POST", signal: AbortSignal.timeout(90000),
      headers: { Authorization: "Bearer " + KS[(k++) % KS.length], "Content-Type": "application/json" },
      body: JSON.stringify({ model: "agnes-3.0-flash", messages: [{ role: "user", content: [{ type: "text", text: Q(prompt) },
        { type: "image_url", image_url: { url: uri(face) } }, { type: "image_url", image_url: { url: uri(img) } }] }] }) })).json();
    return JSON.parse(j.choices[0].message.content.replace(/```json|```/g, "").trim());
  } catch (e) { await sleep(3000); }
  return null;
}
const malo = r => !r || r.presenter_visible && (r.same_person === false || r.olive_shirt === false || r.leather_apron === false) || (r.stray_objects || "").trim().length > 2 || r.bright === false;
for (const s of process.argv.slice(2)) {
  const P = JSON.parse(fs.readFileSync(W + `vlog/tfbinodoro/plan_${s}.json`, "utf8")), anc = W + `out/vlog/${s}/anc/`, cf = anc + "_vision.json";
  const C = fs.existsSync(cf) ? JSON.parse(fs.readFileSync(cf, "utf8")) : {};
  const todo = P.anchors.filter(a => fs.existsSync(anc + a.id + ".png") && (!C[a.id] || C[a.id].mt !== fs.statSync(anc + a.id + ".png").mtimeMs));
  for (let i = 0; i < todo.length; i += 4) await Promise.all(todo.slice(i, i + 4).map(async a => {
    const f = anc + a.id + ".png"; C[a.id] = { mt: fs.statSync(f).mtimeMs, r: await ask(W + "public/ref_tfbinodoro_face.png", f, a.prompt) };
  }));
  fs.writeFileSync(cf, JSON.stringify(C, null, 1));
  const sos = Object.entries(C).filter(([, v]) => malo(v.r));
  console.log(`${s}: ${Object.keys(C).length} miradas · ${sos.length} sospechosas`);
  for (const [id, v] of sos) console.log(`  ${s}/${id} ${JSON.stringify(v.r)}`);
}
