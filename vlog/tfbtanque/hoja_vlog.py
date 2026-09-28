# hoja de contactos de un vlog_<ESC>.mp4: 2 cuadros por clip (inicio+1/3, fin-1/3), con rótulo. uso: python hoja_vlog.py ESC
import json, sys, subprocess, os
from PIL import Image, ImageDraw, ImageFont
R='D:/Proyectos/video2-wt/tfbtanque/'; sc=sys.argv[1]; d=R+f'out/vlog/{sc}/'
tl=json.load(open(d+f'timeline_vlog_{sc}.json',encoding='utf8'))
W,H=384,216; ims=[]
for c in tl:
    for k in (0.3,0.75):
        t=c['vstart']+c['vdur']*k; o=R+f'out/hojas/_f.jpg'
        subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{t:.2f}','-i',d+f'vlog_{sc}.mp4','-frames:v','1','-vf',f'scale={W}:{H}',o],creationflags=0x08000000)
        ims.append((c['id']+('' if k<0.5 else "'"),Image.open(o).copy()))
cols=6; rows=(len(ims)+cols-1)//cols; S=Image.new('RGB',(cols*W,rows*(H+22)),(15,15,15)); dr=ImageDraw.Draw(S)
f=ImageFont.truetype('arial.ttf',18)
for i,(n,im) in enumerate(ims):
    x,y=(i%cols)*W,(i//cols)*(H+22); S.paste(im,(x,y+22)); dr.text((x+4,y+2),n,fill=(255,210,31),font=f)
S.save(R+f'out/hojas/vlog_{sc}.jpg',quality=80); print('ok',len(ims))
