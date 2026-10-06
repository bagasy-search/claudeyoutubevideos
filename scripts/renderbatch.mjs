// renderbatch.mjs — LANZA VARIOS VIDEOS repartidos automáticamente entre tus cuentas de GitHub.
// ─────────────────────────────────────────────────────────────────────────────────────────────
// EL PROBLEMA QUE RESUELVE: la cuenta Team tiene 60 jobs concurrentes (TECHO DURO del plan). Un
// render son ~60 chunks = 60 jobs, así que UN video ya llena la cuenta. Al mandar varios videos a
// la vez se traban en la cola de 60. Ya lo esquivabas a mano con _acct1.sh/_acct2.sh (repartir
// videos entre 2 cuentas = 2×60 = 120 slots). Esto lo hace AUTOMÁTICO y escala a N cuentas:
//   · mira cuántos renders tiene en curso cada cuenta,
//   · manda cada video a la cuenta MÁS LIBRE,
//   · pushea el código de ESTA rama al repo de esa cuenta (así rendea exactamente tu commit),
//   · dispara farm.mjs por video con el token+repo de su cuenta y espera a todos.
// El auto-reparto de farm.mjs sigue actuando ADENTRO de cada cuenta (baja chunks si igual se juntan
// varios en la misma), así que las dos capas componen: el router reparte ENTRE cuentas, farm reparte
// DENTRO de cada una.
//
// CONFIG (una vez): .render_accounts.json  (gitignored). Formato:
//   [ { "name":"acct1", "remote":"origin" },
//     { "name":"acct2", "tokenFile":".gh_token2", "repo":"speechnotesoficial-wq/videos2clauderender" } ]
//   - acct1 usa tu `gh auth` actual y el remote `origin`.
//   - acct2 lee el token de tokenFile y apunta a `repo` (el token debe tener push+actions en ese repo).
//
// USO:
//   node scripts/renderbatch.mjs <tanda.json>
//   node scripts/renderbatch.mjs --dry <tanda.json>      # solo muestra el reparto, no dispara nada
//   node scripts/renderbatch.mjs '[{"slug":"x","comp":"X","total":42000,"pref":"@_x.txt"}]'
//
//   tanda.json = [ { slug, comp, total, chunks?, pref?, entry? }, ... ]
//     - chunks opcional (default lo maneja farm.mjs + su auto-reparto).
//     - pref opcional: "@lista.txt" o prefijo, igual que el 5º arg de farm.mjs.
//     - entry opcional: default src/index_<slug>.tsx si existe.
//
// PRE-REQUISITO por cuenta secundaria: su repo debe existir y tener .github/workflows/render.yml
// (el router lo verifica y, si no, descarta esa cuenta y avisa en vez de romper la tanda).
import { execSync, execFileSync, spawn } from "node:child_process";
import fs from "node:fs";

const argv = process.argv.slice(2);
const dry = argv.includes("--dry");
const jobArg = argv.find((a) => a !== "--dry");
if (!jobArg) { console.error("Uso: node scripts/renderbatch.mjs [--dry] <tanda.json | json-inline>"); process.exit(1); }

// ── lista de videos ──────────────────────────────────────────────────────────────────────────
let jobs;
try { jobs = JSON.parse(fs.existsSync(jobArg) ? fs.readFileSync(jobArg, "utf8") : jobArg); }
catch (e) { console.error(`✗ no pude leer la tanda (${jobArg}): ${e.message}`); process.exit(1); }
if (!Array.isArray(jobs) || !jobs.length) { console.error("✗ la tanda está vacía o no es un array"); process.exit(1); }
for (const j of jobs) if (!j.slug || !j.comp || !j.total) { console.error(`✗ job incompleto (falta slug/comp/total): ${JSON.stringify(j)}`); process.exit(1); }

// ── cuentas ────────────────────────────────────────────────────────────────────────────────────
const CFG = ".render_accounts.json";
if (!fs.existsSync(CFG)) { console.error(`✗ falta ${CFG}. Creá la config de cuentas (ver cabecera del script).`); process.exit(1); }
const out = (c, env) => execSync(c, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], env: env || process.env }).trim();
const originUrl = out("git remote get-url origin");
const originRepo = (originUrl.match(/github\.com[/:]([^/]+\/[^/.]+)/) || [])[1] || "";
const branch = out("git rev-parse --abbrev-ref HEAD");
const head = out("git rev-parse HEAD");

const accounts = JSON.parse(fs.readFileSync(CFG, "utf8")).map((a) => {
  const token = a.tokenFile ? (fs.existsSync(a.tokenFile) ? fs.readFileSync(a.tokenFile, "utf8").trim() : null) : null;
  const repo = a.repo || (a.remote === "origin" ? originRepo : null);
  return { ...a, token, repo };
});

// env de gh para una cuenta: token propio (o el `gh auth` actual si no tiene) + su repo
const ghEnv = (acc) => ({ ...process.env, ...(acc.token ? { GH_TOKEN: acc.token } : {}), GH_REPO: acc.repo });

// ── salud + carga de cada cuenta ────────────────────────────────────────────────────────────────
console.log(`rama a rendear: ${branch} (${head.slice(0, 7)}) · repo origin: ${originRepo}`);
const usable = [];
for (const acc of accounts) {
  if (!acc.repo) { console.warn(`⚠ ${acc.name}: sin repo resoluble — la salteo`); continue; }
  if (acc.tokenFile && !acc.token) { console.warn(`⚠ ${acc.name}: no encontré el token en ${acc.tokenFile} — la salteo`); continue; }
  let load = 0;
  try {
    out(`gh repo view ${acc.repo} --json name`, ghEnv(acc)); // repo alcanzable + token válido
  } catch { console.warn(`⚠ ${acc.name} (${acc.repo}): no accesible (token inválido/vencido o sin permiso al repo) — la salteo`); continue; }
  try {
    // renders en curso = proxy por nº de corridas vivas (para mandar cada video a la cuenta más libre)
    const runs = JSON.parse(out(`gh run list --workflow=render.yml -R ${acc.repo} -L 60 --json status`, ghEnv(acc)));
    load = runs.filter((r) => r.status !== "completed").length;
  } catch { load = 0; /* repo todavía sin render.yml: el push de abajo se lo crea */ }
  console.log(`✓ ${acc.name} (${acc.repo}): ${load} render(s) en curso`);
  usable.push({ ...acc, load });
}
if (!usable.length) { console.error("✗ ninguna cuenta usable. Revisá .render_accounts.json y los tokens."); process.exit(1); }

// ── reparto: cada video a la cuenta con MENOS carga (contando lo que ya asigné) ──────────────────
const bySize = [...jobs].sort((a, b) => Number(b.total) - Number(a.total)); // los largos primero, mejor packing
const plan = [];
for (const job of bySize) {
  usable.sort((x, y) => x.load - y.load);
  const acc = usable[0];
  acc.load += 1;
  plan.push({ job, acc });
}
console.log("\n── REPARTO ──");
for (const { job, acc } of plan) console.log(`  ${job.slug.padEnd(16)} → ${acc.name} (${acc.repo})`);
console.log("");
if (dry) { console.log("(--dry: no disparo nada)"); process.exit(0); }

// ── push del código a cada repo destino, una vez por cuenta usada ────────────────────────────────
// Cada cuenta rendea el commit que tenga en SU repo. Pusheamos ESTA rama a cada repo destino para
// que todas rendeen exactamente tu HEAD local. El token va en la URL solo para este push (no queda
// guardado en ningún remote ni se imprime).
const cuentasUsadas = [...new Map(plan.map(({ acc }) => [acc.name, acc])).values()];
for (const acc of cuentasUsadas) {
  const dest = acc.remote === "origin" && !acc.token ? "origin" :
    `https://x-access-token:${acc.token || out("gh auth token")}@github.com/${acc.repo}.git`;
  process.stdout.write(`push ${branch} → ${acc.name} (${acc.repo}) ... `);
  try { execFileSync("git", ["push", "-f", dest, `HEAD:${branch}`], { stdio: ["ignore", "ignore", "inherit"] }); console.log("ok"); }
  catch { console.error(`\n✗ falló el push a ${acc.name}. No disparo esa cuenta.`); acc.broken = true; }
}

// ── disparo: un farm.mjs por video, con el token+repo de su cuenta ────────────────────────────────
const runOne = ({ job, acc }) => new Promise((resolve) => {
  const entry = job.entry || (fs.existsSync(`src/index_${job.slug}.tsx`) ? `src/index_${job.slug}.tsx` : "");
  const args = ["scripts/farm.mjs", job.slug, job.comp, String(job.total)];
  if (job.chunks) args.push(String(job.chunks)); else if (job.pref) args.push("60"); // farm baja solo por auto-reparto
  if (job.pref) args.push(job.pref);
  const env = { ...ghEnv(acc), FARM_REF: branch, ...(entry ? { ENTRY: entry } : {}) };
  const tag = `[${job.slug}@${acc.name}]`;
  const child = spawn(process.execPath, args, { env });
  const pipe = (stream, w) => stream.on("data", (b) => b.toString().split(/\r?\n/).forEach((l) => l && w(`${tag} ${l}`)));
  pipe(child.stdout, console.log); pipe(child.stderr, (l) => console.error(l));
  child.on("close", (code) => { console.log(`${tag} ${code === 0 ? "✅ OK" : `✗ salió ${code}`}`); resolve({ job, acc, code }); });
});

const results = [];
for (const item of plan) {
  if (item.acc.broken) { console.error(`[${item.job.slug}] cuenta ${item.acc.name} caída por el push — no lo disparo`); results.push({ ...item, code: -1 }); continue; }
  results.push(runOne(item)); // arrancan en paralelo; farm.mjs de distinto slug no se pisan
  execSync("sleep 4 2>/dev/null || ping -n 5 127.0.0.1 >NUL", { stdio: "ignore", shell: true }); // stagger anti-thrash de disco
}
const done = await Promise.all(results.map((r) => (r.then ? r : Promise.resolve(r))));

console.log("\n── RESUMEN ──");
for (const { job, acc, code } of done) console.log(`  ${job.slug.padEnd(16)} ${acc.name.padEnd(7)} ${code === 0 ? "✅" : "✗ (revisá el log arriba)"}`);
const fallaron = done.filter((d) => d.code !== 0);
console.log(fallaron.length ? `\n${fallaron.length}/${done.length} fallaron.` : `\n✅ los ${done.length} videos OK → D:\\videosdeclaude\\<slug>.mp4`);
process.exit(fallaron.length ? 1 : 0);
