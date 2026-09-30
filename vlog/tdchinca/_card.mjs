import { supaCreds } from "file:///C:/Users/bauti/Downloads/video2/scripts/supa_creds.mjs";
const {U,K} = supaCreds(); const H={apikey:K,Authorization:`Bearer ${K}`};
const ch=(await (await fetch(`${U}/rest/v1/tracked_channels?id=eq.221&select=*`,{headers:H})).json())[0];
console.log(Object.keys(ch).join(","));console.log(ch.channel_id, ch.channel_name, ch.user_id, ch.niche);
for(const c of ch.plan) console.log(JSON.stringify(c).slice(0,50));
const c=ch.plan.find(x=>x.id==="tdc1789925792426-tdchinca"); console.log(JSON.stringify(c,null,1));
