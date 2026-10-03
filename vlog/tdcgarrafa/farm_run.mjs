import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tdcgarrafa/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tdcgarrafa", "Tdcgarrafa", "26403", "60", "@_tdcgarrafa_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tdcgarrafa-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tdcgarrafa/farm.log", `\n[farm_run] exit ${c}\n`); });
