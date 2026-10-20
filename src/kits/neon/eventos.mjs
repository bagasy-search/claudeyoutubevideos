// Vuelca la pista de sonido de una escena a JSON (para mezcla_neon.py), sin abrir Remotion:
//   node src/kits/neon/eventos.mjs <modulo.tsx> <EXPORT> <salida.json>
//   ej: node src/kits/neon/eventos.mjs src/kits/neon/Demo.tsx EVENTOS_DEMO E:/videos/neon_demo_sfx.json
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const [mod, exp = "EVENTOS_DEMO", out = "eventos_sfx.json"] = process.argv.slice(2);
const stub = { name: "stub", setup(b) {
  b.onResolve({ filter: /^@remotion\/google-fonts/ }, (a) => ({ path: a.path, namespace: "stub" }));
  b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "export const loadFont = () => ({ fontFamily: 'x' });", loader: "js" }));
}};
const tmp = path.resolve(path.dirname(out), `_ev_${process.pid}.mjs`);
const entry = `import * as M from ${JSON.stringify(path.resolve(mod).split(path.sep).join("/"))}; console.log(JSON.stringify(M[${JSON.stringify(exp)}]));`;
await build({ stdin: { contents: entry, resolveDir: process.cwd(), loader: "ts" }, bundle: true, platform: "node", format: "esm", outfile: tmp, plugins: [stub], jsx: "automatic", loader: { ".png": "empty", ".jpg": "empty", ".json": "json" }, logLevel: "error" });
const orig = console.log; let txt = "";
console.log = (s) => { txt = s; };
await import(pathToFileURL(tmp).href);
console.log = orig;
fs.unlinkSync(tmp);
fs.writeFileSync(out, txt);
console.log("eventos:", JSON.parse(txt).length, "→", out);
