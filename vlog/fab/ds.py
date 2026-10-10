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

# ── FAB_LLM=haiku: el MISMO equipo, pero cada empleado es Claude Haiku 5.5 vía `claude -p` (suscripción, sin API key) ──
HAIKU = os.environ.get("FAB_LLM") == "haiku"
HCWD = "D:/rtmp/fab/haiku_cwd"   # carpeta neutra: sin CLAUDE.md ni memoria del proyecto
def _haiku(system, user, pasada, imgs=None, intentos=4):
    import subprocess
    os.makedirs(HCWD, exist_ok=True)
    env = {k: v for k, v in os.environ.items() if not k.startswith(("ANTHROPIC_", "CLAUDE_CODE_SUBAGENT", "CLAUDE_CONFIG_DIR"))}
    cmd = ["claude", "-p", "--model", os.environ.get("FAB_HAIKU_MODEL", "haiku"), "--output-format", "json", "--no-session-persistence",
           "--strict-mcp-config", "--setting-sources", "", "--system-prompt", system or "You are a careful assistant."]
    if imgs:
        cmd += ["--tools", "Read", "--allowedTools", "Read", "--max-turns", str(len(imgs) + 3)]
        for d in sorted({os.path.dirname(os.path.abspath(p)) for p in imgs}): cmd += ["--add-dir", d]
        user = ("First open each of these image files with the Read tool, in this order:\n" + "\n".join(f"{i + 1}. {os.path.abspath(p)}" for i, p in enumerate(imgs))
                + "\n\nThen answer, without any other tool:\n" + user)
    else:
        cmd += ["--tools", "", "--max-turns", "1"]
    for k in range(intentos):
        r = subprocess.run(cmd, input=user, capture_output=True, text=True, encoding="utf-8", errors="replace", cwd=HCWD, env=env, timeout=900)
        try: d = json.loads(r.stdout)
        except Exception: d = {"is_error": True, "result": (r.stdout or r.stderr)[-300:]}
        if not d.get("is_error") and d.get("result"):
            p = D + "ds_gasto.json"; g = J(p, {}); x = g.setdefault("haiku_" + pasada, {"llamadas": 0, "usd": 0.0, "seg": 0})
            x["llamadas"] += 1; x["usd"] = round(x["usd"] + float(d.get("total_cost_usd") or 0), 5); x["seg"] = round(x["seg"] + d.get("duration_ms", 0) / 1000)
            W(p, g)
            return d["result"]
        if k == intentos - 1: raise SystemExit(f"⛔ {pasada}: Haiku falló: {str(d.get('result'))[:300]}")
        time.sleep(10 * (k + 1))

def _post(body, pasada, intentos=5):
    if HAIKU:
        msgs = body["messages"]; system = next((m["content"] for m in msgs if m["role"] == "system"), "")
        u = next(m for m in msgs if m["role"] == "user")["content"]
        if isinstance(u, list):   # visión: las imágenes llegan como data URI → se pasan por ruta (vision() guarda las rutas en body["_imgs"])
            txt = " ".join(c["text"] for c in u if c.get("type") == "text")
            return _haiku(system, txt, pasada, imgs=body.get("_imgs"))
        if body.get("response_format"): u += "\n\nReply with ONE valid JSON object only, no prose, no code fences."
        return _haiku(system, u, pasada)
    body.pop("_imgs", None)
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
    body = {"model": "deepseek-flash", "max_tokens": max_tokens, "temperature": 0, "messages": [{"role": "user", "content": content}], "_imgs": list(imgs)}
    if HAIKU: prompt += "\n\nReply with ONE valid JSON object only, no prose, no code fences."; content[-1]["text"] = prompt
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
