import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/pzlimpia/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "pzlimpia", "Pzlimpia", "14579", "60", "@_pzlimpia_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "pzlimpia-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/pzlimpia/farm.log", `\n[farm_run] exit ${c}\n`); });
