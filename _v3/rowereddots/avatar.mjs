// UN /run RunPod InfiniteTalk con el reel de ventanas visibles. Ref = public/ref_rowereddots.png TAL CUAL.
import fs from "fs";
import { supaCreds } from "../../scripts/supa_creds.mjs";
const env = Object.fromEntries(fs.readFileSync(".env","utf8").split(/\r?\n/).map(l=>l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/)).filter(Boolean).map(m=>[m[1],m[2].replace(/^["']|["']$/g,"")]));
const H = { Authorization: `Bearer ${env.RUNPOD_API_KEY}`, "Content-Type": "application/json" };
const JF = "_v3/rowereddots/avatar_job.json";
const sleep = (ms) => new Promise(r=>setTimeout(r,ms));
const {U,K} = supaCreds();
const files = [["face.png","public/ref_rowereddots.png","image/png"],["reel.wav","_v3/rowereddots/reel/rowereddots_reel.wav","audio/wav"]];
let job = fs.existsSync(JF) ? JSON.parse(fs.readFileSync(JF,"utf8")) : {};
if (!job.id) {
  const urls = {};
  for (const [n,l,ct] of files) {
    const obj = `tmp_avatar/rowereddots_${n}`;
    const r = await fetch(`${U}/storage/v1/object/thumbnails/${obj}`,{method:"POST",headers:{apikey:K,Authorization:`Bearer ${K}`,"Content-Type":ct,"x-upsert":"true"},body:fs.readFileSync(l),signal:AbortSignal.timeout(600000)});
    if(!r.ok) throw new Error(`subida ${n}: ${r.status} ${await r.text()}`);
    urls[n] = `${U}/storage/v1/object/public/thumbnails/${obj}`;
    const h = await fetch(urls[n],{method:"HEAD"}); console.log("hosteado",n,h.status,h.headers.get("content-length"));
    if (h.status!==200) throw new Error("no público");
  }
  const body = { input: { prompt: "A friendly doctor speaks naturally and warmly to the camera in his office, natural head movement, subtle hand-free gestures, realistic lighting", image: urls["face.png"], audio: urls["reel.wav"], size: "720p" }, policy: { executionTimeout: 7200000 } };
  const r = await fetch("https://api.runpod.ai/v2/infinitetalk/run",{method:"POST",headers:H,body:JSON.stringify(body)});
  const t = await r.text(); console.log("run",r.status,t.slice(0,200));
  if(!r.ok) process.exit(1);
  job = { id: JSON.parse(t).id, ts: Date.now() }; fs.writeFileSync(JF, JSON.stringify(job,null,1));
}
let st;
for (let k=0;k<800;k++){ await sleep(k?30000:5000);
  try { st = await (await fetch(`https://api.runpod.ai/v2/infinitetalk/status/${job.id}`,{headers:H,signal:AbortSignal.timeout(45000)})).json(); } catch(e){ console.log("poll",e.message); continue; }
  if (k%10===0) console.log(new Date().toISOString(), st.status);
  if (["COMPLETED","FAILED","CANCELLED","TIMED_OUT"].includes(st.status)) break; }
console.log("final", st.status, JSON.stringify(st.output||st.error||"").slice(0,300));
if (st.status!=="COMPLETED") process.exit(1);
const mp4 = await fetch(st.output.result,{signal:AbortSignal.timeout(1800000)});
fs.writeFileSync("public/rowereddots_avatar_raw.mp4", Buffer.from(await mp4.arrayBuffer()));
job.cost = st.output.cost; job.done = true; fs.writeFileSync(JF, JSON.stringify(job,null,1));
for (const [n] of files) await fetch(`${U}/storage/v1/object/thumbnails/tmp_avatar/rowereddots_${n}`,{method:"DELETE",headers:{apikey:K,Authorization:`Bearer ${K}`}}).catch(()=>{});
console.log("OK costo", st.output.cost);
