// stock_vucm3bvd4u3k.mjs — b-roll REAL por la cascada de stock, AISLADO por slug.
//
// Por qué existe: la ruta de YouTube de match_v3 quedó caída en esta corrida
// (`yt-dlp -J` falló en los 139 beats → 100% escasos, cero candidatos limpios).
// La cascada de stock es el paso 9 previsto del propio pipeline, así que la uso
// directo con los beats YA autorados por los directores.
//
// ⛔ Aislamiento: `scripts/stockfallback.mjs` escribe en `public/broll` A SECAS
// (carpeta COMPARTIDA) y saltea los que ya existen → heredaría clips de otro
// video y `broll_isolation_gate` lo bloquea. Acá el destino es
// `public/broll/vucm3bvd4u3k/`.
//
//   node scripts/stock_vucm3bvd4u3k.mjs [concurrencia=4]
import fs from "fs";
import path from "path";

// .env a mano (stock_lib lee process.env y nadie carga el .env)
try {
  for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = l.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const { acquireStock } = await import("./stock_lib.mjs");

const SLUG = "vucm3bvd4u3k";
const OUT = `public/broll/${SLUG}`;
const CONC = +(process.argv[2] || 4);
fs.mkdirSync(OUT, { recursive: true });

const beats = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8"));
const pend = beats.filter((b) => !fs.existsSync(path.join(OUT, `${b.name}.mp4`)));
console.log(`stock aislado → ${OUT}/ · ${beats.length} beats · ${pend.length} pendientes · concurrencia ${CONC}`);

let ok = 0, fail = 0, i = 0;
const falla = [];

async function worker(wid) {
  while (true) {
    const b = pend[i++];
    if (!b) return;
    // `concept` va en INGLÉS (el desc que escribieron los directores): Pexels y
    // Pixabay indexan en inglés. Las queries en español quedan como respaldo.
    const got = await acquireStock(
      { name: b.name, concept: b.desc, queries: [...(b.queries || [])], dur: Math.max(4, Math.ceil(b.dur) + 2) },
      OUT
    ).catch((e) => { console.log(`  ! ${b.name} ${String(e.message || e).slice(0, 70)}`); return null; });
    if (got) ok++;
    else { fail++; falla.push({ name: b.name, concept: b.desc, phrase: b.phrase, dur: b.dur }); }
    if ((ok + fail) % 20 === 0) console.log(`  … ${ok + fail}/${pend.length} (ok ${ok} · sin stock ${fail})`);
  }
}

await Promise.all(Array.from({ length: CONC }, (_, k) => worker(k)));

fs.writeFileSync(`_v3/${SLUG}_sinstock.json`, JSON.stringify(falla, null, 1));
const enDisco = fs.readdirSync(OUT).filter((f) => /\.mp4$/i.test(f));
console.log(`\n=== stock: ${ok} bajados · ${fail} sin stock · ${enDisco.length} clips en ${OUT}/ ===`);
if (falla.length) console.log(`   los ${falla.length} sin stock → _v3/${SLUG}_sinstock.json (se cubren con imagen generada)`);
