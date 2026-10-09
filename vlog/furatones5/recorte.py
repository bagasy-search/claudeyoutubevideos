# all/vlog.mp4 (armado, = tiempos del máster) → public/vid/furatones5/vlog.mp4 SIN las pausas de cortes.json (imagen y audio a la vez, labios en
# sync; 30 fps CFR) + timeline_all.json re-mapeado (start/dur/vstart/vdur en tiempos recortados). mapear(t) lo usan mkov/mix5.
import json, subprocess, os
R = "D:/Proyectos/video2-wt/furatones5/"; D = R + "vlog/furatones5/"
C = json.load(open(D + "cortes.json"))
def mapear(t):
    q = 0.0
    for a, b in C:
        if t >= b: q += b - a
        elif t > a: q += t - a
    return t - q
if __name__ == "__main__":
    src = D + "all/vlog.mp4"; T = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], capture_output=True, text=True).stdout)
    keep, t = [], 0.0
    for a, b in C: keep.append((t, a)); t = b
    keep.append((t, T))
    sel = "+".join(f"between(t,{a:.4f},{b - 0.0001:.4f})" for a, b in keep)
    open(D + "_sel.txt", "w").write(f"select='{sel}',setpts=N/(30*TB)")
    os.makedirs(R + "public/vid/furatones5", exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-an", "-/vf", D + "_sel.txt", "-fps_mode", "passthrough", "-r", "30", "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-bf", "0",
                    "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", R + "public/vid/furatones5/vlog.mp4"], check=True)
    tl = json.load(open(D + "all/timeline_vlog.json", encoding="utf8"))
    for c in tl:
        s, e = mapear(c["start"]), mapear(c["start"] + c["dur"]); c["start"], c["dur"] = round(s, 4), round(e - s, 4)
        vs, ve = mapear(c["vstart"]), mapear(c["vstart"] + c["vdur"]); c["vstart"], c["vdur"] = round(vs, 4), round(ve - vs, 4)
    json.dump(tl, open(D + "timeline_all.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
    nf = int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", R + "public/vid/furatones5/vlog.mp4"], capture_output=True, text=True).stdout)
    print("vlog recortado:", nf, "cuadros =", round(nf / 30, 2), "s · voz recortada", round(mapear(T), 2), "s")
