# Cómo meter arte externo

El juego arranca con arte procedural (`src/render/sprites.ts`). Para reemplazarlo
—venga de una IA, de un pack CC0 o de un ilustrador— no hay que tocar nada de la
lógica: se dejan los PNGs en `public/art/` y un manifiesto que los declare.

## Activarlo

El arte externo está apagado por defecto. Se enciende con una variable de
entorno, así el build normal ni siquiera busca los archivos:

```bash
VITE_ART_MANIFEST=art/manifest.json npm run dev
VITE_ART_MANIFEST=art/manifest.json npm run build
```

## El manifiesto

`public/art/manifest.json`. Todo es opcional: lo que no esté declarado sigue
usando el arte procedural, así que se puede reemplazar una sola criatura y
probar cómo queda antes de seguir.

```json
{
  "enemies": {
    "grunt": ["peon/walk_00.png", "peon/walk_01.png", "peon/walk_02.png"]
  },
  "towerBase":   { "arrow": "torres/ballesta_base.png" },
  "towerTurret": { "arrow": "torres/ballesta_canon.png" },
  "projectiles": ["proyectiles/virote.png", "proyectiles/obus.png", "proyectiles/esquirla.png"],
  "portal": "escenario/portal.png",
  "core":   "escenario/nucleo.png"
}
```

Los ids de enemigo salen de `src/sim/balance/enemies.ts` (`grunt`, `runner`,
`swarm`, `brute`, `juggernaut`) y los de torre de `towers.ts` (`arrow`, `cannon`,
`frost`).

## La herramienta de preparación

`tools/prep_sprite.py` deja un PNG generado listo para el atlas: recorta el
fondo blanco, escala al radio del enemigo, y —lo importante— **centra por los
pies, no por el recuadro**. Un personaje con cola, capa o arma que sobresale
tiene el centro del recuadro corrido respecto del centro real del cuerpo; sin
corregirlo el sprite queda descentrado y se bambolea al animarse.

```bash
pip install Pillow
python3 tools/prep_sprite.py entrada.png --radius 40 --out public/art/coloso/walk_00.png
python3 tools/prep_sprite.py frames/*.png  --radius 40 --out-dir public/art/coloso
```

Imprime la entrada de manifiesto lista para copiar. Opciones útiles:
`--pixel-ratio` (densidad de export, 2 por defecto), `--tolerance` (cuánto se
aparta del blanco puro y sigue siendo fondo; `-1` si el PNG ya viene con alfa),
`--band` (qué franja inferior cuenta como pies).

## Requisitos de los archivos

- **PNG con alfa**, fondo recortado.
- **Centro del sprite = centro de la imagen.** El render usa `anchor 0.5`; si el
  personaje está descentrado dentro del lienzo, va a vibrar al animarse.
  `prep_sprite.py` se encarga de esto.
- **Mismo lienzo para todos los frames** de una misma criatura. Si cada frame
  tiene un recorte distinto, el sprite tiembla.
- **Tamaño**: el lienzo debería medir ~2.1 × el radio de colisión, en píxeles de
  juego, y exportarse a 2× o 3× para pantallas densas. Radios actuales: peón 20,
  corredor 17, enjambre 15, bruto 30, coloso 40.
- **Vista frontal**, mirando a cámara. El render no rota los sprites de criatura,
  solo los inclina.
- **Cantidad de frames libre**: el ciclo se recorre sobre los que haya.

## Desde un modelo 3D (Meshy, Tripo, lo que sea)

`tools/render_sprites.py` convierte un GLB o FBX animado en los frames PNG.
Corre dentro de Blender, o con el modulo `bpy` si no lo tenes instalado:

```bash
pip install bpy
python3 tools/render_sprites.py modelo.glb --out frames/ --frames 12
python3 tools/prep_sprite.py frames/*.png --radius 40 --out-dir public/art/coloso --tolerance -1
```

(`--tolerance -1` porque el render ya sale con alfa: no hay fondo blanco que quitar.)

Esta es la ruta que resuelve la consistencia de raiz: los frames son renders del
**mismo** modelo, asi que calzan por construccion. Una IA de imagenes no puede
garantizar eso.

El script pone camara ortografica al frente (sin perspectiva, para que el
personaje no cambie de proporcion segun donde este parado), luz pareja y fondo
transparente. **El contorno no lo hace el render**: se probo con casco invertido
en 3D y es fragil — el grosor queda en unidades de mundo en vez de pixeles, en
mallas poco densas la tinta asoma como una rejilla entre vertices, y Cycles
ignora el culling de caras en el que el truco se apoya. El contorno del estilo
chibi es una propiedad de pantalla, asi que lo agrega `prep_sprite.py` con
`--outline`, donde ademas sirve igual para arte 2D.

## Desde un video de preview

`tools/video_to_frames.py` saca frames con alfa de un video (el preview que
muestra Meshy al lado de la animacion, por ejemplo).

```bash
pip install imageio imageio-ffmpeg Pillow
python3 tools/video_to_frames.py preview.mp4 --out frames/ --frames 8
python3 tools/prep_sprite.py frames/*.png --radius 20 --out-dir public/art/bicho --tolerance -1
```

**Es un plan B.** Si tenes el modelo, exporta el GLB y usa `render_sprites.py`:
sale con alfa real, a la resolucion que quieras y con la camara que elijas. El
video ya viene aplastado por el codec y con el personaje chico dentro del cuadro.

El recorte no va por color plano, que es lo obvio y falla por dos lados: la
sombra proyectada no es del color del fondo y queda pegada, y filtrar "todo lo
gris" borra los ojos, que son blancos y negros. Lo que se hace es marcar los
pixeles poco saturados y **rellenar desde los bordes**: solo se borra el gris
conectado con el borde del cuadro, asi que los ojos sobreviven porque estan
rodeados de personaje.

## El camino gratis, de punta a punta

Para lograr el registro chibi ilustrado sin pagar nada:

**1. Generar el personaje.** Flux.1 [schnell] (licencia Apache 2.0, uso comercial
libre) o SDXL, corriendo gratis en un Space de HuggingFace o en Colab. Un
personaje, no un spritesheet — la difusión no mantiene la consistencia entre
frames, y ese es justamente el problema que hay que esquivar.

Esqueleto de prompt compartido, para que los ocho salgan del mismo mundo:

```
chibi game character, {DESCRIPCION}, front view, full body, standing,
big head small body, large expressive eyes, thick uniform dark outline,
flat cel shading two tones, saturated {COLOR} palette, mobile game asset,
plain white background, centered
```

| Unidad | `{DESCRIPCION}` | `{COLOR}` |
|---|---|---|
| Peón | pequeño soldado rechoncho, ceño fruncido | rojo |
| Corredor | criatura delgada y veloz, orejas largas hacia atrás | naranja |
| Enjambre | bicho diminuto, cabeza enorme, sin brazos | magenta |
| Bruto | guerrero ancho con hombreras pesadas | marrón |
| Coloso | jefe enorme con corona de cuernos | carmesí |
| Ballesta | torre de piedra con ballesta arriba | verde |
| Mortero | torre de piedra con cañón corto | azul |
| Prisma | torre de piedra con cristal flotante | cian |

**2. Recortar el fondo.** rembg o BiRefNet, también gratis en Spaces.

**3. Animar.** Acá está la clave: la animación NO la hace la IA de imágenes.
- **AnimatedDrawings** de Meta (MIT, gratis) toma un dibujo de personaje y lo
  riggea y anima solo. Es lo más rápido.
- O cortás el PNG en piezas (cabeza, torso, brazos, piernas) y lo armás en
  **DragonBones** (gratis), que da más control.

**4. Exportar los frames**, pasarlos por `prep_sprite.py` y declararlos en el
manifiesto.

**5. Mirar el test de silueta.** Abrí `sprites.html` con el manifiesto activo. La
fila de siluetas dice la verdad: un personaje muy detallado se ve espectacular a
1024 px y se convierte en una mancha a 90. Si no lo reconocés en silueta, hay
que simplificar el dibujo — contorno más grueso, menos filigrana, formas más
grandes — por muy lindo que se vea el original.

## Por qué el orden importa

Generar un personaje lindo es fácil. Generar el mismo personaje doce veces
seguidas no lo es. Por eso el flujo es *una imagen → un rig → muchos frames*, y
no *doce imágenes*. El rig garantiza la consistencia que la difusión no puede
dar.
