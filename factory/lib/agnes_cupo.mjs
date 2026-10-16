// agnes_cupo.mjs — TOPE GLOBAL de pedidos simultáneos a agnes (imágenes y juez/chat) entre TODOS los procesos de la PC.
//
// Por qué (16-oct-2026): cada sesión corría agnes_img con --conc 9 y el juez con --conc 10. Con ~10 sesiones a la par
// eran ~90 pedidos en vuelo → agnes contesta 429 a todos, cada uno reintenta 4-6 veces y FALLA: Lou 2 hizo 26 de 150
// imágenes en 1 h, y el juez marcaba "sin_respuesta" = rechazo falso → la imagen se volvía a generar (más carga).
// Con el tope los pedidos hacen fila en disco y el que entra sale bien a la primera: a la larga sale MÁS rápido.
//
// Uso:  import { conCupo } from ".../factory/lib/agnes_cupo.mjs";
//       const txt = await conCupo("img", async () => { const r = await fetch(...); return r.text(); });
// Clases y tope (cambiable por env): img = AGNES_CUPO_IMG (14) · chat = AGNES_CUPO_CHAT (10).
// Lugares = carpetas D:/rtmp/agnes_cupo/<clase>/<n> (mkdir es atómico en Windows). Un lugar de un proceso muerto,
// o con más de 6 min, se libera solo.  Ver la fila:  node factory/lib/agnes_cupo.mjs
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const RAIZ = process.env.AGNES_CUPO_DIR || (fs.existsSync("D:/") ? "D:/rtmp/agnes_cupo" : path.join(os.tmpdir(), "agnes_cupo"));
const TOPE = { img: Number(process.env.AGNES_CUPO_IMG || 14), chat: Number(process.env.AGNES_CUPO_CHAT || 10) };
const VIEJO = 6 * 60e3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const vivo = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; } };

function liberarSiMuerto(d) {
  try {
    const st = fs.statSync(d), pid = Number(fs.readFileSync(path.join(d, "pid"), "utf8"));
    if (Date.now() - st.mtimeMs > VIEJO || (pid && !vivo(pid))) fs.rmSync(d, { recursive: true, force: true });
  } catch {
    // carpeta sin pid: puede estar naciendo; si tiene más de 10 s, quedó huérfana
    try { if (Date.now() - fs.statSync(d).mtimeMs > 10_000) fs.rmSync(d, { recursive: true, force: true }); } catch {}
  }
}

async function tomar(clase) {
  const n = TOPE[clase] || 8, dir = path.join(RAIZ, clase), t0 = Date.now();
  fs.mkdirSync(dir, { recursive: true });
  let avisado = false;
  for (let vuelta = 0; ; vuelta++) {
    const orden = [...Array(n).keys()].sort(() => Math.random() - 0.5);
    for (const i of orden) {
      const d = path.join(dir, String(i));
      try { fs.mkdirSync(d); fs.writeFileSync(path.join(d, "pid"), String(process.pid)); return d; } catch {}
    }
    if (vuelta % 20 === 0) for (const i of orden) liberarSiMuerto(path.join(dir, String(i)));
    if (!avisado && Date.now() - t0 > 120e3) { console.log(`   ⏳ agnes_cupo: en fila para "${clase}" (${n} lugares ocupados por otras sesiones)`); avisado = true; }
    await sleep(300 + Math.random() * 900);
  }
}

/** Corre fn() ocupando un lugar de la clase; lo suelta siempre (aunque fn falle). */
export async function conCupo(clase, fn) {
  const d = await tomar(clase);
  try { return await fn(); } finally { try { fs.rmSync(d, { recursive: true, force: true }); } catch {} }
}

// CLI: node factory/lib/agnes_cupo.mjs → cuántos lugares ocupados por clase
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  for (const [c, n] of Object.entries(TOPE)) {
    let ocup = 0; try { ocup = fs.readdirSync(path.join(RAIZ, c)).length; } catch {}
    console.log(`agnes_cupo ${c}: ${ocup}/${n} ocupados`);
  }
}
