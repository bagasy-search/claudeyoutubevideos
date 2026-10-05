#!/bin/bash
# brain_to_qwen.sh — CLONA el cerebro de Claude (memoria + skills + instrucciones) al formato de Qwen Code,
# para que un agente con Qwen trabaje en este repo sabiendo lo mismo que Claude.
#   bash scripts/brain_to_qwen.sh [origen=~/.claude] [destino=~/.qwen]
# Qué hace:
#   ~/.claude/skills/*      → ~/.qwen/skills/*        (mismo formato SKILL.md)
#   ~/.claude/memoria/*     → ~/.qwen/memoria/*       (MEMORY.md + un .md por tema)
#   ~/.claude/CLAUDE.md     → ~/.qwen/QWEN.md         (instrucciones globales, rutas reescritas)
#   <repo>/CLAUDE.md        → <repo>/QWEN.md          (instrucciones del proyecto)
# Es idempotente: correrlo de nuevo pisa la copia con lo último del cerebro. La fuente de verdad sigue
# siendo claude-brain (brain-sync); Qwen escribe memoria nueva en ~/.qwen/memoria y se sube igual.
set -e
SRC="${1:-$HOME/.claude}"; DST="${2:-$HOME/.qwen}"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$DST/skills" "$DST/memoria"
[ -d "$SRC/skills" ] && cp -r "$SRC/skills/." "$DST/skills/"
[ -d "$SRC/memoria" ] && cp -r "$SRC/memoria/." "$DST/memoria/"
reescribir() { sed -e "s#@~/#~/#g; s#~/.claude/memoria#~/.qwen/memoria#g; s#~/.claude/skills#~/.qwen/skills#g; s#\.claude/skills#.qwen/skills#g; s#CLAUDE\.md#QWEN.md#g"; }
{
  echo "# Instrucciones globales (clonadas del cerebro de Claude por scripts/brain_to_qwen.sh)"
  echo
  [ -f "$SRC/CLAUDE.md" ] && reescribir < "$SRC/CLAUDE.md"
  echo
  echo "## Memoria del creador"
  echo "El índice está abajo. Cada línea apunta a un archivo en ~/.qwen/memoria/: LEELO antes de actuar sobre ese tema."
  echo "Cuando aprendas algo nuevo que valga para próximas sesiones, escribilo en ~/.qwen/memoria/<tema>.md y agregá UNA línea al índice ~/.qwen/memoria/MEMORY.md."
  echo
  [ -f "$SRC/memoria/MEMORY.md" ] && reescribir < "$SRC/memoria/MEMORY.md"
  echo
  echo "## Skills"
  echo "Están en ~/.qwen/skills/<nombre>/SKILL.md. Antes de una tarea que una skill cubre (editar un video de un canal, generar b-roll, avatar, voz), leé su SKILL.md completo."
  for d in "$DST"/skills/*/; do n=$(basename "$d"); desc=$(grep -m1 '^description:' "$d/SKILL.md" 2>/dev/null | cut -c14-220); echo "- **$n**: $desc"; done
} > "$DST/QWEN.md"
[ -f "$REPO/CLAUDE.md" ] && reescribir < "$REPO/CLAUDE.md" > "$REPO/QWEN.md"
echo "brain_to_qwen OK → $DST (skills $(ls "$DST/skills" | wc -l) · memoria $(ls "$DST/memoria" | wc -l) archivos · QWEN.md $(wc -c < "$DST/QWEN.md") bytes) · $REPO/QWEN.md"
