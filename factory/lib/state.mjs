// state.mjs — estado por fase, idempotente y reanudable.
//
//   factory/_state/<slug>/<fase>.json = { fase, status, medido, inputsHash, ts, ms, error }
//   status: done | running | failed | blocked | needs   (needs = espera algo humano/creativo)
//
// Una fase se SALTEA sólo si status=done Y el hash de sus inputs no cambió. Se acabó el "ya estaban N"
// sin mirar: el `medido` de la fase anterior es lo que se muestra y lo que se audita.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { slugPaths } from "./paths.mjs";

export function hashInputs(inputs) {
  const h = crypto.createHash("sha256");
  for (const x of [].concat(inputs || []).sort((a, b) => String(a).localeCompare(String(b)))) {
    if (typeof x === "string" && fs.existsSync(x)) {
      const st = fs.statSync(x);
      if (st.isDirectory()) {
        const files = fs.readdirSync(x).sort();
        h.update(`dir:${x}:${files.length}`);
        for (const f of files) { const s = fs.statSync(path.join(x, f)); h.update(`${f}:${s.size}:${Math.floor(s.mtimeMs)}`); }
      } else if (st.size < 8 * 1024 * 1024) h.update(`file:${x}:`).update(fs.readFileSync(x));
      else h.update(`big:${x}:${st.size}:${Math.floor(st.mtimeMs)}`);
    } else h.update(`val:${JSON.stringify(x)}`);
  }
  return h.digest("hex").slice(0, 16);
}

export class State {
  constructor(slug, { dir } = {}) {
    this.slug = slug;
    this.dir = dir || slugPaths(slug).state;
    fs.mkdirSync(this.dir, { recursive: true });
  }
  file(fase) { return path.join(this.dir, `${fase}.json`); }
  get(fase) {
    try { return JSON.parse(fs.readFileSync(this.file(fase), "utf8")); } catch { return null; }
  }
  set(fase, rec) {
    const full = { fase, ts: new Date().toISOString(), ...rec };
    const tmp = this.file(fase) + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(full, null, 1));
    fs.renameSync(tmp, this.file(fase));           // escritura atómica: un corte no deja JSON a medias
    return full;
  }
  isFresh(fase, inputsHash) {
    const s = this.get(fase);
    return !!s && s.status === "done" && s.inputsHash === inputsHash;
  }
  all() {
    return fs.readdirSync(this.dir).filter((f) => f.endsWith(".json")).map((f) => this.get(f.replace(/\.json$/, ""))).filter(Boolean)
      .sort((a, b) => String(a.fase).localeCompare(String(b.fase)));
  }
  reset(fase) { try { fs.unlinkSync(this.file(fase)); } catch { /* nada */ } }
}
