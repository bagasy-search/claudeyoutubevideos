// bagasy.mjs — la tarjeta del panel muestra "generando" mientras el video se está haciendo.
//
// Antes, la tarjeta no aparecía hasta la ENTREGA: durante las ~4 h de producción el panel no mostraba
// nada y no había forma de saber qué estaba en curso. Ahora la fábrica crea el `video_jobs` en estado
// `pending` al arrancar (el estado que Bagasy ya usa y sabe pintar), engancha la tarjeta, y va
// actualizando `render_pct` y la bitácora `activity` al cerrar cada fase. `90_deliver` pasa esa MISMA
// fila a `done` con el mp4.
//
// ⛔ Reusa la fila: `deliver_card.mjs` actualiza el job que la tarjeta ya tiene (`videoJobId`) en vez
//    de insertar otro. Si acá creáramos una fila SIN enganchar la tarjeta, la entrega insertaría una
//    segunda y quedarían dos jobs "subibles" para la misma tarjeta = riesgo de duplicado en YouTube.
// ⛔ NUNCA toca `done` de la tarjeta: ese tic significa SUBIDO A YOUTUBE y lo pone sólo el sellado.
// ⛔ Nada de esto puede tumbar la producción: si faltan credenciales o Supabase responde mal, se
//    avisa y se sigue. Un panel desactualizado no vale un video perdido.
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./env.mjs";

/** Porcentaje que muestra el panel al terminar cada fase. */
export const PCT_FASE = {
  "00_preflight": 2, "10_voice": 12, "15_frases": 15, "20_asr": 22, "30_direct": 30,
  "40_images": 45, "45_stock": 50, "50_agnes": 62, "55_avatar": 72, "60_build": 78,
  "70_gates": 82, "80_render": 95, "90_deliver": 100,
};

const ROTULO = {
  "00_preflight": "preparando", "10_voice": "generando la voz", "15_frases": "partiendo el guion",
  "20_asr": "anclando el audio", "30_direct": "dirección plano por plano", "40_images": "generando imágenes",
  "45_stock": "buscando metraje real", "50_agnes": "animando los planos", "55_avatar": "generando el avatar",
  "60_build": "montando", "70_gates": "compuertas de calidad", "80_render": "renderizando en el farm",
  "90_deliver": "entregando",
};

async function creds() {
  try {
    const m = await import(path.join(ROOT, "scripts", "supa_creds.mjs").replace(/\\/g, "/").replace(/^([A-Z]):/, "file:///$1:"));
    const { U, K } = m.supaCreds();
    return U && K ? { U, H: { apikey: K, Authorization: `Bearer ${K}`, "Content-Type": "application/json" } } : null;
  } catch { return null; }
}

/**
 * Deja la tarjeta del panel en "generando", con el avance de la fase que acaba de cerrar.
 * Devuelve { jobId } o null si no se pudo (nunca tira).
 */
export async function avisarProgreso({ slug, spec, fase, medido, log = () => {} }) {
  if (!spec?.bagasy?.channelKey || !spec?.bagasy?.cardId) return null;
  if (fase === "90_deliver") return null;                       // de eso se ocupa deliver_card
  const c = await creds();
  if (!c) { log("  bagasy: sin credenciales de Supabase, no actualizo la tarjeta"); return null; }
  const { U, H } = c;
  const ck = encodeURIComponent(spec.bagasy.channelKey);

  try {
    const chR = await fetch(`${U}/rest/v1/tracked_channels?channel_key=eq.${ck}&role=eq.own&select=id,user_id,name,plan`, { headers: H });
    const [ch] = await chR.json();
    if (!ch) { log("  bagasy: no encontré el canal"); return null; }
    const plan = Array.isArray(ch.plan) ? ch.plan : [];
    const item = plan.find((p) => p.id === spec.bagasy.cardId);

    const pct = PCT_FASE[fase] ?? 0;
    const linea = { at: new Date().toISOString(), fase, texto: ROTULO[fase] || fase, ...(medido ? { medido } : {}) };

    let jobId = item?.videoJobId || null;
    if (jobId) {
      const prev = await (await fetch(`${U}/rest/v1/video_jobs?id=eq.${jobId}&select=status,activity,render_pct`, { headers: H })).json();
      const row = Array.isArray(prev) ? prev[0] : null;
      // ⛔ si ya está entregado o subido, NO lo devolvemos a "generando"
      if (!row || row.status === "done") return { jobId };
      const act = Array.isArray(row.activity) ? row.activity : [];
      await fetch(`${U}/rest/v1/video_jobs?id=eq.${jobId}`, {
        method: "PATCH", headers: H,
        body: JSON.stringify({ status: "pending", render_pct: Math.max(pct, row.render_pct || 0), activity: [...act, linea].slice(-40) }),
      });
    } else {
      // `script` es NOT NULL en video_jobs (23502 si falta)
      let guion = "";
      try { if (spec.guion && fs.existsSync(spec.guion)) guion = fs.readFileSync(spec.guion, "utf8"); } catch {}
      const r = await fetch(`${U}/rest/v1/video_jobs`, {
        method: "POST", headers: { ...H, Prefer: "return=representation" },
        body: JSON.stringify({
          user_id: ch.user_id, channel_key: spec.bagasy.channelKey, channel_name: ch.name || null, slug,
          script: guion, title: (spec.titulo || item?.title || slug).slice(0, 200),
          provider: "claude-chat", status: "pending", render_pct: pct, activity: [linea],
          thumb_url: item?.thumb || null,
        }),
      });
      if (!r.ok) { log(`  bagasy: no pude crear el job (${r.status})`); return null; }
      const [job] = await r.json();
      jobId = job?.id;
      // enganchar la tarjeta: SÓLO videoJobId, nunca `done` (ese tic = subido a YouTube)
      if (jobId && item) {
        const nuevo = plan.map((p) => (p.id === spec.bagasy.cardId ? { ...p, videoJobId: jobId } : p));
        await fetch(`${U}/rest/v1/tracked_channels?id=eq.${ch.id}`, { method: "PATCH", headers: H, body: JSON.stringify({ plan: nuevo }) });
      }
      log(`  bagasy: tarjeta en "generando" (job ${jobId})`);
    }
    return { jobId };
  } catch (e) {
    log(`  bagasy: no pude actualizar la tarjeta (${String(e.message).slice(0, 80)})`);
    return null;
  }
}
