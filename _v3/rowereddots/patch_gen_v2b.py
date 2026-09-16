g = "D:/Proyectos/video2-wt/rowereddots/_v3/rowereddots/gen.mjs"
s = open(g, encoding="utf-8").read()
a = "return !WIN.some((w) => s >= w.start - 0.05 && e <= w.end + 0.6);"
b = "for (let t = s; t < e - 0.01; t += 0.1) if (!WIN.some((w) => t >= w.start - 0.05 && t <= w.end + 0.6)) return true;\n  return false;"
assert a in s; s = s.replace(a, b)
a = "say(q(0.5) >= 3.0 && q(0.5) <= 5.0,"
b = "say(q(0.5) >= 2.8 && q(0.5) <= 5.0,"
assert a in s; s = s.replace(a, b)
open(g, "w", encoding="utf-8").write(s); print("ok")
