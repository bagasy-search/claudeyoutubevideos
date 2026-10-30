# Blanquito: stickman 3D de arcilla/vinilo, 100 % por código

Personaje blanco tipo Blender (cabeza grande, cuerpo de tubos de goma, mitones y pantuflas), hecho con Remotion,
`@remotion/three`, R3F y three. Es determinista por cuadro (no usa `Math.random` ni tiempo real) y no lleva texturas
ni imágenes generadas. Se calcó de `ref_stickman.jpg` (personaje y estudio) y `ref_expresiones.jpg` (hoja 4×3).

## Importar

El kit vive en `video2/src/stickman3d/` (copia en `D:/claude-brain/plantillas/stickman3d/kit/`).

```tsx
import { Stickman, Estudio, StickmanEnFondo } from "../stickman3d";

// 1) En el estudio azul de la referencia (fondo + luces + cámara ya armados)
<Estudio w={1920} h={1080} camara={{ pos: [0, 1.9, 10.5], mira: [0, 1.8, 0], fov: 26 }}>
  <Stickman x={-5} guion={[
    { t: 0, accion: "caminar", rotY: 90 },
    { t: 4, accion: "saludar", expr: "feliz", rotY: 0 },
    { t: 7, accion: "reir", expr: "carcajada" },
  ]} />
</Estudio>

// 2) Delante de cualquier foto (public/ o URL)
<StickmanEnFondo fondo="mi_video/cocina.jpg" horizonte={0.42} fov={50} dirLuz="izq"
  personajes={[{ piso: [0.7, 0.88], alto: 0.45, guion: [{ t: 0, accion: "explicar", expr: "contento" }] }]} />
```

## API de `<Stickman>`

| prop | qué hace |
|---|---|
| `x`, `z`, `rotY`, `escala` | dónde está parado en el piso (y = 0), hacia dónde mira (en grados; 0 = a cámara, 90 = hacia +x) y su tamaño. Alto parado ≈ 3,55 u. |
| `guion` | lista de pasos `{ t, accion, expr?, rotY?, objetivo?, mezcla?, mirada? }`. Cada paso arranca en el segundo `t` y se mezcla con el anterior en `mezcla` cuadros (10 por defecto). `caminar` y `correr` desplazan el cuerpo según `rotY`. |
| `pose` / `expr` | pose o expresión fija (ignoran el guion). `pose` acepta `POSES.x`; `expr` acepta un nombre o un objeto `Expresion`. |
| `mirada` | `"camara"` o `[x, y]` entre −1 y 1. |
| `boca` | amplitudes de la voz por cuadro (0–1) para el lip-sync. |
| `color`, `accesorios`, `semilla` | color del vinilo; `["gorra","anteojos","casco","monio"]`; la semilla cambia el parpadeo y el micro-movimiento. |
| `sombras`, `contacto`, `colorContacto` | sombra proyectada; fuerza y color de la mancha de contacto con el piso. |
| `cuadro` | fuerza un cuadro (para láminas). |

### `<StickmanEnFondo>`

- `fondo`: archivo o URL de la foto.
- `horizonte`: fila del horizonte, de 0 a 1.
- `fov`: lente de la foto; 50 por defecto, 55–60 para fotos de celular.
- `personajes[]`: cada uno con `piso` (punto en la imagen donde apoya los pies, de 0 a 1), `alto` (fracción del cuadro) y las mismas props que `<Stickman>`.
- `dirLuz`: `izq`, `der`, `arriba` o un vector.
- `tinte`, `piso` y `brillo`: `"auto"` los mide de la foto.
- `sombra` y `contacto`: fuerza de la sombra proyectada y de la mancha de contacto.
- Opcionales: `oscurecer`, `desenfoque`.

La cámara se calibra con el horizonte y el personaje queda mirando a cámara: `rotY` se suma a eso.

## Expresiones (`EXPRESIONES`)

feliz · carcajada · contento · neutral · triste · llorando · enojado · furioso · sorprendido · espantado · asustado ·
pensativo · confundido · asqueado · nervioso · aburrido · dormido · enamorado · picaro · bostezo · hablando…
(lista completa: `LISTA_EXPRESIONES`).

**Agregar una:** sumá en `expresiones.ts` una línea `nombre: expr({ ojos: {...}, bocaCurva, bocaAbierta, ... })`.
Los parámetros del ojo (abierto, curva, tam, párpado, pupila, cejas) y de la boca (curva, apertura, ancho, lengua,
dientes) están documentados en el tipo `ParamOjo`/`Expresion`. Extras: `rubor`, `lagrimas`, `corazones`, `zzz`,
`sudor`. Revisala en la lámina `StickmanCaras`.

## Acciones (`ACCIONES`)

idle · quieto · pose_ref · saludar · saludar_dos_manos · caminar · correr · saltar · festejar · señalar · explicar ·
pensar · encogerse_de_hombros · facepalm · reir · enojado_pisoton · cruzarse_de_brazos · asustarse ·
caerse_y_levantarse · sentarse · tipear · cargar_caja · empujar · aplaudir · bailar · dormir_de_pie · llorar ·
mirar_reloj. Poses sueltas en `POSES`: parado, ref, saludo_carcajada, cabizbajo, brazos_cruzados, temblando,
manos_cabeza, rascarse, pensar, bostezar, pulgar_arriba, manos_cadera, salto_alegria, panza_risa.

**Agregar una:** en `acciones.ts`, `nombre: { pose: (t, c) => Pose, velocidad?, respira? }`.

- Partí de una pose con `pose({ raiz, torso, cabeza, manoI: MD(pos, polo, forma, giro), pieI: pie(...) })`. Las manos y los pies van en coordenadas de la raíz; el codo y la rodilla los resuelve el IK con el polo.
- Animá con `suave`, `resorte` y `osc`.
- Envolvé con `conPeso(...)` para que nunca quede congelada.
- Revisala con la composición `StickmanAccion` (`--props '{"accion":"nombre"}'`) en una tira de 8 stills.

## Composiciones (entry `src/index_stickman3d.tsx`)

- `StickmanRef`: la referencia en estudio.
- `StickmanCaras`: todas las expresiones.
- `StickmanHoja`: hoja 4×3.
- `StickmanVuelta`: vuelta de 0 a 180°.
- `StickmanPoses`: las acciones.
- `StickmanAccion`: una acción.
- `StickmanEnFondo`: 3 fotos.
- `StickmanDemo`: 20 s.

Para montarlas en otro Root: `<RootStickman />`.

## Reglas

- Stills locales sólo con `still.mjs`; video SIEMPRE en el farm.
- Las luces siempre montadas.
- Nada de filtros, grano ni viñeta.
- Las fotos de fondo nunca van al repo público.

## Láminas finales

Están en `laminas/`:

- `vuelta_*.png`: referencia contra código.
- `hoja_*.png`: hoja 4×3.
- `caras_*.png`
- `enfondo_*.png`
- `demo_tira_*.png`
