# HANDOFF · omwinter (Claudio Old Mechanic, Bagasy row 312)

- Status: delivered to Bagasy, job 817, "Video ready · upload" (NOT uploaded to YouTube).
- Final: release `omwinter/omwinter.mp4` (2K, encoded on the farm, `encfin-omwinter`). Duration 30.6 min (55080 frames @30).
- Voice: ElevenLabs `eleven_v4_turbo`, voice RWL6II44QhopvDMTeB1D, account 2. Script: `D:/rtmp/omvoz/omwinter/omwinter_el.txt` · log `tts_log.json`.
- Avatar: RunPod InfiniteTalk, one /run (`out/omwinter_avatar/`), reel30 in `public/avatar_clips/`.
- Director: `vlog/omwinter/dir_*.mjs` · beds `beds.json` · chapters `chapters.json` · constants `k.mjs`.
- CTA: landing https://old-mechanic-claudio.vercel.app/?src=omwinter + QR (`img/omwinter/qr.jpg`) + Manual page.
- Rebuild: `SLUG=omwinter node vlog/claudio/timeline.mjs` → `gen_timeline.mjs --final` → `mix.py` → `sfx_gate.py` → `mk_entry.mjs` → `scripts/farm.mjs` → `encfin/push.sh`.
- No music (EN channel rule). Car foley from `public/sfx_car`.
