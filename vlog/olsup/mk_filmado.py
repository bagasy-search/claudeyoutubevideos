import re
t=open('guiones/olsup.txt',encoding='utf8').read().strip()
paras=[p.strip() for p in re.split(r'\n\s*\n',t) if p.strip()]
out=[];cur='INTRO'
for p in paras:
    m=re.match(r'(?:Alright\. )?Number (\w+(?:-\w+)?)\.',p)
    if m: cur='N'+m.group(1)
    out.append(f"[{cur}|] {p}")
open('vlog/olsup/guion_filmado.txt','w',encoding='utf8').write("\n".join(out))
