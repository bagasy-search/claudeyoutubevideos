import { supaCreds } from "../../scripts/supa_creds.mjs";
const {U,K}=supaCreds(); const H={apikey:K,Authorization:`Bearer ${K}`};
const c=(await (await fetch(`${U}/rest/v1/tracked_channels?id=eq.236&select=plan`,{headers:H})).json())[0];
const items=[];const walk=(o)=>{if(!o||typeof o!=="object")return;if(typeof o.id==="string"&&/^rowe1178955894772\d?-\d+$/.test(o.id))items.push(o);for(const v of Object.values(o))walk(v)};walk(c.plan);
for(const i of items)console.log(i.id,"done",i.done,"job",i.videoJobId);
const j=await (await fetch(`${U}/rest/v1/video_jobs?id=eq.458&select=id,status,mp4_url,yt_title`,{headers:H})).json();console.log(JSON.stringify(j));
const r=await fetch(j[0].mp4_url,{method:"HEAD",redirect:"follow"});console.log("mp4_url",r.status,r.headers.get("content-length"));
