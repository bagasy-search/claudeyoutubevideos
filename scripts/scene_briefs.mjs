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
const KIT_ID = arg("--kit", "");          // id del kit en kits.json (ej: federer-fluid, abuela-rosa)
const KIT = arg("--kitfile", "") || "FedererKit";  // archivo del kit, para el contrato de imports
const COMP = arg("--comp", "");
const TOTAL = arg("--total", "");
const FPS = 30;
// EXPERIMENTO: N de los encargos salen SIN tratamiento prescrito (sólo la frase, la ventana y la
// vara). Por qué: la taxonomía del detector está hecha con las ideas que el creador ya usó, así que
// por construcción no puede superarlo — devuelve sus mismas movidas, mejor colocadas. Los encargos
// LIBRES son el único lugar donde puede aparecer algo que no se le ocurrió a nadie. Se reparten
// intercalados para que no queden todos en la parte aburrida del video y la comparación sea justa.
const LIBRES = +arg("--libres", "0") || 0;

const jf = [`_escenas_${slug}.json`, `public/_escenas_${slug}.json`].find((p) => existsSync(p));
if (!jf) { console.error(`✗ falta _escenas_${slug}.json — corré primero:\n   node scripts/detect_scenes.mjs ${slug} --top 12 --json > _escenas_${slug}.json`); process.exit(1); }
const { elegidos = [] } = JSON.parse(readFileSync(jf, "utf8"));
if (!elegidos.length) { console.error("✗ el detector no eligió ningún momento"); process.exit(1); }

// La VARA. No es un adjetivo ("que quede lindo"): es un componente REAL que el creador aprobó, con
// lo que lo hace bueno explicitado. Sale del kit (kits.json → vara), no está hardcodeada: cada canal
// tiene la suya, porque la de Federer es médica y oscura y no sirve de referencia para, digamos, una
// cocina nostálgica.
//
// CANAL NUEVO: todavía no tiene ejemplar aprobado (problema del huevo y la gallina). En ese caso se
// usa el mejor que haya en cualquier kit, pero declarado como referencia de OFICIO, no de LOOK — las
// mecánicas (capas, cámara, easing, reaccionar a la narración) se transfieren entre estéticas; la
// paleta y el tono salen de la memoria del canal y de su kit.
function leerVara(kitId) {
  try {
    const reg = JSON.parse(readFileSync("kits.json", "utf8")).kits || [];
    const mio = reg.find((k) => k.id === kitId);
    if (mio?.vara) return { v: mio.vara, propia: true };
    const prestada = reg.find((k) => k.vara?.aprobada_por_el_creador);
    if (prestada) return { v: prestada.vara, propia: false, de: prestada.label || prestada.id };
  } catch {}
  return null;
}
const varaInfo = leerVara(KIT_ID);
const VARA = !varaInfo ? `
VARA DE CALIDAD: este kit todavía no tiene un ejemplar aprobado. El piso entonces lo ponés vos:
  una ESCENA con capas y tiempos propios, con cámara (un push-in sutil, nada estático), que REACCIONE
  a lo que dice el avatar en ese momento, y con props tipados para que sirva en el próximo video.
  Un cartel con texto encima de una foto NO cumple.` : `
VARA DE CALIDAD — abrilo y miralo ANTES de escribir una línea:
  ${varaInfo.v.archivo} → ${varaInfo.v.componente}${varaInfo.propia ? "  (aprobado por el creador para ESTE canal)" : `  ⚠ es de otro canal (${varaInfo.de})`}
  Qué lo hace bueno, y es lo que se te pide igualar:
  ${varaInfo.v.por_que}${varaInfo.propia ? "" : `
  ⛔ COPIÁ EL OFICIO, NO EL LOOK. Ese componente es de otro canal: su paleta, tipografía y clima NO
     van acá. Lo que se transfiere son las MECÁNICAS (capas con tiempos propios, cámara viva, animar
     en respuesta a la narración, props tipados). El look sale de la memoria de ESTE canal y su kit.`}`;

const REGLAS = `
REGLAS DURAS (no negociables):
  · ANCLADO AL MS: la escena arranca y termina en la ventana que te doy. Nada de "más o menos".
  · CAPAS con tiempos distintos. Si todo aparece junto en el frame 0, está mal hecho.
  · CERO texto quemado en imágenes: el texto va como capa del componente.
  · Nada de filtros retro, viñetas pesadas ni temblor de cámara falso. El movimiento es sutil.
  · Props TIPADOS y sin datos de este video hardcodeados: el componente tiene que servir al próximo.
  · Remotion: usá useCurrentFrame/useVideoConfig/interpolate/spring. Nada de setTimeout ni CSS anim.
  · Si necesitás un PNG sin fondo (un frasco, una hoja), pedílo como prop \`src\` — no lo generes vos.`;

// cuáles van libres: intercalados a lo largo de la lista, no todos juntos
const idxLibres = new Set();
if (LIBRES > 0) {
  const paso = elegidos.length / Math.min(LIBRES, elegidos.length);
  for (let k = 0; k < Math.min(LIBRES, elegidos.length); k++) idxLibres.add(Math.floor(k * paso + paso / 2));
}

const briefs = elegidos.map((m, i) => {
  const fa = Math.round((m.ms / 1000) * FPS), fb = Math.round((m.fin / 1000) * FPS);
  const libre = idxLibres.has(i);
  const nombre = `Scene${String(i + 1).padStart(2, "0")}${libre ? "Libre" : m.forma.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase())}`;
  const bloqueTrat = libre
    ? `SIN TRATAMIENTO PRESCRITO — a propósito.
  No te vamos a decir qué hacer con este momento. Leé la frase, entendé qué está pasando ahí
  dramáticamente, y diseñá la escena que ESA frase pide. Puede ser cualquier cosa mientras esté
  a la altura de la vara: una metáfora visual, una construcción por capas, un cambio de escala,
  lo que se te ocurra. Si tu idea es mejor que "poner una tarjeta con el texto", vas bien.
  (Este encargo es parte de una prueba: la mitad va dirigida y la mitad libre, para ver de dónde
  salen las mejores escenas. Jugátela.)`
    : `TRATAMIENTO PEDIDO:
  ${m.trata}
  Esto es un PISO, no un molde. Si se te ocurre algo mejor para ESTA frase, hacelo — pero que sea
  más rico, nunca más pobre.`;
  return {
    n: i + 1, nombre, forma: libre ? "libre" : m.forma, libre, tc: m.tc, ms: m.ms, fin: m.fin, frameA: fa, frameB: fb,
    texto: `ENCARGO ${i + 1}/${elegidos.length} — UNA escena, la tuya. No toques el resto del video.

MOMENTO  ${m.tc}  ·  ${m.dur}s  ·  frames ${fa}–${fb}  (ms ${m.ms}–${m.fin})
EL AVATAR DICE, TEXTUAL:
  "${m.frase}"

${libre ? "" : `FORMA DETECTADA: ${m.forma}${m.formas.length > 1 ? `  (+ ${m.formas.filter((x) => x !== m.forma).join(", ")})` : ""}\n`}${bloqueTrat}
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
briefs.forEach((b) => console.log(`  ${String(b.n).padStart(2)}. ${b.nombre.padEnd(26)} ${b.tc}  frames ${b.frameA}–${b.frameB}${b.libre ? "   ← LIBRE" : ""}`));
console.log(`\n  → ${out}`);
console.log(`\nFAN-OUT: un subagente por encargo, TODOS en paralelo, con Opus. Pasale el campo .texto TAL CUAL.`);
console.log(`Cuando vuelvan, integrá los ${briefs.length} en el build y recién ahí corré density_gate.`);
if (!COMP || !TOTAL) console.log(`\n  (tip: pasá --comp <CompId> --total <frames> y los encargos salen con el comando de verificación ya armado)`);
