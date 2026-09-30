// lanza el farm con su env, oculto, log a out/logs/farm_final.log
import { spawn } from "node:child_process"; import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/tfbtanque/"; process.chdir(R);
const F = fs.readFileSync(R + "src/tfbtanque/timeline.gen.ts", "utf8").match(/TOTAL_FRAMES_TFBTANQUE = (\d+)/)[1];
const o = fs.openSync(R + "out/logs/farm_final.log", "a");
const env = { ...process.env, ENTRY: "src/index_tfbtanque.tsx", FARM_REF: "tfbtanque-render", AUDIO_FILE: "tfbtanque.m4a", TAR_DIR: "D:/rtmp", STITCH_RAW: "1" };
const p = spawn(process.execPath, ["scripts/farm.mjs", "tfbtanque", "Tfbtanque", F, "60", "@_tfbtanque_assets.txt"], { env, stdio: ["ignore", o, o], windowsHide: true });
p.on("exit", c => { fs.writeSync(o, `\nFARM_EXIT ${c}\n`); process.exit(0); });
