#!/usr/bin/env python3
"""tg_claude_bridge.py — puente Telegram ↔ Claude Code (daemon 24/7).

Escucha los mensajes que le llegan al bot (long-polling getUpdates), se los pasa a Claude
manteniendo el contexto por chat (sesión de Claude Code que se resume), y devuelve la
respuesta por el bot con tono de amigo. Corre en el dir del pipeline → Claude tiene la
memoria + skills + puede ejecutar tareas reales (hacer un video, investigar, entregar).

Creds del bot: ~/.telegram_bot (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID). Solo atiende al
chat autorizado. Estado (offset + sesión por chat) en ~/.tg_bridge_state.json.

    python3 tg_claude_bridge.py         # (mejor vía tg_bridge_run.sh, que auto-reinicia)
"""
import json
import os
import re
import subprocess
import sys
import threading
import time
import urllib.parse
import urllib.request
from os.path import expanduser, exists

STATE_FILE = expanduser("~/.tg_bridge_state.json")
WORKDIR = os.path.dirname(os.path.abspath(__file__))          # ~/video2: contexto FULL (memoria+skills)
CHAT_DIR = os.environ.get("BRIDGE_CHAT_DIR", expanduser("~/.tg_chat"))  # contexto LIVIANO para charla
CLAUDE = os.environ.get("CLAUDE_BIN", "claude")
NODE = os.environ.get("NODE_BIN", "node")
TASK_TIMEOUT = int(os.environ.get("BRIDGE_TIMEOUT", "3600"))  # tareas largas (render, etc.)
RESEARCH_TIMEOUT = int(os.environ.get("RESEARCH_TIMEOUT", "700"))

# ── triggers del GRUPO (coordinación Investigador ↔ Productor) ──
RESEARCH_RE = re.compile(r"(pr[oó]ximo\s+(video|tema)|investig\w+|research|busc\w+\s+tema)", re.I)
PRODUCE_RE = re.compile(r"(hac[eé]\s+(ese|el|lo)\b|hacelo|dale\s+con|produc[ií]\w*|arranc\w+\s+ese|dale\s+ese)", re.I)
CRON_ON_RE = re.compile(r"cron\b.*(on|prend|activ)", re.I)
CRON_OFF_RE = re.compile(r"cron\b.*(off|apag|desactiv)", re.I)
SNOW_RE = re.compile(r"(snowball|bola de nieve|descubr[ií]\w*\s+canal)", re.I)
CRON_HOUR = int(os.environ.get("CRON_HOUR", "13"))   # hora local del disparo diario
WORK_LOCK = threading.Lock()                          # serializa TODO el trabajo (poller + cron) → 1 cerebro secuencial

# ── Ruteo de modelo: charla casual = Haiku (barato ~$0.03/msg); tarea real = Opus.
CHAT_MODEL = os.environ.get("BRIDGE_CHAT_MODEL", "claude-haiku-4-5-20251001")
TASK_MODEL = os.environ.get("BRIDGE_TASK_MODEL", "claude-opus-4-8")
# palabras que huelen a LABURO → subimos a Opus. Ante la duda, escala (mejor gastar de más
# que hacer un video con el modelo chico). Override manual: prefijo "!" fuerza Opus; "h!" Haiku.
TASK_RE = re.compile(
    r"\b(video|render|renderiz\w*|clip|miniatur\w*|thumbnail|gui[oó]n|sub[ií]\w*|public\w*|"
    r"canal\w*|analiz\w*|investig\w*|research|busc\w*|edit\w*|monta\w*|voz|tts|match\w*|farm|"
    r"document\w*|t[ií]tulo\w*|seo|vidiq|competenc\w*|arm[aá]\w*|hac[eé]\w*|cre[aá]\w*|"
    r"gener\w*|escrib[ií]\w*|commit\w*|deploy\w*|bug|arregl\w*|fix)\b", re.I)


def pick_route(text):
    """Devuelve (model, track, cwd, prompt_limpio).
    charla → Haiku + dir liviano (~$0.018/msg) · tarea → Opus + ~/video2 (contexto full)."""
    t = (text or "").strip()
    if t.startswith("!"):
        return TASK_MODEL, "task", WORKDIR, t[1:].lstrip()   # fuerza tarea/Opus
    if t.lower().startswith("h!"):
        return CHAT_MODEL, "chat", CHAT_DIR, t[2:].lstrip()  # fuerza charla/Haiku
    if TASK_RE.search(t):
        return TASK_MODEL, "task", WORKDIR, t
    return CHAT_MODEL, "chat", CHAT_DIR, t

PERSONA = (
    "Le hablás al usuario por Telegram, sos su socio en la fábrica de documentales. Hablá "
    "EXACTO como habla él: español rioplatense, TODO en minúscula, directo, seco, sin vueltas. "
    "Mensajes muy cortos, como un texto real. Escribí como él: abreviaciones tipo 'q', 'pq', "
    "'xq', 'tmb', 'dsp', 'x'; no te preocupes por la puntuación ni las mayúsculas. "
    "PROHIBIDO: emojis, signos de exclamación, entusiasmo forzado, meter 'che/dale/genial/"
    "listo' a la fuerza, y markdown (nada de **, ##, ni listas con guiones — es texto plano de "
    "chat, escribí corrido). Nada de tono de asistente animado ni corporativo — eso suena a NPC y "
    "lo odia. No saludes con floritura, no cierres con '¿en qué te ayudo?' ni ofrecimientos. "
    "Respondé lo justo y nada más; si te pregunta algo, contestá y ya. Cuando hacés una tarea "
    "avisás cortito y natural ('ok arranco', 'ya va', 'listo te lo mando'). Si algo se rompió, "
    "decilo derecho, sin adornar. Ejemplos de tu registro: 'ok, lo armo y te aviso' · 'ya "
    "está subido' · 'esa toma salió con texto, la rehago' · 'dame un rato q el render tarda' · "
    "'no, eso todavia no lo tengo configurado'."
)


def _read_kv(path):
    d = {}
    if exists(path):
        for line in open(path, encoding="utf-8"):
            if "=" in line and not line.strip().startswith("#"):
                k, v = line.strip().split("=", 1)
                d[k.strip()] = v.strip()
    return d


def load_bots():
    """1 solo cerebro/poller (Productor) que habla por 2 tokens. Config en ~/.tg_bots;
    fallback al viejo ~/.telegram_bot para el Productor + chat privado."""
    c = _read_kv(expanduser("~/.tg_bots"))
    prod = c.get("PRODUCTOR_TOKEN")
    inv = c.get("INVESTIGADOR_TOKEN")
    group = c.get("GROUP_CHAT_ID")
    private = c.get("PRIVATE_CHAT_ID")
    if not prod or not private:
        old = _read_kv(expanduser("~/.telegram_bot"))
        prod = prod or old.get("TELEGRAM_BOT_TOKEN")
        private = private or old.get("TELEGRAM_CHAT_ID")
    if not prod or not private:
        sys.exit("faltan PRODUCTOR_TOKEN / PRIVATE_CHAT_ID (~/.tg_bots)")
    return prod, inv, (str(group) if group else None), str(private)


PRODUCTOR_TOKEN, INVESTIGADOR_TOKEN, GROUP_CHAT, PRIVATE_CHAT = load_bots()


def api(method, params=None, token=None, timeout=70):
    token = token or PRODUCTOR_TOKEN
    data = urllib.parse.urlencode(params or {}).encode()
    req = urllib.request.Request(f"https://api.telegram.org/bot{token}/{method}", data=data)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.load(r)
    except Exception as e:
        print(f"[api] {method} error: {e}", flush=True)
        return {"ok": False}


def load_state():
    st = {"offset": 0, "sessions": {}}
    if exists(STATE_FILE):
        try:
            st = json.load(open(STATE_FILE))
        except Exception:
            pass
    # migración: sesión plana (str) → por-track {"task": id} (el historial viejo tenía contexto full)
    for k, v in list(st.get("sessions", {}).items()):
        if isinstance(v, str):
            st["sessions"][k] = {"task": v}
    return st


def save_state(st):
    json.dump(st, open(STATE_FILE, "w"))


def send(chat, text, token=None):
    # Telegram corta en 4096; partimos por saltos de línea, texto plano (sin parse_mode
    # para no romper por markdown inválido de Claude). token = qué VOZ habla (Prod/Investigador).
    LIM = 4000
    while text:
        if len(text) <= LIM:
            chunk, text = text, ""
        else:
            cut = text.rfind("\n", 0, LIM)
            if cut < LIM // 2:
                cut = LIM
            chunk, text = text[:cut], text[cut:].lstrip("\n")
        api("sendMessage", {"chat_id": chat, "text": chunk}, token=token)


class Typing:
    """Muestra 'typing…' hasta que termine la tarea (se renueva cada 4s)."""
    def __init__(self, chat, token=None):
        self.chat = chat
        self.token = token
        self._stop = threading.Event()
        self._t = threading.Thread(target=self._run, daemon=True)

    def _run(self):
        while not self._stop.is_set():
            api("sendChatAction", {"chat_id": self.chat, "action": "typing"}, token=self.token)
            self._stop.wait(4)

    def __enter__(self):
        self._t.start(); return self

    def __exit__(self, *a):
        self._stop.set()


def ask_claude(chat, prompt, st, model, track, cwd):
    """Corre Claude en print-mode resumiendo la sesión de ESE track (chat/task). El --resume
    con prefijo estable hace pegar el prompt caching. Devuelve el texto."""
    sessmap = st["sessions"].setdefault(str(chat), {})
    sess = sessmap.get(track)
    cmd = [CLAUDE, "-p", prompt, "--model", model, "--output-format", "json",
           "--append-system-prompt", PERSONA, "--dangerously-skip-permissions"]
    if sess:
        cmd += ["--resume", sess]
    print(f"[claude] track={track} modelo={model.split('-')[1] if '-' in model else model} · msg={prompt[:60]!r}", flush=True)
    try:
        p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=TASK_TIMEOUT)
    except subprocess.TimeoutExpired:
        return "uf, eso se está haciendo largo y corté la espera. fijate el estado o pedímelo de nuevo"
    out = (p.stdout or "").strip()
    if not out:
        print(f"[claude] sin stdout · stderr: {(p.stderr or '')[:300]}", flush=True)
        return "se me trabó algo procesando eso, probá de nuevo en un toque"
    try:
        d = json.loads(out)
    except Exception:
        return out[:3500]  # por si no vino JSON, mando el texto crudo
    sid = d.get("session_id")
    if sid:
        sessmap[track] = sid
        save_state(st)
    if d.get("is_error"):
        print(f"[claude] is_error · {str(d.get('result'))[:300]}", flush=True)
    return d.get("result") or "listo"


# ══════════ COORDINACIÓN DEL GRUPO (1 poller, 2 voces) ══════════
def run_research(chan):
    """Corre el analizador REAL y devuelve el last_report.json fresco (o None)."""
    rep_path = os.path.join(WORKDIR, "analizador/last_report.json")
    try: os.remove(rep_path)
    except OSError: pass
    args = [NODE, "analizador/investigar.mjs"] + ([chan] if chan else [])
    try:
        subprocess.run(args, cwd=WORKDIR, capture_output=True, text=True, timeout=RESEARCH_TIMEOUT)
    except subprocess.TimeoutExpired:
        print("[research] timeout", flush=True)
    try:
        return json.load(open(rep_path))
    except Exception:
        return None


def do_research(chat, chan, st):
    # VOZ Investigador: ack + corre el análisis real + postea el hallazgo
    send(chat, "buscando en el nicho, dame un cachito", token=INVESTIGADOR_TOKEN)
    with Typing(chat, token=INVESTIGADOR_TOKEN):
        rep = run_research(chan)
    if not rep or not rep.get("fresh"):
        send(chat, "no pesqué nada fresco esta vez (o se me cayo el scraping). probá de nuevo en un rato", token=INVESTIGADOR_TOKEN)
        return
    top = rep["fresh"][0]
    p = top.get("propuesta") or {}
    items = " · ".join(f"{i+1}. {x}" for i, x in enumerate(p.get("items", [])))
    dup = ""
    if rep.get("dups"):
        dup = "\n\ndescarté por ya-hechos: " + ", ".join(f"{d.get('titulo_en')} (={d.get('slug')})" for d in rep["dups"][:3])
    body = (f"encontré uno que explotó:\n\n"
            f"{top.get('titulo_en')}\n{top.get('views'):,} views · {top.get('ratio')}x sus subs · hace {top.get('age')}d\n{top.get('url')}\n\n"
            f"por qué pegó: {top.get('por_que_exploto','')}\n\n"
            f"propuesta crónicas:\n- titulo: {p.get('titulo')}\n- miniatura: {p.get('miniatura')}\n- {items}"
            f"{dup}")
    send(chat, body, token=INVESTIGADOR_TOKEN)
    st["pending"] = {"titulo": p.get("titulo"), "url": top.get("url"), "titulo_en": top.get("titulo_en")}
    save_state(st)
    # VOZ Productor: responde en el grupo (secuencial, después del Investigador)
    send(chat, f"buena, ese tiene {top.get('ratio')}x. si te copa lo arranco — decime 'hacé ese' y le meto", token=PRODUCTOR_TOKEN)


def do_produce(chat, text, st):
    pend = st.get("pending")
    if not pend:
        send(chat, "no tengo tema pendiente. tirá 'próximo video' y te traigo uno", token=PRODUCTOR_TOKEN)
        return
    send(chat, f"dale, arranco con: {pend.get('titulo')}. te voy avisando por acá", token=PRODUCTOR_TOKEN)
    prompt = (f"Arrancá la producción del video de Crónicas Perdidas: '{pend.get('titulo')}' "
              f"(referencia viral: {pend.get('url')}). Seguí el pipeline del canal (guion→tts→…→render). "
              f"Avisá avances cortos.")
    with Typing(chat, token=PRODUCTOR_TOKEN):
        reply = ask_claude(chat, prompt, st, TASK_MODEL, "task", WORKDIR)
    send(chat, reply, token=PRODUCTOR_TOKEN)


def do_snowball(chat, st):
    send(chat, "tirando la bola de nieve, buscando canales nuevos del nicho", token=INVESTIGADOR_TOKEN)
    try:
        r = subprocess.run([NODE, "analizador/snowball.mjs"], cwd=WORKDIR, capture_output=True, text=True, timeout=RESEARCH_TIMEOUT)
        out = (r.stdout or "").strip().splitlines()
        tail = "\n".join(out[-6:]) if out else "no salió nada"
    except subprocess.TimeoutExpired:
        tail = "se pasó de tiempo el scraping, probá de nuevo"
    send(chat, tail, token=INVESTIGADOR_TOKEN)


def cron_toggle(chat, text, st, voice):
    if CRON_ON_RE.search(text):
        st["cron_enabled"] = True; save_state(st)
        send(chat, f"listo, cron diario ON — te traigo un tema todos los días a las {CRON_HOUR}hs", token=voice); return True
    if CRON_OFF_RE.search(text):
        st["cron_enabled"] = False; save_state(st)
        send(chat, "cron diario OFF, ya no disparo solo", token=voice); return True
    return False


def handle_group(msg, st):
    text = (msg.get("text") or msg.get("caption") or "").strip()
    chat = str(msg["chat"]["id"])
    if cron_toggle(chat, text, st, PRODUCTOR_TOKEN):
        return
    if SNOW_RE.search(text):
        do_snowball(chat, st)
    elif RESEARCH_RE.search(text):
        m = re.search(r"@[\w.-]+", text)
        do_research(chat, m.group(0) if m else None, st)
    elif PRODUCE_RE.search(text):
        do_produce(chat, text, st)
    # else: mensaje del grupo sin trigger → ignorar (no spamear)


def cron_loop(st):
    """Disparo diario opcional: a CRON_HOUR corre el research y lo postea al grupo (voz
    Investigador). Toma el WORK_LOCK → nunca corre en paralelo con un trigger manual."""
    while True:
        try:
            if st.get("cron_enabled") and GROUP_CHAT:
                now = time.localtime()
                today = time.strftime("%Y%m%d", now)
                if now.tm_hour == CRON_HOUR and st.get("cron_last") != today:
                    st["cron_last"] = today; save_state(st)
                    print("[cron] disparo diario", flush=True)
                    with WORK_LOCK:
                        do_research(GROUP_CHAT, None, st)
        except Exception as e:
            print(f"[cron] error: {e}", flush=True)
        time.sleep(180)


def handle_message(msg, st):
    chat = str(msg["chat"]["id"])
    if chat == PRIVATE_CHAT:
        text = msg.get("text") or msg.get("caption")
        if not text:
            send(chat, "por ahora te leo solo texto"); return
        if cron_toggle(chat, text, st, PRODUCTOR_TOKEN):
            return
        model, track, cwd, prompt = pick_route(text)
        with Typing(chat):
            reply = ask_claude(chat, prompt, st, model, track, cwd)
        send(chat, reply)
    elif GROUP_CHAT and chat == GROUP_CHAT:
        handle_group(msg, st)
    # else: chat no autorizado → ignorar


def handle_callback(cq, st):
    chat = str(cq["message"]["chat"]["id"])
    data = cq.get("data", "")
    api("answerCallbackQuery", {"callback_query_id": cq["id"], "text": "dale, procesando…"})
    if chat != PRIVATE_CHAT:
        return
    # Los botones ✅ Publicar / 🔄 Rehacer entran como instrucción natural a Claude.
    action = data.split(":", 1)[0]
    prompt = {
        "publicar": "Toqué el botón ✅ Publicar sobre el último documental que me mandaste. Encargate de publicarlo (o decime qué falta para poder hacerlo).",
        "rehacer": "Toqué el botón 🔄 Rehacer sobre el último documental. Rehacelo/mejoralo y volvé a mandármelo.",
    }.get(action, f"Toqué un botón ({data}).")
    with Typing(chat):
        reply = ask_claude(chat, prompt, st, TASK_MODEL, "task", WORKDIR)  # botones = acción → track tarea
    send(chat, reply)


def main():
    os.makedirs(CHAT_DIR, exist_ok=True)  # dir de contexto liviano para la charla
    st = load_state()
    # Drenar backlog viejo al arrancar (no responder mensajes de antes de prender el puente)
    drain = api("getUpdates", {"offset": -1, "timeout": 0})
    if drain.get("ok") and drain.get("result"):
        st["offset"] = drain["result"][-1]["update_id"] + 1
        save_state(st)
    threading.Thread(target=cron_loop, args=(st,), daemon=True).start()  # disparo diario opcional
    print(f"[bridge] arriba · privado={PRIVATE_CHAT} · grupo={GROUP_CHAT} · investigador={'sí' if INVESTIGADOR_TOKEN else 'no'} · cron={'ON' if st.get('cron_enabled') else 'off'}@{CRON_HOUR}h · offset {st['offset']}", flush=True)
    while True:
        try:
            upd = api("getUpdates", {"offset": st["offset"], "timeout": 50,
                                     "allowed_updates": json.dumps(["message", "callback_query"])}, timeout=70)
            if not upd.get("ok"):
                time.sleep(3); continue
            for u in upd["result"]:
                st["offset"] = u["update_id"] + 1
                save_state(st)
                try:
                    with WORK_LOCK:  # serializa con el cron → nunca 2 trabajos a la vez
                        if "message" in u:
                            handle_message(u["message"], st)
                        elif "callback_query" in u:
                            handle_callback(u["callback_query"], st)
                except Exception as e:
                    print(f"[handler] error: {e}", flush=True)
        except Exception as e:
            print(f"[loop] error: {e}", flush=True)
            time.sleep(3)


if __name__ == "__main__":
    main()
