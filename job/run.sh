cd "$(dirname "$0")"; mkdir -p raw out
tar xf in/veo_raw.tar -C raw
python3 post.py
