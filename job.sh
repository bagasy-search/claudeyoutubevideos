set -e
get ck14a_s09.wav ck14a_s07.wav ck14a_sref.mp3
for f in ck14a_s09.wav ck14a_s07.wav ck14a_sref.mp3; do ffmpeg -v error -y -i $f -ac 1 -ar 44100 ${f%.*}_n.wav; done
python3 sib.py ck14a_s09_n.wav ck14a_s07_n.wav ck14a_sref_n.wav | tee out/sib.txt
put out/sib.txt
