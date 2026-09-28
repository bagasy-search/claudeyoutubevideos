// oir.mjs <wav>... — gpt-audio-1.5 escucha y devuelve acento/expresividad (control positivo: la ref)
import fs from "node:fs"; import { execFileSync as _efs } from "node:child_process"; const execFileSync = (c, a, o) => _efs(c, a, { windowsHide: true, ...(o || {}) });
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
for (const f of process.argv.slice(2)) {
  const mp3 = f + ".oir.mp3"; execFileSync("ffmpeg", ["-v", "error", "-y", "-i", f, "-t", "40", "-ac", "1", "-b:a", "64k", mp3]);
  const r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-audio-1.5", modalities: ["text"], messages: [{ role: "user", content: [
      { type: "text", text: 'Describe this music bed. Answer ONLY JSON: {\"genre\":\"\",\"mood\":\"\",\"instruments\":\"\",\"energy\":1-10,\"fits_upbeat_diy_workshop_youtube_video\":true/false,\"has_vocals\":true/false}' },
      { type: "input_audio", input_audio: { data: fs.readFileSync(mp3).toString("base64"), format: "mp3" } }] }] }) });
  const j = await r.json(); console.log(f.split(/[\/]/).pop(), j.choices?.[0]?.message?.content || JSON.stringify(j).slice(0, 300));
}
