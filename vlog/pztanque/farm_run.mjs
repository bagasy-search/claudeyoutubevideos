import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/pztanque/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "pztanque", "Pztanque", "11078", "60", "@_pztanque_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "pztanque-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/pztanque/farm.log", `\n[farm_run] exit ${c}\n`); });
