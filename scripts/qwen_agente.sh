#!/bin/bash
# qwen_agente.sh — le da una tarea ABIERTA (componente nuevo, estilo de canal, arreglar algo) al agente
# Qwen Code con la memoria clonada de Claude. Corre solo, con topes, y deja la sesión guardada.
#   bash scripts/qwen_agente.sh "<tarea en castellano>" [--razonar] [--max 45m]
# Sin --razonar usa qwen3.8-max SIN razonamiento (medido 05-oct: 7× más barato, casi igual).
# Clave: LLM_KEY o AIHUBMIX_KEY del .env (AIHubMix). Nunca la imprime.
set -e
REPO="$(cd "$(dirname "$0")/.." && pwd)"
TAREA="$1"; shift || true
[ -z "$TAREA" ] && { echo "uso: qwen_agente.sh \"<tarea>\" [--razonar] [--max 45m]"; exit 2; }
RAZ=0; MAX=45m
while [ $# -gt 0 ]; do case "$1" in --razonar) RAZ=1;; --max) MAX="$2"; shift;; esac; shift; done
set -a; [ -f "$REPO/.env" ] && . "$REPO/.env"; set +a
KEY="${LLM_KEY:-$AIHUBMIX_KEY}"; [ -z "$KEY" ] && { echo "falta LLM_KEY/AIHUBMIX_KEY en .env"; exit 2; }
command -v qwen >/dev/null || npm install -g @qwen-code/qwen-code >/dev/null
[ -f "$HOME/.qwen/QWEN.md" ] || bash "$REPO/scripts/brain_to_qwen.sh" >/dev/null
OUT="$REPO/_work/qwen_sesiones"; mkdir -p "$OUT"; F="$OUT/$(date +%Y%m%d_%H%M%S).json"
EXTRA=""; [ "$RAZ" = 0 ] && EXTRA="Trabajá directo, sin razonamientos largos."
cd "$REPO"
OPENAI_API_KEY="$KEY" OPENAI_BASE_URL="${LLM_BASE:-https://aihubmix.com/v1}" OPENAI_MODEL="${LLM_MODEL:-qwen3.8-max}" QWEN_CODE_SUPPRESS_YOLO_WARNING=1 \
  qwen --auth-type openai --approval-mode yolo --max-wall-time "$MAX" --max-tool-calls 250 -o json \
  --append-system-prompt "Nunca hagas git push ni gastes en APIs pagas (OpenAI, RunPod) sin que la tarea lo pida. $EXTRA" "$TAREA" > "$F" 2>"$F.err" || true
node -e '
const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
const res = (Array.isArray(r) ? r : [r]).find((x) => x.type === "result") || {};
const u = res.usage || {}; const usd = ((u.input_tokens || 0) * 1.65 + (u.output_tokens || 0) * 4.95) / 1e6;
console.log(`qwen_agente: ${res.subtype || "?"} · ${((res.duration_ms || 0) / 60000).toFixed(1)} min · ${res.num_turns || 0} turnos · ${u.input_tokens || 0} in / ${u.output_tokens || 0} out · ≈US$ ${usd.toFixed(3)}`);
console.log(String(res.result || "").slice(0, 3000));
' "$F" || tail -c 2000 "$F.err"
echo "sesión guardada: $F"
