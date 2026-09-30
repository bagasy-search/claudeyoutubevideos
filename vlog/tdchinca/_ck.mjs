import { supaCreds } from "file:///C:/Users/bauti/Downloads/video2/scripts/supa_creds.mjs";
const {U,K} = supaCreds(); const H={apikey:K,Authorization:`Bearer ${K}`};
const ch=(await (await fetch(`${U}/rest/v1/tracked_channels?id=eq.221&select=channel_key,name,niche,video_defaults`,{headers:H})).json())[0];
console.log(JSON.stringify(ch));
