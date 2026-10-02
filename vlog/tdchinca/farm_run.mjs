import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tdchinca/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tdchinca", "Tdchinca", "27928", "60", "@_tdchinca_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tdchinca-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tdchinca/farm.log", `\n[farm_run] exit ${c}\n`); });
