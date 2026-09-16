import { supaCreds } from "../../scripts/supa_creds.mjs";
const {U,K} = supaCreds(); const H={apikey:K,Authorization:`Bearer ${K}`};
const j = await (await fetch(`${U}/rest/v1/tracked_channels?select=id,name,plan&id=eq.236`,{headers:H})).json();
const find=(o)=>{ if(!o||typeof o!=="object")return null; if(o.id==="rowe11789558947721-7")return o; for(const v of Object.values(o)){const f=find(v); if(f)return f;} return null;};
for (const row of j){ console.log(row.id,row.name); const c=find(row.plan); console.log(JSON.stringify(c,null,1).slice(0,6000)); }
const jj=await (await fetch(`${U}/rest/v1/video_jobs?id=in.(453,458)&select=id,status,slug,mp4_url,yt_title,yt_description`,{headers:H})).json(); console.log(JSON.stringify(jj,null,1).slice(0,3000));
