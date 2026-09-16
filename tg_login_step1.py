#!/usr/bin/env python3
"""tg_login_step1.py <telefono> — pide el código a Telegram (paso 1 de 2, no interactivo).

Manda la solicitud de código al teléfono y guarda el phone_code_hash en /tmp para el paso 2.
    python3 tg_login_step1.py "+54911XXXXXXXX"
"""
import sys, json
from telethon.sync import TelegramClient
from tg_userbot import SESSION, load_creds

if len(sys.argv) < 2:
    print("uso: python3 tg_login_step1.py <telefono +intl>"); sys.exit(1)
phone = sys.argv[1].strip()
api_id, api_hash = load_creds()
c = TelegramClient(SESSION, api_id, api_hash)
c.connect()
if c.is_user_authorized():
    print("YA_AUTORIZADO"); c.disconnect(); sys.exit(0)
sent = c.send_code_request(phone)
json.dump({"phone": phone, "hash": sent.phone_code_hash}, open("/tmp/tg_login_state.json", "w"))
c.disconnect()
print("CODE_SENT — Telegram te mandó un código. Pasámelo para el paso 2.")
