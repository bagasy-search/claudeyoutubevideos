import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/pzaire/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "pzaire", "Pzaire", "19245", "60", "@_pzaire_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "pzaire-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/pzaire/farm.log", `\n[farm_run] exit ${c}\n`); });
