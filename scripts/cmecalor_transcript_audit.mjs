import fs from 'node:fs';

const slug = 'cmecalor';
const scriptPath = 'guiones/cmecalor_receptaculo_TTS.txt';
const transcriptPath = `transcript_${slug}.txt`;
const outputPath = `work/cmecalor/transcript_audit.json`;

const normalize = (value) => String(value ?? '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9ñ]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokens = (value) => normalize(value).split(' ').filter(Boolean);
const script = fs.readFileSync(scriptPath, 'utf8').replace(/^\uFEFF/, '');
const transcript = fs.readFileSync(transcriptPath, 'utf8').replace(/^\uFEFF/, '');
const expected = tokens(script);
const observed = tokens(transcript);

let previous = new Uint16Array(observed.length + 1);
let current = new Uint16Array(observed.length + 1);
for (let j = 0; j <= observed.length; j += 1) previous[j] = j;
for (let i = 1; i <= expected.length; i += 1) {
  current[0] = i;
  for (let j = 1; j <= observed.length; j += 1) {
    const substitution = previous[j - 1] + (expected[i - 1] === observed[j - 1] ? 0 : 1);
    current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, substitution);
  }
  [previous, current] = [current, previous];
}

const distance = previous[observed.length];
const report = {
  slug,
  script: scriptPath,
  transcript: transcriptPath,
  expected_words: expected.length,
  observed_words: observed.length,
  word_edit_distance: distance,
  word_error_rate: Number((distance / expected.length).toFixed(5)),
  normalized_character_ratio: Number((normalize(transcript).length / normalize(script).length).toFixed(5)),
  duration_source: 'public/captions_cmecalor.json',
  verdict: distance / expected.length <= 0.08 ? 'pass' : 'review',
};

fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
