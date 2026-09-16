import shutil
g = "D:/Proyectos/video2-wt/rowereddots/_v3/rowereddots/gen.mjs"
shutil.copy(g, g.replace("gen.mjs", "gen_v1.mjs"))
s = open(g, encoding="utf-8").read()
a = s.index("// ── componentes ──"); b = s.index("// ── COMPUERTAS ──")
s = s[:a] + open("D:/Proyectos/video2-wt/rowereddots/_v3/rowereddots/comps_v2.txt", encoding="utf-8").read() + "\n" + s[b:]
rep = [
    ("const need = new Set([`${SLUG}.m4a`, `${SLUG}_avatar.mp4`]);", "const need = new Set([`${SLUG}.m4a`, `${SLUG}_avatar.mp4`, ...SFX.map((x) => x.src)]);"),
    ("if (/^(img|broll|med)\\//.test(v)) need.add(v);", "if (/^(img|broll|med|sfx)\\//.test(v)) need.add(v);"),
    ("  `export const COMPS: any[] = ${JSON.stringify(COMPS)};\\n`);", "  `export const COMPS: any[] = ${JSON.stringify(COMPS)};\\n` +\n  `export const SFX: any[] = ${JSON.stringify(SFX)};\\n`);"),
    ("say(Object.keys(kinds).length >= 6,", "say(tardeN === 0, `tiempos internos dentro de su componente (fuera: ${tardeN})`);\nsay(COMPS.length >= 40 && Object.keys(kinds).length >= 15,"),
    ("  const w = inWin(m.t);", "  const w = inWin(m.t);\n  // v2: el avatar se ve MAS (25-30 %): en ventanas < 9 s no entra b-roll; en las largas, sólo después de 2,5 s y corto\n  if (w && (w.end - w.start < 9 || m.t - w.start < 2.5)) continue;"),
    ("const CAP_OUT = 10.5, CAP_IN = [3.6, 5.4, 4.0, 6.2, 4.6];", "const CAP_OUT = 10.5, CAP_IN = [3.0, 3.6, 3.2, 4.0];"),
]
for x, y in rep:
    assert x in s, x[:60]
    s = s.replace(x, y, 1)
open(g, "w", encoding="utf-8").write(s)
print("ok")
