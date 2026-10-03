import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/pzvendedor/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "pzvendedor", "Pzvendedor", "14960", "60", "@_pzvendedor_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "pzvendedor-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/pzvendedor/farm.log", `\n[farm_run] exit ${c}\n`); });
