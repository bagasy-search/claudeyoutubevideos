# prueba de proxies (sin imprimirlos): cuántas líneas, formato, y cuáles responden a yt-dlp --print duration
set -e
pip install -q -U yt-dlp >/dev/null 2>&1; yt-dlp --version
python3 - <<'PY'
import os,subprocess,json
def norm(l):
    l=l.strip()
    if not l or l.startswith('#'): return None
    if '://' in l: return l
    p=l.split(':')
    return f"http://{p[2]}:{p[3]}@{p[0]}:{p[1]}" if len(p)==4 else None
for name in ('YTPX','YTPX2'):
    L=[norm(x) for x in os.environ.get(name,'').splitlines()]; L=[x for x in L if x]
    for x in L:
        for part in __import__('re').split(r'[:/@]+',x):
            if len(part)>3 and part not in ('http','https'): print('::add-mask::'+part)
    print(name,'líneas',len(L))
    ok=[]
    for i,px in enumerate(L):
        r=subprocess.run(['yt-dlp','--proxy',px,'--js-runtimes','node','--remote-components','ejs:github','--extractor-args','youtube:player_client=web_embedded','--print','duration','--no-warnings','https://www.youtube.com/watch?v=DC2o9O2Y33U'],capture_output=True,text=True,timeout=120)
        good=r.returncode==0 and r.stdout.strip().split('\n')[-1].isdigit()
        print(name,i+1,'OK' if good else 'falla')
        if good: ok.append(i+1)
    json.dump(ok,open(f'out/ok_{name}.json','w'))
PY
put out/ok_YTPX.json out/ok_YTPX2.json
