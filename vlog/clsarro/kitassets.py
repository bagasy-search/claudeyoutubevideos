# Banco del kit del sarro: camas = stock real del video (bd_*), lista de assets del farm. python vlog/clsarro/kitassets.py
import json, glob, subprocess, re, os
os.chdir(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
beds = sorted(glob.glob('public/broll/clsarro_st/bd_*.mp4'))[:8]
def nf(f):
    o = subprocess.run(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout
    return int(re.search(r'\d+', o).group())
B = [f.replace(os.sep, '/').replace('public/', '') + '#' + str(nf(f)) for f in beds]
open('src/clkitsarro_beds.ts', 'w').write('export const BEDS: string[] = ' + json.dumps(B) + ';\n')
I = 'img/clsarro/'
assets = [b.split('#')[0] for b in B] + [I + x for x in ['b_hotelbath.jpg', 'b_hotelbath2.jpg', 'b_counter.jpg', 'b_tilewall.jpg', 'b_desk.jpg', 'th_clborde.jpg', 'th_cllavadora.jpg', 'b_ringdirty.jpg', 'b_ringclean_ab.jpg']]
missing = [a for a in assets if not os.path.exists('public/' + a)]
open('_clkitsarro_assets.txt', 'w').write('\n'.join(assets) + '\n')
print(len(assets), 'faltan', missing)
