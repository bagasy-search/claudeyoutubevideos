import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tdcrola/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tdcrola", "Tdchinca", "27928", "60", "@_tdcrola_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tdcrola-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tdcrola/farm.log", `\n[farm_run] exit ${c}\n`); });
