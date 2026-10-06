#!/usr/bin/env python3
"""tg_deliver_bot.py — entrega el video grande POR EL BOT a tu chat, sin límite de 50 MB.

Combina userbot + bot:
  1) el USERBOT (Telethon) sube el mp4 a un canal privado donde el bot es admin
     (creado 1 vez con tg_channel_setup.py) — streaming nativo hasta 2 GB.
  2) el BOT hace copyMessage de ese mensaje a TU chat → copia por referencia en los
     servidores de Telegram, el bot NO re-sube nada → esquiva el tope de 50 MB del bot.
El video aparece en el chat del BOT con vos (no en Mensajes guardados).

    python3 tg_deliver_bot.py --video final.mp4 --title "Yaguareté vuelve al Iberá"
    [--desc "..."] [--buttons]   # --buttons agrega ✅ Publicar / 🔄 Rehacer (hook)

Sale 3 si falta la sesión del userbot o el canal (correr tg_login / tg_channel_setup).
"""
import argparse
import json
import os
import sys
import urllib.parse
import urllib.request
from os.path import expanduser, exists, basename

from telethon.sync import TelegramClient
from telethon.tl.types import DocumentAttributeVideo

from tg_userbot import SESSION, load_creds
from tg_send import probe, make_thumb  # reuso ffprobe + miniatura


def load_bot():
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat = os.environ.get("TELEGRAM_CHAT_ID")
    f = os.environ.get("TELEGRAM_BOT_FILE", expanduser("~/.telegram_bot"))
    if (not token or not chat) and exists(f):
        for line in open(f, encoding="utf-8"):
            if "=" not in line:
                continue
            k, v = line.strip().split("=", 1)
            if k == "TELEGRAM_BOT_TOKEN" and not token:
                token = v
            if k == "TELEGRAM_CHAT_ID" and not chat:
                chat = v
    if not token or not chat:
        raise SystemExit("faltan TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID (~/.telegram_bot)")
    return token, chat


def load_channel():
    f = expanduser("~/.tg_delivery")
    if exists(f):
        for line in open(f, encoding="utf-8"):
            if line.startswith("TG_DELIVERY_CHANNEL="):
                return line.strip().split("=", 1)[1]
    return None


def bot_api(token, method, params):
    data = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(f"https://api.telegram.org/bot{token}/{method}", data=data)
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--title", default="Documental")
    ap.add_argument("--desc", default="")
    ap.add_argument("--buttons", action="store_true", help="agrega ✅ Publicar / 🔄 Rehacer (hook)")
    args = ap.parse_args()

    if not exists(args.video):
        print("no existe --video:", args.video); sys.exit(1)
    channel = load_channel()
    if not channel:
        print("✗ falta el canal de entrega — corré UNA vez:  python3 tg_channel_setup.py"); sys.exit(3)
    token, user_chat = load_bot()

    # ── 1) userbot sube el mp4 al canal ──
    api_id, api_hash = load_creds()
    client = TelegramClient(SESSION, api_id, api_hash)
    client.connect()
    if not client.is_user_authorized():
        client.disconnect()
        print("✗ userbot sin sesión — corré UNA vez:  python3 tg_login.py"); sys.exit(3)

    w, h, dur = probe(args.video)
    thumb = make_thumb(args.video)
    attrs = [DocumentAttributeVideo(duration=dur or 0, w=w or 0, h=h or 0, supports_streaming=True)] if w else None
    mb = os.path.getsize(args.video) / 1024 / 1024

    def prog(sent, total):
        print(f"\r  userbot→canal… {sent*100//total if total else 0:3d}%  ({sent/1024/1024:.1f}/{total/1024/1024:.1f} MB)", end="", flush=True)

    print(f"1) subiendo al canal {channel} · {basename(args.video)} ({mb:.1f} MB)")
    msg = client.send_file(int(channel), args.video, supports_streaming=True,
                           thumb=thumb, attributes=attrs, caption=args.title, progress_callback=prog)
    client.disconnect()
    print(f"\n   subido al canal (message_id {msg.id})")
    if thumb:
        try: os.remove(thumb)
        except OSError: pass

    # ── 2) el bot copia ese mensaje a TU chat (copyMessage = sin re-subir) ──
    caption = f"{args.title}\n🎬 Documental listo" + (f"\n{args.desc}" if args.desc else "")
    params = {"chat_id": user_chat, "from_chat_id": channel, "message_id": msg.id, "caption": caption}
    # HOOK botones inline (los sumamos de verdad cuando haya handler de callbacks):
    if args.buttons:
        params["reply_markup"] = json.dumps({"inline_keyboard": [[
            {"text": "✅ Publicar", "callback_data": f"publicar:{msg.id}"},
            {"text": "🔄 Rehacer", "callback_data": f"rehacer:{msg.id}"},
        ]]})
    print(f"2) bot copyMessage → chat {user_chat}")
    res = bot_api(token, "copyMessage", params)
    if not res.get("ok"):
        print("✗ copyMessage falló:", json.dumps(res)[:300]); sys.exit(1)
    print(f"✔ entregado por el BOT a tu chat (message_id {res['result']['message_id']}, sin límite de 50 MB)")


if __name__ == "__main__":
    main()
