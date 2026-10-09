# HANDOFF · omreset (Claudio Old Mechanic, Bagasy row 312)

- Status: delivered to Bagasy, job 809, "Video ready · upload" (NOT uploaded to YouTube).
- Final: release `omreset/omreset.mp4` (2K, encoded on the farm, `encfin-omreset`). Duration 31.6 min (56969 frames @30).
- Voice: ElevenLabs `eleven_v4_turbo`, voice RWL6II44QhopvDMTeB1D, account 2. Script: `D:/rtmp/omvoz/omreset/omreset_el.txt` · log `tts_log.json`.
- Avatar: RunPod InfiniteTalk, one /run (`out/omreset_avatar/`), reel30 in `public/avatar_clips/`.
- Director: `vlog/omreset/dir_*.mjs` · beds `beds.json` · chapters `chapters.json` · constants `k.mjs`.
- CTA: landing https://old-mechanic-claudio.vercel.app/?src=omreset + QR (`img/omreset/qr.jpg`) + Manual page.
- Rebuild: `SLUG=omreset node vlog/claudio/timeline.mjs` → `gen_timeline.mjs --final` → `mix.py` → `sfx_gate.py` → `mk_entry.mjs` → `scripts/farm.mjs` → `encfin/push.sh`.
- No music (EN channel rule). Car foley from `public/sfx_car`.
