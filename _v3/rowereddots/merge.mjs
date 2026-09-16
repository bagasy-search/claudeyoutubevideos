import fs from "fs";
const D="_v3/rowereddots/";
const S = fs.readFileSync(D+"guion_rowereddots.txt","utf8");
const secs = ["a","b","c","d","e","f"].flatMap(k=>JSON.parse(fs.readFileSync(D+`sec_${k}.json`,"utf8")));
const I=(n)=>`img/rowereddots/${n}.jpg`;
const SETS={
 "@why":[{num:"1",title:"Age",sub:"the years change tiny vessels",image:I("rd_dr_old_photo")},{num:"2",title:"Family",sub:"it runs in families",image:I("rd_family_album")},{num:"3",title:"Hormones",sub:"new ones in pregnancy",image:I("rd_pregnancy")},{num:"4",title:"Some exposures",sub:"a few medicines and chemicals",image:I("rd_garage_chemicals")}],
 "@warn":[{num:"1",title:"Grows fast",sub:"over a few weeks",image:I("rd_warn_grow")},{num:"2",title:"Changes shape",sub:"ragged, irregular edge",image:I("rd_warn_shape")},{num:"3",title:"Turns black or blue",sub:"a dark new color",image:I("rd_warn_black")},{num:"4",title:"Bleeds on its own",sub:"again and again",image:I("rd_warn_bleed")},{num:"5",title:"Won't heal",sub:"an open sore",image:I("rd_warn_sore")}],
};
const KINDS=new Set(["lowerthird","frasecinetica","errorstinger","datoimpacto","checklist","mitoverdad","lineatiempo","freezezoom","carrusel","callout","glasstest","bodymap","splitcompare","presenter","falltease","carousel","myth2","redflags","routineswap","selfcheck"]);
let bad=0; const names=new Set();
const BAD=/bokeh|cinematic|35mm|\b8k\b|blurr|out of focus|shallow depth|soft focus|grainy|muted|subject isolation|stock photo|breath/i;
let nm=0, nc=0;
const allN=new Set(secs.flatMap(s=>s.momentos).map(m=>m.n));
for (const s of secs){
  for (const m of s.momentos){ nm++;
    const i=S.indexOf(m.p); if(i<0){console.log("FALTA",m.n,"|",m.p);bad++;continue;}
    if(S.indexOf(m.p,i+1)>=0) console.log("  (repetida) ",m.n,m.p);
    if(names.has(m.n)){console.log("DUP",m.n);bad++;} names.add(m.n);
    if((m.prompt||"")+(m.motion||"") && BAD.test(((m.prompt||"")+" "+(m.motion||"")).replace("nothing blurred out",""))){console.log("BAD token",m.n);bad++;}
    if(m.tipo!=="stock" && (!m.prompt||!m.motion)){console.log("sin prompt/motion",m.n);bad++;}
    m.dice=m.p; m.muestra=m.prompt||m.q;
  }
  for (const c of s.componentes){ nc++;
    if(typeof c.items==="string"){ if(!SETS[c.items]){console.log("set?",c.items);bad++;} else c.items=SETS[c.items]; }
    if(!KINDS.has(c.kind)){console.log("kind?",c.kind);bad++;}
    const i=S.indexOf(c.p); if(i<0){console.log("FALTA comp",c.kind,"|",c.p);bad++;}
    const refs=JSON.stringify(c).match(/img\/rowereddots\/[a-z0-9_]+\.jpg/g)||[];
    for(const r of refs){const n=r.split("/").pop().replace(".jpg",""); if(!allN.has(n)){console.log("comp ref a imagen inexistente",c.kind,n);bad++;}}
  }
}
const plan={slug:"rowereddots",secciones:secs};
fs.writeFileSync("_v3/rowereddots_plan.json",JSON.stringify(plan,null,1));
const M=secs.flatMap(s=>s.momentos);
const t={}; M.forEach(m=>t[m.tipo]=(t[m.tipo]||0)+1);
const k={}; secs.flatMap(s=>s.componentes).forEach(c=>k[c.kind]=(k[c.kind]||0)+1);
console.log(`midió ${nm} momentos · ${nc} componentes (${Object.keys(k).length} tipos ${JSON.stringify(k)}) · tipos ${JSON.stringify(t)} · fallas ${bad}`);
process.exit(bad?1:0);
