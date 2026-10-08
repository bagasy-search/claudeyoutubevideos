// Foley de AUTOS/TALLER del canal Claudio Old Mechanic con ElevenLabs Sound Effects (una vez por canal; public/sfx_car/*.mp3).
// sound.mjs resuelve el prefijo "car/" → public/sfx_car/. node vlog/claudio/sfx_car_gen.mjs
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(".env", "utf8").split(/\r?\n/).filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "")]));
const L = [
  ["amb_shop", "quiet small independent auto repair shop room tone, big roll-up door open, faint distant traffic, occasional far ratchet clicks, birds outside, no music, no voices", 22],
  ["amb_driveway", "quiet American suburban driveway on a sunny afternoon, soft birds, a distant lawn mower very far away, light breeze, no music, no voices", 22],
  ["amb_car_interior", "inside a parked car with the doors closed, quiet muffled room tone, faint ticking of a cooling engine, very soft, no music, no voices", 20],
  ["amb_gas_station", "gas station forecourt ambience, a car idling nearby, distant traffic, a fuel pump nozzle clicking, no music, no voices", 20],
  ["car_door_close", "a car door closing with a solid thunk, close, no music", 2],
  ["car_door_open", "a car door handle pulled and the door opening, close, no music", 2],
  ["trunk_pop", "a car trunk latch popping open and the lid lifting on its struts, close, no music", 3],
  ["hood_close", "a car hood being closed firmly, metallic thump, no music", 2],
  ["engine_start", "an older sedan engine starting on the first try and settling into a smooth idle, close, no music", 5],
  ["fob_chirp", "a car key fob lock button press, two short chirps and the door locks clunking, no music", 2],
  ["ratchet", "a mechanic's socket wrench ratchet clicking several times, close, no music", 2],
  ["tire_air", "air hissing into a car tire from a pump, then a tire gauge pressed on the valve with a short hiss, no music", 4],
  ["seat_click", "car seat headrest adjustment ratchet clicking two times, close, no music", 1.5],
  ["glovebox", "a car glove box latch opening and the lid dropping down, plastic, close, no music", 2],
  ["gas_cap", "a car gas cap being twisted shut until it clicks three times, close, no music", 2.5],
  ["turn_signal", "car turn signal indicator ticking inside the car, steady, no music", 4],
  ["obd_beep", "a small handheld electronic device plugged into a socket, a click and two short confirmation beeps, no music", 2],
  ["wiper_rain", "rain on a car windshield with the wipers moving back and forth, from inside the car, no music", 6],
  ["plastic_clip", "a small plastic hook or clip folding down with a click, close, no music", 1.2],
];
for (const [n, text, secs] of L) {
  const out = `public/sfx_car/${n}.mp3`; if (fs.existsSync(out)) { console.log("ya", n); continue; }
  const r = await fetch("https://api.elevenlabs.io/v1/sound-generation", { method: "POST", headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ text, duration_seconds: secs, prompt_influence: 0.5 }), signal: AbortSignal.timeout(120000) });
  if (!r.ok) { console.log("✗", n, r.status, (await r.text()).slice(0, 200)); continue; }
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer())); console.log("✓", n, fs.statSync(out).size);
}
