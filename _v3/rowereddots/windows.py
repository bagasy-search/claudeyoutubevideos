# cog_windows.py — castorglove: (1) alinea el guion contra el ASR (difflib global) → wordms,
# (2) ventanas del avatar por frase, (3) reel de audio CONTINUO (sin silencios) para RunPod.
import json, re, difflib, subprocess, wave, os

ROOT = "D:/Proyectos/video2-wt/rowereddots"
os.chdir(ROOT)
SLUG = "rowereddots"
WAV = "public/rowereddots.wav"
norm1 = lambda s: re.sub(r"[^a-z0-9']", "", s.lower().replace("’", "'"))

C = json.load(open(f"public/captions_{SLUG}.json", encoding="utf-8"))
words = sorted([{"word": c["text"].strip(), "start": c["startMs"]/1000, "end": c["endMs"]/1000} for c in C], key=lambda w: w["start"])
print(f"ASR: {len(words)} palabras")

script = open("_v3/rowereddots/guion_rowereddots.txt", encoding="utf-8").read()
toks = [(m.group(0), m.start()) for m in re.finditer(r"\S+", script)]
S = [norm1(t) for t, _ in toks]
keep = [i for i, s in enumerate(S) if s]
S2 = [S[i] for i in keep]
Wn = [norm1(w["word"]) for w in words]
sm = difflib.SequenceMatcher(None, S2, Wn, autojunk=False)
st = [None] * len(S2); en = [None] * len(S2)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            st[i1 + k] = words[j1 + k]["start"]; en[i1 + k] = words[j1 + k]["end"]
    elif tag == "replace" and j2 > j1:
        a, b = words[j1]["start"], words[j2 - 1]["end"]
        for k in range(i2 - i1):
            st[i1 + k] = a + (b - a) * k / max(1, i2 - i1); en[i1 + k] = a + (b - a) * (k + 1) / max(1, i2 - i1)
# huecos 'delete' (el ASR se comió palabras que SÍ están en el audio): interpolar entre vecinos
i = 0
while i < len(st):
    if st[i] is None:
        j = i
        while j < len(st) and st[j] is None: j += 1
        a = en[i - 1] if i > 0 and en[i - 1] is not None else 0.0
        b = st[j] if j < len(st) else a
        n = j - i
        for k in range(n):
            st[i + k] = a + (b - a) * k / n; en[i + k] = a + (b - a) * (k + 1) / n
        print(f"  interpolado hueco de {n} palabras {a:.2f}-{b:.2f}s")
        i = j
    else: i += 1
for arr in (st, en):
    last = 0.0
    for i in range(len(arr)):
        if arr[i] is None: arr[i] = last
        arr[i] = max(arr[i], last); last = arr[i]
exact = sum(i2 - i1 for tag, i1, i2, _, _ in sm.get_opcodes() if tag == "equal")
print(f"anclaje exacto: {100 * exact / len(S2):.1f}% de {len(S2)} palabras")
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag in ("delete", "replace") and (i2 - i1) >= 12:
        print(f"  ⚠ tramo {tag} de {i2 - i1} palabras (asr {j2 - j1}) @ {st[i1]:.1f}s: {' '.join(toks[keep[i]][0] for i in range(i1, min(i2, i1 + 10)))}…")
json.dump([{"w": toks[keep[i]][0], "c": toks[keep[i]][1], "s": round(st[i], 3), "e": round(en[i], 3)} for i in range(len(S2))],
          open(f"_v3/rowereddots/{SLUG}_wordms.json", "w", encoding="utf-8"))

charpos = [toks[keep[i]][1] for i in range(len(S2))]
def find_word(phrase, after_char=0, end=False):
    p = script.find(phrase, after_char)
    if p < 0: raise SystemExit(f"FRASE NO ENCONTRADA: {phrase!r}")
    target = p + (len(phrase) - 1 if end else 0)
    idx = max(i for i in range(len(charpos)) if charpos[i] <= target)
    return idx, p

WIN = [
    ("Those tiny bright red dots on your chest", "call your doctor today, not next month."),
    ("I'm Dr. Emmett Rowe", "What is wrong with my blood?"),
    ("So today I want to take that worry away", "one that needs a doctor."),
    ("That's all it is.", "in the wrong place."),
    ("So if you have them, you are in very good company.", "very good company."),
    ("Here is one little test I show my patients.", "against the spot."),
    ("So why do they appear?", "there is a good chance you will too."),
    ("And I want to clear up three myths", "I hear them all the time."),
    ("So please don't spend your money", "keep your wallet in your pocket."),
    ("So if they're harmless, why am I making a whole video about them?", "Because of the lookalikes."),
    ("So my rule is simple.", "call your doctor that same day."),
    ("That's not a cherry angioma.", "asking for help."),
    ("Let me paint you a picture", "retired school librarian."),
    ("The difference was not that Ruth knew medicine.", "Ruth knew her own skin."),
    ("So here are the warning signs.", "grows quickly over weeks."),
    ("Dermatologists call that the ugly duckling sign", "most useful rules you can learn."),
    ("That brings me to the thing I really want to warn you about.", "What people do at home."),
    ("Please don't. You are cutting", "so it bleeds."),
    ("So what if they bother you?", "a perfectly good reason to ask."),
    ("No needles, no blood test, no drama.", "a lot easier."),
    ("So let's put this into a simple routine.", "a simple routine."),
    ("And here's the trick that makes this work.", "Take photos."),
    ("Let me leave you with the big picture.", "been around for a while."),
    ("And please remember, this video is for education.", "look at your skin."),
    ("If this helped you", "see you in the next video."),
]
wins, cur = [], 0
DUR = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", WAV], text=True).strip())
for a, b in WIN:
    i0, p0 = find_word(a, cur)
    i1, p1 = find_word(b, p0, end=True)
    cur = p1 + len(b)
    s = max(0.0, st[i0] - 0.20)
    e = min(DUR, en[i1] + 0.35)
    if i1 + 1 < len(st): e = min(e, max(en[i1] + 0.05, st[i1 + 1] - 0.05))
    wins.append({"a": a, "start": round(s, 3), "end": round(e, 3), "dur": round(e - s, 3)})
tot = sum(w["dur"] for w in wins)
print(f"{len(wins)} ventanas · {tot:.1f}s de avatar ({100 * tot / DUR:.1f}% de {DUR:.1f}s)")
if tot > 595: raise SystemExit("⛔ visible > 595 s: partir en 2 reels balanceados (cap de RunPod)")
for k, w in enumerate(wins): print(f"  w{k:02d} {w['start']:8.2f}-{w['end']:8.2f} ({w['dur']:5.2f}s) {w['a'][:44]}")

off = 0.0
os.makedirs("_v3/rowereddots/reel", exist_ok=True)
lst = open("_v3/rowereddots/reel/concat.txt", "w")
for k, w in enumerate(wins):
    f = f"_v3/rowereddots/reel/w{k:02d}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(w["start"]), "-t", str(w["dur"]), "-i", WAV, "-ac", "1", "-ar", "44100", "-c:a", "pcm_s16le", f], check=True)
    real = wave.open(f).getnframes() / 44100
    w["reel_start"] = round(off, 3); w["reel_dur"] = round(real, 3)
    lst.write(f"file 'w{k:02d}.wav'\n")
    off += real
lst.close()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "_v3/rowereddots/reel/concat.txt", "-c:a", "pcm_s16le", "_v3/rowereddots/reel/rowereddots_reel.wav"], check=True)
json.dump({"gap": 0, "reel_dur": round(off, 3), "windows": wins}, open("_v3/rowereddots/windows.json", "w", encoding="utf-8"), indent=1)
print(f"reel: _v3/rowereddots/reel/rowereddots_reel.wav  {off:.1f}s")
