import { build } from "esbuild";
const stub = { name: "stub", setup(b) {
  b.onResolve({ filter: /^@remotion\/google-fonts/ }, (a) => ({ path: a.path, namespace: "stub" }));
  b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "export const loadFont = () => ({ fontFamily: 'x' });", loader: "js" }));
}};
await build({ entryPoints: ["D:/rtmp/apex/apex06/v2/sfx_entry.ts"], bundle: true, platform: "node", format: "esm", outfile: "D:/rtmp/apex/apex06/v2/_sfx.mjs", plugins: [stub], jsx: "automatic", loader: { ".png": "empty", ".jpg": "empty" }, logLevel: "error", nodePaths: ["C:/Users/bauti/Downloads/video2/node_modules"] });
