import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tdccorta/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tdccorta", "Tdccorta", "23572", "60", "@_tdccorta_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tdccorta-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tdccorta/farm.log", `\n[farm_run] exit ${c}\n`); });
