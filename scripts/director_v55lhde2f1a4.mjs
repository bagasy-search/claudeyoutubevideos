import fs from "node:fs";
import path from "node:path";

const slug = "v55lhde2f1a4";
const skeletonPath = `_v3/${slug}_skel.json`;
const planPath = `_v3/${slug}_plan.json`;
const beatsPath = `_v3/${slug}_beats.json`;
const shotsPath = `public/broll/dense_${slug}.json`;

const beats = JSON.parse(fs.readFileSync(skeletonPath, "utf8"));
const totalSec = Math.max(...beats.map((b) => b.ms / 1000 + b.dur));

const sectionDefs = [
  {
    id: "hook",
    inicio: 0,
    fin: 72,
    objetivo: "Confirmar el truco en los primeros segundos, mostrar sauce + frasco y abrir los loops del límite, el oxígeno y la planta madre.",
  },
  {
    id: "mecanismo",
    inicio: 72,
    fin: 235,
    objetivo: "Explicar por qué el sauce enraíza con facilidad y separar observación útil de promesa milagrosa.",
  },
  {
    id: "receta",
    inicio: 235,
    fin: 455,
    objetivo: "Dar la receta física completa con manos, medidas, agua caliente, colado y remojo.",
  },
  {
    id: "prueba_controlada",
    inicio: 455,
    fin: 675,
    objetivo: "Construir la demostración A/B y revelar por qué demasiado agua pudre el esqueje.",
  },
  {
    id: "plantado_y_aclimatacion",
    inicio: 675,
    fin: 875,
    objetivo: "Mostrar sustrato aireado, cámara de humedad, formación de raíces y trasplante gradual.",
  },
  {
    id: "limites_y_ciencia",
    inicio: 875,
    fin: 1055,
    objetivo: "Ordenar especies por dificultad, explicar IBA/ácido salicílico y dar límites honestos sin conspiración.",
  },
  {
    id: "errores_y_cierre",
    inicio: 1055,
    fin: totalSec + 0.01,
    objetivo: "Pagar el error de la planta madre, cerrar con errores secundarios, recap accionable, comentarios y teaser.",
  },
];

const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const isNumeric = (p) =>
  /\b(\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|diez|doce|catorce|veinte|veinticuatro|litro|gal[oó]n|cent[ií]metro|hora|d[ií]a|semana|mes|d[oó]lar|taza|por ciento)\b/i.test(
    p,
  );

const componentFor = (phrase, indexInSection) => {
  const p = normalize(phrase);
  if (/no bebas|seguridad|enferma|invasora|protegida|herbicida|permiso/.test(p)) return "SafetyGrid";
  if (/^primero|^segundo|^tercero|^cuarto|^quinto|^sexto|^septimo/.test(p)) return "ProcessSteps";
  if (/grupo uno|grupo dos|grupo tres|grupo cuatro/.test(p)) return "RuleNumberScene";
  if (/agua sola|letra a|letra b|dos frascos|control|misma planta|compar/.test(p)) return "OptionCompare";
  if (/facil|dificil|tierno|semil|madera dura|leños|interior/.test(p)) return "SelectiveCompare";
  if (/industria|producto|polvo numero|gel numero|otra botella|vivero/.test(p)) return "CostCumulative";
  if (/oxigeno|tejido|celula|vascular|auxina|salicil|iba|nudo|callo/.test(p)) return indexInSection % 2 ? "CrossSection" : "DiagramBoard";
  if (/humedad no significa|verde no significa|la rama correcta|biologia viene|producto viene|no falta hormona|falta aire/.test(p)) return "KineticQuote";
  if (/error|mito|no mezcles|no confundas|no reemplaza|no existe/.test(p)) return "SplitList";
  if (isNumeric(phrase)) return indexInSection % 2 ? "StatBig" : "BarCompare";
  if (indexInSection % 9 === 4) return "Checklist";
  return null;
};

const stockVisual = (phrase, serial) => {
  const p = normalize(phrase);
  const candidates = [
    [/sauce|salix/, ["willow tree young branches close up", "macro real de ramas jóvenes de sauce en una ribera"]],
    [/raiz|enraiz/, ["plant cuttings growing white roots in glass water macro", "macro real de raíces blancas naciendo de esquejes en agua"]],
    [/frasco|botella|recipiente|vaso/, ["glass jars with plant cuttings on rustic workbench", "frascos de vidrio con esquejes sobre mesa rústica"]],
    [/tijera|corte|corta|cortar/, ["hands cutting green plant stem with pruning shears close up", "manos cortando un tallo verde con tijera limpia"]],
    [/hoja|flor|fruto/, ["hands removing lower leaves from plant cutting", "manos retirando hojas inferiores de un esqueje"]],
    [/hierve|agua caliente|vierte|calor/, ["pouring hot water into glass jar on rustic kitchen table", "agua caliente vertida en frasco sobre mesa de campo"]],
    [/cuela|colador/, ["hands straining herbal infusion through metal sieve", "manos colando una infusión vegetal"]],
    [/etiqueta|fecha|anota|marca/, ["hands labeling glass jars in garden shed", "manos etiquetando frascos en un galpón"]],
    [/albahaca/, ["basil cuttings in water roots close up", "esquejes reales de albahaca en agua"]],
    [/menta/, ["mint cuttings in glass water close up", "esquejes reales de menta en un vaso"]],
    [/coleo|poto|hiedra|interior/, ["houseplant cuttings propagating in glass jars window", "esquejes de plantas de interior junto a una ventana"]],
    [/romero|lavanda|hortensia/, ["rosemary lavender cuttings propagation hands", "manos preparando esquejes semileñosos de romero"]],
    [/vid|higuera|granado|madera dura/, ["hardwood cuttings planted in nursery pots close up", "estacas leñosas plantadas en macetas de vivero"]],
    [/manzano|citrico|frutal|injerto|acodo/, ["fruit tree grafting hands close up orchard", "manos injertando un árbol frutal en huerto"]],
    [/sustrato|perlita|tierra|medio|maceta/, ["hands mixing potting soil and perlite propagation tray", "manos mezclando sustrato y perlita para esquejes"]],
    [/bolsa|campana|camara|humedad/, ["clear plastic humidity dome over plant cuttings", "campana transparente de humedad sobre esquejes"]],
    [/ventana|luz|sol|mediodia/, ["plant cuttings near bright window indirect sunlight", "esquejes con luz indirecta junto a una ventana"]],
    [/bacteria|hongo|podrid|turbia|marron/, ["rotting plant cutting in cloudy water macro", "esqueje podrido dentro de agua turbia"]],
    [/vivero|plantines/, ["plant nursery propagation trays workers hands", "bandejas reales de propagación en vivero"]],
    [/polvo|gel|hormona|producto/, ["rooting hormone powder jar and plant cutting hands", "frasco de hormona de enraizamiento junto a esqueje"]],
    [/miel|canela|aspirina|vinagre/, ["honey cinnamon aspirin vinegar on rustic table", "miel canela aspirina y vinagre sobre mesa de madera"]],
    [/temprano|hidratada|planta madre/, ["gardener taking fresh cuttings early morning dew", "jardinero tomando esquejes frescos al amanecer"]],
    [/galpon/, ["rustic wooden garden shed workbench hand tools", "galpón de madera con banco y herramientas de mano"]],
    [/ribera|orilla|suelo|campo/, ["willow trees beside river countryside", "sauces reales junto a una ribera rural"]],
  ];
  for (const [re, pair] of candidates) {
    if (re.test(p)) return { query: pair[0], muestra: pair[1] };
  }
  const fallbacks = [
    ["hands preparing green plant cuttings on rustic table", "manos preparando esquejes verdes sobre mesa rústica"],
    ["macro plant stem node and leaves gardening", "macro real de nudo, tallo y hojas"],
    ["gardener inspecting plant cutting roots close up", "jardinero revisando raíces de un esqueje"],
    ["plant propagation jars and pots greenhouse", "frascos y macetas de propagación en invernadero"],
  ];
  const pair = fallbacks[serial % fallbacks.length];
  return { query: pair[0], muestra: pair[1] };
};

const personalRe =
  /\b(yo|voy|vamos|me |mi |mira|aquí|aqui|ahora sí|ahora si|recibo|prefiero|necesito|te muestro|cuéntame|dime|nos vemos)\b/i;

let clipSerial = 1;
const shots = [];
const outBeats = [];
const plan = {
  slug,
  duracion: totalSec,
  anchors: ["esquejes", "ramas de sauce", "agua de sauce", "propagación de plantas"],
  musica: "calmo rústico, cuerdas acústicas muy suaves, sin percusión moderna",
  modo: "avatar + stock real + componentes; cero imágenes IA",
  personal: [],
  secciones: [],
};

for (const def of sectionDefs) {
  const inSection = beats.filter((b) => b.ms / 1000 >= def.inicio && b.ms / 1000 < def.fin);
  const momentos = [];
  const usedComponents = new Set();
  console.log(`DIRECTOR PASS ${def.id}: ${inSection.length} momentos · ${def.objetivo}`);

  for (let i = 0; i < inSection.length; i++) {
    const b = inSection[i];
    const explicitComponent = componentFor(b.phrase, i);
    // En modo avatar Amish los componentes son utilitarios, no la pantalla por defecto.
    // Curamos aproximadamente uno de cada cuatro momentos y dejamos respirar stock + presentador.
    const forceComponent =
      explicitComponent && i % 3 === 1
        ? explicitComponent
        : !explicitComponent && i % 11 === 4
          ? "Checklist"
          : null;
    const personal = personalRe.test(b.phrase);
    const avatarFull =
      !forceComponent &&
      (b.ms === 0 || i % 4 === 0 || i % 7 === 2 || personal || b.ms / 1000 > totalSec - 15);

    let tipo = "clip";
    let kind = null;
    let muestra;
    let query = null;
    let src = "stock";

    if (forceComponent) {
      tipo = "componente";
      kind = forceComponent;
      usedComponents.add(kind);
      muestra = `${kind}: ${b.phrase.replace(/\s+/g, " ").trim()}`;
      src = "component";
    } else if (avatarFull) {
      muestra = "Levi Lapp a cámara, pantalla completa, push-in Ken Burns lento";
      src = "avatar";
    } else {
      const visual = stockVisual(b.phrase, clipSerial);
      query = visual.query;
      muestra = visual.muestra;
      const name = `d${String(clipSerial).padStart(3, "0")}`;
      shots.push({ name, query, type: "video", orientation: "landscape" });
      clipSerial++;
      b.asset = `broll/${slug}/${name}.mp4`;
    }

    const porque =
      src === "avatar"
        ? personal
          ? "La frase es personal o demostrativa y gana autoridad con Levi a cámara."
          : "Ventana de avatar para sostener presencia y superar el piso del 28% sin PiP."
        : src === "component"
          ? "La frase contiene una cifra, comparación, regla, proceso o límite que se entiende mejor con el kit."
          : "La acción es concreta y filmable; stock real literal evita relleno abstracto.";

    const momento = {
      id: b.name,
      ms: b.ms,
      dice: b.phrase,
      muestra,
      tipo,
      kind,
      seg: b.dur,
      porque,
      personal,
      avatarFull,
      src,
      query,
      asset: b.asset || null,
    };
    momentos.push(momento);
    if (personal) plan.personal.push({ id: b.name, ms: b.ms, dice: b.phrase, motivo: "primera persona o demostración" });

    outBeats.push({
      ...b,
      section: def.id,
      desc: muestra,
      queries: query ? [query, query] : [],
      query,
      anchor: "plant cuttings",
      shot: /macro|detalle|ra[ií]z|nudo/i.test(muestra) ? "detalle" : /manos/i.test(muestra) ? "manos" : "medio",
      src,
      kind,
      avatarFull,
      personal,
      asset: b.asset || null,
    });
  }

  // Asegura dos familias del kit por sección sin convertir frases arbitrarias:
  if (usedComponents.size < 2) {
    const candidates = momentos.filter((m) => m.src === "stock" && !m.personal).slice(0, 2 - usedComponents.size);
    const fallbackKinds = ["KineticHeadline", "AnnotatedImage"];
    for (let i = 0; i < candidates.length; i++) {
      const m = candidates[i];
      m.tipo = "componente";
      m.kind = fallbackKinds[i];
      m.src = "component";
      m.muestra = `${fallbackKinds[i]}: ${m.dice}`;
      m.porque = "Frase-ancla de la sección presentada con jerarquía serif del kit.";
      const ob = outBeats.find((b) => b.name === m.id);
      Object.assign(ob, { src: "component", kind: m.kind, desc: m.muestra, queries: [], query: null, asset: null });
      usedComponents.add(m.kind);
    }
  }

  plan.secciones.push({ ...def, fin: Math.min(def.fin, totalSec), momentos });
}

// Deduplica queries consecutivas variando ángulo para obtener una biblioteca real amplia.
const seen = new Map();
for (const shot of shots) {
  const n = seen.get(shot.query) || 0;
  seen.set(shot.query, n + 1);
  if (n % 3 === 1) shot.query += " close up";
  if (n % 3 === 2) shot.query += " hands";
}

fs.mkdirSync(path.dirname(planPath), { recursive: true });
fs.mkdirSync(path.dirname(shotsPath), { recursive: true });
fs.writeFileSync(planPath, JSON.stringify(plan, null, 2));
fs.writeFileSync(beatsPath, JSON.stringify(outBeats, null, 2));
fs.writeFileSync(shotsPath, JSON.stringify(shots, null, 2));

const moments = plan.secciones.flatMap((s) => s.momentos);
const bySrc = Object.groupBy(moments, (m) => m.src);
const avatarSec = (bySrc.avatar || []).reduce((a, m) => a + m.seg, 0);
const compSec = (bySrc.component || []).reduce((a, m) => a + m.seg, 0);
const durations = moments.map((m) => m.seg).sort((a, b) => a - b);
const q = (p) => durations[Math.min(durations.length - 1, Math.floor(p * durations.length))];
console.log(
  JSON.stringify(
    {
      totalSec,
      sections: plan.secciones.length,
      moments: moments.length,
      stockShots: shots.length,
      avatarPct: +(avatarSec / totalSec * 100).toFixed(1),
      componentPct: +(compSec / totalSec * 100).toFixed(1),
      personalMoments: plan.personal.length,
      medianSec: q(0.5),
      p75Sec: q(0.75),
      pctAtLeast5: +(durations.filter((d) => d >= 5).length / durations.length * 100).toFixed(1),
    },
    null,
    2,
  ),
);
