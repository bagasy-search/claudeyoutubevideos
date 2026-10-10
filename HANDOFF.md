# HANDOFF · omwd40 (Claudio Old Mechanic, Bagasy row 312)

- Status: delivered to Bagasy, job 859, "Video ready · upload" (NOT uploaded to YouTube).
- Final: release `omwd40/omwd40.mp4` (2K, encoded on the farm, `encfin-omwd40`). Duration 31.1 min (55919 frames @30).
- Voice: ElevenLabs `eleven_v4_turbo`, voice RWL6II44QhopvDMTeB1D, account 2. Script: `D:/rtmp/omvoz/omwd40/omwd40_el.txt` · log `tts_log.json`.
- Avatar: RunPod InfiniteTalk, one /run (`out/omwd40_avatar/`), reel30 in `public/avatar_clips/`.
- Director: `vlog/omwd40/dir_*.mjs` · beds `beds.json` · chapters `chapters.json` · constants `k.mjs`.
- CTA: landing https://old-mechanic-claudio.vercel.app/?src=omwd40 + QR (`img/omwd40/qr.jpg`) + Manual page.
- Rebuild: `SLUG=omwd40 node vlog/claudio/timeline.mjs` → `gen_timeline.mjs --final` → `mix.py` → `sfx_gate.py` → `mk_entry.mjs` → `scripts/farm.mjs` → `encfin/push.sh`.
- No music (EN channel rule). Car foley from `public/sfx_car`.
