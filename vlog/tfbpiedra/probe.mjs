// sale cuando agnes deja de contestar 429 a un POST mínimo (prompt vacío → rechazo de validación, no encola nada)
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync("D:/Proyectos/video2-wt/tfbpiedra/.env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const ks = env.AGNES_KEYS.split(",").map(s => s.trim()); let i = 0;
for (;;) {
  const t = await (await fetch("https://apihub.agnes-ai.com/v1/videos", { method: "POST", headers: { Authorization: "Bearer " + ks[i++ % ks.length], "Content-Type": "application/json" }, body: JSON.stringify({ model: "agnes-video-2.5-flash", size: "720P", aspect_ratio: "16:9", mode: "text", seconds: "4", prompt: "" }) })).text().catch(e => e.message);
  if (!/429|rate exceeds/.test(t)) { console.log(new Date().toISOString(), "LIBRE:", t.slice(0, 160)); process.exit(0); }
  await new Promise(r => setTimeout(r, 120000));
}
