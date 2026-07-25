# Canal: Dr. Valler (nicho médico · interno: "dr-federer")

> **Este archivo MANDA sobre cualquier regla genérica.** Leelo COMPLETO antes de escribir guion o editar.
> Mantenelo actualizado (§6).
>
> 📌 Esto es la **identidad de ESCRITURA** del canal, no una biografía. No inventes vida personal.

---

## 1. ADN DE ESCRITURA — cómo escribe este canal

> La fórmula general está en `para-chatgpt/GUION.md` y se aplica SIEMPRE. Acá va lo propio del canal.

- **Cómo son los ganchos acá:** ⬜ A COMPLETAR — pegá 1-2 ganchos REALES que hayan funcionado.
- **Estructura preferida:** ⬜ A COMPLETAR
- **Cómo abre y cómo cierra:** ⬜ A COMPLETAR
- **Densidad / ritmo:** frases cortas que aterrizan. Menos-es-más, pero **con intención**.
- **Largo objetivo:** ⬜ A DEFINIR — **mínimo 14.000 caracteres**. Los guiones cortos son el problema
  recurrente de este canal: si te queda corto, NO es que faltan temas, es que no desarrollaste cada
  punto con su porqué, su número y su ejemplo.
- **Qué hace SIEMPRE:** ciencia con nombres/fechas/instituciones **verificables**; límites honestos
  ("esto NO hace X"); fuentes **fuera** del bloque copiable del guion.
- **Qué NUNCA hace:** inventar estudios; abrir mandando a otro video; sonar a vendedor.

### Ganchos ya usados (para NO repetirlos)

> ⚠️ **VARIÁ EL MOLDE, no solo los datos.** Ya hay varios ganchos con el mismo esqueleto
> ("paciente + oficio + N años + ciudad + se sentó frente a mí"). Ese patrón funciona, pero si se usa
> en todos los videos el canal se vuelve predecible y aburre. Antes de escribir, mirá esta tabla:
> **si los últimos 2 ganchos usaron el mismo molde, usá otro** (un objeto físico, un dato-shock, una
> escena del consultorio sin paciente, una pregunta al espejo, un error propio). Tampoco repitas
> nombre de paciente ni ciudad ya usados.

| Fecha | Video | Gancho usado |
|---|---|---|
| 2026-07-20 | nariz / envejecimiento de la piel (`vd4f4gksltnz`) | "Marta tiene cincuenta y ocho años y fue cajera de banco durante treinta y cuatro en Rosario. Se sentó frente a mí a fines de mayo con un sobre de fotos viejas..." ✅ cold-open de escena real (paciente + objeto físico + números), reemplaza la versión anterior |
| 2026-07-19 | poros / textura piel (`vd4f4gksltnz`, borrador anterior) | "Mírese la nariz un segundo. No para ver si tiene un grano, sino los poros." ❌ es un mandato de apertura dirigido al espectador, NO una escena — corregido, no repetir este patrón tampoco |
| 2026-07-19 | flor de Jamaica / hibisco (`vbrhdsvzlyw5`) | "Buenas. Quiero contarle algo que en veinte años de consultorio todavía me sorprende." ❌ es un saludo, NO un cold-open — no repetir este patrón |
| 2026-07-20 | flor de Jamaica / hibisco, reescrito (`vbrhdsvzlyw5`) | "Liliana tiene sesenta y ocho años. Fue modista durante cuarenta y dos años en Rosario, cosiendo a mano bajo una lámpara de escritorio hasta las diez de la noche. Se sentó frente a mí hace tres semanas y puso las dos manos sobre mi escritorio..." ✅ cold-open de escena real con herida (plata gastada, piel que envejece más rápido de lo que puede pagar frenarla) — patrón validado, reutilizable con otra paciente/tema |

## 2. VOZ — cómo suena

- **Tono:** médico que explica con calma y autoridad. Nunca vendedor.
- **Trato al espectador:** **USTED** (confirmado en los guiones ya escritos: "Mírese la nariz",
  "¿Usted tiene, en su cocina…?"). Mantenelo — nunca cambies a vos/tú.
- **Muletillas y frases propias:** ⬜ A COMPLETAR
- **Palabras que NUNCA usa:** ⬜ A COMPLETAR
- **Tags de TTS:** pocos y reales — `[clears throat]`, `[chuckles]`, `[sighs]`, `[whispers]`.
  **NUNCA `[pause]`/`[pausa]`** (enlentece la voz).
- **Antes de escribir con un estilo nuevo:** esperá el ejemplo de estilo del creador. No arranques a ciegas.
- **Datos personales:** solo los escritos acá. Si te falta uno, pedilo o escribí sin esa anécdota.

## 3. LOOK — la marca visual

- **Skill de nicho:** `dr-federer` → ⚠️ es la skill del **NICHO MÉDICO en general**, no de una persona.
  El nombre quedó por historia. Todos los presentadores médicos la usan y comparten el MISMO kit.
  Lo que cambia entre canales es ESTE archivo, no los componentes.
- **Memorias del nicho:** `reference_dr_federer_kit`, `reference_federer_broadcast_premium_kit`
- **Componentes (compartidos del nicho médico):** `src/FedererFluid.tsx`, `src/FedererKit.tsx`
  (kit dark-cinematic, 25 kinds). Usalos tal cual — no clones ni renombres el kit por presentador.
- **Formato:** avatar real a cámara + capas de profundidad.
- **Reglas visuales:**
  - ⛔ **EL VIDEO ABRE CON EL AVATAR HABLANDO, a pantalla completa, mínimo los primeros 2 segundos.**
    Nada de b-roll, imagen, cartel de título, logo ni negro antes. La cara hablando es lo PRIMERO que
    se ve. Verificar en el AUDITOR con los frames 15 y 45 — si ahí no está el avatar, no se shipea.
  - Whips y transiciones fluidas, **sin cortes duros**.
  - Avatar full o visual full alternados. **Nada de PiP en esquina sobre b-roll.**
  - Quote-cards con el estilo propio del canal.
  - Componentes nuevos: aprobarlos **aislados** antes de meterlos al video.

## 4. REGLAS DE PRODUCCIÓN — overrides de herramientas

- **Imágenes:** default del pipeline (Modal). ⬜ Cambiar acá si el creador pide otra cosa.
- **Voz / TTS:** el avatar viene de HeyGen (engine **avatar_iii**, nunca Avatar IV).
- **Render:** siempre en el FARM.

## 5. GLOSARIO — elementos recurrentes

- ⬜ A COMPLETAR (ingredientes y conceptos que se repiten entre videos, descriptos SIEMPRE igual)

## 6. APRENDIZAJES — correcciones del creador (append-only)

- **2026-07:** el nombre público es **Dr. Valler**. "Federer" queda solo como nombre interno de la
  skill, los componentes y las carpetas — nunca se dice ni se escribe en el video.
- **2026-07:** la skill `dr-federer` es del NICHO MÉDICO entero, no de una persona. No clonar el kit.
- **2026-07:** esperar el ejemplo de estilo del creador antes de escribir; no adelantarse.
- **2026-07:** guion puro para TTS, con pocos tags reales de ElevenLabs v3; `[pause]` prohibido.
- **2026-07:** aprobar componentes nuevos en aislado antes de integrarlos.
- **2026-07:** ⚠️ los guiones venían MUY CORTOS. Piso 14.000 caracteres, contarlos antes de entregar.
- **2026-07-20:** ⛔ el video TIENE que abrir con el avatar hablando a pantalla completa, mínimo los
  primeros 2 segundos. Un video abrió con b-roll y el creador lo marcó como indispensable de corregir.
- **2026-07-20:** el cold-open tiene que ser una ESCENA REAL (nombre, edad, oficio, lugar, objeto físico,
  cita) — un mandato dirigido al espectador ("Mírese la nariz...") NO cuenta como cold-open aunque tenga
  impacto, porque no abre un loop narrativo con una persona concreta. Usar siempre el patrón paciente
  (nombre, edad, oficio, ciudad, objeto físico concreto, plata gastada), contado en tercera persona. Ver
  ejemplo bueno en la tabla de arriba (`vd4f4gksltnz`, versión final).
- **2026-07-20 (vfh490rruvab):** los componentes `FedHero`/`FedStat`/`FedStep`/`FedMolecule`/`FedCta` de
  `FedererKit.tsx` tienen un `image` default que apunta a `med/romero.png` / `med/piel.png` /
  `med/aceite.png` — assets COMPARTIDOS que NO viajan en el tarball de un video con entry propio aislado.
  Si te olvidás de pasar `image=` explícito en UNO solo de estos componentes, ese chunk 404 y el render
  del farm se cae entero. Antes de farmear: grepear el Main_<slug>.tsx y confirmar que TODOS los Fed*
  con prop `image?` lo traen explícito (ninguno usando el default).
- **2026-07-20 (vfh490rruvab):** cuando corren VARIOS videos en paralelo (mismo working dir compartido),
  NO registrar la composición en `src/Root.tsx` ni depender de `src/index.ts` (otro agente lo pisa/hijackea
  y el farm rinde con las composiciones de OTRO video). Crear siempre `src/index_<slug>.tsx` con su propio
  `registerRoot(...)`, y pasar `ENTRY=src/index_<slug>.tsx` a `scripts/farm.mjs`. OJO: el entry-point de
  `npx remotion render` es un ARGUMENTO POSICIONAL (va primero, antes del comp-id) — un flag `--entry=...`
  no existe, se ignora en silencio y cae al entry compartido igual. `render.yml` ya quedó arreglado para
  pasarlo posicional cuando el input `entry` viene seteado.
- **2026-07-20 (vbb0rdkrfduo, rehecho ~25 min):** si tenés que rehacer un Main_<slug>.tsx que OTRO trabajo
  puede estar tocando en simultáneo, NO sobreescribas el archivo compartido — creá `Main_<slug>_redo.tsx` +
  `index_<slug>_redo.tsx` propios (mismo patrón de entry aislado) y dejá el original intacto.
- **2026-07-20 (vbb0rdkrfduo):** en videos largos (20+ min) con MUCHOS sub-temas dentro de un mismo bloque
  narrativo (ej. "los 8 pasos de la receta", "las 5 promesas"), una sola `FullVisual` window de 40-50s con
  2-3 imágenes cíclicas SIEMPRE termina con el título/imagen de un sub-tema sostenido mientras la narración
  ya pasó al siguiente — el auditor lo marca como "dead"/mismatch cada vez. Cortar esas windows a la
  duración real del sub-tema (15-30s) en vez de agruparlas por bloque grande.
- **2026-07-20 (vbb0rdkrfduo):** antes de reusar una imagen ya generada de otro video por su NOMBRE de
  archivo, mirala — varias `vbb_stock_*.mp4` de un build anterior tenían nombres que ya no correspondían a
  su contenido real (ej. "vbb_stock_rosemary" era perejil, no romero; "vbb_stock_derm" era una escena
  social con vino, no un consultorio; "vbb_stock_sunscreen" era una mujer en bikini en la playa, tono
  impropio para el canal). El nombre del archivo no garantiza el contenido si vino de un fetch de stock.
- **2026-07-20 (vfh490rruvab):** una ventana `FullVisual` única y larga (>60-90s) que cicla varias imágenes
  sin relación con el sub-tema exacto que se está narrando en cada momento produce mismatches frecuentes
  cuando esa ventana cubre VARIOS métodos/pasos distintos del guion. Mejor partir en una ventana por
  sub-tema (aunque dure poco, 30-45s) que una ventana grande "genérica" para todo un bloque.
- **2026-07-20 (vbb0rdkrfduo):** fuera de los tramos de avatar, ninguna toma puede durar más de 3 segundos.
  El primer minuto se diseña frase por frase en una cuadrícula de retención; debe alternar avatar full,
  stock full y componentes variados. El stock tiene que mostrar el sujeto, la acción y el contexto exactos
  de la frase, sin logos, y no se repite un mismo template o visual genérico como recurso dominante.
- **2026-07-20 (vbb0rdkrfduo, corrección posterior):** la regla de 3 segundos NO es un techo rígido. La
  duración de cada toma la manda la frase y su función; un componente debe permanecer el tiempo necesario
  para leerse y entenderse. Priorizar calce semántico y temporal exacto sobre velocidad. No cortar una idea
  a mitad ni mostrar el visual de la frase siguiente. No repetir clips de stock dentro del mismo video.
- **2026-07-20 (vbb0rdkrfduo, nuevo guion):** para remedios caseros y naturales, evitar enfoques genéricos.
  Usar una historia concreta como cold-open, recetas cuantificadas paso a paso, modos de uso, errores,
  contraindicaciones y señales de alarma. Se puede tomar la estructura de retención de un video viral, pero
  las afirmaciones médicas deben verificarse y reescribirse; nunca copiar sus exageraciones como hechos.
- **2026-07-20 (dirección creativa):** las referencias y preferencias creativas del creador son un punto de
  partida, no una jaula. El agente debe actuar como director autónomo, proponer y ejecutar soluciones mejores
  cuando las detecte. Las únicas rejas son seguridad médica, precisión, requisitos técnicos duros y auditoría.
- **2026-07-22:** el largo objetivo de los guiones del canal pasa a ser **más de 20.000 caracteres**; medirlo
  con un comando antes de entregar y desarrollar con evidencia, porqués y objeciones, nunca con relleno.
- **2026-07-23:** evitar beneficios enumerados como clase (“beneficio uno, beneficio dos”). Para público mayor,
  convertirlos en revelaciones dentro de una historia serializada y polémica, con objetos, dinero, familia,
  edadismo, engaños y detalles sensoriales. Mantener loops sobre qué le ocurre al protagonista. Usar casos
  publicados o marcar la dramatización como hipotética; nunca inventar un paciente y presentarlo como real.
- **2026-07-23:** tender puentes a la descripción del video dejando allí fichas imprimibles, medidas completas,
  listas de compras o rutinas por días. Pagar siempre la promesa. Nunca ocultar de la voz una dilución,
  contraindicación, prueba de tolerancia o señal de alarma necesaria para usar una receta sin daño.
- **2026-07-23:** después del cold-open, nombrar inmediatamente el tema principal, el ingrediente, la herida
  y el resultado que recibirá el espectador. La historia no puede demorar la tesis. Tomar de ejemplos virales
  la cadencia, polémica, contraste y loops, pero verificar todo y descartar promesas médicas falsas.
