import {execFileSync, spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SLUG = "v0w7c4w70kfg";
const RELEASE_TAG = `assets-${SLUG}`;
const MANIFEST = path.resolve(
  "src",
  "VideoEdit",
  `${SLUG}_assets.txt`,
);
const PUBLIC_DIR = path.resolve("public");
const LARGE_DISK_DIR = "D:/videosdeclaude";

const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exit(1);
};

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    shell: false,
  });

  if (result.error) {
    fail(`${command} no pudo iniciarse: ${result.error.message}`);
  }
  if (result.status !== 0 && !options.allowFailure) {
    const detail = options.capture
      ? (result.stderr || result.stdout || "").trim()
      : "";
    fail(
      `${command} terminó con código ${result.status}${
        detail ? `: ${detail}` : ""
      }`,
    );
  }
  return result;
};

if (!fs.existsSync(MANIFEST)) {
  fail(`no existe el manifest: ${MANIFEST}`);
}
if (!fs.existsSync(PUBLIC_DIR)) {
  fail(`no existe el directorio public: ${PUBLIC_DIR}`);
}

const entries = fs
  .readFileSync(MANIFEST, "utf8")
  .split(/\r?\n/)
  .map((entry) => entry.trim())
  .filter(Boolean);

if (entries.length === 0) {
  fail(`el manifest está vacío: ${MANIFEST}`);
}

const publicPrefix = `${PUBLIC_DIR}${path.sep}`;
for (const entry of entries) {
  if (path.isAbsolute(entry)) {
    fail(`el manifest contiene una ruta absoluta: ${entry}`);
  }

  const resolved = path.resolve(PUBLIC_DIR, entry);
  if (resolved !== PUBLIC_DIR && !resolved.startsWith(publicPrefix)) {
    fail(`la entrada sale de public/: ${entry}`);
  }
  if (!fs.existsSync(resolved)) {
    fail(`falta el asset declarado: public/${entry.replaceAll("\\", "/")}`);
  }
}

const requestedTarDir = process.env.TAR_DIR?.trim();
const tarDir = requestedTarDir
  ? path.resolve(requestedTarDir)
  : fs.existsSync(LARGE_DISK_DIR)
    ? path.resolve(LARGE_DISK_DIR)
    : os.tmpdir();

fs.mkdirSync(tarDir, {recursive: true});

const tarPath = path.join(tarDir, `${RELEASE_TAG}.tar`);
const tarVersion = run("tar", ["--version"], {
  capture: true,
  allowFailure: true,
});
const isGnuTar =
  tarVersion.status === 0 && /GNU tar/i.test(tarVersion.stdout || "");
const tarArgs = [
  ...(isGnuTar ? ["--force-local"] : []),
  "-cf",
  tarPath,
  "-C",
  PUBLIC_DIR,
  "-T",
  MANIFEST,
];

console.log(`empaquetando ${entries.length} entradas → ${tarPath}`);
execFileSync("tar", tarArgs, {
  cwd: process.cwd(),
  stdio: "inherit",
  windowsHide: true,
});

const tarStat = fs.statSync(tarPath);
if (!tarStat.isFile() || tarStat.size === 0) {
  fail(`el tar quedó vacío o inválido: ${tarPath}`);
}

const existing = run("gh", ["release", "view", RELEASE_TAG], {
  capture: true,
  allowFailure: true,
});
if (existing.status === 0) {
  console.log(`reemplazando release existente: ${RELEASE_TAG}`);
  run("gh", [
    "release",
    "delete",
    RELEASE_TAG,
    "--yes",
    "--cleanup-tag",
  ]);
}

run("gh", [
  "release",
  "create",
  RELEASE_TAG,
  tarPath,
  "--title",
  RELEASE_TAG,
  "--notes",
  `assets aislados del video ${SLUG}`,
]);

const releaseJson = run(
  "gh",
  ["release", "view", RELEASE_TAG, "--json", "assets"],
  {capture: true},
);

let release;
try {
  release = JSON.parse(releaseJson.stdout);
} catch {
  fail(`gh devolvió JSON inválido al verificar ${RELEASE_TAG}`);
}

const uploaded = release.assets?.find(
  (asset) => asset.name === path.basename(tarPath),
);
if (!uploaded || Number(uploaded.size) !== tarStat.size) {
  fail(
    `el asset publicado no coincide con el tar local (${tarStat.size} bytes)`,
  );
}

console.log(
  `✓ ${RELEASE_TAG} publicado · ${uploaded.size} bytes · ${tarPath}`,
);
