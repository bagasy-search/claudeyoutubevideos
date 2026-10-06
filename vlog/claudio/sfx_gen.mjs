// Foley del canal con ElevenLabs Sound Effects (una vez por canal; queda en public/sfx/rh_*.mp3). node vlog/claudio/sfx_gen.mjs
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(".env", "utf8").split(/\r?\n/).filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "")]));
const L = [
  ["rh_roomtone", "quiet small home bathroom room tone, faint ventilation fan hum, very soft distant water drip, no music, no voices", 22],
  ["rh_flush", "a home toilet flushing, close, water rushing and swirling then the tank refilling, no music", 6],
  ["rh_scrub", "small stiff brush scrubbing hard porcelain quickly, close up, wet, no music", 4],
  ["rh_glove", "yellow rubber dish glove being pulled on and snapped at the wrist, close up, no music", 2],
  ["rh_pour", "liquid being poured slowly from a glass measuring cup into a narrow plastic pipe inside a toilet tank, close, no music", 4],
];
for (const [n, text, secs] of L) {
  const out = `public/sfx/${n}.mp3`; if (fs.existsSync(out)) { console.log("ya", n); continue; }
  const r = await fetch("https://api.elevenlabs.io/v1/sound-generation", { method: "POST", headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ text, duration_seconds: secs, prompt_influence: 0.5 }), signal: AbortSignal.timeout(120000) });
  if (!r.ok) { console.log("✗", n, r.status, (await r.text()).slice(0, 200)); continue; }
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer())); console.log("✓", n, fs.statSync(out).size);
}
