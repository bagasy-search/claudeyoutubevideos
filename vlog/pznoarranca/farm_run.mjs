import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/pznoarranca/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "pznoarranca", "Pznoarranca", "14950", "60", "@_pznoarranca_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "pznoarranca-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/pznoarranca/farm.log", `\n[farm_run] exit ${c}\n`); });
