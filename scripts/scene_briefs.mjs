// scene_briefs.mjs — convierte los momentos del detector en ENCARGOS listos para el fan-out.
//
//   node scripts/detect_scenes.mjs <slug> --top 12 --json > _escenas_<slug>.json
//   node scripts/scene_briefs.mjs <slug> [--kit FedererKit] [--comp MainX] [--total 38000]
//
// Para qué: el agente principal NO tiene que redactar 12 consignas a mano (ahí se le van los tokens
// y además le salen desparejas). Esto emite un briefing AUTOCONTENIDO por momento — el agente los
// pasa tal cual a un subagente cada uno, en paralelo.
//
// Cada encargo trae: la frase exacta, la ventana al ms Y en frames, la forma detectada, el
// tratamiento por capas, el contrato del componente, la vara de calidad y cómo se verifica.
// Lo que NO trae es libertad para inventar el nombre del archivo o los props: eso se fija acá,
// porque si cada subagente elige el suyo el agente principal no puede integrarlos después.

import { readFileSync, existsSync, writeFileSync } from "fs";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/scene_briefs.mjs <slug> [--kit X] [--comp Y] [--total N]"); process.exit(2); }
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const KIT = arg("--kit", "FedererKit");
const COMP = arg("--comp", "");
const TOTAL = arg("--total", "");
const FPS = 30;

const jf = [`_escenas_${slug}.json`, `public/_escenas_${slug}.json`].find((p) => existsSync(p));
if (!jf) { console.error(`✗ falta _escenas_${slug}.json — corré primero:\n   node scripts/detect_scenes.mjs ${slug} --top 12 --json > _escenas_${slug}.json`); process.exit(1); }
const { elegidos = [] } = JSON.parse(readFileSync(jf, "utf8"));
if (!elegidos.length) { console.error("✗ el detector no eligió ningún momento"); process.exit(1); }

// La VARA. No es un adjetivo ("que quede lindo"): es un componente real que el creador aprobó,
// con lo que lo hace bueno explicitado. El subagente lo abre y lo mira antes de escribir.
const VARA = `
VARA DE CALIDAD — abrila y miralas ANTES de escribir una línea:
  src/FedererKit.tsx → FedOilCarousel  (el creador lo aprobó textualmente; es el piso, no el techo)
  Qué lo hace bueno, y es lo que se te pide igualar:
   · No es un cartel con texto: es una ESCENA con cámara. Push-in lento (1 → 1.055 en 240 frames)
     y micro-handheld con seno/coseno desfasados, para que respire.
   · Reacciona a la NARRACIÓN: el anillo gira libre y ATERRIZA en la tarjeta que el avatar nombra
     (easing cubic, una vuelta entera antes de frenar). El foco es un prop, no un hardcode.
   · Está en CAPAS con tiempos propios: fondo, anillo, tarjetas, foco, viñeta — cada una entra
     cuando le toca, no todo junto en el frame 0.
   · Es reusable: props tipados (cards, focus, kicker, accent, spinSec, landF), sin nada del video
     de aquel entonces adentro.`;

const REGLAS = `
REGLAS DURAS (no negociables):
  · ANCLADO AL MS: la escena arranca y termina en la ventana que te doy. Nada de "más o menos".
  · CAPAS con tiempos distintos. Si todo aparece junto en el frame 0, está mal hecho.
  · CERO texto quemado en imágenes: el texto va como capa del componente.
  · Nada de filtros retro, viñetas pesadas ni temblor de cámara falso. El movimiento es sutil.
  · Props TIPADOS y sin datos de este video hardcodeados: el componente tiene que servir al próximo.
  · Remotion: usá useCurrentFrame/useVideoConfig/interpolate/spring. Nada de setTimeout ni CSS anim.
  · Si necesitás un PNG sin fondo (un frasco, una hoja), pedílo como prop \`src\` — no lo generes vos.`;

const briefs = elegidos.map((m, i) => {
  const fa = Math.round((m.ms / 1000) * FPS), fb = Math.round((m.fin / 1000) * FPS);
  const nombre = `Scene${String(i + 1).padStart(2, "0")}${m.forma.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase())}`;
  return {
    n: i + 1, nombre, forma: m.forma, tc: m.tc, ms: m.ms, fin: m.fin, frameA: fa, frameB: fb,
    texto: `ENCARGO ${i + 1}/${elegidos.length} — UNA escena, la tuya. No toques el resto del video.

MOMENTO  ${m.tc}  ·  ${m.dur}s  ·  frames ${fa}–${fb}  (ms ${m.ms}–${m.fin})
EL AVATAR DICE, TEXTUAL:
  "${m.frase}"

FORMA DETECTADA: ${m.forma}${m.formas.length > 1 ? `  (+ ${m.formas.filter((x) => x !== m.forma).join(", ")})` : ""}
TRATAMIENTO PEDIDO:
  ${m.trata}
  Esto es un PISO, no un molde. Si se te ocurre algo mejor para ESTA frase, hacelo — pero que sea
  más rico, nunca más pobre.
${VARA}
${REGLAS}

CONTRATO (fijo, para que el agente principal pueda integrarlo sin adivinar):
  · Archivo   : src/scenes_${slug}/${nombre}.tsx
  · Export    : export const ${nombre}: React.FC<${nombre}Props>
  · Props     : tipados y exportados como ${nombre}Props. Incluí SIEMPRE durationInFrames?: number.
  · Kit       : reusá lo que ya exista en src/${KIT}.tsx (colores, tipografías, helpers). No dupliques.
  · Assets    : si precisás imágenes, declaralas como props y devolvé la LISTA de las que hacen falta.

VERIFICACIÓN (obligatoria, es tu escena y es tu responsabilidad):${COMP && TOTAL ? `
  node scripts/grid.mjs ${slug} ${COMP} ${TOTAL} 6 --from ${fa} --to ${fb}
  (o: gh workflow run stills.yml -f slug=${slug} -f comp_id=${COMP} -f total_frames=${TOTAL} -f count=6 -f from=${fa} -f to=${fb})` : `
  gh workflow run stills.yml -f slug=${slug} -f comp_id=<COMP_ID> -f total_frames=<TOTAL> -f count=6 -f from=${fa} -f to=${fb}`}
  Bajá esos frames y MIRALOS. Chequeá: se lee todo · nada pisado ni cortado · las capas entran
  escalonadas y no de golpe · en el último frame la escena ya resolvió. Si algo está mal, corregí
  y volvé a mirar. No devuelvas una escena que no viste renderizada.

DEVOLVÉ (corto, esto vuelve al contexto del principal — NO pegues el archivo entero):
  · ruta del archivo y nombre del export
  · la firma de props (una línea)
  · cómo instanciarlo para ESTE momento (el JSX exacto, con sus valores)
  · lista de assets que hay que generar, si hay
  · qué viste en los frames y qué corregiste`,
  };
});

const out = `_briefs_${slug}.json`;
writeFileSync(out, JSON.stringify({ slug, kit: KIT, briefs }, null, 2), "utf8");

console.log(`── ENCARGOS · ${slug} · ${briefs.length} escenas ──\n`);
briefs.forEach((b) => console.log(`  ${String(b.n).padStart(2)}. ${b.nombre.padEnd(26)} ${b.tc}  frames ${b.frameA}–${b.frameB}`));
console.log(`\n  → ${out}`);
console.log(`\nFAN-OUT: un subagente por encargo, TODOS en paralelo, con Opus. Pasale el campo .texto TAL CUAL.`);
console.log(`Cuando vuelvan, integrá los ${briefs.length} en el build y recién ahí corré density_gate.`);
if (!COMP || !TOTAL) console.log(`\n  (tip: pasá --comp <CompId> --total <frames> y los encargos salen con el comando de verificación ya armado)`);
