// Reemplaza loretta-church-lady.vercel.app → lorettaschurch.com/house en las tarjetas de House Hacks (tracked_channels.plan, row draft:lorettahacks)
// y en los video_jobs de esos slugs (yt_description, pinned). node vlog/hh/dominio_tarjetas.mjs [--apply]
import { supaCreds } from "../../scripts/supa_creds.mjs";
const APPLY = process.argv.includes("--apply");
const { U, K } = supaCreds(); const H = { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" };
const fix = (s) => s.replace(/https?:\/\/loretta-church-lady\.vercel\.app\/house\?/g, "https://lorettaschurch.com/house?")
  .replace(/https?:\/\/loretta-church-lady\.vercel\.app\/\?/g, "https://lorettaschurch.com/house?")
  .replace(/https?:\/\/loretta-church-lady\.vercel\.app\/?/g, "https://lorettaschurch.com/house")
  .replace(/loretta-church-lady\.vercel\.app\/?/g, "lorettaschurch.com/house");
const deep = (o, path, hits) => {
  if (typeof o === "string") { const n = fix(o); if (n !== o) hits.push(path); return n; }
  if (Array.isArray(o)) return o.map((x, i) => deep(x, `${path}[${i}]`, hits));
  if (o && typeof o === "object") { const r = {}; for (const [k, v] of Object.entries(o)) r[k] = deep(v, `${path}.${k}`, hits); return r; }
  return o;
};
const ch = (await (await fetch(`${U}/rest/v1/tracked_channels?select=id,name,plan&channel_key=eq.draft:lorettahacks&role=eq.own`, { headers: H })).json())[0];
if (!ch) { console.error("no encontré el canal draft:lorettahacks"); process.exit(1); }
const hits = []; const plan = deep(ch.plan, "plan", hits);
console.log(ch.name, "· tarjetas", ch.plan.length, "· campos con la URL vieja:", hits.length); hits.slice(0, 40).forEach((h) => console.log("  ", h));
const slugs = ["hhdollar", "hhwinter", "hhexpire", "hhfreeze", "hhgrocery", "hhscraps", "hhvinegar", "hhperox", "hhtoilet", "hhnever"];
const jobs = await (await fetch(`${U}/rest/v1/video_jobs?select=id,slug,yt_description&channel_key=eq.draft:lorettahacks`, { headers: H })).json();
const jh = jobs.filter((j) => j.yt_description && fix(j.yt_description) !== j.yt_description);
console.log("video_jobs del canal:", jobs.length, "· con URL vieja:", jh.map((j) => j.slug).join(" ") || "ninguno");
if (APPLY) {
  if (hits.length) { const r = await fetch(`${U}/rest/v1/tracked_channels?id=eq.${ch.id}`, { method: "PATCH", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify({ plan }) }); console.log("plan →", r.status); }
  for (const j of jh) { const r = await fetch(`${U}/rest/v1/video_jobs?id=eq.${j.id}`, { method: "PATCH", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify({ yt_description: fix(j.yt_description) }) }); console.log("job", j.slug, "→", r.status); }
  const again = deep((await (await fetch(`${U}/rest/v1/tracked_channels?select=plan&id=eq.${ch.id}`, { headers: H })).json())[0].plan, "plan", []);
  console.log("relectura: quedan con la URL vieja:", JSON.stringify(again).includes("loretta-church-lady") ? "SÍ ⛔" : "0 ✓");
}
