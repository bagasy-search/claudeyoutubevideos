import os
from PIL import Image
dst='public/img/olpots'; n=0
for src in ('out/imgs_raw','out/imgs_regen'):
    if not os.path.isdir(src): continue
    for f in sorted(os.listdir(src)):
        if not f.endswith('.png') or f.startswith('_'): continue
        name=f[:-4]; out=f'{dst}/{name}.jpg'
        if os.path.exists(out) and os.path.getmtime(out)>=os.path.getmtime(f'{src}/{f}'): continue
        im=Image.open(f'{src}/{f}').convert('RGB')
        if im.size!=(1920,1080): im=im.resize((1920,1080),Image.LANCZOS)
        im.save(out,quality=90); n+=1
print('convertidas',n)
