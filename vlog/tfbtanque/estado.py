# estado de clips por escena: hechos / total (state.json + state_det.json)
import json, os
R='D:/Proyectos/video2-wt/tfbtanque/'
tot=done=0
for o in json.load(open(R+'vlog/tfbtanque/order.json',encoding='utf8')):
    if o['type']!='scene': continue
    P=json.load(open(o['plan'],encoding='utf8')); cl=P['dir']+'clips/'
    st={}
    for f in ('state.json','state_det.json'):
        if os.path.exists(cl+f): st.update(json.load(open(cl+f,encoding='utf8')))
    ids=[c['id'] for c in P['clips']]; d=[i for i in ids if i in st]
    anc=sum(os.path.exists(P['dir']+'anc/'+a['id']+'.png') for a in P['anchors'])
    tot+=len(ids); done+=len(d)
    print(f"{o['seg']:5} clips {len(d):2}/{len(ids):2}  anclas {anc}/{len(P['anchors'])}  faltan: {' '.join(i for i in ids if i not in st)[:110]}")
print('TOTAL', done, '/', tot)
