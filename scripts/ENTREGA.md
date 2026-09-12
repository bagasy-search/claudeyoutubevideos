# Entregar un video a Bagasy desde OTRA máquina

```
node scripts/deliver_to_bagasy.mjs <jobId> <slug> [--card=<id>|--thumb=<url>] [--dry]
```

Probá siempre primero con `--dry`: lee todo y te muestra el PATCH sin escribir.

## Las 3 cosas que la máquina necesita

1. **Creds de Supabase.** El script las busca en cascada y, si no las encuentra,
   el error te dice dónde miró. La forma más simple es crear `<video2>/.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service role key>
   ```

   También sirven las variables de entorno, o apuntar `$BAGASY_ENV_FILE` a un .env
   que ya las tenga. (Antes esto era un path fijo de una sola PC:
   `D:/Proyectos/yt-scout-web/.env.local`. En cualquier otra máquina reventaba con ENOENT.)

2. **`gh` autenticado** con acceso a `bagasy-search/claudeyoutubevideos` — el script
   verifica que el release `<slug>` tenga el `<slug>.mp4` antes de escribir la URL.
   `gh auth status` lo confirma.

3. **`public/<slug>_meta.json`** con `{title, description}`, si querés que el video
   suba con título y descripción. Sin eso avisa y sube pelado.

La miniatura sale sola de la tarjeta del planner (`tracked_channels.plan`) matcheando
por título; si no matchea, forzala con `--card=<id>` o `--thumb=<url>`.
