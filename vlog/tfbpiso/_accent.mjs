import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(".env","utf8").split(/\r?\n/).filter(l=>l.includes("=")&&!l.startsWith("#")).map(l=>[l.slice(0,l.indexOf("=")).trim(), l.slice(l.indexOf("=")+1).trim().replace(/^"|"$/g,"")]));
const f = process.argv[2];
const b64 = fs.readFileSync(f).toString("base64");
const r = await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-audio",modalities:["text"],messages:[{role:"user",content:[{type:"text",text:process.env.Q},{type:"input_audio",input_audio:{data:b64,format:"mp3"}}]}]})});
const j = await r.json(); console.log(j.choices?.[0]?.message?.content || JSON.stringify(j).slice(0,300));
