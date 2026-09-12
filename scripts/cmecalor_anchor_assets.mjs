import fs from 'node:fs';

const SLUG = 'cmecalor';
const scriptPath = 'guiones/cmecalor_receptaculo_TTS.txt';
const captionsPath = `public/captions_${SLUG}.json`;
const manifestPath = `_v3/${SLUG}_asset_manifest.json`;
const outputPath = `_v3/${SLUG}_moments_ms.json`;
const reportPath = `work/cmecalor/anchor_report.json`;

const normalize = (value) => String(value ?? '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9ñ]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const normId = (value) => String(value ?? '').replaceAll('-', '_').toLowerCase();
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));

const script = fs.readFileSync(scriptPath, 'utf8').replace(/^\uFEFF/, '');
const paragraphTexts = script.split(/\r?\n\s*\r?\n/).map((text) => text.trim()).filter(Boolean);
const scriptWords = [];
for (let paragraph = 0; paragraph < paragraphTexts.length; paragraph += 1) {
  for (const word of normalize(paragraphTexts[paragraph]).split(' ').filter(Boolean)) {
    scriptWords.push({word, paragraph: paragraph + 1});
  }
}

const captionsRaw = readJson(captionsPath);
const captions = [];
for (const item of Array.isArray(captionsRaw) ? captionsRaw : captionsRaw.words ?? []) {
  const parts = normalize(item.text ?? item.word ?? '').split(' ').filter(Boolean);
  for (const part of parts) captions.push({...item, token: part});
}
if (!scriptWords.length || !captions.length) throw new Error('Script or captions are empty');

// Global sequence alignment maps every script token to the real word timestamp that was spoken.
// Substitutions are still mapped: a Whisper error such as vatios/batidos occupies the same audio word.
const n = scriptWords.length;
const m = captions.length;
const width = m + 1;
const dp = new Uint16Array((n + 1) * width);
for (let i = 0; i <= n; i += 1) dp[i * width] = i;
for (let j = 0; j <= m; j += 1) dp[j] = j;
for (let i = 1; i <= n; i += 1) {
  const row = i * width;
  const prev = (i - 1) * width;
  for (let j = 1; j <= m; j += 1) {
    const sub = dp[prev + j - 1] + (scriptWords[i - 1].word === captions[j - 1].token ? 0 : 1);
    dp[row + j] = Math.min(dp[prev + j] + 1, dp[row + j - 1] + 1, sub);
  }
}

const scriptToCaption = new Int32Array(n).fill(-1);
let i = n;
let j = m;
while (i > 0 || j > 0) {
  const here = dp[i * width + j];
  if (i > 0 && j > 0) {
    const cost = scriptWords[i - 1].word === captions[j - 1].token ? 0 : 1;
    if (here === dp[(i - 1) * width + j - 1] + cost) {
      scriptToCaption[i - 1] = j - 1;
      i -= 1;
      j -= 1;
      continue;
    }
  }
  if (i > 0 && here === dp[(i - 1) * width + j] + 1) {
    i -= 1;
  } else {
    j -= 1;
  }
}

const manifest = readJson(manifestPath);
const contentRoles = /^(visual_[abc]|mass_s[1-4]|agnes_clip)$/;
const sourceCache = new Map();
const getItems = (source) => {
  if (!sourceCache.has(source)) sourceCache.set(source, readJson(source).items ?? []);
  return sourceCache.get(source);
};
const visualSources = [
  'work/cmecalor/visual_a.json',
  'work/cmecalor/visual_b.json',
  'work/cmecalor/visual_c.json',
];

const findSourceItem = (asset) => {
  const wanted = normId(asset.source_id);
  if (asset.role === 'agnes_clip') {
    for (const source of visualSources) {
      const match = getItems(source).find((item) => normId(item.id ?? item.name) === wanted);
      if (match) return match;
    }
    return null;
  }
  const audited = getItems(asset.source).find((item) =>
    normId(item.id ?? item.name) === wanted || normId(item.name) === wanted,
  ) ?? null;
  if (!asset.role.startsWith('mass_')) return audited;
  const shard = asset.role.at(-1);
  const spec = readJson(`work/cmecalor/mass_shots_s${shard}.json`);
  const planned = spec.find((item) =>
    normId(item.id ?? item.name ?? item.nombre) === wanted || normId(item.nombre) === wanted,
  ) ?? null;
  return audited || planned ? {...(planned ?? {}), ...(audited ?? {})} : null;
};

const grouped = new Map();
for (const asset of manifest.assets.filter((entry) => contentRoles.test(entry.role))) {
  const key = normId(asset.source_id);
  if (!grouped.has(key)) grouped.set(key, {key, still: null, clip: null, blur: null, sourceItem: null});
  const group = grouped.get(key);
  if (asset.kind === 'video') group.clip = asset.file;
  else group.still = asset.file;
  if (asset.blur) group.blur = asset.blur;
  group.sourceItem ??= findSourceItem(asset);
}

const findScriptSpan = (quote, paragraph = null) => {
  const q = normalize(quote).split(' ').filter(Boolean);
  if (!q.length) return null;
  const starts = [];
  for (let at = 0; at <= scriptWords.length - q.length; at += 1) {
    if (paragraph && scriptWords[at].paragraph !== paragraph) continue;
    let ok = true;
    for (let k = 0; k < q.length; k += 1) {
      if (scriptWords[at + k].word !== q[k]) { ok = false; break; }
    }
    if (ok) starts.push(at);
  }
  if (!starts.length && paragraph) return findScriptSpan(quote, null);
  if (!starts.length) {
    // Some focused specs intentionally summarize two clauses while omitting the sentence
    // between them. Anchor their first and last concrete words inside the same paragraph.
    const prefix = q.slice(0, Math.min(6, q.length));
    const suffix = q.slice(-Math.min(6, q.length));
    const paragraphCandidates = paragraph ? [paragraph] : [...new Set(scriptWords.map((word) => word.paragraph))];
    for (const p of paragraphCandidates) {
      let a = -1;
      let b = -1;
      for (let at = 0; at <= scriptWords.length - prefix.length; at += 1) {
        if (scriptWords[at].paragraph !== p) continue;
        if (prefix.every((word, k) => scriptWords[at + k]?.word === word)) { a = at; break; }
      }
      for (let at = Math.max(0, a); at <= scriptWords.length - suffix.length; at += 1) {
        if (scriptWords[at].paragraph !== p) continue;
        if (suffix.every((word, k) => scriptWords[at + k]?.word === word)) b = at + suffix.length - 1;
      }
      if (a >= 0 && b >= a) return {start: a, end: b};
    }
    return null;
  }
  return {start: starts[0], end: starts[0] + q.length - 1};
};

const mapSpan = (span) => {
  const mapped = [];
  for (let k = span.start; k <= span.end; k += 1) if (scriptToCaption[k] >= 0) mapped.push(scriptToCaption[k]);
  if (!mapped.length) return null;
  const first = captions[Math.min(...mapped)];
  const last = captions[Math.max(...mapped)];
  return {start_ms: first.startMs, end_ms: last.endMs};
};

const moments = [];
const missing = [];
for (const group of grouped.values()) {
  const source = group.sourceItem;
  const quote = source?.exact_quote ?? source?.anchor;
  const paragraph = Number(source?.paragraph) || null;
  const span = quote ? findScriptSpan(quote, paragraph) : null;
  const timing = span ? mapSpan(span) : null;
  if (!source || !quote || !span || !timing || !group.still) {
    missing.push({id: group.key, source: Boolean(source), quote: quote ?? null, span: Boolean(span), timing: Boolean(timing), still: group.still});
    continue;
  }
  moments.push({
    id: group.key,
    paragraph,
    anchor: quote,
    nouns: source.nouns ?? [],
    action: source.action ?? null,
    start_ms: timing.start_ms,
    end_ms: timing.end_ms,
    still: group.still.replace(/^public\//, ''),
    blur: group.blur?.replace(/^public\//, '') ?? null,
    clip: group.clip?.replace(/^public\//, '') ?? null,
    source_span: span,
  });
}

const addManual = ({id, quote, endQuote = quote, files}) => {
  const startSpan = findScriptSpan(quote);
  const endSpan = findScriptSpan(endQuote);
  if (!startSpan || !endSpan) {
    missing.push({id, manual: true, start_span: Boolean(startSpan), end_span: Boolean(endSpan)});
    return;
  }
  const timing = mapSpan({start: startSpan.start, end: endSpan.end});
  moments.push({id, paragraph: scriptWords[startSpan.start].paragraph, anchor: quote, nouns: ['guía', 'código QR'], action: 'Mostrar la guía y el QR mientras se los menciona.', start_ms: timing.start_ms, end_ms: timing.end_ms, manual_assets: files});
};

addManual({
  id: 'cta_microgeneradores_1',
  quote: 'esta hoja forma parte del capítulo sobre microgeneradores de la guía del canal',
  endQuote: 'allí tienes la tabla para convertir vatios y ciclos en horas y elegir un respaldo sin intentar alimentar toda la casa',
  files: ['img/cmecalor/cmec_cta_microgeneradores.png', 'img/cmecalor/cmec_cta_pages.png'],
});
addManual({
  id: 'cta_microgeneradores_2',
  quote: 'En el capítulo sobre microgeneradores, disponible con el código QR de la pantalla y en la descripción',
  endQuote: 'Si tu dolor es no saber qué comprar antes del próximo apagón, empieza por esa hoja y completa los números de tu propio equipo',
  files: ['img/cmecalor/cmec_cta_microgeneradores.png', 'img/cmecalor/cmec_cta_pages.png'],
});

moments.sort((a, b) => a.start_ms - b.start_ms || b.end_ms - a.end_ms || a.id.localeCompare(b.id));
const overlaps = [];
for (let k = 1; k < moments.length; k += 1) {
  if (moments[k].start_ms < moments[k - 1].end_ms) {
    overlaps.push({previous: moments[k - 1].id, current: moments[k].id, overlap_ms: moments[k - 1].end_ms - moments[k].start_ms});
  }
}

const output = {
  slug: SLUG,
  timing_source: captionsPath,
  audio_master: `public/${SLUG}.wav`,
  avatar: `public/avatar_${SLUG}.mp4`,
  fps: 30,
  total_audio_ms: captions.at(-1).endMs,
  global_word_edit_distance: dp[n * width + m],
  moments,
};
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
fs.writeFileSync(reportPath, `${JSON.stringify({
  slug: SLUG,
  script_words: n,
  caption_words: m,
  word_error_rate: Number((dp[n * width + m] / n).toFixed(5)),
  grouped_assets: grouped.size,
  timed_moments: moments.length,
  missing,
  overlaps,
}, null, 2)}\n`);

console.log(JSON.stringify({moments: moments.length, missing: missing.length, overlaps: overlaps.length, total_audio_ms: output.total_audio_ms, report: reportPath, output: outputPath}, null, 2));
