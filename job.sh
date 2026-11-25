set -e
S=$(cat SLUGS)
# 1) máscara de la persona por cuadro (RVM mobilenetv3, CPU)
pip install -q torch torchvision --index-url https://download.pytorch.org/whl/cpu 2>&1 | tail -1
for s in $S; do cp in/$s.mp4 public/$s.mp4; done
mkdir -p out
python3 matte.py $S
# 2) Remotion
npm ci --no-audit --no-fund || npm install --no-audit --no-fund
npx remotion browser ensure
for s in $S; do
  if [ "$(cat MODO)" = prueba ]; then
    npx remotion render src/index.ts $s out/seq_$s --sequence --every-nth-frame=12 --image-format=jpeg --scale=0.4 --concurrency=4 --log=info 2>&1 | tail -3 || true
    ffmpeg -v error -y -pattern_type glob -i "out/seq_$s/*.jpeg" -vf "tile=10x10" -q:v 4 out/hoja_$s.jpg; rm -rf out/seq_$s
  fi
  npx remotion render src/index.ts $s out/r_$s.mp4 --codec=h264 --crf=16 --scale=1.5 --concurrency=4 --log=info 2>&1 | tail -4
  ffmpeg -v error -y -i out/r_$s.mp4 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 160k -af loudnorm=I=-14:TP=-1.5 -movflags +faststart out/mega_$s.mp4
  ffmpeg -v error -y -i out/mega_$s.mp4 -vf scale=540:960 -c:v libx264 -preset medium -crf 30 -c:a aac -b:a 96k -movflags +faststart out/movilmega_$s.mp4
  ffprobe -v error -show_entries format=duration:stream=width,height -of csv=p=0 out/mega_$s.mp4
done
