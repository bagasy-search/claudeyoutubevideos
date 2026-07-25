/**
 * Empaqueta el build de Vite en un unico fragmento HTML autocontenido.
 *
 * El resultado no lleva <!doctype>, <html>, <head> ni <body>: es un fragmento
 * para incrustar (por ejemplo, como pagina publicada). Todo el CSS y el JS van
 * inline porque el entorno de publicacion bloquea cualquier request externa.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist-artifact')

const html = readFileSync(join(dist, 'index.html'), 'utf8')
const js = readFileSync(join(dist, 'bundle.js'), 'utf8')
const cssPath = join(dist, 'bundle.css')
const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : ''

// Cuerpo del index.html sin las etiquetas que el contenedor ya aporta.
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
if (!bodyMatch) throw new Error('no se encontro <body> en el build')

const body = bodyMatch[1]
  .replace(/<script[^>]*src=[^>]*><\/script>/gi, '')
  .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '')
  .trim()

// Un "</script>" dentro de un string del bundle cerraria la etiqueta antes de tiempo.
const safeJs = js.replace(/<\/script/gi, '<\\/script')

const out = `<title>Tower Defense — esqueleto jugable</title>
<style>
${css}
</style>
${body}
<script type="module">
${safeJs}
</script>
`

const target = join(root, 'dist-artifact', 'tower-defense.html')
mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, out, 'utf8')

const kb = (n) => `${(n / 1024).toFixed(0)} kB`
console.log(`escrito ${target}`)
console.log(`  css ${kb(css.length)} · js ${kb(safeJs.length)} · total ${kb(out.length)}`)
