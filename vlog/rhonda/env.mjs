// Contexto compartido de la cadena del canal Rhonda (clonada de vlog/loretta). SLUG sale del env: SLUG=rhtoiletrim node vlog/rhonda/x.mjs · R = worktree (env R)
import fs from "node:fs";
export const R = process.env.R || "D:/Proyectos/video2-wt/rhtoiletrim/";
export const SLUG = process.env.SLUG;
if (!SLUG) { console.error("falta SLUG=<slug>"); process.exit(1); }
export const V3 = R + "_v3/" + SLUG + "_";
export const J = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
export const W = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 1));
