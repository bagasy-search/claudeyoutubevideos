# La fábrica con Qwen, sin Claude

Todo corre en GitHub Actions (gratis en este repo público), aunque la PC esté apagada.
Vos usás la **app de GitHub** en el celular. Nadie más: los workflows sólo responden al dueño del repo.

## Cómo se usa

### Hacer un video entero
App de GitHub → este repo → **Actions → video → Run workflow** → elegís canal, escribís título
(y si querés tema, minutos, tope de US$) → **Run**.
- Qwen escribe el guion, dirige, la fábrica hace voz, imágenes, clips, avatar, montaje y render.
- Tarda 30–90 min según la duración. El video queda en **Releases** (`video-<slug>`), listo para ver o bajar.
- Costo medido: ≈US$0,19 un video de 3 min · ≈US$1,6–1,9 uno de 20 min (+US$0,25 del avatar).

### Chatear con el agente (componentes, estilos, arreglos, o pedirle videos)
Abrí un **issue** y escribí `@qwen` y lo que quieras. Ejemplos:
- `@qwen creá un componente para Harlan que muestre un medidor de amperes subiendo hasta saltar el breaker`
- `@qwen hacé un video de 10 min para Ole sobre 5 cenas en una sola olla`
- `@qwen el componente de ayer queda chico en el celular, agrandalo`

El agente contesta en el mismo issue (la app te avisa). Si cambió código, abre un **PR**; si hizo videos de
prueba, te deja los links. Para seguir, respondé en el issue con `@qwen …`. El historial es el hilo.
Cuando un PR te guste, lo mergeás desde la app y queda en la fábrica.

## Configuración (una sola vez)
1. **Token de claude-brain.** GitHub → Settings → Developer settings → Fine-grained tokens → nuevo token
   con acceso SÓLO a `bautielcrack4-web/claude-brain`, permiso *Contents: Read-only*.
2. **Cargarlo como secreto.** En `bagasy-search/claudeyoutubevideos` → Settings → Secrets and variables →
   Actions → New repository secret → nombre `BRAIN_TOKEN`, valor el token.
3. **Clave de AIHubMix al día.** En `claude-brain/secretos/video2.env`, la línea `AIHUBMIX_KEY=` tiene que
   tener la clave de la cuenta con saldo. Todas las demás claves (Fish, agnes, RunPod, Pexels, Supabase)
   ya salen de ahí.
4. **Mergear a `main`.** GitHub sólo muestra "Run workflow" y escucha los issues con los workflows de la
   rama principal.

## Lo que tenés que saber
- **Los issues de este repo son públicos** (el repo es público). Las claves nunca se ven: se tapan en los
  logs y en los comentarios. Pero el texto de la conversación sí. Si preferís chatear en privado, se puede
  mover el chat a `claude-brain` (privado) más adelante.
- **Tope de gasto.** El video tiene `tope_usd` (default 2). El agente no gasta en OpenAI ni RunPod salvo
  que se lo pidas.
- **OpenAI desactivada** → las imágenes salen con agnes (gratis). Cuando vuelva, elegí `gpt` en el formulario.
