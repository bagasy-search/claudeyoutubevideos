import { supaCreds } from "file:///C:/Users/bauti/Downloads/video2/scripts/supa_creds.mjs";
const {U,K} = supaCreds(); const H={apikey:K,Authorization:`Bearer ${K}`,"Content-Type":"application/json",Prefer:"return=representation"};
const CH="https://www.youtube.com/channel/UCq1MjR_1TiXC6JLe_WokDvA";
const [cid,slug]=["tdc1789925792426-tdchacha","tdchacha"];
let ch=(await (await fetch(`${U}/rest/v1/tracked_channels?id=eq.221&select=plan,user_id`,{headers:H})).json())[0];
const card=ch.plan.find(c=>c.id===cid);
if(card.videoJobId){console.log("ya",card.videoJobId);process.exit()}
const body={user_id:ch.user_id,channel_key:CH,channel_name:"Taller de Claudio",slug,title:card.title,script:"",niche:"Claudio",format:"avatar",status:"running",progress:"Generando video (Claude Code)",provider:"claude-code",asset_mode:"mixto",thumb_url:card.thumb};
const r=await fetch(`${U}/rest/v1/video_jobs`,{method:"POST",headers:H,body:JSON.stringify(body)}); const j=await r.json();
if(!r.ok){console.log("ERR",JSON.stringify(j));process.exit()}
ch=(await (await fetch(`${U}/rest/v1/tracked_channels?id=eq.221&select=plan`,{headers:H})).json())[0];
ch.plan.find(x=>x.id===cid).videoJobId=j[0].id;
const p=await fetch(`${U}/rest/v1/tracked_channels?id=eq.221`,{method:"PATCH",headers:H,body:JSON.stringify({plan:ch.plan})});
console.log("job",j[0].id,"patch",p.status);
