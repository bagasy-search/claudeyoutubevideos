// Creds de Supabase para cualquier entrega a Bagasy (deliver_to_bagasy / deliver_card / deliver_fix).
//
// ⛔⛔ ACÁ HABÍA UNA SOLA RUTA QUEMADA ("D:/Proyectos/yt-scout-web/.env.local") y un readFileSync
//    pelado. Medido el 12-sep-2026 en la segunda máquina: ese repo no está ahí, así que la entrega
//    moría con un ENOENT crudo **con el video ya renderizado, verificado y publicado en el
//    release** — el trabajo entero hecho, frenado en el último comando, y el error no decía qué
//    hacer. Las DOS máquinas lo arreglaron por separado el mismo día; esto es la unión.
//
// Orden: variables de entorno → --env=<ruta> → $BAGASY_ENV / $BAGASY_ENV_FILE →
//        <video2>/.env.local → <video2>/.env → rutas conocidas de yt-scout-web / bagasy-search.
// Si no encuentra nada, el error dice DÓNDE miró, cuáles existen, las tres formas de arreglarlo,
// y que el video NO se perdió.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HOME = os.homedir();

export function rutasCandidatas() {
  const envFlag = (process.argv.find((a) => a.startsWith("--env=")) || "").slice(6);
  return [
    envFlag,
    process.env.BAGASY_ENV,
    process.env.BAGASY_ENV_FILE,
    path.join(RAIZ, ".env.local"),
    path.join(RAIZ, ".env"),
    "D:/Proyectos/yt-scout-web/.env.local",
    "D:/Proyectos/bagasy-search/.env.local",
    path.join(HOME, "Downloads/yt-scout-web/.env.local"),
    path.join(HOME, "Downloads/bagasy-search/.env.local"),
    path.join(HOME, "yt-scout-web/.env.local"),
  ].filter(Boolean);
}

const val = (txt, k) => (txt.match(new RegExp("^\s*" + k + "\s*=\s*(.*)$", "m")) || [])[1]?.trim().replace(/^["']|["']$/g, "");

export function supaCreds() {
  const eU = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const eK = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (eU && eK) return { U: eU.trim(), K: eK.trim(), fuente: "variables de entorno" };

  const mirados = [];
  if (eU || eK) mirados.push(`variables de entorno → sólo ${eU ? "la URL" : "la KEY"}, falta la otra`);

  for (const f of rutasCandidatas()) {
    if (!fs.existsSync(f)) { mirados.push(`${f} → no existe`); continue; }
    let txt = "";
    try { txt = fs.readFileSync(f, "utf8"); } catch (e) { mirados.push(`${f} → no se pudo leer (${e.code})`); continue; }
    const U = val(txt, "NEXT_PUBLIC_SUPABASE_URL") || val(txt, "SUPABASE_URL");
    const K = val(txt, "SUPABASE_SERVICE_ROLE_KEY");
    if (U && K) return { U, K, fuente: f };
    mirados.push(`${f} → existe, pero le falta ${!U ? "NEXT_PUBLIC_SUPABASE_URL" : "SUPABASE_SERVICE_ROLE_KEY"}`);
  }

  const e = new Error(
    "no encontré las credenciales de Supabase de Bagasy.\n" +
    "Miré (en este orden):\n" + mirados.map((m) => "  · " + m).join("\n") +
    "\n\nArreglalo de UNA de estas formas:\n" +
    `  1) creá ${path.join(RAIZ, ".env.local")} con estas dos líneas:\n` +
    "       NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co\n" +
    "       SUPABASE_SERVICE_ROLE_KEY=<service role key>\n" +
    "  2) pasalo explícito:  --env=<ruta a un .env.local que ya las tenga>\n" +
    "  3) exportá las dos variables antes de correr el comando\n" +
    "⚠️ El video NO se pierde: el mp4 ya está en el release y el meta en public/<slug>_meta.json.\n" +
    "   Con las creds puestas, este mismo comando termina la entrega."
  );
  e.code = "SIN_CREDS_SUPABASE";
  throw e;
}
