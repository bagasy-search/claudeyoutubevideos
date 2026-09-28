// cada 10 min prueba 3 POST mínimos (prompt vacío: rechazo de validación, no encola). 3 seguidos sin "free users"/429 → max.txt=3 y sale.
import fs from "node:fs";
const V = "D:/Proyectos/video2-wt/tfbpiedra/vlog/tfbpiedra/";
const env = Object.fromEntries(fs.readFileSync("D:/Proyectos/video2-wt/tfbpiedra/.env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const ks = env.AGNES_KEYS.split(",").map(s => s.trim()); let i = 0;
for (;;) {
  let libres = 0, last = "";
  for (let n = 0; n < 3; n++) {
    last = await (await fetch("https://apihub.agnes-ai.com/v1/videos", { method: "POST", headers: { Authorization: "Bearer " + ks[i++ % ks.length], "Content-Type": "application/json" }, body: JSON.stringify({ model: "agnes-video-2.5-flash", size: "720P", aspect_ratio: "16:9", mode: "text", seconds: "4", prompt: "" }) })).text().catch(e => e.message);
    if (!/free users|429|rate exceeds|rate limit/i.test(last)) libres++;
    await new Promise(r => setTimeout(r, 5000));
  }
  fs.appendFileSync(V + "cupo.log", `${new Date().toISOString()} libres ${libres}/3 · ${last.slice(0, 90)}\n`);
  if (libres === 3) { fs.writeFileSync(V + "max.txt", "3"); console.log("CUPO REPUESTO → max 3"); process.exit(0); }
  await new Promise(r => setTimeout(r, 600000));
}
