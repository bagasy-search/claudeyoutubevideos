// Baja las fotos de ARCHIVO real (Wikimedia Commons, dominio público / CC0) elegidas en el DIRECTOR (kind ar) → public/img/ollarder/ar/<name>.jpg
// y anota licencia+autor+fuente en vlog/ollarder/CREDITOS_archivo.txt.  node vlog/ollarder/ar_get.mjs
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/ollarder/";
const PICK = {
  a_cookhall: "search:Logging and mess hall crews at camp, Copalis Lumber Company, ca 1917 KINSEY 68",
  a_logcamp: "File:Thomas Lake logging camp 1910.jpg",
  a_horsesled: "search:Horse-drawn sled at Log Cabin, British Columbia on the White Pass Trail",
  a_cookhigh: "File:Cooks at logging camp, Kerry Timber Company, Oregon, ca 1917 (KINSEY 2363).jpeg",
  a_crewcold: "File:Lumberjacks at a logging camp, northern Minnesota, c. 1917.png",
  a_beanhole: "search:Loggers Camp on Mud Pond LCCN2002711544",
  a_dininghall: "search:Interior of mess hall with crew, Wynooche Timber Company, Montesano KINSEY",
  a_longtables: "search:Mess hall interior, Donovan-Corkery Logging Company railroad camp no 4 KINSEY",
  a_dinnerwoods: "File:Logging crew at lunch in the woods, St Paul and Tacoma Lumber Company camp no 3, Orting, ca 1926 (KINSEY 549).jpg",
  a_galley: "search:Mess hall crew in galley beside Lang cooking range, Saginaw Timber Company KINSEY",
};
const UA = { "User-Agent": "ollarder-research/1.0 (bautielcrack4@gmail.com)" };
const api = async (q) => (await (await fetch("https://commons.wikimedia.org/w/api.php?format=json&action=query&" + q, { headers: UA })).json()).query?.pages || {};
for (const [k, v] of Object.entries(PICK)) if (typeof v === "string" && v.startsWith("search:")) { const pg = await api(`generator=search&gsrnamespace=6&gsrlimit=5&gsrsearch=${encodeURIComponent(v.slice(7))}`); PICK[k] = Object.values(pg)[0]?.title; console.log(k, "→", PICK[k]); }
fs.mkdirSync(R + "public/img/ollarder/ar", { recursive: true });
const cred = [];
for (const [name, title] of Object.entries(PICK)) {
  const pg = Object.values(await api(`titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1920`))[0];
  const ii = pg?.imageinfo?.[0]; if (!ii) { console.error("no encontrado:", title); continue; }
  const m = ii.extmetadata || {}; const lic = (m.LicenseShortName?.value || "").trim();
  if (!/public domain|cc0|pd/i.test(lic)) { console.error("LICENCIA NO PD:", title, lic); continue; }
  const out = R + `public/img/ollarder/ar/${name}.jpg`;
  const raw = R + `public/img/ollarder/ar/_${name}.src`;
  fs.writeFileSync(raw, Buffer.from(await (await fetch(ii.thumburl || ii.url, { headers: UA })).arrayBuffer()));
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-frames:v", "1", "-q:v", "3", out]); fs.unlinkSync(raw);
  const art = (m.Artist?.value || "").replace(/<[^>]+>/g, "").slice(0, 80);
  cred.push(`${name}.jpg | ${title.replace("File:", "")} | ${lic} | ${art} | https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`);
  console.log(name, lic, art, ii.width + "x" + ii.height);
}
fs.writeFileSync(R + "vlog/ollarder/CREDITOS_archivo.txt", cred.join("\n") + "\n");
