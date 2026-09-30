// Baja las fotos de ARCHIVO real (Wikimedia Commons, dominio público / CC0) elegidas en el DIRECTOR (kind ar) → public/img/olcast/ar/<name>.jpg
// y anota licencia+autor+fuente en vlog/olcast/CREDITOS_archivo.txt.  node vlog/olcast/ar_get.mjs
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olcast/";
const PICK = { // nombre de toma → título EXACTO del archivo en Commons
  a_cooks: "File:Cooks at logging camp, Kerry Timber Company, Oregon, ca 1917 (KINSEY 2363).jpeg",
  a_kitchen: "File:Cooks in railroad camp kitchen, Polson Logging Company, ca 1930 (KINSEY 467).jpg",
  a_flea: "File:Flea Market in Pensacola, Florida, 2020.jpg",
  a_skillets: "File:Castiron-skillets.jpg",
  a_campfire: "File:Cooking over a campfire in Jumbo Rocks Campground (50409379772).jpg",
  a_cookwait: "File:Cook and waitresses, Northwest Door Company, Oregon, ca 1914 (KINSEY 2452).jpeg",
  a_stove: null, // se resuelve por búsqueda: estufa de leña de cocina, New Ulm, Minnesota (Gary Truman, 1974)
};
const UA = { "User-Agent": "olcast-research/1.0 (bautielcrack4@gmail.com)" };
const api = async (q) => (await (await fetch("https://commons.wikimedia.org/w/api.php?format=json&action=query&" + q, { headers: UA })).json()).query?.pages || {};
if (!PICK.a_stove) {
  const pg = await api(`generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=${encodeURIComponent("CLOSEUP OF THE WOOD BURNING STOVE USED FOR COOKING")}`);
  PICK.a_stove = Object.values(pg)[0]?.title;
}
fs.mkdirSync(R + "public/img/olcast/ar", { recursive: true });
const cred = [];
for (const [name, title] of Object.entries(PICK)) {
  const pg = Object.values(await api(`titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1920`))[0];
  const ii = pg?.imageinfo?.[0]; if (!ii) { console.error("no encontrado:", title); continue; }
  const m = ii.extmetadata || {}; const lic = (m.LicenseShortName?.value || "").trim();
  if (!/public domain|cc0|pd/i.test(lic)) { console.error("LICENCIA NO PD:", title, lic); continue; }
  const out = R + `public/img/olcast/ar/${name}.jpg`;
  const raw = R + `public/img/olcast/ar/_${name}.src`;
  fs.writeFileSync(raw, Buffer.from(await (await fetch(ii.thumburl || ii.url, { headers: UA })).arrayBuffer()));
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-frames:v", "1", "-q:v", "3", out]); fs.unlinkSync(raw);
  const art = (m.Artist?.value || "").replace(/<[^>]+>/g, "").slice(0, 80);
  cred.push(`${name}.jpg | ${title.replace("File:", "")} | ${lic} | ${art} | https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`);
  console.log(name, lic, art, ii.width + "x" + ii.height);
}
fs.writeFileSync(R + "vlog/olcast/CREDITOS_archivo.txt", cred.join("\n") + "\n");
