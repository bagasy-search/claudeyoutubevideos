import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/plsecretos/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "plsecretos", "Plsecretos", "22465", "60", "@_plsecretos_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "plsecretos-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/plsecretos/farm.log", `\n[farm_run] exit ${c}\n`); });
