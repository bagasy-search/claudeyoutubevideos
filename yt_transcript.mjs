// yt_transcript.mjs — transcripción de un video de YouTube, gratis (innertube player + timedtext).
// uso: node yt_transcript.mjs <videoId> [--ts]
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const videoId = process.argv[2];
const withTs = process.argv.includes('--ts');
if (!videoId) { console.error('uso: node yt_transcript.mjs <videoId>'); process.exit(1); }

const body = {
  context: {
    client: {
      clientName: 'ANDROID', clientVersion: '19.09.37', androidSdkVersion: 30,
      userAgent: 'com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip', hl: 'en', gl: 'US'
    }
  },
  videoId
};
let r = await fetch('https://www.youtube.com/youtubei/v1/player?key=AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'user-agent': body.context.client.userAgent },
  body: JSON.stringify(body)
});
let j = await r.json();
let tracks = j?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

if (!tracks || !tracks.length) {
  // fallback WEB
  r = await fetch('https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8', {
    method: 'POST', headers: { 'content-type': 'application/json', 'user-agent': UA },
    body: JSON.stringify({ context: { client: { clientName: 'WEB', clientVersion: '2.20240726.00.00', hl: 'en', gl: 'US' } }, videoId })
  });
  j = await r.json();
  tracks = j?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
}

if (!tracks || !tracks.length) {
  const UA2='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
  const html = await (await fetch('https://www.youtube.com/watch?v='+videoId,{headers:{'user-agent':UA2,'accept-language':'en-US,en;q=0.9'}})).text();
  const i = html.indexOf('ytInitialPlayerResponse');
  if (i>=0) {
    let jstart = html.indexOf('{', i);
    let depth=0,inStr=false,esc=false,pr=null;
    for(let k=jstart;k<html.length;k++){const c=html[k];
      if(inStr){if(esc){esc=false;continue;}if(c===String.fromCharCode(92)){esc=true;continue;}if(c==='"')inStr=false;continue;}
      if(c==='"'){inStr=true;continue;}
      if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){try{pr=JSON.parse(html.slice(jstart,k+1));}catch{}break;}}}
    tracks = pr?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  }
}
if (!tracks || !tracks.length) { console.error('sin captions'); process.exit(2); }
const tr = tracks.find(t => /^en/.test(t.languageCode)) || tracks[0];
const url = tr.baseUrl + '&fmt=json3';
const cc = await (await fetch(url, { headers: { 'user-agent': UA } })).json();
const parts = [];
for (const ev of (cc.events || [])) {
  const txt = (ev.segs || []).map(s => s.utf8).join('').replace(/\n/g, ' ').trim();
  if (!txt) continue;
  const t = Math.round((ev.tStartMs || 0) / 1000);
  parts.push(withTs ? `[${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}] ${txt}` : txt);
}
console.log(withTs ? parts.join('\n') : parts.join(' ').replace(/\s+/g, ' '));
console.error('\n-- ' + parts.length + ' líneas · ' + tr.languageCode + ' --');
