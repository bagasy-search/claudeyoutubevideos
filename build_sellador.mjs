// build_sellador.mjs — DOCUMENTAL "SELLADOR PENETRANTE vs PELÍCULA" (Constructor Libre).
// Tema: la madera de afuera no se protege con lo que se PONE ENCIMA (barniz/sellador que
// forma película y se pela), sino con lo que se METE ADENTRO (aceite penetrante). Secreto
// de Don Vicente, viejo carpintero de botes. IMAGE-FIRST: 207 beats = 207 imágenes on-topic
// (gpt-image-2 low casual) en public/img/sel_s_*.png, anclado al ms EXACTO de
// public/captions_sellador.json (nunca por matemática). Componentes KIT PREMIUM (THEME_EARTH).
// Avatar full↔hidden (regla full-o-full, sin PiP). CTA sin precio.
// Salida: beatsheet/sellador.json → node beatsheet.mjs beatsheet/sellador.json
import fs from "fs";

const SLUG = "sellador";
const AVATAR = `${SLUG}_opt.mp4`;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase, maxTok = 8) => {
  const words = norm(phrase).split(" ").filter(Boolean);
  const t = words.slice(0, Math.min(maxTok, words.length));
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};
const atc = (phrase, maxTok) => { const v = at(phrase, maxTok); if (v == null) console.warn("⚠ anchor missing:", phrase.slice(0, 60)); return v; };
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);

// ── 0) beats fuente (207, TODOS imagen) ──────────────────────────────────────────
const srcBeats = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8"));

// ── 1) B-ROLL — 1 imagen por beat, anclada a su `phrase` real, contigua ──────────
const rawBeats = [];
for (const b of srcBeats) {
  const t = atc(b.phrase);
  if (t == null) continue;
  rawBeats.push({ id: b.name, start: +t.toFixed(2), kind: "raw", src: `img/${b.name}.png`, hue: "amber", darken: 0 });
}
rawBeats.sort((x, y) => x.start - y.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  rawBeats[i].dur = +Math.max(0.8, next - rawBeats[i].start + 0.3).toFixed(2);
}

// ── 2) COMPONENTES PREMIUM (THEME_EARTH) ──
const P = (comp, atPhrase, dur, zone, props = {}, maxTok) => ({ comp, at: atPhrase, dur, zone, props, maxTok });

// los 4 secretos de aplicación (revelado progresivo)
const SECRETOS = [
  { title: "Madera limpia y seca", sub: "si está húmeda o sucia, el aceite no penetra" },
  { title: "Manos finas, nunca gruesas", sub: "dejá penetrar cada mano y sacá el excedente" },
  { title: "Mojado sobre mojado", sub: "el truco de los botes para máxima protección al agua" },
  { title: "Mantenimiento: una caricia", sub: "una manito cada tanto, sin lijar nada" },
];
// los 5 consejos finales (revelado progresivo)
const CONSEJOS = [
  { title: "Día tibio, sin sol fuerte", sub: "poros abiertos, el aceite penetra mejor" },
  { title: "Cuidado con el trapo de linaza", sub: "puede calentarse solo; extendelo o mojalo" },
  { title: "Saturá cantos y puntas", sub: "el deck se pudre por los bordes, no por arriba" },
  { title: "Hacé la prueba del agua", sub: "si forma perlitas, está funcionando" },
  { title: "Dejá de pelear cada año", sub: "bien hecho una vez, después solo caricias" },
];

const PREMIUM = [
  // ══ VsDuel (2) — zone "left" ══
  P("VsDuel", "por un lado estan los que forman pelicula los barnices las lacas", 6.4, "left", {
    eyebrow: "Dos familias opuestas", title: "Película vs. Penetrante",
    left: { label: "Forma película", sub: "capa rígida arriba; afuera se agrieta y se pela", good: false },
    right: { label: "Penetrante", sub: "se mete adentro, flexible, no se pela nunca", good: true },
  }, 8),
  P("VsDuel", "uno es una armadura rigida que un dia se quiebra el otro", 6.4, "left", {
    eyebrow: "Por qué uno dura y el otro no", title: "Armadura vs. defensa flexible",
    left: { label: "Barniz (película)", sub: "armadura rígida que un día se quiebra", good: false },
    right: { label: "Aceite (penetrante)", sub: "defensa flexible que vive con la madera", good: true },
  }, 8),

  // ══ PullQuote (3) — zone "topLeft" ══
  P("PullQuote", "porque vos estas poniendo un plastico arriba de la madera y yo pongo", 6.0, "topLeft", {
    quote: "Vos ponés un plástico arriba de la madera. Yo pongo la protección adentro. Lo que se pone arriba, se despega; lo que se mete adentro, no.",
  }, 8),
  P("PullQuote", "por eso los botes de don vicente no se pelan nunca no tienen", 5.8, "topLeft", {
    quote: "Los botes de Don Vicente no se pelan nunca. No tienen nada arriba que se pueda pelar.",
  }, 8),
  P("PullQuote", "don vicente que me enseño con sus botes que a la madera la proteccion", 6.0, "topLeft", {
    quote: "A la madera, la protección se le mete adentro — nunca se le pone encima.",
  }, 8),

  // ══ HighlightSweep (6) — zone "top" ══
  P("HighlightSweep", "todo lo que se pone arriba tarde o temprano se despega lo que se mete", 5.8, "top", {
    pre: "Todo lo que se pone arriba,", highlight: "tarde o temprano se despega", post: "; lo que se mete adentro, no se despega nunca.", note: "la frase de Don Vicente",
  }, 8),
  P("HighlightSweep", "ese es el secreto la proteccion no se pone encima se mete adentro", 5.6, "top", {
    pre: "La protección", highlight: "no se pone encima, se mete adentro", post: ".", note: "el secreto de todo",
  }, 8),
  P("HighlightSweep", "sumarle al aceite un pigmento una tierra de color un tinte para madera", 5.8, "top", {
    pre: "Sumarle al aceite", highlight: "un poco de pigmento", post: " hace de filtro solar: bloquea los rayos UV.", note: "más color = más años al sol",
  }, 8),
  P("HighlightSweep", "la palabra magica que tenes que buscar y pedir es penetrante", 5.6, "top", {
    pre: "La palabra mágica que tenés que pedir es", highlight: "PENETRANTE", post: " — mate, no película brillante.", note: "no te vendan gato por liebre",
  }, 8),
  P("HighlightSweep", "un deck se pudre casi siempre por las puntas y los cantos no por", 5.8, "top", {
    pre: "Un deck se pudre casi siempre", highlight: "por las puntas y los cantos", post: ", no por la cara de arriba.", note: "satura bien esos bordes",
  }, 8),
  P("HighlightSweep", "enterre varias maderas tratadas de formas distintas durante años y las desenterre", 5.8, "top", {
    pre: "En el próximo video:", highlight: "enterré maderas tratadas y las desenterré años después", post: ".", note: "no te lo pierdas",
  }, 8),

  // ══ BigStatReveal (5) — zone "topLeft" ══
  P("BigStatReveal", "don vicente ochenta y pico de años que se habia pasado la vida", 5.8, "topLeft", {
    eyebrow: "El carpintero de botes", value: 80, prefix: "", suffix: " años", support: "toda una vida haciendo y arreglando botes — la peor condición posible para la madera",
  }, 8),
  P("BigStatReveal", "sacar la pelicula vieja que se pela y volver a comprar el balde caro cada", 5.8, "topLeft", {
    eyebrow: "Cada cuánto te hacen recomprar", value: 2, prefix: "", suffix: " años", support: "lijar, sacar la película y comprar de nuevo el balde caro — un negocio redondo para ellos",
  }, 8),
  P("BigStatReveal", "con la latita brillante y la promesa de 5 años muchos de esos", 5.8, "topLeft", {
    eyebrow: "La promesa de la etiqueta", value: 5, prefix: "", suffix: " años", support: "impermeable, protección total… que afuera no se cumple, porque se pela igual",
  }, 8),
  P("BigStatReveal", "la madera la toma y queda como nueva otra vez diez minutos sin escamas", 5.8, "topLeft", {
    eyebrow: "El mantenimiento del penetrante", value: 10, prefix: "", suffix: " min", support: "una manito de aceite encima, la madera la toma — sin lijar, sin escamas",
  }, 8),
  P("BigStatReveal", "son 40 soluciones como esta cosas que los viejos sabian cosas que un carpintero", 5.8, "topLeft", {
    eyebrow: "Manual de reparaciones caseras", value: 40, prefix: "", suffix: "", support: "arreglos como este, con medidas y pasos, para cuando los necesites",
  }, 8),

  // ══ BeforeAfter (4) — zone "top" ══
  P("BeforeAfter", "esa capa brillante se empezaba a poner blanca a levantarse en las camas a pelarse", 6.2, "top", {
    eyebrow: "El sellador de película, afuera", beforeLabel: "Recién aplicado: brilla", afterLabel: "Al verano: se pela", caption: "hermoso al principio, un desastre después",
  }, 8),
  P("BeforeAfter", "esa capa rigida se empieza a agrietar a cuartear a despegar y una vez", 6.2, "top", {
    eyebrow: "Por qué la película falla", beforeLabel: "Película nueva, rígida", afterLabel: "Agrietada y despegada", caption: "la madera se mueve, el plástico no",
  }, 8),
  P("BeforeAfter", "un deck te aguanta años sin ponerse gris ni aspero y cuando pierde", 6.2, "top", {
    eyebrow: "El deck con penetrante", beforeLabel: "Gris, reseco, áspero", afterLabel: "Color cálido, aguanta años", caption: "y cuando pierde color, una manito y vuelve",
  }, 8),
  P("BeforeAfter", "si el producto te deja la madera brillante como un espejo es pelicula", 6.4, "top", {
    eyebrow: "Cómo reconocerlo en la mano", beforeLabel: "Brillante como espejo = película", afterLabel: "Mate natural = penetrante", caption: "si brilla como espejo, desconfiá",
  }, 8),

  // ══ ChecklistReveal (4) — zone "topLeft" ══
  P("ChecklistReveal", "aca te voy a dar las opciones de la mas casera y barata", 7.2, "topLeft", {
    title: "Las opciones de acabado penetrante",
    items: ["Casera: aceite de linaza + solvente, bien diluida", "Intermedia: aceite específico para exterior", "Refuerzo: un poco de cera para zonas de mucha agua"],
    stamp: "RECETA EN LA DESCRIPCIÓN",
  }, 8),
  P("ChecklistReveal", "ahora dejame mostrarte todo lo que podes proteger con esto porque no es solo", 7.6, "topLeft", {
    title: "Todo lo que podés proteger",
    items: ["Deck y galería", "Cerco y postes", "Muebles de jardín", "Pérgola, quincho y tirantes", "Puertas y ventanas", "Macetas, canteros y hasta botes"],
    stamp: "MISMO PRINCIPIO",
  }, 8),
  P("ChecklistReveal", "una de estas te ahorra una fortuna madera oxido humedad goteras plagas caños hasta", 7.4, "topLeft", {
    title: "Lo que cubre el manual completo",
    items: ["Madera", "Óxido", "Humedad y goteras", "Plagas", "Caños", "Hasta cosas del auto"],
    stamp: "40 ARREGLOS",
  }, 8),
  P("ChecklistReveal", "para la madera de afuera penetrante siempre la madera tiene que estar limpia y seca", 7.4, "topLeft", {
    title: "Para llevarte lo importante",
    items: ["Penetrante siempre (afuera)", "Madera limpia y seca", "Manos finas + sacar el excedente", "Mojado sobre mojado para el agua", "Mantenimiento: una manito, sin lijar"],
    stamp: "RESUMEN",
  }, 8),

  // ══ NumberedSteps (10) — zone "left": 4 secretos + 5 consejos + recap ══
  P("NumberedSteps", "la madera tiene que estar limpia y seca si vas a proteger", 6.4, "left", {
    eyebrow: "Secreto 1 de 4", title: "Los secretos de Don Vicente", steps: SECRETOS.slice(0, 1),
  }, 8),
  P("NumberedSteps", "segundo secreto el mas importante de todos el que casi nadie hace manos finas", 7.2, "left", {
    eyebrow: "Secreto 2 de 4", title: "Los secretos de Don Vicente", steps: SECRETOS.slice(0, 2),
  }, 8),
  P("NumberedSteps", "tercer secreto el de los botes el que le da la proteccion extrema al agua", 7.0, "left", {
    eyebrow: "Secreto 3 de 4", title: "Los secretos de Don Vicente", steps: SECRETOS.slice(0, 3),
  }, 8),
  P("NumberedSteps", "el cuarto secreto el del mantenimiento el que hace toda la magia a lo largo", 7.0, "left", {
    eyebrow: "Secreto 4 de 4", title: "Los secretos de Don Vicente", steps: SECRETOS.slice(0, 4),
  }, 8),
  P("NumberedSteps", "primer consejo aplica en un dia tibio sin sol directo fuerte y sin frio", 6.4, "left", {
    eyebrow: "Consejo 1 de 5", title: "Consejos de los que saben", steps: CONSEJOS.slice(0, 1),
  }, 8),
  P("NumberedSteps", "segundo consejo acordate del trapo con aceite de linaza ya te lo dije", 6.6, "left", {
    eyebrow: "Consejo 2 de 5", title: "Consejos de los que saben", steps: CONSEJOS.slice(0, 2),
  }, 8),
  P("NumberedSteps", "tercer consejo para el deck especificamente prestale atencion especial a los cantos", 6.8, "left", {
    eyebrow: "Consejo 3 de 5", title: "Consejos de los que saben", steps: CONSEJOS.slice(0, 3),
  }, 8),
  P("NumberedSteps", "cuarto consejo para convencerte hace la prueba del agua despues de tratar", 6.8, "left", {
    eyebrow: "Consejo 4 de 5", title: "Consejos de los que saben", steps: CONSEJOS.slice(0, 4),
  }, 8),
  P("NumberedSteps", "y quinto consejo el mas lindo el que te saca el peso de encima", 7.0, "left", {
    eyebrow: "Consejo 5 de 5", title: "Consejos de los que saben", steps: CONSEJOS.slice(0, 5),
  }, 8),
  P("NumberedSteps", "resumiendo para que te lleves lo importante los productos se dividen en dos", 7.2, "left", {
    eyebrow: "Antes de cerrar", title: "Para llevarte lo importante",
    steps: [
      { title: "Película se pela; penetrante no" },
      { title: "Afuera, penetrante siempre" },
      { title: "Limpia, seca, manos finas, excedente afuera" },
      { title: "Mantenimiento: una caricia, sin lijar" },
    ],
  }, 8),

  // ══ MythTruth (4 errores) — zone "topLeft" ══
  P("MythTruth", "error numero 1 el que empezo toda esta historia seguir usando productos que forman pelicula", 6.2, "topLeft", {
    myth: "Usar barniz/sellador de película para la madera de afuera",
    truth: "Afuera la película es una trampa: se pela. Penetrante, siempre",
  }, 8),
  P("MythTruth", "error numero 2 aplicar sobre madera humeda o sucia ya te lo dije", 6.2, "topLeft", {
    myth: "Aplicar el aceite sobre madera húmeda, gris o sucia",
    truth: "Si no está limpia y seca, el aceite no penetra: primero recuperás, después aplicás",
  }, 8),
  P("MythTruth", "error numero 3 cargar mucho producto de una dar manos gruesas", 6.2, "topLeft", {
    myth: "Cargar mucho producto y dar una mano bien gruesa",
    truth: "Mano gruesa = capa pegajosa que junta mugre. Menos es más: manos finas",
  }, 8),
  P("MythTruth", "error numero 4 no sacar el excedente este mata el acabado despues de saturar", 6.2, "topLeft", {
    myth: "Dejar el aceite que quedó arriba sin penetrar",
    truth: "A los 10 min pasás un trapo y sacás lo que brilla: acabado seco y prolijo",
  }, 8),

  // ══ CtaCard (3, Manual, sin precio) — zone "topLeft" ══
  P("CtaCard", "es uno de los cuarenta reglos que junte a lo largo de los años en un manual", 7.0, "topLeft", {
    eyebrow: "40 arreglos y secretos de los viejos", title: "Manual del Constructor Libre",
    bullet: "madera, óxido, humedad, plagas, caños — con medidas exactas", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
  }, 8),
  P("CtaCard", "lo tengo reunido junto con otras decenas de arreglos en el manual de reparaciones caseras", 7.0, "topLeft", {
    eyebrow: "Cuesta menos que un balde caro", title: "Manual de Reparaciones Caseras",
    bullet: "40 soluciones caseras, con medidas y pasos, para cuando las necesites", price: 0, cta: "LINK ARRIBA DE TODO",
  }, 8),
  P("CtaCard", "arriba de todo el enlace al manual de reparaciones caseras con los 40 arreglos completos", 7.0, "topLeft", {
    eyebrow: "Empezá por el enlace de arriba", title: "Manual del Constructor Libre",
    bullet: "los 40 arreglos completos, medidas y pasos, todo en un lugar", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
  }, 8),
];

// ── ensamblar beats final: raw + premium overlays anclados a su phrase real ──
const beats = [...rawBeats];
let nOv = 0;
const compCount = {};
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok);
  if (s == null) continue;
  beats.push({
    id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`,
    start: +s.toFixed(2),
    dur: p.dur,
    kind: "premium",
    overlay: true,
    comp: p.comp,
    theme: "earth",
    zone: p.zone,
    ...p.props,
  });
  nOv++;
  compCount[p.comp] = (compCount[p.comp] || 0) + 1;
}
beats.sort((a, b) => a.start - b.start);

// ── SEGURIDAD: 1 uso por asset raw ──
{
  const used = new Map();
  for (const b of beats) { if (b.kind !== "raw") continue; used.set(b.id, (used.get(b.id) || 0) + 1); }
  const dups = [...used.entries()].filter(([, c]) => c > 1);
  if (dups.length) { console.error("✖ ASSETS REPETIDOS:", dups.map(([n, c]) => `${n}×${c}`).join(", ")); process.exit(1); }
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));

// ── AVATAR WINDOWS — regla full-o-full (sin PiP): full en hook + slots ~6s cada ~55s
// en huecos SIN componente (snapeados a palabra), hidden el resto. ──
const HOOK_END = 9, PERIOD = 55, SLOT = 6, SEARCH = 26;
const comps = beats.filter((b) => b.kind === "premium").map((b) => [b.start, b.start + (b.dur || 3)]);
const overlapsComp = (a, b) => comps.some(([s, e]) => a < e && b > s);
const snapWord = (tt) => { for (const c of caps) if (c.startMs / 1000 >= tt - 0.05) return c.startMs / 1000; return tt; };
const fulls = [[0, snapWord(HOOK_END)]];
for (let target = HOOK_END + PERIOD; target < TOTAL - 12; target += PERIOD) {
  for (let t = target; t < target + SEARCH; t += 0.5) {
    const s = snapWord(t), e = snapWord(s + SLOT);
    if (e - s >= 4 && e - s <= 9 && !overlapsComp(s, e)) { fulls.push([s, e]); break; }
  }
}
const csw = snapWord(TOTAL - 8);
if (!overlapsComp(csw, TOTAL)) fulls.push([csw, TOTAL - 0.05]);
fulls.sort((a, b) => a[0] - b[0]);
const windows = [];
let cursor = 0;
for (const [s, e] of fulls) {
  if (s > cursor + 0.2) windows.push({ start: +cursor.toFixed(2), mode: "hidden" });
  windows.push({ start: +s.toFixed(2), mode: "full" });
  cursor = e;
}
if (cursor < TOTAL - 0.1) windows.push({ start: +cursor.toFixed(2), mode: "hidden" });
if (windows[0].start !== 0) windows.unshift({ start: 0, mode: windows[0].mode });
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(
  `src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`
);

console.log(`beats totales ${beats.length} (raw/imagen ${rawBeats.length} de ${srcBeats.length}) · premium ${nOv} · dur ${(TOTAL/60).toFixed(1)}min`);
console.log("componentes:", JSON.stringify(compCount));
