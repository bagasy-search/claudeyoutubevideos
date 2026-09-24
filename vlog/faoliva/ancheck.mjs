// filtro de anclas con visión GRATIS agnes-3.0-flash: misma cara, luz clara, sin 2º hombre / objetos raros. Uso: node ancheck.mjs S1
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/faoliva/", V = R + "vlog/faoliva/", S = process.argv[2];
const env = Object.fromEntries(fs.readFileSync(R + ".env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const KS = env.AGNES_KEYS.split(",").map(s => s.trim()).filter(Boolean); let k = 0;
const plan = JSON.parse(fs.readFileSync(V + `plan_${S}.json`, "utf8"));
const det = new Set(plan.clips.filter(c => c.kf).flatMap(c => [c.a, c.b]));
const uri = f => `data:${f.endsWith(".png") ? "image/png" : "image/jpeg"};base64,` + fs.readFileSync(f).toString("base64");
const out = {}; let n = 0;
async function ask(face, img, isDet, hasW) {
  const q = isDet
    ? 'This is a close-up video frame of hands doing a task in a home. Answer ONLY JSON: {"bright":true/false,"ok_anatomy":true/false,"face_visible":true/false,"issues":"short"}. bright = well exposed daylight or bright lamps, not dark/amber. ok_anatomy = hands and fingers look natural, no extra fingers, no floating hands.'
    : `Image 1 is a reference face of a man. Image 2 is a photo. Answer ONLY JSON: {"same_person":true/false,"confidence":0-1,"bright":true/false,"extra_man":true/false,"people_count":N,"issues":"short"}. same_person = the main man in image 2 has the SAME identity as image 1. bright = well exposed, not dark or amber. extra_man = there is a second adult man (or a mirror reflection of a man) in image 2. people_count = number of real people physically present in the room (NOT people in framed photos, pictures or screens)${hasW ? " (an elderly woman is expected too)" : ""}.`;
  for (let t = 0; t < 4; t++) try {
    const j = await (await fetch("https://apihub.agnes-ai.com/v1/chat/completions", { method: "POST", signal: AbortSignal.timeout(60000), headers: { Authorization: "Bearer " + KS[(k++) % KS.length], "Content-Type": "application/json" },
      body: JSON.stringify({ model: "agnes-3.0-flash", messages: [{ role: "user", content: [{ type: "text", text: q }, ...(isDet ? [] : [{ type: "image_url", image_url: { url: uri(face) } }]), { type: "image_url", image_url: { url: uri(img) } }] }] }) })).json();
    return JSON.parse(j.choices[0].message.content.replace(/```json|```/g, "").trim().match(/\{[\s\S]*\}/)[0]);
  } catch (e) { await new Promise(r => setTimeout(r, 3000)); }
  return null;
}
const wIds = new Set(); for (const c of plan.clips) if ((c.refs || []).includes("W")) wIds.add(c.b);
await Promise.all(plan.anchors.map(async (a, i) => {
  await new Promise(r => setTimeout(r, i * 250));
  const p = plan.dir + "/anc/" + a.id + ".png"; if (!fs.existsSync(p)) return;
  const isDet = det.has(a.id), v = await ask(plan.face, p, isDet, wIds.has(a.id)); n++;
  if (!v) { out[a.id] = { bad: false, why: "sin respuesta" }; return; }
  const bad = isDet ? (!v.bright || v.ok_anatomy === false) : (!v.same_person || !v.bright || v.extra_man || (!wIds.has(a.id) && v.people_count > 1));
  out[a.id] = { bad, ...v };
}));
fs.writeFileSync(V + `ancheck_${S}.json`, JSON.stringify(out, null, 1));
const b = Object.entries(out).filter(([, v]) => v.bad);
console.log(`${S}: medidas ${n}/${plan.anchors.length} · marcadas ${b.length}: ` + b.map(([id, v]) => `${id}(${v.issues || v.why || ""}${v.same_person === false ? " NO-ES" : ""}${v.bright === false ? " OSCURA" : ""}${v.extra_man ? " 2ºHOMBRE" : ""})`).join(" | "));
