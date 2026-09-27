import fs from "node:fs"; import { execFileSync } from "node:child_process";
const env = Object.fromEntries(fs.readFileSync("D:/Proyectos/video2-wt/tfbpiedra/.env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const q = process.argv[2];
for (const f of process.argv.slice(3)) {
  const mp3 = "D:/rtmp/_desc.mp3"; execFileSync("ffmpeg", ["-v", "error", "-y", "-i", f, "-t", "40", "-ac", "1", "-b:a", "64k", mp3]);
  const r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-audio-1.5", modalities: ["text"], messages: [{ role: "user", content: [{ type: "text", text: q }, { type: "input_audio", input_audio: { data: fs.readFileSync(mp3).toString("base64"), format: "mp3" } }] }] }) });
  const j = await r.json(); console.log(f, "→", j.choices?.[0]?.message?.content || JSON.stringify(j).slice(0, 200));
}
