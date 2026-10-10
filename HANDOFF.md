# HANDOFF · omauto (Claudio Old Mechanic, Bagasy row 312)

- Status: delivered to Bagasy, job 814, "Video ready · upload" (NOT uploaded to YouTube).
- Final: release `omauto/omauto.mp4` (2K, encoded on the farm, `encfin-omauto`). Duration 30.9 min (55641 frames @30).
- Voice: ElevenLabs `eleven_v4_turbo`, voice RWL6II44QhopvDMTeB1D, account 2. Script: `D:/rtmp/omvoz/omauto/omauto_el.txt` · log `tts_log.json`.
- Avatar: RunPod InfiniteTalk, one /run (`out/omauto_avatar/`), reel30 in `public/avatar_clips/`.
- Director: `vlog/omauto/dir_*.mjs` · beds `beds.json` · chapters `chapters.json` · constants `k.mjs`.
- CTA: landing https://old-mechanic-claudio.vercel.app/?src=omauto + QR (`img/omauto/qr.jpg`) + Manual page.
- Rebuild: `SLUG=omauto node vlog/claudio/timeline.mjs` → `gen_timeline.mjs --final` → `mix.py` → `sfx_gate.py` → `mk_entry.mjs` → `scripts/farm.mjs` → `encfin/push.sh`.
- No music (EN channel rule). Car foley from `public/sfx_car`.
