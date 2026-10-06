#!/usr/bin/env python3
"""tg_userbot.py — helpers compartidos del USERBOT de Telegram (Telethon).

Un userbot (tu cuenta, no un bot) sube archivos hasta 2 GB con streaming nativo,
sin el tope de 50 MB de la Bot API. La sesión se crea UNA vez con tg_login.py.

Credenciales (NUNCA en git): env TG_API_ID / TG_API_HASH, o el archivo ~/.tg_userbot
(KEY=VALUE por línea). Sesión persistida en ~/.tg_docs.session.
"""
import os
from os.path import expanduser, exists

SESSION = expanduser("~/.tg_docs")  # → ~/.tg_docs.session


def load_creds():
    api_id = os.environ.get("TG_API_ID")
    api_hash = os.environ.get("TG_API_HASH")
    cfg = os.environ.get("TG_USERBOT_FILE", expanduser("~/.tg_userbot"))
    if (not api_id or not api_hash) and exists(cfg):
        for line in open(cfg, encoding="utf-8"):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            k, v = k.strip(), v.strip()
            if k == "TG_API_ID" and not api_id:
                api_id = v
            if k == "TG_API_HASH" and not api_hash:
                api_hash = v
    if not api_id or not api_hash:
        raise SystemExit("faltan TG_API_ID / TG_API_HASH (env o ~/.tg_userbot)")
    return int(api_id), api_hash
