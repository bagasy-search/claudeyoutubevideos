import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/pldestapa/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "pldestapa", "Pldestapa", "15893", "60", "@_pldestapa_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "pldestapa-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/pldestapa/farm.log", `\n[farm_run] exit ${c}\n`); });
