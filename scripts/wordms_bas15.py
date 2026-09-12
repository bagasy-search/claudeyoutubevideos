import json, re, difflib
def words(s): return re.findall(r"[0-9A-Za-zÁÉÍÓÚÑÜáéíóúñü]+", s)
guion = open("canales/bastida_15_senales_SINTAGS.txt", encoding="utf-8").read()
caps = json.load(open("public/captions_bastidarenal15_full.json", encoding="utf-8"))
GW = words(guion)
AT = [re.sub(r"[^0-9A-Za-zÁÉÍÓÚÑÜáéíóúñü]", "", c["text"]) for c in caps]
def norm(w):
    w=w.lower()
    for a,b in zip("áéíóúü","aeiouu"): w=w.replace(a,b)
    return w
gN=[norm(w) for w in GW]; aN=[norm(w) for w in AT]
sm=difflib.SequenceMatcher(None,gN,aN,autojunk=False)
ms=[None]*len(GW)
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag=="equal":
        for k in range(i2-i1): ms[i1+k]=caps[j1+k]["startMs"]
    elif j2>j1:
        a=caps[j1]["startMs"]; b=caps[j2-1]["endMs"]; n=max(1,i2-i1)
        for k in range(i2-i1): ms[i1+k]=int(a+(b-a)*k/n)
last=0
for i in range(len(ms)):
    if ms[i] is None: ms[i]=last
    ms[i]=max(ms[i],last); last=ms[i]
anchored=sum(1 for tag,i1,i2,j1,j2 in sm.get_opcodes() if tag=="equal" for _ in range(i2-i1))
json.dump({"words":GW,"ms":ms}, open("_bastidarenal15_wordms.json","w",encoding="utf-8"), ensure_ascii=False)
print(f"palabras guion={len(GW)} ASR={len(AT)} ancladas exactas={anchored} ({anchored/len(GW)*100:.1f}%)")
