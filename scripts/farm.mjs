// farm.mjs — ORQUESTADOR del render gratis en GitHub Actions.
// Hace todo el ciclo desde tu máquina (o desde donde corra Claude), sin que toques nada:
//   1) empaqueta los assets del video en un tarball
//   2) lo sube como RELEASE asset  assets-<slug>
//   3) dispara el workflow render.yml (render por rangos en paralelo)
//   4) espera a que termine y DESCARGA el mp4 final a out/<slug>.mp4
//
// Requisitos (una vez):
//   - repo PÚBLICO con este proyecto (.github/workflows/render.yml incluido)
//   - GitHub CLI `gh` instalado y autenticado (gh auth login)
//   - estar parado en la raíz del repo
//
// Uso:
//   node scripts/farm.mjs <slug> <comp_id> <total_frames> [chunks=60] [prefijoAssets]
//   ej:  node scripts/farm.mjs fly Fly 43380 20 fl
// (prefijoAssets opcional:
//   - "@archivo.txt"  → lista EXPLÍCITA de entradas (rutas relativas a public/, una por línea)
//   - "pref"          → solo img/<pref>* y vid/<pref>* + diagramas dg_*
//   - sin pref        → empaqueta img/ y vid/ enteros.)
import { execSync, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// CHUNKS por defecto = 60. Era 20 porque ese es el tope de jobs concurrentes de una cuenta free, y
// pasarse significaba una 2ª tanda con casi todos los slots ociosos. Desde jul 2026 el repo vive en
// la organización bagasy-search con plan Team → el tope es 60 y entra TODO en una sola tanda.
// Por qué conviene partir más chico: los chunks salen MUY desparejos. En una corrida real duraron
// 1, 5, 7, 1, 8 y 6 minutos, y el reloj lo marca el MÁS LENTO — dividir en 60 achica esa cola.
// Lo que NO es gratis: cada job baja el tarball de assets entero (618 MB en un video medido) y paga
// su propio checkout + install. 60 chunks son ~37 GB de transferencia contra ~12 GB con 20. Más
// arriba de 60 el arranque pesaría más que el render, así que es el techo útil, no sólo el del plan.
// Si hay VARIOS videos rendeando a la vez, repartí: chunks ≈ 60 / videos_en_curso.
const [slug, comp, total, chunks = "60", pref] = process.argv.slice(2);
if (!slug || !comp || !total) {
  console.error("Uso: node scripts/farm.mjs <slug> <comp_id> <total_frames> [chunks] [prefijo]");
  process.exit(1);
}
const sh = (c) => execSync(c, { stdio: "inherit" });
const out = (c) => execSync(c, { encoding: "utf8" }).trim();
const only = process.env.ONLY_CHUNKS || ""; // re-render PARCIAL: solo estos chunks (reusa el resto; assets ya subidos)

// ── PRE-VUELO (milisegundos, todo local) ────────────────────────────────────────────────
// Sin esto se sube ~1 GB de assets y se encienden 20-24 runners para que recién ADENTRO del
// render Remotion descubra que la composición no está en el commit pusheado. Medido: 8.9 min
// de farm por corrida tirados, varias veces. Chequeamos ANTES de gastar un solo byte.
{
  const ref = process.env.FARM_REF;
  const entryFile = process.env.ENTRY;
  if (entryFile && !fs.existsSync(entryFile)) {
    console.error(`✗ PRE-VUELO: ENTRY=${entryFile} no existe en el disco.`); process.exit(1);
  }
  if (ref) {
    let remoto = "";
    try { remoto = out(`git rev-parse ${ref}`); } catch { /* la rama todavía no existe local */ }
    const local = out("git rev-parse HEAD");
    if (remoto && remoto !== local) {
      console.error(`✗ PRE-VUELO: la rama ${ref} apunta a ${remoto.slice(0, 7)} pero tu HEAD es ${local.slice(0, 7)}.`);
      console.error(`  El farm rendearía un commit VIEJO. Sincronizá: git push -f origin HEAD:${ref}`);
      process.exit(1);
    }
    // el entry tiene que estar EN el commit que va a rendear, no solo en tu working dir
    if (entryFile && remoto) {
      try { out(`git show ${ref}:${entryFile.replace(/\\/g, "/")}`); }
      catch { console.error(`✗ PRE-VUELO: ${entryFile} no está commiteado en ${ref}. Commitealo y pusheá.`); process.exit(1); }
    }
  }
  // la composición tiene que estar declarada en el entry (o en Root.tsx si no hay entry)
  const src = entryFile || "src/Root.tsx";
  if (fs.existsSync(src) && !fs.readFileSync(src, "utf8").includes(`"${comp}"`)) {
    console.error(`✗ PRE-VUELO: la composición "${comp}" no aparece en ${src}. Con entry propio, registrala ahí.`);
    process.exit(1);
  }
  console.log("pre-vuelo ✓ (ref sincronizado, entry commiteado, composición declarada)");
}

if (!only) { // en re-render parcial NO re-empaquetamos ni re-subimos assets (el release assets-<slug> ya existe)
// 1) tarball de assets (TAR_DIR redirige el .tar a otro disco — C: se llena con ~1GB)
const tarDir = process.env.TAR_DIR || ".";
const tar = `${tarDir}/assets-${slug}.tar`;
const avatar = `public/${slug}_opt.mp4`;
const wav = `public/${slug}.wav`;
if (!fs.existsSync(wav)) { console.error("falta:", wav); process.exit(1); }
const hasAvatar = fs.existsSync(avatar); // videos FACELESS (sin avatar) no tienen _opt.mp4
if (!hasAvatar) console.warn(`(faceless) sin ${avatar} — empaqueto solo la narración`);
// rutas relativas a public/ (el workflow extrae con -C public)
let items = [`${slug}.wav`];
if (hasAvatar) items.unshift(`${slug}_opt.mp4`);
if (fs.existsSync("public/sfx")) items.push("sfx"); // camas ambientales + efectos (siempre)
if (fs.existsSync(`public/avatar_clips/${slug}`)) items.push(`avatar_clips/${slug}`); // PiP del avatar SOLO de este slug (aislado; tar incluye el dir recursivo). Si falta → 404 en el farm
if (pref && pref.startsWith("@")) {
  // lista EXPLÍCITA de entradas (rutas relativas a public/), una por línea
  const explicit = fs.readFileSync(pref.slice(1), "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  items = [...new Set([...items, ...explicit])];
} else if (pref) {
  // solo lo de este video + SUS diagramas. Los dg_ se nombran dg_<pref>_* o dg_<slug>_* según
  // el build; antes se empaquetaban TODOS los dg_ (prefijo compartido → diagramas de otros videos).
  // OJO: videos con dg_ SIN prefijo de slug (p.ej. dg_molasses_co2, dg_map_world7) NO entran por acá
  // → esos deben rendearse con la lista EXPLÍCITA "@lista.txt", no con modo prefijo.
  const img = fs.readdirSync("public/img").filter((f) => f.startsWith(pref) || f.startsWith(`dg_${pref}`) || f.startsWith(`dg_${slug}`));
  const vid = fs.existsSync("public/vid") ? fs.readdirSync("public/vid").filter((f) => f.startsWith(pref)) : [];
  items.push(...img.map((f) => `img/${f}`), ...vid.map((f) => `vid/${f}`));
  // footage REAL: fotos de archivo (public/real/*) + video de stock (public/broll/*)
  if (fs.existsSync("public/real"))
    items.push(...fs.readdirSync("public/real").filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f)).map((f) => `real/${f}`));
  if (fs.existsSync("public/broll")) {
    // clips SUELTOS en public/broll (stockfallback, estilo viejo)
    items.push(...fs.readdirSync("public/broll").filter((f) => /\.(mp4|jpg|jpeg|png)$/i.test(f)).map((f) => `broll/${f}`));
    // + subcarpeta POR SLUG: fetch_clips ahora baja a public/broll/<slug>/ — sin esto los clips
    //   matcheados quedaban fuera del tar → 404 en el farm. El dir entra recursivo al tar.
    if (fs.existsSync(path.join("public/broll", slug))) items.push(`broll/${slug}`);
  }
} else {
  items.push("img", "vid");
  if (fs.existsSync("public/real")) items.push("real");
  if (fs.existsSync("public/broll")) items.push("broll");
}
// nombre PER-SLUG en tmpdir: dos farm.mjs en paralelo NO se pisan la lista (antes era "_assets_list.txt" fijo en el CWD)
const listFile = path.join(os.tmpdir(), `_assets_${slug}.txt`);
fs.writeFileSync(listFile, items.join("\n"));
console.log(`empaquetando ${items.length} entradas → ${tar} ...`);
// El tar de Windows (bsdtar) maneja rutas D:\ nativamente y NO soporta --force-local
// (eso es de GNU tar). Detectamos cuál hay: si es bsdtar, sin --force-local.
let tarArgs = ["-cf", tar, "-C", "public", "-T", listFile];
try {
  const help = execSync("tar --version", { encoding: "utf8" });
  if (/GNU tar/i.test(help)) tarArgs = ["--force-local", ...tarArgs]; // solo GNU lo necesita/soporta
} catch { /* asumimos bsdtar */ }
execFileSync("tar", tarArgs, { stdio: "inherit" });
fs.rmSync(listFile);

// 2) subir como release asset (reemplaza si ya existe)
const relTag = `assets-${slug}`;
try { out(`gh release view ${relTag}`); sh(`gh release delete ${relTag} --yes --cleanup-tag`); } catch { /* no existe */ }
sh(`gh release create ${relTag} ${tar} --title ${relTag} --notes "assets del render"`);
fs.rmSync(tar);
}

// 2.5) CANDADO DE RENDER — la cuenta tiene 20 jobs concurrentes en total. Si dos videos rendean a la
// vez se reparten los slots y los DOS tardan el doble. Serializando, cada render usa los 20 a pleno y
// el throughput total es mayor. El resto del pipeline (guion, Modal, b-roll) sigue en paralelo: esto
// solo hace cola en el render. Desactivable con FARM_NO_LOCK=1.
const LOCK = path.join(os.tmpdir(), "bagasy-render.lock");
const LOCK_STALE_MS = 90 * 60 * 1000; // si el dueño se colgó, a los 90' el candado se considera vencido
const napMs = (ms) => execSync(`sleep ${Math.round(ms / 1000)} 2>/dev/null || ping -n ${Math.round(ms / 1000) + 1} 127.0.0.1 >NUL`, { stdio: "ignore", shell: true });
function lockOwner() { // devuelve el dueño VIVO del candado, o null si está libre/vencido/huérfano
  try {
    const j = JSON.parse(fs.readFileSync(LOCK, "utf8"));
    if (Date.now() - j.at > LOCK_STALE_MS) return null;    // vencido
    try { process.kill(j.pid, 0); } catch { return null; } // el proceso dueño ya no existe
    return j;
  } catch { return null; }
}
function releaseLock() {
  try { if (JSON.parse(fs.readFileSync(LOCK, "utf8")).pid === process.pid) fs.rmSync(LOCK, { force: true }); } catch { /* no es mío o no está */ }
}
if (!process.env.FARM_NO_LOCK) {
  let avisado = false;
  for (;;) {
    const dueño = lockOwner();
    if (!dueño) { try { fs.rmSync(LOCK, { force: true }); } catch { /* ya no está */ } }
    try { fs.writeFileSync(LOCK, JSON.stringify({ pid: process.pid, slug, at: Date.now() }), { flag: "wx" }); break; }
    catch {
      if (!avisado) { console.log(`⏳ hay otro render en curso (${dueño?.slug || "otro video"}) — espero mi turno para usar los 20 slots enteros...`); avisado = true; }
      napMs(30_000);
    }
  }
  process.on("exit", releaseLock);
}

// 3) disparar el workflow
console.log(only ? `disparando render.yml (PARCIAL, chunks ${only}) ...` : "disparando render.yml ...");
// ENTRY=src/index_<slug>.tsx → cada video rendea con SU entry y no comparte Root.tsx con los otros agentes
const entry = process.env.ENTRY || "";
sh(`gh workflow run render.yml${process.env.FARM_REF ? ` --ref ${process.env.FARM_REF}` : ""} -f slug=${slug} -f comp_id=${comp} -f total_frames=${total} -f chunks=${chunks}${only ? ` -f only_chunks=${only}` : ""}${entry ? ` -f entry=${entry}` : ""}`);

// 4) esperar y descargar el mp4 final
console.log("esperando que aparezca la corrida ...");
// FARM_NOWAIT=1 → dispara y SALE, imprimiendo el run id. Sirve para que el AGENTE no se quede
// bloqueado 10-15 min adentro de su turno (consumiendo un slot de paralelismo y cuota sin hacer
// nada): emite "WAIT_RUN: <id>", cierra el turno, y el WORKER espera el render por él y lo despierta.
execSync("sleep 8 2>/dev/null || ping -n 9 127.0.0.1 >NUL", { stdio: "ignore", shell: true });
// OJO: filtrar por LA RAMA de este video. Sin -b, con varios videos en curso agarrás la corrida más
// reciente del repo — que puede ser la de OTRO agente, y terminás mirando y bajando su render.
const runId = out(`gh run list --workflow=render.yml${process.env.FARM_REF ? ` -b ${process.env.FARM_REF}` : ""} --limit 1 --json databaseId --jq ".[0].databaseId"`);
if (process.env.FARM_NOWAIT) {
  console.log(`WAIT_RUN: ${runId}`);
  console.log("(disparado sin esperar: el worker vigila el render y te despierta cuando termine)");
  process.exit(0);
}
console.log("corrida:", runId, "— siguiendo (esto tarda según los pedazos)...");
try { sh(`gh run watch ${runId} --exit-status`); } catch { console.error("la corrida fallo; revisá: gh run view " + runId); process.exit(1); }
// destino fijo en el disco grande (D:) para no quedarse sin espacio en C: al
// extraer el mp4 (~1.5 GB). Override con env VIDEO_OUT si hace falta.
const DEST = process.env.VIDEO_OUT || "D:\\videosdeclaude";
fs.mkdirSync(DEST, { recursive: true });
sh(`gh run download ${runId} -n final-${slug} -D "${DEST}"`);
console.log(`\n✅ listo → ${DEST}\\${slug}.mp4`);
