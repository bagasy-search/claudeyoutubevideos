// Creds de Supabase para cualquier entrega a Bagasy (deliver_to_bagasy / deliver_card / deliver_fix).
//
// Antes cada script leía un path FIJO de ESTA máquina ("D:/Proyectos/yt-scout-web/.env.local").
// En cualquier otra PC eso explota con un ENOENT que no explica nada, y el video queda montado
// pero sin entregar. Acá se busca en cascada y, si no aparece, el error dice DÓNDE se miró.
//
// Orden: variables de entorno → $BAGASY_ENV_FILE → <video2>/.env.local → <video2>/.env →
//        los paths conocidos de yt-scout-web.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CANDIDATOS = [
  process.env.BAGASY_ENV_FILE,
  path.join(RAIZ, ".env.local"),
  path.join(RAIZ, ".env"),
  "D:/Proyectos/yt-scout-web/.env.local",
  path.join(os.homedir(), "Downloads/yt-scout-web/.env.local"),
  path.join(os.homedir(), "yt-scout-web/.env.local"),
].filter(Boolean);

const val = (txt, k) => (txt.match(new RegExp("^\s*" + k + "\s*=\s*(.*)$", "m")) || [])[1]?.trim().replace(/^["']|["']$/g, "");

export function supaCreds() {
  const mirados = [];

  const eU = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const eK = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (eU && eK) return { U: eU.trim(), K: eK.trim(), fuente: "variables de entorno" };
  if (eU || eK) mirados.push(`variables de entorno (sólo ${eU ? "la URL" : "la KEY"}, falta la otra)`);

  for (const f of CANDIDATOS) {
    if (!fs.existsSync(f)) { mirados.push(`${f} → no existe`); continue; }
    let txt = "";
    try { txt = fs.readFileSync(f, "utf8"); } catch (e) { mirados.push(`${f} → no se pudo leer (${e.code})`); continue; }
    const U = val(txt, "NEXT_PUBLIC_SUPABASE_URL") || val(txt, "SUPABASE_URL");
    const K = val(txt, "SUPABASE_SERVICE_ROLE_KEY");
    if (U && K) return { U, K, fuente: f };
    mirados.push(`${f} → existe, pero le falta ${!U ? "NEXT_PUBLIC_SUPABASE_URL" : "SUPABASE_SERVICE_ROLE_KEY"}`);
  }

  const e = new Error(
    "no encontré las creds de Supabase para escribirle a Bagasy.\n" +
    "Miré (en este orden):\n" + mirados.map((m) => "  · " + m).join("\n") +
    "\n\nArreglo: creá " + path.join(RAIZ, ".env.local") + " con estas dos líneas\n" +
    "  NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co\n" +
    "  SUPABASE_SERVICE_ROLE_KEY=<service role key>\n" +
    "(o apuntá $BAGASY_ENV_FILE a un .env que ya las tenga)."
  );
  e.code = "SIN_CREDS_SUPABASE";
  throw e;
}
