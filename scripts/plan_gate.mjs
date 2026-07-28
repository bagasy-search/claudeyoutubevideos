// plan_gate.mjs — COMPUERTA DEL DISEÑO POR PARTES.
//
// Por qué existe: la calidad se decide al DISEÑAR, no al rendear. Diseñar 200 momentos en una sola
// pasada da 200 decisiones mediocres — está medido: manifiestos con componentes densos al inicio y
// una COLA MUERTA de RawShot, y un turno que leyó 16,3M de tokens de caché. Los mejores videos del
// creador (barcos) se hicieron POR PARTES, con el hook curado aparte.
// Este gate verifica que el plan se haya diseñado por SECCIONES y con criterio de DIRECTOR:
// cada momento decide qué se ve, de dónde sale, cuántos segundos dura y POR QUÉ encaja.
//
//   node scripts/plan_gate.mjs <slug>
//   → informe siempre. exit 1 (bloquea) SOLO con PLAN_GATE_STRICT=1.
//     (Arranca en modo aviso para no frenar la producción mientras el DIRECTOR se adapta.)
import { readFileSync, existsSync } from "fs";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/plan_gate.mjs <slug>"); process.exit(2); }
const STRICT = process.env.PLAN_GATE_STRICT === "1";
const MIN_SECC = +(process.env.MIN_SECCIONES || 4);       // hook + bloques + cierre
const MOM_POR_MIN = +(process.env.MOM_POR_MIN || 10);     // ~1 visual cada 6s dentro de CADA sección
const MIN_COMP_SECC = +(process.env.MIN_COMP_SECCION || 2); // componentes distintos POR sección

const paths = [`_v3/${slug}_plan.json`, `_v3_${slug}_plan.json`, `${slug}_plan.json`];
const p = paths.find((x) => existsSync(x));
if (!p) { console.error(`✗ no encontré el plan (${paths.join(" · ")}). El DIRECTOR (Fase 2) tiene que correr ANTES.`); process.exit(STRICT ? 1 : 0); }
const plan = JSON.parse(readFileSync(p, "utf8"));

const secciones = plan.secciones || plan.sections || [];
const fallos = [], avisos = [];

console.log(`── DISEÑO POR PARTES · ${slug} ──`);
if (!secciones.length) {
  fallos.push(`SIN SECCIONES: el plan no tiene "secciones[]" → se diseñó de una sola pasada. Partí el guion en HOOK + bloques + cierre y diseñá UNA PASADA POR SECCIÓN (cada una con su objetivo).`);
} else {
  console.log(`  secciones             : ${secciones.length}   (mínimo ${MIN_SECC})`);
  if (secciones.length < MIN_SECC) fallos.push(`POCAS SECCIONES: ${secciones.length}, necesitás ≥${MIN_SECC}.`);

  // ¿existe una sección de HOOK con tratamiento propio?
  const hook = secciones.find((s) => /hook|gancho|apertura|cold.?open/i.test(`${s.id || ""} ${s.nombre || s.name || ""} ${s.objetivo || ""}`));
  console.log(`  sección HOOK          : ${hook ? "sí" : "NO"}`);
  if (!hook) fallos.push(`SIN HOOK PROPIO: los primeros ~30s deciden la retención de todo el video y necesitan su PROPIA pasada (¿cuál es el mejor gancho posible? ¿qué se VE en los primeros 3s?).`);

  // por sección: momentos, densidad, variedad de componentes y campos de director
  const CAMPOS = ["dice", "muestra", "tipo"];
  for (const s of secciones) {
    const nom = s.id || s.nombre || s.name || "(sin nombre)";
    const mom = s.momentos || s.moments || [];
    const dur = +(s.dur || s.duracion || ((s.fin || s.end || 0) - (s.inicio || s.start || 0))) || 0;
    const min = dur / 60;
    const comps = [...new Set(mom.filter((m) => /comp/i.test(m.tipo || "")).map((m) => m.kind || m.componente || m.comp))].filter(Boolean);
    const faltan = CAMPOS.filter((c) => mom.length && !mom.some((m) => m[c] != null));
    const necesita = min > 0 ? Math.floor(min * MOM_POR_MIN) : 0;

    console.log(`   · ${String(nom).padEnd(18)} ${String(mom.length).padStart(3)} momentos${necesita ? ` (mín ${necesita})` : ""} · ${comps.length} comp. distintos${faltan.length ? ` · ⚠ sin campo: ${faltan.join("/")}` : ""}`);

    if (!s.objetivo && !s.goal) avisos.push(`"${nom}" no declara su OBJETIVO (qué tiene que lograr esa sección).`);
    if (necesita && mom.length < necesita) fallos.push(`SECCIÓN PELADA "${nom}": ${mom.length} momentos para ${dur.toFixed(0)}s, necesita ≥${necesita}. Acá es donde muere la cola del video.`);
    if (mom.length && comps.length < MIN_COMP_SECC) fallos.push(`SIN COMPONENTES en "${nom}": ${comps.length} distintos (mín ${MIN_COMP_SECC}). Los componentes van TAMBIÉN en la segunda mitad, no sólo al principio.`);
    if (faltan.length) fallos.push(`FALTA CRITERIO DE DIRECTOR en "${nom}": los momentos no tienen ${faltan.join("/")}. Cada momento decide: qué DICE · qué MUESTRA · de qué TIPO (clip/imagen/componente) · cuántos SEG · POR QUÉ encaja.`);
  }
}

if (avisos.length) { console.log(`\n⚠ avisos:`); avisos.forEach((a) => console.log("  · " + a)); }
if (fallos.length) {
  console.log(`\n${STRICT ? "⛔" : "⚠"} DISEÑO POR PARTES INCOMPLETO:`);
  fallos.forEach((f) => console.log("  · " + f));
  console.log(`\nDiseñá sección por sección (una pasada cada una, con CARRY de glosario/assets/componentes ya usados) y volvé a correr este gate.`);
  process.exit(STRICT ? 1 : 0);
}
console.log(`\n✅ diseño por partes OK.`);
process.exit(0);
