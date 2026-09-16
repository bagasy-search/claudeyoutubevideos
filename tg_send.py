#!/usr/bin/env python3
"""tg_send.py — envía el mp4 final por el USERBOT (Telethon) a "Mensajes guardados".

Usa la sesión ya creada por tg_login.py (~/.tg_docs.session). Sube con streaming
NATIVO hasta 2 GB → NO tiene el límite de 50 MB de la Bot API. Manda a Saved Messages
('me') por defecto, con un caption (título + descripción) y el video reproducible inline.

Uso:
    python3 tg_send.py --video D:/videosdeclaude/pruebafauna.mp4 \
        --title "Yaguareté vuelve al Iberá" \
        --desc "Documental de prueba · Planeta Reconstruido" \
        [--to me] [--thumb path.jpg]

Sale con código:
    0 = enviado
    3 = falta la sesión (correr tg_login.py una vez)
    1 = otro error
"""
import argparse
import os
import subprocess
import sys
import tempfile
from os.path import exists, expanduser, basename

from telethon.sync import TelegramClient
from telethon.tl.types import DocumentAttributeVideo

from tg_userbot import SESSION, load_creds


def probe(video):
    try:
        out = subprocess.check_output(
            ["ffprobe", "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height:format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", video],
            text=True).split()
        w, h, dur = int(out[0]), int(out[1]), int(float(out[2]))
        return w, h, dur
    except Exception:
        return None, None, None


def make_thumb(video):
    fd, out = tempfile.mkstemp(suffix=".jpg", prefix="tg_thumb_")
    os.close(fd)
    try:
        subprocess.run(["ffmpeg", "-y", "-ss", "1", "-i", video, "-frames:v", "1",
                        "-vf", "scale=640:-1", out],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return out if exists(out) and os.path.getsize(out) > 0 else None
    except Exception:
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--title", default="Video")
    ap.add_argument("--desc", default="")
    ap.add_argument("--to", default="me", help="destino (default 'me' = Mensajes guardados)")
    ap.add_argument("--thumb", default=None)
    args = ap.parse_args()

    if not exists(args.video):
        print("no existe --video:", args.video); sys.exit(1)

    api_id, api_hash = load_creds()
    mb = os.path.getsize(args.video) / 1024 / 1024
    caption = f"🎬 {args.title}" + (f"\n{args.desc}" if args.desc else "")
    w, h, dur = probe(args.video)
    thumb = args.thumb if (args.thumb and exists(args.thumb)) else make_thumb(args.video)
    attrs = [DocumentAttributeVideo(duration=dur or 0, w=w or 0, h=h or 0,
                                    supports_streaming=True)] if w else None

    def prog(sent, total):
        pct = sent * 100 // total if total else 0
        print(f"\r  subiendo… {pct:3d}%  ({sent/1024/1024:.1f}/{total/1024/1024:.1f} MB)", end="", flush=True)

    # Conexión MANUAL (no el `with` sync, que dispararía un login interactivo si no está
    # autorizado). Si la sesión no está logueada → salimos limpio con 3, sin colgar.
    client = TelegramClient(SESSION, api_id, api_hash)
    client.connect()
    if not client.is_user_authorized():
        client.disconnect()
        print(f"✗ sesión sin autorizar — corré UNA vez a mano:  python3 tg_login.py")
        sys.exit(3)
    print(f"userbot → {args.to} · {basename(args.video)} ({mb:.1f} MB, {w or '?'}x{h or '?'}, {dur or '?'}s)")
    try:
        client.send_file(args.to, args.video, caption=caption,
                         supports_streaming=True, thumb=thumb, attributes=attrs,
                         progress_callback=prog)
    finally:
        client.disconnect()
    print()
    if thumb and not args.thumb:
        try: os.remove(thumb)
        except OSError: pass
    print("✔ enviado por userbot (streaming nativo, sin límite de 50 MB)")


if __name__ == "__main__":
    main()
