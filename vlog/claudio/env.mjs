// Contexto compartido de la cadena del canal Claudio el Conserje (clon parametrizado de vlog/rhonda). SLUG sale del env:
// SLUG=clborde node vlog/claudio/x.mjs · R = el worktree donde vive esta carpeta (o env R)
import fs from "node:fs";
import { fileURLToPath } from "node:url";
export const R = process.env.R || fileURLToPath(new URL("../../", import.meta.url)).split("\\").join("/");
export const SLUG = process.env.SLUG;
if (!SLUG) { console.error("falta SLUG=<slug>"); process.exit(1); }
export const V3 = R + "_v3/" + SLUG + "_";
export const J = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
export const W = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 1));
