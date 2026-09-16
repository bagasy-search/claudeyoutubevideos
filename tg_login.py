#!/usr/bin/env python3
"""tg_login.py — LOGIN de una sola vez del userbot de Telegram (Telethon).

Corré ESTO A MANO en el terminal (es INTERACTIVO: pide tu teléfono + el código que
te llega por Telegram, y la 2FA si la tenés). Crea la sesión ~/.tg_docs.session que
después usa tg_send.py para mandar los videos SIN el límite de 50 MB.

    python3 tg_login.py

Se corre UNA vez. La sesión queda guardada; no hace falta repetir salvo que la borres
o Telegram cierre la sesión.
"""
from telethon.sync import TelegramClient
from tg_userbot import SESSION, load_creds

api_id, api_hash = load_creds()

print("Iniciando login del userbot (Telethon)…")
print("Te va a pedir el TELÉFONO (formato internacional, ej +54911…) y el CÓDIGO.\n")

with TelegramClient(SESSION, api_id, api_hash) as client:
    me = client.get_me()
    print(f"\n✔ Sesión creada OK → {SESSION}.session")
    print(f"  Logueado como: {me.first_name or ''} (@{me.username or '—'}, id {me.id})")
    print("  Ya podés mandar videos con tg_send.py (o el pipeline lo hace solo).")
