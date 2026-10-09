# HANDOFF · ombaby (Claudio Old Mechanic, Bagasy row 312)

- Status: delivered to Bagasy, job 812, "Video ready · upload" (NOT uploaded to YouTube).
- Final: release `ombaby/ombaby.mp4` (2K, encoded on the farm, `encfin-ombaby`). Duration 42.6 min (76636 frames @30).
- Voice: ElevenLabs `eleven_v4_turbo`, voice RWL6II44QhopvDMTeB1D, account 2. Script: `D:/rtmp/omvoz/ombaby/ombaby_el.txt` · log `tts_log.json`.
- Avatar: RunPod InfiniteTalk, one /run (`out/ombaby_avatar/`), reel30 in `public/avatar_clips/`.
- Director: `vlog/ombaby/dir_*.mjs` · beds `beds.json` · chapters `chapters.json` · constants `k.mjs`.
- CTA: landing https://old-mechanic-claudio.vercel.app/?src=ombaby + QR (`img/ombaby/qr.jpg`) + Manual page.
- Rebuild: `SLUG=ombaby node vlog/claudio/timeline.mjs` → `gen_timeline.mjs --final` → `mix.py` → `sfx_gate.py` → `mk_entry.mjs` → `scripts/farm.mjs` → `encfin/push.sh`.
- No music (EN channel rule). Car foley from `public/sfx_car`.
