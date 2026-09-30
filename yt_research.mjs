// yt_research.mjs — research YouTube GRATIS (sin API key, sin login).
// uso:
//   node yt_research.mjs search "keyless car theft"  [n]
//   node yt_research.mjs channel UCxxxx|@handle
// salida: tabla + Downloads/yt_research_out.json
import fs from 'fs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

async function getHtml(url) {
  const r = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9' } });
  return await r.text();
}

function extractJson(html, key) {
  const i = html.indexOf(key);
  if (i < 0) return null;
  let j = html.indexOf('{', i);
  if (j < 0) return null;
  let depth = 0, inStr = false, esc = false;
  for (let k = j; k < html.length; k++) {
    const c = html[k];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { try { return JSON.parse(html.slice(j, k + 1)); } catch { return null; } } }
  }
  return null;
}

function parseViews(s) {
  if (!s) return 0;
  const m = String(s).replace(/,/g, '').match(/([\d.]+)\s*([KMB]?)/i);
  if (!m) return 0;
  let n = parseFloat(m[1]);
  const u = (m[2] || '').toUpperCase();
  if (u === 'K') n *= 1e3; if (u === 'M') n *= 1e6; if (u === 'B') n *= 1e9;
  return Math.round(n);
}

function ageDays(s) {
  if (!s) return null;
  const m = String(s).match(/(\d+)\s*(second|minute|hour|day|week|month|year)/i);
  if (!m) return null;
  const n = +m[1], u = m[2].toLowerCase();
  const mult = { second: 1 / 86400, minute: 1 / 1440, hour: 1 / 24, day: 1, week: 7, month: 30.4, year: 365 }[u];
  return Math.round(n * mult);
}

function walk(node, out, seen) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const x of node) walk(x, out, seen); return; }

  // layout NUEVO: lockupViewModel
  if (node.lockupViewModel) {
    const lv = node.lockupViewModel;
    const id = lv.contentId;
    const md = lv.metadata?.lockupMetadataViewModel;
    const title = md?.title?.content;
    const rows = md?.metadata?.contentMetadataViewModel?.metadataRows || [];
    const parts = [];
    for (const r of rows) for (const p of (r.metadataParts || [])) if (p.text?.content) parts.push(p.text.content);
    if (id && title && !seen.has(id)) {
      seen.add(id);
      const viewsTxt = parts.find(p => /view/i.test(p)) || '';
      const whenTxt = parts.find(p => /ago$/i.test(p)) || '';
      const chan = parts.find(p => !/view/i.test(p) && !/ago$/i.test(p)) || '';
      out.push({ id, title, channel: chan, views: parseViews(viewsTxt), when: whenTxt, ageDays: ageDays(whenTxt) });
    }
  }
  // layout VIEJO: videoRenderer
  if (node.videoRenderer) {
    const v = node.videoRenderer;
    const id = v.videoId;
    const title = v.title?.runs?.[0]?.text || v.title?.simpleText;
    if (id && title && !seen.has(id)) {
      seen.add(id);
      const viewsTxt = v.viewCountText?.simpleText || v.shortViewCountText?.simpleText || '';
      const whenTxt = v.publishedTimeText?.simpleText || '';
      out.push({ id, title, channel: v.ownerText?.runs?.[0]?.text || '', views: parseViews(viewsTxt), when: whenTxt, ageDays: ageDays(whenTxt) });
    }
  }
  for (const k of Object.keys(node)) {
    if (k === 'lockupViewModel' || k === 'videoRenderer') continue;
    walk(node[k], out, seen);
  }
}

const mode = process.argv[2];
const arg = process.argv[3];
const limit = +(process.argv[4] || 30);

let url;
if (mode === 'search') url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(arg) + '&sp=CAMSAhAB';
else if (mode === 'searchrel') url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(arg);
else if (mode === 'channel') url = (arg.startsWith('@') ? 'https://www.youtube.com/' + arg : 'https://www.youtube.com/channel/' + arg) + '/videos';
else { console.error('modo: search | searchrel | channel'); process.exit(1); }

const html = await getHtml(url);
const data = extractJson(html, 'var ytInitialData =') || extractJson(html, 'ytInitialData"] =');
if (!data) { console.error('sin ytInitialData (throttled?)'); process.exit(2); }
const out = [], seen = new Set();
walk(data, out, seen);
const rows = out.filter(r => r.views > 0).sort((a, b) => b.views - a.views).slice(0, limit);
const med = (() => { const v = out.map(r => r.views).filter(Boolean).sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : 1; })();
for (const r of rows) {
  r.vpd = r.ageDays ? Math.round(r.views / r.ageDays) : null;
  r.outlier = +(r.views / med).toFixed(2);
  console.log(String(r.views).padStart(10), String(r.vpd ?? '-').padStart(7) + '/d', (r.when || '').padEnd(14), r.id, '|', r.channel.slice(0, 28).padEnd(28), '|', r.title.slice(0, 90));
}
fs.writeFileSync('C:/Users/bauti/Downloads/yt_research_out.json', JSON.stringify(out, null, 2));
console.log('\ntotal', out.length, '· mediana', med, '· json → C:/Users/bauti/Downloads/yt_research_out.json');
