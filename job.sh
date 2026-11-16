# EVALUADOR: hoja de 5 stills por componente (entrada x3, medio, salida) desde el MP4 final
set -e
for n in 1 2 3 4 5; do gh release download "$S" -R "$R" -p "$S.mp4" --clobber && break; sleep $((n*8)); done
python3 - <<'PY'
import json, subprocess, os
S=os.environ['S']; os.makedirs('out',exist_ok=True)
for c in json.load(open('comps.json')):
    ins=[]; fl=[]
    for i,t in enumerate(c['t']):
        subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{t:.2f}','-i',S+'.mp4','-frames:v','1','-vf','scale=640:360',f'f{i}.png']); ins+=['-i',f'f{i}.png']
    subprocess.run(['ffmpeg','-v','error','-y',*ins,'-filter_complex','[0][1][2][3][4]hstack=5,scale=1600:-2','-q:v','3',f"out/{c['n']}.jpg"])
print(len(os.listdir('out')))
PY
