// Scrapea comentarios de YouTube sin API key (InnerTube). node yt_comments.mjs <videoId> [n]
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const BS = String.fromCharCode(92);

function extract(html, key) {
  const i = html.indexOf(key); if (i < 0) return null;
  const s = html.indexOf('{', i);
  let d = 0, inStr = false, esc = false;
  for (let j = s; j < html.length; j++) {
    const c = html[j];
    if (inStr) {
      if (esc) { esc = false; }
      else if (c === BS) { esc = true; }
      else if (c === '"') { inStr = false; }
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '{') d++;
    else if (c === '}') { d--; if (d === 0) { try { return JSON.parse(html.slice(s, j + 1)); } catch (e) { return null; } } }
  }
  return null;
}

function findTokens(obj, out = []) {
  if (!obj || typeof obj !== 'object') return out;
  if (obj.continuationCommand && obj.continuationCommand.token) out.push(obj.continuationCommand.token);
  for (const k in obj) findTokens(obj[k], out);
  return out;
}

function harvest(obj, out = []) {
  if (!obj || typeof obj !== 'object') return out;
  const vm = obj.commentEntityPayload;
  if (vm && vm.properties && vm.properties.content && vm.properties.content.content) {
    out.push({ t: vm.properties.content.content, likes: (vm.toolbar && (vm.toolbar.likeCountNotliked || vm.toolbar.likeCountLiked)) || '' });
  }
  const r = obj.commentRenderer;
  if (r && r.contentText && r.contentText.runs) {
    out.push({ t: r.contentText.runs.map(x => x.text).join(''), likes: (r.voteCount && r.voteCount.simpleText) || '' });
  }
  for (const k in obj) harvest(obj[k], out);
  return out;
}

const vid = process.argv[2];
const want = Number(process.argv[3] || 120);
const html = await (await fetch(`https://www.youtube.com/watch?v=${vid}&hl=es`, { headers: { 'user-agent': UA, 'accept-language': 'es-ES,es;q=0.9' } })).text();
const key = (html.match(/"INNERTUBE_API_KEY":"(.*?)"/) || [])[1];
const ver = (html.match(/"clientVersion":"([\d.]+)"/) || [])[1] || '2.20240101.00.00';
const data = extract(html, 'var ytInitialData =') || extract(html, 'window["ytInitialData"] =');
const toks = findTokens(data).filter(t => t.length > 60);
if (!key || !toks.length) { console.error('no token/key'); process.exit(1); }

const body = (token) => JSON.stringify({ context: { client: { clientName: 'WEB', clientVersion: ver, hl: 'es', gl: 'MX' } }, continuation: token });
const all = [], seen = new Set();
let token = toks[toks.length - 1];
for (let page = 0; page < 8 && all.length < want && token; page++) {
  const r = await fetch(`https://www.youtube.com/youtubei/v1/next?key=${key}&prettyPrint=false`, {
    method: 'POST', headers: { 'content-type': 'application/json', 'user-agent': UA }, body: body(token),
  });
  const j = await r.json();
  const cs = harvest(j);
  for (const c of cs) { if (!seen.has(c.t)) { seen.add(c.t); all.push(c); } }
  const next = findTokens(j).filter(t => t.length > 60 && t !== token);
  token = next[next.length - 1];
  if (!cs.length && page > 1) break;
}
console.log(`### ${vid} — ${all.length} comentarios`);
all.slice(0, want).forEach(c => console.log(`[${c.likes}] ${c.t.replace(/\n/g, ' ')}`));
