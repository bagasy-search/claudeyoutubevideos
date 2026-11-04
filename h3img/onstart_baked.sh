#!/bin/bash
# Onstart de la imagen horneada: enlaza /opt/h3 dentro de ComfyUI/models y levanta ComfyUI en 8288. CERO descarga.
mkdir -p /workspace; exec > >(tee -a /workspace/setup2.log) 2>&1
( sleep $(( ${AUTODESTRUIR_MIN:-60} * 60 )); curl -s -X DELETE -H "Authorization: Bearer $CONTAINER_API_KEY" "https://console.vast.ai/api/v0/instances/$CONTAINER_ID/" ) >/workspace/autodestruir.log 2>&1 &
PY=$(cat /opt/h3py 2>/dev/null || echo python)
C=/workspace/ComfyUI; [ -d "$C" ] || C=/opt/workspace-internal/ComfyUI; [ -d "$C" ] || C=$(dirname $(find / -name main.py -path "*ComfyUI/main.py" 2>/dev/null | head -1))
cd "$C"; for f in $(cd /opt/h3 && find . -name "*.safetensors" -o -name "*.pth"); do mkdir -p "models/$(dirname $f)"; ln -sf "/opt/h3/$f" "models/$f"; done
ls -la models/diffusion_models models/text_encoders | head; echo "MODELOS_OK 0s"
nohup $PY main.py --listen 0.0.0.0 --port 8288 > /workspace/comfy.log 2>&1 &
echo SETUP_DONE
