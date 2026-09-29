// repatch provider claude-code del job 571 + verificación de la tarjeta y del resto del plan (sólo lectura del plan)
import { supaCreds } from "../../scripts/supa_creds.mjs";
const { U, K } = supaCreds(), H = { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" };
const j0 = await (await fetch(`${U}/rest/v1/video_jobs?id=eq.571&select=id,provider,status,mp4_url,progress`, { headers: H })).json();
console.log("antes", JSON.stringify(j0));
if (j0[0].provider !== "claude-code") { const r = await fetch(`${U}/rest/v1/video_jobs?id=eq.571`, { method: "PATCH", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify({ provider: "claude-code" }) }); console.log("patch", r.status, JSON.stringify((await r.json())[0]?.provider)); }
const [row] = await (await fetch(`${U}/rest/v1/tracked_channels?id=eq.59&select=plan`, { headers: H })).json();
const c = row.plan.find(x => x.id === "fbv51790543074490-3");
console.log("tarjeta", JSON.stringify({ videoJobId: c.videoJobId, done: c.done, title: c.title }));
console.log("otras con job:", row.plan.filter(x => x.videoJobId && x.id !== c.id).map(x => `${x.id}:${x.videoJobId}:${x.done}`).join(" "));
