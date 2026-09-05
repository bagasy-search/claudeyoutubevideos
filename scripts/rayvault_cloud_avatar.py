"""Cloud-only avatar normalization. Original AAC packets are preserved verbatim."""
from pathlib import Path
import json
import modal

app = modal.App("rayvault-avatar-normalize")
image = modal.Image.debian_slim(python_version="3.11").apt_install("ffmpeg")


@app.function(image=image, cpu=8, memory=4096, timeout=3600)
def normalize(source_bytes: bytes):
    import subprocess
    import tempfile

    def run(args):
        return subprocess.check_output(args, text=True)

    def probe(file):
        return json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(file)]))

    def audio_hash(file):
        return run(["ffmpeg", "-v", "error", "-i", str(file), "-map", "0:a:0", "-c:a", "copy", "-f", "hash", "-hash", "sha256", "-"]).strip()

    with tempfile.TemporaryDirectory() as task_dir:
        source = Path(task_dir) / "source.mp4"
        result = Path(task_dir) / "rayvault_avatar.mp4"
        source.write_bytes(source_bytes)
        before = probe(source)
        video = next(s for s in before["streams"] if s["codec_type"] == "video")
        assert (video["width"], video["height"], video["avg_frame_rate"]) == (1920, 1082, "25/1"), "unexpected source format"
        # No speed changes, optical interpolation, color-range squeezing, or audio recoding.
        # Source is ordinary yuv420p without color tags: retain levels and tag HD BT709/tv.
        subprocess.run([
            "ffmpeg", "-y", "-v", "warning", "-i", str(source),
            "-map", "0:v:0", "-map", "0:a:0", "-vf", "crop=1920:1080:0:0,fps=30,format=yuv420p",
            "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-threads", "8",
            "-r", "30", "-fps_mode", "cfr", "-g", "60", "-keyint_min", "60", "-sc_threshold", "0",
            "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
            "-video_track_timescale", "90000", "-c:a", "copy", "-movflags", "+faststart", str(result)
        ], check=True)
        after = probe(result)
        out_video = next(s for s in after["streams"] if s["codec_type"] == "video")
        assert (out_video["width"], out_video["height"], out_video["avg_frame_rate"]) == (1920, 1080, "30/1")
        assert abs(float(after["format"]["duration"]) - float(before["format"]["duration"])) < 0.05
        original_audio_hash, normalized_audio_hash = audio_hash(source), audio_hash(result)
        assert original_audio_hash == normalized_audio_hash, "AAC packet data changed"
        report = {"source": before, "normalized": after, "original_audio_hash": original_audio_hash,
                  "normalized_audio_hash": normalized_audio_hash, "audio_packets_unchanged": True,
                  "filter": "crop=1920:1080:0:0,fps=30,format=yuv420p", "execution": "Modal CPU8"}
        return result.read_bytes(), report


@app.local_entrypoint()
def main(source: str, output: str, backup_dir: str):
    output_path = Path(output)
    backup_path = Path(backup_dir)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    backup_path.mkdir(parents=True, exist_ok=True)
    payload, report = normalize.remote(Path(source).read_bytes())
    output_path.write_bytes(payload)
    (backup_path / "rayvault_avatar.mp4").write_bytes(payload)
    (backup_path / "avatar_normalization_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Saved normalized avatar ({len(payload)} bytes), exact original AAC preserved.")
