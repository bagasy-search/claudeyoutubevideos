// openai_caida.mjs — PLAN B AUTOMÁTICO cuando la cuenta de OpenAI se cae (16-oct-2026).
//
// ⛔ Por qué existe: el 16-oct 01:41-01:51 la cuenta llegó a `billing_hard_limit_reached` y cayó TODO gpt-image (Batch, rescate
//    sincrónico y --ya). Cada sesión improvisó distinto: helen/clyde → agnes con identidad (bien), stan → ComfyUI LOCAL sin
//    referencia (la cara del presentador salió OTRA, hubo que rehacer), mickey esperando. Ahora lo decide gptimg.mjs solo:
//    · cualquier error de cuenta (billing / cuota / desactivada) marca la caída en D:/rtmp/openai_caida.json → durante 15 min
//      TODAS las sesiones saltean OpenAI en vez de chocar cada una contra la pared
//    · lo que falte va a agnes-image con la referencia de la cara (la GRANDE `_face_big.png` si existe: la de 128x192 alcanza
//      para gpt pero en agnes da menos parecido) + cláusula de identidad neutra (no la del presentador viejo de agnes_img.mjs)
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = "C:/Users/bauti/Downloads/video2";
const MARCA = (fs.existsSync("D:/") ? "D:/rtmp" : process.env.TEMP || "/tmp") + "/openai_caida.json";
const VENTANA_MIN = +(process.env.OPENAI_CAIDA_MIN || 15);
export const esCaida = (txt) => /billing_hard_limit|billing hard limit|insufficient_quota|exceeded your current quota|account_deactivated|account is not active|billing_not_active/i.test(String(txt || ""));

export function marcarCaida(motivo) {
  try { fs.writeFileSync(MARCA, JSON.stringify({ t: Date.now(), motivo: String(motivo).slice(0, 300), pid: process.pid })); } catch { }
  console.error(`⛔ OpenAI CAÍDO (${String(motivo).slice(0, 120)}) → marcado ${VENTANA_MIN} min para todas las sesiones; lo que falte va a agnes con la cara de referencia`);
}
export function estaCaida() {
  try { const j = JSON.parse(fs.readFileSync(MARCA, "utf8")); return Date.now() - j.t < VENTANA_MIN * 60e3 ? j : null; } catch { return null; }
}

/** escucha console.log/error: cualquier línea con error de cuenta marca la caída (los módulos de batch sólo lo imprimen) */
export function vigilarSalida() {
  for (const k of ["log", "error", "warn"]) {
    const orig = console[k].bind(console);
    console[k] = (...a) => { orig(...a); try { const s = a.map(String).join(" "); if (esCaida(s) && !estaCaida()) marcarCaida(s); } catch { } };
  }
}

const refGrande = (r) => { const g = String(r).replace(/_face\.png$/i, "_face_big.png"); return g !== r && fs.existsSync(g) ? g : r; };
const IDENT_NEUTRA = "Preserve the exact identity of the person in the reference photograph: same face, facial features, age, skin tone, "
  + "hair, facial hair and build, wearing the same clothes described in the scene.";

/** genera con agnes_img.mjs las imágenes de `items` que todavía no están en outDir. Devuelve cuántas quedaron hechas. */
export function aAgnes(items, outDir, { log = console.log } = {}) {
  const yaEsta = (it) => ["png", "jpg"].some((e) => fs.existsSync(path.join(outDir, `${it.name}.${e}`)));
  const falta = items.filter((it) => !yaEsta(it)).map((it) => ({ ...it, ...(it.ref ? { ref: [].concat(it.ref).map(refGrande) } : {}) }));
  if (!falta.length) return 0;
  const tmp = path.join(fs.existsSync("D:/rtmp/tmp") ? "D:/rtmp/tmp" : process.env.TEMP || "/tmp", `caida_agnes_${process.pid}_${Date.now()}.json`);
  fs.writeFileSync(tmp, JSON.stringify(falta, null, 1));
  log(`🛟 plan B OpenAI caído: ${falta.length} imágenes a agnes-image (${falta.filter((x) => x.ref).length} con la cara de referencia)`);
  // agnes también se satura (16-oct 03:10: "image queue is full" con las 46 claves): hasta 4 pasadas, 90 s entre una y otra
  let r = {};
  for (let pasada = 1; pasada <= 4; pasada++) {
    const quedan = falta.filter((it) => !yaEsta(it));
    if (!quedan.length) break;
    if (pasada > 1) { log(`🛟 plan B pasada ${pasada}: faltan ${quedan.length}, espero 90 s`); spawnSync(process.execPath, ["-e", "setTimeout(()=>{},90000)"]); }
    fs.writeFileSync(tmp, JSON.stringify(quedan, null, 1));
    r = spawnSync(process.execPath, [path.join(ROOT, "scripts/agnes_img.mjs"), tmp, outDir, "--conc", "6"], {
      cwd: ROOT, stdio: "inherit", env: { ...process.env, AGNES_IDENT: process.env.AGNES_IDENT || IDENT_NEUTRA }, timeout: 30 * 60e3,
    });
  }
  const hechas = falta.filter(yaEsta).length;
  log(`🛟 plan B: ${hechas}/${falta.length} hechas con agnes (salida ${r.status})` + (hechas < falta.length ? " — lo que falta: reintentar gptimg cuando vuelva OpenAI (la marca dura 15 min)" : ""));
  return hechas;
}
