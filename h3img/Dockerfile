# 3-nov-2026: vastai/comfy + pesos de MiniMax H3 ADENTRO (el pull de la imagen en Vast NO se factura como descarga;
# bajar los mismos 64 GB de Hugging Face al arrancar costaba US$0,33 por maquina). Pesos publicos, nada secreto.
# VARIANT=ref  -> Ref2VA (novelas, personaje fijo + voz)   VARIANT=full -> Ref2VA + FL2VA (t2v / primer cuadro)
FROM vastai/comfy:v0.43.0-cuda-13.2-py312
ARG VARIANT=ref
ENV HF_XET_HIGH_PERFORMANCE=1 HF_HUB_DISABLE_TELEMETRY=1
RUN PY=/venv/main/bin/python; [ -x "$PY" ] || PY=python; $PY -m pip install -q -U comfy-kitchen huggingface_hub hf_xet && echo "$PY" > /opt/h3py
COPY h3img/bajar.py /opt/bajar.py
# una capa por archivo grande (capas chicas = push y pull mas robustos)
RUN $(cat /opt/h3py) /opt/bajar.py chicos
RUN $(cat /opt/h3py) /opt/bajar.py te
RUN $(cat /opt/h3py) /opt/bajar.py ref
RUN if [ "$VARIANT" = "full" ]; then $(cat /opt/h3py) /opt/bajar.py fl; fi
RUN du -sh /opt/h3 && find /opt/h3 -name "*.safetensors" | sort && touch /opt/h3/HORNEADO_$VARIANT
COPY h3img/onstart_baked.sh /opt/onstart_baked.sh
RUN chmod +x /opt/onstart_baked.sh
