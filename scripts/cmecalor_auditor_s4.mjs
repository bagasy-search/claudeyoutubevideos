// Deterministic pre-render §4 audit for cmecalor.
// It validates literal timing, approved asset provenance, avatar fallback, CTA layering,
// and the FARM transport contract without rendering a frame locally.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const SLUG = 'cmecalor';
const FPS = 30;
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const exists = (file) => fs.existsSync(file) && fs.statSync(file).size > 0;
const round = (value, digits = 3) => Number(value.toFixed(digits));
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const probeDuration = (file) => Number(execFileSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nk=1:nw=1', file,
], {encoding: 'utf8'}).trim());
const unionSeconds = (intervals) => {
  const ordered = intervals.map(([a, b]) => [a, b]).sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const current of ordered) {
    const last = merged.at(-1);
    if (!last || current[0] > last[1]) merged.push([...current]);
    else last[1] = Math.max(last[1], current[1]);
  }
  return merged.reduce((sum, [a, b]) => sum + b - a, 0);
};

const momentsDoc = readJson(`_v3/${SLUG}_moments_ms.json`);
const manifest = readJson(`_v3/${SLUG}_asset_manifest.json`);
const beatsheet = readJson(`beatsheet/${SLUG}.json`);
const transcriptAudit = readJson(`work/${SLUG}/transcript_audit.json`);
const audioAudit = readJson(`work/${SLUG}/audio_master_audit.json`);
const anchorAudit = readJson(`work/${SLUG}/anchor_report.json`);
const metadata = readJson(`public/${SLUG}_meta.json`);
const mainSource = fs.readFileSync(`src/${SLUG}/Main_${SLUG}.tsx`, 'utf8');
const entrySource = fs.readFileSync(`src/index_${SLUG}.tsx`, 'utf8');
const farmSource = fs.readFileSync('scripts/farm.mjs', 'utf8');
const workflowSource = fs.readFileSync('.github/workflows/render.yml', 'utf8');
const assetList = fs.readFileSync(`_${SLUG}_assets.txt`, 'utf8').split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

const moments = new Map(momentsDoc.moments.map((moment) => [moment.id, moment]));
const approved = new Set(manifest.assets.flatMap((asset) => [asset.file, asset.blur].filter(Boolean).map((x) => x.replace(/^public\//, ''))));
const beats = beatsheet.beats;
const errors = [];
const warnings = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(beatsheet.timingSource === momentsDoc.timing_source, 'Beatsheet timing source differs from anchored moments.');
assert(Array.isArray(anchorAudit.missing) && anchorAudit.missing.length === 0, `Anchor report has ${anchorAudit.missing?.length ?? 'unknown'} missing moments.`);
assert(String(transcriptAudit.verdict).toLowerCase() === 'pass', `Transcript audit is ${transcriptAudit.verdict}.`);
assert(String(audioAudit.status).toLowerCase() === 'pass', `Audio master audit is ${audioAudit.status}.`);
assert(manifest.counts.blocking_errors === 0, `Asset manifest has ${manifest.counts.blocking_errors} blocking errors.`);

for (const beat of beats) {
  const moment = moments.get(beat.sourceMoment);
  assert(Boolean(moment), `${beat.id}: source moment not found.`);
  if (!moment) continue;
  assert(Boolean(beat.anchor?.trim()), `${beat.id}: missing literal anchor.`);
  assert(Array.isArray(beat.nouns) && beat.nouns.length > 0, `${beat.id}: missing phrase nouns.`);
  assert(approved.has(beat.src), `${beat.id}: ${beat.src} is not in the approved manifest.`);
  const expectedStart = round(moment.start_ms / 1000);
  if (moment.manual_assets?.length) {
    assert(beat.kind === 'float', `${beat.id}: CTA/guide asset must be a floating insert over Claudio.`);
    assert(moment.manual_assets.includes(beat.src), `${beat.id}: CTA asset is not assigned to its own phrase.`);
    const beatEnd = beat.start + beat.dur;
    assert(beat.start >= expectedStart - 1 / FPS && beatEnd <= moment.end_ms / 1000 + 1 / FPS,
      `${beat.id}: floating CTA falls outside its spoken phrase.`);
  } else {
    assert(Math.abs(beat.start - expectedStart) <= 1 / FPS + 0.001,
      `${beat.id}: start ${beat.start}s differs from anchored ${expectedStart}s.`);
    const allowed = [moment.still, moment.clip].filter(Boolean);
    assert(allowed.includes(beat.src), `${beat.id}: uses a neighboring asset instead of its own phrase asset.`);
  }
}

for (let index = 1; index < beats.length; index += 1) {
  assert(beats[index].src !== beats[index - 1].src, `${beats[index].id}: repeats the immediately previous asset.`);
}

const cueSources = new Set(beats.map((beat) => beat.src));
for (const rejected of manifest.rejected_excluded) {
  if (rejected.file) assert(!cueSources.has(rejected.file.replace(/^public\//, '')), `Rejected asset entered timeline: ${rejected.file}`);
}

const clips = beats.filter((beat) => beat.src.endsWith('.mp4'));
for (const clip of clips) {
  const realDuration = probeDuration(path.join('public', clip.src));
  assert(clip.dur <= realDuration + 1 / FPS, `${clip.id}: timeline duration exceeds real clip duration.`);
  const floor = beats.find((beat) => beat.sourceMoment === clip.sourceMoment && !beat.src.endsWith('.mp4'));
  assert(Boolean(floor) && floor.start === clip.start && floor.dur >= clip.dur,
    `${clip.id}: approved still floor is missing beneath the native-speed clip.`);
}

assert(!/<(?:Subtitle|Caption|Captions|Karaoke)\b/i.test(mainSource), 'Subtitle/caption component found in composition.');
assert(!/captions_cmecalor\.json/i.test(mainSource), 'Hidden timing captions are referenced as visible media.');
assert(mainSource.includes('<AvatarFloor />'), 'Persistent full-frame avatar floor is missing.');
assert(mainSource.includes('muted'), 'Avatar video is not muted.');
assert((mainSource.match(/<Audio\b/g) || []).length === 1 && mainSource.includes('cmecalor_fish.wav'),
  'Composition must contain exactly one Audio element using the extracted master WAV.');
assert(mainSource.includes('FloatingInsert'), 'Real kit FloatingInsert component is missing for CTA assets.');
assert(mainSource.includes('playbackRate={1}'), 'Approved Agnes clips are not explicitly rendered at native speed.');
assert(entrySource.includes('id="Cmecalor"') && entrySource.includes('fps={30}'), 'Isolated Cmecalor composition entry is invalid.');

const listSet = new Set(assetList);
for (const required of ['avatar_cmecalor.mp4', 'cmecalor_fish.wav', ...cueSources]) {
  assert(listSet.has(required), `Explicit FARM asset list is missing ${required}.`);
}
for (const item of assetList) assert(exists(path.join('public', item)), `Missing/empty FARM asset: public/${item}`);

const audioDuration = probeDuration('public/cmecalor_fish.wav');
const avatarDuration = probeDuration('public/avatar_cmecalor.mp4');
const compositionDuration = beatsheet.totalFrames / FPS;
assert(compositionDuration >= audioDuration, 'Composition ends before the master audio.');
assert(compositionDuration - audioDuration <= 1 / FPS + 0.001, 'Composition has more than one frame of tail beyond master audio.');
assert(avatarDuration + 2 / FPS >= audioDuration, 'Avatar floor ends materially before the master audio.');

assert(farmSource.includes('FARM_DEREFERENCE_LINKS') && farmSource.includes('releaseFiles = [...uploadFiles, wav]'),
  'FARM transport does not materialize Windows links and publish the exact master WAV.');
assert(workflowSource.includes('setpts=N/30/TB') && workflowSource.includes('gh release download "assets-$SLUG"') && workflowSource.includes('-frames:v "${{ github.event.inputs.total_frames }}"'),
  'FARM stitch workflow is not using exact CFR frames plus the continuous master WAV.');
assert(metadata.title === 'Mantén a tu Familia con Calor en un Apagón con esta Pieza de $7', 'Final YouTube title differs from requested title.');
assert(typeof metadata.description === 'string' && metadata.description.includes('https://claudiomendoza.vercel.app/'), 'Description is missing the guide funnel link.');
assert(exists('public/cmecalor_thumbnail.png'), 'Final thumbnail is missing.');

const intervals = beats.map((beat) => [beat.start, beat.start + beat.dur]);
const covered = unionSeconds(intervals);
const visualDurations = beats.map((beat) => beat.dur);
const metrics = {
  duration_seconds: round(compositionDuration),
  duration_minutes: round(compositionDuration / 60),
  visual_cues: beats.length,
  unique_visual_assets: cueSources.size,
  approved_manifest_assets: manifest.counts.approved_assets,
  rejected_assets_excluded: manifest.counts.rejected_excluded,
  clips: clips.length,
  still_cues: beats.filter((beat) => beat.kind === 'raw' && !beat.src.endsWith('.mp4')).length,
  floating_cta_cues: beats.filter((beat) => beat.kind === 'float').length,
  visual_moments_per_minute: round(beats.length / (compositionDuration / 60)),
  median_visual_duration_seconds: round(median(visualDurations)),
  share_visuals_at_least_3_seconds: round(visualDurations.filter((x) => x >= 3).length / visualDurations.length),
  share_visuals_at_least_5_seconds: round(visualDurations.filter((x) => x >= 5).length / visualDurations.length),
  exact_visual_coverage_seconds: round(covered),
  exact_visual_coverage_share: round(covered / compositionDuration),
  avatar_fallback_share: round(1 - covered / compositionDuration),
  first_visual_second: round(Math.min(...beats.map((beat) => beat.start))),
  word_error_rate: transcriptAudit.word_error_rate,
  missing_anchors: anchorAudit.missing.length,
  intentional_overlap_groups: anchorAudit.overlaps.length + clips.length,
};

if (metrics.visual_moments_per_minute < 6.5) {
  warnings.push('Visual density is below the generic long-form target because the creator explicitly requires Claudio fallback whenever no literal phrase-level asset exists; rejected or thematic filler is forbidden and Stage 2 forbids regenerating approved Stage 1.5 media.');
}
if (metrics.avatar_fallback_share > 0.38) {
  warnings.push('Avatar fallback exceeds the generic mix target for the same explicit exact-context rule; this is an intentional editorial exception, not missing media leakage.');
}

const contentReport = {
  slug: SLUG,
  gate: '§4 AUDITOR — contenido antes del FARM',
  status: errors.length ? 'FAIL' : 'PASS',
  basis: 'Literal phrase-level anchors from the real avatar WAV; only independently approved assets; avatar on every uncovered interval.',
  metrics,
  documented_exceptions: warnings,
  checks: {
    literal_phrase_start: errors.every((x) => !x.includes('start ')),
    own_phrase_asset_only: errors.every((x) => !x.includes('neighboring asset')),
    approved_assets_only: errors.every((x) => !x.includes('approved manifest')),
    rejected_assets_absent: errors.every((x) => !x.includes('Rejected asset')),
    exact_avatar_fallback: mainSource.includes('<AvatarFloor />'),
    no_subtitles: !/<(?:Subtitle|Caption|Captions|Karaoke)\b/i.test(mainSource),
    cta_floats_over_avatar_only_while_spoken: errors.every((x) => !x.includes('CTA') && !x.includes('floating CTA')),
    native_speed_clip_with_still_floor: mainSource.includes('playbackRate={1}') && errors.every((x) => !x.includes('clip duration') && !x.includes('still floor')),
  },
  errors,
};

const technicalReport = {
  slug: SLUG,
  gate: '§4 AUDITOR — técnico antes del FARM',
  status: errors.length ? 'FAIL' : 'PASS',
  composition: {id: 'Cmecalor', fps: FPS, total_frames: beatsheet.totalFrames, duration_seconds: round(compositionDuration)},
  media: {audio_master_seconds: round(audioDuration, 6), avatar_seconds: round(avatarDuration, 6)},
  checks: {
    isolated_entry: entrySource.includes('id="Cmecalor"'),
    complete_explicit_asset_list: errors.every((x) => !x.includes('FARM asset')),
    all_assets_nonempty: errors.every((x) => !x.includes('Missing/empty')),
    master_wav_is_only_audio: (mainSource.match(/<Audio\b/g) || []).length === 1 && mainSource.includes('cmecalor_fish.wav'),
    exact_duration_gate: compositionDuration >= audioDuration && compositionDuration - audioDuration <= 1 / FPS + 0.001,
    farm_only_render: true,
    windows_links_materialized_for_farm: farmSource.includes('FARM_DEREFERENCE_LINKS'),
    continuous_wav_uploaded_for_stitch: farmSource.includes('releaseFiles = [...uploadFiles, wav]'),
    cfr_stitch_and_hard_release_checks: workflowSource.includes('setpts=N/30/TB') && !workflowSource.includes('name: chequeo tecnico del MP4\n        continue-on-error: true'),
    metadata_and_thumbnail_present: exists('public/cmecalor_meta.json') && exists('public/cmecalor_thumbnail.png'),
    post_render_frame_audit_required: true,
  },
  post_render_required: [
    'FARM log must prove 30/1 CFR, 44,818 decoded frames, audio stream, duration within one second, and published release asset.',
    'Extract representative frames from the FARM MP4 with ffmpeg and inspect hook, transitions, CTA/QR, second half, and ending before Bagasy delivery.',
    'Decode the QR from the rendered CTA frame, not merely from the PNG.',
  ],
  errors,
};

fs.mkdirSync(`work/${SLUG}`, {recursive: true});
fs.writeFileSync(`work/${SLUG}/auditor_s4_content.json`, `${JSON.stringify(contentReport, null, 2)}\n`);
fs.writeFileSync(`work/${SLUG}/auditor_s4_technical.json`, `${JSON.stringify(technicalReport, null, 2)}\n`);
console.log(JSON.stringify({status: errors.length ? 'FAIL' : 'PASS', metrics, warnings, errors}, null, 2));
if (errors.length) process.exit(1);
