import json, sys
sys.path.insert(0, "D:/wt/enhc06/vlog/enhc06"); from views import V
S = "D:/wt/enhc06/src/enhc06/"
names = list(V); segs, keys = [], []
for i, n in enumerate(names):
    a = i * 4.0; segs.append({"a": a, "k": "w", "view": n, "tr": "cut"}); p, l, f = V[n]
    keys += [{"t": a, "p": p, "l": l, "fov": f}, {"t": a + 3.99, "p": p, "l": l, "fov": f}]
END = len(names) * 4.0
ev = {"door": [[22, 40]], "jamb": [[16, 24]], "pad": [[0, 1], [26, 3], [27, 5], [28, 6]], "padv": ["$18,995", "$1,500", "$2,000", "$389"],
      "ws": [{"a": 10, "b": 16, "tx": "$18,995", "car": "A"}, {"a": 54, "b": 62, "tx": "$1,500", "car": "B"}], "board": [[0, 22]], "goal": 30,
      "cal": [[0, 3]], "calhl": [[30, 40, "last3"]], "clock": [[0, 17.5]], "night": [[0, 0.3]], "appraise": [[48, 60]], "keys": [[28, 32]]}
ov = [{"k": "four", "a": 61, "b": 70, "vals": [{"at": 61.5, "v": "$18,995"}, {"at": 62, "v": "$1,500"}, {"at": 62.5, "v": "$2,000"}, {"at": 63, "v": "$389"}], "hl": 3, "hlAt": 63.5}]
END = max(END, 72)
json.dump(segs, open(S + "segs.json", "w")); json.dump(ov, open(S + "ov.json", "w")); json.dump({"keys": keys}, open(S + "cam.json", "w")); json.dump(ev, open(S + "ev.json", "w"))
json.dump({"reel": False, "reelLen": 0, "clips": [], "clipLen": {}, "end": END}, open(S + "avail.json", "w"))
print([(i * 4 + 2, n) for i, n in enumerate(names)])
