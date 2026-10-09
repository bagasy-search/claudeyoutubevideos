// Reintenta agnes_i2v cada 12 min hasta que no falte ninguno (agnes 429 por saturación de la IP/cuenta)
import { spawnSync } from "node:child_process"; import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/olsup/";
const list = JSON.parse(fs.readFileSync(R + "_v3/olsup_i2v.json", "utf8"));
for (let r = 0; r < 30; r++) {
  const falta = list.filter((x) => !fs.existsSync(R + `public/broll/olsup/${x.nombre}.mp4`));
  console.log(new Date().toISOString(), "ronda", r, "faltan", falta.length); if (!falta.length) break;
  fs.writeFileSync(R + "_v3/olsup_i2v_falta.json", JSON.stringify(falta));
  spawnSync("node", ["scripts/agnes_i2v.mjs", "_v3/olsup_i2v_falta.json", "olsup", "public/img/olsup", "public/broll/olsup"], { cwd: R, stdio: "inherit", env: { ...process.env, AGNES_INFLIGHT: "3" }, windowsHide: true });
  await new Promise((res) => setTimeout(res, 12 * 60_000));
}
