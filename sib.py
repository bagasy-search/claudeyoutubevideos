import sys, numpy as np, soundfile as sf
from scipy.signal import stft
for f in sys.argv[1:]:
    x, sr = sf.read(f); fr, t, Z = stft(x, sr, nperseg=1024, noverlap=768); P = np.abs(Z)**2
    def band(a,b): return P[(fr>=a)&(fr<b)].sum(0)
    hf, mid = band(4500,10000), band(300,3500); tot = P.sum(0)+1e-12
    sib = (hf/tot) > 0.5   # cuadros sibilantes
    r = 10*np.log10((hf[sib].mean()+1e-12)/(mid[~sib].mean()+1e-12)) if sib.any() else 0
    # silbido = pico angosto: en cuadros sibilantes, cuanto concentra el bin máximo de 4.5-10k sobre la banda (tonalidad)
    sub = P[(fr>=4500)&(fr<10000)][:, sib]
    ton = float(np.median(sub.max(0)/(sub.sum(0)+1e-12))) if sib.any() else 0
    pk = float(np.median(fr[(fr>=4500)&(fr<10000)][sub.argmax(0)])) if sib.any() else 0
    print(f"{f}: cuadros_sib={sib.mean()*100:.1f}% HF_vs_voz={r:+.1f} dB tonalidad={ton:.3f} pico_med={pk:.0f}Hz")
