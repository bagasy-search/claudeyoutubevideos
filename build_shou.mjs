// build_shou.mjs — DOCUMENTAL "SHOU SUGI BAN — QUEMAR LA MADERA" (Constructor Libre).
// Don Ito (japonés 82) preservó su cerco quemándolo; el fuego neutraliza las 4 cosas que
// matan la madera (hongos/insectos/agua/sol): carboniza la superficie (inerte), sella los
// tubitos (hidrófoba), escudo UV. Piel de cocodrilo 3-5mm + aceite. IMAGE-FIRST: tomas ≤3s
// imágenes on-topic MODAL en public/img/shou_s_*.png, anclado a captions_shou.json.
// 40 componentes KIT PREMIUM (THEME_EARTH). Avatar full↔hidden. CTA sin precio.
// Salida: beatsheet/shou.json → node beatsheet.mjs beatsheet/shou.json
import fs from "fs";

const SLUG = "shou";
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
const atc = (phrase, maxTok) => { const v = at(phrase, maxTok); if (v == null) console.warn("⚠ anchor missing:", phrase.slice(0, 55)); return v; };
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);

// HÍBRIDO: momentos con clip real (good-set) → beat de VIDEO (broll/*.mp4, movimiento,
// sin split); el resto → tomas imagen ≤3s (las _b/_c de Modal ya paceadas).
const goodset = new Set(JSON.parse(fs.readFileSync(`_v3/${SLUG}_clip_goodset.json`, "utf8")));
const moments = JSON.parse(fs.readFileSync(`_v3/${SLUG}_clipbeats.json`, "utf8")); // 218 momentos con phrase
const momentPhrase = new Map(moments.map((m) => [m.name, m.phrase]));
const baseName = (n) => n.replace(/_[bc]$/, "");

const srcBeats = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8")); // 472 tomas paceadas
const rawBeats = [];
// 1) tomas imagen: solo de momentos SIN clip
for (const b of srcBeats) {
  if (goodset.has(baseName(b.name))) continue; // ese momento va con clip
  const t = atc(b.phrase);
  if (t == null) continue;
  rawBeats.push({ id: b.name, start: +t.toFixed(2), kind: "raw", src: `img/${b.name}.png`, hue: "amber", darken: 0 });
}
// 2) beats de clip: 1 por momento con good-clip (video, contiguo, sin split)
let nClip = 0;
for (const name of goodset) {
  const ph = momentPhrase.get(name);
  const t = ph ? atc(ph) : null;
  if (t == null) continue;
  rawBeats.push({ id: name, start: +t.toFixed(2), kind: "raw", src: `broll/${name}.mp4`, hue: "amber", darken: 0, noSplit: true });
  nClip++;
}
rawBeats.sort((x, y) => x.start - y.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  rawBeats[i].dur = +Math.max(0.8, next - rawBeats[i].start + 0.3).toFixed(2);
}
console.log(`b-roll híbrido: ${nClip} clips de video + ${rawBeats.length - nClip} tomas imagen`);

const P = (comp, atPhrase, dur, zone, props = {}, maxTok) => ({ comp, at: atPhrase, dur, zone, props, maxTok });

const TECNICA = [
  { title: "Madera seca (pino/cedro/ciprés)", sub: "si la quemás húmeda, el vapor revienta la superficie" },
  { title: "Un soplete de gas", sub: "control total y barato — la chimenea tradicional es para expertos" },
  { title: "Quemar hasta piel de cocodrilo", sub: "escamas negras brillantes: capa de carbón de 3-5 mm" },
  { title: "Enfriar y cepillar (opcional)", sub: "aparece la veta con un brillo plateado precioso" },
  { title: "Aceite, siempre", sub: "fija el carbón, lo nutre y suma repelencia al agua" },
];
const CONSEJOS = [
  { title: "Un día sin viento", sub: "el viento quema disparejo y es peligroso" },
  { title: "Probá en un descarte", sub: "agarrале la mano al punto de cocodrilo" },
  { title: "Seguridad: balde de agua a mano", sub: "lejos de todo lo que prenda; nunca dejes brasas" },
  { title: "Manito de aceite cada tanto", sub: "cada par de años, 10 min, sin lijar" },
];

const PREMIUM = [
  // ══ BigStatReveal (6) ══
  P("BigStatReveal", "ochenta y dos años tenia cuando yo lo conoci las manos nudosas", 5.8, "topLeft", {
    eyebrow: "El japonés del cerco negro", value: 82, suffix: " años", support: "Don Ito — llegó tras la guerra con dos cajones de herramientas y un secreto",
  }, 8),
  P("BigStatReveal", "cuando don ito murio ese cerco tenia mas de cincuenta años", 5.8, "topLeft", {
    eyebrow: "El cerco que sobrevivió a todos", value: 50, suffix: " años", support: "más sano que muchos postes nuevos del corralón — los mismos que quemó el primer día",
  }, 8),
  P("BigStatReveal", "en japon la usan desde hace mas de mil años para el revestimiento", 5.8, "topLeft", {
    eyebrow: "No es moda: es antiquísima", value: 1000, suffix: " años", support: "en Japón revisten casas, templos y graneros con madera quemada (Yakisugi)",
  }, 8),
  P("BigStatReveal", "las cuatro cosas que matan la madera neutralizadas de un solo golpe", 5.8, "topLeft", {
    eyebrow: "Lo que logra el fuego en una pasada", value: 4, suffix: " enemigos", support: "hongos, insectos, agua y sol — neutralizados de un solo golpe, gratis",
  }, 8),
  P("BigStatReveal", "este poste te puede durar 50 60 80 años enterrado como el cerco", 5.8, "topLeft", {
    eyebrow: "Un poste con base quemada + aceite", value: 80, suffix: " años", support: "enterrado, como el cerco de Don Ito — la parte bajo tierra es la que más sufre",
  }, 8),
  P("BigStatReveal", "son 40 soluciones como esta cosas que los viejos sabian que un japones", 5.8, "topLeft", {
    eyebrow: "Manual de reparaciones caseras", value: 40, suffix: "", support: "arreglos como este, con medidas y pasos, para cuando los necesites",
  }, 8),

  // ══ VsDuel (2) ══
  P("VsDuel", "los postes tratados de ramirez los de todo el pueblo se fueron pudriendo", 6.2, "left", {
    eyebrow: "40 años después", title: "Poste tratado vs. poste quemado",
    left: { label: "Postes tratados (Ramírez)", sub: "se pudrieron y hubo que cambiarlos 2-3 veces", good: false },
    right: { label: "Cerco quemado (Don Ito)", sub: "firme e intacto a los 50 años", good: true },
  }, 8),
  P("VsDuel", "por eso te empujan lo que se vende y entierran lo que es gratis", 6.2, "left", {
    eyebrow: "Por qué casi nadie la conoce", title: "Lo que se vende vs. lo gratis",
    left: { label: "El producto de la latita", sub: "dura 3 años y tenés que volver a comprar — deja ganancia", good: false },
    right: { label: "El fuego", sub: "gratis, tuyo apenas lo aprendés, para siempre", good: true },
  }, 8),

  // ══ MythTruth (5): concepto + 4 errores ══
  P("MythTruth", "como puede ser que quemar la madera la haga durar mas en vez de arruinarla", 6.0, "topLeft", {
    myth: "Si el fuego destruye todo, quemar la madera la arruina",
    truth: "Controlado, no la destruye: la transforma en carbón inerte que la protege",
  }, 8),
  P("MythTruth", "error numero 1 el mas grave quemar la madera humeda", 6.0, "topLeft", {
    myth: "Error 1: quemar la madera húmeda",
    truth: "El agua hierve y el vapor revienta la superficie: capa débil e inútil. Seca siempre",
  }, 8),
  P("MythTruth", "error numero 2 quemar de mas el fuego es adictivo", 6.0, "topLeft", {
    myth: "Error 2: quemar de más (el fuego es adictivo)",
    truth: "Carbonizar profundo la vuelve frágil: solo la piel de cocodrilo, 3-5 mm",
  }, 8),
  P("MythTruth", "error numero 3 no apagar bien esto es importante por seguridad", 6.0, "topLeft", {
    myth: "Error 3: no apagar bien las brasas",
    truth: "Sigue quemándose sola y es riesgo de incendio: enfriá con agua apenas llegás al punto",
  }, 8),
  P("MythTruth", "error numero 4 saltarse el aceite mucha gente quema", 6.0, "topLeft", {
    myth: "Error 4: saltarse el aceite",
    truth: "El aceite fija el carbón y multiplica la duración: es el paso que la hace eterna",
  }, 8),

  // ══ HighlightSweep (5) ══
  P("HighlightSweep", "la superficie se vuelve hidrofoba que es una palabra elegante para decir que repele el agua", 5.8, "top", {
    pre: "El carbón sella los tubitos: la superficie se vuelve", highlight: "hidrófoba", post: " — repele el agua, rebota y se va.", note: "sin agua, no hay pudrición",
  }, 8),
  P("HighlightSweep", "pero la capa de carbon absorbe y bloquea esos rayos protege la madera de abajo", 5.8, "top", {
    pre: "La capa de carbón", highlight: "absorbe y bloquea los rayos UV", post: " — un escudo contra el sol.", note: "por eso no se pone gris",
  }, 8),
  P("HighlightSweep", "los japoneses lo llaman piel de cocodrilo", 5.6, "top", {
    pre: "El punto justo del quemado:", highlight: "piel de cocodrilo", post: " — escamas negras brillantes, 3-5 mm de carbón.", note: "ahí parás, ni más ni menos",
  }, 8),
  P("HighlightSweep", "madera quemada mas aceite es literalmente la combinacion mas duradera que existe", 5.8, "top", {
    pre: "Madera quemada + aceite es", highlight: "la combinación más duradera sin química", post: ".", note: "fuego y aceite: toda la receta",
  }, 8),
  P("HighlightSweep", "la respuesta es incomoda pero es simple porque no se puede vender", 5.8, "top", {
    pre: "¿Por qué casi nadie la conoce?", highlight: "porque no se puede vender", post: " — el fuego es gratis.", note: "nadie hace publicidad de lo gratis",
  }, 8),

  // ══ ChecklistReveal (4) ══
  P("ChecklistReveal", "le saca la comida a los hongos le saca la comida a los insectos le cierra la puerta al agua", 7.2, "topLeft", {
    title: "Lo que hace el fuego, en una pasada",
    items: ["Sin comida para los hongos (carbón inerte)", "Sin comida para los insectos", "Puerta cerrada al agua (hidrófoba)", "Escudo contra el sol (UV)"],
    stamp: "LAS 4, DE UN GOLPE",
  }, 8),
  P("ChecklistReveal", "ahora te voy a mostrar todo lo que puedes hacer con esto porque no es solo para un cerco", 7.4, "topLeft", {
    title: "Todo lo que podés quemar",
    items: ["Postes enterrados (la base + un poco más)", "Revestimiento y fachadas (yakisugi)", "Deck, galería y piso de exterior", "Muebles rústicos", "Macetas y canteros de la huerta"],
    stamp: "MISMA TÉCNICA",
  }, 8),
  P("ChecklistReveal", "madera oxido humedad goteras plagas caños hasta cosas del auto", 7.2, "topLeft", {
    title: "Lo que cubre el manual completo",
    items: ["Madera", "Óxido", "Humedad y goteras", "Plagas", "Caños", "Hasta cosas del auto"],
    stamp: "40 ARREGLOS",
  }, 8),
  P("ChecklistReveal", "quemar la madera de forma controlada la protege de las cuatro cosas que la matan", 7.4, "topLeft", {
    title: "Para llevarte lo importante",
    items: ["El fuego protege de las 4 cosas que matan la madera", "El punto: piel de cocodrilo, 3-5 mm", "La madera tiene que estar seca", "Enfriar, cepillar (opcional) y aceitar siempre"],
    stamp: "RESUMEN",
  }, 8),

  // ══ NumberedSteps (9): 5 de la técnica + 4 consejos ══
  P("NumberedSteps", "lo primero la madera cualquier madera sirve casi cualquiera pero", 6.4, "left", {
    eyebrow: "La técnica · 1", title: "Cómo se hace, paso a paso", steps: TECNICA.slice(0, 1),
  }, 8),
  P("NumberedSteps", "lo segundo la herramienta hay dos formas de hacerlo", 6.4, "left", {
    eyebrow: "La técnica · 2", title: "Cómo se hace, paso a paso", steps: TECNICA.slice(0, 2),
  }, 8),
  P("NumberedSteps", "lo tercero y este es el corazon de todo cuanto quemar", 6.6, "left", {
    eyebrow: "La técnica · 3", title: "Cómo se hace, paso a paso", steps: TECNICA.slice(0, 3),
  }, 8),
  P("NumberedSteps", "una vez que quemaste y la madera se enfrio tenes dos caminos", 6.6, "left", {
    eyebrow: "La técnica · 4", title: "Cómo se hace, paso a paso", steps: TECNICA.slice(0, 4),
  }, 8),
  P("NumberedSteps", "y el paso final el que sella el trato el aceite", 6.6, "left", {
    eyebrow: "La técnica · 5", title: "Cómo se hace, paso a paso", steps: TECNICA.slice(0, 5),
  }, 8),
  P("NumberedSteps", "primer consejo hazela un dia sin viento el viento hace que el fuego", 6.4, "left", {
    eyebrow: "Consejo 1 de 4", title: "Consejos de los que saben", steps: CONSEJOS.slice(0, 1),
  }, 8),
  P("NumberedSteps", "segundo consejo proba primero en un pedazo de descarte", 6.4, "left", {
    eyebrow: "Consejo 2 de 4", title: "Consejos de los que saben", steps: CONSEJOS.slice(0, 2),
  }, 8),
  P("NumberedSteps", "tercer consejo de seguridad y este es serio trabaja lejos", 6.6, "left", {
    eyebrow: "Consejo 3 de 4", title: "Consejos de los que saben", steps: CONSEJOS.slice(0, 3),
  }, 8),
  P("NumberedSteps", "cuarto consejo el que le da el toque profesional despues de aceitar", 6.6, "left", {
    eyebrow: "Consejo 4 de 4", title: "Consejos de los que saben", steps: CONSEJOS.slice(0, 4),
  }, 8),

  // ══ PullQuote (3) ══
  P("PullQuote", "ramirez en mi pueblo hacemos esto desde hace mil años veni a verme en cuarenta", 6.0, "topLeft", {
    quote: "Ramírez, en mi pueblo hacemos esto desde hace mil años. Vení a verme en cuarenta.",
  }, 8),
  P("PullQuote", "a veces para que algo dure primero hay que pasarlo por el fuego", 5.8, "topLeft", {
    quote: "A veces, para que algo dure, primero hay que pasarlo por el fuego.",
  }, 8),
  P("PullQuote", "no dejes que nadie te haga tirar lo que todavia tiene vida", 5.8, "topLeft", {
    quote: "No dejes que nadie te haga tirar lo que todavía tiene vida.",
  }, 8),

  // ══ BeforeAfter (3) ══
  P("BeforeAfter", "el cerco negro de don ito seguia parado firme intacto los mismos postes", 6.2, "top", {
    eyebrow: "Los años pasaron", beforeLabel: "Postes del pueblo: caídos", afterLabel: "Cerco de Don Ito: intacto", caption: "los mismos postes que quemó el primer día",
  }, 8),
  P("BeforeAfter", "la superficie primero se dora despues se pone marron y finalmente se empieza a agrietar", 6.2, "top", {
    eyebrow: "Cómo leer el quemado", beforeLabel: "Se dora y se pone marrón", afterLabel: "Se agrieta: piel de cocodrilo", caption: "ahí parás — capa de carbón de 3-5 mm",
  }, 8),
  P("BeforeAfter", "si dejas el carbon grueso y solo lo aceitas te queda ese negro", 6.2, "top", {
    eyebrow: "Elegís el acabado", beforeLabel: "Carbón grueso: negro aterciopelado", afterLabel: "Cepillado: veta plateada", caption: "y hasta podés sumarle un tinte",
  }, 8),

  // ══ CtaCard (3, sin precio) ══
  P("CtaCard", "es uno de los 40 reglos que junte a lo largo de los años en un manual", 7.0, "topLeft", {
    eyebrow: "40 arreglos y secretos de los viejos", title: "Manual del Constructor Libre",
    bullet: "madera, óxido, humedad, plagas, caños — con medidas exactas", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
  }, 8),
  P("CtaCard", "lo tengo reunido junto con otras decenas de arreglos en el manual de reparaciones caseras", 7.0, "topLeft", {
    eyebrow: "Cuesta menos que un poste tratado", title: "Manual de Reparaciones Caseras",
    bullet: "40 soluciones caseras, con medidas y pasos, para cuando las necesites", price: 0, cta: "LINK ARRIBA DE TODO",
  }, 8),
  P("CtaCard", "el enlace al manual de reparaciones caseras con los cuarenta reglos completos", 7.0, "topLeft", {
    eyebrow: "Empezá por el enlace de arriba", title: "Manual del Constructor Libre",
    bullet: "los 40 arreglos completos + el paso a paso de hoy, numerado", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
  }, 8),
];

const beats = [...rawBeats];
let nOv = 0; const compCount = {};
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok);
  if (s == null) continue;
  beats.push({ id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`, start: +s.toFixed(2), dur: p.dur, kind: "premium", overlay: true, comp: p.comp, theme: "earth", zone: p.zone, ...p.props });
  nOv++; compCount[p.comp] = (compCount[p.comp] || 0) + 1;
}
beats.sort((a, b) => a.start - b.start);
{
  const used = new Map();
  for (const b of beats) { if (b.kind !== "raw") continue; used.set(b.id, (used.get(b.id) || 0) + 1); }
  const dups = [...used.entries()].filter(([, c]) => c > 1);
  if (dups.length) { console.error("✖ ASSETS REPETIDOS:", dups.map(([n, c]) => `${n}×${c}`).join(", ")); process.exit(1); }
}
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));

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
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

console.log(`beats totales ${beats.length} (raw ${rawBeats.length}/${srcBeats.length}) · premium ${nOv} · dur ${(TOTAL/60).toFixed(1)}min`);
console.log("componentes:", JSON.stringify(compCount));
