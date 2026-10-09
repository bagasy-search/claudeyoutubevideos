# Re-transcribe una ventana corta (Whisper se come frases en tramos largos) y la injerta en _v3/olsup_asr.json: python patch_asr.py <s> <e>
import sys, json, subprocess, os
s, e = float(sys.argv[1]), float(sys.argv[2])
A = json.load(open('_v3/olsup_asr.json', encoding='utf8'))
tmp = 'out/_seg.wav'; oj = 'out/_seg.json'
subprocess.run(['ffmpeg','-v','error','-y','-ss',str(s),'-to',str(e),'-i','public/olsup.wav','-ac','1','-ar','16000',tmp],check=True)
subprocess.run(['node','scripts/asr_openai.mjs',tmp,oj,'600','en'],check=True,capture_output=True)
B = json.load(open(oj, encoding='utf8'))['words']
keep = [w for w in A['words'] if w['end'] <= s or w['start'] >= e]
new = [{'word': w['word'], 'start': round(w['start']+s,3), 'end': round(w['end']+s,3)} for w in B]
A['words'] = sorted(keep + new, key=lambda w: w['start'])
json.dump(A, open('_v3/olsup_asr.json','w',encoding='utf8'))
print('ventana', s, e, 'palabras nuevas', len(new), '·', ' '.join(w['word'] for w in B)[:200])
