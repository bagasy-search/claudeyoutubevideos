set -e
pip install -q torch torchvision --index-url https://download.pytorch.org/whl/cpu 2>&1 | tail -1
pip install -q opencv-python-headless numpy 2>&1 | tail -1
MODO=sam2
pip install -q "git+https://github.com/facebookresearch/sam2.git" 2>&1 | tail -2 || MODO=clasico
for U in https://dl.fbaipublicfiles.com/segment_anything_2/092824/sam2.1_hiera_small.pt https://huggingface.co/facebook/sam2.1-hiera-small/resolve/main/sam2.1_hiera_small.pt; do
  curl -fL --retry 3 --max-time 400 -sS -o sam2.1_hiera_small.pt "$U" && [ $(stat -c %s sam2.1_hiera_small.pt) -gt 50000000 ] && break || echo "fallo $U"
done
ls -la sam2.1_hiera_small.pt || MODO=clasico
[ -f sam2.1_hiera_small.pt ] && [ $(stat -c %s sam2.1_hiera_small.pt) -gt 50000000 ] || MODO=clasico
echo "modo $MODO"
C="s5 s6_ig s6_yt r7_ig r7_yt"
for c in $C; do get $c.mp4; done
python bolsa.py $MODO
for c in $C; do put out/b_$c.mp4; done
cd out && ffmpeg -v error -y -pattern_type glob -i 'chkb_*.jpg' -vf "scale=368:320,tile=5x1" -frames:v 1 chk_bolsa.jpg && put chk_bolsa.jpg
