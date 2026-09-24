// baja el output (parcial) de un batch de anclas y lo escribe según custom_id p<i>__K<n> y la lista de planes
import fs from "node:fs";
const [ID, ...plans] = process.argv.slice(2);
const K = fs.readFileSync(".env", "utf8").match(/^OPENAI_API_KEY=(.*)$/m)[1].trim().replace(/^"|"$/g, "");
const H = { Authorization: "Bearer " + K };
let b; for (;;) { b = await (await fetch("https://api.openai.com/v1/batches/" + ID, { headers: H })).json(); if (["cancelled", "completed", "failed", "expired"].includes(b.status)) break; await new Promise(r => setTimeout(r, 10000)); }
const dirs = plans.map(p => JSON.parse(fs.readFileSync(p, "utf8")).dir.replaceAll(String.fromCharCode(92), "/").replace(/\/?$/, "/") + "anc/");
let ok = 0;
if (b.output_file_id) for (const ln of (await (await fetch(`https://api.openai.com/v1/files/${b.output_file_id}/content`, { headers: H })).text()).split("\n").filter(Boolean)) {
  const r = JSON.parse(ln), d = r.response?.body?.data?.[0]; if (!d?.b64_json) continue;
  const [, pi, kid] = r.custom_id.match(/^p(\d+)__(.+)$/); const out = dirs[+pi] + kid + ".png";
  if (!fs.existsSync(out)) { fs.writeFileSync(out, Buffer.from(d.b64_json, "base64")); ok++; }
}
console.log(b.status, "escritas", ok);
