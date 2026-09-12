import fs from 'fs';
import { supaCreds } from './supa_creds.mjs';
const [channelKey, cardId, slug] = process.argv.slice(2);
const REPO = 'bagasy-search/claudeyoutubevideos';
const { U, K } = supaCreds();
const H = {apikey: K, Authorization: 'Bearer ' + K, 'Content-Type': 'application/json'};
const meta = JSON.parse(fs.readFileSync(`public/${slug}_meta.json`, 'utf8'));
const url = `https://github.com/${REPO}/releases/download/${slug}/${slug}.mp4`;

const main = async () => {
  // columnas existentes
  const sample = await (await fetch(`${U}/rest/v1/video_jobs?select=*&limit=1`, {headers: H})).json();
  console.log('columnas video_jobs:', Object.keys(sample[0] || {}).join(', '));

  const ch = (await (await fetch(`${U}/rest/v1/tracked_channels?select=id,user_id,name,plan&channel_key=eq.${encodeURIComponent(channelKey)}&role=eq.own`, {headers: H})).json())[0];
  if (!ch) { console.error('canal no encontrado'); process.exit(4); }
  const plan = Array.isArray(ch.plan) ? ch.plan : [];
  const item = plan.find((p) => p.id === cardId);
  const thumb = item?.thumb || null;
  console.log('canal:', ch.id, 'user:', ch.user_id, 'name:', ch.name, '| card:', item ? 'sí' : 'NO', '| thumb:', thumb ? 'sí' : 'no');

  let script = '';
  try { script = fs.readFileSync('guiones/secretos-belleza-1960.md', 'utf8').split('---').slice(1).join('---').trim(); } catch {}
  if (!script) script = meta.title || slug;
  const jobBody = {
    user_id: ch.user_id, channel_key: channelKey, channel_name: ch.name || 'Doctora Valeria Alcázar', slug,
    title: (meta.title || item?.title || slug).slice(0, 200), provider: 'claude-chat',
    script, script_chars: script.length, kit: 'valeria-vintage',
    status: 'done', mp4_url: url, thumb_url: thumb,
    yt_title: meta.title ? String(meta.title).slice(0, 120) : null, yt_description: meta.description || null,
  };
  let jr = await fetch(`${U}/rest/v1/video_jobs`, {method: 'POST', headers: {...H, Prefer: 'return=representation'}, body: JSON.stringify(jobBody)});
  if (!jr.ok) {
    const err = await jr.text();
    let j = {}; try { j = JSON.parse(err); } catch {}
    console.error('MSG:', j.message || err.slice(0, 200), '| HINT:', j.hint || '');
    process.exit(5);
  }
  const job = (await jr.json())[0];
  console.log('video_jobs ✓ id', job.id, '· status=done · mp4_url seteado · yt_title/desc seteados');

  if (item) {
    // done (tic ✓) lo pone SOLO la subida a YouTube, no la entrega. Ver deliver_card.mjs.
    const next = plan.map((p) => (p.id === cardId ? {...p, videoJobId: job.id} : p));
    const pu = await fetch(`${U}/rest/v1/tracked_channels?id=eq.${ch.id}`, {method: 'PATCH', headers: {...H, Prefer: 'return=minimal'}, body: JSON.stringify({plan: next})});
    console.log('tarjeta enganchada:', pu.status === 204 ? `OK (videoJobId=${job.id} → "Video listo", SIN tic hasta subir a YouTube)` : `fallo ${pu.status}`);
  }
  console.log('LISTO_JOB_ID=' + job.id);
};
main();
