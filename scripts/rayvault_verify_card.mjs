import fs from 'node:fs';
import {parseEnv} from 'node:util';
const e=parseEnv(fs.readFileSync('D:/Proyectos/yt-scout-web/.env.local','utf8'));
const u=e.NEXT_PUBLIC_SUPABASE_URL,k=e.SUPABASE_SERVICE_ROLE_KEY;
const h={apikey:k,Authorization:'Bearer '+k};
const response=await fetch(`${u}/rest/v1/tracked_channels?select=id,name,plan&channel_key=eq.draft%3Ark9x2v4&role=eq.own`,{headers:h});
if(!response.ok)throw Error('Card lookup HTTP '+response.status);
const channel=(await response.json())[0];
const card=channel?.plan?.find(p=>p.id==='rkwkm51');
if(!card)throw Error('The requested Bagasy card is absent; do not create an orphan job');
const result={channel:channel.name,cardId:card.id,done:card.done??false,videoJobId:card.videoJobId??null,thumb:card.thumb??null};
if(card.videoJobId){
 const r=await fetch(`${u}/rest/v1/video_jobs?id=eq.${card.videoJobId}&select=id,status,slug,mp4_url,thumb_url,yt_title,yt_description,yt_video_id,yt_upload_status`,{headers:h});
 if(!r.ok)throw Error('Job lookup HTTP '+r.status);result.job=(await r.json())[0];
}
fs.mkdirSync('_v3/rayvault',{recursive:true});
const dest=process.argv[2]||'_v3/rayvault/card_snapshot.json';
if(process.argv.includes('--ready')){
 const meta=JSON.parse(fs.readFileSync('public/rayvault_meta.json','utf8'));
 const before=JSON.parse(fs.readFileSync('_v3/rayvault/card_before.json','utf8'));
 if(result.done!==false||!result.job||result.job.status!=='done'||result.job.slug!=='rayvault')throw Error('Card is not in the requested ready-to-upload state');
 if(result.job.yt_video_id)throw Error('Unexpected YouTube publication id');
 if(result.thumb!==before.thumb||result.job.thumb_url!==before.thumb)throw Error('Thumbnail changed');
 if(result.job.yt_title!==meta.title||result.job.yt_description!==meta.description)throw Error('Delivered metadata mismatch');
 if(result.job.mp4_url!=='https://github.com/bagasy-search/claudeyoutubevideos/releases/download/rayvault/rayvault.mp4')throw Error('Wrong final video URL');
 result.verifiedReady=true;
}
fs.writeFileSync(dest,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
