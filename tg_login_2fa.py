#!/usr/bin/env python3
"""tg_login_2fa.py <password> — completa el login cuando hay verificación en 2 pasos.

El código ya fue aceptado en el paso 2 (que se consume). Este paso SOLO manda la contraseña
de 2FA sobre la sesión ya iniciada.
    python3 tg_login_2fa.py "tu_password"
"""
import sys, os
from telethon.sync import TelegramClient
from tg_userbot import SESSION, load_creds

if len(sys.argv) < 2:
    print("uso: python3 tg_login_2fa.py <password>"); sys.exit(1)
pw = sys.argv[1]
api_id, api_hash = load_creds()
c = TelegramClient(SESSION, api_id, api_hash)
c.connect()
if c.is_user_authorized():
    me = c.get_me(); c.disconnect()
    print(f"YA_AUTORIZADO — {me.first_name or ''} (@{me.username or '—'})"); sys.exit(0)
c.sign_in(password=pw)
me = c.get_me()
c.disconnect()
for f in ("/tmp/tg_login_state.json",):
    try: os.remove(f)
    except OSError: pass
print(f"OK — logueado como {me.first_name or ''} (@{me.username or '—'}, id {me.id})")
