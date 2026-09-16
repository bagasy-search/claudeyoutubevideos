#!/usr/bin/env bash
# tg_bridge_run.sh — corre el puente Telegram↔Claude 24/7 con auto-reinicio + wake-lock.
# Uso:  nohup bash tg_bridge_run.sh >/dev/null 2>&1 &   (queda corriendo aunque cierres)
#   log:  ~/.tg_bridge.log     ·   parar:  pkill -f tg_claude_bridge.py
cd "$(dirname "$0")" || exit 1
export PATH="$HOME/.local/bin:$PATH"

# wake-lock (best-effort: solo si estás en Termux con termux-api)
termux-wake-lock 2>/dev/null || true

LOG="$HOME/.tg_bridge.log"
echo "=== $(date) supervisor arriba ===" >> "$LOG"
while true; do
  python3 tg_claude_bridge.py >> "$LOG" 2>&1
  echo "=== $(date) el puente cayó (exit $?) — reinicio en 3s ===" >> "$LOG"
  sleep 3
done
