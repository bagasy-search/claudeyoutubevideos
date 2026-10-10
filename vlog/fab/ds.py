# -*- coding: utf-8 -*-
# Llamadas DIRECTAS a DeepSeek (sin Claude Code de por medio): cada "empleado" de la fábrica es una llamada con un trabajo chico.
#   ds.json_call(system, user, model) → dict          (texto → JSON)
#   ds.vision(prompt, [imagenes]) → dict              (DeepSeek Flash ve imágenes: medido 9-oct, igual que agnes-3.0 y sin saturación)
# El gasto se acumula en vlog/<slug>/ds_gasto.json (tokens) para poder medir cada pasada.
import base64, json, os, re, time, urllib.request
from comun import R, D, J, W
KEY = next((l.split("=", 1)[1].strip().strip('"\'') for l in open("C:/Users/bauti/Downloads/video2/.env", encoding="utf8") if l.startswith("DEEPSEEK_API_KEY=")), "")
URL = "https://api.deepseek.com/chat/completions"
PRE = {"deepseek-flash": (0.30, 0.006, 1.20), "deepseek-v4-pro": (1.32, 0.044, 3.96)}   # miss, hit, out por 1M (pico)

def _gasto(pasada, model, u):
    p = D + "ds_gasto.json"; g = J(p, {})
    miss, hit, out = PRE.get(model, PRE["deepseek-flash"])
    c = (u.get("prompt_cache_miss_tokens", u.get("prompt_tokens", 0)) * miss + u.get("prompt_cache_hit_tokens", 0) * hit + u.get("completion_tokens", 0) * out) / 1e6
    x = g.setdefault(pasada, {"llamadas": 0, "usd": 0.0}); x["llamadas"] += 1; x["usd"] = round(x["usd"] + c, 5)
    W(p, g)

def _post(body, pasada, intentos=5):
    for k in range(intentos):
        try:
            r = urllib.request.Request(URL, json.dumps(body).encode(), {"Authorization": "Bearer " + KEY, "Content-Type": "application/json"})
            d = json.loads(urllib.request.urlopen(r, timeout=300).read().decode())
            _gasto(pasada, body["model"], d.get("usage", {}))
            return d["choices"][0]["message"]["content"] or ""
        except Exception as e:
            if k == intentos - 1: raise
            time.sleep(5 * (k + 1))

def _json(txt):
    m = re.search(r"```(?:json)?\s*([\s\S]*?)```", txt)
    s = m.group(1) if m else txt[txt.find("{") if "{" in txt else 0:]
    if s.lstrip().startswith("[") or ("[" in s and s.find("[") < s.find("{")): s = s[s.find("["):s.rfind("]") + 1]
    else: s = s[s.find("{"):s.rfind("}") + 1]
    return json.loads(s)

def json_call(system, user, pasada, model="deepseek-flash", max_tokens=16000):
    for k in range(3):
        txt = _post({"model": model, "max_tokens": max_tokens, "temperature": 0.7, "response_format": {"type": "json_object"}, "thinking": {"type": "disabled"},
                     "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}]}, pasada)
        try: return _json(txt)
        except Exception:
            open(D + f"ds_mal_{pasada}.txt", "w", encoding="utf8").write(txt)
            if k == 2: raise SystemExit(f"⛔ {pasada}: DeepSeek no devolvió JSON válido (ver vlog/<slug>/ds_mal_{pasada}.txt)")

def _uri(p):
    ext = "jpeg" if p.lower().endswith((".jpg", ".jpeg")) else "png"
    return f"data:image/{ext};base64," + base64.b64encode(open(p, "rb").read()).decode()

def vision(prompt, imgs, pasada, max_tokens=3000, pensar=False):
    """sin razonamiento por defecto: la imagen cuesta ~800 tokens y el razonamiento ~1500 (50x más caro) y para errores grandes acierta igual"""
    content = [{"type": "image_url", "image_url": {"url": _uri(p)}} for p in imgs] + [{"type": "text", "text": prompt}]
    body = {"model": "deepseek-flash", "max_tokens": max_tokens, "temperature": 0, "messages": [{"role": "user", "content": content}]}
    if not pensar: body["thinking"] = {"type": "disabled"}
    txt = _post(body, pasada)
    try: return _json(txt)
    except Exception: return {"_error": txt[:300]}

def grilla(fotos, salida, cols=3, w=640, h=360, etiquetas=None):
    """hoja numerada (1..n) para que el revisor juzgue 9 fotos en UNA llamada"""
    from PIL import Image, ImageDraw, ImageFont
    rows = (len(fotos) + cols - 1) // cols; S = Image.new("RGB", (cols * w, rows * h), "black")
    try: f = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 44)
    except Exception: f = ImageFont.load_default()
    for i, p in enumerate(fotos):
        im = Image.open(p).convert("RGB").resize((w, h)); d = ImageDraw.Draw(im)
        d.text((12, 6), str((etiquetas or list(range(1, len(fotos) + 1)))[i]), font=f, fill="yellow", stroke_width=4, stroke_fill="black")
        S.paste(im, ((i % cols) * w, (i // cols) * h))
    S.save(salida, quality=85)
    return salida

def text_call(system, user, pasada, model="deepseek-flash", max_tokens=32000, pensar=True):
    body = {"model": model, "max_tokens": max_tokens, "temperature": 0.8,
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}]}
    if not pensar: body["thinking"] = {"type": "disabled"}
    return _post(body, pasada)
