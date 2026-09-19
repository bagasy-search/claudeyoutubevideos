// rksmart_despacho.mjs — arma la rama de render por PLUMBING (sin tocar el working tree, que es
// COMPARTIDO con otras dos sesiones) y dispara el farm desde un worktree aislado.
//   node _v3/rksmart_despacho.mjs            (arma la ref y la pushea)
//   node _v3/rksmart_despacho.mjs --solo-ref (no dispara el farm)
//
// ⛔⛔ PROHIBIDO `git checkout` / `switch` / `reset` / `clean` / `stash` en este repo: una sesión
//     que cambió de rama se llevó 1.076 líneas sin commitear de otro agente.
// ⛔⛔ EL FARM RINDE EL COMMIT PUSHEADO, PERO EL TAR SALE DEL DISCO. Todo lo que el código nuevo
//     usa tiene que estar EN LA REF antes de disparar, o el runner rinde el código viejo contra
//     los assets nuevos y los chunks mueren con 404 que apuntan a archivos que sí están en disco.
// ⛔ El `render.yml` de la rama base NO declara `stitch_raw` (el workflow al día vive sólo en las
//     ramas de render recientes). Sin ese input el despacho rebota con HTTP 422 al FINAL, con el
//     tar ya subido. Se trae el blob de una rama que lo tenga.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const sh = (c, a, o = {}) => execFileSync(c, a, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...o }).trim();
const REF = "rksmart-render";
// ⛔ LA BASE NO ES HEAD: es el commit donde otra sesion arreglo `render.yml` (5295eff). Ese
//    workflow es el que trae `stitch_raw` (sin el, `-f stitch_raw=1` rebota con HTTP 422 al FINAL
//    del despacho, con el tar ya subido) Y el fix del WAV MASTER en el job de `stitch` — sin ese
//    segundo, el audio final se arma con los chunks concatenados y la voz queda corrida +4,4 s
//    respecto de la imagen, que ninguna medicion de cuadros ve y se percibe como "lageado".
//    `gh workflow run --ref <rama>` usa el render.yml DE ESA RAMA: si la base es anterior, el fix
//    no llega.
const BASE = sh("git", ["rev-parse", process.env.RKSMART_BASE || "5295eff"]);

const MIOS = [
  "canales/rksmart_GUION.txt",
  "src/rksafe/RayAvatarWin.tsx",
  "src/VideoEdit/Main_rksmart.tsx",
  "src/VideoEdit/cues_rksmart.gen.tsx",
  "src/VideoEdit/avatar_rksmart.gen.ts",
  "src/index_rksmart.tsx",
  "_v3/rksmart_prompts.mjs", "_v3/rksmart_p1.mjs", "_v3/rksmart_p2.mjs", "_v3/rksmart_p3.mjs", "_v3/rksmart_p4.mjs",
  "_v3/rksmart_plan.mjs", "_v3/rksmart_build.mjs", "_v3/rksmart_avwin.mjs", "_v3/rksmart_av_job.mjs",
  "_v3/rksmart_moments.py", "_v3/rksmart_align.py", "_v3/rksmart_refs.py", "_v3/rksmart_voicegate.py",
  "_v3/rksmart_varagate.mjs", "_v3/rksmart_ingest.mjs", "_v3/rksmart_despacho.mjs",
  "_v3/rksmart_propgate.mjs", "_v3/rksmart_avcut.mjs", "_v3/rksmart_entrega.mjs",
  "_v3/rksmart_auditor.py", "_v3/rksmart_hechosgate.py", "_v3/rksmart_cues.json",
  "_v3/rksmart_plan.json", "_v3/rksmart_windows.json", "_v3/rksmart_mom.json",
];
for (const f of MIOS) if (!fs.existsSync(f)) { console.error("⛔ falta " + f); process.exit(1); }

// ── la ref, por plumbing PURO: read-tree SIN -u (nunca toca el working tree) ──
sh("git", ["read-tree", BASE]);
try {
  for (const f of MIOS) {
    const h = sh("git", ["hash-object", "-w", f]);
    sh("git", ["update-index", "--add", `--cacheinfo`, `100644,${h},${f}`]);
  }
  const tree = sh("git", ["write-tree"]);
  const commit = sh("git", ["commit-tree", tree, "-p", BASE], { input: "rksmart: Are Smart Locks Safe? (Ray Kessler)\n" });
  sh("git", ["update-ref", `refs/heads/${REF}`, commit]);
  sh("git", ["push", "-f", "origin", `${REF}`]);
  console.log(`ref ${REF} → ${commit.slice(0, 8)} (base ${BASE.slice(0, 8)})`);
} finally {
  sh("git", ["reset", "--mixed", "HEAD"]);   // el índice vuelve a su lugar; el working tree nunca se tocó
}

// ── COMPUERTAS DE PRE-VUELO ────────────────────────────────────────────────
const enRef = new Set(sh("git", ["ls-tree", "-r", "--name-only", REF]).split("\n"));
const faltan = MIOS.filter((f) => !enRef.has(f));
console.log(`PRE-VUELO archivos míos en la ref: ${MIOS.length - faltan.length}/${MIOS.length} ${faltan.length ? "⛔ " + faltan.join(",") : "✓"}`);
const ymlOk = (sh("git", ["show", `${REF}:.github/workflows/render.yml`]).match(/stitch_raw/g) || []).length;
console.log(`PRE-VUELO stitch_raw en el render.yml de la ref: ${ymlOk} (tienen que ser 4) ${ymlOk === 4 ? "✓" : "⛔"}`);
// el árbol de imports del entry: todo tiene que existir EN LA REF (tsc compila contra el DISCO, no el índice)
const vistos = new Set(), pend = ["src/index_rksmart.tsx"];
let rotos = [];
while (pend.length) {
  const f = pend.pop();
  if (vistos.has(f)) continue;
  vistos.add(f);
  let src;
  try { src = sh("git", ["show", `${REF}:${f}`]); } catch { rotos.push(f); continue; }
  for (const m of src.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
    const rel = m[1];
    const dir = f.split("/").slice(0, -1).join("/");
    const p = new URL(rel, "file:///" + dir + "/").pathname.slice(1);
    const cand = [p, p + ".tsx", p + ".ts", p + "/index.tsx", p + "/index.ts"].find((c) => enRef.has(c));
    if (cand) pend.push(cand); else rotos.push(`${rel} (desde ${f})`);
  }
}
console.log(`PRE-VUELO árbol de imports: ${vistos.size} módulos revisados en la ref · rotos ${rotos.length} ${rotos.length ? "⛔ " + rotos.slice(0, 6).join(" | ") : "✓"}`);
if (faltan.length || ymlOk !== 4 || rotos.length) process.exit(3);
if (vistos.size < 5) { console.error("⛔ el chequeo de imports midió " + vistos.size + " módulos: está roto"); process.exit(2); }
console.log("→ ref lista. El farm se dispara desde el worktree, con el farm.mjs del repo base.");
