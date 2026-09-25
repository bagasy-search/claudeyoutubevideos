# Agnes Studio

UI local para generar videos con **agnes-video-2.5-flash** (gratis en promo) y **agnes-video-2.5** (pago).

```
npm run agnes        # → http://localhost:5178
```

- **Claves**: usa `AGNES_KEYS` de `.env` y las rota solo (1 envío por minuto por clave).
- **Modos**: sólo texto · primer/último cuadro · referencias (hasta 8 imágenes, 3 audios, 1 video; 12 en total).
  En el prompt, referenciá cada archivo con `<Picture 1>`, `<Audio 1>` o `<Video 1>` (hay chips para insertarlos).
- **Duración** de 4 a 12 s · 720P (flash) o 1080P/2K (pro) · 6 formatos de pantalla · seed · cantidad.
- **Progreso**: muestra el `progress` que devuelve agnes (hoy salta 0 → 10 → 100) y el tiempo transcurrido.
- **Cola llena** (`video_queue_full`): es global del free tier, no un error. El job queda "esperando cupo" y se reintenta solo.
- **Referencias**: la API sólo acepta URLs públicas, así que los archivos se suben al bucket público de Supabase
  (`thumbnails/tmp_agnes/`, credenciales de `.env.local`) y se borran cuando el video termina.
  También podés pegar una URL pública directamente.
- **Salida**: `out/agnes-studio/<id>.mp4` (ignorado por git) + historial en `out/agnes-studio/jobs.json`.
