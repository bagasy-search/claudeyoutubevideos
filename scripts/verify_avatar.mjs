// verify_avatar.mjs — GATE del avatar de HeyGen. Atrapa las 2 fallas que el creador marcó (28/07):
//   (1) AVATAR ESTÁTICO (look equivocado o payload a mano → el presentador no se mueve)
//   (2) VOZ NO-V3 (payload a mano perdió voice_settings → ElevenLabs lee los tags en voz alta)
// Corre DESPUÉS de bajar el avatar, ANTES de gastar en el build/render. No depende de que el agente
// haya usado bien el script: mide el RESULTADO (el mp4 y la transcripción), no el payload.
//
//   node scripts/verify_avatar.mjs <slug>
//   Salida: PASS / FAIL con los números. Exit 0 = ok · 3 = estático · 4 = voz · 5 = falta el archivo.
//   Umbrales tuneables por env: AVATAR_MOTION_MIN (def 0.8) · AVATAR_FREEZE_MAX_PCT (def 40)
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const slug = process.argv[2];
if (!slug) { console.error("uso: node scripts/verify_avatar.mjs <slug>"); process.exit(2); }
const R = process.cwd();
const mp4 = [join(R, "public", `avatar_${slug}.mp4`), join(R, "public", `avatar_${slug}_opt.mp4`)].find(existsSync);
if (!mp4) { console.error(`✗ no encuentro public/avatar_${slug}.mp4`); process.exit(5); }

const MOTION_MIN = +(process.env.AVATAR_MOTION_MIN || 0.8);   // energía media de movimiento mínima
const FREEZE_MAX = +(process.env.AVATAR_FREEZE_MAX_PCT || 40); // % máx de video congelado

const ff = (args) => { try { return execFileSync("ffmpeg", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 << 20 }); } catch (e) { return (e.stdout || "") + (e.stderr || ""); } };

// duración
let dur = 0;
try { dur = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4], { encoding: "utf8" }).trim()) || 0; } catch {}

// ── 1. MOVIMIENTO: diferencia entre cuadros (a 4 fps para ir rápido). YAVG alto = mucho movimiento.
// Un presentador que gesticula/mueve la cabeza da YAVG alto; uno congelado o casi-foto, ~0.
const motRaw = ff(["-i", mp4, "-vf", "fps=4,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-", "-an", "-f", "null", "-"]);
const yavgs = [...motRaw.matchAll(/YAVG=([\d.]+)/g)].map((m) => +m[1]).filter((n) => !isNaN(n));
const motion = yavgs.length ? yavgs.reduce((a, b) => a + b, 0) / yavgs.length : 0;

// ── 2. CONGELADO: segmentos donde el cuadro no cambia nada (freezedetect).
const frzRaw = ff(["-i", mp4, "-vf", "freezedetect=n=-50dB:d=2", "-map", "0:v", "-an", "-f", "null", "-"]);
const frozen = [...frzRaw.matchAll(/freeze_duration:\s*([\d.]+)/g)].reduce((a, m) => a + (+m[1] || 0), 0);
const freezePct = dur ? (100 * frozen / dur) : 0;

// ── 3. VOZ V3: se chequea la TRANSCRIPCIÓN DE WHISPER (lo que el avatar DIJO), NUNCA el guion —
// el guion tiene los tags escritos a propósito ([clears throat] es un tag v3 VÁLIDO que la voz
// EJECUTA como sonido). Si en la transcripción del audio aparecen esas palabras, la voz las LEYÓ
// en voz alta = no fue eleven_v3. La verdad del audio son los captions, no ningún .txt de guion.
const capf = join(R, "public", `captions_${slug}.json`);
let vozLeeTags = false, vozDetalle = "sin captions de whisper para chequear (corré la transcripción primero)";
if (existsSync(capf)) {
  let cap = null; try { cap = JSON.parse(readFileSync(capf, "utf8")); } catch {}
  const segs = Array.isArray(cap) ? cap : Array.isArray(cap?.segments) ? cap.segments : [];
  const dicho = segs.map((s) => s.text || s.word || "").join(" ");
  const m = dicho.match(/corchete|clears throat|chuckles|whispers|sighs|brackets/i);
  vozLeeTags = !!m; vozDetalle = m ? `whisper transcribió "${m[0].trim()}" = la voz lo LEYÓ = NO v3` : "limpia (v3 ejecutó los tags, no los dijo)";
}

const estatico = motion < MOTION_MIN || freezePct > FREEZE_MAX;
console.log(`\nAVATAR · ${slug}   (${(dur / 60).toFixed(1)} min)`);
console.log(`  movimiento (YAVG)   ${motion.toFixed(2)}   (mín ${MOTION_MIN})   ${motion < MOTION_MIN ? "✗ CASI QUIETO" : "✓"}`);
console.log(`  congelado           ${freezePct.toFixed(0)}%      (máx ${FREEZE_MAX}%)   ${freezePct > FREEZE_MAX ? "✗ MUCHO FREEZE" : "✓"}`);
console.log(`  voz v3              ${vozDetalle}   ${vozLeeTags ? "✗" : "✓"}`);

if (estatico) { console.log(`\n⛔ AVATAR ESTÁTICO — regenerá con el look correcto vía heygen_plan.mjs (NO armes el payload a mano).\n`); process.exit(3); }
if (vozLeeTags) { console.log(`\n⛔ VOZ NO-V3 — el payload perdió voice_settings.model=eleven_v3. Regenerá con heygen_plan.mjs.\n`); process.exit(4); }
console.log(`\n✓ PASS — avatar con movimiento y voz v3 limpia.\n`);
