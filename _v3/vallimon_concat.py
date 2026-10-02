# concat local de los 120 chunks (artefactos del run) · audio con priming AAC fijo · verifica cuadros
import subprocess, os
D='D:/rtmp/vallimon_chunks'; OUT='D:/rtmp/vallimon_out'; TOTAL=21967; TRIM=0.043
os.makedirs(OUT, exist_ok=True)
seq=[f'{D}/chunk-{i}/chunk_{i}.mp4' for i in range(120)]
def frames(p): return int(subprocess.check_output(['ffprobe','-v','error','-select_streams','v','-count_packets','-show_entries','stream=nb_read_packets','-of','csv=p=0',p]).decode().strip().split(',')[0])
tot=0; vl=[]; al=[]
for k,p in enumerate(seq):
    n=frames(p); w=f'{OUT}/a_{k:03d}.wav'
    subprocess.check_call(['ffmpeg','-v','error','-y','-i',p,'-vn','-af',f'atrim=start={TRIM},asetpts=PTS-STARTPTS,apad,atrim=duration={n/30:.6f}','-ar','48000','-ac','2',w])
    vl.append(f"file '{p}'"); al.append(f"file '{w}'"); tot+=n
open(f'{OUT}/v.txt','w').write('\n'.join(vl)+'\n'); open(f'{OUT}/a.txt','w').write('\n'.join(al)+'\n')
subprocess.check_call(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',f'{OUT}/a.txt','-c','copy',f'{OUT}/audio.wav'])
subprocess.check_call(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',f'{OUT}/v.txt','-an','-c','copy',f'{OUT}/video.mp4'])
print(f'chunks {len(seq)} · cuadros {tot} (esperado {TOTAL}) {"OK" if tot==TOTAL else "DISTINTO"}')
