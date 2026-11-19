import subprocess, os, re
S = os.environ['S']; f = f'out/{S}_mix.wav'
d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
low = []
for t in range(0, int(d), 60):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-ss', str(t), '-t', '60', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    low.append((t, float(re.search(r'mean_volume: (-?[\d.]+)', e).group(1))))
w = min(low, key=lambda x: x[1])
print('dur', round(d, 2), '· mean_volume minimo por 60 s', w[1], 'dB en', w[0], 's')
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'silencedetect=n=-50dB:d=1.5', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('silencios >1,5 s bajo -50 dB:', len(re.findall('silence_start', e)))
