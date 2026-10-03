import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tcmilavad/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tcmilavad", "Tcmilavad", "14586", "60", "@_tcmilavad_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tcmilavad-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tcmilavad/farm.log", `\n[farm_run] exit ${c}\n`); });
