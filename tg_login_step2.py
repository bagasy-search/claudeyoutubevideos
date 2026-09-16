#!/usr/bin/env python3
"""tg_login_step2.py <codigo> [password_2fa] — completa el login (paso 2 de 2, no interactivo).

Usa el phone_code_hash guardado por el paso 1. Si tenés verificación en dos pasos y no pasás
la contraseña, sale con código 4 (NEED_2FA_PASSWORD) para que la mandes.
    python3 tg_login_step2.py 12345 [tu_password]
"""
import sys, json, os
from telethon.sync import TelegramClient
from telethon.errors import SessionPasswordNeededError
from tg_userbot import SESSION, load_creds

if len(sys.argv) < 2:
    print("uso: python3 tg_login_step2.py <codigo> [password_2fa]"); sys.exit(1)
code = sys.argv[1].strip()
pw = sys.argv[2] if len(sys.argv) > 2 else None
st = json.load(open("/tmp/tg_login_state.json"))
api_id, api_hash = load_creds()
c = TelegramClient(SESSION, api_id, api_hash)
c.connect()
try:
    c.sign_in(phone=st["phone"], code=code, phone_code_hash=st["hash"])
except SessionPasswordNeededError:
    if not pw:
        print("NEED_2FA_PASSWORD — tenés verificación en 2 pasos; pasame la contraseña.")
        c.disconnect(); sys.exit(4)
    c.sign_in(password=pw)
me = c.get_me()
c.disconnect()
try:
    os.remove("/tmp/tg_login_state.json")
except OSError:
    pass
print(f"OK — logueado como {me.first_name or ''} (@{me.username or '—'}, id {me.id})")
