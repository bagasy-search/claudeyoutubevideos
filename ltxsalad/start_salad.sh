#!/bin/bash
# sólo Gemma se baja al arrancar (24 GB); el resto ya está en la imagen. Agente en "::" (gateway de Salad = IPv6).
mkdir -p /w/ltx-2.5
( cd /opt/ltx && T=$(date +%s) && uv run --no-sync python -c "from huggingface_hub import hf_hub_download as h; h('comfyicu/LTX-2.5','text_encoders/gemma4-12b-with-proj-ltx-2.5-bf16.safetensors',local_dir='/w/ltx-2.5'); print('WEIGHTS_DONE')" > /w/dl.log 2>&1 && echo "WEIGHTS_SECS $(( $(date +%s)-T ))" >> /w/dl.log && touch /w/WEIGHTS_OK ) &
exec python -c 'import socket, http.server as h; h.ThreadingHTTPServer.address_family = socket.AF_INET6; exec(open("/agent.py").read().replace("\"0.0.0.0\"", "\"::\""))'
