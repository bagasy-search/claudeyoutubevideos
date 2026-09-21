// 45_stock — METRAJE REAL de Pexels. Corre entre 40_images y 50_agnes.
//
// Por qué existe: la regla del canal es ≥25 % de metraje REAL, porque la IA se delata justo en las
// ACCIONES (una mano que vierte, el agua que corre). El DIRECTOR marca el plano con `"st": "consulta
// en INGLÉS"` y esta fase baja el clip y lo deja en `public/broll/<slug>/<name>.mp4`, que es
// EXACTAMENTE donde `assetOf` del build lo busca. Como 50_agnes sólo genera los que faltan en esa
// carpeta, el plano que consiguió stock ya no se manda a agnes: sale más real y encima más barato.
//
// ⛔⛔ LA MINA A NO REPETIR (la 45_stock vieja): imprimía `stockRepetidos: midió=-48 (max 0) ✓` —
//    VERDE con un número NEGATIVO. Un contador que puede dar negativo NO está midiendo: está
//    restando dos universos distintos. Acá los repetidos se cuentan sobre los ids REALMENTE
//    descargados (`descargados - idsÚnicos`), que no puede ser negativo ni por construcción.
//
// ⛔ Un stock OFF-TOPIC es PEOR que la imagen IA (el creador lo rechazó: playas y heladerías en un
//    video de cemento). Por eso: nada de consulta de respaldo genérica. Si Pexels no tiene nada para
//    ESA consulta, el plano se queda con su imagen IA, que es lo seguro.
import fs from "node:fs";
import path from "node:path";
import { run, frameCount } from "../lib/exec.mjs";
import { assertMeasured, assertNoProblems } from "../lib/gate.mjs";
import { ROOT, env } from "../lib/env.mjs";
import { pool } from "../lib/phase.mjs";

const API = "https://api.pexels.com/videos/search";

/** Las claves de Pexels, en orden: la 2ª es el respaldo cuando la 1ª se queda sin cuota (429). */
export const claves = () => [env("PEXELS_API_KEY"), env("PEXELS_API_KEY2")].filter(Boolean);

/** Busca en Pexels y devuelve candidatos ya ordenados: horizontal, ≥1920, el mejor archivo primero. */
export async function buscar(query, keys, { perPage = 8, minSec = 3 } = {}) {
  let ultimo = null;
  for (const k of keys) {
    const u = new URL(API);
    u.searchParams.set("query", query);
    u.searchParams.set("per_page", String(perPage));
    u.searchParams.set("orientation", "landscape");
    u.searchParams.set("size", "medium");
    const r = await fetch(u, { headers: { Authorization: k } });
    if (r.status === 429) { ultimo = `429 (sin cuota)`; continue; }     // probá con la otra clave
    if (!r.ok) { ultimo = `HTTP ${r.status}`; continue; }
    const j = await r.json();
    return (j.videos || [])
      .filter((v) => v.duration >= minSec && v.width >= v.height)
      .map((v) => {
        const f = (v.video_files || [])
          .filter((x) => x.file_type === "video/mp4" && (x.width || 0) >= 1280)
          .sort((a, b) => Math.abs((a.width || 0) - 1920) - Math.abs((b.width || 0) - 1920))[0];
        return f ? { id: v.id, dur: v.duration, w: f.width, link: f.link } : null;
      })
      .filter(Boolean);
  }
  throw new Error(`Pexels no respondió para "${query}"${ultimo ? `: ${ultimo}` : ""}`);
}

/** Baja y CONFORMA a 1920x1080 / 30 fps CFR / sin audio — como el resto del b-roll del montaje. */
async function bajar(link, destino, { fps = 30 } = {}) {
  const r = await fetch(link);
  if (!r.ok) throw new Error(`descarga HTTP ${r.status}`);
  const tmp = destino + ".raw.mp4";
  fs.writeFileSync(tmp, Buffer.from(await r.arrayBuffer()));
  try {
    await run("ffmpeg", ["-v", "error", "-y", "-i", tmp,
      "-vf", `scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=${fps}`,
      "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
      "-vsync", "cfr", "-movflags", "+faststart", destino], { timeoutMs: 300_000 });
  } finally { try { fs.unlinkSync(tmp); } catch { /* ya no está */ } }
}

export default {
  id: "45_stock",
  deps: ["40_images"],
  // ⛔ ANTES: sólo `premium`. En vlog-crudo la fase NO corría y las marcas `st` del director eran un
  //    no-op silencioso: tdcfreno dirigió 27 planos con `st` y entregó con 0 % de metraje real.
  //    Ahora corre en cualquier montaje que declare fuente en el estilo (`style.stock.fuente`).
  applies: ({ style }) => (style.montaje || "vlog-crudo") === "premium" || !!style.stock?.fuente,
  inputs: ({ P, style }) => [P.plan, P.brollDir, style.stock || null],
  verify: ({ P }) => {
    const plan = JSON.parse(fs.readFileSync(P.plan, "utf8")).filter((p) => p.st);
    if (!plan.length) return null;
    const reg = path.join(ROOT, "_v3", `${P.slug}_stock.json`);
    return fs.existsSync(reg) ? null : `sin registro de stock para ${plan.length} consultas`;
  },
  async run({ slug, style, P, log }) {
    const plan = JSON.parse(fs.readFileSync(P.plan, "utf8"));
    const pedidos = plan.filter((p) => p.st && p.tipo === "imagen");

    // ⛔ El director tiene PROHIBIDO pedir stock en un plano con presentador o de avatar: el clip real
    //    traería a OTRA persona, que es la falla más grave del canal. Se caza acá, no en pantalla.
    const prohibidos = plan.filter((p) => p.st && (p.tipo === "avatar" || p.motor === "gpt" || p.persona))
      .map((p) => `${p.name}: pide stock en un plano con PRESENTADOR/avatar (el clip real traería a otra persona)`);
    assertNoProblems("stockEnPlanoConPersona", prohibidos, plan.length, { log });

    assertMeasured("stockPedidos", pedidos.length, {
      min: 1, total: plan.length, allowZero: !plan.some((p) => p.st), log,
    });
    if (!pedidos.length) return { stockPedidos: 0, stockNuevos: 0, stockEnDisco: 0 };

    // FUENTE: `ytcc` = YouTube con licencia Creative Commons. En taller/metal Pexels no tiene nada
    // (medido: 33 % útil y el resto off-topic, que es PEOR que la imagen IA), mientras que YouTube CC
    // tiene el material exacto del tema y es gratis. Se baja UN tramo largo por consulta y se cortan
    // todos sus planos de ahí: bajar clip por clip tarda ~3 min cada uno por estrangulamiento.
    if ((style.stock?.fuente || "pexels") === "ytcc") {
      fs.mkdirSync(P.brollDir, { recursive: true });
      const lista = path.join(ROOT, "_v3", `${slug}_ytcc_lista.json`);
      fs.writeFileSync(lista, JSON.stringify(pedidos.map((p) => ({ name: p.name, query: p.st, durSec: p.durSec || 0 })), null, 1));
      const r = await run("node", ["scripts/ytcc_fetch.mjs", lista, P.brollDir], { cwd: ROOT, timeoutMs: 60 * 60_000, allowFail: true });
      const bajados = Number((r.out.match(/bajados=(\d+)/) || [])[1]);
      assertMeasured("stockYtccBajados", bajados, { min: 1, total: pedidos.length, log });
      const cred = path.join(P.brollDir, "_ytcc_creditos.json");
      const fuentes = fs.existsSync(cred) ? JSON.parse(fs.readFileSync(cred, "utf8")) : [];
      assertMeasured("stockYtccFuentes", fuentes.length, { min: 1, log });
      log(`  ⚠️ créditos CC-BY para la descripción: ${cred}`);
      log(`  ⚠️ FALTA auditar los clips (marca de agua, subtítulos quemados, caras ajenas) antes de montar`);
      return { stockPedidos: pedidos.length, stockNuevos: bajados, fuente: "ytcc", fuentes: fuentes.length };
    }

    const keys = claves();
    assertMeasured("pexelsClaves", keys.length, { min: 1, log });
    fs.mkdirSync(P.brollDir, { recursive: true });
    fs.mkdirSync(path.join(ROOT, "_v3"), { recursive: true });
    const regFile = path.join(ROOT, "_v3", `${slug}_stock.json`);
    const reg = fs.existsSync(regFile) ? JSON.parse(fs.readFileSync(regFile, "utf8")) : {};

    // ids ya usados EN ESTE VIDEO → nunca el mismo clip dos veces (regla dura del creador)
    const usados = new Set(Object.values(reg).map((x) => x.id));
    const sinResultado = [], fallados = [];
    let nuevos = 0;

    // de a 3: Pexels tira 429 fácil y la 2ª clave es el único respaldo
    await pool(pedidos, 3, async (p) => {
      const destino = path.join(P.brollDir, `${p.name}.mp4`);
      if (reg[p.name] && fs.existsSync(destino)) return;                 // ya está: no se vuelve a bajar
      if (fs.existsSync(destino) && !reg[p.name]) return;                // lo hizo agnes: no lo pisamos
      let cands;
      try { cands = await buscar(p.st, keys); }
      catch (e) { fallados.push(`${p.name} ("${p.st}"): ${e.message}`); return; }
      const elegido = cands.find((c) => !usados.has(c.id));
      if (!elegido) { sinResultado.push(`${p.name}: "${p.st}" (${cands.length} resultados, ${cands.length ? "todos ya usados" : "ninguno sirve"})`); return; }
      usados.add(elegido.id);
      try { await bajar(elegido.link, destino); }
      catch (e) { usados.delete(elegido.id); fallados.push(`${p.name}: ${e.message}`); return; }
      reg[p.name] = { id: elegido.id, query: p.st, dur: elegido.dur, w: elegido.w };
      nuevos++;
      fs.writeFileSync(regFile, JSON.stringify(reg, null, 1));
    });

    fs.writeFileSync(regFile, JSON.stringify(reg, null, 1));

    // ── MEDICIÓN (todo con número, y ninguno puede dar negativo) ──────────────
    const enDisco = pedidos.filter((p) => reg[p.name] && fs.existsSync(path.join(P.brollDir, `${p.name}.mp4`)));
    const ids = enDisco.map((p) => reg[p.name].id);
    const repetidos = ids.length - new Set(ids).size;   // ⛔ descargados − únicos: nunca negativo
    log(`stock: ${enDisco.length}/${pedidos.length} consultas con clip (${nuevos} nuevos) · ${new Set(ids).size} ids distintos`);
    for (const s of sinResultado.slice(0, 8)) log(`   · sin resultado → se queda con la imagen IA: ${s}`);

    assertNoProblems("stockDescargas", fallados, pedidos.length, { log });
    assertMeasured("stockRepetidos", repetidos, { max: 0, allowZero: true, total: ids.length, log });

    // cuadros REALES en disco: un mp4 de 0 cuadros pasa como archivo y muere en el render
    const cuadros = await pool(enDisco, 8, async (p) => {
      try { return await frameCount(path.join(P.brollDir, `${p.name}.mp4`)); } catch { return 0; }
    });
    const vacios = enDisco.filter((_, i) => !(cuadros[i] > 0)).map((p) => `${p.name}.mp4 mide 0 cuadros`);
    assertNoProblems("stockCuadrosMedidos", vacios, enDisco.length || 1, { log });

    const planosImagen = plan.filter((p) => p.tipo === "imagen").length;
    const pctReal = planosImagen ? Math.round((100 * enDisco.length) / planosImagen) : 0;
    const minPct = Number(style.stock?.minPct ?? 0);   // el piso lo decide el estilo; 0 = sólo informa
    log(`metraje REAL ${pctReal} % de los planos de imagen (la regla del canal es ≥25 %)`);

    return {
      stockPedidos: pedidos.length, stockNuevos: nuevos, stockEnDisco: enDisco.length,
      stockSinResultado: sinResultado.length, stockRepetidos: repetidos,
      stockIdsUnicos: new Set(ids).size, metrajeRealPct: pctReal,
      ...(minPct && pctReal < minPct ? { AVISO: `metraje real ${pctReal} % < ${minPct} % que pide el estilo` } : {}),
    };
  },
};
