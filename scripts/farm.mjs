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
// SFX: `public/` está en .gitignore, así que un worktree nuevo nace SIN public/sfx. Este `if` se
// escribió como defensa, pero la rama defensiva ES el caso roto: el tar salía sin sfx, en silencio,
// y cada chunk que usaba un whoosh moría con "404 downloading /public/sfx/…". Costó 13 de 20 chunks
// en el render del GUANTE de ROMERO. Si el build los pide y no están, se frena ACÁ —en 1 segundo y
// gratis— en vez de descubrirlo 20 runners y 8 minutos más tarde.
if (fs.existsSync("public/sfx")) {
  items.push("sfx"); // camas ambientales + efectos (siempre)
} else {
  // Acá NO se intenta adivinar si ESTE build usa sfx. El build no los nombra: los pide un componente
  // del kit (scenes/RawShot, AvatarKeyword, Endcard…) varios imports más abajo, así que mirar el
  // Main_ da 0 coincidencias y deja pasar el tarball roto — que es justo lo que pasó. Rastrear la
  // cadena de imports sería frágil, y los costos son asimétricos: un bloqueo de más cuesta copiar
  // una carpeta; un OK de más cuesta 13 chunks y 8 minutos de 20 runners. Así que si falta, se frena.
  console.error(`✗ FALTA public/sfx/ — el kit la referencia desde sus componentes y los chunks van a morir con "404 downloading /public/sfx/…".`);
  console.error(`  (public/ está en .gitignore, así que un worktree nuevo nace sin ella.)`);
  console.error(`  Copiala del repo base y volvé a lanzar:`);
  console.error(`    cp -r "${(process.env.VIDEO2_BASE || "C:/Users/bauti/Downloads/video2").replace(/\\/g, "/")}/public/sfx" public/sfx`);
  process.exit(1);
}
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
// ── PRE-VUELO DE ASSETS ───────────────────────────────────────────────────────────────────────
// El pre-vuelo de arriba valida ref/entry/composición, pero de los ASSETS no miraba nada, y ahí
// está el error que más tiempo costó. El tar se arma con una lista permitida (prefijo o @lista);
// todo lo que el build referencia y queda FUERA de esa lista no da error acá — da 404 adentro del
// render, con 20 runners encendidos. Auditoría de los 5 últimos videos: 6 corridas fallidas,
// 76 min de reloj tirados, y 4 de las 6 fueron exactamente esto:
//   · v8v252t7cjxe → 15 chunks por public/sfx/sfx_whoosh_soft.mp3
//   · vd5n5s9bhk4q → 13 chunks por el MISMO archivo
//   · vucm3bvd4u3k →  1 chunk  por public/med/avatar.mp4
//   · v3iuzgxce9vg →  5 chunks por "undefined was passed to staticFile()"
// Ahora se resuelve local, en menos de un segundo. La lista `items` ya está armada acá, así que
// se compara contra ella: existe en disco Y entra al tar. Si no, no se sube nada.
{
  // No sirve escanear el build: los assets compartidos NO se nombran ahí. Los pide el KIT, varios
  // imports más abajo (scenes/RawShot, components/Sfx, Endcard…), así que el Main_ da 0 referencias
  // y el chequeo pasaría de largo justo el error que más caro salió. Se cuentan en src/ y son dos:
  // sfx (292 referencias) y med (21). Las dos rompieron renders. Se exigen enteras, siempre.
  const COMPARTIDAS = (process.env.ASSETS_COMPARTIDOS || "sfx,med").split(",").map((s) => s.trim()).filter(Boolean);
  const usa = (dir) => {
    try {
      return execSync(`git grep -lE "/?(public/)?${dir}/[^\\"'\`]+\\.(png|jpe?g|webp|mp4|webm|mov|mp3|wav)" -- src 2>/dev/null || true`,
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().length > 0;
    } catch { return true; } // sin git no adivino: la doy por usada (falso bloqueo < falso OK)
  };
  const rotas = COMPARTIDAS.filter((d) => usa(d) && !fs.existsSync(`public/${d}`));
  if (rotas.length) {
    const base = (process.env.VIDEO2_BASE || "C:/Users/bauti/Downloads/video2").replace(/\\/g, "/");
    console.error(`✗ PRE-VUELO ASSETS: falta${rotas.length > 1 ? "n" : ""} public/${rotas.join(", public/")} y el kit ${rotas.length > 1 ? "las referencia" : "la referencia"} → los chunks mueren con "404 downloading /public/…", con todos los runners ya encendidos.`);
    console.error(`  (public/ está en .gitignore: un worktree nuevo nace sin estas carpetas.)`);
    for (const d of rotas) console.error(`    cp -r "${base}/public/${d}" public/${d}`);
    process.exit(1);
  }
  for (const d of COMPARTIDAS) if (fs.existsSync(`public/${d}`) && !items.includes(d)) items.push(d);

  // ── ASSETS DEL VIDEO, desde los DATOS del build ─────────────────────────────────────────────
  // Escanear el Main_ no sirve (no nombra assets) y el manifiesto Main_ de src/VideoEdit miente
  // (lista lo PLANIFICADO, no lo que se rendea). Los assets de verdad viven en el archivo de beats
  // que consume el build: {"kind":"raw","src":"img/…"}, {"kind":"quote","image":"img/…"}. Eso sí es
  // la fuente de la verdad. Un `src`/`image` que apunta a un archivo inexistente da, adentro del
  // render, "404 downloading …" o "undefined was passed to staticFile()" — la falla que tiró 5
  // chunks del urólogo. Encontrado con esto en el GUANTE: 2 imágenes .png que nunca se generaron,
  // entre 121 referencias, cuando las otras 85 eran .jpg.
  const datos = fs.existsSync("src/_fed6/VideoEdit") || fs.existsSync("src/VideoEdit")
    ? [...(fs.existsSync("src/_fed6/VideoEdit") ? fs.readdirSync("src/_fed6/VideoEdit").map((f) => `src/_fed6/VideoEdit/${f}`) : []),
       ...(fs.existsSync("src/VideoEdit") ? fs.readdirSync("src/VideoEdit").map((f) => `src/VideoEdit/${f}`) : [])]
        .filter((f) => f.includes(slug) && /(beats|cues)[^/]*\.(ts|tsx)$/.test(f))
    : [];
  if (datos.length) {
    const refs = new Set();
    let sinSrc = 0;
    for (const f of datos) {
      const txt = fs.readFileSync(f, "utf8");
      for (const m of txt.matchAll(/"(?:src|image|poster|clip|video|thumb|bg)":\s*"([^"]+)"/g)) {
        const r = m[1].replace(/^\/?(?:public\/)?/, "");
        if (/\.(png|jpe?g|webp|mp4|webm|mov)$/i.test(r)) refs.add(r);
      }
      // un beat que necesita asset y no lo trae → staticFile(undefined) a mitad del render
      sinSrc += [...txt.matchAll(/\{[^{}]*"kind":\s*"raw"[^{}]*\}/g)].filter((m) => !/"src":\s*"[^"]+"/.test(m[0])).length;
    }
    const cubre = (r) => items.some((it) => r === it || r.startsWith(it.replace(/\/*$/, "") + "/"));
    const faltan = [...refs].filter((r) => !fs.existsSync(path.join("public", r)));
    const fueraDelTar = [...refs].filter((r) => fs.existsSync(path.join("public", r)) && !cubre(r));
    if (sinSrc) {
      console.error(`✗ PRE-VUELO ASSETS: ${sinSrc} beat(s) de tipo "raw" sin campo src. Adentro del render eso es "undefined was passed to staticFile()" y mata el chunk a mitad de camino.`);
      process.exit(1);
    }
    if (faltan.length || fueraDelTar.length) {
      console.error(`✗ PRE-VUELO ASSETS: de ${refs.size} assets que pide el build, ${faltan.length + fueraDelTar.length} no van a estar en el render:`);
      for (const r of faltan.slice(0, 10)) console.error(`    ${r}   (NO existe en public/ — hay que generarlo)`);
      for (const r of fueraDelTar.slice(0, 10)) console.error(`    ${r}   (existe, pero queda FUERA de la lista del tar)`);
      const n = faltan.length + fueraDelTar.length;
      if (n > 20) console.error(`    … y ${n - 20} más`);
      process.exit(1);
    }
    console.log(`pre-vuelo assets ✓ (${refs.size} assets del build, todos presentes y en el tar)`);
  }
  console.log(`pre-vuelo compartidas ✓ (${COMPARTIDAS.filter((d) => fs.existsSync(`public/${d}`)).join(", ") || "ninguna"})`);
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

// ── EL MISMO CHEQUEO DE ASSETS, PERO PARA RE-RENDER PARCIAL ───────────────────────────────────
// Va acá AFUERA a propósito. Todo el pre-vuelo de arriba vive adentro de `if (!only)` —que cierra
// recién en esta línea, no donde parece—, así que en un parcial no corre nada: justo cuando más
// falta, porque no se re-empaqueta y un asset ausente en disco va a estar ausente en el render.
// (Escribí este bloque una vez adentro del `if (!only)` sin darme cuenta: era código muerto y las
// 2 imágenes .png inexistentes del GUANTE se colaron igual.)
// En parcial no se puede comparar contra la lista del tar (no se arma), pero sí contra el disco,
// que es lo que caza el caso real: el build pide un archivo que nunca se generó.
if (only) {
  const dirs = ["src/_fed6/VideoEdit", "src/VideoEdit"].filter((d) => fs.existsSync(d));
  const datos = dirs.flatMap((d) => fs.readdirSync(d).map((f) => `${d}/${f}`))
    .filter((f) => f.includes(slug) && /(beats|cues)[^/]*\.(ts|tsx)$/.test(f));
  const refs = new Set();
  for (const f of datos) {
    for (const m of fs.readFileSync(f, "utf8").matchAll(/"(?:src|image|poster|clip|video|thumb|bg)":\s*"([^"]+)"/g)) {
      const r = m[1].replace(/^\/?(?:public\/)?/, "");
      if (/\.(png|jpe?g|webp|mp4|webm|mov)$/i.test(r)) refs.add(r);
    }
  }
  const faltan = [...refs].filter((r) => !fs.existsSync(path.join("public", r)));
  if (faltan.length) {
    console.error(`✗ PRE-VUELO ASSETS (parcial): el build pide ${faltan.length} archivo(s) que no existen en public/. Van a dar 404 o "undefined was passed to staticFile()" adentro del render:`);
    for (const r of faltan.slice(0, 12)) console.error(`    ${r}`);
    if (faltan.length > 12) console.error(`    … y ${faltan.length - 12} más`);
    console.error(`  Generalos y volvé a lanzar. OJO: al ser parcial NO se re-sube el tar, así que si el asset es nuevo necesitás un render COMPLETO para que viaje.`);
    process.exit(1);
  }
  if (refs.size) console.log(`pre-vuelo assets ✓ (parcial: ${refs.size} assets del build, todos en disco)`);
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
// ── EL TARBALL TIENE QUE ESTAR DESCARGABLE ANTES DE ENCENDER UN RUNNER ───────────────────────
// `gh release create` con un asset grande crea el release como DRAFT, sube, y recién ahí lo
// publica. Si la subida falla o va lenta, queda un release sin assets —o todavía en draft— y los
// runners mueren con "release not found". Un re-render PARCIAL es peor todavía: no re-empaqueta
// nada (línea ~77), da por sentado que el release de una corrida anterior sigue ahí, y si no está
// se caen los 20 chunks sin excepción. Pasó hoy con el GUANTE: run 30274215774, 20 de 20 caídos,
// release publicado 4 minutos DESPUÉS de que arrancara el render y con 0 assets adentro.
// Chequear cuesta una llamada a la API; no chequear cuesta 20 runners.
{
  const relTag = `assets-${slug}`;
  let ok = false, motivo = "";
  try {
    const j = JSON.parse(out(`gh release view ${relTag} --json isDraft,assets`));
    const tarAsset = (j.assets || []).find((a) => /\.tar$/i.test(a.name));
    if (j.isDraft) motivo = "el release quedó en DRAFT (la subida no terminó) — los runners no pueden bajarlo";
    else if (!tarAsset) motivo = `el release existe pero NO tiene el .tar adentro (${(j.assets || []).length} assets)`;
    else if (!tarAsset.size) motivo = "el .tar está en el release pero pesa 0";
    else ok = true;
  } catch { motivo = "no existe el release de assets"; }
  if (!ok) {
    console.error(`✗ PRE-VUELO RELEASE: ${motivo}.`);
    console.error(`  Los ${chunks} chunks morirían con "release not found" o 404 al bajar los assets.`);
    console.error(only
      ? `  Estás en re-render PARCIAL (ONLY_CHUNKS=${only}), que NO re-sube assets. Corré un render COMPLETO (sin ONLY_CHUNKS) para regenerar el tarball.`
      : `  Reintentá el empaquetado: la subida del release falló.`);
    process.exit(1);
  }
}
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
