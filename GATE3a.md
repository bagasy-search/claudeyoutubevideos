# ⛳ 3a — turno de render · olpots

Todo el montaje está armado y renderizado **local** (preview 672x378, `D:/rtmp/olpots/preview.mp4`, 979,75 s, audio máster + cama + sfx; 2 pasadas: la 1ª murió porque otra sesión limpió `D:\rtmp\tmp` con el bundle adentro → ahora TEMP en C:).
- Rama `olpots-render` (último commit ver `git log`), entry `src/index_olpots.tsx`, comp `Olpots`, **TOTAL_FRAMES = 29391** (979,7 s).
- Assets por lista explícita: `@_olpots_assets.txt` (≈134 archivos, ≈383 MB, cero `_blur`/derivados en runtime; los `_last.jpg` están).
- Medido en el preview (Olpots, mismo timeline que va al farm): minuto 1 = **23 cortes, 0 silencios** (ffmpeg silencedetect −32 dB / scene 0,3); 176 tomas, 10,7 cortes/min; avatar 21,9 % (incluye los 6 hablados de agnes que todavía no llegaron: bajará a ≈19,5 %); real (stock + archivo) 29,8 % + hablados/detalles agnes; componentes 35,9 % (3D = 14,9 % = 4.381 cuadros).
- **Chunks:** 3D pesado (repisa con sombras: medido 60 cuadros en 89 s con concurrency 4 en esta PC). Propongo **196 chunks de 150 cuadros** (≤256 del tope) → un chunk 100 % de repisa ≈ 10-12 min, dentro del timeout de 25 min; FARM_REF=olpots-render, render COMPLETO (no ONLY_CHUNKS).
- Pendiente antes de lanzar: llegada de los hablados m2-m7 de agnes (cola única: 3 hechos de 7 al momento; los pendientes salen del avatar si no llegan y se cambian después con re-render COMPLETO).
