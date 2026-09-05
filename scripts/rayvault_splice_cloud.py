"""Cloud-only H.264 intro replacement. No publishing or local encoding.

Modal: python -m modal run scripts/rayvault_splice_cloud.py --cut-seconds 60 --pilot
Actions: python scripts/rayvault_splice_cloud.py --worker --head-url ... --master-url ...
The existing tail is copied, never re-encoded. Output is withheld if a check fails.
"""
import argparse
import concurrent.futures
import hashlib
import json
import re
import subprocess
import time
import urllib.request
from pathlib import Path

HEAD = 'https://github.com/bagasy-search/claudeyoutubevideos/releases/download/raymotion60/raymotion60.mp4'
TAIL = 'https://github.com/bagasy-search/claudeyoutubevideos/releases/download/rayvault/rayvault.mp4'
TAIL_SHA = 'a50c64d2a8f4c84aab40db041c0e5fa270b67e1f93c265b1e2f511f37763a2bf'


def execute(head_url, tail_url, master_url, cut_seconds, total_frames, expected_tail_sha, out_dir, pilot=False, patch_url='', patch_intervals='[]', expected_head_sha=''):
    root = Path(out_dir)
    root.mkdir(parents=True, exist_ok=True)
    timings = {}
    started = time.monotonic()

    def run(args, label):
        at = time.monotonic()
        p = subprocess.run(args, capture_output=True, text=True)
        timings[label] = round(time.monotonic() - at, 3)
        (root / (label + '.log')).write_text(p.stderr, encoding='utf-8')
        if p.returncode:
            raise RuntimeError(label + ' failed: ' + p.stderr[-2500:])
        return p.stdout

    def probe(path, extra=None):
        return json.loads(run(['ffprobe', '-v', 'error', *(extra or ['-show_streams', '-show_format']), '-of', 'json', str(path)], 'probe_' + path.stem))

    def sha(path):
        h = hashlib.sha256()
        with path.open('rb') as f:
            for b in iter(lambda: f.read(1024 * 1024), b''):
                h.update(b)
        return h.hexdigest()

    def download(pair):
        url, name = pair
        urllib.request.urlretrieve(url, root / name)

    if not pilot and not master_url:
        raise ValueError('Production requires one continuous full-duration master WAV URL')
    if abs(cut_seconds * 30 - round(cut_seconds * 30)) > 1e-7:
        raise ValueError('Cut must be on a 30fps frame boundary')
    intervals = json.loads(patch_intervals)
    cursor = cut_seconds
    for interval in intervals:
        if len(interval)!=2:
            raise ValueError('Patch intervals are [start_seconds,end_seconds) pairs')
        start,end=interval
        if start<cursor or end<=start or end>total_frames/30 or start%2 or end%2:
            raise ValueError('Patches must be ordered, disjoint, after intro and on even-second keyframes')
        cursor=end
    if intervals and not patch_url:
        raise ValueError('Patch intervals require a matching compact patchstrip URL')
    downloads = [(head_url, 'head_source.mp4'), (tail_url, 'tail_source.mp4')]
    if patch_url:
        downloads.append((patch_url,'patch_source.mp4'))
    if master_url:
        downloads.append((master_url, 'master.wav'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(download, downloads))
    timings['download'] = round(time.monotonic() - started, 3)
    head, original = root/'head_source.mp4', root/'tail_source.mp4'
    head_sha=sha(head)
    if expected_head_sha and head_sha!=expected_head_sha:
        raise ValueError('Approved intro identity mismatch: '+head_sha)
    source_sha = sha(original)
    if source_sha != expected_tail_sha:
        raise ValueError('Tail identity mismatch: ' + source_sha)
    hm, tm = probe(head), probe(original)
    hv = next(s for s in hm['streams'] if s['codec_type'] == 'video')
    tv = next(s for s in tm['streams'] if s['codec_type'] == 'video')
    contract = dict(codec_name='h264', width=1920, height=1080, pix_fmt='yuv420p', color_range='tv', color_space='bt709', color_transfer='bt709', color_primaries='bt709', avg_frame_rate='30/1', time_base='1/90000')
    for name, stream in [('head',hv),('tail',tv)]:
        for key, value in contract.items():
            if stream.get(key) != value:
                raise ValueError(f'{name} incompatible {key}: {stream.get(key)} != {value}')
    if intervals:
        pm=probe(root/'patch_source.mp4')
        pv=next(s for s in pm['streams'] if s['codec_type']=='video')
        if any(pv.get(k)!=x for k,x in contract.items()) or int(pv['nb_frames'])!=round(sum(b-a for a,b in intervals)*30):
            raise ValueError('Patchstrip stream contract or total frame count mismatch')
    if int(hv['nb_frames']) != round(cut_seconds*30) or abs(float(hv['duration'])-cut_seconds)>1e-6:
        raise ValueError('Intro duration/frame count does not match replacement cut')
    if int(tv['nb_frames']) != total_frames:
        raise ValueError('Original total frame count mismatch')
    source_packets = probe(original, ['-select_streams','v:0','-show_packets','-show_entries','packet=pts_time,dts_time,duration_time,flags'])['packets']
    cut_packet = [p for p in source_packets if abs(float(p['pts_time'])-cut_seconds)<1e-6]
    if len(cut_packet)!=1 or 'K' not in cut_packet[0]['flags']:
        raise ValueError('Tail cut is not an exact existing keyframe; requires cloud encode fallback')
    source_keys={round(float(p['pts_time'])*30) for p in source_packets if 'K' in p['flags']}
    for boundary in [x for pair in intervals for x in pair]:
        if round(boundary*30) not in source_keys:
            raise ValueError('Requested patch boundary is not an original keyframe')
    if intervals:
        pp=probe(root/'patch_source.mp4',['-select_streams','v:0','-show_packets','-show_entries','packet=pts_time,flags'])['packets']
        patch_keys={round(float(p['pts_time'])*30) for p in pp if 'K' in p['flags']}
        offset=0
        for a,b in intervals:
            if round(offset*30) not in patch_keys: raise ValueError('Patchstrip segment does not begin at a keyframe')
            offset+=b-a
    segments=[{'kind':'head','source':head,'source_start':0,'start':0,'end':cut_seconds}]
    cursor,patch_offset=cut_seconds,0
    for a,b in intervals:
        if a>cursor: segments.append({'kind':'original','source':original,'source_start':cursor,'start':cursor,'end':a})
        segments.append({'kind':'patch','source':root/'patch_source.mp4','source_start':patch_offset,'start':a,'end':b})
        cursor=b;patch_offset+=b-a
    if cursor<total_frames/30:
        segments.append({'kind':'original','source':original,'source_start':cursor,'start':cursor,'end':total_frames/30})
    lines=[]
    for i,segment in enumerate(segments):
        name=f'segment_{i:02d}.mp4';count=round((segment['end']-segment['start'])*30)
        run(['ffmpeg','-y','-v','warning','-ss',str(segment['source_start']),'-i',str(segment['source']),'-map','0:v:0','-an',
             '-c:v','copy','-frames:v',str(count),'-video_track_timescale','90000',str(root/name)],f'copy_segment_{i:02d}')
        sm=probe(root/name);sv=next(s for s in sm['streams'] if s['codec_type']=='video')
        if int(sv['nb_frames'])!=count or abs(float(sv['start_time']))>1e-6 or abs(float(sv['duration'])-count/30)>1e-5:
            raise ValueError(f'Segment{i} packet copy duration/count/start mismatch')
        lines.append(f"file '{name}'\nduration {count/30:.9f}\n")
    (root/'concat.txt').write_text(''.join(lines),encoding='utf-8')
    output = root/'rayvault-spliced.mp4'
    args=['ffmpeg','-y','-v','warning','-f','concat','-safe','0','-i',str(root/'concat.txt')]
    if master_url:
        mm=probe(root/'master.wav')
        ma=next(s for s in mm['streams'] if s['codec_type']=='audio')
        if abs(float(mm['format']['duration'])-total_frames/30)>0.1:
            raise ValueError('Master must have exact full timeline duration within100ms')
        args+=['-i',str(root/'master.wav'),'-map','0:v:0','-map','1:a:0','-c:a','aac','-b:a','192k','-ar','48000','-af','aresample=async=1:first_pts=0'+(',pan=stereo|c0=c0|c1=c0' if ma['channels']==1 else '')]
    else:
        args+=['-map','0:v:0','-an']
    # Preserve B-frame decode order; no PTS/DTS rewriting and no forced -r.
    args+=['-c:v','copy','-video_track_timescale','90000','-movflags','+faststart',str(output)]
    run(args,'assemble_copy_video_aac_master')
    print(f'Assembled {len(segments)} segments in {timings["assemble_copy_video_aac_master"]}s; checking full frame and timestamp preservation.',flush=True)
    meta=probe(output)
    v=next(s for s in meta['streams'] if s['codec_type']=='video')
    packets=probe(output,['-select_streams','v:0','-show_packets','-show_entries','packet=pts_time,dts_time,duration_time,flags'])['packets']
    pts=sorted(float(p['pts_time']) for p in packets)
    dts=[float(p['dts_time']) for p in packets]
    steps=[b-a for a,b in zip(pts,pts[1:])]
    keys=sorted(float(p['pts_time']) for p in packets if 'K' in p['flags'])
    # Hash decoded frames: validates all frames, exact tail preservation and every head frame.
    def framehash(path,label,seek=None):
        args=['ffmpeg','-v','error','-threads','4']
        if seek is not None: args+=['-ss',str(seek)]
        args+=['-i',str(path),'-map','0:v:0','-an','-f','framemd5','-']
        data=run(args,label)
        (root/(label+'.framemd5')).write_text(data,encoding='utf-8')
        return [line.split(',')[-1].strip() for line in data.splitlines() if line and not line.startswith('#')]
    def full_video_scan():
        run(['ffmpeg','-hide_banner','-nostats','-threads','4','-i',str(output),'-map','0:v:0','-an','-vf',
             'scale=480:-2,blackdetect=d=0.15:pic_th=0.98:pix_th=0.10,metadata=print:key=lavfi.black_start,metadata=print:key=lavfi.black_end,freezedetect=noise=-55dB:d=1.0',
             '-f','null','-'],'full_video_scan')
        return (root/'full_video_scan.log').read_text()
    def loudness_scan():
        run(['ffmpeg','-hide_banner','-nostats','-i',str(output),'-map','0:a:0','-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],'full_loudness_scan')
        return json.loads(re.findall(r'\{\s*"input_i"[\s\S]*?\}',(root/'full_loudness_scan.log').read_text())[-1])
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        full_f=pool.submit(framehash,output,'decoded_final')
        tail_f=pool.submit(framehash,original,'decoded_original_tail',cut_seconds)
        head_f=pool.submit(framehash,head,'decoded_head')
        patch_f=pool.submit(framehash,root/'patch_source.mp4','decoded_patch') if intervals else None
        scan_f=pool.submit(full_video_scan) if not pilot else None
        loudness_f=pool.submit(loudness_scan) if not pilot and master_url else None
        full_hashes,tail_hashes,head_hashes=full_f.result(),tail_f.result(),head_f.result()
        patch_hashes=patch_f.result() if patch_f else []
        scan_log=scan_f.result() if scan_f else ''
        loudness=loudness_f.result() if loudness_f else None
    head_count=round(cut_seconds*30)
    expected_hashes=[];segment_proofs=[]
    for segment in segments:
        count=round((segment['end']-segment['start'])*30)
        start=round(segment['source_start']*30)
        if segment['kind']=='head': expected=head_hashes[start:start+count]
        elif segment['kind']=='patch': expected=patch_hashes[start:start+count]
        else: expected=tail_hashes[start-head_count:start-head_count+count]
        actual=full_hashes[round(segment['start']*30):round(segment['end']*30)]
        segment_proofs.append({k:v for k,v in segment.items() if k!='source'} | {'frames':count,'decoded_identical':len(expected)==count and actual==expected})
        expected_hashes+=expected
    checks={'source_identity':source_sha==expected_tail_sha,'stream_contract':all(v.get(k)==x for k,x in contract.items()),
        'packet_count':len(packets)==total_frames,'decoded_frame_count':len(full_hashes)==total_frames,
        'container_frame_count':int(v['nb_frames'])==total_frames,'duration':abs(float(v['duration'])-total_frames/30)<1e-6,
        'pts_start_zero':abs(pts[0])<1e-6,'presentation_cadence_all_frames':max(abs(s-1/30) for s in steps)<1e-5,
        'dts_strictly_increasing':all(b>a for a,b in zip(dts,dts[1:])),
        'bframe_reordering':not v.get('has_b_frames') or any(p['pts_time']!=p['dts_time'] for p in packets),
        'gop_max_two_seconds':max(b-a for a,b in zip(keys,keys[1:]))<=2.00001,
        'intro_every_decoded_frame_identical':full_hashes[:head_count]==head_hashes,
        'all_preserved_tail_frames_identical':all(s['decoded_identical'] for s in segment_proofs if s['kind']=='original'),
        'all_patch_frames_identical':all(s['decoded_identical'] for s in segment_proofs if s['kind']=='patch'),
        'complete_timeline_decoded_identical_to_sources':full_hashes==expected_hashes,
        'no_decoder_errors':not (root/'decoded_final.log').read_text().strip(),
        'no_nonmonotonic_mux_warning':'non-monoton' not in (root/'assemble_copy_video_aac_master.log').read_text().lower()}
    if expected_head_sha: checks['approved_intro_identity']=head_sha==expected_head_sha
    black=[];freezes=[];pending=None
    for event,value in re.findall(r'lavfi.black_(start|end)=([\d.]+)',scan_log):
        if event=='start': pending=float(value)
        elif pending is not None:
            if float(value)-pending>=0.15: black.append({'start':pending,'end':float(value)})
            pending=None
    if pending is not None and total_frames/30-pending>=0.15: black.append({'start':pending,'end':total_frames/30})
    pending=None
    for event,value in re.findall(r'freeze_(start|end): ([\d.]+)',scan_log):
        if event=='start': pending=float(value)
        elif pending is not None:
            freezes.append({'start':pending,'end':float(value),'duration':float(value)-pending});pending=None
    if pending is not None: freezes.append({'start':pending,'end':total_frames/30,'duration':total_frames/30-pending})
    if not pilot: checks['no_black_over_150ms']=not black
    audio_report=None
    if master_url:
        import io,wave
        import numpy as np
        from scipy.signal import correlate,correlation_lags
        windows=[]
        for t in sorted(set([5,max(0,cut_seconds-4),cut_seconds+2,400,814,1200,1700])):
            signals=[]
            for src,label in [(root/'master.wav','master'),(output,'final')]:
                wav=root/f'audio_{label}_{t}.wav'
                run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(src),'-t','8','-vn','-ac','1','-ar','16000','-c:a','pcm_s16le',str(wav)],f'window_{label}_{t}')
                with wave.open(str(wav),'rb') as w: signals.append(np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(float))
            x,y=signals;n=min(len(x),len(y));x=x[:n];y=y[:n];x-=x.mean();y-=y.mean()
            cc=correlate(y,x,method='fft');lags=correlation_lags(n,n);keep=np.abs(lags)<=4000
            lag=int(lags[keep][np.argmax(cc[keep])]);xx=x[:n-lag] if lag>=0 else x[-lag:];yy=y[lag:] if lag>=0 else y[:n+lag]
            coeff=float(np.dot(xx,yy)/np.sqrt(np.dot(xx,xx)*np.dot(yy,yy)))
            windows.append(dict(t=t,lag_ms=lag/16,correlation=coeff))
        audio_report=windows
        checks['continuous_audio_alignment']=all(abs(w['lag_ms'])<=40 and w['correlation']>=0.97 for w in windows)
        checks['no_audio_drift']=max(w['lag_ms'] for w in windows)-min(w['lag_ms'] for w in windows)<=40
        audio_stream=next(s for s in meta['streams'] if s['codec_type']=='audio')
        checks['audio_duration']=abs(float(audio_stream['duration'])-total_frames/30)<=0.05
    report={'pass':all(checks.values()),'pilot':pilot,'audio_audited':bool(master_url),'source_urls':{'head':head_url,'tail':tail_url,'master':master_url},
        'source_tail_sha256':source_sha,'source_head_sha256':head_sha,'source_patch_sha256':sha(root/'patch_source.mp4') if intervals else None,
        'source_master_sha256':sha(root/'master.wav') if master_url else None,'output_sha256':sha(output),'output_bytes':output.stat().st_size,'cut_seconds':cut_seconds,'total_frames':total_frames,'patch_intervals':intervals,'segment_proofs':segment_proofs,
        'black_intervals':black,'freeze_intervals':freezes,'freeze_note':'Low-motion detections require timeline/visual review and are not automatically playback failures.','loudness_measurement':loudness,
        'checks':checks,'audio_windows':audio_report,'metadata':meta,'head_stream':hv,'tail_stream':tv,'max_pts_step_error':max(abs(s-1/30) for s in steps),
        'seam_packet_pts_dts':[p for p in packets if abs(float(p['pts_time'])-cut_seconds)<0.15],'timings_seconds':timings,'elapsed_seconds':round(time.monotonic()-started,3),
        'method':'Video packet copy, continuous WAV encoded to AAC only; complete decoded frame equality against intro and original tail.'}
    (root/'splice_report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print('Splice gates: '+json.dumps(checks),flush=True)
    if not report['pass']: raise RuntimeError('Splice quality failed: '+str([k for k,v in checks.items() if not v]))
    return report


if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--worker',action='store_true',required=True)
    parser.add_argument('--head-url',default=HEAD);parser.add_argument('--tail-url',default=TAIL)
    parser.add_argument('--master-url',default='');parser.add_argument('--cut-seconds',type=float,default=78)
    parser.add_argument('--total-frames',type=int,default=52404);parser.add_argument('--expected-tail-sha',default=TAIL_SHA)
    parser.add_argument('--out-dir',default='splice-output');parser.add_argument('--pilot',action='store_true')
    parser.add_argument('--patch-url',default='');parser.add_argument('--patch-intervals',default='[]')
    parser.add_argument('--expected-head-sha',default='')
    args=vars(parser.parse_args());args.pop('worker')
    print(json.dumps(execute(**args),indent=2))
else:
    import modal
    app=modal.App('rayvault-splice-proof')
    image=modal.Image.debian_slim(python_version='3.11').apt_install('ffmpeg').pip_install('numpy','scipy')
    volume=modal.Volume.from_name('rayvault-splice-evidence',create_if_missing=True)

    @app.function(image=image,cpu=12,memory=16384,timeout=3600,volumes={'/evidence':volume})
    def cloud(head_url,tail_url,master_url,cut_seconds,total_frames,expected_tail_sha,pilot,run_name,patch_url,patch_intervals,expected_head_sha):
        try:
            if patch_url == 'pilot-from-original':
                if not pilot:
                    raise ValueError('Synthetic patchstrip is limited to pilot mode')
                synth=Path('/evidence')/(run_name+'_synthetic')
                synth.mkdir(parents=True,exist_ok=True)
                cached=Path('/evidence/pilot60/tail_source.mp4')
                if not cached.exists():
                    cached=synth/'original.mp4'
                    urllib.request.urlretrieve(tail_url,cached)
                entries=[]
                for i,(a,b) in enumerate(json.loads(patch_intervals)):
                    dest=synth/f'patch_{i}.mp4'
                    subprocess.run(['ffmpeg','-y','-v','error','-ss',str(a),'-i',str(cached),'-map','0:v:0','-an','-c:v','copy',
                                    '-frames:v',str(round((b-a)*30)),'-video_track_timescale','90000',str(dest)],check=True)
                    entries.append(f"file '{dest.name}'\nduration {b-a:.9f}\n")
                (synth/'list.txt').write_text(''.join(entries),encoding='utf-8')
                compact=synth/'patchstrip.mp4'
                subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(synth/'list.txt'),'-map','0:v:0','-an','-c:v','copy','-video_track_timescale','90000',str(compact)],check=True)
                patch_url=compact.as_uri()
                tail_url=cached.as_uri()
            return execute(head_url,tail_url,master_url,cut_seconds,total_frames,expected_tail_sha,'/evidence/'+run_name,pilot,patch_url,patch_intervals,expected_head_sha)
        finally:
            volume.commit()

    @app.local_entrypoint()
    def main(head_url:str=HEAD,tail_url:str=TAIL,master_url:str='',cut_seconds:float=78,total_frames:int=52404,expected_tail_sha:str=TAIL_SHA,pilot:bool=False,run_name:str='pilot60',patch_url:str='',patch_intervals:str='[]',expected_head_sha:str=''):
        report=cloud.remote(head_url,tail_url,master_url,cut_seconds,total_frames,expected_tail_sha,pilot,run_name,patch_url,patch_intervals,expected_head_sha)
        target=Path('C:/Users/bauti/Downloads/video2/_v3/rayvault/splice')
        target.mkdir(parents=True,exist_ok=True)
        (target/(run_name+'_report.json')).write_text(json.dumps(report,indent=2),encoding='utf-8')
        print(json.dumps({'pass':report['pass'],'checks':report['checks'],'seconds':report['elapsed_seconds'],'sha256':report['output_sha256'],'cloud_output':'rayvault-splice-evidence/'+run_name+'/rayvault-spliced.mp4'},indent=2))
