# Imágenes con gpt-image-2 (calidad alta) — cuándo y cómo

> Se activa por video (campo `img_engine=gptimage`) o por canal (memoria §4). Cuando está activo,
> las imágenes IA se generan con **gpt-image-2**, NO con Modal. Da fotos mucho más realistas y con
> mejor texto/diagramas. Este doc es la fórmula de uso.

## El motor

`node gen_gptimage.mjs <lista.json> [outDir=public/img] [size=1792x1008] [quality=low]`

- Modelo **gpt-image-2**, calidad **low** (barata y suficiente), **1792×1008** (16:9 nativo).
- Lee `OPENAI_API_KEY` del `.env`. Saltea las que ya existen. Reintenta solo en 429/5xx.
- ⚠️ **Rate-limit de la org en lotes grandes**: para 100+ imágenes se puede topar. Estrategias:
  (a) generá en tandas; (b) usá gpt-image-2 para las imágenes que MÁS importan (el presentador, los
  diagramas, la receta) y dejá el resto de fondo/genéricas en Modal (híbrido); (c) el script ya
  reintenta con backoff, dejalo correr.

## Formato de la lista (JSON)

```json
[
  { "name": "fe_romero_1", "prompt": "…descripción de la imagen…" },
  { "name": "fe_doctor_prepara", "prompt": "…", "ref": "public/ref_federer.png" }
]
```

- `name` = nombre del archivo (sin extensión). `prompt` = qué generar.
- `ref` (opcional) = **ruta a una foto de referencia**. Si está, usa `/images/edits` y **mantiene la
  identidad de esa foto** (misma cara/persona). Si no está, genera libre.

## ★ EL PRESENTADOR EN LAS IMÁGENES (lo más valioso, canales con avatar)

Para los canales médicos (Dr. Federer, etc.) el creador quiere ver **al presentador de verdad** en las
imágenes: preparando el remedio, mostrando la receta, fotos naturales "sacadas a mano". Cómo lograrlo:

1. **Sacá un frame del avatar** como referencia (una vez por video):
   `ffmpeg -y -i public/<slug>_opt.mp4 -vf "select=eq(n\,60)" -vframes 1 public/ref_<slug>.png`
   (elegí un frame donde se le vea bien la cara, de frente).
2. En la lista, las imágenes del presentador llevan `"ref": "public/ref_<slug>.png"` para que salga ÉL.
3. **Prompt = foto natural, no render**: describí una escena real y casera. Ej:
   *"Foto natural tomada con celular, luz de cocina cálida, el mismo médico de la referencia con bata
   ligera moliendo hojas de romero en un mortero de piedra sobre una mesa de madera, textura real,
   grano suave, NADA de aspecto 3D ni render, como una foto casera espontánea."*
4. Imperfecciones a propósito: "grano suave", "luz natural imperfecta", "encuadre casual" → parece foto
   real, no IA. (Ver `reference_video_prompt_imperfections`.)
5. **Coherencia**: describí al presentador SIEMPRE igual entre imágenes (misma bata, misma edad, mismo
   ambiente) + la `ref` fija la cara. Así todas las fotos parecen la misma persona el mismo día.

## Reglas

- Las imágenes con TEXTO/diagramas (receta, pasos, cantidades): gpt-image-2 es muy superior a Modal — usalo.
- Fondos genéricos sin presentador ni texto: podés dejarlos en Modal para no quemar rate-limit.
- Guardá la lista en un `.json` y corré el script; NO pegues prompts sueltos.
