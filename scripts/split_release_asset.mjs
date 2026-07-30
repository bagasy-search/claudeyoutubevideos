import {closeSync, existsSync, openSync, readSync, statSync, writeSync} from "node:fs";

const [input, outputBase, rawLimit = "1800000000"] = process.argv.slice(2);
const limit = Number(rawLimit);
if (!input || !outputBase || !Number.isSafeInteger(limit) || limit < 1_000_000) {
  throw new Error("usage: node scripts/split_release_asset.mjs <input> <output-base> [max-bytes]");
}
if (!existsSync(input)) throw new Error(`input does not exist: ${input}`);

const size = statSync(input).size;
const source = openSync(input, "r");
const buffer = Buffer.allocUnsafe(8 * 1024 * 1024);
const parts = [];
let position = 0;

try {
  for (let index = 0; position < size; index++) {
    const part = `${outputBase}.part-${String(index).padStart(3, "0")}`;
    const destination = openSync(part, "w");
    let written = 0;
    try {
      while (written < limit && position < size) {
        const wanted = Math.min(buffer.length, limit - written, size - position);
        const bytes = readSync(source, buffer, 0, wanted, position);
        if (!bytes) break;
        writeSync(destination, buffer, 0, bytes);
        written += bytes;
        position += bytes;
      }
    } finally {
      closeSync(destination);
    }
    parts.push({path: part, bytes: written});
  }
} finally {
  closeSync(source);
}

console.log(JSON.stringify({ok: true, input, size, limit, parts}, null, 2));
