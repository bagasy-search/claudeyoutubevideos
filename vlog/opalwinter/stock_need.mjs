// cuántos tiles buenos pide el DIRECTOR por base de stock vs cuántos aprobó el juez
import fs from "node:fs";
const { SHOTS: A } = await import("./dir_a.mjs"); const { SHOTS: B } = await import("./dir_b.mjs"); const { SHOTS: C } = await import("./dir_c.mjs");
const need = {};
const add = (n) => { const m = /^st_(\w+)\.(\d+)$/.exec(n || ""); if (m) need["st_" + m[1]] = Math.max(need["st_" + m[1]] || 0, +m[2]); };
for (const s of [...A, ...B, ...C]) { add(s.kind === "st" ? s.name : null); add(s.props?.bed); }
const J = JSON.parse(fs.readFileSync("_v3/opalwinter_stock_judge.json", "utf8"));
for (const [k, v] of Object.entries(need).sort()) { const g = (J[k]?.good || []).length; console.log(k, "need", v, "good", g, g < v ? "  <<<FALTA" : ""); }
