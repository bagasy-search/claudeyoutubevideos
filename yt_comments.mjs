// yt_comments.mjs — comentarios reales de un video de YouTube, gratis (InnerTube).
// uso: node yt_comments.mjs <videoId> [n]
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const videoId = process.argv[2];
const want = +(process.argv[3] || 120);
if (!videoId) { console.error('uso: node yt_comments.mjs <videoId> [n]'); process.exit(1); }

function extractJson(html, key) {
  const i = html.indexOf(key);
  if (i < 0) return null;
  let j = html.indexOf('{', i);
  let depth = 0, inStr = false, esc = false;
  for (let k = j; k < html.length; k++) {
    const c = html[k];
    if (inStr) { if (esc) { esc = false; continue; } if (c === '\\') { esc = true; continue; } if (c === '"') inStr = false; continue; }
    if (c === '"') { inStr = true; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { try { return JSON.parse(html.slice(j, k + 1)); } catch { return null; } } }
  }
  return null;
}

function findTokens(node, out) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const x of node) findTokens(x, out); return; }
  if (node.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token)
    out.push(node.continuationItemRenderer.continuationEndpoint.continuationCommand.token);
  if (node.continuationCommand?.token) out.push(node.continuationCommand.token);
  for (const k of Object.keys(node)) findTokens(node[k], out);
}

function harvest(node, out, seen) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const x of node) harvest(x, out, seen); return; }
  if (node.commentEntityPayload) {
    const p = node.commentEntityPayload;
    const t = p.properties?.content?.content;
    const likes = p.toolbar?.likeCountNotliked || p.toolbar?.likeCountLiked || '0';
    const key = (t || '').slice(0, 60);
    if (t && !seen.has(key)) { seen.add(key); out.push({ likes, text: t }); }
  }
  if (node.commentRenderer) {
    const c = node.commentRenderer;
    const t = (c.contentText?.runs || []).map(r => r.text).join('');
    const likes = c.voteCount?.simpleText || '0';
    const key = t.slice(0, 60);
    if (t && !seen.has(key)) { seen.add(key); out.push({ likes, text: t }); }
  }
  for (const k of Object.keys(node)) harvest(node[k], out, seen);
}

const html = await (await fetch('https://www.youtube.com/watch?v=' + videoId, { headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9' } })).text();
const apiKey = (html.match(/"INNERTUBE_API_KEY":"([^"]+)"/) || [])[1];
const ver = (html.match(/"clientVersion":"([\d.]+)"/) || [])[1] || '2.20240101.00.00';
const data = extractJson(html, 'var ytInitialData =');
if (!apiKey || !data) { console.error('sin innertube/ytInitialData'); process.exit(2); }

let toks = []; findTokens(data, toks);
let token = toks[toks.length - 1];
const out = [], seen = new Set();
let page = 0;
while (token && out.length < want && page < 10) {
  const r = await fetch('https://www.youtube.com/youtubei/v1/next?key=' + apiKey, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': UA },
    body: JSON.stringify({ context: { client: { clientName: 'WEB', clientVersion: ver, hl: 'en', gl: 'US' } }, continuation: token })
  });
  const j = await r.json();
  const before = out.length;
  harvest(j, out, seen);
  const nt = []; findTokens(j, nt);
  token = nt[nt.length - 1];
  page++;
  if (out.length === before && page > 2) break;
}
const sorted = out.map(c => ({ ...c, n: (() => { const m = String(c.likes).replace(/,/g, '').match(/([\d.]+)([KM]?)/); if (!m) return 0; let v = parseFloat(m[1]); if (m[2] === 'K') v *= 1e3; if (m[2] === 'M') v *= 1e6; return v; })() }))
  .sort((a, b) => b.n - a.n);
for (const c of sorted.slice(0, want)) console.log('[' + c.likes + '] ' + c.text.replace(/\n+/g, ' / '));
console.error('\n-- ' + out.length + ' comentarios --');
