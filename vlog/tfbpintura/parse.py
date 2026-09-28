# parse beats.txt -> beats.json (orden global) + guion Fish
import re, json, sys, collections
B=[]; n=0; SKIP=set()
for ln in open('vlog/tfbpintura/beats.txt',encoding='utf8'):
    ln=ln.strip()
    if not ln or ln.startswith('#'): continue
    skip=ln.startswith('~'); ln=ln.lstrip('~')
    m=re.match(r'\[([^\]]*)\]\s*(.*)$',ln); head,text=m.group(1),m.group(2).strip()
    n+=1; bid=f'b{n:03d}'
    if skip: SKIP.add(bid)
    if head=='LAM': B.append({'id':bid,'type':'L','scene':'LAM','text':text}); continue
    parts=re.split(r'(?<!\|)\|(?!\|)',head); sc=parts[0]; kind=parts[1]
    if kind.startswith('I:'):
        d1,d2=kind[2:].split('||'); B.append({'id':bid,'type':'I','scene':sc,'secs':4,'d1':d1.strip(),'d2':d2.strip(),'host':text.strip(),'text':''}); continue
    if kind.startswith('DX'):
        secs=int(kind[2:kind.index(':')]); d1,d2=kind[kind.index(':')+1:].split('||')
        B.append({'id':bid,'type':'DX','scene':sc,'secs':secs,'d1':d1.strip(),'d2':d2.strip(),'text':''})
    elif kind.startswith('D:'):
        d1,d2=kind[2:].split('||'); B.append({'id':bid,'type':'D','scene':sc,'d1':d1.strip(),'d2':d2.strip(),'text':text})
    elif kind.startswith('V:'):
        B.append({'id':bid,'type':'V','scene':sc,'A':kind[2:].strip(),'K':parts[2][2:].strip(),'line':text.strip('«»'),'text':text.strip('«»')})
    else:
        B.append({'id':bid,'type':'A','scene':sc,'A':kind[2:].strip(),'K':parts[2][2:].strip(),'text':text})
B=[{**b,'skip':True} if b['id'] in SKIP else b for b in B]
json.dump(B,open('vlog/tfbpintura/beats.json','w',encoding='utf8'),ensure_ascii=False,indent=1)
spoken=[b for b in B if b['type'] in 'A D L'.split() and b['text']]
tot=sum(len(b['text']) for b in spoken)
print('beats',len(B),'hablados',len(spoken),'chars',tot, 'min est', round(tot/14.5/60,1))
ch=collections.Counter(); 
for b in B:
    if b['type'] in ('A','V'): ch[b['scene']]+=1
print('anclas por plan (sin K0):',dict(ch))
print('detalles',sum(b['type'] in('D','DX') for b in B),'vecino',sum(b['type']=='V' for b in B))
L=[(len(b['text']),b['id']) for b in spoken]; print('max len',sorted(L)[-5:], 'min', sorted(L)[:5])
# minutos acumulados (14.5 c/s + 0.25 s por beat)
t=0
for b in B:
    if b['type']=='V': t+=4.5
    elif b['type']=='DX': t+=b['secs']
    else: t+=len(b['text'])/14.5+0.25
    b['t']=t
for mark in (60,120,180,240,390,420,600,900):
    bb=[b for b in B if b['t']>=mark][:1]
    if bb: print(f'{mark//60}:{mark%60:02d} ->', bb[0]['id'], bb[0]['scene'], bb[0].get('text','')[:50])
print('total est min', round(t/60,2))
lines=[b['text'] for b in B if b['type'] in ('A','D','L') and b['text']]  # el guion Fish incluye los skip (ya se generó así)
open('guiones/tfbpintura.txt','w',encoding='utf8',newline='\n').write('\n'.join(lines)+'\n')
