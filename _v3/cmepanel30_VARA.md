# VARA DE EDICIÓN — `cmepanel30` (Claudio Mendoza Constructor)
### Brief maestro. Todo subagente que trabaje en este video lee ESTO primero y no negocia nada de acá.

**Video:** "Enchufé un Panel Solar a mi Casa 30 Días | Esto Fue lo que Pasó"
**Molde clonado:** *"Plugged A Solar Panel Into My Home For 7 Days | Here's What Happened"* — Everyday Solar (93K subs) · 2.49M vistas · ×27 sobre sus subs. Palabra movida: **7 días → 30 días**.
**Guion:** `guiones/cmepanel30.txt` · 22.125 chars · ~24 min · español NEUTRO (tú)
**Slug:** `cmepanel30` · prefijo de assets `cmep30_` · card Bagasy `cmep202608216`
**Ref de identidad:** `public/ref_cmepanel30.png` = copia de `ref_cmeenchufe_169.png` (1540×866, **AR 1.778**).
⛔ **NO usar `ref_cmeenchufe.png` ni `ref_cmebateria.png` (AR 1.182): agnes estira la cara 1,5× a lo ancho.** Compuerta: `AR(ref) == AR(salida)`.

---

## 1. LA META, en una frase

**Que parezca grabado, no montado.** Cada cosa que Claudio dice tiene que APARECER en pantalla en el
milisegundo en que la dice. No "una imagen por párrafo": **una imagen por microacción**. Si dice
"trescientos diez vatios", el 310 está en la pinza. Si dice "moví los paneles metro y medio", se ve a
Claudio arrastrando los paneles. Si dice "sácale una foto a la lectura", hay un teléfono contra el
medidor.

---

## 2. ⛔⛔ EL PRIMER MINUTO ES UN TRAILER (directiva del creador, 27-ago-2026)

Los primeros ~80 s (párrafos 0 y 1 del guion, hasta *"...con lo que ya tienes en tu casa"*) se editan
como **el trailer de una película**, no como el arranque de un video de YouTube. Es la pieza que decide
la retención de los 24 minutos, y se trabaja **en varias pasadas, iterando con ojo de diseñador**, no de
una sentada.

**Las cinco reglas del trailer:**

1. **CERO filtros sobre el avatar.** Nada de grade, viñeta, blur, grano, aberración ni scrim de color
   encima de Claudio. Él se ve **limpio y nítido**, tal cual salió. Todo el diseño vive ALREDEDOR de él:
   capas por delante y por detrás, luz que lo rodea, tarjetas que pasan por el frente y lo ocluyen un
   instante. ⛔ Ninguna capa se apoya ENCIMA de su cara con opacidad.
2. **Fluidez adictiva.** Nada se detiene, nada arranca de cero, nada corta en seco. El movimiento es
   continuo de punta a punta: la cámara ya viene andando cuando entra el primer elemento y no frena
   hasta el final del minuto. Efectos **suaves y limpios** — nada estridente, nada de flashes duros.
3. **Todo se funde.** En esos 80 s pueden pasar 6-8 elementos del nivel más alto, y **no se tiene que
   notar dónde termina uno y empieza el otro.** Cada frontera con una costura distinta (§5), nunca un
   fundido.
4. **Profundidad real.** Mínimo 5-6 planos con parallax propio (`perspective` + `translateZ` +
   `preserve-3d`). Tarjetas flotantes con **material real adentro** (foto o clip corriendo), su marco, su
   sombra de contacto y su reflejo. Íconos/logos en PNG sin fondo como objetos de la escena.
5. **Los números del hook son los protagonistas.** 30 días · 142 kWh · 89 · 53 regalados. Cada uno entra
   como un objeto físico en el espacio, no como un título centrado. El **53** es el que tiene que doler:
   se separa del 142 y se va de cuadro hacia la red.

**Las pasadas** (el creador pidió explícitamente iterar): pasada 1 = bloqueo de actos y coreografía ·
pasada 2 = profundidad, luz y material real adentro de cada tarjeta · pasada 3 = costuras y timing fino
sobre la palabra · pasada 4 = pulido de easing, sombras de contacto y hold vivo. Se revisa con frames
extraídos de los dos lados de cada frontera antes de darlo por bueno.

---

## 2.bis. EL AVATAR ES PARCIAL Y LA COLA VA EN BUCLE — leer antes de repartir densidad

| | |
|---|---|
| `public/cmepanel30_opt.mp4` | 1920×1080, **30 fps CFR**, 622,76 s (10:22) — conformado desde 1920×1082 @25 |
| `public/cmepanel30.wav` | master completo **1455,22 s (24:15)**, 44,1 kHz mono, **−14,17 LUFS · TP −1,00** |
| **AVATAR_END** | **622,63 s** — hasta ahí el lipsync es REAL (voz y avatar del creador) |
| costura | **622,80 → 623,15 s** (0,35 s de aire). Desde 623,15 s la voz es Fish (`claudio_cmepanel30`) |
| cola | 832,07 s de Fish contra 622,80 s de avatar = **1,34 pasadas** |

⛔⛔ **ACÁ HAY DOS SALTOS DE BUCLE QUE TAPAR, no uno** (en `cmeenchufe` alcanzaba con uno):
1. **623,15 s** (frame 18695) — el avatar vuelve a 0 por primera vez.
2. **1245,95 s** (frame 37379) — vuelve a 0 otra vez; la última pasada cubre sólo 209 s.

En los dos, un `CLIP` o una `ESCENA` **a pantalla completa cubriendo ±2,5 s** del salto, para que el
cambio de pose no se vea. El primero cae en *"Y la tercera es la que tienes que revisar sí o sí"* (el
medidor que te cobra) y el segundo en el tramo del retorno de la inversión: los dos aguantan un plano
fuerte sin forzar nada.

⛔ **Después de 622,63 s el lipsync NO vale.** El avatar pasa a ser **fondo garantizado**, nunca plano:
si aparece, que sea tapado, en escala chica dentro de una escena, o en un instante de transición.
**Consecuencia de presupuesto: la segunda mitad (14 min) necesita MÁS eventos que la primera, no menos.**

## 3. LOS CUATRO TIPOS DE EVENTO VISUAL

### `CLIP` — video real de agnes, con la cara de Claudio (i2v)
Default para toda ACCIÓN FÍSICA. 4-5 s, una acción por clip, `noSplit`.
Prompt de CINCO bloques (identidad · continuidad de escena · acción · cámara · textura), en inglés,
sin vocabulario de cámara, negativos sólo `no text`/`no hands`. Params: `1280×720, 121 frames, fr 24`.
⛔ Después hay que conformar TODO a **30/1 CFR** (§7) o el video sale con tirón.

### `FOTO` — imagen agnes img2img con la ref (andamio PRESERVE / CHANGE / STYLE)
Para lo abstracto hecho concreto y para los golpes de <1 s (0,6-0,9 s). También respaldo on-topic de
cada clip y cama de foto debajo de todo componente.
⛔ Bloque STYLE endurecido en positivo para las manos: *five separate fingers on each hand, both thumbs
in their natural place, plain knuckles, a steady simple grip*. Si una toma sigue fallando, es la
COMPOSICIÓN: reencuadrar con las manos fuera de cuadro.

### `ICONO` — PNG sin fondo como objeto de la escena
Números, unidades, precios, fechas. Nunca solo: el número va con el ícono que lo explica.
Se reusan gratis los del canal (copiar a `img/cmepanel30/` con prefijo propio, **no referenciar la
carpeta de otro video**).

### `ESCENA` — motion design propio. Nunca suelta: se encarga como **MOVIMIENTO** (§5).

---

## 4. LAS 12 SECCIONES Y SU ARCO VISUAL

> Timecodes ESTIMADOS sobre 24:10 — se re-anclan al ms con Whisper cuando llegue el wav.
> El arco de luz va de **frío/noche** (el problema) a **día pleno** (la prueba) y vuelve a **cálido de
> tarde** (el cierre). La cámara nunca vuelve a cero entre secciones.

| # | tramo | párrafos | qué tiene que LOGRAR | luz al entrar → al salir |
|---|---|---|---|---|
| S1 | 0:00–1:48 | 0-2 | **TRAILER** (§2) + aterrizar en el trato | negro con brasa → día limpio |
| S2 | 1:48–4:14 | 3-6 | Credibilidad ("no es energía gratis") + qué compré + **el mecanismo del microinversor** | día limpio → mesa de taller cálida |
| S3 | 4:14–5:48 | 7-9 | Que se vea FÁCIL (40 min) + plantar la duda de Ernesto | taller cálido → patio mediodía |
| S4 | 5:48–7:39 | 10-12 | **EL CORAZÓN: 310 → 40 en la pinza** y LA ESPINA | patio mediodía duro → cenital blanco |
| S5 | 7:39–9:14 | 13-15 | El consumo de fondo + cómo medirlo · **CTA 1** | cenital blanco → penumbra del medidor |
| S6 | 9:14–11:42 | 16-20 | Los tres medidores + la prueba de 10 minutos | penumbra → ámbar de alerta |
| S7 | 11:42–14:10 | 21-23 | Los errores: nubes, sombra, y **la joya del oeste** | ámbar → tarde dorada rasante |
| S8 | 14:10–15:50 | 24-26 | Mover las cargas: 63% → 91% sin comprar nada | tarde dorada → interior noche |
| S9 | 15:50–17:51 | 27-29 | El apagón (límite honesto) + el cable suicida · **CTA 2** | noche de tormenta → azul frío |
| S10 | 17:51–19:35 | 30-32 | La factura real + el retorno + por qué nadie te lo vende | azul frío → papel blanco |
| S11 | 19:35–21:15 | 33-37 | Los límites + **los tres números** memorizables | papel blanco → verde-voltio |
| S12 | 21:15–24:10 | 38-40 | **CTA 3** (14 acciones + Carlos) + QR + cierre | verde-voltio → garaje al atardecer |

**Glosario** (se describe SIEMPRE igual): *el kit* = dos paneles apoyados en el piso del patio contra
la pared, inclinados, sobre soportes negros · *la cajita gris* = el microinversor colgado de un gancho ·
*la pinza* = la amperimétrica amarilla y negra, la firma del canal · *el medidor* = caja de la pared con
lucecita que parpadea · *Ernesto* = vecino de brazos cruzados, gorra, camisa a cuadros.

---

## 5. LOS MOVIMIENTOS (lo que se les encarga a los subagentes)

⛔ **A un subagente NO se le encarga "un componente". Se le encarga un MOVIMIENTO:**
**30-60 s, 4-6 actos encadenados, UN solo archivo `.tsx`**, con:
- **una sola atmósfera** montada una vez, que NUNCA se remonta entre actos;
- **una sola cámara**, función del frame global — el acto 3 hereda posición, zoom e inercia del acto 2;
- **luz que evoluciona**, no que salta;
- **materia que cruza cada frontera** y se transforma en lo siguiente;
- cada unión con una **costura**: MATCH-SHAPE · MATCH-MOVE · WIPE POR MATERIA · OCLUSIÓN · ZOOM-THROUGH
  · CORTE EN EL BEAT. **Dos fronteras seguidas no pueden usar la misma. ⛔ Nunca un fade.**

**Contrato de handoff — si el subagente no puede escribir esta tabla, no diseñó una escena continua:**

| acto | entra con (encuadre + luz) | sale con (encuadre + luz) | objeto que cruza | costura hacia el siguiente |
|---|---|---|---|---|

**No negociable de las tarjetas:** toda tarjeta flotante lleva **VIDEO o FOTO REAL adentro**, con marco,
sombra de contacto y profundidad. Una tarjeta que es sólo una forma con texto es código en pantalla y se
nota. ⛔ Nada de vectores dibujados haciendo de objeto real. Los PNG sin fondo sí, como objetos de la
escena.

**Presupuesto de atención:** 1 objeto protagonista por acto · 1 idea de texto por acto (titular ≤7
palabras) · la variedad sale de material y escala (macro → producto → general → cenital), no de meter
más elementos.

### El escenario compartido (`src/cmepanel30/PanelStage.tsx` — todos los movimientos lo consumen)
- **Paleta:** `THEME_VOLT` — negro cinematográfico + verde-voltio + amarillo. Oswald.
- **Atmósfera base:** el patio y el garaje de Claudio. **El sol es un personaje**: entra siempre desde
  arriba-izquierda y su temperatura marca la hora de la sección. Polvo suspendido en los interiores;
  aire caliente vibrando en los exteriores de mediodía.
- **Regla de dirección de la luz:** lo que **te cobran** (la compañía, la factura, la red) entra desde
  ARRIBA y en FRÍO. Lo que **te queda** (el ahorro, lo que tu casa se come) entra desde ABAJO y en
  CÁLIDO. Se respeta en los 12 tramos.
- **Cámara global:** siempre en deriva lenta, nunca clavada, nunca un corte a cero.
- **Objetos recurrentes:** el **panel** (rectángulo azul-negro con la grilla de celdas: es la forma madre
  de todas las costuras MATCH-SHAPE del video) · la **cajita gris** · la **pinza amarilla**.

---

## 6. LOS TRES CTA (ya están en el guion; casuales, NUNCA comerciales)

Sin precio, sin URL en voz alta. Las láminas que se muestran **son páginas reales de los manuales** — se
dice de pasada, no se vende. Tono: *"lo dejé abajo por si te sirve"*, jamás *"conseguí tu guía"*.
1. **~9:09** (fin del párrafo 14) — la hoja de los 60 aparatos medidos.
2. **~17:45** (fin del párrafo 28) — las 7 conexiones que no se hacen nunca + tabla de cable y fusible.
3. **~22:45** (párrafo 38) — las 14 acciones ($45-94/mes, 11 gratis) + Carlos, 58 años + **QR de 9 s**
   a `https://claudiomendoza.vercel.app/`.
   ⛔ QR con `border=4` obligatorio (`border=2` NO decodifica) y **verificado decodificándolo del
   render**, no del PNG.

---

## 7. COMPUERTAS ANTES DE RENDEAR (exit 1 = no se rendea)

```
node scripts/plan_gate.mjs cmepanel30
node scripts/check_props.mjs cmepanel30
node scripts/check_defaults.mjs cmepanel30
node scripts/density_gate.mjs cmepanel30
node preblur.mjs
```
Y las que ningún gate automático ve, todas medidas en videos ya entregados de este canal:
- ⛔⛔ **FPS: todo a `30/1` CFR** (clips agnes vienen a 24, HeyGen a 25, la comp es 30 → judder en TODO
  el metraje). Conformar con `minterpolate=fps=30:mi_mode=mci:...`. **Lanzar el avatar PRIMERO** (~2 h).
- ⛔ **luma <25 = pantalla negra** en el render. Medir los clips ENTEROS, no una muestra.
- ⛔ **el build escanea `src/cmepanel30/*.tsx` por assets**, no sólo los cues: los movimientos llevan las
  rutas hardcodeadas adentro. Sin eso, 404 y chunk muerto con un error que miente
  (`EncodingError: source image cannot be decoded`).
- ⛔ **imports untracked en git** matan los 60 chunks. `git ls-files --error-unmatch` por archivo.
- ⛔ **destellos de 1 frame**: derivar la duración del FRAME FINAL, no del largo.
- ⛔ **tiempo de lectura**: piso 2,0 s overlay / 2,8 s pantalla completa + 0,28 s por palabra sobre 3.
- ⛔ **aspecto 16:9** en todo asset antes del build (gpt-image sólo hace 16:9 en **1792×1008**).
- ⛔ **cobertura ≥90%**, ningún hueco >10 s, y escalar los `dur` por `wav_real / planeado`.
- ⛔ El **HOOK** y el **ENDCARD** del Main están escritos a mano: no los ve ninguna compuerta. Mirarlos.

**Render:** SIEMPRE en el farm, ref dedicada `cmepanel30-render`, `ENTRY=src/index_cmepanel30.tsx`.
⛔ NO tocar `molino-v1` (repo compartido con otras sesiones). Release **`isDraft:false`** o los 60 chunks
mueren invisibles.

### ⛔⛔ EL REPO ESTÁ OCUPADO POR OTRA SESIÓN — la ref va por PLUMBING con índice AISLADO
Al 27-ago-2026 `HEAD` está en **`condensa-render`**, de otra sesión, y **todo `src/cmepanel30/` está
UNTRACKED**. Las dos cosas juntas son la receta del desastre documentado en `mdring` (61 chunks muertos
por un import untracked: `tsc` compila contra el DISCO, pero el farm hace checkout limpio del COMMIT).

- ⛔ **NO `git add` en el índice compartido**: se lo lleva puesto el commit de la otra sesión. (Ya pasó
  en esta sesión; se revirtió con `git reset HEAD -- <mis rutas>`.)
- ⛔ **NUNCA `git read-tree --reset -u`**: PISA el working tree y destruye lo no commiteado de la otra
  sesión, sin recuperación posible.
- ✅ La receta segura, con índice propio:
  ```bash
  export GIT_INDEX_FILE=.git/idx-cmepanel30
  git read-tree origin/molino-v1                      # SIN -u
  for f in $(git ls-files --others --exclude-standard src/cmepanel30/) <los demás archivos del video>; do
    h=$(git hash-object -w "$f"); git update-index --add --cacheinfo 100644,$h,"$f"
  done
  C=$(echo "cmepanel30: panel solar 30 dias" | git commit-tree $(git write-tree) -p origin/molino-v1)
  git update-ref refs/heads/cmepanel30-render $C && git push -f origin cmepanel30-render
  git branch -f cmepanel30-render $C                  # el pre-vuelo mira la rama LOCAL
  unset GIT_INDEX_FILE
  ```
- **Compuerta antes de despachar:** recorrer los imports desde `index_cmepanel30.tsx` y exigir que cada
  archivo esté en el árbol del commit (`git ls-tree -r <sha> --name-only | grep <archivo>`), no en disco.

### El primer salto del bucle cae REGALADO
`LOOP_START` = frame **18695**, y el beat que arranca ahí es *"Y la tercera es la que tienes que revisar
sí o sí antes de comprar nada"* — el medidor que te COBRA. Es un beat que pide plano fuerte igual, así
que el movimiento que cubra ese tramo tiene que **arrancar a pantalla completa** y sostenerlo ≥2,5 s.
El segundo salto (frame **37379**) cae en el tramo del retorno de la inversión: mismo tratamiento.
