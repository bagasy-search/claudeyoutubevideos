// Contexto compartido de la cadena Loretta (3 videos en el worktree lor3). SLUG sale del env: SLUG=lorsides node vlog/loretta/x.mjs
import fs from "node:fs";
export const R = "D:/Proyectos/video2-wt/lnet/";
export const SLUG = process.env.SLUG;
if (!SLUG) { console.error("falta SLUG=<slug>"); process.exit(1); }
export const V3 = R + "_v3/" + SLUG + "_";
export const J = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
export const W = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 1));
