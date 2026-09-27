# Mezcla final del audio, capa por capa (todo medido, nada a ojo):
#   voz global (máster + vecino + foley del gancho) → foley real de los planos detalle (bajo la voz) → SFX del montaje
#   (whoosh en cortes, impactos, pops, riser) → cama musical desde el seg ~6 a −22 dB bajo la voz → loudnorm −14 LUFS.
# Salidas: public/tfbtanque.wav (MÁSTER de entrega, lo usa el stitch del farm) + public/tfbtanque.m4a (lo usa Remotion).
# ⛔ La voz Fish original queda en out/tfbtanque/master.wav y la voz global en out/tfbtanque/voz_global.wav.
# uso: python vlog/tfbtanque/mezcla.py
import json, os, subprocess, numpy as np, soundfile as sf
R = 'D:/Proyectos/video2-wt/tfbtanque/'
SR = 48000; FPS = 30
G = json.load(open(R + 'vlog/tfbtanque/global.json', encoding='utf8'))
SFX = json.load(open(R + 'vlog/tfbtanque/sfx.json', encoding='utf8'))
CF = 0x08000000
def dec(f, ss=0.0, t=None):
    a = ['ffmpeg', '-v', 'error', '-ss', f'{ss:.3f}', '-i', f] + (['-t', f'{t:.3f}'] if t else []) + ['-vn', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    b = subprocess.run(a, capture_output=True, creationflags=CF).stdout; return np.frombuffer(b, dtype='float32').copy()
rms = lambda x: float(np.sqrt(np.mean(x ** 2) + 1e-12))
db = lambda v: 10 ** (v / 20)
voz = dec(R + 'out/tfbtanque/voz_global.wav'); N = int(round(G['frames'] / FPS * SR)); voz = np.pad(voz, (0, max(0, N - len(voz))))[:N]
vr = rms(voz[voz ** 2 > (0.02 ** 2)]) if np.any(np.abs(voz) > 0.02) else 0.1
mix = voz.copy()
def put(x, t, g):
    i = int(round(t * SR)); j = min(N, i + len(x))
    if i < N and j > i: mix[i:j] += x[:j - i] * g
# 1) foley de los detalles (lo que suena de verdad en la acción), bajo la voz; con fundidos de 60 ms
nf = 0
for c in G['clips']:
    if not c.get('detail') or c.get('own'): continue
    f = c['dir'] + c['file']; x = dec(f, 0, c['vdur'] * (c.get('slow') or 1))
    if not len(x) or rms(x) < 1e-4: continue
    if c.get('slow'):  # el video va en cámara lenta: estirar el foley igual (sin cambiar tono no importa: es ruido de acción)
        x = np.interp(np.linspace(0, len(x) - 1, int(len(x) / c['slow'])), np.arange(len(x)), x).astype('float32')
    x = x / rms(x) * vr * db(-14)
    k = int(0.06 * SR); x[:k] *= np.linspace(0, 1, k); x[-k:] *= np.linspace(1, 0, k)
    put(x, c['gvstart'], 1.0); nf += 1
# 2) SFX del montaje
ns = 0; cache = {}
for s in SFX:
    p = R + 'public/' + s['src']
    if p not in cache: cache[p] = dec(p)
    x = cache[p]
    if not len(x): continue
    x = x / (np.max(np.abs(x)) + 1e-9) * vr * 3.0 * db(s.get('db', -8))
    put(x, s['t'], 1.0); ns += 1
# 3) cama musical en loop con fundidos cruzados, desde MUSIC_IN, a −22 dB (RMS) bajo la voz; se baja en la lámina
MUSIC_IN = 6.0
m = dec(R + 'public/sfx/music_federer.mp3'); m = m / rms(m) * vr * db(-22)
xf = int(2.0 * SR); bed = np.zeros(N, dtype='float32'); i = int(MUSIC_IN * SR)
while i < N:
    seg = m.copy(); seg[:xf] *= np.linspace(0, 1, xf); seg[-xf:] *= np.linspace(1, 0, xf)
    j = min(N, i + len(seg)); bed[i:j] += seg[:j - i]; i += len(seg) - xf
fi = int(1.5 * SR); bed[int(MUSIC_IN * SR):int(MUSIC_IN * SR) + fi] *= np.linspace(0, 1, fi)
for sg in G['segs']:
    if sg['type'] == 'lamina':  # la lámina se explica con la cama más baja (−4 dB) para que la voz mande
        a, b = int(sg['f0'] / FPS * SR), int((sg['f0'] + sg['nf']) / FPS * SR); bed[a:b] *= db(-4)
fo = int(4 * SR); bed[-fo:] *= np.linspace(1, 0, fo)
mix += bed
peak = float(np.max(np.abs(mix))); mix = mix / max(1.0, peak / 0.97)
tmp = R + 'out/tfbtanque/_mix_raw.wav'; sf.write(tmp, np.stack([mix, mix], 1), SR, subtype='FLOAT')
# loudnorm 2 pasadas a −14 LUFS, TP −1
st = subprocess.run(['ffmpeg', '-hide_banner', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True, creationflags=CF).stderr
j = json.loads(st[st.rindex('{'):st.rindex('}') + 1])
af = f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', af, '-ar', str(SR), '-c:a', 'pcm_s16le', R + 'public/tfbtanque.wav'], check=True, creationflags=CF)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', R + 'public/tfbtanque.wav', '-c:a', 'aac', '-b:a', '192k', R + 'public/tfbtanque.m4a'], check=True, creationflags=CF)
d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', R + 'public/tfbtanque.wav'], capture_output=True, text=True, creationflags=CF).stdout)
sil = subprocess.run(['ffmpeg', '-hide_banner', '-t', '60', '-i', R + 'public/tfbtanque.wav', '-af', 'silencedetect=noise=-32dB:d=0.3', '-f', 'null', '-'], capture_output=True, text=True, creationflags=CF).stderr.count('silence_start')
print(f'mezcla OK · {d:.2f}s (video {G["frames"] / FPS:.2f}s) · foley {nf} planos · sfx {ns} · entrada LUFS {j["input_i"]} → −14 · silencios en el min 1 (−32 dB, 0,3 s): {sil}')
