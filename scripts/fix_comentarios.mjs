// Arregla el LINK de los comentarios propios (los fijados) de un canal.
//
//   node scripts/fix_comentarios.mjs <channel_key>            → dry-run
//   node scripts/fix_comentarios.mjs <channel_key> --aplicar  → escribe
//
// POR QUÉ: los comentarios fijados quedaron con `http://www.federer.com` (un
// dominio de un TERCERO), con alias de vercel, o con el dominio pelado sin
// `https://` — que YouTube no convierte en link. Es el mismo problema que ya se
// arregló en las descripciones, en otro lugar.
//
// ⚠️ REQUIERE el scope `youtube.force-ssl`. `auth/youtube` NO alcanza:
// commentThreads.list y comments.update devuelven 403 "insufficient
// authentication scopes". Si el canal se conectó ANTES de que se agregara ese
// scope, hay que RECONECTARLO una vez desde Mis Canales.
import fs from "node:fs";
import { ctaPara } from "./cta_links.mjs";

const [CK, ...flags] = process.argv.slice(2);
const APLICAR = flags.includes("--aplicar");
if (!CK) { console.error("Uso: node scripts/fix_comentarios.mjs <channel_key> [--aplicar]"); process.exit(1); }

const env = fs.readFileSync("D:/Proyectos/yt-scout-web/.env.local", "utf8");
const g = (k) => (env.match(new RegExp("^" + k + "=(.*)$", "m")) || [])[1]?.trim();
const KEY = g("SUPABASE_SERVICE_ROLE_KEY");
const UID = "36cb8b82-9850-4e26-8ac6-de41ea2e6020";

const tok = await fetch("https://bagasy-search.vercel.app/api/youtube/mint", {
  method: "POST", headers: { "content-type": "application/json", "x-worker-key": KEY },
  body: JSON.stringify({ user_id: UID, channel_key: CK }),
}).then((r) => r.json());
if (!tok.access_token) { console.error("sin token:", tok.error); process.exit(1); }
const H = { Authorization: "Bearer " + tok.access_token };

const ch = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&mine=true", { headers: H }).then((r) => r.json());
if (!ch.items) { console.error("no pude leer el canal:", JSON.stringify(ch).slice(0, 200)); process.exit(1); }
const miId = ch.items[0].id;
console.log("canal:", ch.items[0].snippet.title);

// todos los videos públicos
const up = ch.items[0].contentDetails.relatedPlaylists.uploads;
let page = "", vids = [];
do {
  const pl = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${up}${page ? "&pageToken=" + page : ""}`, { headers: H }).then((r) => r.json());
  const ids = (pl.items || []).map((i) => i.contentDetails.videoId);
  if (ids.length) {
    const vs = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id=${ids.join(",")}`, { headers: H }).then((r) => r.json());
    vids.push(...(vs.items || []).filter((v) => v.status?.privacyStatus === "public"));
  }
  page = pl.nextPageToken || "";
} while (page);
console.log("videos públicos:", vids.length);

// Los mismos dominios que se limpiaron en las descripciones. Caza también el
// dominio PELADO (sin https://), que es el que no queda clickeable.
const MALOS = /(?:https?:\/\/)?(?:www\.)?(?:federer\.com|drfederer\.com|docfederer\.com|metodo-piel-joven\.vercel\.app|archivos-federer(?:-ventas)?\.vercel\.app|drfederermetodo\.vercel\.app|constructorlibre\.com|el-constructor-libre\.vercel\.app|manual-reparaciones-caseras\.vercel\.app)(?:\/[^\s)]*)?/gi;

const plan = [];
for (const v of vids) {
  const r = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=50&order=relevance&videoId=${v.id}`, { headers: H }).then((x) => x.json());
  if (r.error) {
    console.error(`\n403/err leyendo comentarios: ${r.error.message}`);
    console.error("→ Si dice 'insufficient authentication scopes', reconectá el canal en Mis Canales (el scope force-ssl es nuevo).");
    process.exit(2);
  }
  for (const t of r.items || []) {
    const c = t.snippet.topLevelComment;
    if (c.snippet.authorChannelId?.value !== miId) continue;   // solo los MÍOS
    const texto = c.snippet.textOriginal || "";
    if (!MALOS.test(texto)) { MALOS.lastIndex = 0; continue; }
    MALOS.lastIndex = 0;
    const cta = ctaPara(CK, v.snippet.title);
    if (!cta) continue;
    const nuevo = texto.replace(MALOS, cta.url);
    if (nuevo !== texto) plan.push({ videoId: v.id, commentId: c.id, titulo: v.snippet.title, antes: (texto.match(MALOS) || [])[0], url: cta.url, texto: nuevo, snippet: c.snippet });
    MALOS.lastIndex = 0;
  }
  process.stdout.write(".");
}
console.log(`\n\ncomentarios propios a corregir: ${plan.length}`);
for (const p of plan) console.log("  ", (p.antes || "").slice(0, 34).padEnd(34), "→", p.url.padEnd(40), "|", p.titulo.slice(0, 42));
fs.writeFileSync("C:/Users/bauti/Downloads/yt-backup/comentarios-plan.json", JSON.stringify(plan, null, 1));

if (!APLICAR) { console.log("\n(dry-run — nada escrito)"); process.exit(0); }

let ok = 0, fail = 0;
for (const p of plan) {
  // comments.update reemplaza el snippet: hay que reenviar el textOriginal completo.
  const r = await fetch("https://www.googleapis.com/youtube/v3/comments?part=snippet", {
    method: "PUT", headers: { ...H, "content-type": "application/json" },
    body: JSON.stringify({ id: p.commentId, snippet: { textOriginal: p.texto } }),
  });
  if (r.ok) { ok++; process.stdout.write("."); }
  else { fail++; console.log("\nX", p.commentId, r.status, (await r.text()).slice(0, 140)); }
  await new Promise((z) => setTimeout(z, 350));
}
console.log(`\nOK ${ok} | fallaron ${fail}`);
