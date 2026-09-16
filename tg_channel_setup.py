#!/usr/bin/env python3
"""tg_channel_setup.py — crea (1 vez) el canal privado de entrega y agrega al bot como admin.

El userbot crea un canal privado "Docs Automáticos"; agrega a docs_automaticos_bot como admin
(los bots solo entran a canales como admin). Guarda el id del canal (formato Bot API -100…) en
~/.tg_delivery para que tg_deliver_bot.py lo reuse. Idempotente: si ya hay canal guardado y sigue
existiendo, no crea otro.

    python3 tg_channel_setup.py
"""
import os
from os.path import expanduser, exists
from telethon.sync import TelegramClient
from telethon.tl.functions.channels import CreateChannelRequest, EditAdminRequest
from telethon.tl.types import ChatAdminRights
from tg_userbot import SESSION, load_creds

BOT_USERNAME = os.environ.get("TG_BOT_USERNAME", "docs_automaticos_bot")
DELIVERY_FILE = expanduser("~/.tg_delivery")


def read_saved():
    if exists(DELIVERY_FILE):
        for line in open(DELIVERY_FILE, encoding="utf-8"):
            if line.startswith("TG_DELIVERY_CHANNEL="):
                return line.strip().split("=", 1)[1]
    return None


def save(channel_botapi_id):
    with open(DELIVERY_FILE, "w", encoding="utf-8") as f:
        f.write(f"TG_DELIVERY_CHANNEL={channel_botapi_id}\n")
    os.chmod(DELIVERY_FILE, 0o600)


api_id, api_hash = load_creds()
c = TelegramClient(SESSION, api_id, api_hash)
c.connect()
if not c.is_user_authorized():
    raise SystemExit("sesión sin autorizar — corré tg_login primero")

saved = read_saved()
if saved:
    try:
        ent = c.get_entity(int(saved))
        print(f"YA_EXISTE — canal de entrega {saved} ({getattr(ent,'title','?')}) · bot admin listo")
        c.disconnect()
        raise SystemExit(0)
    except SystemExit:
        raise
    except Exception:
        print("(el canal guardado no resuelve; creo uno nuevo)")

# 1) crear canal privado (broadcast, no megagrupo)
res = c(CreateChannelRequest(title="Docs Automáticos", about="Entrega automática de videos renderizados", megagroup=False))
channel = res.chats[0]
botapi_id = int(f"-100{channel.id}")
print(f"canal creado: id {channel.id} → Bot API {botapi_id}")

# 2) agregar al bot como admin (única forma de meter un bot a un canal)
bot = c.get_entity(BOT_USERNAME)
rights = ChatAdminRights(post_messages=True, edit_messages=True, delete_messages=True,
                         invite_users=True, pin_messages=True, manage_call=False,
                         change_info=False, add_admins=False)
c(EditAdminRequest(channel, bot, rights, rank="deliverer"))
print(f"bot @{BOT_USERNAME} agregado como admin del canal")

save(botapi_id)
c.disconnect()
print(f"OK — guardado en {DELIVERY_FILE} (TG_DELIVERY_CHANNEL={botapi_id})")
