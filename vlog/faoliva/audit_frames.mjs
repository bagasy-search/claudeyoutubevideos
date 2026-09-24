// AUDITOR: un cuadro cada N s de un mp4 → agnes-3.0-flash (identidad vs cara, luz, 2º hombre). Uso: node audit_frames.mjs <mp4> <cada_s> <tag>
import fs from "node:fs"; import { execFileSync } from "node:child_process";
const [mp4, every = "20", tag = "a"] = process.argv.slice(2);
const R = "D:/Proyectos/video2-wt/faoliva/", O = `D:/rtmp/fo_audit_${tag}/`; fs.mkdirSync(O, { recursive: true });
const env = Object.fromEntries(fs.readFileSync(R + ".env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const KS = env.AGNES_KEYS.split(",").map(s => s.trim()).filter(Boolean); let k = 0;
const D = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]).toString());
const ts = []; for (let t = 1; t < D - 0.5; t += Number(every)) ts.push(t);
const face = "data:image/png;base64," + fs.readFileSync(R + "public/ref_faoliva_facecrop.png").toString("base64");
const q = 'Image 1 is a reference face of a man. Image 2 is a video frame. Answer ONLY JSON: {"presenter_visible":true/false,"same_person":true/false,"bright":true/false,"extra_man":true/false,"issues":"short"}. presenter_visible = the face of a man is clearly visible (false for close-ups of hands or objects). same_person = if visible, he is the same man as image 1. bright = well exposed, not dark, not amber. extra_man = a second adult man or a mirror reflection of a man.';
const res = [];
await Promise.all(ts.map(async (t, i) => {
  await new Promise(r => setTimeout(r, i * 200));
  const f = O + `t${String(Math.round(t)).padStart(5, "0")}.jpg`;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(t), "-i", mp4, "-frames:v", "1", "-vf", "scale=768:-2", f]);
  let v = null;
  for (let a = 0; a < 4 && !v; a++) try {
    const j = await (await fetch("https://apihub.agnes-ai.com/v1/chat/completions", { method: "POST", signal: AbortSignal.timeout(60000), headers: { Authorization: "Bearer " + KS[(k++) % KS.length], "Content-Type": "application/json" },
      body: JSON.stringify({ model: "agnes-3.0-flash", messages: [{ role: "user", content: [{ type: "text", text: q }, { type: "image_url", image_url: { url: face } }, { type: "image_url", image_url: { url: "data:image/jpeg;base64," + fs.readFileSync(f).toString("base64") } }] }] }) })).json();
    v = JSON.parse(j.choices[0].message.content.replace(/```json|```/g, "").match(/\{[\s\S]*\}/)[0]);
  } catch { await new Promise(r => setTimeout(r, 3000)); }
  res.push({ t, f, v });
}));
res.sort((a, b) => a.t - b.t);
const bad = res.filter(r => !r.v || (r.v.presenter_visible && r.v.same_person === false) || r.v.bright === false || r.v.extra_man);
fs.writeFileSync(O + "audit.json", JSON.stringify(res, null, 1));
console.log(`${tag}: MEDIDOS ${res.filter(r => r.v).length}/${ts.length} cuadros · marcados ${bad.length}: ` + bad.map(r => `${r.t.toFixed(0)}s(${r.v ? r.v.issues : "sin respuesta"}${r.v && r.v.same_person === false ? " NO-ES" : ""}${r.v && r.v.bright === false ? " OSCURO" : ""}${r.v && r.v.extra_man ? " 2ºHOMBRE" : ""})`).join(" | "));
