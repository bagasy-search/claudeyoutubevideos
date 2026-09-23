import json,os,sys
S=sys.argv[1]; fixes=json.loads(sys.argv[2])  # {"K7":"prefix text"}
p=f"plan_{S}.json"; P=json.load(open(p,encoding="utf-8"))
for a in P["anchors"]:
    if a["id"] in fixes:
        if fixes[a["id"]] not in a["prompt"]: a["prompt"]=fixes[a["id"]]+" "+a["prompt"]
        for f in (f"{S}/anc/{a['id']}.png", f"{S}/anc/{a['id']}_raw.png"):
            if os.path.exists(f):
                k=1
                while os.path.exists(f.replace(".png",f"_v{k}.png")): k+=1
                os.rename(f,f.replace(".png",f"_v{k}.png"))
json.dump(P,open(p,"w",encoding="utf-8"),ensure_ascii=False,indent=1); print("ok",S,list(fixes))
