import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/pzterra/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "pzterra", "Pzterra", "14415", "60", "@_pzterra_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "pzterra-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/pzterra/farm.log", `\n[farm_run] exit ${c}\n`); });
