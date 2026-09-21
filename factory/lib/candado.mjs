// candado.mjs — UN SOLO orquestador por slug (ítem B6 del plan).
//
// ⛔⛔ Medido la noche del 20/21-sep-2026: un agente terminó con TRES `run.mjs` vivos sobre el mismo
// slug (creía que parar el monitor paraba la corrida; el monitor sólo miraba el log y los `nohup`
// seguían). Tres procesos escribiendo el mismo `factory/_state/<slug>/` es exactamente cómo nacen los
// estados corruptos que costaron la noche: una corrida marcó `10_voice: failed` encima de otra que
// terminaba bien, y otra reusó pedazos de avatar de un reparto de ventanas viejo.
//
// El candado guarda PID y host. Un candado cuyo proceso YA NO VIVE se pisa solo (no hace falta
// limpiarlo a mano tras un kill), y el escape `FACTORY_SIN_CANDADO=1` queda impreso en el log.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { slugPaths } from "./paths.mjs";

const vivo = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; } };

export function tomarCandado(slug, { log = console.log } = {}) {
  const f = path.join(slugPaths(slug).state, "orquestador.json");
  fs.mkdirSync(path.dirname(f), { recursive: true });
  let previo = null;
  try { previo = JSON.parse(fs.readFileSync(f, "utf8")); } catch { /* sin candado o ilegible */ }
  if (previo && previo.host === os.hostname() && previo.pid !== process.pid && vivo(previo.pid)) {
    if (process.env.FACTORY_SIN_CANDADO === "1") {
      log(`⚠️ CANDADO IGNORADO (FACTORY_SIN_CANDADO=1): el PID ${previo.pid} ya corre ${slug} desde ${previo.desde}`);
    } else {
      const e = new Error(`ya hay un run.mjs de ${slug} vivo (PID ${previo.pid}, desde ${previo.desde}).\n`
        + `   Dos orquestadores sobre el mismo slug se pisan el estado. Matá ESE proceso por PID y volvé a correr\n`
        + `   (parar un monitor NO para la corrida), o corré con FACTORY_SIN_CANDADO=1 si sabés lo que hacés.`);
      e.candado = true;
      throw e;
    }
  }
  if (previo && !vivo(previo.pid)) log(`  candado huérfano del PID ${previo.pid} (ya no vive): lo piso`);
  fs.writeFileSync(f, JSON.stringify({ pid: process.pid, host: os.hostname(), desde: new Date().toISOString(), slug }, null, 1));
  const soltar = () => { try { const a = JSON.parse(fs.readFileSync(f, "utf8")); if (a.pid === process.pid) fs.rmSync(f, { force: true }); } catch {} };
  process.once("exit", soltar);
  return soltar;
}
