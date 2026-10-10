// DIRECTOR AUTOMÁTICO de la red Loretta 4-6: guiones/<slug>_filmado.txt (marcadores [@…]) → vlog/<slug>/dir_a.mjs (SHOTS para timeline.mjs)
// + _v3/<slug>_need.json (páginas, imágenes agnes, anclas de clips, stock). SLUG=x node vlog/loretta/autodir.mjs
// Cada marcador ancla su toma a las palabras que le siguen (las mínimas que sean únicas dentro del párrafo).
import fs from "node:fs";
import { R, SLUG, V3, W } from "./env.mjs";
import { EI } from "./lib.mjs";
const CH = SLUG.slice(0, 2);
const BOOK = { ck: "Loretta's Church Supper Cookbook", fo: "Supper for One", cl: "The Best Way to Clean It", fh: "The Bug-Free Farmhouse", su: "52 Sunday Mornings with Loretta" }[CH];
const SITE = { ck: "cookbook.lorettaschurch.com", fo: "lorettaschurch.com/one", cl: "lorettaschurch.com/clean", fh: "lorettaschurch.com/farm", su: "lorettaschurch.com/sunday" }[CH];
const norm = (s) => (s.match(/\S+/g) || []).map((w) => w.toLowerCase().replace(/[^a-z0-9']/g, ""));  // = timeline.mjs: 1 token por palabra del guion (vacíos incluidos)
// 9-oct: la escena se cierra con punto antes del sufijo (sin punto agnes IMPRIMÍA "Nobody is in the frame…" en libros/tarjetas)
const endDot = (t) => (/[.!?]$/.test(t) ? t : t + ".");
const HANDS = " Nobody is in the frame and no hands: show the objects and the result themselves; if the scene mentions hands or a person, show the moment just before or after, with the tools resting where they were used. Plain objects with no writing, no labels and no logos.";
// ancla = n palabras NO vacías desde la posición w (si la palabra w es "—" se corre a la siguiente), únicas y primeras en el párrafo
function anchor(pw, w) {
  while (w < pw.length && !pw[w]) w++;
  for (let n = 3; n <= 14; n++) {
    const q = pw.slice(w, w + n); if (q.length < Math.min(n, 1) || q.some((t) => !t)) return null;
    let c = 0, first = -1; for (let k = 0; k + q.length <= pw.length; k++) if (q.every((t, x) => pw[k + x] === t)) { c++; if (first < 0) first = k; }
    if (c === 1 && first === w) return q.join(" ");
    if (w + n >= pw.length) return c >= 1 && first === w ? q.join(" ") : null;
  }
  return null;
}
const lines = fs.readFileSync(R + `guiones/${SLUG}_filmado.txt`, "utf8").split(/\r?\n/).filter((l) => /^\[[^\]]*\]/.test(l));
const shots = [], need = { pages: new Set(), imgs: [], clips: [], stock: [] }, errs = [];
let nb = 0, nk = 0, ns = 0, ne = 0;
lines.forEach((line, p) => {
  const body = line.replace(/^\[[^\]]*\]\s*/, "");
  const parts = body.split(/(\[@[^\]]*\])/).filter((x) => x !== "");
  const pw = norm(body.replace(/\[[^\]]*\]/g, " "));
  let wpos = 0, last = null;
  for (let i = 0; i < parts.length; i++) {
    const tok = parts[i];
    if (!tok.startsWith("[@")) { wpos += norm(tok).length; continue; }
    const mk = tok.slice(2, -1).trim();
    // texto que sigue al marcador (hasta el próximo)
    let nxt = ""; for (let j = i + 1; j < parts.length && !parts[j].startsWith("[@"); j++) nxt += parts[j];
    // ancla: palabras mínimas únicas desde wpos
    let at = "";
    if (wpos > 0 && norm(nxt).length) { at = anchor(pw, wpos); if (at === null) { errs.push(`p${p} sin ancla única en la palabra ${wpos}`); at = ""; } }
    if (!norm(nxt).length && !/^(care:|nevermix)/.test(mk)) { console.log(`⚠️ p${p} marcador sin texto detrás (se omite): [@${mk.slice(0, 40)}]`); continue; }
    let m;
    if (mk === "av") last = { p, at, kind: "av", name: "" };
    else if ((m = mk.match(/^pg (\d+)(?: (top|mid|bot))?$/))) { const nm = `pg${m[1]}${m[2] ? "_" + m[2] : ""}`; need.pages.add(nm); last = { p, at, kind: "pg", name: nm }; }
    else if ((m = mk.match(/^img: (.+)$/))) { const nm = `b${String(++nb).padStart(3, "0")}`; const pr = endDot(m[1].trim()) + HANDS; need.imgs.push({ name: nm, prompt: pr }); last = { p, at, kind: "bi", name: nm, p_: pr }; }
    else if ((m = mk.match(/^st: (.+?) \|\| (.+)$/))) { const nm = `s${String(++ns).padStart(3, "0")}`; const pr = endDot(m[2].trim()) + HANDS; need.stock.push({ name: nm, q: m[1].trim(), prompt: pr }); last = { p, at, kind: "bi", name: nm, q: m[1].trim(), p_: pr }; }
    else if ((m = mk.match(/^clip: (.+?) \|\| (.+)$/))) { const nm = `k${String(++nk).padStart(3, "0")}`; const pr = endDot(m[1].trim()) + HANDS; need.clips.push({ name: nm, prompt: pr, motion: m[2].trim(), hands: /hand|finger|glove|arm/i.test(m[1] + m[2]) }); last = { p, at, kind: "kf", name: nm, a: pr, d1: m[2].trim() }; }
    else if ((m = mk.match(/^ei (\d{4}): (.+)$/))) { const nm = `e${String(++ne).padStart(3, "0")}`; const pr = EI(m[1], m[2].trim()); need.imgs.push({ name: nm, prompt: pr, ei: 1 }); last = { p, at, kind: "ei", name: nm, p_: pr }; }
    else if ((m = mk.match(/^year (\d{4}): (.+)$/))) last = { p, at, kind: "c", name: "LorYear", props: { year: m[1], text: m[2].trim() } };
    else if ((m = mk.match(/^card: (.+?) \| (.+)$/))) last = { p, at, kind: "c", name: "LorRecipeCard", props: { title: m[1].trim(), lines: m[2].split(";").map((x) => x.trim()).filter(Boolean) } };
    else if (mk === "temps") last = { p, at, kind: "c", name: "LorSafeTemps", props: {} };
    else if (mk === "2h") last = { p, at, kind: "c", name: "LorTwoHourClock", props: { title: "The two-hour rule", hours: 2, hotNote: "1 hour if it's over 90°F", coldNote: "into the fridge, 40°F or colder · eat within 3 to 4 days" } };
    else if ((m = mk.match(/^verse: (.+) \| (.+)$/))) last = { p, at, kind: "c", name: "LorVerse", props: { text: m[1].trim().replace(/^[“"]|[”"]$/g, ""), vref: m[2].trim() } };
    else if (mk === "qr") last = { p, at, kind: "c", name: "LorQR", props: { qr: `img/${SLUG}/qr.png`, cover: `img/${SLUG}/cover.jpg`, site: SITE, book: "my little book" } };
    else if ((m = mk.match(/^care: (.+)$/))) { const s = shots[shots.length - 1]; if (s) (s.ovs ||= []).push({ c: "LorCareful", props: { text: m[1].trim() } }); continue; }
    else if (mk === "nevermix") { const s = shots[shots.length - 1]; if (s && !(s.ovs || []).some((o) => o.c === "LorNeverMix")) (s.ovs ||= []).push({ c: "LorNeverMix", props: {} }); continue; }
    else { errs.push(`p${p} marcador desconocido [@${mk.slice(0, 50)}]`); continue; }
    if (last.p_) { last.prompt = last.p_; delete last.p_; }
    shots.push(last);
    // página entera con mucho texto detrás (>15 s): a la mitad pasa al zoom del tercio del medio (otro plano real, sin cortes de 3 s)
    const nw = norm(nxt).length, mid = wpos + Math.floor(nw / 2);
    if (last.kind === "pg" && !last.name.includes("_") && nxt.length > 225 && nw > 12) {
      const a2 = anchor(pw, mid);
      if (a2) { const nm2 = last.name + "_mid"; need.pages.add(nm2); shots.push({ p, at: a2, kind: "pg", name: nm2 }); }
    }
  }
});
if (errs.length) { console.error("⛔ " + errs.join("\n⛔ ")); process.exit(1); }
// nombre propio del primer avatar (overlay del nombre) y del QR
const a0 = shots.find((s) => s.kind === "av" && s.p > 0) || shots[0];
(a0.ovs ||= []).push({ c: "LorNameTag", props: { name: "Loretta", sub: { ck: "81 · church supper cook · Iowa", fo: "81 · cooking for one · Iowa", cl: "81 · church lady · Iowa", fh: "81 · Iowa farm wife", su: "81 · sixty years in the same pew" }[CH] } });
fs.mkdirSync(R + `vlog/${SLUG}`, { recursive: true });
fs.writeFileSync(R + `vlog/${SLUG}/dir_a.mjs`, `// GENERADO por vlog/loretta/autodir.mjs desde guiones/${SLUG}_filmado.txt — no editar a mano\nexport const SHOTS = ${JSON.stringify(shots, null, 0)};\n`);
W(V3 + "need.json", { book: BOOK, site: SITE, pages: [...need.pages], imgs: need.imgs, clips: need.clips, stock: need.stock });
const cnt = {}; for (const s of shots) cnt[s.kind + (s.kind === "c" ? ":" + s.name : "")] = (cnt[s.kind + (s.kind === "c" ? ":" + s.name : "")] || 0) + 1;
console.log(`${SLUG}: ${lines.length} párrafos · ${shots.length} tomas · páginas ${need.pages.size} · imgs ${need.imgs.length} · clips ${need.clips.length} · stock ${need.stock.length}\n  ${JSON.stringify(cnt)}`);
