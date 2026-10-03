import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tclavad/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tclavad", "Tclavad", "17219", "60", "@_tclavad_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tclavad-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tclavad/farm.log", `\n[farm_run] exit ${c}\n`); });
