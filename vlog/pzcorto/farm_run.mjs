import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/pzcorto/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "pzcorto", "Pzcorto", "12922", "60", "@_pzcorto_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "pzcorto-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/pzcorto/farm.log", `\n[farm_run] exit ${c}\n`); });
