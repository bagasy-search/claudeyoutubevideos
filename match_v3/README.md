# match_v3 — matcheo "editado a mano" (PIPELINE CANÓNICO, jul 2026)

**Esta carpeta es EL pipeline de matcheo.** Los `match_v3_*.mjs` y `_v3_*.mjs` de la raíz
están DEPRECADOS (geometría de storyboard mal calculada, sin filtros pre-juez, sin
blocklist, fallback a stock neutralizado). No los uses. (Flujo viejo: README.old.md.)

## La idea
Cada frase de la narración = un plano elegido por un JUEZ DE VISIÓN que mira mosaicos de
storyboard como un editor scrubbeando — pero con TODO lo objetivo hecho en código ANTES
(filtros) y DESPUÉS (validación, gate técnico, verificación obligatoria). Un clip flojo
NUNCA gana "porque era lo que había": cae a la cascada de stock.

## Flujo completo (comandos + agentes)

```
0. (opcional) DIRECTOR (PROMPTS §0, 1 agente) → plan: anchors, pace, src por sección
1. node match_v3/1_segment.mjs public/captions_<slug>.json _v3/<slug>_skel.json [starts] [pace]
2. AUTORÍA (PROMPTS §1, 1 agente por sección) → desc EN + queries ES CON ANCLA + anchor + shot + src
   → guardar como _v3/<slug>_beats.json (array con todos los campos)
3. node match_v3/2_search_mosaics.mjs _v3/<slug>_beats.json _v3_<slug>_mosaics 6 2 --anchors "sujeto,sinonimo"
   · fuerza el ancla EN CÓDIGO (query sin sujeto → se le antepone)
   · filtro duro: blocklist persistente, títulos/canales basura (shorts, compilaciones,
     reacciones, vlogs, podcasts...), duración 60s–40min, live
   · geometría REAL por fragmento en el nombre del PNG (int + fs)
   · beats con <2 candidatos → scarce ⚠; >40% scarce → aviso STOCK-FIRST
4. node match_v3/split_judge.mjs _v3_<slug>_mosaics 8
   JUEZ (PROMPTS §2, 1 agente por batch, Haiku) → _v3_<slug>_mosaics/_judge/picks_NN.json → unir _v3_<slug>_picks.json
   El juez devuelve {id, frag, row, col} — NUNCA calcula timestamps.
5. node match_v3/3_assemble.mjs _v3/<slug>_beats.json _v3_<slug>_picks.json public/broll/clips_<slug>_matched.json _v3_<slug>_mosaics/_manifest.json
   · valida pick ∈ candidatos (ids alucinados → stock, no desaparecen)
   · recalcula ts de la geometría, clamp anti-título/end-card
   · baja con +2s de cola (anti-congelado) · _score 0.5 _verified:false
6. node fetch_clips.mjs public/broll/clips_<slug>_matched.json   (o scripts/fetch_parallel.mjs)
   · piso 480p, valida lo bajado con ffprobe (truncado/vertical/corrupto → _failed.json)
7. node match_v3/4_stills.mjs public/broll/clips_<slug>_matched.json _v3_<slug>_stills
   · gate técnico automático + 3 stills reales por clip
   VERIFICADOR (PROMPTS §3, agentes Haiku visión) → verdicts.json     ← OBLIGATORIO
8. node match_v3/5_apply_verdicts.mjs public/broll/clips_<slug>_matched.json verdicts.json --stills _v3_<slug>_stills/_stills.json
   · estricto: sin veredicto = re-verificar · aprobados → _score 0.99
   · reprobados → _needstock.json + BLOCKLIST persistente (no vuelven nunca)
9. node scripts/stockfallback.mjs --list public/broll/clips_<slug>_matched_needstock.json
   · cascada Pexels → Pixabay → Archive.org → foto Ken-Burns, dedup global, calidad-first
   · lo que ni el stock resuelve → imagen generada (gen_comfy/deAPI)
```

Después del montaje (cues generados) y ANTES del render final:
```
node scripts/audit_video.mjs <slug> --video out/<slug>_preview.mp4
AUDITOR (PROMPTS §4, visión) → issues.json → aplicar fixes → repetir hasta {}
```

## Reglas que ahora viven EN CÓDIGO (ya no dependen del prompt)
| Regla | Dónde |
|---|---|
| Ancla de sujeto en toda query | `2_search_mosaics` (enforceAnchor) |
| Sin shorts/compilaciones/talking-heads/vlogs | `lib.filterAndRank` (BAD/BADCHAN + duración) |
| Videos/canales reprobados no vuelven | `lib.loadBlocklist` + `5_apply` (blocklist.json) |
| ts del tile = geometría real por fragmento | `lib.sbGeometry/tileTsFrag` + `3_assemble` |
| Nada de tiles en título/end-card | clamp en `3_assemble` |
| Pick alucinado → stock (no silencio) | `3_assemble` (valida contra manifest) |
| Clip truncado/vertical/<480p no entra | `fetch_clips` + `4_stills` (ffprobe) |
| YouTube sin verificar no sale al aire | `_score 0.5` hasta `5_apply_verdicts` |
| Tema flaco → stock-first | `scarce` en manifest + aviso >40% |

## Cuota API
1 query anclada por beat (MAXQ=1) + NCAND=6 juzgados es el sweet spot: los mosaicos
salen del CDN i.ytimg (gratis); lo que cuesta cuota es search.list (100 u). `videos.list`
(duraciones para el filtro) es 1 u/50. Fallback automático a `ytsearch` local sin cuota.

## Env knobs
`MAXQ` · `V3_DUR_MIN/MAX` (60/2400) · `V3_FETCH_MARGIN` (2s) · `V3_MIN_HEIGHT` (480)
· `FETCH_MIN_HEIGHT` · `FORCE_YTSEARCH` · `NO_ARCHIVE=1` · `PIXABAY_KEY` en .env (opcional)
