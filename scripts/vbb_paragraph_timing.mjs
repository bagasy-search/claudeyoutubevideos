import fs from 'fs';

const slug = 'vbb0rdkrfduo';
const captions = JSON.parse(fs.readFileSync(`public/captions_${slug}.json`, 'utf8').replace(/^\uFEFF/, ''));
const script = fs.readFileSync(`public/guiones/${slug}.txt`, 'utf8').replace(/^\uFEFF/, '');
const normalize = (value) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\[[^\]]+\]/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .split(/\s+/)
  .map((token) => ({
    xiv: '14', catorce: '14', uno: '1', una: '1', dos: '2', tres: '3', cuatro: '4',
    cinco: '5', seis: '6', siete: '7', ocho: '8', nueve: '9', diez: '10',
  })[token] ?? token)
  .join(' ');
const words = captions.map((word) => ({...word, token: normalize(word.text)})).filter((word) => word.token);
const paragraphs = script.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const rows = [];
let searchFrom = 0;

for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {
  const paragraph = paragraphs[paragraphIndex];
  const tokens = normalize(paragraph).split(/\s+/).filter(Boolean);
  const needle = tokens.slice(0, Math.min(10, tokens.length));
  let hit = -1;
  for (let index = searchFrom; index <= words.length - needle.length; index++) {
    if (needle.every((token, offset) => words[index + offset]?.token === token)) {
      hit = index;
      break;
    }
  }
  if (hit < 0) {
    const shortNeedle = needle.slice(0, 5);
    for (let index = searchFrom; index <= words.length - shortNeedle.length; index++) {
      if (shortNeedle.every((token, offset) => words[index + offset]?.token === token)) {
        hit = index;
        break;
      }
    }
  }
  const startMs = hit >= 0 ? words[hit].startMs : null;
  rows.push({index: paragraphIndex + 1, startMs, text: paragraph});
  if (hit >= 0) searchFrom = hit + needle.length;
}

if (rows[0]?.startMs == null) rows[0].startMs = 0;
const manualStarts = new Map([
  [29, 696_740],
  [35, 865_820],
]);
for (const row of rows) {
  if (row.startMs == null && manualStarts.has(row.index)) row.startMs = manualStarts.get(row.index);
}

for (let index = 0; index < rows.length; index++) {
  rows[index].endMs = rows[index + 1]?.startMs ?? captions.at(-1)?.endMs ?? rows[index].startMs;
  rows[index].duration = rows[index].startMs == null || rows[index].endMs == null
    ? null
    : Number(((rows[index].endMs - rows[index].startMs) / 1000).toFixed(2));
}

fs.writeFileSync(`beatsheet/${slug}_paragraphs.json`, JSON.stringify(rows, null, 2));
for (const row of rows) console.log(`${String(row.index).padStart(3)} ${row.startMs == null ? '  MISS' : String((row.startMs / 1000).toFixed(2)).padStart(7)} ${row.text.slice(0, 105)}`);
